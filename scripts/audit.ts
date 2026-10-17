/**
 * Pairwise audit: every ordered pair of elements, in three conditions (room
 * temperature, hot, cold), simulated together in a small closed world. Every
 * element that appears must be explained by the rules: phase changes, burn
 * products, compiled reactions, crystals, electrolysis, rubble, shards and
 * growth, followed through to their own products. Anything else is flagged,
 * as are broken temperatures (NaN, infinite) and matter appearing from
 * nothing. Writes docs/AUDIT.md.
 * Run: npm run audit
 */
import { writeFileSync } from 'node:fs';
import { availableParallelism } from 'node:os';
import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';
import { KEEP, P_GAS, P_OUT_A, P_OUT_B, P_RULE } from '../src/sim/chem';
import {
  BLAST_POWER_OF,
  BREAKS_INTO_OF,
  BURN_INTO_OF,
  DOWN_INTO,
  DOWN_T,
  ELECTRIC_OF,
  ELEMENTS,
  ELEMENT_COUNT,
  EMPTY,
  FIRE,
  GRAVEL,
  GROWS_INTO_OF,
  WITHER_INTO_OF,
  BAKE_INTO_OF,
  CLONES_OF,
  DEVICE_OF,
  LEAF_INTO_OF,
  RAIN_COLD_OF,
  RAIN_INTO_OF,
  TOP_INTO_OF,
  DIES_INTO_OF,
  BOLT_OF,
  CURES_INTO_OF,
  BURSTS_INTO_OF,
  LAUNCHES_AS_OF,
  LIGHTNING,
  LIGHTNING_FROM_OF,
  EATS,
  HABITAT_OF,
  BAKE_GAS_OF,
  HYDROGEN,
  IGNITION_OF,
  LIFE_OF,
  OXYGEN,
  PHASE_OF,
  PH_ENERGY,
  PH_GAS,
  PH_LIQUID,
  EMF_OF,
  CAPACITOR_OF,
  BURNS_OUT_INTO_OF,
  RUBBLE_OF,
  SMOKE,
  SOLVENT_OF,
  UP_INTO,
  UP_T,
  VENTS_OF,
  WATER,
} from '../src/sim/elements';
import { step } from '../src/sim/step';
import { World } from '../src/sim/world';

const N = ELEMENT_COUNT;
const W = 32;
const H = 24;
const FRAMES = 300;
const SCENES = [
  { name: 'room', temp: null as number | null },
  { name: 'hot', temp: 800 },
  { name: 'cold', temp: -60 },
];
const name = (id: number): string => (id === EMPTY ? 'air' : ELEMENTS[id].name);

