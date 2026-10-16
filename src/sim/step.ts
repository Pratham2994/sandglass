import {
  DISPERSION_OF,
  ELEMENT_COUNT,
  EMPTY,
  ENTER_P,
  GRAVITY_OF,
  PHASE_OF,
  PH_LIQUID,
  PH_POWDER,
  VMAX_OF,
  VY_UNIT,
} from './elements';
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
/** Top speed while sinking through a liquid: drag holds it to 1/4 cell per frame. */
const SINK_VMAX = VY_UNIT >> 2;
const N = ELEMENT_COUNT;
/** How far a liquid surface cell looks sideways for a drop. Bounds the cost on wide lakes. */
const FLOW_SEARCH = 160;
/** Speed a liquid keeps after a sideways move: half a cell per frame. */
const FLOW_VY = VY_UNIT >> 1;

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
      if (ph === PH_POWDER || ph === PH_LIQUID) updateMover(world, x, y, i, st, ph === PH_LIQUID);
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
  const pb = PHASE_OF[tb];
  if (vy[below] > 0 && y + 2 < h && type[below + w] === EMPTY && (pb === PH_POWDER || pb === PH_LIQUID)) {
    let v = vy[i] + g;
    if (v > vy[below]) v = vy[below];
    vy[i] = v;
    return;
  }

  // 2. Sink into a lighter liquid.
  if (ENTER_P[t * N + tb] !== 0) {
    let v = vy[i] + g;
    if (v > SINK_VMAX) v = SINK_VMAX;
    if ((v + sub) >> SHIFT !== 0 && canEnter(world, t, below)) moveTo(world, i, below, v, st);
    else vy[i] = v;
    return;
  }

  // 3. Slide down a slope.
  const openL = x > 0 && ENTER_P[t * N + type[below - 1]] !== 0;
  const openR = x + 1 < w && ENTER_P[t * N + type[below + 1]] !== 0;
  if (openL || openR) {
    let v = vy[i];
    if (!liquid) {
      v = (v < SLIDE_START ? SLIDE_START : v) + g;
      if (v > VY_UNIT) v = VY_UNIT;
      if ((v + sub) >> SHIFT === 0) {
        vy[i] = v;
        return;
      }
    }
    let j: number;
    if (openL && openR) j = world.rng.nextU32() & 1 ? below + 1 : below - 1;
    else j = openL ? below - 1 : below + 1;
    if (canEnter(world, t, j)) {
      moveTo(world, i, j, v > VY_UNIT ? VY_UNIT : v, st);
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
          return;
        }
      }
    }
  }

  if (vy[i] !== 0) vy[i] = 0;
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
