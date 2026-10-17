/**
 * Behaviour checks: every element must do what its description promises.
 * Each check builds a small scene, runs the real engine, and measures the
 * promised effect (seed on damp soil grows a plant, wire carries a spark,
 * oil floats on water...). The pairwise audit proves the rules agree with
 * each other; this proves each element actually works. Writes
 * docs/BEHAVIOUR.md and fails (exit code 1) if any check fails.
 * Run: npm run behaviour
 */
import { writeFileSync } from 'node:fs';
import { ELEMENTS, EMPTY, elementId } from '../src/sim/elements';
import { placeBody, step } from '../src/sim/step';
import { ampsAt } from '../src/sim/circuit';
import { OP_TOGGLE, applyOp } from '../src/sim/ops';
import { World } from '../src/sim/world';

const W = 64;
const H = 64;

/** A small closed world (the edges are walls) with helpers for building and measuring. */
class Scene {
  readonly world: World;
  constructor(seed = 7) {
    this.world = new World(W, H, seed);
  }
  id(key: string): number {
    return key === 'empty' ? EMPTY : elementId(key);
  }
  /** Fills a rectangle with an element; temp overrides its starting temperature. */
  fill(x: number, y: number, w: number, h: number, key: string, temp?: number): this {
    const t = this.id(key);
    for (let j = y; j < y + h; j++)
      for (let i = x; i < x + w; i++) {
        if (i < 0 || j < 0 || i >= W || j >= H) continue;
        const k = j * W + i;
        this.world.place(k, t);
        if (temp !== undefined) this.world.temp[k] = temp;
      }
    return this;
  }
  /** Sets the temperature of everything (cells and air) in a rectangle, waking it as the heat tool does. */
  heat(x: number, y: number, w: number, h: number, temp: number): this {
    for (let j = y; j < y + h; j++)
      for (let i = x; i < x + w; i++) {
        this.world.temp[j * W + i] = temp;
        this.world.wake(i, j);
      }
    return this;
  }
  run(frames: number): this {
    for (let f = 0; f < frames; f++) step(this.world);
    return this;
  }
  count(key: string): number {
    return this.world.count(this.id(key));
  }
  /** Mean row of an element (larger is lower); NaN if none. */
  meanY(key: string): number {
    const t = this.id(key);
    let s = 0;
    let n = 0;
    for (let i = 0; i < this.world.size; i++)
      if (this.world.type[i] === t) {
        s += (i / W) | 0;
        n++;
      }
    return n ? s / n : NaN;
  }
  /** Highest row an element reaches (smallest y); H if none. */
  topY(key: string): number {
    const t = this.id(key);
    for (let i = 0; i < this.world.size; i++) if (this.world.type[i] === t) return (i / W) | 0;
    return H;
  }
  /** Sum of dissolved concentration held by cells of an element. */
  held(key: string): number {
    const t = this.id(key);
    let s = 0;
    for (let i = 0; i < this.world.size; i++) if (this.world.type[i] === t) s += this.world.conc[i];
    return s;
  }
  at(x: number, y: number): string {
    const t = this.world.type[y * W + x];
    return t === EMPTY ? 'empty' : ELEMENTS[t].key;
  }
  tempAt(x: number, y: number): number {
    return this.world.temp[y * W + x];
  }
  /** Column heights of an element in columns x0..x1 (cells counted from the floor up). */
  heights(key: string, x0: number, x1: number): number[] {
    const t = this.id(key);
    const out: number[] = [];
    for (let x = x0; x <= x1; x++) {
      let n = 0;
      for (let y = 0; y < H; y++) if (this.world.type[y * W + x] === t) n++;
      out.push(n);
    }
    return out;
  }
}

interface Check {
  element: string;
  claim: string;
  run(): { ok: boolean; detail: string };
}

const fmt = (n: number): string => (Number.isFinite(n) ? (Math.round(n * 10) / 10).toString() : String(n));
const checks: Check[] = [];
const check = (element: string, claim: string, run: Check['run']): void => void checks.push({ element, claim, run });

/** Watches up to `frames` frames, stopping as soon as `done` is true; returns the frame it happened or -1. */
function until(s: Scene, frames: number, done: () => boolean): number {
  for (let f = 0; f < frames; f++) {
    step(s.world);
    if (done()) return f + 1;
  }
  return -1;
}

// ---- Powders --------------------------------------------------------------------

check('sand', 'falls and piles into a slope', () => {
  const s = new Scene().fill(30, 0, 4, 20, 'sand').run(600);
  const h = s.heights('sand', 0, W - 1);
  const peak = Math.max(...h);
  const spread = h.filter((v) => v > 0).length;
  return { ok: s.count('sand') === 80 && peak < 20 && spread > 6, detail: `peak ${peak}, ${spread} columns wide` };
});
check('sand', 'sinks through water', () => {
  const s = new Scene().fill(0, 40, W, 24, 'water').fill(20, 30, 10, 8, 'sand').run(600);
  return { ok: s.meanY('sand') > s.meanY('water'), detail: `sand row ${fmt(s.meanY('sand'))}, water row ${fmt(s.meanY('water'))}` };
});
check('gravel', 'falls and piles', () => {
  const s = new Scene().fill(30, 0, 4, 10, 'gravel').run(400);
  return { ok: s.topY('gravel') > 50, detail: `top of pile at row ${s.topY('gravel')}` };
});
check('ash', 'floats on water', () => {
  const s = new Scene().fill(0, 44, W, 20, 'water').fill(20, 10, 10, 4, 'ash').run(900);
  return { ok: s.meanY('ash') < s.meanY('water'), detail: `ash row ${fmt(s.meanY('ash'))}, water row ${fmt(s.meanY('water'))}` };
});
check('sawdust', 'floats on water', () => {
  const s = new Scene().fill(0, 44, W, 20, 'water').fill(20, 10, 10, 4, 'sawdust').run(900);
  return { ok: s.meanY('sawdust') < s.meanY('water'), detail: `sawdust row ${fmt(s.meanY('sawdust'))}` };
});
check('salt', 'dissolves into water', () => {
  const s = new Scene().fill(0, 50, W, 14, 'water').fill(28, 40, 8, 2, 'salt').run(900);
  return { ok: s.count('salt') < 16 && s.held('water') > 0, detail: `salt cells left ${s.count('salt')} of 16, salt held by water ${s.held('water')}` };
});
check('salt', 'boiling salt water leaves salt behind', () => {
  const s = new Scene().fill(0, 50, W, 14, 'water').fill(20, 44, 24, 2, 'salt').run(900);
  const dissolved = s.count('salt');
  // Keep the pan hot, as a stove would: the steam rains back in the closed box and boils again.
  const f = until(s, 1800, () => (s.heat(0, 56, W, 8, 130), s.count('salt') > dissolved));
  return { ok: f > 0, detail: f > 0 ? `salt crystals after ${f} frames` : `salt ${s.count('salt')}, water ${s.count('water')}` };
});
check('sugar', 'dissolves into water', () => {
  const s = new Scene().fill(0, 50, W, 14, 'water').fill(28, 40, 8, 2, 'sugar').run(900);
  return { ok: s.count('sugar') < 16, detail: `sugar cells left ${s.count('sugar')} of 16` };
});
check('sugar', 'burns when hot', () => {
  const s = new Scene().fill(20, 54, 24, 10, 'sugar', 420);
  const f = until(s, 400, () => s.count('fire') > 0);
  return { ok: f > 0, detail: f > 0 ? `fire after ${f} frames` : 'no fire' };
});
check('dirt', 'soaks up water', () => {
  const s = new Scene().fill(0, 44, W, 20, 'dirt').fill(0, 38, W, 4, 'water').run(900);
  return { ok: s.count('water') < 128 && s.held('dirt') > 0, detail: `water left ${s.count('water')} of 256, held by dirt ${s.held('dirt')}` };
});
check('snow', 'melts into water when warm', () => {
  const s = new Scene().fill(20, 54, 24, 10, 'snow').heat(0, 0, W, H, 25).run(2400);
  return { ok: s.count('water') > 0, detail: `water ${s.count('water')}, snow ${s.count('snow')}` };
});
check('shards', 'falls and piles', () => {
  const s = new Scene().fill(30, 0, 4, 10, 'shards').run(400);
  return { ok: s.topY('shards') > 50, detail: `top of pile at row ${s.topY('shards')}` };
});

// ---- Liquids --------------------------------------------------------------------

check('water', 'flows and settles flat', () => {
  const s = new Scene().fill(0, 24, 16, 40, 'water').run(1500);
  const h = s.heights('water', 0, W - 1);
  return { ok: Math.max(...h) - Math.min(...h) <= 1, detail: `heights ${Math.min(...h)} to ${Math.max(...h)}` };
});
check('water', 'boils into steam when hot', () => {
  const s = new Scene().fill(10, 54, 44, 10, 'water', 140).heat(0, 40, W, 24, 140);
  const f = until(s, 300, () => s.count('steam') > 0);
  return { ok: f > 0, detail: f > 0 ? `steam after ${f} frames` : 'no steam' };
});
check('water', 'freezes into ice when cold', () => {
  const s = new Scene().fill(10, 54, 44, 10, 'water', -30).heat(0, 0, W, H, -30).run(600);
  return { ok: s.count('ice') > 0, detail: `ice ${s.count('ice')}` };
});
check('oil', 'floats on water', () => {
  const s = new Scene().fill(0, 44, W, 10, 'oil').fill(0, 54, W, 10, 'water');
  // Water poured on top of oil must end up below it.
  const t = new Scene().fill(0, 54, W, 10, 'oil').fill(0, 30, W, 10, 'water').run(1200);
  s.run(10);
  return { ok: t.meanY('oil') < t.meanY('water'), detail: `oil row ${fmt(t.meanY('oil'))}, water row ${fmt(t.meanY('water'))}` };
});
check('oil', 'burns once hot enough', () => {
  const s = new Scene().fill(10, 54, 44, 10, 'oil', 320);
  const f = until(s, 400, () => s.count('fire') > 0);
  return { ok: f > 0, detail: f > 0 ? `fire after ${f} frames` : 'no fire' };
});
check('alcohol', 'floats on water', () => {
  const t = new Scene().fill(0, 54, W, 10, 'alcohol').fill(0, 30, W, 10, 'water').run(1200);
  return { ok: t.meanY('alcohol') < t.meanY('water'), detail: `alcohol row ${fmt(t.meanY('alcohol'))}, water row ${fmt(t.meanY('water'))}` };
});
check('alcohol', 'catches fire from a flame', () => {
  const s = new Scene().fill(0, 54, W, 10, 'alcohol').fill(30, 52, 2, 2, 'fire');
  const f = until(s, 300, () => s.count('alcohol') < 600);
  return { ok: f > 0, detail: f > 0 ? `burning after ${f} frames` : 'did not catch' };
});
check('acid', 'eats iron, giving off hydrogen', () => {
  const s = new Scene().fill(10, 54, 44, 10, 'iron').fill(10, 44, 44, 6, 'acid');
  let hydrogen = 0;
  until(s, 900, () => ((hydrogen = Math.max(hydrogen, s.count('hydrogen'))), false));
  return { ok: s.count('iron') < 440 && hydrogen > 0, detail: `iron left ${s.count('iron')} of 440, hydrogen seen ${hydrogen}` };
});
check('acid', 'eats wood', () => {
  const s = new Scene().fill(10, 54, 44, 10, 'wood').fill(10, 44, 44, 6, 'acid').run(900);
  return { ok: s.count('wood') < 440, detail: `wood left ${s.count('wood')} of 440` };
});
check('lava', 'boils water', () => {
  const s = new Scene().fill(0, 54, W, 10, 'water').fill(24, 40, 16, 6, 'lava');
  const f = until(s, 600, () => s.count('steam') > 0);
  return { ok: f > 0, detail: f > 0 ? `steam after ${f} frames` : 'no steam' };
});
check('lava', 'cools into stone', () => {
  const s = new Scene().fill(0, 58, W, 6, 'lava').heat(0, 0, W, 58, 20);
  const f = until(s, 6000, () => s.count('stone') > 0);
  return { ok: f > 0, detail: f > 0 ? `stone after ${f} frames` : `still lava ${s.count('lava')}` };
});
check('lava', 'sets wood alight', () => {
  const s = new Scene().fill(10, 56, 44, 8, 'wood').fill(24, 48, 16, 6, 'lava');
  const f = until(s, 900, () => s.count('fire') > 0);
  return { ok: f > 0, detail: f > 0 ? `fire after ${f} frames` : 'no fire' };
});
check('mercury', 'sinks through water', () => {
  const s = new Scene().fill(0, 44, W, 20, 'water').fill(24, 30, 16, 4, 'mercury').run(900);
  return { ok: s.meanY('mercury') > s.meanY('water'), detail: `mercury row ${fmt(s.meanY('mercury'))}` };
});
check('nitro', 'explodes when dropped hard', () => {
  const s = new Scene().fill(30, 0, 4, 3, 'nitro');
  const f = until(s, 300, () => s.count('nitro') < 12);
  return { ok: f > 0, detail: f > 0 ? `went off after ${f} frames` : 'did not go off' };
});
check('nitro', 'explodes when heated', () => {
  const s = new Scene().fill(20, 58, 24, 6, 'nitro', 260);
  const f = until(s, 300, () => s.count('nitro') < 144);
  return { ok: f > 0, detail: f > 0 ? `went off after ${f} frames` : 'did not go off' };
});
check('molten_copper', 'sets back into wire as it cools', () => {
  const s = new Scene().fill(10, 58, 44, 6, 'molten_copper');
  const f = until(s, 6000, () => s.count('wire') > 0);
  return { ok: f > 0, detail: f > 0 ? `wire after ${f} frames` : 'never set' };
});

// ---- Solids ---------------------------------------------------------------------

