import { EMPTY, SAND } from '../sim/elements';
import { MODE_COOL, MODE_ERASE, MODE_HEAT, OP_STAMP, OP_TOGGLE, OP_WIND, applyOp, isSwitchAt, type Op } from '../sim/ops';
import type { World } from '../sim/world';
import { pan, toWorld, view, zoomStep, zoomTo } from '../render/view';

export const MAX_RADIUS = 64;
/** Mode values queued for strokes that are not an element (wind is not a stamp). */
const WIND = -4;
/** Air speed the wind tool adds per stamp, along the stroke. */
const WIND_SPEED = 1.6;

/** Brush tools that are not elements. */
export type Tool = 'heat' | 'cool' | 'wind';
/** Wheel delta (px) per brush size step. */
const WHEEL_STEP = 40;
/** A one-finger touch waits this long (ms) before it draws, so a second finger can still make it a pinch. */
const TOUCH_DELAY_MS = 90;
/** A finger that moves this far (CSS px) draws at once, without the wait. */
const TOUCH_SLOP_PX = 10;
/** A pinch that ends below this zoom snaps back to the whole world. */
const ZOOM_SNAP = 1.1;

/**
 * Brush input. Pointer events only queue points; the grid changes in
 * `apply()`, called at the start of each frame, so input lands at a fixed
 * place in the frame order (needed for deterministic replay later).
 * Left drag draws the selected element into empty cells (or erases with the
 * eraser tool), right drag erases, a middle click picks the element under it,
 * a left click on a switch flips it instead of drawing,
 * holding still keeps pouring, the wheel changes the radius.
 * On a touch screen one finger draws, two fingers pinch to zoom and move
 * together to pan; a second finger cancels the first finger's stroke. In
 * inspect mode a touch reads the cell under it into the lens instead.
 */
export class Brush {
  radius = 4;
  element = SAND;
  /** Eraser tool: left drag erases too. */
  erasing = false;
  /** Heat, cool or wind tool in place of an element, or null. */
  tool: Tool | null = null;
  /** Inspect mode: a touch or click reads the cell under it into the lens instead of drawing. */
  inspecting = false;
  /** Cell last read in inspect mode, or null. */
  probe: [number, number] | null = null;
  /** True while two fingers pinch or pan (until every finger lifts). */
  gesturing = false;
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
  /** Switch clicks waiting for the next frame, as (x, y) pairs. */
  private readonly toggles: number[] = [];
  private lastX = NaN;
  private lastY = NaN;
  private mode = 0;
  private button = -1;
  /** Middle-button drag: pans the view; a middle click without a drag picks the element under the pointer. */
  private panning = false;
  private panMoved = false;
  private panX = 0;
  private panY = 0;
  private wheelAcc = 0;
  /** Fingers on the canvas by pointer id, in client px. */
  private readonly touches = new Map<number, { x: number; y: number }>();
  /** The finger that draws or inspects, or -1. */
  private touchId = -1;
  /** Timer of a one-finger stroke that waits to start (0: none), and where it started. */
  private pendingTimer = 0;
  private pendingX = 0;
  private pendingY = 0;
  /** Pinch midpoint (client px) and finger spacing at the last move. */
  private gestureX = 0;
  private gestureY = 0;
  private gestureDist = 0;
  private readonly listeners: (() => void)[] = [];

  constructor(canvas: HTMLCanvasElement, world: World) {
    this.canvas = canvas;
    this.world = world;
    this.sink = (op) => applyOp(world, op);

    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    canvas.addEventListener('pointerdown', (e) => this.onDown(e));
    // A middle press must not start the browser's autoscroll.
    canvas.addEventListener('mousedown', (e) => e.button === 1 && e.preventDefault());
    canvas.addEventListener('pointermove', (e) => (e.pointerType === 'touch' ? this.touchMove(e) : this.onMove(e)));
    canvas.addEventListener('pointerup', (e) => (e.pointerType === 'touch' ? this.touchUp(e) : this.onUp(e)));
    canvas.addEventListener('pointercancel', (e) => (e.pointerType === 'touch' ? this.touchUp(e) : this.onUp(e)));
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
    this.inspecting = false;
    this.emit();
  }

  setTool(tool: Tool): void {
    this.tool = tool;
    this.erasing = false;
    this.inspecting = false;
    this.emit();
  }

  setErasing(on: boolean): void {
    this.erasing = on;
    if (on) {
      this.tool = null;
      this.inspecting = false;
    }
    this.emit();
  }

  setInspecting(on: boolean): void {
    this.inspecting = on;
    if (on) this.erasing = false;
    this.emit();
  }

