/** Fixed simulation timestep: 60 Hz. */
export const STEP_MS = 1000 / 60;
/** Most sim steps per animation frame; past this the loop drops time instead of spiralling. */
const MAX_STEPS_PER_TICK = 4;
/** Longest gap counted between two ticks, e.g. after the tab was hidden. */
const MAX_DT_MS = 250;

export interface LoopCallbacks {
  /** Applies queued input before a step (or each tick while paused). Returns true if the grid changed. */
  input(): boolean;
  /** Advances the simulation by one fixed step. */
  step(): void;
  /** Draws the current state. */
  render(): void;
}

/**
 * requestAnimationFrame loop with a fixed-timestep accumulator.
 * The sim runs at 60 steps per second whatever the display rate is;
 * the screen is redrawn only when something changed.
 */
export class FixedLoop {
  paused = false;
  /** Sim steps in the last full second. */
  stepsPerSecond = 0;

  private readonly cb: LoopCallbacks;
  private acc = 0;
  private last = -1;
  private stepCount = 0;
  private windowStart = 0;
  private dirty = true;

  constructor(cb: LoopCallbacks) {
    this.cb = cb;
  }

  start(): void {
    requestAnimationFrame(this.tick);
  }

  /** Runs one step now, input first, and redraws. Used for frame stepping while paused. */
  stepOnce(): void {
    this.cb.input();
    this.cb.step();
    this.cb.render();
  }

  /** Asks for a redraw on the next tick. */
  invalidate(): void {
    this.dirty = true;
  }

  private readonly tick = (now: number): void => {
    requestAnimationFrame(this.tick);
    if (this.last < 0) {
      this.last = now;
      this.windowStart = now;
    }
    const dt = Math.min(now - this.last, MAX_DT_MS);
    this.last = now;

    if (this.paused) {
      this.acc = 0;
      if (this.cb.input()) this.dirty = true;
    } else {
      this.acc += dt;
      let steps = 0;
      while (this.acc >= STEP_MS && steps < MAX_STEPS_PER_TICK) {
        this.cb.input();
        this.cb.step();
        this.acc -= STEP_MS;
        steps++;
      }
      if (steps === MAX_STEPS_PER_TICK) this.acc = 0;
      if (steps > 0) this.dirty = true;
      this.stepCount += steps;
    }

    if (now - this.windowStart >= 1000) {
      this.stepsPerSecond = Math.round((this.stepCount * 1000) / (now - this.windowStart));
      this.stepCount = 0;
      this.windowStart = now;
    }

    if (this.dirty) {
      this.cb.render();
      this.dirty = false;
    }
  };
}
