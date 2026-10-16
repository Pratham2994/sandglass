import { EMPTY } from '../sim/elements';
import type { World } from '../sim/world';
import { buildBackground, buildPalette } from './palette';

/**
 * Canvas2D renderer: one canvas pixel per cell, written through a Uint32Array
 * view of an ImageData and blitted with putImageData. CSS scales the canvas up
 * with nearest-neighbour sampling so cells stay crisp.
 *
 * Pixels are packed as 0xAABBGGRR, which is the byte order of RGBA on
 * little-endian machines (every desktop browser target).
 */
export class Canvas2DRenderer {
  readonly pixels: Uint32Array;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly image: ImageData;
  private readonly palette = buildPalette();
  private readonly background: Uint32Array;

  constructor(canvas: HTMLCanvasElement, w: number, h: number) {
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Canvas2D is not available');
    this.ctx = ctx;
    this.image = ctx.createImageData(w, h);
    this.pixels = new Uint32Array(this.image.data.buffer);
    this.background = buildBackground(w, h);
  }

  /** Draws every cell of the world and blits it. */
  draw(world: World): void {
    const { type, shade, size } = world;
    const px = this.pixels;
    const pal = this.palette;
    const bg = this.background;
    for (let i = 0; i < size; i++) {
      const t = type[i];
      px[i] = t === EMPTY ? bg[i] : pal[(t << 8) | shade[i]];
    }
    this.present();
  }

  /** Copies `pixels` to the canvas. */
  present(): void {
    this.ctx.putImageData(this.image, 0, 0);
  }
}
