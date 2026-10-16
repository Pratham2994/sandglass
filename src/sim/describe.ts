import { explain } from './chem';
import {
  AMBIENT,
  DOWN_INTO,
  ELEMENTS,
  ELEMENT_COUNT,
  EMPTY,
  ENTER_P,
  OXIDISER_OF,
  PHASE_OF,
  PH_LIQUID,
  UP_INTO,
  type ElementDef,
} from './elements';

/**
 * Plain-language facts about elements, shared by the library card, the
 * inspect lens and the master list, so all three say the same thing.
 * Facts are stated as rules ("sinks through liquids lighter than
 * 1,600 kg/m³"), not lists of elements, so they stay short with hundreds
 * of elements.
 */

export const num = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 2 });
const n0 = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 });

/** Melting or boiling point of element id (the change going up), or null. */
export function upChange(id: number): { verb: string; at: number; into: string } | null {
  const e = ELEMENTS[id];
  if (e.melt !== undefined && e.meltInto) return { verb: 'Melts', at: e.melt, into: ELEMENTS[UP_INTO[id]].name };
  if (e.boil !== undefined && e.boilInto) return { verb: e.phase === 'solid' || e.phase === 'powder' ? 'Sublimes' : 'Boils', at: e.boil, into: ELEMENTS[UP_INTO[id]].name };
  return null;
}

/** Freezing or condensing point of element id (the change going down), or null. */
export function downChange(id: number): { verb: string; at: number; into: string } | null {
  const from = DOWN_INTO[id];
  if (from === 0) return null;
  const f = ELEMENTS[from];
  const at = f.melt !== undefined && f.meltInto === ELEMENTS[id].key ? f.melt : (f.boil ?? 0);
  return { verb: ELEMENTS[id].phase === 'gas' ? 'Condenses' : 'Freezes', at, into: f.name };
}

