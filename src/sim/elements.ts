/**
 * Element catalogue. Elements are defined by physical properties; tables
 * for the hot loop are derived from them below. The schema grows with the
 * phases that use it (see docs/SPEC.md).
 */

export type Category =
  | 'powders'
  | 'liquids'
  | 'gases'
  | 'solids'
  | 'building'
  | 'metals'
  | 'fuels'
  | 'energy'
  | 'explosives'
  | 'electronics'
  | 'devices'
  | 'food'
  | 'life'
  | 'tools';
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
  /** °C added to both cells when it happens (heat released). */
  heat?: number;
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
  /**
   * Flash point, °C: above it, its vapour catches from a burning neighbour
   * wherever air reaches it, so a pool of fuel burns across its surface.
   * Unset: a neighbour must heat it all the way to `ignition`.
   */
  flash?: number;
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
  /** Seeds: grow into this element on damp soil with room above. */
  growsInto?: string;
  /** Living things: what a cell becomes when it has no water left (plant → dry plant). */
  witherInto?: string;
  /** Metals: slowly turns into this where water or oxygen touches it (iron → rust). */
  rustsInto?: string;
  /** Powders: water touching it is taken in and it hardens into this (cement → concrete). */
  setsInto?: string;
  /** °C both cells gain when it sets (quicklime gets hot enough to boil water). */
  setHeat?: number;
  /**
   * A one-way change by heat, with no reverse: past `at` °C it becomes
   * `into`, giving off `gas` above it if there is room (clay → brick,
   * limestone → quicklime and carbon dioxide).
   */
  bake?: { at: number; into: string; gas?: string };
  /** Gases: dissolving in water turns the water into this (sulfur dioxide → acid). */
  acidGas?: string;
  /** Kills living things it touches (they wither): poisonous gases, salt, bleach. */
  toxic?: boolean;
  /** Dead organic matter: slowly rots into this where water touches it. */
  rotsInto?: string;
  /** Carbonates: give off carbon dioxide when an acid eats or neutralises them. */
  carbonate?: boolean;
  /** Fuels that carry their own oxygen: burn with no air at all (thermite). */
  selfFed?: boolean;
  /** A flame alone cannot light it: it needs its full ignition heat, or a spark for explosives. */
  noFlame?: boolean;
  /** Seeds: about how many cells the plant grows (default 40). */
  growBudget?: number;
  /** Living things: leaves grow beside the stem as this element (tree → leaves); default the plant itself. */
  leafInto?: string;
  /** Living things: the last cell a stem grows becomes this (a flower). */
  topInto?: string;
  /** Living things: how fast it loses water to the air, 1 = a normal plant (a cactus is far less). */
  waterLoss?: number;
  /** Devices: keeps itself at this temperature (heater, cooler). */
  holdTemp?: number;
  /** Devices: copies the first element that touches it into the empty space around it. */
  clones?: boolean;
  /** Devices: deletes whatever touches it. */
  voids?: boolean;
  /** Devices: blows air this way, cells per frame (fan). */
  blows?: [number, number];
  /** Conductors: °C a pulse of current adds (a bulb filament heats until it glows). Default 4. */
  chargeHeat?: number;
  /** Devices: share of the gap to room temperature it loses each frame (a filament fades fast). */
  coolRate?: number;
  /** Clouds: drops this below now and then, or `rainsColdInto` when below 0 °C, and slowly runs dry. */
  rainsInto?: string;
  rainsColdInto?: string;
  /**
   * Creatures: where it lives and moves (swims in water, walks on ground,
   * digs through soil, flies in air), what it eats (eating makes it breed),
   * and what it becomes when it dies of heat, cold or leaving its habitat.
   * `eats` maps food to what the food becomes ('empty': eaten whole).
   */
  creature?: { lives: 'water' | 'ground' | 'soil' | 'air'; eats?: Record<string, string>; diesInto: string };
  /** Energy: strikes straight down at once as a jagged bolt, leaving this behind on its path (lightning → plasma). */
  bolt?: string;
  /** Fuels: lit, it does not burn but launches as this rocket (firework). */
  launchesAs?: string;
  /** Rockets: flies up, then bursts into this (embers). */
  burstsInto?: string;
  /** Flames that sink instead of rising (falling embers). */
  sinks?: boolean;
  /** Clouds: now and then a lightning bolt strikes down from it. */
  makesLightning?: boolean;
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
export const MOLTEN_COPPER = 36;
export const DRY_PLANT = 37;

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
    bake: { at: 1450, into: 'molten_glass' },
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
    overrides: {
      lava: { self: 'steam', other: 'obsidian', chance: 0.25, reason: 'Water chills the lava so fast that it sets into glassy obsidian, flashing into steam' },
    },
  },
  {
    key: 'oil',
    cls: 'organic',
    hardness: 0.1,
    ignition: 250,
    flash: 55,
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
    overrides: {
      water: { self: 'obsidian', other: 'steam', chance: 0.25, reason: 'Water chills the lava so fast that it sets into glassy obsidian' },
    },
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
    bake: { at: 400, into: 'charcoal', gas: 'smoke' },
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
    overrides: {
      bleach: { self: 'water', other: 'chlorine', chance: 0.3, reason: 'Acid and bleach release poisonous chlorine gas' },
    },
  },
  {
    key: 'iron',
    name: 'Iron',
    blurb: 'A dense metal. Stays put and moves heat quickly. Acid eats it, giving off hydrogen.',
    category: 'metals',
    colours: ['#4c5258', '#59606a', '#666e78', '#737c86'],
    texture: 'stone',
    phase: 'solid',
    cls: 'metal',
    hardness: 0.55,
    electric: 1,
    density: 7870,
    heatCapacity: 0.45,
    conductivity: 0.8,
    rustsInto: 'rust',
    melt: 1538,
    meltInto: 'molten_iron',
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
    overrides: {
      platinum: { self: 'steam', other: 'keep', chance: 0.1, heat: 300, reason: 'Platinum makes hydrogen catch and burn into steam on its surface' },
    },
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
    flash: 13,
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
    toxic: true,
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
    bake: { at: 186, into: 'caramel' },
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
    melt: 1400,
    meltInto: 'molten_glass',
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
    category: 'metals',
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
    blurb: 'A small seed, a light powder. Falls, sinks in water and rests. On damp soil (wet dirt or sand), it sprouts into a plant, even under a puddle.',
    category: 'life',
    colours: ['#9b7a3c', '#866630', '#b08c48', '#76592a'],
    phase: 'powder',
    cls: 'life',
    hardness: 0.2,
    density: 1100,
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
    blurb: 'A living green plant. Its roots drink from damp soil or water and pass it up the stem; it grows while it has water and puts out leaves. Dried out, it withers. Burns, and acid eats it.',
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
    witherInto: 'dry_plant',
    topInto: 'flower',
  },
  {
    key: 'molten_copper',
    name: 'Molten copper',
    blurb: 'Melted wire, bright and very hot. Flows and sinks through lighter liquids. Carries charge, sets fuel alight, and sets back into wire as it cools.',
    category: 'metals',
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
  {
    key: 'dry_plant',
    name: 'Dry plant',
    blurb: 'A plant that ran out of water, dry and brown. Stays put. Catches fire very easily and burns fast, leaving ash.',
    category: 'life',
    colours: ['#8a7a3e', '#9c8a48', '#76683a', '#a8945a'],
    texture: 'stone',
    phase: 'solid',
    cls: 'organic',
    hardness: 0.1,
    density: 300,
    heatCapacity: 0.8,
    conductivity: 0.08,
    ignition: 200,
    fuel: 40,
    flameTemp: 700,
    burnInto: 'ash',
    residue: 0.3,
    rotsInto: 'dirt',
  },
  // ---- Basics pack: building -------------------------------------------------------
  {
    key: 'clay',
    name: 'Clay',
    blurb: 'Fine, sticky earth, a heavy powder. Falls and piles, and soaks up water. Fired in great heat, it bakes hard into brick.',
    category: 'building',
    colours: ['#b5714a', '#a8653f', '#c07d55', '#9c5b38'],
    phase: 'powder',
    cls: 'mineral',
    hardness: 0.3,
    density: 1700,
    fallAccel: 210,
    fallMax: 150,
    heatCapacity: 0.9,
    conductivity: 0.15,
    porosity: 0.4,
    bake: { at: 900, into: 'brick' },
  },
  {
    key: 'brick',
    name: 'Brick',
    blurb: 'Fired clay, a solid block. Stays put and shrugs off heat. A strong blast breaks it into gravel.',
    category: 'building',
    colours: ['#8e3b2a', '#a0442f', '#7d3324', '#b04e36'],
    texture: 'stone',
    phase: 'solid',
    cls: 'mineral',
    hardness: 0.85,
    density: 1900,
    heatCapacity: 0.9,
    conductivity: 0.2,
    brittle: 4,
    breaksInto: 'gravel',
  },
  {
    key: 'cement',
    name: 'Cement',
    blurb: 'Grey building powder. Falls and piles. Water touching it is taken in, and it sets hard into concrete.',
    category: 'building',
    colours: ['#9a9a96', '#8e8e8a', '#a6a6a1', '#85857f'],
    phase: 'powder',
    cls: 'mineral',
    hardness: 0.4,
    density: 1440,
    fallAccel: 220,
    fallMax: 150,
    heatCapacity: 0.8,
    conductivity: 0.15,
    setsInto: 'concrete',
    setHeat: 15,
  },
  {
    key: 'concrete',
    name: 'Concrete',
    blurb: 'Set cement, a hard grey solid. Stays put. Acid eats it slowly, and a big blast cracks it into gravel.',
    category: 'building',
    colours: ['#7b7b77', '#878783', '#6f6f6b', '#93938e'],
    texture: 'stone',
    phase: 'solid',
    cls: 'mineral',
    hardness: 0.6,
    density: 2400,
    heatCapacity: 0.9,
    conductivity: 0.2,
    brittle: 5,
    breaksInto: 'gravel',
  },
  {
    key: 'limestone',
    name: 'Limestone',
    blurb: 'Pale sedimentary rock. Stays put. Acid fizzes it away into carbon dioxide, and great heat bakes it into quicklime.',
    category: 'building',
    colours: ['#cfc7b0', '#c4bba2', '#d9d2bd', '#b8af96'],
    texture: 'stone',
    phase: 'solid',
    cls: 'mineral',
    hardness: 0.4,
    density: 2700,
    heatCapacity: 0.9,
    conductivity: 0.25,
    carbonate: true,
    bake: { at: 900, into: 'quicklime', gas: 'carbon_dioxide' },
  },
  {
    key: 'quicklime',
    name: 'Quicklime',
    blurb: 'Burnt lime, a white caustic powder and a strong base. Falls and piles. Water makes it seethe into slaked lime, hot enough to boil.',
    category: 'building',
    colours: ['#eeece4', '#e3e0d6', '#f6f4ee', '#d8d5ca'],
    phase: 'powder',
    cls: 'mineral',
    hardness: 0.3,
    density: 1200,
    fallAccel: 210,
    fallMax: 150,
    heatCapacity: 0.8,
    conductivity: 0.15,
    acidity: -0.8,
    setsInto: 'slaked_lime',
    setHeat: 120,
  },
  {
    key: 'slaked_lime',
    name: 'Slaked lime',
    blurb: 'A soft white powder and a base. Falls and piles. It neutralises acids into water.',
    category: 'building',
    colours: ['#f2f1ea', '#e8e6dc', '#fbfaf5', '#dddbd0'],
    phase: 'powder',
    cls: 'mineral',
    hardness: 0.25,
    density: 1100,
    fallAccel: 200,
    fallMax: 140,
    heatCapacity: 0.8,
    conductivity: 0.15,
    acidity: -0.5,
  },
  // ---- Basics pack: metals ---------------------------------------------------------
  {
    key: 'gold',
    name: 'Gold',
    blurb: 'A soft, very heavy yellow metal. Stays put. Acid cannot touch it; it carries charge and heat superbly, and melts into molten gold.',
    category: 'metals',
    colours: ['#d4a72c', '#e6bc3c', '#c39522', '#f0cc55'],
    texture: 'stone',
    phase: 'solid',
    cls: 'metal',
    hardness: 0.95,
    electric: 1,
    density: 19300,
    heatCapacity: 0.13,
    conductivity: 1,
    melt: 1064,
    meltInto: 'molten_gold',
  },
  {
    key: 'molten_gold',
    name: 'Molten gold',
    blurb: 'Melted gold, glowing and very heavy. Flows and sinks through almost everything. Sets back into gold as it cools.',
    category: 'metals',
    colours: ['#6a3a10', '#5a300c', '#7a4414', '#4c280a'],
    texture: 'liquid',
    phase: 'liquid',
    cls: 'metal',
    hardness: 0.95,
    electric: 1,
    density: 17300,
    fallAccel: 240,
    fallMax: 170,
    dispersion: 4,
    temp: 1150,
    heatCapacity: 0.13,
    conductivity: 1,
  },
  {
    key: 'aluminium',
    name: 'Aluminium',
    blurb: 'A light silvery metal. Stays put. Acid eats it, giving off hydrogen, and it melts at a modest heat into molten aluminium.',
    category: 'metals',
    colours: ['#b9bec4', '#c8cdd2', '#aab0b6', '#d6dade'],
    texture: 'stone',
    phase: 'solid',
    cls: 'metal',
    hardness: 0.4,
    electric: 1,
    density: 2700,
    heatCapacity: 0.9,
    conductivity: 0.9,
    melt: 660,
    meltInto: 'molten_aluminium',
  },
  {
    key: 'molten_aluminium',
    name: 'Molten aluminium',
    blurb: 'Melted aluminium, dull red and runny. Flows and sinks through water. Sets back into aluminium as it cools.',
    category: 'metals',
    colours: ['#7d7873', '#6e6964', '#8a8580', '#625d58'],
    texture: 'liquid',
    phase: 'liquid',
    cls: 'metal',
    hardness: 0.4,
    electric: 1,
    density: 2375,
    fallAccel: 230,
    fallMax: 160,
    dispersion: 5,
    temp: 750,
    heatCapacity: 0.9,
    conductivity: 0.9,
  },
  {
    key: 'lead',
    name: 'Lead',
    blurb: 'A dull, very heavy grey metal. Stays put. It melts easily into molten lead, and acid eats it slowly.',
    category: 'metals',
    colours: ['#5d6168', '#676b72', '#53575d', '#71757c'],
    texture: 'stone',
    phase: 'solid',
    cls: 'metal',
    hardness: 0.6,
    electric: 1,
    density: 11340,
    heatCapacity: 0.13,
    conductivity: 0.35,
    melt: 327,
    meltInto: 'molten_lead',
  },
  {
    key: 'molten_lead',
    name: 'Molten lead',
    blurb: 'Melted lead, hot and very heavy. Flows and sinks through almost everything. Sets back into lead as it cools.',
    category: 'metals',
    colours: ['#8a8d92', '#7e8186', '#969a9e', '#73767b'],
    texture: 'liquid',
    phase: 'liquid',
    cls: 'metal',
    hardness: 0.6,
    electric: 1,
    density: 10660,
    fallAccel: 240,
    fallMax: 170,
    dispersion: 5,
    temp: 400,
    heatCapacity: 0.13,
    conductivity: 0.35,
  },
  {
    key: 'rust',
    name: 'Rust',
    blurb: 'Flaky red iron oxide, a powder. Falls and piles. It forms where water or oxygen slowly eats at iron.',
    category: 'metals',
    colours: ['#8b3f1d', '#9c4a24', '#7a3517', '#ad5630'],
    phase: 'powder',
    cls: 'mineral',
    hardness: 0.3,
    density: 2000,
    fallAccel: 230,
    fallMax: 160,
    heatCapacity: 0.65,
    conductivity: 0.1,
  },
  {
    key: 'sodium',
    name: 'Sodium',
    blurb: 'A soft, light silvery metal. Stays put. Water touching it makes it fizz violently into lye and burning hydrogen.',
    category: 'metals',
    colours: ['#c9cdd0', '#d6d9dc', '#babfc3', '#e1e4e6'],
    texture: 'stone',
    phase: 'solid',
    cls: 'metal',
    hardness: 0.1,
    electric: 1,
    density: 968,
    heatCapacity: 1.2,
    conductivity: 0.6,
    overrides: {
      water: {
        self: 'hydrogen',
        other: 'lye',
        chance: 0.3,
        heat: 520,
        reason: 'Sodium reacts violently with water: it becomes lye and hydrogen, hot enough to set the hydrogen alight',
      },
    },
  },
  // ---- Basics pack: fuels ----------------------------------------------------------
  {
    key: 'coal',
    name: 'Coal',
    blurb: 'Black lumps of fossil fuel, a heavy powder. Falls and piles. Hard to light, but once going it burns hot for a very long time.',
    category: 'fuels',
    colours: ['#1c1c1e', '#26262a', '#141416', '#2f2f33'],
    phase: 'powder',
    cls: 'mineral',
    hardness: 0.85,
    density: 1350,
    fallAccel: 230,
    fallMax: 165,
    heatCapacity: 0.7,
    conductivity: 0.15,
    ignition: 450,
    fuel: 900,
    flameTemp: 1100,
    burnEnergy: 9,
    burnInto: 'ash',
    residue: 0.4,
  },
  {
    key: 'charcoal',
    name: 'Charcoal',
    blurb: 'Charred wood, a light black powder. Falls and piles. It catches more easily than coal and glows hot for a long time.',
    category: 'fuels',
    colours: ['#2a2522', '#332d29', '#211d1a', '#3b3430'],
    phase: 'powder',
    cls: 'mineral',
    hardness: 0.85,
    density: 400,
    fallAccel: 150,
    fallMax: 100,
    heatCapacity: 0.7,
    conductivity: 0.1,
    ignition: 350,
    fuel: 500,
    flameTemp: 1000,
    burnEnergy: 7,
    burnInto: 'ash',
    residue: 0.2,
  },
  {
    key: 'sulfur',
    name: 'Sulfur',
    blurb: 'Yellow crystals, a powder. Falls and piles. It burns with a blue flame into choking sulfur dioxide.',
    category: 'fuels',
    colours: ['#e6d23a', '#d9c42c', '#f0de4c', '#cbb622'],
    phase: 'powder',
    cls: 'mineral',
    hardness: 0.9,
    density: 2000,
    fallAccel: 230,
    fallMax: 160,
    heatCapacity: 0.7,
    conductivity: 0.1,
    ignition: 232,
    fuel: 90,
    flameTemp: 900,
    burnInto: 'sulfur_dioxide',
  },
  {
    key: 'petrol',
    name: 'Petrol',
    blurb: 'A thin, volatile fuel. Flows freely and floats on water. Its vapour catches from the smallest flame, so a pool goes up at once.',
    category: 'fuels',
    colours: ['#d8c98a', '#cbb978', '#bfac66', '#b29f58'],
    texture: 'liquid',
    phase: 'liquid',
    cls: 'organic',
    hardness: 0,
    density: 740,
    fallAccel: 230,
    fallMax: 165,
    dispersion: 8,
    heatCapacity: 0.5,
    conductivity: 0.12,
    ignition: 280,
    flash: -43,
    fuel: 60,
    flameTemp: 1000,
    burnEnergy: 8,
    burnInto: 'empty',
  },
  {
    key: 'wax',
    name: 'Wax',
    blurb: 'Soft, pale wax. Stays put. It melts at a gentle heat into molten wax and burns slowly, like a candle.',
    category: 'fuels',
    colours: ['#efe6c8', '#e6dcbb', '#f5eed6', '#ddd2ad'],
    texture: 'stone',
    phase: 'solid',
    cls: 'organic',
    hardness: 0.2,
    density: 900,
    heatCapacity: 1,
    conductivity: 0.08,
    melt: 60,
    meltInto: 'molten_wax',
    ignition: 300,
    fuel: 300,
    flameTemp: 900,
    burnInto: 'empty',
  },
  {
    key: 'molten_wax',
    name: 'Molten wax',
    blurb: 'Melted wax, warm and runny. Flows and floats on water. It sets back into wax as it cools, and burns once it gets hot.',
    category: 'fuels',
    colours: ['#f2e2a8', '#e8d694', '#dcc980', '#cfbb6d'],
    texture: 'liquid',
    phase: 'liquid',
    cls: 'organic',
    hardness: 0,
    density: 800,
    fallAccel: 200,
    fallMax: 120,
    dispersion: 3,
    temp: 80,
    heatCapacity: 1,
    conductivity: 0.08,
    ignition: 300,
    flash: 200,
    fuel: 200,
    flameTemp: 900,
    burnInto: 'empty',
  },
  {
    key: 'paper',
    name: 'Paper',
    blurb: 'Thin sheets of wood pulp. Stays put. It catches at the lightest flame and burns up quickly into ash.',
    category: 'fuels',
    colours: ['#f4f1e8', '#ece8dc', '#faf8f2', '#e3dece'],
    texture: 'stone',
    phase: 'solid',
    cls: 'organic',
    hardness: 0.05,
    density: 700,
    heatCapacity: 1,
    conductivity: 0.05,
    ignition: 233,
    fuel: 40,
    flameTemp: 800,
    burnEnergy: 15,
    burnInto: 'ash',
    residue: 0.5,
    rotsInto: 'dirt',
  },
  {
    key: 'rubber',
    name: 'Rubber',
    blurb: 'Tough black rubber. Stays put and never carries charge. Hard to light, but it burns long and hot.',
    category: 'fuels',
    colours: ['#2b2b2e', '#333337', '#242427', '#3c3c40'],
    texture: 'stone',
    phase: 'solid',
    cls: 'organic',
    hardness: 0.4,
    density: 1100,
    heatCapacity: 1.2,
    conductivity: 0.05,
    ignition: 400,
    fuel: 400,
    flameTemp: 1000,
    burnEnergy: 6,
    burnInto: 'ash',
    residue: 0.3,
  },
  {
    key: 'flour',
    name: 'Flour',
    blurb: 'Fine white powder, very light. Drifts as it falls. It catches easily and burns fast where air reaches it, but soaks up water into a paste that will not burn.',
    category: 'food',
    colours: ['#f3ecdc', '#ebe2cf', '#f8f3e7', '#e2d8c2'],
    phase: 'powder',
    cls: 'organic',
    hardness: 0.1,
    density: 600,
    fallAccel: 120,
    fallMax: 70,
    drift: 0.2,
    heatCapacity: 0.8,
    conductivity: 0.08,
    ignition: 380,
    flash: 50,
    fuel: 20,
    flameTemp: 900,
    burnEnergy: 5,
    burnInto: 'ash',
    residue: 0.1,
    porosity: 0.3,
  },
  {
    key: 'thermite',
    name: 'Thermite',
    blurb: 'A grey-red metal powder that carries its own oxygen. Falls and piles. A flame will not light it, but great heat does, and it burns white-hot with no air, leaving iron.',
    category: 'fuels',
    colours: ['#6b4d42', '#5c4038', '#7a5a4d', '#4f362e'],
    phase: 'powder',
    cls: 'mineral',
    hardness: 0.9,
    density: 1500,
    fallAccel: 230,
    fallMax: 160,
    heatCapacity: 0.6,
    conductivity: 0.1,
    ignition: 900,
    noFlame: true,
    selfFed: true,
    fuel: 120,
    flameTemp: 2500,
    burnEnergy: 40,
    burnInto: 'iron',
    residue: 0.5,
  },
  // ---- Basics pack: liquids --------------------------------------------------------
  {
    key: 'honey',
    name: 'Honey',
    blurb: 'Thick golden syrup. Oozes very slowly and sinks through water. Sticky and sweet; it does not burn.',
    category: 'food',
    colours: ['#d9931c', '#c98418', '#b87412', '#a6650e'],
    texture: 'liquid',
    phase: 'liquid',
    cls: 'organic',
    hardness: 0,
    density: 1420,
    fallAccel: 120,
    fallMax: 40,
    dispersion: 1,
    heatCapacity: 0.6,
    conductivity: 0.15,
  },
  {
    key: 'vinegar',
    name: 'Vinegar',
    blurb: 'A weak acid, mostly water. Flows like water. Too weak to eat metal, but it fizzes with baking soda and neutralises bases.',
    category: 'liquids',
    colours: ['#d9d3b8', '#cdc6a8', '#c1b998', '#b5ac88'],
    texture: 'liquid',
    phase: 'liquid',
    cls: 'water',
    hardness: 0,
    density: 1010,
    fallAccel: 230,
    fallMax: 165,
    dispersion: 8,
    heatCapacity: 1,
    conductivity: 0.3,
    acidity: 0.25,
    overrides: {
      bleach: { self: 'water', other: 'chlorine', chance: 0.3, reason: 'Vinegar and bleach release poisonous chlorine gas' },
    },
  },
  {
    key: 'bleach',
    name: 'Bleach',
    blurb: 'A strong cleaning base. Flows like water. Mixed with any acid it gives off poisonous chlorine gas.',
    category: 'liquids',
    colours: ['#e9f1d7', '#dde7c8', '#d1ddb9', '#c5d3aa'],
    texture: 'liquid',
    phase: 'liquid',
    cls: 'water',
    hardness: 0,
    density: 1100,
    fallAccel: 230,
    fallMax: 165,
    dispersion: 7,
    heatCapacity: 0.9,
    conductivity: 0.3,
    acidity: -0.7,
    overrides: {
      acid: { self: 'chlorine', other: 'water', chance: 0.3, reason: 'Bleach and acid release poisonous chlorine gas' },
      vinegar: { self: 'chlorine', other: 'water', chance: 0.3, reason: 'Bleach and vinegar release poisonous chlorine gas' },
    },
    toxic: true,
  },
  {
    key: 'lye',
    name: 'Lye',
    blurb: 'A caustic alkaline liquid. Flows like water. It neutralises acid into water, warming as it does.',
    category: 'liquids',
    colours: ['#b9cbd6', '#a9bcc9', '#9aaebb', '#8ba0ad'],
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
    acidity: -0.9,
  },
  {
    key: 'liquid_nitrogen',
    name: 'Liquid nitrogen',
    blurb: 'Nitrogen cooled to a liquid, bitterly cold. Flows and boils away fast into nitrogen gas, freezing whatever it touches.',
    category: 'liquids',
    colours: ['#d4ecf7', '#c3e1f0', '#b2d6e8', '#a1cbe0'],
    texture: 'liquid',
    phase: 'liquid',
    cls: 'gas',
    hardness: 0,
    density: 808,
    fallAccel: 230,
    fallMax: 165,
    dispersion: 8,
    temp: -196,
    heatCapacity: 1,
    conductivity: 0.15,
    boil: -196,
    boilInto: 'nitrogen',
  },
  // ---- Basics pack: gases ----------------------------------------------------------
  {
    key: 'nitrogen',
    name: 'Nitrogen',
    blurb: 'The inert gas that makes up most of air. Drifts slowly upwards. It feeds no fire, so it smothers flames it surrounds.',
    category: 'gases',
    colours: ['#c8d2e6', '#bcc6da', '#d4def0'],
    texture: 'gas',
    phase: 'gas',
    cls: 'gas',
    hardness: 0,
    density: 1.17,
    heatCapacity: 0.4,
    conductivity: 0.03,
  },
  {
    key: 'carbon_dioxide',
    name: 'Carbon dioxide',
    blurb: 'A heavy, colourless gas. Sinks and pools low like water. It feeds no fire, so it smothers flames; cooled hard it freezes into dry ice.',
    category: 'gases',
    colours: ['#b8bcc0', '#aeb2b6', '#c2c6ca'],
    texture: 'gas',
    phase: 'gas',
    cls: 'gas',
    hardness: 0,
    density: 1.98,
    heatCapacity: 0.4,
    conductivity: 0.03,
  },
  {
    key: 'helium',
    name: 'Helium',
    blurb: 'A very light, inert gas. Rises fast and gathers at the top. It never burns or reacts.',
    category: 'gases',
    colours: ['#e8d8e8', '#dccbdc', '#f2e6f2'],
    texture: 'gas',
    phase: 'gas',
    cls: 'gas',
    hardness: 0,
    density: 0.18,
    heatCapacity: 0.5,
    conductivity: 0.15,
  },
  {
    key: 'propane',
    name: 'Propane',
    blurb: 'A fuel gas, heavier than air. Sinks and pools in low places. Its vapour catches from any flame and burns hot into steam.',
    category: 'gases',
    colours: ['#d7e0c8', '#cbd5ba', '#e2ead4'],
    texture: 'gas',
    phase: 'gas',
    cls: 'gas',
    hardness: 0,
    density: 1.88,
    heatCapacity: 0.4,
    conductivity: 0.04,
    ignition: 470,
    flash: -104,
    fuel: 12,
    flameTemp: 1100,
    burnEnergy: 20,
    burnInto: 'steam',
  },
  {
    key: 'chlorine',
    name: 'Chlorine',
    blurb: 'A poisonous yellow-green gas, very heavy. Sinks and pools low. It kills plants and turns water it touches into acid.',
    category: 'gases',
    colours: ['#c6d86a', '#b9cc5c', '#d2e27a'],
    texture: 'gas',
    phase: 'gas',
    cls: 'gas',
    hardness: 0,
    density: 3.2,
    heatCapacity: 0.4,
    conductivity: 0.03,
    toxic: true,
    acidGas: 'acid',
  },
  {
    key: 'sulfur_dioxide',
    name: 'Sulfur dioxide',
    blurb: 'A choking gas, much heavier than air. Sinks and pools low. It turns water it touches into acid and kills plants.',
    category: 'gases',
    colours: ['#c9c08a', '#bdb37a', '#d4cc99'],
    texture: 'gas',
    phase: 'gas',
    cls: 'gas',
    hardness: 0,
    density: 2.6,
    heatCapacity: 0.4,
    conductivity: 0.03,
    toxic: true,
    acidGas: 'acid',
  },
  // ---- Basics pack: cold, powders, explosives --------------------------------------
  {
    key: 'dry_ice',
    name: 'Dry ice',
    blurb: 'Frozen carbon dioxide, very cold. Stays put and turns straight into gas without melting, chilling everything nearby.',
    category: 'solids',
    colours: ['#eef3f6', '#e2e9ee', '#f7fafc', '#d6dfe5'],
    texture: 'stone',
    phase: 'solid',
    cls: 'gas',
    hardness: 0.3,
    density: 1560,
    temp: -79,
    heatCapacity: 0.8,
    conductivity: 0.15,
    boil: -78,
    boilInto: 'carbon_dioxide',
  },
  {
    key: 'baking_soda',
    name: 'Baking soda',
    blurb: 'A mild white powder and a base. Falls and piles. Acid makes it fizz into carbon dioxide, and it dissolves a little in water.',
    category: 'powders',
    colours: ['#f4f4f0', '#eaeae4', '#fbfbf8', '#e0e0d8'],
    phase: 'powder',
    cls: 'salt',
    hardness: 0.25,
    density: 1100,
    fallAccel: 220,
    fallMax: 150,
    heatCapacity: 0.6,
    conductivity: 0.15,
    acidity: -0.3,
    carbonate: true,
    solubility: 0.2,
  },
  {
    key: 'c4',
    name: 'C4',
    blurb: 'A putty-like plastic explosive. Stays put. A flame alone will not set it off, but a spark or great heat does, with a huge blast.',
    category: 'explosives',
    colours: ['#d9d2b4', '#cfc7a5', '#e2dcc2', '#c4bc98'],
    texture: 'stone',
    phase: 'solid',
    cls: 'organic',
    hardness: 0.3,
    density: 1600,
    heatCapacity: 0.8,
    conductivity: 0.1,
    ignition: 900,
    noFlame: true,
    explosive: { power: 14, radius: 6 },
  },
  // ---- Life pack -------------------------------------------------------------------
  {
    key: 'grass_seed',
    name: 'Grass seed',
    blurb: 'Tiny pale seeds, a light powder. Falls and sinks in water. On damp soil it sprouts into a short tuft of grass.',
    category: 'life',
    colours: ['#c9c27a', '#b8b068', '#d6cf8a', '#a9a05a'],
    phase: 'powder',
    cls: 'life',
    hardness: 0.2,
    density: 1100,
    fallAccel: 180,
    fallMax: 120,
    heatCapacity: 0.8,
    conductivity: 0.1,
    ignition: 250,
    fuel: 40,
    flameTemp: 700,
    burnInto: 'ash',
    growsInto: 'grass',
    growBudget: 6,
  },
  {
    key: 'grass',
    name: 'Grass',
    blurb: 'Short living blades. Stays put and drinks from damp soil. Dried out it withers into dry plant, and it burns easily.',
    category: 'life',
    colours: ['#5aa83f', '#6bbd4a', '#4e9636', '#79c957'],
    texture: 'stone',
    phase: 'solid',
    cls: 'organic',
    hardness: 0.1,
    density: 600,
    heatCapacity: 1,
    conductivity: 0.1,
    ignition: 220,
    fuel: 40,
    flameTemp: 700,
    burnInto: 'ash',
    residue: 0.3,
    witherInto: 'dry_plant',
  },
  {
    key: 'acorn',
    name: 'Acorn',
    blurb: 'A heavy brown seed, a powder. Falls and sinks in water. On damp soil it sprouts into a tall, branching tree.',
    category: 'life',
    colours: ['#7a5326', '#8c6230', '#694620', '#9a6e3a'],
    phase: 'powder',
    cls: 'life',
    hardness: 0.3,
    density: 1100,
    fallAccel: 220,
    fallMax: 150,
    heatCapacity: 0.8,
    conductivity: 0.1,
    ignition: 260,
    fuel: 60,
    flameTemp: 700,
    burnInto: 'ash',
    growsInto: 'tree',
    growBudget: 90,
  },
  {
    key: 'tree',
    name: 'Tree',
    blurb: 'A living woody trunk. Grows tall and branches, drinking from damp soil and putting out leaves. Dead and dry, it is plain wood.',
    category: 'life',
    colours: ['#5b3d24', '#6b4a2c', '#4d331e', '#7a5634'],
    texture: 'stone',
    phase: 'solid',
    cls: 'organic',
    hardness: 0.3,
    density: 750,
    heatCapacity: 1.2,
    conductivity: 0.12,
    ignition: 300,
    fuel: 150,
    flameTemp: 800,
    burnEnergy: 10,
    burnInto: 'ash',
    residue: 0.15,
    witherInto: 'wood',
    leafInto: 'leaves',
    topInto: 'leaves',
  },
  {
    key: 'leaves',
    name: 'Leaves',
    blurb: 'Living green leaves on a tree. Stay put and take water from the branch. Dried out they wither, and they burn easily.',
    category: 'life',
    colours: ['#2f7a34', '#3a8c3e', '#27682c', '#46a04a'],
    phase: 'solid',
    cls: 'organic',
    hardness: 0.1,
    density: 500,
    heatCapacity: 1,
    conductivity: 0.08,
    ignition: 230,
    fuel: 30,
    flameTemp: 700,
    burnInto: 'ash',
    residue: 0.2,
    witherInto: 'dry_plant',
  },
  {
    key: 'flower',
    name: 'Flower',
    blurb: 'A bright bloom at the tip of a plant. Stays put and takes water from the stem. Dried out it withers, and it burns easily.',
    category: 'life',
    colours: ['#e86fa1', '#f2c94c', '#d9483b', '#a77fe0', '#f4f1ea'],
    phase: 'solid',
    cls: 'organic',
    hardness: 0.1,
    density: 400,
    heatCapacity: 1,
    conductivity: 0.08,
    ignition: 220,
    fuel: 20,
    flameTemp: 700,
    burnInto: 'ash',
    residue: 0.2,
    witherInto: 'dry_plant',
  },
  {
    key: 'cloud',
    name: 'Cloud',
    blurb: 'A drifting mass of droplets, a gas. Rises slowly and spreads. It rains, or snows when below freezing, until it runs dry.',
    category: 'gases',
    colours: ['#d9dde2', '#cdd2d8', '#e6e9ec'],
    texture: 'gas',
    phase: 'gas',
    cls: 'water',
    hardness: 0,
    density: 1.1,
    heatCapacity: 0.5,
    conductivity: 0.04,
    rainsInto: 'water',
    rainsColdInto: 'snow',
    makesLightning: true,
  },
  // ---- Devices ---------------------------------------------------------------------
  {
    key: 'heater',
    name: 'Heater',
    blurb: 'A hot plate. Stays put and holds itself at a steady high heat, warming whatever touches it.',
    category: 'devices',
    colours: ['#6b2a20', '#7a3125', '#5e241b', '#88392b'],
    texture: 'stone',
    phase: 'solid',
    cls: 'mineral',
    hardness: 1,
    density: 3000,
    heatCapacity: 2,
    conductivity: 0.9,
    holdTemp: 300,
  },
  {
    key: 'cooler',
    name: 'Cooler',
    blurb: 'A cold plate. Stays put and holds itself far below freezing, chilling whatever touches it.',
    category: 'devices',
    colours: ['#24425e', '#2a4c6b', '#1f3a53', '#315677'],
    texture: 'stone',
    phase: 'solid',
    cls: 'mineral',
    hardness: 1,
    density: 3000,
    heatCapacity: 2,
    conductivity: 0.9,
    holdTemp: -60,
  },
  {
    key: 'clone',
    name: 'Clone',
    blurb: 'A copying block. Stays put. It learns the first element that touches it and keeps making more of it in the space around.',
    category: 'devices',
    colours: ['#8a7428', '#9c8430', '#7a6622', '#ad9438'],
    texture: 'stone',
    phase: 'solid',
    cls: 'mineral',
    hardness: 1,
    density: 3000,
    heatCapacity: 1,
    conductivity: 0.1,
    clones: true,
  },
  {
    key: 'void',
    name: 'Void',
    blurb: 'A hole in the world. Stays put and deletes anything that touches it, except walls and other devices.',
    category: 'devices',
    colours: ['#120e18', '#18121f', '#0d0a12', '#1e1726'],
    texture: 'stone',
    phase: 'solid',
    cls: 'mineral',
    hardness: 1,
    density: 3000,
    heatCapacity: 1,
    conductivity: 0.02,
    voids: true,
  },
  {
    key: 'fan',
    name: 'Fan',
    blurb: 'A blower. Stays put and pushes a steady stream of air upwards, lifting gases, flames and light powders.',
    category: 'devices',
    colours: ['#3d4148', '#464b53', '#353940', '#50555e'],
    texture: 'stone',
    phase: 'solid',
    cls: 'mineral',
    hardness: 1,
    density: 3000,
    heatCapacity: 1,
    conductivity: 0.2,
    blows: [0, -3],
  },
  {
    key: 'bulb',
    name: 'Bulb',
    blurb: 'A light bulb filament. Stays put and carries charge; current heats it until it glows, and it fades when the power stops.',
    category: 'electronics',
    colours: ['#4a4436', '#554e3e', '#403a2e', '#5e5746'],
    texture: 'stone',
    phase: 'solid',
    cls: 'mineral',
    hardness: 1,
    electric: 1,
    density: 3000,
    heatCapacity: 0.2,
    conductivity: 0.05,
    chargeHeat: 400,
    coolRate: 0.04,
  },
  // ---- More metals and minerals ----------------------------------------------------
  {
    key: 'magnesium',
    name: 'Magnesium',
    blurb: 'A light silvery metal. Stays put. Once very hot it burns with a blinding white flame, hot enough to set off thermite.',
    category: 'metals',
    colours: ['#c4c6c9', '#d0d2d5', '#b6b8bc', '#dcdee0'],
    texture: 'stone',
    phase: 'solid',
    cls: 'metal',
    hardness: 0.35,
    electric: 1,
    density: 1740,
    heatCapacity: 1,
    conductivity: 0.8,
    ignition: 650,
    fuel: 120,
    flameTemp: 3000,
    burnEnergy: 30,
    burnInto: 'ash',
    residue: 0.6,
  },
  {
    key: 'potassium',
    name: 'Potassium',
    blurb: 'A very soft, light metal. Stays put. Water touching it makes it burst into lye and burning hydrogen, even more fiercely than sodium.',
    category: 'metals',
    colours: ['#b8b4c4', '#c6c2d1', '#a9a5b6', '#d2cfdc'],
    texture: 'stone',
    phase: 'solid',
    cls: 'metal',
    hardness: 0.05,
    electric: 1,
    density: 862,
    heatCapacity: 0.8,
    conductivity: 0.5,
    overrides: {
      water: {
        self: 'hydrogen',
        other: 'lye',
        chance: 0.6,
        heat: 700,
        reason: 'Potassium bursts in water: it becomes lye and hydrogen, hot enough to set the hydrogen alight',
      },
    },
  },
  {
    key: 'caramel',
    name: 'Caramel',
    blurb: 'Melted, browned sugar. Oozes very slowly. It burns once it gets very hot.',
    category: 'food',
    colours: ['#9a5a1c', '#8a4f16', '#7a4412', '#b06a24'],
    texture: 'liquid',
    phase: 'liquid',
    cls: 'organic',
    hardness: 0,
    density: 1300,
    fallAccel: 100,
    fallMax: 30,
    dispersion: 1,
    temp: 190,
    heatCapacity: 0.6,
    conductivity: 0.15,
    ignition: 400,
    fuel: 200,
    flameTemp: 900,
    burnInto: 'ash',
    residue: 0.3,
  },
  {
    key: 'marble',
    name: 'Marble',
    blurb: 'Polished white rock, a carbonate. Stays put. Acid fizzes it away into carbon dioxide, and great heat bakes it into quicklime.',
    category: 'building',
    colours: ['#e4e2dc', '#d8d5ce', '#eeece7', '#cbc7bf'],
    texture: 'stone',
    phase: 'solid',
    cls: 'mineral',
    hardness: 0.5,
    density: 2700,
    heatCapacity: 0.9,
    conductivity: 0.3,
    carbonate: true,
    bake: { at: 900, into: 'quicklime', gas: 'carbon_dioxide' },
  },
  {
    key: 'chalk',
    name: 'Chalk',
    blurb: 'Soft white carbonate, a powder. Falls and piles. Acid fizzes it away into carbon dioxide.',
    category: 'powders',
    colours: ['#f1efe8', '#e7e4db', '#f8f7f2', '#dcd9ce'],
    phase: 'powder',
    cls: 'mineral',
    hardness: 0.2,
    density: 1500,
    fallAccel: 210,
    fallMax: 150,
    heatCapacity: 0.8,
    conductivity: 0.12,
    carbonate: true,
  },
  // ---- Batch 3: molten forms, food, materials --------------------------------------
  {
    key: 'liquid_oxygen',
    name: 'Liquid oxygen',
    blurb: 'Oxygen cooled to a pale blue liquid, bitterly cold. Flows and boils away into oxygen. A fuel it soaks burns with ferocious heat.',
    category: 'liquids',
    colours: ['#a9cdf0', '#9bc2ea', '#8db6e3', '#7faadb'],
    texture: 'liquid',
    phase: 'liquid',
    cls: 'gas',
    hardness: 0,
    density: 1141,
    fallAccel: 230,
    fallMax: 165,
    dispersion: 8,
    temp: -183,
    heatCapacity: 1,
    conductivity: 0.15,
    oxidiser: 1,
    boil: -183,
    boilInto: 'oxygen',
  },
  {
    key: 'molten_iron',
    name: 'Molten iron',
    blurb: 'Melted iron, white-hot and heavy. Flows and sinks through water and rock. Sets back into iron as it cools.',
    category: 'metals',
    colours: ['#6e2e10', '#5e270c', '#7e3614', '#50200a'],
    texture: 'liquid',
    phase: 'liquid',
    cls: 'metal',
    hardness: 0.55,
    electric: 1,
    density: 6980,
    fallAccel: 230,
    fallMax: 160,
    dispersion: 3,
    temp: 1600,
    heatCapacity: 0.45,
    conductivity: 0.8,
  },
  {
    key: 'molten_glass',
    name: 'Molten glass',
    blurb: 'Melted sand, glowing and thick. Oozes slowly. As it cools it sets into clear glass.',
    category: 'liquids',
    colours: ['#7a4a18', '#6a3f14', '#8a5520', '#5a3410'],
    texture: 'liquid',
    phase: 'liquid',
    cls: 'mineral',
    hardness: 0.9,
    density: 2400,
    fallAccel: 120,
    fallMax: 40,
    dispersion: 1,
    temp: 1450,
    heatCapacity: 0.8,
    conductivity: 0.15,
  },
  {
    key: 'silver',
    name: 'Silver',
    blurb: 'A bright, heavy white metal. Stays put. It carries charge and heat better than any other metal, and melts into molten silver.',
    category: 'metals',
    colours: ['#c8ccd2', '#d6dae0', '#bbc0c7', '#e4e7eb'],
    texture: 'stone',
    phase: 'solid',
    cls: 'metal',
    hardness: 0.9,
    electric: 1,
    density: 10490,
    heatCapacity: 0.24,
    conductivity: 1,
    melt: 962,
    meltInto: 'molten_silver',
  },
  {
    key: 'molten_silver',
    name: 'Molten silver',
    blurb: 'Melted silver, glowing and heavy. Flows and sinks through almost everything. Sets back into silver as it cools.',
    category: 'metals',
    colours: ['#6a3a1a', '#5a3216', '#7a4420', '#4c2a12'],
    texture: 'liquid',
    phase: 'liquid',
    cls: 'metal',
    hardness: 0.9,
    electric: 1,
    density: 9320,
    fallAccel: 240,
    fallMax: 170,
    dispersion: 4,
    temp: 1000,
    heatCapacity: 0.24,
    conductivity: 1,
  },
  {
    key: 'meat',
    name: 'Meat',
    blurb: 'Raw red meat. Stays put. Warm it and it cooks; left in water it slowly rots.',
    category: 'food',
    colours: ['#b8434a', '#c9525a', '#a33a40', '#d6646b'],
    texture: 'stone',
    phase: 'solid',
    cls: 'organic',
    hardness: 0.2,
    density: 1050,
    heatCapacity: 1.2,
    conductivity: 0.1,
    bake: { at: 70, into: 'cooked_meat' },
    rotsInto: 'dirt',
  },
  {
    key: 'cooked_meat',
    name: 'Cooked meat',
    blurb: 'Browned, cooked meat. Stays put. Overdone it chars into charcoal, and in open air it burns.',
    category: 'food',
    colours: ['#7a4a2e', '#8a5636', '#6a3e26', '#9a6240'],
    texture: 'stone',
    phase: 'solid',
    cls: 'organic',
    hardness: 0.2,
    density: 1000,
    heatCapacity: 1.2,
    conductivity: 0.1,
    bake: { at: 250, into: 'charcoal' },
    ignition: 300,
    fuel: 200,
    flameTemp: 800,
    burnInto: 'ash',
    residue: 0.3,
    rotsInto: 'dirt',
  },
  {
    key: 'popcorn_kernel',
    name: 'Popcorn kernel',
    blurb: 'Hard yellow kernels, a powder. Falls and piles. Heat them and they pop into light, fluffy popcorn.',
    category: 'food',
    colours: ['#d9a63c', '#c99632', '#e6b44a', '#b8862a'],
    phase: 'powder',
    cls: 'organic',
    hardness: 0.3,
    density: 1200,
    fallAccel: 220,
    fallMax: 150,
    heatCapacity: 0.8,
    conductivity: 0.1,
    bake: { at: 180, into: 'popcorn' },
  },
  {
    key: 'popcorn',
    name: 'Popcorn',
    blurb: 'Popped corn, a very light powder. Drifts down softly and floats on water. It burns easily.',
    category: 'food',
    colours: ['#f6efd9', '#fbf6e6', '#efe4c4', '#f2e7c9'],
    phase: 'powder',
    cls: 'organic',
    hardness: 0.05,
    density: 50,
    fallAccel: 60,
    fallMax: 35,
    drift: 0.4,
    heatCapacity: 0.8,
    conductivity: 0.05,
    ignition: 300,
    fuel: 30,
    flameTemp: 700,
    burnInto: 'ash',
    residue: 0.2,
  },
  {
    key: 'tar',
    name: 'Tar',
    blurb: 'Thick black pitch. Creeps along very slowly and sinks through water. Hard to light, but it burns for a long time.',
    category: 'fuels',
    colours: ['#141210', '#1b1815', '#100e0c', '#221f1b'],
    texture: 'liquid',
    phase: 'liquid',
    cls: 'organic',
    hardness: 0,
    density: 1150,
    fallAccel: 80,
    fallMax: 25,
    dispersion: 1,
    heatCapacity: 0.9,
    conductivity: 0.1,
    ignition: 320,
    flash: 200,
    fuel: 600,
    flameTemp: 900,
    burnInto: 'ash',
    residue: 0.2,
  },
  {
    key: 'plastic',
    name: 'Plastic',
    blurb: 'A hard, bright synthetic. Stays put and shrugs off acid. It melts at a modest heat into molten plastic and burns with thick smoke.',
    category: 'solids',
    colours: ['#d84a4a', '#3f7fd9', '#e6c63a', '#4caf50'],
    phase: 'solid',
    cls: 'organic',
    hardness: 0.9,
    density: 950,
    heatCapacity: 1.2,
    conductivity: 0.05,
    melt: 160,
    meltInto: 'molten_plastic',
    ignition: 350,
    fuel: 200,
    flameTemp: 900,
    burnInto: 'ash',
    residue: 0.2,
  },
  {
    key: 'molten_plastic',
    name: 'Molten plastic',
    blurb: 'Melted plastic, a hot sticky goo. Oozes slowly and floats on water. Sets back into plastic as it cools, and burns if it gets hotter.',
    category: 'liquids',
    colours: ['#8a5a4a', '#7a5044', '#9a6656', '#6a463c'],
    texture: 'liquid',
    phase: 'liquid',
    cls: 'organic',
    hardness: 0.9,
    density: 900,
    fallAccel: 120,
    fallMax: 40,
    dispersion: 1,
    temp: 200,
    heatCapacity: 1.2,
    conductivity: 0.05,
    ignition: 350,
    fuel: 200,
    flameTemp: 900,
    burnInto: 'ash',
    residue: 0.2,
  },
  {
    key: 'pumice',
    name: 'Pumice',
    blurb: 'Light, bubbly volcanic rock, a powder. Falls and piles, yet floats on water. It soaks up water into its pores.',
    category: 'powders',
    colours: ['#a8a39a', '#b6b1a8', '#9a958c', '#c2bdb4'],
    phase: 'powder',
    cls: 'mineral',
    hardness: 0.6,
    density: 640,
    fallAccel: 180,
    fallMax: 120,
    heatCapacity: 0.8,
    conductivity: 0.1,
    porosity: 0.3,
  },
  {
    key: 'obsidian',
    name: 'Obsidian',
    blurb: 'Black volcanic glass, formed where water chills lava fast. Stays put. A blast shatters it into sharp shards, and great heat melts it back into lava.',
    category: 'solids',
    colours: ['#15141a', '#1c1b22', '#101015', '#24232b'],
    texture: 'glass',
    phase: 'solid',
    cls: 'mineral',
    hardness: 0.9,
    density: 2400,
    heatCapacity: 0.8,
    conductivity: 0.2,
    melt: 1000,
    meltInto: 'lava',
    brittle: 4,
    breaksInto: 'shards',
  },
  {
    key: 'diamond',
    name: 'Diamond',
    blurb: 'Pure crystal carbon, the hardest thing there is. Stays put and moves heat superbly. In great heat it burns away into carbon dioxide.',
    category: 'solids',
    colours: ['#dff4fb', '#c9ecf7', '#f0fbfe', '#b6e3f2'],
    texture: 'glass',
    phase: 'solid',
    cls: 'mineral',
    hardness: 1,
    density: 3510,
    heatCapacity: 0.5,
    conductivity: 1,
    ignition: 900,
    fuel: 300,
    flameTemp: 1200,
    burnInto: 'carbon_dioxide',
  },
  {
    key: 'napalm',
    name: 'Napalm',
    blurb: 'A sticky fuel gel. Oozes slowly and floats on water. Its vapour catches at once, and it burns fiercely for a long time, even on water.',
    category: 'fuels',
    colours: ['#b8742a', '#a86824', '#c88032', '#985c1e'],
    texture: 'liquid',
    phase: 'liquid',
    cls: 'organic',
    hardness: 0,
    density: 900,
    fallAccel: 120,
    fallMax: 40,
    dispersion: 1,
    heatCapacity: 0.6,
    conductivity: 0.1,
    ignition: 250,
    flash: -10,
    fuel: 900,
    flameTemp: 1100,
    burnEnergy: 12,
    burnInto: 'ash',
    residue: 0.1,
  },
  {
    key: 'hydrogen_peroxide',
    name: 'Hydrogen peroxide',
    blurb: 'A pale blue liquid that carries spare oxygen. Flows and sinks through water. It feeds fire, and breaks down into water and oxygen when heated or on rust.',
    category: 'liquids',
    colours: ['#cfe3f2', '#bfd7ea', '#afcbe1', '#9fbfd8'],
    texture: 'liquid',
    phase: 'liquid',
    cls: 'water',
    hardness: 0,
    density: 1450,
    fallAccel: 230,
    fallMax: 160,
    dispersion: 6,
    heatCapacity: 0.6,
    conductivity: 0.3,
    oxidiser: 0.8,
    bake: { at: 150, into: 'water', gas: 'oxygen' },
    overrides: {
      rust: { self: 'oxygen', other: 'keep', chance: 0.2, reason: 'Rust speeds up peroxide breaking down: it fizzes into oxygen' },
    },
  },
  // ---- Creatures -------------------------------------------------------------------
  {
    key: 'fish',
    name: 'Fish',
    blurb: 'A small fish. Swims about in water, eating seeds that sink to it and breeding when fed. Out of water it suffocates; heat or cold kill it.',
    category: 'life',
    colours: ['#e8833a', '#f09a4c', '#d9732e', '#f4b06a'],
    phase: 'solid',
    cls: 'organic',
    hardness: 0.1,
    density: 1000,
    heatCapacity: 1,
    conductivity: 0.1,
    ignition: 300,
    fuel: 60,
    flameTemp: 700,
    burnInto: 'ash',
    creature: { lives: 'water', eats: { seed: 'empty', grass_seed: 'empty', acorn: 'empty', ant: 'empty' }, diesInto: 'meat' },
  },
  {
    key: 'ant',
    name: 'Ant',
    blurb: 'A busy little ant. Walks over the ground and climbs steps, eating anything sweet or meaty and breeding when fed. Water drowns it; heat or cold kill it.',
    category: 'life',
    colours: ['#3a1f1a', '#2a1712', '#4a2820', '#1f110d'],
    phase: 'solid',
    cls: 'organic',
    hardness: 0.1,
    density: 1000,
    heatCapacity: 1,
    conductivity: 0.1,
    ignition: 200,
    fuel: 10,
    flameTemp: 600,
    burnInto: 'ash',
    creature: {
      lives: 'ground',
      eats: { sugar: 'empty', honey: 'empty', caramel: 'empty', flour: 'empty', meat: 'empty', cooked_meat: 'empty', popcorn: 'empty', chocolate: 'empty' },
      diesInto: 'dirt',
    },
  },
  {
    key: 'worm',
    name: 'Worm',
    blurb: 'An earthworm. Digs through soil, turning dead plants, paper and ash into rich dirt, and breeds as it eats. Dried out above ground, it dies.',
    category: 'life',
    colours: ['#c98b8b', '#b87a7a', '#d69c9c', '#a86b6b'],
    phase: 'solid',
    cls: 'organic',
    hardness: 0.1,
    density: 1050,
    heatCapacity: 1,
    conductivity: 0.1,
    creature: { lives: 'soil', eats: { dry_plant: 'dirt', paper: 'dirt', ash: 'dirt' }, diesInto: 'dirt' },
  },
  {
    key: 'bird',
    name: 'Bird',
    blurb: 'A small bird. Flies about in the open air, eating seeds and ants and breeding when fed. Water drowns it; heat or cold kill it.',
    category: 'life',
    colours: ['#6b5a4a', '#8a7560', '#5a4a3c', '#9c8670'],
    phase: 'solid',
    cls: 'organic',
    hardness: 0.1,
    density: 1000,
    heatCapacity: 1,
    conductivity: 0.1,
    ignition: 300,
    fuel: 60,
    flameTemp: 700,
    burnInto: 'ash',
    creature: {
      lives: 'air',
      eats: { seed: 'empty', grass_seed: 'empty', acorn: 'empty', ant: 'empty', bee: 'empty', spider: 'empty', termite: 'empty', snail: 'empty', popcorn_kernel: 'empty', popcorn: 'empty' },
      diesInto: 'meat',
    },
  },
  // ---- Sky: lightning and fireworks ------------------------------------------------
  {
    key: 'lightning',
    name: 'Lightning',
    blurb: 'A bolt of lightning. Strikes straight down at once in a jagged line. Where it lands it pours in heat, lights flames and sends current through anything that conducts.',
    category: 'energy',
    colours: ['#f4f0ff', '#e6dcff', '#fbf9ff'],
    texture: 'fire',
    phase: 'energy',
    cls: 'energy',
    hardness: 0,
    density: 0.1,
    temp: 3000,
    heatCapacity: 0.2,
    conductivity: 0.3,
    bolt: 'plasma',
  },
  {
    key: 'plasma',
    name: 'Plasma',
    blurb: 'Glowing, electrified air left by lightning. Flickers out in a moment. It lights anything flammable it touches.',
    category: 'energy',
    colours: ['#d9ccff', '#c7b5ff', '#efe8ff'],
    texture: 'fire',
    phase: 'energy',
    cls: 'energy',
    hardness: 0,
    density: 0.1,
    temp: 3000,
    heatCapacity: 0.2,
    conductivity: 0.3,
    lifetime: 8,
  },
  {
    key: 'firework',
    name: 'Firework',
    blurb: 'A packed firework powder. Falls and piles. A flame or heat launches each grain as a rocket that bursts high up into falling coloured embers.',
    category: 'explosives',
    colours: ['#b8352f', '#2f6db8', '#d9a62f', '#3a9a4a'],
    phase: 'powder',
    cls: 'organic',
    hardness: 0.2,
    density: 1400,
    fallAccel: 220,
    fallMax: 150,
    heatCapacity: 0.7,
    conductivity: 0.1,
    ignition: 250,
    fuel: 10,
    launchesAs: 'rocket',
  },
  {
    key: 'rocket',
    name: 'Rocket',
    blurb: 'A lit firework climbing fast. Rises in a straight line, trailing sparks, then bursts into embers.',
    category: 'energy',
    colours: ['#ffd27a', '#ffe2a3', '#ffc35a'],
    texture: 'fire',
    phase: 'energy',
    cls: 'energy',
    hardness: 0,
    density: 0.5,
    temp: 900,
    heatCapacity: 0.3,
    conductivity: 0.2,
    lifetime: 75,
    burstsInto: 'ember',
  },
  {
    key: 'ember',
    name: 'Ember',
    blurb: 'A bright burning fleck from a firework. Drifts down, swaying, and burns out. It can still light what it lands on.',
    category: 'energy',
    colours: ['#ff5a5a', '#5aff8a', '#5ab4ff', '#ffd95a', '#ff7ae0'],
    phase: 'energy',
    cls: 'energy',
    hardness: 0,
    density: 0.3,
    temp: 700,
    heatCapacity: 0.3,
    conductivity: 0.2,
    lifetime: 50,
    sinks: true,
  },
  // ---- Batch 6: oxidisers, metals, solvents, insects -------------------------------
  {
    key: 'saltpeter',
    name: 'Saltpeter',
    blurb: 'White crystals that carry oxygen, a powder. Falls and piles, and dissolves in water. Fuel touching it burns fiercely.',
    category: 'powders',
    colours: ['#eeeae2', '#e3ded4', '#f6f3ee', '#d8d2c6'],
    phase: 'powder',
    cls: 'salt',
    hardness: 0.25,
    density: 2100,
    fallAccel: 230,
    fallMax: 160,
    heatCapacity: 0.6,
    conductivity: 0.15,
    oxidiser: 0.9,
    solubility: 0.3,
  },
  {
    key: 'tin',
    name: 'Tin',
    blurb: 'A soft silvery metal. Stays put. It melts at a low heat into molten tin, and acid eats it, giving off hydrogen.',
    category: 'metals',
    colours: ['#b4b7ba', '#c2c5c8', '#a7aaae', '#cfd2d4'],
    texture: 'stone',
    phase: 'solid',
    cls: 'metal',
    hardness: 0.3,
    electric: 1,
    density: 7300,
    heatCapacity: 0.23,
    conductivity: 0.6,
    melt: 232,
    meltInto: 'molten_tin',
  },
  {
    key: 'molten_tin',
    name: 'Molten tin',
    blurb: 'Melted tin, bright and runny. Flows and sinks through water. Sets back into tin as it cools.',
    category: 'metals',
    colours: ['#9a9da2', '#8c8f94', '#a8abb0', '#7e8186'],
    texture: 'liquid',
    phase: 'liquid',
    cls: 'metal',
    hardness: 0.3,
    electric: 1,
    density: 6990,
    fallAccel: 230,
    fallMax: 160,
    dispersion: 5,
    temp: 260,
    heatCapacity: 0.23,
    conductivity: 0.6,
  },
  {
    key: 'steel',
    name: 'Steel',
    blurb: 'Hard iron alloy. Stays put. Acid eats it slowly and water rusts it; in great heat it melts into molten iron.',
    category: 'metals',
    colours: ['#7d8590', '#8a929c', '#707883', '#979fa9'],
    texture: 'stone',
    phase: 'solid',
    cls: 'metal',
    hardness: 0.75,
    electric: 1,
    density: 7850,
    heatCapacity: 0.45,
    conductivity: 0.5,
    melt: 1500,
    meltInto: 'molten_iron',
    rustsInto: 'rust',
  },
  {
    key: 'zinc',
    name: 'Zinc',
    blurb: 'A bluish-grey metal. Stays put and carries charge. Acid fizzes it away, giving off hydrogen.',
    category: 'metals',
    colours: ['#8e9aa3', '#9ba7b0', '#818d96', '#a8b4bd'],
    texture: 'stone',
    phase: 'solid',
    cls: 'metal',
    hardness: 0.3,
    electric: 1,
    density: 7140,
    heatCapacity: 0.39,
    conductivity: 0.6,
  },
  {
    key: 'kerosene',
    name: 'Kerosene',
    blurb: 'A clear lamp fuel. Flows and floats on water. Once warm its vapour catches easily, and it burns steadily.',
    category: 'fuels',
    colours: ['#e8e2c4', '#ddd6b4', '#d2caa4', '#c7be94'],
    texture: 'liquid',
    phase: 'liquid',
    cls: 'organic',
    hardness: 0,
    density: 800,
    fallAccel: 230,
    fallMax: 165,
    dispersion: 7,
    heatCapacity: 0.5,
    conductivity: 0.12,
    ignition: 220,
    flash: 38,
    fuel: 120,
    flameTemp: 1000,
    burnEnergy: 7,
    burnInto: 'empty',
  },
  {
    key: 'acetone',
    name: 'Acetone',
    blurb: 'A sharp-smelling solvent. Flows thin and floats on water. It dissolves plastic, and its vapour catches from the smallest flame.',
    category: 'liquids',
    colours: ['#e6eef2', '#d8e3e9', '#cad8e0', '#bccdd6'],
    texture: 'liquid',
    phase: 'liquid',
    cls: 'organic',
    hardness: 0,
    density: 784,
    fallAccel: 230,
    fallMax: 165,
    dispersion: 8,
    heatCapacity: 0.5,
    conductivity: 0.15,
    ignition: 465,
    flash: -20,
    fuel: 40,
    flameTemp: 900,
    burnInto: 'empty',
    overrides: {
      plastic: { self: 'keep', other: 'empty', chance: 0.05, reason: 'Acetone dissolves plastic' },
    },
  },
  {
    key: 'hail',
    name: 'Hail',
    blurb: 'Hard balls of ice, a heavy powder. Falls fast and bounces into piles. Melts into water as it warms.',
    category: 'powders',
    colours: ['#e2eef6', '#d4e6f2', '#eef6fb', '#c6dded'],
    phase: 'powder',
    cls: 'water',
    hardness: 0.2,
    density: 900,
    fallAccel: 240,
    fallMax: 180,
    temp: -5,
    heatCapacity: 0.5,
    conductivity: 0.4,
    melt: 0,
    meltInto: 'water',
  },
  {
    key: 'uranium',
    name: 'Uranium',
    blurb: 'A dense, radioactive metal. Stays put and keeps itself hot from its own decay, glowing dull red. It poisons living things it touches.',
    category: 'metals',
    colours: ['#5c6b4a', '#667656', '#525f42', '#71815f'],
    texture: 'stone',
    phase: 'solid',
    cls: 'metal',
    hardness: 0.6,
    electric: 1,
    density: 19050,
    heatCapacity: 0.12,
    conductivity: 0.3,
    holdTemp: 450,
    toxic: true,
  },
  {
    key: 'bee',
    name: 'Bee',
    blurb: 'A buzzing bee. Flies about, visiting flowers and turning them into seeds, and breeds when it finds honey. Water drowns it; heat or cold kill it.',
    category: 'life',
    colours: ['#e6b522', '#2a2418', '#d9a61a', '#f2c63a'],
    phase: 'solid',
    cls: 'organic',
    hardness: 0.1,
    density: 1000,
    heatCapacity: 1,
    conductivity: 0.1,
    ignition: 200,
    fuel: 10,
    flameTemp: 600,
    burnInto: 'ash',
    creature: { lives: 'air', eats: { flower: 'seed', honey: 'empty' }, diesInto: 'dirt' },
  },
  {
    key: 'spider',
    name: 'Spider',
    blurb: 'A hunting spider. Walks over the ground and climbs steps, catching ants, bees and termites, and breeds when fed. Water drowns it; heat or cold kill it.',
    category: 'life',
    colours: ['#3a3633', '#2e2a28', '#47423e', '#24211f'],
    phase: 'solid',
    cls: 'organic',
    hardness: 0.1,
    density: 1000,
    heatCapacity: 1,
    conductivity: 0.1,
    ignition: 200,
    fuel: 10,
    flameTemp: 600,
    burnInto: 'ash',
    creature: { lives: 'ground', eats: { ant: 'empty', bee: 'empty', termite: 'empty' }, diesInto: 'dirt' },
  },
  {
    key: 'termite',
    name: 'Termite',
    blurb: 'A pale wood-eating insect. Walks over the ground, chewing wood and trees into sawdust and eating the sawdust, breeding as it eats. Water drowns it.',
    category: 'life',
    colours: ['#e8dcc4', '#ddd0b4', '#f0e6d2', '#c9b896'],
    phase: 'solid',
    cls: 'organic',
    hardness: 0.1,
    density: 1000,
    heatCapacity: 1,
    conductivity: 0.1,
    ignition: 200,
    fuel: 10,
    flameTemp: 600,
    burnInto: 'ash',
    creature: { lives: 'ground', eats: { wood: 'sawdust', tree: 'sawdust', sawdust: 'empty', paper: 'empty', dry_plant: 'empty' }, diesInto: 'dirt' },
  },
  // ---- Batch 7: food web and more chemicals ----------------------------------------
  {
    key: 'snail',
    name: 'Snail',
    blurb: 'A slow garden snail. Creeps over the ground, grazing plants, leaves, grass and flowers, and breeds as it eats. Water drowns it; heat or cold kill it.',
    category: 'life',
    colours: ['#8a6a4a', '#9c7c58', '#7a5c3e', '#c4b08a'],
    phase: 'solid',
    cls: 'organic',
    hardness: 0.2,
    density: 1100,
    heatCapacity: 1,
    conductivity: 0.1,
    creature: { lives: 'ground', eats: { plant: 'empty', leaves: 'empty', grass: 'empty', flower: 'empty' }, diesInto: 'dirt' },
  },
  {
    key: 'frog',
    name: 'Frog',
    blurb: 'A small green frog. Hops over the ground catching ants, bees, spiders, termites and snails, and breeds when fed. Water drowns it; heat or cold kill it.',
    category: 'life',
    colours: ['#4f8a3a', '#5e9c46', '#437a30', '#6aa852'],
    phase: 'solid',
    cls: 'organic',
    hardness: 0.1,
    density: 1000,
    heatCapacity: 1,
    conductivity: 0.1,
    ignition: 300,
    fuel: 40,
    flameTemp: 700,
    burnInto: 'ash',
    creature: { lives: 'ground', eats: { ant: 'empty', bee: 'empty', spider: 'empty', termite: 'empty', snail: 'empty' }, diesInto: 'meat' },
  },
  {
    key: 'mouse',
    name: 'Mouse',
    blurb: 'A quick little mouse. Runs over the ground eating seeds, flour, popcorn, chocolate and cooked meat, and breeds when fed. Water drowns it; heat or cold kill it.',
    category: 'life',
    colours: ['#8a8078', '#9a9088', '#7a7068', '#aaa098'],
    phase: 'solid',
    cls: 'organic',
    hardness: 0.1,
    density: 1000,
    heatCapacity: 1,
    conductivity: 0.1,
    ignition: 300,
    fuel: 60,
    flameTemp: 700,
    burnInto: 'ash',
    creature: {
      lives: 'ground',
      eats: { seed: 'empty', grass_seed: 'empty', acorn: 'empty', flour: 'empty', popcorn: 'empty', popcorn_kernel: 'empty', chocolate: 'empty', cooked_meat: 'empty' },
      diesInto: 'meat',
    },
  },
  {
    key: 'snake',
    name: 'Snake',
    blurb: 'A hunting snake. Slides over the ground catching mice and frogs, and breeds when fed. Water drowns it; heat or cold kill it.',
    category: 'life',
    colours: ['#5a6a2e', '#6a7a38', '#4a5a26', '#8a7a3a'],
    phase: 'solid',
    cls: 'organic',
    hardness: 0.15,
    density: 1000,
    heatCapacity: 1,
    conductivity: 0.1,
    ignition: 300,
    fuel: 60,
    flameTemp: 700,
    burnInto: 'ash',
    creature: { lives: 'ground', eats: { mouse: 'empty', frog: 'empty', egg: 'empty' }, diesInto: 'meat' },
  },
  {
    key: 'ammonia',
    name: 'Ammonia',
    blurb: 'A sharp, choking gas and a base, lighter than air. Rises and spreads. It neutralises acid it touches into water, and kills plants.',
    category: 'gases',
    colours: ['#dde6c8', '#d2dcba', '#e8efd6'],
    texture: 'gas',
    phase: 'gas',
    cls: 'gas',
    hardness: 0,
    density: 0.73,
    heatCapacity: 0.4,
    conductivity: 0.03,
    acidity: -0.6,
    toxic: true,
  },
  {
    key: 'ozone',
    name: 'Ozone',
    blurb: 'A pale blue gas of energised oxygen, heavier than air. Sinks slowly. It feeds fire even more fiercely than oxygen and poisons living things.',
    category: 'gases',
    colours: ['#b8cff2', '#a9c4ee', '#c8daf6'],
    texture: 'gas',
    phase: 'gas',
    cls: 'gas',
    hardness: 0,
    density: 2.14,
    heatCapacity: 0.4,
    conductivity: 0.03,
    oxidiser: 1,
    toxic: true,
  },
  {
    key: 'cotton',
    name: 'Cotton',
    blurb: 'Soft white fibre, a very light powder. Drifts as it falls and soaks up a lot of water. Dry, it catches fast and burns quickly.',
    category: 'fuels',
    colours: ['#f7f5ef', '#efece4', '#fbfaf6', '#e6e2d8'],
    phase: 'powder',
    cls: 'organic',
    hardness: 0.05,
    density: 150,
    fallAccel: 60,
    fallMax: 35,
    drift: 0.35,
    heatCapacity: 1,
    conductivity: 0.04,
    ignition: 255,
    flash: 60,
    fuel: 40,
    flameTemp: 800,
    burnInto: 'ash',
    residue: 0.2,
    porosity: 0.6,
  },
  {
    key: 'chocolate',
    name: 'Chocolate',
    blurb: 'A dark, sweet block. Stays put. A little warmth melts it into molten chocolate.',
    category: 'food',
    colours: ['#4a2a1a', '#5a3420', '#3e2214', '#6a4028'],
    texture: 'stone',
    phase: 'solid',
    cls: 'organic',
    hardness: 0.2,
    density: 1300,
    heatCapacity: 1,
    conductivity: 0.1,
    melt: 35,
    meltInto: 'molten_chocolate',
  },
  {
    key: 'molten_chocolate',
    name: 'Molten chocolate',
    blurb: 'Melted chocolate, a thick sweet sauce. Oozes slowly and sinks through water. Sets back into chocolate as it cools.',
    category: 'food',
    colours: ['#5a3420', '#4e2c1a', '#663c26', '#42241a'],
    texture: 'liquid',
    phase: 'liquid',
    cls: 'organic',
    hardness: 0,
    density: 1250,
    fallAccel: 120,
    fallMax: 40,
    dispersion: 1,
    temp: 45,
    heatCapacity: 1,
    conductivity: 0.1,
  },
  // ---- Batch 8: reactive chemistry and food ----------------------------------------
  {
    key: 'egg',
    name: 'Egg',
    blurb: 'A raw egg. Stays put. Warm it and it cooks; left in water it slowly rots.',
    category: 'food',
    colours: ['#f2ead8', '#e8dec8', '#f8f2e6', '#ddd2b8'],
    texture: 'stone',
    phase: 'solid',
    cls: 'organic',
    hardness: 0.2,
    density: 1030,
    heatCapacity: 1.1,
    conductivity: 0.1,
    bake: { at: 70, into: 'cooked_egg' },
    rotsInto: 'dirt',
  },
  {
    key: 'cooked_egg',
    name: 'Cooked egg',
    blurb: 'A cooked egg, white and yellow. Stays put. Overdone it chars into charcoal; left in water it slowly rots.',
    category: 'food',
    colours: ['#f6f2e8', '#f2c94c', '#ece6d6', '#e9b93a'],
    phase: 'solid',
    cls: 'organic',
    hardness: 0.2,
    density: 1000,
    heatCapacity: 1.1,
    conductivity: 0.1,
    bake: { at: 250, into: 'charcoal' },
    rotsInto: 'dirt',
  },
  {
    key: 'phosphorus',
    name: 'Phosphorus',
    blurb: 'Waxy white phosphorus. Stays put. In barely warm air it bursts into flame by itself, so it is kept under water, where it is safe.',
    category: 'fuels',
    colours: ['#efe7b8', '#e6dca6', '#f5efca', '#ddd196'],
    texture: 'stone',
    phase: 'solid',
    cls: 'mineral',
    hardness: 0.9,
    density: 1820,
    heatCapacity: 0.8,
    conductivity: 0.1,
    ignition: 30,
    fuel: 60,
    flameTemp: 900,
    burnEnergy: 6,
    burnInto: 'smoke',
  },
  {
    key: 'lithium',
    name: 'Lithium',
    blurb: 'The lightest metal, soft and silvery. Stays put. Water touching it fizzes steadily into lye and hydrogen, more gently than sodium.',
    category: 'metals',
    colours: ['#b9bcbf', '#c6c9cc', '#acafb3', '#d2d5d8'],
    texture: 'stone',
    phase: 'solid',
    cls: 'metal',
    hardness: 0.1,
    electric: 1,
    density: 534,
    heatCapacity: 1.4,
    conductivity: 0.6,
    overrides: {
      water: { self: 'hydrogen', other: 'lye', chance: 0.08, heat: 150, reason: 'Lithium reacts steadily with water, making lye and hydrogen' },
    },
  },
  {
    key: 'calcium_carbide',
    name: 'Calcium carbide',
    blurb: 'Grey-black lumps, a heavy powder. Falls and piles. Water makes it hiss out acetylene gas, leaving slaked lime.',
    category: 'fuels',
    colours: ['#3e3d42', '#4a494e', '#333238', '#57565c'],
    phase: 'powder',
    cls: 'mineral',
    hardness: 0.9,
    density: 2220,
    fallAccel: 230,
    fallMax: 160,
    heatCapacity: 0.7,
    conductivity: 0.15,
    overrides: {
      water: { self: 'acetylene', other: 'slaked_lime', chance: 0.2, reason: 'Calcium carbide and water make acetylene gas, leaving slaked lime' },
    },
  },
  {
    key: 'acetylene',
    name: 'Acetylene',
    blurb: 'A fuel gas, about as heavy as air. Drifts and spreads. It catches from any flame and burns hotter than any other fuel, as in a cutting torch.',
    category: 'gases',
    colours: ['#dcd6e6', '#d0c9dc', '#e6e1ee'],
    texture: 'gas',
    phase: 'gas',
    cls: 'gas',
    hardness: 0,
    density: 1.1,
    heatCapacity: 0.4,
    conductivity: 0.04,
    ignition: 305,
    flash: -18,
    fuel: 10,
    flameTemp: 2500,
    burnEnergy: 30,
    burnInto: 'steam',
  },
  {
    key: 'iodine',
    name: 'Iodine',
    blurb: 'Dark violet crystals, a heavy powder. Falls and piles. Gently heated it turns straight into a violet vapour, which settles back into crystals as it cools.',
    category: 'powders',
    colours: ['#3a2a4a', '#46345a', '#2e2040', '#52406a'],
    phase: 'powder',
    cls: 'mineral',
    hardness: 0.9,
    density: 4930,
    fallAccel: 240,
    fallMax: 170,
    heatCapacity: 0.4,
    conductivity: 0.1,
    boil: 114,
    boilInto: 'iodine_vapour',
  },
  {
    key: 'iodine_vapour',
    name: 'Iodine vapour',
    blurb: 'A heavy violet vapour. Sinks and pools low. As it cools it settles back into iodine crystals.',
    category: 'gases',
    colours: ['#8a5ab8', '#7a4aa8', '#9a6ac8'],
    texture: 'gas',
    phase: 'gas',
    cls: 'gas',
    hardness: 0,
    density: 11,
    temp: 130,
    heatCapacity: 0.4,
    conductivity: 0.04,
  },
  // ---- Batch 9: noble metals, halogens, desert life --------------------------------
  {
    key: 'titanium',
    name: 'Titanium',
    blurb: 'A light, very strong grey metal. Stays put. Acid cannot eat it, and it barely conducts heat.',
    category: 'metals',
    colours: ['#8a8d92', '#979a9f', '#7d8085', '#a4a7ac'],
    texture: 'stone',
    phase: 'solid',
    cls: 'metal',
    hardness: 0.95,
    electric: 1,
    density: 4500,
    heatCapacity: 0.52,
    conductivity: 0.2,
  },
  {
    key: 'platinum',
    name: 'Platinum',
    blurb: 'A very heavy, silvery noble metal. Stays put and nothing eats it. Hydrogen touching it catches and burns into steam.',
    category: 'metals',
    colours: ['#d4d6d8', '#e0e2e4', '#c7c9cc', '#eceef0'],
    texture: 'stone',
    phase: 'solid',
    cls: 'metal',
    hardness: 1,
    electric: 1,
    density: 21450,
    heatCapacity: 0.13,
    conductivity: 0.7,
  },
  {
    key: 'argon',
    name: 'Argon',
    blurb: 'A heavy inert gas. Sinks and pools low. It never reacts, and it smothers flames by shutting out the air.',
    category: 'gases',
    colours: ['#c8c4dc', '#bcb8d0', '#d4d0e6'],
    texture: 'gas',
    phase: 'gas',
    cls: 'gas',
    hardness: 0,
    density: 1.66,
    heatCapacity: 0.3,
    conductivity: 0.02,
  },
  {
    key: 'bromine',
    name: 'Bromine',
    blurb: 'A dark red, poisonous liquid, very heavy. Flows and sinks through water. Warmed, it boils into a choking red vapour, and it kills plants.',
    category: 'liquids',
    colours: ['#6a1a10', '#5a140c', '#7a2214', '#4a1008'],
    texture: 'liquid',
    phase: 'liquid',
    cls: 'water',
    hardness: 0,
    density: 3100,
    fallAccel: 230,
    fallMax: 160,
    dispersion: 5,
    heatCapacity: 0.5,
    conductivity: 0.1,
    boil: 59,
    boilInto: 'bromine_vapour',
    toxic: true,
  },
  {
    key: 'bromine_vapour',
    name: 'Bromine vapour',
    blurb: 'A choking red-brown vapour, very heavy. Sinks and pools low, kills plants, and condenses back into bromine as it cools.',
    category: 'gases',
    colours: ['#a8442a', '#983a22', '#b84e32'],
    texture: 'gas',
    phase: 'gas',
    cls: 'gas',
    hardness: 0,
    density: 7.6,
    temp: 70,
    heatCapacity: 0.4,
    conductivity: 0.03,
    toxic: true,
  },
  {
    key: 'gallium',
    name: 'Gallium',
    blurb: 'A soft silvery metal. Stays put, but the warmth of a hand melts it into liquid gallium.',
    category: 'metals',
    colours: ['#b4b8be', '#c2c6cb', '#a7abb1', '#cfd3d8'],
    texture: 'stone',
    phase: 'solid',
    cls: 'metal',
    hardness: 0.3,
    electric: 1,
    density: 5910,
    heatCapacity: 0.37,
    conductivity: 0.4,
    melt: 30,
    meltInto: 'liquid_gallium',
  },
  {
    key: 'liquid_gallium',
    name: 'Liquid gallium',
    blurb: 'Melted gallium, a cool silvery liquid. Flows and sinks through water. Sets back into gallium just below body warmth.',
    category: 'metals',
    colours: ['#9ea3aa', '#9196a0', '#abb0b6', '#868b94'],
    texture: 'liquid',
    phase: 'liquid',
    cls: 'metal',
    hardness: 0.3,
    electric: 1,
    density: 6095,
    fallAccel: 230,
    fallMax: 160,
    dispersion: 5,
    temp: 35,
    heatCapacity: 0.37,
    conductivity: 0.4,
  },
  {
    key: 'cactus_seed',
    name: 'Cactus seed',
    blurb: 'Tiny dark seeds, a powder. Falls and sinks in water. On damp soil or sand it sprouts into a cactus.',
    category: 'life',
    colours: ['#3a3228', '#4a4034', '#2e281f', '#5a4e40'],
    phase: 'powder',
    cls: 'life',
    hardness: 0.2,
    density: 1100,
    fallAccel: 200,
    fallMax: 140,
    heatCapacity: 0.8,
    conductivity: 0.1,
    ignition: 250,
    fuel: 40,
    flameTemp: 700,
    burnInto: 'ash',
    growsInto: 'cactus',
    growBudget: 16,
  },
  {
    key: 'cactus',
    name: 'Cactus',
    blurb: 'A fat, spiny desert plant. Grows slowly and stores water, losing it so slowly that it outlasts a drought, and it flowers at its tips.',
    category: 'life',
    colours: ['#3e7a4a', '#478a54', '#356a40', '#52965e'],
    texture: 'stone',
    phase: 'solid',
    cls: 'organic',
    hardness: 0.2,
    density: 950,
    heatCapacity: 1.2,
    conductivity: 0.1,
    ignition: 300,
    fuel: 120,
    flameTemp: 700,
    burnInto: 'ash',
    residue: 0.3,
    witherInto: 'dry_plant',
    topInto: 'flower',
    waterLoss: 0.0625,
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
/** Flash point, °C: a burning neighbour lights it above this if air reaches it; Infinity = never. */
export const FLASH_OF = Float32Array.from(ELEMENTS, (e) => e.flash ?? Infinity);
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
// A cell takes a solute in units of CONC_UNIT (48 of 255), so a solubility
// under one unit could never dissolve at all: refuse it at load.
for (const e of ELEMENTS) {
  if (e.solubility !== undefined && e.solubility > 0 && e.solubility * 255 < 48) {
    throw new Error(`${e.key}: solubility ${e.solubility} is below one unit (0.19); it would never dissolve`);
  }
}

/** What a living cell withers into without water; 0 = it does not. */
export const WITHER_INTO_OF = Uint16Array.from(ELEMENTS, (e) => (e.witherInto ? elementId(e.witherInto) : 0));
const idOr0 = (key: string | undefined): number => (key ? elementId(key) : 0);
/** Rule-family properties, by element id (0 = none). See ElementDef for each. */
export const RUSTS_INTO_OF = Uint16Array.from(ELEMENTS, (e) => idOr0(e.rustsInto));
export const SETS_INTO_OF = Uint16Array.from(ELEMENTS, (e) => idOr0(e.setsInto));
export const BAKE_T_OF = Float32Array.from(ELEMENTS, (e) => e.bake?.at ?? Infinity);
export const BAKE_INTO_OF = Uint16Array.from(ELEMENTS, (e) => idOr0(e.bake?.into));
export const BAKE_GAS_OF = Uint16Array.from(ELEMENTS, (e) => idOr0(e.bake?.gas));
export const ACID_GAS_OF = Uint16Array.from(ELEMENTS, (e) => idOr0(e.acidGas));
export const TOXIC_OF = Uint8Array.from(ELEMENTS, (e) => (e.toxic ? 1 : 0));
export const ROTS_INTO_OF = Uint16Array.from(ELEMENTS, (e) => idOr0(e.rotsInto));
export const CARBONATE_OF = Uint8Array.from(ELEMENTS, (e) => (e.carbonate ? 1 : 0));
export const SELF_FED_OF = Uint8Array.from(ELEMENTS, (e) => (e.selfFed ? 1 : 0));
export const NO_FLAME_OF = Uint8Array.from(ELEMENTS, (e) => (e.noFlame ? 1 : 0));
export const GROW_BUDGET_OF = Uint16Array.from(ELEMENTS, (e) => e.growBudget ?? 40);
export const LEAF_INTO_OF = Uint16Array.from(ELEMENTS, (e) => idOr0(e.leafInto));
export const TOP_INTO_OF = Uint16Array.from(ELEMENTS, (e) => idOr0(e.topInto));
/** Chance (out of 65,536) per living turn of losing one unit of water: 1,024 (1 in 64) for a normal plant. */
export const WATER_LOSS_OF = Uint16Array.from(ELEMENTS, (e) => Math.round((e.waterLoss ?? 1) * 1024));
export const HOLD_T_OF = Float32Array.from(ELEMENTS, (e) => e.holdTemp ?? NaN);
export const CLONES_OF = Uint8Array.from(ELEMENTS, (e) => (e.clones ? 1 : 0));
export const VOIDS_OF = Uint8Array.from(ELEMENTS, (e) => (e.voids ? 1 : 0));
export const BLOW_X_OF = Float32Array.from(ELEMENTS, (e) => e.blows?.[0] ?? 0);
export const BLOW_Y_OF = Float32Array.from(ELEMENTS, (e) => e.blows?.[1] ?? 0);
export const CHARGE_HEAT_OF = Float32Array.from(ELEMENTS, (e) => e.chargeHeat ?? 4);
export const COOL_RATE_OF = Float32Array.from(ELEMENTS, (e) => e.coolRate ?? 0);
export const RAIN_INTO_OF = Uint16Array.from(ELEMENTS, (e) => idOr0(e.rainsInto));
export const RAIN_COLD_OF = Uint16Array.from(ELEMENTS, (e) => idOr0(e.rainsColdInto ?? e.rainsInto));
/** Creature habitat: 0 none, 1 water, 2 ground, 3 soil, 4 air. */
export const HABITAT_OF = Uint8Array.from(ELEMENTS, (e) => (e.creature ? { water: 1, ground: 2, soil: 3, air: 4 }[e.creature.lives] : 0));
export const DIES_INTO_OF = Uint16Array.from(ELEMENTS, (e) => idOr0(e.creature?.diesInto));
export const BOLT_OF = Uint16Array.from(ELEMENTS, (e) => idOr0(e.bolt));
export const LAUNCHES_AS_OF = Uint16Array.from(ELEMENTS, (e) => idOr0(e.launchesAs));
export const BURSTS_INTO_OF = Uint16Array.from(ELEMENTS, (e) => idOr0(e.burstsInto));
export const SINKS_OF = Uint8Array.from(ELEMENTS, (e) => (e.sinks ? 1 : 0));
export const LIGHTNING_FROM_OF = Uint8Array.from(ELEMENTS, (e) => (e.makesLightning ? 1 : 0));
/** Per pair (creature, food): what the food becomes, plus one (0 = not food; 1 = eaten whole). */
export const EATS = new Uint16Array(ELEMENT_COUNT * ELEMENT_COUNT);
ELEMENTS.forEach((e, a) => {
  for (const [food, left] of Object.entries(e.creature?.eats ?? {})) EATS[a * ELEMENT_COUNT + elementId(food)] = (left === 'empty' ? 0 : elementId(left)) + 1;
});
/** Any device behaviour, so the cell pass checks one table. */
export const DEVICE_OF = Uint8Array.from(ELEMENTS, (e) => (e.holdTemp !== undefined || e.clones || e.voids || e.blows || e.coolRate ? 1 : 0));

/** What a solid becomes instead when it freezes unsupported; 0 = itself. */
export const RUBBLE_OF = Uint16Array.from(ELEMENTS, (e) => (e.rubble ? elementId(e.rubble) : 0));

/** Element id for a key. Throws on an unknown key. */
export function elementId(key: string): number {
  const id = ELEMENTS.findIndex((e) => e.key === key);
  if (id < 0) throw new Error(`Unknown element: ${key}`);
  return id;
}

/** Lightning, which storm clouds let go now and then. */
export const LIGHTNING = elementId('lightning');
