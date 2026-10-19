/**
 * How a change of element looks. When a cell turns from one element into
 * another (kernel into popcorn, water into ice, meat into cooked meat), it
 * does not swap colour at once: for a moment it shows its old colour giving
 * way to the new, washed with a tint for the kind of change (white for a
 * pop, frost for freezing, a warm glow for melting), at a pace for that kind
 * (a pop in a tenth of a second, rust over a second and a half). The style
 * of each pair is read from the element data once, at load, so new elements
 * get the right look with no extra work.
 *
 * Only drawn: the simulation never reads it, and saves and rewinds drop it.
 */
import {
  BAKE_INTO_OF,
  BODY_OF,
  BOLT_OF,
  DOWN_INTO,
  ELEMENTS,
  ELEMENT_COUNT,
  EMPTY,
  HABITAT_OF,
  PARTICLE_OF,
  PHASE_OF,
  PH_ENERGY,
  PH_GAS,
  PH_LIQUID,
  PH_POWDER,
  PH_SOLID,
  SOLVENT_OF,
  UP_INTO,
  elementId,
} from './elements';

export const M_POP = 1;
export const M_COOK = 2;
export const M_CHAR = 3;
export const M_MELT = 4;
export const M_BOIL = 5;
export const M_FREEZE = 6;
export const M_CONDENSE = 7;
export const M_CRYSTAL = 8;
export const M_IGNITE = 9;
export const M_EMBER = 10;
export const M_ROT = 11;
export const M_RUST = 12;
export const M_SET = 13;
export const M_GROW = 14;
export const M_WITHER = 15;
export const M_BREAK = 16;
export const M_LIGHT = 17;
export const M_VANISH = 18;
export const M_REACT = 19;
export const M_DECAY = 20;

/**
 * Each style: frames the change takes, the tint it passes through (RGB) and
 * how strongly (0 to 1), and whether the tint lights what is round it.
 */
export const MORPH_STYLES: { frames: number; tint: [number, number, number]; strength: number; emits: boolean }[] = [
  { frames: 1, tint: [0, 0, 0], strength: 0, emits: false },
  /* pop */ { frames: 7, tint: [255, 251, 238], strength: 0.95, emits: true },
  /* cook */ { frames: 55, tint: [255, 196, 128], strength: 0.3, emits: false },
  /* char */ { frames: 32, tint: [255, 136, 56], strength: 0.45, emits: true },
  /* melt */ { frames: 26, tint: [255, 172, 92], strength: 0.35, emits: false },
  /* boil */ { frames: 10, tint: [240, 246, 255], strength: 0.55, emits: false },
  /* freeze */ { frames: 26, tint: [206, 238, 255], strength: 0.6, emits: false },
  /* condense */ { frames: 16, tint: [222, 240, 255], strength: 0.35, emits: false },
  /* crystal */ { frames: 18, tint: [255, 255, 255], strength: 0.75, emits: true },
  /* ignite */ { frames: 9, tint: [255, 204, 96], strength: 0.85, emits: true },
  /* ember */ { frames: 24, tint: [255, 112, 36], strength: 0.7, emits: true },
  /* rot */ { frames: 90, tint: [150, 140, 92], strength: 0.18, emits: false },
  /* rust */ { frames: 90, tint: [224, 122, 58], strength: 0.25, emits: false },
  /* set */ { frames: 45, tint: [240, 236, 222], strength: 0.18, emits: false },
  /* grow */ { frames: 22, tint: [176, 232, 124], strength: 0.3, emits: false },
  /* wither */ { frames: 80, tint: [204, 172, 96], strength: 0.12, emits: false },
  /* break */ { frames: 8, tint: [255, 255, 255], strength: 0.4, emits: false },
  /* light */ { frames: 30, tint: [204, 176, 255], strength: 0.45, emits: true },
  /* vanish */ { frames: 10, tint: [0, 0, 0], strength: 0, emits: false },
  /* react */ { frames: 12, tint: [0, 0, 0], strength: 0, emits: false },
  /* decay */ { frames: 40, tint: [0, 0, 0], strength: 0, emits: false },
];

/** Brightness (of 255) a morph loses each frame, by style. */
export const MORPH_FADE = Uint8Array.from(MORPH_STYLES, (s) => Math.max(1, Math.ceil(255 / s.frames)));

