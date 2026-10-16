import type { FixedLoop } from '../core/loop';
import { MAX_RADIUS, type Brush } from '../input/brush';
import {
  ELEMENTS,
  ELEMENT_COUNT,
  EMPTY,
  ENTER_P,
  PHASE_OF,
  PH_LIQUID,
  PH_POWDER,
  type Category,
  type ElementDef,
} from '../sim/elements';
import type { World } from '../sim/world';
import { icon } from './icons';
import { MiniSim } from './preview';

const STATUS_MS = 250;
const fmt = new Intl.NumberFormat('en-GB');

const CATEGORY_NAMES: Record<Category, string> = {
  powders: 'Powders',
  liquids: 'Liquids',
  gases: 'Gases',
  solids: 'Solids',
  energy: 'Energy',
  explosives: 'Explosives',
  life: 'Life',
  tools: 'Tools',
};
const CATEGORY_ORDER: Category[] = ['powders', 'liquids', 'gases', 'solids', 'energy', 'explosives', 'life'];

/** Tile still: cells across and down. */
const TILE_CELLS = 14;
/** Detail preview: cells across and down. */
const DETAIL_W = 40;
const DETAIL_H = 40;

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

function names(ids: number[]): string {
  return ids.map((id) => ELEMENTS[id].name).join(', ');
}

/** Facts for the detail card, read from the element data and the swap table. */
function facts(id: number): [string, string][] {
  const e: ElementDef = ELEMENTS[id];
  const ph = PHASE_OF[id];
  const out: [string, string][] = [['Density', `${fmt.format(e.density)} kg/m³`]];
  if (e.fallMax) out.push(['Top speed', `${e.fallMax} cells/s`]);
  if (ph === PH_LIQUID && e.dispersion) out.push(['Flow', `${e.dispersion} cells/frame`]);
  const sinks: number[] = [];
  const floats: number[] = [];
  for (let b = 1; b < ELEMENT_COUNT; b++) {
    if (b === id) continue;
    if (ENTER_P[id * ELEMENT_COUNT + b] > 0 && ENTER_P[id * ELEMENT_COUNT + b] < 255) sinks.push(b);
    if (ph === PH_LIQUID && ENTER_P[b * ELEMENT_COUNT + id] > 0 && PHASE_OF[b] === PH_LIQUID) floats.push(b);
  }
  if (sinks.length) out.push(['Sinks through', names(sinks)]);
  if (floats.length) out.push(['Floats on', names(floats)]);
  return out;
}

/**
 * The library panel beside the canvas: status, transport, search, element
 * tiles by category with live previews, a detail card for the selected
 * element, and brush size.
 */
