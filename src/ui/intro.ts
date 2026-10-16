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
  PH_ENERGY,
  PH_GAS,
  PH_SOLID,
  SALT,
  SAND,
  SAWDUST,
  SNOW,
  TNT,
  WATER,
} from '../sim/elements';
import type { World } from '../sim/world';

const WORD = 'SANDGLASS';
/**
 * The letters are layered like rock strata, top to bottom, so each letter
 * carries every material: when it blows, water, oil, lava and mercury splash
 * out together, oil catches on lava and the gunpowder band goes off.
 */
const STRATA = [SNOW, SALT, GUNPOWDER, DIRT, OIL, SAND, WATER, LAVA, ICE, ACID, MERCURY, SAWDUST];
/** Frames (60 per second). */
const REVEAL = 26; // the word dissolves in, left to right
/**
 * Pours from the top edge, in the clear margins either side of the word:
 * [first frame, last frame, left, right (share of width), element]. They
 * fill a pool under the word while the air is still cool, and meet in the
 * middle in a burst of steam.
 */
const POURS: [number, number, number, number, number][] = [
  [4, 84, 0.012, 0.1, WATER],
  [12, 88, 0.9, 0.988, LAVA],
  // Oil lands on the standing word and runs off its letters: fuel for the blasts.
  [24, 70, 0.44, 0.56, OIL],
];
const CHAIN = 92; // first letter pops and drops into the pool; one more every CHAIN_STEP frames
const CHAIN_STEP = 7;
const GEYSER = 176; // a charge in the pool throws up a crown of liquid
const FIREWORKS = 182; // bursts in the sky, one every 5 frames
const FIREWORK_COUNT = 10;
const DRAIN = 236; // the floor opens
const FADE = 290; // the canvas fades out over the last half second
const END = 318; // whatever is left is cleared, then the empty canvas fades back in
/** Bottom rows emptied per frame once the floor opens: everything plunges out fast. */
const DRAIN_ROWS = 3;
/** Share of air pressure and speed kept each frame during the intro. */
const AIR_CALM = 0.86;
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
 * the sandbox, but it runs on the real engine (air, heat, fire, fluids):
 * 1. SANDGLASS dissolves in, every letter veined with a dozen materials.
 * 2. Water pours down the left edge and lava down the right; they fill a
 *    pool under the word and meet in the middle in bursts of steam.
 * 3. The letters pop one by one, left to right, and drop into the pool:
 *    oil floats up, flames catch, gunpowder bands go off.
 * 4. Charges in the pool throw up crowns of liquid, then fireworks burst
 *    in the sky.
 * 5. The floor opens and the canvas fades clear.
 * About 5 s; any click or key skips it.
 */
export class Intro {
  active = false;
  private readonly world: World;
  /** Per cell: the letter (1..9) that still holds it in place, or 0 once loose. */
  private held: Uint8Array = new Uint8Array(0);
  /** Per cell: the element the word puts there, before it appears. */
  private material: Uint16Array = new Uint16Array(0);
  /** Per cell: when (0..1 of the reveal) it appears. */
  private appearAt: Float32Array = new Float32Array(0);
  /** Letter centres, in cells. */
  private letterX: number[] = [];
  private letterY: number[] = [];
  private top = 0;
  private bottom = 0;
  private f = 0;
  private onDone: () => void = () => {};

  constructor(world: World) {
    this.world = world;
  }

