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

  constructor(canvas: HTMLCanvasElement, w: number, h: number) {
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Canvas2D is not available');
    this.ctx = ctx;
    this.image = ctx.createImageData(w, h);
    this.pixels = new Uint32Array(this.image.data.buffer);
  }

  /** Copies `pixels` to the canvas. */
  present(): void {
    this.ctx.putImageData(this.image, 0, 0);
  }
}
