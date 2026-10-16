import type { Brush } from '../input/brush';

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
  };
  brush.subscribe(update);
  window.addEventListener('resize', update);
  update();
}
