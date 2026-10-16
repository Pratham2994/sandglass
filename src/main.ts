import './style.css';
import { fitCanvas, gridFromWindow, whenWindowSized } from './core/grid';
import { FixedLoop } from './core/loop';
import { Brush } from './input/brush';
import { Canvas2DRenderer } from './render/canvas2d';
import { step } from './sim/step';
import { World } from './sim/world';
import { mountCursor } from './ui/cursor';

const DEFAULT_SEED = 1;

function start(): void {
  const canvas = document.getElementById('sim') as HTMLCanvasElement;
  const { w, h } = gridFromWindow();
  const world = new World(w, h, DEFAULT_SEED);
  const renderer = new Canvas2DRenderer(canvas, w, h);
  const brush = new Brush(canvas, world);
  fitCanvas(canvas, w, h);
  window.addEventListener('resize', () => fitCanvas(canvas, w, h));

  const loop = new FixedLoop({
    input: () => brush.apply(),
    step: () => step(world),
    render: () => renderer.draw(world),
  });

  mountCursor(brush);

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      loop.paused = !loop.paused;
    } else if (e.key === '.' && loop.paused) {
      loop.stepOnce();
    }
  });

  loop.start();
}

void whenWindowSized().then(start);
