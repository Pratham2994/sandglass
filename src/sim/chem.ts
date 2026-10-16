import { ELEMENTS, ELEMENT_COUNT, EMPTY, HYDROGEN, IGNITION_OF, OXIDISER_OF, elementId, type ElementDef } from './elements';

/**
 * Chemistry compiler. Elements only declare physical properties (acidity,
 * hardness, ignition, oxidiser...). At load time, general rule families run
 * over every ordered pair (a, b) and write one entry each into flat pair
 * tables. At runtime a cell looks at one random neighbour and does a single
 * table read, so the generality costs nothing per frame. Hand-written
 * overrides go in first and win. Priority: override, corrosion, combustion,
 * neutralisation (dissolution and absorption arrive with solutes).
 */

export const R_NONE = 0;
export const R_OVERRIDE = 1;
export const R_CORRODE = 2;
export const R_COMBUST = 3;
export const R_NEUTRAL = 4;

/** Output value meaning "this cell stays as it is". */
export const KEEP = 0xffff;

const N = ELEMENT_COUNT;
/** Rule family per pair, 0 = nothing happens. Doubles as the inspector's reason code. */
export const P_RULE = new Uint8Array(N * N);
/** What cell a becomes, or KEEP. */
export const P_OUT_A = new Uint16Array(N * N).fill(KEEP);
/** What cell b becomes, or KEEP. */
export const P_OUT_B = new Uint16Array(N * N).fill(KEEP);
/** Gas released into the cell that became empty, 0 = none. */
export const P_GAS = new Uint16Array(N * N);
/** Chance per try, 0..255. */
export const P_PROB = new Uint8Array(N * N);
/** Fires only when cell a is at least this hot, °C. */
export const P_MIN_T = new Float32Array(N * N).fill(-Infinity);
/** Elements that have at least one reaction, so the cell pass can skip the rest. */
export const HAS_REACTION = new Uint8Array(N);

const overrideReasons = new Map<number, string>();

function prob(p: number): number {
  return Math.max(1, Math.min(255, Math.round(p * 255)));
}

function set(a: number, b: number, rule: number, outA: number, outB: number, gas: number, p: number, minT = -Infinity): void {
  const k = a * N + b;
  P_RULE[k] = rule;
  P_OUT_A[k] = outA;
  P_OUT_B[k] = outB;
  P_GAS[k] = gas;
  P_PROB[k] = prob(p);
  P_MIN_T[k] = minT;
  HAS_REACTION[a] = 1;
}

const corrodes = (A: ElementDef, B: ElementDef): boolean =>
  (A.acidity ?? 0) >= 0.3 &&
  A.phase === 'liquid' &&
  (B.cls === 'metal' || B.cls === 'mineral' || B.cls === 'organic') &&
  (B.phase === 'solid' || B.phase === 'powder') &&
  B.hardness < (A.acidity ?? 0);

function compile(): void {
  for (let a = 1; a < N; a++) {
    const A = ELEMENTS[a];
    for (let b = 0; b < N; b++) {
      if (a === b) continue;
      const B = ELEMENTS[b];
      const k = a * N + b;

      // 1. Overrides win.
      const o = A.overrides?.[B.key];
      if (o) {
        const out = (key: string): number => (key === 'keep' ? KEEP : elementId(key));
        set(a, b, R_OVERRIDE, out(o.self), out(o.other), o.gas ? elementId(o.gas) : 0, o.chance, o.minTemp);
        overrideReasons.set(k, o.reason);
        continue;
      }

      // 2. Corrosion: an acid eats what is softer than it is strong. The acid
      // is spent; metal gives off hydrogen. Seen from either side.
      if (corrodes(A, B) || corrodes(B, A)) {
        const acid = corrodes(A, B) ? A : B;
        const target = acid === A ? B : A;
        const p = ((acid.acidity ?? 0) - target.hardness) * 0.25;
        set(a, b, R_CORRODE, EMPTY, EMPTY, target.cls === 'metal' ? HYDROGEN : 0, p);
        continue;
      }

      // 3. Combustion: hot enough next to an oxidiser, it catches fire. A
      // flame touching it lights it directly (it still needs air to keep burning).
      if (IGNITION_OF[a] !== Infinity && OXIDISER_OF[b] > 0) {
        set(a, b, R_COMBUST, KEEP, KEEP, 0, Math.min(1, 0.25 + OXIDISER_OF[b]), IGNITION_OF[a]);
        continue;
      }
      if (IGNITION_OF[a] !== Infinity && B.phase === 'energy') {
        set(a, b, R_COMBUST, KEEP, KEEP, 0, 1);
        continue;
      }

      // 4. Neutralisation: acid meets base, both become water and heat is released.
      const ac = A.acidity ?? 0;
      const bc = B.acidity ?? 0;
      if ((ac > 0.3 && bc < -0.3) || (ac < -0.3 && bc > 0.3)) {
        set(a, b, R_NEUTRAL, elementId('water'), elementId('water'), 0, 0.3);
      }
    }
  }
}
compile();

const fmt = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 2 });
// (Values come from Float32 tables, so they are always formatted, never printed raw.)

/** Plain-language reason for the reaction of a with b, or null when nothing happens. */
export function explain(a: number, b: number): string | null {
  const k = a * N + b;
  const A = ELEMENTS[a];
  const B = ELEMENTS[b];
  switch (P_RULE[k]) {
    case R_OVERRIDE:
      return overrideReasons.get(k) ?? null;
    case R_CORRODE: {
      const acid = corrodes(A, B) ? A : B;
      const target = acid === A ? B : A;
      const gas = target.cls === 'metal' ? ', giving off hydrogen' : '';
      return `${acid.name} eats ${target.name.toLowerCase()}: acidity ${fmt.format(acid.acidity ?? 0)} beats hardness ${fmt.format(target.hardness)}${gas}`;
    }
    case R_COMBUST:
      if (B.phase === 'energy') return `${A.name} catches from the flame touching it`;
      return `${A.name} burns: it catches fire at ${fmt.format(A.ignition ?? 0)} °C next to ${b === EMPTY ? 'air' : B.name.toLowerCase()} (oxidiser ${fmt.format(OXIDISER_OF[b])})`;
    case R_NEUTRAL:
      return `${A.name} and ${B.name.toLowerCase()} neutralise each other into water`;
    default:
      return null;
  }
}
