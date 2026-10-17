import {
  AMBIENT,
  BURNS_OUT_INTO_OF,
  CAPACITOR_OF,
  CAP_ZERO,
  COIL_OF,
  DIODE_OF,
  ELEMENT_COUNT,
  EMF_OF,
  EMPTY,
  FILAMENT_OF,
  GATE_OF,
  GATE_PLATE,
  GATE_SWITCH,
  GATE_THERMOSTAT,
  HYDROGEN,
  INV_CAP_OF,
  LIFE_OF,
  LIT_RGB_OF,
  MAGNETIC_OF,
  MAX_AMPS_OF,
  MOTOR_OF,
  OHMS_OF,
  OXYGEN,
  PHASE_OF,
  PH_ENERGY,
  PH_GAS,
  PH_LIQUID,
  PH_POWDER,
  SALT,
  SMOKE,
  SOLVENT_OF,
  SOLAR_OF,
} from './elements';
import { lightAt } from './light';
import { CHUNK_SHIFT, type World } from './world';

/*
 * Circuits. Units are volts, ohms and amps; one frame is 1/60 s.
 *
 * Every conductor cell is a node, joined to the conductors beside it by its
 * resistance (half of each cell's). Current flows only round a closed loop.
 *
 * Batteries and capacitors are two-terminal parts, however they are drawn:
 * each blob of battery (or capacitor) cells is one part. Its inside is one
 * piece of metal; where it touches the circuit on one side it is its -
 * terminal, on the other side its + terminal. Which sides is read from the
 * drawing: the blob takes the axis (across or up) along which the circuit
 * touches it on both sides. A longer blob gives more voltage (1.5 V a cell
 * along that axis), a thicker one more current (less internal resistance).
 * A battery turns itself round when another battery is pushing it backwards,
 * or when that is the only way current can get past a diode, so batteries in
 * a loop always help each other and a lone LED always lights.
 *
 * Each frame, a search from every source finds the live networks. In each,
 * every stretch of wire or metal (anything under 0.05 ohm a cell, joined
 * with no voltage source between) is one piece at one potential: its own
 * resistance is far too small to matter to the loads. Each load cell (bulb,
 * resistor, LED, motor, salt water...) is a piece of its own. A
 * preconditioned conjugate-gradient solve then finds each piece's potential
 * (Kirchhoff's current law at every piece). The system is small, so it
 * settles within the frame; until it has settled, its currents act on
 * nothing (half-solved currents are not real). It starts from the
 * potentials kept in `world.volt`. Everything it reads is world state, so a
 * rewound or replayed run solves identically.
 *
 * The current in a piece of wire is shared across its width (estimated as
 * twice its cells over its outline), so a thin wire on a short circuit
 * heats far more than a thick one.
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
/** Battery and capacitor blobs one frame tracks; past this, extra blobs are plain conductors. */
const MAX_BLOBS = 4096;
/** Solver steps per network: about three per piece, within these bounds, and at most WORK edge visits. */
const MIN_ITERATIONS = 60;
const MAX_ITERATIONS = 4000;
const WORK = 4000000;
/** Cells under this many ohms (or edges over this many siemens) join their neighbours in one piece. */
const OWN_OHMS = 0.05;
const MERGE_SIEMENS = 1 / OWN_OHMS;
/** The solve has settled once the residual is this small, relative to the drive. */
const TOLERANCE = 1e-6;
/** Every node leaks to 0 V through this, so a network with no return path still has an answer; far too small to carry a current worth the name. */
const LEAK = 1e-9;
/** Marks a diode that is blocking: its edges carry nothing, an open circuit. */
const R_OFF = Infinity;
/** Salt (0..255) water needs to carry current, and its resistance: BRINE_OHMS / salt. */
const SALT_TO_CONDUCT = 8;
const BRINE_OHMS = 500;
/** Inside a battery or capacitor blob: one piece of metal. */
const BLOB_OHMS = 0.0005;
/** Battery: internal ohms per cell along its axis, divided by its thickness (its volts per cell are the element's emf). */
const BATTERY_R = 0.1;
/** Capacitor: internal ohms per cell along its axis, farads per cell of cross-section over length, and volts it stands per cell of length. */
const CAP_R = 0.05;
const CAP_F = 2;
const CAP_POP_V = 4;
/** °C one watt for one frame adds to a cell of heat capacity 1. */
const JOULE = 10.6;
/**
 * A cell carrying current also sheds this share of its rise above room
 * temperature each frame (to the air around it), so a load settles at a
 * steady warmth set by its power: a resistor in an LED circuit runs warm,
 * a dead short runs red-hot.
 */
