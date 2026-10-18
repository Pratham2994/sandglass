/**
 * The canvas view: how far it is zoomed in (1 shows the whole world) and the
 * world point at the middle of the canvas (0 to 1 across and down). The
 * renderer draws only that part of the world and the brush maps the pointer
 * through it. It is not part of the simulation, so saves and rewinds ignore it.
 */
export const view = { zoom: 1, cx: 0.5, cy: 0.5 };

/** Zoom steps for the buttons and keys. */
const ZOOMS = [1, 1.5, 2, 3, 4, 6, 8];
const MAX_ZOOM = ZOOMS[ZOOMS.length - 1];

const listeners: (() => void)[] = [];

/** Calls `fn` whenever the view changes. */
export function onView(fn: () => void): void {
  listeners.push(fn);
}

/** Keeps the view inside the world. */
function settle(): void {
  const half = 0.5 / view.zoom;
  view.cx = Math.min(1 - half, Math.max(half, view.cx));
  view.cy = Math.min(1 - half, Math.max(half, view.cy));
  for (const fn of listeners) fn();
}

/** A point on the canvas (0 to 1 across and down) to the world point under it (0 to 1). */
export function toWorld(fx: number, fy: number): [number, number] {
  return [view.cx + (fx - 0.5) / view.zoom, view.cy + (fy - 0.5) / view.zoom];
}

/** Zooms to `z`, keeping the world point under canvas point (fx, fy) where it is. */
export function zoomTo(z: number, fx = 0.5, fy = 0.5): void {
  const [wx, wy] = toWorld(fx, fy);
  view.zoom = Math.max(1, Math.min(MAX_ZOOM, z));
  view.cx = wx - (fx - 0.5) / view.zoom;
  view.cy = wy - (fy - 0.5) / view.zoom;
  settle();
}

/** One zoom step in (+1) or out (-1), about canvas point (fx, fy). */
export function zoomStep(dir: number, fx = 0.5, fy = 0.5): void {
  const z = dir > 0 ? ZOOMS.find((s) => s > view.zoom + 1e-6) : [...ZOOMS].reverse().find((s) => s < view.zoom - 1e-6);
  if (z !== undefined) zoomTo(z, fx, fy);
}

/** Drags the view by a fraction of the canvas (the world moves with the pointer). */
export function pan(dfx: number, dfy: number): void {
  view.cx -= dfx / view.zoom;
  view.cy -= dfy / view.zoom;
  settle();
}