/** Everything the rules allow to appear when elements `start` meet, followed to a fixed point. */
function allowed(start: number[]): Set<number> {
  const set = new Set<number>([EMPTY, ...start]);
  const add = (id: number): boolean => {
    if (id === KEEP || set.has(id)) return false;
    set.add(id);
    return true;
  };
  let grew = true;
  while (grew) {
    grew = false;
    const now = [...set];
    for (const e of now) {
      if (UP_T[e] !== Infinity) grew = add(UP_INTO[e]) || grew;
      if (DOWN_T[e] !== -Infinity) grew = add(DOWN_INTO[e]) || grew;
      if (RUBBLE_OF[e]) grew = add(RUBBLE_OF[e]) || grew;
      if (BREAKS_INTO_OF[e]) grew = add(BREAKS_INTO_OF[e]) || grew;
      if (GROWS_INTO_OF[e]) grew = add(GROWS_INTO_OF[e]) || grew;
      if (WITHER_INTO_OF[e]) grew = add(WITHER_INTO_OF[e]) || grew;
      if (BAKE_INTO_OF[e]) grew = add(BAKE_INTO_OF[e]) || grew;
      if (BAKE_GAS_OF[e]) grew = add(BAKE_GAS_OF[e]) || grew;
      if (LEAF_INTO_OF[e]) grew = add(LEAF_INTO_OF[e]) || grew;
      if (TOP_INTO_OF[e]) grew = add(TOP_INTO_OF[e]) || grew;
      if (RAIN_INTO_OF[e]) grew = add(RAIN_INTO_OF[e]) || grew;
      if (RAIN_COLD_OF[e]) grew = add(RAIN_COLD_OF[e]) || grew;
      if (DIES_INTO_OF[e]) grew = add(DIES_INTO_OF[e]) || grew;
      if (BOLT_OF[e]) grew = add(BOLT_OF[e]) || grew;
      if (CURES_INTO_OF[e]) grew = add(CURES_INTO_OF[e]) || grew;
      if (LAUNCHES_AS_OF[e]) grew = add(LAUNCHES_AS_OF[e]) || grew;
      if (BURSTS_INTO_OF[e]) grew = add(BURSTS_INTO_OF[e]) || grew;
      if (LIGHTNING_FROM_OF[e]) grew = add(LIGHTNING) || grew;
      // Circuit parts: an LED burns out, an overcharged capacitor pops into smoke.
      if (BURNS_OUT_INTO_OF[e]) grew = add(BURNS_OUT_INTO_OF[e]) || grew;
      if (CAPACITOR_OF[e]) grew = add(SMOKE) || grew;
      for (const o of now) if (EATS[e * N + o] > 1) grew = add(EATS[e * N + o] - 1) || grew;
      if (IGNITION_OF[e] !== Infinity || BLAST_POWER_OF[e] > 0 || PHASE_OF[e] === PH_ENERGY) {
        grew = add(FIRE) || grew;
        grew = add(SMOKE) || grew;
        if (BURN_INTO_OF[e]) grew = add(BURN_INTO_OF[e]) || grew;
      }
      // Solids that set over nothing become rubble even mid-drain; cooled lava's rubble.
      if (e === GRAVEL) grew = add(GRAVEL) || grew;
      for (const o of now) {
        const k = e * N + o;
        if (P_RULE[k] === 0) continue;
        if (P_OUT_A[k] !== KEEP) grew = add(P_OUT_A[k]) || grew;
        if (P_OUT_B[k] !== KEEP) grew = add(P_OUT_B[k]) || grew;
        if (P_GAS[k]) grew = add(P_GAS[k]) || grew;
        // A spent acid becomes water carrying what it ate.
        if ((ELEMENTS[e].acidity ?? 0) >= 0.3) grew = add(WATER) || grew;
      }
    }
    // Electrolysis: current (a conductor plus a power source or spark) through water.
    const current = [...set].some((e) => EMF_OF[e] || CAPACITOR_OF[e] || PHASE_OF[e] === PH_ENERGY) && [...set].some((e) => ELECTRIC_OF[e]);
    if (current && [...set].some((e) => SOLVENT_OF[e])) {
      grew = add(HYDROGEN) || grew;
      grew = add(OXYGEN) || grew;
    }
  }
  return set;
}

interface Finding {
  a: string;
  b: string;
  scene: string;
  problem: string;
}

const findings: Finding[] = [];

// ---- Static checks on the derived phase-change rules -------------------------
// The reverse of a change belongs to the first element that melts or boils
// into a target. Any other source comes back as that owner, not as itself:
// smoke once condensed into mercury this way. Listed exceptions are intended.
const REVERSE_OK = new Set(['gravel', 'snow', 'obsidian', 'steel', 'hail', 'basalt', 'granite']);
for (let e = 1; e < N; e++) {
  if (UP_T[e] === Infinity) continue;
  const into = UP_INTO[e];
  const def = ELEMENTS[e];
  if (def.boilInto && PHASE_OF[into] !== PH_GAS)
    findings.push({ a: name(e), b: '-', scene: 'rules', problem: `boils into ${name(into)}, which is not a gas` });
  if (def.meltInto && PHASE_OF[into] !== PH_LIQUID)
    findings.push({ a: name(e), b: '-', scene: 'rules', problem: `melts into ${name(into)}, which is not a liquid` });
  const back = DOWN_INTO[into];
  if (back !== e && !REVERSE_OK.has(def.key))
    findings.push({ a: name(e), b: '-', scene: 'rules', problem: `turns into ${name(into)}, which sets back into ${name(back)}, not ${name(e)}` });
}

