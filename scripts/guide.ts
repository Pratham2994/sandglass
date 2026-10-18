/**
 * Element guide: every element in three short lines, by group: what it is,
 * what it does, and what to try. Generated from the element data (name,
 * description, hint), so it always matches the game.
 * Writes docs/GUIDE.md. Run: npm run guide (also part of npm run docs).
 */
import { writeFileSync } from 'node:fs';
import { ELEMENTS, EMPTY } from '../src/sim/elements';
import { tipFor } from '../src/sim/describe';

const GROUPS: [string, string][] = [
  ['powders', 'Powders'],
  ['liquids', 'Liquids'],
  ['gases', 'Gases'],
  ['solids', 'Solids'],
  ['building', 'Building'],
  ['metals', 'Metals'],
  ['fuels', 'Fuels'],
  ['energy', 'Energy'],
  ['explosives', 'Explosives'],
  ['electronics', 'Electronics'],
  ['devices', 'Devices'],
  ['food', 'Food'],
  ['life', 'Life'],
];

/** First sentence of a description: what it is. The rest: what it does. */
function split(blurb: string): [string, string] {
  const k = blurb.indexOf('. ');
  return k < 0 ? [blurb, ''] : [blurb.slice(0, k + 1), blurb.slice(k + 2)];
}

/** How each system works and how to use it, written by hand (the elements below are generated). */
const SYSTEMS: [string, string[]][] = [
  ['Controls', [
    'Left drag paints the selected element; right drag erases; the mouse wheel over the canvas changes the brush size; a middle click on the canvas picks up the element under the pointer.',
    'Heat, Cool and Wind (top of the library) are tools, not elements. The heat tool tops out at 1,500 °C; for more, use lava, thermite or lightning.',
    'Space pauses, the step button moves one frame, the slider slows time, and the scrubber rewinds up to 30 s (draw while rewound to start a new branch).',
    'Point at any cell to read it in the lens (bottom right): what it is, how hot, what it carries, current, pressure, light, and what it reacts with and why. Press I to pin the lens so you can scroll it.',
    'Press / to search; keys 1 to 9 pick recent elements; the list button opens the master list of every pair.',
    'The edges of the canvas hold liquids like a bowl, so "pour a pool on the floor" means just pour it along the bottom. Build a Wall bowl only when you want a small pool of its own. "Open sky" means nothing built above it.',
  ]],
  ['Heat and states', [
    'Every cell has a real temperature. Things melt, boil, freeze and condense at their own points, and heat flows between touching cells.',
    'Red-hot things glow, and anything burning or glowing lights its surroundings.',
  ]],
  ['Fire', [
    'Fire needs fuel, heat and air. Seal a fire in a box and it starves as its smoke replaces the air.',
    'Water, carbon dioxide, nitrogen and argon smother fire; oxygen, ozone, saltpeter and nitric acid feed it.',
    'Smoke fades to a faint haze, and smoke trapped under a roof clears after a while.',
  ]],
  ['Water, soil and keeping a garden wet', [
    'Pour water on dirt and wait a few seconds: the dirt soaks it up and turns dark. Damp soil slowly passes water to drier soil beside it.',
    'Plants drink the soil dry in about a minute. To keep a garden alive, paint a thin cloud (one row) above it for gentle rain, or pour more water now and then. A cloud never throws lightning; a storm cloud does and can burn the garden.',
    'Do not flood a garden: a deep pool on top drowns small seedlings in shade. Point the lens at a leaf to see its water.',
  ]],
  ['Plants and light', [
    'Seeds sprout on damp soil (dirt or sand with water). Plants grow only where light reaches them: open sky, through glass or water, or near a fire or lamp. A roof stops them.',
    'Acorns grow into trees with leaves; seeds into plants that flower at their tips; grass seed into grass; cactus seed on damp sand.',
    'Mushrooms are the opposite: they grow from spores on damp soil only in the dark. Dried plants turn brown and burn easily.',
  ]],
  ['Animals', [
    'Paint animals where they live: fish into water, worms into soil, birds, bees and butterflies in the air, the rest on the ground. They head for food they can see within about 14 cells, eat it, and breed when fed.',
    'They die of heat, cold, or being out of their home too long (walkers drown in water, fish suffocate out of it).',
    'Food web: snakes eat mice and frogs, frogs and spiders eat insects, birds eat seeds and ants, fish eat seeds and algae, worms turn dead plants into dirt, termites chew wood.',
    'Bees and butterflies turn flowers into seeds. Butterflies lay eggs on leaves; the caterpillars eat leaves and grass, spin cocoons, and hatch as butterflies.',
    'Plague mist makes animals sick (a fever that spreads by touch and kills); sprinkle medicine on them to cure it.',
  ]],
  ['Chemistry', [
    'Acids eat metals (giving off hydrogen), rock and wood; bases neutralise acids into warm water; carbonates and baking soda fizz out carbon dioxide.',
    'Salt, sugar and dyes dissolve into water, which then carries them (salt water conducts and freezes lower). Boiling the water leaves the crystals.',
    'Catalysts speed a reaction without being used up (manganese dioxide on hydrogen peroxide). Some reactions run away as they heat (glycerin on permanganate). Some need light (hydrogen and chlorine).',
    'Crystals grow from saturated solution; cabbage juice turns pink in acid and green in a base; yeast ferments sugar water into alcohol.',
  ]],
  ['Electricity', [
    'Draw a closed loop of wire. Paint a battery onto the wire, then a bulb onto the wire elsewhere: current flows round the loop and the bulb glows. With no closed loop, nothing flows.',
    'A longer battery gives more volts, a thicker one more current; batteries in one loop help each other. Paint parts at least as wide as the wire, so no wire is left round them.',
    'Click a switch to open or close it. LEDs and diodes pass current one way; an LED needs a resistor or it burns out. A loop with nothing in it is a short circuit: the wire heats and the battery can burst into flame.',
    'Capacitors store charge, motors carry what rests on them, electromagnets pull iron while powered, solar panels power a loop in daylight, salt water conducts and splits into gas. The lens shows amps and volts.',
  ]],
  ['Pressure', [
    'Liquid turning into gas in a sealed box (boiling water, a fizzing reaction) builds pressure until the walls burst. In the open it just drifts away.',
    'Build walls at least four cells thick to seal a box. A valve in the wall vents the pressure. Propane and air tanks rupture in heat or a blast.',
  ]],
  ['Structure', [
    'Stone, brick, concrete, ice, glass and wood need holding up: each reaches only so far past a support (stone 6 cells, concrete 16, steel beam 60). Wall never falls.',
    'What nothing holds breaks off and falls as a block; a block sinks in liquid lighter than itself and floats on heavier. A long drop cracks stone into gravel.',
    'Rope and chain hold up what hangs below them; burn a rope and the load falls.',
  ]],
  ['Explosives', [
    'TNT, gunpowder and fireworks go off from a flame; C4 needs a spark, a fuse or great heat. A long charge goes off as a fast wave from where it was lit.',
    'A fuse burns along like a rope and sets off what is at its end. Nitrogen triiodide goes off at the lightest touch.',
  ]],
  ['Nuclear', [
    'A small piece of uranium only stays warm. Pack about 45 cells together and it goes critical: it heats fast, flings neutrons, melts down into corium and can blow apart.',
    'Control rods, lead, concrete and water soak up neutrons: push rods into a pile to calm it.',
  ]],
  ['Weather and sky', [
    'Clouds rain (or snow below 0 °C); storm clouds rain, hail and throw lightning. Lightning melts sand into glass, lights fires and sends current down wires.',
    'Fireworks launch rockets that burst into falling embers; sparklers spit sparks as they burn.',
  ]],
];

const out: string[] = [];
const count = ELEMENTS.length - 1;
out.push('# Sandglass guide', '');
out.push(`Generated by \`npm run guide\`. First how each system works and how to use it, then all ${count} elements by group: what it is, what it does, and what to try.`, '');
out.push('## How the systems work', '');
for (const [title, lines] of SYSTEMS) {
  out.push(`### ${title}`, '');
  for (const line of lines) out.push(`- ${line}`);
  out.push('');
}
out.push('## Elements', '');
for (const [cat, title] of GROUPS) {
  const ids = ELEMENTS.map((_, id) => id).filter((id) => id !== EMPTY && ELEMENTS[id].category === cat);
  if (!ids.length) continue;
  out.push(`### ${title} (${ids.length})`, '');
  for (const id of ids) {
    const e = ELEMENTS[id];
    const [what, does] = split(e.blurb);
    const tip = tipFor(id);
    out.push(`**${e.name}.** ${what}`);
    if (does) out.push(`${does}`);
    if (tip) out.push(`*Try:* ${tip}`);
    out.push('');
  }
}
writeFileSync('docs/GUIDE.md', out.join('\n'));
console.log(`Wrote docs/GUIDE.md (${count} elements).`);
