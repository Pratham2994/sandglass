import type { Brush } from '../input/brush';
import { ELEMENTS } from '../sim/elements';
import { inspectCell } from '../sim/inspect';
import type { World } from '../sim/world';

/**
 * Ring colour for an element: its brightest base colour, lifted so even dark
 * materials (stone, later coal or ash) stay visible on the dark canvas.
 */
function ringColour(id: number): string {
  let best = [0, 0, 0];
  let bestL = -1;
  for (const hex of ELEMENTS[id].colours) {
    const n = parseInt(hex.slice(1), 16);
    const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    const l = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
    if (l > bestL) {
      bestL = l;
      best = c;
    }
  }
  // Mix towards white until the ring reads at least mid-grey.
  const t = bestL < 140 ? (140 - bestL) / (255 - bestL) : 0;
  const [r, g, b] = best.map((v) => Math.round(v + (255 - v) * t));
  return `rgb(${r} ${g} ${b} / 0.85)`;
}

/** Ring that shows the brush size under the pointer. Replaces the system cursor over the canvas. */
export function mountCursor(brush: Brush, world: World): void {
  const ring = document.createElement('div');
  ring.className = 'brush-ring';
  // What is under the cursor, in a few words; the full report is in the panel.
  const label = document.createElement('div');
  label.className = 'cursor-label num';
  document.body.append(ring, label);
  const fmt = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 });
  const refreshLabel = (): void => {
    const cell = brush.held ? null : brush.cellUnderPointer();
    const rep = cell ? inspectCell(world, cell[0], cell[1]) : null;
    label.hidden = !rep;
    if (!rep) return;
    label.textContent = `${rep.name} · ${fmt.format(world.temp[cell![1] * world.w + cell![0]])} °C`;
    label.style.transform = `translate(${brush.clientX + 14}px, ${brush.clientY + 14}px)`;
  };
  setInterval(refreshLabel, 100);

  const update = (): void => {
    ring.hidden = !brush.hovering && !brush.held;
    if (ring.hidden) return;
    const d = Math.max(6, (brush.radius * 2 + 1) * brush.cellCssSize());
    ring.style.width = `${d}px`;
    ring.style.height = `${d}px`;
    ring.style.transform = `translate(${brush.clientX - d / 2}px, ${brush.clientY - d / 2}px)`;
    // The ring takes the colour of what the brush will place; the eraser is plain white.
    ring.style.borderColor = brush.erasing ? 'rgb(255 255 255 / 0.7)' : ringColour(brush.element);
    ring.classList.toggle('erasing', brush.erasing);
    refreshLabel();
  };
  brush.subscribe(update);
  window.addEventListener('resize', update);
  update();
}
