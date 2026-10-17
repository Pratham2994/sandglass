import { HAS_REACTION, KEEP, P_GAS, P_HEAT, P_MIN_T, P_OUT_A, P_OUT_B, P_PROB, P_RULE, R_ABSORB, R_COMBUST, R_CORRODE, R_DISSOLVE, R_FERMENT, R_QUENCH } from './chem';
import {
  BLAST_POWER_OF,
  BUOY_DIR_OF,
  ELECTRIC_OF,
  HYDROGEN,
  OXYGEN,
  EMF_OF,
  CAPACITOR_OF,
  CAP_ZERO,
  GATE_OF,
  GATE_THERMOSTAT,
  VALVE_OF,
  GLOW_PAINT_OF,
  LIGHT_INTO_OF,
  INFECTS_OF,
  CURES_OF,
  COLONY_OF,
  COLONY_ON,
  COLONY_NEEDS_OF,
  COLONY_GAS_OF,
  COLONY_HOST,
  HAS_HOST_OF,
  TOUCHY_OF,
  DARK_GROWER_OF,
  SALT,
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
  FLASH_OF,
  BLOW_X_OF,
  BLOW_Y_OF,
  CHARGE_HEAT_OF,
  COOL_RATE_OF,
  AMBIENT,
  CLONES_OF,
  DEVICE_OF,
  GROW_BUDGET_OF,
  HOLD_T_OF,
  LEAF_INTO_OF,
  RAIN_COLD_OF,
  DIES_INTO_OF,
  BOLT_OF,
  BURSTS_INTO_OF,
  LAUNCHES_AS_OF,
  LIGHTNING_FROM_OF,
  SINKS_OF,
  LIGHTNING,
  PLAGUE,
  NEUTRON,
  PLASMA,
  FISSILE_OF,
  ABSORBS_N_OF,
  PARTICLE_OF,
  DECAYS_INTO_OF,
  DECAY_P_OF,
  CRYSTAL_OF,
  INDICATOR_ACID_OF,
  INDICATOR_BASE_OF,
  ACIDITY_OF,
  EATS,
  HABITAT_OF,
  BODY_OF,
  CURE_FRAMES_OF,
  CURES_INTO_OF,
  FERMENT_FROM_OF,
  MAGNET_OF,
  RAIN_INTO_OF,
  TOP_INTO_OF,
  WATER_LOSS_OF,
  VOIDS_OF,
  WALL,
  NO_FLAME_OF,
  SELF_FED_OF,
  UP_T,
  GROWS_INTO_OF,
  WITHER_INTO_OF,
  OXIDISER_OF,
  PHASE_OF,
  PH_ENERGY,
  PH_GAS,
  PH_LIQUID,
  PH_POWDER,
  PH_SOLID,
  SMOKE,
  VENTS_OF,
  FADES_OF,
  VMAX_OF,
  VY_UNIT,
} from './elements';
import { airPass, explode } from './blast';
import { circuitStep, pullIron } from './circuit';
import { structureStep } from './structure';
import { lightAt } from './light';
import { setLit } from './circuit';
import { GAS_SWELL, SWELL_RADIUS, heatStep } from './heat';
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
  structureStep(world);
  circuitStep(world);
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
  if (BOLT_OF[t] !== 0) {
    strike(world, x, y, i, t);
    return;
  }
  if (PARTICLE_OF[t] !== 0) {
    particle(world, x, y, i);
    return;
  }
  if (FISSILE_OF[t] !== 0 && fission(world, x, y, i)) return;
  // Things that change by themselves now and then (foam pops).
  if (DECAY_P_OF[t] !== 0) {
    world.wake(x, y);
    if (world.rng.next() < DECAY_P_OF[t]) {
      become(world, i, DECAYS_INTO_OF[t]);
      return;
    }
  }
  if (CRYSTAL_OF[t] !== 0) crystal(world, x, y, t);
  // Touch-sensitive explosives: anything that moved against it this frame sets it off.
  if (TOUCHY_OF[t] !== 0) {
    world.wake(x, y);
    for (let d = 0; d < 4; d++) {
      const j = neighbour(world, x, y, d);
      if (j >= 0 && world.type[j] !== EMPTY && (world.stamp[j] === st || world.vy[j] > 0)) {
        explode(world, x, y);
        return;
      }
    }
  }
  if (INDICATOR_ACID_OF[t] !== 0 && indicator(world, x, y, i, t)) return;
  if (BURSTS_INTO_OF[t] !== 0) {
    rocket(world, x, y, i, t, st);
    return;
  }
  // Power sources keep their chunk awake, so the circuit pass always finds them.
  if (EMF_OF[t] !== 0 || (CAPACITOR_OF[t] !== 0 && world.life[i] !== CAP_ZERO)) world.wake(x, y);
  if (DEVICE_OF[t] !== 0) device(world, x, y, i, t);
  // Curing: glue counts its frames, then sets hard.
  if (CURE_FRAMES_OF[t] !== 0) {
    world.wake(x, y);
    if (++world.life[i] >= CURE_FRAMES_OF[t]) {
      become(world, i, CURES_INTO_OF[t]);
      return;
    }
  }
  if (HABITAT_OF[t] !== 0) {
    // A creature may still burn or be eaten by acid first; then it lives its turn.
    if (HAS_REACTION[t] !== 0 && react(world, x, y, i, st)) return;
    creature(world, x, y, i, t, st);
    return;
  }
  if (RAIN_INTO_OF[t] !== 0) rain(world, x, y, i, t);
  if (COLONY_OF[t] !== 0) colony(world, x, y, t);
  // Light-sensitive powders slowly change in strong light (they stay awake to keep checking).
  if (LIGHT_INTO_OF[t] !== 0) {
    world.wake(x, y);
    if ((world.rng.nextU32() & 63) === 0 && lightAt(world, x, y) > 0.6) {
      become(world, i, LIGHT_INTO_OF[t]);
      return;
    }
  }
  if (world.charge[i] !== 0) updateCharge(world, x, y, i, st);
  if (WITHER_INTO_OF[t] !== 0) live(world, x, y, i, st);
  else if (GROWS_INTO_OF[t] !== 0 && world.vy[i] === 0) sprout(world, x, y, i);
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
    world.temp[i] += CHARGE_HEAT_OF[world.type[i]];
    // A surge (a spark, lightning) charges a capacitor by 1.5 V; enough of them pop it.
    if (CAPACITOR_OF[world.type[i]] !== 0) world.life[i] = Math.min(65535, world.life[i] + 1500);
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

// ---- Devices and weather ----------------------------------------------------------

/**
 * Devices act on their own each frame: a heater or cooler holds its
 * temperature, a clone copies what first touched it into the empty space
 * around it, a void deletes what touches it, a fan blows air.
 */
