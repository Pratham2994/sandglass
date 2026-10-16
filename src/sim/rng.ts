/**
 * Seeded mulberry32 PRNG. Same seed gives the same sequence on every run.
 * State lives in a typed array so updates never box a number on the heap.
 */
export class Rng {
  private readonly s = new Uint32Array(1);

  constructor(seed: number) {
    this.s[0] = seed >>> 0;
  }

  seed(seed: number): void {
    this.s[0] = seed >>> 0;
  }

  /** The current state, to save and later restore with seed(). */
  getState(): number {
    return this.s[0];
  }

  /** Next unsigned 32-bit integer. */
  nextU32(): number {
    const a = (this.s[0] = (this.s[0] + 0x6d2b79f5) >>> 0);
    let t = Math.imul(a ^ (a >>> 15), a | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return (t ^ (t >>> 14)) >>> 0;
  }

  /** Float in [0, 1). */
  next(): number {
    return this.nextU32() / 4294967296;
  }
}
