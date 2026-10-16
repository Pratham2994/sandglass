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
import { step } from '../src/sim/step';
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
check('battery', 'powers a wire', () => {
  const s = new Scene().fill(2, 38, 3, 3, 'battery').fill(5, 39, 40, 1, 'wire');
  const m = maxCharge(s, 42, 39, 300);
  return { ok: m > 0, detail: `charge at far end ${m}` };
});
check('mercury', 'carries charge like a wire', () => {
  // A one-cell line of mercury from the battery to the right edge, on a floor, so it cannot flow away.
  const s = new Scene().fill(0, 60, W, 4, 'wall').fill(11, 59, W - 11, 1, 'mercury').fill(8, 57, 3, 3, 'battery');
  s.run(30);
  const m = maxCharge(s, 50, 59, 300);
  return { ok: m > 0, detail: `charge at far end ${m}` };
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