const N = ELEMENT_COUNT;
const idOf = (key: string | undefined): number => (key === undefined ? 0 : elementId(key));

/** Elements that change type all the time as part of how they move or live: bodies, bolts, particles. They never morph. */
const RESTLESS = Uint8Array.from({ length: N }, (_, t) => (HABITAT_OF[t] !== 0 || BODY_OF[t] !== null || BOLT_OF[t] !== 0 || PARTICLE_OF[t] !== 0 || ELEMENTS[t].bolt !== undefined ? 1 : 0));

/** Named one-way changes in the data, by style: (from, into) pairs. */
const NAMED = new Map<number, number>();
const name = (from: number, into: number, style: number): void => {
  if (from !== 0 && into !== 0 && !NAMED.has(from * N + into)) NAMED.set(from * N + into, style);
};
ELEMENTS.forEach((e, t) => {
  name(t, idOf(e.rotsInto), M_ROT);
  name(t, idOf(e.rustsInto), M_RUST);
  name(t, idOf(e.setsInto), M_SET);
  name(t, idOf(e.curesInto), M_SET);
  name(t, idOf(e.growsInto), M_GROW);
  name(t, idOf(e.leafInto), M_GROW);
  name(t, idOf(e.topInto), M_GROW);
  name(t, idOf(e.witherInto), M_WITHER);
  name(t, idOf(e.breaksInto), M_BREAK);
  name(t, idOf(e.crumblesInto), M_BREAK);
  name(t, idOf(e.burnsOutInto), M_BREAK);
  name(t, idOf(e.lightInto), M_LIGHT);
  name(t, idOf(e.decaysInto), M_DECAY);
  name(idOf(e.crystalOf), t, M_CRYSTAL);
  name(t, idOf(e.crystalOf), M_REACT);
  if (e.bake?.pop) name(t, idOf(e.bake.into), M_POP);
});

const FOOD = Uint8Array.from(ELEMENTS, (e) => (e.category === 'food' ? 1 : 0));

/** The style of a change from element `from` into `into`. */
function styleOf(from: number, into: number): number {
  if (from === into || from === EMPTY || RESTLESS[from] !== 0 || RESTLESS[into] !== 0) return 0;
  const pf = PHASE_OF[from];
  const pi = PHASE_OF[into];
  if (into === EMPTY) return pf === PH_GAS || pf === PH_ENERGY ? 0 : M_VANISH;
  const named = NAMED.get(from * N + into);
  if (named !== undefined) return named;
  // Fire and sparks: catching fire flares; a flame leaving its ash glows out like an ember.
  if (pi === PH_ENERGY) return pf === PH_ENERGY ? 0 : M_IGNITE;
  if (pf === PH_ENERGY) return M_EMBER;
  if (BAKE_INTO_OF[from] === into) {
    if (pi === PH_LIQUID) return M_MELT;
    if (pi === PH_GAS) return M_BOIL;
    return FOOD[from] !== 0 || FOOD[into] !== 0 ? M_COOK : M_CHAR;
  }
  if (DOWN_INTO[from] === into) return pf === PH_GAS ? M_CONDENSE : M_FREEZE;
  if (UP_INTO[from] === into) return pi === PH_GAS ? M_BOIL : M_MELT;
  // A liquid boiled off leaves what it carried: crystals.
  if (SOLVENT_OF[from] !== 0 && (pi === PH_POWDER || pi === PH_SOLID)) return M_CRYSTAL;
  if (pf === PH_GAS && (pi === PH_LIQUID || pi === PH_SOLID || pi === PH_POWDER)) return M_CONDENSE;
  if (pi === PH_GAS && pf !== PH_GAS) return M_BOIL;
  if (pf === PH_SOLID && pi === PH_LIQUID) return M_MELT;
  if (pf === PH_LIQUID && pi === PH_SOLID) return M_FREEZE;
  if (pf === PH_SOLID && pi === PH_POWDER) return M_BREAK;
  return M_REACT;
}

/** Style of every (from, into) pair, from × N + into. */
export const MORPH_STYLE_OF = new Uint8Array(N * N);
for (let a = 0; a < N; a++) for (let b = 0; b < N; b++) MORPH_STYLE_OF[a * N + b] = styleOf(a, b);
