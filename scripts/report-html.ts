/**
 * The master list as a web page: public/master-list.html, served next to the
 * game and opened from its panel. Built from the same element data and
 * wording as docs/MASTER_LIST.md, so the two always agree. Called by
 * scripts/master-list.ts; not run on its own.
 */
import { readFileSync, existsSync } from 'node:fs';
import {
  P_RULE,
  R_ABSORB,
  R_ACIDIFY,
  R_COMBUST,
  R_CORRODE,
  R_DISSOLVE,
  R_NEUTRAL,
  R_OVERRIDE,
  R_QUENCH,
  R_ROT,
  R_RUST,
  R_SET,
  R_THAW,
  R_TOXIC,
} from '../src/sim/chem';
import { density, downChange, elementFacts, pairLines, upChange } from '../src/sim/describe';
import { AMBIENT, ELEMENTS, ELEMENT_COUNT, EMPTY, OXIDISER_OF } from '../src/sim/elements';
import { GLOW_MAX, GLOW_MIN, buildGlow } from '../src/render/palette';

const N = ELEMENT_COUNT;
const n0 = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 });
const esc = (s: string): string => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const nameOf = (id: number): string => (id === EMPTY ? 'Air' : ELEMENTS[id].name);
const keyOf = (id: number): string => (id === EMPTY ? 'air' : ELEMENTS[id].key);

// ---- Kinds of interaction, each with its colour --------------------------------

type Kind = 'burn' | 'quench' | 'corrode' | 'neutral' | 'dissolve' | 'absorb' | 'set' | 'change' | 'toxic' | 'special' | 'heat' | 'weight' | 'none';
const KINDS: { kind: Kind; label: string; text: string }[] = [
  { kind: 'burn', label: 'Burns or explodes', text: 'One sets the other alight, or feeds its fire' },
  { kind: 'heat', label: 'Heat change', text: 'One is hot or cold enough to melt, boil, freeze or ignite the other' },
  { kind: 'quench', label: 'Puts out fire', text: 'Water smothers flames and flashes into steam' },
  { kind: 'corrode', label: 'Acid', text: 'Acid eats metal, rock or wood, or a gas turns water into acid' },
  { kind: 'neutral', label: 'Neutralises', text: 'Acid and base cancel into water' },
  { kind: 'dissolve', label: 'Dissolves or thaws', text: 'A solid goes into a liquid, or salt melts ice' },
  { kind: 'absorb', label: 'Soaks up', text: 'A porous powder takes in a liquid' },
  { kind: 'set', label: 'Sets hard', text: 'A powder takes in water and hardens, as cement does' },
  { kind: 'change', label: 'Rusts or rots', text: 'A slow change where water or oxygen touches it' },
  { kind: 'toxic', label: 'Poisons', text: 'A toxic gas kills living things' },
  { kind: 'special', label: 'Special rule', text: 'A hand-written reaction' },
  { kind: 'weight', label: 'Sinks through', text: 'No reaction; the heavier one ends up below' },
  { kind: 'none', label: 'Nothing', text: 'They only share heat by touch' },
];

const RULE_KIND: Record<number, Kind> = {
  [R_OVERRIDE]: 'special',
  [R_CORRODE]: 'corrode',
  [R_COMBUST]: 'burn',
  [R_NEUTRAL]: 'neutral',
  [R_DISSOLVE]: 'dissolve',
  [R_ABSORB]: 'absorb',
  [R_QUENCH]: 'quench',
  [R_SET]: 'set',
  [R_THAW]: 'dissolve',
  [R_ACIDIFY]: 'corrode',
  [R_TOXIC]: 'toxic',
  [R_RUST]: 'change',
  [R_ROT]: 'change',
};

function pairKind(a: number, b: number, lines: string[]): Kind {
  const rule = P_RULE[a * N + b] || P_RULE[b * N + a];
  if (rule) return RULE_KIND[rule] ?? 'special';
  if (lines.some((l) => /hot enough|cold enough|on fire|hotter and faster/.test(l))) return 'heat';
  return lines.length ? 'weight' : 'none';
}

const lines = (a: number, b: number): string[] => [...new Set([...pairLines(a, b), ...pairLines(b, a)])];

// ---- Swatches: the element's colours, glowing if it starts hot ------------------

const glow = buildGlow();
function swatch(id: number): string {
  if (id === EMPTY) return 'transparent';
  const e = ELEMENTS[id];
  const T = e.temp ?? AMBIENT;
  const k = T >= GLOW_MIN ? Math.round(Math.min(1, (T - GLOW_MIN) / (GLOW_MAX - GLOW_MIN)) * 255) : -1;
  const stops = e.colours.map((hex) => {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    if (k >= 0) {
      const c = glow.colour[k];
      const f = glow.alpha[k] / 256;
      r += ((c & 255) - r) * f;
      g += (((c >> 8) & 255) - g) * f;
      b += (((c >> 16) & 255) - b) * f;
    }
    return `rgb(${Math.round(r)} ${Math.round(g)} ${Math.round(b)})`;
  });
  return stops.length > 1 ? `linear-gradient(135deg, ${stops.join(', ')})` : stops[0];
}
const sw = (id: number, cls = 'sw'): string =>
  `<span class="${cls}${id === EMPTY ? ' air' : ''}" style="background:${swatch(id)}"></span>`;

