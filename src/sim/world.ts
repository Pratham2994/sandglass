import { AMBIENT, EMPTY, LIFE_OF, TEMP_OF } from './elements';
import { Rng } from './rng';

/** Chunk side in cells, for sleep and wake. */
export const CHUNK_SHIFT = 5;
export const CHUNK = 1 << CHUNK_SHIFT;

/**
 * The grid. Struct of arrays: each field is its own typed array, index i = y * w + x.
 * Fields are added only in the phase that needs them (see docs/SPEC.md).
 */
export class World {
  w: number;
  h: number;
  size: number;

  /** Element id. */
  type: Uint16Array;
  /** Fall speed in 1/32 cell per frame (see VY_UNIT), so falling accelerates. */
  vy: Int8Array;
  /** Stamp of the frame in which the cell last moved; stops a cell moving twice in one frame. */
  stamp: Uint8Array;
  /** Fixed colour noise, set at creation, moves with the cell. */
  shade: Uint8Array;
  /** Temperature, °C. Moves with the cell. */
  temp: Float32Array;
  /** Timer: fuel left for a burning cell, lifetime for a flame. */
  life: Uint16Array;
  /** Element carried inside this cell: what a fire is burning (later: what is dissolved), 0 = none. */
  solute: Uint16Array;

  /** Chunk grid size, in chunks of CHUNK × CHUNK cells. */
  cw: number;
  ch: number;
  /** Chunks the cell pass runs this frame. */
  awake: Uint8Array;
  /** Chunks woken during this frame, for the next one. */
  awakeNext: Uint8Array;

  readonly rng: Rng;
  seed: number;
  /** Number of steps run since the last reset. */
  frame = 0;

  constructor(w: number, h: number, seed: number) {
    this.w = w;
    this.h = h;
    this.size = w * h;
    this.type = new Uint16Array(this.size);
    this.vy = new Int8Array(this.size);
    this.stamp = new Uint8Array(this.size);
    this.shade = new Uint8Array(this.size);
    this.temp = new Float32Array(this.size).fill(AMBIENT);
    this.life = new Uint16Array(this.size);
    this.solute = new Uint16Array(this.size);
    this.cw = Math.ceil(w / CHUNK);
    this.ch = Math.ceil(h / CHUNK);
    this.awake = new Uint8Array(this.cw * this.ch);
    this.awakeNext = new Uint8Array(this.cw * this.ch).fill(1);
    this.seed = seed;
    this.rng = new Rng(seed);
  }

  /**
   * Changes the grid size, keeping what fits. Content stays anchored to the
   * bottom-left corner, so the floor stays the floor. Cells that fall outside
   * the new size are lost.
   */
  resize(w: number, h: number): void {
    if (w === this.w && h === this.h) return;
    const old = {
      w: this.w,
      h: this.h,
      type: this.type,
      vy: this.vy,
      stamp: this.stamp,
      shade: this.shade,
      temp: this.temp,
      life: this.life,
      solute: this.solute,
    };
    this.w = w;
    this.h = h;
    this.size = w * h;
    this.type = new Uint16Array(this.size);
    this.vy = new Int8Array(this.size);
    this.stamp = new Uint8Array(this.size);
    this.shade = new Uint8Array(this.size);
    this.temp = new Float32Array(this.size).fill(AMBIENT);
    this.life = new Uint16Array(this.size);
    this.solute = new Uint16Array(this.size);
    const dy = h - old.h;
    const cols = Math.min(w, old.w);
    for (let y = 0; y < h; y++) {
      const oy = y - dy;
      if (oy < 0 || oy >= old.h) continue;
      const src = oy * old.w;
      const dst = y * w;
      this.type.set(old.type.subarray(src, src + cols), dst);
      this.vy.set(old.vy.subarray(src, src + cols), dst);
      this.stamp.set(old.stamp.subarray(src, src + cols), dst);
      this.shade.set(old.shade.subarray(src, src + cols), dst);
      this.temp.set(old.temp.subarray(src, src + cols), dst);
      this.life.set(old.life.subarray(src, src + cols), dst);
      this.solute.set(old.solute.subarray(src, src + cols), dst);
    }
    this.cw = Math.ceil(w / CHUNK);
    this.ch = Math.ceil(h / CHUNK);
    this.awake = new Uint8Array(this.cw * this.ch);
    this.awakeNext = new Uint8Array(this.cw * this.ch).fill(1);
  }