// A product of burning or a reaction that condenses or freezes back must turn
// into the thing it really is, or smoke from a fire rains out as mercury.
// The listed pairs have been checked by hand.
const CONDENSE_OK = new Set(['steam>water', 'water>ice', 'nitrogen>liquid_nitrogen', 'carbon_dioxide>dry_ice', 'oxygen>liquid_oxygen', 'bromine_vapour>bromine']);
const made = new Set<number>([SMOKE]);
for (let e = 1; e < N; e++) {
  if (BURN_INTO_OF[e]) made.add(BURN_INTO_OF[e]);
  if (BREAKS_INTO_OF[e]) made.add(BREAKS_INTO_OF[e]);
  for (let o = 0; o < N; o++) {
    const k = e * N + o;
    if (P_RULE[k] === 0) continue;
    if (P_OUT_A[k] !== KEEP && P_OUT_A[k] !== e && P_OUT_A[k] !== o) made.add(P_OUT_A[k]);
    if (P_OUT_B[k] !== KEEP && P_OUT_B[k] !== e && P_OUT_B[k] !== o) made.add(P_OUT_B[k]);
    if (P_GAS[k]) made.add(P_GAS[k]);
  }
}
for (const x of made) {
  if (DOWN_T[x] === -Infinity) continue;
  if (!CONDENSE_OK.has(`${ELEMENTS[x].key}>${ELEMENTS[DOWN_INTO[x]].key}`))
    findings.push({ a: name(x), b: '-', scene: 'rules', problem: `made by burning or a reaction, yet sets into ${name(DOWN_INTO[x])}` });
}

/**
 * Cells of matter: everything but empty space, flames and smoke (fire turns
 * air into smoke by design). Gases count, so steam that condenses is still
 * the same matter.
 */
const matter = (w: World): number => {
  let n = 0;
  for (let i = 0; i < w.size; i++) {
    const t = w.type[i];
    if (t !== EMPTY && t !== SMOKE && PHASE_OF[t] !== PH_ENERGY) n++;
  }
  return n;
};
/** Does one element turn straight into the other by melting, boiling, freezing or condensing? */
const phasePair = (a: number, b: number): boolean =>
  (UP_T[a] !== Infinity && UP_INTO[a] === b) ||
  (UP_T[b] !== Infinity && UP_INTO[b] === a) ||
  (DOWN_T[a] !== -Infinity && DOWN_INTO[a] === b) ||
  (DOWN_T[b] !== -Infinity && DOWN_INTO[b] === a);
/** Does anything about this element change it on its own (burning, lifetime, venting, current, growth)? */
const active = (e: number): boolean =>
  IGNITION_OF[e] !== Infinity ||
  BLAST_POWER_OF[e] > 0 ||
  LIFE_OF[e] > 0 ||
  VENTS_OF[e] > 0 ||
  EMF_OF[e] > 0 ||
  CAPACITOR_OF[e] > 0 ||
  GROWS_INTO_OF[e] > 0 ||
  DEVICE_OF[e] > 0 ||
  RAIN_INTO_OF[e] > 0 ||
  HABITAT_OF[e] > 0 ||
  PHASE_OF[e] === PH_ENERGY;
