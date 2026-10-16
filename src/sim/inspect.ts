import { P_MIN_T, P_RULE, explain } from './chem';
import { downChange, upChange } from './describe';
import { ELEMENTS, ELEMENT_COUNT, EMPTY, FIRE, FUEL_OF, OXIDISER_OF, VY_UNIT } from './elements';
import type { World } from './world';

export interface Reaction {
  text: string;
  /** True if its conditions hold right now (it may still wait on chance). */
  active: boolean;
}

export interface CellReport {
  x: number;
  y: number;
  key: string;
  name: string;
  /** What the cell is doing, in a word or two: "Burning", "Falling". */
  state: string;
  facts: [string, string][];
  reactions: Reaction[];
}

const n0 = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 });
const n1 = new Intl.NumberFormat('en-GB', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const FPS = 60;
/** At most this many reaction lines; the rest are counted. */
const MAX_REACTIONS = 4;
const DIRS = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
] as const;

function label(id: number): string {
  return id === EMPTY ? 'air' : ELEMENTS[id].name.toLowerCase();
}

/**
 * Everything the inspect lens shows for one cell, read from the world
 * arrays and the compiled pair table. Each line is a plain sentence:
 * what it is, how hot and which way its temperature is going (and why),
 * how far it is from its next change, and what is happening with what it
 * touches, with the reason.
 */
export function inspectCell(world: World, x: number, y: number): CellReport | null {
  if (x < 0 || y < 0 || x >= world.w || y >= world.h) return null;
  const { w, h } = world;
  const i = y * w + x;
  const t = world.type[i];
  const e = ELEMENTS[t];
  const T = world.temp[i];

  const nb: number[] = [];
  for (const [dx, dy] of DIRS) {
    const nx = x + dx;
    const ny = y + dy;
    if (nx >= 0 && ny >= 0 && nx < w && ny < h) nb.push(ny * w + nx);
  }

  // Temperature, and which way it is heading: the biggest gap with a neighbour drives it.
  let gapMax = 0;
  let gapId = -1;
  for (const j of nb) {
    const d = world.temp[j] - T;
    if (Math.abs(d) > Math.abs(gapMax)) {
      gapMax = d;
      gapId = world.type[j];
    }
  }
  let tempText = `${n1.format(T)} °C`;
  if (gapId >= 0 && Math.abs(gapMax) >= 3) {
    // Same element next to it: say so plainly, not "steam losing heat to steam".
    const cause = gapId === t ? `the cells around it are ${gapMax > 0 ? 'hotter' : 'colder'}` : `${gapMax > 0 ? 'hotter' : 'colder'} ${label(gapId)} touches it`;
    tempText += `, ${gapMax > 0 ? 'warming' : 'cooling'}: ${cause}`;
  }
  const facts: [string, string][] = [['Temperature', tempText]];

  let name = e.name;
  let state = e.phase === 'energy' ? 'Energy' : e.phase[0].toUpperCase() + e.phase.slice(1);
  if (t === FIRE) {
    const fuel = world.solute[i];
    if (fuel !== 0) {
      name = `Burning ${ELEMENTS[fuel].name.toLowerCase()}`;
      state = 'Burning';
      facts.push(['Fuel left', `${n1.format(world.life[i] / FPS)} s of ${n1.format(FUEL_OF[fuel] / FPS)} s`]);
    } else {
      state = 'Flame';
      facts.push(['Burns out in', `${n1.format(world.life[i] / FPS)} s`]);
    }
  } else if (t === EMPTY) {
    state = 'Air';
  }
  const vy = world.vy[i];
  if (vy > 0) {
    state = 'Falling';
    facts.push(['Falling at', `${n0.format((vy / VY_UNIT) * FPS)} cells/s`]);
  }

  // How far it is from its next change of state.
  const up = upChange(t);
  if (up) {
    const togo = up.at - T;
    facts.push([up.verb, `at ${n0.format(up.at)} °C into ${up.into.toLowerCase()}${togo > 0.5 ? `, ${n0.format(togo)} °C hotter to go` : ', now'}`]);
  }
  const down = downChange(t);
  if (down) {
    const togo = T - down.at;
    facts.push([down.verb, `below ${n0.format(down.at)} °C into ${down.into.toLowerCase()}${togo > 0.5 ? `, ${n0.format(togo)} °C colder to go` : ', now'}`]);
  }
  if (e.ignition !== undefined && t !== FIRE) {
    const togo = e.ignition - T;
    facts.push(['Catches fire', `at ${n0.format(e.ignition)} °C in air${togo > 0.5 ? `, ${n0.format(togo)} °C hotter to go` : ', hot enough now'}`]);
  }

  // What is happening with what it touches, one line per distinct reason.
  const reactions: Reaction[] = [];
  const seen = new Set<string>();
  const add = (r: Reaction): void => {
    if (seen.has(r.text)) return;
    seen.add(r.text);
    reactions.push(r);
  };
  if (t !== EMPTY) {
    for (const j of nb) {
      const b = world.type[j];
      const k = t * ELEMENT_COUNT + b;
      if (P_RULE[k] === 0) continue;
      const text = explain(t, b);
      if (!text) continue;
      if (T >= P_MIN_T[k]) add({ text, active: true });
      else add({ text: `Not yet: ${text[0].toLowerCase()}${text.slice(1)}. It is ${n0.format(T)} °C.`, active: false });
    }
  }
  if (t === FIRE && world.solute[i] !== 0) {
    let ox = 0;
    for (const j of nb) {
      const b = world.type[j];
      ox = Math.max(ox, b === FIRE && world.solute[j] === 0 ? OXIDISER_OF[EMPTY] : OXIDISER_OF[b]);
    }
    if (ox > OXIDISER_OF[EMPTY]) add({ text: 'Oxygen touching it: burning hotter and faster than in air', active: true });
    else if (ox > 0) add({ text: 'Air touching it keeps it burning', active: true });
    else add({ text: 'Nothing touching it can feed the fire: it is going out', active: false });
  }
  if (reactions.length > MAX_REACTIONS) {
    const more = reactions.length - (MAX_REACTIONS - 1);
    reactions.length = MAX_REACTIONS - 1;
    reactions.push({ text: `and ${more} more`, active: false });
  }
  return { x, y, key: e.key, name, state, facts, reactions };
}