  /** Lays out the word and starts the sequence. */
  async start(onDone: () => void): Promise<void> {
    this.onDone = onDone;
    await document.fonts.load(`800 100px ${FONT}`).catch(() => undefined);
    const world = this.world;
    const { w, h } = world;
    const letters = rasterise(w, h);
    this.held = new Uint8Array(w * h);
    this.material = new Uint16Array(w * h);
    this.appearAt = new Float32Array(w * h);
    world.reset(world.seed);
    let top = h;
    let bottom = 0;
    let left = w;
    let right = 0;
    const sx = new Array<number>(WORD.length).fill(0);
    const sy = new Array<number>(WORD.length).fill(0);
    const sn = new Array<number>(WORD.length).fill(0);
    for (let i = 0; i < letters.length; i++) {
      const k = letters[i];
      if (!k) continue;
      const x = i % w;
      const y = (i / w) | 0;
      top = Math.min(top, y);
      bottom = Math.max(bottom, y);
      left = Math.min(left, x);
      right = Math.max(right, x);
      sx[k - 1] += x;
      sy[k - 1] += y;
      sn[k - 1]++;
    }
    // Strata: wavy horizontal bands through all the letters.
    const band = (bottom - top + 1) / STRATA.length;
    const span = Math.max(1, right - left);
    for (let i = 0; i < letters.length; i++) {
      if (!letters[i]) continue;
      const x = i % w;
      const y = (i / w) | 0;
      const k = Math.floor((y - top) / band + (noise(x, 0, 9) - 0.5) * 1.6);
      this.material[i] = STRATA[Math.max(0, Math.min(STRATA.length - 1, k))];
      this.held[i] = letters[i];
      // Grainy dissolve that sweeps left to right.
      this.appearAt[i] = 0.55 * noise(x, y, 3) + 0.45 * ((x - left) / span);
    }
    this.letterX = sx.map((v, k) => (sn[k] ? Math.round(v / sn[k]) : w >> 1));
    this.letterY = sy.map((v, k) => (sn[k] ? Math.round(v / sn[k]) : h >> 1));
    this.top = top;
    this.bottom = bottom;
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

    // 1. Reveal: cells appear as the dissolve sweeps across.
    if (f <= REVEAL) {
      const t = (f + 1) / REVEAL;
      for (let i = 0; i < this.material.length; i++) {
        const m = this.material[i];
        if (m && this.appearAt[i] <= t) {
          world.place(i, m);
          this.material[i] = 0;
        }
      }
    }

    // The air calms much faster than in the sandbox, so each blast is a sharp
    // burst and gravity takes over: debris arcs, rains and splashes instead of
    // hanging in a dust cloud.
    const air = world.air;
    for (let k = 0; k < air.p.length; k++) {
      air.p[k] *= AIR_CALM;
      air.vx[k] *= AIR_CALM;
      air.vy[k] *= AIR_CALM;
    }

    // Letters still standing: they carry this frame's stamp, so the cell pass
    // (and the air) leaves them where they are.
    for (let i = 0; i < this.held.length; i++) if (this.held[i] && world.type[i] !== EMPTY) world.stamp[i] = st;

    // 2. Chain: each letter blows in turn and lets go of its cells.
    if (f >= CHAIN && (f - CHAIN) % CHAIN_STEP === 0) {
      const k = (f - CHAIN) / CHAIN_STEP;
      if (k < WORD.length) this.blowLetter(k);
    }

    // 3. Pours: thick falls of water, lava and oil fill a real pool. Oil
    // floats on the water, lava meets water in bursts of steam and sets the
    // oil alight.
    for (const [from, to, x0, x1, element] of POURS) {
      if (f < from || f > to) continue;
      const a = Math.round(w * x0);
      const b = Math.round(w * x1);
      for (let x = a; x <= b; x++) {
        // Ragged edges and a little gap noise, so it reads as a falling sheet, not a block.
        const edge = Math.min(x - a, b - x);
        if (edge < 3 && (world.rng.nextU32() & 3) === 0) continue;
        if ((world.rng.nextU32() & 7) === 0) continue;
        for (let y = 0; y < 3; y++) {
          const i = y * w + x;
          if (world.type[i] !== EMPTY) continue;
          world.place(i, element);
          // Poured, not dropped: it leaves the spout already moving.
          world.vy[i] = 64;
        }
      }
    }

    // 4. A charge in the pool throws up a crown of liquid; then fireworks in the sky.
    if (f === GEYSER) {
      for (const share of [0.5, 0.22, 0.78]) {
        const x = Math.round(w * share);
        const y = this.surface(x);
        const d = Math.min(h - 3, y + 5);
        this.blast(x, d, 26, 22, 50, true);
        world.air.addVelocity(x, y, 0, -3.2, 8);
      }
    }
    if (f >= FIREWORKS && (f - FIREWORKS) % 5 === 0 && (f - FIREWORKS) / 5 < FIREWORK_COUNT) {
      const k = (f - FIREWORKS) / 5;
      const r = world.rng.nextU32();
      const x = Math.round(w * (0.14 + ((k * 0.37 + (r & 255) / 2560) % 1) * 0.72));
      const y = Math.round(h * (0.12 + ((r >>> 8) & 255) / 1280));
      this.firework(x, y);
    }

    // 5. The floor opens: solids break loose, everything plunges out of the bottom edge.
    if (f === DRAIN) {
      for (let i = 0; i < world.size; i++) if (PHASE_OF[world.type[i]] === PH_SOLID) world.type[i] = GRAVEL;
      this.held.fill(0);
    }
    if (f >= DRAIN) {
      // Everything falls at top speed and the bottom rows swallow it, so the
      // scene empties quickly instead of trickling out.
      const vy = world.vy;
      for (let i = 0; i < world.size; i++) {
        const t = world.type[i];
        if (t === EMPTY) continue;
        vy[i] = 127;
        // Gases and flames rise instead of draining: they thin out and vanish.
        const ph = PHASE_OF[t];
        if ((ph === PH_GAS || ph === PH_ENERGY) && (world.rng.nextU32() & 255) < 32) world.place(i, EMPTY);
      }
      world.wakeAll();
      for (let r = 1; r <= DRAIN_ROWS; r++) {
        const row = (h - r) * w;
        for (let x = 0; x < w; x++) if (world.type[row + x] !== EMPTY) world.place(row + x, EMPTY);
      }
      if (f === FADE) this.fade(true);
      if (f >= END || (f % 15 === 0 && world.countFilled() === 0)) this.finish();
    }
    return true;
  }

