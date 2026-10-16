import type { World } from '../sim/world';
import { Canvas2DRenderer } from './canvas2d';
import { WebGLRenderer } from './webgl';

/** What the app needs from a renderer: WebGL2 by default, Canvas2D as the fallback. */
export interface Renderer {
  /** Debug: outline chunks, green if they ran last frame. */
  showChunks: boolean;
  draw(world: World): void;
  resize(w: number, h: number, cellPx: number): void;
}

/**
 * Creates the WebGL2 renderer, or the Canvas2D one if WebGL2 or its shaders
 * fail (or `?renderer=2d` is set). A canvas that once gave out a WebGL
 * context cannot give a 2D one, so the fallback gets a fresh canvas.
 */
export function createRenderer(canvas: HTMLCanvasElement, w: number, h: number, cellPx: number): { renderer: Renderer; canvas: HTMLCanvasElement } {
  const want2d = new URLSearchParams(location.search).get('renderer') === '2d';
  if (!want2d) {
    try {
      return { renderer: new WebGLRenderer(canvas, w, h, cellPx), canvas };
    } catch (e) {
      console.warn('WebGL2 renderer unavailable, using Canvas2D:', e);
      const fresh = document.createElement('canvas');
      fresh.id = canvas.id;
      canvas.replaceWith(fresh);
      canvas = fresh;
    }
  }
  return { renderer: new Canvas2DRenderer(canvas, w, h), canvas };
}
