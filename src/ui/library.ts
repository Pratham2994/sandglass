import type { FixedLoop } from '../core/loop';
import { onView, view, zoomStep, zoomTo } from '../render/view';
import { MAX_RADIUS, type Brush, type Tool } from '../input/brush';
import { ELEMENTS, EMPTY, PHASE_OF, PH_LIQUID, PH_POWDER, type Category } from '../sim/elements';
import type { World } from '../sim/world';
import { elementFacts, tipFor } from '../sim/describe';
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
  devices: 'Devices',
  food: 'Food',
  life: 'Life',
  tools: 'Tools',
};
const CATEGORY_ORDER: Category[] = ['powders', 'liquids', 'gases', 'solids', 'building', 'metals', 'fuels', 'energy', 'explosives', 'electronics', 'devices', 'food', 'life'];

/**
 * Elements added in the latest batches: their tiles carry a small dot until
 * hovered or picked once (remembered in this browser).
 */
const RECENT_KEYS = [
  'nuke', 'fallout',
  'switch', 'pressure_plate', 'thermostat', 'resistor', 'diode', 'led', 'capacitor', 'motor', 'electromagnet', 'graphite', 'neon',
  'valve', 'propane_tank', 'air_tank', 'steel_beam', 'rope', 'chain', 'solar_panel', 'glow_paint', 'silver_chloride',
  'plague', 'medicine', 'mould', 'spores', 'mushroom', 'corium', 'control_rod', 'dough', 'bread', 'toast',
  'manganese_dioxide', 'soap', 'foam', 'epoxy_resin', 'epoxy_hardener', 'epoxy', 'copper_sulfate', 'copper_sulfate_crystal', 'cabbage_juice',
  'algae', 'moss', 'ferrofluid', 'hot_ice', 'sodium_acetate', 'fog', 'mints', 'nitrogen_triiodide', 'uv_resin', 'cured_resin',
  'glycerin', 'potassium_permanganate', 'fire_ice', 'sparkler', 'glow_plankton', 'superglue', 'hydrogen_chloride',
  'milk', 'curds', 'lemon_juice', 'red_dye', 'blue_dye', 'steel_wool',
  'sulfuric_acid', 'nitric_acid', 'nitrogen_dioxide',
  'caterpillar', 'cocoon', 'butterfly', 'storm_cloud',
];
const SEEN_KEY = 'sandglass.seen';

