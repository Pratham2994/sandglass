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
 * Colour lookup table: entry (id << 8) | shade is the packed pixel for an
 * element at that shade. The shade picks one of the element's base colours
 * and a small brightness change, so powders look grainy, not flat.
 */
export function buildPalette(): Uint32Array {
  const lut = new Uint32Array(ELEMENT_COUNT * 256);
  for (let id = 0; id < ELEMENT_COUNT; id++) {
    const cols = ELEMENTS[id].colours.map(parseHex);
    for (let s = 0; s < 256; s++) {
      const [r, g, b] = cols[(s * cols.length) >> 8];
      // Brightness 0.94 to 1.06, from bits that do not pick the colour.
      const k = id === 0 ? 1 : 0.94 + (((s * 97) & 255) / 255) * 0.12;
      lut[(id << 8) | s] = pack(r * k, g * k, b * k);
    }
  }
  return lut;
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
      const d = ((((x * 73856093) ^ (y * 19349663)) >>> 0) % 1000) / 1000 - 0.5;
      bg[y * w + x] = pack(r * k + d, g * k + d, b * k + d);
    }
  }
  return bg;
}
