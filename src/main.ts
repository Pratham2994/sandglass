import '@fontsource-variable/geist';
import './style.css';
import { fitCanvas, gridFor, whenSized, type GridSize } from './core/grid';
import { FixedLoop } from './core/loop';
import { Brush } from './input/brush';
import { Canvas2DRenderer } from './render/canvas2d';
import { ELEMENTS } from './sim/elements';
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
  const canvas = document.getElementById('sim') as HTMLCanvasElement;
  let size: GridSize = gridFor(stage);
  const world = new World(size.w, size.h, DEFAULT_SEED);
  const renderer = new Canvas2DRenderer(canvas, size.w, size.h);
  const brush = new Brush(canvas, world);
  fitCanvas(canvas, size);

  /** One full frame: queued input first, then the cell pass. */
  const frame = (): void => {
    brush.apply();
    step(world);
  };

  const perf = new PerfStats();
  const intro = new Intro(world);
  const loop = new FixedLoop({
    // While the intro plays it drives the world; drawing waits until it ends.
    input: () => (intro.active ? intro.frame() : brush.apply()),
    step: () => {
      const t0 = performance.now();
      step(world);
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
      renderer.resize(size.w, size.h);
      fitCanvas(canvas, size);
      loop.invalidate();
    }, RESIZE_DEBOUNCE_MS);
  }).observe(stage);

  mountCursor(brush);
  const hud = mountHud(perf, world);
  mountLibrary(document.getElementById('panel') as HTMLElement, brush, loop, world, () => {
    brush.cancel();
    world.reset(world.seed);
    loop.invalidate();
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
    void import('./dev/hook').then((m) => m.installSimHook({ world, loop, brush, renderer, frame }));
  }

  // Opening sequence; any click or key skips it. Dev-only: ?intro=0 skips it (E2E tests).
  const skipIntro = import.meta.env.DEV && new URLSearchParams(location.search).get('intro') === '0';
  if (!skipIntro) {
    document.body.classList.add('intro');
    const end = (): void => {
      document.body.classList.remove('intro');
      brush.cancel();
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
