import type { FixedLoop } from '../core/loop';
import type { Timeline } from '../core/timeline';
import { OP_STAMP } from '../sim/ops';
import type { Brush } from '../input/brush';
import type { Renderer } from '../render/renderer';
import { P_MIN_T, P_PROB, P_RULE, explain } from '../sim/chem';
import { ELEMENTS, ELEMENT_COUNT, EMPTY, elementId } from '../sim/elements';
import { inspectCell, type CellReport } from '../sim/inspect';
import type { World } from '../sim/world';

/**
 * Dev-only test hook on `window.__sim`. Loaded with a dynamic import behind
 * `import.meta.env.DEV`, so it is not in production builds.
 * E2E tests drive the sim through it and assert exact counts and hashes.
 */
export interface SimHook {
  readonly width: number;
  readonly height: number;
  readonly frame: number;
  /** Element keys by id. */
  readonly elements: string[];
  /** Clears the grid, reseeds the RNG and pauses the live loop, so only `step` advances it. */
  reset(seed?: number): void;
  pause(): void;
  play(): void;
  /** Fills a rectangle (clamped to the grid) with an element, replacing what was there. Returns cells set. */
  fill(x: number, y: number, w: number, h: number, element: string): number;
  /** Runs n fixed steps synchronously (input first, as in the live loop), then draws once. */
  step(n?: number): void;
  /** Cells of one element, or all non-empty cells if no element is given. */
  count(element?: string): number;
  /** Element key at (x, y). */
  cell(x: number, y: number): string;
  /** The compiled reaction of element a touching element b: reason text and raw entry, or null. */
  pair(a: string, b: string): { reason: string; rule: number; prob: number; minT: number } | null;
  /** The inspect lens report for cell (x, y). */
  inspect(x: number, y: number): CellReport | null;
  /** Adds wind (vx, vy) around cell (x, y), over radius r, as the wind tool does. */
  wind(x: number, y: number, vx: number, vy: number, r: number): void;
  /** Paints a disc of an element at (x, y) as the brush would: recorded in the timeline, so it replays. */
  paint(x: number, y: number, r: number, element: string): void;
  /** Rewinds or replays to frame f, as the scrubber does. */
  seek(f: number): void;
  /** Current frame and the range the timeline can reach. */
  time(): { frame: number; oldest: number; newest: number };
  /** Everything stored in cell (x, y). */
  probe(x: number, y: number): { key: string; temp: number; life: number; solute: string; conc: number };
  /** Height of the filled stack in each column, counted from the bottom row up to the first empty cell. */
  heights(): number[];
  /** Hash of the whole grid, 8 hex digits. */
  hash(): string;
  /** Chunks that ran in the last frame, and the total. */
  chunks(): { awake: number; total: number };
}

declare global {
  interface Window {
    __sim?: SimHook;
  }
}

export interface HookTargets {
  world: World;
  loop: FixedLoop;
  brush: Brush;
  renderer: Renderer;
  frame(): void;
  timeline: Timeline;
}

export function installSimHook(t: HookTargets): void {
  const { world, loop, brush, renderer } = t;
  const hook: SimHook = {
    get width() {
      return world.w;
    },
    get height() {
      return world.h;
    },
    get frame() {
      return world.frame;
    },
    elements: ELEMENTS.map((e) => e.key),
    reset(seed = 1) {
      loop.paused = true;
      brush.cancel();
      world.reset(seed);
      t.timeline.reset();
      renderer.draw(world);
    },
    pause() {
      loop.paused = true;
    },
    play() {
      loop.paused = false;
    },
    fill(x, y, w, h, element) {
      const id = elementId(element);
      const x0 = Math.max(0, Math.floor(x));
      const y0 = Math.max(0, Math.floor(y));
      const x1 = Math.min(world.w, Math.floor(x + w));
      const y1 = Math.min(world.h, Math.floor(y + h));
      let n = 0;
      for (let yy = y0; yy < y1; yy++) {
        for (let xx = x0; xx < x1; xx++) {
          world.place(yy * world.w + xx, id);
          n++;
        }
      }
      // No redraw here: scripts fill thousands of rects; the next step or frame draws.
      loop.invalidate();
      // A fill is not a recorded op, so history restarts from here (replays stay exact).
      t.timeline.reset();
      return n;
    },
    step(n = 1) {
      for (let k = 0; k < n; k++) t.frame();
      renderer.draw(world);
    },
    count(element) {
      return element === undefined ? world.countFilled() : world.count(elementId(element));
    },
    cell(x, y) {
      if (x < 0 || y < 0 || x >= world.w || y >= world.h) throw new Error(`Out of grid: ${x}, ${y}`);
      return ELEMENTS[world.type[y * world.w + x]].key;
    },
    pair(a, b) {
      const ia = elementId(a);
      const ib = elementId(b);
      const reason = explain(ia, ib);
      if (reason === null) return null;
      const k = ia * ELEMENT_COUNT + ib;
      return { reason, rule: P_RULE[k], prob: P_PROB[k], minT: P_MIN_T[k] };
    },
    inspect(x, y) {
      return inspectCell(world, x, y);
    },
    wind(x, y, vx, vy, r) {
      world.air.addVelocity(x, y, vx, vy, r);
      world.wakeAll();
    },
    paint(x, y, r, element) {
      t.timeline.record({ kind: OP_STAMP, x, y, r, mode: elementId(element), vx: 0, vy: 0 });
    },
    seek(f) {
      t.timeline.seek(f);
      renderer.draw(world);
    },
    time() {
      return { frame: world.frame, oldest: t.timeline.oldest(), newest: t.timeline.newest };
    },
    probe(x, y) {
      const i = y * world.w + x;
      return {
        key: ELEMENTS[world.type[i]].key,
        temp: world.temp[i],
        life: world.life[i],
        solute: ELEMENTS[world.solute[i]].key,
        conc: world.conc[i],
      };
    },
    heights() {
      const out: number[] = [];
      for (let x = 0; x < world.w; x++) {
        let y = world.h - 1;
        while (y >= 0 && world.type[y * world.w + x] !== EMPTY) y--;
        out.push(world.h - 1 - y);
      }
      return out;
    },
    hash() {
      return world.hash();
    },
    chunks() {
      return { awake: world.awakeCount(), total: world.awake.length };
    },
  };
  window.__sim = hook;
}
