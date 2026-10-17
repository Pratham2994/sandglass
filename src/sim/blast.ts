import { AIR, AIR_SHIFT } from './air';
import {
  BLAST_POWER_OF,
  BLAST_RADIUS_OF,
  BREAKS_INTO_OF,
  BRITTLE_OF,
  EMPTY,
  FIRE,
  IGNITION_OF,
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
 * Sets off the explosive at (x, y). Every cell of it within its blast radius
 * goes up at once; the same explosive just beyond the radius is armed and
 * goes off next frame, so a long charge goes off as a fast detonation wave
 * from where it was set off to its far end, and a trail of powder burns
 * along like a fuse. Each cell that goes up becomes a short-lived flame or
 * smoke, the air takes a pressure blast (square-root scaled by how much went
 * up), and heat floods the area, setting off other explosives (chain reactions).
 */
export function explode(world: World, x: number, y: number): void {
  const id = world.type[y * world.w + x];
  const r = BLAST_RADIUS_OF[id];
  if (r !== 0) burst(world, x, y, id, r, -1);
}

/** One cell of a charge goes up: a short-lived flame or puff of smoke, very hot. */
function goUp(world: World, k: number): void {
  world.place(k, (world.rng.nextU32() & 3) === 0 ? SMOKE : FIRE);
  world.life[k] = 10 + (world.rng.nextU32() & 31);
  world.temp[k] = 1400;
}

/**
 * A blast centred on (x, y): sets off cells of the same explosive within the
 * radius, heats what is near (loose matter, brittle solids and other
 * explosives, which may then go off too), and pushes the air. `pressure` is
 * the blast strength, or -1 to scale it by the cells set off here.
 */
function burst(world: World, x: number, y: number, id: number, r: number, pressure: number): void {
  const { w, h, type, temp } = world;
  let n = 0;
  const r2 = r * r;
  // Heat reaches a little past the blast. The detonation wave arms the same
  // explosive as far as the air shock can push it (a powder only a little
  // further, so a trail still burns like a fuse), so nothing it scatters is left behind.
  const R = r + 2;
  const R2 = R * R;
  const A = PHASE_OF[id] === PH_POWDER ? R : r * 3;
  const A2 = A * A;
  for (let j = Math.max(0, y - A); j <= Math.min(h - 1, y + A); j++) {
    for (let i = Math.max(0, x - A); i <= Math.min(w - 1, x + A); i++) {
      const d2 = (i - x) * (i - x) + (j - y) * (j - y);
      if (d2 > A2) continue;
      const k = j * w + i;
      const t = type[k];
      if (t === id && d2 <= r2) {
        n++;
        goUp(world, k);
      } else if (t === id) {
        // The same explosive just beyond reach: the detonation wave sets it off next frame.
        // (Well past its ignition point, so cooling by its neighbours cannot stop the wave.)
        if (temp[k] < IGNITION_OF[id] + 150) temp[k] = IGNITION_OF[id] + 150;
        world.life[k] = world.currentStamp();
      } else if (d2 <= R2 && (PHASE_OF[t] !== PH_SOLID || BRITTLE_OF[t] > 0 || BLAST_POWER_OF[t] > 0)) {
        temp[k] += BLAST_HEAT * (1 - Math.sqrt(d2) / (R + 1));
        // An explosive heated by this blast goes off next frame, not in this one: a fuse, not one bang.
        // (Its unused life field holds the frame it was armed; it moves with the grain.)
        if (BLAST_POWER_OF[t] > 0) world.life[k] = world.currentStamp();
      }
    }
  }
  world.air.addPressure(x, y, pressure >= 0 ? pressure : BLAST_POWER_OF[id] * Math.sqrt(n), r * 3);
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
