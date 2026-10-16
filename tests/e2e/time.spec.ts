import { expect, test } from '@playwright/test';
import type {} from '../../src/dev/hook';

test.beforeEach(async ({ page }) => {
  await page.goto('/?intro=0');
  await page.waitForFunction(() => window.__sim !== undefined);
});

test('rewind replays exactly, and a new branch replays identically every time', async ({ page }) => {
  const r = await page.evaluate(() => {
    const s = window.__sim!;
    s.reset(11);
    const H = s.height;
    s.fill(60, H - 6, 200, 6, 'wall');
    // 30 s of play with brush input along the way.
    for (let k = 0; k < 30; k++) {
      s.paint(100 + k * 3, 20, 3, 'sand');
      if (k % 5 === 0) s.paint(220, 30, 2, 'water');
      s.step(60);
    }
    const original = s.hash();
    const t = s.time();

    // Drag back as far as it goes and play again with no new input: identical.
    s.seek(t.oldest);
    const rewound = s.time().frame;
    s.step(t.newest - rewound);
    const replay = s.hash();

    // Back to 10 s, draw something new, play to the end: a new branch.
    s.seek(600);
    s.paint(160, 15, 5, 'lava');
    s.step(1200);
    const branch1 = s.hash();
    // Back to 10 s again and just play: the branch replays identically.
    s.seek(600);
    s.step(1200);
    const branch2 = s.hash();
    s.seek(600);
    s.step(1200);
    const branch3 = s.hash();
    return { t, rewound, original, replay, branch1, branch2, branch3, frame: s.time().frame };
  });
  expect(r.t.newest).toBe(1800);
  // The scrubber reaches back 30 s.
  expect(r.t.newest - r.t.oldest).toBeGreaterThanOrEqual(1740);
  expect(r.rewound).toBe(r.t.oldest);
  expect(r.replay).toBe(r.original);
  expect(r.branch1).not.toBe(r.original);
  expect(r.branch2).toBe(r.branch1);
  expect(r.branch3).toBe(r.branch1);
  expect(r.frame).toBe(1800);
});
