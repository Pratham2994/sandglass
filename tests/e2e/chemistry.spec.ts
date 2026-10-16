import { expect, test } from '@playwright/test';
import type {} from '../../src/dev/hook';

test.beforeEach(async ({ page }) => {
  await page.goto('/?intro=0');
  await page.waitForFunction(() => window.__sim !== undefined);
});

test('wood burns in the open; fire dies in a sealed box', async ({ page }) => {
  const r = await page.evaluate(() => {
    const s = window.__sim!;
    s.reset(6);
    const H = s.height;
    // Open air: a wood block with flames at its corner.
    s.fill(20, H - 30, 40, 30, 'wood');
    s.fill(18, H - 8, 2, 6, 'fire');
    // Sealed: the same, inside a wall box with a little air.
    s.fill(90, H - 70, 60, 4, 'wall');
    s.fill(90, H - 70, 4, 70, 'wall');
    s.fill(146, H - 70, 4, 70, 'wall');
    s.fill(100, H - 30, 40, 30, 'wood');
    s.fill(98, H - 8, 2, 6, 'fire');
    const count = (key: string, x0: number, x1: number): number => {
      let n = 0;
      for (let y = H - 66; y < H; y++) for (let x = x0; x < x1; x++) if (s.cell(x, y) === key) n++;
      return n;
    };
    s.step(3600);
    return { open: count('wood', 10, 80), sealed: count('wood', 94, 146), sealedFire: count('fire', 94, 146) };
  });
  // 1,200 wood cells each to start with.
  expect(r.open).toBeLessThan(1200 * 0.7);
  expect(r.sealed).toBeGreaterThan(1200 * 0.75);
  expect(r.sealed).toBeGreaterThan(r.open);
  // The sealed fire has run out of air and gone out.
  expect(r.sealedFire).toBe(0);
});

test('acid eats iron and gives off hydrogen', async ({ page }) => {
  const r = await page.evaluate(() => {
    const s = window.__sim!;
    s.reset(2);
    const H = s.height;
    s.fill(100, H - 12, 40, 12, 'iron');
    s.fill(105, H - 30, 30, 10, 'acid');
    const iron = s.count('iron');
    let hydrogen = 0;
    for (let k = 0; k < 20; k++) {
      s.step(30);
      hydrogen = Math.max(hydrogen, s.count('hydrogen'));
    }
    return { iron, ironAfter: s.count('iron'), hydrogen };
  });
  expect(r.ironAfter).toBeLessThan(r.iron);
  expect(r.hydrogen).toBeGreaterThan(0);
});

test('the compiler records a reason for each reaction', async ({ page }) => {
  const r = await page.evaluate(() => {
    const s = window.__sim!;
    return {
      acid: s.pair('acid', 'iron'),
      wood: s.pair('wood', 'empty'),
      sand: s.pair('sand', 'water'),
    };
  });
  expect(r.acid?.reason).toContain('Acid eats iron');
  expect(r.wood?.reason).toContain('300 °C');
  expect(r.wood?.minT).toBe(300);
  // Sand and water have no chemistry: sand just sinks.
  expect(r.sand).toBeNull();
});

test('hovering a cell shows its element, temperature and reaction with its reason', async ({ page }) => {
  const r = await page.evaluate(() => {
    const s = window.__sim!;
    s.reset(4);
    const H = s.height;
    s.fill(100, H - 10, 20, 10, 'oil');
    s.fill(120, H - 10, 10, 10, 'lava');
    let burning: ReturnType<typeof s.inspect> = null;
    for (let k = 0; k < 40 && !burning; k++) {
      s.step(15);
      for (let x = 100; x < 120 && !burning; x++)
        for (let y = H - 10; y < H; y++) {
          const p = s.probe(x, y);
          if (p.key === 'fire' && p.solute === 'oil') {
            burning = s.inspect(x, y);
            break;
          }
        }
    }
    const wood = (() => {
      s.reset(4);
      s.fill(50, s.height - 5, 5, 5, 'wood');
      return s.inspect(50, s.height - 5);
    })();
    return { burning, wood };
  });
  // Oil next to lava catches fire, and the lens says what is burning.
  expect(r.burning?.name).toBe('Burning oil');
  expect(r.burning?.facts.find(([k]) => k === 'Fuel left')).toBeTruthy();
  // Cold wood beside air: the lens shows the reaction, why, and that it is not yet happening.
  expect(r.wood?.facts[0][1]).toContain('20.0 °C');
  const line = r.wood?.reactions.find((x) => x.text.includes('300 °C'));
  expect(line?.active).toBe(false);
  expect(line?.text).toContain('Not yet');
});
