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
    // Two identical loops: battery (+ end right) → wire → pool → wire → round and back to the battery's - end.
    // The wires end in plates down the pool walls, low down where salty water sinks. The second pool gets salt.
    const circuit = (y: number): void => {
      const e = y + 2;
      s.fill(40, e, 1, 1, 'battery');
      s.fill(41, e, 21, 1, 'wire');
      s.fill(62, y - 6, 2, 9, 'wall');
      s.fill(90, y - 6, 2, 9, 'wall');
      s.fill(62, y + 3, 30, 2, 'wall');
      s.fill(64, y - 4, 26, 7, 'water');
      s.fill(62, e, 2, 1, 'wire'); // through the pool's left wall,
      s.fill(63, y - 2, 1, 5, 'wire'); // ending in a plate down the inside of the wall
      s.fill(90, y - 2, 1, 5, 'wire'); // a plate on the right wall,
      s.fill(90, e, 21, 1, 'wire'); // and out
      s.fill(110, e, 1, 9, 'wire'); // down, back along the bottom, and up into the battery's left side
      s.fill(39, y + 10, 72, 1, 'wire');
      s.fill(39, e, 1, 9, 'wire');
    };
    circuit(60);
    circuit(120);
    s.fill(64, 106, 26, 4, 'salt');
    s.step(400); // let the salt dissolve
    let pure = 0;
    let salty = 0;
    for (let k = 0; k < 60; k++) {
      s.step(2);
      pure = Math.max(pure, s.probe(100, 70).amps);
      salty = Math.max(salty, s.probe(100, 130).amps);
    }
    return { pure, salty, salt: s.count('salt') };
  });
  // All the salt went into the water.
  expect(r.salt).toBe(0);
  // Current runs round the loop through the salty pool, never through the pure one.
  expect(r.salty).toBeGreaterThan(0.001);
  expect(r.pure).toBe(0);
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
