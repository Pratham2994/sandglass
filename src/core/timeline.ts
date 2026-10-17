import { applyOp, type Op } from '../sim/ops';
import { step } from '../sim/step';
import type { World } from '../sim/world';

/** A snapshot every second. */
export const SNAP_EVERY = 60;
/** How far back the scrubber reaches: 30 s. */
export const KEEP_FRAMES = 30 * 60;

interface Snap {
  frame: number;
  type: Uint16Array;
  vy: Int8Array;
  stamp: Uint8Array;
  shade: Uint8Array;
  temp: Float32Array;
  life: Uint16Array;
  solute: Uint16Array;
  conc: Uint8Array;
  charge: Uint8Array;
  volt: Float32Array;
  rng: number;
  airP: Float32Array;
  airVx: Float32Array;
  airVy: Float32Array;
  airActive: boolean;
  airBlocked: Uint8Array;
  awake: Uint8Array;
  awakeNext: Uint8Array;
}

/**
 * Time control. The simulation is deterministic, so a moment in the past is
 * fully described by an earlier snapshot plus the player's input since then.
 * The timeline keeps a snapshot every second for the last 30 s and a log of
 * every op by frame. Seeking loads the nearest snapshot at or before the
 * target and re-runs the frames in between, replaying the logged ops.
 * New input at a past frame starts a new branch: everything recorded after
 * that frame is dropped.
 */
export class Timeline {
  /** Furthest frame reached on the current branch. */
  newest = 0;
  private readonly world: World;
  private log = new Map<number, Op[]>();
  private snaps: Snap[] = [];
  /** Snapshots no longer needed, kept for reuse so taking one does not allocate (no GC pauses). */
  private spare: Snap[] = [];

  constructor(world: World) {
    this.world = world;
    this.reset();
  }

  /** Forgets all history and starts from the world as it is now. */
  reset(): void {
    this.log.clear();
    this.spare.push(...this.snaps);
    this.snaps = [];
    this.newest = this.world.frame;
    this.snaps.push(this.capture());
  }

  /** Oldest frame the scrubber can reach. */
  oldest(): number {
    return this.snaps.length ? this.snaps[0].frame : this.world.frame;
  }

  /**
   * Records an op from the player at the current frame and applies it.
   * At a past frame this starts a new branch.
   */
  record(op: Op): void {
    const f = this.world.frame;
    if (f < this.newest) this.branchAt(f);
    let ops = this.log.get(f);
    if (!ops) this.log.set(f, (ops = []));
    ops.push(op);
    applyOp(this.world, op);
  }

  /** Before each step: when re-running recorded frames, replays their ops. */
  replayInput(): void {
    const f = this.world.frame;
    if (f >= this.newest) return;
    const ops = this.log.get(f);
    if (ops) for (const op of ops) applyOp(this.world, op);
  }

  /** After each step: advances the branch, takes snapshots, forgets the far past. */
  afterStep(): void {
    const f = this.world.frame;
    if (f > this.newest) this.newest = f;
    if (f % SNAP_EVERY === 0 && !this.snaps.some((s) => s.frame === f)) {
      this.snaps.push(this.capture());
      this.snaps.sort((a, b) => a.frame - b.frame);
    }
    const cutoff = this.newest - KEEP_FRAMES;
    while (this.snaps.length > 1 && this.snaps[1].frame <= cutoff) this.spare.push(this.snaps.shift()!);
    for (const k of this.log.keys()) if (k < this.oldest()) this.log.delete(k);
  }

  /** Puts the world at `target` (clamped to what is kept), replaying recorded input. */
  seek(target: number): void {
    const t = Math.max(this.oldest(), Math.min(this.newest, Math.round(target)));
    let snap = this.snaps[0];
    for (const s of this.snaps) if (s.frame <= t) snap = s;
    this.restore(snap);
    while (this.world.frame < t) {
      this.replayInput();
      step(this.world);
    }
  }

  /**
   * Starts a new branch at frame f. The old input at f itself goes too: after a
   * seek the world stands at the start of f, before that input was applied, so
   * keeping it would replay differently from what the player saw.
   */
  private branchAt(f: number): void {
    for (const k of [...this.log.keys()]) if (k >= f) this.log.delete(k);
    for (const s of this.snaps) if (s.frame > f) this.spare.push(s);
    this.snaps = this.snaps.filter((s) => s.frame <= f);
    this.newest = f;
  }

  private capture(): Snap {
    const w = this.world;
    // Reuse a spare snapshot of the same size when there is one.
    while (this.spare.length) {
      const s = this.spare.pop()!;
      if (s.type.length !== w.size || s.airP.length !== w.air.p.length || s.awake.length !== w.awake.length) continue;
      s.frame = w.frame;
      s.type.set(w.type);
      s.vy.set(w.vy);
      s.stamp.set(w.stamp);
      s.shade.set(w.shade);
      s.temp.set(w.temp);
      s.life.set(w.life);
      s.solute.set(w.solute);
      s.conc.set(w.conc);
      s.charge.set(w.charge);
      s.volt.set(w.volt);
      s.rng = w.rng.getState();
      s.airP.set(w.air.p);
      s.airVx.set(w.air.vx);
      s.airVy.set(w.air.vy);
      s.airActive = w.air.active;
      s.airBlocked.set(w.air.blocked);
      s.awake.set(w.awake);
      s.awakeNext.set(w.awakeNext);
      return s;
    }
    return {
      frame: w.frame,
      type: w.type.slice(),
      vy: w.vy.slice(),
      stamp: w.stamp.slice(),
      shade: w.shade.slice(),
      temp: w.temp.slice(),
      life: w.life.slice(),
      solute: w.solute.slice(),
      conc: w.conc.slice(),
      charge: w.charge.slice(),
      volt: w.volt.slice(),
      rng: w.rng.getState(),
      airP: w.air.p.slice(),
      airVx: w.air.vx.slice(),
      airVy: w.air.vy.slice(),
      airActive: w.air.active,
      airBlocked: w.air.blocked.slice(),
      awake: w.awake.slice(),
      awakeNext: w.awakeNext.slice(),
    };
  }

  private restore(s: Snap): void {
    const w = this.world;
    w.frame = s.frame;
    w.type.set(s.type);
    w.vy.set(s.vy);
    w.stamp.set(s.stamp);
    w.shade.set(s.shade);
    w.temp.set(s.temp);
    w.life.set(s.life);
    w.solute.set(s.solute);
    w.conc.set(s.conc);
    w.charge.set(s.charge);
    w.volt.set(s.volt);
    w.rng.seed(s.rng);
    w.air.p.set(s.airP);
    w.air.vx.set(s.airVx);
    w.air.vy.set(s.airVy);
    w.air.active = s.airActive;
    w.air.blocked.set(s.airBlocked);
    // Exactly the chunks that were awake then: waking more would change which
    // cells draw random numbers, and the replay would drift.
    w.awake.set(s.awake);
    w.awakeNext.set(s.awakeNext);
  }
}
