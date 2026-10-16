import '@fontsource-variable/geist';
import './style.css';
import { fitCanvas, gridFor, whenSized, type GridSize } from './core/grid';
import { FixedLoop } from './core/loop';
import { loadWorld, saveWorld } from './core/savefile';
import { Timeline } from './core/timeline';
import { Brush } from './input/brush';
import { createRenderer } from './render/renderer';
import { ELEMENTS } from './sim/elements';
import { OP_CLEAR } from './sim/ops';
import { step } from './sim/step';
import { World } from './sim/world';
import { mountCursor } from './ui/cursor';
import { PerfStats, mountHud } from './ui/hud';
import { Intro } from './ui/intro';
import { mountLibrary } from './ui/library';

const DEFAULT_SEED = 1;

/** One quiet line on the empty canvas after the intro; gone on the first stroke. */
function showFirstHint(stage: HTMLElement, brush: Brush): void {
  const hint = document.createElement('p');
  hint.className = 'first-hint';
  const text = (): string => {
    const e = ELEMENTS[brush.element];
    const verb = e.phase === 'solid' ? 'draw' : 'pour';
    return `Drag to ${verb} ${e.name.toLowerCase()}. Right drag erases.`;
  };
  hint.textContent = text();
  stage.append(hint);
  brush.subscribe(() => {
    if (brush.held) {
      hint.classList.add('gone');
      window.setTimeout(() => hint.remove(), 400);
    } else hint.textContent = text();
  });
}
/** Wait after the last resize event before rebuilding the grid. */
const RESIZE_DEBOUNCE_MS = 120;