  setRadius(r: number): void {
    this.radius = Math.max(0, Math.min(MAX_RADIUS, Math.round(r)));
    this.emit();
  }

  /** Grid cell under the pointer, or null when the pointer is not over the canvas. */
  cellUnderPointer(): [number, number] | null {
    return this.hovering ? this.cellAt(this.clientX, this.clientY) : null;
  }

  /** Grid cell at client point (x, y), or null when it is off the world. */
  cellAt(clientX: number, clientY: number): [number, number] | null {
    const r = this.canvas.getBoundingClientRect();
    const [wx, wy] = toWorld((clientX - r.left) / r.width, (clientY - r.top) / r.height);
    const x = Math.floor(wx * this.world.w);
    const y = Math.floor(wy * this.world.h);
    if (x < 0 || y < 0 || x >= this.world.w || y >= this.world.h) return null;
    return [x, y];
  }

  /** Size of one cell on screen, in CSS px. */
  cellCssSize(): number {
    return (this.canvas.getBoundingClientRect().width / this.world.w) * view.zoom;
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
    for (let k = 0; k < this.toggles.length; k += 2) this.sink({ kind: OP_TOGGLE, x: this.toggles[k], y: this.toggles[k + 1], r: 0, mode: 0, vx: 0, vy: 0 });
    const toggled = this.toggles.length > 0;
    this.toggles.length = 0;
    if (q.length === 0 && !this.held) return toggled;
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
    // Working on the canvas takes the keyboard back from the search box, so I, E and 1 to 9 work again.
    if (document.activeElement instanceof HTMLElement && document.activeElement !== document.body) document.activeElement.blur();
    if (e.pointerType === 'touch') {
      this.touchDown(e);
      return;
    }
    if (e.button === 1) {
      e.preventDefault();
      this.canvas.setPointerCapture(e.pointerId);
      this.panning = true;
      this.panMoved = false;
      this.panX = e.clientX;
      this.panY = e.clientY;
      return;
    }
    if (this.held || (e.button !== 0 && e.button !== 2)) return;
    e.preventDefault();
    this.track(e);
    if (e.button === 0 && this.inspecting) {
      this.probeAt(e.clientX, e.clientY);
      return;
    }
    // A click on a switch flips it, at the start of the next frame like any other input.
    if (e.button === 0 && !this.erasing && this.toggleSwitch(e.clientX, e.clientY)) return;
    this.canvas.setPointerCapture(e.pointerId);
    this.startStroke(e.button, e.clientX, e.clientY);
  }

  /** Queues a flip if the cell at client point (x, y) is a switch; returns true if it is. */
  private toggleSwitch(x: number, y: number): boolean {
    const cell = this.cellAt(x, y);
    if (!cell || !isSwitchAt(this.world, cell[0], cell[1])) return false;
    this.toggles.push(cell[0], cell[1]);
    return true;
  }

  /** Begins a stroke with `button` (0 draws, 2 erases) at client point (x, y). */
  private startStroke(button: number, x: number, y: number): void {
    this.button = button;
    this.mode =
      button === 2 || this.erasing
        ? MODE_ERASE
        : this.tool === 'heat'
          ? MODE_HEAT
          : this.tool === 'cool'
            ? MODE_COOL
            : this.tool === 'wind'
              ? WIND
              : this.element;
    this.queue.push(NaN, NaN, this.mode);
    this.queuePoint(x, y);
    this.setHeld(true);
  }

  /** Inspect mode: the lens reads the cell at client point (x, y). */
  private probeAt(x: number, y: number): void {
    const cell = this.cellAt(x, y);
    if (!cell) return;
    this.probe = cell;
    this.emit();
  }

  private touchDown(e: PointerEvent): void {
    e.preventDefault();
    this.touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (this.touches.size === 2) {
      this.startGesture();
      return;
    }
    if (this.touches.size > 1 || this.gesturing) return;
    this.touchId = e.pointerId;
    this.track(e);
    if (this.inspecting) {
      this.probeAt(e.clientX, e.clientY);
      return;
    }
    this.pendingX = e.clientX;
    this.pendingY = e.clientY;
    this.pendingTimer = window.setTimeout(() => this.commitTouch(), TOUCH_DELAY_MS);
  }

  /** The waiting one-finger touch becomes a switch flip or a stroke from where it landed. */
  private commitTouch(): void {
    if (this.pendingTimer === 0) return;
    clearTimeout(this.pendingTimer);
    this.pendingTimer = 0;
    if (!this.erasing && this.toggleSwitch(this.pendingX, this.pendingY)) {
      this.touchId = -1;
      return;
    }
    this.startStroke(0, this.pendingX, this.pendingY);
  }

