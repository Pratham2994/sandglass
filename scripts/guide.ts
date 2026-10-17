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

const out: string[] = [];
const count = ELEMENTS.length - 1;
out.push('# Sandglass element guide', '');
out.push(`Generated from the game data by \`npm run guide\`. ${count} elements, by group. For each: what it is, what it does, and what to try.`, '');
for (const [cat, title] of GROUPS) {
  const ids = ELEMENTS.map((_, id) => id).filter((id) => id !== EMPTY && ELEMENTS[id].category === cat);
  if (!ids.length) continue;
  out.push(`## ${title} (${ids.length})`, '');
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
