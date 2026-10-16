import { HAS_REACTION, KEEP, P_GAS, P_MIN_T, P_OUT_A, P_OUT_B, P_PROB, P_RULE, R_ABSORB, R_COMBUST, R_CORRODE, R_DISSOLVE } from './chem';
import {
  BLAST_POWER_OF,
  BUOY_DIR_OF,
  DIRT,
  ELECTRIC_OF,
  HYDROGEN,
  OXYGEN,
  PLANT,
  POWER_EVERY_OF,
  SALT,
  SEED,
  SPARK,
  CONC_UNIT,
  IMPACT_VY_OF,
  POROUS_MAX_OF,
  SOLUBLE_MAX_OF,
  SOLVENT_OF,
  WATER,
  BUOY_P_OF,
  BURN_ENERGY_OF,
  BURN_INTO_OF,
  RESIDUE_OF,
  DISPERSION_OF,
  ELEMENTS,
  DRIFT_OF,
  ELEMENT_COUNT,
  EMPTY,
  ENTER_P,
  FIRE,
  FLAME_T_OF,
  FUEL_OF,
  GRAVITY_OF,
  IGNITION_OF,
  OXIDISER_OF,
  PHASE_OF,
  PH_ENERGY,
  PH_GAS,
  PH_LIQUID,
  PH_POWDER,
  SMOKE,
  VENTS_OF,
  VMAX_OF,
  VY_UNIT,
} from './elements';
import { airPass, explode } from './blast';
import { heatStep } from './heat';
import { CHUNK_SHIFT, type World } from './world';

/**
 * Sub-cell offsets 0..31 in bit-reversed order. Speeds are in 1/32 cell per
 * frame; adding DITHER[(frame + shade) & 31] before dividing by 32 moves a
 * cell the right average distance, spread evenly over frames (a cell at half
 * a cell per frame moves every other frame, not 16 frames on, 16 off), with
 * no RNG and no extra per-cell field.
 */
const DITHER = Uint8Array.from({ length: 32 }, (_, n) => {
  let r = 0;
  for (let b = 0; b < 5; b++) r |= ((n >> b) & 1) << (4 - b);
  return r;
});
const SHIFT = Math.log2(VY_UNIT);
/** A grain that finds a slope open starts sliding at 3/4 cell per frame, so avalanches flow, not crawl. */
const SLIDE_START = (VY_UNIT * 3) >> 2;
/** Top speed while sinking through a liquid: drag holds it to 1/4 cell per frame. */
const SINK_VMAX = VY_UNIT >> 2;
const N = ELEMENT_COUNT;
/** Elements that are acids (they do the eating in corrosion). */
const ELEMENTS_ACIDIC = Uint8Array.from({ length: N }, (_, id) => ((ELEMENTS[id].acidity ?? 0) >= 0.3 ? 1 : 0));
/** How far a liquid surface cell looks sideways for a drop. Bounds the cost on wide lakes. */
const FLOW_SEARCH = 160;
/** Speed a liquid keeps after a sideways move: half a cell per frame. */
const FLOW_VY = VY_UNIT >> 1;

/**
 * Cell pass: one simulation frame.
 * Rows run bottom to top. The horizontal direction flips per row and per
 * frame so nothing drifts to one side. A cell that moved this frame carries
 * the frame's stamp and is skipped if the scan reaches it again.
 * Only awake chunks run; within a row, the cells of sleeping chunks are
 * skipped, so with every chunk awake the order is the same as a full scan.
 * A chunk stays awake while anything in it moved or tried to move.
 * Movement only swaps cells, so the cell count of each element never changes.
 * No allocations in here.
 */
export function step(world: World): void {
  world.beginFrame();
  const { w, h, cw, awake } = world;
  const st = world.currentStamp();
  for (let y = h - 1; y >= 0; y--) {
    const ltr = ((y + world.frame) & 1) === 0;
    const crow = (y >> CHUNK_SHIFT) * cw;
    for (let kc = 0; kc < cw; kc++) {
      const cx = ltr ? kc : cw - 1 - kc;
      if (awake[crow + cx] === 0) continue;
      const x0 = cx << CHUNK_SHIFT;
      const x1 = Math.min(x0 + (1 << CHUNK_SHIFT), w);
      if (ltr) for (let x = x0; x < x1; x++) updateCell(world, x, y, st);
      else for (let x = x1 - 1; x >= x0; x--) updateCell(world, x, y, st);
    }
  }
  heatStep(world);
  airPass(world, st);
  world.frame++;
}