check('wall', 'never moves, melts or burns', () => {
  const s = new Scene().fill(20, 30, 24, 4, 'wall', 3000).fill(20, 26, 24, 4, 'fire').fill(20, 34, 24, 4, 'acid').run(600);
  return { ok: s.count('wall') === 96, detail: `wall ${s.count('wall')} of 96` };
});
check('ice', 'melts into water as it warms', () => {
  const s = new Scene().fill(20, 54, 24, 10, 'ice').heat(0, 0, W, 54, 40);
  const f = until(s, 3000, () => s.count('water') > 0);
  return { ok: f > 0, detail: f > 0 ? `water after ${f} frames` : 'still frozen' };
});
check('stone', 'melts into lava when very hot', () => {
  const s = new Scene().fill(20, 54, 24, 10, 'stone', 1200);
  const f = until(s, 300, () => s.count('lava') > 0);
  return { ok: f > 0, detail: f > 0 ? `lava after ${f} frames` : 'did not melt' };
});
check('wood', 'burns down to ash', () => {
  const s = new Scene().fill(20, 50, 24, 14, 'wood').fill(30, 48, 4, 2, 'fire');
  const f = until(s, 3000, () => s.count('ash') > 0);
  return { ok: f > 0 && s.count('wood') < 336, detail: f > 0 ? `ash after ${f} frames, wood left ${s.count('wood')}` : `no ash, wood left ${s.count('wood')}` };
});
check('iron', 'moves heat faster than stone', () => {
  const a = new Scene().fill(0, 60, W, 2, 'iron').fill(0, 59, 4, 4, 'lava');
  const b = new Scene().fill(0, 60, W, 2, 'stone').fill(0, 59, 4, 4, 'lava');
  a.run(600);
  b.run(600);
  return { ok: a.tempAt(20, 61) > b.tempAt(20, 61) + 5, detail: `20 cells along: iron ${fmt(a.tempAt(20, 61))} °C, stone ${fmt(b.tempAt(20, 61))} °C` };
});
check('glass', 'shatters into shards in a blast', () => {
  const s = new Scene().fill(20, 40, 2, 20, 'glass').fill(24, 48, 4, 4, 'tnt', 400);
  const f = until(s, 300, () => s.count('shards') > 0);
  return { ok: f > 0, detail: f > 0 ? `shards after ${f} frames` : 'glass held' };
});
check('tnt', 'heat sets it off', () => {
  const s = new Scene().fill(26, 56, 12, 8, 'tnt', 400);
  const f = until(s, 120, () => s.count('tnt') === 0);
  return { ok: f > 0, detail: f > 0 ? `gone after ${f} frames` : `left ${s.count('tnt')}` };
});
check('gunpowder', 'a flame sets it off', () => {
  const s = new Scene().fill(20, 56, 24, 8, 'gunpowder').fill(30, 54, 2, 2, 'fire');
  const f = until(s, 300, () => s.count('gunpowder') < 96);
  return { ok: f > 0, detail: f > 0 ? `going off after ${f} frames` : 'nothing' };
});

// ---- Gases and energy -------------------------------------------------------------

check('steam', 'rises', () => {
  const s = new Scene().fill(20, 50, 24, 10, 'steam', 150).run(60);
  return { ok: s.meanY('steam') < 50, detail: `steam row ${fmt(s.meanY('steam'))}` };
});
check('steam', 'turns back into water as it cools', () => {
  const s = new Scene().fill(20, 30, 24, 10, 'steam', 150);
  const f = until(s, 4000, () => s.count('water') > 0);
  return { ok: f > 0, detail: f > 0 ? `water after ${f} frames` : 'never condensed' };
});
check('fire', 'burns out on its own', () => {
  const s = new Scene().fill(28, 40, 8, 8, 'fire');
  const f = until(s, 300, () => s.count('fire') === 0);
  return { ok: f > 0, detail: f > 0 ? `out after ${f} frames` : `still ${s.count('fire')}` };
});
check('smoke', 'rises and leaves through the top', () => {
  const s = new Scene().fill(20, 50, 24, 10, 'smoke');
  const f = until(s, 1200, () => s.count('smoke') < 120);
  return { ok: f > 0, detail: f > 0 ? `half gone after ${f} frames` : `left ${s.count('smoke')}` };
});
check('hydrogen', 'shoots upwards', () => {
  const s = new Scene().fill(20, 54, 24, 8, 'hydrogen').run(60);
  return { ok: s.meanY('hydrogen') < 40, detail: `hydrogen row ${fmt(s.meanY('hydrogen'))}` };
});
check('hydrogen', 'burns into steam when lit', () => {
  const s = new Scene().fill(20, 30, 24, 8, 'hydrogen').fill(30, 40, 2, 2, 'fire');
  const f = until(s, 300, () => s.count('steam') > 0);
  return { ok: f > 0, detail: f > 0 ? `steam after ${f} frames` : 'no steam' };
});
check('oxygen', 'sinks and pools low', () => {
  const s = new Scene().fill(20, 10, 24, 8, 'oxygen').run(900);
  return { ok: s.meanY('oxygen') > 40, detail: `oxygen row ${fmt(s.meanY('oxygen'))}` };
});
check('oxygen', 'makes fire burn faster', () => {
  const plain = new Scene().fill(20, 54, 24, 10, 'wood').fill(30, 52, 2, 2, 'fire');
  const rich = new Scene().fill(20, 54, 24, 10, 'wood').fill(0, 30, W, 22, 'oxygen').fill(30, 52, 2, 2, 'fire');
  plain.run(900);
  rich.run(900);
  return { ok: rich.count('wood') < plain.count('wood'), detail: `wood left: with oxygen ${rich.count('wood')}, in air ${plain.count('wood')}` };
});
check('methane', 'rises', () => {
  const s = new Scene().fill(20, 54, 24, 8, 'methane').run(120);
  return { ok: s.meanY('methane') < 50, detail: `methane row ${fmt(s.meanY('methane'))}` };
});
check('methane', 'burns when lit', () => {
  const s = new Scene().fill(20, 30, 24, 8, 'methane').fill(30, 40, 2, 2, 'fire');
  const f = until(s, 300, () => s.count('methane') < 150);
  return { ok: f > 0, detail: f > 0 ? `burning after ${f} frames` : 'did not catch' };
});

// ---- Electricity ------------------------------------------------------------------

/** Most charge seen at (x, y) over n frames. */
function maxCharge(s: Scene, x: number, y: number, n: number): number {
  let m = 0;
  for (let f = 0; f < n; f++) {
    step(s.world);
    m = Math.max(m, s.world.charge[y * W + x]);
  }
  return m;
}
check('spark', 'fades on its own', () => {
  const s = new Scene().fill(30, 30, 2, 2, 'spark').run(60);
  return { ok: s.count('spark') === 0, detail: `sparks left ${s.count('spark')}` };
});
check('wire', 'carries a spark from end to end', () => {
  const s = new Scene().fill(4, 40, 50, 1, 'wire').fill(3, 40, 1, 1, 'spark');
  const m = maxCharge(s, 50, 40, 200);
  return { ok: m > 0, detail: `charge at far end ${m}` };
});

// ---- Circuits -----------------------------------------------------------------------

/**
 * A closed loop of wire round a box from (x0, y0) to (x1, y1), with `cells`
 * battery cells on the top run near the left (- end left, + end right). So
 * current runs left to right along the top run and right to left along the
 * bottom run.
 */
function circuit(s: Scene, cells = 1, x0 = 8, y0 = 20, x1 = 50, y1 = 40): Scene {
  s.fill(x0, y0, x1 - x0 + 1, 1, 'wire').fill(x0, y1, x1 - x0 + 1, 1, 'wire').fill(x0, y0, 1, y1 - y0 + 1, 'wire').fill(x1, y0, 1, y1 - y0 + 1, 'wire');
  return s.fill(x0 + 2, y0, cells, 1, 'battery');
}
/** Hottest a cell gets over some frames. */
function peakTemp(s: Scene, x: number, y: number, frames: number): number {
  let hot = -Infinity;
  until(s, frames, () => ((hot = Math.max(hot, s.tempAt(x, y))), false));
  return hot;
}
const amps = (s: Scene, x: number, y: number): number => ampsAt(s.world, y * W + x);

check('battery', 'lights a bulb round a closed loop, not through a broken one', () => {
  const closed = peakTemp(circuit(new Scene()).fill(30, 20, 1, 1, 'bulb'), 30, 20, 300);
  const open = peakTemp(circuit(new Scene()).fill(30, 20, 1, 1, 'bulb').fill(8, 30, 1, 1, 'empty'), 30, 20, 300);
  return { ok: closed > 900 && open < 100, detail: `bulb ${fmt(closed)} °C closed, ${fmt(open)} °C with a gap in the loop` };
});
check('battery', 'cells side by side add up their voltage', () => {
  const s1 = circuit(new Scene(), 1).fill(30, 20, 1, 1, 'bulb').run(60);
  const s2 = circuit(new Scene(), 2).fill(30, 20, 1, 1, 'bulb').run(60);
  return { ok: amps(s2, 30, 20) > amps(s1, 30, 20) * 1.8, detail: `bulb current ${fmt(amps(s1, 30, 20) * 1000)} mA on one cell, ${fmt(amps(s2, 30, 20) * 1000)} mA on two` };
});
check('battery', 'a short circuit on a thick battery sets it alight', () => {
  // A thin battery on a long loop just runs flat; a thick one drives enough current to burst.
  const s = circuit(new Scene(), 3).fill(10, 19, 3, 3, 'battery');
  const f = until(s, 3600, () => s.count('battery') < 9 || s.count('fire') > 0);
  return { ok: f > 0, detail: f > 0 ? `alight after ${f} frames` : 'never caught' };
});
check('bulb', 'glows while powered; two in series glow dimmer', () => {
  const one = peakTemp(circuit(new Scene()).fill(30, 20, 1, 1, 'bulb'), 30, 20, 300);
  const two = peakTemp(circuit(new Scene()).fill(30, 20, 1, 1, 'bulb').fill(34, 20, 1, 1, 'bulb'), 30, 20, 300);
  return { ok: one > 1200 && two < one - 150 && two > 450, detail: `one bulb ${fmt(one)} °C, each of two in series ${fmt(two)} °C` };
});
check('wire', 'a short circuit on a thick battery heats it red', () => {
  // A 3 × 3 battery: three cells end to end, three thick, so little internal resistance.
  const hot = peakTemp(circuit(new Scene(), 3).fill(10, 19, 3, 3, 'battery'), 30, 20, 600);
  return { ok: hot > 500, detail: `wire peak ${fmt(hot)} °C` };
});
check('mercury', 'carries current like a wire', () => {
  // The bottom run of the loop is a channel of mercury between wire ends, on a wall floor.
  const s = circuit(new Scene()).fill(20, 40, 10, 1, 'mercury').fill(8, 41, 43, 2, 'wall').fill(30, 20, 1, 1, 'bulb');
  const hot = peakTemp(s, 30, 20, 300);
  return { ok: hot > 900, detail: `bulb ${fmt(hot)} °C` };
});
check('graphite', 'carries current where its grains touch', () => {
  const s = circuit(new Scene()).fill(20, 40, 10, 1, 'graphite').fill(8, 41, 43, 2, 'wall').fill(30, 20, 1, 1, 'bulb').run(30);
  return { ok: amps(s, 30, 20) > 0.05, detail: `bulb current ${fmt(amps(s, 30, 20) * 1000)} mA` };
});
check('switch', 'opens and closes the circuit when clicked', () => {
  const s = circuit(new Scene()).fill(20, 20, 1, 1, 'switch').fill(30, 20, 1, 1, 'bulb');
  const on = peakTemp(s, 30, 20, 200);
  applyOp(s.world, { kind: OP_TOGGLE, x: 20, y: 20, r: 0, mode: 0, vx: 0, vy: 0 });
  s.run(300);
  const off = s.tempAt(30, 20);
  applyOp(s.world, { kind: OP_TOGGLE, x: 20, y: 20, r: 0, mode: 0, vx: 0, vy: 0 });
  const again = peakTemp(s, 30, 20, 200);
  return { ok: on > 900 && off < 300 && again > 900, detail: `bulb ${fmt(on)} °C closed, ${fmt(off)} °C opened, ${fmt(again)} °C closed again` };
});
check('pressure_plate', 'closes the circuit when sand lands on it', () => {
  const s = circuit(new Scene()).fill(20, 20, 1, 1, 'pressure_plate').fill(30, 20, 1, 1, 'bulb');
  const before = peakTemp(s, 30, 20, 120);
  s.fill(18, 8, 5, 6, 'sand');
  const after = peakTemp(s, 30, 20, 400);
  return { ok: before < 100 && after > 900, detail: `bulb ${fmt(before)} °C before, ${fmt(after)} °C with sand on the plate` };
});
check('thermostat', 'opens when the heater beside it gets hot, and closes again', () => {
  // Ten cells drive a resistor heater; the thermostat in the same loop touches it.
  const s = circuit(new Scene(), 10).fill(30, 20, 1, 1, 'resistor').fill(31, 20, 1, 1, 'thermostat');
  let opened = -1;
  let closedAgain = -1;
  until(s, 3600, () => {
    const open = s.world.conc[20 * W + 31] !== 0;
    if (open && opened < 0) opened = s.world.frame;
    if (!open && opened >= 0 && closedAgain < 0) closedAgain = s.world.frame;
    return closedAgain >= 0;
  });
  return { ok: opened > 0 && closedAgain > opened, detail: opened > 0 ? `opened at frame ${opened}, closed again at ${closedAgain}` : 'never opened' };
});
check('resistor', 'turns current into heat', () => {
  const s = circuit(new Scene(), 10).fill(30, 20, 1, 1, 'resistor');
  const hot = peakTemp(s, 30, 20, 600);
  return { ok: hot > 80 && s.tempAt(40, 40) < 40, detail: `resistor ${fmt(hot)} °C, wire ${fmt(s.tempAt(40, 40))} °C` };
});
check('diode', 'lets current one way only', () => {
  // One diode: the battery turns round if it must, and the bulb lights. Diodes on the top and bottom runs
  // face opposite ways round the loop, so one always blocks and the bulb stays dark.
  const one = peakTemp(circuit(new Scene()).fill(25, 40, 1, 1, 'diode').fill(30, 20, 1, 1, 'bulb'), 30, 20, 300);
  const two = peakTemp(circuit(new Scene()).fill(25, 40, 1, 1, 'diode').fill(25, 20, 1, 1, 'diode').fill(30, 20, 1, 1, 'bulb'), 30, 20, 300);
  return { ok: one > 900 && two < 100, detail: `bulb ${fmt(one)} °C with one diode, ${fmt(two)} °C with two facing opposite ways round the loop` };
});
check('led', 'lights with a resistor in line, burns out without one', () => {
  const s = circuit(new Scene(), 2).fill(25, 20, 1, 1, 'led').fill(30, 20, 1, 1, 'resistor').run(60);
  const bare = circuit(new Scene(), 2).fill(25, 20, 1, 1, 'led').run(60);
  return {
    ok: s.count('led') === 1 && amps(s, 25, 20) >= 0.02 && bare.count('led') === 0,
    detail: `${fmt(amps(s, 25, 20) * 1000)} mA through it with a resistor; ${bare.count('led') === 0 ? 'burnt out' : 'still there'} without`,
  };
});
check('capacitor', 'charges, then lights a bulb after the battery is gone', () => {
  const s = circuit(new Scene()).fill(20, 20, 1, 1, 'capacitor').fill(30, 20, 1, 1, 'bulb').run(900);
  // Swap the battery for wire: only the capacitor drives the loop now.
  s.fill(10, 20, 1, 1, 'wire');
  s.run(20);
  return { ok: s.tempAt(30, 20) > 600 && amps(s, 30, 20) > 0.05, detail: `bulb ${fmt(s.tempAt(30, 20))} °C, ${fmt(amps(s, 30, 20) * 1000)} mA, a moment after the battery went` };
});
check('motor', 'carries sand along while powered', () => {
  const s = circuit(new Scene()).fill(18, 20, 16, 1, 'motor').fill(19, 19, 1, 1, 'sand').run(120);
  let x = -1;
  for (let k = 0; k < W; k++) if (s.at(k, 19) === 'sand') x = k;
  return { ok: x >= 30, detail: `sand moved from column 19 to ${x}` };
});
check('electromagnet', 'pulls iron filings only while powered', () => {
  const build = (cells: number): Scene => {
    const s = cells > 0 ? circuit(new Scene(), cells) : circuit(new Scene(), 1).fill(10, 20, 1, 1, 'wire');
    return s.fill(22, 40, 12, 1, 'electromagnet').fill(0, 47, W, 17, 'wall').fill(24, 45, 8, 2, 'iron_filings').run(600);
  };
  const on = build(2);
  const off = build(0);
  return { ok: on.meanY('iron_filings') < off.meanY('iron_filings') - 2, detail: `filings row ${fmt(on.meanY('iron_filings'))} powered, ${fmt(off.meanY('iron_filings'))} unpowered` };
});
check('neon', 'glows when current runs through it', () => {
  // A glass tube of neon with wire at each end, in the loop; neon needs several cells.
  const s = circuit(new Scene(), 12).fill(20, 19, 12, 3, 'glass').fill(21, 20, 10, 1, 'neon').fill(20, 20, 1, 1, 'wire').fill(31, 20, 1, 1, 'wire').run(30);
  return { ok: amps(s, 25, 20) > 0.02, detail: `${fmt(amps(s, 25, 20) * 1000)} mA through the tube` };
});

