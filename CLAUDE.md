# sandglass

Project rules for Claude Code. Read this and `docs/SPEC.md` before any work.

## What we are building

A desktop browser falling-sand physics sandbox, better than Sandboxels and The Powder Toy, not just as good. Full spec: `docs/SPEC.md`.

Our edge (all four are in scope, owner agreed):

1. **Light and material.** Real light from fire and lava, black-body glow from temperature, water refraction, heat haze, grainy powders. CPU simulation, WebGL2 rendering.
2. **Time control.** Pause, slow motion, frame step, and a rewind scrubber with branching (deterministic sim + snapshots + replayed inputs).
3. **Inspect lens.** Hover any cell: element, temperature, dissolved solute, what it reacts with and *why*.
4. **Emergent chemistry.** Elements are defined by physical properties. A chemistry compiler turns general rules into a pair table at load time. Cells carry a dissolved solute (salt water = water + salt at a concentration), so mixtures, layering, crystallisation and wet materials need no extra elements.

Also welcome: anything that makes the grid, motion or animation look and feel better than rivals.

## Owner decisions (fixed)

- Single player only. Saves are local files. **No backend, no server.** Everything runs in the browser.
- Desktop and laptop first. Phones are out of scope for now.
- Layout (owner decision, 16 Oct 2026, replaces floating panels): the canvas fills the area left of a fixed right column; nothing floats over the play area. Right column pattern: important controls fixed at the top (transport, tools, search, category chips), the element library fills the rest of the column and must scale to hundreds of elements. Since 17 Oct 2026 the selected element (or the inspect lens), brush and a quiet stats line sit in a slim fixed-height bar under the canvas. Stats (FPS, cells) never sit in prime spots. Sandboxels' cluttered UI is the anti-example.
- No separate landing page. On open, a short skippable intro plays on the canvas itself ("shatter and drain": the word breaks into materials, collapses, drains away) and leaves an empty world.
- Look: references are Figma/Linear (precise, quiet), Noita (pixel-honest), Apple apps (soft). No glows, gradients-as-decoration or anything that reads as AI-generated. Do not theme the UI on sand or hourglasses; Sandglass is only the name.
- No time limit. Quality over speed.
- The owner does not want a learning path. Claude writes all the code. The owner wants every change explained (see Change report).
- Being "first" to do a feature does not matter. Being better does.

## Stack

- TypeScript (strict), Vite, no UI framework unless clearly needed (plain DOM for the panel).
- Simulation: struct-of-arrays typed arrays, single thread, fixed 60 Hz timestep with an accumulator.
- Rendering: Canvas2D `ImageData` for phases 0 to 4, WebGL2 from phase 5. Keep the Canvas2D renderer as a debug fallback.
- Grid sized from the canvas area: 4 screen px per cell (480 × 270 at 1080p), capped at 160,000 cells (5 px per cell on larger screens). On resize the grid grows or shrinks to fill the area, keeping content anchored to the floor.
- Seeded PRNG (mulberry32). Same seed and inputs must give the same grid every time.
- E2E tests: Playwright, driven through a dev-only `window.__sim` hook (reset, fill, step N frames, count cells, grid hash).

## Engine rules that must hold

- Zero allocations per cell per frame in the hot loop: no closures, objects or array literals inside the cell pass.
- Mass conservation: movement only swaps cells, never overwrites.
- Scan bottom to top; flip horizontal scan direction per row and per frame; a `stamp` (frame mod 256) stops a cell moving twice in one frame.
- 32 × 32 chunk sleep and wake. A chunk sleeps only when nothing in it moved and nothing could have moved (a density swap skipped by chance keeps it awake). A change within 1 cell of a chunk edge wakes the neighbour chunk.
- Liquids move sideways only if they find a drop within `dispersion` cells, so lakes settle flat (within 1 cell) and their chunks sleep instead of jittering forever.
- Temperature is `Float32Array`, not integers.
- Pair table entries are ordered (A,B differs from B,A) and carry rule, outputs, gas, probability, min temperature, and a reason code for the inspector.

