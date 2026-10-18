import {
  AMBIENT,
  DOWN_INTO,
  DOWN_LATENT,
  DOWN_T,
  ELEMENT_COUNT,
  EMPTY,
  HEAT_K,
  INV_CAP_OF,
  UP_INTO,
  UP_LATENT,
  PHASE_OF,
  PH_GAS,
  PH_POWDER,
  PH_SOLID,
  RUPTURE_T_OF,
  MIST_WITH_OF,
  MIST_INTO_OF,
  RUBBLE_OF,
  BLAST_POWER_OF,
  IGNITION_OF,
  CONC_UNIT,
  SOLVENT_OF,
  UP_T,
  BAKE_GAS_OF,
  BAKE_INTO_OF,
  BAKE_T_OF,
  FIRE,
  FLAME_T_OF,
  FUEL_OF,
  SELF_FED_OF,
} from './elements';
import { explode, rupture } from './blast';
import { P_MIN_T, P_RULE } from './chem';
import { CHUNK_SHIFT, type World } from './world';

const N = ELEMENT_COUNT;
/** A temperature change bigger than this keeps a chunk awake (spec: 0.05 °C). */
const WAKE_DT = 0.05;
/** °C a cell must change in one exchange to wake the full cell pass; smaller changes only keep the heat pass running (`warm`). */
const MOVE_DT = 1;
/** Differences smaller than this are not worth exchanging. */
const MIN_DIFF = 0.01;
/** Air pressure one cell of liquid or solid adds as it turns into gas, at each air cell of the patch it spreads over (about 0.6 in all). */
export const GAS_SWELL = 0.045;
/** Cells the swell spreads over: wide, as real pressure evens out almost at once. */
export const SWELL_RADIUS = 8;
/** Absolute zero, and the hottest any cell may get (°C). */
const T_MIN = -273;
const T_MAX = 5000;
/** Air drifts back to room temperature by this fraction per frame (heat lost to the room). */
const AIR_RELAX = 0.005;
/** Air within this many °C of room temperature snaps to it. */
const AIR_SNAP = 0.5;
/** °C a solvent's freezing point drops per unit of dissolved solid (full brine, 255: about −20 °C). */
const FREEZE_DROP = 0.08;

/**
 * Heat pass, after the cell pass, over awake chunks.
 * 1. Conduction: each cell exchanges heat with its right and lower
 *    neighbour. Heat leaves one cell exactly as it enters the other, so
 *    energy is conserved; how fast depends on both conductivities, how far
 *    each moves on its heat capacity. Pairs across the edge of a sleeping
 *    chunk are exchanged too, and wake it if its cell changes enough.
 * 2. Phase changes: past a threshold (with a small margin against
 *    flicker) a cell becomes its melted, boiled, frozen or condensed form,
 *    paying or returning a little latent heat. A solid that would form with
 *    nothing solid under it forms as its rubble (lava → gravel, not stone).
 * 3. Air drifts back to room temperature.
 * No allocations in here.
 */
/**
 * Lowest temperature at which each element has a reaction gated by heat
 * (burning, hot hand-written reactions). A cell that reaches it wakes the full
 * cell pass, so it still catches fire in a chunk that was only cooling.
 */
const REACT_T_OF = Float32Array.from({ length: N }, (_, a) => {
  let m = Infinity;
  for (let b = 0; b < N; b++) {
    const k = a * N + b;
    if (P_RULE[k] !== 0 && P_MIN_T[k] > -Infinity && P_MIN_T[k] < m) m = P_MIN_T[k];
  }
  return m;
});

/**
 * Lowest temperature at which anything happens to each element by heat: it
 * reacts, goes off, ruptures, catches by itself, bakes or melts or boils. Below
 * it (and above its freezing point) settle has nothing to do.
 */
const CALM_HI_OF = Float32Array.from({ length: N }, (_, t) =>
  Math.min(REACT_T_OF[t], BLAST_POWER_OF[t] > 0 || SELF_FED_OF[t] !== 0 ? IGNITION_OF[t] : Infinity, RUPTURE_T_OF[t], BAKE_T_OF[t], UP_T[t]),
);

