import { expect, test } from '@playwright/test';
import type {} from '../../src/dev/hook';

test.beforeEach(async ({ page }) => {
  await page.goto('/?intro=0');
  await page.waitForFunction(() => window.__sim !== undefined);
});

test('salt dissolves and salt water layers under fresh water', async ({ page }) => {
  const r = await page.evaluate(() => {
    const s = window.__sim!;
    s.reset(3);
    s.fill(60, 100, 6, 70, 'wall');
    s.fill(60, 164, 200, 6, 'wall');
    s.fill(254, 100, 6, 70, 'wall');
    s.fill(66, 124, 188, 40, 'water');
    s.fill(120, 60, 60, 12, 'salt');
    const water = s.count('water');
    // Mean concentration of a band of rows.
    const band = (y0: number, y1: number): number => {
      let c = 0;
      let n = 0;
      for (let y = y0; y < y1; y++)
        for (let x = 66; x < 254; x++) {
          const p = s.probe(x, y);
          if (p.key === 'water') {
            c += p.conc;
            n++;
          }
        }
      return n ? c / n : 0;
    };
    s.step(600);
    return { salt: s.count('salt'), water, waterAfter: s.count('water'), top: band(124, 134), bottom: band(154, 164) };
  });
  // All the salt went into the water; no water was used up.
  expect(r.salt).toBe(0);
  expect(r.waterAfter).toBe(r.water);
  // The salty water sank: the bottom band holds far more salt than the top.
  expect(r.bottom).toBeGreaterThan(10);
  expect(r.top).toBeLessThan(r.bottom / 4);
});

test('boiling salt water leaves salt behind', async ({ page }) => {
  const r = await page.evaluate(() => {
    const s = window.__sim!;
    s.reset(4);
    const H = s.height;
    // A pan: iron plate over a walled lava pool, water on the plate, a little salt.
    s.fill(96, H - 50, 4, 50, 'wall');
    s.fill(160, H - 50, 4, 50, 'wall');
    s.fill(100, H - 30, 60, 2, 'iron');
    s.fill(100, H - 28, 60, 28, 'lava');
    s.fill(104, H - 40, 52, 10, 'water');
    s.fill(104, H - 42, 52, 1, 'salt');
    const start = s.count('salt');
    let least = start;
    for (let k = 0; k < 90; k++) {
      s.step(60);
      least = Math.min(least, s.count('salt'));
    }
    return { start, least, salt: s.count('salt'), water: s.count('water') };
  });
  // First the salt goes into the water...
  expect(r.least).toBeLessThan(r.start);
  // ...then, as the water boils off, salt crystals come back.
  expect(r.salt).toBeGreaterThan(r.least);
});

test('sand soaks up water, and wet sawdust does not catch fire', async ({ page }) => {
  const r = await page.evaluate(() => {
    const s = window.__sim!;
    s.reset(5);
    const H = s.height;
    s.fill(40, H - 10, 30, 10, 'sand');
    s.fill(40, H - 14, 30, 4, 'water');
    s.step(300);
    let wetSand = 0;
    for (let y = H - 10; y < H; y++) for (let x = 40; x < 70; x++) if (s.probe(x, y).key === 'sand' && s.probe(x, y).conc > 0) wetSand++;
    // Soaked sawdust next to a flame stays unburnt.
    s.reset(5);
    s.fill(100, H - 10, 20, 10, 'sawdust');
    s.fill(100, H - 16, 20, 6, 'water');
    s.step(400);
    s.fill(98, H - 6, 2, 6, 'fire');
    s.step(200);
    return { wetSand, burning: s.count('fire') };
  });
  expect(r.wetSand).toBeGreaterThan(20);
  expect(r.burning).toBeLessThan(15);
});
