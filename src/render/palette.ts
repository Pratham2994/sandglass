import { ELEMENTS, ELEMENT_COUNT } from '../sim/elements';

function parseHex(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function pack(r: number, g: number, b: number): number {
  const c = (v: number): number => Math.max(0, Math.min(255, Math.round(v)));
  return (0xff000000 | (c(b) << 16) | (c(g) << 8) | c(r)) >>> 0;
}

/**
 * Light levels the renderer picks per cell from its surroundings:
 * 0 underside shadow, 1 side shadow, 2 deep inside a mass, 3 plain, 4 side light, 5 top light, 6 glint.
 */
export const LIGHT = [0.7, 0.85, 0.9, 1, 1.08, 1.17, 1.38] as const;
export const L_UNDER = 0;
export const L_SHADE = 1;
export const L_DEEP = 2;
export const L_PLAIN = 3;
export const L_SIDE = 4;
export const L_TOP = 5;
export const L_GLINT = 6;
/** Entries per light level in the palette. */
export const LEVEL_STRIDE = ELEMENT_COUNT * 256;

/** Texture code per element id: 0 grain (colour per cell), 1 stone (smooth, from position). */
export const TEX_GRAIN = 0;
export const TEX_STONE = 1;
export const TEXTURE_OF = Uint8Array.from(ELEMENTS, (e) => (e.texture === 'stone' ? TEX_STONE : TEX_GRAIN));

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Colour lookup table: entry level * LEVEL_STRIDE + ((id << 8) | shade).
 * Grain: the shade picks one of the base colours plus a small brightness
 * change, so powders look grainy. Stone: the shade runs smoothly through
 * the colours from dark to light.
 */
export function buildPalette(): Uint32Array {
  const lut = new Uint32Array(LIGHT.length * LEVEL_STRIDE);
  for (let id = 0; id < ELEMENT_COUNT; id++) {
    const el = ELEMENTS[id];
    const cols = el.colours.map(parseHex);
    for (let s = 0; s < 256; s++) {
      let r: number, g: number, b: number;
      if (el.texture === 'stone' && cols.length > 1) {
        const f = (s / 255) * (cols.length - 1);
        const k = Math.min(cols.length - 2, Math.floor(f));
        const [a, c] = [cols[k], cols[k + 1]];
        r = lerp(a[0], c[0], f - k);
        g = lerp(a[1], c[1], f - k);
        b = lerp(a[2], c[2], f - k);
      } else {
        const [cr, cg, cb] = cols[(s * cols.length) >> 8];
        // Brightness 0.94 to 1.06, from bits that do not pick the colour.
        const k = id === 0 ? 1 : 0.94 + (((s * 97) & 255) / 255) * 0.12;
        r = cr * k;
        g = cg * k;
        b = cb * k;
      }
      for (let l = 0; l < LIGHT.length; l++) {
        const m = LIGHT[l];
        lut[l * LEVEL_STRIDE + ((id << 8) | s)] = pack(r * m, g * m, b * m);
      }
    }
  }
  return lut;
}

/** Integer hash of a cell position to 0..1. */
function hash01(x: number, y: number): number {
  let n = Math.imul(x, 374761393) + Math.imul(y, 668265263);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

/** Smooth value noise with cells `scale` apart, 0..1. */
function valueNoise(x: number, y: number, scale: number): number {
  const fx = x / scale;
  const fy = y / scale;
  const x0 = Math.floor(fx);
  const y0 = Math.floor(fy);
  const tx = fx - x0;
  const ty = fy - y0;
  const sx = tx * tx * (3 - 2 * tx);
  const sy = ty * ty * (3 - 2 * ty);
  const top = lerp(hash01(x0, y0), hash01(x0 + 1, y0), sx);
  const bottom = lerp(hash01(x0, y0 + 1), hash01(x0 + 1, y0 + 1), sx);
  return lerp(top, bottom, sy);
}

/**
 * Shade per position for stone-textured elements: large soft patches plus
 * fine speckle. Fixed to the grid, so a wall keeps its look wherever it is drawn.
 */
export function buildStoneShade(w: number, h: number): Uint8Array {
  const out = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const v = 0.55 * valueNoise(x, y, 9) + 0.25 * valueNoise(x + 101, y + 57, 3) + 0.2 * hash01(x, y);
      out[y * w + x] = Math.max(0, Math.min(255, Math.round(v * 255)));
    }
  }
  return out;
}

/**
 * Background for empty cells: the empty colour with a soft vignette, fixed
 * per position so it never flickers as cells move through it. A fixed
 * sub-level dither stops the dark gradient from showing as rings.
 */
export function buildBackground(w: number, h: number): Uint32Array {
  const [r, g, b] = parseHex(ELEMENTS[0].colours[0]);
  const bg = new Uint32Array(w * h);
  const cx = (w - 1) / 2;
  const cy = (h - 1) / 2;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = (x - cx) / cx;
      const dy = (y - cy) / cy;
      const k = 1.12 - 0.3 * Math.min(1, (dx * dx + dy * dy) / 2);
      const d = hash01(x, y) - 0.5;
      bg[y * w + x] = pack(r * k + d, g * k + d, b * k + d);
    }
  }
  return bg;
}
