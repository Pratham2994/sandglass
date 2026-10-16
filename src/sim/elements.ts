/**
 * Element catalogue. Elements are defined by physical properties; tables
 * for the hot loop are derived from them below. The schema grows with the
 * phases that use it (see docs/SPEC.md).
 */

export type Category = 'powders' | 'liquids' | 'gases' | 'solids' | 'energy' | 'explosives' | 'electronics' | 'life' | 'tools';
export type Phase = 'powder' | 'liquid' | 'gas' | 'solid' | 'energy';
/** Material class, read by the chemistry rules (acid eats metal, mineral and organic). */
export type Cls = 'mineral' | 'metal' | 'organic' | 'salt' | 'water' | 'gas' | 'energy' | 'life';

/** A hand-written reaction with another element; wins over the compiler. */
export interface Override {
  /** What this cell becomes ('keep' leaves it). */
  self: string;
  /** What the other cell becomes ('keep' leaves it). */
  other: string;
  /** Gas released into an empty neighbour. */
  gas?: string;
  /** Chance per frame while touching, 0..1. */
  chance: number;
  /** Only above this temperature (°C) of this cell. */
  minTemp?: number;
  /** Shown in the inspector as the reason. */
  reason: string;
}

export interface ElementDef {
  key: string;
  name: string;
  /**
   * Description, always in this pattern, two or three short sentences and no
   * numbers (the facts rows carry those): what it is. How it moves. What
   * changes it or what it does to others.
   */
  blurb: string;
  category: Category;
  /** Base colours; each cell picks one through its `shade`. For stone, dark to light. */
  colours: string[];
  /**
   * Render only. grain (default): colour per cell. stone: smooth texture fixed
   * to the grid, bevelled edges. liquid: colours run from surface to deep by
   * depth, surface glints.
   */
  texture?: 'grain' | 'stone' | 'liquid' | 'gas' | 'fire' | 'glass';
  phase: Phase;
  cls: Cls;
  /** 0..1: resists acid (and, later, pressure). */
  hardness: number;
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
  /**
   * °C at which it boils, and what into. The reverse (condensing) is derived,
   * so `boilInto` must be this element's own vapour (water → steam), never a
   * shared gas like smoke, or that gas would condense into this element.
   */
  boil?: number;
  boilInto?: string;
  /**
   * Solids only: what forms instead when this solid freezes with nothing
   * solid under it (lava cooling in mid-air or on a pool becomes loose
   * rubble that falls or floats, not a block hanging in the air).
   */
  rubble?: string;
  /** °C at which it catches fire when touching an oxidiser (air, oxygen). */
  ignition?: number;
  /** Frames one cell burns for. */
  fuel?: number;
  /** °C its flame reaches. */
  flameTemp?: number;
  /** What is left when a cell burns out: 'empty' for nothing. */
  burnInto?: string;
  /** °C a burning cell pushes into each touching cell per frame (radiant heat). Default 3. */
  burnEnergy?: number;
  /** Chance (0..1) a burnt-out cell leaves `burnInto`; otherwise it is gone (burnt off as gas). Default 1. */
  residue?: number;
  /** 0..1, how well it feeds a fire. Air is 0.21. */
  oxidiser?: number;
  /** -1 strong base .. +1 strong acid. */
  acidity?: number;
  /** Gases: leaves the world at the top edge (smoke drifting off). */
  vents?: boolean;
  /** Light powders: chance per frame of drifting sideways while falling. */
  drift?: number;
  /** Liquids: dissolves soluble solids into itself (water). */
  solvent?: boolean;
  /** Solids and powders: how much a solvent cell can hold of it, 0..1 (salt 0.4). */
  solubility?: number;
  /** Powders: how much liquid it soaks up, 0..1 (sand 0.3, dirt 0.5). */
  porosity?: number;
  /**
   * Explosives: once lit (by heat past `ignition` or a flame, no air needed),
   * every cell of it within `radius` goes up at once: a pressure blast of
   * about `power` per cell (square-root scaled), heat and flames.
   */
  explosive?: { power: number; radius: number };
  /** Liquid explosives: also go off when they land faster than this (cells/s). */
  impact?: number;
  /** Brittle solids: shatter when the air pressure on them passes this. */
  brittle?: number;
  /** What a brittle solid shatters into. */
  breaksInto?: string;
  /** 0..1: carries electric charge (metals 1). Water conducts only when it carries salt. */
  electric?: number;
  /** Power sources: send a charge into touching conductors every this many frames. */
  powerEvery?: number;
  /** Energy: frames a placed cell lasts (fire 45, spark 10). */
  lifetime?: number;
  /** Seeds: grow into this element on wet dirt with open sky above. */
  growsInto?: string;
  /** Hand-written reactions by the other element's key; they win over the compiler. */
  overrides?: Record<string, Override>;
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
export const FIRE = 10;
export const SMOKE = 11;
export const WOOD = 12;
export const ASH = 13;
export const ACID = 14;
export const IRON = 15;
export const HYDROGEN = 16;
export const OXYGEN = 17;
export const METHANE = 18;
export const ALCOHOL = 19;
export const SAWDUST = 20;
export const SALT = 21;
export const SUGAR = 22;
export const DIRT = 23;
export const SNOW = 24;
export const TNT = 25;
export const GUNPOWDER = 26;
export const NITRO = 27;
export const GLASS = 28;
export const SHARDS = 29;
export const SPARK = 30;
export const WIRE = 31;
export const BATTERY = 32;
export const MERCURY = 33;
export const SEED = 34;
export const PLANT = 35;

export const ELEMENTS: readonly ElementDef[] = [
  {
    key: 'empty',
    cls: 'gas',
    hardness: 0,
    oxidiser: 0.21,
    name: 'Air',
    blurb: 'Empty space at room temperature. Carries heat away slowly. Feeds fire with its oxygen.',
    category: 'tools',
    colours: ['#0c0d10'],
    phase: 'gas',
    density: 1.2,
    heatCapacity: 0.3,
    conductivity: 0.02,
  },
  {
    key: 'wall',
    cls: 'mineral',
    hardness: 1,
    name: 'Wall',
    blurb: 'An indestructible solid. Never moves. Nothing melts, burns or eats it; use it for containers and floors.',
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
    cls: 'mineral',
    hardness: 0.95,
    porosity: 0.3,
    name: 'Sand',
    blurb: 'A fine, heavy powder. Falls, piles into slopes and sinks through lighter liquids. Very hard to melt or eat away.',
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
    cls: 'water',
    hardness: 0,
    solvent: true,
    name: 'Water',
    blurb: 'A runny liquid. Flows and settles flat. Boils into steam when hot, freezes into ice when cold, and cools what it touches.',
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
    cls: 'organic',
    hardness: 0.1,
    ignition: 250,
    fuel: 240,
    flameTemp: 950,
    burnEnergy: 6,
    burnInto: 'smoke',
    name: 'Oil',
    blurb: 'A thick, slow liquid. Floats on water. Burns into smoke once hot enough.',
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
    cls: 'water',
    hardness: 0.2,
    name: 'Ice',
    blurb: 'Frozen water, a cold solid. Stays put. Chills what it touches and melts back into water as it warms.',
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
    cls: 'gas',
    hardness: 0,
    name: 'Steam',
    blurb: 'Hot water vapour. Rises and spreads. Turns back into water as it cools, so it rains.',
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
    cls: 'mineral',
    hardness: 0.5,
    name: 'Lava',
    blurb: 'Molten rock, extremely hot. Flows slowly and glows. Sets fuel alight, boils water, and cools into stone (or gravel where nothing holds it up).',
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
    cls: 'mineral',
    hardness: 0.85,
    name: 'Stone',
    blurb: 'Solid rock. Stays put. Glows as it heats and melts back into lava.',
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
    cls: 'mineral',
    hardness: 0.8,
    name: 'Gravel',
    blurb: 'Loose rock, a heavy powder. Falls and piles. Forms where lava sets with nothing under it, and melts back into lava.',
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
  {
    key: 'fire',
    name: 'Fire',
    blurb: 'Loose flames. Rise and burn out quickly. Light anything flammable they touch; a lasting fire needs fuel and air.',
    category: 'energy',
    colours: ['#fff1b0', '#ffd25a', '#ffaa2b', '#ff7a1a', '#e5481a', '#b8260f'],
    texture: 'fire',
    phase: 'energy',
    cls: 'energy',
    hardness: 0,
    density: 0.3,
    temp: 850,
    heatCapacity: 0.5,
    conductivity: 0.5,
  },
  {
    key: 'smoke',
    name: 'Smoke',
    blurb: 'What burning leaves behind, a warm gas. Rises and drifts off the top. Does not feed fire, so it smothers flames in a closed space.',
    category: 'gases',
    colours: ['#4a4b4e', '#3d3e41', '#56575a', '#36373a'],
    texture: 'gas',
    phase: 'gas',
    cls: 'gas',
    hardness: 0,
    density: 0.7,
    temp: 150,
    heatCapacity: 0.4,
    conductivity: 0.03,
    vents: true,
  },
  {
    key: 'wood',
    name: 'Wood',
    blurb: 'A solid fuel. Stays put. Catches fire where it touches air once hot enough, and burns down to a little ash.',
    category: 'solids',
    colours: ['#4a2f1a', '#5a3a20', '#6b4627', '#7a5230'],
    texture: 'stone',
    phase: 'solid',
    cls: 'organic',
    hardness: 0.3,
    density: 700,
    heatCapacity: 1.2,
    conductivity: 0.12,
    ignition: 300,
    fuel: 150,
    flameTemp: 800,
    burnEnergy: 10,
    burnInto: 'ash',
    residue: 0.15,
  },
  {
    key: 'ash',
    name: 'Ash',
    blurb: 'A very light powder left by fire. Drifts as it falls. Floats on water.',
    category: 'powders',
    colours: ['#8d8a86', '#a09d98', '#7b7874', '#b2afaa', '#96938e'],
    phase: 'powder',
    cls: 'mineral',
    hardness: 0.2,
    density: 600,
    fallAccel: 80,
    fallMax: 45,
    drift: 0.35,
    heatCapacity: 0.8,
    conductivity: 0.1,
  },
  {
    key: 'acid',
    name: 'Acid',
    blurb: 'A corrosive liquid. Flows like water. Eats metal, wood and soft rock and is used up as it does; metal gives off hydrogen.',
    category: 'liquids',
    colours: ['#b6f24a', '#8fd63a', '#6cb52e', '#4f8f22', '#3a6c19'],
    texture: 'liquid',
    phase: 'liquid',
    cls: 'water',
    hardness: 0,
    density: 1100,
    fallAccel: 230,
    fallMax: 160,
    dispersion: 6,
    heatCapacity: 0.9,
    conductivity: 0.3,
    acidity: 0.8,
  },
  {
    key: 'iron',
    name: 'Iron',
    blurb: 'A dense metal. Stays put and moves heat quickly. Acid eats it, giving off hydrogen.',
    category: 'solids',
    colours: ['#4c5258', '#59606a', '#666e78', '#737c86'],
    texture: 'stone',
    phase: 'solid',
    cls: 'metal',
    hardness: 0.55,
    electric: 1,
    density: 7870,
    heatCapacity: 0.45,
    conductivity: 0.8,
  },
  {
    key: 'hydrogen',
    name: 'Hydrogen',
    blurb: 'The lightest gas. Shoots upwards. Burns in a flash into steam when hot and touching air or oxygen.',
    category: 'gases',
    colours: ['#9fb8d6', '#b3c8e2', '#8eabcf', '#c3d4ea'],
    texture: 'gas',
    phase: 'gas',
    cls: 'gas',
    hardness: 0,
    density: 0.09,
    heatCapacity: 0.4,
    conductivity: 0.05,
    ignition: 500,
    fuel: 6,
    flameTemp: 1100,
    burnEnergy: 25,
    burnInto: 'steam',
  },
  {
    key: 'oxygen',
    name: 'Oxygen',
    blurb: 'A gas slightly heavier than air. Sinks and pools low. Makes fire burn hotter and use its fuel faster.',
    category: 'gases',
    colours: ['#8fc6d8', '#a3d3e2', '#7fb8cc', '#b5dde9'],
    texture: 'gas',
    phase: 'gas',
    cls: 'gas',
    hardness: 0,
    density: 1.43,
    heatCapacity: 0.4,
    conductivity: 0.03,
    oxidiser: 1,
  },
  {
    key: 'methane',
    name: 'Methane',
    blurb: 'Natural gas, lighter than air. Rises. Burns hot into steam when it meets heat and air.',
    category: 'gases',
    colours: ['#a7b39a', '#b7c2aa', '#98a58b', '#c4ceb8'],
    texture: 'gas',
    phase: 'gas',
    cls: 'gas',
    hardness: 0,
    density: 0.66,
    heatCapacity: 0.4,
    conductivity: 0.04,
    ignition: 540,
    fuel: 10,
    flameTemp: 1000,
    burnEnergy: 20,
    burnInto: 'steam',
  },
  {
    key: 'alcohol',
    name: 'Alcohol',
    blurb: 'A thin, light liquid. Floats on water. Catches fire easily and burns clean into steam.',
    category: 'liquids',
    colours: ['#dfeef5', '#c8e1ec', '#b2d2e1', '#9cc3d6', '#86b4cb'],
    texture: 'liquid',
    phase: 'liquid',
    cls: 'organic',
    hardness: 0,
    density: 789,
    fallAccel: 230,
    fallMax: 165,
    dispersion: 8,
    heatCapacity: 0.6,
    conductivity: 0.17,
    ignition: 365,
    fuel: 120,
    flameTemp: 750,
    burnInto: 'steam',
  },
  {
    key: 'sawdust',
    name: 'Sawdust',
    blurb: 'Fine wood dust, a very light powder. Drifts and floats on water. Catches fire easily and burns fast.',
    category: 'powders',
    colours: ['#c9a26b', '#b98f58', '#d6b27e', '#a87f4b', '#c29a63'],
    phase: 'powder',
    cls: 'organic',
    hardness: 0.1,
    porosity: 0.6,
    density: 250,
    fallAccel: 90,
    fallMax: 55,
    drift: 0.3,
    heatCapacity: 0.9,
    conductivity: 0.08,
    ignition: 260,
    fuel: 150,
    flameTemp: 750,
    burnInto: 'ash',
    residue: 0.2,
  },
  {
    key: 'salt',
    name: 'Salt',
    blurb: 'White crystals, a powder. Falls and piles. Dissolves into water, making it heavier; boiling the water leaves the salt behind.',
    category: 'powders',
    colours: ['#f2f0ea', '#e4e1d9', '#fbfaf6', '#d9d5cb', '#ebe8e0'],
    phase: 'powder',
    cls: 'salt',
    hardness: 0.25,
    solubility: 0.4,
    density: 2160,
    fallAccel: 230,
    fallMax: 160,
    heatCapacity: 0.6,
    conductivity: 0.2,
  },
  {
    key: 'sugar',
    name: 'Sugar',
    blurb: 'Sweet crystals, a powder. Falls and piles. Dissolves into water even more than salt does, and burns when hot.',
    category: 'powders',
    colours: ['#f7f3ea', '#efe8d8', '#fffcf4', '#e6ddca', '#f2ecdf'],
    phase: 'powder',
    cls: 'organic',
    hardness: 0.2,
    solubility: 0.7,
    density: 1590,
    fallAccel: 220,
    fallMax: 155,
    heatCapacity: 0.6,
    conductivity: 0.15,
    ignition: 350,
    fuel: 90,
    flameTemp: 700,
    burnInto: 'smoke',
    residue: 0.3,
  },
  {
    key: 'dirt',
    name: 'Dirt',
    blurb: 'Earth, a heavy powder. Falls and piles. Soaks up a lot of water and turns into dark, sticky mud.',
    category: 'powders',
    colours: ['#5b4330', '#6a4f38', '#4e3928', '#765a40', '#62482f'],
    phase: 'powder',
    cls: 'mineral',
    hardness: 0.3,
    porosity: 0.5,
    density: 1500,
    fallAccel: 230,
    fallMax: 160,
    heatCapacity: 0.8,
    conductivity: 0.12,
  },
  {
    key: 'snow',
    name: 'Snow',
    blurb: 'Loose frozen flakes, a very light powder. Drifts down and settles in soft piles. Melts into water as it warms.',
    category: 'powders',
    colours: ['#f4f8fb', '#e6eef4', '#ffffff', '#dbe6ee', '#edf3f8'],
    phase: 'powder',
    cls: 'water',
    hardness: 0.05,
    density: 300,
    fallAccel: 60,
    fallMax: 35,
    drift: 0.45,
    temp: -5,
    heatCapacity: 0.5,
    conductivity: 0.1,
    melt: 0,
    meltInto: 'water',
  },
  {
    key: 'tnt',
    name: 'TNT',
    blurb: 'A packed explosive block. Stays put. Heat or a flame sets it off: the whole block blasts outwards, throwing what is nearby.',
    category: 'explosives',
    colours: ['#b8322a', '#a52b24', '#c43a31', '#962620'],
    texture: 'stone',
    phase: 'solid',
    cls: 'organic',
    hardness: 0.3,
    density: 1650,
    heatCapacity: 0.8,
    conductivity: 0.1,
    ignition: 300,
    explosive: { power: 6, radius: 7 },
  },
  {
    key: 'gunpowder',
    name: 'Gunpowder',
    blurb: 'A dark explosive powder. Falls and piles. Lit, it goes off grain by grain in quick small bangs.',
    category: 'explosives',
    colours: ['#2b2a2a', '#3a3838', '#222121', '#454241', '#323030'],
    phase: 'powder',
    cls: 'organic',
    hardness: 0.2,
    density: 1700,
    fallAccel: 230,
    fallMax: 160,
    heatCapacity: 0.7,
    conductivity: 0.1,
    ignition: 250,
    explosive: { power: 3, radius: 2 },
  },
  {
    key: 'nitro',
    name: 'Nitro',
    blurb: 'An oily explosive liquid. Flows slowly. Goes off when heated, lit, or dropped hard.',
    category: 'explosives',
    colours: ['#d8e27a', '#c2cd5c', '#a8b447', '#8d9837', '#717a2b'],
    texture: 'liquid',
    phase: 'liquid',
    cls: 'organic',
    hardness: 0,
    density: 1600,
    fallAccel: 220,
    fallMax: 160,
    dispersion: 3,
    heatCapacity: 0.6,
    conductivity: 0.15,
    ignition: 200,
    explosive: { power: 14, radius: 6 },
    impact: 140,
  },
  {
    key: 'glass',
    name: 'Glass',
    blurb: 'A clear, brittle solid. Stays put and lets you see through it. Shatters into shards when a blast hits it.',
    category: 'solids',
    colours: ['#a9d6e5', '#bfe2ee', '#93c6d8', '#d2ecf4'],
    texture: 'glass',
    phase: 'solid',
    cls: 'mineral',
    hardness: 0.9,
    density: 2500,
    heatCapacity: 0.8,
    conductivity: 0.15,
    brittle: 3,
    breaksInto: 'shards',
  },
  {
    key: 'shards',
    name: 'Shards',
    blurb: 'Broken glass, a sharp powder. Falls and piles in glittering heaps.',
    category: 'powders',
    colours: ['#b6dfec', '#9ccfe0', '#d6eff6', '#86bfd3', '#c4e6f1'],
    phase: 'powder',
    cls: 'mineral',
    hardness: 0.9,
    density: 2500,
    fallAccel: 240,
    fallMax: 170,
    heatCapacity: 0.8,
    conductivity: 0.15,
  },
  {
    key: 'spark',
    name: 'Spark',
    blurb: 'A flash of electric charge. Jumps into any conductor it touches and runs along it; on its own it fades at once.',
    category: 'energy',
    colours: ['#f2f7ff', '#cfe0ff', '#a9c8ff', '#ffffff', '#e1ecff', '#bcd3ff'],
    texture: 'fire',
    phase: 'energy',
    cls: 'energy',
    hardness: 0,
    density: 0.1,
    temp: 300,
    heatCapacity: 0.2,
    conductivity: 0.3,
    lifetime: 10,
  },
  {
    key: 'wire',
    name: 'Wire',
    blurb: 'Thin copper. Stays put and carries charge from end to end, warming as current runs through it.',
    category: 'electronics',
    colours: ['#b8733a', '#c98447', '#a5652f', '#d99555'],
    texture: 'stone',
    phase: 'solid',
    cls: 'metal',
    hardness: 0.45,
    electric: 1,
    density: 8960,
    heatCapacity: 0.4,
    conductivity: 0.9,
    melt: 1085,
    meltInto: 'molten_copper',
  },
  {
    key: 'battery',
    name: 'Battery',
    blurb: 'A power source. Stays put and sends a pulse of charge into any conductor touching it, about four times a second.',
    category: 'electronics',
    colours: ['#3d4a3a', '#465543', '#354232', '#506048'],
    texture: 'stone',
    phase: 'solid',
    cls: 'metal',
    hardness: 0.6,
    density: 2500,
    heatCapacity: 0.8,
    conductivity: 0.2,
    powerEvery: 15,
  },
  {
    key: 'mercury',
    name: 'Mercury',
    blurb: 'A liquid metal, very heavy. Flows and sinks through almost everything. Carries charge like a wire.',
    category: 'liquids',
    colours: ['#c9ccd1', '#b2b6bc', '#9aa0a7', '#848a92', '#6f757d'],
    texture: 'liquid',
    phase: 'liquid',
    cls: 'metal',
    hardness: 0.9,
    electric: 1,
    density: 13534,
    fallAccel: 240,
    fallMax: 170,
    dispersion: 5,
    heatCapacity: 0.15,
    conductivity: 0.6,
  },
  {
    key: 'seed',
    name: 'Seed',
    blurb: 'A small seed, a light powder. Falls and rests. On wet dirt with open sky above it sprouts and grows into a plant.',
    category: 'life',
    colours: ['#9b7a3c', '#866630', '#b08c48', '#76592a'],
    phase: 'powder',
    cls: 'life',
    hardness: 0.2,
    density: 700,
    fallAccel: 200,
    fallMax: 140,
    heatCapacity: 0.8,
    conductivity: 0.1,
    ignition: 250,
    fuel: 60,
    flameTemp: 700,
    burnInto: 'ash',
    growsInto: 'plant',
  },
  {
    key: 'plant',
    name: 'Plant',
    blurb: 'A living green stem. Grows upwards towards open sky, drinking water from the dirt below. Burns, and acid eats it.',
    category: 'life',
    colours: ['#3f8f3a', '#4ea446', '#357a31', '#5cb553'],
    texture: 'stone',
    phase: 'solid',
    cls: 'organic',
    hardness: 0.15,
    density: 900,
    heatCapacity: 1,
    conductivity: 0.1,
    ignition: 250,
    fuel: 90,
    flameTemp: 750,
    burnInto: 'ash',
    residue: 0.4,
  },
  {
    key: 'molten_copper',
    name: 'Molten copper',
    blurb: 'Melted wire, bright and very hot. Flows and sinks through lighter liquids. Carries charge, sets fuel alight, and sets back into wire as it cools.',
    category: 'liquids',
    colours: ['#6a2a10', '#5a220c', '#7a3214', '#4c1c0a', '#3e1608'],
    texture: 'liquid',
    phase: 'liquid',
    cls: 'metal',
    hardness: 0.5,
    electric: 1,
    density: 8020,
    fallAccel: 200,
    fallMax: 140,
    dispersion: 3,
    temp: 1200,
    heatCapacity: 0.4,
    conductivity: 0.9,
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
      if ((B.phase !== 'liquid' && B.phase !== 'gas' && B.phase !== 'energy') || B.density >= A.density) continue;
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

// ---- Burning, gases, powders ------------------------------------------------

/** Lifetime of a placed cell in frames (a loose flame burns out); 0 = forever. */
export const LIFE_OF = Uint16Array.from(ELEMENTS, (e) => e.lifetime ?? (e.phase === 'energy' ? 45 : 0));
/** °C at which an element ignites next to an oxidiser; Infinity = never. */
export const IGNITION_OF = Float32Array.from(ELEMENTS, (e) => e.ignition ?? Infinity);
/** Frames one cell of an element burns. */
export const FUEL_OF = Uint16Array.from(ELEMENTS, (e) => e.fuel ?? 0);
/** °C the flame of an element reaches. */
export const FLAME_T_OF = Float32Array.from(ELEMENTS, (e) => e.flameTemp ?? 800);
/** °C a burning cell of an element pushes into each neighbour per frame. */
export const BURN_ENERGY_OF = Float32Array.from(ELEMENTS, (e) => e.burnEnergy ?? 3);
/** Chance (0..255) a burnt-out cell leaves its residue. */
export const RESIDUE_OF = Uint8Array.from(ELEMENTS, (e) => Math.round((e.residue ?? 1) * 255));
/** What a cell of an element leaves when it burns out. */
export const BURN_INTO_OF = Uint16Array.from(ELEMENTS, (e) => (e.burnInto ? elementId(e.burnInto) : 0));
/** Oxidiser strength, 0..1. Air (empty) is 0.21. */
export const OXIDISER_OF = Float32Array.from(ELEMENTS, (e) => e.oxidiser ?? 0);
/** Gases that leave the world at the top edge. */
export const VENTS_OF = Uint8Array.from(ELEMENTS, (e) => (e.vents ? 1 : 0));
/** Light powders: chance (0..255) per frame of drifting sideways while falling. */
export const DRIFT_OF = Uint8Array.from(ELEMENTS, (e) => Math.round((e.drift ?? 0) * 255));
/**
 * Gases: chance (0..255) per frame of moving with their buoyancy, and which
 * way: lighter than air rises, heavier sinks. Steam and hydrogen climb fast,
 * oxygen settles slowly.
 */
export const BUOY_P_OF = Uint8Array.from(ELEMENTS, (e) =>
  Math.round(Math.min(1, (Math.abs(ELEMENTS[0].density - e.density) / ELEMENTS[0].density) * 1.4) * 255),
);
export const BUOY_DIR_OF = Int8Array.from(ELEMENTS, (e) => (e.density < ELEMENTS[0].density ? -1 : 1));

// ---- Solutions -------------------------------------------------------------

/** One dissolved or absorbed cell adds this much concentration (0..255) to its host. */
export const CONC_UNIT = 48;
/** Liquids that dissolve soluble solids. */
export const SOLVENT_OF = Uint8Array.from(ELEMENTS, (e) => (e.solvent ? 1 : 0));
/** Most concentration (0..255) of an element one solvent cell can hold. */
export const SOLUBLE_MAX_OF = Uint8Array.from(ELEMENTS, (e) => Math.round((e.solubility ?? 0) * 255));
/** Most liquid (0..255) a porous powder soaks up. */
export const POROUS_MAX_OF = Uint8Array.from(ELEMENTS, (e) => Math.round((e.porosity ?? 0) * 255));

// ---- Air, explosives, brittle --------------------------------------------------

/** Blast power per cell of an explosive (0 = not explosive) and its radius in cells. */
export const BLAST_POWER_OF = Float32Array.from(ELEMENTS, (e) => e.explosive?.power ?? 0);
export const BLAST_RADIUS_OF = Uint8Array.from(ELEMENTS, (e) => e.explosive?.radius ?? 0);
/** Landing speed (vy units) that sets off a shock-sensitive explosive; 0 = never. */
export const IMPACT_VY_OF = Uint8Array.from(ELEMENTS, (e) => (e.impact ? Math.min(127, Math.round((e.impact / 60) * VY_UNIT)) : 0));
/** Air pressure that shatters a brittle solid; 0 = never. */
export const BRITTLE_OF = Float32Array.from(ELEMENTS, (e) => e.brittle ?? 0);
/** What a brittle solid shatters into. */
export const BREAKS_INTO_OF = Uint16Array.from(ELEMENTS, (e) => (e.breaksInto ? elementId(e.breaksInto) : 0));

// ---- Electricity and life -------------------------------------------------------

/** Conducts charge (0 = never; water is handled by its salt). */
export const ELECTRIC_OF = Uint8Array.from(ELEMENTS, (e) => ((e.electric ?? 0) > 0 ? 1 : 0));
/** Power sources: pulse period in frames, 0 = not a source. */
export const POWER_EVERY_OF = Uint8Array.from(ELEMENTS, (e) => e.powerEvery ?? 0);
/** Seeds: what they grow into, 0 = not a seed. */
export const GROWS_INTO_OF = Uint16Array.from(ELEMENTS, (e) => (e.growsInto ? elementId(e.growsInto) : 0));

/** What a solid becomes instead when it freezes unsupported; 0 = itself. */
export const RUBBLE_OF = Uint16Array.from(ELEMENTS, (e) => (e.rubble ? elementId(e.rubble) : 0));

/** Element id for a key. Throws on an unknown key. */
export function elementId(key: string): number {
  const id = ELEMENTS.findIndex((e) => e.key === key);
  if (id < 0) throw new Error(`Unknown element: ${key}`);
  return id;
}