function updateCell(world: World, x: number, y: number, st: number): void {
  const i = y * world.w + x;
  const t = world.type[i];
  const ph = PHASE_OF[t];
  if (ph === 0 || world.stamp[i] === st) return;
  // Electricity and life first: they act in place.
  if (t === SPARK) {
    updateSpark(world, x, y, i, st);
    return;
  }
  if (POWER_EVERY_OF[t] !== 0) powerSource(world, x, y, t);
  if (world.charge[i] !== 0) updateCharge(world, x, y, i, st);
  if (t === PLANT && world.life[i] !== 0) grow(world, x, y, i);
  else if (t === SEED && world.vy[i] === 0) sprout(world, x, y, i);
  if (world.type[i] !== t) return;
  // One pair-table lookup with a random neighbour; a cell that reacted does not also move.
  if (HAS_REACTION[t] !== 0 && react(world, x, y, i, st)) return;
  if (ph === PH_POWDER || ph === PH_LIQUID) updateMover(world, x, y, i, st, ph === PH_LIQUID);
  else if (ph === PH_GAS) updateGas(world, x, y, i, st);
  else if (ph === PH_ENERGY) updateFire(world, x, y, i, st);
}

// ---- Electricity ----------------------------------------------------------------

/** A pulse lasts this many frames in a cell; it passes on only at the peak, then the cell rests. */
const CHARGE_PEAK = 4;
/** °C a pulse warms the cell it runs through. */
const CHARGE_HEAT = 4;
/** Salt (concentration 0..255) water needs to carry charge. */
const SALT_TO_CONDUCT = 8;

/** True if cell j can take a new charge now: a conductor (or salty water) at rest. */
function canCharge(world: World, j: number): boolean {
  if (world.charge[j] !== 0) return false;
  const t = world.type[j];
  if (ELECTRIC_OF[t] !== 0) return true;
  return SOLVENT_OF[t] !== 0 && world.solute[j] === SALT && world.conc[j] >= SALT_TO_CONDUCT;
}

/**
 * What a pulse does to the cells touching (x, y): charges conductors at rest
 * (stamped so they pass it on next frame, not again this one), sets off
 * explosives and heats anything flammable enough to light it.
 */
function zap(world: World, x: number, y: number, st: number): void {
  for (let d = 0; d < 4; d++) {
    const j = neighbour(world, x, y, d);
    if (j < 0) continue;
    if (canCharge(world, j)) {
      world.charge[j] = CHARGE_PEAK + 1;
      world.stamp[j] = st;
      world.wake(j % world.w, (j / world.w) | 0);
      continue;
    }
    const tj = world.type[j];
    if (BLAST_POWER_OF[tj] > 0) explode(world, j % world.w, (j / world.w) | 0);
    else if (IGNITION_OF[tj] !== Infinity) world.temp[j] += 350;
  }
}

/** A charged cell: at the peak it passes the pulse on; every frame it warms; salty water splits. */
function updateCharge(world: World, x: number, y: number, i: number, st: number): void {
  const c = world.charge[i];
  if (c === CHARGE_PEAK) {
    zap(world, x, y, st);
    world.temp[i] += CHARGE_HEAT;
    // Electrolysis: current through salty water splits it into hydrogen or oxygen.
    if (SOLVENT_OF[world.type[i]] !== 0 && (world.rng.nextU32() & 7) === 0) {
      const T = world.temp[i];
      world.place(i, world.rng.nextU32() & 1 ? HYDROGEN : OXYGEN);
      world.temp[i] = T;
    }
  }
  world.charge[i] = c - 1;
  world.wake(x, y);
}

/** A spark lives a moment: it jumps into whatever conductor it touches, or fades. */
function updateSpark(world: World, x: number, y: number, i: number, st: number): void {
  world.wake(x, y);
  for (let d = 0; d < 4; d++) {
    const j = neighbour(world, x, y, d);
    if (j >= 0 && canCharge(world, j)) {
      zap(world, x, y, st);
      world.place(i, EMPTY);
      return;
    }
  }
  if (--world.life[i] === 0) world.place(i, EMPTY);
}

