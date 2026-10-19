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
  NUKE,
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
  WALL,
  WATER,
  elementId,
} from '../sim/elements';
import type { World } from '../sim/world';
import './intro.css';

const PLASMA_ID = elementId('plasma');
const ROCKET_ID = elementId('rocket');

const WORD = 'SANDGLASS';
/** On an upright phone the word stacks: SAND over GLASS, so it can be large. */
const SPLIT = 4;

interface Bomb {
  x: number;
  y: number;
  v: number;
  at: number;
  live: boolean;
}
/**
 * The letters are layered like rock strata, top to bottom, so each letter
 * carries every material: when it blows, water, oil, lava and mercury splash
 * out together, oil catches on lava and the gunpowder band goes off.
 */
const STRATA = [SNOW, SALT, GUNPOWDER, DIRT, OIL, SAND, WATER, LAVA, ICE, ACID, MERCURY, SAWDUST];
/** Frames (60 per second). */
const REVEAL = 20; // the word dissolves in, left to right
const CHAIN = 30; // first letter blows; one more every CHAIN_STEP frames
const CHAIN_STEP = 5;
const DEBRIS = [36, 100]; // stray charges go off in the flying debris, one every 3 frames
const BOLTS = 84; // lightning strikes the falling debris
const DROP = 104; // a nuke drops from the top of the screen onto the debris on the floor (more on wide screens)
const DROP_MAX = 60; // frames it may fall before it is set off wherever it is
const NUKE_ACCEL = 0.35; // cells per frame, gained each frame of its fall
const NUKE_MAX_V = 7;
// From the frame the nuke goes off (white flash, fireball, shock, mushroom cloud from the ground):
const FIREWORKS = 26; // firework rockets climb past the cloud, one every 4 frames
/** Grid width (cells) from which three bombs drop instead of one: wide and ultrawide screens. */
const WIDE_CELLS = 450;
/** Frames after the first that the flanking bombs drop. */
const FLANK_DELAY = [12, 20];
const DRAIN = 80; // the floor opens
const FADE = 128; // the canvas fades out over the last half second
const END = 156; // whatever is left is cleared; the controls then move into place
/** How long the screen shakes after the nuke (matches `intro-shake` in intro.css). */
const SHAKE_MS = 700;
/** Bottom rows emptied per frame once the floor opens: everything plunges out fast. */
const DRAIN_ROWS = 3;
/** Share of air pressure and speed kept each frame during the intro. */
const AIR_CALM = 0.86;
const FONT = '"Geist Variable", ui-sans-serif, system-ui, sans-serif';
/** A skip fades the canvas out this fast (matches `body.intro-skip` in intro.css). */
const SKIP_FADE_MS = 180;
/** The controls move into place over this long after the intro (matches intro.css). */
const ENTER_MS = 1600;
/** Tiles that get their own staggered entrance; the rest are below the fold. */
const ENTER_TILES = 40;

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
 * 2. The letters blow one by one, left to right, burning, and stray
 *    charges keep going off in the flying debris.
 * 3. Lightning strikes the debris as it rains onto the floor (the bottom of
 *    the screen), and a nuke drops from above onto the pile.
 * 4. It goes off where it lands, a real nuke: the view flashes white and
 *    shakes, the fireball vaporises the pile, the shock throws the rest and
 *    a mushroom cloud climbs from the ground, then firework rockets burst
 *    round it into falling coloured embers.
 * 5. The floor opens and the canvas fades clear: a clean plate.
 * The intro has the whole window (the screen's bottom is its floor); the
 * controls then move into place round the empty canvas (enterUi).
 * About 4.5 s; any click or key skips it.
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
  private cx = 0;
  private cy = 0;
  private bottom = 0;
  private f = 0;
  /** Frame the nuke went off, or -1 before. */
  private boomAt = -1;
  /** The falling bombs: where each is (cells), its fall speed (cells per frame), when it drops, and whether it still falls. */
  private bombs: Bomb[] = [];
  /** Lightning, fireworks: fewer on a narrow phone, more on a wide screen. */
  private bolts: number[] = [];
  private fireworks = 0;
  private skipping = false;
  private shakeTimer = 0;
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
    this.cx = Math.round((left + right) / 2);
    this.cy = Math.round((top + bottom) / 2);
    this.bottom = bottom;
    this.f = 0;
    this.boomAt = -1;
    // The show scales with the screen: one bomb, or three on a wide one; bolts and rockets by width.
    const wide = w >= WIDE_CELLS;
    const flank = Math.round(w * 0.3);
    this.bombs = (wide ? [this.cx, this.cx - flank, this.cx + flank] : [this.cx]).map((x, k) => ({
      x,
      y: 1,
      v: 1,
      at: DROP + (k === 0 ? 0 : FLANK_DELAY[k - 1]),
      live: true,
    }));
    this.bolts = w < 200 ? [0.3, 0.7] : wide ? [0.12, 0.3, 0.5, 0.7, 0.88] : [0.2, 0.52, 0.81];
    this.fireworks = Math.max(4, Math.min(16, Math.round(w / 36)));
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

    // 3. Stray charges go off in the flying debris.
    if (f >= DEBRIS[0] && f < DEBRIS[1] && (f - DEBRIS[0]) % 3 === 0) {
      const r = world.rng.nextU32();
      const x = Math.round(w * (0.1 + ((r & 1023) / 1023) * 0.8));
      const y = this.top - 24 + ((r >>> 10) % Math.max(1, this.bottom - this.top + 56));
      if (x > 2 && y > 2 && x < w - 3 && y < h - 3) this.blast(x, y, 12, 14, 24, true);
    }

    // Real lightning: three bolts strike down into the falling debris.
    if (f === BOLTS) for (const share of this.bolts) this.bolt(Math.round(w * share));

    // 4. The nuke drops onto the pile and goes off where it lands.
    let falling = false;
    for (const bomb of this.bombs) {
      if (!bomb.live || f < bomb.at) {
        falling ||= bomb.live;
        continue;
      }
      if (f === bomb.at) this.placeNuke(bomb);
      else this.fallNuke(bomb, f - bomb.at >= DROP_MAX);
      falling ||= bomb.live;
    }
    // What follows waits for the last bomb, and is timed from it.
    if (falling || this.boomAt < 0) return true;
    const b = f - this.boomAt;
    // Real fireworks: rockets launch past the cloud, climb and burst into falling coloured embers.
    if (b >= FIREWORKS && (b - FIREWORKS) % 4 === 0 && (b - FIREWORKS) / 4 < this.fireworks) {
      const k = (b - FIREWORKS) / 4;
      const r = world.rng.nextU32();
      const x = Math.round(w * (0.12 + ((k * 0.37 + (r & 255) / 2560) % 1) * 0.76));
      const y = Math.round(h * 0.72);
      const i = y * w + x;
      world.place(i, ROCKET_ID);
      world.life[i] = 24 + ((r >>> 8) % 18);
    }

    // 5. The floor opens: solids break loose, everything plunges out of the bottom edge.
    if (b === DRAIN) {
      for (let i = 0; i < world.size; i++) if (PHASE_OF[world.type[i]] === PH_SOLID) world.type[i] = GRAVEL;
      this.held.fill(0);
    }
    if (b >= DRAIN) {
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
      if (b === FADE) this.fade(true);
      if (b >= END || (b % 15 === 0 && world.countFilled() === 0)) this.finish();
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

  /**
   * Moves the bomb down, faster each frame, trailing fire, until it reaches
   * the pile on the floor; then the nuke goes off there. The fall is
   * scripted and the falling bomb is inert wall (a nuke goes off at the
   * touch of a flame, and the air is full of burning debris), held out of
   * the cell pass so nothing knocks it aside.
   */
  private fallNuke(bomb: Bomb, force: boolean): void {
    const world = this.world;
    const { w, h, type } = world;
    const x = bomb.x;
    // The pile's top under the nuke: climb from the floor while the column is filled.
    let surface = h;
    while (surface > 0) {
      const t = type[(surface - 1) * w + x];
      if (t === EMPTY || t === WALL || PHASE_OF[t] === PH_GAS || PHASE_OF[t] === PH_ENERGY) break;
      surface--;
    }
    this.clearNuke(bomb);
    const from = bomb.y;
    bomb.v = Math.min(NUKE_MAX_V, bomb.v + NUKE_ACCEL);
    // Never upwards: a pile already as high as the nuke sets it off where it is.
    bomb.y = Math.max(bomb.y, Math.min(surface - 3, bomb.y + Math.round(bomb.v)));
    // The trail: a streak of flame over the whole stretch it just fell, so the bomb reads as it drops.
    for (let y = from; y < bomb.y + 1 && y < h; y++)
      for (let i = -1; i <= 1; i++) {
        const k = y * w + x + i;
        if (type[k] === EMPTY && world.rng.next() < (i === 0 ? 0.95 : 0.35)) {
          world.place(k, FIRE);
          world.life[k] = 10 + (world.rng.nextU32() & 15);
        }
      }
    this.placeNuke(bomb);
    if (bomb.y >= surface - 3 || force) this.boom(bomb);
  }

  /** The falling bomb: a 3 × 3 block of wall, stamped so the cell pass leaves it to the script. */
  private placeNuke(bomb: Bomb): void {
    const world = this.world;
    const st = world.currentStamp();
    for (let j = 0; j < 3; j++)
      for (let i = -1; i <= 1; i++) {
        const k = (bomb.y + j) * world.w + bomb.x + i;
        if (k < 0 || k >= world.size) continue;
        world.place(k, WALL);
        world.stamp[k] = st;
      }
  }

  private clearNuke(bomb: Bomb): void {
    const world = this.world;
    for (let j = 0; j < 3; j++)
      for (let i = -1; i <= 1; i++) {
        const k = (bomb.y + j) * world.w + bomb.x + i;
        if (k >= 0 && k < world.size && world.type[k] === WALL) world.place(k, EMPTY);
      }
  }

  /**
   * The climax at (x, y): a real nuke (the engine's own: white flash,
   * fireball, shock and a mushroom cloud rising from the ground), a wider
   * scripted shock so the blast reaches across a large screen, and a shake
   * of the whole canvas.
   */
  private boom(bomb: Bomb): void {
    const world = this.world;
    const x = bomb.x;
    const y = bomb.y + 1;
    bomb.live = false;
    this.boomAt = this.f;
    this.clearNuke(bomb);
    world.place(y * world.w + x, NUKE);
    explode(world, x, y);
    this.blast(x, Math.max(2, y - 4), 60, Math.max(40, world.w * 0.25), 140, false);
    // Each blast restarts the shake, so bombs that land close together each kick the screen.
    const body = document.body;
    body.classList.remove('intro-shake');
    void body.offsetWidth;
    body.classList.add('intro-shake');
    window.clearTimeout(this.shakeTimer);
    this.shakeTimer = window.setTimeout(() => body.classList.remove('intro-shake'), SHAKE_MS);
  }

  /**
   * A choreographed lightning bolt: a jagged line of plasma from the top
   * that strikes into the flying debris near the middle (the game's own
   * lightning passes through falling debris to reach the ground).
   */
  private bolt(x: number): void {
    const world = this.world;
    const { w, h } = world;
    const end = Math.min(h - 2, this.cy + ((world.rng.nextU32() % 13) - 6));
    let cx = x;
    for (let y = 0; y < end; y++) {
      const r = world.rng.nextU32();
      cx = Math.max(1, Math.min(w - 2, cx + ((r & 3) === 0 ? -1 : (r & 3) === 1 ? 1 : 0)));
      const k = y * w + cx;
      if (world.type[k] === EMPTY) world.place(k, PLASMA_ID);
    }
    // The strike: a flash of fire, great heat and a shock where it lands.
    world.air.addPressure(cx, end, 14, 6);
    for (let dy = -2; dy <= 2; dy++)
      for (let dx = -2; dx <= 2; dx++) {
        const k = (end + dy) * w + cx + dx;
        if (k < 0 || k >= world.size) continue;
        if (world.type[k] === EMPTY) {
          world.place(k, FIRE);
          world.life[k] = 10 + (world.rng.nextU32() & 15);
        } else world.temp[k] += 900;
      }
    world.wakeAll();
  }

  /** Ends soon with an empty world: a quick fade out first, so a skip is a soft cut too. */
  skip(): void {
    if (!this.active || this.skipping) return;
    this.skipping = true;
    document.body.classList.add('intro-skip');
    this.fade(true);
    window.setTimeout(() => {
      if (this.active) this.finish();
    }, SKIP_FADE_MS);
  }

  /** Fades the canvas out (or back in), so the end is a soft cut, not a jump. */
  private fade(out: boolean): void {
    document.body.classList.toggle('intro-fading', out);
  }

  private finish(): void {
    this.active = false;
    this.skipping = false;
    document.body.classList.remove('intro-skip');
    this.world.reset(this.world.seed);
    // The empty canvas comes back in softly.
    requestAnimationFrame(() => this.fade(false));
    this.onDone();
  }
}

/**
 * After the intro the controls move into place round the clean canvas: the
 * bar rises from below, the column slides in from the right, then their rows,
 * the element card and the first tiles settle in one after another. Order
 * numbers go in --i; intro.css turns them into delays.
 */
export function enterUi(): void {
  const order = (els: Iterable<Element>): void => {
    let i = 0;
    for (const e of els) (e as HTMLElement).style.setProperty('--i', String(i++));
  };
  order(document.querySelectorAll('.lib-top > *'));
  order(document.querySelectorAll('.info-bar .detail-stage, .info-bar .detail-title, .info-bar .detail-text, .info-bar .detail-side, .info-bar > .lens, .info-bar > .stats'));
  const tiles = [...document.querySelectorAll<HTMLElement>('.groups .tile:not([hidden])')].slice(0, ENTER_TILES);
  order(tiles);
  for (const t of tiles) t.classList.add('entering');
  document.body.classList.add('ui-enter');
  window.setTimeout(() => {
    document.body.classList.remove('ui-enter');
    for (const t of tiles) t.classList.remove('entering');
  }, ENTER_MS);
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
  // Upright screens stack the word in two lines. Each line fits about 80% of the
  // width; the block is no taller than 30% of the height (44% when stacked).
  const lines = h > w * 1.15 ? [WORD.slice(0, SPLIT), WORD.slice(SPLIT)] : [WORD];
  const tracking = 0.04;
  ctx.font = `800 100px ${FONT}`;
  const perPx = Math.max(...lines.map((t) => (ctx.measureText(t).width + t.length * 100 * tracking) / 100));
  const size = Math.min((w * 0.8) / perPx, (h * (lines.length > 1 ? 0.44 : 0.3)) / lines.length);
  ctx.font = `800 ${size}px ${FONT}`;
  ctx.textBaseline = 'alphabetic';
  // Baselines a line apart, the block centred a little above the middle.
  const lead = size * 1.02;
  let baseline = Math.round(h * 0.42 + size * 0.36 - ((lines.length - 1) * lead) / 2);
  let k = 0;
  for (const line of lines) {
    const total = ctx.measureText(line).width + (line.length - 1) * size * tracking;
    let x = Math.round((w - total) / 2);
    for (const ch of line) {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#fff';
      ctx.fillText(ch, x, baseline);
      const data = ctx.getImageData(0, 0, w, h).data;
      for (let i = 0; i < out.length; i++) if (data[i * 4 + 3] > 110 && out[i] === 0) out[i] = k + 1;
      x += ctx.measureText(ch).width + size * tracking;
      k++;
    }
    baseline = Math.round(baseline + lead);
  }
  return out;
}
