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
  /** Render only. grain (default): colour per cell. stone: smooth texture fixed to the grid, bevelled edges. */
  texture?: 'grain' | 'stone';
  phase: Phase;
  /** kg/m³ */
  density: number;
  /** Movers only: fall acceleration in cells/s². Light powders accelerate slowly. */
  fallAccel?: number;
  /** Movers only: top fall speed in cells/s (air drag). At most 238. */
  fallMax?: number;
}

// Ids are indexes into ELEMENTS. Id 0 is empty space (air).
export const EMPTY = 0;
export const WALL = 1;
export const SAND = 2;

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

/** Element id for a key. Throws on an unknown key. */
export function elementId(key: string): number {
  const id = ELEMENTS.findIndex((e) => e.key === key);
  if (id < 0) throw new Error(`Unknown element: ${key}`);
  return id;
}
