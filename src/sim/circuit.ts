import {
  AMBIENT,
  BURNS_OUT_INTO_OF,
  CAPACITOR_OF,
  CAP_ZERO,
  COIL_OF,
  DIODE_OF,
  EMF_OF,
  EMPTY,
  FILAMENT_OF,
  GATE_OF,
  GATE_PLATE,
  GATE_SWITCH,
  GATE_THERMOSTAT,
  HYDROGEN,
  INV_CAP_OF,
  LIT_RGB_OF,
  MAGNETIC_OF,
  MAX_AMPS_OF,
  MOTOR_OF,
  OHMS_OF,
  ORIENTED_OF,
  OXYGEN,
  PHASE_OF,
  PH_ENERGY,
  PH_GAS,
  PH_LIQUID,
  PH_POWDER,
  SALT,
  SMOKE,
  SOLVENT_OF,
} from './elements';
import { CHUNK_SHIFT, type World } from './world';

/*
 * Circuits. Units are volts, ohms and amps; one frame is 1/60 s.
 *
 * Every conductor cell is a node, joined to the conductors beside it by its
 * resistance (half of each cell's). A battery cell is a voltage source: it
 * pushes current from its left side to its right side, so its - end is on
 * the left and its + end on the right, and cells side by side add up like
 * cells in series. Current flows only round a closed loop back to a source.
 *
 * Each frame, a search from every source finds the live networks, then a
 * preconditioned conjugate-gradient solve finds each node's potential
 * (Kirchhoff's current law at every node), one network at a time, so a
 * hard one (a salt sea) never holds up a small one. It starts from the potentials
 * kept in `world.volt`, so a running circuit needs only a few steps. A
 * small network gets enough steps to settle at once; a big one may take a
 * few frames, and until the solve has settled its currents act on nothing
 * (half-solved currents are not real and would flash a bulb in a broken
 * loop). Everything it reads is world state, so a rewound or replayed run
 * solves identically.
 *
 * Then the currents act: every cell heats by I²R (a short circuit melts
 * wire), filaments glow, LEDs and neon light up, batteries run down,
 * capacitors charge, motors turn, electromagnets pull iron, and current
 * through salty water splits it into hydrogen and oxygen.
 */

/** Most nodes one frame solves; past this a huge network (a salt sea) is cut short. */
const MAX_NODES = 1 << 16;
/** Networks solved and judged one by one; past this many, the rest are judged together. */
const MAX_COMPONENTS = 4096;
/** Solver steps per frame: enough for a network of WORK / steps nodes, within these bounds. */
const MIN_ITERATIONS = 60;
const MAX_ITERATIONS = 400;
const WORK = 120000;
/** The solve has settled once the residual is this small, relative to the drive. */
const TOLERANCE = 1e-6;
/** Every node leaks to 0 V through this, so a network with no return path still has an answer (no current). */
const LEAK = 1e-7;
/** Marks a diode that is blocking: its edges carry nothing, an open circuit. */
const R_OFF = Infinity;
/** Salt (0..255) water needs to carry current, and its resistance: BRINE_OHMS / salt. */
const SALT_TO_CONDUCT = 8;
const BRINE_OHMS = 500;
/** °C one watt for one frame adds to a cell of heat capacity 1. */
const JOULE = 10.6;
/**
 * A cell carrying current also sheds this share of its rise above room
 * temperature each frame (to the air around it), so a load settles at a
 * steady warmth set by its power: a resistor in an LED circuit runs warm,
 * a dead short runs red-hot.
 */
const POWER_COOL = 0.02;
/** A battery's own internal heating counts this much, and it does not shed it: a short sets it alight in a few seconds. */
const BATTERY_HEAT = 0.006;
/** Filaments: glow temperature for power P is AMBIENT + FILAMENT_T × P^¼ (radiation goes as T⁴). */
const FILAMENT_T = 1800;
/** Battery charge units used per amp per frame (60000 units: about 9 minutes at one bulb's 0.46 A). */
const DRAIN = 4;
/** Capacitor: millivolts gained per amp per frame (2 farads per cell), and the voltage at which it pops. */
const CAP_MV = 1000 / 60 / 2;
const CAP_POP_MV = 12000;
/** Lights reach full brightness at this current. */
const LIT_FULL = 0.02;
/** Least current that turns a motor, works an electromagnet or splits water. */
const MOTOR_MIN = 0.05;
const COIL_MIN = 0.05;
/** An electromagnet reaches its full pull at this current; less current, shorter reach. */
const COIL_FULL = 0.5;
const SPLIT_MIN = 0.02;

