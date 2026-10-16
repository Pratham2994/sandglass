/**
 * Writes docs/MASTER_LIST.md: every element, its properties, and what it
 * does with every other element, generated from the element data and the
 * compiled chemistry, so it can never drift from the game.
 * Run: npm run master-list
 */
import { writeFileSync } from 'node:fs';
import { density, elementFacts, num, pairLines, downChange, upChange } from '../src/sim/describe';
import { AMBIENT, ELEMENTS, EMPTY, OXIDISER_OF } from '../src/sim/elements';

const n0 = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 });
const ids = ELEMENTS.map((_, id) => id);
const real = ids.filter((id) => id !== EMPTY);
const cell = (s: string): string => s.replace(/\|/g, '\\|');

const out: string[] = [];
out.push('# Sandglass master list');
out.push('');
out.push('Generated from the game code by `npm run master-list`. Do not edit by hand: change the element data in `src/sim/elements.ts` (or the rules in `src/sim/chem.ts`) and run the script again.');
out.push('');
out.push(`${real.length} elements. Every pair of elements is listed below, in both directions, with what happens and why.`);
out.push('');

out.push('## World rules');
out.push('');
out.push(`- Room temperature is ${AMBIENT} °C. Empty cells are air; air slowly drifts back to room temperature, which is how hot things cool and steam condenses.`);
out.push(`- Air feeds fire with oxygen strength ${num.format(OXIDISER_OF[EMPTY])}. Burning turns touching air into smoke, which feeds nothing, so a sealed space runs out of air.`);
out.push('- The bottom and side edges are walls. Gases that vent (smoke) leave through the top edge; others stay.');
out.push('- Gravity is per element: each falling element has its own acceleration and top speed.');
out.push('- Heat flows between touching cells by conduction (each element has a conductivity and heat capacity). Burning cells also push radiant heat into their neighbours.');
out.push('- Movement only swaps cells, so nothing is created or lost by moving. Reactions and burning change cells into other elements.');
out.push('');

out.push('## Rule families');
out.push('');
out.push('The chemistry compiler applies these general rules to every pair of elements; nobody writes pairs by hand. Hand-written overrides, if any, win.');
out.push('');
out.push('| Rule | Happens when | Result |');
out.push('| --- | --- | --- |');
out.push('| Density | A heavier powder or liquid touches a lighter liquid or gas | It sinks through, swapping places; the bigger the gap, the faster |');
out.push('| Melting, boiling | A cell gets hotter than its melting or boiling point | It becomes its melted or boiled form and absorbs a little heat |');
out.push('| Freezing, condensing | A cell gets colder than the point of whatever melts or boils into it | It becomes that element and releases a little heat |');
out.push('| Rubble | A solid would form (freeze) with nothing solid under it | It forms as its loose rubble instead (lava → gravel) |');
out.push('| Combustion | A flammable cell is at its ignition point and touches an oxidiser, or a loose flame touches it | It becomes fire that remembers its fuel, burns for its fuel time, then leaves its residue |');
out.push('| Corrosion | An acid touches metal, rock or wood softer than its acidity | Both cells are used up; metal gives off hydrogen |');
out.push('| Neutralisation | An acid touches a base | Both become water |');
out.push('');

out.push('## Summary');
out.push('');
out.push('| Element | Group | State | Density kg/m³ | Starts at | Heating | Cooling | Burns |');
out.push('| --- | --- | --- | --- | --- | --- | --- | --- |');
for (const id of real) {
  const e = ELEMENTS[id];
  const up = upChange(id);
  const down = downChange(id);
  out.push(
    `| ${e.name} | ${e.category} | ${e.phase} | ${density(e.density)} | ${n0.format(e.temp ?? AMBIENT)} °C | ${up ? `${up.verb.toLowerCase()} at ${n0.format(up.at)} °C → ${up.into.toLowerCase()}` : ''} | ${down ? `${down.verb.toLowerCase()} below ${n0.format(down.at)} °C → ${down.into.toLowerCase()}` : ''} | ${e.ignition !== undefined ? `from ${n0.format(e.ignition)} °C` : ''} |`,
  );
}
out.push('');

out.push('## Elements');
for (const a of real) {
  const A = ELEMENTS[a];
  out.push('');
  out.push(`### ${A.name}`);
  out.push('');
  out.push(A.blurb);
  out.push('');
  for (const [k, v] of elementFacts(a)) out.push(`- **${k}:** ${cell(v)}`);
  out.push('');
  const lines: string[] = [];
  const quiet: string[] = [];
  for (const b of ids) {
    if (b === a) continue;
    const both = [...new Set([...pairLines(a, b), ...pairLines(b, a)])];
    const who = b === EMPTY ? 'Air' : ELEMENTS[b].name;
    if (both.length) lines.push(`- **${who}:** ${both.map(cell).join('. ')}.`);
    else quiet.push(who);
  }
  out.push(`With other elements (${lines.length} interact):`);
  out.push('');
  out.push(...lines);
  if (quiet.length) {
    out.push('');
    out.push(`No direct interaction with: ${quiet.join(', ')}. They still exchange heat by touch, and the heavier one ends up below when they can move.`);
  }
}
out.push('');

writeFileSync(new URL('../docs/MASTER_LIST.md', import.meta.url), out.join('\n'));
console.log(`Wrote docs/MASTER_LIST.md (${real.length} elements).`);