  /** Turns the whole grid upside down (180°), as when an hourglass is flipped. */
  rotate180(): void {
    this.type.reverse();
    this.shade.reverse();
    this.temp.reverse();
    this.life.reverse();
    this.solute.reverse();
    this.stamp.fill(0);
    this.vy.fill(0);
    this.wakeAll();
  }

  /** Clears the grid and restarts the RNG from `seed`. */
  reset(seed: number): void {
    this.type.fill(EMPTY);
    this.vy.fill(0);
    this.stamp.fill(0);
    this.shade.fill(0);
    this.temp.fill(AMBIENT);
    this.life.fill(0);
    this.solute.fill(0);
    this.awake.fill(0);
    this.awakeNext.fill(1);
    this.seed = seed;
    this.rng.seed(seed);
    this.frame = 0;
  }

  /**
   * Marks the chunks covering cell (x, y) and its 1-cell neighbourhood to run
   * next frame, so a change at a chunk edge also wakes the chunk beside it.
   */
  wake(x: number, y: number): void {
    const x0 = (x > 0 ? x - 1 : 0) >> CHUNK_SHIFT;
    const x1 = (x + 1 < this.w ? x + 1 : x) >> CHUNK_SHIFT;
    const r0 = ((y > 0 ? y - 1 : 0) >> CHUNK_SHIFT) * this.cw;
    const r1 = ((y + 1 < this.h ? y + 1 : y) >> CHUNK_SHIFT) * this.cw;
    const a = this.awakeNext;
    a[r0 + x0] = 1;
    a[r0 + x1] = 1;
    a[r1 + x0] = 1;
    a[r1 + x1] = 1;
  }

  /** Wakes every chunk for the next frame. */
  wakeAll(): void {
    this.awakeNext.fill(1);
  }

  /** Start of a frame: chunks woken last frame run now; a chunk nothing wakes this frame sleeps next. */
  beginFrame(): void {
    this.awake.set(this.awakeNext);
    this.awakeNext.fill(0);
  }

  /** Chunks that ran in the last frame. */
  awakeCount(): number {
    let n = 0;
    for (let k = 0; k < this.awake.length; k++) n += this.awake[k];
    return n;
  }

  /**
   * Stamp value for the current frame: 1 + frame mod 255, so it is never 0.
   * 0 is kept for cells that have not moved since they were placed.
   */
  currentStamp(): number {
    return 1 + (this.frame % 255);
  }

  /** Places a new cell of element `t` at index i, replacing what was there, and wakes it. */
  place(i: number, t: number): void {
    this.type[i] = t;
    this.vy[i] = 0;
    this.stamp[i] = 0;
    this.shade[i] = t === EMPTY ? 0 : this.rng.nextU32() & 255;
    this.temp[i] = TEMP_OF[t];
    this.life[i] = LIFE_OF[t];
    this.solute[i] = 0;
    this.wake(i % this.w, (i / this.w) | 0);
  }

  /** Number of cells of element `t`. */
  count(t: number): number {
    const type = this.type;
    let n = 0;
    for (let i = 0; i < this.size; i++) if (type[i] === t) n++;
    return n;
  }

  /** Number of non-empty cells. */
  countFilled(): number {
    const type = this.type;
    let n = 0;
    for (let i = 0; i < this.size; i++) if (type[i] !== EMPTY) n++;
    return n;
  }

  /** FNV-1a hash of every cell's type, shade, speed, temperature bits, life and solute, as 8 hex digits. */
  hash(): string {
    const { type, shade, vy, life, solute } = this;
    const tbits = new Uint32Array(this.temp.buffer, this.temp.byteOffset, this.size);
    let hsh = 0x811c9dc5;
    for (let i = 0; i < this.size; i++) {
      const t = type[i];
      hsh = Math.imul(hsh ^ (t & 255), 0x01000193);
      hsh = Math.imul(hsh ^ (t >>> 8), 0x01000193);
      hsh = Math.imul(hsh ^ shade[i], 0x01000193);
      hsh = Math.imul(hsh ^ (vy[i] & 255), 0x01000193);
      hsh = Math.imul(hsh ^ tbits[i], 0x01000193);
      hsh = Math.imul(hsh ^ life[i], 0x01000193);
      hsh = Math.imul(hsh ^ solute[i], 0x01000193);
    }
    return (hsh >>> 0).toString(16).padStart(8, '0');
  }
}