/** Scratch for one world: rebuilt every frame from world state, so it is never saved. */
interface Scratch {
  size: number;
  /** Node index of each cell, -1 if not in a live network this frame. */
  nodeOf: Int32Array;
  /** Cell of each node, in search order, and how many there are. */
  cellOf: Int32Array;
  typeOf: Uint16Array;
  n: number;
  /** Network c holds nodes compStart[c] to compStart[c + 1] - 1; `comps` networks. */
  compStart: Int32Array;
  comps: number;
  /** Per node and direction (left, right, up, down): neighbour node, conductance, and the EMF along that edge. */
  nb: Int32Array;
  g: Float64Array;
  e: Float64Array;
  ohm: Float64Array;
  diag: Float64Array;
  rhs: Float64Array;
  x: Float64Array;
  r: Float64Array;
  z: Float64Array;
  p: Float64Array;
  q: Float64Array;
  /** Current through each cell, amps, and light level 0..255, for the inspector and the renderer. */
  amps: Float32Array;
  lit: Uint8Array;
}

const scratches = new WeakMap<World, Scratch>();

function scratchFor(world: World): Scratch {
  let s = scratches.get(world);
  if (s && s.size === world.size) return s;
  const m = Math.min(MAX_NODES, world.size);
  s = {
    size: world.size,
    nodeOf: new Int32Array(world.size).fill(-1),
    cellOf: new Int32Array(m),
    typeOf: new Uint16Array(m),
    n: 0,
    compStart: new Int32Array(MAX_COMPONENTS + 1),
    comps: 0,
    nb: new Int32Array(4 * m),
    g: new Float64Array(4 * m),
    e: new Float64Array(4 * m),
    ohm: new Float64Array(m),
    diag: new Float64Array(m),
    rhs: new Float64Array(m),
    x: new Float64Array(m),
    r: new Float64Array(m),
    z: new Float64Array(m),
    p: new Float64Array(m),
    q: new Float64Array(m),
    amps: new Float32Array(world.size),
    lit: new Uint8Array(world.size),
  };
  scratches.set(world, s);
  return s;
}

/** Resistance of cell i as it stands now, ohms; 0 if it does not conduct. */
function cellOhms(world: World, i: number): number {
  const t = world.type[i];
  const r = OHMS_OF[t];
  if (r === 0) {
    if (SOLVENT_OF[t] !== 0 && world.solute[i] === SALT && world.conc[i] >= SALT_TO_CONDUCT) return BRINE_OHMS / world.conc[i];
    return 0;
  }
  const gate = GATE_OF[t];
  if (gate === GATE_SWITCH || gate === GATE_THERMOSTAT) return world.conc[i] !== 0 ? 0 : r;
  if (gate === GATE_PLATE) {
    if (i < world.w) return 0;
    const ph = PHASE_OF[world.type[i - world.w]];
    return ph !== 0 && ph !== PH_GAS && ph !== PH_ENERGY ? r : 0;
  }
  return r;
}

/** Volts cell i pushes from its left side to its right side. */
function cellEmf(world: World, i: number): number {
  const t = world.type[i];
  if (EMF_OF[t] !== 0) return world.life[i] > 0 ? EMF_OF[t] : 0;
  // A charged capacitor pushes back against the current that charged it.
  if (CAPACITOR_OF[t] !== 0) return -(world.life[i] - CAP_ZERO) / 1000;
  return 0;
}