// ---- Audit status, from docs/AUDIT.md -------------------------------------------

function auditStatus(): { runs: string; findings: number; rows: string[] } | null {
  const url = new URL('../docs/AUDIT.md', import.meta.url);
  if (!existsSync(url)) return null;
  const md = readFileSync(url, 'utf-8');
  const runs = /Pairs × conditions run: (\d+)/.exec(md)?.[1];
  const findings = /Findings: (\d+)/.exec(md)?.[1];
  if (!runs || !findings) return null;
  const rows = md
    .split('\n')
    .filter((l: string) => l.startsWith('| ') && !l.startsWith('| A ') && !l.startsWith('| ---'));
  return { runs: n0.format(Number(runs)), findings: Number(findings), rows };
}

// ---- Page ------------------------------------------------------------------------


// ---- Highlights: the headline reactions, by theme ------------------------------------
// Each line names the elements it involves; a missing key fails the build, so
// the list cannot drift from the game. Every line is backed by a behaviour check.
const HIGHLIGHTS: { theme: string; items: [string, string[]][] }[] = [
  {
    theme: 'Fire',
    items: [
      ['A flame lights anything flammable it touches, but a fire needs air: sealed in a box, it goes out.', ['fire', 'wood']],
      ['Pools of fuel burn right across their surface once lit; petrol goes up from the smallest flame.', ['petrol', 'oil', 'alcohol', 'kerosene']],
      ['Oxygen, ozone, liquid oxygen and saltpeter make fires burn hotter and faster.', ['oxygen', 'ozone', 'liquid_oxygen', 'saltpeter']],
      ['Saltpeter mixed with charcoal keeps burning with no air at all.', ['saltpeter', 'charcoal']],
      ['Wood heated with no air turns into charcoal, so burning logs leave glowing coals.', ['wood', 'charcoal']],
      ['Water puts fires out and flashes into steam; nitrogen, carbon dioxide and argon smother them.', ['water', 'steam', 'nitrogen', 'carbon_dioxide', 'argon']],
      ['A flame will not light thermite, but great heat does: it burns white-hot with no air and leaves molten iron.', ['thermite', 'molten_iron']],
      ['Burning magnesium is hot enough to set thermite off.', ['magnesium', 'thermite']],
      ['Acetylene burns hotter than any other fuel.', ['acetylene']],
      ['White phosphorus bursts into flame by itself in warm air, but is safe under water.', ['phosphorus', 'water']],
      ['Sulfur burns into choking sulfur dioxide; a diamond burns away into carbon dioxide.', ['sulfur', 'sulfur_dioxide', 'diamond', 'carbon_dioxide']],
      ['Napalm floats on water and keeps burning there.', ['napalm', 'water']],
      ['Smoke fades to a faint haze as it ages, so it never hides the scene, yet it is spent air: a fire sealed in a box still chokes.', ['smoke', 'fire']],
    ],
  },
  {
    theme: 'Heat, melting and freezing',
    items: [
      ['Water boils into steam, steam rises and rains back down, and cold water freezes into ice.', ['water', 'steam', 'ice']],
      ['Salt water stays liquid below 0 °C, and salt or sugar melts ice it touches.', ['salt', 'sugar', 'ice']],
      ['Lava boils water; water chills lava so fast that it sets into obsidian.', ['lava', 'water', 'obsidian']],
      ['Lava cools into stone, or into gravel where nothing holds it up.', ['lava', 'stone', 'gravel']],
      ['Sand melts into molten glass, which sets into glass; lightning does this where it lands.', ['sand', 'molten_glass', 'glass', 'lightning']],
      ['Metals melt and set back: gold, silver, lead, tin, aluminium, iron, copper wire, and gallium at just 30 °C.', ['gold', 'silver', 'lead', 'tin', 'aluminium', 'iron', 'wire', 'gallium']],
      ['Dry ice and iodine turn straight into gas without melting; iodine vapour settles back into crystals.', ['dry_ice', 'iodine', 'iodine_vapour']],
      ['Liquid nitrogen boils away into nitrogen and freezes water it touches.', ['liquid_nitrogen', 'nitrogen', 'water']],
      ['Clay bakes into brick; limestone and marble bake into quicklime, giving off carbon dioxide.', ['clay', 'brick', 'limestone', 'marble', 'quicklime']],
      ['Bromine boils into a heavy red vapour at 59 °C; warm soda goes flat, fizzing out its gas.', ['bromine', 'bromine_vapour', 'soda']],
    ],
  },
  {
    theme: 'Acids, bases and chemistry',
    items: [
      ['Acid eats metal (giving off hydrogen), rock and wood; gold, platinum, titanium and plastic resist it.', ['acid', 'iron', 'gold', 'platinum', 'titanium', 'plastic']],
      ['Acid fizzes limestone, marble and chalk away into carbon dioxide.', ['acid', 'limestone', 'marble', 'chalk']],
      ['Acids and bases neutralise into water and warm up; baking soda and vinegar fizz.', ['acid', 'lye', 'slaked_lime', 'baking_soda', 'vinegar', 'ammonia']],
      ['Bleach mixed with any acid gives off poisonous chlorine.', ['bleach', 'acid', 'vinegar', 'chlorine']],
      ['Sulfur dioxide and chlorine turn water into acid.', ['sulfur_dioxide', 'chlorine', 'water', 'acid']],
      ['Sodium and potassium burst in water into lye and burning hydrogen; lithium fizzes gently.', ['sodium', 'potassium', 'lithium', 'lye', 'hydrogen']],
      ['Calcium carbide and water make acetylene gas, leaving slaked lime.', ['calcium_carbide', 'acetylene', 'slaked_lime']],
      ['Hydrogen peroxide breaks down into water and oxygen when heated, and fast on rust.', ['hydrogen_peroxide', 'rust', 'oxygen']],
      ['Platinum makes hydrogen catch and burn into steam.', ['platinum', 'hydrogen']],
      ['Acetone dissolves plastic.', ['acetone', 'plastic']],
      ['Iron and steel slowly rust where water or oxygen touches them.', ['iron', 'steel', 'rust']],
      ['Salt, sugar and baking soda dissolve in water; boiling the water leaves the crystals behind.', ['salt', 'sugar', 'baking_soda', 'water']],
      ['Cement sets into concrete with water; quicklime and water seethe into slaked lime, hot enough to boil.', ['cement', 'concrete', 'quicklime', 'slaked_lime']],
      ['Yeast ferments sugar water into alcohol, bubbling out carbon dioxide.', ['yeast', 'sugar', 'alcohol', 'carbon_dioxide']],
      ['Manganese dioxide is a catalyst: it tears hydrogen peroxide into oxygen without being used up, and soap whips the gas into foam (elephant toothpaste).', ['manganese_dioxide', 'hydrogen_peroxide', 'soap', 'foam']],
      ['Epoxy resin and hardener set together into a tough solid; blue crystals grow from copper sulfate solution; cabbage juice turns pink in acid and green in a base.', ['epoxy_resin', 'epoxy_hardener', 'epoxy', 'copper_sulfate', 'copper_sulfate_crystal', 'cabbage_juice']],
      ['Ammonium nitrate dissolving in water makes it ice cold, like a cold pack; great heat makes it explode.', ['ammonium_nitrate', 'water']],
      ['Glue oozes, then sets hard in place after a few seconds.', ['glue', 'dried_glue']],
    ],
  },
  {
    theme: 'Life',
    items: [
      ['Seeds sprout on damp soil; plants drink through roots, flower at their tips and wither into dry plant without water.', ['seed', 'plant', 'flower', 'dry_plant']],
      ['Acorns grow into trees with leaves (a dead tree is plain wood); grass seed makes grass; cactus outlasts droughts.', ['acorn', 'tree', 'leaves', 'grass', 'cactus']],
      ['Dead plants and paper rot into dirt in water, and worms turn them into dirt too.', ['dry_plant', 'paper', 'worm', 'dirt']],
      ['Salt, bleach, chlorine, ammonia, ozone, bromine, sulfur dioxide and uranium kill plants they touch.', ['salt', 'bleach', 'chlorine', 'ammonia', 'ozone', 'bromine', 'uranium']],
      ['Bees turn flowers into seeds and breed on honey.', ['bee', 'flower', 'seed', 'honey']],
      ['Ants eat sweets and meat; termites chew wood into sawdust; snails graze plants. All breed as they eat.', ['ant', 'termite', 'snail', 'sugar', 'wood']],
      ['Spiders and frogs catch insects; birds eat seeds and insects; mice eat seeds and food; snakes eat mice, frogs and eggs; fish eat sinking seeds.', ['spider', 'frog', 'bird', 'mouse', 'snake', 'fish']],
      ['Creatures die of heat or cold, or out of their home; fish, birds and mice become meat, which cooks at 70 °C.', ['fish', 'meat', 'cooked_meat']],
      ['Fish, birds, mice, snakes, frogs, worms and snails have bodies several cells big that move, eat and die as one.', ['fish', 'bird', 'mouse', 'snake', 'frog', 'worm', 'snail']],
      ['Plague mist makes animals sick: a fever, spreading to every animal they touch, and death unless medicine reaches them.', ['plague', 'medicine', 'mouse', 'ant']],
      ['Mould spreads over damp food; spores grow mushrooms on damp soil, but only in the dark.', ['mould', 'meat', 'spores', 'mushroom']],
      ['Eggs cook, popcorn pops at 180 °C, sugar turns into caramel and chocolate melts at 35 °C.', ['egg', 'popcorn_kernel', 'popcorn', 'caramel', 'chocolate']],
      ['Flour and water knead into dough, which bakes into bread, then toast, then burns.', ['flour', 'dough', 'bread', 'toast']],
    ],
  },
  {
    theme: 'Light',
    items: [
      ['Plants grow only where light reaches them: daylight down through air, glass and water, or a fire or lamp nearby; under a roof they stop.', ['plant', 'seed', 'tree', 'glass']],
      ['A solar panel powers a circuit while light falls on it; glow paint soaks up light and shines green in the dark; silver chloride darkens in light like old film.', ['solar_panel', 'glow_paint', 'silver_chloride', 'exposed_silver']],
    ],
  },
  {
    theme: 'Building and structure',
    items: [
      ['Stone, brick, concrete, ice, glass and wood need holding up: each reaches only so far past a support, and what it cannot hold breaks off and falls as a block.', ['stone', 'brick', 'concrete', 'ice', 'glass', 'wood']],
      ['Burn or blast away a support and what it held comes down; a block that falls far cracks into rubble.', ['wood', 'stone', 'gravel']],
      ['A steel beam bridges gaps no stone can; rope and chain hold up what hangs below them, and a burning rope drops its load.', ['steel_beam', 'rope', 'chain']],
    ],
  },
  {
    theme: 'Sky, blasts and power',
    items: [
      ['Clouds rain, snow below 0 °C, and throw lightning that lights fires and sends current down wires.', ['cloud', 'snow', 'lightning', 'wire']],
      ['Fireworks launch rockets that burst high up into falling coloured embers.', ['firework', 'rocket', 'ember']],
      ['TNT and gunpowder go off from heat or flame; nitro also when dropped hard; C4 only from a spark or great heat.', ['tnt', 'gunpowder', 'nitro', 'c4', 'spark']],
      ['Blasts shatter glass, brick, concrete, obsidian and sandstone.', ['glass', 'brick', 'concrete', 'obsidian', 'sandstone']],
      ['A fuse burns along like a rope and sets off any explosive at its end, even C4; a long charge goes off as a fast wave from where it was lit.', ['fuse', 'c4', 'gunpowder', 'tnt']],
      ['A magnet pulls iron filings in from a distance.', ['magnet', 'iron_filings']],
      ['Uranium packed tightly enough goes critical: it heats, flings neutrons, melts down into corium and can blow apart; control rods, lead and concrete slow it.', ['uranium', 'corium', 'neutron', 'control_rod', 'lead']],
      ['Water boiling in a sealed box builds pressure until the box bursts; a valve vents it; propane tanks rupture in a fire into a cloud of propane, air tanks burst with a pure shock.', ['water', 'valve', 'propane_tank', 'air_tank', 'glass']],
      ['Real circuits: paint a battery onto a wire loop and current flows round it; a longer battery gives more volts, a thicker one more current, and batteries in one loop turn round to help each other.', ['battery', 'wire', 'mercury', 'graphite']],
      ['Parts painted onto wire cut into it; a short circuit heats wire red and can set a thick battery alight; bulbs in series glow dimmer; an LED without a resistor burns out.', ['wire', 'battery', 'bulb', 'led', 'resistor']],
      ['Switches click open and shut, pressure plates close under sand or water, a thermostat holds a heater steady, a diode lets current one way only.', ['switch', 'pressure_plate', 'thermostat', 'diode']],
      ['A capacitor charges and lights a bulb after the battery is gone; motors carry what rests on them; an electromagnet pulls iron only while powered; neon glows in a tube.', ['capacitor', 'motor', 'electromagnet', 'neon']],
      ['Salt water carries current and splits into hydrogen and oxygen.', ['water', 'salt', 'hydrogen', 'oxygen']],
      ['Heaters, coolers, clones, voids and fans do just what they say.', ['heater', 'cooler', 'clone', 'void', 'fan']],
    ],
  },
];

