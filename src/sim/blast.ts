import { AIR, AIR_SHIFT } from './air';
import {
  BLAST_POWER_OF,
  BLAST_RADIUS_OF,
  BREAKS_INTO_OF,
  BRITTLE_OF,
  EMPTY,
  FALLOUT,
  FIRE,
  IGNITION_OF,
  NUKE,
  PHASE_OF,
  PH_ENERGY,
  PH_GAS,
  PH_LIQUID,
  PH_POWDER,
  PH_SOLID,
  PLASMA,
  SMOKE,
  RUPTURE_BURST_OF,
  RUPTURE_INTO_OF,
  RUPTURE_P_OF,
  VALVE_OF,
  WALL,
} from './elements';
import { SMOKE_LINGER } from './step';
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
  if (id === NUKE) {
    nuke(world, x, y);
    return;
  }
  const r = BLAST_RADIUS_OF[id];
  if (r !== 0) burst(world, x, y, id, r, -1);
}

/**
 * A nuke goes off at (x, y). Inside the fireball (radius R) everything but
 * wall is vaporised into plasma and flame. Out to 3R the heat falls off,
 * setting fires, melting and shattering brittle solids; the air shock throws
 * what is loose. Above it a mushroom cloud of hot smoke and flame forms, with
 * fallout in it that drifts down after. The whole view flashes white. Other
 * nukes inside the fireball are used up; further ones are heated and go off next.
 */
function nuke(world: World, x: number, y: number): void {
  const { w, h, type, temp, rng } = world;
  const R = BLAST_RADIUS_OF[NUKE];
  const F = 3 * R;
  const F2 = F * F;
  for (let j = Math.max(0, y - F); j <= Math.min(h - 1, y + F); j++)
    for (let i = Math.max(0, x - F); i <= Math.min(w - 1, x + F); i++) {
      const d2 = (i - x) * (i - x) + (j - y) * (j - y);
      if (d2 > F2) continue;
      const d = Math.sqrt(d2) / R;
      const k = j * w + i;
      const t = type[k];
      if (t === WALL) continue;
      if (d < 1) {
        // The fireball: vaporised (the core into plasma, the rim into flame), whatever it was.
        if (d < 0.55 || t !== EMPTY || rng.next() < 0.7) {
          world.place(k, d < 0.55 ? PLASMA : FIRE);
          world.life[k] = 20 + (rng.nextU32() & 63);
        }
        temp[k] = 3500 * (1 - d * 0.5);
        continue;
      }
      const f = (3 - d) / 2;
      if (t === NUKE) {
        temp[k] = Math.max(temp[k], IGNITION_OF[NUKE] + 150);
        world.life[k] = world.currentStamp();
        continue;
      }
      // Beyond the fireball, a heat flash falling off with distance: what burns catches fire, the air
      // scorches, but rock, soil and water only warm (heating them through would keep the whole map
      // cooling, and busy, for many seconds). Brittle solids shatter near it; flame in the air close in.
      if (t === EMPTY) temp[k] += 150 * f * f;
      else if (IGNITION_OF[t] !== Infinity && rng.next() < f) temp[k] = Math.max(temp[k], IGNITION_OF[t] + 60);
      else temp[k] += 250 * f * f;
      if (BRITTLE_OF[t] > 0 && BREAKS_INTO_OF[t] !== 0 && rng.next() < f) world.place(k, BREAKS_INTO_OF[t]);
      else if (t === EMPTY && rng.next() < 0.25 * f * f) {
        world.place(k, FIRE);
        world.life[k] = 10 + (rng.nextU32() & 31);
      }
    }
  // The air carries this far: it flattens brick out to about 5R and leaves the rest of the world standing.
  world.air.addPressure(x, y, 12, 2 * R);
  cloud(world, x, y, R);
  world.flash = 1;
  // Wake only what the blast and its cloud reach (the air pass wakes what the shock pushes), not the whole map.
  const top = Math.max(0, y - Math.round(R * 3.4));
  for (let j = top; j <= Math.min(h - 1, y + F); j += 16)
    for (let i = Math.max(0, x - F - 8); i <= Math.min(w - 1, x + F + 8); i += 16) world.wake(i, j);
}