// ---- Life -------------------------------------------------------------------------

check('seed', 'sprouts on wet dirt under open sky', () => {
  const s = new Scene().fill(0, 50, W, 14, 'dirt').fill(0, 46, W, 3, 'water').run(600).fill(20, 40, 1, 1, 'seed').fill(40, 40, 1, 1, 'seed');
  const f = until(s, 1800, () => s.count('plant') > 0);
  return { ok: f > 0, detail: f > 0 ? `plant after ${f} frames` : 'no plant' };
});
check('seed', 'sprouts on damp sand', () => {
  const s = new Scene().fill(0, 50, W, 14, 'sand').fill(0, 46, W, 3, 'water').run(600).fill(20, 40, 1, 1, 'seed').fill(40, 40, 1, 1, 'seed');
  const f = until(s, 1800, () => s.count('plant') > 0);
  return { ok: f > 0, detail: f > 0 ? `plant after ${f} frames` : 'no plant' };
});
check('plant', 'grows upwards', () => {
  const s = new Scene().fill(0, 50, W, 14, 'dirt').fill(0, 46, W, 3, 'water').run(600).fill(30, 40, 1, 1, 'seed').run(2400);
  return { ok: s.count('plant') >= 10 && s.topY('plant') < 40, detail: `plant cells ${s.count('plant')}, top row ${s.topY('plant')}` };
});
check('plant', 'drinks water from the soil', () => {
  const s = new Scene().fill(0, 50, W, 14, 'dirt').fill(0, 46, W, 3, 'water').run(600);
  const before = s.held('dirt') + s.count('water') * 255;
  s.fill(20, 40, 1, 1, 'seed').fill(40, 40, 1, 1, 'seed').run(3000);
  const after = s.held('dirt') + s.count('water') * 255;
  return { ok: after < before - 100, detail: `water in soil: ${before} before, ${after} after` };
});
check('plant', 'wilts and dies without water', () => {
  const s = new Scene().fill(0, 50, W, 14, 'dirt').fill(0, 46, W, 1, 'water').run(400).fill(30, 40, 1, 1, 'seed').run(1800);
  const grown = s.count('plant');
  s.run(6000);
  return { ok: grown > 0 && s.count('plant') < grown, detail: `plant cells ${grown}, then ${s.count('plant')}` };
});
check('plant', 'burns', () => {
  const s = new Scene().fill(10, 30, 44, 34, 'plant').fill(30, 28, 2, 2, 'fire');
  const f = until(s, 900, () => s.count('plant') < 1400);
  return { ok: f > 0, detail: f > 0 ? `burning after ${f} frames` : 'did not catch' };
});

// ---- Rule families ----------------------------------------------------------------

check('water', 'puts out fire', () => {
  const s = new Scene().fill(20, 50, 24, 14, 'wood').fill(30, 48, 4, 2, 'fire').run(120);
  const burning = (): number => {
    let n = 0;
    for (let i = 0; i < s.world.size; i++) if (s.world.type[i] === s.id('fire') && s.world.solute[i] !== 0) n++;
    return n;
  };
  const before = burning();
  // Flood it: water over the whole fire.
  s.fill(0, 26, W, 20, 'water').run(300);
  return { ok: before > 0 && burning() === 0, detail: `burning cells ${before}, after flooding ${burning()}` };
});
check('iron', 'rusts in water', () => {
  const s = new Scene().fill(10, 58, 44, 6, 'iron').fill(10, 50, 44, 8, 'water');
  const f = until(s, 3000, () => s.count('rust') > 0);
  return { ok: f > 0, detail: f > 0 ? `rust after ${f} frames` : 'no rust' };
});
check('cement', 'sets into concrete with water', () => {
  const s = new Scene().fill(10, 56, 44, 8, 'cement').fill(10, 50, 44, 4, 'water');
  const f = until(s, 1200, () => s.count('concrete') > 20);
  return { ok: f > 0, detail: f > 0 ? `concrete after ${f} frames` : `concrete ${s.count('concrete')}` };
});
check('quicklime', 'gets hot in water and turns to slaked lime', () => {
  const s = new Scene().fill(10, 56, 44, 8, 'quicklime').fill(10, 50, 44, 4, 'water');
  let hottest = 0;
  until(s, 600, () => {
    for (let i = 0; i < s.world.size; i++) if (s.world.temp[i] > hottest) hottest = s.world.temp[i];
    return false;
  });
  return { ok: s.count('slaked_lime') > 0 && hottest >= 100, detail: `slaked lime ${s.count('slaked_lime')}, hottest ${fmt(hottest)} °C` };
});
check('salt', 'melts ice', () => {
  const s = new Scene().fill(10, 54, 44, 10, 'ice', -5).heat(0, 0, W, 54, -5).fill(20, 50, 24, 3, 'salt');
  const f = until(s, 1200, () => s.count('water') > 0);
  return { ok: f > 0, detail: f > 0 ? `water after ${f} frames` : 'ice held' };
});
check('water', 'salt water stays liquid below 0 °C', () => {
  const s = new Scene().fill(0, 50, W, 14, 'water').fill(16, 44, 32, 4, 'salt').run(1500);
  s.heat(0, 0, W, H, -8).run(200);
  const salty = s.held('water');
  return { ok: s.count('water') > 0 && salty > 0, detail: `water ${s.count('water')}, ice ${s.count('ice')}` };
});
check('sulfur_dioxide', 'turns water into acid', () => {
  const s = new Scene().fill(0, 54, W, 10, 'water').fill(10, 40, 44, 6, 'sulfur_dioxide');
  const f = until(s, 1200, () => s.count('acid') > 0);
  return { ok: f > 0, detail: f > 0 ? `acid after ${f} frames` : 'no acid' };
});
check('chlorine', 'kills plants', () => {
  const s = new Scene().fill(10, 40, 44, 24, 'plant').fill(10, 30, 44, 8, 'chlorine');
  const f = until(s, 1200, () => s.count('dry_plant') > 0);
  return { ok: f > 0, detail: f > 0 ? `withered after ${f} frames` : 'plants fine' };
});
check('dry_plant', 'rots into dirt in water', () => {
  const s = new Scene().fill(10, 56, 44, 8, 'dry_plant').fill(10, 50, 44, 6, 'water');
  const f = until(s, 6000, () => s.count('dirt') > 0);
  return { ok: f > 0, detail: f > 0 ? `dirt after ${f} frames` : 'no rot' };
});

// ---- Basics pack ------------------------------------------------------------------

