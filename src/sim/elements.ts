/**
 * Element catalogue. Elements are defined by physical properties; tables
 * for the hot loop are derived from them below. The schema grows with the
 * phases that use it (see docs/SPEC.md).
 */

export type Category = 'powders' | 'liquids' | 'gases' | 'solids' | 'energy' | 'explosives' | 'life' | 'tools';
export type Phase = 'powder' | 'liquid' | 'gas' | 'solid' | 'energy';

export interface ElementDef {
  key: string;
  name: string;
  /** One line for the library's detail card: how it behaves. */
  blurb: string;
  category: Category;
  /** Base colours; each cell picks one through its `shade`. For stone, dark to light. */
  colours: string[];
  /**
   * Render only. grain (default): colour per cell. stone: smooth texture fixed
   * to the grid, bevelled edges. liquid: colours run from surface to deep by
   * depth, surface glints.
   */
  texture?: 'grain' | 'stone' | 'liquid' | 'gas';
  phase: Phase;
  /** kg/m³ */
  density: number;
  /** Movers only: fall acceleration in cells/s². Light powders accelerate slowly. */
  fallAccel?: number;
  /** Movers only: top fall speed in cells/s (air drag). At most 238. */
  fallMax?: number;
  /** Liquids: max sideways cells per frame when flowing towards a drop. */
  dispersion?: number;
  /** °C a new cell starts at. Default: ambient (20). */
  temp?: number;
  /** Relative, water = 1. More capacity: slower to heat and cool. */
  heatCapacity: number;
  /** 0..1, how fast heat passes through. */
  conductivity: number;
  /** °C at which it melts, and what into. The reverse (freezing) is derived. */
  melt?: number;
  meltInto?: string;
  /** °C at which it boils, and what into. The reverse (condensing) is derived. */
  boil?: number;
  boilInto?: string;
  /**
   * Solids only: what forms instead when this solid freezes with nothing
   * solid under it (lava cooling in mid-air or on a pool becomes loose
   * rubble that falls or floats, not a block hanging in the air).
   */
  rubble?: string;
}

// Ids are indexes into ELEMENTS. Id 0 is empty space (air).
export const EMPTY = 0;
export const WALL = 1;
export const SAND = 2;
export const WATER = 3;
export const OIL = 4;
export const ICE = 5;
export const STEAM = 6;
export const LAVA = 7;
export const STONE = 8;
export const GRAVEL = 9;

