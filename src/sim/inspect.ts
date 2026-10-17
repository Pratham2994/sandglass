import { P_MIN_T, P_RULE, explain } from './chem';
import { downChange, upChange } from './describe';
import { ampsAt, inLiveCircuit, partInfo } from './circuit';
import {
  CAPACITOR_OF,
  CAP_ZERO,
  DIODE_OF,
  ELEMENTS,
  ELEMENT_COUNT,
  EMF_OF,
  EMPTY,
  FIRE,
  FUEL_OF,
  GATE_OF,
  GATE_PLATE,
  GATE_SWITCH,
  GATE_THERMOSTAT,
  GROWS_INTO_OF,
  LIFE_OF,
  MOTOR_OF,
  OHMS_OF,
  OXIDISER_OF,
  PHASE_OF,
  PH_ENERGY,
  PH_GAS,
  POROUS_MAX_OF,
  SOLVENT_OF,
  VY_UNIT,
  WATER,
  WITHER_INTO_OF,
} from './elements';
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

/** Amps or watts, with enough digits to read a small current. */
function electric(v: number): string {
  return v >= 0.1 ? v.toFixed(2) : v.toFixed(3);
}

/**
 * Circuit lines: current and power, a battery's charge, what a capacitor
 * holds, whether a switch, plate, thermostat or diode lets current through,
 * and, when a part is dark, why. Returns a state word when current flows.
 */
function circuitFacts(world: World, i: number, t: number, facts: [string, string][]): string | null {
  const e = ELEMENTS[t];
  const amps = ampsAt(world, i);
  const live = inLiveCircuit(world, i);
  const part = partInfo(world, i);
  if (EMF_OF[t] !== 0) {
    const left = world.life[i] / LIFE_OF[t];
    if (world.life[i] === 0) facts.push(['Battery', 'flat: it has no charge left']);
    else if (part) facts.push(['Battery', `${n1.format(part.emf)} V (${part.length} ${part.length === 1 ? 'cell' : 'cells'} end to end), ${n0.format(left * 100)}% charge left`]);
    else facts.push(['Battery', `${n1.format(EMF_OF[t])} V a cell end to end, ${n0.format(left * 100)}% charge left`]);
  }
  if (CAPACITOR_OF[t] !== 0) {
    const pops = part ? `; pops past ${n0.format(4 * part.length)} V` : '';
    facts.push(['Holds', `${(Math.abs(world.life[i] - CAP_ZERO) / 1000).toFixed(2)} V of charge${pops}`]);
  }
  if (part?.shorted) facts.push(['Short circuit', 'nothing in the loop slows the current, so it and the wire heat up: put a bulb, motor or resistor in the loop']);
  else if (part && EMF_OF[t] !== 0 && world.life[i] > 0 && !part.connected)
    facts.push(['Loop', 'open: wire must run from one side of the battery, round through the parts, and back to its other side']);
  const gate = GATE_OF[t];
  if (gate === GATE_SWITCH) facts.push(['Switch', world.conc[i] !== 0 ? 'open: click it to close the circuit' : 'closed: click it to open the circuit']);
  if (gate === GATE_THERMOSTAT) facts.push(['Contact', world.conc[i] !== 0 ? 'open: too hot, it closes again below 45 °C' : 'closed: it opens above 60 °C']);
  if (gate === GATE_PLATE) {
    const ph = i >= world.w ? PHASE_OF[world.type[i - world.w]] : 0;
    facts.push(['Plate', ph !== 0 && ph !== PH_GAS && ph !== PH_ENERGY ? 'pressed: something rests on it, so it is closed' : 'up: nothing rests on it, so it is open']);
  }
  if (amps >= 1e-4) {
    const ohms = OHMS_OF[t];
    const watts = amps * amps * ohms;
    facts.push(['Current', watts >= 0.01 ? `${electric(amps)} A, turning ${electric(watts)} W into heat` : `${electric(amps)} A`]);
    if (MOTOR_OF[t] !== 0) return 'Turning';
    return 'Powered';
  }
  const electronic = e.category === 'electronics' && EMF_OF[t] === 0;
  if (!electronic) return null;
  if (DIODE_OF[t] !== 0 && live) {
    const x = i % world.w;
    const y = (i / world.w) | 0;
    const v = (j: number): number => (inLiveCircuit(world, j) ? world.volt[j] : 0);
    const bias = (x > 0 ? v(i - 1) : 0) - (x + 1 < world.w ? v(i + 1) : 0) + (y + 1 < world.h ? v(i + world.w) : 0) - (y > 0 ? v(i - world.w) : 0);
    if (bias < -0.01) {
      facts.push(['Current', 'none: blocked, because the current is trying to go leftwards or downwards through it; it passes only rightwards or upwards']);
      return 'Blocking';
    }
  }
  if (live) facts.push(['Current', 'none: it is joined to a battery, but the loop is not closed: current must run from the battery round to its other side']);
  else if (gate === 0 || world.conc[i] === 0) facts.push(['Current', 'none: it is not joined to a battery with charge']);
  return null;
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
  const so = world.solute[i];
  const cn = world.conc[i];
  const living = WITHER_INTO_OF[t] !== 0;
  if (cn !== 0 && t !== FIRE && so !== 0 && !living) {
    const what = ELEMENTS[so].name.toLowerCase();
    if (e.phase === 'liquid') facts.push(['Carries', `dissolved ${what}, ${n0.format((cn / 255) * 100)}% of the cell`]);
    else facts.push(['Soaked with', `${what}, ${n0.format((cn / 255) * 100)}% of the cell${SOLVENT_OF[so] ? ': will not burn, holds steeper slopes' : ''}`]);
  }

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
  } else if (cn !== 0 && so !== 0 && !living) {
    name = e.phase === 'liquid' ? `${e.name} with ${ELEMENTS[so].name.toLowerCase()}` : `Wet ${e.name.toLowerCase()}`;
  }
  if (world.charge[i] !== 0) facts.push(['Charge', 'a pulse of current is passing through it']);
  const powered = circuitFacts(world, i, t, facts);
  if (powered) state = powered;
  if (living) {
    const into = ELEMENTS[WITHER_INTO_OF[t]].name.toLowerCase();
    facts.push(['Water', cn === 0 ? `none left: it withers into ${into} soon` : `${n0.format((cn / 255) * 100)}% of the cell, drawn from damp soil or water it touches`]);
    if (world.life[i] !== 0) facts.push(['Growing', `${world.life[i]} more cells while its tip has water and room above`]);
  }
  if (GROWS_INTO_OF[t] !== 0) {
    // Say why a seed is waiting, so "nothing happens" is never a mystery.
    const below = i + world.w;
    const damp = below < world.size && POROUS_MAX_OF[world.type[below]] !== 0 && world.solute[below] === WATER && world.conc[below] >= 16;
    const up = i - world.w;
    const room = up >= 0 && (world.type[up] === EMPTY || (world.type[up] === WATER && world.conc[up] === 0));
    const what = ELEMENTS[GROWS_INTO_OF[t]].name.toLowerCase();
    facts.push(['Sprouts', damp && room ? `soon, into ${what}` : !damp ? 'needs damp soil under it (dirt or sand with water)' : 'needs air or fresh water above it']);
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
