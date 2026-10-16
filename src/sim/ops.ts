import { EMPTY, PHASE_OF, PH_GAS, PH_LIQUID, PH_POWDER } from './elements';
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
/** Chance per empty cell per stamp that a powder grain appears, so pours look like a stream. */
const POWDER_FILL = 0.3;
/** Same for liquids and gases: separate drops that merge as they land. */
const LIQUID_FILL = 0.45;

export function applyOp(world: World, op: Op): void {
  if (op.kind === OP_CLEAR) {
    world.clearCells();
    return;
  }
  if (op.kind === OP_WIND) {
    world.air.addVelocity(op.x, op.y, op.vx, op.vy, op.r);
    world.wake(Math.max(0, Math.min(world.w - 1, op.x)), Math.max(0, Math.min(world.h - 1, op.y)));
    return;
  }
  stamp(world, op.x, op.y, op.r, op.mode);
}

/** One disc of the brush centred on (cx, cy): place, erase, heat or cool. */
function stamp(world: World, cx: number, cy: number, r: number, mode: number): void {
  const { w, h, type } = world;
  const r2 = r * r + r;
  const ph = mode < 0 ? 0 : PHASE_OF[mode];
  const p = ph === PH_POWDER ? POWDER_FILL : ph === PH_LIQUID || ph === PH_GAS ? LIQUID_FILL : 1;
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
        const T = world.temp[i] + (mode === MODE_HEAT ? TOOL_DT : -TOOL_DT);
        world.temp[i] = T > 3000 ? 3000 : T < -200 ? -200 : T;
        world.wake(x, y);
      } else if (type[i] === EMPTY && (p >= 1 || world.rng.next() < p)) {
        world.place(i, mode);
      }
    }
  }
}