const POWER_COOL = 0.02;
/** A battery's own internal heating counts this much, and it does not shed it: a dead short warms it to bursting in about ten to thirty seconds. */
const BATTERY_HEAT = 0.001;
/** Filaments: glow temperature for power P is AMBIENT + FILAMENT_T × P^¼ (radiation goes as T⁴), up to FILAMENT_MAX. */
const FILAMENT_T = 1800;
const FILAMENT_MAX = 3000;
/** Battery charge units used per amp per frame, per cell of length, shared over its cells (about 9 minutes for one cell lighting one bulb). */
const DRAIN = 4;
/** Lights reach full brightness at this current. */
const LIT_FULL = 0.02;
/** Least current that turns a motor, works an electromagnet or splits water. */
const MOTOR_MIN = 0.05;
const COIL_MIN = 0.05;
/** An electromagnet reaches its full pull at this current; less current, shorter reach. */
const COIL_FULL = 0.5;
const SPLIT_MIN = 0.02;
/** A battery whose terminals hold less than this share of its voltage is short-circuited. */
const SHORT_SHARE = 0.25;
/** Least power (watts) and current (amps) that count as a battery driving a current, well above the solver's rounding and a blocked diode's trickle. */
const POWER_MIN = 1e-3;
const AMPS_MIN = 1e-3;

/** Elements that act cell by cell on the current through them: each cell stays a piece of its own. */
const OWN_OF = Uint8Array.from({ length: ELEMENT_COUNT }, (_, t) =>
  DIODE_OF[t] || MOTOR_OF[t] || COIL_OF[t] || LIT_RGB_OF[t] || FILAMENT_OF[t] || SOLVENT_OF[t] || MAX_AMPS_OF[t] !== Infinity ? 1 : 0,
);

/** Scratch for one world: rebuilt every frame from world state, so it is never saved. */
interface Scratch {
  size: number;
  /** Node index of each cell, -1 if not in a live network this frame. */
  nodeOf: Int32Array;
  /** Cell of each node, in search order, and how many there are. */
  cellOf: Int32Array;
  typeOf: Uint16Array;
  n: number;
  /** Network c holds nodes compStart[c] to compStart[c + 1] - 1, and blobs blobStart[c] to blobStart[c + 1] - 1. */
  compStart: Int32Array;
  blobStart: Int32Array;
  comps: number;
  /** Per node and direction (left, right, up, down): neighbour node, conductance, and the EMF along that edge. */
  nb: Int32Array;
  g: Float64Array;
  e: Float64Array;
  ohm: Float64Array;
  /** Potential of each node. */
  x: Float64Array;
  /** The piece each node belongs to, and a stack for finding pieces. */
  aggOf: Int32Array;
  stack: Int32Array;
  /** Pieces of the network being solved: first node, nodes, outline length, and the solver's vectors. */
  pieces: number;
  cFirst: Int32Array;
  cCount: Int32Array;
  cPerim: Int32Array;
  cDiag: Float64Array;
  cRhs: Float64Array;
  cX: Float64Array;
  cR: Float64Array;
  cZ: Float64Array;
  cP: Float64Array;
  cQ: Float64Array;
  /** Current through each piece (half the current crossing its edges). */
  cThrough: Float64Array;
  /** Edges between pieces: ends, conductance, EMF from the first end to the second. */
  edges: number;
  eA: Int32Array;
  eB: Int32Array;
  eG: Float64Array;
  eE: Float64Array;
  /** Saved potentials and resistances, for trying a battery the other way round. */
  xs: Float64Array;
  os: Float64Array;
  /** Blob of each cell, -1 if none; the blob's cells lie at blobCells[bFirst[b]] onwards, bCount[b] of them. */
  blobOf: Int32Array;
  blobCells: Int32Array;
  nCells: number;
  blobs: number;
  bFirst: Int32Array;
  bCount: Int32Array;
  /** Axis: 0 across (+ side right), 1 up (+ side top). Centre along the axis, length along it, cells across it. */
  bAxis: Uint8Array;
  bCentre: Float64Array;
  bLen: Int32Array;
  /** Signed EMF (volts, towards the + side), internal ohms, and the ohms of each contact on the + and - sides. */
  bEmf: Float64Array;
  bOhms: Float64Array;
  bRPlus: Float64Array;
  bRMinus: Float64Array;
  /** After the solve: current out of the + side, and the voltage across the terminals. */
  bAmps: Float64Array;
  bVolts: Float64Array;
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
    blobStart: new Int32Array(MAX_COMPONENTS + 1),
    comps: 0,
    nb: new Int32Array(4 * m),
    g: new Float64Array(4 * m),
    e: new Float64Array(4 * m),
    ohm: new Float64Array(m),
    x: new Float64Array(m),
    aggOf: new Int32Array(m),
    stack: new Int32Array(m),
    pieces: 0,
    cFirst: new Int32Array(m),
    cCount: new Int32Array(m),
    cPerim: new Int32Array(m),
    cDiag: new Float64Array(m),
    cRhs: new Float64Array(m),
    cX: new Float64Array(m),
    cR: new Float64Array(m),
    cZ: new Float64Array(m),
    cP: new Float64Array(m),
    cQ: new Float64Array(m),
    cThrough: new Float64Array(m),
    edges: 0,
    eA: new Int32Array(2 * m),
    eB: new Int32Array(2 * m),
    eG: new Float64Array(2 * m),
    eE: new Float64Array(2 * m),
    xs: new Float64Array(m),
    os: new Float64Array(m),
    blobOf: new Int32Array(world.size).fill(-1),
    blobCells: new Int32Array(m),
    nCells: 0,
    blobs: 0,
    bFirst: new Int32Array(MAX_BLOBS),
    bCount: new Int32Array(MAX_BLOBS),
    bAxis: new Uint8Array(MAX_BLOBS),
    bCentre: new Float64Array(MAX_BLOBS),
    bLen: new Int32Array(MAX_BLOBS),
    bEmf: new Float64Array(MAX_BLOBS),
    bOhms: new Float64Array(MAX_BLOBS),
    bRPlus: new Float64Array(MAX_BLOBS),
    bRMinus: new Float64Array(MAX_BLOBS),
    bAmps: new Float64Array(MAX_BLOBS),
    bVolts: new Float64Array(MAX_BLOBS),
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
  return (EMF_OF[t] !== 0 && (world.life[i] > 0 || SOLAR_OF[t] !== 0)) || (CAPACITOR_OF[t] !== 0 && world.life[i] !== CAP_ZERO);
}