/** A power source pulses its touching conductors every few frames. */
function powerSource(world: World, x: number, y: number, t: number): void {
  world.wake(x, y);
  if (world.frame % POWER_EVERY_OF[t] === 0) zap(world, x, y, world.currentStamp());
}

// ---- Life -------------------------------------------------------------------------

/** Frames a seed needs on wet dirt, on average, before it sprouts. */
const SPROUT_EVERY = 45;
/** Cells above a growing tip that must be open sky for it to grow. */
const SKY = 24;

/** True if the column above (x, y) is open to the sky (only air, gas or plant for SKY cells). */
function openSky(world: World, x: number, y: number): boolean {
  for (let k = 1; k <= SKY && y - k >= 0; k++) {
    const t = world.type[(y - k) * world.w + x];
    if (t !== EMPTY && t !== PLANT && PHASE_OF[t] !== PH_GAS) return false;
  }
  return true;
}

/** A seed on wet dirt with sky above sprouts: it becomes a plant with a growth budget, drinking from the dirt. */
function sprout(world: World, x: number, y: number, i: number): void {
  if (y + 1 >= world.h) return;
  const below = i + world.w;
  if (world.type[below] !== DIRT || world.conc[below] === 0 || world.solute[below] !== WATER) return;
  world.wake(x, y);
  if (world.rng.nextU32() % SPROUT_EVERY !== 0 || !openSky(world, x, y)) return;
  world.conc[below] = world.conc[below] > 24 ? world.conc[below] - 24 : 0;
  if (world.conc[below] === 0) world.solute[below] = 0;
  world.type[i] = PLANT;
  world.life[i] = 18 + (world.rng.nextU32() % 24);
}

/** A growing tip adds a cell above (sometimes a side shoot) while it has budget and sky. */
function grow(world: World, x: number, y: number, i: number): void {
  world.wake(x, y);
  const r = world.rng.nextU32();
  if ((r & 15) !== 0 || y === 0) return;
  const budget = world.life[i];
  if (!openSky(world, x, y)) return;
  const up = i - world.w;
  // Usually straight up; now and then a slanted shoot to one side.
  const side = (r >>> 4) % 5 === 0 ? ((r >>> 8) & 1 ? 1 : -1) : 0;
  const j = side !== 0 && x + side >= 0 && x + side < world.w ? up + side : up;
  if (world.type[j] !== EMPTY) return;
  world.place(j, PLANT);
  world.life[j] = budget - 1;
  world.life[i] = side !== 0 && budget > 6 ? budget >> 1 : 0;
}

/** Index of the neighbour of (x, y) in direction d (0 up, 1 right, 2 down, 3 left), or -1 off the grid. */
function neighbour(world: World, x: number, y: number, d: number): number {
  const { w, h } = world;
  if (d === 0) return y > 0 ? (y - 1) * w + x : -1;
  if (d === 1) return x + 1 < w ? y * w + x + 1 : -1;
  if (d === 2) return y + 1 < h ? (y + 1) * w + x : -1;
  return x > 0 ? y * w + x - 1 : -1;
}

/** Replaces cell i with element t, keeping its temperature (a reaction product starts where its parent was). */
function become(world: World, i: number, t: number): void {
  const T = world.temp[i];
  world.place(i, t);
  if (t !== EMPTY) world.temp[i] = T;
}

/** Sets cell i burning: it becomes fire that remembers its fuel. */
function ignite(world: World, i: number, fuel: number): void {
  world.type[i] = FIRE;
  world.solute[i] = fuel;
  world.life[i] = FUEL_OF[fuel] || 30;
  world.vy[i] = 0;
  if (world.temp[i] < FLAME_T_OF[fuel] * 0.8) world.temp[i] = FLAME_T_OF[fuel] * 0.8;
}

/**
 * Looks up the pair table for this cell and one random neighbour. A rule
 * whose temperature condition holds keeps the chunk awake (a reaction
 * skipped by chance must get another try). Returns true if it reacted.
 */