check('clay', 'bakes into brick', () => {
  const s = new Scene().fill(20, 56, 24, 8, 'clay', 950);
  const f = until(s, 120, () => s.count('brick') > 0);
  return { ok: f > 0, detail: f > 0 ? `brick after ${f} frames` : 'no brick' };
});
check('brick', 'a blast breaks it into gravel', () => {
  const s = new Scene().fill(20, 40, 3, 20, 'brick').fill(25, 46, 4, 4, 'tnt', 400);
  const f = until(s, 300, () => s.count('gravel') > 0);
  return { ok: f > 0, detail: f > 0 ? `gravel after ${f} frames` : 'brick held' };
});
check('concrete', 'acid eats it', () => {
  const s = new Scene().fill(10, 56, 44, 8, 'concrete').fill(10, 48, 44, 6, 'acid').run(900);
  return { ok: s.count('concrete') < 352, detail: `concrete left ${s.count('concrete')} of 352` };
});
check('limestone', 'acid fizzes it into carbon dioxide', () => {
  const s = new Scene().fill(10, 56, 44, 8, 'limestone').fill(10, 48, 44, 6, 'acid');
  const f = until(s, 900, () => s.count('carbon_dioxide') > 0);
  return { ok: f > 0, detail: f > 0 ? `carbon dioxide after ${f} frames` : 'no fizz' };
});
check('limestone', 'bakes into quicklime and carbon dioxide', () => {
  const s = new Scene().fill(20, 56, 24, 8, 'limestone', 950);
  s.run(10);
  return { ok: s.count('quicklime') > 0 && s.count('carbon_dioxide') > 0, detail: `quicklime ${s.count('quicklime')}, carbon dioxide ${s.count('carbon_dioxide')}` };
});
check('slaked_lime', 'neutralises acid', () => {
  const s = new Scene().fill(10, 58, 44, 6, 'slaked_lime').fill(10, 50, 44, 6, 'acid').run(900);
  return { ok: s.count('acid') < 264, detail: `acid left ${s.count('acid')} of 264` };
});
check('gold', 'acid cannot eat it', () => {
  const s = new Scene().fill(10, 56, 44, 8, 'gold').fill(10, 48, 44, 6, 'acid').run(900);
  return { ok: s.count('gold') === 352, detail: `gold ${s.count('gold')} of 352` };
});
check('gold', 'melts and sets back into gold', () => {
  const s = new Scene().fill(20, 58, 24, 6, 'gold', 1200);
  const melted = until(s, 60, () => s.count('molten_gold') > 0) > 0;
  const f = until(s, 6000, () => s.count('gold') === 144);
  return { ok: melted && f > 0, detail: `melted ${melted}, all gold again ${f > 0 ? `after ${f} frames` : 'no'}` };
});
check('aluminium', 'acid eats it, giving off hydrogen', () => {
  const s = new Scene().fill(10, 56, 44, 8, 'aluminium').fill(10, 48, 44, 6, 'acid');
  let hydrogen = 0;
  until(s, 900, () => ((hydrogen = Math.max(hydrogen, s.count('hydrogen'))), false));
  return { ok: s.count('aluminium') < 352 && hydrogen > 0, detail: `aluminium left ${s.count('aluminium')}, hydrogen seen ${hydrogen}` };
});
check('aluminium', 'melts into molten aluminium', () => {
  const s = new Scene().fill(20, 58, 24, 6, 'aluminium', 700);
  const f = until(s, 60, () => s.count('molten_aluminium') > 0);
  return { ok: f > 0, detail: f > 0 ? `molten after ${f} frames` : 'solid' };
});
check('lead', 'melts and sets back into lead', () => {
  const s = new Scene().fill(20, 58, 24, 6, 'lead', 360);
  const melted = until(s, 60, () => s.count('molten_lead') > 0) > 0;
  const f = until(s, 6000, () => s.count('lead') === 144);
  return { ok: melted && f > 0, detail: `melted ${melted}, all lead again ${f > 0 ? `after ${f} frames` : 'no'}` };
});
check('sodium', 'water touching it makes lye and hydrogen', () => {
  const s = new Scene().fill(0, 50, W, 14, 'water').fill(28, 48, 4, 2, 'sodium');
  let hydrogen = 0;
  until(s, 300, () => ((hydrogen = Math.max(hydrogen, s.count('hydrogen'), s.count('steam'))), false));
  return { ok: s.count('lye') > 0 && hydrogen > 0, detail: `lye ${s.count('lye')}, hydrogen or its steam seen ${hydrogen}` };
});
check('coal', 'burns for a long time', () => {
  const s = new Scene().fill(20, 56, 24, 8, 'coal', 500);
  s.run(600);
  let burning = 0;
  for (let i = 0; i < s.world.size; i++) if (s.world.type[i] === s.id('fire') && s.world.solute[i] === s.id('coal')) burning++;
  return { ok: burning > 0, detail: `still burning after 10 s: ${burning} cells` };
});
check('charcoal', 'catches from a flame', () => {
  const s = new Scene().fill(20, 56, 24, 8, 'charcoal').fill(30, 54, 2, 2, 'fire');
  const f = until(s, 300, () => s.count('charcoal') < 192);
  return { ok: f > 0, detail: f > 0 ? `burning after ${f} frames` : 'did not catch' };
});
check('sulfur', 'burns into sulfur dioxide', () => {
  const s = new Scene().fill(20, 56, 24, 8, 'sulfur').fill(30, 54, 2, 2, 'fire');
  const f = until(s, 1200, () => s.count('sulfur_dioxide') > 0);
  return { ok: f > 0, detail: f > 0 ? `sulfur dioxide after ${f} frames` : 'none' };
});
check('petrol', 'a pool goes up from one flame', () => {
  const s = new Scene().fill(0, 56, W, 8, 'petrol').fill(30, 54, 2, 2, 'fire');
  const f = until(s, 300, () => s.count('petrol') < 400);
  return { ok: f > 0, detail: f > 0 ? `a fifth gone after ${f} frames` : `left ${s.count('petrol')}` };
});
check('petrol', 'floats on water', () => {
  const s = new Scene().fill(0, 54, W, 10, 'petrol').fill(0, 30, W, 10, 'water').run(1200);
  return { ok: s.meanY('petrol') < s.meanY('water'), detail: `petrol row ${fmt(s.meanY('petrol'))}, water row ${fmt(s.meanY('water'))}` };
});
check('wax', 'melts into molten wax', () => {
  const s = new Scene().fill(20, 56, 24, 8, 'wax', 70);
  const f = until(s, 60, () => s.count('molten_wax') > 0);
  return { ok: f > 0, detail: f > 0 ? `molten after ${f} frames` : 'solid' };
});
check('molten_wax', 'sets back into wax', () => {
  const s = new Scene().fill(10, 58, 44, 6, 'molten_wax');
  const f = until(s, 6000, () => s.count('wax') > 0);
  return { ok: f > 0, detail: f > 0 ? `wax after ${f} frames` : 'still molten' };
});
check('paper', 'burns from a flame', () => {
  const s = new Scene().fill(20, 50, 24, 14, 'paper').fill(30, 48, 2, 2, 'fire');
  const f = until(s, 600, () => s.count('paper') < 300);
  return { ok: f > 0, detail: f > 0 ? `burning after ${f} frames` : 'did not catch' };
});
check('rubber', 'blocks charge', () => {
  const s = new Scene().fill(4, 40, 20, 1, 'wire').fill(24, 40, 4, 1, 'rubber').fill(28, 40, 20, 1, 'wire').fill(3, 40, 1, 1, 'spark');
  let m = 0;
  for (let f = 0; f < 200; f++) {
    step(s.world);
    m = Math.max(m, s.world.charge[40 * W + 40]);
  }
  return { ok: m === 0, detail: `charge past the rubber ${m}` };
});
check('flour', 'catches easily and burns where air reaches it', () => {
  const s = new Scene().fill(0, 56, W, 8, 'flour').fill(30, 54, 2, 2, 'fire');
  const f = until(s, 600, () => s.count('flour') < 480);
  return { ok: f > 0, detail: f > 0 ? `burning after ${f} frames` : `left ${s.count('flour')}` };
});
check('thermite', 'a flame does not light it', () => {
  const s = new Scene().fill(20, 56, 24, 8, 'thermite').fill(30, 54, 2, 2, 'fire').run(300);
  return { ok: s.count('thermite') === 192, detail: `thermite ${s.count('thermite')} of 192` };
});
check('thermite', 'great heat lights it, with no air', () => {
  const s = new Scene().fill(0, 40, W, 24, 'wall').fill(20, 50, 24, 8, 'thermite', 950);
  const f = until(s, 300, () => s.count('iron') > 0);
  return { ok: f > 0, detail: f > 0 ? `iron after ${f} frames` : 'no burn' };
});
check('honey', 'sinks through water slowly', () => {
  const s = new Scene().fill(0, 44, W, 20, 'water').fill(24, 30, 16, 4, 'honey').run(1800);
  return { ok: s.meanY('honey') > s.meanY('water'), detail: `honey row ${fmt(s.meanY('honey'))}, water row ${fmt(s.meanY('water'))}` };
});
check('vinegar', 'fizzes with baking soda', () => {
  const s = new Scene().fill(10, 58, 44, 6, 'baking_soda').fill(10, 50, 44, 6, 'vinegar');
  const f = until(s, 900, () => s.count('carbon_dioxide') > 0);
  return { ok: f > 0, detail: f > 0 ? `carbon dioxide after ${f} frames` : 'no fizz' };
});
check('vinegar', 'does not eat iron', () => {
  const s = new Scene().fill(10, 58, 44, 6, 'iron').fill(10, 50, 44, 6, 'vinegar').run(900);
  return { ok: s.count('iron') + s.count('rust') === 264, detail: `iron and rust ${s.count('iron') + s.count('rust')} of 264` };
});
check('bleach', 'gives off chlorine with acid', () => {
  const s = new Scene().fill(0, 56, W, 8, 'bleach').fill(0, 46, W, 6, 'acid');
  const f = until(s, 900, () => s.count('chlorine') > 0);
  return { ok: f > 0, detail: f > 0 ? `chlorine after ${f} frames` : 'none' };
});
check('lye', 'neutralises acid', () => {
  const s = new Scene().fill(0, 56, W, 8, 'lye').fill(0, 46, W, 6, 'acid').run(900);
  return { ok: s.count('acid') < 384, detail: `acid left ${s.count('acid')} of 384` };
});
check('liquid_nitrogen', 'boils away into nitrogen', () => {
  const s = new Scene().fill(20, 56, 24, 8, 'liquid_nitrogen');
  const f = until(s, 600, () => s.count('nitrogen') > 0);
  return { ok: f > 0, detail: f > 0 ? `nitrogen after ${f} frames` : 'none' };
});
check('liquid_nitrogen', 'freezes water', () => {
  const s = new Scene().fill(0, 56, W, 8, 'water').fill(20, 46, 24, 8, 'liquid_nitrogen');
  const f = until(s, 900, () => s.count('ice') > 0);
  return { ok: f > 0, detail: f > 0 ? `ice after ${f} frames` : 'no ice' };
});
check('nitrogen', 'smothers fire', () => {
  const s = new Scene().fill(20, 56, 24, 8, 'wood').fill(30, 54, 2, 2, 'fire').run(120).fill(0, 20, W, 34, 'nitrogen').run(600);
  const plain = new Scene().fill(20, 56, 24, 8, 'wood').fill(30, 54, 2, 2, 'fire').run(720);
  return { ok: s.count('wood') > plain.count('wood'), detail: `wood left: under nitrogen ${s.count('wood')}, in air ${plain.count('wood')}` };
});
check('carbon_dioxide', 'sinks and pools low', () => {
  const s = new Scene().fill(20, 10, 24, 8, 'carbon_dioxide').run(900);
  return { ok: s.meanY('carbon_dioxide') > 40, detail: `carbon dioxide row ${fmt(s.meanY('carbon_dioxide'))}` };
});
check('helium', 'rises', () => {
  const s = new Scene().fill(20, 54, 24, 8, 'helium').run(120);
  return { ok: s.meanY('helium') < 40, detail: `helium row ${fmt(s.meanY('helium'))}` };
});
check('propane', 'sinks, and burns where it meets air when lit', () => {
  const s = new Scene().fill(20, 10, 24, 8, 'propane').run(600);
  const low = s.meanY('propane');
  s.fill(30, 58, 2, 2, 'fire');
  const f = until(s, 600, () => s.count('propane') < 176);
  return { ok: low > 40 && f > 0, detail: `propane row ${fmt(low)}, ${f > 0 ? `burning after ${f} frames` : 'did not burn'}` };
});
check('dry_ice', 'turns straight into carbon dioxide', () => {
  const s = new Scene().fill(20, 56, 24, 8, 'dry_ice');
  const f = until(s, 3000, () => s.count('carbon_dioxide') > 0);
  return { ok: f > 0 && s.count('water') === 0, detail: f > 0 ? `gas after ${f} frames` : 'still solid' };
});
check('baking_soda', 'dissolves a little in water', () => {
  const s = new Scene().fill(0, 50, W, 14, 'water').fill(28, 40, 8, 2, 'baking_soda').run(900);
  return { ok: s.count('baking_soda') < 16, detail: `baking soda left ${s.count('baking_soda')} of 16` };
});
check('c4', 'a flame does not set it off', () => {
  const s = new Scene().fill(26, 56, 12, 8, 'c4').fill(30, 54, 2, 2, 'fire').run(300);
  return { ok: s.count('c4') === 96, detail: `c4 ${s.count('c4')} of 96` };
});
check('c4', 'a spark sets it off', () => {
  const s = new Scene().fill(4, 60, 20, 1, 'wire').fill(24, 56, 12, 8, 'c4').fill(3, 60, 1, 1, 'spark');
  const f = until(s, 300, () => s.count('c4') < 96);
  return { ok: f > 0, detail: f > 0 ? `went off after ${f} frames` : 'did not go off' };
});

// ---- Life pack, weather, devices --------------------------------------------------

/** Damp soil with seeds dropped on it, run long enough to grow. */
function garden(seed: string, frames: number): Scene {
  return new Scene().fill(0, 50, W, 14, 'dirt').fill(0, 46, W, 3, 'water').run(600).fill(16, 40, 1, 1, seed).fill(44, 40, 1, 1, seed).run(frames);
}
check('grass_seed', 'sprouts into short grass', () => {
  const s = garden('grass_seed', 2400);
  return { ok: s.count('grass') > 0 && s.topY('grass') > 30, detail: `grass cells ${s.count('grass')}, top row ${s.topY('grass')}` };
});
check('acorn', 'grows into a tall tree with leaves', () => {
  // Trees drink a lot: give the soil plenty of water.
  const s = new Scene().fill(0, 50, W, 14, 'dirt').fill(0, 40, W, 8, 'water').run(900).fill(16, 30, 1, 1, 'acorn').fill(44, 30, 1, 1, 'acorn').run(2400);
  return { ok: s.count('tree') >= 15 && s.count('leaves') > 0, detail: `trunk cells ${s.count('tree')}, leaves ${s.count('leaves')}, top row ${Math.min(s.topY('tree'), s.topY('leaves'))}` };
});
check('plant', 'flowers at its tips', () => {
  // Plenty of water, so the plants reach the end of their growth before the soil dries.
  const s = new Scene().fill(0, 50, W, 14, 'dirt').fill(0, 40, W, 8, 'water').run(900).fill(16, 30, 1, 1, 'seed').fill(44, 30, 1, 1, 'seed').run(3600);
  return { ok: s.count('flower') > 0, detail: `flowers ${s.count('flower')}, plant cells ${s.count('plant')}` };
});
check('tree', 'dead and dry, it is wood', () => {
  const s = new Scene().fill(20, 40, 4, 24, 'tree').run(3000);
  return { ok: s.count('wood') > 0, detail: `wood ${s.count('wood')}, still living ${s.count('tree')}` };
});
check('salt', 'kills plants it touches', () => {
  const s = new Scene().fill(10, 50, 44, 14, 'plant').fill(10, 46, 44, 2, 'salt');
  const f = until(s, 1200, () => s.count('dry_plant') > 0);
  return { ok: f > 0, detail: f > 0 ? `withered after ${f} frames` : 'plants fine' };
});
check('cloud', 'rains', () => {
  const s = new Scene().fill(10, 10, 44, 6, 'cloud');
  const f = until(s, 600, () => s.count('water') > 0);
  return { ok: f > 0, detail: f > 0 ? `water after ${f} frames` : 'no rain' };
});
check('cloud', 'snows below freezing', () => {
  const s = new Scene().fill(10, 10, 44, 6, 'cloud', -10);
  const f = until(s, 600, () => s.count('snow') > 0);
  return { ok: f > 0, detail: f > 0 ? `snow after ${f} frames` : 'no snow' };
});
check('cloud', 'runs dry', () => {
  const s = new Scene().fill(10, 10, 44, 6, 'cloud').run(6000);
  return { ok: s.count('cloud') < 264, detail: `cloud cells left ${s.count('cloud')} of 264` };
});
check('heater', 'boils water above it', () => {
  const s = new Scene().fill(0, 60, W, 4, 'heater').fill(0, 50, W, 10, 'water');
  const f = until(s, 1800, () => s.count('steam') > 0);
  return { ok: f > 0, detail: f > 0 ? `steam after ${f} frames` : 'no steam' };
});
check('cooler', 'freezes water above it', () => {
  const s = new Scene().fill(0, 60, W, 4, 'cooler').fill(0, 50, W, 10, 'water');
  const f = until(s, 1800, () => s.count('ice') > 0);
  return { ok: f > 0, detail: f > 0 ? `ice after ${f} frames` : 'no ice' };
});
check('clone', 'copies what touches it', () => {
  const s = new Scene().fill(28, 30, 8, 2, 'clone').fill(30, 28, 2, 2, 'sand').run(600);
  return { ok: s.count('sand') > 20, detail: `sand cells ${s.count('sand')} (started with 4)` };
});
check('void', 'deletes what touches it', () => {
  const s = new Scene().fill(0, 60, W, 4, 'void').fill(10, 30, 44, 10, 'sand').run(900);
  return { ok: s.count('sand') === 0 && s.count('void') === 256, detail: `sand left ${s.count('sand')}, void ${s.count('void')}` };
});
check('fan', 'lifts light powder', () => {
  const s = new Scene().fill(20, 62, 24, 2, 'fan').fill(20, 50, 24, 4, 'sawdust').run(300);
  const still = new Scene().fill(20, 62, 24, 2, 'wall').fill(20, 50, 24, 4, 'sawdust').run(300);
  return { ok: s.topY('sawdust') < still.topY('sawdust'), detail: `top of sawdust: over fan row ${s.topY('sawdust')}, over wall row ${still.topY('sawdust')}` };
});
check('magnesium', 'burns hot enough to set off thermite', () => {
  const s = new Scene().fill(20, 56, 24, 8, 'thermite').fill(20, 54, 24, 2, 'magnesium', 700);
  const f = until(s, 900, () => s.count('thermite') < 192);
  return { ok: f > 0, detail: f > 0 ? `thermite going after ${f} frames` : 'thermite untouched' };
});
check('potassium', 'bursts in water', () => {
  const s = new Scene().fill(0, 50, W, 14, 'water').fill(28, 48, 4, 2, 'potassium');
  const f = until(s, 300, () => s.count('lye') > 0);
  return { ok: f > 0, detail: f > 0 ? `lye after ${f} frames` : 'nothing' };
});
check('sugar', 'bakes into caramel', () => {
  const s = new Scene().fill(20, 56, 24, 8, 'sugar', 200);
  const f = until(s, 60, () => s.count('caramel') > 0);
  return { ok: f > 0, detail: f > 0 ? `caramel after ${f} frames` : 'no caramel' };
});
check('wood', 'heated without air, it turns to charcoal', () => {
  // Wood packed between walls, no air reaching it, heated from below.
  const s = new Scene().fill(0, 40, W, 24, 'wall').fill(20, 48, 24, 8, 'wood').fill(20, 56, 24, 2, 'heater');
  s.world.temp.fill(20);
  const hot = new Scene().fill(0, 40, W, 24, 'wall').fill(20, 48, 24, 8, 'wood', 450);
  const f = until(hot, 60, () => hot.count('charcoal') > 0);
  return { ok: f > 0 && hot.count('fire') === 0, detail: f > 0 ? `charcoal after ${f} frames, no flames` : 'no charcoal' };
});
check('marble', 'acid fizzes it into carbon dioxide', () => {
  const s = new Scene().fill(10, 56, 44, 8, 'marble').fill(10, 48, 44, 6, 'acid');
  const f = until(s, 900, () => s.count('carbon_dioxide') > 0);
  return { ok: f > 0, detail: f > 0 ? `carbon dioxide after ${f} frames` : 'no fizz' };
});
check('chalk', 'acid fizzes it into carbon dioxide', () => {
  const s = new Scene().fill(10, 56, 44, 8, 'chalk').fill(10, 48, 44, 6, 'acid');
  const f = until(s, 900, () => s.count('carbon_dioxide') > 0);
  return { ok: f > 0, detail: f > 0 ? `carbon dioxide after ${f} frames` : 'no fizz' };
});