/** Which terminal of blob b a cell at (x, y) touches: +1 the + side, -1 the - side. */
function terminal(s: Scratch, b: number, x: number, y: number): number {
  return s.bAxis[b] === 0 ? (x > s.bCentre[b] ? 1 : -1) : y < s.bCentre[b] ? 1 : -1;
}

/**
 * Reads the battery or capacitor blob around cell i: its cells, the axis
 * along which the circuit touches it on both sides, its voltage (signed by
 * which way round it is, kept in its cells' conc) and its resistances.
 */
function labelBlob(world: World, s: Scratch, i: number): void {
  if (s.blobs >= MAX_BLOBS) return;
  const { w, type, life, conc } = world;
  const { blobOf, blobCells } = s;
  const b = s.blobs++;
  const t = type[i];
  const first = s.nCells;
  blobOf[i] = b;
  blobCells[s.nCells++] = i;
  let minX = w;
  let maxX = -1;
  let minY = world.h;
  let maxY = -1;
  let sumX = 0;
  let sumY = 0;
  let charge = 0;
  let firstCell = i;
  for (let k = first; k < s.nCells; k++) {
    const c = blobCells[k];
    const cx = c % w;
    const cy = (c / w) | 0;
    if (cx < minX) minX = cx;
    if (cx > maxX) maxX = cx;
    if (cy < minY) minY = cy;
    if (cy > maxY) maxY = cy;
    sumX += cx;
    sumY += cy;
    charge += life[c];
    if (c < firstCell) firstCell = c;
    for (let d = 0; d < 4; d++) {
      const j = side(world, cx, cy, d);
      if (j >= 0 && blobOf[j] < 0 && type[j] === t && s.nCells < blobCells.length) {
        blobOf[j] = b;
        blobCells[s.nCells++] = j;
      }
    }
  }
  const count = s.nCells - first;
  const centreX = sumX / count;
  const centreY = sumY / count;
  // Where the circuit touches it, on each side of its centre, across and up,
  // and how far apart those two groups of contacts are.
  let left = 0;
  let right = 0;
  let top = 0;
  let bottom = 0;
  let sumL = 0;
  let sumR = 0;
  let sumT = 0;
  let sumB = 0;
  for (let k = first; k < s.nCells; k++) {
    const c = blobCells[k];
    const cx = c % w;
    const cy = (c / w) | 0;
    for (let d = 0; d < 4; d++) {
      const j = side(world, cx, cy, d);
      if (j < 0 || blobOf[j] === b || cellOhms(world, j) === 0) continue;
      const jx = j % w;
      const jy = (j / w) | 0;
      if (jx > centreX) {
        right++;
        sumR += jx;
      } else {
        left++;
        sumL += jx;
      }
      if (jy < centreY) {
        top++;
        sumT += jy;
      } else {
        bottom++;
        sumB += jy;
      }
    }
  }
  // The axis is the one along which its contacts sit at opposite ends: a
  // battery drawn across a wire takes the current along the wire.
  const across = left > 0 && right > 0 ? (sumR / right - sumL / left) / (maxX - minX + 1) : 0;
  const up = top > 0 && bottom > 0 ? (sumB / bottom - sumT / top) / (maxY - minY + 1) : 0;
  const axis = up > across ? 1 : 0;
  const len = axis === 0 ? maxX - minX + 1 : maxY - minY + 1;
  const thick = Math.max(1, count / len);
  s.bFirst[b] = first;
  s.bCount[b] = count;
  s.bAxis[b] = axis;
  s.bCentre[b] = axis === 0 ? centreX : centreY;
  s.bLen[b] = len;
  let emf: number;
  let ohms: number;
  if (SOLAR_OF[t] !== 0) {
    // A solar panel's voltage follows the light on it: sample a few of its cells.
    let light = 0;
    const samples = Math.min(4, count);
    for (let q = 0; q < samples; q++) {
      const c = blobCells[first + ((q * count) / samples) | 0];
      light += lightAt(world, c % w, (c / w) | 0);
    }
    emf = EMF_OF[t] * len * (light / samples) * (conc[firstCell] !== 0 ? -1 : 1);
    ohms = (OHMS_OF[t] * len) / thick;
  } else if (EMF_OF[t] !== 0) {
    emf = charge > 0 ? EMF_OF[t] * len * (conc[firstCell] !== 0 ? -1 : 1) : 0;
    ohms = (BATTERY_R * len) / thick;
  } else {
    // A charged capacitor pushes back against the current that charged it; all its cells hold the same charge.
    emf = -(life[firstCell] - CAP_ZERO) / 1000;
    ohms = (CAP_R * len) / thick;
  }
  s.bEmf[b] = emf;
  s.bOhms[b] = ohms;
  // Each side's contacts share half the internal resistance between them.
  const plus = axis === 0 ? right : top;
  const minus = axis === 0 ? left : bottom;
  s.bRPlus[b] = 0.5 * ohms * Math.max(1, plus);
  s.bRMinus[b] = 0.5 * ohms * Math.max(1, minus);
}