export const ELEMENTS: readonly ElementDef[] = [
  {
    key: 'empty',
    name: 'Air',
    blurb: 'Empty space.',
    category: 'tools',
    colours: ['#0c0d10'],
    phase: 'gas',
    density: 1.2,
    heatCapacity: 0.3,
    conductivity: 0.02,
  },
  {
    key: 'wall',
    name: 'Wall',
    blurb: 'Fixed stone. Holds back anything that moves.',
    category: 'solids',
    colours: ['#34373d', '#43464c', '#4f5258', '#5b5e63'],
    texture: 'stone',
    phase: 'solid',
    density: 2500,
    heatCapacity: 1,
    conductivity: 0.1,
  },
  {
    key: 'sand',
    name: 'Sand',
    blurb: 'Falls, speeds up, piles into slopes and sinks through liquids.',
    category: 'powders',
    colours: ['#dcc38a', '#d3b77b', '#e4cd97', '#c9ac6f', '#d8bd84', '#bfa166'],
    phase: 'powder',
    density: 1600,
    fallAccel: 230,
    fallMax: 165,
    heatCapacity: 0.8,
    conductivity: 0.15,
  },
  {
    key: 'water',
    name: 'Water',
    blurb: 'Pours, runs along surfaces and settles flat.',
    category: 'liquids',
    colours: ['#6cc0ec', '#3d8fd0', '#2a6aae', '#1d4c86', '#163a68'],
    texture: 'liquid',
    phase: 'liquid',
    density: 1000,
    fallAccel: 230,
    fallMax: 165,
    dispersion: 8,
    heatCapacity: 1,
    conductivity: 0.3,
    boil: 100,
    boilInto: 'steam',
  },
  {
    key: 'oil',
    name: 'Oil',
    blurb: 'Thick and slow. Lighter than water, so it floats as a film.',
    category: 'liquids',
    colours: ['#9a5a1e', '#7a4416', '#5c3110', '#43230b', '#2f1807'],
    texture: 'liquid',
    phase: 'liquid',
    density: 900,
    fallAccel: 200,
    fallMax: 120,
    dispersion: 3,
    heatCapacity: 0.5,
    conductivity: 0.1,
  },
  {
    key: 'ice',
    name: 'Ice',
    blurb: 'Frozen water. Melts above 0 °C; water freezes back below it.',
    category: 'solids',
    colours: ['#9fc6dc', '#b5d6e8', '#c9e4f2', '#e2f2fb'],
    texture: 'stone',
    phase: 'solid',
    density: 917,
    temp: -20,
    heatCapacity: 0.5,
    conductivity: 0.5,
    melt: 0,
    meltInto: 'water',
  },
  {
    key: 'steam',
    name: 'Steam',
    blurb: 'Hot water vapour. Rises, cools, and turns back into water below 100 °C.',
    category: 'gases',
    colours: ['#c9d3dc', '#d8e0e7', '#b9c4cf', '#e4eaef'],
    texture: 'gas',
    phase: 'gas',
    density: 0.6,
    temp: 150,
    heatCapacity: 0.5,
    conductivity: 0.04,
  },
  {
    key: 'lava',
    name: 'Lava',
    blurb: 'Molten rock at 1200 °C. Flows slowly, heats what it touches and cools into stone.',
    category: 'liquids',
    colours: ['#5a1a08', '#4a1406', '#3a1005', '#2c0c04', '#200803'],
    texture: 'liquid',
    phase: 'liquid',
    density: 2600,
    fallAccel: 150,
    fallMax: 90,
    dispersion: 2,
    temp: 1200,
    heatCapacity: 2.5,
    conductivity: 0.25,
  },
  {
    key: 'stone',
    name: 'Stone',
    blurb: 'Solid rock. Glows as it heats and melts into lava at 1000 °C.',
    category: 'solids',
    colours: ['#2f2d2b', '#3a3734', '#46423e', '#524d48'],
    texture: 'stone',
    phase: 'solid',
    density: 2600,
    heatCapacity: 0.8,
    conductivity: 0.3,
    melt: 1000,
    meltInto: 'lava',
    rubble: 'gravel',
  },
  {
    key: 'gravel',
    name: 'Gravel',
    blurb: 'Loose rock. Forms where lava cools with nothing under it; floats on lava, sinks in water.',
    category: 'powders',
    colours: ['#3b3835', '#4a4642', '#2f2d2b', '#56514c', '#433f3b'],
    phase: 'powder',
    density: 2000,
    fallAccel: 240,
    fallMax: 170,
    heatCapacity: 0.8,
    conductivity: 0.3,
    melt: 1000,
    meltInto: 'lava',
  },
];

export const ELEMENT_COUNT = ELEMENTS.length;

// Numeric phase codes for the hot loop.
export const PH_POWDER = 1;
export const PH_LIQUID = 2;
export const PH_GAS = 3;
export const PH_SOLID = 4;
export const PH_ENERGY = 5;

const PHASE_CODE: Record<Phase, number> = {
  powder: PH_POWDER,
  liquid: PH_LIQUID,
  gas: PH_GAS,
  solid: PH_SOLID,
  energy: PH_ENERGY,
};

/** Phase code per element id. Empty is 0 so the cell pass can skip it. */
export const PHASE_OF = Uint8Array.from(ELEMENTS, (e, id) => (id === EMPTY ? 0 : PHASE_CODE[e.phase]));

/** Units of `vy`: 1/32 cell per frame. Int8 holds up to 127, so ~4 cells per frame (238 cells/s). */
export const VY_UNIT = 32;
const FPS = 60;

/** Fall speed gained per frame, in vy units. At least 1 for anything that falls. */
export const GRAVITY_OF = Uint8Array.from(ELEMENTS, (e) =>
  e.fallAccel ? Math.max(1, Math.round((e.fallAccel / (FPS * FPS)) * VY_UNIT)) : 0,
);

/** Top fall speed, in vy units. */
export const VMAX_OF = Uint8Array.from(ELEMENTS, (e) =>
  e.fallMax ? Math.min(127, Math.round((e.fallMax / FPS) * VY_UNIT)) : 0,
);

/** Sideways reach per frame for liquids. */
export const DISPERSION_OF = Uint8Array.from(ELEMENTS, (e) => e.dispersion ?? 0);

/** Density swap scale: chance = sqrt(gap / heavier density × this), capped at 1. */
const SWAP_GAIN = 2;

/**
 * Chance (0..255) per try that a cell of element a moves into a cell of
 * element b, indexed a * ELEMENT_COUNT + b. 255 into empty space. Into a
 * lighter liquid or gas the chance grows with the density gap, so heavy things
 * sink fast and near-equal liquids separate more slowly. 0 means never.
 */
