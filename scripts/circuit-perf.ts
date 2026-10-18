/**
 * Circuit frame-time check: draws thick circuits the way a player does
 * (wire loops with a big brush, thick batteries, bulbs, an LED, a switch, a
 * capacitor) on a 480 x 270 grid, keeps painting wire while it runs, and
 * times each step.
 * Run: npx tsx scripts/circuit-perf.ts [frames] [paint every n frames] [joined]
 * "joined" paints onto a live loop (the worst case: the circuit changes every
 * paint); without it the stroke grows inside a loop without touching it.
 */
import { elementId } from '../src/sim/elements';
import { OP_STAMP, OP_TOGGLE, applyOp } from '../src/sim/ops';
import { step } from '../src/sim/step';
import { World } from '../src/sim/world';

const world = new World(480, 270, 1);

function paint(key: string, x: number, y: number, r: number): void {
  applyOp(world, { kind: OP_STAMP, x, y, r, mode: elementId(key), vx: 0, vy: 0 });
}

/** A stroke from (x0, y0) to (x1, y1), stamped every cell, as a drag does. */
function stroke(key: string, x0: number, y0: number, x1: number, y1: number, r: number): void {
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
  for (let k = 0; k <= n; k++) paint(key, Math.round(x0 + ((x1 - x0) * k) / n), Math.round(y0 + ((y1 - y0) * k) / n), r);
}

function loop(x0: number, y0: number, x1: number, y1: number, r: number): void {
  stroke('wire', x0, y0, x1, y0, r);
  stroke('wire', x1, y0, x1, y1, r);
  stroke('wire', x1, y1, x0, y1, r);
  stroke('wire', x0, y1, x0, y0, r);
}

// Loop 1: brush radius 6, battery on the left run, two bulbs and a switch.
loop(20, 20, 200, 120, 6);
paint('battery', 20, 70, 6);
paint('bulb', 90, 20, 2);
paint('bulb', 140, 20, 2);
paint('switch', 200, 70, 4);
// Loop 2: radius 4, two batteries, an LED and a resistor.
loop(240, 20, 460, 110, 4);
paint('battery', 240, 50, 4);
paint('battery', 460, 80, 4);
paint('led', 300, 110, 2);
paint('resistor', 380, 110, 2);
// Loop 3: radius 8, a battery and a row of bulbs.
loop(20, 160, 300, 250, 8);
paint('battery', 160, 250, 7);
for (let x = 60; x < 260; x += 40) paint('bulb', x, 160, 2);
// Loop 4: radius 5, with a capacitor.
loop(330, 150, 460, 250, 5);
paint('battery', 330, 200, 5);
paint('capacitor', 460, 200, 4);
paint('bulb', 400, 150, 2);

const frames = Number(process.argv[2] ?? 600);
const every = Number(process.argv[3] ?? 4);
const x0 = process.argv[4] === 'joined' ? 26 : 40;
const times: number[] = [];
for (let f = 0; f < frames; f++) {
  // Still drawing: a wire stroke grows along loop 3's inside.
  if (f % every === 0 && f < 400) paint('wire', x0 + ((f / every) % 240), 205, 5);
  // The switch opens halfway.
  if (f === 300) applyOp(world, { kind: OP_TOGGLE, x: 200, y: 70, r: 0, mode: 0, vx: 0, vy: 0 });
  const t0 = performance.now();
  step(world);
  times.push(performance.now() - t0);
}
const sorted = [...times].sort((a, b) => a - b);
const mean = times.reduce((a, b) => a + b, 0) / frames;
console.log(
  `${frames} frames: step mean ${mean.toFixed(2)} ms, median ${sorted[frames >> 1].toFixed(2)}, p95 ${sorted[(frames * 0.95) | 0].toFixed(2)}, max ${sorted[frames - 1].toFixed(2)}`,
);
