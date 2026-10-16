import { expect, test } from '@playwright/test';
import type {} from '../../src/dev/hook';

test.beforeEach(async ({ page }) => {
  await page.goto('/?intro=0');
  await page.waitForFunction(() => window.__sim !== undefined);
});

test('TNT throws sand outwards and nearby glass shatters', async ({ page }) => {
  const r = await page.evaluate(() => {
    const s = window.__sim!;
    s.reset(8);
    const H = s.height;
    s.fill(100, H - 40, 120, 40, 'sand');
    s.fill(150, H - 30, 20, 12, 'tnt');
    s.fill(125, H - 75, 4, 35, 'glass');
    s.fill(195, H - 75, 4, 35, 'glass');
    // Mean distance of sand from the blast centre.
    const spread = (): number => {
      let sum = 0;
      let n = 0;
      for (let y = 0; y < H; y++)
        for (let x = 0; x < s.width; x++)
          if (s.cell(x, y) === 'sand') {
            sum += Math.hypot(x - 160, y - (H - 24));
            n++;
          }
      return sum / n;
    };
    // Light it: a strip of lava along its top (it replaces a few sand cells).
    s.fill(148, H - 31, 24, 1, 'lava');
    const sand = s.count('sand');
    const glass = s.count('glass');
    const before = spread();
    s.step(300);
    return { sand, glass, before, after: spread(), sandAfter: s.count('sand'), glassAfter: s.count('glass'), shards: s.count('shards'), tnt: s.count('tnt') };
  });
  // The whole block went off.
  expect(r.tnt).toBe(0);
  // Sand is thrown, not destroyed.
  expect(r.sandAfter).toBe(r.sand);
  expect(r.after).toBeGreaterThan(r.before + 8);
  // Nearby glass broke into shards.
  expect(r.glassAfter).toBeLessThan(r.glass);
  expect(r.shards).toBe(r.glass - r.glassAfter);
});

test('wind blows smoke sideways', async ({ page }) => {
  const r = await page.evaluate(() => {
    const s = window.__sim!;
    s.reset(2);
    s.fill(150, 100, 20, 20, 'steam');
    const meanX = (): number => {
      let sum = 0;
      let n = 0;
      for (let y = 0; y < s.height; y++)
        for (let x = 0; x < s.width; x++)
          if (s.cell(x, y) === 'steam') {
            sum += x;
            n++;
          }
      return n ? sum / n : 0;
    };
    const x0 = meanX();
    // Like dragging the wind tool for one second: wind is added every few frames.
    for (let k = 0; k < 12; k++) {
      s.wind(Math.round(meanX()), 110, 2, 0, 16);
      s.step(5);
    }
    return { x0, x1: meanX() };
  });
  expect(r.x1).toBeGreaterThan(r.x0 + 4);
});