export function heatStep(world: World): void {
  const { w, h, cw, ch, awake, warm, type, temp, conc } = world;
  for (let cy = 0; cy < ch; cy++) {
    for (let cx = 0; cx < cw; cx++) {
      if (awake[cy * cw + cx] === 0 && warm[cy * cw + cx] === 0) continue;
      const x0 = cx << CHUNK_SHIFT;
      const y0 = cy << CHUNK_SHIFT;
      const x1 = Math.min(x0 + (1 << CHUNK_SHIFT), w);
      const y1 = Math.min(y0 + (1 << CHUNK_SHIFT), h);
      const leftAsleep = cx > 0 && awake[cy * cw + cx - 1] === 0 && warm[cy * cw + cx - 1] === 0;
      const upAsleep = cy > 0 && awake[(cy - 1) * cw + cx] === 0 && warm[(cy - 1) * cw + cx] === 0;
      // The exchanges right and down are written out here (the same sums as `exchange`), with the
      // arrays as locals: this loop runs for every cell of every busy chunk, every frame.
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const i = y * w + x;
          if (x + 1 < w) {
            const d = temp[i] - temp[i + 1];
            if (d >= MIN_DIFF || d <= -MIN_DIFF) {
              const ta = type[i];
              const tb = type[i + 1];
              const q = HEAT_K[ta * N + tb] * d;
              const da = q * INV_CAP_OF[ta];
              const db = q * INV_CAP_OF[tb];
              temp[i] -= da;
              temp[i + 1] += db;
              const m = Math.max(da < 0 ? -da : da, db < 0 ? -db : db);
              if (m > WAKE_DT) {
                world.wakeHeat(x, y);
                if (m > MOVE_DT) world.wake(x, y);
              }
            }
          }
          if (y + 1 < h) {
            const d = temp[i] - temp[i + w];
            if (d >= MIN_DIFF || d <= -MIN_DIFF) {
              const ta = type[i];
              const tb = type[i + w];
              const q = HEAT_K[ta * N + tb] * d;
              const da = q * INV_CAP_OF[ta];
              const db = q * INV_CAP_OF[tb];
              temp[i] -= da;
              temp[i + w] += db;
              const m = Math.max(da < 0 ? -da : da, db < 0 ? -db : db);
              if (m > WAKE_DT) {
                world.wakeHeat(x, y);
                if (m > MOVE_DT) world.wake(x, y);
              }
            }
          }
          if (x === x0 && leftAsleep) exchange(world, i - 1, i, x, y);
          if (y === y0 && upAsleep) exchange(world, i - w, i, x, y);
        }
      }
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const i = y * w + x;
          // Still air at room temperature has nothing to settle.
          if (type[i] === EMPTY) {
            if (temp[i] === AMBIENT) continue;
          } else if (temp[i] >= T_MIN && temp[i] <= T_MAX && temp[i] < CALM_HI_OF[type[i]] && temp[i] > DOWN_T[type[i]] && conc[i] === 0) {
            // At rest between its thresholds: settle would return here at once.
            continue;
          }
          settle(world, i, x, y);
        }
      }
    }
  }
}

function exchange(world: World, a: number, b: number, x: number, y: number): void {
  const { type, temp } = world;
  const d = temp[a] - temp[b];
  if (d < MIN_DIFF && d > -MIN_DIFF) return;
  const ta = type[a];
  const tb = type[b];
  const q = HEAT_K[ta * N + tb] * d;
  const da = q * INV_CAP_OF[ta];
  const db = q * INV_CAP_OF[tb];
  temp[a] -= da;
  temp[b] += db;
  if (da > WAKE_DT || da < -WAKE_DT || db > WAKE_DT || db < -WAKE_DT) {
    world.wakeHeat(x, y);
    if (da > MOVE_DT || da < -MOVE_DT || db > MOVE_DT || db < -MOVE_DT) world.wake(x, y);
  }
}

