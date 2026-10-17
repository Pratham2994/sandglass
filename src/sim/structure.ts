import { CRUMBLES_INTO_OF, ELEMENTS, EMPTY, PHASE_OF, PH_ENERGY, PH_GAS, PH_LIQUID, PH_SOLID, SPAN_OF, TENSION_OF } from './elements';

/** Density by element (kg/m³): a falling block sinks only through liquid lighter than itself. */
const DENSITY = Float32Array.from(ELEMENTS, (e) => e.density);
import { CHUNK_SHIFT, type World } from './world';

/*
 * Structure. Stone, brick, concrete, ice, wood and the like need holding up.
 *
 * Every few frames a search starts from every structural cell that is held
 * directly: standing on the floor, resting on anything solid or powdery that
 * needs no support itself (wall, metal, sand), or built into a wall or metal
 * at its side or above. From there support spreads: straight up a column for
 * free (it bears down on what is under it), one step for each cell out to
 * the side or hanging below. A cell holds only as far as its span: stone
 * reaches 6 cells past its support, steel beam 60. Rope and chain carry what
 * hangs below them for free but hold nothing up and nothing sideways.
 *
 * Cells that nothing holds break off and fall as rigid blocks (their `vy`,
 * otherwise unused by solids, counts the frames they have fallen, so the
 * state is part of the world and rewinds exactly). A block falls one cell a
 * frame through air, gas and liquid; landing after a long fall cracks part of
 * it into rubble (stone into gravel). Landed, it is checked again like any
 * other structure.
 */

/** Frames between support checks. */
const CHECK_EVERY = 8;
/** A block that fell at least this many cells cracks when it lands; this share of its cells crumbles. */
const HARD_LANDING = 12;
const CRACK_SHARE = 0.3;

interface Scratch {
  size: number;
  /** Support distance per cell from the last check (-1: not held, or not structural). */
  dist: Int16Array;
  /** 0-1 search deque. */
  deque: Int32Array;
  /** Falling cells this frame, and the block each belongs to (-1: not falling). */
  falling: Int32Array;
  blockOf: Int32Array;
  order: Int32Array;
}

const scratches = new WeakMap<World, Scratch>();

function scratchFor(world: World): Scratch {
  let s = scratches.get(world);
  if (s && s.size === world.size) return s;
  s = {
    size: world.size,
    dist: new Int16Array(world.size).fill(-1),
    deque: new Int32Array(2 * world.size + 2),
    falling: new Int32Array(world.size),
    blockOf: new Int32Array(world.size).fill(-1),
    order: new Int32Array(world.size),
  };
  scratches.set(world, s);
  return s;
}

/** Is a cell of type t structural (needs support)? */
const structural = (t: number): boolean => SPAN_OF[t] >= 0;

/** Is structural cell i held directly: on the floor, on something that needs no support, or built into a rigid solid? */
function anchored(world: World, i: number, x: number, y: number): boolean {
  const { w, h, type, vy } = world;
  if (y === h - 1) return true;
  const tension = TENSION_OF[type[i]] !== 0;
  const below = type[i + w];
  const pb = PHASE_OF[below];
  if (!tension && below !== EMPTY && pb !== PH_GAS && pb !== PH_ENERGY && pb !== PH_LIQUID && !structural(below)) return true;
  // Built into a wall or metal beside or above it (rope tied to it).
  for (let d = 0; d < 3; d++) {
    const j = d === 0 ? (x > 0 ? i - 1 : -1) : d === 1 ? (x + 1 < w ? i + 1 : -1) : y > 0 ? i - w : -1;
    if (j < 0) continue;
    const tj = type[j];
    if (PHASE_OF[tj] === PH_SOLID && !structural(tj) && vy[j] === 0) return true;
  }
  return false;
}

/** Marks every structural cell nothing holds up as falling. */
function findUnsupported(world: World, s: Scratch): void {
  const { w, h, type, vy } = world;
  const { dist, deque } = s;
  const cap = deque.length;
  dist.fill(-1);
  let head = cap >> 1;
  let tail = head;
  for (let i = 0; i < world.size; i++) {
    const t = type[i];
    if (!structural(t) || vy[i] !== 0) continue;
    const x = i % w;
    const y = (i / w) | 0;
    if (anchored(world, i, x, y)) {
      dist[i] = 0;
      deque[tail++] = i;
    }
  }
  // 0-1 breadth-first search: free steps go to the front, costly ones to the back.
  while (head < tail) {
    const c = deque[head++];
    const d = dist[c];
    const tc = type[c];
    const x = c % w;
    const y = (c / w) | 0;
    for (let k = 0; k < 4; k++) {
      let n: number;
      let cost: number;
      if (k === 0) {
        // Up: a column bears on what is under it; rope pushes nothing up.
        if (y === 0 || TENSION_OF[tc] !== 0) continue;
        n = c - w;
        cost = 0;
      } else if (k === 1) {
        // Down: hanging below; free from rope or chain.
        if (y + 1 >= h) continue;
        n = c + w;
        cost = TENSION_OF[tc] !== 0 || TENSION_OF[type[n]] !== 0 ? 0 : 1;
      } else {
        // Sideways: one step out; rope holds nothing sideways.
        const dx = k === 2 ? -1 : 1;
        if (x + dx < 0 || x + dx >= w) continue;
        n = c + dx;
        if (TENSION_OF[tc] !== 0 || TENSION_OF[type[n]] !== 0) continue;
        cost = 1;
      }
      const tn = type[n];
      if (!structural(tn) || vy[n] !== 0) continue;
      const nd = d + cost;
      if (nd > SPAN_OF[tn] || (dist[n] !== -1 && dist[n] <= nd)) continue;
      dist[n] = nd;
      if (cost === 0 && head > 0) deque[--head] = n;
      else if (tail < cap) deque[tail++] = n;
    }
  }
  for (let i = 0; i < world.size; i++) {
    if (dist[i] !== -1 || vy[i] !== 0 || !structural(type[i])) continue;
    vy[i] = 1;
    world.wake(i % w, (i / w) | 0);
  }
}

