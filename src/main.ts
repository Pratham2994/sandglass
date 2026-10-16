import './style.css';
import { fitCanvas, gridFromWindow, whenWindowSized } from './core/grid';
import { FixedLoop } from './core/loop';
import { Canvas2DRenderer } from './render/canvas2d';
import { Rng } from './sim/rng';

function start(): void {
  const canvas = document.getElementById('sim') as HTMLCanvasElement;
  const { w, h } = gridFromWindow();
  const renderer = new Canvas2DRenderer(canvas, w, h);
  fitCanvas(canvas, w, h);
  window.addEventListener('resize', () => fitCanvas(canvas, w, h));

  // Phase 0 test pattern: fresh seeded noise every step.
  const rng = new Rng(1);
  const loop = new FixedLoop({
    input: () => false,
    step: () => {
      const px = renderer.pixels;
      for (let i = 0; i < px.length; i++) {
        const v = 16 + (rng.nextU32() & 63);
        px[i] = 0xff000000 | (v << 16) | (v << 8) | v;
      }
    },
    render: () => renderer.present(),
  });
  loop.start();
}

void whenWindowSized().then(start);
