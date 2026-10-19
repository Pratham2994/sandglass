# Sandglass

A falling-sand physics sandbox that runs in the browser. Pour, burn, melt, mix, wire up and blow up 246 elements, then rewind time and try again.

**Play it: [sandglass.prathampanchal02994.workers.dev](https://sandglass.prathampanchal02994.workers.dev/)**

Every element is described by physical properties: density, hardness, melting and boiling points, how well it conducts heat, whether it burns or dissolves. A small chemistry compiler turns general rules (acids eat what is softer than they are strong, solvents take up soluble solids, fuels catch fire next to an oxidiser) into a reaction table when the page loads. Around a hundred hand-written reactions sit on top of that for the things rules cannot cover, like lye and oil turning into soap.

There is no server and no account. Everything runs on your machine, and saves are plain files.

## What it does

**Light and heat.** Every cell has a real temperature. Fire, lava and anything red-hot glow and light up what is around them. Hot air shimmers, and reactions flash in their own colour as they happen.

**Time.** Pause, slow down, step one frame, or drag back through the last 30 seconds. Draw while rewound and the world branches from that moment. The simulation is deterministic, so a replay is exact.

**Inspect.** Point at any cell to see what it is, how hot it is, what it carries in solution, current and pressure, and what it would react with and why. Press I to pin it.

**Mixtures.** A cell can carry a dissolved solute, so salt water is water carrying salt, not a separate element. Boil it and the salt comes back. Supersaturate it and crystals grow.

**Systems that interact.**

- Circuits: batteries, wire, bulbs, LEDs, resistors, diodes, capacitors, switches, motors, electromagnets and solar panels, solved as a real resistor network. LEDs burn out without a resistor.
- Pressure: gas made in a sealed box builds pressure until the walls give. Valves vent it, tanks rupture.
- Structure: stone, brick, concrete and steel only reach so far past a support. What nothing holds breaks off and falls as a block, floats or sinks by density, and rope burns through.
- Life: plants that need light and water, trees, flowers, fish, birds, bees, butterflies with a full life cycle, a food web, mould, moss, plague and medicine.
- Weather: clouds that rain or snow, storm clouds that throw lightning, fog, hail.
- Nuclear: pack enough uranium together and it goes critical. Control rods calm it, and a nuke flashes, burns, flattens and leaves fallout.

## Running it

You need Node 20.19 or newer.

```
npm install
npm run dev
```

Then open the address Vite prints. It is made for desktop and laptop screens with a mouse, and the layout also adapts to tablets and phones.

To build a static copy you can host anywhere:

```
npm run build
```

## Controls

| Input | Action |
| --- | --- |
| Left drag | Paint the selected element |
| Right drag | Erase |
| Mouse wheel | Brush size |
| Middle click | Pick up the element under the pointer |
| Middle drag | Move round when zoomed in |
| Ctrl + wheel, + and - | Zoom in and out, 0 shows the whole world |
| Space | Pause and play |
| . | Step one frame while paused |
| Hold R | Rewind |
| H, P, F | Heat, pressure and air flow views |
| I | Pin the inspect lens |
| / | Search elements |
| 1 to 9 | Recently used elements |
| E | Eraser |

Heat, Cool and Wind sit at the top of the element list as tools.

On a touch screen, one finger draws, two fingers pinch to zoom and move together to pan, and in inspect mode a touch reads the cell under it.

## How it is built

- TypeScript and Vite. No UI framework; the panel is plain DOM.
- The world is a set of typed arrays, one per property (type, temperature, velocity, solute, charge and so on). The hot loop allocates nothing.
- A fixed 60 Hz step with an accumulator. If a frame gets too heavy, the simulation runs briefly in slow motion instead of freezing the picture.
- The grid is split into 32 by 32 chunks that sleep when nothing in them can change. Chunks that are only cooling run the heat pass and skip the rest.
- Rendering is WebGL2: a scene pass at cell resolution, a blurred light pass for glow, then a composite pass for heat haze and the view modes. A Canvas2D renderer remains as a fallback.
- Randomness comes from a seeded generator, so the same seed and the same inputs always give the same world.

```
src/
  core/     frame loop, grid sizing, saves, rewind timeline
  sim/      elements, chemistry compiler, step, heat, air, circuits, structure, light
  render/   WebGL2 and Canvas2D renderers, palette, zoom
  input/    brush and pointer handling
  ui/       element library, inspect lens, intro, cursor
scripts/    audit, behaviour checks, soak test, docs generators
tests/e2e/  Playwright tests driven through a dev-only hook
docs/       generated guide, master list and reports
```

## Checks and docs

The simulation is tested by running it, not by mocking it.

| Command | What it does |
| --- | --- |
| `npm run behaviour` | 284 checks that each build a small scene and measure one promise from an element's description |
| `npm run audit` | Runs every ordered pair of elements together at room temperature, hot and cold, and flags anything the rules do not explain, matter from nothing, or a phase change that does not reverse |
| `npm run soak` | Forty random worlds run for 20 seconds each, checked for impossible states, then run again from the same seed to confirm an identical result |
| `npm run test:e2e` | 26 Playwright tests that assert exact cell counts and grid hashes |
| `npm run docs` | Audit and behaviour checks, then rebuilds the guide and master list |

### What is in `docs/`

| File | What it is |
| --- | --- |
| `SPEC.md` | The original design spec and roadmap, written before the code. Some details have moved on since. |
| `GUIDE.md` | How each system works, then a short how-to for every element. Generated by `npm run guide`. |
| `MASTER_LIST.md` | Every element, its properties and every reaction pair. Generated by `npm run master-list`, which also writes `public/master-list.html`, the page the list button in the app opens. |
| `AUDIT.md` | The latest pairwise audit result. It must show 0 findings. The master-list page reads its status from here. |
| `BEHAVIOUR.md` | The latest behaviour check results, one line per check. |
| `SOAK.md` | The latest soak test result. |

## Licence

MIT. See `LICENSE`.
