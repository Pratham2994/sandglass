# Sandglass: Design Spec

Version of 16 Oct 2026. Source of truth for what to build.

## TL;DR

A desktop browser falling-sand sandbox where elements are defined by physical properties, not by hand-written pair reactions. Every pair of materials does something plausible, and the catalogue can grow past 500 without writing 125,000 reaction rules by hand.

**Edge over rivals:** do not compete on element count. Win on how it looks (real light, glowing heat), how you control time (rewind and branch), and how much it explains itself (hover any cell to see what it is and why it reacts). Emergent chemistry is the depth underneath.

**Stack:** TypeScript and Vite. Simulation on the CPU in struct-of-arrays typed buffers; rendering on the GPU with WebGL2 shaders. Grid sized from the window, about 480 × 270 cells on a 1080p screen. Desktop first, single player, no backend.

## What makes it better, not just as good

Pick a few axes to win and match the rest. Sandboxels has 546 elements and nearly five years of content; The Powder Toy has over a decade of electronics. A solo project that tries to beat both on every side ends up worse at all of them.

| Pillar | What the player sees | How we build it |
| --- | --- | --- |
| Light and material | Lava and fire light the cave around them. Hot iron glows dull red, then orange, then white, from its real temperature. Water shimmers and bends what is behind it. Hot air ripples. Powders show grain, not flat squares. | Sim stays on CPU. Each frame, upload `type`, `temp`, `shade` (and solute data) as textures. Fragment shaders draw base colour, black-body glow from temperature, a low-resolution light grid spread from emissive cells, bloom and heat haze. |
| Time control | Pause, slow motion, step one frame. A scrubber at the bottom: drag back 30 s, change something, play a new branch. | Deterministic sim plus a snapshot every 30 frames in a ring buffer, with the brush inputs between snapshots. Rewind = load the nearest snapshot and replay inputs. |
| Inspect lens | Hover any cell: element, temperature, what is dissolved in it, what it reacts with and why ("dissolves: water is a solvent, salt solubility 0.36"). Toggle heat, pressure and flow views. | Read straight from the typed arrays. The chemistry compiler stores a reason code with every pair entry, so the "why" is free. |
| Emergent chemistry | Odd combinations do something sensible. Fewer "nothing happens" moments. | Chemistry compiler and solutes, below. |

**Cut on purpose:** creatures and humans, mods marketplace, multiplayer, phones.

**Open for good ideas:** anything that makes the grid, motion or animation feel better (falling acceleration, splashes, particle sparks, smooth liquid edges, camera shake on explosions).

## Landscape

