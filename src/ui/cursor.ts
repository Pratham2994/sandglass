import type { Brush } from '../input/brush';
import { ELEMENTS } from '../sim/elements';

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

/**
 * Ring that shows the brush size under the pointer. Replaces the system cursor
 * over the canvas. Nothing else floats over the play area: what is under the
 * pointer is read in the lens below the canvas.
 */
export function mountCursor(brush: Brush): void {
  const ring = document.createElement('div');
  ring.className = 'brush-ring';
  document.body.append(ring);

  const update = (): void => {
    ring.hidden = brush.gesturing || (!brush.hovering && !brush.held);
    if (ring.hidden) return;
    // Inspecting reads one cell, so the ring marks one cell.
    const d = Math.max(6, (brush.inspecting ? 1 : brush.radius * 2 + 1) * brush.cellCssSize());
    ring.style.width = `${d}px`;
    ring.style.height = `${d}px`;
    ring.style.transform = `translate(${brush.clientX - d / 2}px, ${brush.clientY - d / 2}px)`;
    // The ring takes the colour of what the brush will place; the eraser is plain white.
    ring.style.borderColor = brush.erasing ? 'rgb(255 255 255 / 0.7)' : ringColour(brush.element);
    ring.classList.toggle('erasing', brush.erasing);
  };
  brush.subscribe(update);
  window.addEventListener('resize', update);
  update();
}
