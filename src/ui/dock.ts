import type { Brush } from '../input/brush';
import { LEVEL_STRIDE, L_PLAIN, L_TOP, buildPalette } from '../render/palette';
import { ELEMENTS, EMPTY } from '../sim/elements';
import { Rng } from '../sim/rng';

/** Swatch size in cells. */
const SWATCH = 7;

/** Draws a small grainy sample of an element, using the game palette. */
function swatch(id: number, lut: Uint32Array, rng: Rng): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = SWATCH;
  c.height = SWATCH;
  c.className = 'swatch';
  const ctx = c.getContext('2d');
  if (ctx) {
    const img = ctx.createImageData(SWATCH, SWATCH);
    const px = new Uint32Array(img.data.buffer);
    for (let i = 0; i < px.length; i++) {
      // Light from above on the top row, like the grains on screen.
      const level = i < SWATCH ? L_TOP : L_PLAIN;
      px[i] = lut[level * LEVEL_STRIDE + ((id << 8) | (rng.nextU32() & 255))];
    }
    ctx.putImageData(img, 0, 0);
  }
  return c;
}

/**
 * Floating dock at the bottom centre: one button per element and the
 * brush size. Fades while drawing (see style.css).
 */
export function mountDock(brush: Brush): void {
  const dock = document.createElement('div');
  dock.className = 'panel dock';

  const list = document.createElement('div');
  list.className = 'dock-elements';
  list.setAttribute('role', 'radiogroup');
  list.setAttribute('aria-label', 'Element');

  const lut = buildPalette();
  // Swatches are UI only, so their noise uses its own RNG, not the world's.
  const rng = new Rng(7);
  const buttons: HTMLButtonElement[] = [];
  ELEMENTS.forEach((el, id) => {
    if (id === EMPTY) return;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'el';
    b.dataset.id = String(id);
    b.title = `${el.name} (${el.category})`;
    b.setAttribute('role', 'radio');
    const label = document.createElement('span');
    label.textContent = el.name;
    b.append(swatch(id, lut, rng), label);
    // No focus on mouse press, so Space keeps pausing instead of pressing the button.
    b.addEventListener('pointerdown', (e) => e.preventDefault());
    b.addEventListener('click', () => brush.setElement(id));
    buttons.push(b);
    list.append(b);
  });

  const sep = document.createElement('div');
  sep.className = 'dock-sep';

  const size = document.createElement('div');
  size.className = 'dock-size';
  size.title = 'Brush size (scroll)';
  const dot = document.createElement('span');
  dot.className = 'size-dot';
  const sizeText = document.createElement('span');
  sizeText.className = 'num';
  size.append(dot, sizeText);

  dock.append(list, sep, size);
  document.body.append(dock);

  const update = (): void => {
    for (const b of buttons) {
      const on = Number(b.dataset.id) === brush.element;
      b.classList.toggle('on', on);
      b.setAttribute('aria-checked', String(on));
    }
    sizeText.textContent = String(brush.radius * 2 + 1);
    const d = 4 + Math.min(14, brush.radius / 2);
    dot.style.width = `${d}px`;
    dot.style.height = `${d}px`;
  };
  brush.subscribe(update);
  update();
}
