import { explode } from '../sim/blast';
import {
  ACID,
  DIRT,
  EMPTY,
  FIRE,
  GRAVEL,
  GUNPOWDER,
  ICE,
  LAVA,
  MERCURY,
  OIL,
  PHASE_OF,
  PH_SOLID,
  SALT,
  SAND,
  SAWDUST,
  SNOW,
  SPARK,
  WATER,
} from '../sim/elements';
import type { World } from '../sim/world';

const WORD = 'SANDGLASS';
/**
 * The letters are layered like rock strata, top to bottom. The order keeps
 * the word standing until it melts: lava sits between water and ice, so it
 * only steams; gunpowder sits far from any heat. Once the layers drip and
 * mix, oil and sawdust land on lava and catch, and the gunpowder pops.
 */
const STRATA = [SNOW, SALT, GUNPOWDER, DIRT, OIL, SAND, WATER, LAVA, ICE, ACID, MERCURY, SAWDUST];
/** Frames (60 per second). */
const HOLD = 36; // the word stands, veins cooking where lava touches them
const MELT_END = 120; // letters drip from the bottom up
const BOOM = 124; // the centre blows
const DRAIN = 200; // the floor opens
const END = 290; // whatever is left is cleared
/** Rows released per frame while the letters melt. */
const MELT_RATE = 0.35;
const FONT = '"Geist Variable", ui-sans-serif, system-ui, sans-serif';

/** Smooth value noise in 0..1, with cells `scale` apart. */
function noise(x: number, y: number, scale: number): number {
  const h = (i: number, j: number): number => {
    let n = Math.imul(i, 374761393) + Math.imul(j, 668265263);
    n = Math.imul(n ^ (n >>> 13), 1274126177);
    return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
  };
  const fx = x / scale;
  const fy = y / scale;
  const x0 = Math.floor(fx);
  const y0 = Math.floor(fy);
  const tx = fx - x0;
  const ty = fy - y0;
  const sx = tx * tx * (3 - 2 * tx);
  const sy = ty * ty * (3 - 2 * ty);
  const a = h(x0, y0) + (h(x0 + 1, y0) - h(x0, y0)) * sx;
  const b = h(x0, y0 + 1) + (h(x0 + 1, y0 + 1) - h(x0, y0 + 1)) * sx;
  return a + (b - a) * sy;
}

/**
 * Opening showcase on the main canvas. It is choreographed, not a rule of
 * the sandbox, but it runs on the real engine:
 * 1. SANDGLASS stands, every letter veined with a dozen materials; where
 *    lava touches its neighbours they already start to cook.
 * 2. The letters melt from the bottom up, dripping and mixing as they fall:
 *    steam, flames, popping gunpowder, sparks.
 * 3. The centre blows, throwing everything outwards.
 * 4. The floor opens and the canvas clears.
 * About 4.8 s; any click or key skips it.
 */
export class Intro {
  active = false;
  private readonly world: World;
  /** Per cell: the row at which the melt releases it (ragged, bottom first). */
  private releaseAt: Float32Array = new Float32Array(0);
  /** Cells of the word still standing. */
  private frozen: Uint8Array = new Uint8Array(0);
  private bottom = 0;
  private top = 0;
  private cx = 0;
  private cy = 0;
  private f = 0;
  private onDone: () => void = () => {};

  constructor(world: World) {
    this.world = world;
  }

  /** Draws the word into the world and starts the sequence. */
  async start(onDone: () => void): Promise<void> {
    this.onDone = onDone;
    await document.fonts.load(`800 100px ${FONT}`).catch(() => undefined);
    const world = this.world;
    const { w, h } = world;
    const letters = rasterise(w, h);
    this.releaseAt = new Float32Array(w * h);
    this.frozen = new Uint8Array(w * h);
    world.reset(world.seed);
    let top = h;
    let bottom = 0;
    let sx = 0;
    let n = 0;
    for (let i = 0; i < letters.length; i++) {
      if (!letters[i]) continue;
      const x = i % w;
      const y = (i / w) | 0;
      this.frozen[i] = 1;
      top = Math.min(top, y);
      bottom = Math.max(bottom, y);
      sx += x;
      n++;
      this.releaseAt[i] = y + noise(x, 0, 6) * 2;
    }
    // Strata: wavy horizontal bands through all the letters.
    const band = (bottom - top + 1) / STRATA.length;
    for (let i = 0; i < letters.length; i++) {
      if (!letters[i]) continue;
      const x = i % w;
      const y = (i / w) | 0;
      const k = Math.floor((y - top) / band + (noise(x, 0, 9) - 0.5) * 1.6);
      world.place(i, STRATA[Math.max(0, Math.min(STRATA.length - 1, k))]);
    }
    this.top = top;
    this.bottom = bottom;
    this.cx = n ? Math.round(sx / n) : w >> 1;
    this.cy = Math.round((top + bottom) / 2);
    this.f = 0;
    this.active = true;
  }