/** Can a cell of type a join a cell of type b in direction d (0 left, 1 right, 2 up, 3 down)? Two-sided parts join up and down only to their own kind. */
function joins(a: number, b: number, d: number): boolean {
  return d < 2 || (ORIENTED_OF[a] === 0 && ORIENTED_OF[b] === 0) || a === b;
}

/** Neighbour of (x, y) in direction d (0 left, 1 right, 2 up, 3 down), or -1 at the edge. */
function side(world: World, x: number, y: number, d: number): number {
  if (d === 0) return x > 0 ? y * world.w + x - 1 : -1;
  if (d === 1) return x + 1 < world.w ? y * world.w + x + 1 : -1;
  if (d === 2) return y > 0 ? (y - 1) * world.w + x : -1;
  return y + 1 < world.h ? (y + 1) * world.w + x : -1;
}

/** Is cell i a source that could drive current now (a battery with charge, a charged capacitor)? */
function isSource(world: World, i: number): boolean {
  const t = world.type[i];
  return (EMF_OF[t] !== 0 && world.life[i] > 0) || (CAPACITOR_OF[t] !== 0 && world.life[i] !== CAP_ZERO);
}

/** One frame of circuits: find the live networks, solve them, and let the current act. No allocations. */
export function circuitStep(world: World): void {
  const s = scratchFor(world);
  const { w, cw, ch, awake, type, volt } = world;
  const { nodeOf, cellOf, typeOf, ohm, x, amps, lit } = s;
  // Forget last frame's networks.
  for (let k = 0; k < s.n; k++) {
    const c = cellOf[k];
    nodeOf[c] = -1;
    amps[c] = 0;
    lit[c] = 0;
  }
  // Sources keep their chunks awake, so scanning awake chunks finds them all.
  // Each source not yet reached starts a network, grown through everything
  // that conducts, so a network's nodes lie together in search order.
  const { compStart } = s;
  let n = 0;
  let comps = 0;
  for (let cy = 0; cy < ch; cy++) {
    for (let cx = 0; cx < cw; cx++) {
      if (awake[cy * cw + cx] === 0) continue;
      const x0 = cx << CHUNK_SHIFT;
      const y0 = cy << CHUNK_SHIFT;
      const x1 = Math.min(x0 + (1 << CHUNK_SHIFT), w);
      const y1 = Math.min(y0 + (1 << CHUNK_SHIFT), world.h);
      for (let yy = y0; yy < y1; yy++) {
        for (let xx = x0; xx < x1; xx++) {
          const i = yy * w + xx;
          if (nodeOf[i] >= 0 || n >= MAX_NODES || !isSource(world, i)) continue;
          if (comps < MAX_COMPONENTS) compStart[comps++] = n;
          nodeOf[i] = n;
          cellOf[n] = i;
          n = grow(world, s, n, n + 1);
        }
      }
    }
  }
  compStart[comps] = n;
  s.n = n;
  s.comps = comps;
  if (n === 0) return;
  // Resistances. A diode starts from last frame's verdict: blocking while its left side was lower than its right.
  for (let a = 0; a < n; a++) {
    const i = cellOf[a];
    const t = type[i];
    typeOf[a] = t;
    ohm[a] = cellOhms(world, i);
    if (DIODE_OF[t] !== 0) {
      const xi = i % w;
      const yi = (i / w) | 0;
      const jl = side(world, xi, yi, 0);
      const jr = side(world, xi, yi, 1);
      const vl = jl >= 0 && nodeOf[jl] >= 0 ? volt[jl] : 0;
      const vr = jr >= 0 && nodeOf[jr] >= 0 ? volt[jr] : 0;
      if (vl < vr - 0.01) ohm[a] = R_OFF;
    }
    x[a] = volt[i];
  }
  // Solve each network; if a diode turns out to be wrong (passing current
  // backwards, or blocking while pushed forwards), flip it and solve again,
  // so a diode never lets a frame of current through the wrong way.
  const st = world.currentStamp();
  for (let c = 0; c < comps; c++) {
    const lo = compStart[c];
    const hi = compStart[c + 1];
    const iterations = Math.min(MAX_ITERATIONS, Math.max(MIN_ITERATIONS, (WORK / (hi - lo)) | 0));
    assemble(world, s, lo, hi);
    let settled = solve(s, lo, hi, iterations);
    for (let round = 0; settled && round < 3 && flipDiodes(world, s, lo, hi); round++) {
      assemble(world, s, lo, hi);
      settled = solve(s, lo, hi, iterations);
    }
    if (settled) act(world, s, lo, hi, st);
    // Unsettled: keep the progress for next frame, but let nothing act on half-solved currents.
    else for (let a = lo; a < hi; a++) volt[cellOf[a]] = x[a];
  }
}