  /** A second finger: the first one's stroke stops (what it already drew stays) and the pinch begins. */
  private startGesture(): void {
    clearTimeout(this.pendingTimer);
    this.pendingTimer = 0;
    this.touchId = -1;
    this.cancel();
    this.gesturing = true;
    this.measureGesture();
    this.emit();
  }

  /** Midpoint and spacing of the first two fingers. */
  private measureGesture(): void {
    const [a, b] = this.touches.values();
    this.gestureX = (a.x + b.x) / 2;
    this.gestureY = (a.y + b.y) / 2;
    this.gestureDist = Math.hypot(a.x - b.x, a.y - b.y);
  }

  private touchMove(e: PointerEvent): void {
    const t = this.touches.get(e.pointerId);
    if (!t) return;
    t.x = e.clientX;
    t.y = e.clientY;
    if (this.gesturing) {
      if (this.touches.size >= 2) this.moveGesture();
      return;
    }
    if (e.pointerId !== this.touchId) return;
    this.track(e);
    if (this.inspecting) {
      this.probeAt(e.clientX, e.clientY);
      return;
    }
    if (this.pendingTimer !== 0 && Math.hypot(e.clientX - this.pendingX, e.clientY - this.pendingY) > TOUCH_SLOP_PX) this.commitTouch();
    if (this.held) this.queuePoint(e.clientX, e.clientY);
  }

  /** Pinch zooms about where the fingers were; moving both pans, the world follows them. */
  private moveGesture(): void {
    const r = this.canvas.getBoundingClientRect();
    const lastX = this.gestureX;
    const lastY = this.gestureY;
    const lastDist = this.gestureDist;
    this.measureGesture();
    if (lastDist > 0 && this.gestureDist > 0) zoomTo((view.zoom * this.gestureDist) / lastDist, (lastX - r.left) / r.width, (lastY - r.top) / r.height);
    pan((this.gestureX - lastX) / r.width, (this.gestureY - lastY) / r.height);
    this.emit();
  }

  private touchUp(e: PointerEvent): void {
    if (!this.touches.delete(e.pointerId)) return;
    if (this.gesturing) {
      // A lifted finger changes the pair; the gesture ends only when every finger is off.
      if (this.touches.size >= 2) this.measureGesture();
      else if (this.touches.size === 0) {
        this.gesturing = false;
        if (view.zoom < ZOOM_SNAP) zoomTo(1);
        this.emit();
      }
      return;
    }
    if (e.pointerId !== this.touchId) return;
    this.touchId = -1;
    if (this.pendingTimer !== 0) {
      if (e.type === 'pointercancel') {
        clearTimeout(this.pendingTimer);
        this.pendingTimer = 0;
        return;
      }
      // A quick tap still places one dab.
      this.commitTouch();
    }
    if (!this.held) return;
    this.queuePoint(e.clientX, e.clientY);
    this.setHeld(false);
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
    if (this.panning) {
      const dx = e.clientX - this.panX;
      const dy = e.clientY - this.panY;
      if (!this.panMoved && Math.hypot(dx, dy) < 4) return;
      this.panMoved = true;
      const r = this.canvas.getBoundingClientRect();
      pan(dx / r.width, dy / r.height);
      this.panX = e.clientX;
      this.panY = e.clientY;
    }
    this.track(e);
    if (this.held) this.queuePoint(e.clientX, e.clientY);
  }

  private onUp(e: PointerEvent): void {
    if (this.panning && e.button === 1) {
      this.panning = false;
      if (!this.panMoved && e.type === 'pointerup') this.pick(e);
      return;
    }
    if (!this.held || (e.type === 'pointerup' && e.button !== this.button)) return;
    this.queuePoint(e.clientX, e.clientY);
    this.setHeld(false);
  }

  private onWheel(e: WheelEvent): void {
    // Only over the canvas: everywhere else (the library) the wheel scrolls as usual.
    if (!(e.target instanceof Element) || !e.target.closest('#stage')) return;
    e.preventDefault();
    // Ctrl and the wheel zoom the view about the pointer.
    if (e.ctrlKey) {
      const r = this.canvas.getBoundingClientRect();
      if (e.deltaY !== 0) zoomStep(e.deltaY < 0 ? 1 : -1, (e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
      this.emit();
      return;
    }
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

  private queuePoint(x: number, y: number): void {
    const r = this.canvas.getBoundingClientRect();
    const [wx, wy] = toWorld((x - r.left) / r.width, (y - r.top) / r.height);
    this.queue.push(Math.floor(wx * this.world.w), Math.floor(wy * this.world.h), this.mode);
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