/** One frame of circuits: find the live networks, solve them, and let the current act. No allocations. */
export function circuitStep(world: World): void {
  const s = scratchFor(world);
  const { w, cw, ch, awake, type, volt } = world;
  const { nodeOf, cellOf, typeOf, ohm, x, amps, lit, blobOf, blobCells } = s;
  // Forget last frame's networks and blobs.
  for (let k = 0; k < s.n; k++) {
    const c = cellOf[k];
    nodeOf[c] = -1;
    amps[c] = 0;
    lit[c] = 0;
  }
  for (let k = 0; k < s.nCells; k++) blobOf[blobCells[k]] = -1;
  s.nCells = 0;
  s.blobs = 0;
  // Sources keep their chunks awake, so scanning awake chunks finds them all.
  // Each source not yet reached starts a network, grown through everything
  // that conducts, so a network's nodes (and its blobs) lie together.
  const { compStart, blobStart } = s;
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
          if (comps < MAX_COMPONENTS) {
            compStart[comps] = n;
            blobStart[comps++] = s.blobs;
          }
          nodeOf[i] = n;
          cellOf[n] = i;
          n = grow(world, s, n, n + 1);
        }
      }
    }
  }
  compStart[comps] = n;
  blobStart[comps] = s.blobs;
  s.n = n;
  s.comps = comps;
  if (n === 0) return;
  // Resistances. A diode starts from last frame's verdict: blocking while pushed leftwards or downwards.
  for (let a = 0; a < n; a++) {
    const i = cellOf[a];
    const t = type[i];
    typeOf[a] = t;
    ohm[a] = blobOf[i] >= 0 ? BLOB_OHMS : cellOhms(world, i);
    if (DIODE_OF[t] !== 0) {
      const xi = i % w;
      const yi = (i / w) | 0;
      let bias = 0;
      for (let d = 0; d < 4; d++) {
        const j = side(world, xi, yi, d);
        // Forward is from left to right and from below to above.
        if (j >= 0 && nodeOf[j] >= 0) bias += d === 0 || d === 3 ? volt[j] : -volt[j];
      }
      if (bias < -0.01) ohm[a] = R_OFF;
    }
    x[a] = volt[i];
  }
  // Solve each network. If a diode turns out wrong (passing current
  // backwards, or blocking while pushed forwards), flip it; if a battery is
  // being pushed backwards by another, turn it round; solve again.
  const st = world.currentStamp();
  for (let c = 0; c < comps; c++) {
    const lo = compStart[c];
    const hi = compStart[c + 1];
    let settled = settle(world, s, c);
    if (settled && turnBatteries(world, s, c)) settled = settle(world, s, c);
    if (settled) settled = tryOtherWay(world, s, c);
    if (settled) act(world, s, c, st);
    // Unsettled: keep the progress for next frame, but let nothing act on half-solved currents.
    else for (let a = lo; a < hi; a++) volt[cellOf[a]] = x[a];
  }
}

/** Assembles and solves network c, letting diodes settle. True if the solve settled. */
function settle(world: World, s: Scratch, c: number): boolean {
  const lo = s.compStart[c];
  const hi = s.compStart[c + 1];
  assemble(world, s, lo, hi);
  let settled = solvePieces(world, s, lo, hi);
  for (let round = 0; settled && round < 3 && flipDiodes(world, s, lo, hi); round++) {
    assemble(world, s, lo, hi);
    settled = solvePieces(world, s, lo, hi);
  }
  if (settled) blobCurrents(world, s, s.blobStart[c], s.blobStart[c + 1]);
  return settled;
}

/** Turns round every battery in network c that is being pushed backwards. True if any turned. */
function turnBatteries(world: World, s: Scratch, c: number): boolean {
  let turned = false;
  for (let b = s.blobStart[c]; b < s.blobStart[c + 1]; b++) {
    const cell = s.blobCells[s.bFirst[b]];
    if (EMF_OF[world.type[cell]] === 0 || s.bEmf[b] === 0) continue;
    if (s.bEmf[b] * s.bAmps[b] < -POWER_MIN) {
      flipBattery(world, s, b);
      turned = true;
    }
  }
  return turned;
}

