import { expect, test } from '@playwright/test';
import type {} from '../../src/dev/hook';

test.beforeEach(async ({ page }) => {
  await page.goto('/?intro=0');
  await page.waitForFunction(() => window.__sim !== undefined);
});

test('salt water conducts, pure water does not', async ({ page }) => {
  const r = await page.evaluate(() => {
    const s = window.__sim!;
    s.reset(7);
    // Two identical circuits: battery → wire → pool → probe wire. The second pool gets salt.
    const circuit = (y: number): void => {
      s.fill(40, y, 3, 3, 'battery');
      s.fill(43, y + 1, 20, 1, 'wire');
      s.fill(62, y - 6, 2, 9, 'wall');
      s.fill(90, y - 6, 2, 9, 'wall');
      s.fill(62, y + 3, 30, 2, 'wall');
      s.fill(64, y - 4, 26, 7, 'water');
      s.fill(62, y + 1, 2, 1, 'wire'); // through the pool's left wall
      s.fill(90, y + 1, 21, 1, 'wire'); // out through the right wall: the probe
    };
    circuit(60);
    circuit(120);
    s.fill(64, 108, 26, 2, 'salt');
    s.step(400); // let the salt dissolve
    let pureProbe = 0;
    let saltProbe = 0;
    for (let k = 0; k < 120; k++) {
      s.step(2);
      for (let x = 95; x < 110; x++) {
        pureProbe = Math.max(pureProbe, s.probe(x, 61).charge);
        saltProbe = Math.max(saltProbe, s.probe(x, 121).charge);
      }
    }
    return { pureProbe, saltProbe, salt: s.count('salt') };
  });
  // All the salt went into the water.
  expect(r.salt).toBe(0);
  // Current crossed the salty pool to the probe, and never crossed the pure one.
  expect(r.saltProbe).toBeGreaterThan(0);
  expect(r.pureProbe).toBe(0);
});

test('a spark sets off TNT', async ({ page }) => {
  const r = await page.evaluate(() => {
    const s = window.__sim!;
    s.reset(3);
    const H = s.height;
    s.fill(100, H - 10, 10, 10, 'tnt');
    s.fill(110, H - 5, 20, 1, 'wire');
    s.fill(130, H - 5, 1, 1, 'spark');
    s.step(120);
    return { tnt: s.count('tnt') };
  });
  expect(r.tnt).toBe(0);
});

test('a seed on wet dirt grows into a plant towards the sky', async ({ page }) => {
  const r = await page.evaluate(() => {
    const s = window.__sim!;
    s.reset(4);
    const H = s.height;
    s.fill(100, H - 12, 40, 12, 'dirt');
    s.fill(100, H - 18, 40, 4, 'water');
    s.step(300); // the dirt soaks up the water
    s.fill(110, H - 13, 1, 1, 'seed');
    s.fill(125, H - 13, 1, 1, 'seed');
    s.step(1800);
    let top = H;
    for (let y = 0; y < H; y++) for (let x = 95; x < 145; x++) if (s.cell(x, y) === 'plant') top = Math.min(top, y);
    return { plant: s.count('plant'), height: H - 13 - top };
  });
  expect(r.plant).toBeGreaterThan(10);
  expect(r.height).toBeGreaterThan(8);
});
