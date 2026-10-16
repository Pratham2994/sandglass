import { expect, test, type Page } from '@playwright/test';
import type {} from '../../src/dev/hook';

const SEED = 42;
const BLOCK = 100; // 100 × 100 = 10,000 sand cells
const FRAMES = 600;

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => window.__sim !== undefined);
});

/** Resets, pours a 100 × 100 block of sand at the top centre, and returns its x. */
function pourBlock(page: Page, seed: number): Promise<number> {
  return page.evaluate(
    ([seed, block]) => {
      const s = window.__sim!;
      s.reset(seed);
      const x = Math.floor((s.width - block) / 2);
      s.fill(x, 0, block, block, 'sand');
      return x;
    },
    [seed, BLOCK] as const,
  );
}

test('grid is sized from the window', async ({ page }) => {
  const size = await page.evaluate(() => [window.__sim!.width, window.__sim!.height]);
  expect(size).toEqual([320, 180]);
});

test('10,000 sand cells stay 10,000 after 600 frames', async ({ page }) => {
  const x = await pourBlock(page, SEED);
  const result = await page.evaluate(
    ([x, block, frames]) => {
      const s = window.__sim!;
      // A wall shelf under part of the block, so sand also piles on walls and pours off the edge.
      const shelf = s.fill(x - 40, 140, block, 4, 'wall');
      const before = { sand: s.count('sand'), wall: s.count('wall') };
      s.step(frames);
      return { shelf, before, sand: s.count('sand'), wall: s.count('wall'), all: s.count() };
    },
    [x, BLOCK, FRAMES] as const,
  );
  expect(result.before.sand).toBe(10_000);
  expect(result.sand).toBe(10_000);
  expect(result.wall).toBe(result.shelf);
  expect(result.all).toBe(10_000 + result.shelf);
});

test('poured sand settles into a sloped pile', async ({ page }) => {
  await pourBlock(page, SEED);
  const r = await page.evaluate((frames) => {
    const s = window.__sim!;
    s.step(frames);
    const heights = s.heights();
    const hash = s.hash();
    s.step(120);
    return { heights, settled: s.hash() === hash };
  }, FRAMES);

  // At rest: nothing moves any more.
  expect(r.settled).toBe(true);
  // A pile, not a flat layer: tall in the middle, wide at the base.
  const peak = Math.max(...r.heights);
  const footprint = r.heights.filter((h) => h > 0).length;
  expect(peak).toBeGreaterThanOrEqual(60);
  expect(footprint).toBeGreaterThanOrEqual(150);
  // Every column is within 1 cell of its neighbour: a 45° slope with no cliffs.
  for (let x = 1; x < r.heights.length; x++) {
    expect(Math.abs(r.heights[x] - r.heights[x - 1]), `step at column ${x}`).toBeLessThanOrEqual(1);
  }
  // Heights rise to the peak, then fall: one pile.
  const top = r.heights.indexOf(peak);
  for (let x = 1; x <= top; x++) expect(r.heights[x]).toBeGreaterThanOrEqual(r.heights[x - 1]);
  for (let x = top + 1; x < r.heights.length; x++) expect(r.heights[x]).toBeLessThanOrEqual(r.heights[x - 1]);
});

test('same seed and input give the same grid', async ({ page }) => {
  const run = async (seed: number): Promise<string> => {
    await pourBlock(page, seed);
    return page.evaluate((frames) => {
      window.__sim!.step(frames);
      return window.__sim!.hash();
    }, FRAMES);
  };
  const a = await run(SEED);
  const b = await run(SEED);
  const c = await run(SEED + 1);
  expect(b).toBe(a);
  expect(c).not.toBe(a);
});