/** Facts for the library card and master list, one short line each. */
export function elementFacts(id: number): [string, string][] {
  const e: ElementDef = ELEMENTS[id];
  const out: [string, string][] = [];
  const state = e.phase === 'energy' ? 'Energy' : e.phase[0].toUpperCase() + e.phase.slice(1);
  out.push(['State', `${state}, ${density(e.density)} kg/m³`]);
  if (e.temp !== undefined && e.temp !== AMBIENT) out.push(['Starts at', `${n0.format(e.temp)} °C`]);

  // Weight against liquids, as a rule.
  if (e.phase === 'powder' || e.phase === 'liquid') {
    let lighter = false;
    let heavier = false;
    for (let b = 1; b < ELEMENT_COUNT; b++) {
      if (b === id || PHASE_OF[b] !== PH_LIQUID) continue;
      if (ELEMENTS[b].density < e.density) lighter = true;
      else if (ELEMENTS[b].density > e.density) heavier = true;
    }
    const parts: string[] = [];
    if (lighter) parts.push(`sinks through liquids lighter than ${n0.format(e.density)} kg/m³`);
    if (heavier) parts.push(e.phase === 'powder' ? 'rests on heavier ones' : 'floats on heavier ones');
    if (parts.length) out.push(['In liquids', capital(parts.join(', '))]);
  }
  if (e.phase === 'gas' && id !== EMPTY) {
    out.push(['In air', e.density < ELEMENTS[EMPTY].density ? 'Rises (lighter than air)' : 'Sinks slowly (heavier than air)']);
  }
  if (e.fallMax) out.push(['Falls', `up to ${n0.format(e.fallMax)} cells/s`]);

  const up = upChange(id);
  if (up) out.push([up.verb, `at ${n0.format(up.at)} °C, into ${up.into.toLowerCase()}`]);
  const down = downChange(id);
  if (down) out.push([down.verb, `below ${n0.format(down.at)} °C, into ${down.into.toLowerCase()}`]);

  if (e.explosive) {
    out.push([
      'Explodes',
      `from ${n0.format(e.ignition ?? 0)} °C or a flame${e.impact ? ', or when it lands hard' : ''}; blast radius ${e.explosive.radius} cells`,
    ]);
  } else if (e.ignition !== undefined) {
    const left = e.burnInto && e.burnInto !== 'empty' ? `, leaves ${ELEMENTS.find((x) => x.key === e.burnInto)!.name.toLowerCase()}` : '';
    out.push(['Burns', `from ${n0.format(e.ignition)} °C in air, ${num.format((e.fuel ?? 0) / 60)} s per cell${left}`]);
    if (e.flash !== undefined) out.push(['Flash point', `${n0.format(e.flash)} °C: above it, flames spread across it`]);
  }
  if (e.electric) out.push(['Conducts', 'electric charge, warming as pulses pass']);
  if (e.solvent) out.push(['Conducts', 'only when it carries salt; current then splits it into hydrogen and oxygen']);
  if (e.powerEvery) out.push(['Powers', `touching conductors with a pulse every ${num.format(e.powerEvery / 60)} s`]);
  if (e.growsInto) out.push(['Grows', `into ${ELEMENTS.find((x) => x.key === e.growsInto)!.name.toLowerCase()} on damp soil (wet dirt or sand), even under a puddle`]);
  const nameOf = (key: string | undefined): string => (key ? ELEMENTS.find((x) => x.key === key)!.name.toLowerCase() : '');
  if (e.topInto && e.topInto !== e.leafInto) out.push(['Flowers', `each stem ends in ${nameOf(e.topInto)}`]);
  if (e.leafInto) out.push(['Leaves', `grows ${nameOf(e.leafInto)} beside its branches`]);
  if (e.bake) out.push(['Bakes', `at ${n0.format(e.bake.at)} °C into ${nameOf(e.bake.into)}${e.bake.gas ? `, giving off ${nameOf(e.bake.gas)}` : ''}; there is no way back`]);
  if (e.setsInto) out.push(['Sets', `with water into ${nameOf(e.setsInto)}${(e.setHeat ?? 0) >= 50 ? ', getting very hot' : ''}`]);
  if (e.rustsInto) out.push(['Rusts', `slowly into ${nameOf(e.rustsInto)} where water or oxygen touches it`]);
  if (e.rotsInto) out.push(['Rots', `slowly into ${nameOf(e.rotsInto)} where water touches it`]);
  if (e.carbonate) out.push(['Fizzes', 'into carbon dioxide when acid eats or neutralises it']);
  if (e.acidGas) out.push(['In water', `dissolves and turns the water into ${nameOf(e.acidGas)}`]);
  if (e.toxic) out.push(['Poisons', 'living things it touches: they wither']);
  if (e.selfFed) out.push(['Burns without air', 'it carries its own oxygen']);
  if (e.noFlame) out.push(['A flame', `will not light it; it needs ${n0.format(e.ignition ?? 0)} °C${e.explosive ? ' or a spark' : ''}`]);
  if (e.holdTemp !== undefined) out.push(['Holds', `itself at ${n0.format(e.holdTemp)} °C`]);
  if (e.clones) out.push(['Copies', 'the first element that touches it into the space around']);
  if (e.voids) out.push(['Deletes', 'anything that touches it, except walls and devices']);
  if (e.blows) out.push(['Blows', 'air upwards above it']);
  if (e.rainsInto) out.push(['Rains', `${nameOf(e.rainsInto)}${e.rainsColdInto ? `, or ${nameOf(e.rainsColdInto)} below 0 °C` : ''}, until it runs dry`]);
  if ((e.chargeHeat ?? 4) > 20) out.push(['Glows', 'when current heats it, fading when the power stops']);
  if (e.creature) {
    const where = { water: 'swims in water; out of it, it suffocates', ground: 'walks over the ground and climbs steps; water drowns it', soil: 'digs through soil; dried out above ground, it dies', air: 'flies in open air; water drowns it' }[e.creature.lives];
    out.push(['Habitat', where]);
    const foods = Object.keys(e.creature.eats ?? {}).map((k) => nameOf(k));
    if (foods.length) out.push(['Eats', `${foods.join(', ')}; fed, it breeds`]);
    out.push(['Dies', `of heat over 55 °C or cold below −5 °C, into ${nameOf(e.creature.diesInto)}`]);
  }
  if (e.waterLoss !== undefined && e.waterLoss < 1) out.push(['Thrifty', 'loses water very slowly, so it outlasts a drought']);
  if (e.witherInto) out.push(['Lives', `on water drawn from damp soil; dried out, it withers into ${ELEMENTS.find((x) => x.key === e.witherInto)!.name.toLowerCase()}`]);
  if (e.brittle) out.push(['Shatters', `into ${e.breaksInto ?? 'pieces'} when a blast hits it`]);
  if ((e.oxidiser ?? 0) > 0 && id !== EMPTY) out.push(['Feeds fire', `strength ${num.format(e.oxidiser ?? 0)} (air is 0.21)`]);
  if ((e.acidity ?? 0) >= 0.3) out.push(['Eats', `metal, rock and wood softer than ${num.format(e.acidity ?? 0)}, weakening as it fills`]);
  if (e.solvent) out.push(['Dissolves', 'soluble powders (salt, sugar), up to each one’s limit; saltier is heavier']);
  if ((e.solubility ?? 0) > 0) out.push(['Dissolves in', `water, up to ${n0.format((e.solubility ?? 0) * 100)}% of a cell; boiling leaves it as crystals`]);
  if ((e.porosity ?? 0) > 0) out.push(['Soaks up', `water, up to ${n0.format((e.porosity ?? 0) * 100)}% of a cell; wet, it holds steeper slopes and will not burn`]);
  if (e.cls === 'metal' || e.cls === 'mineral' || e.cls === 'organic') {
    if (e.phase === 'solid' || e.phase === 'powder') out.push(['Hardness', `${num.format(e.hardness)} (acid stronger than this eats it)`]);
  }
  return out;
}