/** The mushroom cloud: a stem of flame and smoke rising from the blast to a wide cap, with fallout in the cap. */
function cloud(world: World, x: number, y: number, R: number): void {
  const { w, h, rng } = world;
  const cy = Math.max(Math.round(R * 0.6), y - Math.round(R * 2.6));
  const rx = R * 1.5;
  const ry = R * 0.6;
  const sw = Math.max(2, Math.round(R / 4));
  // Stem.
  for (let j = Math.max(0, cy); j <= Math.min(h - 1, y - R); j++)
    for (let i = Math.max(0, x - sw); i <= Math.min(w - 1, x + sw); i++)
      if (rng.next() < 0.55) puff(world, j * w + i, Math.abs(i - x) < sw / 2);
  // Cap: a flattened ellipse, flame inside, smoke round the edge.
  for (let j = Math.max(0, Math.floor(cy - ry)); j <= Math.min(h - 1, Math.ceil(cy + ry)); j++)
    for (let i = Math.max(0, Math.floor(x - rx)); i <= Math.min(w - 1, Math.ceil(x + rx)); i++) {
      const e = ((i - x) / rx) ** 2 + ((j - cy) / ry) ** 2;
      if (e <= 1 && rng.next() < 0.6) puff(world, j * w + i, e < 0.35);
    }
}

/** One cell of the mushroom cloud, if the air there is free: mostly smoke, flame near the middle, a little fallout. */
function puff(world: World, k: number, inner: boolean): void {
  if (world.type[k] !== EMPTY) return;
  const u = world.rng.next();
  const id = u < 0.06 ? FALLOUT : inner && u < 0.5 ? FIRE : SMOKE;
  world.place(k, id);
  if (id === FIRE) world.life[k] = 30 + (world.rng.nextU32() & 63);
  else if (id === SMOKE) {
    // Mushroom smoke starts part faded and clears soon after it fades, so the cloud
    // shows for a few seconds and does not hang over the whole map as haze.
    world.shade[k] = 96 + (world.rng.nextU32() & 31);
    world.life[k] = SMOKE_LINGER - 20;
  }
  // Smoke only warm: a sky full of hot smoke would heat the air over half the map, which then takes long to cool.
  world.temp[k] = id === FIRE ? 900 : 60;
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
/** Blast power from which a powder detonates as a wave (ammonium nitrate) rather than burning along like a fuse (gunpowder). */
const STRONG_POWDER = 5;

function burst(world: World, x: number, y: number, id: number, r: number, pressure: number): void {
  const { w, h, type, temp } = world;
  let n = 0;
  const r2 = r * r;
  // Heat reaches a little past the blast. The detonation wave arms the same
  // explosive as far as the air shock can push it, so nothing it scatters is
  // left behind; a weak powder (gunpowder) only a little further, so a trail
  // still burns like a fuse.
  const R = r + 2;
  const R2 = R * R;
  const A = PHASE_OF[id] === PH_POWDER && BLAST_POWER_OF[id] < STRONG_POWDER ? R : r * 3;
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
/**
 * A tank ruptures: it becomes what it holds (propane, or nothing for air)
 * and a burst of pressure throws what is near, shattering brittle things.
 */
export function rupture(world: World, x: number, y: number): void {
  const i = y * world.w + x;
  const t = world.type[i];
  const T = world.temp[i];
  world.place(i, RUPTURE_INTO_OF[t]);
  if (world.type[i] !== EMPTY) world.temp[i] = T;
  world.air.addPressure(x, y, RUPTURE_BURST_OF[t], 4);
  world.wakeAll();
}

export function airPass(world: World, st: number): void {
  const air = world.air;
  const { w, h, type } = world;
  // Which air is walled in, and which is joined to the open sky, kept current
  // even while the air is calm (gas swelling in a sealed box needs it). An open
  // valve lets the air (and gas) through.
  if ((world.frame & 3) === 0) air.updateBlocked(w, h, (i) => PHASE_OF[type[i]] === PH_SOLID && !(VALVE_OF[type[i]] !== 0 && world.conc[i] !== 0));
  if (!air.active) return;
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
      // Brittle solids crack under pressure, either way. A wall's own air cell is
      // blocked and holds none, so it feels the strongest air on either side of it.
      let press = Math.abs(pk);
      if (air.blocked[k]) {
        if (ax > 0) press = Math.max(press, Math.abs(p[k - 1]));
        if (ax + 1 < aw) press = Math.max(press, Math.abs(p[k + 1]));
        if (ay > 0) press = Math.max(press, Math.abs(p[k - aw]));
        if (ay + 1 < ah) press = Math.max(press, Math.abs(p[k + aw]));
      }
      if (press > 1) {
        for (let y = y0; y < y0 + AIR && y < h; y++)
          for (let x = x0; x < x0 + AIR && x < w; x++) {
            const i = y * w + x;
            if (press > RUPTURE_P_OF[type[i]]) {
              rupture(world, x, y);
              continue;
            }
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
