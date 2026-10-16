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
  PH_POWDER,
  PH_SOLID,
  RUBBLE_OF,
  CONC_UNIT,
  SOLVENT_OF,
  UP_T,
} from './elements';
import { CHUNK_SHIFT, type World } from './world';

const N = ELEMENT_COUNT;
/** A temperature change bigger than this keeps a chunk awake (spec: 0.05 °C). */
const WAKE_DT = 0.05;
/** Differences smaller than this are not worth exchanging. */
const MIN_DIFF = 0.01;
/** Air drifts back to room temperature by this fraction per frame (heat lost to the room). */
const AIR_RELAX = 0.005;

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
export function heatStep(world: World): void {
  const { w, h, cw, ch, awake } = world;
  for (let cy = 0; cy < ch; cy++) {
    for (let cx = 0; cx < cw; cx++) {
      if (awake[cy * cw + cx] === 0) continue;
      const x0 = cx << CHUNK_SHIFT;
      const y0 = cy << CHUNK_SHIFT;
      const x1 = Math.min(x0 + (1 << CHUNK_SHIFT), w);
      const y1 = Math.min(y0 + (1 << CHUNK_SHIFT), h);
      const leftAsleep = cx > 0 && awake[cy * cw + cx - 1] === 0;
      const upAsleep = cy > 0 && awake[(cy - 1) * cw + cx] === 0;
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const i = y * w + x;
          if (x + 1 < w) exchange(world, i, i + 1, x, y);
          if (y + 1 < h) exchange(world, i, i + w, x, y);
          if (x === x0 && leftAsleep) exchange(world, i - 1, i, x, y);
          if (y === y0 && upAsleep) exchange(world, i - w, i, x, y);
        }
      }
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) settle(world, y * w + x, x, y);
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
  if (da > WAKE_DT || da < -WAKE_DT || db > WAKE_DT || db < -WAKE_DT) world.wake(x, y);
}

function settle(world: World, i: number, x: number, y: number): void {
  const { type, temp } = world;
  const t = type[i];
  const T = temp[i];
  if (t === EMPTY) {
    const d = AMBIENT - T;
    if (d === 0) return;
    if (d < WAKE_DT && d > -WAKE_DT) {
      temp[i] = AMBIENT;
      return;
    }
    temp[i] = T + d * AIR_RELAX;
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
    type[i] = UP_INTO[t];
    temp[i] = T - UP_LATENT[t];
    world.solute[i] = 0;
    conc[i] = 0;
    world.vy[i] = 0;
    world.wake(x, y);
  } else if (T < DOWN_T[t]) {
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