/** Restarts a CSS entrance animation on el by toggling its class. */
function replay(el: HTMLElement, cls: string): void {
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
}

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
  // Zoom: out, the level (click to show the whole world), in.
  const zoomBox = el('span', 'zoom');
  const zoomOut = el('button', 'zoom-btn', '−');
  const zoomLevel = el('button', 'zoom-level num', '100%');
  const zoomIn = el('button', 'zoom-btn', '+');
  zoomOut.title = 'Zoom out  −';
  zoomIn.title = 'Zoom in  +\nCtrl and the mouse wheel zoom about the pointer;\ndrag with the middle button to move round';
  zoomLevel.title = 'Show the whole world  0';
  for (const b of [zoomOut, zoomLevel, zoomIn]) {
    b.type = 'button';
    b.addEventListener('pointerdown', (e) => e.preventDefault());
  }
  zoomOut.addEventListener('click', () => zoomStep(-1));
  zoomIn.addEventListener('click', () => zoomStep(1));
  zoomLevel.addEventListener('click', () => zoomTo(1));
  zoomBox.append(zoomOut, zoomLevel, zoomIn);
  const refreshZoom = (): void => {
    zoomLevel.textContent = `${Math.round(view.zoom * 100)}%`;
    zoomOut.disabled = view.zoom <= 1;
  };
  onView(refreshZoom);
  refreshZoom();
  stats.append(mark, zoomBox, statsText);

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
  // The count shows the size of the library at a glance; search also matches descriptions (try "acid").
  input.placeholder = `Search ${ELEMENTS.length - 1} elements`;
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
    // Chips jump to their section (the library is one long list); 'All' goes back to the top.
    b.addEventListener('click', () => {
      if (input.value) {
        input.value = '';
        applyFilter();
      }
      const target = c === 'all' ? null : groups.querySelector<HTMLElement>(`.group[data-cat="${c}"]`);
      if (target) target.scrollIntoView({ block: 'start', behavior: 'smooth' });
      else groups.scrollTo({ top: 0, behavior: 'smooth' });
    });
    chips.append(b);
    return { c, b };
  });
  // More chips than fit: the mouse wheel scrolls the row sideways, and a soft
  // fade at either edge says there is more that way.
  const chipEdges = (): void => {
    chips.classList.toggle('more-left', chips.scrollLeft > 1);
    chips.classList.toggle('more-right', chips.scrollLeft + chips.clientWidth < chips.scrollWidth - 1);
  };
  chips.addEventListener(
    'wheel',
    (e) => {
      if (chips.scrollWidth <= chips.clientWidth || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      e.preventDefault();
      chips.scrollLeft += e.deltaY;
    },
    { passive: false },
  );
  chips.addEventListener('scroll', chipEdges);
  requestAnimationFrame(chipEdges);

  // One themed tooltip for all tiles (name and hotkey), instead of browser tooltips.
  const tip = el('div', 'tip num');
  tip.hidden = true;
  document.body.append(tip);
  const showTip = (b: HTMLElement): void => {
    // Name, and for elements a quiet second line: how to see it act.
    const how = b.dataset.how;
    tip.replaceChildren(document.createTextNode(b.dataset.tip ?? ''));
    if (how) tip.append(el('span', 'tip-how', how));
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
  const toolButtons: { tool: Tool; b: HTMLButtonElement; name: string; hint: string }[] = [];
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
    toolButtons.push({ tool, b, name, hint });
  }
  toolGroup.append(toolGrid);
  groups.append(toolGroup);
  // Recent elements not yet looked at in this browser get a small dot.
  const unseen = new Set<string>(RECENT_KEYS);
  try {
    for (const k of JSON.parse(localStorage.getItem(SEEN_KEY) ?? '[]') as string[]) unseen.delete(k);
  } catch {
    /* storage blocked: show the dots */
  }
  const tiles: { id: number; button: HTMLButtonElement; group: HTMLElement; home: HTMLElement; sim: MiniSim }[] = [];
  for (const cat of CATEGORY_ORDER) {
    const ids = ELEMENTS.map((_, id) => id).filter((id) => id !== EMPTY && ELEMENTS[id].category === cat);
    if (!ids.length) continue;
    const group = el('section', 'group');
    group.dataset.cat = cat;
    const head = el('h3', 'group-name', CATEGORY_NAMES[cat]);
    head.append(el('span', 'group-count num', String(ids.length)));
    group.append(head);
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
      if (unseen.has(e.key)) {
        b.classList.add('is-new');
        const markSeen = (): void => {
          if (!b.classList.contains('is-new')) return;
          b.classList.remove('is-new');
          unseen.delete(e.key);
          try {
            const seen = new Set<string>(JSON.parse(localStorage.getItem(SEEN_KEY) ?? '[]') as string[]);
            seen.add(e.key);
            localStorage.setItem(SEEN_KEY, JSON.stringify([...seen]));
          } catch {
            /* not remembered */
          }
        };
        b.addEventListener('pointerenter', markSeen);
        b.addEventListener('click', markSeen);
      }
      // Keys 1 to 9 now pick recent elements, so library tiles show just the name.
      b.dataset.tip = e.name;
      const how = tipFor(id);
      if (how) b.dataset.how = how;
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
      tiles.push({ id, button: b, group, home: grid, sim });
    }
    group.append(grid);
    groups.append(group);
  }
  const empty = el('p', 'no-match', 'No element matches.');
  empty.hidden = true;
  groups.append(empty);

  // Search results: one list at the top, best match first.
  const resultGroup = el('section', 'group results');
  const resultCount = el('span', 'group-count num');
  const resultHead = el('h3', 'group-name', 'Results');
  resultHead.append(resultCount);
  const resultGrid = el('div', 'tiles');
  resultGroup.append(resultHead, resultGrid);
  resultGroup.hidden = true;
  groups.prepend(resultGroup);

  /** How well a tile matches the query: 0 is best, -1 is no match. */
  const rankText = (rawName: string, kinds: string, about: string, q: string): number => {
    const name = rawName.toLowerCase();
    if (name === q) return 0;
    if (name.startsWith(q)) return 1;
    if (name.split(' ').some((word) => word.startsWith(q))) return 2;
    if (name.includes(q)) return 3;
    if (kinds.includes(q)) return 4;
    if (about.toLowerCase().includes(q)) return 5;
    return -1;
  };
  const rank = (id: number, q: string): number => {
    const e = ELEMENTS[id];
    return rankText(e.name, `${e.category} ${e.phase}`, e.blurb, q);
  };

  const applyFilter = (): void => {
    const q = input.value.trim().toLowerCase();
    // Every tile goes back to its own section first, in library order.
    for (const t of tiles) t.home.append(t.button);
    for (const t of toolButtons) toolGrid.append(t.b);
    for (const g of groups.querySelectorAll<HTMLElement>('.group')) g.hidden = g === resultGroup ? !q : !!q;
    if (!q) {
      empty.hidden = true;
      return;
    }
    // Tools (heat, cool, wind) are searched too, ranked the same way as elements.
    const hits = [
      ...toolButtons.map((t) => ({ b: t.b, name: t.name, r: rankText(t.name, 'tools tool', t.hint, q) })),
      ...tiles.map((t) => ({ b: t.button, name: ELEMENTS[t.id].name, r: rank(t.id, q) })),
    ]
      .filter((h) => h.r >= 0)
      .sort((a, b) => a.r - b.r || a.name.localeCompare(b.name));
    for (const h of hits) resultGrid.append(h.b);
    resultCount.textContent = String(hits.length);
    resultGroup.hidden = hits.length === 0;
    empty.hidden = hits.length > 0;
    groups.scrollTop = 0;
  };

  // The chip of the section in view lights up as the library scrolls, so the chips work as a map.
  const spy = (): void => {
    if (input.value) return;
    const top = groups.getBoundingClientRect().top;
    let current: Category | 'all' = 'all';
    for (const g of groups.querySelectorAll<HTMLElement>('.group[data-cat]')) if (g.getBoundingClientRect().top - top <= 24) current = g.dataset.cat as Category;
    if (current === activeCat) return;
    activeCat = current;
    for (const { c, b } of chipButtons) {
      b.classList.toggle('on', c === activeCat);
      b.setAttribute('aria-selected', String(c === activeCat));
      if (c === activeCat) b.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  };
  groups.addEventListener('scroll', spy, { passive: true });
  chipButtons[0].b.classList.add('on');
  chipButtons[0].b.setAttribute('aria-selected', 'true');
  input.addEventListener('input', applyFilter);
  input.addEventListener('keydown', (e) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      const first = resultGrid.firstElementChild as HTMLElement | null;
      if (first) brush.setElement(Number(first.dataset.id));
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
  // How to see it act: "Try: ...".
  const tryLine = el('p', 'detail-tip');
  const dl = el('dl', 'facts');
  // Two key facts always; the rest behind a toggle, so the card stays small
  // and the library keeps most of the column. The choice is remembered.
  const keyFacts = el('dl', 'facts key-facts');
  const moreBtn = el('button', 'more-facts');
  moreBtn.type = 'button';
  moreBtn.setAttribute('aria-expanded', 'false');
  const moreLabel = el('span', '', 'All properties');
  const moreCount = el('span', 'num muted');
  moreBtn.append(moreLabel, moreCount, icon('chevron'));
  let factsOpen = false;
  try {
    factsOpen = localStorage.getItem('sandglass.factsOpen') === '1';
  } catch {
    /* storage blocked: start closed */
  }
  const setFactsOpen = (open: boolean): void => {
    factsOpen = open;
    detail.classList.toggle('open', open);
    moreBtn.setAttribute('aria-expanded', String(open));
    try {
      localStorage.setItem('sandglass.factsOpen', open ? '1' : '0');
    } catch {
      /* not remembered */
    }
  };
  moreBtn.addEventListener('pointerdown', (e) => e.preventDefault());
  moreBtn.addEventListener('click', () => setFactsOpen(!factsOpen));
  setFactsOpen(factsOpen);
  detail.append(stage, titleRow, blurb, tryLine, keyFacts, moreBtn, dl);
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

  // Inspect lens, beside the element card: the cell under the pointer, and it
  // keeps the last cell looked at, so it is never blank.
  const lens = el('section', 'lens');
  const lensHint = el('p', 'lens-hint', 'Point at the canvas to see what is there, how hot it is, and what it reacts with. Press I to pin it, middle click to pick it.');
  const lensTitle = el('div', 'detail-title');
  const lensName = el('h2', 'detail-name');
  const lensState = el('span', 'detail-tag');
  lensTitle.append(lensName, lensState);
  const lensFacts = el('dl', 'facts');
  const lensReactions = el('ul', 'reactions');
  lens.append(lensHint, lensTitle, lensFacts, lensReactions);
  // Press I to pin the lens to the cell under the pointer: it stops following
  // the mouse (so you can move down and scroll it) but keeps updating live.
  let pinned: [number, number] | null = null;
  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() !== 'i' || e.target instanceof HTMLInputElement || e.repeat) return;
    pinned = pinned ? null : brush.cellUnderPointer();
    lens.classList.toggle('pinned', pinned !== null);
    refreshLens();
  });
  const refreshLens = (): void => {
    const cell = pinned ?? (brush.held ? null : brush.cellUnderPointer());
    const rep = cell ? inspectCell(world, cell[0], cell[1]) : null;
    if (!rep) return;
    lensHint.hidden = true;
    // A new kind of cell under the lens: its lines settle in softly.
    if (lensName.textContent !== rep.name) replay(lens, 'swap');
    lensName.textContent = rep.name;
    lensState.textContent = pinned ? `${rep.state} · pinned (I to release)` : `${rep.state} · I to pin`;
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
    // Only a newly added element pops in, not one already in the row.
    if (at < 0) recentRow.firstElementChild?.classList.add('fresh');
  };
  brush.subscribe(noteRecent);
  noteRecent();

  const top = el('div', 'lib-top');
  // The brush size is a control: it lives up top with the others, in one row.
  top.append(bar, timeRow, sizeRow, viewBar, search, chips, recentRow);
  // The selected element, the inspect lens, the brush and the stats live in a
  // slim bar under the canvas, so the whole right column is for elements.
  const foot = el('div', 'lib-foot info-bar');
  foot.append(detail, lens, stats);
  host.append(top, groups);
  (document.getElementById('infobar') ?? host).append(foot);
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
    const how = tipFor(id);
    tryLine.hidden = how === null;
    tryLine.replaceChildren(el('span', 'detail-tip-label', 'Try'), document.createTextNode(how ?? ''));
    replay(detail, 'enter');
    const facts = elementFacts(id);
    const row = ([k, v]: [string, string]): HTMLElement[] => [el('dt', '', k), el('dd', 'num', v)];
    // The key facts: what changes it (heating, burning) and its state, in that order of interest.
    const KEY = ['Melts', 'Boils', 'Burns', 'Explodes', 'Sublimes', 'Sets', 'Lives', 'Grows', 'State'];
    const key = facts
      .filter(([k]) => KEY.includes(k))
      .sort((a, b) => KEY.indexOf(a[0]) - KEY.indexOf(b[0]))
      .slice(0, 2);
    keyFacts.replaceChildren(...key.flatMap(row));
    const rest = facts.filter((f) => !key.includes(f));
    dl.replaceChildren(...rest.flatMap(row));
    moreCount.textContent = String(rest.length);
    moreBtn.hidden = rest.length === 0;
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

  // Keyboard: / searches, E toggles the eraser, 1 to 9 pick elements, + and - zoom, 0 shows the whole world.
  window.addEventListener('keydown', (e) => {
    if (e.target instanceof HTMLInputElement && e.target.type !== 'range') return;
    if (e.key === '/') {
      e.preventDefault();
      input.focus();
    } else if (e.key === 'e' || e.key === 'E') {
      brush.setErasing(!brush.erasing);
    } else if (e.key === '+' || e.key === '=') {
      zoomStep(1);
    } else if (e.key === '-' || e.key === '_') {
      zoomStep(-1);
    } else if (e.key === '0') {
      zoomTo(1);
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
