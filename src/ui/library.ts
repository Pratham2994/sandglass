import type { FixedLoop } from '../core/loop';
import { MAX_RADIUS, type Brush, type Tool } from '../input/brush';
import { ELEMENTS, EMPTY, PHASE_OF, PH_LIQUID, PH_POWDER, type Category } from '../sim/elements';
import type { World } from '../sim/world';
import { elementFacts } from '../sim/describe';
import { inspectCell } from '../sim/inspect';
import type { View } from '../render/renderer';
import { icon } from './icons';
import { MiniSim } from './preview';
import { LEVEL_STRIDE, L_PLAIN, buildPalette } from '../render/palette';

const STATUS_MS = 250;
const fmt = new Intl.NumberFormat('en-GB');

const CATEGORY_NAMES: Record<Category, string> = {
  powders: 'Powders',
  liquids: 'Liquids',
  gases: 'Gases',
  solids: 'Solids',
  building: 'Building',
  metals: 'Metals',
  fuels: 'Fuels',
  energy: 'Energy',
  explosives: 'Explosives',
  electronics: 'Electronics',
  life: 'Life',
  tools: 'Tools',
};
const CATEGORY_ORDER: Category[] = ['powders', 'liquids', 'gases', 'solids', 'building', 'metals', 'fuels', 'energy', 'explosives', 'electronics', 'life'];

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

/**
 * The library panel beside the canvas: status, transport, search, element
 * tiles by category with live previews, a detail card for the selected
 * element, and brush size.
 */
export interface ViewControl {
  get(): View;
  set(v: View): void;
}

export interface FileActions {
  save(): Promise<void>;
  open(): Promise<void>;
}

export interface TimeControl {
  info(): { frame: number; oldest: number; newest: number };
  seek(frame: number): void;
}

