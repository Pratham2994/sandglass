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
  /** Base colours; each cell picks one through its `shade`. */
  colours: string[];
  phase: Phase;
  /** kg/m³ */
  density: number;
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
    colours: ['#4b4e54', '#46494f', '#515459', '#42454b'],
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

/** Element id for a key. Throws on an unknown key. */
export function elementId(key: string): number {
  const id = ELEMENTS.findIndex((e) => e.key === key);
  if (id < 0) throw new Error(`Unknown element: ${key}`);
  return id;
}