/** Grows a network breadth first from the nodes head..n-1 through every conductor that joins it. Returns the new node count. */
function grow(world: World, s: Scratch, head: number, n: number): number {
  const { w, type } = world;
  const { nodeOf, cellOf } = s;
  for (let a = head; a < n; a++) {
    const i = cellOf[a];
    const ti = type[i];
    const xi = i % w;
    const yi = (i / w) | 0;
    for (let d = 0; d < 4; d++) {
      const j = side(world, xi, yi, d);
      if (j < 0 || nodeOf[j] >= 0 || n >= MAX_NODES) continue;
      if (!joins(ti, type[j], d) || cellOhms(world, j) === 0) continue;
      nodeOf[j] = n;
      cellOf[n++] = j;
    }
  }
  return n;
}

/** The currents of a settled network, and what they do. */
function act(world: World, s: Scratch, lo: number, hi: number, st: number): void {
  const { w, type, temp, life, volt } = world;
  const { cellOf, typeOf, nb, g, e, ohm, x, amps, lit } = s;
  for (let a = lo; a < hi; a++) {
    const i = cellOf[a];
    const t = typeOf[a];
    if (type[i] !== t) continue;
    volt[i] = x[a];
    let sum = 0;
    let ix = 0;
    for (let d = 0; d < 4; d++) {
      const k = 4 * a + d;
      const b = nb[k];
      if (b < 0) continue;
      const I = g[k] * (x[a] - x[b] + e[k]);
      sum += I < 0 ? -I : I;
      if (d === 1) ix += 0.5 * I;
      else if (d === 0) ix -= 0.5 * I;
    }
    const I = 0.5 * sum;
    amps[i] = I;
    if (I < 1e-4 || ohm[a] === R_OFF) continue;
    const xi = i % w;
    const yi = (i / w) | 0;
    world.wake(xi, yi);
    const P = I * I * ohm[a];
    if (EMF_OF[t] !== 0) temp[i] += P * JOULE * INV_CAP_OF[t] * BATTERY_HEAT;
    else temp[i] += P * JOULE * INV_CAP_OF[t] - (temp[i] - AMBIENT) * POWER_COOL;
    if (FILAMENT_OF[t] !== 0) {
      const glow = AMBIENT + FILAMENT_T * Math.sqrt(Math.sqrt(P));
      if (temp[i] < glow) temp[i] += (glow - temp[i]) * 0.3;
    }
    if (LIT_RGB_OF[t] !== 0) lit[i] = I >= LIT_FULL ? 255 : (I / LIT_FULL) * 255;
    if (I > MAX_AMPS_OF[t]) {
      // Burnt out.
      const T = temp[i];
      world.place(i, BURNS_OUT_INTO_OF[t]);
      temp[i] = T + 200;
      continue;
    }
    if (EMF_OF[t] !== 0) {
      const used = (I * DRAIN + world.rng.next()) | 0;
      life[i] = life[i] > used ? life[i] - used : 0;
    } else if (CAPACITOR_OF[t] !== 0) {
      const mv = life[i] + Math.floor(ix * CAP_MV + world.rng.next());
      if (mv > CAP_ZERO + CAP_POP_MV || mv < CAP_ZERO - CAP_POP_MV) {
        pop(world, i);
        continue;
      }
      life[i] = Math.max(1, Math.min(65535, mv));
    } else if (MOTOR_OF[t] !== 0) {
      turn(world, xi, yi, ix, st);
    } else if (COIL_OF[t] !== 0) {
      if (I >= COIL_MIN) pullIron(world, xi, yi, Math.max(3, Math.round(COIL_OF[t] * Math.min(1, I / COIL_FULL))), 6);
    } else if (SOLVENT_OF[t] !== 0 && I >= SPLIT_MIN && world.rng.next() < I * 0.05) {
      // Electrolysis: current through salty water splits it.
      const T = temp[i];
      world.place(i, world.rng.next() < 0.67 ? HYDROGEN : OXYGEN);
      temp[i] = T;
    }
  }
}

