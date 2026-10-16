import { AIR, AIR_SHIFT } from './air';
import {
  BLAST_POWER_OF,
  BLAST_RADIUS_OF,
  BREAKS_INTO_OF,
  BRITTLE_OF,
  EMPTY,
  FIRE,
  PHASE_OF,
  PH_ENERGY,
  PH_GAS,
  PH_LIQUID,
  PH_POWDER,
  PH_SOLID,
  SMOKE,
} from './elements';
import type { World } from './world';

/** °C pushed into cells near a blast, scaled by closeness. */
const BLAST_HEAT = 900;
/** Air speed below which nothing is pushed. */
const PUSH_MIN = 0.25;

/**
 * Sets off the explosive at (x, y). Every cell of the same explosive within
 * its radius goes up at once (a block of TNT is one bang, not hundreds):
 * each becomes a short-lived flame or smoke, the blast adds pressure to the
 * air (square-root scaled by how much went up), and heat floods the area,
 * which sets off other explosives further out (chain reactions).
 */
export function explode(world: World, x: number, y: number): void {
  const { w, h, type, temp } = world;
  const id = type[y * w + x];
  const r = BLAST_RADIUS_OF[id];
  if (r === 0) return;
  let n = 0;
  const r2 = r * r;
  for (let j = Math.max(0, y - r); j <= Math.min(h - 1, y + r); j++) {
    for (let i = Math.max(0, x - r); i <= Math.min(w - 1, x + r); i++) {
      const d2 = (i - x) * (i - x) + (j - y) * (j - y);
      if (d2 > r2) continue;
      const k = j * w + i;
      const t = type[k];
      if (t === id) {
        n++;
        world.place(k, (world.rng.nextU32() & 3) === 0 ? SMOKE : FIRE);
        world.life[k] = 10 + (world.rng.nextU32() & 31);
        temp[k] = 1400;
      } else if (PHASE_OF[t] !== PH_SOLID || BRITTLE_OF[t] > 0) {
        temp[k] += BLAST_HEAT * (1 - Math.sqrt(d2) / (r + 1));
      }
    }
  }
  world.air.addPressure(x, y, BLAST_POWER_OF[id] * Math.sqrt(n), r * 3);
  for (let j = y - r - 1; j <= y + r + 1; j += AIR) for (let i = x - r - 1; i <= x + r + 1; i += AIR) world.wake(Math.max(0, Math.min(w - 1, i)), Math.max(0, Math.min(h - 1, j)));
}

/**
 * Air pass, after the heat pass: steps the air, then
 * - pushes loose cells (powders, liquids, gases, flames) along the local
 *   wind, more cells and further the stronger it blows, so a blast throws
 *   sand outwards and wind drifts smoke;
 * - shatters brittle solids where the pressure passes their limit.
 * Skipped while the air is calm. Solid walls are refreshed every 8 frames.
 */
export function airPass(world: World, st: number): void {
  const air = world.air;
  if (!air.active) return;
  const { w, h, type } = world;
  if ((world.frame & 7) === 0) air.updateBlocked(w, h, (i) => PHASE_OF[type[i]] === PH_SOLID);
  air.step();
  if (!air.active) return;
  const { aw, ah, p, vx, vy } = air;
  for (let ay = 0; ay < ah; ay++) {
    for (let ax = 0; ax < aw; ax++) {
      const k = ay * aw + ax;
      const pk = p[k];
      const sx = vx[k];
      const sy = vy[k];
      const speed = Math.hypot(sx, sy);
      const x0 = ax << AIR_SHIFT;
      const y0 = ay << AIR_SHIFT;
      // Brittle solids crack under pressure, either way.
      const press = Math.abs(pk);
      if (press > 1) {
        for (let y = y0; y < y0 + AIR && y < h; y++)
          for (let x = x0; x < x0 + AIR && x < w; x++) {
            const i = y * w + x;
            const b = BRITTLE_OF[type[i]];
            if (b > 0 && press > b) {
              const T = world.temp[i];
              world.place(i, BREAKS_INTO_OF[type[i]]);
              world.temp[i] = T;
            }
          }
      }
      if (speed < PUSH_MIN) continue;
      const dx = Math.abs(sx) > speed * 0.38 ? Math.sign(sx) : 0;
      const dy = Math.abs(sy) > speed * 0.38 ? Math.sign(sy) : 0;
      const steps = Math.min(4, 1 + Math.floor(speed * 0.8));
      const chance = Math.min(255, Math.round(speed * 160));
      for (let y = y0; y < y0 + AIR && y < h; y++) {
        for (let x = x0; x < x0 + AIR && x < w; x++) {
          const i = y * w + x;
          const ph = PHASE_OF[type[i]];
          if (ph !== PH_POWDER && ph !== PH_LIQUID && ph !== PH_GAS && ph !== PH_ENERGY) continue;
          if (world.stamp[i] === st || (world.rng.nextU32() & 255) >= chance) continue;
          pushCell(world, x, y, dx, dy, steps, st);
        }
      }
    }
  }
}

/** Moves cell (x, y) up to `steps` cells along (dx, dy) through empty space. */
function pushCell(world: World, x: number, y: number, dx: number, dy: number, steps: number, st: number): void {
  if (dx === 0 && dy === 0) return;
  const { w, h, type } = world;
  let cx = x;
  let cy = y;
  for (let s = 0; s < steps; s++) {
    const nx = cx + dx;
    const ny = cy + dy;
    if (nx < 0 || ny < 0 || nx >= w || ny >= h || type[ny * w + nx] !== EMPTY) break;
    cx = nx;
    cy = ny;
  }
  if (cx === x && cy === y) return;
  const i = y * w + x;
  const j = cy * w + cx;
  world.swapCells(i, j);
  world.stamp[j] = st;
  world.vy[j] = 0;
  world.wake(x, y);
  world.wake(cx, cy);
}
