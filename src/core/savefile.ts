import { ELEMENTS, EMPTY } from '../sim/elements';
import type { World } from '../sim/world';

/**
 * Save files (.sandglass): the whole world, so a loaded scene carries on
 * exactly as it would have, frame for frame. Layout, gzip-compressed:
 *   header JSON (length-prefixed): version, size, frame, seed, RNG state,
 *     air flag, and the element keys by id;
 *   then every field as raw bytes, in a fixed order.
 * Element ids are stored with their keys, so a save still loads after
 * elements are added or reordered (unknown elements become empty space).
 */

const MAGIC = 'SGLS';
/** 2 added `volt` (circuit potentials). Version 1 saves load with every potential at 0. */
const VERSION = 2;

interface Header {
  version: number;
  w: number;
  h: number;
  frame: number;
  seed: number;
  rng: number;
  airActive: boolean;
  keys: string[];
}

/** The world's fields in file order, as byte views, for a save of this version. */
function fields(world: World, version = VERSION): ArrayBufferView[] {
  const fromV2 = version >= 2 ? [world.volt] : [];
  return [
    world.type,
    world.vy,
    world.stamp,
    world.shade,
    world.temp,
    world.life,
    world.solute,
    world.conc,
    world.charge,
    ...fromV2,
    world.awake,
    world.awakeNext,
    world.air.p,
    world.air.vx,
    world.air.vy,
    world.air.blocked,
  ];
}

async function gzip(bytes: Uint8Array, mode: 'compress' | 'decompress'): Promise<Uint8Array> {
  const stream = new Blob([bytes as BlobPart]).stream().pipeThrough(mode === 'compress' ? new CompressionStream('gzip') : new DecompressionStream('gzip'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

/** Encodes the world as a compressed save file. */
export async function saveWorld(world: World): Promise<Uint8Array> {
  const header: Header = {
    version: VERSION,
    w: world.w,
    h: world.h,
    frame: world.frame,
    seed: world.seed,
    rng: world.rng.getState(),
    airActive: world.air.active,
    keys: ELEMENTS.map((e) => e.key),
  };
  const head = new TextEncoder().encode(JSON.stringify(header));
  const parts = fields(world);
  const size = 4 + 4 + head.length + parts.reduce((n, p) => n + p.byteLength, 0);
  const out = new Uint8Array(size);
  out.set(new TextEncoder().encode(MAGIC), 0);
  new DataView(out.buffer).setUint32(4, head.length, true);
  out.set(head, 8);
  let at = 8 + head.length;
  for (const p of parts) {
    out.set(new Uint8Array(p.buffer, p.byteOffset, p.byteLength), at);
    at += p.byteLength;
  }
  return gzip(out, 'compress');
}

/**
 * Loads a save into the world. The world takes the saved size first (so the
 * scene is exactly as saved); the caller then fits it to the screen.
 * Throws with a plain message if the file is not a Sandglass save.
 */
export async function loadWorld(world: World, file: Uint8Array): Promise<void> {
  let raw: Uint8Array;
  try {
    raw = await gzip(file, 'decompress');
  } catch {
    throw new Error('This file is not a Sandglass save.');
  }
  if (new TextDecoder().decode(raw.subarray(0, 4)) !== MAGIC) throw new Error('This file is not a Sandglass save.');
  const headLen = new DataView(raw.buffer, raw.byteOffset).getUint32(4, true);
  const header = JSON.parse(new TextDecoder().decode(raw.subarray(8, 8 + headLen))) as Header;
  if (header.version > VERSION) throw new Error('This save was made by a newer version of Sandglass.');

  world.resize(header.w, header.h);
  let at = 8 + headLen;
  world.volt.fill(0);
  for (const p of fields(world, header.version)) {
    const bytes = new Uint8Array(p.buffer, p.byteOffset, p.byteLength);
    bytes.set(raw.subarray(at, at + p.byteLength));
    at += p.byteLength;
  }
  // Map saved element ids to today's by key.
  const map = header.keys.map((k) => {
    const id = ELEMENTS.findIndex((e) => e.key === k);
    return id < 0 ? EMPTY : id;
  });
  const remap = (a: Uint16Array): void => {
    for (let i = 0; i < a.length; i++) a[i] = map[a[i]] ?? EMPTY;
  };
  remap(world.type);
  remap(world.solute);
  world.frame = header.frame;
  world.seed = header.seed;
  world.rng.seed(header.rng);
  world.air.active = header.airActive;
}