function device(world: World, x: number, y: number, i: number, t: number): void {
  world.wake(x, y);
  const hold = HOLD_T_OF[t];
  if (hold === hold) world.temp[i] = hold;
  // A filament sheds its heat fast, so it glows only while current runs.
  const cool = COOL_RATE_OF[t];
  if (cool !== 0) world.temp[i] += (AMBIENT - world.temp[i]) * cool;
  const r = world.rng.nextU32();
  if (CLONES_OF[t] !== 0) {
    const src = world.solute[i];
    if (src === 0) {
      // Learn from the first thing that touches it (never another device or a
      // wall), or from a clone cell beside it that has learned, so a whole
      // block copies out of every free face.
      const j = neighbour(world, x, y, r & 3);
      const tj = j >= 0 ? world.type[j] : EMPTY;
      if (tj === t && world.solute[j] !== 0) world.solute[i] = world.solute[j];
      else if (tj !== EMPTY && tj !== WALL && DEVICE_OF[tj] === 0) world.solute[i] = tj;
    } else if (((r >>> 2) & 7) === 0) {
      const j = neighbour(world, x, y, (r >>> 5) & 3);
      if (j >= 0 && world.type[j] === EMPTY) world.place(j, src);
    }
  }
  if (VOIDS_OF[t] !== 0) {
    const j = neighbour(world, x, y, r & 3);
    if (j >= 0) {
      const tj = world.type[j];
      if (tj !== EMPTY && tj !== WALL && DEVICE_OF[tj] === 0) world.place(j, EMPTY);
    }
  }
  // A magnet pulls magnetic grains within reach a step towards itself.
  if (MAGNET_OF[t] !== 0) pullIron(world, x, y, MAGNET_OF[t], 6);
  // A valve opens while the air pressure on it is past its setting and closes below half of it (conc 1 = open; the shade shows it).
  const setting = VALVE_OF[t];
  if (setting !== 0) {
    // The valve sits in a wall, so it feels the pressure of the air on either side of it.
    const air = world.air;
    const ax = x >> 2;
    const ay = y >> 2;
    let press = 0;
    for (let d = 0; d < 5; d++) {
      const qx = ax + (d === 1 ? -1 : d === 2 ? 1 : 0);
      const qy = ay + (d === 3 ? -1 : d === 4 ? 1 : 0);
      if (qx >= 0 && qy >= 0 && qx < air.aw && qy < air.ah) press = Math.max(press, Math.abs(air.p[qy * air.aw + qx]));
    }
    const open = world.conc[i] !== 0 ? press > setting * 0.5 : press > setting;
    world.conc[i] = open ? 1 : 0;
    world.shade[i] = open ? world.shade[i] | 128 : world.shade[i] & 127;
  }
  // Glow paint soaks up light (kept in `life`, 0..GLOW_FULL) and shines while it lasts.
  if (GLOW_PAINT_OF[t] !== 0) {
    if ((r & 7) === 0 && lightAt(world, x, y) > 0.5) world.life[i] = Math.min(GLOW_FULL, world.life[i] + 120);
    else if (world.life[i] > 0) world.life[i]--;
    setLit(world, i, (world.life[i] * 255) / GLOW_FULL);
  }
  // A thermostat's bimetal strip bends open when hot and closes again when cool (conc 1 = open).
  if (GATE_OF[t] === GATE_THERMOSTAT) {
    if (world.temp[i] > 60) world.conc[i] = 1;
    else if (world.temp[i] < 45) world.conc[i] = 0;
  }
  if (BLOW_X_OF[t] !== 0 || BLOW_Y_OF[t] !== 0) {
    world.air.addVelocity(x + Math.sign(BLOW_X_OF[t]) * 2, y + Math.sign(BLOW_Y_OF[t]) * 2, BLOW_X_OF[t] * 0.05, BLOW_Y_OF[t] * 0.05, 2);
  }
}

/** Clouds drop rain (snow when below 0 °C) into the space below and slowly run dry. */
function rain(world: World, x: number, y: number, i: number, t: number): void {
  world.wake(x, y);
  const r = world.rng.nextU32();
  if ((r & 63) !== 0 || y + 1 >= world.h) return;
  const below = i + world.w;
  if (world.type[below] !== EMPTY) return;
  // Now and then a storm cloud lets go a bolt instead of a drop.
  if (LIGHTNING_FROM_OF[t] !== 0 && ((r >>> 12) & 255) === 0) {
    world.place(below, LIGHTNING);
    return;
  }
  const T = world.temp[i];
  world.place(below, T < 0 ? RAIN_COLD_OF[t] : RAIN_INTO_OF[t]);
  world.temp[below] = T;
  // About one drop in sixteen is the cloud cell's last.
  if (((r >>> 6) & 15) < 1) world.place(i, EMPTY);
}

// ---- Sky: lightning and fireworks -------------------------------------------------------

/** °C a lightning strike adds where it lands: enough to melt sand into glass. */
const STRIKE_HEAT = 2500;

/**
 * Lightning: the bolt runs straight down at once in a jagged line through
 * open air, leaving plasma on its path. Where it lands it pours in heat,
 * throws a shock of air, lights the air around with flame and sends a
 * pulse into anything that conducts.
 */
function strike(world: World, x: number, y: number, i: number, t: number): void {
  const { w, h, type, temp } = world;
  const trail = BOLT_OF[t];
  world.place(i, trail);
  let cx = x;
  let cy = y;
  for (let k = 0; k < h; k++) {
    const r = world.rng.nextU32();
    const nx = Math.max(0, Math.min(w - 1, cx + ((r & 3) === 0 ? -1 : (r & 3) === 1 ? 1 : 0)));
    const ny = cy + 1;
    if (ny >= h) break;
    const j = ny * w + nx;
    const tj = type[j];
    // Rain, snow or dust still falling through the air is not the ground: the bolt passes it.
    const pt = PHASE_OF[tj];
    const below = ny + 1 < h ? PHASE_OF[type[j + w]] : PH_SOLID;
    const airborne = (pt === PH_LIQUID || pt === PH_POWDER) && (world.vy[j] > 0 || below === 0 || below === PH_GAS || below === PH_ENERGY);
    if (tj !== EMPTY && pt !== PH_GAS && pt !== PH_ENERGY && !airborne) {
      // Impact.
      temp[j] += STRIKE_HEAT;
      world.wake(nx, ny);
      if (ELECTRIC_OF[tj] !== 0 || (SOLVENT_OF[tj] !== 0 && world.conc[j] !== 0)) world.charge[j] = CHARGE_PEAK + 1;
      world.air.addPressure(nx, cy, 14, 6);
      for (let d = 0; d < 4; d++) {
        const q = neighbour(world, nx, cy, d);
        if (q >= 0 && type[q] === EMPTY) {
          world.place(q, FIRE);
          world.life[q] = 10 + ((r >>> 8) & 15);
        }
      }
      break;
    }
    // Plasma only fills open air: the bolt never deletes the cloud, gas or rain it passes.
    if (tj === EMPTY) world.place(j, trail);
    cx = nx;
    cy = ny;
  }
}

/** Can a rocket fly through this cell? */
function passable(t: number): boolean {
  return t === EMPTY || PHASE_OF[t] === PH_GAS || (PHASE_OF[t] === PH_ENERGY && BURSTS_INTO_OF[t] === 0);
}

