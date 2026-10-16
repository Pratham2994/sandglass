import { expect, test, type Page } from '@playwright/test';
import type {} from '../../src/dev/hook';

const SEED = 7;
const TEN_SECONDS = 600;

// Basin: walls at x 60..65 and 254..259, floor at y 164..169. Inside: x 66..253, floor top y = 164.
const IN_X0 = 66;
const IN_X1 = 254;
const FLOOR = 164;

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => window.__sim !== undefined);
});

/** Resets and builds the basin. */
function basin(page: Page, seed: number): Promise<void> {
  return page.evaluate((seed) => {
    const s = window.__sim!;
    s.reset(seed);
    s.fill(60, 100, 6, 70, 'wall');
    s.fill(60, 164, 200, 6, 'wall');
    s.fill(254, 100, 6, 70, 'wall');
  }, seed);
}

/** Per column inside the basin: the element keys from the top of the stack down to the floor. */
function columns(page: Page): Promise<string[][]> {
  return page.evaluate(
    ([x0, x1, floor]) => {
      const s = window.__sim!;
      const out: string[][] = [];
      for (let x = x0; x < x1; x++) {
        const col: string[] = [];
        for (let y = 0; y < floor; y++) {
          const c = s.cell(x, y);
          if (c !== 'empty') col.push(c);
        }
        out.push(col);
      }
      return out;
    },
    [IN_X0, IN_X1, FLOOR] as const,
  );
}

test('sand sinks through water', async ({ page }) => {
  await basin(page, SEED);
  const before = await page.evaluate(() => {
    const s = window.__sim!;
    s.fill(66, 124, 188, 40, 'water');
    s.fill(120, 80, 60, 20, 'sand');
    return { sand: s.count('sand'), water: s.count('water') };
  });
  await page.evaluate((n) => window.__sim!.step(n), TEN_SECONDS);

  const after = await page.evaluate(() => ({ sand: window.__sim!.count('sand'), water: window.__sim!.count('water') }));
  expect(after).toEqual(before);
  // In every column, no water is left under sand: the sand has sunk to the floor.
  for (const col of await columns(page)) {
    const firstSand = col.indexOf('sand');
    if (firstSand >= 0) expect(col.slice(firstSand)).not.toContain('water');
  }
});

test('oil floats on water', async ({ page }) => {
  await basin(page, SEED);
  const before = await page.evaluate(() => {
    const s = window.__sim!;
    // Oil starts underneath the water.
    s.fill(66, 144, 188, 20, 'oil');
    s.fill(66, 114, 188, 30, 'water');
    return { oil: s.count('oil'), water: s.count('water') };
  });
  await page.evaluate((n) => window.__sim!.step(n), TEN_SECONDS * 2);

  const after = await page.evaluate(() => ({ oil: window.__sim!.count('oil'), water: window.__sim!.count('water') }));
  expect(after).toEqual(before);
  // In every column, no oil is left below water.
  for (const col of await columns(page)) {
    const firstWater = col.indexOf('water');
    if (firstWater >= 0) expect(col.slice(firstWater)).not.toContain('oil');
  }
});

test('water surface is flat within 1 cell after 10 s, then rests', async ({ page }) => {
  await basin(page, SEED);
  // A tall block dropped at one side, so the water has to run the whole basin.
  const n = await page.evaluate(() => window.__sim!.fill(70, 20, 50, 60, 'water'));
  const r = await page.evaluate(
    ([frames, x0, x1, floor]) => {
      const s = window.__sim!;
      s.step(frames);
      const tops: number[] = [];
      for (let x = x0; x < x1; x++) {
        let y = 0;
        while (y < floor && s.cell(x, y) === 'empty') y++;
        tops.push(floor - y);
      }
      const hash = s.hash();
      s.step(120);
      return { tops, water: s.count('water'), resting: s.hash() === hash };
    },
    [TEN_SECONDS, IN_X0, IN_X1, FLOOR] as const,
  );
  expect(r.water).toBe(n);
  expect(Math.max(...r.tops) - Math.min(...r.tops)).toBeLessThanOrEqual(1);
  expect(r.resting).toBe(true);
});

test('liquids are deterministic', async ({ page }) => {
  const run = async (): Promise<string> => {
    await basin(page, SEED);
    return page.evaluate(() => {
      const s = window.__sim!;
      s.fill(70, 40, 60, 40, 'water');
      s.fill(180, 30, 40, 30, 'oil');
      s.fill(140, 0, 30, 30, 'sand');
      s.step(600);
      return s.hash();
    });
  };
  expect(await run()).toBe(await run());
});