  /** One frame of the script, run before each sim step. */
  frame(): boolean {
    if (!this.active) return false;
    const world = this.world;
    const f = this.f++;
    const st = world.currentStamp();
    const { w, h } = world;

    // The release line rises from the bottom of the word while it melts.
    const line = f < HOLD ? Infinity : this.bottom + 8 - (f - HOLD) * MELT_RATE * 2;
    for (let i = 0; i < this.frozen.length; i++) {
      if (!this.frozen[i]) continue;
      if (world.type[i] === EMPTY || this.releaseAt[i] >= line || f >= BOOM) {
        this.frozen[i] = 0;
        continue;
      }
      // Standing cells carry this frame's stamp, so the cell pass leaves them in place.
      world.stamp[i] = st;
    }

    // While it melts, sparks flash around the letters.
    if (f >= HOLD && f < MELT_END && f % 7 === 0) {
      const r = world.rng.nextU32();
      const x = this.cx - 70 + (r % 140);
      const y = this.top + ((r >>> 8) % Math.max(1, this.bottom - this.top));
      if (x >= 0 && x < w && y >= 0 && y < h) {
        const i = y * w + x;
        // Only into open air: heating the letters would set the gunpowder band off early.
        if (world.type[i] === EMPTY) world.place(i, SPARK);
        world.wake(x, y);
      }
    }

    // The centre blows: a scripted blast, bigger than any one element's.
    if (f === BOOM) {
      world.air.addPressure(this.cx, this.cy, 40, 40);
      for (let k = 0; k < 90; k++) {
        const r = world.rng.nextU32();
        const a = ((r & 1023) / 1024) * Math.PI * 2;
        const d = 2 + ((r >>> 10) % 16);
        const x = Math.round(this.cx + Math.cos(a) * d);
        const y = Math.round(this.cy + Math.sin(a) * d * 0.6);
        if (x < 0 || y < 0 || x >= w || y >= h) continue;
        const j = y * w + x;
        if (world.type[j] === EMPTY) {
          world.place(j, FIRE);
          world.life[j] = 20 + ((r >>> 20) & 31);
        } else world.temp[j] += 600;
      }
      const c = this.cy * w + this.cx;
      world.place(c, GUNPOWDER);
      explode(world, this.cx, this.cy);
      world.wakeAll();
    }

    // The floor opens: solids break loose, everything plunges out of the bottom edge.
    if (f === DRAIN) {
      for (let i = 0; i < world.size; i++) if (PHASE_OF[world.type[i]] === PH_SOLID) world.type[i] = GRAVEL;
    }
    if (f >= DRAIN) {
      const vy = world.vy;
      for (let i = 0; i < world.size; i++) if (world.type[i] !== EMPTY) vy[i] = 96;
      world.wakeAll();
      const row = (h - 1) * w;
      for (let x = 0; x < w; x++) if (world.type[row + x] !== EMPTY) world.place(row + x, EMPTY);
      if (f >= END || (f % 15 === 0 && world.countFilled() === 0)) this.finish();
    }
    return true;
  }

  /** Ends at once with an empty world. */
  skip(): void {
    if (this.active) this.finish();
  }

  private finish(): void {
    this.active = false;
    this.world.reset(this.world.seed);
    this.onDone();
  }
}

/**
 * Renders the word into a grid-sized bitmap, one letter at a time, and
 * returns the letter index (+1) of every cell it covers.
 */
function rasterise(w: number, h: number): Uint8Array {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  const out = new Uint8Array(w * h);
  if (!ctx) return out;
  // Size the word to about 80% of the width, and no taller than 30% of the height.
  let size = 100;
  ctx.font = `800 ${size}px ${FONT}`;
  const tracking = 0.04;
  const width = (s: number): number => ctx.measureText(WORD).width * (s / size) + WORD.length * s * tracking;
  size = Math.min((w * 0.8) / (width(100) / 100), h * 0.3);
  ctx.font = `800 ${size}px ${FONT}`;
  ctx.textBaseline = 'alphabetic';
  const total = ctx.measureText(WORD).width + (WORD.length - 1) * size * tracking;
  let x = Math.round((w - total) / 2);
  const baseline = Math.round(h * 0.42 + size * 0.36);
  for (let k = 0; k < WORD.length; k++) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#fff';
    ctx.fillText(WORD[k], x, baseline);
    const data = ctx.getImageData(0, 0, w, h).data;
    for (let i = 0; i < out.length; i++) if (data[i * 4 + 3] > 110 && out[i] === 0) out[i] = k + 1;
    x += ctx.measureText(WORD[k]).width + size * tracking;
  }
  return out;
}