| Game | Tech | Best at | How content is authored |
| --- | --- | --- | --- |
| [Sandboxels](https://sandboxels.wiki.gg/wiki/Sandboxels) (R74n, on neal.fun since Feb 2026) | JS, HTML5 canvas | Breadth: 546 elements (228 hidden), heat, electricity, life | Per element: a `behavior` grid, a `reactions` map, `tempHigh`/`stateHigh` ([modding docs](https://sandboxels.wiki.gg/wiki/Modding_tutorial/Element_properties)). Molten forms auto-generated ([source](https://sandboxels.wiki.gg/wiki/Category:Molten_elements)) |
| [The Powder Toy](https://github.com/The-Powder-Toy/The-Powder-Toy) | C++, SDL, Lua | Depth: air pressure and velocity field, heat, gravity, electronics | Hand-coded update function per element |
| [Sandspiel](https://github.com/MaxBittker/sandspiel) | Rust to WASM, WebGL | Feel, sharing creations, wind via a fluid sim | Hand-coded species |
| [Noita](https://80.lv/articles/noita-a-game-based-on-falling-sand-simulation/) | C++, custom engine | Rigid bodies from pixels, multithreaded 64 × 64 chunks | Material files plus reaction lists |

All of them scale content by having a human write each reaction. Sandboxels' auto-generated molten variants hint at the answer; we take it to its end. None of them treats the screen as part of the experience: Sandboxels packs controls into bars around a canvas that does not fill the window.

## Emergent chemistry

### What "emergent" means here

Other games write each reaction by hand: "salt + water = salt water". We do not. Each element declares physical properties (salt is soluble, water is a solvent). A few general rules ("a solvent dissolves soluble solids") produce the reactions. Nobody wrote "salt + water"; it happens because the properties say so. Add sugar with `solubility: 2.0` and it dissolves too, with no new code.

### 1. Chemistry compiler

546 elements means about 149,000 unordered pairs. Nobody writes that many reactions, so in most games most pairs do nothing.

Each element declares about 15 physical properties. At load time a compiler runs the rule families over every ordered pair and writes the result into a flat pair table. Hand-written overrides go in last and win. At runtime the engine does one O(1) table read per contact, so the generality costs nothing per frame.

### 2. Solutions inside cells

Each cell has `solute` (an element id) and `conc` (0 to 255). Salt water is water with `solute = salt, conc = 90`, not a new element.

What falls out without extra code:

- **Density layering.** Effective density = solvent density + conc × solute weight. Salt water sinks under fresh water.
- **Crystallisation.** Boil the water away and the solute is left as a salt cell.
- **Saturation.** Past the solubility limit, extra salt stays solid on the bottom.
- **Dilution.** Acid that eats metal fills with dissolved metal and gets weaker, so one drop cannot eat an infinite wall.
- **Wet materials.** Porous solids (sand, soil, cloth) use the same fields to hold absorbed water. Wet sand is sand carrying water.

### Costs

- **Blander surprises.** Rule-driven chemistry is plausible but can feel predictable. Keep an overrides file for deliberate weirdness.
- **Harder tuning.** One property change ripples into hundreds of pairs. The inspector must show what the compiler generated for any pair.
- **Memory.** Three extra bytes per cell, about 390 KB at 130,000 cells.

## Engine architecture

Simulation on one CPU thread, rendering on the GPU. Grid sized from the window at start: 4 screen px per cell (480 × 270 at 1080p), capped at 160,000 cells (5 px per cell on larger screens). Budget 16.6 ms per frame; the cell pass may take about 8 ms.

```
LOAD TIME (once)
  element files ──► chemistry compiler ──► PAIR TABLE (N × N, 10 B/entry)
  (~15 properties)   (rule families,              │
                      overrides last)             │ 1 table read per contact
EVERY FRAME (16.6 ms)                             ▼
  Input ──► Cell pass ──► Heat pass ──► Air pass ──► Render
  brush,    move,         diffuse,      pressure,    GPU shaders
  wake      1 lookup      melt, boil    wind         (Canvas2D until phase 5)
    ▲                                                   │
    └──────────────────── next frame ───────────────────┘
```

### Why CPU simulation, GPU rendering

GPU falling-sand engines scale to millions of cells ([sands-of-rust](https://github.com/wg-romank/sands-of-rust), [sandengine](https://github.com/ARez2/sandengine), [WebGPU sand](https://github.com/damiensgit/sand-simulator)), but every cell runs in parallel, so a cell cannot simply move itself. Rules become "what moves into me?" or 2 × 2 Margolus blocks, which makes conditional chemistry, solutes and explosions much harder. Drawing has no such problem, so: CPU for rules, GPU for looks. Canvas2D is fine for phases 0 to 4 but cannot do light, bloom or refraction at 60 FPS.

### Cell data (struct of arrays)

Each field is its own typed array, index `i = y * W + x`.

| Array | Type | Bytes | Holds |
| --- | --- | --- | --- |
| `type` | Uint16 | 2 | Element id |
| `temp` | Float32 | 4 | Temperature in °C |
| `solute` | Uint16 | 2 | Dissolved or absorbed element id, 0 = none |
| `conc` | Uint8 | 1 | Solute amount, 0 to 255 |
| `life` | Uint16 | 2 | Timer: fuel left, growth stage, fuse |
| `vy` | Int8 | 1 | Fall speed, so falling accelerates |
| `stamp` | Uint8 | 1 | Frame mod 256 when last moved |
| `shade` | Uint8 | 1 | Fixed colour noise per cell, moves with the cell |

14 bytes per cell, about 1.8 MB at 130,000 cells. Consecutive snapshots differ in few cells, so delta-compressed snapshots stay small. Add fields only in the phase that needs them.

### The five passes

1. **Input.** Brush strokes are queued by pointer events and applied at the start of the frame (needed for deterministic replay). Wake touched chunks. Record strokes.
2. **Cell pass.** For each awake chunk, bottom row to top, scan direction flipped per row and per frame. For each cell not stamped this frame: run its movement rule, then pick one random neighbour and do one pair-table lookup.
3. **Heat pass.** Explicit diffusion over 4 neighbours: new T = T + k × sum(neighbour T − T), k per pair from conductivity, k ≤ 0.2 for stability. Then phase thresholds.
4. **Air pass.** Pressure and velocity on a coarse grid, one air cell per 4 × 4 sim cells (120 × 68 at 1080p). Velocity follows the pressure gradient, pressure follows divergence, both decay. Loose cells are pushed by local velocity.
5. **Render.** Phase 0 to 4: write a `Uint32Array` view of an `ImageData`, `putImageData`, CSS `image-rendering: pixelated`. Phase 5 on: upload arrays as textures; pass 1 base colour from a palette texture, solute blend, black-body glow; pass 2 quarter-resolution light grid seeded by emissive cells and blurred, multiplied over the scene; pass 3 bloom, heat haze, refraction. Nearest-neighbour sampling so cells stay crisp.

### Movement by phase

| Phase | Tries in order | Swaps with |
| --- | --- | --- |
| Powder | down, then down-left or down-right (random order) | empty, or liquid/gas of lower density |
| Liquid | down, diagonal down, then sideways up to `dispersion` cells, only towards a drop | empty, gas, or lighter liquid |
| Gas | up, diagonal up, sideways at random | empty or lighter gas |
| Solid | does not move (becomes powder if `brittle` and pressure is high) | nothing |

Density swaps into non-empty cells succeed with a probability that grows with the density gap, so layers separate visibly rather than in one frame. Bottom and side edges of the grid act as walls.

### Sleep and wake

32 × 32 chunks (15 × 9 = 135 at 1080p). Two flag arrays: `awake` (read this frame) and `awakeNext` (written this frame), swapped at frame start. Any change marks the chunks covering that cell and its 1-cell neighbourhood. A density swap skipped by chance also keeps its chunk awake. Once heat exists, a chunk also stays awake while any temperature change exceeds 0.05 °C. A settled scene should cost under 2 ms.

### Determinism

Seeded mulberry32. Same seed and inputs give the same result: needed for replays, rewind, branching, and E2E tests that assert exact grid hashes.

### Later: Web Worker

Moving the sim into a Worker frees the main thread. Sharing buffers via `SharedArrayBuffer` needs cross-origin isolation (COOP and COEP headers). Only if the UI stutters.

## Element catalogue

Start with 31 elements that each exercise a different rule. Breadth comes later from properties.

### Property schema

```ts
interface ElementDef {
  key: string;              // 'sand'
  name: string;
  category: 'powders' | 'liquids' | 'gases' | 'solids' | 'energy' | 'explosives' | 'life' | 'tools';
  colours: string[];        // picked per cell via shade
  phase: 'powder' | 'liquid' | 'gas' | 'solid' | 'energy';
  cls: 'mineral' | 'metal' | 'organic' | 'salt' | 'water' | 'gas' | 'energy' | 'life';
  density: number;          // kg/m³
  melt?: number; meltInto?: string;   // °C
  boil?: number; boilInto?: string;   // °C
  heatCapacity: number;     // relative, water = 1
  conductivity: number;     // 0..1
  ignition?: number;        // °C
  burnEnergy?: number;      // °C pushed into neighbours per frame while burning
  burnInto?: string[];
  oxidiser?: number;        // 0..1
  acidity?: number;         // -1 strong base .. +1 strong acid
  hardness: number;         // 0..1, resists acid and pressure
  solvent?: boolean;
  solubility?: number;      // how much dissolves per solvent cell
  porosity?: number;        // 0..1, how much liquid it absorbs
  electric?: number;        // 0..1 electrical conductivity
  emissive?: number;        // 0..1 light emitted (renderer)
  dispersion?: number;      // liquids: max sideways cells per frame
  brittle?: boolean;
  explosive?: { pressure: number; fuse: number };
  overrides?: Record<string, Reaction>;  // hand-written, wins over the compiler
}
```

### v1 set

| Category | Elements | Count |
| --- | --- | --- |
| Powders | sand, dirt, salt, sugar, snow, ash, sawdust, gunpowder | 8 |
| Liquids | water, oil, acid, lava, alcohol, mercury | 6 |
| Gases | steam, smoke, oxygen, hydrogen, methane | 5 |
| Solids | wall, stone, wood, iron, glass, ice | 6 |
| Energy | fire, spark, plasma | 3 |
| Explosives | TNT, nitro | 2 |
| Life | seed (grows into plant) | 1 |
| Tools | heat, cool, erase, wind (brushes, not elements) | 0 |

### States you get without defining them

- Salt water, sugar water, brine: solvent + solute.
- Wet sand, mud, soaked sawdust: porous solid + absorbed water. Wet sand is heavier, darker, does not ignite.
- Rust: iron touching water and oxygen, slow corrosion.
- Dilute acid: acid carrying dissolved metal.
- Glass from sand: sand melts at 1,700 °C into molten glass, freezes into glass.

### Growing to 150+

After v1 is stable: metals (copper, gold, aluminium, sodium), minerals (clay, limestone, coal), organics (cloth, paper, rubber, wax), biology (moss, fungus), electronics (battery, wire, LED, heater). Most metals and minerals need zero new rules.

## Interaction rule families

Three run per cell (phase change, electricity, growth); six run per pair and are compiled into the pair table.

| Rule | Fires when | Result | Example |
| --- | --- | --- | --- |
| Phase change | T crosses `melt` or `boil` | Becomes `meltInto` / `boilInto`, heat absorbed | Ice → water → steam |
| Combustion | T ≥ `ignition` and a neighbour has `oxidiser` > 0 | Becomes fire, `life` = fuel, pushes `burnEnergy` into neighbours | Wood burns, leaves ash |
| Dissolution | Solvent liquid touches soluble solid, below saturation | Solid removed, solvent `conc` rises | Salt vanishes into water |
| Absorption | Porous solid touches liquid, below capacity | Liquid removed, solid `conc` rises | Sand becomes wet sand |
| Corrosion | `acidity` > target `hardness`, target metal/mineral/organic | Target dissolved into acid, metal releases hydrogen | Acid eats iron, fizzes |
| Neutralisation | Acid touches base | Both become salt water, heat released | Acid + lye |
| Electricity | Spark enters a cell with `electric` > 0 | Charge passes on, cell heats | Spark runs down iron wire |
| Explosion | Explosive reaches `ignition`, or a spark hits it | Large pressure source, fire, hot gas | TNT throws sand |
| Growth | Seed on dirt holding water, light above | Plant grows up, uses water | Seed → stem |

Design decisions:

- **Empty cells are air** with `oxidiser: 0.21`. Fires burn in the open and die when sealed in a box.
- **Fire is put out by heat, not a rule.** Water's high heat capacity pulls fire below ignition and boils into steam.
- **Salt water conducts, pure water barely does.** Water's `electric` scales with salt `conc`. Electrolysis then only works in salty water.
- **Brittle solids break from pressure**, whatever caused it.

### Pair table entry

Parallel typed arrays of size N × N, indexed `a * N + b`. Ordered: `(acid, iron)` and `(iron, acid)` are separate entries with swapped outputs.

| Field | Type | Meaning |
| --- | --- | --- |
| `rule` | Uint8 | Family, 0 = nothing |
| `outA`, `outB` | Uint16 | What each cell becomes |
| `gas` | Uint16 | Gas released into an empty neighbour, 0 = none |
| `prob` | Uint8 | Chance per frame, 0 to 255 |
| `minT` | Int16 | Fires only above this temperature |
| `reason` | Uint8 | Reason code for the inspector |

About 11 bytes per entry; 2.75 MB at 500 elements. Priority when several families match: override, corrosion, combustion, neutralisation, dissolution, absorption.

## Desktop UI

Owner decision (16 Oct 2026), replacing the floating panels shown below: the canvas fills the area left of a fixed right column, and nothing floats over the play area. The column keeps transport, tools, search and category chips fixed at the top, scrolls the element library in the middle (built for hundreds of elements), and keeps the selected element, brush and a quiet stats line fixed at the bottom. There is no separate landing page: a short intro plays on the canvas itself. The sketch below is the original idea, kept for its control list.

```
┌──────────────────────────────────────────────────────────────────┐
│ ( Paused · 1x · 60 FPS )              ( View: Normal·Heat·Press·Flow )│
│                                                                  │
│                 simulation canvas, edge to edge                  │
│                                                                  │
│            ( o ) brush       ┌──────────────────────┐            │
│                              │ water + salt          │ inspector │
│                              │ 64 °C, salt 35%       │ (hover)   │
│                              │ why: water is solvent │           │
│                              └──────────────────────┘            │
│   30 s ago ─────────────────────────────────────●──── now        │
│        ┌───────────────────────────────────────────────┐         │
│        │ Powders  Liquids  Gases  Solids  Energy  Expl. │  dock  │
│        │ [■][■][■][■][■][■][■][■][■]        [Search /] │         │
│        └───────────────────────────────────────────────┘         │
└──────────────────────────────────────────────────────────────────┘
```

### Controls

| Input | Action |
| --- | --- |
| Left drag | Draw selected element |
| Right drag | Erase |
| Scroll | Brush size |
| Shift + scroll | Brush shape: circle, square, line |
| 1 to 9 | Last nine elements used |
| / | Search elements by name or property ("hot", "metal", "explodes") |
| Space | Pause and resume |
| . | Step one frame while paused |
| Hold R, or drag scrubber | Rewind |
| H, P, F | Heat, pressure, flow view |
| Alt + hover | Pin the inspector card |

### Visual rules

- Dark, neutral background so glowing materials carry the colour. UI stays grey; only materials are saturated.
- One sans-serif typeface at 13 px, tabular figures so numbers do not jitter.
- Element swatches show a live render of the material (sand has grain, lava glows), not flat squares.
- Panels at about 90% opacity, no `backdrop-filter` blur (blurring a canvas that changes every frame costs work each frame for little gain).
- Window resize grows or shrinks the grid to fill the canvas area, keeping content anchored to the floor.

## Roadmap

Each phase ends with a check. Do not start a phase until the previous check passes.

| # | Build | Done when |
| --- | --- | --- |
| 0 | Vite + TS project, full-window canvas, render loop, `ImageData` blit, fixed timestep | Noise fills the window at 60 FPS, crisp cells |
| 1 | Sand, wall, brush, `stamp`, seeded RNG, `window.__sim` hook | 10,000 sand cells poured, exactly 10,000 after 600 frames; piles form slopes |
| 2 | Water, oil, density swaps, liquid spreading | Sand sinks through water, oil floats, water surface flat within 1 cell after 10 s |
| 3 | Chunk sleep and wake, perf HUD, chunk debug overlay | Settled scene under 2 ms per frame; full-screen chaos under 12 ms at 130,000 cells |
| 4 | Temperature, phase changes, ice, lava, steam | Ice beside lava melts; steam rises, cools and rains back down |
| 5 | WebGL2 renderer: black-body glow, light grid, bloom, heat haze | Lava in a dark cave lights the walls around it; still 60 FPS |
| 6 | Property schema, chemistry compiler, pair table, inspector with reasons | Hover any cell and see its rule and reason; wood burns in the open, fire dies in a sealed box |
| 7 | `solute` and `conc`, dissolution, absorption | Salt water layers under fresh water; boiling it leaves salt |
| 8 | Air pressure, wind tool, TNT, brittle solids, flow view | TNT throws sand outwards, nearby glass shatters |
| 9 | Pause, step, slow motion, time scrubber, branching | Drag back 30 s, draw, play: the new branch is identical on every replay |
| 10 | Spark, wire, electrolysis, seed and plant | Salt water conducts, pure water does not |
| 11 | Floating dock, search, hotbar, live swatches, save and load file | A saved file reloads the identical scene, frame for frame |

Phase 12, optional: sim in a Worker, or WebGPU movement pass if 130,000 cells is not enough.

### Testing

E2E only, at milestones (end of phases 1, 2, 4, 6, 8, 9, 11). A dev-only `window.__sim` hook exposes reset(seed), fill rect, step N frames with a fixed timestep, cell counts, and a grid hash. Playwright drives it and asserts exact counts and hashes.

## Risks

- **Too many fronts.** If time runs short, ship light and the inspector first; the scrubber after.
- **Two tech stacks.** Shaders debug badly. Keep the GPU side to rendering only; keep the Canvas2D renderer as a fallback.
- **Hidden allocation in the hot loop** causes GC pauses. Plain loops over typed arrays; check the Chrome Performance panel at phase 3.
- **Licence contamination.** The Powder Toy is GPL; copying its code makes the project GPL. Sandspiel is MIT. Reading for ideas is fine.

## Sources

- [Sandboxels wiki: overview, element count](https://sandboxels.wiki.gg/wiki/Sandboxels)
- [Sandboxels modding: element properties](https://sandboxels.wiki.gg/wiki/Modding_tutorial/Element_properties)
- [Sandboxels: auto-generated molten elements](https://sandboxels.wiki.gg/wiki/Category:Molten_elements)
- [Neal Agarwal, Wikipedia (Sandboxels on neal.fun, Feb 2026)](https://en.wikipedia.org/wiki/Neal_Agarwal)
- [The Powder Toy source](https://github.com/The-Powder-Toy/The-Powder-Toy)
- [Sandspiel source](https://github.com/MaxBittker/sandspiel) and [Making Sandspiel](https://maxbittker.com/making-sandspiel)
- [Noita engine write-up, 80.lv](https://80.lv/articles/noita-a-game-based-on-falling-sand-simulation/)
- [sands-of-rust: GPU Margolus approach](https://github.com/wg-romank/sands-of-rust)
- [sandengine: Rust + GLSL compute](https://github.com/ARez2/sandengine)
- [WebGPU sand simulator, pull-based rules](https://github.com/damiensgit/sand-simulator)
