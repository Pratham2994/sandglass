import { BODY_OF, EMPTY, GATE_OF, GATE_SWITCH, GROWS_INTO_OF, HABITAT_OF, SHAPE_OF, PART_OF, PHASE_OF, PH_GAS, PH_LIQUID, PH_POWDER, WIRE } from './elements';
import { placeBody, placeShape } from './step';
import type { World } from './world';

/**
 * Everything the player does to the world, as small records. The brush
 * produces them; the timeline logs them by frame and replays them, so a
 * rewound or replayed run gets exactly the same input at exactly the same
 * place in the frame order. Applying an op uses the world's own RNG, so a
 * replay is identical too.
 */

export const OP_STAMP = 0;
export const OP_WIND = 1;
export const OP_CLEAR = 2;
/** Click on a switch: it and every switch cell joined to it flip between closed and open. */
export const OP_TOGGLE = 3;

/** Stamp modes that are not elements. */
export const MODE_ERASE = -1;
export const MODE_HEAT = -2;
export const MODE_COOL = -3;

export interface Op {
  kind: number;
  x: number;
  y: number;
  /** Brush radius in cells. */
  r: number;
  /** Stamp: element id, or a MODE_* value. */
  mode: number;
  /** Wind: air speed added. */
  vx: number;
  vy: number;
}

/** °C a heat or cool stamp adds or takes. */
const TOOL_DT = 14;
/** The heat tool levels off here: hot enough to melt rock and iron, not so hot the whole scene boils away. */
const TOOL_MAX = 1500;
const TOOL_MIN = -100;
/** Chance per empty cell per stamp that a powder grain appears, so pours look like a stream. */
const POWDER_FILL = 0.3;
/** Same for liquids and gases: separate drops that merge as they land. */
const LIQUID_FILL = 0.45;
/** Animals and seeds per brush stamp, whatever the brush size: a big brush gives a flock or a scatter, not a solid block. */
const CREATURE_PER_STAMP = 0.5;
const SEED_PER_STAMP = 1;
/** Free space kept round each new animal or seed (cells), so they come out spaced. */
const CREATURE_GAP = 4;
const SEED_GAP = 3;
/** Space kept between painted objects (eggs). */
const SHAPE_GAP = 5;

export function applyOp(world: World, op: Op): void {
  if (op.kind === OP_CLEAR) {
    world.clearCells();
    return;
  }
  if (op.kind === OP_TOGGLE) {
    toggleSwitch(world, op.x, op.y);
    return;
  }
  if (op.kind === OP_WIND) {
    world.air.addVelocity(op.x, op.y, op.vx, op.vy, op.r);
    world.wake(Math.max(0, Math.min(world.w - 1, op.x)), Math.max(0, Math.min(world.h - 1, op.y)));
    return;
  }
  // The player's own strokes appear and vanish at once; only what the world does to itself morphs.
  world.quiet = true;
  stamp(world, op.x, op.y, op.r, op.mode);
  world.quiet = false;
}

/** Is there a switch at cell (x, y)? */
export function isSwitchAt(world: World, x: number, y: number): boolean {
  return x >= 0 && y >= 0 && x < world.w && y < world.h && GATE_OF[world.type[y * world.w + x]] === GATE_SWITCH;
}

/**
 * Flips the switch at (x, y) and every switch cell joined to it, so a
 * switch drawn several cells thick works as one. Open is kept in `conc`
 * (1) and shown by the shade, which picks the switch's open colour.
 */
function toggleSwitch(world: World, x: number, y: number): void {
  if (!isSwitchAt(world, x, y)) return;
  const { w, h, type, conc, shade } = world;
  const t = type[y * w + x];
  const open = conc[y * w + x] === 0 ? 1 : 0;
  const stack = [y * w + x];
  const seen = new Set<number>(stack);
  while (stack.length) {
    const i = stack.pop()!;
    conc[i] = open;
    shade[i] = open ? shade[i] | 128 : shade[i] & 127;
    const cx = i % w;
    const cy = (i / w) | 0;
    world.wake(cx, cy);
    for (const j of [cx > 0 ? i - 1 : -1, cx + 1 < w ? i + 1 : -1, cy > 0 ? i - w : -1, cy + 1 < h ? i + w : -1]) {
      if (j >= 0 && type[j] === t && !seen.has(j)) {
        seen.add(j);
        stack.push(j);
      }
    }
  }
}

/** True if element t is already within `gap` cells of (x, y). */
function crowded(world: World, x: number, y: number, t: number, gap: number): boolean {
  if (gap === 0) return false;
  const { w, h, type } = world;
  for (let yy = Math.max(0, y - gap); yy <= Math.min(h - 1, y + gap); yy++)
    for (let xx = Math.max(0, x - gap); xx <= Math.min(w - 1, x + gap); xx++) if (type[yy * w + xx] === t) return true;
  return false;
}