/** Builds the node system from the resistances: at each node the currents out sum to zero. */
function assemble(world: World, s: Scratch, lo: number, hi: number): void {
  const { w } = world;
  const { nodeOf, cellOf, typeOf, nb, g, e, ohm, diag, rhs } = s;
  for (let a = lo; a < hi; a++) {
    const i = cellOf[a];
    const t = typeOf[a];
    const xi = i % w;
    const yi = (i / w) | 0;
    const ea = cellEmf(world, i);
    let dg = LEAK;
    let b0 = 0;
    for (let d = 0; d < 4; d++) {
      const k = 4 * a + d;
      const j = side(world, xi, yi, d);
      const b = j >= 0 ? nodeOf[j] : -1;
      if (b < 0 || !joins(t, typeOf[b], d)) {
        nb[k] = -1;
        continue;
      }
      // A blocking diode is an open circuit: its edges carry nothing (1 / Infinity = 0).
      const gk = 1 / (0.5 * ohm[a] + 0.5 * ohm[b]);
      // EMF along this edge: half of each cell's, signed by the direction of travel.
      const ek = d === 0 ? -0.5 * (ea + cellEmf(world, j)) : d === 1 ? 0.5 * (ea + cellEmf(world, j)) : 0;
      nb[k] = b;
      g[k] = gk;
      e[k] = ek;
      dg += gk;
      b0 -= gk * ek;
    }
    diag[a] = dg;
    rhs[a] = b0;
  }
}

/** Flips every diode the last solve shows to be wrong. True if any changed. */
function flipDiodes(world: World, s: Scratch, lo: number, hi: number): boolean {
  const { cellOf, typeOf, nb, g, e, ohm, x } = s;
  let changed = false;
  for (let a = lo; a < hi; a++) {
    const t = typeOf[a];
    if (DIODE_OF[t] === 0) continue;
    // Current through it, left to right.
    let ix = 0;
    const kl = 4 * a;
    const kr = 4 * a + 1;
    if (nb[kr] >= 0) ix += 0.5 * g[kr] * (x[a] - x[nb[kr]] + e[kr]);
    if (nb[kl] >= 0) ix -= 0.5 * g[kl] * (x[a] - x[nb[kl]] + e[kl]);
    if (ohm[a] !== R_OFF) {
      if (ix < -1e-6) {
        ohm[a] = R_OFF;
        changed = true;
      }
    } else {
      const vl = nb[kl] >= 0 ? x[nb[kl]] : x[a];
      const vr = nb[kr] >= 0 ? x[nb[kr]] : x[a];
      if (vl > vr + 0.01) {
        ohm[a] = cellOhms(world, cellOf[a]);
        changed = true;
      }
    }
  }
  return changed;
}