export function renderHtml(): string {
  const ids = ELEMENTS.map((_, id) => id);
  const real = ids.filter((id) => id !== EMPTY);
  const categories = [...new Set(real.map((id) => ELEMENTS[id].category))];
  const audit = auditStatus();

  // Pair data, used by the matrix and the cards.
  const pair = new Map<number, { kind: Kind; lines: string[] }>();
  for (const a of ids)
    for (const b of ids) {
      if (a === b) continue;
      const l = lines(a, b);
      pair.set(a * N + b, { kind: pairKind(a, b, l), lines: l });
    }
  const interacting = new Set<string>();
  for (const a of ids)
    for (const b of ids) if (a < b && pair.get(a * N + b)!.kind !== 'none') interacting.add(`${a}-${b}`);

  const h: string[] = [];
  h.push(`<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Sandglass master list</title>
<link rel="icon" href="favicon.svg">
<style>
:root {
  --bg: #0d0e10; --raise: #15171a; --raise-2: #1c1f23; --line: #25292e; --line-strong: #353a41;
  --text: #e8eaed; --muted: #a1a7af; --faint: #6d737b;
  --burn: #f0883e; --heat: #e5534b; --corrode: #c3d84a; --neutral: #3fc1a9; --dissolve: #4c9cf0;
  --absorb: #a98bf5; --special: #e86fb3; --weight: #4a5260; --none: #1a1d21;
  --quench: #8fd3f4; --set: #c8a46e; --change: #b0613a; --toxic: #5e9e3a;
  --good: #57c27a; --bad: #e5534b;
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; scroll-padding-top: 72px; }
body { margin: 0; background: var(--bg); color: var(--text); font: 14px/1.55 "Geist", system-ui, -apple-system, "Segoe UI", sans-serif; }
a { color: inherit; }
.wrap { max-width: 1180px; margin: 0 auto; padding: 0 24px; }
header.top { padding: 40px 0 24px; border-bottom: 1px solid var(--line); }
h1 { margin: 0 0 6px; font-size: 28px; font-weight: 650; letter-spacing: -0.02em; }
.lede { margin: 0; color: var(--muted); max-width: 70ch; }
.stats { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
.stat { padding: 6px 12px; border: 1px solid var(--line); border-radius: 8px; background: var(--raise); color: var(--muted); font-size: 13px; }
.stat b { color: var(--text); font-weight: 600; font-variant-numeric: tabular-nums; }
.stat.good { border-color: color-mix(in srgb, var(--good) 45%, var(--line)); }
.stat.good b { color: var(--good); }
.stat.bad { border-color: color-mix(in srgb, var(--bad) 55%, var(--line)); }
.stat.bad b { color: var(--bad); }
nav.bar { position: sticky; top: 0; z-index: 3; background: color-mix(in srgb, var(--bg) 92%, transparent); backdrop-filter: blur(8px); border-bottom: 1px solid var(--line); }
nav.bar .wrap { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; padding-top: 10px; padding-bottom: 10px; }
nav.bar .links { display: flex; gap: 4px; margin-right: auto; }
nav.bar .links a { padding: 5px 10px; border-radius: 6px; color: var(--muted); text-decoration: none; font-size: 13px; }
nav.bar .links a:hover { background: var(--raise-2); color: var(--text); }
input.search { width: 220px; padding: 6px 10px; border: 1px solid var(--line); border-radius: 7px; background: var(--raise); color: var(--text); font: inherit; font-size: 13px; }
input.search:focus { outline: none; border-color: var(--line-strong); }
.chips { display: flex; flex-wrap: wrap; gap: 4px; }
.chip { padding: 4px 10px; border: 1px solid var(--line); border-radius: 999px; background: transparent; color: var(--muted); font: inherit; font-size: 12px; cursor: pointer; text-transform: capitalize; }
.chip:hover { color: var(--text); border-color: var(--line-strong); }
.chip.on { background: var(--text); border-color: var(--text); color: var(--bg); }
section { padding: 36px 0 8px; }
h2 { margin: 0 0 4px; font-size: 19px; font-weight: 620; letter-spacing: -0.01em; }
.sub { margin: 0 0 18px; color: var(--muted); }
ul.rules { margin: 0; padding-left: 18px; color: var(--muted); }
ul.rules li { margin: 4px 0; }
ul.rules b { color: var(--text); font-weight: 560; }
.hl-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 12px; }
.hl-group { border: 1px solid var(--line); border-radius: 12px; background: var(--raise); padding: 14px 16px; }
.hl-group h3 { margin: 0 0 8px; font-size: 14px; font-weight: 620; }
.hl-group ul { list-style: none; margin: 0; padding: 0; }
.hl-group li { padding: 8px 0; border-top: 1px solid var(--line); }
.hl-group li:first-child { border-top: 0; }
.hl-group p { margin: 0 0 6px; color: var(--muted); font-size: 13px; line-height: 1.45; }
.chips-row { display: flex; flex-wrap: wrap; gap: 4px; }
.el-chip { display: inline-flex; align-items: center; gap: 5px; padding: 2px 8px 2px 3px; border: 1px solid var(--line); border-radius: 999px; color: var(--text); font-size: 11.5px; text-decoration: none; }
.el-chip:hover { border-color: var(--line-strong); }
.el-chip .sw { width: 12px; height: 12px; }
.legend { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 20px; }
.legend div { display: flex; gap: 10px; align-items: flex-start; padding: 10px 12px; border: 1px solid var(--line); border-radius: 8px; background: var(--raise); }
.legend b { display: block; font-weight: 580; font-size: 13px; }
.legend span.t { color: var(--muted); font-size: 12px; line-height: 1.45; }
.dot { flex: none; width: 12px; height: 12px; margin-top: 4px; border-radius: 3px; }
.k-burn { background: var(--burn); } .k-heat { background: var(--heat); } .k-corrode { background: var(--corrode); }
.k-neutral { background: var(--neutral); } .k-dissolve { background: var(--dissolve); } .k-absorb { background: var(--absorb); }
.k-special { background: var(--special); } .k-weight { background: var(--weight); } .k-none { background: var(--none); }
.k-quench { background: var(--quench); } .k-set { background: var(--set); } .k-change { background: var(--change); } .k-toxic { background: var(--toxic); }
.matrix-box { display: grid; grid-template-columns: auto minmax(240px, 1fr); gap: 20px; align-items: start; }
.matrix-scroll { overflow: auto; border: 1px solid var(--line); border-radius: 10px; background: var(--raise); padding: 12px; }
table.matrix { border-collapse: separate; border-spacing: 2px; }
table.matrix th { font-weight: 500; font-size: 12px; color: var(--muted); white-space: nowrap; }
table.matrix th.row { text-align: right; padding-right: 6px; }
table.matrix th.row span.n { vertical-align: middle; }
table.matrix thead th { padding: 0 0 4px; }
table.matrix td { width: 15px; height: 15px; border-radius: 3px; padding: 0; cursor: pointer; }
table.matrix td.self { background: transparent; cursor: default; }
table.matrix td:not(.self):hover { outline: 2px solid var(--text); outline-offset: -1px; }
table.matrix tr.hl th.row, table.matrix th.col.hl { color: var(--text); }
.sw { display: inline-block; width: 14px; height: 14px; border-radius: 3px; vertical-align: middle; box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.08); }
.sw.air { box-shadow: inset 0 0 0 1px var(--line-strong); background-image: repeating-linear-gradient(45deg, transparent 0 3px, var(--line) 3px 4px) !important; }
.sw.big { width: 40px; height: 40px; border-radius: 8px; }
.info { position: sticky; top: 80px; padding: 16px; border: 1px solid var(--line); border-radius: 10px; background: var(--raise); min-height: 140px; }
.info .head { display: flex; gap: 8px; align-items: center; font-weight: 600; margin-bottom: 8px; }
.info .kind { display: inline-flex; gap: 6px; align-items: center; margin-bottom: 8px; color: var(--muted); font-size: 12px; }
.info .kind .dot { margin-top: 0; }
.info ul { margin: 0; padding-left: 16px; color: var(--muted); font-size: 13px; }
.info p { margin: 0; color: var(--faint); font-size: 13px; }
.cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 12px; }
.card { border: 1px solid var(--line); border-radius: 12px; background: var(--raise); padding: 16px; scroll-margin-top: 80px; }
.card:target { border-color: var(--text); }
.card .title { display: flex; gap: 12px; align-items: center; margin-bottom: 10px; }
.card h3 { margin: 0; font-size: 16px; font-weight: 620; }
.tag { display: inline-block; margin-top: 2px; padding: 1px 8px; border-radius: 999px; background: var(--raise-2); color: var(--muted); font-size: 11.5px; text-transform: capitalize; }
.blurb { margin: 0 0 12px; color: var(--muted); }
dl.facts { display: grid; grid-template-columns: max-content 1fr; gap: 3px 14px; margin: 0 0 14px; padding: 10px 12px; border-radius: 8px; background: var(--raise-2); font-size: 12.5px; }
dl.facts dt { color: var(--faint); }
dl.facts dd { margin: 0; font-variant-numeric: tabular-nums; }
.with { font-size: 12px; color: var(--faint); text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 6px; }
ul.pairs { list-style: none; margin: 0; padding: 0; }
ul.pairs li { display: grid; grid-template-columns: 12px 18px 1fr; gap: 8px; align-items: start; padding: 5px 0; border-top: 1px solid var(--line); font-size: 13px; }
ul.pairs li:first-child { border-top: 0; }
ul.pairs .dot { margin-top: 4px; width: 10px; height: 10px; }
ul.pairs .sw { margin-top: 2px; }
ul.pairs b { font-weight: 580; }
ul.pairs span.t { color: var(--muted); }
details { margin-top: 10px; color: var(--faint); font-size: 12.5px; }
summary { cursor: pointer; }
.findings { width: 100%; border-collapse: collapse; font-size: 13px; }
.findings td, .findings th { text-align: left; padding: 6px 10px; border-bottom: 1px solid var(--line); }
.findings th { color: var(--faint); font-weight: 500; }
footer { padding: 40px 0 60px; color: var(--faint); font-size: 12.5px; }
code { font: 12.5px ui-monospace, "Cascadia Code", Consolas, monospace; color: var(--muted); }
.hidden { display: none !important; }
@media (max-width: 860px) { .legend { grid-template-columns: 1fr 1fr; } .matrix-box { grid-template-columns: 1fr; } .info { position: static; } }
</style>
</head>
<body>
<header class="top"><div class="wrap">
<h1>Sandglass master list</h1>
<p class="lede">Every element, what it is, and what it does with every other element. This page is built from the game's own data, so it always matches the game.</p>
<div class="stats">
<span class="stat"><b>${real.length}</b> elements</span>
<span class="stat"><b>${interacting.size}</b> pairs that interact</span>`);
  if (audit)
    h.push(
      `<span class="stat ${audit.findings ? 'bad' : 'good'}"><b>${audit.findings ? `${audit.findings} problems` : 'No problems'}</b> in the last audit (${audit.runs} test runs)</span>`,
    );
  h.push(`</div>
</div></header>
<nav class="bar"><div class="wrap">
<div class="links"><a href="#highlights">Highlights</a><a href="#matrix">Matrix</a><a href="#elements">Elements</a><a href="#rules">World rules</a>${audit ? '<a href="#audit">Audit</a>' : ''}</div>
<input class="search" type="search" placeholder="Find an element" aria-label="Find an element">
<div class="chips"><button class="chip on" data-cat="all">All</button>${categories.map((c) => `<button class="chip" data-cat="${esc(c)}">${esc(c)}</button>`).join('')}</div>
</div></nav>
<main class="wrap">`);

  // Highlights first: the reactions worth knowing, in plain words.
  const idByKey = new Map(ELEMENTS.map((e, id) => [e.key, id]));
  const chip = (key: string): string => {
    const id = idByKey.get(key);
    if (id === undefined) throw new Error(`Highlights name an unknown element: ${key}`);
    return `<a class="el-chip" href="#el-${esc(key)}">${sw(id)}${esc(ELEMENTS[id].name)}</a>`;
  };
  h.push(`<section id="highlights">
<h2>What happens: the headline reactions</h2>
<p class="sub">The reactions worth knowing first, grouped by theme. Click an element to see everything it does.</p>
<div class="hl-grid">`);
  for (const group of HIGHLIGHTS) {
    h.push(`<div class="hl-group"><h3>${esc(group.theme)}</h3><ul>`);
    for (const [text, keys] of group.items) h.push(`<li><p>${esc(text)}</p><div class="chips-row">${keys.map(chip).join('')}</div></li>`);
    h.push('</ul></div>');
  }
  h.push('</div></section>');

  // Matrix.
  h.push(`<section id="matrix">
<h2>Who reacts with whom</h2>
<p class="sub">Each square is one pair. Its colour says what happens when they touch. Point at a square to read the details; click it to open the element.</p>
<div class="legend">${KINDS.map((k) => `<div><span class="dot k-${k.kind}"></span><span><b>${k.label}</b><span class="t">${k.text}</span></span></div>`).join('')}</div>
<div class="matrix-box"><div class="matrix-scroll"><table class="matrix"><thead><tr><th></th>`);
  for (const b of ids) h.push(`<th class="col" data-col="${b}" title="${esc(nameOf(b))}">${sw(b)}</th>`);
  h.push('</tr></thead><tbody>');
  for (const a of ids) {
    h.push(`<tr data-row="${a}" data-cat="${a === EMPTY ? 'air' : esc(ELEMENTS[a].category)}"><th class="row"><span class="n">${esc(nameOf(a))}</span> ${sw(a)}</th>`);
    for (const b of ids) {
      if (a === b) {
        h.push('<td class="self"></td>');
        continue;
      }
      const p = pair.get(a * N + b)!;
      h.push(`<td class="k-${p.kind}" data-a="${a}" data-b="${b}"></td>`);
    }
    h.push('</tr>');
  }
  h.push(`</tbody></table></div>
<div class="info" aria-live="polite"><p>Point at a square to see what that pair does.</p></div></div>
</section>`);

  // Element cards.
  h.push(`<section id="elements">
<h2>Elements</h2>
<p class="sub">What each element is, its numbers, and every element it reacts with.</p>
<div class="cards">`);
  for (const a of real) {
    const A = ELEMENTS[a];
    h.push(`<article class="card" id="el-${esc(A.key)}" data-cat="${esc(A.category)}" data-name="${esc(A.name.toLowerCase())}">
<div class="title">${sw(a, 'sw big')}<div><h3>${esc(A.name)}</h3><span class="tag">${esc(A.category)}</span> <span class="tag">${esc(A.phase)}</span></div></div>
<p class="blurb">${esc(A.blurb)}</p>
<dl class="facts">${elementFacts(a)
      .map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`)
      .join('')}</dl>`);
    const active: string[] = [];
    const quiet: string[] = [];
    for (const b of ids) {
      if (b === a) continue;
      const p = pair.get(a * N + b)!;
      if (p.kind === 'none') {
        quiet.push(nameOf(b));
        continue;
      }
      active.push(
        `<li><span class="dot k-${p.kind}"></span>${sw(b)}<span><b>${b === EMPTY ? 'Air' : `<a href="#el-${esc(keyOf(b))}">${esc(nameOf(b))}</a>`}</b> <span class="t">${esc(p.lines.join('. '))}.</span></span></li>`,
      );
    }
    h.push(`<p class="with">With other elements (${active.length})</p><ul class="pairs">${active.join('')}</ul>`);
    if (quiet.length)
      h.push(`<details><summary>No direct reaction with ${quiet.length} others</summary>${esc(quiet.join(', '))}. They still share heat by touch, and the heavier one ends up below when they can move.</details>`);
    h.push('</article>');
  }
  h.push('</div></section>');

  // World rules.
  h.push(`<section id="rules">
<h2>World rules</h2>
<p class="sub">What holds everywhere, for every element.</p>
<ul class="rules">
<li><b>Room temperature is ${AMBIENT} °C.</b> Empty cells are air. Air slowly drifts back to room temperature, which is how hot things cool and steam condenses.</li>
<li><b>Air feeds fire</b> with oxygen strength ${OXIDISER_OF[EMPTY]}. Burning turns touching air into smoke, which feeds nothing, so a sealed space runs out of air.</li>
<li><b>Edges:</b> the bottom and sides are walls. Smoke leaves through the top edge and fades to a faint haze as it ages; other gases stay.</li>
<li><b>Gravity is per element:</b> each falling element has its own acceleration and top speed.</li>
<li><b>Heat flows by touch.</b> Each element has a conductivity and a heat capacity. Burning cells also push heat into their neighbours.</li>
<li><b>Nothing appears from nothing.</b> Movement only swaps cells. Only reactions, burning and phase changes turn one element into another.</li>
<li><b>Phase changes reverse into their source:</b> whatever an element melts or boils into sets back into that same element.</li>
</ul>
</section>`);

  // Summary table of phase changes, compact.
  h.push(`<section id="changes">
<h2>Heating and cooling</h2>
<p class="sub">Elements that change state, and the temperatures they change at.</p>
<table class="findings"><thead><tr><th>Element</th><th>Heating</th><th>Cooling</th><th>Catches fire</th><th>Density</th></tr></thead><tbody>`);
  for (const id of real) {
    const e = ELEMENTS[id];
    const up = upChange(id);
    const down = downChange(id);
    if (!up && !down && e.ignition === undefined) continue;
    h.push(
      `<tr><td>${sw(id)} ${esc(e.name)}</td><td>${up ? esc(`${up.verb.toLowerCase()} at ${n0.format(up.at)} °C into ${up.into.toLowerCase()}`) : ''}</td><td>${down ? esc(`${down.verb.toLowerCase()} below ${n0.format(down.at)} °C into ${down.into.toLowerCase()}`) : ''}</td><td>${e.ignition !== undefined ? `from ${n0.format(e.ignition)} °C` : ''}</td><td>${density(e.density)} kg/m³</td></tr>`,
    );
  }
  h.push('</tbody></table></section>');

  if (audit) {
    h.push(`<section id="audit">
<h2>Audit</h2>
<p class="sub">Every pair of elements is run together for 5 seconds at room temperature, hot (800 °C) and cold (−60 °C). Anything that appears must follow from the rules, no matter may appear from nothing, and pairs that do not react must keep their exact cell counts.</p>`);
    if (audit.rows.length) {
      h.push('<table class="findings"><thead><tr><th>A</th><th>B</th><th>Condition</th><th>Problem</th></tr></thead><tbody>');
      for (const r of audit.rows) {
        const c = r.split('|').slice(1, -1).map((s) => s.trim());
        h.push(`<tr>${c.map((s) => `<td>${esc(s)}</td>`).join('')}</tr>`);
      }
      h.push('</tbody></table>');
    } else {
      h.push(`<p class="stat good" style="display:inline-block"><b>No problems</b> across ${audit.runs} test runs.</p>`);
    }
    h.push('</section>');
  }

  h.push(`</main>
<footer class="wrap">Built by <code>npm run docs</code> from <code>src/sim/elements.ts</code> and <code>src/sim/chem.ts</code>. The same content is in <code>docs/MASTER_LIST.md</code>.</footer>
<script>
const PAIRS = ${JSON.stringify(
    Object.fromEntries([...pair].filter(([, p]) => p.kind !== 'none').map(([k, p]) => [k, [p.kind, p.lines]])),
  )};
const NAMES = ${JSON.stringify(ids.map(nameOf))};
const KEYS = ${JSON.stringify(ids.map(keyOf))};
const LABEL = ${JSON.stringify(Object.fromEntries(KINDS.map((k) => [k.kind, k.label])))};
const N = ${N};
const info = document.querySelector('.info');
const table = document.querySelector('table.matrix');
let lastRow = null, lastCol = null;
table.addEventListener('pointerover', (e) => {
  const td = e.target.closest('td[data-a]');
  if (!td) return;
  const a = +td.dataset.a, b = +td.dataset.b;
  lastRow?.classList.remove('hl'); lastCol?.classList.remove('hl');
  lastRow = td.parentElement; lastRow.classList.add('hl');
  lastCol = table.querySelector('th.col[data-col="' + b + '"]'); lastCol?.classList.add('hl');
  const p = PAIRS[a * N + b];
  const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
  const head = '<div class="head">' + esc(NAMES[a]) + ' + ' + esc(NAMES[b]) + '</div>';
  info.innerHTML = p
    ? head + '<div class="kind"><span class="dot k-' + p[0] + '"></span>' + LABEL[p[0]] + '</div><ul>' + p[1].map((l) => '<li>' + esc(l) + '</li>').join('') + '</ul>'
    : head + '<p>No direct reaction. They share heat by touch, and the heavier one ends up below.</p>';
});
table.addEventListener('click', (e) => {
  const td = e.target.closest('td[data-a]');
  if (!td || KEYS[+td.dataset.a] === 'air') return;
  location.hash = 'el-' + KEYS[+td.dataset.a];
});
// Search and group filters apply to the cards and the matrix rows.
const search = document.querySelector('input.search');
let cat = 'all';
const apply = () => {
  const q = search.value.trim().toLowerCase();
  for (const c of document.querySelectorAll('.card'))
    c.classList.toggle('hidden', (cat !== 'all' && c.dataset.cat !== cat) || (q !== '' && !c.dataset.name.includes(q)));
  for (const r of document.querySelectorAll('table.matrix tbody tr'))
    r.classList.toggle('hidden', cat !== 'all' && r.dataset.cat !== cat && r.dataset.cat !== 'air');
};
search.addEventListener('input', apply);
for (const chip of document.querySelectorAll('.chip'))
  chip.addEventListener('click', () => {
    cat = chip.dataset.cat;
    for (const c of document.querySelectorAll('.chip')) c.classList.toggle('on', c === chip);
    apply();
  });
</script>
</body>
</html>
`);
  return h.join('\n');
}
