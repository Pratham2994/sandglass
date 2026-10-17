import { EMPTY, SAND } from '../sim/elements';
import { MODE_COOL, MODE_ERASE, MODE_HEAT, OP_STAMP, OP_WIND, applyOp, type Op } from '../sim/ops';
import type { World } from '../sim/world';

export const MAX_RADIUS = 64;
/** Mode values queued for strokes that are not an element (wind is not a stamp). */
const WIND = -4;
/** Air speed the wind tool adds per stamp, along the stroke. */
const WIND_SPEED = 1.6;

/** Brush tools that are not elements. */
export type Tool = 'heat' | 'cool' | 'wind';
/** Wheel delta (px) per brush size step. */
const WHEEL_STEP = 40;

/**
 * Brush input. Pointer events only queue points; the grid changes in
 * `apply()`, called at the start of each frame, so input lands at a fixed
 * place in the frame order (needed for deterministic replay later).
 * Left drag draws the selected element into empty cells (or erases with the
 * eraser tool), right drag erases, a middle click picks the element under it,
 * holding still keeps pouring, the wheel changes the radius.
 */
export class Brush {
  radius = 4;
  element = SAND;
  /** Eraser tool: left drag erases too. */
  erasing = false;
  /** Heat, cool or wind tool in place of an element, or null. */
  tool: Tool | null = null;
  /** Where the brush's ops go: the timeline records and applies them. Default: apply directly. */
  sink: (op: Op) => void;
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
    this.sink = (op) => applyOp(world, op);

    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    canvas.addEventListener('pointerdown', (e) => this.onDown(e));
    // A middle press must not start the browser's autoscroll.
    canvas.addEventListener('mousedown', (e) => e.button === 1 && e.preventDefault());
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
    this.tool = null;
    this.emit();
  }

  setTool(tool: Tool): void {
    this.tool = tool;
    this.erasing = false;
    this.emit();
  }

  setErasing(on: boolean): void {
    this.erasing = on;
    if (on) this.tool = null;
    this.emit();
  }

  setRadius(r: number): void {
    this.radius = Math.max(0, Math.min(MAX_RADIUS, Math.round(r)));
    this.emit();
  }

  /** Grid cell under the pointer, or null when the pointer is not over the canvas. */
  cellUnderPointer(): [number, number] | null {
    if (!this.hovering) return null;
    const r = this.canvas.getBoundingClientRect();
    const x = Math.floor(((this.clientX - r.left) / r.width) * this.world.w);
    const y = Math.floor(((this.clientY - r.top) / r.height) * this.world.h);
    if (x < 0 || y < 0 || x >= this.world.w || y >= this.world.h) return null;
    return [x, y];
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
    if (e.button === 1) {
      e.preventDefault();
      this.pick(e);
      return;
    }
    if (this.held || (e.button !== 0 && e.button !== 2)) return;
    e.preventDefault();
    this.canvas.setPointerCapture(e.pointerId);
    this.button = e.button;
    this.mode =
      e.button === 2 || this.erasing
        ? MODE_ERASE
        : this.tool === 'heat'
          ? MODE_HEAT
          : this.tool === 'cool'
            ? MODE_COOL
            : this.tool === 'wind'
              ? WIND
              : this.element;
    this.queue.push(NaN, NaN, this.mode);
    this.track(e);
    this.queuePoint(e);
    this.setHeld(true);
  }

  /** Eyedropper: selects the element in the cell under the pointer (air picks nothing). */
  private pick(e: PointerEvent): void {
    this.track(e);
    const cell = this.cellUnderPointer();
    if (!cell) return;
    const t = this.world.type[cell[1] * this.world.w + cell[0]];
    if (t !== EMPTY) this.setElement(t);
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
    // Only over the canvas: everywhere else (the library) the wheel scrolls as usual.
    if (!(e.target instanceof Element) || !e.target.closest('#stage')) return;
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

  /** Stamps discs along a line, about two per radius; wind blows along it instead. */
  private segment(x0: number, y0: number, x1: number, y1: number, mode: number): void {
    const dx = x1 - x0;
    const dy = y1 - y0;
    if (mode === WIND) {
      // Wind blows along the stroke, stronger the faster you drag.
      const len = Math.hypot(dx, dy);
      if (len > 0) {
        const k = (WIND_SPEED * Math.min(3, len / 4)) / len;
        this.sink({ kind: OP_WIND, x: Math.round(x1), y: Math.round(y1), r: this.radius, mode: 0, vx: dx * k, vy: dy * k });
      }
      return;
    }
    const len = Math.max(Math.abs(dx), Math.abs(dy));
    const stride = Math.max(1, this.radius >> 1);
    const n = Math.ceil(len / stride);
    for (let s = 1; s <= n; s++) this.stamp(Math.round(x0 + (dx * s) / n), Math.round(y0 + (dy * s) / n), mode);
    if (n === 0) this.stamp(x1, y1, mode);
  }

  /** One disc of the brush centred on cell (cx, cy), as a recorded op. */
  private stamp(cx: number, cy: number, mode: number): void {
    if (mode === WIND) return;
    this.sink({ kind: OP_STAMP, x: cx, y: cy, r: this.radius, mode, vx: 0, vy: 0 });
  }
}
