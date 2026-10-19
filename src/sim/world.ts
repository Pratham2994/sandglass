import { AMBIENT, ELEMENT_COUNT, EMPTY, FADES_OF, GATE_OF, GATE_SWITCH, LIFE_OF, TEMP_OF } from './elements';
import { MORPH_FADE, MORPH_STYLE_OF } from './morph';
import { Air } from './air';
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
  /** Element carried inside this cell: what a fire is burning, what is dissolved in a liquid, what a powder has soaked up. 0 = none. */
  solute: Uint16Array;
  /** How much of the solute, 0..255. */
  conc: Uint8Array;
  /** Electric charge: a pulse counts down from CHARGE_PEAK; while above 0 the cell cannot be recharged. */
  charge: Uint8Array;
  /** Electric potential, volts, of a cell in a live circuit (the circuit solver starts from it each frame). */
  volt: Float32Array;

  /** Chunk grid size, in chunks of CHUNK × CHUNK cells. */
  cw: number;
  ch: number;
  /** Chunks the cell pass runs this frame. */
  awake: Uint8Array;
  /** Chunks woken during this frame, for the next one. */
  awakeNext: Uint8Array;
  /**
   * Chunks that are only warming or cooling: the heat pass runs them, the cell
   * pass does not. A hot crater or a cooling sky then costs one cheap pass, not
   * a full update of every cell in it.
   */
  warm: Uint8Array;
  warmNext: Uint8Array;

  /** Air pressure and wind, on a coarse grid. */
  air: Air;
  readonly rng: Rng;
  seed: number;
  /** Number of steps run since the last reset. */
  frame = 0;
  /** Brightness of a nuke's white flash over the whole view (0 to 1), fading each step. Only drawn, never saved. */
  flash = 0;
  /**
   * A change of element still showing (see morph.ts): how far it has to go
   * (255 just changed, 0 done), the element it was, and its style. They move
   * with the cell. Only drawn, never saved or hashed.
   */
  morph: Uint8Array;
  morphFrom: Uint16Array;
  morphStyle: Uint8Array;
  /** Changes still showing somewhere, so fading can skip the grid when there are none. */
  morphing = false;
  /** While set, changes are not shown (the player's own brush strokes appear and vanish at once). */
  quiet = false;

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
    this.conc = new Uint8Array(this.size);
    this.charge = new Uint8Array(this.size);
    this.volt = new Float32Array(this.size);
    this.morph = new Uint8Array(this.size);
    this.morphFrom = new Uint16Array(this.size);
    this.morphStyle = new Uint8Array(this.size);
    this.cw = Math.ceil(w / CHUNK);
    this.ch = Math.ceil(h / CHUNK);
    this.awake = new Uint8Array(this.cw * this.ch);
    this.awakeNext = new Uint8Array(this.cw * this.ch).fill(1);
    this.warm = new Uint8Array(this.cw * this.ch);
    this.warmNext = new Uint8Array(this.cw * this.ch).fill(1);
    this.seed = seed;
    this.rng = new Rng(seed);
    this.air = new Air(w, h);
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
      conc: this.conc,
      charge: this.charge,
      volt: this.volt,
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
    this.conc = new Uint8Array(this.size);
    this.charge = new Uint8Array(this.size);
    this.volt = new Float32Array(this.size);
    this.morph = new Uint8Array(this.size);
    this.morphFrom = new Uint16Array(this.size);
    this.morphStyle = new Uint8Array(this.size);
    this.morphing = false;
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
      this.conc.set(old.conc.subarray(src, src + cols), dst);
      this.charge.set(old.charge.subarray(src, src + cols), dst);
      this.volt.set(old.volt.subarray(src, src + cols), dst);
    }
    this.cw = Math.ceil(w / CHUNK);
    this.ch = Math.ceil(h / CHUNK);
    this.awake = new Uint8Array(this.cw * this.ch);
    this.awakeNext = new Uint8Array(this.cw * this.ch).fill(1);
    this.warm = new Uint8Array(this.cw * this.ch);
    this.warmNext = new Uint8Array(this.cw * this.ch).fill(1);
    this.air = new Air(w, h);
  }

  /** Turns the whole grid upside down (180°), as when an hourglass is flipped. */
  rotate180(): void {
    this.type.reverse();
    this.shade.reverse();
    this.temp.reverse();
    this.life.reverse();
    this.solute.reverse();
    this.conc.reverse();
    this.charge.reverse();
    this.volt.reverse();
    this.stamp.fill(0);
    this.vy.fill(0);
    this.clearMorph();
    this.air.clear();
    this.wakeAll();
  }

  /** Empties every cell (and the air) without touching the frame count or the RNG: the timeline's "clear". */
  clearCells(): void {
    this.type.fill(EMPTY);
    this.vy.fill(0);
    this.stamp.fill(0);
    this.shade.fill(0);
    this.temp.fill(AMBIENT);
    this.life.fill(0);
    this.solute.fill(0);
    this.conc.fill(0);
    this.charge.fill(0);
    this.volt.fill(0);
    this.clearMorph();
    this.air.clear();
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
    this.conc.fill(0);
    this.charge.fill(0);
    this.volt.fill(0);
    this.awake.fill(0);
    this.awakeNext.fill(1);
    this.warm.fill(0);
    this.warmNext.fill(1);
    this.clearMorph();
    this.air.clear();
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

  /** Marks the chunks round cell (x, y) for the heat pass only next frame (see `warm`). */
  wakeHeat(x: number, y: number): void {
    const x0 = (x > 0 ? x - 1 : 0) >> CHUNK_SHIFT;
    const x1 = (x + 1 < this.w ? x + 1 : x) >> CHUNK_SHIFT;
    const r0 = ((y > 0 ? y - 1 : 0) >> CHUNK_SHIFT) * this.cw;
    const r1 = ((y + 1 < this.h ? y + 1 : y) >> CHUNK_SHIFT) * this.cw;
    const a = this.warmNext;
    a[r0 + x0] = 1;
    a[r0 + x1] = 1;
    a[r1 + x0] = 1;
    a[r1 + x1] = 1;
  }

  /** Wakes every chunk for the next frame. */
  wakeAll(): void {
    this.awakeNext.fill(1);
    this.warmNext.fill(1);
  }

  /** Start of a frame: chunks woken last frame run now; a chunk nothing wakes this frame sleeps next. */
  beginFrame(): void {
    this.awake.set(this.awakeNext);
    this.awakeNext.fill(0);
    this.warm.set(this.warmNext);
    this.warmNext.fill(0);
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

  /** Drops every change still showing (after a rewind, the old ones belong to another time). */
  clearMorph(): void {
    this.morph.fill(0);
    this.morphing = false;
  }

  /** Cell i has just turned from element `from` into what it is now: show the change. */
  changed(i: number, from: number): void {
    if (this.quiet) return;
    const style = MORPH_STYLE_OF[from * ELEMENT_COUNT + this.type[i]];
    if (style === 0) return;
    // A cell changing again mid-way keeps showing the element it started as.
    if (this.morph[i] === 0) this.morphFrom[i] = from;
    this.morph[i] = 255;
    this.morphStyle[i] = style;
    this.morphing = true;
  }

  /** One frame of every change still showing. */
  fadeMorph(): void {
    if (!this.morphing) return;
    const { morph, morphStyle } = this;
    let any = false;
    for (let i = 0; i < this.size; i++) {
      const m = morph[i];
      if (m === 0) continue;
      const f = MORPH_FADE[morphStyle[i]];
      morph[i] = m > f ? m - f : 0;
      any = true;
    }
    this.morphing = any;
  }

  /** Swaps every field of cells i and j (movement never creates or destroys). */
  swapCells(i: number, j: number): void {
    const { type, vy, stamp, shade, temp, life, solute, conc, charge, volt, morph } = this;
    // A change still showing moves with its cell.
    if ((morph[i] | morph[j]) !== 0) {
      let m: number = morph[i];
      morph[i] = morph[j];
      morph[j] = m;
      m = this.morphFrom[i];
      this.morphFrom[i] = this.morphFrom[j];
      this.morphFrom[j] = m;
      m = this.morphStyle[i];
      this.morphStyle[i] = this.morphStyle[j];
      this.morphStyle[j] = m;
    }
    let v: number = type[i];
    type[i] = type[j];
    type[j] = v;
    v = vy[i];
    vy[i] = vy[j];
    vy[j] = v;
    v = stamp[i];
    stamp[i] = stamp[j];
    stamp[j] = v;
    v = shade[i];
    shade[i] = shade[j];
    shade[j] = v;
    v = temp[i];
    temp[i] = temp[j];
    temp[j] = v;
    v = life[i];
    life[i] = life[j];
    life[j] = v;
    v = solute[i];
    solute[i] = solute[j];
    solute[j] = v;
    v = conc[i];
    conc[i] = conc[j];
    conc[j] = v;
    v = charge[i];
    charge[i] = charge[j];
    charge[j] = v;
    v = volt[i];
    volt[i] = volt[j];
    volt[j] = v;
  }

  /** Places a new cell of element `t` at index i, replacing what was there, and wakes it. */
  place(i: number, t: number): void {
    const from = this.type[i];
    this.type[i] = t;
    if (from !== t && from !== EMPTY) this.changed(i, from);
    // Something new in an empty cell: whatever faded out there is gone.
    else if (from === EMPTY) this.morph[i] = 0;
    this.vy[i] = 0;
    this.stamp[i] = 0;
    this.shade[i] = t === EMPTY ? 0 : this.rng.nextU32() & 255;
    // A switch is placed closed, and smoke starts dense: their shade picks the first colours.
    if (GATE_OF[t] === GATE_SWITCH || FADES_OF[t] !== 0) this.shade[i] &= 127;
    this.temp[i] = TEMP_OF[t];
    this.life[i] = LIFE_OF[t];
    this.solute[i] = 0;
    this.conc[i] = 0;
    this.charge[i] = 0;
    this.volt[i] = 0;
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
    const { type, shade, vy, life, solute, conc, charge } = this;
    const tbits = new Uint32Array(this.temp.buffer, this.temp.byteOffset, this.size);
    const vbits = new Uint32Array(this.volt.buffer, this.volt.byteOffset, this.size);
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
      hsh = Math.imul(hsh ^ conc[i], 0x01000193);
      hsh = Math.imul(hsh ^ charge[i], 0x01000193);
      hsh = Math.imul(hsh ^ vbits[i], 0x01000193);
    }
    return (hsh >>> 0).toString(16).padStart(8, '0');
  }
}