export function mountLibrary(host: HTMLElement, brush: Brush, loop: FixedLoop, world: World, onClear: () => void): void {
  host.classList.add('library');

  // Stats line at the very bottom: useful, but not a control, so out of the way.
  const stats = el('div', 'stats num');
  const mark = el('span', 'wordmark', 'Sandglass');
  const statsText = el('span');
  stats.append(mark, statsText);

  // Transport and tools.
  const bar = el('div', 'toolbar');
  const tool = (name: Parameters<typeof icon>[0], label: string): HTMLButtonElement => {
    const b = el('button', 'tool');
    b.type = 'button';
    b.title = label;
    b.setAttribute('aria-label', label);
    b.append(icon(name));
    b.addEventListener('pointerdown', (e) => e.preventDefault());
    return b;
  };
  const playBtn = tool('pause', 'Pause (Space)');
  const stepBtn = tool('step', 'Step one frame (.)');
  const eraseBtn = tool('eraser', 'Eraser (E)');
  const clearBtn = tool('clear', 'Clear the world');
  clearBtn.classList.add('danger');
  const clearHint = el('span', 'clear-hint', 'Click again to clear');
  // Run state sits next to the play button: it is what the button changes.
  const pausedTag = el('span', 'paused-tag', 'Paused');
  const gap = el('span', 'tool-gap');
  // The confirm hint sits before the buttons so arming Clear never moves them.
  bar.append(playBtn, stepBtn, pausedTag, gap, clearHint, eraseBtn, clearBtn);

  playBtn.addEventListener('click', () => {
    loop.paused = !loop.paused;
    refreshStatus();
  });
  stepBtn.addEventListener('click', () => {
    loop.paused = true;
    loop.stepOnce();
    refreshStatus();
  });
  eraseBtn.addEventListener('click', () => brush.setErasing(!brush.erasing));
  let armed = 0;
  clearBtn.addEventListener('click', () => {
    if (armed) {
      clearTimeout(armed);
      armed = 0;
      bar.classList.remove('armed');
      onClear();
      return;
    }
    bar.classList.add('armed');
    armed = window.setTimeout(() => {
      armed = 0;
      bar.classList.remove('armed');
    }, 2500);
  });

  // Search.
  const search = el('label', 'search');
  const input = el('input');
  input.type = 'search';
  input.placeholder = 'Search elements';
  input.setAttribute('aria-label', 'Search elements');
  const kbd = el('kbd', '', '/');
  search.append(icon('search'), input, kbd);

  // Category filter chips (only categories that have elements).
  const chips = el('div', 'chips');
  chips.setAttribute('role', 'tablist');
  let activeCat: Category | 'all' = 'all';
  const present = CATEGORY_ORDER.filter((c) => ELEMENTS.some((e, id) => id !== EMPTY && e.category === c));
  const chipButtons = (['all', ...present] as (Category | 'all')[]).map((c) => {
    const b = el('button', 'chip', c === 'all' ? 'All' : CATEGORY_NAMES[c]);
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.addEventListener('pointerdown', (e) => e.preventDefault());
    b.addEventListener('click', () => {
      activeCat = c;
      applyFilter();
    });
    chips.append(b);
    return { c, b };
  });

  // One themed tooltip for all tiles (name and hotkey), instead of browser tooltips.
  const tip = el('div', 'tip num');
  tip.hidden = true;
  document.body.append(tip);
  const showTip = (b: HTMLElement): void => {
    tip.textContent = b.dataset.tip ?? '';
    tip.hidden = false;
    const r = b.getBoundingClientRect();
    tip.style.left = `${r.left + r.width / 2}px`;
    tip.style.top = `${r.top - 6}px`;
  };

  // Tiles by category.
  const groups = el('div', 'groups');
  const tiles: { id: number; button: HTMLButtonElement; group: HTMLElement; sim: MiniSim }[] = [];
  let hotkey = 1;
  for (const cat of CATEGORY_ORDER) {
    const ids = ELEMENTS.map((_, id) => id).filter((id) => id !== EMPTY && ELEMENTS[id].category === cat);
    if (!ids.length) continue;
    const group = el('section', 'group');
    group.dataset.cat = cat;
    group.append(el('h3', 'group-name', CATEGORY_NAMES[cat]));
    const grid = el('div', 'tiles');
    for (const id of ids) {
      const e = ELEMENTS[id];
      const sim = new MiniSim(id, TILE_CELLS, TILE_CELLS, 11 + id);
      sim.still();
      const b = el('button', 'tile');
      b.type = 'button';
      b.dataset.id = String(id);
      b.setAttribute('aria-pressed', 'false');
      b.setAttribute('aria-label', e.name);
      const label = el('span', 'tile-name', e.name);
      b.append(sim.canvas, label);
      b.dataset.tip = hotkey <= 9 ? `${e.name}  ${hotkey}` : e.name;
      b.addEventListener('pointerdown', (ev) => ev.preventDefault());
      b.addEventListener('click', () => brush.setElement(id));
      b.addEventListener('pointerenter', () => {
        hovered = tiles.find((t) => t.id === id) ?? null;
        hovered?.sim.reset();
        showTip(b);
      });
      b.addEventListener('pointerleave', () => {
        if (hovered?.id === id) {
          hovered.sim.still();
          hovered = null;
        }
        tip.hidden = true;
      });
      grid.append(b);
      tiles.push({ id, button: b, group, sim });
      hotkey++;
    }
    group.append(grid);
    groups.append(group);
  }
  const empty = el('p', 'no-match', 'No element matches.');
  empty.hidden = true;
  groups.append(empty);

  const applyFilter = (): void => {
    const q = input.value.trim().toLowerCase();
    let shown = 0;
    for (const t of tiles) {
      const e = ELEMENTS[t.id];
      const hit =
        (activeCat === 'all' || e.category === activeCat) &&
        (!q || `${e.name} ${e.category} ${e.phase} ${e.blurb}`.toLowerCase().includes(q));
      t.button.hidden = !hit;
      if (hit) shown++;
    }
    for (const g of groups.querySelectorAll<HTMLElement>('.group'))
      g.hidden = ![...g.querySelectorAll<HTMLElement>('.tile')].some((b) => !b.hidden);
    empty.hidden = shown > 0;
    for (const { c, b } of chipButtons) {
      b.classList.toggle('on', c === activeCat);
      b.setAttribute('aria-selected', String(c === activeCat));
    }
  };
  input.addEventListener('input', applyFilter);
  input.addEventListener('keydown', (e) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      const first = tiles.find((t) => !t.button.hidden);
      if (first) brush.setElement(first.id);
      input.blur();
    } else if (e.key === 'Escape') {
      input.value = '';
      applyFilter();
      input.blur();
    }
  });

  // Detail card for the selected element.
  const detail = el('section', 'detail');
  const stage = el('div', 'detail-stage');
  const titleRow = el('div', 'detail-title');
  const title = el('h2', 'detail-name');
  const tag = el('span', 'detail-tag');
  titleRow.append(title, tag);
  const blurb = el('p', 'detail-blurb');
  const dl = el('dl', 'facts');
  detail.append(stage, titleRow, blurb, dl);
  let detailSim: MiniSim | null = null;
  let detailId = -1;
  let hovered: (typeof tiles)[number] | null = null;

  // Brush size.
  const sizeRow = el('div', 'brush-size');
  const sizeLabel = el('span', 'muted', 'Brush');
  const range = el('input');
  range.type = 'range';
  range.min = '0';
  range.max = String(MAX_RADIUS);
  range.setAttribute('aria-label', 'Brush size');
  const sizeValue = el('span', 'num size-value');
  sizeRow.append(sizeLabel, range, sizeValue);
  range.addEventListener('input', () => brush.setRadius(Number(range.value)));

  const top = el('div', 'lib-top');
  top.append(bar, search, chips);
  const foot = el('div', 'lib-foot');
  foot.append(detail, sizeRow, stats);
  host.append(top, groups, foot);
  applyFilter();

  const showDetail = (id: number): void => {
    if (id === detailId) return;
    detailId = id;
    detailSim = new MiniSim(id, DETAIL_W, DETAIL_H, 101 + id);
    detailSim.settle(PHASE_OF[id] === PH_POWDER || PHASE_OF[id] === PH_LIQUID ? 60 : 0, 0);
    stage.replaceChildren(detailSim.canvas);
    const e = ELEMENTS[id];
    title.textContent = e.name;
    tag.textContent = CATEGORY_NAMES[e.category];
    blurb.textContent = e.blurb;
    dl.replaceChildren(
      ...facts(id).flatMap(([k, v]) => {
        const dt = el('dt', '', k);
        const dd = el('dd', 'num', v);
        return [dt, dd];
      }),
    );
  };

  const refresh = (): void => {
    for (const t of tiles) {
      const on = t.id === brush.element && !brush.erasing;
      t.button.classList.toggle('on', on);
      t.button.setAttribute('aria-pressed', String(on));
    }
    eraseBtn.classList.toggle('on', brush.erasing);
    eraseBtn.setAttribute('aria-pressed', String(brush.erasing));
    range.value = String(brush.radius);
    sizeValue.textContent = String(brush.radius * 2 + 1);
    showDetail(brush.element);
  };
  brush.subscribe(refresh);
  refresh();

  const refreshStatus = (): void => {
    host.classList.toggle('paused', loop.paused);
    const fps = loop.paused ? 'paused' : `${loop.stepsPerSecond} FPS`;
    statsText.textContent = `${fps} · ${fmt.format(world.countFilled())} cells · ${world.w} × ${world.h}`;
    playBtn.replaceChildren(icon(loop.paused ? 'play' : 'pause'));
    playBtn.title = loop.paused ? 'Play (Space)' : 'Pause (Space)';
    playBtn.setAttribute('aria-label', loop.paused ? 'Play' : 'Pause');
  };
  refreshStatus();
  setInterval(refreshStatus, STATUS_MS);

  // Keyboard: / searches, E toggles the eraser, 1 to 9 pick elements.
  window.addEventListener('keydown', (e) => {
    if (e.target instanceof HTMLInputElement && e.target.type !== 'range') return;
    if (e.key === '/') {
      e.preventDefault();
      input.focus();
    } else if (e.key === 'e' || e.key === 'E') {
      brush.setErasing(!brush.erasing);
    } else if (e.key >= '1' && e.key <= '9') {
      const t = tiles[Number(e.key) - 1];
      if (t) brush.setElement(t.id);
    } else if (e.code === 'Space') {
      // The main loop toggles pause; mirror it at once.
      queueMicrotask(refreshStatus);
    }
  });

  // Previews: the detail card always plays; a hovered tile plays its demo.
  let last = 0;
  const animate = (now: number): void => {
    requestAnimationFrame(animate);
    if (now - last < 1000 / 60 - 1) return;
    last = now;
    if (document.hidden || host.offsetParent === null) return;
    detailSim?.tick();
    hovered?.sim.tick();
  };
  requestAnimationFrame(animate);
}