/** Turns battery blob b round: its + side becomes its - side. */
function flipBattery(world: World, s: Scratch, b: number): void {
  const { conc } = world;
  const f = s.bFirst[b];
  const reversed = conc[s.blobCells[f]] !== 0 ? 0 : 1;
  for (let k = f; k < f + s.bCount[b]; k++) conc[s.blobCells[k]] = reversed;
  s.bEmf[b] = -s.bEmf[b];
}

/** Is blob b a battery that pushes (has charge)? */
function isBattery(world: World, s: Scratch, b: number): boolean {
  return EMF_OF[world.type[s.blobCells[s.bFirst[b]]]] !== 0 && s.bEmf[b] !== 0;
}

/** Do the batteries of network c drive a real current? */
function driving(world: World, s: Scratch, c: number): boolean {
  let power = 0;
  let most = 0;
  for (let b = s.blobStart[c]; b < s.blobStart[c + 1]; b++) {
    if (!isBattery(world, s, b)) continue;
    power += s.bEmf[b] * s.bAmps[b];
    most = Math.max(most, Math.abs(s.bAmps[b]));
  }
  return power > POWER_MIN && most > AMPS_MIN;
}

/**
 * A network whose batteries drive no current (two batteries pushing against
 * each other, or a diode in the way) is tried with each battery turned round
 * in turn, then with all of them turned round, and kept the first way that
 * drives a current. So batteries in a loop always help each other and a lone
 * LED lights whichever way round it was drawn. Returns whether the network
 * is still settled.
 */
function tryOtherWay(world: World, s: Scratch, c: number): boolean {
  const lo = s.compStart[c];
  const hi = s.compStart[c + 1];
  let batteries = 0;
  for (let b = s.blobStart[c]; b < s.blobStart[c + 1]; b++) if (isBattery(world, s, b)) batteries++;
  if (batteries === 0 || driving(world, s, c)) return true;
  const { x, ohm, xs, os } = s;
  for (let a = lo; a < hi; a++) {
    xs[a] = x[a];
    os[a] = ohm[a];
  }
  // Tries: each battery alone (at most four), then all together.
  const singles = batteries > 1 ? Math.min(4, batteries) : 0;
  for (let attempt = 0; attempt <= singles; attempt++) {
    let nth = 0;
    for (let b = s.blobStart[c]; b < s.blobStart[c + 1]; b++) {
      if (!isBattery(world, s, b)) continue;
      if (attempt === singles || nth === attempt) flipBattery(world, s, b);
      nth++;
    }
    // Diodes start open for the new way round, so the solve finds which ones pass.
    for (let a = lo; a < hi; a++) if (ohm[a] === R_OFF) ohm[a] = cellOhms(world, s.cellOf[a]);
    if (settle(world, s, c) && driving(world, s, c)) return true;
    // No better: back as it was.
    nth = 0;
    for (let b = s.blobStart[c]; b < s.blobStart[c + 1]; b++) {
      if (!isBattery(world, s, b)) continue;
      if (attempt === singles || nth === attempt) flipBattery(world, s, b);
      nth++;
    }
    for (let a = lo; a < hi; a++) {
      x[a] = xs[a];
      ohm[a] = os[a];
    }
  }
  return settle(world, s, c);
}

/** For blobs b0..b1-1: the current out of each + side and the voltage across its terminals. */
function blobCurrents(world: World, s: Scratch, b0: number, b1: number): void {
  const { w } = world;
  const { blobOf, blobCells, nodeOf, nb, g, e, x } = s;
  for (let b = b0; b < b1; b++) {
    let out = 0;
    let vPlus = 0;
    let vMinus = 0;
    let nPlus = 0;
    let nMinus = 0;
    const f = s.bFirst[b];
    for (let k = f; k < f + s.bCount[b]; k++) {
      const c = blobCells[k];
      const a = nodeOf[c];
      if (a < 0) continue;
      for (let d = 0; d < 4; d++) {
        const q = nb[4 * a + d];
        if (q < 0) continue;
        const j = s.cellOf[q];
        if (blobOf[j] === b) continue;
        const sideJ = terminal(s, b, j % w, (j / w) | 0);
        const I = g[4 * a + d] * (x[a] - x[q] + e[4 * a + d]);
        if (sideJ > 0) {
          out += I;
          vPlus += x[q];
          nPlus++;
        } else {
          vMinus += x[q];
          nMinus++;
        }
      }
    }
    s.bAmps[b] = out;
    s.bVolts[b] = nPlus > 0 && nMinus > 0 ? vPlus / nPlus - vMinus / nMinus : 0;
  }
}

/** Grows a network breadth first from the nodes head..n-1 through every conductor that joins it. Returns the new node count. */
function grow(world: World, s: Scratch, head: number, n: number): number {
  const { w, type } = world;
  const { nodeOf, cellOf, blobOf } = s;
  for (let a = head; a < n; a++) {
    const i = cellOf[a];
    if (blobOf[i] < 0 && (EMF_OF[type[i]] !== 0 || CAPACITOR_OF[type[i]] !== 0)) labelBlob(world, s, i);
    const xi = i % w;
    const yi = (i / w) | 0;
    for (let d = 0; d < 4; d++) {
      const j = side(world, xi, yi, d);
      if (j < 0 || nodeOf[j] >= 0 || n >= MAX_NODES || cellOhms(world, j) === 0) continue;
      nodeOf[j] = n;
      cellOf[n++] = j;
    }
  }
  return n;
}

