import type { FixedLoop } from '../core/loop';
import type { World } from '../sim/world';

/** How often the pill text refreshes. DOM writes every frame would be wasted. */
const REFRESH_MS = 250;

const fmt = new Intl.NumberFormat('en-GB');

/** Status pill at the top left: run state, sim frames per second, cell count. */
export function mountPill(loop: FixedLoop, world: World): void {
  const pill = document.createElement('div');
  pill.className = 'panel pill';
  pill.setAttribute('aria-live', 'off');

  const dot = document.createElement('span');
  dot.className = 'state-dot';
  const state = document.createElement('span');
  const fps = document.createElement('span');
  fps.className = 'num';
  const cells = document.createElement('span');
  cells.className = 'num muted';

  const sep = (): HTMLSpanElement => {
    const s = document.createElement('span');
    s.className = 'muted';
    s.textContent = '·';
    return s;
  };
  const fpsSep = sep();
  pill.append(dot, state, fpsSep, fps, sep(), cells);
  document.body.append(pill);

  const update = (): void => {
    pill.classList.toggle('paused', loop.paused);
    state.textContent = loop.paused ? 'Paused' : 'Running';
    fps.hidden = fpsSep.hidden = loop.paused;
    fps.textContent = `${loop.stepsPerSecond} FPS`;
    cells.textContent = `${fmt.format(world.countFilled())} cells`;
  };
  update();
  setInterval(update, REFRESH_MS);
}
