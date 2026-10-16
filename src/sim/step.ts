import { EMPTY, GRAVITY_OF, PHASE_OF, PH_POWDER, VMAX_OF, VY_UNIT } from './elements';
import type { World } from './world';

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
 * Powder: fall straight down, speeding up by the element's gravity up to its
 * top speed. On landing, half the speed carries into sliding. If blocked,
 * slide one cell down-left or down-right (random order if both are open);
 * sliding starts at 3/4 cell per frame and builds to one cell per frame, so
 * grains ease onto a slope instead of snapping. Otherwise rest.
 * Grid edges act as walls.
 */
function updatePowder(world: World, x: number, y: number, i: number, st: number): void {
  const { w, h, type, vy, stamp } = world;
  if (y + 1 >= h) {
    if (vy[i] !== 0) vy[i] = 0;
    return;
  }
  const t = type[i];
  const g = GRAVITY_OF[t];
  const sub = DITHER[(world.frame + world.shade[i]) & 31];

  const below = i + w;
  if (type[below] === EMPTY) {
    let v = vy[i] + g;
    if (v > VMAX_OF[t]) v = VMAX_OF[t];
    const dist = (v + sub) >> SHIFT;
    if (dist === 0) {
      // Still gathering speed; moves on a later frame.
      vy[i] = v;
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
        v >>= 1;
      }
    }
    swap(world, i, j);
    vy[j] = v;
    stamp[j] = st;
    return;
  }

  // The cell below is in free fall but has not moved yet this frame (still
  // gathering speed): fall with it rather than treat it as ground.
  if (vy[below] > 0 && y + 2 < h && type[below + w] === EMPTY && PHASE_OF[type[below]] === PH_POWDER) {
    let v = vy[i] + g;
    if (v > vy[below]) v = vy[below];
    vy[i] = v;
    return;
  }

  const openL = x > 0 && type[below - 1] === EMPTY;
  const openR = x + 1 < w && type[below + 1] === EMPTY;
  if (!openL && !openR) {
    if (vy[i] !== 0) vy[i] = 0;
    return;
  }
  let v = (vy[i] < SLIDE_START ? SLIDE_START : vy[i]) + g;
  if (v > VY_UNIT) v = VY_UNIT;
  if ((v + sub) >> SHIFT === 0) {
    vy[i] = v;
    return;
  }
  let j: number;
  if (openL && openR) j = world.rng.nextU32() & 1 ? below + 1 : below - 1;
  else j = openL ? below - 1 : below + 1;
  swap(world, i, j);
  vy[j] = v;
  stamp[j] = st;
}