/**
 * Builds each node's edges: conductance and EMF to its four neighbours. An
 * edge into a battery or capacitor from outside meets its terminal on that
 * side: half the blob's EMF, signed by the side, and that side's share of
 * its internal resistance.
 */
function assemble(world: World, s: Scratch, lo: number, hi: number): void {
  const { w } = world;
  const { nodeOf, cellOf, nb, g, e, ohm, blobOf } = s;
  for (let a = lo; a < hi; a++) {
    const i = cellOf[a];
    const xi = i % w;
    const yi = (i / w) | 0;
    const ba = blobOf[i];
    for (let d = 0; d < 4; d++) {
      const k = 4 * a + d;
      const j = side(world, xi, yi, d);
      const q = j >= 0 ? nodeOf[j] : -1;
      if (q < 0) {
        nb[k] = -1;
        continue;
      }
      const bb = blobOf[j];
      let R: number;
      let ek = 0;
      if (ba >= 0 && ba === bb) R = BLOB_OHMS;
      else {
        R = 0;
        if (ba >= 0) {
          const t = terminal(s, ba, j % w, (j / w) | 0);
          R += t > 0 ? s.bRPlus[ba] : s.bRMinus[ba];
          ek += 0.5 * t * s.bEmf[ba];
        } else R += 0.5 * ohm[a];
        if (bb >= 0) {
          const t = terminal(s, bb, xi, yi);
          R += t > 0 ? s.bRPlus[bb] : s.bRMinus[bb];
          ek -= 0.5 * t * s.bEmf[bb];
        } else R += 0.5 * ohm[q];
      }
      // A blocking diode is an open circuit: its edges carry nothing (1 / Infinity = 0).
      const gk = 1 / R;
      nb[k] = q;
      g[k] = gk;
      e[k] = ek;
    }
  }
}

/** Flips every diode the last solve shows to be wrong. True if any changed. */
function flipDiodes(world: World, s: Scratch, lo: number, hi: number): boolean {
  const { cellOf, typeOf, nb, g, e, ohm, x } = s;
  let changed = false;
  for (let a = lo; a < hi; a++) {
    const t = typeOf[a];
    if (DIODE_OF[t] === 0) continue;
    // Forward current through it (rightwards plus upwards), and the push across it in that direction.
    let fwd = 0;
    let bias = 0;
    for (let d = 0; d < 4; d++) {
      const k = 4 * a + d;
      const b = nb[k];
      if (b < 0) continue;
      const out = d === 1 || d === 2;
      fwd += (out ? 0.5 : -0.5) * g[k] * (x[a] - x[b] + e[k]);
      bias += out ? -x[b] : x[b];
    }
    if (ohm[a] !== R_OFF) {
      if (fwd < -1e-6) {
        ohm[a] = R_OFF;
        changed = true;
      }
    } else if (bias > 0.01) {
      ohm[a] = cellOhms(world, cellOf[a]);
      changed = true;
    }
  }
  return changed;
}