/** A firework rocket climbs, trailing sparks, then bursts into falling embers. */
function rocket(world: World, x: number, y: number, i: number, t: number, st: number): void {
  const { w, type } = world;
  world.wake(x, y);
  const r = world.rng.nextU32();
  const L = world.life[i] - 1;
  // Climb two cells a frame through air, gas or flame, leaving a short spark trail.
  if (L > 0 && y > 2 && passable(type[i - w]) && passable(type[i - 2 * w])) {
    const to = i - 2 * w;
    moveTo(world, i, to, 0, st);
    world.life[to] = L;
    if (type[i] === EMPTY) {
      world.place(i, FIRE);
      world.life[i] = 4 + (r & 3);
    }
    world.wake(x, y - 2);
    return;
  }
  // Burst: a ball of embers (no air shock, so it never blows the ground about).
  const ember = BURSTS_INTO_OF[t];
  world.place(i, EMPTY);
  const R = 5 + (r % 4);
  for (let k = 0; k < 48; k++) {
    const q = world.rng.nextU32();
    const a = ((q & 1023) / 1024) * Math.PI * 2;
    const d = 1 + ((q >>> 10) % R);
    const ex = Math.round(x + Math.cos(a) * d);
    const ey = Math.round(y + Math.sin(a) * d);
    if (ex < 0 || ey < 0 || ex >= w || ey >= world.h) continue;
    const j = ey * w + ex;
    if (type[j] !== EMPTY) continue;
    world.place(j, ember);
    world.life[j] = 30 + ((q >>> 20) & 31);
  }
}

// ---- Creatures ----------------------------------------------------------------------

/** °C beyond which a creature dies. */
const CREATURE_HOT = 55;
const CREATURE_COLD = -5;
/** Frames a creature survives out of its habitat (a fish out of water, an ant under water). */
const OUT_OF_HABITAT = 240;

const H_WATER = 1;
const H_GROUND = 2;
const H_SOIL = 3;
const H_AIR = 4;

/** Can a creature of this habitat move into cell j (swapping with what is there)? */
function creatureCanEnter(world: World, habitat: number, j: number): boolean {
  const tj = world.type[j];
  if (habitat === H_WATER) return tj === WATER;
  if (habitat === H_SOIL) return tj === EMPTY || (PHASE_OF[tj] === PH_POWDER && POROUS_MAX_OF[tj] !== 0);
  return tj === EMPTY;
}

/**
 * Is the creature at (x, y) where it belongs? A fish touches water, a worm
 * touches soil, a walker or flier is not under liquid (liquid beside or
 * above it means it is drowning).
 */
function atHome(world: World, habitat: number, x: number, y: number): boolean {
  const type = world.type;
  for (let d = 0; d < 4; d++) {
    const j = neighbour(world, x, y, d);
    if (j < 0) continue;
    const tj = type[j];
    if (habitat === H_WATER && tj === WATER) return true;
    if (habitat === H_SOIL && PHASE_OF[tj] === PH_POWDER && POROUS_MAX_OF[tj] !== 0) return true;
    if ((habitat === H_GROUND || habitat === H_AIR) && d !== 2 && PHASE_OF[tj] === PH_LIQUID) return false;
  }
  return habitat === H_GROUND || habitat === H_AIR;
}

/**
 * A creature's turn. It dies (into meat, dirt...) when too hot, too cold or
 * out of its habitat too long. Otherwise it eats food beside it, which may
 * let it breed into that cell, then moves: fish swim through water, ants
 * walk and climb over ground, worms dig through soil, birds fly. Walkers
 * and diggers fall when nothing holds them up.
 */
function creature(world: World, x: number, y: number, i: number, t: number, st: number): void {
  // Creatures placed with a body (conc holds the part number) live as one body.
  if (BODY_OF[t] !== null && world.conc[i] !== 0) {
    bodyTurn(world, x, y, i, t, st);
    return;
  }
  world.wake(x, y);
  const { w, h, type, temp, life, vy } = world;
  const habitat = HABITAT_OF[t];
  sickness(world, i, x, y);
  const T = temp[i];
  if (T > CREATURE_HOT || T < CREATURE_COLD) {
    become(world, i, DIES_INTO_OF[t]);
    return;
  }
  // Out of its habitat it struggles, and dies if it stays out too long.
  if (atHome(world, habitat, x, y)) life[i] = 0;
  else if (++life[i] > OUT_OF_HABITAT) {
    become(world, i, DIES_INTO_OF[t]);
    return;
  }
  const r = world.rng.nextU32();
  // Eat: food beside it is eaten (or turned into what it leaves); a fed creature may breed into the space.
  const j = neighbour(world, x, y, r & 3);
  if (j >= 0) {
    const e = EATS[t * ELEMENT_COUNT + type[j]];
    if (e !== 0 && ((r >>> 2) & 7) === 0) {
      if (e === 1 && ((r >>> 5) & 3) === 0) {
        const Tj = temp[j];
        world.place(j, t);
        temp[j] = Tj;
      } else become(world, j, e - 1);
      world.stamp[j] = st;
      return;
    }
  }
  // Fall through open air or gas when nothing holds it up (birds fly instead).
  if (habitat !== H_AIR && y + 1 < h) {
    const below = i + w;
    const tb = type[below];
    if (tb === EMPTY || PHASE_OF[tb] === PH_GAS) {
      moveTo(world, i, below, 0, st);
      return;
    }
  }
  // Move now and then, so they wander instead of buzzing.
  if (((r >>> 8) & 3) !== 0) return;
  let dir = vy[i] === 0 ? (((r >>> 10) & 1) === 0 ? 1 : -1) : vy[i] > 0 ? 1 : -1;
  if (((r >>> 11) & 31) === 0) dir = -dir;
  if (habitat === H_GROUND) {
    // Walk; step up one cell if blocked; turn round at a wall.
    const nx = x + dir;
    if (nx >= 0 && nx < w && creatureCanEnter(world, habitat, y * w + nx)) moveTo(world, i, y * w + nx, dir, st);
    else if (nx >= 0 && nx < w && y > 0 && creatureCanEnter(world, habitat, (y - 1) * w + nx) && creatureCanEnter(world, habitat, (y - 1) * w + x))
      moveTo(world, i, (y - 1) * w + nx, dir, st);
    else vy[i] = -dir;
    return;
  }
  // Swimmers, diggers and fliers wander in any direction, mostly sideways.
  const up = ((r >>> 12) & 7) === 0 ? -1 : ((r >>> 12) & 7) === 1 ? 1 : 0;
  const nx = x + (up !== 0 && ((r >>> 15) & 1) === 0 ? 0 : dir);
  const ny = y + up;
  if (nx < 0 || nx >= w || ny < 0 || ny >= h) {
    vy[i] = -dir;
    return;
  }
  const k = ny * w + nx;
  // Birds keep a little height: they do not fly into the cell just above the ground.
  if (habitat === H_AIR && up >= 0 && ny + 1 < h && type[k + w] !== EMPTY && PHASE_OF[type[k + w]] !== PH_GAS) {
    vy[i] = -dir;
    return;
  }
  if (creatureCanEnter(world, habitat, k)) moveTo(world, i, k, dir, st);
  else vy[i] = -dir;
}

// ---- Creature bodies ------------------------------------------------------------------