function start(): void {
  const stage = document.getElementById('stage') as HTMLElement;
  let size: GridSize = gridFor(stage);
  const world = new World(size.w, size.h, DEFAULT_SEED);
  const made = createRenderer(document.getElementById('sim') as HTMLCanvasElement, size.w, size.h, size.cellPx);
  const canvas = made.canvas;
  const renderer = made.renderer;
  const brush = new Brush(canvas, world);
  fitCanvas(canvas, size);
  // Every brush op goes through the timeline, which records it by frame for rewind and replay.
  const timeline = new Timeline(world);
  brush.sink = (op) => timeline.record(op);

  /** One simulation frame: recorded input replayed (when re-running the past), then the passes. */
  const advance = (): void => {
    timeline.replayInput();
    step(world);
    timeline.afterStep();
  };
  /** One full frame for the dev hook: new input first, then advance. */
  const frame = (): void => {
    brush.apply();
    advance();
  };

  const perf = new PerfStats();
  const intro = new Intro(world);
  const loop = new FixedLoop({
    // While the intro plays it drives the world; drawing waits until it ends.
    input: () => (intro.active ? intro.frame() : brush.apply()),
    step: () => {
      const t0 = performance.now();
      advance();
      perf.addSim(performance.now() - t0);
    },
    render: () => {
      const t0 = performance.now();
      renderer.draw(world);
      perf.addDraw(performance.now() - t0);
    },
  });

  // The grid follows the stage: on resize it grows or shrinks, keeping its content
  // anchored to the floor, so the canvas always fills its area.
  let resizeTimer = 0;
  new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      if (stage.clientWidth === 0 || stage.clientHeight === 0) return;
      size = gridFor(stage);
      world.resize(size.w, size.h);
      renderer.resize(size.w, size.h, size.cellPx);
      fitCanvas(canvas, size);
      // History was recorded at the old size; it cannot be replayed at the new one.
      timeline.reset();
      loop.invalidate();
    }, RESIZE_DEBOUNCE_MS);
  }).observe(stage);

  mountCursor(brush, world);
  const hud = mountHud(perf, world);
  const lib = mountLibrary(
    document.getElementById('panel') as HTMLElement,
    brush,
    loop,
    world,
    () => {
      brush.cancel();
      // Clearing is an op too, so rewinding past it brings the scene back.
      timeline.record({ kind: OP_CLEAR, x: 0, y: 0, r: 0, mode: 0, vx: 0, vy: 0 });
      loop.invalidate();
    },
    {
      get: () => renderer.view,
      set: (v) => {
        renderer.view = v;
        loop.invalidate();
      },
    },
    {
      info: () => ({ frame: world.frame, oldest: timeline.oldest(), newest: timeline.newest }),
      seek: (f) => {
        loop.paused = true;
        brush.cancel();
        timeline.seek(f);
        loop.invalidate();
      },
    },
    {
      save: async () => {
        const bytes = await saveWorld(world);
        const a = document.createElement('a');
        const stamp = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, '');
        a.href = URL.createObjectURL(new Blob([bytes as BlobPart], { type: 'application/octet-stream' }));
        a.download = `sandglass-${stamp}.sandglass`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
        lib.notify('Saved.');
      },
      open: async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.sandglass';
        const file = await new Promise<File | null>((resolve) => {
          input.addEventListener('change', () => resolve(input.files?.[0] ?? null), { once: true });
          input.click();
        });
        if (!file) return;
        await openSave(new Uint8Array(await file.arrayBuffer()));
      },
    },
  );

  /** Loads a save, fits it to the canvas area, and starts history afresh from it. */
  const openSave = async (bytes: Uint8Array): Promise<void> => {
    try {
      brush.cancel();
      await loadWorld(world, bytes);
      // A save from a different screen keeps its content, anchored to the floor.
      world.resize(size.w, size.h);
      renderer.resize(size.w, size.h, size.cellPx);
      timeline.reset();
      loop.invalidate();
      lib.notify('Opened.');
    } catch (e) {
      lib.notify(e instanceof Error ? e.message : 'Could not open that file.');
    }
  };

  // Hold R to rewind: back three frames per display frame (about 3× speed), paused.
  let rewinding = false;
  const rewind = (): void => {
    if (!rewinding) return;
    loop.paused = true;
    if (world.frame > timeline.oldest()) {
      timeline.seek(world.frame - 3);
      loop.invalidate();
    }
    requestAnimationFrame(rewind);
  };
  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() !== 'r' || e.repeat || intro.active) return;
    if (e.target instanceof HTMLInputElement && e.target.type !== 'range') return;
    rewinding = true;
    requestAnimationFrame(rewind);
  });
  window.addEventListener('keyup', (e) => {
    if (e.key.toLowerCase() === 'r') rewinding = false;
  });

  window.addEventListener('keydown', (e) => {
    if (e.target instanceof HTMLInputElement && e.target.type !== 'range') return;
    if (e.code === 'Space') {
      e.preventDefault();
      loop.paused = !loop.paused;
    } else if (e.key === '.' && loop.paused) {
      loop.stepOnce();
    } else if (e.code === 'Backquote') {
      // Debug: perf HUD and chunk overlay.
      renderer.showChunks = hud.toggle();
      loop.invalidate();
    }
  });

  if (import.meta.env.DEV) {
    void import('./dev/hook').then((m) =>
      m.installSimHook({ world, loop, brush, renderer, frame, timeline, save: () => saveWorld(world), load: openSave }),
    );
  }

  // Opening sequence; any click or key skips it. Dev-only: ?intro=0 skips it (E2E tests).
  const skipIntro = import.meta.env.DEV && new URLSearchParams(location.search).get('intro') === '0';
  if (!skipIntro) {
    document.body.classList.add('intro');
    const end = (): void => {
      document.body.classList.remove('intro');
      brush.cancel();
      timeline.reset();
      loop.invalidate();
      showFirstHint(stage, brush);
    };
    const skip = (e: Event): void => {
      if (!intro.active) return;
      e.preventDefault();
      intro.skip();
    };
    stage.addEventListener('pointerdown', skip, { capture: true });
    window.addEventListener('keydown', skip, { capture: true });
    void intro.start(end);
  }

  loop.start();
}

void whenSized(document.getElementById('stage') as HTMLElement).then(start);