/** Can a falling block cell of type b move into cell j? Air, gas and flames give way; liquid only if lighter than the block (ice floats). */
function givesWay(world: World, j: number, b: number): boolean {
  const t = world.type[j];
  if (t === EMPTY) return true;
  const ph = PHASE_OF[t];
  return ph === PH_GAS || ph === PH_ENERGY || (ph === PH_LIQUID && DENSITY[t] < DENSITY[b]);
}

/** Moves every falling block down a cell, or lands it. */
function moveFalling(world: World, s: Scratch): void {
  const { w, h, cw, ch, awake, type, vy } = world;
  const { falling, blockOf, order } = s;
  // Falling cells keep their chunks awake, so the awake chunks hold them all; bottom row first.
  let n = 0;
  for (let cy = ch - 1; cy >= 0; cy--) {
    for (let cx = 0; cx < cw; cx++) {
      if (awake[cy * cw + cx] === 0) continue;
      const x0 = cx << CHUNK_SHIFT;
      const y0 = cy << CHUNK_SHIFT;
      const x1 = Math.min(x0 + (1 << CHUNK_SHIFT), w);
      const y1 = Math.min(y0 + (1 << CHUNK_SHIFT), h);
      for (let y = y0; y < y1; y++)
        for (let x = x0; x < x1; x++) {
          const i = y * w + x;
          if (vy[i] !== 0 && structural(type[i])) falling[n++] = i;
        }
    }
  }
  if (n === 0) return;
  // Bottom-up order, so each cell moves into the space the one below it left.
  const list = falling.subarray(0, n).sort().reverse();
  for (let k = 0; k < n; k++) blockOf[list[k]] = -2;
  const st = world.currentStamp();
  for (let k = 0; k < n; k++) {
    const start = list[k];
    if (blockOf[start] !== -2) continue;
    // Gather the block: falling cells joined to this one.
    let size = 0;
    blockOf[start] = k;
    order[size++] = start;
    for (let q = 0; q < size; q++) {
      const c = order[q];
      const x = c % w;
      for (let d = 0; d < 4; d++) {
        const j = d === 0 ? (x > 0 ? c - 1 : -1) : d === 1 ? (x + 1 < w ? c + 1 : -1) : d === 2 ? c - w : c + w;
        if (j < 0 || j >= world.size || blockOf[j] !== -2) continue;
        blockOf[j] = k;
        order[size++] = j;
      }
    }
    const block = order.subarray(0, size).sort().reverse();
    let free = true;
    for (let q = 0; q < size && free; q++) {
      const c = block[q];
      if (c + w >= world.size) free = false;
      else if (blockOf[c + w] !== k && !givesWay(world, c + w, type[c])) free = false;
    }
    if (free) {
      for (let q = 0; q < size; q++) {
        const c = block[q];
        const fallen = vy[c];
        world.swapCells(c, c + w);
        vy[c + w] = fallen < 127 ? fallen + 1 : 127;
        world.stamp[c + w] = st;
        world.wake(c % w, ((c + w) / w) | 0);
      }
    } else {
      // Landed: a hard landing cracks part of it into rubble; then it stands (and is checked again).
      const hard = vy[block[0]] >= HARD_LANDING;
      for (let q = 0; q < size; q++) {
        const c = block[q];
        vy[c] = 0;
        const into = CRUMBLES_INTO_OF[type[c]];
        if (hard && into !== 0 && world.rng.next() < CRACK_SHARE) {
          const T = world.temp[c];
          world.place(c, into);
          world.temp[c] = T;
        }
        world.wake(c % w, (c / w) | 0);
      }
    }
  }
  for (let k = 0; k < n; k++) blockOf[list[k]] = -1;
  // Cells that moved this frame left their old index; clear around them too.
  for (let k = 0; k < n; k++) {
    const c = list[k] + w;
    if (c < world.size) blockOf[c] = -1;
  }
}

/** One frame of structure: check support now and then, and move falling blocks every frame. No allocations. */
export function structureStep(world: World): void {
  const s = scratchFor(world);
  if (world.frame % CHECK_EVERY === 0) findUnsupported(world, s);
  moveFalling(world, s);
}

/** How far structural cell i was from its support at the last check, or -1 if not held (for the inspector). */
export function supportAt(world: World, i: number): number {
  const s = scratches.get(world);
  return s && s.size === world.size ? s.dist[i] : -1;
}