  /**
   * Letter k blows: a blast, a ring of flame and an upward kick throw it up,
   * burning, and it rains down into the pool. Its ice turns to snow, or it
   * would hang in the air as a solid.
   */
  private blowLetter(k: number): void {
    const world = this.world;
    for (let i = 0; i < this.held.length; i++) {
      if (this.held[i] !== k + 1) continue;
      this.held[i] = 0;
      if (world.type[i] === ICE) {
        const T = world.temp[i];
        world.place(i, SNOW);
        world.temp[i] = T;
      }
    }
    const x = this.letterX[k];
    const y = this.letterY[k];
    const size = Math.max(8, (this.bottom - this.top) * 0.6);
    this.blast(x, y, 9, size, 30, false);
    // An upward kick, alternating sides, so each letter fountains before it rains into the pool.
    world.air.addVelocity(x, y + 4, (k & 1 ? 1 : -1) * 0.8, -2.2, size * 0.6);
  }

  /**
   * A scripted blast at (x, y): air pressure and a ring of flame. With a
   * charge it also heats what it hits and sets off real TNT, so the engine's
   * own explosion runs too; without one it heats less.
   */
  private blast(x: number, y: number, pressure: number, radius: number, flames: number, charge: boolean): void {
    const world = this.world;
    const { w, h } = world;
    if (pressure > 0) world.air.addPressure(x, y, pressure, radius);
    for (let n = 0; n < flames; n++) {
      const r = world.rng.nextU32();
      const a = ((r & 1023) / 1024) * Math.PI * 2;
      const d = 2 + ((r >>> 10) % Math.max(3, Math.round(radius * 0.4)));
      const fx = Math.round(x + Math.cos(a) * d);
      const fy = Math.round(y + Math.sin(a) * d * 0.7);
      if (fx < 0 || fy < 0 || fx >= w || fy >= h) continue;
      const j = fy * w + fx;
      if (world.type[j] === EMPTY) {
        world.place(j, FIRE);
        world.life[j] = 16 + ((r >>> 20) & 31);
      } else if (!this.held[j]) world.temp[j] += charge ? 500 : 300;
    }
    if (charge && x >= 1 && y >= 1 && x < w - 1 && y < h - 1) {
      for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) world.place((y + j) * w + x + i, TNT);
      explode(world, x, y);
    }
    world.wakeAll();
  }

  /** The row of the first empty cell above the pile in column x (the pool's surface). */
  private surface(x: number): number {
    const { w, h, type } = this.world;
    let y = h - 1;
    while (y > 0 && type[y * w + x] !== EMPTY) y--;
    return y;
  }

  /** A starburst of flame in open sky: rays of fire that the air throws outwards. */
  private firework(x: number, y: number): void {
    const world = this.world;
    const { w, h } = world;
    const rays = 14;
    const R = 4 + (world.rng.nextU32() % 5);
    for (let k = 0; k < rays; k++) {
      const a = (k / rays) * Math.PI * 2;
      for (let d = 1; d <= R; d++) {
        const fx = Math.round(x + Math.cos(a) * d);
        const fy = Math.round(y + Math.sin(a) * d);
        if (fx < 0 || fy < 0 || fx >= w || fy >= h) continue;
        const j = fy * w + fx;
        if (world.type[j] !== EMPTY) continue;
        world.place(j, FIRE);
        world.life[j] = 14 + d * 3 + (world.rng.nextU32() & 15);
      }
    }
    world.air.addPressure(x, y, 9, R * 2);
    world.wakeAll();
  }

  /** Ends at once with an empty world. */
  skip(): void {
    if (this.active) this.finish();
  }

  /** Fades the canvas out (or back in), so the end is a soft cut, not a jump. */
  private fade(out: boolean): void {
    document.body.classList.toggle('intro-fading', out);
  }

  private finish(): void {
    this.active = false;
    this.world.reset(this.world.seed);
    // The empty canvas comes back in softly.
    requestAnimationFrame(() => this.fade(false));
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
