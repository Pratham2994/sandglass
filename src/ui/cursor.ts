import type { Brush } from '../input/brush';
import { ELEMENTS } from '../sim/elements';

/** Ring that shows the brush size under the pointer. Replaces the system cursor over the canvas. */
export function mountCursor(brush: Brush): void {
  const ring = document.createElement('div');
  ring.className = 'brush-ring';
  document.body.append(ring);

  const update = (): void => {
    ring.hidden = !brush.hovering && !brush.held;
    if (ring.hidden) return;
    const d = Math.max(6, (brush.radius * 2 + 1) * brush.cellCssSize());
    ring.style.width = `${d}px`;
    ring.style.height = `${d}px`;
    ring.style.transform = `translate(${brush.clientX - d / 2}px, ${brush.clientY - d / 2}px)`;
    // The ring takes the colour of what the brush will place; the eraser is plain white.
    ring.style.borderColor = brush.erasing ? 'rgb(255 255 255 / 0.7)' : `${ELEMENTS[brush.element].colours[0]}d0`;
    ring.classList.toggle('erasing', brush.erasing);
  };
  brush.subscribe(update);
  window.addEventListener('resize', update);
  update();
}