// ---- Batch 3 ----------------------------------------------------------------------

check('liquid_oxygen', 'boils away into oxygen', () => {
  const s = new Scene().fill(20, 56, 24, 8, 'liquid_oxygen');
  const f = until(s, 600, () => s.count('oxygen') > 0);
  return { ok: f > 0, detail: f > 0 ? `oxygen after ${f} frames` : 'none' };
});
check('thermite', 'leaves molten iron that sets into iron', () => {
  const s = new Scene().fill(0, 40, W, 24, 'wall').fill(20, 50, 24, 8, 'thermite', 950);
  let molten = 0;
  until(s, 600, () => ((molten = Math.max(molten, s.count('molten_iron'))), false));
  const f = until(s, 9000, () => s.count('molten_iron') === 0);
  return { ok: molten > 0 && f > 0 && s.count('iron') > 0, detail: `molten iron seen ${molten}, set after ${f > 0 ? `${f} frames` : 'never'}, iron ${s.count('iron')}` };
});
check('sand', 'melts into molten glass that sets into glass', () => {
  const s = new Scene().fill(20, 58, 24, 6, 'sand', 1460);
  const melted = until(s, 60, () => s.count('molten_glass') > 0) > 0;
  const f = until(s, 9000, () => s.count('glass') > 0);
  return { ok: melted && f > 0, detail: `melted ${melted}, glass ${f > 0 ? `after ${f} frames` : 'never'}` };
});
check('silver', 'melts and sets back into silver', () => {
  const s = new Scene().fill(20, 58, 24, 6, 'silver', 1050);
  const melted = until(s, 60, () => s.count('molten_silver') > 0) > 0;
  const f = until(s, 9000, () => s.count('silver') === 144);
  return { ok: melted && f > 0, detail: `melted ${melted}, all silver again ${f > 0 ? `after ${f} frames` : 'no'}` };
});
check('meat', 'cooks when warmed', () => {
  const s = new Scene().fill(20, 56, 24, 8, 'meat', 80);
  const f = until(s, 60, () => s.count('cooked_meat') > 0);
  return { ok: f > 0, detail: f > 0 ? `cooked after ${f} frames` : 'raw' };
});
check('cooked_meat', 'chars into charcoal when overdone', () => {
  const s = new Scene().fill(0, 40, W, 24, 'wall').fill(20, 50, 24, 8, 'cooked_meat', 260);
  const f = until(s, 60, () => s.count('charcoal') > 0);
  return { ok: f > 0, detail: f > 0 ? `charcoal after ${f} frames` : 'not charred' };
});
check('popcorn_kernel', 'pops into popcorn', () => {
  const s = new Scene().fill(20, 56, 24, 8, 'popcorn_kernel', 190);
  const f = until(s, 60, () => s.count('popcorn') > 0);
  return { ok: f > 0, detail: f > 0 ? `popped after ${f} frames` : 'no pop' };
});
check('popcorn', 'floats on water', () => {
  const s = new Scene().fill(0, 44, W, 20, 'water').fill(20, 10, 10, 4, 'popcorn').run(1200);
  return { ok: s.meanY('popcorn') < s.meanY('water'), detail: `popcorn row ${fmt(s.meanY('popcorn'))}` };
});
check('tar', 'sinks through water', () => {
  const s = new Scene().fill(0, 44, W, 20, 'water').fill(24, 34, 16, 4, 'tar').run(2400);
  return { ok: s.meanY('tar') > s.meanY('water'), detail: `tar row ${fmt(s.meanY('tar'))}, water row ${fmt(s.meanY('water'))}` };
});
check('plastic', 'melts and acid does not eat it', () => {
  const a = new Scene().fill(20, 56, 24, 8, 'plastic', 170);
  const f = until(a, 60, () => a.count('molten_plastic') > 0);
  const b = new Scene().fill(10, 56, 44, 8, 'plastic').fill(10, 48, 44, 6, 'acid').run(900);
  return { ok: f > 0 && b.count('plastic') === 352, detail: `melted ${f > 0}, plastic under acid ${b.count('plastic')} of 352` };
});
check('pumice', 'floats on water', () => {
  const s = new Scene().fill(0, 44, W, 20, 'water').fill(20, 10, 10, 4, 'pumice').run(1200);
  return { ok: s.meanY('pumice') < s.meanY('water'), detail: `pumice row ${fmt(s.meanY('pumice'))}, water row ${fmt(s.meanY('water'))}` };
});
check('lava', 'water chills it into obsidian', () => {
  const s = new Scene().fill(0, 56, W, 8, 'lava').fill(0, 46, W, 6, 'water');
  const f = until(s, 900, () => s.count('obsidian') > 0);
  return { ok: f > 0, detail: f > 0 ? `obsidian after ${f} frames` : 'none' };
});
check('diamond', 'burns into carbon dioxide in great heat', () => {
  const s = new Scene().fill(20, 56, 24, 8, 'diamond', 950);
  const f = until(s, 1200, () => s.count('carbon_dioxide') > 0);
  return { ok: f > 0, detail: f > 0 ? `carbon dioxide after ${f} frames` : 'none' };
});
check('napalm', 'floats and burns on water', () => {
  const s = new Scene().fill(0, 50, W, 14, 'water').fill(0, 44, W, 4, 'napalm').run(600);
  s.fill(30, s.topY('napalm') - 2, 2, 2, 'fire');
  const f = until(s, 600, () => s.count('napalm') < 240);
  return { ok: f > 0 && s.meanY('napalm') < s.meanY('water'), detail: f > 0 ? `burning after ${f} frames, on top of the water` : 'did not catch' };
});
check('hydrogen_peroxide', 'breaks down on rust into oxygen', () => {
  const s = new Scene().fill(10, 58, 44, 6, 'rust').fill(10, 50, 44, 6, 'hydrogen_peroxide');
  const f = until(s, 600, () => s.count('oxygen') > 0);
  return { ok: f > 0, detail: f > 0 ? `oxygen after ${f} frames` : 'none' };
});

// ---- Creatures --------------------------------------------------------------------

check('fish', 'swims and lives in water', () => {
  const s = new Scene().fill(0, 34, W, 30, 'water').fill(30, 50, 2, 2, 'fish');
  const start = s.meanY('fish');
  let moved = false;
  until(s, 900, () => ((moved = moved || Math.abs(s.meanY('fish') - start) > 0.5), false));
  return { ok: s.count('fish') >= 4 && moved, detail: `fish ${s.count('fish')}, moved ${moved}` };
});
check('fish', 'out of water it dies into meat', () => {
  const s = new Scene().fill(30, 60, 2, 1, 'fish');
  const f = until(s, 900, () => s.count('meat') > 0);
  return { ok: f > 0 && s.count('fish') === 0, detail: f > 0 ? `meat after ${f} frames` : `fish ${s.count('fish')}` };
});
check('fish', 'in boiling water it cooks', () => {
  const s = new Scene().fill(0, 44, W, 20, 'water', 95).heat(0, 44, W, 20, 95).fill(30, 54, 2, 2, 'fish');
  const f = until(s, 300, () => s.count('cooked_meat') > 0);
  return { ok: f > 0, detail: f > 0 ? `cooked meat after ${f} frames` : `fish ${s.count('fish')}, meat ${s.count('meat')}` };
});
check('fish', 'eats sinking seeds and breeds', () => {
  const s = new Scene().fill(0, 30, W, 34, 'water').fill(20, 50, 4, 2, 'fish').fill(10, 31, 44, 2, 'seed');
  const f = until(s, 3000, () => s.count('fish') > 8);
  return { ok: f > 0, detail: f > 0 ? `${s.count('fish')} fish after ${f} frames` : `fish ${s.count('fish')}, seeds ${s.count('seed')}` };
});
check('ant', 'walks over the ground', () => {
  const s = new Scene().fill(0, 60, W, 4, 'wall').fill(30, 59, 1, 1, 'ant');
  const xs = new Set<number>();
  until(s, 600, () => {
    for (let x = 0; x < W; x++) if (s.at(x, 59) === 'ant') xs.add(x);
    return false;
  });
  return { ok: s.count('ant') === 1 && xs.size > 5, detail: `visited ${xs.size} columns` };
});
check('ant', 'eats sugar and breeds', () => {
  const s = new Scene().fill(0, 60, W, 4, 'wall').fill(10, 58, 44, 2, 'sugar').fill(30, 57, 2, 1, 'ant');
  const f = until(s, 3000, () => s.count('ant') > 6);
  return { ok: f > 0 && s.count('sugar') < 88, detail: f > 0 ? `${s.count('ant')} ants after ${f} frames, sugar ${s.count('sugar')}` : `ants ${s.count('ant')}, sugar ${s.count('sugar')}` };
});
check('ant', 'drowns in water', () => {
  const s = new Scene().fill(0, 40, W, 24, 'water').fill(30, 50, 1, 1, 'ant');
  const f = until(s, 900, () => s.count('ant') === 0);
  return { ok: f > 0, detail: f > 0 ? `drowned after ${f} frames` : 'still alive' };
});
check('worm', 'digs through soil', () => {
  const s = new Scene().fill(0, 40, W, 24, 'dirt').fill(30, 50, 1, 1, 'worm');
  const cells = new Set<number>();
  until(s, 900, () => {
    for (let i = 0; i < s.world.size; i++) if (s.world.type[i] === s.id('worm')) cells.add(i);
    return false;
  });
  return { ok: s.count('worm') === 1 && cells.size > 5 && s.count('dirt') === 1535, detail: `visited ${cells.size} cells, dirt ${s.count('dirt')} of 1535` };
});
check('worm', 'turns dead plants into dirt', () => {
  const s = new Scene().fill(0, 44, W, 20, 'dirt').fill(0, 40, W, 4, 'dry_plant').fill(20, 50, 2, 2, 'worm');
  const before = s.count('dry_plant');
  s.run(3000);
  return { ok: s.count('dry_plant') < before, detail: `dry plant ${before} to ${s.count('dry_plant')}, worms ${s.count('worm')}` };
});
check('bird', 'flies and stays up', () => {
  const s = new Scene().fill(0, 60, W, 4, 'wall').fill(30, 20, 2, 2, 'bird').run(900);
  return { ok: s.count('bird') === 4 && s.meanY('bird') < 58, detail: `birds ${s.count('bird')}, row ${fmt(s.meanY('bird'))}` };
});
check('bird', 'eats ants', () => {
  const s = new Scene().fill(0, 60, W, 4, 'wall').fill(0, 59, W, 1, 'ant').fill(10, 50, 44, 2, 'bird');
  const before = s.count('ant');
  s.run(1800);
  return { ok: s.count('ant') < before, detail: `ants ${before} to ${s.count('ant')}, birds ${s.count('bird')}` };
});

// ---- Sky ----------------------------------------------------------------------------

check('lightning', 'melts sand where it lands', () => {
  const s = new Scene().fill(0, 56, W, 8, 'sand').fill(32, 2, 1, 1, 'lightning');
  s.run(2);
  return { ok: s.count('molten_glass') + s.count('glass') > 0, detail: `molten glass ${s.count('molten_glass')}, glass ${s.count('glass')}` };
});
check('lightning', 'sends current into a conductor', () => {
  const s = new Scene().fill(0, 56, W, 1, 'wire').fill(0, 57, W, 7, 'wall').fill(32, 2, 1, 1, 'lightning');
  let m = 0;
  for (let f = 0; f < 120; f++) {
    step(s.world);
    m = Math.max(m, s.world.charge[56 * W + 5], s.world.charge[56 * W + 60]);
  }
  return { ok: m > 0, detail: `charge reached the wire ends: ${m}` };
});
check('cloud', 'storm clouds let go lightning', () => {
  const s = new Scene().fill(0, 2, W, 8, 'cloud');
  let bolts = 0;
  until(s, 1800, () => ((bolts = Math.max(bolts, s.count('plasma'))), false));
  return { ok: bolts > 0, detail: bolts > 0 ? `plasma seen ${bolts}` : 'no lightning' };
});
check('firework', 'a flame launches it and it bursts into embers', () => {
  const s = new Scene().fill(28, 60, 8, 4, 'firework').fill(31, 58, 2, 2, 'fire');
  let rocket = 0;
  let embers = 0;
  until(s, 300, () => ((rocket = Math.max(rocket, s.count('rocket'))), (embers = Math.max(embers, s.count('ember'))), false));
  return { ok: rocket > 0 && embers > 0, detail: `rockets seen ${rocket}, embers seen ${embers}` };
});
check('ember', 'drifts down', () => {
  const s = new Scene().fill(20, 10, 24, 4, 'ember').run(30);
  return { ok: s.meanY('ember') > 13, detail: `ember row ${fmt(s.meanY('ember'))}` };
});

