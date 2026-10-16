import { EMPTY, PHASE_OF, PH_GAS, PH_LIQUID, PH_POWDER, SAND } from '../sim/elements';
import type { World } from '../sim/world';

export const MAX_RADIUS = 64;
/** Mode value queued for erase strokes. */
const ERASE = -1;
/** Chance per empty cell per stamp that a powder grain appears, so pours look like a stream, not a block. */
const POWDER_FILL = 0.3;
/** Same for liquids: a pour of separate drops that merge as they land. */
const LIQUID_FILL = 0.45;
/** Wheel delta (px) per brush size step. */
const WHEEL_STEP = 40;

/**
 * Brush input. Pointer events only queue points; the grid changes in
 * `apply()`, called at the start of each frame, so input lands at a fixed
 * place in the frame order (needed for deterministic replay later).
 * Left drag draws the selected element into empty cells (or erases with the
 * eraser tool), right drag erases,
 * holding still keeps pouring, the wheel changes the radius.
 */
export class Brush {
  radius = 4;
  element = SAND;
  /** Eraser tool: left drag erases too. */
  erasing = false;
  /** True while a mouse button is down on the canvas. */
  held = false;
  /** Last pointer position in client px, and whether it is over the canvas. */
  clientX = 0;
  clientY = 0;
  hovering = false;

  private readonly canvas: HTMLCanvasElement;
  private readonly world: World;
  /** Queued points as (x, y, mode) triples in cell units. x = NaN starts a new stroke. */
  private readonly queue: number[] = [];
  private lastX = NaN;
  private lastY = NaN;
  private mode = 0;
  private button = -1;
  private wheelAcc = 0;
  private readonly listeners: (() => void)[] = [];