/**
 * One disc of the brush centred on (cx, cy): place, erase, heat or cool.
 * A circuit part painted onto wire replaces the wire under it, so it sits
 * in the circuit.
 */
function stamp(world: World, cx: number, cy: number, r: number, mode: number): void {
  const { w, h, type } = world;
  const intoWire = mode >= 0 && PART_OF[mode] !== 0;
  const r2 = r * r + r;
  const ph = mode < 0 ? 0 : PHASE_OF[mode];
  const animal = mode >= 0 && HABITAT_OF[mode] !== 0;
  const shaped = mode >= 0 && SHAPE_OF[mode] !== null;
  const seed = mode >= 0 && (GROWS_INTO_OF[mode] !== 0 || shaped);
  const gap = animal ? CREATURE_GAP : shaped ? SHAPE_GAP : seed ? SEED_GAP : 0;
  const area = Math.max(1, Math.PI * r2);
  const p = animal
    ? Math.min(1, CREATURE_PER_STAMP / area)
    : seed
      ? Math.min(1, SEED_PER_STAMP / area)
      : ph === PH_POWDER
        ? POWDER_FILL
        : ph === PH_LIQUID || ph === PH_GAS
          ? LIQUID_FILL
          : 1;
  const y0 = Math.max(0, cy - r);
  const y1 = Math.min(h - 1, cy + r);
  const x0 = Math.max(0, cx - r);
  const x1 = Math.min(w - 1, cx + r);
  for (let y = y0; y <= y1; y++) {
    const dy = y - cy;
    for (let x = x0; x <= x1; x++) {
      const dx = x - cx;
      if (dx * dx + dy * dy > r2) continue;
      const i = y * w + x;
      if (mode === MODE_ERASE) {
        if (type[i] !== EMPTY) world.place(i, EMPTY);
      } else if (mode === MODE_HEAT || mode === MODE_COOL) {
        const T0 = world.temp[i];
        // Heat stops at the tool limit and leaves anything already hotter alone; cool stops at its floor.
        if (mode === MODE_HEAT) {
          if (T0 < TOOL_MAX) world.temp[i] = Math.min(TOOL_MAX, T0 + TOOL_DT);
        } else if (T0 > TOOL_MIN) world.temp[i] = Math.max(TOOL_MIN, T0 - TOOL_DT);
        world.wake(x, y);
      } else if (shaped) {
        // Objects (an egg) are placed whole, spaced apart.
        if (world.rng.next() < p && !crowded(world, x, y, mode, gap)) placeShape(world, x, y, mode);
      } else if (mode >= 0 && BODY_OF[mode] !== null) {
        // Animals with a body are placed whole, wherever there is room for them (fish into water too).
        if (world.rng.next() < p && !crowded(world, x, y, mode, gap)) placeBody(world, x, y, mode);
      } else if (
        (type[i] === EMPTY || (intoWire && type[i] === WIRE)) &&
        (p >= 1 || world.rng.next() < p) &&
        (gap === 0 || !crowded(world, x, y, mode, gap))
      ) {
        world.place(i, mode);
      }
    }
  }
  if (intoWire) sever(world, cx, cy, r, mode);
}

/**
 * A part painted onto a wire cuts right through it: across the width of
 * the brush, wire left on either side of it across the wire's run becomes
 * the part too, out to the wire's edge (at most three brush radii), so no
 * strip of wire is left to carry the current round the part. Which way the
 * wire runs is read from the spread of the wire cells around the brush.
 */
function sever(world: World, cx: number, cy: number, r: number, mode: number): void {
  const { w, h, type } = world;
  const reach = Math.max(2, 3 * r);
  let n = 0;
  let sx = 0;
  let sy = 0;
  let sxx = 0;
  let syy = 0;
  for (let y = Math.max(0, cy - reach); y <= Math.min(h - 1, cy + reach); y++) {
    for (let x = Math.max(0, cx - reach); x <= Math.min(w - 1, cx + reach); x++) {
      if (type[y * w + x] !== WIRE) continue;
      n++;
      sx += x;
      sy += y;
      sxx += x * x;
      syy += y * y;
    }
  }
  if (n === 0) return;
  // A wire spread out left to right runs across: cut it up and down (each column), and the other way round.
  const rows = sxx / n - (sx / n) ** 2 >= syy / n - (sy / n) ** 2;
  for (let k = -r; k <= r; k++) {
    for (const dir of [-1, 1]) {
      for (let s = 0; s <= reach; s++) {
        const x = rows ? cx + k : cx + dir * s;
        const y = rows ? cy + dir * s : cy + k;
        if (x < 0 || y < 0 || x >= w || y >= h) break;
        const i = y * w + x;
        if (type[i] === WIRE) world.place(i, mode);
        else if (type[i] !== mode) break;
      }
    }
  }
}