/** Places a creature body with its first part at (x, y), if every cell it needs is free (empty, or water for a fish). */
export function placeBody(world: World, x: number, y: number, t: number): boolean {
  const b = BODY_OF[t];
  if (b === null) return false;
  const { w, h, type } = world;
  const swims = HABITAT_OF[t] === H_WATER;
  for (let p = 0; p < b.dx.length; p++) {
    const px = x + b.dx[p];
    const py = y + b.dy[p];
    if (px < 0 || py < 0 || px >= w || py >= h) return false;
    const k = type[py * w + px];
    if (k !== EMPTY && !(swims && k === WATER)) return false;
  }
  for (let p = 0; p < b.dx.length; p++) {
    const k = (y + b.dy[p]) * w + x + b.dx[p];
    world.place(k, t);
    world.conc[k] = p + 1;
    world.shade[k] = b.shade[p];
  }
  return true;
}

/** Is cell k part p of the body whose first part is at (x, y)? */
function isPart(world: World, t: number, k: number, p: number): boolean {
  return world.type[k] === t && world.conc[k] === p + 1;
}

/** The whole body dies at once: every part left becomes what the creature dies into. */
function killBody(world: World, x: number, y: number, t: number): void {
  const b = BODY_OF[t]!;
  const { w, h } = world;
  for (let p = 0; p < b.dx.length; p++) {
    const px = x + b.dx[p];
    const py = y + b.dy[p];
    if (px < 0 || py < 0 || px >= w || py >= h) continue;
    const k = py * w + px;
    if (isPart(world, t, k, p)) become(world, k, DIES_INTO_OF[t]);
  }
}

/**
 * Moves the whole body one step by (mx, my), if every cell it would move into
 * is its own or one it can enter. Parts move leading edge first, each
 * swapping with what is ahead, so nothing is created or lost.
 */
function moveBody(world: World, x: number, y: number, t: number, mx: number, my: number, habitat: number, st: number): boolean {
  const b = BODY_OF[t]!;
  const { w, h, type } = world;
  const n = b.dx.length;
  for (let p = 0; p < n; p++) {
    const tx = x + b.dx[p] + mx;
    const ty = y + b.dy[p] + my;
    if (tx < 0 || ty < 0 || tx >= w || ty >= h) return false;
    const k = ty * w + tx;
    const c = world.conc[k];
    const own = type[k] === t && c !== 0 && b.dx[c - 1] === tx - x && b.dy[c - 1] === ty - y;
    if (!own && !creatureCanEnter(world, habitat, k)) return false;
  }
  const order = b.order[(mx + 1) * 3 + (my + 1)];
  for (let q = 0; q < n; q++) {
    const p = order[q];
    const from = (y + b.dy[p]) * w + x + b.dx[p];
    const to = from + my * w + mx;
    swap(world, from, to);
    world.stamp[to] = st;
    world.stamp[from] = st;
  }
  world.wake(x + mx, y + my);
  return true;
}

/**
 * A body's turn. Only the first part thinks; the others just check their
 * body still exists (if not, they die where they are). The body dies whole
 * of heat, cold, staying out of its habitat, or losing a part; otherwise it
 * eats what is beside it (breeding into the space when fed), falls when
 * nothing holds it up, and wanders: swimming, walking and climbing steps,
 * digging or flying.
 */
function bodyTurn(world: World, x: number, y: number, i: number, t: number, st: number): void {
  const b = BODY_OF[t]!;
  const { w, h, type, temp, life, vy, conc } = world;
  const part = conc[i] - 1;
  const ax = x - b.dx[part];
  const ay = y - b.dy[part];
  world.wake(x, y);
  if (part !== 0) {
    // A part whose body is gone (or broken) dies where it is.
    if (ax < 0 || ay < 0 || ax >= w || ay >= h || !isPart(world, t, ay * w + ax, 0)) become(world, i, DIES_INTO_OF[t]);
    return;
  }
  const n = b.dx.length;
  for (let p = 1; p < n; p++) {
    const px = x + b.dx[p];
    const py = y + b.dy[p];
    if (px < 0 || py < 0 || px >= w || py >= h || !isPart(world, t, py * w + px, p)) {
      killBody(world, x, y, t);
      return;
    }
  }
  const habitat = HABITAT_OF[t];
  // Sickness: the body is sick if any part caught it; a random part meets germs, medicine or others.
  let sick = false;
  for (let p = 0; p < n && !sick; p++) sick = world.solute[(y + b.dy[p]) * w + x + b.dx[p]] === PLAGUE;
  if (sick) world.solute[i] = PLAGUE;
  {
    const p = world.rng.nextU32() % n;
    sickness(world, i, x + b.dx[p], y + b.dy[p]);
    if (world.solute[i] === 0 && sick) for (let q = 0; q < n; q++) world.solute[(y + b.dy[q]) * w + x + b.dx[q]] = 0;
  }
  if (temp[i] > CREATURE_HOT || temp[i] < CREATURE_COLD) {
    killBody(world, x, y, t);
    return;
  }
  let home = false;
  for (let p = 0; p < n && !home; p++) home = atHome(world, habitat, x + b.dx[p], y + b.dy[p]);
  if (home) life[i] = 0;
  else if (++life[i] > OUT_OF_HABITAT) {
    killBody(world, x, y, t);
    return;
  }
  const r = world.rng.nextU32();
  // Eat beside a random part; a fed body may breed into the space the food left.
  {
    const p = (r >>> 2) % n;
    const j = neighbour(world, x + b.dx[p], y + b.dy[p], r & 3);
    if (j >= 0) {
      const e = EATS[t * ELEMENT_COUNT + type[j]];
      if (e !== 0 && ((r >>> 6) & 7) === 0) {
        if (e === 1) {
          world.place(j, EMPTY);
          if (((r >>> 9) & 3) === 0) placeBody(world, j % w, (j / w) | 0, t);
        } else become(world, j, e - 1);
        return;
      }
    }
  }
  // Fall through open air when nothing holds it up (birds fly; a fish in water swims instead).
  if (habitat !== H_AIR && !(habitat === H_WATER && home) && moveBody(world, x, y, t, 0, 1, H_AIR, st)) return;
  if (((r >>> 11) & 3) !== 0) return;
  let dir = vy[i] === 0 ? (((r >>> 13) & 1) === 0 ? 1 : -1) : vy[i] > 0 ? 1 : -1;
  if (((r >>> 14) & 31) === 0) dir = -dir;
  let moved = false;
  if (habitat === H_GROUND) {
    moved = moveBody(world, x, y, t, dir, 0, habitat, st) || moveBody(world, x, y, t, dir, -1, habitat, st);
  } else {
    const up = ((r >>> 19) & 7) === 0 ? -1 : ((r >>> 19) & 7) === 1 ? 1 : 0;
    moved = moveBody(world, x, y, t, up !== 0 && ((r >>> 22) & 1) === 0 ? 0 : dir, up, habitat, st);
  }
  // The direction lives on the first part, wherever it moved to.
  const a = moved ? -1 : i;
  if (a >= 0) vy[a] = -dir;
  else {
    for (let k = 0; k < 9; k++) {
      const mx = ((k / 3) | 0) - 1;
      const my = (k % 3) - 1;
      const q = (y + my) * w + x + mx;
      if (q >= 0 && q < world.size && isPart(world, t, q, 0)) {
        vy[q] = dir;
        break;
      }
    }
  }
}

// ---- Life -------------------------------------------------------------------------