function react(world: World, x: number, y: number, i: number, st: number): boolean {
  const { type, temp } = world;
  const r = world.rng.nextU32();
  const j = neighbour(world, x, y, r & 3);
  if (j < 0) return false;
  const a = type[i];
  const k = a * ELEMENT_COUNT + type[j];
  const rule = P_RULE[k];
  if (rule === 0 || temp[i] < P_MIN_T[k]) return false;
  // Only a loose flame (out in the air) lights fuel by touch; a burning cell's
  // neighbours must heat up and meet air themselves, or they would light and
  // smother over and over.
  if (rule === R_COMBUST && type[j] === FIRE && world.solute[j] !== 0) return false;
  // Wet things do not catch fire until they dry out.
  if (rule === R_COMBUST && world.conc[i] !== 0 && SOLVENT_OF[world.solute[i]] !== 0) return false;
  const { solute, conc } = world;
  // Solutions: the host must have room (and hold nothing else), or nothing can happen.
  let host = -1;
  let guest = -1;
  if (rule === R_DISSOLVE || rule === R_ABSORB) {
    host = rule === R_DISSOLVE ? (SOLVENT_OF[a] !== 0 ? i : j) : POROUS_MAX_OF[a] !== 0 ? i : j;
    guest = host === i ? j : i;
    const g = type[guest];
    const max = rule === R_DISSOLVE ? SOLUBLE_MAX_OF[g] : POROUS_MAX_OF[type[host]];
    if ((solute[host] !== 0 && solute[host] !== g) || conc[host] + CONC_UNIT > max) return false;
  }
  world.wake(x, y);
  // Acid that already holds dissolved metal is weaker: its chance falls as it fills.
  const acid = ELEMENTS_ACIDIC[a] !== 0 ? i : j;
  const p = rule === R_CORRODE ? (P_PROB[k] * (255 - conc[acid])) >> 8 : P_PROB[k];
  if (((r >>> 8) & 255) >= p) return false;
  if (rule === R_COMBUST) {
    // Explosives do not burn: they go off.
    if (BLAST_POWER_OF[a] > 0) explode(world, x, y);
    else ignite(world, i, a);
  } else if (host >= 0) {
    // The guest cell moves into the host: dissolved or soaked up.
    solute[host] = type[guest];
    conc[host] += CONC_UNIT;
    world.place(guest, EMPTY);
    world.stamp[j] = st;
  } else if (rule === R_CORRODE) {
    // The acid takes the eaten cell into itself and weakens; full, it is spent into plain water carrying it.
    const target = acid === i ? j : i;
    const eaten = type[target];
    become(world, target, EMPTY);
    if (P_GAS[k] !== 0) become(world, target, P_GAS[k]);
    if (conc[acid] + 85 > 255) {
      const T = world.temp[acid];
      world.place(acid, WATER);
      world.temp[acid] = T;
      solute[acid] = eaten;
      conc[acid] = 255;
    } else {
      solute[acid] = eaten;
      conc[acid] += 85;
    }
    world.stamp[j] = st;
  } else {
    const outA = P_OUT_A[k];
    const outB = P_OUT_B[k];
    if (outA !== KEEP) become(world, i, outA);
    if (outB !== KEEP) become(world, j, outB);
    const gas = P_GAS[k];
    if (gas !== 0) {
      if (type[j] === EMPTY) become(world, j, gas);
      else if (type[i] === EMPTY) become(world, i, gas);
    }
    world.stamp[j] = st;
  }
  world.stamp[i] = st;
  world.wake(j % world.w, (j / world.w) | 0);
  return true;
}

/**
 * Gases move with their buoyancy against air: lighter ones rise, heavier
 * ones (oxygen) sink, by chance per frame so plumes look loose. Blocked,
 * they slip diagonally, else drift sideways. Into another gas they swap
 * when that makes the heavier one lower. Venting gases (smoke) leave the
 * world at the top edge. A gas never fully rests, so its chunk stays awake.
 */
