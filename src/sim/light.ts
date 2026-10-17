import { ELEMENTS, PHASE_OF, PH_ENERGY } from './elements';
import type { World } from './world';

/*
 * Light, worked out where it is needed (a plant deciding to grow, a solar
 * panel, glow paint charging), straight from the cells, so it is always a
 * plain function of the world and rewinds and saves stay exact.
 *
 * Daylight comes straight down from the open sky: each cell above lets
 * through its share (air all of it, glass and water most, smoke and leaves
 * some, solids and powders none). Anything burning or glowing hot within
 * EMIT_REACH cells adds its own light, fading with distance.
 */

/** Share of light a cell lets through, by element. */
export const TRANSMIT_OF = Float32Array.from(ELEMENTS, (e, id) => {
  if (id === 0) return 1;
  if (e.transmits !== undefined) return e.transmits;
  if (e.phase === 'gas') return 0.97;
  if (e.phase === 'energy') return 1;
  if (e.texture === 'glass') return 0.95;
  if (e.phase === 'liquid') return e.solvent ? 0.92 : 0.5;
  return 0;
});

/** How far a glowing cell lights, in cells, and the temperature where glowing starts (°C). */
const EMIT_REACH = 8;
const GLOW_FROM = 550;

/** Light at cell (x, y), 0 (dark) to 1 (full daylight or a bright flame close by). */
export function lightAt(world: World, x: number, y: number): number {
  const { w, h, type, temp } = world;
  // Daylight down the column.
  let sky = 1;
  for (let yy = y - 1; yy >= 0 && sky > 0.01; yy--) sky *= TRANSMIT_OF[type[yy * w + x]];
  if (sky >= 1) return 1;
  // Glow from burning and red-hot cells nearby.
  let glow = 0;
  const x0 = Math.max(0, x - EMIT_REACH);
  const x1 = Math.min(w - 1, x + EMIT_REACH);
  const y0 = Math.max(0, y - EMIT_REACH);
  const y1 = Math.min(h - 1, y + EMIT_REACH);
  for (let yy = y0; yy <= y1; yy++) {
    for (let xx = x0; xx <= x1; xx++) {
      const i = yy * w + xx;
      const T = temp[i];
      const bright = PHASE_OF[type[i]] === PH_ENERGY ? 1 : T > GLOW_FROM ? Math.min(1, (T - GLOW_FROM) / 900) : 0;
      if (bright === 0) continue;
      const d = Math.max(Math.abs(xx - x), Math.abs(yy - y)) / EMIT_REACH;
      if (d < 1) glow += bright * (1 - d) * (1 - d) * 0.35;
    }
  }
  return Math.min(1, sky + glow);
}