function settle(world: World, i: number, x: number, y: number): void {
  const { type, temp } = world;
  const t = type[i];
  let T = temp[i];
  // Physical limits: nothing colder than absolute zero, nothing hotter than
  // T_MAX. Burning, current and blasts all add heat; without a ceiling a
  // runaway cell would reach Infinity, then NaN, and break every comparison.
  if (T < T_MIN || T > T_MAX || T !== T) {
    T = T !== T ? AMBIENT : T < T_MIN ? T_MIN : T_MAX;
    temp[i] = T;
  }
  if (t === EMPTY) {
    const d = AMBIENT - T;
    if (d === 0) return;
    // Air this close to room temperature is room temperature: snapping it lets the chunk sleep
    // seconds sooner than waiting out the slow tail of the cooling.
    if (d < AIR_SNAP && d > -AIR_SNAP) {
      temp[i] = AMBIENT;
      return;
    }
    temp[i] = T + d * AIR_RELAX;
    world.wakeHeat(x, y);
    return;
  }
  // Fast way out: between this element's nearest thresholds, with nothing soaked up, nothing can happen.
  if (T < CALM_HI_OF[t] && T > DOWN_T[t] && world.conc[i] === 0) return;
  // Hot enough to react (burn): make sure the cell pass sees it.
  if (T >= REACT_T_OF[t]) world.wake(x, y);
  // Explosives go off from heat alone: they carry their own oxygen.
  if (BLAST_POWER_OF[t] > 0 && T >= IGNITION_OF[t] && world.life[i] !== world.currentStamp()) {
    explode(world, x, y);
    return;
  }
  // Tanks rupture past their heat.
  if (T >= RUPTURE_T_OF[t]) {
    rupture(world, x, y);
    return;
  }
  // So do self-fed fuels (thermite): past ignition they start burning where they are.
  if (SELF_FED_OF[t] !== 0 && T >= IGNITION_OF[t]) {
    type[i] = FIRE;
    world.solute[i] = t;
    world.life[i] = FUEL_OF[t];
    if (T < FLAME_T_OF[t] * 0.8) temp[i] = FLAME_T_OF[t] * 0.8;
    world.wake(x, y);
    return;
  }
  // Baking: a one-way change by heat (clay → brick), sometimes giving off a gas.
  if (T >= BAKE_T_OF[t]) {
    type[i] = BAKE_INTO_OF[t];
    world.solute[i] = 0;
    world.conc[i] = 0;
    world.vy[i] = 0;
    const g = BAKE_GAS_OF[t];
    if (g !== 0 && y > 0 && type[i - world.w] === EMPTY) {
      world.place(i - world.w, g);
      temp[i - world.w] = T;
    }
    world.wake(x, y);
    return;
  }
  // Wet: above the boiling point of what it has soaked up, it dries out.
  const conc = world.conc;
  if (conc[i] !== 0 && SOLVENT_OF[world.solute[i]] !== 0 && PHASE_OF[t] === PH_POWDER && T > UP_T[world.solute[i]]) {
    conc[i] = conc[i] > 8 ? conc[i] - 8 : 0;
    if (conc[i] === 0) world.solute[i] = 0;
    temp[i] = T - 2;
    world.wake(x, y);
    return;
  }
  if (T > UP_T[t]) {
    // A liquid carrying a dissolved solid leaves it behind as crystals when it boils off.
    const s = world.solute[i];
    if (SOLVENT_OF[t] !== 0 && s !== 0 && conc[i] >= CONC_UNIT) {
      type[i] = s;
      world.solute[i] = 0;
      conc[i] = 0;
      temp[i] = T - UP_LATENT[t];
      world.vy[i] = 0;
      world.wake(x, y);
      return;
    }
    // Touching its mist liquid it gives off mist instead (dry ice in water: fog).
    let into = UP_INTO[t];
    if (MIST_WITH_OF[t] !== 0) {
      const wth = MIST_WITH_OF[t];
      if ((x > 0 && type[i - 1] === wth) || (x + 1 < world.w && type[i + 1] === wth) || (y + 1 < world.h && type[i + world.w] === wth) || (y > 0 && type[i - world.w] === wth)) into = MIST_INTO_OF[t];
    }
    type[i] = into;
    temp[i] = T - UP_LATENT[t];
    world.solute[i] = 0;
    conc[i] = 0;
    world.vy[i] = 0;
    world.wake(x, y);
    // A liquid or solid turning into gas swells enormously. In the open it just pushes air
    // aside; walled in, it builds pressure until the walls burst (or a valve opens).
    if (PHASE_OF[into] === PH_GAS && world.air.sealedAt(x, y)) world.air.addPressure(x, y, GAS_SWELL, SWELL_RADIUS);
  } else if (T < (SOLVENT_OF[t] !== 0 && conc[i] !== 0 ? DOWN_T[t] - conc[i] * FREEZE_DROP : DOWN_T[t])) {
    // (A solvent carrying a dissolved solid freezes lower: brine stays liquid below 0 °C.)
    let into = DOWN_INTO[t];
    // A solid forming over nothing solid becomes its rubble instead.
    if (RUBBLE_OF[into] !== 0) {
      const below = y + 1 < world.h ? PHASE_OF[type[i + world.w]] : PH_SOLID;
      if (below !== PH_SOLID && below !== PH_POWDER) into = RUBBLE_OF[into];
    }
    type[i] = into;
    temp[i] = T + DOWN_LATENT[t];
    world.vy[i] = 0;
    world.wake(x, y);
  }
}
