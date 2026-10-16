/**
 * Air: pressure and velocity on a coarse grid, one air cell per AIR × AIR
 * sim cells. Velocity follows the pressure gradient, pressure follows the
 * divergence of velocity (so a pressure spike spreads as a wave), and both
 * decay. Air cells mostly filled with solids are walls to the air.
 * Explosions add pressure; the wind tool adds velocity; loose cells are
 * pushed by the local velocity (see push in step.ts).
 */

export const AIR_SHIFT = 2;
export const AIR = 1 << AIR_SHIFT;
/** How strongly velocity follows the pressure gradient, per frame. */
const K_V = 0.4;
/** How strongly pressure follows the divergence, per frame. */
const K_P = 0.4;
/** Fraction kept per frame: pressure and wind die away. */
const DECAY = 0.985;
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
        const avg = ((x > 0 ? p[k - 1] : pk) + (x + 1 < aw ? p[k + 1] : pk) + (y > 0 ? p[k - aw] : pk) + (y + 1 < ah ? p[k + aw] : pk)) * 0.25;
        pk = (pk + (avg - pk) * SMOOTH) * DECAY;
        p[k] = pk;
        energy += Math.abs(pk) + Math.abs(vx[k]) + Math.abs(vy[k]);
      }
    }
    if (energy < 0.01 * aw) {
      this.clear();
    }
  }
}
