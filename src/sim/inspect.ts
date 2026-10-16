import { P_MIN_T, P_RULE, explain } from './chem';
import {
  DOWN_INTO,
  DOWN_T,
  ELEMENTS,
  ELEMENT_COUNT,
  EMPTY,
  FIRE,
  FUEL_OF,
  OXIDISER_OF,
  UP_INTO,
  UP_T,
  VY_UNIT,
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
  /** What the cell is doing, in a few words: "Burning wood", "Falling". */
  state: string;
  facts: [string, string][];
  reactions: Reaction[];
}

const fmt0 = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 });
const fmt1 = new Intl.NumberFormat('en-GB', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const FPS = 60;

/**
 * Everything the inspect lens shows for one cell, read straight from the
 * world arrays and the compiled pair table: element, temperature, what it is
 * doing, how far it is from its next phase change, and each reaction with
 * its current neighbours together with the reason the compiler recorded.
 */
export function inspectCell(world: World, x: number, y: number): CellReport | null {
  if (x < 0 || y < 0 || x >= world.w || y >= world.h) return null;
  const i = y * world.w + x;
  const t = world.type[i];
  const e = ELEMENTS[t];
  const T = world.temp[i];
  const facts: [string, string][] = [['Temperature', `${fmt1.format(T)} °C`]];
  let state = e.phase[0].toUpperCase() + e.phase.slice(1);
  let name = e.name;

  if (t === FIRE) {
    const fuel = world.solute[i];
    if (fuel !== 0) {
      name = `Burning ${ELEMENTS[fuel].name.toLowerCase()}`;
      state = 'Burning';
      facts.push(['Fuel left', `${fmt1.format(world.life[i] / FPS)} s of ${fmt1.format(FUEL_OF[fuel] / FPS)} s`]);
    } else {
      state = 'Loose flame';
      facts.push(['Dies in', `${fmt1.format(world.life[i] / FPS)} s`]);
    }
  } else if (t === EMPTY) {
    state = 'Air';
    facts.push(['Oxygen', `oxidiser ${OXIDISER_OF[EMPTY]}`]);
  }
  const vy = world.vy[i];
  if (vy > 0) {
    state = 'Falling';
    facts.push(['Speed', `${fmt0.format((vy / VY_UNIT) * FPS)} cells/s`]);
  }

  // Next phase change, and how far the temperature is from it.
  if (UP_T[t] !== Infinity) {
    const point = e.melt ?? e.boil ?? 0;
    const verb = e.melt !== undefined ? 'Melts' : 'Boils';
    facts.push([verb, `at ${fmt0.format(point)} °C → ${ELEMENTS[UP_INTO[t]].name} (${gap(T, point)})`]);
  }
  if (DOWN_T[t] !== -Infinity) {
    const from = ELEMENTS[DOWN_INTO[t]];
    const point = from.melt ?? from.boil ?? 0;
    const verb = e.phase === 'gas' ? 'Condenses' : 'Freezes';
    facts.push([verb, `at ${fmt0.format(point)} °C → ${from.name} (${gap(T, point)})`]);
  }
  if (e.ignition !== undefined && t !== FIRE) facts.push(['Ignites', `at ${fmt0.format(e.ignition)} °C (${gap(T, e.ignition)})`]);

  // Reactions with each distinct neighbour, as the cell pass would look them up.
  const reactions: Reaction[] = [];
  const seen = new Set<number>();
  const dirs = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
  ];
  for (const [dx, dy] of dirs) {
    const nx = x + dx;
    const ny = y + dy;
    if (nx < 0 || ny < 0 || nx >= world.w || ny >= world.h) continue;
    const b = world.type[ny * world.w + nx];
    if (seen.has(b)) continue;
    seen.add(b);
    const k = t * ELEMENT_COUNT + b;
    if (t === EMPTY || P_RULE[k] === 0) continue;
    const text = explain(t, b);
    if (!text) continue;
    const minT = P_MIN_T[k];
    const active = T >= minT;
    reactions.push({ text: active ? text : `${text} (needs ${fmt0.format(minT)} °C, now ${fmt0.format(T)} °C)`, active });
  }

  // A burning cell lives on the oxidiser touching it.
  if (t === FIRE && world.solute[i] !== 0) {
    let ox = 0;
    for (const [dx, dy] of dirs) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= world.w || ny >= world.h) continue;
      const nb = world.type[ny * world.w + nx];
      ox = Math.max(ox, nb === FIRE && world.solute[ny * world.w + nx] === 0 ? OXIDISER_OF[EMPTY] : OXIDISER_OF[nb]);
    }
    reactions.push(
      ox > 0
        ? { text: `Kept burning by the air touching it (oxidiser ${fmt1.format(ox)})`, active: true }
        : { text: 'Smothering: nothing it touches can feed the fire', active: false },
    );
  }

  // Heat flow: the biggest temperature gap with a neighbour, the "why" behind melting and boiling.
  let best = 0;
  let bestT = 0;
  let bestB = -1;
  for (const [dx, dy] of dirs) {
    const nx = x + dx;
    const ny = y + dy;
    if (nx < 0 || ny < 0 || nx >= world.w || ny >= world.h) continue;
    const j = ny * world.w + nx;
    const d = world.temp[j] - T;
    if (Math.abs(d) > Math.abs(best)) {
      best = d;
      bestT = world.temp[j];
      bestB = world.type[j];
    }
  }
  if (bestB >= 0 && Math.abs(best) >= 5) {
    const what = bestB === EMPTY ? 'air' : ELEMENTS[bestB].name.toLowerCase();
    reactions.push({
      text: best > 0 ? `Gaining heat from ${what} at ${fmt0.format(bestT)} °C` : `Losing heat to ${what} at ${fmt0.format(bestT)} °C`,
      active: true,
    });
  }
  return { x, y, key: e.key, name, state, facts, reactions };
}

function gap(T: number, point: number): string {
  const d = point - T;
  if (Math.abs(d) < 0.5) return 'at it now';
  return d > 0 ? `${fmt0.format(d)} °C below` : `${fmt0.format(-d)} °C above`;
}