/** The currents of settled network c, and what they do. */
function act(world: World, s: Scratch, c: number, st: number): void {
  const { w, type, temp, life, volt } = world;
  const { cellOf, typeOf, nb, g, e, ohm, x, amps, lit, blobOf, aggOf, cCount, cPerim, cThrough } = s;
  const lo = s.compStart[c];
  const hi = s.compStart[c + 1];
  for (let a = lo; a < hi; a++) {
    const i = cellOf[a];
    const t = typeOf[a];
    if (type[i] !== t) continue;
    volt[i] = x[a];
    const k = aggOf[a];
    let sum = 0;
    // Current through the cell rightwards, for motors.
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
    // A cell inside a piece of wire carries the piece's current shared across its width.
    const I = cCount[k] > 1 ? cThrough[k] / Math.max(1, (2 * cCount[k]) / Math.max(1, cPerim[k])) : 0.5 * sum;
    amps[i] = I;
    // Batteries and capacitors act as whole blobs, below.
    if (I < 1e-4 || ohm[a] === R_OFF || blobOf[i] >= 0) continue;
    const xi = i % w;
    const yi = (i / w) | 0;
    world.wake(xi, yi);
    const P = I * I * ohm[a];
    temp[i] += P * JOULE * INV_CAP_OF[t] - (temp[i] - AMBIENT) * POWER_COOL;
    if (FILAMENT_OF[t] !== 0) {
      const glow = Math.min(FILAMENT_MAX, AMBIENT + FILAMENT_T * Math.sqrt(Math.sqrt(P)));
      if (temp[i] < glow) temp[i] += (glow - temp[i]) * 0.3;
      if (temp[i] > FILAMENT_MAX) temp[i] = FILAMENT_MAX;
    }
    if (LIT_RGB_OF[t] !== 0) lit[i] = I >= LIT_FULL ? 255 : (I / LIT_FULL) * 255;
    if (I > MAX_AMPS_OF[t]) {
      // Burnt out.
      const T = temp[i];
      world.place(i, BURNS_OUT_INTO_OF[t]);
      temp[i] = T + 200;
      continue;
    }
    if (MOTOR_OF[t] !== 0) {
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
  // Batteries run down and warm with their internal losses; capacitors charge.
  for (let b = s.blobStart[c]; b < s.blobStart[c + 1]; b++) {
    const f = s.bFirst[b];
    const count = s.bCount[b];
    const first = s.blobCells[f];
    const t = type[first];
    const out = s.bAmps[b];
    const mag = out < 0 ? -out : out;
    if (mag < 1e-4) continue;
    const loss = (mag * mag * s.bOhms[b]) / count;
    if (EMF_OF[t] !== 0) {
      // Solar panels never run flat; they only warm.
      const used = SOLAR_OF[t] !== 0 ? 0 : (mag * DRAIN * s.bLen[b]) / count;
      for (let k = f; k < f + count; k++) {
        const cell = s.blobCells[k];
        if (type[cell] !== t) continue;
        temp[cell] += loss * JOULE * INV_CAP_OF[t] * BATTERY_HEAT;
        const u = (used + world.rng.next()) | 0;
        life[cell] = life[cell] > u ? life[cell] - u : 0;
        world.wake(cell % w, (cell / w) | 0);
      }
    } else if (CAPACITOR_OF[t] !== 0) {
      // Current through it charges it against that current: C = CAP_F × cross-section / length.
      const len = s.bLen[b];
      const farads = (CAP_F * count) / (len * len);
      const mv = life[first] - CAP_ZERO + (out * 1000) / (60 * farads);
      const popAt = CAP_POP_V * len * 1000;
      if (mv > popAt || mv < -popAt) {
        for (let k = f; k < f + count; k++) if (type[s.blobCells[k]] === t) pop(world, s.blobCells[k]);
        continue;
      }
      const stored = Math.max(1, Math.min(65535, Math.round(CAP_ZERO + mv)));
      for (let k = f; k < f + count; k++) {
        const cell = s.blobCells[k];
        if (type[cell] !== t) continue;
        life[cell] = stored;
        temp[cell] += loss * JOULE * INV_CAP_OF[t] - (temp[cell] - AMBIENT) * POWER_COOL;
        world.wake(cell % w, (cell / w) | 0);
      }
    }
  }
}

/** Is node a a piece of its own (a load, or anything that acts on its own current)? */
function ownPiece(s: Scratch, a: number): boolean {
  return s.ohm[a] >= OWN_OHMS || OWN_OF[s.typeOf[a]] !== 0;
}

/**
 * Splits nodes lo..hi-1 into pieces, builds the system between pieces and
 * solves it by preconditioned conjugate gradient from the potentials in x.
 * Writes each node's potential back to x. True if the solve settled.
 */
function solvePieces(world: World, s: Scratch, lo: number, hi: number): boolean {
  const { w } = world;
  const { nodeOf, cellOf, nb, g, e, x, aggOf, stack, cFirst, cCount, cPerim, cDiag, cRhs, cX, cR, cZ, cP, cQ, cThrough, eA, eB, eG, eE } = s;
  for (let a = lo; a < hi; a++) aggOf[a] = -1;
  // Pieces: wire and metal joined by plain low-resistance edges; every other node alone.
  let m = 0;
  for (let a = lo; a < hi; a++) {
    if (aggOf[a] >= 0) continue;
    const k = m++;
    cFirst[k] = a;
    cCount[k] = 0;
    cPerim[k] = 0;
    aggOf[a] = k;
    let top = 0;
    stack[top++] = a;
    const alone = ownPiece(s, a);
    while (top > 0) {
      const u = stack[--top];
      cCount[k]++;
      if (alone) break;
      for (let d = 0; d < 4; d++) {
        const kk = 4 * u + d;
        const q = nb[kk];
        // A battery or capacitor is never merged with what it touches: its terminals must stay apart.
        if (q < 0 || aggOf[q] >= 0 || e[kk] !== 0 || g[kk] < MERGE_SIEMENS || ownPiece(s, q) || s.blobOf[cellOf[u]] !== s.blobOf[cellOf[q]]) continue;
        aggOf[q] = k;
        stack[top++] = q;
      }
    }
  }
  // Outline of each piece (for the width its current spreads over), and the edges between pieces.
  let ne = 0;
  for (let k = 0; k < m; k++) {
    cDiag[k] = LEAK;
    cRhs[k] = 0;
    cX[k] = x[cFirst[k]];
  }
  for (let a = lo; a < hi; a++) {
    const A = aggOf[a];
    const i = cellOf[a];
    const xi = i % w;
    const yi = (i / w) | 0;
    for (let d = 0; d < 4; d++) {
      const j = side(world, xi, yi, d);
      const nj = j >= 0 ? nodeOf[j] : -1;
      if (nj < lo || nj >= hi || aggOf[nj] !== A) cPerim[A]++;
      const kk = 4 * a + d;
      const q = nb[kk];
      if (q <= a) continue;
      const B = aggOf[q];
      if (B === A) continue;
      const gk = g[kk];
      if (gk === 0) continue;
      eA[ne] = A;
      eB[ne] = B;
      eG[ne] = gk;
      eE[ne] = e[kk];
      ne++;
      cDiag[A] += gk;
      cDiag[B] += gk;
      cRhs[A] -= gk * e[kk];
      cRhs[B] += gk * e[kk];
    }
  }
  s.pieces = m;
  s.edges = ne;
  // Conjugate gradient, Jacobi preconditioned, on the pieces.
  let iterations = Math.min(MAX_ITERATIONS, Math.max(MIN_ITERATIONS, 3 * m + 20));
  if (iterations * (m + ne) > WORK) iterations = Math.max(MIN_ITERATIONS, (WORK / (m + ne)) | 0);
  let bb = 0;
  for (let k = 0; k < m; k++) {
    cQ[k] = cDiag[k] * cX[k];
    bb += cRhs[k] * cRhs[k];
  }
  for (let k = 0; k < ne; k++) {
    cQ[eA[k]] -= eG[k] * cX[eB[k]];
    cQ[eB[k]] -= eG[k] * cX[eA[k]];
  }
  let rz = 0;
  let rr = 0;
  for (let k = 0; k < m; k++) {
    const r = cRhs[k] - cQ[k];
    cR[k] = r;
    const z = r / cDiag[k];
    cZ[k] = z;
    cP[k] = z;
    rz += r * z;
    rr += r * r;
  }
  const limit = TOLERANCE * TOLERANCE * (bb > 1e-8 ? bb : 1e-8);
  for (let it = 0; it < iterations && rr > limit; it++) {
    for (let k = 0; k < m; k++) cQ[k] = cDiag[k] * cP[k];
    for (let k = 0; k < ne; k++) {
      cQ[eA[k]] -= eG[k] * cP[eB[k]];
      cQ[eB[k]] -= eG[k] * cP[eA[k]];
    }
    let pq = 0;
    for (let k = 0; k < m; k++) pq += cP[k] * cQ[k];
    if (pq <= 0) break;
    const alpha = rz / pq;
    let rz2 = 0;
    rr = 0;
    for (let k = 0; k < m; k++) {
      cX[k] += alpha * cP[k];
      const r = cR[k] - alpha * cQ[k];
      cR[k] = r;
      const z = r / cDiag[k];
      cZ[k] = z;
      rz2 += r * z;
      rr += r * r;
    }
    const beta = rz2 / rz;
    rz = rz2;
    for (let k = 0; k < m; k++) cP[k] = cZ[k] + beta * cP[k];
  }
  for (let a = lo; a < hi; a++) x[a] = cX[aggOf[a]];
  // Current through each piece: half of all the current crossing its edges.
  for (let k = 0; k < m; k++) cThrough[k] = 0;
  for (let k = 0; k < ne; k++) {
    const I = eG[k] * (cX[eA[k]] - cX[eB[k]] + eE[k]);
    const mag = I < 0 ? -I : I;
    cThrough[eA[k]] += 0.5 * mag;
    cThrough[eB[k]] += 0.5 * mag;
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

/** Sets the light level (0..255) of cell i for the renderer (glow paint). */
export function setLit(world: World, i: number, level: number): void {
  scratchFor(world).lit[i] = level;
}

/** Light level (0..255) of every cell from last frame, for the renderer; null before any circuit has run. */
export function litLevels(world: World): Uint8Array | null {
  const s = scratches.get(world);
  return s && s.size === world.size ? s.lit : null;
}

/** The battery or capacitor that cell i belongs to, as last frame saw it, for the inspector. */
export interface PartInfo {
  /** Cells in the blob, and its length along its axis. */
  cells: number;
  length: number;
  /** Its voltage when nothing is drawn, the voltage across its terminals now, and the current through it. */
  emf: number;
  volts: number;
  amps: number;
  /** Which way it pushes: its + side is on the right (across) or at the top (up). */
  upright: boolean;
  /** Nearly all its voltage is lost inside it: nothing in the loop slows the current. */
  shorted: boolean;
  /** It touches the circuit on both sides, so current can pass through it. */
  connected: boolean;
}

export function partInfo(world: World, i: number): PartInfo | null {
  const s = scratches.get(world);
  if (!s || s.size !== world.size) return null;
  const b = s.blobOf[i];
  if (b < 0) return null;
  const emf = Math.abs(s.bEmf[b]);
  const amps = Math.abs(s.bAmps[b]);
  return {
    cells: s.bCount[b],
    length: s.bLen[b],
    emf,
    volts: Math.abs(s.bVolts[b]),
    amps,
    upright: s.bAxis[b] === 1,
    shorted: emf > 0 && amps > 0.5 && Math.abs(s.bVolts[b]) < emf * SHORT_SHARE,
    connected: s.bVolts[b] !== 0 || amps > 1e-4,
  };
}

/** Battery charge left in cell i's blob, 0..1 (for the inspector). */
export function batteryCharge(world: World, i: number): number {
  return world.life[i] / LIFE_OF[world.type[i]];
}
