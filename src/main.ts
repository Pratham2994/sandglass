import './style.css';
import { fitCanvas, gridFromWindow, whenWindowSized } from './core/grid';
import { FixedLoop } from './core/loop';
import { Brush } from './input/brush';
import { Canvas2DRenderer } from './render/canvas2d';
import { step } from './sim/step';
import { World } from './sim/world';
import { mountCursor } from './ui/cursor';
import { mountDock } from './ui/dock';
import { PerfStats, mountHud } from './ui/hud';
import { mountPill } from './ui/pill';

const DEFAULT_SEED = 1;

function start(): void {
  const canvas = document.getElementById('sim') as HTMLCanvasElement;
  const { w, h } = gridFromWindow();
  const world = new World(w, h, DEFAULT_SEED);
  const renderer = new Canvas2DRenderer(canvas, w, h);
  const brush = new Brush(canvas, world);
  fitCanvas(canvas, w, h);
  window.addEventListener('resize', () => fitCanvas(canvas, w, h));

  /** One full frame: queued input first, then the cell pass. */
  const frame = (): void => {
    brush.apply();
    step(world);
  };

  const perf = new PerfStats();
  const loop = new FixedLoop({
    input: () => brush.apply(),
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

  mountCursor(brush);
  mountDock(brush);
  mountPill(loop, world);
  const hud = mountHud(perf, world);

  window.addEventListener('keydown', (e) => {
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

  loop.start();
}

void whenWindowSized().then(start);