## Git workflow

- Commit and push routinely: after every working, coherent change. Do not batch a day of work into one commit.
- Commit message: one short line, under 50 characters, imperative, lowercase is fine. Examples: `add sand and water`, `fix liquid jitter`, `chunk sleep`.
- **No commit body. No description. No `Co-Authored-By`. No "Generated with Claude Code". No mention of Claude, AI or any assistant** in commits, PRs, branch names, tags or code comments.
- Author is whatever `git config user.name` / `user.email` says (the owner). Never change git config.
- Push to `origin` on the current branch after each commit. If push fails, say why and stop; do not force-push.
- `.claude/settings.json` turns attribution off; these rules apply even if that setting is ignored.

## Testing

- Prefer E2E over unit tests.
- Do not add or run tests after every small change.
- Run focused E2E tests at milestones (end of phases 1, 2, 4, 6, 8, 9, 11) or when a feature is complete.
- Tests use the deterministic hook: assert exact cell counts and grid hashes, not screenshots.
- After any change to elements, chemistry or heat rules, run `npm run docs` and commit its output with the change. It runs the pairwise audit (`docs/AUDIT.md`, must show 0 findings) and rebuilds the master list (`docs/MASTER_LIST.md` and `public/master-list.html`, opened from the panel's list button).

## Change report (mandatory after every code change)

After each change, before moving on, tell the owner:

1. **Files changed**: every file created, edited or deleted, with its path.
2. **Where it sits**: its place in the folder structure and its job (e.g. `src/sim/step.ts`, simulation core; `src/ui/library.ts`, element library column). Say whether it is browser frontend, build/config, test, or docs. There is no backend; say so if asked.
3. **What changed**: the functions, classes or line ranges touched, in plain words. Example: "`step.ts` lines 40 to 72: new `updateLiquid`, moves water down, then diagonally, then sideways only towards a drop."
4. **Why**: the reason for the change and any trade-off.
5. **How to see it**: what to run or do in the app to see the effect.

Keep the report short and concrete. Plain English, short sentences, simple words (ASD-STE100 style). A small tree of the affected folders helps when files are added.

## How to talk to the owner

- British English, metric units, INR if money comes up.
- No preamble, no flattery, no filler, no em dashes.
- Conclusion first, then reasoning. When there are options, recommend one.
- Push back when an idea is weak. Name the flaw and the trade-off. Do not just agree.
- For technical claims, separate verified facts from assumptions. Check current docs when it matters, and give URLs.
- Find root causes when debugging; no generic fixes.
- Admit mistakes plainly and fix them.

## Current status

All roadmap phases (0 to 11) are done and pushed. Since then (17 and 18 Oct 2026): real circuits (`src/sim/circuit.ts`: battery and capacitor blobs are two-terminal parts that pick their axis and turn round to help each other; wire and metal solve as one piece), pressure in sealed air (boiling bursts boxes, valves, tanks), structure (`src/sim/structure.ts`: spans, falling rigid blocks that float or sink by density, rope and chain), light (`src/sim/light.ts`: plants need light, solar panels, glow paint, light-driven reactions), biology (plague, medicine, mould, mushrooms, algae, moss), nuclear chain reactions, runaway reactions, crystals, indicators, and many more elements: 231 elements, 258 behaviour checks, audit at 0, 26 E2E tests, a soak test (`npm run soak`, 40 random worlds) and an element guide (`docs/GUIDE.md`, part of `npm run docs`). Every element card shows a Try hint. Each batch: properties, behaviour checks, headlines in `scripts/report-html.ts`, recent keys in `src/ui/library.ts` (New dots), `npm run docs` at 0 findings, then commit. Powders and liquids with no fall values now fall like salt or water. Next: more batches, UI polish and subtle motion, and bug hunting in existing elements.