/** Density with enough digits for gases (0.09) and none for solids (7,870). */
export function density(d: number): string {
  return d < 10 ? num.format(d) : n0.format(d);
}

function capital(s: string): string {
  return s[0].toUpperCase() + s.slice(1);
}

/** One line describing what happens when element a meets element b, or null. Both directions are covered by the caller. */
export function pairLines(a: number, b: number): string[] {
  const A = ELEMENTS[a];
  const B = ELEMENTS[b];
  const lines: string[] = [];
  const reason = explain(a, b);
  if (reason) lines.push(reason);
  // Weight: who ends up below whom.
  if (ENTER_P[a * ELEMENT_COUNT + b] > 0 && ENTER_P[a * ELEMENT_COUNT + b] < 255) {
    if (B.phase === 'liquid') lines.push(`${A.name} sinks through ${B.name.toLowerCase()} (${n0.format(A.density)} vs ${n0.format(B.density)} kg/m³)`);
    else if (B.phase === 'gas' || B.phase === 'energy') lines.push(`${A.name} falls through ${B.name.toLowerCase()}`);
  }
  // Heat: can A's own heat or cold change B? Only for elements that start
  // hot or cold; at room temperature it is the world rule, not a pairing.
  const Ta = A.temp ?? AMBIENT;
  if (Ta === AMBIENT) {
    if (OXIDISER_OF[a] > OXIDISER_OF[EMPTY] && B.ignition !== undefined) lines.push(`${A.name} makes burning ${B.name.toLowerCase()} hotter and faster`);
    return lines;
  }
  const up = upChange(b);
  if (up && Ta > AMBIENT && Ta > up.at + 2) lines.push(`${A.name} (${n0.format(Ta)} °C) is hot enough to ${up.verb === 'Melts' ? 'melt' : up.verb === 'Sublimes' ? 'turn' : 'boil'} ${B.name.toLowerCase()} into ${up.into.toLowerCase()}`);
  const down = downChange(b);
  if (down && Ta < AMBIENT && Ta < down.at - 2) lines.push(`${A.name} (${n0.format(Ta)} °C) is cold enough to ${down.verb === 'Freezes' ? 'freeze' : 'condense'} ${B.name.toLowerCase()} into ${down.into.toLowerCase()}`);
  if (B.ignition !== undefined && Ta >= B.ignition && A.phase !== 'energy') {
    lines.push(`${A.name} (${n0.format(Ta)} °C) can set ${B.name.toLowerCase()} on fire (it ignites at ${n0.format(B.ignition)} °C)`);
  }
  return lines;
}