function updateGas(world: World, x: number, y: number, i: number, st: number): void {
  const { w, h, type, rng } = world;
  const t = type[i];
  world.wake(x, y);
  if (y === 0 && VENTS_OF[t] !== 0) {
    world.place(i, EMPTY);
    return;
  }
  const r = rng.nextU32();
  const dir = BUOY_DIR_OF[t];
  const ny = y + dir;
  if (ny >= 0 && ny < h && (r & 255) < BUOY_P_OF[t]) {
    const j = i + dir * w;
    const tj = type[j];
    // Into empty space, or past a gas it should not sit behind (heavier above a lighter, or the reverse).
    const pass = tj === EMPTY || (PHASE_OF[tj] === PH_GAS && (dir < 0 ? densityOver(tj, t) : densityOver(t, tj)));
    if (pass) {
      moveTo(world, i, j, 0, st);
      world.wake(x, ny);
      return;
    }
    const dx = r & 256 ? 1 : -1;
    if (x + dx >= 0 && x + dx < w && type[j + dx] === EMPTY) {
      moveTo(world, i, j + dx, 0, st);
      world.wake(x + dx, ny);
      return;
    }
  }
  const sx = r & 512 ? 1 : -1;
  if ((r & 3072) === 0 && x + sx >= 0 && x + sx < w && type[i + sx] === EMPTY) {
    moveTo(world, i, i + sx, 0, st);
    world.wake(x + sx, y);
  }
}

/** True if element a is denser than element b (both gases). */
function densityOver(a: number, b: number): boolean {
  return BUOY_DIR_OF[a] > BUOY_DIR_OF[b] || (BUOY_DIR_OF[a] === BUOY_DIR_OF[b] && BUOY_P_OF[a] * BUOY_DIR_OF[a] > BUOY_P_OF[b] * BUOY_DIR_OF[b]);
}

/** Chance (of 256) per frame that a burning cell turns a touching oxidiser into smoke. */
const CONSUME_P = 12;
/** Oxidiser strength of air. */
const AIR_OXIDISER = OXIDISER_OF[EMPTY];
/** Chance (of 256) per frame that a burning cell sends a flame up into open air above. */
const FLAME_P = 140;

/**
 * Fire. A burning cell (solute = its fuel) stays put, holds itself at its
 * flame temperature while it has an oxidiser next to it, pushes radiant
 * heat into its neighbours (so fire spreads), uses up fuel
 * (faster in pure oxygen), turns touching air into smoke now and then (so a
 * sealed box runs out of air), and throws loose flames upwards. With no
 * oxidiser it smothers, and if something cools it below its ignition point
 * it goes out: both leave the unburnt fuel. Burnt out, it leaves ash or
 * smoke. A loose flame (no fuel) rises, flickers and dies within a moment.
 */
function updateFire(world: World, x: number, y: number, i: number, st: number): void {
  const { w, type, temp, life, solute, rng } = world;
  world.wake(x, y);
  const r = rng.nextU32();
  const fuel = solute[i];

  if (fuel === 0) {
    // Loose flame: short-lived, rising, heats what it touches by conduction.
    const L = life[i] - 1;
    if (L <= 0) {
      world.place(i, (r & 255) < 40 ? SMOKE : EMPTY);
      return;
    }
    life[i] = L;
    if (y > 0) {
      // Rise, often slanting, so flames lick across the surface next to them.
      const up = i - w;
      const dx = r & 65536 ? 1 : -1;
      const slant = ((r >>> 16) & 255) < 110;
      if (slant && x + dx >= 0 && x + dx < w && type[up + dx] === EMPTY) {
        moveTo(world, i, up + dx, 0, st);
        world.wake(x + dx, y - 1);
        return;
      }
      if (type[up] === EMPTY && ((r >>> 8) & 255) < 200) {
        moveTo(world, i, up, 0, st);
        world.wake(x, y - 1);
      }
    }
    return;
  }

  // Burning cell: find the strongest oxidiser touching it.
  let ox = 0;
  let oxJ = -1;
  for (let d = 0; d < 4; d++) {
    const j = neighbour(world, x, y, (r + d) & 3);
    if (j < 0) continue;
    // A loose flame is surrounded by air; it does not starve its own fire.
    const o = type[j] === FIRE && solute[j] === 0 ? AIR_OXIDISER : OXIDISER_OF[type[j]];
    if (o > ox) {
      ox = o;
      oxJ = j;
    }
  }
  if (ox === 0 || temp[i] < IGNITION_OF[fuel] - 20) {
    // Smothered or cooled: the fire goes out and the fuel is left.
    if (ox === 0 && ((r >>> 8) & 255) >= 10) return;
    type[i] = fuel;
    solute[i] = 0;
    life[i] = 0;
    return;
  }
  temp[i] += (FLAME_T_OF[fuel] * (0.8 + ox) - temp[i]) * 0.1;
  // Radiant heat into everything touching it: this is what spreads a fire.
  const push = BURN_ENERGY_OF[fuel];
  for (let d = 0; d < 4; d++) {
    const j = neighbour(world, x, y, d);
    if (j >= 0 && type[j] !== FIRE) temp[j] += push;
  }
  const L = life[i] - (ox >= 0.5 ? 3 : 1);
  if (((r >>> 8) & 255) < CONSUME_P && type[oxJ] !== FIRE) {
    become(world, oxJ, SMOKE);
    world.temp[oxJ] = temp[i] * 0.5;
  }
  if (y > 0 && type[i - w] === EMPTY && ((r >>> 16) & 255) < FLAME_P) {
    const up = i - w;
    world.place(up, FIRE);
    life[up] = 8 + ((r >>> 24) & 15);
    temp[up] = FLAME_T_OF[fuel];
    world.stamp[up] = st;
  }
  if (L <= 0) {
    // Burnt out: a little residue (ash) stays, the rest has gone off as gas.
    const T = temp[i];
    world.place(i, (r >>> 24) <= RESIDUE_OF[fuel] ? BURN_INTO_OF[fuel] : EMPTY);
    if (type[i] !== EMPTY) temp[i] = T;
    return;
  }
  life[i] = L;
}

