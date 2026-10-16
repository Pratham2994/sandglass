import type { World } from '../sim/world';

/** How often the HUD text refreshes. */
const REFRESH_MS = 250;
/** Weight of the newest sample in the moving averages. */
const EMA = 0.1;

/** Frame timings, smoothed. Written by the loop, read by the HUD. */
export class PerfStats {
  simMs = 0;
  drawMs = 0;

  addSim(ms: number): void {
    this.simMs += (ms - this.simMs) * EMA;
  }

  addDraw(ms: number): void {
    this.drawMs += (ms - this.drawMs) * EMA;
  }
}

/**
 * Debug HUD under the status pill: sim and draw time per frame, awake
 * chunks, grid size. Hidden until toggled.
 */
export function mountHud(perf: PerfStats, world: World): { toggle(): boolean } {
  const hud = document.createElement('div');
  hud.className = 'panel hud num';
  hud.hidden = true;
  const line = (label: string): HTMLSpanElement => {
    const row = document.createElement('div');
    const name = document.createElement('span');
    name.className = 'muted';
    name.textContent = label;
    const value = document.createElement('span');
    row.append(name, value);
    hud.append(row);
    return value;
  };
  const sim = line('sim');
  const draw = line('draw');
  const chunks = line('chunks');
  const grid = line('grid');
  document.body.append(hud);

  const update = (): void => {
    if (hud.hidden) return;
    sim.textContent = `${perf.simMs.toFixed(2)} ms`;
    draw.textContent = `${perf.drawMs.toFixed(2)} ms`;
    chunks.textContent = `${world.awakeCount()} / ${world.awake.length}`;
    grid.textContent = `${world.w} × ${world.h}`;
  };
  setInterval(update, REFRESH_MS);

  return {
    toggle() {
      hud.hidden = !hud.hidden;
      update();
      return !hud.hidden;
    },
  };
}