/** Preconditioned conjugate gradient on the node system, starting from x. True if it settled. */
function solve(s: Scratch, lo: number, hi: number, iterations: number): boolean {
  const { nb, g, diag, rhs, x, r, z, p, q } = s;
  let bb = 0;
  let rz = 0;
  let rr = 0;
  for (let a = lo; a < hi; a++) {
    let ax = diag[a] * x[a];
    for (let d = 0; d < 4; d++) {
      const b = nb[4 * a + d];
      if (b >= 0) ax -= g[4 * a + d] * x[b];
    }
    const ra = rhs[a] - ax;
    r[a] = ra;
    const za = ra / diag[a];
    z[a] = za;
    p[a] = za;
    rz += ra * za;
    rr += ra * ra;
    bb += rhs[a] * rhs[a];
  }
  const limit = TOLERANCE * TOLERANCE * (bb > 1e-8 ? bb : 1e-8);
  for (let it = 0; it < iterations && rr > limit; it++) {
    let pq = 0;
    for (let a = lo; a < hi; a++) {
      let qa = diag[a] * p[a];
      for (let d = 0; d < 4; d++) {
        const b = nb[4 * a + d];
        if (b >= 0) qa -= g[4 * a + d] * p[b];
      }
      q[a] = qa;
      pq += p[a] * qa;
    }
    if (pq <= 0) break;
    const alpha = rz / pq;
    let rz2 = 0;
    rr = 0;
    for (let a = lo; a < hi; a++) {
      x[a] += alpha * p[a];
      const ra = r[a] - alpha * q[a];
      r[a] = ra;
      const za = ra / diag[a];
      z[a] = za;
      rz2 += ra * za;
      rr += ra * ra;
    }
    const beta = rz2 / rz;
    rz = rz2;
    for (let a = lo; a < hi; a++) p[a] = z[a] + beta * p[a];
  }
  return rr <= limit;
}

/** An overcharged capacitor pops: a puff of smoke, a flash of heat and a little shock. */
function pop(world: World, i: number): void {
  const x = i % world.w;
  const y = (i / world.w) | 0;
  world.place(i, SMOKE);
  world.temp[i] = 400;
  world.air.addPressure(x, y, 6, 2);
}

/** A powered motor carries what rests on it one cell along, the way the current runs, faster with more current. */
function turn(world: World, x: number, y: number, ix: number, st: number): void {
  const mag = ix < 0 ? -ix : ix;
  if (mag < MOTOR_MIN || y === 0) return;
  const every = Math.min(8, Math.max(1, Math.round(0.25 / mag)));
  if (world.frame % every !== 0) return;
  const dir = ix > 0 ? 1 : -1;
  const j = (y - 1) * world.w + x;
  const ph = PHASE_OF[world.type[j]];
  if ((ph !== PH_POWDER && ph !== PH_LIQUID) || world.stamp[j] === st || x + dir < 0 || x + dir >= world.w) return;
  if (world.type[j + dir] !== EMPTY) return;
  world.swapCells(j, j + dir);
  world.stamp[j + dir] = st;
  world.wake(x + dir, y - 1);
}

/**
 * Pulls magnetic grains towards (x, y): a few random cells within `reach`
 * are tried; a magnetic one steps one cell nearer (diagonally if it can,
 * else straight across or up). Used by magnets and electromagnets.
 */
export function pullIron(world: World, x: number, y: number, reach: number, tries: number): void {
  const { w, h, type } = world;
  for (let k = 0; k < tries; k++) {
    const q0 = world.rng.nextU32();
    const mx = x + (q0 % (2 * reach + 1)) - reach;
    const my = y + ((q0 >>> 12) % (2 * reach + 1)) - reach;
    if (mx < 0 || my < 0 || mx >= w || my >= h) continue;
    const c = my * w + mx;
    if (MAGNETIC_OF[type[c]] === 0) continue;
    const sx = Math.sign(x - mx);
    const sy = Math.sign(y - my);
    let to = (my + sy) * w + mx + sx;
    if (type[to] !== EMPTY) to = my * w + mx + sx;
    if (type[to] !== EMPTY) to = (my + sy) * w + mx;
    if (to !== c && type[to] === EMPTY) {
      world.swapCells(c, to);
      world.vy[to] = 0;
      world.wake(mx, my);
    }
  }
}

/** Current through cell i last frame, amps (0 if none). */
export function ampsAt(world: World, i: number): number {
  return scratches.get(world)?.amps[i] ?? 0;
}

/** Was cell i part of a network with a power source last frame? */
export function inLiveCircuit(world: World, i: number): boolean {
  const s = scratches.get(world);
  return !!s && s.size === world.size && s.nodeOf[i] >= 0;
}

/** Light level (0..255) of every cell from last frame, for the renderer; null before any circuit has run. */
export function litLevels(world: World): Uint8Array | null {
  const s = scratches.get(world);
  return s && s.size === world.size ? s.lit : null;
}