export const ENTER_P = (() => {
  const n = ELEMENTS.length;
  const p = new Uint8Array(n * n);
  for (let a = 1; a < n; a++) {
    const A = ELEMENTS[a];
    if (A.phase !== 'powder' && A.phase !== 'liquid') continue;
    p[a * n + EMPTY] = 255;
    for (let b = 1; b < n; b++) {
      const B = ELEMENTS[b];
      if ((B.phase !== 'liquid' && B.phase !== 'gas') || B.density >= A.density) continue;
      // Square root: small gaps (water under oil) still separate at a visible pace.
      const chance = Math.min(1, Math.sqrt(((A.density - B.density) / A.density) * SWAP_GAIN));
      p[a * n + b] = Math.max(1, Math.min(254, Math.round(chance * 255)));
    }
  }
  return p;
})();

// ---- Heat ----------------------------------------------------------------

/** Room temperature, °C. Air drifts back to it. */
export const AMBIENT = 20;

/** Start temperature per element. */
export const TEMP_OF = Float32Array.from(ELEMENTS, (e) => e.temp ?? AMBIENT);
/** 1 / heat capacity per element. */
export const INV_CAP_OF = Float32Array.from(ELEMENTS, (e) => 1 / e.heatCapacity);

/**
 * Heat exchanged per frame per °C of difference between two touching cells,
 * indexed a * ELEMENT_COUNT + b: the harmonic mean of the conductivities,
 * scaled so neither cell moves more than 0.2 of the gap per neighbour (stable).
 */
export const HEAT_K = (() => {
  const n = ELEMENTS.length;
  const k = new Float32Array(n * n);
  for (let a = 0; a < n; a++)
    for (let b = 0; b < n; b++) {
      const ca = ELEMENTS[a].conductivity;
      const cb = ELEMENTS[b].conductivity;
      const hm = ca + cb > 0 ? (2 * ca * cb) / (ca + cb) : 0;
      k[a * n + b] = 0.2 * hm * Math.min(ELEMENTS[a].heatCapacity, ELEMENTS[b].heatCapacity);
    }
  return k;
})();

/**
 * Phase changes. Upward (melt or boil) comes from the element; downward
 * (freeze or condense) is derived from whichever element melts or boils
 * into this one, so ice freezes water without water saying so.
 * UP_T / DOWN_T include the margin; the nominal point is the element's own melt / boil.
 */
export const UP_T = new Float32Array(ELEMENTS.length).fill(Infinity);
export const UP_INTO = new Uint16Array(ELEMENTS.length);
export const DOWN_T = new Float32Array(ELEMENTS.length).fill(-Infinity);
export const DOWN_INTO = new Uint16Array(ELEMENTS.length);
/** °C a cell loses going up (melting, boiling) or gains going down: boiling costs far more than melting. */
export const UP_LATENT = new Float32Array(ELEMENTS.length);
export const DOWN_LATENT = new Float32Array(ELEMENTS.length);
/**
 * Latent heat per transition, and the margin past the threshold a change
 * needs. The margin must exceed half the latent heat, or a fresh cell would
 * land past the reverse threshold and flip straight back.
 */
const LATENT_MELT = 3;
const MARGIN_MELT = 2;
const LATENT_BOIL = 12;
const MARGIN_BOIL = 8;
ELEMENTS.forEach((e, id) => {
  const up =
    e.melt !== undefined && e.meltInto
      ? { t: e.melt, into: e.meltInto, latent: LATENT_MELT, margin: MARGIN_MELT }
      : e.boil !== undefined && e.boilInto
        ? { t: e.boil, into: e.boilInto, latent: LATENT_BOIL, margin: MARGIN_BOIL }
        : null;
  if (!up) return;
  const into = elementId(up.into);
  UP_T[id] = up.t + up.margin;
  UP_INTO[id] = into;
  UP_LATENT[id] = up.latent;
  // The first element that melts or boils into another owns the reverse
  // (stone, not gravel, is what lava freezes into).
  if (DOWN_T[into] !== -Infinity) return;
  DOWN_T[into] = up.t - up.margin;
  DOWN_INTO[into] = id;
  DOWN_LATENT[into] = up.latent;
});

/** What a solid becomes instead when it freezes unsupported; 0 = itself. */
export const RUBBLE_OF = Uint16Array.from(ELEMENTS, (e) => (e.rubble ? elementId(e.rubble) : 0));

/** Element id for a key. Throws on an unknown key. */
export function elementId(key: string): number {
  const id = ELEMENTS.findIndex((e) => e.key === key);
  if (id < 0) throw new Error(`Unknown element: ${key}`);
  return id;
}