export function mountLibrary(
  host: HTMLElement,
  brush: Brush,
  loop: FixedLoop,
  world: World,
  onClear: () => void,
  views: ViewControl,
  time: TimeControl,
  files: FileActions,
): { notify(message: string): void } {
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
  const listBtn = tool('list', 'Master list: every element and what it does with every other');
  const saveBtn = tool('save', 'Save the world to a file');
  const openBtn = tool('open', 'Open a saved world');
  const clearBtn = tool('clear', 'Clear the world');
  clearBtn.classList.add('danger');
  const clearHint = el('span', 'clear-hint', 'Click again to clear');
  // Run state sits next to the play button: it is what the button changes.
  const pausedTag = el('span', 'paused-tag', 'Paused');
  const gap = el('span', 'tool-gap');
  // The confirm hint sits before the buttons so arming Clear never moves them.
  bar.append(playBtn, stepBtn, pausedTag, gap, clearHint, listBtn, saveBtn, openBtn, eraseBtn, clearBtn);
  // The master list is a page of its own, built from the element data (npm run master-list).
  listBtn.addEventListener('click', () => window.open(`${import.meta.env.BASE_URL}master-list.html`, '_blank', 'noopener'));
  saveBtn.addEventListener('click', () => void files.save());
  openBtn.addEventListener('click', () => void files.open());

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
    // Centred on the button, but kept inside the window.
    const half = tip.offsetWidth / 2;
    tip.style.left = `${Math.min(window.innerWidth - half - 8, Math.max(half + 8, r.left + r.width / 2))}px`;
    tip.style.top = `${r.top - 6}px`;
  };

  // Tiles by category.
  const groups = el('div', 'groups');

  // Tools first: heat, cool and wind change what is there instead of adding to it.
  const toolGroup = el('section', 'group');
  toolGroup.append(el('h3', 'group-name', 'Tools'));
  const toolGrid = el('div', 'tiles');
  const toolButtons: { tool: Tool; b: HTMLButtonElement }[] = [];
  const toolInfo: [Tool, string, string][] = [
    ['heat', 'Heat', 'Warms whatever is under the brush'],
    ['cool', 'Cool', 'Chills whatever is under the brush'],
    ['wind', 'Wind', 'Drag to blow air along the stroke'],
  ];
  for (const [tool, name, hint] of toolInfo) {
    const b = el('button', 'tile tool-tile');
    b.type = 'button';
    b.setAttribute('aria-label', name);
    b.dataset.tip = hint;
    const face = el('span', `tool-face ${tool}`);
    face.append(icon(tool));
    b.append(face, el('span', 'tile-name', name));
    b.addEventListener('pointerdown', (ev) => ev.preventDefault());
    b.addEventListener('click', () => brush.setTool(tool));
    b.addEventListener('pointerenter', () => showTip(b));
    b.addEventListener('pointerleave', () => (tip.hidden = true));
    toolGrid.append(b);
    toolButtons.push({ tool, b });
  }
  toolGroup.append(toolGrid);
  groups.append(toolGroup);
  const tiles: { id: number; button: HTMLButtonElement; group: HTMLElement; sim: MiniSim }[] = [];
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
      // Keys 1 to 9 now pick recent elements, so library tiles show just the name.
      b.dataset.tip = e.name;
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

  // Inspect lens: while the pointer is over the canvas, the card shows the cell under it.
  const lens = el('section', 'lens');
  lens.hidden = true;
  const lensTitle = el('div', 'detail-title');
  const lensName = el('h2', 'detail-name');
  const lensState = el('span', 'detail-tag');
  lensTitle.append(lensName, lensState);
  const lensFacts = el('dl', 'facts');
  const lensReactions = el('ul', 'reactions');
  lens.append(lensTitle, lensFacts, lensReactions);
  const refreshLens = (): void => {
    const cell = brush.held ? null : brush.cellUnderPointer();
    const rep = cell ? inspectCell(world, cell[0], cell[1]) : null;
    lens.hidden = !rep;
    detail.hidden = !!rep;
    if (!rep) return;
    lensName.textContent = rep.name;
    lensState.textContent = rep.state;
    lensFacts.replaceChildren(...rep.facts.flatMap(([k, v]) => [el('dt', '', k), el('dd', 'num', v)]));
    lensReactions.replaceChildren(
      ...(rep.reactions.length
        ? rep.reactions.map((r) => {
            const li = el('li', r.active ? 'on' : '', r.text);
            return li;
          })
        : rep.key === 'empty'
          ? []
          : [el('li', 'none', 'No reaction with what it touches.')]),
    );
  };
  setInterval(refreshLens, 120);
  brush.subscribe(refreshLens);

  // View switch: normal, or heat / pressure / flow over the scene (keys H, P, F).
  const viewBar = el('div', 'views');
  viewBar.setAttribute('role', 'tablist');
  viewBar.setAttribute('aria-label', 'View');
  const viewNames: [View, string, string][] = [
    ['normal', 'Normal', 'The scene as it looks'],
    ['heat', 'Heat', 'Temperature of every cell  H\nBlue is below freezing, grey is room temperature,\norange to white is hot'],
    ['pressure', 'Pressure', 'Air pressure  P\nRed is air pushed together (a blast, a hot fire),\nblue is air pulled thin behind it'],
    ['flow', 'Flow', 'Air movement  F\nColour is the direction the air moves,\nbrightness is how fast'],
  ];
  const viewButtons = viewNames.map(([v, name, hint]) => {
    const b = el('button', 'view', name);
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.dataset.tip = hint;
    b.addEventListener('pointerenter', () => showTip(b));
    b.addEventListener('pointerleave', () => (tip.hidden = true));
    b.addEventListener('pointerdown', (e) => e.preventDefault());
    b.addEventListener('click', () => {
      views.set(v);
      refreshViews();
    });
    viewBar.append(b);
    return { v, b };
  });
  const refreshViews = (): void => {
    for (const { v, b } of viewButtons) {
      b.classList.toggle('on', views.get() === v);
      b.setAttribute('aria-selected', String(views.get() === v));
    }
  };
  refreshViews();
  window.addEventListener('keydown', (e) => {
    if (e.target instanceof HTMLInputElement && e.target.type !== 'range') return;
    const k = e.key.toLowerCase();
    const want: View | null = k === 'h' ? 'heat' : k === 'p' ? 'pressure' : k === 'f' ? 'flow' : null;
    if (!want) return;
    views.set(views.get() === want ? 'normal' : want);
    refreshViews();
  });

  // Time: slow motion and the rewind scrubber (the last 30 s). Dragging back
  // pauses on that moment; drawing there and playing starts a new branch.
  const timeRow = el('div', 'time-row');
  const speedBtn = el('button', 'speed num');
  speedBtn.type = 'button';
  speedBtn.title = 'Simulation speed';
  // Slow motion and fast forward: the sim keeps its fixed step, it just runs more or fewer per second.
  const speeds = [1, 2, 4, 0.25, 0.5];
  const speedLabel = (): string => (loop.speed === 0.5 ? '½×' : loop.speed === 0.25 ? '¼×' : `${loop.speed}×`);
  speedBtn.textContent = speedLabel();
  speedBtn.addEventListener('pointerdown', (e) => e.preventDefault());
  speedBtn.addEventListener('click', () => {
    loop.speed = speeds[(speeds.indexOf(loop.speed) + 1) % speeds.length];
    speedBtn.textContent = speedLabel();
    speedBtn.classList.toggle('slow', loop.speed < 1);
    speedBtn.classList.toggle('fast', loop.speed > 1);
  });
  const scrub = el('input', 'scrub');
  scrub.type = 'range';
  scrub.min = '0';
  scrub.setAttribute('aria-label', 'Rewind');
  const ago = el('span', 'ago num');
  timeRow.append(speedBtn, scrub, ago);
  let scrubbing = false;
  scrub.addEventListener('pointerdown', () => (scrubbing = true));
  scrub.addEventListener('pointerup', () => (scrubbing = false));
  scrub.addEventListener('input', () => {
    time.seek(Number(scrub.value));
    refreshTime();
    refreshStatus();
  });
  const refreshTime = (): void => {
    const t = time.info();
    scrub.min = String(t.oldest);
    scrub.max = String(Math.max(t.oldest + 1, t.newest));
    if (!scrubbing) scrub.value = String(t.frame);
    const back = (t.newest - t.frame) / 60;
    ago.textContent = back < 0.05 ? 'now' : `−${back.toFixed(1)} s`;
    timeRow.classList.toggle('past', back >= 0.05);
  };
  setInterval(refreshTime, 100);

  // Recent: the last nine elements used, on keys 1 to 9.
  const recentRow = el('div', 'recent');
  recentRow.setAttribute('aria-label', 'Recent elements');
  const recent: number[] = [];
  const recentLut = buildPalette();
  // Picking from the hotbar itself must not reorder it, or every key would shift after use.
  let fromHotbar = false;
  const pickRecent = (id: number): void => {
    fromHotbar = true;
    brush.setElement(id);
    fromHotbar = false;
  };
  const drawRecent = (): void => {
    recentRow.replaceChildren(
      ...recent.map((id, k) => {
        const b = el('button', 'chip-el');
        b.type = 'button';
        b.setAttribute('aria-label', `${ELEMENTS[id].name} (${k + 1})`);
        b.dataset.tip = `${ELEMENTS[id].name}  ${k + 1}`;
        b.classList.toggle('on', id === brush.element && !brush.erasing && !brush.tool);
        const sw = el('span', 'chip-swatch');
        const c = recentLut[L_PLAIN * LEVEL_STRIDE + ((id << 8) | 128)];
        sw.style.background = `rgb(${c & 255} ${(c >> 8) & 255} ${(c >> 16) & 255})`;
        b.append(sw, el('span', 'num', String(k + 1)));
        b.addEventListener('pointerdown', (e) => e.preventDefault());
        b.addEventListener('click', () => pickRecent(id));
        b.addEventListener('pointerenter', () => showTip(b));
        b.addEventListener('pointerleave', () => (tip.hidden = true));
        return b;
      }),
    );
    recentRow.hidden = recent.length === 0;
  };
  const noteRecent = (): void => {
    if (brush.tool || brush.erasing) return;
    if (fromHotbar) {
      drawRecent();
      return;
    }
    const id = brush.element;
    if (recent[0] === id) return;
    const at = recent.indexOf(id);
    if (at >= 0) recent.splice(at, 1);
    recent.unshift(id);
    recent.length = Math.min(recent.length, 9);
    drawRecent();
  };
  brush.subscribe(noteRecent);
  noteRecent();

  const top = el('div', 'lib-top');
  top.append(bar, timeRow, viewBar, search, chips, recentRow);
  const foot = el('div', 'lib-foot');
  foot.append(detail, lens, sizeRow, stats);
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
      ...elementFacts(id).flatMap(([k, v]) => {
        const dt = el('dt', '', k);
        const dd = el('dd', 'num', v);
        return [dt, dd];
      }),
    );
  };

  const refresh = (): void => {
    for (const { tool, b } of toolButtons) {
      const on = brush.tool === tool;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', String(on));
    }
    for (const t of tiles) {
      const on = t.id === brush.element && !brush.erasing && !brush.tool;
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
    if (stats.classList.contains('note')) return;
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
      const id = recent[Number(e.key) - 1];
      if (id !== undefined) pickRecent(id);
    } else if (e.code === 'Space') {
      // The main loop toggles pause; mirror it at once.
      queueMicrotask(refreshStatus);
    }
  });

  // Short messages (save errors and the like) take over the stats line for a few seconds.
  let noteTimer = 0;
  const notify = (message: string): void => {
    clearTimeout(noteTimer);
    stats.classList.add('note');
    statsText.textContent = message;
    noteTimer = window.setTimeout(() => {
      stats.classList.remove('note');
      refreshStatus();
    }, 4000);
  };

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
  return { notify };
}