  constructor(canvas: HTMLCanvasElement, world: World) {
    this.canvas = canvas;
    this.world = world;

    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    canvas.addEventListener('pointerdown', (e) => this.onDown(e));
    canvas.addEventListener('pointermove', (e) => this.onMove(e));
    canvas.addEventListener('pointerup', (e) => this.onUp(e));
    canvas.addEventListener('pointercancel', (e) => this.onUp(e));
    canvas.addEventListener('pointerenter', (e) => {
      this.hovering = true;
      this.track(e);
    });
    canvas.addEventListener('pointerleave', () => {
      this.hovering = false;
      this.emit();
    });
    window.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });
  }

  /** Calls `fn` whenever radius, element, position or held state changes. */
  subscribe(fn: () => void): void {
    this.listeners.push(fn);
  }

  setElement(id: number): void {
    this.element = id;
    this.erasing = false;
    this.emit();
  }

  setErasing(on: boolean): void {
    this.erasing = on;
    this.emit();
  }

  setRadius(r: number): void {
    this.radius = Math.max(0, Math.min(MAX_RADIUS, Math.round(r)));
    this.emit();
  }

  /** Size of one cell on screen, in CSS px. */
  cellCssSize(): number {
    return this.canvas.getBoundingClientRect().width / this.world.w;
  }

  /** Drops queued input and ends any stroke. */
  cancel(): void {
    this.queue.length = 0;
    this.lastX = NaN;
    this.lastY = NaN;
    this.setHeld(false);
  }

  /** Applies queued input to the grid. Returns true if anything was queued or poured. */
  apply(): boolean {
    const q = this.queue;
    if (q.length === 0 && !this.held) return false;
    for (let k = 0; k < q.length; k += 3) {
      const x = q[k];
      const y = q[k + 1];
      const mode = q[k + 2];
      if (Number.isNaN(x)) {
        this.lastX = NaN;
        continue;
      }
      if (Number.isNaN(this.lastX)) this.stamp(x, y, mode);
      else this.segment(this.lastX, this.lastY, x, y, mode);
      this.lastX = x;
      this.lastY = y;
    }
    // Held still: keep pouring at the last point.
    if (q.length === 0 && this.held && !Number.isNaN(this.lastX)) this.stamp(this.lastX, this.lastY, this.mode);
    q.length = 0;
    if (!this.held) this.lastX = NaN;
    return true;
  }

  private onDown(e: PointerEvent): void {
    if (this.held || (e.button !== 0 && e.button !== 2)) return;
    e.preventDefault();
    this.canvas.setPointerCapture(e.pointerId);
    this.button = e.button;
    this.mode = e.button === 2 || this.erasing ? ERASE : this.element;
    this.queue.push(NaN, NaN, this.mode);
    this.track(e);
    this.queuePoint(e);
    this.setHeld(true);
  }

  private onMove(e: PointerEvent): void {
    this.track(e);
    if (this.held) this.queuePoint(e);
  }

  private onUp(e: PointerEvent): void {
    if (!this.held || (e.type === 'pointerup' && e.button !== this.button)) return;
    this.queuePoint(e);
    this.setHeld(false);
  }

  private onWheel(e: WheelEvent): void {
    if (e.target instanceof Element && e.target.closest('.panel')) return;
    e.preventDefault();
    if (Math.sign(e.deltaY) !== Math.sign(this.wheelAcc)) this.wheelAcc = 0;
    this.wheelAcc += e.deltaMode === 0 ? e.deltaY : e.deltaY * WHEEL_STEP;
    while (Math.abs(this.wheelAcc) >= WHEEL_STEP) {
      const up = this.wheelAcc < 0;
      this.wheelAcc -= up ? -WHEEL_STEP : WHEEL_STEP;
      const d = Math.max(1, Math.round(this.radius * 0.15));
      this.setRadius(this.radius + (up ? d : -d));
    }
  }

  private track(e: PointerEvent): void {
    this.clientX = e.clientX;
    this.clientY = e.clientY;
    this.emit();
  }

  private queuePoint(e: PointerEvent): void {
    const r = this.canvas.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * this.world.w;
    const y = ((e.clientY - r.top) / r.height) * this.world.h;
    this.queue.push(Math.floor(x), Math.floor(y), this.mode);
  }

  private setHeld(held: boolean): void {
    this.held = held;
    document.body.classList.toggle('drawing', held);
    this.emit();
  }

  private emit(): void {
    for (const fn of this.listeners) fn();
  }

  /** Stamps discs along a line, about two per radius. */
  private segment(x0: number, y0: number, x1: number, y1: number, mode: number): void {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const len = Math.max(Math.abs(dx), Math.abs(dy));
    const stride = Math.max(1, this.radius >> 1);
    const n = Math.ceil(len / stride);
    for (let s = 1; s <= n; s++) this.stamp(Math.round(x0 + (dx * s) / n), Math.round(y0 + (dy * s) / n), mode);
    if (n === 0) this.stamp(x1, y1, mode);
  }

  /** Applies one disc of the brush centred on cell (cx, cy). */
  private stamp(cx: number, cy: number, mode: number): void {
    const world = this.world;
    const { w, h, type } = world;
    const r = this.radius;
    const r2 = r * r + r;
    const ph = mode === ERASE ? 0 : PHASE_OF[mode];
    const p = ph === PH_POWDER ? POWDER_FILL : ph === PH_LIQUID || ph === PH_GAS ? LIQUID_FILL : 1;
    const y0 = Math.max(0, cy - r);
    const y1 = Math.min(h - 1, cy + r);
    const x0 = Math.max(0, cx - r);
    const x1 = Math.min(w - 1, cx + r);
    for (let y = y0; y <= y1; y++) {
      const dy = y - cy;
      for (let x = x0; x <= x1; x++) {
        const dx = x - cx;
        if (dx * dx + dy * dy > r2) continue;
        const i = y * w + x;
        if (mode === ERASE) {
          if (type[i] !== EMPTY) world.place(i, EMPTY);
        } else if (type[i] === EMPTY && (p >= 1 || world.rng.next() < p)) {
          world.place(i, mode);
        }
      }
    }
  }
}