// ---- Batch 6 ----------------------------------------------------------------------

check('saltpeter', 'mixed with charcoal, it burns with no air', () => {
  // Charcoal sealed in a box smothers; mixed grain by grain with saltpeter, it keeps burning.
  const box = (withSalt: boolean): Scene => {
    const s = new Scene().fill(10, 30, 44, 34, 'wall').fill(14, 44, 36, 16, 'charcoal');
    if (withSalt) for (let y = 44; y < 60; y++) for (let x = 14 + (y & 1); x < 50; x += 2) s.fill(x, y, 1, 1, 'saltpeter');
    s.heat(14, 44, 36, 16, 20).fill(30, 50, 2, 2, 'fire');
    return s.run(900);
  };
  const plain = box(false);
  const salt = box(true);
  const burntMixed = 1 - salt.count('charcoal') / 288;
  const burntAlone = 1 - plain.count('charcoal') / 576;
  return { ok: burntMixed > burntAlone + 0.1, detail: `burnt: mixed with saltpeter ${fmt(burntMixed * 100)}%, alone ${fmt(burntAlone * 100)}%` };
});
check('tin', 'melts at a low heat and sets back', () => {
  const s = new Scene().fill(20, 58, 24, 6, 'tin', 260);
  const melted = until(s, 60, () => s.count('molten_tin') > 0) > 0;
  const f = until(s, 9000, () => s.count('tin') === 144);
  return { ok: melted && f > 0, detail: `melted ${melted}, all tin again ${f > 0 ? `after ${f} frames` : 'no'}` };
});
check('steel', 'rusts in water, slower to be eaten by acid than iron', () => {
  const s = new Scene().fill(10, 58, 44, 6, 'steel').fill(10, 50, 44, 8, 'water');
  const rusted = until(s, 4000, () => s.count('rust') > 0) > 0;
  const a = new Scene().fill(10, 56, 44, 8, 'steel').fill(10, 48, 44, 6, 'acid').run(600);
  const b = new Scene().fill(10, 56, 44, 8, 'iron').fill(10, 48, 44, 6, 'acid').run(600);
  return { ok: rusted && a.count('steel') > b.count('iron'), detail: `rusted ${rusted}, under acid: steel ${a.count('steel')}, iron ${b.count('iron')}` };
});
check('zinc', 'acid fizzes it, giving off hydrogen', () => {
  const s = new Scene().fill(10, 56, 44, 8, 'zinc').fill(10, 48, 44, 6, 'acid');
  let hydrogen = 0;
  until(s, 900, () => ((hydrogen = Math.max(hydrogen, s.count('hydrogen'))), false));
  return { ok: hydrogen > 0, detail: `hydrogen seen ${hydrogen}` };
});
check('kerosene', 'a warm pool catches from a flame', () => {
  const s = new Scene().fill(0, 56, W, 8, 'kerosene', 45).heat(0, 56, W, 8, 45).fill(30, 54, 2, 2, 'fire');
  const f = until(s, 300, () => s.count('kerosene') < 480);
  return { ok: f > 0, detail: f > 0 ? `burning after ${f} frames` : 'did not catch' };
});
check('acetone', 'dissolves plastic', () => {
  const s = new Scene().fill(10, 58, 44, 6, 'plastic').fill(10, 50, 44, 6, 'acetone').run(900);
  return { ok: s.count('plastic') < 264, detail: `plastic left ${s.count('plastic')} of 264` };
});
check('hail', 'falls fast and melts into water', () => {
  const s = new Scene().fill(30, 0, 4, 4, 'hail');
  const landed = until(s, 60, () => s.topY('hail') > 55) > 0;
  s.heat(0, 0, W, H, 30);
  const f = until(s, 3000, () => s.count('water') > 0);
  return { ok: landed && f > 0, detail: `landed within 1 s ${landed}, water ${f > 0 ? `after ${f} frames` : 'never'}` };
});
check('uranium', 'stays hot and boils water', () => {
  const s = new Scene().fill(20, 60, 24, 4, 'uranium').fill(0, 48, W, 12, 'water');
  const f = until(s, 1800, () => s.count('steam') > 0);
  return { ok: f > 0, detail: f > 0 ? `steam after ${f} frames` : 'no steam' };
});
check('bee', 'turns flowers into seeds', () => {
  // Bees start beside the flowers: cut flowers with no water wither within seconds.
  const s = new Scene().fill(0, 60, W, 4, 'wall').fill(0, 59, W, 1, 'flower').fill(10, 58, 44, 1, 'bee');
  let seeds = 0;
  until(s, 300, () => ((seeds = Math.max(seeds, s.count('seed'))), false));
  return { ok: seeds > 0, detail: `seeds seen ${seeds}, flowers left ${s.count('flower')}` };
});
check('spider', 'catches ants', () => {
  const s = new Scene().fill(0, 60, W, 4, 'wall').fill(0, 59, W, 1, 'ant').fill(30, 58, 2, 1, 'spider');
  const before = s.count('ant');
  s.run(1800);
  return { ok: s.count('ant') < before, detail: `ants ${before} to ${s.count('ant')}, spiders ${s.count('spider')}` };
});
check('termite', 'chews wood into sawdust and breeds', () => {
  const s = new Scene().fill(0, 50, W, 14, 'wood').fill(30, 49, 2, 1, 'termite');
  const before = s.count('wood');
  s.run(3000);
  return { ok: s.count('wood') < before && s.count('termite') > 2, detail: `wood ${before} to ${s.count('wood')}, termites ${s.count('termite')}` };
});

// ---- Batch 7 ----------------------------------------------------------------------

/** A floor with a row of food on it and a few creatures beside it; returns food before and after. */
function feed(creature: string, food: string, frames: number): { before: number; after: number; count: number } {
  const s = new Scene().fill(0, 60, W, 4, 'wall').fill(0, 59, W, 1, food).fill(30, 58, 2, 1, creature);
  const before = s.count(food);
  s.run(frames);
  return { before, after: s.count(food), count: s.count(creature) };
}
check('snail', 'grazes plants', () => {
  const r = feed('snail', 'grass', 600);
  return { ok: r.after < r.before, detail: `grass ${r.before} to ${r.after}, snails ${r.count}` };
});
check('frog', 'catches insects', () => {
  const r = feed('frog', 'ant', 1800);
  return { ok: r.after < r.before, detail: `ants ${r.before} to ${r.after}, frogs ${r.count}` };
});
check('mouse', 'eats seeds and breeds', () => {
  const r = feed('mouse', 'popcorn_kernel', 1800);
  return { ok: r.after < r.before && r.count > 2, detail: `kernels ${r.before} to ${r.after}, mice ${r.count}` };
});
check('snake', 'catches mice', () => {
  const r = feed('snake', 'mouse', 1800);
  return { ok: r.after < r.before, detail: `mice ${r.before} to ${r.after}, snakes ${r.count}` };
});
check('ammonia', 'rises and neutralises acid', () => {
  // A light gas rises away, so fill the whole space above the acid with it.
  const s = new Scene().fill(0, 56, W, 8, 'acid').fill(0, 0, W, 56, 'ammonia');
  const rises = new Scene().fill(20, 54, 24, 8, 'ammonia').run(120);
  s.run(900);
  return { ok: s.count('acid') < 512 && rises.meanY('ammonia') < 54, detail: `acid ${s.count('acid')} of 512, ammonia row ${fmt(rises.meanY('ammonia'))}` };
});
check('ozone', 'feeds fire more fiercely than air', () => {
  const plain = new Scene().fill(20, 54, 24, 10, 'wood').fill(30, 52, 2, 2, 'fire').run(600);
  const rich = new Scene().fill(20, 54, 24, 10, 'wood').fill(0, 30, W, 22, 'ozone').fill(30, 52, 2, 2, 'fire').run(600);
  return { ok: rich.count('wood') < plain.count('wood'), detail: `wood left: with ozone ${rich.count('wood')}, in air ${plain.count('wood')}` };
});
check('cotton', 'soaks up water and then will not burn', () => {
  const s = new Scene().fill(0, 56, W, 8, 'cotton').fill(0, 50, W, 4, 'water').run(900);
  s.fill(30, s.topY('cotton') - 2, 2, 2, 'fire').run(300);
  return { ok: s.held('cotton') > 0 && s.count('cotton') > 400, detail: `water held ${s.held('cotton')}, cotton left ${s.count('cotton')} of 512` };
});
check('chocolate', 'melts in a little warmth and sets again', () => {
  const s = new Scene().fill(20, 58, 24, 6, 'chocolate', 40);
  const melted = until(s, 60, () => s.count('molten_chocolate') > 0) > 0;
  const f = until(s, 9000, () => s.count('chocolate') === 144);
  return { ok: melted && f > 0, detail: `melted ${melted}, set again ${f > 0 ? `after ${f} frames` : 'no'}` };
});

// ---- Batch 8 ----------------------------------------------------------------------

check('egg', 'cooks when warmed', () => {
  const s = new Scene().fill(20, 56, 24, 8, 'egg', 80);
  const f = until(s, 60, () => s.count('cooked_egg') > 0);
  return { ok: f > 0, detail: f > 0 ? `cooked after ${f} frames` : 'raw' };
});
check('phosphorus', 'bursts into flame in warm air, but not under water', () => {
  const air = new Scene().fill(20, 58, 24, 6, 'phosphorus', 40).heat(0, 0, W, H, 40);
  const f = until(air, 300, () => air.count('fire') > 0);
  const wet = new Scene().fill(20, 58, 24, 6, 'phosphorus', 40).fill(0, 40, W, 18, 'water').fill(0, 58, 20, 6, 'water').fill(44, 58, 20, 6, 'water');
  wet.heat(0, 40, W, 24, 40).run(300);
  return { ok: f > 0 && wet.count('phosphorus') === 144, detail: `in air: ${f > 0 ? `fire after ${f} frames` : 'no fire'}; under water: ${wet.count('phosphorus')} of 144 left` };
});
check('lithium', 'fizzes in water into lye and hydrogen', () => {
  const s = new Scene().fill(0, 50, W, 14, 'water').fill(28, 48, 4, 2, 'lithium');
  const f = until(s, 600, () => s.count('lye') > 0);
  return { ok: f > 0, detail: f > 0 ? `lye after ${f} frames` : 'nothing' };
});
check('calcium_carbide', 'water makes acetylene and slaked lime', () => {
  const s = new Scene().fill(10, 58, 44, 6, 'calcium_carbide').fill(10, 52, 44, 4, 'water');
  let gas = 0;
  until(s, 600, () => ((gas = Math.max(gas, s.count('acetylene'))), false));
  return { ok: gas > 0 && s.count('slaked_lime') > 0, detail: `acetylene seen ${gas}, slaked lime ${s.count('slaked_lime')}` };
});
check('acetylene', 'burns hotter than any other fuel', () => {
  const s = new Scene().fill(10, 20, 44, 20, 'acetylene').fill(30, 42, 2, 2, 'fire');
  let hottest = 0;
  until(s, 300, () => {
    for (let i = 0; i < s.world.size; i++) if (s.world.temp[i] > hottest) hottest = s.world.temp[i];
    return false;
  });
  return { ok: hottest > 1500, detail: `hottest ${fmt(hottest)} °C` };
});
check('iodine', 'sublimes into violet vapour that settles back as crystals', () => {
  const s = new Scene().fill(20, 58, 24, 6, 'iodine', 130);
  const vapour = until(s, 60, () => s.count('iodine_vapour') > 0) > 0;
  const f = until(s, 9000, () => s.count('iodine_vapour') === 0);
  return { ok: vapour && f > 0 && s.count('iodine') > 0, detail: `vapour ${vapour}, settled ${f > 0 ? `after ${f} frames` : 'no'}, iodine ${s.count('iodine')}` };
});

// ---- Batch 9 ----------------------------------------------------------------------

