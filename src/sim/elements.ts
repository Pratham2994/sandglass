/**
 * Element catalogue. Phase 1 holds only what movement needs; the full
 * property schema (heat, chemistry) arrives with the phases that use it.
 */

export type Category = 'powders' | 'liquids' | 'gases' | 'solids' | 'energy' | 'explosives' | 'life' | 'tools';
export type Phase = 'powder' | 'liquid' | 'gas' | 'solid' | 'energy';

export interface ElementDef {
  key: string;
  name: string;
  category: Category;
  /** Base colours; each cell picks one through its `shade`. For stone, dark to light. */
  colours: string[];
  /**
   * Render only. grain (default): colour per cell. stone: smooth texture fixed
   * to the grid, bevelled edges. liquid: colours run from surface to deep by
   * depth, surface glints.
   */
  texture?: 'grain' | 'stone' | 'liquid';
  phase: Phase;
  /** kg/m³ */
  density: number;
  /** Movers only: fall acceleration in cells/s². Light powders accelerate slowly. */
  fallAccel?: number;
  /** Movers only: top fall speed in cells/s (air drag). At most 238. */
  fallMax?: number;
  /** Liquids: max sideways cells per frame when flowing towards a drop. */
  dispersion?: number;
}

// Ids are indexes into ELEMENTS. Id 0 is empty space (air).
export const EMPTY = 0;
export const WALL = 1;
export const SAND = 2;
export const WATER = 3;
export const OIL = 4;

export const ELEMENTS: readonly ElementDef[] = [
  { key: 'empty', name: 'Air', category: 'tools', colours: ['#0c0d10'], phase: 'gas', density: 1.2 },
  {
    key: 'wall',
    name: 'Wall',
    category: 'solids',
    colours: ['#34373d', '#43464c', '#4f5258', '#5b5e63'],
    texture: 'stone',
    phase: 'solid',
    density: 2500,
  },
  {
    key: 'sand',
    name: 'Sand',
    category: 'powders',
    colours: ['#dcc38a', '#d3b77b', '#e4cd97', '#c9ac6f', '#d8bd84', '#bfa166'],
    phase: 'powder',
    density: 1600,
    fallAccel: 230,
    fallMax: 165,
  },
  {
    key: 'water',
    name: 'Water',
    category: 'liquids',
    colours: ['#6cc0ec', '#3d8fd0', '#2a6aae', '#1d4c86', '#163a68'],
    texture: 'liquid',
    phase: 'liquid',
    density: 1000,
    fallAccel: 230,
    fallMax: 165,
    dispersion: 8,
  },
  {
    key: 'oil',
    name: 'Oil',
    category: 'liquids',
    colours: ['#c79a45', '#93692a', '#6b4a1d', '#4b3314', '#36240e'],
    texture: 'liquid',
    phase: 'liquid',
    density: 900,
    fallAccel: 200,
    fallMax: 120,
    dispersion: 3,
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
 * lighter liquid the chance grows with the density gap, so heavy things
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
      if (B.phase !== 'liquid' || B.density >= A.density) continue;
      // Square root: small gaps (water under oil) still separate at a visible pace.
      const chance = Math.min(1, Math.sqrt(((A.density - B.density) / A.density) * SWAP_GAIN));
      p[a * n + b] = Math.max(1, Math.min(254, Math.round(chance * 255)));
    }
  }
  return p;
})();

/** Element id for a key. Throws on an unknown key. */
export function elementId(key: string): number {
  const id = ELEMENTS.findIndex((e) => e.key === key);
  if (id < 0) throw new Error(`Unknown element: ${key}`);
  return id;
}
