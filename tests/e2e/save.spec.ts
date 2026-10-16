import { expect, test } from '@playwright/test';
import type {} from '../../src/dev/hook';

test.beforeEach(async ({ page }) => {
  await page.goto('/?intro=0');
  await page.waitForFunction(() => window.__sim !== undefined);
});

test('a saved file reloads the identical scene, frame for frame', async ({ page }) => {
  const r = await page.evaluate(async () => {
    const s = window.__sim!;
    s.reset(21);
    const H = s.height;
    // A busy scene: sand, water, oil, a fire, lava, salt, a circuit.
    s.fill(40, H - 6, 240, 6, 'wall');
    s.fill(60, H - 40, 40, 20, 'sand');
    s.fill(110, H - 30, 40, 20, 'water');
    s.fill(160, H - 20, 30, 10, 'oil');
    s.fill(195, H - 12, 6, 6, 'lava');
    s.fill(120, H - 50, 20, 3, 'salt');
    s.fill(230, H - 20, 20, 10, 'wood');
    s.fill(228, H - 12, 2, 4, 'fire');
    s.fill(40, H - 60, 3, 3, 'battery');
    s.fill(43, H - 59, 30, 1, 'wire');
    s.step(200);
    const frameAtSave = s.time().frame;
    const file = await s.save();
    s.step(300);
    const original = s.hash();
    await s.load(file);
    const frameAfterLoad = s.time().frame;
    s.step(300);
    return { original, reloaded: s.hash(), frameAtSave, frameAfterLoad, bytes: file.length };
  });
  expect(r.frameAfterLoad).toBe(r.frameAtSave);
  expect(r.reloaded).toBe(r.original);
  // Compressed: far smaller than the raw grid (320 × 180 cells × 17 bytes ≈ 980 kB).
  expect(r.bytes).toBeLessThan(400_000);
});

test('keys 1 to 9 pick the most recently used elements', async ({ page }) => {
  await page.getByRole('button', { name: 'Water', exact: true }).click();
  await page.getByRole('button', { name: 'Lava', exact: true }).click();
  await page.getByRole('button', { name: 'Salt', exact: true }).click();
  // Recent is now Salt, Lava, Water, Sand: key 3 picks Water.
  await page.keyboard.press('3');
  await expect(page.locator('.detail .detail-name')).toHaveText('Water');
  await page.keyboard.press('2');
  await expect(page.locator('.detail .detail-name')).toHaveText('Lava');
});