/** Swaps every field of cells i and j. */
function swap(world: World, i: number, j: number): void {
  const { type, vy, stamp, shade, temp, life, solute } = world;
  const t = type[i];
  type[i] = type[j];
  type[j] = t;
  const l = life[i];
  life[i] = life[j];
  life[j] = l;
  const so = solute[i];
  solute[i] = solute[j];
  solute[j] = so;
  const cc = world.conc[i];
  world.conc[i] = world.conc[j];
  world.conc[j] = cc;
  const T = temp[i];
  temp[i] = temp[j];
  temp[j] = T;
  const v = vy[i];
  vy[i] = vy[j];
  vy[j] = v;
  const s = stamp[i];
  stamp[i] = stamp[j];
  stamp[j] = s;
  const c = shade[i];
  shade[i] = shade[j];
  shade[j] = c;
}

/**
 * True if element t may move into cell j this try: always into empty space,
 * by chance into a lighter liquid (density swap), never into anything else.
 */
function canEnter(world: World, t: number, j: number): boolean {
  const p = ENTER_P[t * N + world.type[j]];
  if (p === 255) return true;
  if (p === 0) return false;
  return (world.rng.nextU32() & 255) < p;
}

/**
 * Moves cell i to j (swapping with what was there), sets its speed and
 * stamps both cells, so a displaced liquid does not move again this frame.
 */
function moveTo(world: World, i: number, j: number, v: number, st: number): void {
  swap(world, i, j);
  world.vy[j] = v;
  world.stamp[j] = st;
  world.stamp[i] = st;
}

/**
 * Powders and liquids.
 * 1. Fall straight down through empty space, speeding up by the element's
 *    gravity up to its top speed. On landing, half the speed is kept.
 * 2. Below is a lighter liquid: sink into it by chance (density swap),
 *    held to a slow speed by drag. The liquid moves up in exchange.
 * 3. Slide one cell down-left or down-right (random order if both are open).
 *    Powders ease in: sliding starts at 3/4 cell per frame, so grains do not
 *    snap. Liquids slide at once.
 * 4. Liquids only: look along the row (through empty cells or lighter
 *    liquids) for a drop, up to FLOW_SEARCH cells away, and move towards the
 *    nearest one by at most `dispersion` cells per frame. With no drop the
 *    liquid rests, so lakes settle flat (within 1 cell) and stop moving.
 *    Looking further than `dispersion` matters: with a short look, a surface
 *    of 1-cell steps wider than `dispersion` never moves and lakes keep a slope.
 * Grid edges act as walls.
 */