/** Simulates every pair whose first element is in `as`; returns the run count and what it found, each with a sort key. */
function runPairs(as: number[]): { runs: number; found: (Finding & { key: number })[] } {
  const found: (Finding & { key: number })[] = [];
  let runs = 0;
  for (const a of as) {
  for (let b = 0; b < N; b++) {
    if (b === a) continue;
    for (let si = 0; si < SCENES.length; si++) {
      const scene = SCENES[si];
      const key = (a * N + b) * SCENES.length + si;
      runs++;
      const world = new World(W, H, 1000 + a * 61 + b);
      // A on the left, B on the right, lower half of a small closed world; edges are walls.
      for (let y = H / 2; y < H; y++)
        for (let x = 0; x < W; x++) {
          const i = y * W + x;
          world.place(i, x < W / 2 ? a : b);
          if (scene.temp !== null && world.type[i] !== EMPTY) world.temp[i] = scene.temp;
        }
      const before = matter(world);
      const countA = world.count(a);
      const countB = world.count(b);
      const seen = new Set<number>();
      let broken = false;
      for (let f = 0; f < FRAMES; f++) {
        step(world);
        if (f % 10 === 0) for (let i = 0; i < world.size; i++) seen.add(world.type[i]);
      }
      for (let i = 0; i < world.size; i++) {
        seen.add(world.type[i]);
        if (!Number.isFinite(world.temp[i])) broken = true;
      }
      const ok = allowed([a, b]);
      const extra = [...seen].filter((e) => !ok.has(e));
      const pair = { a: name(a), b: name(b), scene: scene.name, key };
      if (extra.length) found.push({ ...pair, problem: `unexplained: ${extra.map(name).join(', ')}` });
      if (broken) found.push({ ...pair, problem: 'temperature became NaN or infinite' });
      const after = matter(world);
      // Plants grow, and a bake that gives off gas splits one cell into two (limestone → quicklime + carbon dioxide).
      // Clones make more of what touches them, and a cloud's rain outweighs the cloud.
      const grows = [...ok].some((e) => GROWS_INTO_OF[e] > 0 || BAKE_GAS_OF[e] > 0 || CLONES_OF[e] > 0 || RAIN_INTO_OF[e] > 0 || HABITAT_OF[e] > 0);
      if (after > before && !grows) found.push({ ...pair, problem: `matter grew from ${before} to ${after} cells` });
      // Two elements with no rule between them, neither changed: both counts must be exact.
      const inert = P_RULE[a * N + b] === 0 && P_RULE[b * N + a] === 0 && !active(a) && !active(b) && !phasePair(a, b);
      if (inert && [...seen].every((e) => e === EMPTY || e === a || e === b)) {
        const nowA = world.count(a);
        const nowB = world.count(b);
        if (nowA !== countA || nowB !== countB)
          found.push({ ...pair, problem: `nothing reacted, yet counts changed: ${name(a)} ${countA} to ${nowA}, ${name(b)} ${countB} to ${nowB}` });
      }
    }
  }
  }
  return { runs, found };
}

// Workers each take every k-th first element; the main thread gathers and sorts their findings.
if (!isMainThread) {
  parentPort!.postMessage(runPairs(workerData as number[]));
} else {
  const t0 = Date.now();
  const threads = Math.max(1, Math.min(availableParallelism() - 1, 12));
  const slices: number[][] = Array.from({ length: threads }, () => []);
  for (let a = 1; a < N; a++) slices[a % threads].push(a);
  const results = await Promise.all(
    slices.map(
      (as) =>
        new Promise<{ runs: number; found: (Finding & { key: number })[] }>((resolve, reject) => {
          const w = new Worker(new URL(import.meta.url), { workerData: as });
          w.once('message', resolve);
          w.once('error', reject);
        }),
    ),
  );
  const runs = results.reduce((n, r) => n + r.runs, 0);
  for (const f of results.flatMap((r) => r.found).sort((x, y) => x.key - y.key)) findings.push({ a: f.a, b: f.b, scene: f.scene, problem: f.problem });
  report(runs, t0, threads);
}

function report(runs: number, t0: number, threads: number): void {

const out: string[] = [];
out.push('# Sandglass pairwise audit');
out.push('');
out.push('Generated by `npm run audit`. First, the phase-change rules are checked: whatever an element melts or boils into must set back into that same element. Then every ordered pair of elements is simulated together for 5 s in a small closed world, at room temperature, hot (800 °C) and cold (−60 °C). Anything that appears must be explained by the rules (see `docs/MASTER_LIST.md`), matter must never appear from nothing, and two elements that do not react must keep their exact cell counts.');
out.push('');
out.push(`- Pairs × conditions run: ${runs}`);
out.push(`- Time: ${((Date.now() - t0) / 1000).toFixed(1)} s`);
out.push(`- Findings: ${findings.length}`);
out.push('');
if (findings.length) {
  out.push('| A | B | Condition | Problem |');
  out.push('| --- | --- | --- | --- |');
  for (const f of findings) out.push(`| ${f.a} | ${f.b} | ${f.scene} | ${f.problem} |`);
} else {
  out.push('No findings: every phase change reverses into its own source, every element that appeared is explained by the rules, temperatures stayed finite, no matter appeared from nothing, and pairs that do not react kept their exact counts.');
}
out.push('');
writeFileSync(new URL('../docs/AUDIT.md', import.meta.url), out.join('\n'));
console.log(`Audit: ${runs} runs, ${findings.length} findings, ${threads} threads. Wrote docs/AUDIT.md.`);
}
