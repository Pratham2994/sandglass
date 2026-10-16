import { expect, test } from '@playwright/test';
import type {} from '../../src/dev/hook';

test.beforeEach(async ({ page }) => {
  await page.goto('/?intro=0');
  await page.waitForFunction(() => window.__sim !== undefined);
});

test('ice beside lava melts', async ({ page }) => {
  const r = await page.evaluate(() => {
    const s = window.__sim!;
    s.reset(3);
    const H = s.height;
    s.fill(10, H - 70, 4, 70, 'wall');
    s.fill(10, H - 4, 120, 4, 'wall');
    s.fill(126, H - 70, 4, 70, 'wall');
    s.fill(14, H - 30, 60, 26, 'lava');
    s.fill(74, H - 50, 30, 46, 'ice');
    const total = s.count();
    const ice = s.count('ice');
    s.step(900);
    return { total, ice, iceAfter: s.count('ice'), water: s.count('water') + s.count('steam'), totalAfter: s.count() };
  });
  // Phase changes turn cells into other elements, one for one: nothing is created or lost.
  expect(r.totalAfter).toBe(r.total);
  expect(r.iceAfter).toBeLessThan(r.ice * 0.1);
  expect(r.water).toBeGreaterThan(r.ice * 0.5);
});

test('steam rises, cools and rains back down', async ({ page }) => {
  const r = await page.evaluate(() => {
    const s = window.__sim!;
    s.reset(5);
    // Closed box, steam along its floor.
    s.fill(100, 20, 4, 140, 'wall');
    s.fill(100, 20, 100, 4, 'wall');
    s.fill(196, 20, 4, 140, 'wall');
    s.fill(100, 156, 100, 4, 'wall');
    s.fill(104, 126, 92, 30, 'steam');
    const meanY = (key: string): number => {
      let sum = 0;
      let n = 0;
      for (let y = 24; y < 156; y++)
        for (let x = 104; x < 196; x++)
          if (s.cell(x, y) === key) {
            sum += y;
            n++;
          }
      return n ? sum / n : NaN;
    };
    const steam0 = s.count('steam');
    const y0 = meanY('steam');
    s.step(60);
    const yRisen = meanY('steam');
    s.step(1440);
    return { steam0, y0, yRisen, steamEnd: s.count('steam'), waterEnd: s.count('water'), waterY: meanY('water') };
  });
  // Rises: after one second the steam sits higher (smaller y) than it started.
  expect(r.yRisen).toBeLessThan(r.y0 - 5);
  // Cools and condenses: almost all of it is water by the end.
  expect(r.steamEnd).toBeLessThan(r.steam0 * 0.05);
  expect(r.waterEnd + r.steamEnd).toBe(r.steam0);
  // Rains back down: the water lies in the lower half of the box (y 24..156).
  expect(r.waterY).toBeGreaterThan(120);
});

test('heat is deterministic', async ({ page }) => {
  const run = (): Promise<string> =>
    page.evaluate(() => {
      const s = window.__sim!;
      s.reset(9);
      s.fill(40, 120, 60, 20, 'lava');
      s.fill(100, 100, 30, 40, 'ice');
      s.fill(140, 120, 40, 20, 'water');
      s.step(400);
      return s.hash();
    });
  expect(await run()).toBe(await run());
});
