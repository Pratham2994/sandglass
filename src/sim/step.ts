import { EMPTY, PHASE_OF, PH_POWDER } from './elements';
import type { World } from './world';

/** Fall speed gained per frame, in quarter cells per frame. */
const GRAVITY = 1;
/** Top fall speed: 20 quarter cells = 5 cells per frame. */
const MAX_VY = 20;

/**
 * Cell pass: one simulation frame.
 * Rows run bottom to top. The horizontal direction flips per row and per
 * frame so nothing drifts to one side. A cell that moved this frame carries
 * the frame's stamp and is skipped if the scan reaches it again.
 * Movement only swaps cells, so the cell count of each element never changes.
 * No allocations in here.
 */
export function step(world: World): void {
  const { w, h, type } = world;
  const st = world.currentStamp();
  const stamp = world.stamp;
  for (let y = h - 1; y >= 0; y--) {
    const ltr = ((y + world.frame) & 1) === 0;
    const row = y * w;
    for (let k = 0; k < w; k++) {
      const x = ltr ? k : w - 1 - k;
      const i = row + x;
      const ph = PHASE_OF[type[i]];
      if (ph === 0 || stamp[i] === st) continue;
      if (ph === PH_POWDER) updatePowder(world, x, y, i, st);
    }
  }
  world.frame++;
}

/** Swaps every field of cells i and j. */
function swap(world: World, i: number, j: number): void {
  const { type, vy, stamp, shade } = world;
  const t = type[i];
  type[i] = type[j];
  type[j] = t;
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
 * Powder: fall straight down, speeding up while the path is clear.
 * If blocked, slide one cell down-left or down-right (random order if both
 * are open). Otherwise rest. Grid edges act as walls.
 */
function updatePowder(world: World, x: number, y: number, i: number, st: number): void {
  const { w, h, type, vy, stamp } = world;
  if (y + 1 >= h) {
    vy[i] = 0;
    return;
  }

  const below = i + w;
  if (type[below] === EMPTY) {
    let v = vy[i] + GRAVITY;
    if (v > MAX_VY) v = MAX_VY;
    // Whole cells this frame. Speed is in quarter cells; a per-cell, per-frame
    // offset spreads the remainder over frames without using the RNG.
    let dist = (v + ((world.frame + world.shade[i]) & 3)) >> 2;
    if (dist < 1) dist = 1;

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
      // its speed so streams stay together; on anything at rest, land.
      const next = j + w;
      if (ny + 1 < h && stamp[next] === st && vy[next] > 0) {
        if (vy[next] < v) v = vy[next];
      } else {
        v = 0;
      }
    }
    swap(world, i, j);
    vy[j] = v;
    stamp[j] = st;
    return;
  }

  const openL = x > 0 && type[below - 1] === EMPTY;
  const openR = x + 1 < w && type[below + 1] === EMPTY;
  let j: number;
  if (openL && openR) j = world.rng.nextU32() & 1 ? below + 1 : below - 1;
  else if (openL) j = below - 1;
  else if (openR) j = below + 1;
  else {
    if (vy[i] !== 0) vy[i] = 0;
    return;
  }
  const v = vy[i] >> 1;
  swap(world, i, j);
  vy[j] = v;
  stamp[j] = st;
}