/** Frames a seed needs on damp soil, on average, before it sprouts. */
const SPROUT_EVERY = 45;
/** Water (concentration units) a root takes from damp soil in one drink. */
const DRINK = 16;
/** Water a growing tip needs before it builds a new cell, and what the cell costs. */
const GROW_NEED = 8;
const GROW_COST = 4;

/** A seed on damp soil with room above sprouts into its plant, taking water from the soil. */
function sprout(world: World, x: number, y: number, i: number): void {
  if (y === 0 || y + 1 >= world.h) return;
  const { type, conc, solute } = world;
  const below = i + world.w;
  if (POROUS_MAX_OF[type[below]] === 0 || solute[below] !== WATER || conc[below] < DRINK) return;
  world.wake(x, y);
  // Room above: air, or a puddle of fresh water the young plant will drink.
  const above = i - world.w;
  if (type[above] !== EMPTY && (type[above] !== WATER || conc[above] !== 0)) return;
  const r = world.rng.nextU32();
  if (r % SPROUT_EVERY !== 0) return;
  const take = conc[below] < CONC_UNIT ? conc[below] : CONC_UNIT;
  conc[below] -= take;
  if (conc[below] === 0) solute[below] = 0;
  const budget = GROW_BUDGET_OF[type[i]];
  become(world, i, GROWS_INTO_OF[type[i]]);
  solute[i] = WATER;
  conc[i] = take;
  world.life[i] = ((budget * 0.6) | 0) + ((r >>> 8) % (((budget * 0.8) | 0) + 1));
}

/** Moves `n` water units from cell `from` to cell `to`. */
function moveWater(world: World, from: number, to: number, n: number): void {
  const { conc, solute } = world;
  conc[from] -= n;
  if (conc[from] === 0) solute[from] = 0;
  conc[to] += n;
  solute[to] = WATER;
}

/**
 * A living cell (plant). It drinks from damp soil or fresh water beside it,
 * passes water on to drier cells of its own plant, loses a little to the
 * air, and withers when it has none left. A growing tip (life > 0) builds a
 * new cell above while it has water, now and then with a leaf beside it.
 * Runs on one frame in four, so even a jungle costs little.
 */