function updateMover(world: World, x: number, y: number, i: number, st: number, liquid: boolean): void {
  const { w, h, type, vy, stamp } = world;
  if (y + 1 >= h) {
    if (vy[i] !== 0) vy[i] = 0;
    return;
  }
  const t = type[i];
  const g = GRAVITY_OF[t];
  const sub = DITHER[(world.frame + world.shade[i]) & 31];

  // 1. Free fall.
  const below = i + w;
  const tb = type[below];
  if (tb === EMPTY) {
    // Light powders (ash, sawdust) flutter: now and then they drift a cell sideways.
    const drift = DRIFT_OF[t];
    if (drift !== 0) {
      const r = world.rng.nextU32();
      const dx = r & 256 ? 1 : -1;
      if ((r & 255) < drift && x + dx >= 0 && x + dx < w && type[below + dx] === EMPTY && type[i + dx] === EMPTY) {
        moveTo(world, i, below + dx, vy[i] >> 1, st);
        world.wake(x, y);
        world.wake(x + dx, y + 1);
        return;
      }
    }
    let v = vy[i] + g;
    if (v > VMAX_OF[t]) v = VMAX_OF[t];
    const dist = (v + sub) >> SHIFT;
    if (dist === 0) {
      // Still gathering speed; moves on a later frame.
      vy[i] = v;
      world.wake(x, y);
      return;
    }

    let j = below;
    let ny = y + 1;
    let moved = 1;
    while (moved < dist && ny + 1 < h && type[j + w] === EMPTY) {
      j += w;
      ny++;
      moved++;
    }
    if (moved < dist) {
      // Stopped short. Behind a cell that is also falling this frame, match
      // its speed so streams stay together; on anything at rest, land and
      // keep half the speed for sliding.
      const next = j + w;
      if (ny + 1 < h && stamp[next] === st && vy[next] > 0) {
        if (vy[next] < v) v = vy[next];
      } else {
        // Landed hard: shock-sensitive explosives go off.
        if (IMPACT_VY_OF[t] !== 0 && v >= IMPACT_VY_OF[t]) {
          swap(world, i, j);
          explode(world, x, ny);
          return;
        }
        v >>= 1;
      }
    }
    swap(world, i, j);
    vy[j] = v;
    stamp[j] = st;
    world.wake(x, y);
    world.wake(x, ny);
    return;
  }

  // The cell below is in free fall but has not moved yet this frame (still
  // gathering speed): fall with it rather than treat it as ground.
  const pb = PHASE_OF[tb];
  if (vy[below] > 0 && y + 2 < h && type[below + w] === EMPTY && (pb === PH_POWDER || pb === PH_LIQUID)) {
    let v = vy[i] + g;
    if (v > vy[below]) v = vy[below];
    vy[i] = v;
    world.wake(x, y);
    return;
  }

  // Same liquid below but carrying less in solution: the saltier cell is heavier
  // and sinks, faster the bigger the difference.
  if (liquid && tb === t && world.conc[i] > world.conc[below] + 2) {
    if ((world.rng.nextU32() & 255) < 24 + (world.conc[i] - world.conc[below])) moveTo(world, i, below, 0, st);
    world.wake(x, y);
    world.wake(x, y + 1);
    return;
  }

  // 2. Sink into a lighter liquid.
  if (ENTER_P[t * N + tb] !== 0) {
    let v = vy[i] + g;
    if (v > SINK_VMAX) v = SINK_VMAX;
    if ((v + sub) >> SHIFT !== 0 && canEnter(world, t, below)) {
      moveTo(world, i, below, v, st);
      world.wake(x, y + 1);
    } else {
      // Not this frame (speed or chance): stay awake to try again.
      vy[i] = v;
    }
    world.wake(x, y);
    return;
  }

  // 3. Slide down a slope. A wet powder sticks: it only slides where the drop is
  // at least two cells deep, so wet sand holds steeper slopes.
  const wet = !liquid && world.conc[i] >= 32;
  const deep = (j: number): boolean => !wet || (y + 2 < h && type[j + w] === EMPTY);
  const openL = x > 0 && ENTER_P[t * N + type[below - 1]] !== 0 && deep(below - 1);
  const openR = x + 1 < w && ENTER_P[t * N + type[below + 1]] !== 0 && deep(below + 1);
  if (openL || openR) {
    let v = vy[i];
    if (!liquid) {
      v = (v < SLIDE_START ? SLIDE_START : v) + g;
      if (v > VY_UNIT) v = VY_UNIT;
      if ((v + sub) >> SHIFT === 0) {
        vy[i] = v;
        world.wake(x, y);
        return;
      }
    }
    let dx: number;
    if (openL && openR) dx = world.rng.nextU32() & 1 ? 1 : -1;
    else dx = openL ? -1 : 1;
    // Awake either way: a slide into a liquid skipped by chance may succeed next frame.
    world.wake(x, y);
    if (canEnter(world, t, below + dx)) {
      moveTo(world, i, below + dx, v > VY_UNIT ? VY_UNIT : v, st);
      world.wake(x + dx, y + 1);
      return;
    }
  }

  // 4. Liquids: flow sideways towards the nearest drop.
  if (liquid) {
    // Surface cells (open above) may look past cells of the same liquid, so
    // the whole surface layer flows, not just the cell at a step's edge.
    const surface = y === 0 || ENTER_P[t * N + type[i - w]] !== 0;
    const dl = findDrop(world, t, x, y, i, -1, surface);
    const dr = findDrop(world, t, x, y, i, 1, surface);
    if (dl !== 0 || dr !== 0) {
      let dir: number;
      let dist: number;
      if (dl !== 0 && (dr === 0 || dl < dr || (dl === dr && world.rng.nextU32() & 1))) {
        dir = -1;
        dist = dl;
      } else {
        dir = 1;
        dist = dr;
      }
      // Farthest cell this liquid can enter, within reach, towards the drop.
      const base = t * N;
      for (let k = dist < DISPERSION_OF[t] ? dist : DISPERSION_OF[t]; k > 0; k--) {
        const j = i + dir * k;
        if (type[j] !== t && ENTER_P[base + type[j]] !== 0) {
          // Keep some speed so it drops at once on reaching the edge.
          moveTo(world, i, j, FLOW_VY, st);
          world.wake(x, y);
          world.wake(x + dir * k, y);
          return;
        }
      }
      // A drop is in sight but the way is full this frame: try again next frame.
      world.wake(x, y);
    }
  }

  // Liquids mix what they carry slowly; powders wick soaked-up liquid faster.
  diffuse(world, x, y, i, liquid ? 63 : 7);
  if (vy[i] !== 0) vy[i] = 0;
}