check('titanium', 'acid cannot eat it', () => {
  const s = new Scene().fill(10, 56, 44, 8, 'titanium').fill(10, 48, 44, 6, 'acid').run(900);
  return { ok: s.count('titanium') === 352, detail: `titanium ${s.count('titanium')} of 352` };
});
check('platinum', 'makes hydrogen burn into steam', () => {
  // Hydrogen rises: trap it under a platinum lid.
  const t = new Scene().fill(0, 20, W, 2, 'platinum').fill(10, 30, 44, 6, 'hydrogen');
  const f = until(t, 900, () => t.count('steam') > 0);
  return { ok: f > 0, detail: f > 0 ? `steam after ${f} frames` : 'none' };
});
check('argon', 'smothers fire', () => {
  const s = new Scene().fill(20, 56, 24, 8, 'wood').fill(30, 54, 2, 2, 'fire').run(120).fill(0, 20, W, 34, 'argon').run(600);
  const plain = new Scene().fill(20, 56, 24, 8, 'wood').fill(30, 54, 2, 2, 'fire').run(720);
  return { ok: s.count('wood') > plain.count('wood'), detail: `wood left: under argon ${s.count('wood')}, in air ${plain.count('wood')}` };
});
check('bromine', 'boils into vapour that condenses back', () => {
  const s = new Scene().fill(20, 58, 24, 6, 'bromine', 75);
  const boiled = until(s, 60, () => s.count('bromine_vapour') > 0) > 0;
  const f = until(s, 9000, () => s.count('bromine_vapour') === 0);
  return { ok: boiled && f > 0, detail: `boiled ${boiled}, condensed ${f > 0 ? `after ${f} frames` : 'no'}` };
});
check('bromine', 'kills plants', () => {
  const s = new Scene().fill(10, 50, 44, 14, 'plant').fill(10, 46, 44, 2, 'bromine');
  const f = until(s, 1200, () => s.count('dry_plant') > 0);
  return { ok: f > 0, detail: f > 0 ? `withered after ${f} frames` : 'plants fine' };
});
check('gallium', 'melts with a little warmth', () => {
  const s = new Scene().fill(20, 58, 24, 6, 'gallium', 36);
  const f = until(s, 60, () => s.count('liquid_gallium') > 0);
  const back = until(s, 9000, () => s.count('gallium') === 144);
  return { ok: f > 0 && back > 0, detail: `melted ${f > 0}, set again ${back > 0 ? `after ${back} frames` : 'no'}` };
});
check('cactus', 'outlasts a drought', () => {
  // Grown plants of both kinds, then the soil dries: the cactus outlives the plant.
  const grow = (seed: string): Scene => new Scene().fill(0, 50, W, 14, 'sand').fill(0, 46, W, 3, 'water').run(600).fill(30, 40, 1, 1, seed).run(2400);
  const c = grow('cactus_seed');
  const p = grow('seed');
  const cactusBefore = c.count('cactus');
  c.run(6000);
  p.run(6000);
  return { ok: cactusBefore > 0 && c.count('cactus') > 0 && c.count('cactus') / cactusBefore > p.count('plant') / Math.max(1, p.count('plant') + p.count('dry_plant')), detail: `cactus ${cactusBefore} to ${c.count('cactus')}; plant left ${p.count('plant')}, withered ${p.count('dry_plant')}` };
});

// ---- Batch 10 ---------------------------------------------------------------------

check('smoke_bomb', 'lit, it pours out smoke', () => {
  const s = new Scene().fill(26, 58, 12, 6, 'smoke_bomb').fill(31, 56, 2, 2, 'fire');
  let smoke = 0;
  until(s, 900, () => ((smoke = Math.max(smoke, s.count('smoke'))), false));
  return { ok: smoke > 40, detail: `smoke seen ${smoke}` };
});
check('peat', 'dry, it smoulders; soaked, it will not burn', () => {
  const dry = new Scene().fill(10, 56, 44, 8, 'peat').fill(30, 54, 2, 2, 'fire').run(600);
  const wet = new Scene().fill(10, 56, 44, 8, 'peat').fill(10, 50, 44, 4, 'water').run(600);
  wet.fill(30, wet.topY('peat') - 2, 2, 2, 'fire').run(600);
  return { ok: dry.count('peat') < 352 && wet.count('peat') === 352, detail: `dry peat left ${dry.count('peat')}, soaked peat left ${wet.count('peat')} of 352` };
});
check('basalt', 'melts into lava', () => {
  const s = new Scene().fill(20, 56, 24, 8, 'basalt', 1150);
  const f = until(s, 60, () => s.count('lava') > 0);
  return { ok: f > 0, detail: f > 0 ? `lava after ${f} frames` : 'solid' };
});
check('granite', 'resists heat that melts basalt', () => {
  const s = new Scene().fill(20, 56, 24, 8, 'granite', 1150).run(60);
  return { ok: s.count('lava') === 0, detail: `lava ${s.count('lava')}` };
});
check('sandstone', 'a blast crumbles it into sand', () => {
  const s = new Scene().fill(20, 40, 3, 20, 'sandstone').fill(25, 46, 4, 4, 'tnt', 400);
  const f = until(s, 300, () => s.count('sand') > 0);
  return { ok: f > 0, detail: f > 0 ? `sand after ${f} frames` : 'held' };
});
check('soda', 'warmed, it fizzes out carbon dioxide', () => {
  const s = new Scene().fill(10, 56, 44, 8, 'soda', 40);
  const f = until(s, 60, () => s.count('carbon_dioxide') > 0);
  return { ok: f > 0, detail: f > 0 ? `carbon dioxide after ${f} frames` : 'still fizzy' };
});

check('c4', 'a long strip goes off whole from one spark', () => {
  const s = new Scene().fill(0, 60, W, 4, 'wall').fill(4, 59, 56, 1, 'c4').fill(4, 58, 1, 1, 'wire').fill(4, 57, 1, 1, 'spark');
  until(s, 120, () => s.count('c4') === 0);
  return { ok: s.count('c4') === 0, detail: `c4 left ${s.count('c4')} of 56` };
});
check('tnt', 'a long strip goes off whole', () => {
  const s = new Scene().fill(0, 60, W, 4, 'wall').fill(4, 58, 56, 2, 'tnt').fill(4, 57, 1, 1, 'tnt', 400);
  until(s, 120, () => s.count('tnt') === 0);
  return { ok: s.count('tnt') === 0, detail: `tnt left ${s.count('tnt')} of 113` };
});
check('gunpowder', 'a long trail burns grain by grain, not all at once', () => {
  const s = new Scene().fill(0, 60, W, 4, 'wall').fill(4, 59, 56, 1, 'gunpowder').fill(4, 58, 1, 1, 'fire');
  let afterFew = -1;
  const f = until(s, 900, () => {
    if (s.world.frame === 6) afterFew = s.count('gunpowder');
    return s.count('gunpowder') === 0;
  });
  return { ok: afterFew > 20 && f > 6, detail: `left after 6 frames ${afterFew} of 56, all gone ${f > 0 ? `after ${f} frames` : 'no'}` };
});

check('fuse', 'burns steadily end to end and sets off C4 at the far end', () => {
  const s = new Scene().fill(0, 60, W, 4, 'wall').fill(4, 59, 48, 1, 'fuse').fill(52, 56, 6, 4, 'c4').fill(4, 58, 1, 1, 'fire');
  let midway = -1;
  const f = until(s, 1200, () => {
    if (midway < 0 && s.at(28, 59) !== 'fuse') midway = s.world.frame;
    return s.count('c4') === 0;
  });
  return { ok: f > 0 && midway > 60, detail: f > 0 ? `half way after ${(midway / 60).toFixed(1)} s, C4 went off after ${(f / 60).toFixed(1)} s` : `fuse left ${s.count('fuse')}, c4 left ${s.count('c4')}` };
});

// ---- Creature bodies ----------------------------------------------------------------

/** Places a whole creature body with its first part at (x, y). */
function body(s: Scene, key: string, x: number, y: number): Scene {
  if (!placeBody(s.world, x, y, s.id(key))) throw new Error(`no room for a ${key} at ${x}, ${y}`);
  return s;
}
check('fish', 'a fish body swims as one and stays whole', () => {
  const s = body(new Scene().fill(0, 30, W, 34, 'water'), 'fish', 30, 45);
  const cells = s.count('fish');
  const start = s.meanY('fish') * 1000 + 0;
  let moved = false;
  const x0 = s.world.type.indexOf(s.id('fish'));
  until(s, 900, () => ((moved = moved || s.world.type.indexOf(s.id('fish')) !== x0), false));
  return { ok: cells === 7 && s.count('fish') % 7 === 0 && s.count('fish') > 0 && moved && start > 0, detail: `cells ${cells}, after 15 s ${s.count('fish')}, moved ${moved}` };
});
check('mouse', 'a mouse body walks and climbs as one', () => {
  const s = body(new Scene().fill(0, 60, W, 4, 'wall').fill(40, 58, 4, 2, 'wall'), 'mouse', 10, 58);
  const xs = new Set<number>();
  until(s, 900, () => {
    const k = s.world.type.indexOf(s.id('mouse'));
    if (k >= 0) xs.add(k % W);
    return false;
  });
  return { ok: s.count('mouse') === 6 && xs.size > 10, detail: `cells ${s.count('mouse')}, visited ${xs.size} columns` };
});
check('fish', 'a fish body cooks whole in boiling water', () => {
  const s = body(new Scene().fill(0, 44, W, 20, 'water', 95).heat(0, 44, W, 20, 95), 'fish', 30, 52);
  s.run(300);
  // (Meat left in water slowly rots into dirt, so dirt counts too.)
  const left = s.count('cooked_meat') + s.count('meat') + s.count('dirt');
  return { ok: s.count('fish') === 0 && left === 7, detail: `fish ${s.count('fish')}, meat ${s.count('meat')}, cooked ${s.count('cooked_meat')}, rotted ${s.count('dirt')}` };
});
check('snake', 'losing a part kills the whole body', () => {
  const s = body(new Scene().fill(0, 60, W, 4, 'wall'), 'snake', 20, 59);
  s.world.place(59 * W + 22, 0);
  s.run(5);
  return { ok: s.count('snake') === 0 && s.count('meat') === 4, detail: `snake cells ${s.count('snake')}, meat ${s.count('meat')}` };
});

// ---- New reaction types ------------------------------------------------------------

check('magnet', 'pulls iron filings in', () => {
  const s = new Scene().fill(0, 60, W, 4, 'wall').fill(30, 56, 2, 4, 'magnet').fill(20, 56, 6, 4, 'iron_filings');
  const before = s.meanY('iron_filings');
  const dist = (): number => {
    let sum = 0;
    let n = 0;
    for (let k = 0; k < s.world.size; k++) if (s.world.type[k] === s.id('iron_filings')) { sum += Math.abs((k % W) - 30); n++; }
    return sum / n;
  };
  const d0 = dist();
  s.run(600);
  return { ok: dist() < d0 - 2 && before > 0, detail: `mean distance from the magnet ${fmt(d0)} to ${fmt(dist())} cells` };
});
check('glue', 'sets hard after a few seconds', () => {
  const s = new Scene().fill(0, 60, W, 4, 'wall').fill(20, 56, 24, 4, 'glue');
  const f = until(s, 600, () => s.count('dried_glue') > 0);
  return { ok: f > 120, detail: f > 0 ? `set after ${(f / 60).toFixed(1)} s` : 'still liquid' };
});
check('ammonium_nitrate', 'dissolving it makes the water cold', () => {
  const s = new Scene().fill(0, 50, W, 14, 'water').fill(16, 44, 32, 4, 'ammonium_nitrate');
  let coldest = 20;
  until(s, 900, () => {
    for (let k = 0; k < s.world.size; k++) if (s.world.type[k] === s.id('water') && s.world.temp[k] < coldest) coldest = s.world.temp[k];
    return false;
  });
  return { ok: coldest < 5, detail: `coldest water ${fmt(coldest)} °C` };
});
check('yeast', 'ferments sugary water into alcohol and carbon dioxide', () => {
  const s = new Scene().fill(0, 50, W, 14, 'water').fill(16, 44, 32, 4, 'sugar').run(900).fill(16, 44, 32, 2, 'yeast');
  let gas = 0;
  until(s, 1800, () => ((gas = Math.max(gas, s.count('carbon_dioxide'))), false));
  return { ok: s.count('alcohol') > 0 && gas > 0, detail: `alcohol ${s.count('alcohol')}, carbon dioxide seen ${gas}` };
});

// ---- Pressure -------------------------------------------------------------------------

/** A glass box (4 cells thick) of water on a heater; `lid` closes it, `valve` sets a valve into the lid. */
function boiler(lid: boolean, valve = false): Scene {
  const s = new Scene().fill(16, 58, 32, 4, 'heater').fill(16, 30, 4, 28, 'glass').fill(44, 30, 4, 28, 'glass').fill(20, 40, 24, 18, 'water');
  if (lid) s.fill(16, 26, 32, 4, 'glass');
  if (valve) s.fill(28, 26, 8, 4, 'valve');
  return s;
}
check('water', 'boiling in a sealed glass box bursts it; in an open one it does not', () => {
  const sealed = boiler(true);
  const f = until(sealed, 3600, () => sealed.count('shards') > 0);
  const open = boiler(false).run(f > 0 ? f : 3600);
  return { ok: f > 0 && open.count('shards') === 0, detail: f > 0 ? `sealed box burst after ${f} frames; open box ${open.count('shards')} shards` : 'sealed box held' };
});
check('valve', 'vents a sealed boiler, so it lasts longer than one with no valve', () => {
  const plain = boiler(true);
  const burst = until(plain, 3600, () => plain.count('shards') > 0);
  const s = boiler(true, true);
  let opened = false;
  const vented = until(s, 3600, () => ((opened = opened || s.world.conc[27 * W + 31] !== 0), s.count('shards') > 0));
  return {
    ok: opened && burst > 0 && (vented < 0 || vented > 1.5 * burst),
    detail: `valve ${opened ? 'opened' : 'stayed shut'}; burst after ${vented < 0 ? 'never (60 s)' : `${vented} frames`} with it, ${burst} frames without`,
  };
});
check('propane_tank', 'ruptures in a fire, releasing propane', () => {
  const s = new Scene().fill(28, 54, 8, 8, 'propane_tank').heat(28, 54, 8, 8, 300);
  s.run(10);
  return { ok: s.count('propane_tank') < 64 && s.count('propane') + s.count('fire') > 0, detail: `tank cells ${s.count('propane_tank')} of 64, propane ${s.count('propane')}` };
});
check('air_tank', 'bursts with a shock that shatters glass', () => {
  const s = new Scene().fill(20, 40, 24, 2, 'glass').fill(30, 44, 4, 4, 'air_tank').heat(30, 44, 4, 4, 320);
  s.run(30);
  return { ok: s.count('air_tank') < 16 && s.count('shards') > 0, detail: `tank cells ${s.count('air_tank')}, shards ${s.count('shards')}` };
});

// ---- Structure -----------------------------------------------------------------------