function live(world: World, x: number, y: number, i: number, st: number): void {
  world.wake(x, y);
  const r = world.rng.nextU32();
  if ((r & 3) !== 0) return;
  const { w, type, conc, solute, life } = world;
  const t = type[i];

  // Drink: damp soil gives a little at a time; a cell of fresh water is taken whole.
  let j = neighbour(world, x, y, (r >>> 2) & 3);
  // Roots: a cell standing on soil also draws from the soil around and below it.
  if (y + 1 < world.h && POROUS_MAX_OF[type[i + w]] !== 0 && ((r >>> 29) & 1) === 0) {
    const rx = x + (((r >>> 10) % 5) - 2);
    const ry = y + 1 + ((r >>> 13) % 3);
    if (rx >= 0 && rx < w && ry < world.h) j = ry * w + rx;
  }
  if (j >= 0) {
    const tj = type[j];
    if (POROUS_MAX_OF[tj] !== 0 && solute[j] === WATER && conc[j] > 0 && conc[i] <= 255 - DRINK) {
      moveWater(world, j, i, conc[j] < DRINK ? conc[j] : DRINK);
    } else if (tj === WATER && conc[j] === 0 && conc[i] <= 255 - CONC_UNIT && ((r >>> 4) & 7) === 0) {
      world.place(j, EMPTY);
      conc[i] += CONC_UNIT;
      solute[i] = WATER;
    }
  }
  // Share: water moves on to a drier cell of the same plant. Sap rises: half
  // the time it goes to the cell above, whatever that one holds, so the
  // growing tips are fed first.
  const k = ((r >>> 7) & 1) === 0 ? neighbour(world, x, y, 0) : neighbour(world, x, y, (r >>> 8) & 3);
  if (k >= 0 && WITHER_INTO_OF[type[k]] !== 0) {
    if (k === i - w && conc[i] > 2 && conc[k] <= 255 - 2) moveWater(world, i, k, conc[i] >> 2);
    else if (conc[i] > conc[k] + 1) moveWater(world, i, k, (conc[i] - conc[k]) >> 1);
  }
  // Breathe out a little (a cactus far less than other plants), on a draw of its own.
  if ((world.rng.nextU32() & 65535) < WATER_LOSS_OF[t] && conc[i] > 0) {
    conc[i]--;
    if (conc[i] === 0) solute[i] = 0;
  }
  // Wither when dry for a while (about 2 s on average).
  if (conc[i] === 0) {
    if (((r >>> 14) & 31) === 0) become(world, i, WITHER_INTO_OF[t]);
    return;
  }
  // Grow: usually straight up, now and then a slanted shoot that branches.
  if (life[i] === 0 || y === 0 || conc[i] < GROW_NEED || ((r >>> 19) & 1) !== 0) return;
  const budget = life[i];
  const side = (r >>> 21) % 5 === 0 ? ((r >>> 24) & 1 ? 1 : -1) : 0;
  const tx = x + side;
  if (tx < 0 || tx >= w) return;
  const up = (y - 1) * w + tx;
  // A stem grows into air, or up through fresh water, taking that water in.
  const throughWater = type[up] === WATER && conc[up] === 0;
  if (type[up] !== EMPTY && !throughWater) return;
  // Plants grow only where light reaches them (daylight, or a fire or lamp nearby); mushrooms only in the dark.
  const L = lightAt(world, x, y);
  if (DARK_GROWER_OF[t] !== 0 ? L > DARK_LIGHT : L < PLANT_LIGHT) return;
  const T = world.temp[i];
  // The last cell of a stem may be its flower.
  const last = budget === 1 && TOP_INTO_OF[t] !== 0;
  world.place(up, last ? TOP_INTO_OF[t] : t);
  world.temp[up] = T;
  world.stamp[up] = st;
  conc[i] -= GROW_COST;
  moveWater(world, i, up, conc[i] >> 1);
  if (throughWater) {
    conc[up] = conc[up] + CONC_UNIT > 255 ? 255 : conc[up] + CONC_UNIT;
    solute[up] = WATER;
  }
  life[up] = last ? 0 : budget - 1;
  life[i] = side !== 0 && budget > 6 ? budget >> 1 : 0;
  // Trees (plants with leaves of their own) grow a thick trunk low down, while lots of growth is still to come.
  if (LEAF_INTO_OF[t] !== 0 && side === 0 && budget > 40 && tx + 1 < w) {
    const beside = up + 1;
    if (type[beside] === EMPTY && conc[up] >= 4) {
      world.place(beside, t);
      world.temp[beside] = T;
      world.stamp[beside] = st;
      moveWater(world, up, beside, conc[up] >> 1);
    }
  }
  // A leaf beside the new cell, now and then; plants with leaves of their own (trees) leaf out often.
  if ((LEAF_INTO_OF[t] !== 0 ? ((r >>> 26) & 1) === 0 : ((r >>> 26) & 3) === 0) && conc[up] >= 4) {
    const lx = tx + ((r >>> 28) & 1 ? 1 : -1);
    const leaf = (y - 1) * w + lx;
    if (lx >= 0 && lx < w && type[leaf] === EMPTY) {
      world.place(leaf, LEAF_INTO_OF[t] !== 0 ? LEAF_INTO_OF[t] : t);
      world.temp[leaf] = T;
      world.stamp[leaf] = st;
      moveWater(world, up, leaf, conc[up] >> 1);
    }
  }
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

/**
 * Sickness for the creature whose state lives in cell i, met at (x, y):
 * germs or a sick animal beside it infect it (kept as its solute); medicine
 * beside it cures it. A sick creature runs a fever (its temperature climbs
 * until it dies) and passes the sickness to animals it touches.
 */
function sickness(world: World, i: number, x: number, y: number): void {
  const { type, solute, temp } = world;
  const r = world.rng.nextU32();
  const j = neighbour(world, x, y, r & 3);
  const tj = j >= 0 ? type[j] : 0;
  if (j >= 0) {
    if (CURES_OF[tj] !== 0 && solute[i] === PLAGUE) {
      solute[i] = 0;
      if (temp[i] > AMBIENT + 5) temp[i] = AMBIENT + 5;
    } else if (INFECTS_OF[tj] !== 0 && ((r >>> 2) & 7) === 0) solute[i] = PLAGUE;
    else if (HABITAT_OF[tj] !== 0 && solute[j] === PLAGUE && ((r >>> 5) & 255) < CONTAGION) solute[i] = PLAGUE;
    else if (HABITAT_OF[tj] !== 0 && solute[i] === PLAGUE && ((r >>> 13) & 255) < CONTAGION) solute[j] = PLAGUE;
  }
  if (solute[i] === PLAGUE) {
    if (temp[i] < FEVER_MAX) temp[i] += FEVER;
    // Dying of it: pushed past the heat a creature can stand.
    if (((r >>> 16) & 65535) < SICK_DEATH) temp[i] = CREATURE_HOT + 1;
  }
}

// ---- Nuclear -------------------------------------------------------------------------

/** Chain reactions: fuel counted within this many cells; this much fuel (less absorbers) is critical. */
const FISSION_REACH = 5;
const CRITICAL = 45;
/** °C a lone piece of fuel warms itself towards (decay heat), and °C per check a supercritical one gains for each unit past critical. */
const DECAY_HEAT_T = 450;
const FISSION_HEAT = 300;
/** Past this far over critical and this hot, a pile blows apart. */
const RUNAWAY_K = 2.2;
const RUNAWAY_T = 2500;
const NEUTRON_DX = Int8Array.of(1, 1, 0, -1, -1, -1, 0, 1);
const NEUTRON_DY = Int8Array.of(0, 1, 1, 1, 0, -1, -1, -1);

/**
 * Nuclear fuel. Decay keeps a lone piece warm. Now and then it counts the
 * fuel and the neutron absorbers around it: packed tightly enough (past
 * critical) the chain reaction runs and it heats fast, flinging out
 * neutrons; far past critical and white-hot, the pile blows apart.
 * Returns true if the cell is gone.
 */
function fission(world: World, x: number, y: number, i: number): boolean {
  world.wake(x, y);
  const { w, h, type, temp } = world;
  if (temp[i] < DECAY_HEAT_T) temp[i] += (DECAY_HEAT_T - temp[i]) * 0.01;
  const r = world.rng.nextU32();
  if ((r & 15) !== 0) return false;
  let fuel = 0;
  let absorbed = 0;
  for (let yy = Math.max(0, y - FISSION_REACH); yy <= Math.min(h - 1, y + FISSION_REACH); yy++)
    for (let xx = Math.max(0, x - FISSION_REACH); xx <= Math.min(w - 1, x + FISSION_REACH); xx++) {
      const t = type[yy * w + xx];
      fuel += FISSILE_OF[t];
      absorbed += ABSORBS_N_OF[t];
    }
  const k = (fuel - 3 * absorbed) / CRITICAL;
  if (k <= 1) return false;
  temp[i] += FISSION_HEAT * (k - 1);
  // Fling a neutron into open space now and then.
  if (((r >>> 4) & 3) === 0) {
    const d = (r >>> 6) & 7;
    const nx = x + NEUTRON_DX[d];
    const ny = y + NEUTRON_DY[d];
    if (nx >= 0 && ny >= 0 && nx < w && ny < h && type[ny * w + nx] === EMPTY) {
      const j = ny * w + nx;
      world.place(j, NEUTRON);
      world.conc[j] = d;
    }
  }
  if (k > RUNAWAY_K && temp[i] > RUNAWAY_T) {
    meltdownBlast(world, x, y);
    return true;
  }
  return false;
}

/** A runaway pile blows apart: a huge shock, searing heat, and flame and glowing plasma all around. */
function meltdownBlast(world: World, x: number, y: number): void {
  const { w, h, type, temp } = world;
  const R = 12;
  for (let yy = Math.max(0, y - R); yy <= Math.min(h - 1, y + R); yy++)
    for (let xx = Math.max(0, x - R); xx <= Math.min(w - 1, x + R); xx++) {
      const d = Math.hypot(xx - x, yy - y) / R;
      if (d > 1) continue;
      const j = yy * w + xx;
      if (type[j] === WALL) continue;
      if (d < 0.35 && FISSILE_OF[type[j]] !== 0) world.place(j, PLASMA);
      else if (type[j] === EMPTY && world.rng.next() < 0.5 * (1 - d)) world.place(j, FIRE);
      temp[j] += 3000 * (1 - d);
    }
  world.air.addPressure(x, y, 60, 24);
  world.wakeAll();
}

/**
 * A particle (a neutron) flies straight in its direction (kept in conc),
 * two cells a frame, through air and gas. Striking fuel it adds heat to the
 * chain reaction; anything else soaks it up. It fades after its lifetime.
 */
function particle(world: World, x: number, y: number, i: number): void {
  world.wake(x, y);
  const { w, h, type, temp, life } = world;
  if (life[i] <= 1) {
    world.place(i, EMPTY);
    return;
  }
  life[i]--;
  const d = world.conc[i] & 7;
  let cx = x;
  let cy = y;
  let at = i;
  for (let s = 0; s < 2; s++) {
    const nx = cx + NEUTRON_DX[d];
    const ny = cy + NEUTRON_DY[d];
    if (nx < 0 || ny < 0 || nx >= w || ny >= h) {
      world.place(at, EMPTY);
      return;
    }
    const j = ny * w + nx;
    const tj = type[j];
    if (tj === EMPTY || PHASE_OF[tj] === PH_GAS) {
      world.swapCells(at, j);
      world.stamp[j] = world.currentStamp();
      at = j;
      cx = nx;
      cy = ny;
      continue;
    }
    if (FISSILE_OF[tj] !== 0) temp[j] += 60;
    world.place(at, EMPTY);
    return;
  }
  world.wake(cx, cy);
}

// ---- Crystals and indicators ------------------------------------------------------------

/** A crystal grows into touching water that carries its dissolved element, taking it out. */
function crystal(world: World, x: number, y: number, t: number): void {
  world.wake(x, y);
  const r = world.rng.nextU32();
  if ((r & 15) !== 0) return;
  const j = neighbour(world, x, y, (r >>> 4) & 3);
  if (j < 0 || SOLVENT_OF[world.type[j]] === 0 || world.solute[j] !== CRYSTAL_OF[t] || world.conc[j] < CONC_UNIT) return;
  const T = world.temp[j];
  world.place(j, t);
  world.temp[j] = T;
}

/** A pH indicator changes colour on touching an acid or a base. Returns true if it changed. */
function indicator(world: World, x: number, y: number, i: number, t: number): boolean {
  world.wake(x, y);
  const r = world.rng.nextU32();
  if ((r & 3) !== 0) return false;
  const j = neighbour(world, x, y, (r >>> 2) & 3);
  if (j < 0) return false;
  const a = ACIDITY_OF[world.type[j]];
  const into = a >= 0.2 ? INDICATOR_ACID_OF[t] : a <= -0.2 ? INDICATOR_BASE_OF[t] : 0;
  if (into === 0 || into === t) return false;
  become(world, i, into);
  return true;
}

/**
 * Colonies (mould, algae, moss): now and then spread into a touching cell
 * they live on, when what they need is there: water within two cells
 * (mould), daylight (algae), or water nearby and shade (moss). A colony
 * that grows into open space needs a host beside the new cell (moss on
 * stone). Some give off a gas as they spread (algae: oxygen).
 */
function colony(world: World, x: number, y: number, t: number): void {
  world.wake(x, y);
  const r = world.rng.nextU32();
  if ((r & 31) !== 0) return;
  const j = neighbour(world, x, y, (r >>> 5) & 3);
  if (j < 0 || COLONY_ON[t * ELEMENT_COUNT + world.type[j]] === 0) return;
  const { w, h, type, solute, conc } = world;
  const fx = j % w;
  const fy = (j / w) | 0;
  if (HAS_HOST_OF[t] !== 0) {
    let host = false;
    for (let d = 0; d < 4 && !host; d++) {
      const k = neighbour(world, fx, fy, d);
      host = k >= 0 && COLONY_HOST[t * ELEMENT_COUNT + type[k]] !== 0;
    }
    if (!host) return;
  }
  const needs = COLONY_NEEDS_OF[t];
  if (needs === 1) {
    // Light where the colony is (algae on the surface catches it).
    if (lightAt(world, x, y) < 0.4) return;
  } else {
    if (needs === 2 && lightAt(world, fx, fy) > 0.6) return;
    // Moss lives on humid air: water within six cells; mould needs it within two.
    const reach = needs === 2 ? 6 : 2;
    let damp = false;
    for (let yy = Math.max(0, fy - reach); yy <= Math.min(h - 1, fy + reach) && !damp; yy++)
      for (let xx = Math.max(0, fx - reach); xx <= Math.min(w - 1, fx + reach) && !damp; xx++) {
        const k = yy * w + xx;
        damp = type[k] === WATER || (solute[k] === WATER && conc[k] !== 0);
      }
    if (!damp) return;
  }
  // Now and then the cell it takes becomes the gas it gives off (algae: water into an oxygen bubble), so nothing is made from nothing.
  const gas = COLONY_GAS_OF[t];
  become(world, j, gas !== 0 && ((r >>> 8) & 3) === 0 ? gas : t);
}

/** A reaction gave off gas at cell k: it pushes on the air around it (see GAS_SWELL). */
function swell(world: World, k: number): void {
  const x = k % world.w;
  const y = (k / world.w) | 0;
  if (world.air.sealedAt(x, y)) world.air.addPressure(x, y, GAS_SWELL, SWELL_RADIUS);
}

/** Sets cell i burning: it becomes fire that remembers its fuel. */
function ignite(world: World, i: number, fuel: number): void {
  if (LAUNCHES_AS_OF[fuel] !== 0) {
    const T = world.temp[i];
    world.place(i, LAUNCHES_AS_OF[fuel]);
    world.temp[i] = T;
    // Each rocket flies its own time, so a volley bursts at many heights.
    world.life[i] = 50 + (world.rng.nextU32() % 40);
    return;
  }
  world.type[i] = FIRE;
  world.solute[i] = fuel;
  world.life[i] = FUEL_OF[fuel] || 30;
  world.vy[i] = 0;
  if (world.temp[i] < FLAME_T_OF[fuel] * 0.8) world.temp[i] = FLAME_T_OF[fuel] * 0.8;
}

/**
 * Could cell i react with any of its neighbours right now? Dissolving and
 * soaking are left out (a full solution would keep its chunk awake for
 * ever); so is a flame that is a burning cell, which never lights by touch.
 */
function reactionPending(world: World, x: number, y: number, i: number): boolean {
  const { type, temp } = world;
  const base = type[i] * ELEMENT_COUNT;
  for (let d = 0; d < 4; d++) {
    const j = neighbour(world, x, y, d);
    if (j < 0) continue;
    const k = base + type[j];
    const rule = P_RULE[k];
    if (rule === 0 || rule === R_DISSOLVE || rule === R_ABSORB || temp[i] < P_MIN_T[k]) continue;
    if (rule === R_COMBUST && type[j] === FIRE && world.solute[j] !== 0) continue;
    return true;
  }
  return false;
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
  if (rule === 0 || temp[i] < P_MIN_T[k]) {
    // This neighbour does not react, but another may (slowly, by chance):
    // keep the chunk awake so the reaction still gets its tries.
    if (reactionPending(world, x, y, i)) world.wake(x, y);
    return false;
  }
  // Only a loose flame (out in the air) lights fuel by touch; a burning cell's
  // neighbours must heat up and meet air themselves, or they would light and
  // smother over and over.
  if (rule === R_COMBUST && type[j] === FIRE && world.solute[j] !== 0) return false;
  // Wet things do not catch fire until they dry out.
  if (rule === R_COMBUST && world.conc[i] !== 0 && SOLVENT_OF[world.solute[i]] !== 0 && PHASE_OF[a] === PH_POWDER) return false;
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
    // Dissolving can take in heat (ammonium nitrate: a cold pack) or give it out.
    temp[host] += P_HEAT[k];
    world.place(guest, EMPTY);
    world.stamp[j] = st;
  } else if (rule === R_CORRODE) {
    // The acid takes the eaten cell into itself and weakens; full, it is spent into plain water carrying it.
    const target = acid === i ? j : i;
    const eaten = type[target];
    become(world, target, EMPTY);
    if (P_GAS[k] !== 0) {
      become(world, target, P_GAS[k]);
      swell(world, target);
    }
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
  } else if (rule === R_FERMENT) {
    // Only water that really carries the sugar ferments.
    const wet = j;
    if (solute[wet] !== FERMENT_FROM_OF[a] || conc[wet] === 0) return false;
    // Sugar splits about half into alcohol, half into carbon dioxide, which bubbles up.
    const T = temp[wet];
    const bubble = ((r >>> 16) & 1) !== 0;
    world.place(wet, bubble ? P_GAS[k] : P_OUT_B[k]);
    temp[wet] = T;
    if (bubble) swell(world, wet);
    world.stamp[j] = st;
  } else if (rule === R_QUENCH) {
    // Water on fire: the flame goes out (a burning cell is left as its fuel,
    // cooled below its ignition point) and the water may flash into steam.
    const fireCell = type[i] === FIRE ? i : j;
    const wet = fireCell === i ? j : i;
    const fuel = solute[fireCell];
    if (fuel !== 0) {
      type[fireCell] = fuel;
      solute[fireCell] = 0;
      world.life[fireCell] = 0;
      if (temp[fireCell] > IGNITION_OF[fuel] - 30) temp[fireCell] = IGNITION_OF[fuel] - 30;
    } else world.place(fireCell, EMPTY);
    const steam = wet === i ? P_OUT_A[k] : P_OUT_B[k];
    if ((r >>> 16) & 1) {
      const liquid = type[wet];
      become(world, wet, steam);
      temp[wet] = UP_T[liquid] + 5;
      swell(world, wet);
    }
    world.stamp[j] = st;
  } else {
    const outA = P_OUT_A[k];
    const outB = P_OUT_B[k];
    if (outA !== KEEP) become(world, i, outA);
    if (outB !== KEEP) become(world, j, outB);
    // Heat released (neutralising, setting): both cells warm.
    const heat = P_HEAT[k];
    if (heat !== 0) {
      if (type[i] !== EMPTY) temp[i] += heat;
      if (type[j] !== EMPTY) temp[j] += heat;
    }
    const gas = P_GAS[k];
    if (gas !== 0) {
      if (type[j] === EMPTY) {
        become(world, j, gas);
        swell(world, j);
      } else if (type[i] === EMPTY) {
        become(world, i, gas);
        swell(world, i);
      }
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
 * world at the top edge. Fading gases (smoke) thin to a faint haze over a
 * few seconds, so old smoke does not hide the scene; it is still spent air,
 * so a sealed fire still chokes. A gas never fully rests, so its chunk stays
 * awake.
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
  // Fading gases (smoke) thin to a faint haze as they age: the shade walks
  // from the dense colours to the faint ones. It is spent air, so it stays and
  // chokes a sealed fire; but ten seconds after it has fully faded (`life` counts
  // the frames), it starts to clear, so smoke trapped under a roof or in a box
  // does not linger for ever. A choked fire is out long before then.
  if (FADES_OF[t] !== 0) {
    if (world.shade[i] < 254) {
      if (((r >>> 20) & 3) === 0) world.shade[i] += 2;
    } else if (world.life[i] < SMOKE_LINGER) world.life[i]++;
    else if (r >>> 25 === 0) {
      world.place(i, EMPTY);
      return;
    }
  }
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
    // An open valve lets gas through: it hops to the far side if there is room.
    if (VALVE_OF[tj] !== 0 && world.conc[j] !== 0) {
      const far = ny + dir;
      if (far >= 0 && far < h && type[j + dir * w] === EMPTY) {
        moveTo(world, i, j + dir * w, 0, st);
        world.wake(x, far);
        return;
      }
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

/** Least light (0..1) a plant needs to grow. */
const PLANT_LIGHT = 0.15;
/** Most light a mushroom grows in. */
const DARK_LIGHT = 0.3;
/** A sick creature's fever (°C a frame, up to FEVER_MAX), its chance (of 65536) per frame of dying of it (about 10 s on average), and its chance (of 256) per frame of passing it on. */
const FEVER = 0.05;
const FEVER_MAX = 40;
const SICK_DEATH = 109;
const CONTAGION = 12;
/** Glow paint: stored light when full (about 16 s of glow). */
const GLOW_FULL = 1000;

/** Frames fully faded smoke lingers before it starts to clear (ten seconds). */
const SMOKE_LINGER = 600;

/** True if element a is denser than element b (both gases). */
function densityOver(a: number, b: number): boolean {
  return BUOY_DIR_OF[a] > BUOY_DIR_OF[b] || (BUOY_DIR_OF[a] === BUOY_DIR_OF[b] && BUOY_P_OF[a] * BUOY_DIR_OF[a] > BUOY_P_OF[b] * BUOY_DIR_OF[b]);
}

/** Chance (of 256) per frame that a burning cell turns touching air into smoke (richer oxidisers last longer). */
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
      // Most dying flames leave nothing; a few leave a wisp of smoke.
      world.place(i, (r & 255) < 16 ? SMOKE : EMPTY);
      return;
    }
    life[i] = L;
    // A flame touches fuel for only a frame or two as it rises past, so it
    // looks for fuel itself instead of waiting for the fuel's own random check.
    for (let d = 0; d < 4; d++) {
      const j = neighbour(world, x, y, (r + d) & 3);
      if (j < 0) continue;
      const t = type[j];
      if (IGNITION_OF[t] === Infinity || PHASE_OF[t] === PH_ENERGY || NO_FLAME_OF[t] !== 0) continue;
      // Wet things do not catch fire until they dry out.
      if (world.conc[j] !== 0 && SOLVENT_OF[solute[j]] !== 0 && PHASE_OF[t] === PH_POWDER) continue;
      if (BLAST_POWER_OF[t] > 0) explode(world, j % w, (j / w) | 0);
      else ignite(world, j, t);
      world.stamp[j] = st;
      break;
    }
    if (SINKS_OF[type[i]] !== 0) {
      // Embers drift down, swaying, as they burn out.
      if (y + 1 < world.h) {
        const dn = i + w;
        const dx = r & 65536 ? 1 : -1;
        if (((r >>> 16) & 255) < 90 && x + dx >= 0 && x + dx < w && type[dn + dx] === EMPTY) moveTo(world, i, dn + dx, 0, st);
        else if (type[dn] === EMPTY && ((r >>> 8) & 255) < 140) moveTo(world, i, dn, 0, st);
      }
      return;
    }
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

  // A burning liquid or powder still falls: burning oil pours, and flames
  // stay on a pool's surface instead of hanging where it used to be.
  const fph = PHASE_OF[fuel];
  if ((fph === PH_LIQUID || fph === PH_POWDER) && y + 1 < world.h && type[i + w] === EMPTY) {
    moveTo(world, i, i + w, 0, st);
    world.wake(x, y + 1);
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
  // Fuels that carry their own oxygen (thermite) burn with no air at all.
  if (SELF_FED_OF[fuel] !== 0 && ox < 1) ox = 1;
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
  // Fuel past its flash point catches from this flame wherever air reaches it.
  const sj = neighbour(world, x, y, (r >>> 4) & 3);
  if (sj >= 0) {
    const t = type[sj];
    if (FLASH_OF[t] !== Infinity && temp[sj] >= FLASH_OF[t] && world.conc[sj] === 0 && breathes(world, sj)) {
      ignite(world, sj, t);
      world.stamp[sj] = st;
    }
  }
  const L = life[i] - (ox >= 0.5 ? 3 : 1);
  // An oxidiser is used up in proportion to how little oxygen it holds: air at
  // CONSUME_P, saltpeter or pure oxygen (four or five times richer) that much slower.
  if (oxJ >= 0 && ((r >>> 8) & 255) < (CONSUME_P * AIR_OXIDISER) / Math.max(AIR_OXIDISER, OXIDISER_OF[type[oxJ]]) && type[oxJ] !== FIRE) {
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

/** Does cell j touch an oxidiser (air, oxygen, a loose flame)? */
function breathes(world: World, j: number): boolean {
  const { w, type } = world;
  const x = j % w;
  const y = (j / w) | 0;
  for (let d = 0; d < 4; d++) {
    const k = neighbour(world, x, y, d);
    if (k >= 0 && (OXIDISER_OF[type[k]] > 0 || (type[k] === FIRE && world.solute[k] === 0))) return true;
  }
  return false;
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