/**
 * Mixing: a resting cell now and then (1 frame in mask + 1) shares a quarter
 * of the difference in what it carries with a random neighbour of the same
 * element. Salt spreads slowly through water; water wicks quickly through
 * sand or sawdust. Small differences are left alone so things can sleep.
 */
function diffuse(world: World, x: number, y: number, i: number, mask: number): void {
  const { type, solute, conc, rng } = world;
  if (conc[i] === 0) return;
  const r = rng.nextU32();
  if ((r & mask) !== 0) return;
  const j = neighbour(world, x, y, (r >>> 6) & 3);
  if (j < 0 || type[j] !== type[i]) return;
  const si = solute[i];
  const sj = solute[j];
  if (si !== 0 && sj !== 0 && si !== sj) return;
  const d = conc[i] - conc[j];
  if (d < 8 && d > -8) return;
  const m = d >> 2;
  conc[i] -= m;
  conc[j] += m;
  const s = si || sj;
  solute[i] = conc[i] ? s : 0;
  solute[j] = conc[j] ? s : 0;
  world.wake(x, y);
}

/**
 * Distance (1..FLOW_SEARCH) along the row in direction dir to the nearest
 * drop for liquid t: a cell t can enter (empty, or a lighter liquid) with
 * another such cell under it, reached through such cells only (and, for a
 * surface cell, past cells of t itself). Flowing through lighter liquids
 * lets water level out under oil. 0 if none.
 */
function findDrop(world: World, t: number, x: number, y: number, i: number, dir: number, surface: boolean): number {
  const { w, type } = world;
  const lowerRow = y + 1 < world.h;
  const base = t * N;
  for (let k = 1; k <= FLOW_SEARCH; k++) {
    const nx = x + dir * k;
    if (nx < 0 || nx >= w) return 0;
    const c = i + dir * k;
    const tc = type[c];
    if (tc === t) {
      if (surface) continue;
      return 0;
    }
    if (ENTER_P[base + tc] === 0) return 0;
    if (lowerRow && ENTER_P[base + type[c + w]] !== 0) return k;
  }
  return 0;
}
