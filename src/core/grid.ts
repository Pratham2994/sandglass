/** Screen (device) pixels per cell on a normal screen: 480 × 270 cells at 1080p. */
export const BASE_CELL_PX = 4;
/** Hard cap on cell count. Larger screens get bigger cells instead. */
export const MAX_CELLS = 160_000;
/** Smallest cell on a touch screen, in CSS px. */
const TOUCH_CELL_CSS_PX = 3;

export interface GridSize {
  w: number;
  h: number;
  /** Device pixels per cell. */
  cellPx: number;
}

/**
 * Resolves once the element has a non-zero size. A page opened in a hidden or
 * background view can start at 0 × 0, which would give an empty grid.
 */
export function whenSized(el: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    if (el.clientWidth > 0 && el.clientHeight > 0) return resolve();
    const ro = new ResizeObserver(() => {
      if (el.clientWidth > 0 && el.clientHeight > 0) {
        ro.disconnect();
        resolve();
      }
    });
    ro.observe(el);
  });
}

/**
 * Picks the grid size for an area of the page. Cells are a whole number of
 * device pixels so they stay crisp. The grid covers the area; at most one
 * partial cell hangs off the top and right edges.
 */
export function gridFor(el: HTMLElement): GridSize {
  const dpr = window.devicePixelRatio || 1;
  const pw = Math.round(el.clientWidth * dpr);
  const ph = Math.round(el.clientHeight * dpr);
  // On a touch screen a cell is at least TOUCH_CELL_CSS_PX on screen: a phone at
  // 3 device px per CSS px would otherwise get cells too fine to draw with a finger.
  const touch = typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;
  let cellPx = touch ? Math.max(BASE_CELL_PX, Math.round(TOUCH_CELL_CSS_PX * dpr)) : BASE_CELL_PX;
  let w = Math.ceil(pw / cellPx);
  let h = Math.ceil(ph / cellPx);
  while (w * h > MAX_CELLS) {
    cellPx++;
    w = Math.ceil(pw / cellPx);
    h = Math.ceil(ph / cellPx);
  }
  return { w: Math.max(1, w), h: Math.max(1, h), cellPx };
}

/**
 * Sizes the canvas at exactly cellPx device pixels per cell and pins it to the
 * bottom-left of its area, so the floor sits on the area's bottom edge and
 * cells stay crisp.
 */
export function fitCanvas(canvas: HTMLCanvasElement, size: GridSize): void {
  const dpr = window.devicePixelRatio || 1;
  const s = canvas.style;
  s.width = `${(size.w * size.cellPx) / dpr}px`;
  s.height = `${(size.h * size.cellPx) / dpr}px`;
}
