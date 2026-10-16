import { EMPTY } from '../sim/elements';
import { CHUNK, type World } from '../sim/world';
import type { Renderer, View } from './renderer';
import {
  LEVEL_STRIDE,
  L_DEEP,
  L_GLINT,
  L_PLAIN,
  L_SHADE,
  L_SIDE,
  L_TOP,
  L_UNDER,
  GLOW_MAX,
  GLOW_MIN,
  TEXTURE_OF,
  TEX_FIRE,
  TEX_GAS,
  TEX_GLASS,
  TEX_LIQUID,
  TEX_STONE,
  buildBackground,
  buildGlow,
  buildPalette,
  buildStoneShade,
} from './palette';

/** Grains more than this many cells under the surface are drawn darker. */
const DEEP_CELLS = 6;
/** Liquid colour steps per cell of depth: the darkest colour is about 32 cells down. */
const LIQUID_DEPTH_STEP = 8;

/** 75% of a packed colour, alpha kept. */
function dark75(c: number): number {
  const rgb = c & 0xffffff;
  return (0xff000000 | (rgb - ((rgb >> 2) & 0x3f3f3f))) >>> 0;
}

/** Chunk overlay tints, packed 0xAABBGGRR. */
const CHUNK_AWAKE = 0xff5ad27a;
const CHUNK_ASLEEP = 0xff3a3a3a;

/** Blends packed colour c towards g by a/256. */
function blend(c: number, g: number, a: number): number {
  const r = c & 255;
  const gg = (c >> 8) & 255;
  const b = (c >> 16) & 255;
  return (
    (0xff000000 |
      ((b + ((((g >> 16) & 255) - b) * a >> 8)) << 16) |
      ((gg + ((((g >> 8) & 255) - gg) * a >> 8)) << 8) |
      (r + (((g & 255) - r) * a >> 8))) >>>
    0
  );
}

/** Even mix of two packed colours, alpha opaque. */
function mix(a: number, b: number): number {
  return (0xff000000 | (((a & 0xfefefe) >>> 1) + ((b & 0xfefefe) >>> 1))) >>> 0;
}

/** 87.5% of a packed colour, alpha kept. */
function dark87(c: number): number {
  const rgb = c & 0xffffff;
  return (0xff000000 | (rgb - ((rgb >> 3) & 0x1f1f1f))) >>> 0;
}

/**
 * Canvas2D renderer: one canvas pixel per cell, written through a Uint32Array
 * view of an ImageData and blitted with putImageData. CSS scales the canvas up
 * with nearest-neighbour sampling so cells stay crisp.
 *
 * Each cell is lit from its neighbours, light from above:
 * - grains with open space above get a lit top, and grains deep under the
 *   surface are darker, so piles read as solid mounds; a few grains that
 *   moved this frame glint, so moving sand sparkles;
 * - stone (wall) is bevelled: light top and left edges, dark bottom and right;
 * - liquids darken with depth; glints drift along the surface, moving
 *   liquid is a little brighter, so flow shows, and lone cells standing on a
 *   flat surface are mostly see-through, so the surface reads as smooth;
 * - empty cells under or beside matter get a contact shadow.
 *
 * Pixels are packed as 0xAABBGGRR, which is the byte order of RGBA on
 * little-endian machines (every desktop browser target).
 */
export class Canvas2DRenderer implements Renderer {
  pixels: Uint32Array;
  /** Debug: outline chunks, green if they ran last frame, faint grey if asleep. */
  showChunks = false;
  /** Views need the shaders; Canvas2D always draws the normal view. */
  view: View = 'normal';
  private readonly ctx: CanvasRenderingContext2D;
  private image: ImageData;
  private readonly palette = buildPalette();
  private readonly glow = buildGlow();
  private background: Uint32Array;
  private bgShadow: Uint32Array;
  private bgShadowSoft: Uint32Array;
  private stoneShade: Uint8Array;
  /** Per column: filled cells since the last empty cell above, while scanning down. */
  private depth: Uint16Array;
  /** Per column: row where the current filled run started (its surface). */
  private top: Int32Array;

