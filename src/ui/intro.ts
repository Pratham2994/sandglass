import { ACID, EMPTY, GRAVEL, GUNPOWDER, LAVA, OIL, PHASE_OF, PH_SOLID, SALT, SAND, SUGAR, WALL, WATER } from '../sim/elements';
import type { World } from '../sim/world';

const WORD = 'SANDGLASS';
/**
 * Material each letter turns into, left to right, chosen so neighbours
 * react as they collapse into each other: sand soaks up water, lava boils
 * water into steam and lights the oil, burning oil pops the gunpowder, salt
 * dissolves into water, acid eats sugar.
 */
const MATERIALS = [SAND, WATER, LAVA, OIL, GUNPOWDER, WATER, SALT, ACID, SUGAR];
/** Fall speed a letter starts with when it breaks (1.5 cells per frame), so the letters land together and react. */
const DROP_VY = 48;
/** Order letters break in: scattered, so no fragment of the word is left standing alone. */
const ORDER = [4, 1, 7, 3, 8, 0, 5, 2, 6];
/** Frames (60 per second): the word holds, then letters break one by one. */
const HOLD = 30;
const STAGGER = 4;
/** Frame the floor opens and everything drains out. */
const DRAIN = 180;
/** Hard stop: whatever is left is cleared. */
const END = 290;
const FONT = '"Geist Variable", ui-sans-serif, system-ui, sans-serif';

/**
 * Opening sequence on the main canvas, run by the real engine. SANDGLASS is
 * drawn in solid cells; after a beat each letter turns into a material and
 * collapses for real; then the floor opens and everything drains out of the
 * bottom edge, leaving an empty world. Any click or key skips it.
 */
export class Intro {
  active = false;
  private readonly world: World;
  /** Letter index + 1 for each cell of the word, 0 elsewhere. */
  private letterOf: Uint8Array = new Uint8Array(0);
  private f = 0;
  private onDone: () => void = () => {};

  constructor(world: World) {
    this.world = world;
  }

  /** Draws the word into the world and starts the sequence. */
  async start(onDone: () => void): Promise<void> {
    this.onDone = onDone;
    await document.fonts.load(`800 100px ${FONT}`).catch(() => undefined);
    const { w, h } = this.world;
    this.letterOf = rasterise(w, h);
    this.world.reset(this.world.seed);
    for (let i = 0; i < this.letterOf.length; i++) if (this.letterOf[i]) this.world.place(i, WALL);
    this.f = 0;
    this.active = true;
  }

  /** One frame of the script, run before each sim step. */
  frame(): boolean {
    if (!this.active) return false;
    const world = this.world;
    const f = this.f++;
    // Break letters one by one: their stone cells become the letter's material.
    if (f >= HOLD && (f - HOLD) % STAGGER === 0) {
      const k = (f - HOLD) / STAGGER;
      if (k < WORD.length) {
        const letter = ORDER[k];
        const id = MATERIALS[letter];
        for (let i = 0; i < this.letterOf.length; i++)
          if (this.letterOf[i] === letter + 1 && world.type[i] === WALL) {
            world.place(i, id);
            world.vy[i] = DROP_VY;
          }
      }
    }
    // The floor opens: the bottom row empties every frame and everything
    // plunges at full fall speed instead of restarting from rest.
    if (f === DRAIN) {
      // Anything that set solid on the way (cooled lava) breaks loose so it drains too.
      for (let i = 0; i < world.size; i++) if (PHASE_OF[world.type[i]] === PH_SOLID) world.type[i] = GRAVEL;
    }
    if (f >= DRAIN) {
      const vy = world.vy;
      for (let i = 0; i < world.size; i++) if (world.type[i] !== EMPTY) vy[i] = 96;
      world.wakeAll();
      const row = (world.h - 1) * world.w;
      for (let x = 0; x < world.w; x++) if (world.type[row + x] !== EMPTY) world.place(row + x, EMPTY);
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
