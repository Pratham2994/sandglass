/**
 * Small line icons, 20 × 20 viewBox, 1.6 stroke, round caps. Authored here so
 * every icon shares one stroke and weight.
 */
const PATHS = {
  play: '<path d="M7 4.8v10.4L15.2 10z" fill="currentColor" stroke="none"/>',
  pause: '<path d="M7.2 5v10M12.8 5v10"/>',
  step: '<path d="M5.5 5v10" /><path d="M9 4.8v10.4L16.2 10z" fill="currentColor" stroke="none"/>',
  clear: '<path d="M4.5 6h11M8 6V4.5h4V6M6 6l.8 9.5h6.4L14 6"/>',
  eraser: '<path d="M8.5 15.5h7"/><path d="M3.8 11.6 10.9 4.5a1.5 1.5 0 0 1 2.1 0l2.5 2.5a1.5 1.5 0 0 1 0 2.1l-6.4 6.4H6.9l-3.1-3.1a1.2 1.2 0 0 1 0-1.7z"/><path d="m7.4 8 4.6 4.6"/>',
  search: '<circle cx="9" cy="9" r="4.8"/><path d="m12.6 12.6 3.4 3.4"/>',
  heat: '<path d="M10 3.2c.6 2.4 3.8 4 3.8 7.6a3.8 3.8 0 0 1-7.6 0c0-1.7 1-2.8 1.8-3.6.2 1.3.8 2 1.6 2.2-.2-2.3-.6-4.3.4-6.2z"/>',
  cool: '<path d="M10 3v14M4 6.5l12 7M4 13.5l12-7"/><path d="m8.2 4.4 1.8 1.4 1.8-1.4M8.2 15.6l1.8-1.4 1.8 1.4"/>',
  wind: '<path d="M3.5 8h9a2.3 2.3 0 1 0-2.3-2.3"/><path d="M3.5 12h11.5a2.3 2.3 0 1 1-2.3 2.3"/>',
} as const;

export type IconName = keyof typeof PATHS;

export function icon(name: IconName): SVGSVGElement {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 20 20');
  svg.setAttribute('width', '18');
  svg.setAttribute('height', '18');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.6');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = PATHS[name];
  return svg;
}