  private readonly canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement, w: number, h: number) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Canvas2D is not available');
    this.ctx = ctx;
    canvas.width = w;
    canvas.height = h;
    this.image = ctx.createImageData(w, h);
    this.pixels = new Uint32Array(this.image.data.buffer);
    this.background = buildBackground(w, h);
    this.bgShadow = this.background.map(dark75);
    this.bgShadowSoft = this.background.map(dark87);
    this.stoneShade = buildStoneShade(w, h);
    this.depth = new Uint16Array(w);
    this.top = new Int32Array(w);
  }

  /** Rebuilds the canvas and per-position tables for a new grid size. */
  resize(w: number, h: number): void {
    if (w === this.canvas.width && h === this.canvas.height) return;
    this.canvas.width = w;
    this.canvas.height = h;
    this.image = this.ctx.createImageData(w, h);
    this.pixels = new Uint32Array(this.image.data.buffer);
    this.background = buildBackground(w, h);
    this.bgShadow = this.background.map(dark75);
    this.bgShadowSoft = this.background.map(dark87);
    this.stoneShade = buildStoneShade(w, h);
    this.depth = new Uint16Array(w);
    this.top = new Int32Array(w);
  }

  /** Draws every cell of the world and blits it. */
  draw(world: World): void {
    const { w, h, type, shade, stamp, temp } = world;
    const glowColour = this.glow.colour;
    const glowAlpha = this.glow.alpha;
    const glowScale = 255 / (GLOW_MAX - GLOW_MIN);
    const px = this.pixels;
    const pal = this.palette;
    const bg = this.background;
    const bgShadow = this.bgShadow;
    const bgSoft = this.bgShadowSoft;
    const stone = this.stoneShade;
    const depth = this.depth;
    const top = this.top;
    depth.fill(0);
    // Stamp written during the last step (see World.currentStamp).
    const moved = world.frame === 0 ? -1 : 1 + ((world.frame - 1) % 255);

    for (let y = 0; y < h; y++) {
      const row = y * w;
      for (let x = 0; x < w; x++) {
        const i = row + x;
        const t = type[i];
        const upEmpty = y === 0 || type[i - w] === EMPTY;
        if (t === EMPTY) {
          depth[x] = 0;
          if (!upEmpty) px[i] = bgShadow[i];
          else if ((x > 0 && type[i - 1] !== EMPTY) || (x + 1 < w && type[i + 1] !== EMPTY)) px[i] = bgSoft[i];
          else px[i] = bg[i];
          continue;
        }
        const tex = TEXTURE_OF[t];
        if (tex === TEX_GLASS) {
          depth[x] = 0;
          const g = mix(pal[L_PLAIN * LEVEL_STRIDE + ((t << 8) | stone[i])], bg[i]);
          px[i] = upEmpty ? blend(g, 0xffffffff, 46) : g;
          continue;
        }
        if (tex === TEX_FIRE) {
          depth[x] = 0;
          px[i] = pal[L_PLAIN * LEVEL_STRIDE + ((t << 8) | ((shade[i] + world.frame * 53 + x * 7 + y * 3) & 255))];
          continue;
        }
        if (tex === TEX_GAS) {
          // Gas: see-through, not part of any surface or depth.
          depth[x] = 0;
          px[i] = mix(pal[L_PLAIN * LEVEL_STRIDE + ((t << 8) | shade[i])], bg[i]);
          continue;
        }
        const d = ++depth[x];
        if (d === 1) top[x] = y;
        let level = L_PLAIN;
        let s: number;
        if (tex === TEX_LIQUID) {
          // Depth below the surface averaged over 5 columns, so a surface that is
          // flat within 1 cell does not show as vertical stripes.
          let sum = 0;
          let n = 0;
          for (let k = x - 2; k <= x + 2; k++) {
            if (k < 0 || k >= w || depth[k] === 0) continue;
            const tk = top[k];
            if (tk > y || tk < top[x] - 2 || tk > top[x] + 2) continue;
            sum += tk;
            n++;
          }
          const surface = n > 0 ? sum / n : top[x];
          const v = Math.round((y - surface) * LIQUID_DEPTH_STEP) + (shade[i] & 3);
          s = v > 255 ? 255 : v;
          if (upEmpty) {
            // A lone cell standing on a flat surface (left and right open):
            // draw it at 25%, so the surface reads as smooth with a faint
            // meniscus rather than a comb of single cells.
            if (
              (x === 0 || type[i - 1] === EMPTY) &&
              (x + 1 === w || type[i + 1] === EMPTY) &&
              y + 1 < h &&
              type[i + w] === t
            ) {
              px[i] = mix(mix(pal[L_TOP * LEVEL_STRIDE + ((t << 8) | s)], bg[i]), bg[i]);
              // Not counted as depth, or its whole column would draw a shade darker.
              depth[x] = 0;
              continue;
            }
            level = ((x * 13 + (world.frame >> 2) + (shade[i] >> 4)) & 63) === 0 ? L_GLINT : L_TOP;
          } else if (stamp[i] === moved) level = L_SIDE;
        } else if (tex === TEX_STONE) {
          s = stone[i];
          if (y + 1 < h && type[i + w] === EMPTY) level = L_UNDER;
          else if (upEmpty) level = L_TOP;
          else if (x > 0 && type[i - 1] === EMPTY) level = L_SIDE;
          else if (x + 1 < w && type[i + 1] === EMPTY) level = L_SHADE;
        } else {
          s = shade[i];
          if (stamp[i] === moved && (s & 15) === 0) level = L_GLINT;
          else if (upEmpty) level = L_TOP;
          else if (d > DEEP_CELLS) level = L_DEEP;
        }
        let c = pal[level * LEVEL_STRIDE + ((t << 8) | s)];
        // Solutions: a liquid takes a tint of what it carries; a soaked powder darkens.
        const cn = world.conc[i];
        if (cn !== 0) {
          if (tex === TEX_LIQUID) c = blend(c, pal[L_PLAIN * LEVEL_STRIDE + ((world.solute[i] << 8) | 128)], (cn * 115) >> 8);
          else c = blend(c, 0xff000000, Math.min(154, (cn * 410) >> 8));
        }
        // Black-body glow from the cell's real temperature.
        // Electric charge flashes blue-white.
        if (world.charge[i] !== 0) c = blend(c, 0xffffe0c8, 150 + world.charge[i] * 20);
        // The shade nudges the glow temperature a little, so hot masses have texture.
        const T = temp[i] + (shade[i] - 128) * 0.5;
        if (T > GLOW_MIN) {
          const k = T >= GLOW_MAX ? 255 : ((T - GLOW_MIN) * glowScale) | 0;
          c = blend(c, glowColour[k], glowAlpha[k]);
        }
        px[i] = c;
      }
    }
    if (this.showChunks) this.drawChunks(world);
    this.present();
  }

  /** Tints the border cells of every chunk. */
  private drawChunks(world: World): void {
    const { w, h, cw, ch, awake } = world;
    const px = this.pixels;
    for (let cy = 0; cy < ch; cy++) {
      for (let cx = 0; cx < cw; cx++) {
        const tint = awake[cy * cw + cx] ? CHUNK_AWAKE : CHUNK_ASLEEP;
        const x0 = cx * CHUNK;
        const y0 = cy * CHUNK;
        const x1 = Math.min(x0 + CHUNK, w) - 1;
        const y1 = Math.min(y0 + CHUNK, h) - 1;
        for (let x = x0; x <= x1; x++) {
          px[y0 * w + x] = mix(px[y0 * w + x], tint);
          px[y1 * w + x] = mix(px[y1 * w + x], tint);
        }
        for (let y = y0 + 1; y < y1; y++) {
          px[y * w + x0] = mix(px[y * w + x0], tint);
          px[y * w + x1] = mix(px[y * w + x1], tint);
        }
      }
    }
  }

  /** Copies `pixels` to the canvas. */
  present(): void {
    this.ctx.putImageData(this.image, 0, 0);
  }
}
