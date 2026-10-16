/** Screen (device) pixels per cell on a normal screen: 480 × 270 cells at 1080p. */
export const BASE_CELL_PX = 4;
/** Hard cap on cell count. Larger screens get bigger cells instead. */
export const MAX_CELLS = 160_000;

export interface GridSize {
  w: number;
  h: number;
  /** Device pixels per cell when the grid was sized. */
  cellPx: number;
}

/**
 * Resolves once the window has a non-zero size. A page opened in a hidden or
 * background view can start at 0 × 0, which would give an empty grid.
 */
export function whenWindowSized(): Promise<void> {
  return new Promise((resolve) => {
    const check = (): void => {
      if (window.innerWidth > 0 && window.innerHeight > 0) {
        window.removeEventListener('resize', check);
        resolve();
      }
    };
    window.addEventListener('resize', check);
    check();
  });
}

/**
 * Picks the grid size from the window at start. Cells are a whole number of
 * device pixels so they stay crisp. The grid covers the window; at most one
 * partial cell hangs off the right and bottom edges.
 */
export function gridFromWindow(): GridSize {
  const dpr = window.devicePixelRatio || 1;
  const pw = Math.round(window.innerWidth * dpr);
  const ph = Math.round(window.innerHeight * dpr);
  let cellPx = BASE_CELL_PX;
  let w = Math.ceil(pw / cellPx);
  let h = Math.ceil(ph / cellPx);
  while (w * h > MAX_CELLS) {
    cellPx++;
    w = Math.ceil(pw / cellPx);
    h = Math.ceil(ph / cellPx);
  }
  return { w, h, cellPx };
}

/**
 * Scales the canvas so square cells cover the whole window, centred.
 * Uses a whole number of device pixels per cell when that overflows the
 * window by 2 cells or less, so cells stay crisp at the start size.
 * After a resize the same grid is stretched to cover the new window.
 */
export function fitCanvas(canvas: HTMLCanvasElement, w: number, h: number): void {
  const dpr = window.devicePixelRatio || 1;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let dev = Math.max((vw * dpr) / w, (vh * dpr) / h);
  const whole = Math.ceil(dev - 1e-9);
  if ((whole - dev) * Math.max(w, h) <= whole * 2) dev = whole;
  const cw = (w * dev) / dpr;
  const ch = (h * dev) / dpr;
  const s = canvas.style;
  s.width = `${cw}px`;
  s.height = `${ch}px`;
  s.left = `${Math.round(((vw - cw) / 2) * dpr) / dpr}px`;
  s.top = `${Math.round(((vh - ch) / 2) * dpr) / dpr}px`;
}
