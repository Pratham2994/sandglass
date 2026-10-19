/**
 * Reaction flashes: where a reaction happens, the cells light up for a moment
 * in a colour for its kind (acid fizz yellow-green, neutralising white-blue,
 * rust orange) and light their surroundings, then fade over about a third of
 * a second. Only drawn: nothing in the simulation reads it, and saves and
 * rewinds ignore it.
 */
import {
  R_ABSORB,
  R_ACIDIFY,
  R_CORRODE,
  R_DISSOLVE,
  R_FERMENT,
  R_NEUTRAL,
  R_OVERRIDE,
  R_QUENCH,
  R_ROT,
  R_RUST,
  R_SET,
  R_THAW,
  R_TOXIC,
} from './chem';
import type { World } from './world';

export const FX_CORRODE = 1;
export const FX_NEUTRAL = 2;
export const FX_DISSOLVE = 3;
export const FX_SET = 4;
export const FX_THAW = 5;
export const FX_ACIDIFY = 6;
export const FX_TOXIC = 7;
export const FX_RUST = 8;
export const FX_ROT = 9;
export const FX_QUENCH = 10;
export const FX_HOT = 11;
export const FX_PLAIN = 12;
export const FX_COLD = 13;

/** Colour of each kind, by index. */
export const FX_RGB: [number, number, number][] = [
  [0, 0, 0],
  [200, 240, 74],
  [191, 232, 255],
  [127, 184, 255],
  [240, 230, 200],
  [168, 228, 255],
  [232, 240, 96],
  [154, 223, 58],
  [224, 122, 58],
  [201, 176, 106],
  [232, 244, 255],
  [255, 178, 74],
  [255, 242, 200],
  [159, 216, 255],
];

/** Brightness lost per frame (of 255). */
const FADE = 14;

interface Fx {
  size: number;
  level: Uint8Array;
  kind: Uint8Array;
  /** Cells still glowing, so fading touches only them. */
  list: Int32Array;
  n: number;
}

const fxs = new WeakMap<World, Fx>();

function fxFor(world: World): Fx {
  let f = fxs.get(world);
  if (!f || f.size !== world.size) {
    const size = world.size;
    f = { size, level: new Uint8Array(size), kind: new Uint8Array(size), list: new Int32Array(size), n: 0 };
    fxs.set(world, f);
  }
  return f;
}

/** Cell i flashes in colour `kind` at `strength` (0 to 255), unless it already glows brighter. */
export function flash(world: World, i: number, kind: number, strength: number): void {
  const f = fxFor(world);
  if (f.level[i] === 0) f.list[f.n++] = i;
  if (strength >= f.level[i]) {
    f.level[i] = strength;
    f.kind[i] = kind;
  }
}

/** Fades every glowing cell one frame. */
export function fxStep(world: World): void {
  const f = fxs.get(world);
  if (!f || f.n === 0 || f.size !== world.size) return;
  const { level, list } = f;
  let m = 0;
  for (let q = 0; q < f.n; q++) {
    const i = list[q];
    const v = level[i] > FADE ? level[i] - FADE : 0;
    level[i] = v;
    if (v !== 0) list[m++] = i;
  }
  f.n = m;
}

/** Brightness and kind of every cell, for the renderer; null when nothing has flashed yet. */
export function fxLevels(world: World): { level: Uint8Array; kind: Uint8Array; n: number } | null {
  const f = fxs.get(world);
  return f && f.size === world.size ? f : null;
}

/** Flash colour and strength for each reaction rule (burning has its own flames, so none). */
const KIND_OF_RULE = new Uint8Array(32);
const STRENGTH_OF_RULE = new Uint8Array(32);
for (const [rule, kind, strength] of [
  [R_CORRODE, FX_CORRODE, 255],
  [R_NEUTRAL, FX_NEUTRAL, 255],
  [R_DISSOLVE, FX_DISSOLVE, 110],
  [R_ABSORB, FX_DISSOLVE, 90],
  [R_SET, FX_SET, 170],
  [R_THAW, FX_THAW, 150],
  [R_ACIDIFY, FX_ACIDIFY, 210],
  [R_TOXIC, FX_TOXIC, 210],
  [R_RUST, FX_RUST, 150],
  [R_ROT, FX_ROT, 120],
  [R_FERMENT, FX_ROT, 140],
  [R_QUENCH, FX_QUENCH, 230],
  [R_OVERRIDE, FX_PLAIN, 255],
]) {
  KIND_OF_RULE[rule] = kind;
  STRENGTH_OF_RULE[rule] = strength;
}

/** A reaction by `rule` between cells i and j shows: both flash. Hand-written reactions glow warm or cold with their heat. */
export function reactionFlash(world: World, i: number, j: number, rule: number, heat: number): void {
  let kind = KIND_OF_RULE[rule];
  if (kind === 0) return;
  if (rule === R_OVERRIDE && heat !== 0) kind = heat > 0 ? FX_HOT : FX_COLD;
  const s = STRENGTH_OF_RULE[rule];
  flash(world, i, kind, s);
  flash(world, j, kind, s);
}