check('stone', 'a shelf longer than its span breaks off and falls', () => {
  // A wall post with a stone shelf 20 cells long: stone reaches 6.
  const s = new Scene().fill(0, 60, W, 4, 'wall').fill(10, 30, 3, 30, 'wall').fill(13, 30, 20, 2, 'stone').run(120);
  let held = 0;
  for (let x = 13; x < 33; x++) if (s.at(x, 30) === 'stone') held++;
  return { ok: held >= 4 && held <= 8 && s.count('stone') + s.count('gravel') === 40, detail: `${held} of 20 shelf cells still held` };
});
check('wood', 'burning the post under a slab drops the slab', () => {
  const s = new Scene().fill(0, 60, W, 4, 'wall').fill(30, 40, 3, 20, 'wood').fill(20, 38, 24, 2, 'stone').run(30);
  const before = s.meanY('stone');
  s.fill(29, 58, 5, 2, 'fire').heat(28, 40, 7, 20, 600);
  s.run(1200);
  return { ok: s.meanY('stone') > before + 10 || s.count('gravel') > 0, detail: `slab row ${fmt(before)} before, ${fmt(s.meanY('stone'))} after; ${s.count('wood')} wood left` };
});
check('rope', 'holds a hanging block until it burns', () => {
  const s = new Scene().fill(0, 60, W, 4, 'wall').fill(20, 4, 24, 3, 'wall').fill(31, 7, 1, 20, 'rope').fill(28, 27, 7, 4, 'stone').run(60);
  const hung = s.meanY('stone');
  s.fill(30, 15, 3, 2, 'fire').heat(30, 12, 3, 8, 400).run(900);
  return { ok: hung < 31 && s.meanY('stone') > 50, detail: `block row ${fmt(hung)} on the rope, ${fmt(s.meanY('stone'))} after it burned` };
});
check('steel_beam', 'bridges a wide gap that stone cannot', () => {
  const build = (key: string): Scene => new Scene().fill(0, 60, W, 4, 'wall').fill(4, 40, 4, 20, 'brick').fill(56, 40, 4, 20, 'brick').fill(4, 38, 56, 2, key).run(240);
  const steel = build('steel_beam');
  const stone = build('stone');
  return { ok: steel.meanY('steel_beam') < 40 && stone.meanY('stone') > 41, detail: `steel row ${fmt(steel.meanY('steel_beam'))}, stone row ${fmt(stone.meanY('stone'))}` };
});
check('stone', 'a block dropped from high up cracks into gravel', () => {
  const s = new Scene().fill(0, 60, W, 4, 'wall').fill(24, 4, 12, 6, 'stone').run(240);
  return { ok: s.count('gravel') > 3 && s.meanY('stone') > 50, detail: `gravel ${s.count('gravel')}, stone row ${fmt(s.meanY('stone'))}` };
});

// ---- Light -----------------------------------------------------------------------------

check('plant', 'grows only in light: not under a roof', () => {
  const garden = (roof: boolean): Scene => {
    const s = new Scene().fill(0, 50, W, 14, 'dirt').fill(0, 46, W, 3, 'water').run(600).fill(20, 40, 1, 1, 'seed').fill(40, 40, 1, 1, 'seed');
    if (roof) s.fill(0, 20, W, 3, 'wall');
    return s.run(1800);
  };
  const open = garden(false).count('plant');
  const dark = garden(true).count('plant');
  return { ok: open > 10 && dark < open / 3, detail: `plant cells: ${open} in the open, ${dark} under a roof` };
});
check('solar_panel', 'lights a bulb in daylight, not under a roof', () => {
  const rig = (roof: boolean): Scene => {
    const s = circuit(new Scene(), 1).fill(10, 20, 6, 1, 'solar_panel').fill(30, 20, 1, 1, 'bulb');
    if (roof) s.fill(0, 4, W, 3, 'wall');
    return s;
  };
  const sun = peakTemp(rig(false), 30, 20, 300);
  const shade = peakTemp(rig(true), 30, 20, 300);
  return { ok: sun > 450 && shade < 100, detail: `bulb ${fmt(sun)} °C in daylight, ${fmt(shade)} °C under a roof` };
});
check('glow_paint', 'keeps glowing after it is covered', () => {
  const s = new Scene().fill(0, 60, W, 4, 'wall').fill(20, 56, 24, 4, 'glow_paint').run(300);
  // The top surface catches the light.
  const charged = s.world.life[56 * W + 30];
  s.fill(0, 50, W, 6, 'wall').run(120);
  const after = s.world.life[56 * W + 30];
  return { ok: charged > 500 && after > 0 && after < charged, detail: `stored light ${charged} in the open, ${after} two seconds after covering` };
});
check('silver_chloride', 'darkens in light, stays white in shade', () => {
  const s = new Scene().fill(0, 60, W, 4, 'wall').fill(4, 58, 56, 2, 'silver_chloride').fill(30, 30, 30, 2, 'wall').run(1800);
  let litDark = 0;
  let shadeDark = 0;
  for (let x = 4; x < 28; x++) if (s.at(x, 59) === 'exposed_silver' || s.at(x, 58) === 'exposed_silver') litDark++;
  for (let x = 32; x < 58; x++) if (s.at(x, 59) === 'exposed_silver' || s.at(x, 58) === 'exposed_silver') shadeDark++;
  return { ok: litDark > 5 && shadeDark === 0, detail: `darkened columns: ${litDark} in light, ${shadeDark} in shade` };
});

// ---- Sickness, mould, mushrooms ---------------------------------------------------------------

/** A walled pen on a floor with ants in it. */
function antPen(): Scene {
  const s = new Scene().fill(0, 60, W, 4, 'wall').fill(10, 40, 2, 20, 'wall').fill(52, 40, 2, 20, 'wall');
  for (let x = 14; x < 50; x += 3) s.fill(x, 59, 1, 1, 'ant');
  return s;
}
check('plague', 'spreads among animals and kills them', () => {
  const s = antPen().fill(14, 50, 6, 6, 'plague');
  const before = s.count('ant');
  s.run(1800);
  return { ok: s.count('ant') < before / 2, detail: `ants ${before} before, ${s.count('ant')} after 30 s` };
});
check('medicine', 'cures sick animals', () => {
  const sickPen = (dose: boolean): Scene => {
    const s = antPen();
    for (let k = 0; k < s.world.size; k++) if (s.world.type[k] === s.id('ant')) s.world.solute[k] = s.id('plague');
    if (dose) s.fill(12, 56, 40, 2, 'medicine');
    return s.run(1200);
  };
  const treated = sickPen(true).count('ant');
  const untreated = sickPen(false).count('ant');
  return { ok: treated > untreated + 3, detail: `ants alive after 20 s: ${treated} with medicine, ${untreated} without` };
});
check('mould', 'spreads over damp meat, not dry meat', () => {
  // Left: meat beside a walled pool of water, mould at its wet edge. Right: the same meat, dry.
  const s = new Scene().fill(0, 60, W, 4, 'wall').fill(3, 50, 1, 10, 'wall').fill(4, 54, 6, 6, 'water').fill(10, 52, 12, 8, 'meat').fill(10, 55, 1, 1, 'mould');
  s.fill(40, 52, 12, 8, 'meat').fill(40, 55, 1, 1, 'mould').run(3600);
  let wet = 0;
  let dry = 0;
  for (let y = 52; y < 60; y++)
    for (let x = 0; x < W; x++) if (s.at(x, y) === 'mould') (x < 30 ? wet++ : dry++);
  return { ok: wet > 3 && dry <= 1, detail: `mould cells on wet meat ${wet}, on dry meat ${dry} (the seed)` };
});
check('mushroom', 'grows from spores in the dark, not in daylight', () => {
  const bed = (roof: boolean): Scene => {
    const s = new Scene().fill(0, 50, W, 14, 'dirt').fill(0, 46, W, 3, 'water').run(600).fill(20, 49, 1, 1, 'spores').fill(40, 49, 1, 1, 'spores');
    if (roof) s.fill(0, 20, W, 3, 'wall');
    return s.run(1800);
  };
  const dark = bed(true).count('mushroom');
  const light = bed(false).count('mushroom');
  return { ok: dark > 2 && light < dark / 2, detail: `mushroom cells: ${dark} under a roof, ${light} in daylight` };
});

// ---- Nuclear, baking, catalysts, two-part glue, crystals, indicators --------------------------

check('uranium', 'a small piece stays warm; a big pile goes critical and melts down', () => {
  const small = new Scene().fill(0, 60, W, 4, 'wall').fill(30, 56, 4, 4, 'uranium').run(900);
  const pile = new Scene().fill(0, 60, W, 4, 'wall').fill(20, 46, 14, 14, 'uranium');
  let hottest = 0;
  until(pile, 900, () => ((hottest = Math.max(hottest, pile.tempAt(27, 53))), false));
  return { ok: small.tempAt(31, 58) < 700 && (hottest > 1100 || pile.count('corium') > 0), detail: `small piece ${fmt(small.tempAt(31, 58))} °C; big pile peak ${fmt(hottest)} °C, corium ${pile.count('corium')}` };
});
check('control_rod', 'rods through a pile keep it from running away', () => {
  // Hottest any fuel gets over 15 s.
  const pile = (rods: boolean): number => {
    const s = new Scene().fill(0, 60, W, 4, 'wall').fill(20, 46, 14, 14, 'uranium');
    if (rods) s.fill(23, 46, 2, 14, 'control_rod').fill(29, 46, 2, 14, 'control_rod');
    let hot = 0;
    until(s, 900, () => {
      for (let k = 0; k < s.world.size; k++) if (s.world.type[k] === s.id('uranium') || s.world.type[k] === s.id('corium')) hot = Math.max(hot, s.world.temp[k]);
      return false;
    });
    return hot;
  };
  const bare = pile(false);
  const rodded = pile(true);
  return { ok: rodded < bare - 200 && rodded < 800, detail: `hottest fuel over 15 s: ${fmt(bare)} °C bare, ${fmt(rodded)} °C with rods` };
});
check('flour', 'kneads with water into dough, which bakes into bread', () => {
  const s = new Scene().fill(0, 60, W, 4, 'wall').fill(20, 50, 20, 6, 'flour').fill(20, 44, 20, 4, 'water').run(600);
  const dough = s.count('dough');
  const oven = new Scene().fill(16, 60, 32, 4, 'heater').fill(24, 54, 16, 6, 'dough').run(900);
  return { ok: dough > 10 && oven.count('bread') + oven.count('toast') > 10, detail: `dough ${dough}; on the heater: bread ${oven.count('bread')}, toast ${oven.count('toast')}` };
});
check('manganese_dioxide', 'tears hydrogen peroxide into oxygen without being used up', () => {
  const s = new Scene().fill(0, 60, W, 4, 'wall').fill(20, 58, 24, 2, 'manganese_dioxide').fill(20, 40, 24, 8, 'hydrogen_peroxide').run(600);
  return { ok: s.count('manganese_dioxide') === 48 && s.count('oxygen') > 20, detail: `catalyst ${s.count('manganese_dioxide')} of 48, oxygen ${s.count('oxygen')}` };
});
check('soap', 'whipped into foam by gas, and the foam slowly pops', () => {
  const s = new Scene().fill(0, 60, W, 4, 'wall').fill(16, 50, 32, 10, 'soap').fill(16, 46, 32, 2, 'carbon_dioxide');
  let most = 0;
  until(s, 600, () => ((most = Math.max(most, s.count('foam'))), false));
  s.run(2400);
  return { ok: most > 10 && s.count('foam') < most, detail: `foam peak ${most}, after 40 s ${s.count('foam')}` };
});
check('epoxy_resin', 'sets hard with hardener', () => {
  const s = new Scene().fill(0, 60, W, 4, 'wall').fill(16, 56, 16, 4, 'epoxy_resin').fill(32, 56, 16, 4, 'epoxy_hardener').run(900);
  return { ok: s.count('epoxy') > 10, detail: `epoxy ${s.count('epoxy')}` };
});
check('copper_sulfate_crystal', 'grows in copper sulfate solution', () => {
  const s = new Scene().fill(0, 60, W, 4, 'wall').fill(10, 30, 2, 30, 'wall').fill(52, 30, 2, 30, 'wall').fill(12, 40, 40, 20, 'water').fill(12, 34, 40, 4, 'copper_sulfate').run(900);
  s.fill(30, 58, 2, 2, 'copper_sulfate_crystal').run(1800);
  return { ok: s.count('copper_sulfate_crystal') > 8, detail: `crystal cells ${s.count('copper_sulfate_crystal')} from 4` };
});
check('cabbage_juice', 'turns pink with vinegar and green with lye', () => {
  const s = new Scene().fill(0, 60, W, 4, 'wall').fill(4, 56, 56, 4, 'cabbage_juice').fill(4, 52, 6, 3, 'vinegar').fill(54, 52, 6, 3, 'lye').run(300);
  return { ok: s.count('pink_juice') > 0 && s.count('green_juice') > 0, detail: `pink ${s.count('pink_juice')}, green ${s.count('green_juice')}` };
});

// ---- Run --------------------------------------------------------------------------

const results = checks.map((c) => {
  const t0 = Date.now();
  let r: { ok: boolean; detail: string };
  try {
    r = c.run();
  } catch (e) {
    r = { ok: false, detail: `crashed: ${e instanceof Error ? e.message : String(e)}` };
  }
  return { ...c, ...r, ms: Date.now() - t0 };
});
const failed = results.filter((r) => !r.ok);
const covered = new Set(results.map((r) => r.element));
const uncovered = ELEMENTS.filter((e) => e.key !== 'empty' && !covered.has(e.key)).map((e) => e.name);

const out: string[] = [];
out.push('# Sandglass behaviour checks');
out.push('');
out.push('Generated by `npm run behaviour`. Each check builds a small scene, runs the real engine, and measures one promise from an element\'s description.');
out.push('');
out.push(`- Checks: ${results.length}`);
out.push(`- Passed: ${results.length - failed.length}`);
out.push(`- Failed: ${failed.length}`);
if (uncovered.length) out.push(`- Elements with no check yet: ${uncovered.join(', ')}`);
out.push('');
out.push('| | Element | Promise | Measured |');
out.push('| --- | --- | --- | --- |');
for (const r of results) {
  const name = ELEMENTS[elementId(r.element)].name;
  out.push(`| ${r.ok ? 'pass' : '**FAIL**'} | ${name} | ${r.claim} | ${r.detail} |`);
}
out.push('');
writeFileSync(new URL('../docs/BEHAVIOUR.md', import.meta.url), out.join('\n'));
for (const r of failed) console.log(`FAIL ${r.element}: ${r.claim} (${r.detail})`);
console.log(`Behaviour: ${results.length - failed.length}/${results.length} passed. Wrote docs/BEHAVIOUR.md.`);
if (failed.length) process.exitCode = 1;
