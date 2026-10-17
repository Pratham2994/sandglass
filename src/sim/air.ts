/**
 * Air: pressure and velocity on a coarse grid, one air cell per AIR × AIR
 * sim cells. Velocity follows the pressure gradient, pressure follows the
 * divergence of velocity (so a pressure spike spreads as a wave), and both
 * decay. Air cells mostly filled with solids are walls to the air.
 * Explosions add pressure; the wind tool adds velocity; loose cells are
 * pushed by the local velocity (see push in step.ts).
 * Air joined to the open sky (the top edge) loses its pressure fast, as it
 * would to the atmosphere; air sealed off from the sky keeps it, so gas
 * boiling in a closed box builds up until the walls burst.
 */

export const AIR_SHIFT = 2;
export const AIR = 1 << AIR_SHIFT;
/** How strongly velocity follows the pressure gradient, per frame. */
const K_V = 0.4;
/** How strongly pressure follows the divergence, per frame. */
const K_P = 0.4;
/** Fraction kept per frame: pressure and wind die away, fast in the open, slowly where the air is sealed in. */
const DECAY = 0.985;
const SEALED_DECAY = 0.9998;
/** Fraction of the neighbour average blended in per frame, smoothing the field. */
const SMOOTH = 0.15;

export class Air {
  aw: number;
  ah: number;
  /** Pressure, relative to calm air (0). */
  p: Float32Array;
  vx: Float32Array;
  vy: Float32Array;
  /** 1 where an air cell is mostly solid and blocks the air. */
  blocked: Uint8Array;
  /** 1 where the air is joined to the open sky; a queue for finding it. */
  open: Uint8Array;
  private queue: Int32Array;
  /** True while anything is moving, so a calm world costs nothing. */
  active = false;

  constructor(w: number, h: number) {
    this.aw = Math.ceil(w / AIR);
    this.ah = Math.ceil(h / AIR);
    const n = this.aw * this.ah;
    this.p = new Float32Array(n);
    this.vx = new Float32Array(n);
    this.vy = new Float32Array(n);
    this.blocked = new Uint8Array(n);
    this.open = new Uint8Array(n).fill(1);
    this.queue = new Int32Array(n);
  }

  clear(): void {
    this.p.fill(0);
    this.vx.fill(0);
    this.vy.fill(0);
    this.active = false;
  }

  /** Adds pressure around sim cell (x, y), falling off over radius r (in sim cells). */
  addPressure(x: number, y: number, amount: number, r: number): void {
    const ax = x >> AIR_SHIFT;
    const ay = y >> AIR_SHIFT;
    const ar = Math.max(1, Math.ceil(r / AIR));
    for (let j = ay - ar; j <= ay + ar; j++) {
      if (j < 0 || j >= this.ah) continue;
      for (let i = ax - ar; i <= ax + ar; i++) {
        if (i < 0 || i >= this.aw) continue;
        const d = Math.hypot(i - ax, j - ay) / ar;
        if (d <= 1) this.p[j * this.aw + i] += amount * (1 - d * 0.6);
      }
    }
    this.active = true;
  }

  /**
   * Is the air at sim cell (x, y) walled in, cut off from the open sky? A
   * cell in a mostly solid air cell (water on a hot plate) goes by the air
   * just above it.
   */
  sealedAt(x: number, y: number): boolean {
    let k = (y >> AIR_SHIFT) * this.aw + (x >> AIR_SHIFT);
    if (this.blocked[k] && k >= this.aw) k -= this.aw;
    return this.blocked[k] === 0 && this.open[k] === 0;
  }

  /** Adds velocity (vx, vy) around sim cell (x, y) over radius r (in sim cells). */
  addVelocity(x: number, y: number, vx: number, vy: number, r: number): void {
    const ax = x >> AIR_SHIFT;
    const ay = y >> AIR_SHIFT;
    const ar = Math.max(0, Math.ceil(r / AIR));
    for (let j = ay - ar; j <= ay + ar; j++) {
      if (j < 0 || j >= this.ah) continue;
      for (let i = ax - ar; i <= ax + ar; i++) {
        if (i < 0 || i >= this.aw) continue;
        const k = j * this.aw + i;
        this.vx[k] += vx;
        this.vy[k] += vy;
      }
    }
    this.active = true;
  }

