import { Canvas2DRenderer } from '../render/canvas2d';
import { ELEMENTS, PHASE_OF, PH_GAS, PH_LIQUID, PH_POWDER, SAND } from '../sim/elements';
import { step } from '../sim/step';
import { World } from '../sim/world';

/**
 * A tiny world running the real engine, used to show what an element does:
 * powders pour and pile, liquids pour and spread, solids hold a ledge that
 * sand runs off. The scene loops.
 */
export class MiniSim {
  readonly canvas: HTMLCanvasElement;
  private readonly world: World;
  private readonly renderer: Canvas2DRenderer;
  private readonly element: number;
  private t = 0;

  constructor(element: number, w: number, h: number, seed: number) {
    this.element = element;
    this.canvas = document.createElement('canvas');
    this.world = new World(w, h, seed);
    this.renderer = new Canvas2DRenderer(this.canvas, w, h);
    this.reset();
  }

  /** Restarts the scene from empty. */
  reset(): void {
    const { world } = this;
    world.reset(world.seed + 1);
    this.t = 0;
    const ph = PHASE_OF[this.element];
    if (ph !== PH_POWDER && ph !== PH_LIQUID && ph !== PH_GAS) {
      // Solids: a ledge across the middle.
      const y0 = Math.floor(world.h * 0.55);
      const x0 = Math.floor(world.w * 0.2);
      const x1 = Math.ceil(world.w * 0.8);
      for (let y = y0; y < y0 + Math.max(2, Math.round(world.h * 0.12)); y++)
        for (let x = x0; x < x1; x++) world.place(y * world.w + x, this.element);
    }
  }

  /** Runs the scene for n frames without drawing, then draws. */
  settle(pour: number, rest: number): void {
    for (let k = 0; k < pour; k++) this.advance();
    for (let k = 0; k < rest; k++) step(this.world);
    this.renderer.draw(this.world);
  }

  /**
   * A material sample for a tile: a settled mound of powder, a pool of
   * liquid, or a block of solid, filling most of the frame.
   */
  still(): void {
    const { world } = this;
    world.reset(world.seed);
    const ph = PHASE_OF[this.element];
    const { w, h } = world;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let fill: boolean;
        if (ph === PH_POWDER) fill = h - 1 - y < h * 0.78 - Math.abs(x - (w - 1) / 2) * 0.9;
        else if (ph === PH_LIQUID) fill = y >= h * 0.4;
        else if (ph === PH_GAS) fill = y < h * 0.55 && (x * 7 + y * 13) % 3 !== 0;
        else fill = y >= h * 0.3 && y < h * 0.8 && x >= 1 && x < w - 1;
        if (fill) world.place(y * w + x, this.element);
      }
    }
    for (let k = 0; k < 40; k++) step(world);
    this.t = 0;
    this.renderer.draw(world);
  }

  /** One frame of the scene, drawn. */
  tick(): void {
    this.advance();
    this.renderer.draw(this.world);
  }

  private advance(): void {
    const { world } = this;
    const ph = PHASE_OF[this.element];
    const full = world.countFilled() > world.size * (ph === PH_LIQUID ? 0.42 : 0.38);
    if (full || this.t > 900) this.reset();
    this.t++;
    // Pour a narrow stream of the element (or sand onto a solid) from the top;
    // gases are released from the bottom instead.
    const id = ph === PH_POWDER || ph === PH_LIQUID || ph === PH_GAS ? this.element : SAND;
    const cx = ph === PH_LIQUID ? Math.floor(world.w * 0.3) : Math.floor(world.w / 2);
    const r = Math.max(1, Math.round(world.w / 24));
    const row = ph === PH_GAS ? (world.h - 1) * world.w : 0;
    for (let x = cx - r; x <= cx + r; x++) {
      if (x < 0 || x >= world.w) continue;
      if (world.type[row + x] === 0 && world.rng.next() < 0.35) world.place(row + x, id);
    }
    step(world);
  }
}

/** Accent colour of an element: its first base colour. */
export function elementColour(id: number): string {
  return ELEMENTS[id].colours[0];
}