  /** Marks air cells that are at least half solid (from the sim grid's solid map). */
  updateBlocked(w: number, h: number, isSolid: (i: number) => boolean): void {
    const { aw, ah } = this;
    for (let ay = 0; ay < ah; ay++) {
      for (let ax = 0; ax < aw; ax++) {
        let n = 0;
        const y0 = ay * AIR;
        const x0 = ax * AIR;
        for (let y = y0; y < y0 + AIR && y < h; y++) for (let x = x0; x < x0 + AIR && x < w; x++) if (isSolid(y * w + x)) n++;
        this.blocked[ay * aw + ax] = n >= (AIR * AIR) >> 1 ? 1 : 0;
      }
    }
    this.findOpen();
  }

  /** Marks the air joined to the top edge (the sky) through unblocked air cells. */
  private findOpen(): void {
    const { aw, ah, blocked, open, queue } = this;
    open.fill(0);
    let tail = 0;
    for (let x = 0; x < aw; x++)
      if (!blocked[x]) {
        open[x] = 1;
        queue[tail++] = x;
      }
    for (let head = 0; head < tail; head++) {
      const k = queue[head];
      const x = k % aw;
      const y = (k / aw) | 0;
      if (x > 0 && !open[k - 1] && !blocked[k - 1]) (open[k - 1] = 1), (queue[tail++] = k - 1);
      if (x + 1 < aw && !open[k + 1] && !blocked[k + 1]) (open[k + 1] = 1), (queue[tail++] = k + 1);
      if (y > 0 && !open[k - aw] && !blocked[k - aw]) (open[k - aw] = 1), (queue[tail++] = k - aw);
      if (y + 1 < ah && !open[k + aw] && !blocked[k + aw]) (open[k + aw] = 1), (queue[tail++] = k + aw);
    }
  }

  /** One frame of air. Skipped entirely when the air is calm. */
  step(): void {
    if (!this.active) return;
    const { aw, ah, p, vx, vy, blocked } = this;
    // Velocity from the pressure gradient (walls reflect: a blocked side counts as equal pressure).
    let energy = 0;
    for (let y = 0; y < ah; y++) {
      for (let x = 0; x < aw; x++) {
        const k = y * aw + x;
        if (blocked[k]) {
          vx[k] = 0;
          vy[k] = 0;
          continue;
        }
        const pc = p[k];
        const pl = x > 0 && !blocked[k - 1] ? p[k - 1] : pc;
        const pr = x + 1 < aw && !blocked[k + 1] ? p[k + 1] : pc;
        const pu = y > 0 && !blocked[k - aw] ? p[k - aw] : pc;
        const pd = y + 1 < ah && !blocked[k + aw] ? p[k + aw] : pc;
        vx[k] = (vx[k] - (pr - pl) * 0.5 * K_V) * DECAY;
        vy[k] = (vy[k] - (pd - pu) * 0.5 * K_V) * DECAY;
      }
    }
    // Pressure from the divergence, then smoothing and decay.
    for (let y = 0; y < ah; y++) {
      for (let x = 0; x < aw; x++) {
        const k = y * aw + x;
        if (blocked[k]) {
          p[k] *= DECAY;
          continue;
        }
        const vl = x > 0 ? vx[k - 1] : 0;
        const vr = x + 1 < aw ? vx[k + 1] : 0;
        const vu = y > 0 ? vy[k - aw] : 0;
        const vd = y + 1 < ah ? vy[k + aw] : 0;
        const div = (vr - vl + vd - vu) * 0.5;
        let pk = p[k] - div * K_P;
        // Walls do not share pressure: a blocked neighbour counts as this cell.
        const avg =
          ((x > 0 && !blocked[k - 1] ? p[k - 1] : pk) +
            (x + 1 < aw && !blocked[k + 1] ? p[k + 1] : pk) +
            (y > 0 && !blocked[k - aw] ? p[k - aw] : pk) +
            (y + 1 < ah && !blocked[k + aw] ? p[k + aw] : pk)) *
          0.25;
        pk = (pk + (avg - pk) * SMOOTH) * (this.open[k] ? DECAY : SEALED_DECAY);
        p[k] = pk;
        energy += Math.abs(pk) + Math.abs(vx[k]) + Math.abs(vy[k]);
      }
    }
    if (energy < 0.01 * aw) {
      this.clear();
    }
  }
}
