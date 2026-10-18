import { ELEMENTS, ELEMENT_COUNT, LIT_RGB_OF } from '../sim/elements';
import { litLevels } from '../sim/circuit';
import { FX_RGB, fxLevels } from '../sim/fx';
import { CHUNK, type World } from '../sim/world';
import { GLOW_MAX, GLOW_MIN, LEVEL_STRIDE, L_PLAIN, TEXTURE_OF, buildGlow, buildPalette, buildStoneShade } from './palette';
import type { Renderer, View } from './renderer';
import { AIR } from '../sim/air';
import { view } from './view';

const VERT = `#version 300 es
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

/**
 * Scene pass, one fragment per cell. Same rules as the Canvas2D renderer:
 * light from above, bevelled stone, liquids darkening with depth, see-through
 * gas, contact shadows, black-body glow. Writes colour and emission.
 * Data textures are in world order (row 0 at the top); fragments count from
 * the bottom, so the cell row is flipped.
 */
const SCENE = `#version 300 es
precision highp float;
precision highp int;
precision highp usampler2D;
uniform usampler2D uType;
uniform usampler2D uShade;
uniform usampler2D uStamp;
uniform usampler2D uStone;
uniform usampler2D uTex;
uniform usampler2D uSolute;
uniform usampler2D uConc;
uniform usampler2D uCharge;
uniform usampler2D uLit;
uniform sampler2D uLitCol;
/** Reaction flashes: brightness and kind per cell, and a colour per kind. */
uniform usampler2D uFx;
uniform usampler2D uFxKind;
uniform sampler2D uFxCol;
uniform sampler2D uTemp;
uniform sampler2D uPal;
uniform sampler2D uGlow;
uniform ivec2 uSize;
uniform int uMoved;
uniform int uFrame;
uniform vec3 uBg;
layout(location = 0) out vec4 oColor;
layout(location = 1) out vec4 oEmit;

const uint OUT = 65535u;
const float LIGHT[7] = float[7](0.7, 0.85, 0.9, 1.0, 1.08, 1.17, 1.38);
const int L_UNDER = 0, L_SHADE = 1, L_DEEP = 2, L_PLAIN = 3, L_SIDE = 4, L_TOP = 5, L_GLINT = 6;
const uint TEX_STONE = 1u, TEX_LIQUID = 2u, TEX_GAS = 3u, TEX_FIRE = 4u, TEX_GLASS = 5u;

uint typeAt(ivec2 p) {
  if (p.x < 0 || p.y < 0 || p.x >= uSize.x || p.y >= uSize.y) return OUT;
  return texelFetch(uType, p, 0).r;
}
uint texOf(uint t) { return texelFetch(uTex, ivec2(int(t), 0), 0).r; }
bool solidish(uint t) { return t != 0u && t != OUT && texOf(t) != TEX_GAS; }
vec3 pal(uint t, uint s) { return texelFetch(uPal, ivec2(int(s), int(t)), 0).rgb; }
float hash(ivec2 p) {
  uint n = uint(p.x) * 374761393u + uint(p.y) * 668265263u;
  n = (n ^ (n >> 13)) * 1274126177u;
  return float(n ^ (n >> 16)) / 4294967296.0;
}
vec3 background(ivec2 p) {
  vec2 c = vec2(uSize - 1) * 0.5;
  vec2 d = (vec2(p) - c) / c;
  float k = 1.12 - 0.3 * min(1.0, dot(d, d) * 0.5);
  return uBg * k + (hash(p) - 0.5) / 255.0;
}
/** Row where the run of filled, non-gas cells containing p starts (its surface); the cap bounds the walk. */
int runTop(ivec2 p, int cap) {
  int y = p.y;
  for (int k = 0; k < cap; k++) {
    if (y <= 0 || !solidish(typeAt(ivec2(p.x, y - 1)))) break;
    y--;
  }
  return y;
}

void body() {
  ivec2 p = ivec2(int(gl_FragCoord.x), uSize.y - 1 - int(gl_FragCoord.y));
  uint t = typeAt(p);
  vec3 bg = background(p);
  oEmit = vec4(0.0);
  uint up = typeAt(p + ivec2(0, -1));
  bool upEmpty = p.y == 0 || up == 0u;
  if (t == 0u) {
    vec3 c = bg;
    if (!upEmpty) c *= 0.75;
    else if ((typeAt(p + ivec2(-1, 0)) != 0u && typeAt(p + ivec2(-1, 0)) != OUT) || (typeAt(p + ivec2(1, 0)) != 0u && typeAt(p + ivec2(1, 0)) != OUT)) c *= 0.875;
    oColor = vec4(c, 1.0);
    return;
  }
  uint tex = texOf(t);
  uint shade = texelFetch(uShade, p, 0).r;
  if (tex == TEX_GAS) {
    vec3 gc = mix(pal(t, shade), bg, 0.5);
    // A gas in a live circuit (neon) glows its own colour.
    uint glv = texelFetch(uLit, p, 0).r;
    if (glv > 0u) {
      float k = float(glv) / 255.0;
      vec3 lc = texelFetch(uLitCol, ivec2(int(t), 0), 0).rgb;
      gc = mix(gc, lc, 0.35 + 0.6 * k);
      oEmit = vec4(lc * (0.3 + 0.9 * k), 1.0);
    }
    oColor = vec4(gc, 1.0);
    return;
  }
  if (tex == TEX_GLASS) {
    // See-through: mostly what is behind it, with a bright top edge and a faint sheen.
    vec3 g = pal(t, texelFetch(uStone, p, 0).r);
    vec3 c = mix(bg, g, 0.42) + (upEmpty ? vec3(0.18) : vec3(0.0));
    oColor = vec4(min(c, vec3(1.0)), 1.0);
    return;
  }
  if (tex == TEX_FIRE) {
    // Flicker: the colour index moves every frame; fire is a light source.
    uint f = (shade + uint(uFrame) * 53u + uint(p.x) * 7u + uint(p.y) * 3u) & 255u;
    vec3 c = pal(t, f);
    oColor = vec4(c, 1.0);
    oEmit = vec4(c * 0.9, 1.0);
    return;
  }
  int level = L_PLAIN;
  uint s;
  if (tex == TEX_LIQUID) {
    int top = runTop(p, 64);
    // Depth below the surface averaged over 5 columns, so a surface flat within 1 cell shows no stripes.
    float sum = 0.0;
    float n = 0.0;
    for (int k = -2; k <= 2; k++) {
      ivec2 q = ivec2(p.x + k, p.y);
      if (!solidish(typeAt(q))) continue;
      int tk = runTop(q, 64);
      if (tk < top - 2 || tk > top + 2) continue;
      sum += float(tk);
      n += 1.0;
    }
    float surface = n > 0.0 ? sum / n : float(top);
    s = uint(clamp(floor((float(p.y) - surface) * 8.0 + 0.5) + float(shade & 3u), 0.0, 255.0));
    if (upEmpty) {
      bool lone = typeAt(p + ivec2(-1, 0)) == 0u && typeAt(p + ivec2(1, 0)) == 0u && typeAt(p + ivec2(0, 1)) == t;
      if (lone) {
        oColor = vec4(mix(pal(t, s) * LIGHT[L_TOP], bg, 0.75), 1.0);
        return;
      }
      level = ((p.x * 13 + (uFrame >> 2) + int(shade >> 4)) & 63) == 0 ? L_GLINT : L_TOP;
    } else if (int(texelFetch(uStamp, p, 0).r) == uMoved) {
      level = L_SIDE;
    }
  } else if (tex == TEX_STONE) {
    s = texelFetch(uStone, p, 0).r;
    if (typeAt(p + ivec2(0, 1)) == 0u) level = L_UNDER;
    else if (upEmpty) level = L_TOP;
    else if (typeAt(p + ivec2(-1, 0)) == 0u) level = L_SIDE;
    else if (typeAt(p + ivec2(1, 0)) == 0u) level = L_SHADE;
  } else {
    s = shade;
    if (int(texelFetch(uStamp, p, 0).r) == uMoved && (shade & 15u) == 0u) level = L_GLINT;
    else if (upEmpty) level = L_TOP;
    else if (p.y - runTop(p, 6) + 1 > 6) level = L_DEEP;
  }
  vec3 c = min(pal(t, s) * LIGHT[level], vec3(1.0));
  // Solutions: a liquid takes a tint of what it carries; a soaked powder darkens.
  uint cn = texelFetch(uConc, p, 0).r;
  if (cn > 0u) {
    float f = float(cn) / 255.0;
    if (tex == TEX_LIQUID) c = mix(c, pal(texelFetch(uSolute, p, 0).r, 128u), f * 0.45);
    else c *= 1.0 - min(0.6, f * 1.6);
  }
  // Electric charge: the cell flashes blue-white and lights its surroundings.
  uint ch = texelFetch(uCharge, p, 0).r;
  if (ch > 0u) {
    float k = float(ch) / 5.0;
    c = mix(c, vec3(0.78, 0.88, 1.0), 0.5 + 0.4 * k);
    oEmit = vec4(vec3(0.45, 0.6, 1.0) * k, 1.0);
  }
  // Lights in a live circuit (LED, neon): their own colour, lighting their surroundings.
  uint lv = texelFetch(uLit, p, 0).r;
  vec3 lc = texelFetch(uLitCol, ivec2(int(t), 0), 0).rgb;
  if (lv > 0u && lc != vec3(0.0)) {
    float k = float(lv) / 255.0;
    c = mix(c, lc, 0.35 + 0.6 * k);
    oEmit = vec4(lc * (0.3 + 0.9 * k), 1.0);
  }
  // Black-body glow from the real temperature; the shade adds a little texture.
  float T = texelFetch(uTemp, p, 0).r + (float(shade) - 128.0) * 0.5;
  if (T > ${GLOW_MIN.toFixed(1)}) {
    vec4 g = texture(uGlow, vec2(clamp((T - ${GLOW_MIN.toFixed(1)}) / ${(GLOW_MAX - GLOW_MIN).toFixed(1)}, 0.0, 1.0) * (255.0 / 256.0) + 0.5 / 256.0, 0.5));
    c = mix(c, g.rgb, g.a);
    oEmit = vec4(g.rgb * g.a, 1.0);
  }
  oColor = vec4(c, 1.0);
}
void main() {
  body();
  // A reaction here: the cell flashes its reaction's colour and lights what is round it, fading fast.
  ivec2 p = ivec2(int(gl_FragCoord.x), uSize.y - 1 - int(gl_FragCoord.y));
  uint fl = texelFetch(uFx, p, 0).r;
  if (fl > 0u) {
    float k = float(fl) / 255.0;
    vec3 fc = texelFetch(uFxCol, ivec2(int(texelFetch(uFxKind, p, 0).r), 0), 0).rgb;
    oColor = vec4(mix(oColor.rgb, fc, 0.65 * k), 1.0);
    oEmit = vec4(max(oEmit.rgb, fc * (0.9 * k)), 1.0);
  }
}`;

/** Downsample by 4: average of a 4 × 4 block via four bilinear taps. */
const DOWN = `#version 300 es
precision highp float;
uniform sampler2D uSrc;
uniform vec2 uSrcSize;
out vec4 o;
void main() {
  vec2 base = (floor(gl_FragCoord.xy) * 4.0 + 1.0) / uSrcSize;
  vec2 t = 2.0 / uSrcSize;
  o = 0.25 * (texture(uSrc, base) + texture(uSrc, base + vec2(t.x, 0.0)) + texture(uSrc, base + vec2(0.0, t.y)) + texture(uSrc, base + t));
}`;

/** Separable Gaussian blur, 9 taps. */
const BLUR = `#version 300 es
precision highp float;
uniform sampler2D uSrc;
uniform vec2 uStep;
out vec4 o;
const float W[5] = float[5](0.227, 0.194, 0.122, 0.054, 0.016);
void main() {
  vec2 uv = gl_FragCoord.xy / vec2(textureSize(uSrc, 0));
  vec4 c = texture(uSrc, uv) * W[0];
  for (int i = 1; i < 5; i++) {
    c += texture(uSrc, uv + uStep * float(i)) * W[i];
    c += texture(uSrc, uv - uStep * float(i)) * W[i];
  }
  o = c;
}`;

/**
 * Composite at screen resolution: cells stay crisp (nearest), light is
 * smooth (linear). Lit surfaces brighten and take the light's colour; a
 * soft bloom sits on top; hot air bends what is behind it (heat haze).
 */
const COMPOSITE = `#version 300 es
precision highp float;
precision highp int;
precision highp usampler2D;
uniform sampler2D uScene;
uniform sampler2D uLight;
uniform sampler2D uTemp;
uniform usampler2D uType;
uniform usampler2D uAwake;
uniform sampler2D uPress;
uniform sampler2D uVel;
uniform ivec2 uSize;
uniform vec2 uCanvas;
uniform float uTime;
uniform int uChunks;
uniform int uView;
uniform float uFlash;
/** Zoom, then the world point (0 to 1) at the middle of the canvas. */
uniform vec3 uZoom;
out vec4 o;

/** Temperature to colour: blue cold, grey room, orange warm, red hot, yellow-white very hot. */
vec3 heatColour(float T) {
  if (T < 0.0) return mix(vec3(0.55, 0.8, 1.0), vec3(0.1, 0.25, 0.9), clamp(-T / 60.0, 0.0, 1.0));
  if (T < 20.0) return mix(vec3(0.55, 0.8, 1.0), vec3(0.17), T / 20.0);
  if (T < 100.0) return mix(vec3(0.17), vec3(0.95, 0.55, 0.15), (T - 20.0) / 80.0);
  if (T < 500.0) return mix(vec3(0.95, 0.55, 0.15), vec3(0.85, 0.12, 0.08), (T - 100.0) / 400.0);
  return mix(vec3(0.85, 0.12, 0.08), vec3(1.0, 0.95, 0.7), clamp((T - 500.0) / 700.0, 0.0, 1.0));
}
vec3 hsv(float h, float s, float v) {
  vec3 k = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  return v * mix(vec3(1.0), k, s);
}
void main() {
  vec2 uv = gl_FragCoord.xy / uCanvas;
  // Zoom: the canvas shows the part of the world round the view centre.
  uv = vec2(uZoom.y + (uv.x - 0.5) / uZoom.x, 1.0 - uZoom.z + (uv.y - 0.5) / uZoom.x);
  vec2 lightUv = uv;
  vec2 cellF = vec2(uv.x, 1.0 - uv.y) * vec2(uSize);
  ivec2 cell = clamp(ivec2(cellF), ivec2(0), uSize - 1);
  // Heat haze: hot air wobbles the view sideways, more the hotter it is.
  float air = texelFetch(uTemp, cell, 0).r;
  if (texelFetch(uType, cell, 0).r == 0u && air > 45.0) {
    float a = clamp((air - 45.0) / 250.0, 0.0, 1.0) * 0.9;
    uv.x += sin(cellF.y * 0.55 + uTime * 7.0) * a / float(uSize.x);
    uv.y += cos(cellF.x * 0.35 + uTime * 5.0) * a * 0.4 / float(uSize.y);
  }
  vec3 scene = texture(uScene, uv).rgb;
  vec3 L = texture(uLight, lightUv).rgb;
  // Light falls off with distance (the blur); close surfaces take its colour strongly.
  vec3 c = scene * (1.0 + L * 1.8) + L * 0.12;
  if (uView == 1) {
    c = mix(c * 0.3, heatColour(texelFetch(uTemp, cell, 0).r), 0.78);
  } else if (uView == 2) {
    float pv = texelFetch(uPress, cell / ${AIR}, 0).r;
    c = c * 0.35 + vec3(max(pv, 0.0), max(pv, 0.0) * 0.25, max(-pv, 0.0)) * 0.22;
  } else if (uView == 3) {
    vec2 v = texelFetch(uVel, cell / ${AIR}, 0).rg;
    float sp = length(v);
    c = c * 0.35 + hsv(atan(v.y, v.x) / 6.2832 + 0.5, 0.75, min(1.0, sp * 0.9));
  }
  // A nuke's flash washes the whole view white, then fades.
  c = mix(c, vec3(1.0, 0.97, 0.9), uFlash * 0.9);
  if (uChunks == 1) {
    ivec2 local = ivec2(cellF) % ${CHUNK};
    if (local.x == 0 || local.y == 0) {
      bool on = texelFetch(uAwake, ivec2(cellF) / ${CHUNK}, 0).r != 0u;
      c = mix(c, on ? vec3(0.35, 0.82, 0.48) : vec3(0.23), 0.5);
    }
  }
  o = vec4(min(c, vec3(1.0)), 1.0);
}`;

interface Target {
  tex: WebGLTexture;
  fb: WebGLFramebuffer;
  w: number;
  h: number;
}

/**
 * WebGL2 renderer. The simulation stays on the CPU; each frame its arrays
 * are uploaded as textures and drawn by shaders: scene, light (emission
 * blurred at quarter resolution), and a composite with lighting, bloom and
 * heat haze. Throws if WebGL2 or a shader is unavailable, so the caller can
 * fall back to Canvas2D.
 */
export class WebGLRenderer implements Renderer {
  showChunks = false;
  view: View = 'normal';
  private readonly gl: WebGL2RenderingContext;
  private readonly pressTex: WebGLTexture;
  private readonly velTex: WebGLTexture;
  private readonly canvas: HTMLCanvasElement;
  private readonly scene: WebGLProgram;
  private readonly down: WebGLProgram;
  private readonly blur: WebGLProgram;
  private readonly comp: WebGLProgram;
  private readonly vao: WebGLVertexArrayObject;
  private readonly floatTargets: boolean;
  private readonly dataTex: Record<'type' | 'shade' | 'stamp' | 'stone' | 'temp' | 'awake' | 'solute' | 'conc' | 'charge' | 'lit' | 'fx' | 'fxKind', WebGLTexture>;
  private readonly litColTex: WebGLTexture;
  private readonly fxColTex: WebGLTexture;
  /** Uniform locations by program and name; a miss still asks the driver, so the cache never hides a location. */
  private readonly locs = new Map<WebGLProgram, Map<string, WebGLUniformLocation | null>>();
  /** Grid of zeros, standing in for absent level textures so a dropped array reads as nothing. */
  private zeroTex!: WebGLTexture;
  private readonly palTex: WebGLTexture;
  private readonly glowTex: WebGLTexture;
  private readonly texTex: WebGLTexture;
  private sceneFb!: WebGLFramebuffer;
  private sceneTex!: WebGLTexture;
  private emitTex!: WebGLTexture;
  private quarter!: Target;
  private quarter2!: Target;
  private w = 0;
  private h = 0;
  private cellPx = 1;
  private readonly t0 = performance.now();
  private velScratch = new Float32Array(0);
  private readonly bg: [number, number, number];

  constructor(canvas: HTMLCanvasElement, w: number, h: number, cellPx: number) {
    const gl = canvas.getContext('webgl2', { alpha: false, antialias: false, premultipliedAlpha: false });
    if (!gl) throw new Error('WebGL2 is not available');
    this.gl = gl;
    this.canvas = canvas;
    this.floatTargets = gl.getExtension('EXT_color_buffer_float') !== null;
    this.scene = this.program(SCENE, [['uType', 0], ['uShade', 1], ['uStamp', 2], ['uStone', 3], ['uTex', 4], ['uTemp', 5], ['uPal', 6], ['uGlow', 7], ['uSolute', 8], ['uConc', 9], ['uCharge', 10], ['uLit', 11], ['uLitCol', 12], ['uFx', 13], ['uFxKind', 14], ['uFxCol', 15]]);
    this.down = this.program(DOWN, [['uSrc', 0]]);
    this.blur = this.program(BLUR, [['uSrc', 0]]);
    this.comp = this.program(COMPOSITE, [['uScene', 0], ['uLight', 1], ['uTemp', 2], ['uType', 3], ['uAwake', 4], ['uPress', 5], ['uVel', 6]]);
    this.vao = gl.createVertexArray()!;
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

    this.dataTex = {
      type: this.texture(),
      shade: this.texture(),
      stamp: this.texture(),
      stone: this.texture(),
      temp: this.texture(),
      awake: this.texture(),
      solute: this.texture(),
      conc: this.texture(),
      charge: this.texture(),
      lit: this.texture(),
      fx: this.texture(),
      fxKind: this.texture(),
    };

    // Palette: one row per element, 256 shades, plain light level.
    const lut = buildPalette();
    const plain = new Uint8Array(lut.buffer.slice(L_PLAIN * LEVEL_STRIDE * 4, (L_PLAIN + 1) * LEVEL_STRIDE * 4));
    this.palTex = this.texture();
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 256, ELEMENT_COUNT, 0, gl.RGBA, gl.UNSIGNED_BYTE, plain);

    const glow = buildGlow();
    const glowBytes = new Uint8Array(256 * 4);
    for (let k = 0; k < 256; k++) {
      const c = glow.colour[k];
      glowBytes[k * 4] = c & 255;
      glowBytes[k * 4 + 1] = (c >> 8) & 255;
      glowBytes[k * 4 + 2] = (c >> 16) & 255;
      glowBytes[k * 4 + 3] = Math.min(255, glow.alpha[k]);
    }
    this.glowTex = this.texture(gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 256, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, glowBytes);

    // Light colours by element (LED red, neon orange), for lit cells.
    const litBytes = new Uint8Array(ELEMENT_COUNT * 4);
    for (let id = 0; id < ELEMENT_COUNT; id++) {
      const c = LIT_RGB_OF[id];
      litBytes[id * 4] = (c >> 16) & 255;
      litBytes[id * 4 + 1] = (c >> 8) & 255;
      litBytes[id * 4 + 2] = c & 255;
      litBytes[id * 4 + 3] = 255;
    }
    const fxBytes = new Uint8Array(FX_RGB.length * 4);
    FX_RGB.forEach(([r, g, b], k) => fxBytes.set([r, g, b, 255], k * 4));
    this.fxColTex = this.texture();
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, FX_RGB.length, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, fxBytes);
    this.litColTex = this.texture();
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, ELEMENT_COUNT, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, litBytes);

    this.texTex = this.texture();
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8UI, ELEMENT_COUNT, 1, 0, gl.RED_INTEGER, gl.UNSIGNED_BYTE, TEXTURE_OF);

    this.pressTex = this.texture();
    this.velTex = this.texture();

    const n = parseInt(ELEMENTS[0].colours[0].slice(1), 16);
    this.bg = [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
    this.resize(w, h, cellPx);
  }

  resize(w: number, h: number, cellPx: number): void {
    if (w === this.w && h === this.h && cellPx === this.cellPx) return;
    const gl = this.gl;
    this.w = w;
    this.h = h;
    this.cellPx = cellPx;
    this.canvas.width = w * cellPx;
    this.canvas.height = h * cellPx;

    gl.bindTexture(gl.TEXTURE_2D, this.dataTex.stone);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8UI, w, h, 0, gl.RED_INTEGER, gl.UNSIGNED_BYTE, buildStoneShade(w, h));
    gl.bindTexture(gl.TEXTURE_2D, this.dataTex.type);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R16UI, w, h, 0, gl.RED_INTEGER, gl.UNSIGNED_SHORT, null);
    gl.bindTexture(gl.TEXTURE_2D, this.dataTex.shade);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8UI, w, h, 0, gl.RED_INTEGER, gl.UNSIGNED_BYTE, null);
    gl.bindTexture(gl.TEXTURE_2D, this.dataTex.stamp);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8UI, w, h, 0, gl.RED_INTEGER, gl.UNSIGNED_BYTE, null);
    gl.bindTexture(gl.TEXTURE_2D, this.dataTex.temp);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R32F, w, h, 0, gl.RED, gl.FLOAT, null);
    gl.bindTexture(gl.TEXTURE_2D, this.dataTex.solute);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R16UI, w, h, 0, gl.RED_INTEGER, gl.UNSIGNED_SHORT, null);
    gl.bindTexture(gl.TEXTURE_2D, this.dataTex.conc);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8UI, w, h, 0, gl.RED_INTEGER, gl.UNSIGNED_BYTE, null);
    gl.bindTexture(gl.TEXTURE_2D, this.dataTex.charge);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8UI, w, h, 0, gl.RED_INTEGER, gl.UNSIGNED_BYTE, null);
    gl.bindTexture(gl.TEXTURE_2D, this.dataTex.lit);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8UI, w, h, 0, gl.RED_INTEGER, gl.UNSIGNED_BYTE, null);
    for (const tex of [this.dataTex.fx, this.dataTex.fxKind]) {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8UI, w, h, 0, gl.RED_INTEGER, gl.UNSIGNED_BYTE, null);
    }
    // A null upload leaves the texture zeroed, so this is an all-zero grid to bind when there is nothing.
    this.zeroTex = this.texture();
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8UI, w, h, 0, gl.RED_INTEGER, gl.UNSIGNED_BYTE, null);

    // Scene targets at cell resolution: colour and emission.
    this.sceneTex = this.target(w, h, gl.RGBA8, gl.NEAREST);
    this.emitTex = this.target(w, h, gl.RGBA8, gl.LINEAR);
    this.sceneFb = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.sceneFb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.sceneTex, 0);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, this.emitTex, 0);
    gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);

    // Light at quarter resolution, float when possible so dark gradients do not band.
    const qw = Math.max(1, Math.ceil(w / 4));
    const qh = Math.max(1, Math.ceil(h / 4));
    const fmt = this.floatTargets ? gl.RGBA16F : gl.RGBA8;
    this.quarter = this.fbTarget(qw, qh, fmt);
    this.quarter2 = this.fbTarget(qw, qh, fmt);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  draw(world: World): void {
    const gl = this.gl;
    if (world.w !== this.w || world.h !== this.h) this.resize(world.w, world.h, this.cellPx);
    const { w, h } = this;

    // Upload this frame's cells.
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.dataTex.type);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, w, h, gl.RED_INTEGER, gl.UNSIGNED_SHORT, world.type);
    gl.bindTexture(gl.TEXTURE_2D, this.dataTex.shade);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, w, h, gl.RED_INTEGER, gl.UNSIGNED_BYTE, world.shade);
    gl.bindTexture(gl.TEXTURE_2D, this.dataTex.stamp);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, w, h, gl.RED_INTEGER, gl.UNSIGNED_BYTE, world.stamp);
    gl.bindTexture(gl.TEXTURE_2D, this.dataTex.temp);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, w, h, gl.RED, gl.FLOAT, world.temp);
    gl.bindTexture(gl.TEXTURE_2D, this.dataTex.solute);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, w, h, gl.RED_INTEGER, gl.UNSIGNED_SHORT, world.solute);
    gl.bindTexture(gl.TEXTURE_2D, this.dataTex.conc);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, w, h, gl.RED_INTEGER, gl.UNSIGNED_BYTE, world.conc);
    gl.bindTexture(gl.TEXTURE_2D, this.dataTex.charge);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, w, h, gl.RED_INTEGER, gl.UNSIGNED_BYTE, world.charge);
    const lit = litLevels(world);
    if (lit) {
      gl.bindTexture(gl.TEXTURE_2D, this.dataTex.lit);
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, w, h, gl.RED_INTEGER, gl.UNSIGNED_BYTE, lit);
    }
    const fx = fxLevels(world);
    if (fx) {
      gl.bindTexture(gl.TEXTURE_2D, this.dataTex.fx);
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, w, h, gl.RED_INTEGER, gl.UNSIGNED_BYTE, fx.level);
      gl.bindTexture(gl.TEXTURE_2D, this.dataTex.fxKind);
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, w, h, gl.RED_INTEGER, gl.UNSIGNED_BYTE, fx.kind);
    }
    if (this.showChunks) {
      gl.bindTexture(gl.TEXTURE_2D, this.dataTex.awake);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8UI, world.cw, world.ch, 0, gl.RED_INTEGER, gl.UNSIGNED_BYTE, world.awake);
    }
    gl.bindVertexArray(this.vao);

    // 1. Scene.
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.sceneFb);
    gl.viewport(0, 0, w, h);
    gl.useProgram(this.scene);
    this.bind(this.dataTex.type, 0);
    this.bind(this.dataTex.shade, 1);
    this.bind(this.dataTex.stamp, 2);
    this.bind(this.dataTex.stone, 3);
    this.bind(this.texTex, 4);
    this.bind(this.dataTex.temp, 5);
    this.bind(this.palTex, 6);
    this.bind(this.glowTex, 7);
    this.bind(this.dataTex.solute, 8);
    this.bind(this.dataTex.conc, 9);
    this.bind(this.dataTex.charge, 10);
    this.bind(lit ? this.dataTex.lit : this.zeroTex, 11);
    this.bind(this.litColTex, 12);
    this.bind(fx ? this.dataTex.fx : this.zeroTex, 13);
    this.bind(fx ? this.dataTex.fxKind : this.zeroTex, 14);
    this.bind(this.fxColTex, 15);
    gl.uniform2i(this.uniformLoc(this.scene, 'uSize'), w, h);
    gl.uniform1i(this.uniformLoc(this.scene, 'uMoved'), world.frame === 0 ? -1 : 1 + ((world.frame - 1) % 255));
    gl.uniform1i(this.uniformLoc(this.scene, 'uFrame'), world.frame);
    gl.uniform3f(this.uniformLoc(this.scene, 'uBg'), ...this.bg);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // 2. Light: downsample emission, blur twice each way (wide, soft).
    gl.useProgram(this.down);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.quarter.fb);
    gl.viewport(0, 0, this.quarter.w, this.quarter.h);
    this.bind(this.emitTex, 0);
    gl.uniform2f(this.uniformLoc(this.down, 'uSrcSize'), w, h);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.useProgram(this.blur);
    for (let pass = 0; pass < 2; pass++) {
      const spread = pass === 0 ? 1 : 2;
      this.blurPass(this.quarter, this.quarter2, spread / this.quarter.w, 0);
      this.blurPass(this.quarter2, this.quarter, 0, spread / this.quarter.h);
    }

    // Air fields for the pressure and flow views.
    const viewCode = this.view === 'heat' ? 1 : this.view === 'pressure' ? 2 : this.view === 'flow' ? 3 : 0;
    if (viewCode >= 2) {
      const air = world.air;
      gl.bindTexture(gl.TEXTURE_2D, this.pressTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.R32F, air.aw, air.ah, 0, gl.RED, gl.FLOAT, air.p);
      const vel = this.velScratch.length === air.aw * air.ah * 2 ? this.velScratch : (this.velScratch = new Float32Array(air.aw * air.ah * 2));
      for (let k = 0; k < air.aw * air.ah; k++) {
        vel[k * 2] = air.vx[k];
        vel[k * 2 + 1] = air.vy[k];
      }
      gl.bindTexture(gl.TEXTURE_2D, this.velTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG32F, air.aw, air.ah, 0, gl.RG, gl.FLOAT, vel);
    }

    // 3. Composite to the screen.
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.useProgram(this.comp);
    this.bind(this.sceneTex, 0);
    this.bind(this.quarter.tex, 1);
    this.bind(this.dataTex.temp, 2);
    this.bind(this.dataTex.type, 3);
    this.bind(this.dataTex.awake, 4);
    gl.uniform2i(this.uniformLoc(this.comp, 'uSize'), w, h);
    gl.uniform2f(this.uniformLoc(this.comp, 'uCanvas'), this.canvas.width, this.canvas.height);
    gl.uniform1f(this.uniformLoc(this.comp, 'uTime'), (performance.now() - this.t0) / 1000);
    gl.uniform1i(this.uniformLoc(this.comp, 'uChunks'), this.showChunks ? 1 : 0);
    gl.uniform1i(this.uniformLoc(this.comp, 'uView'), viewCode);
    gl.uniform1f(this.uniformLoc(this.comp, 'uFlash'), world.flash);
    gl.uniform3f(this.uniformLoc(this.comp, 'uZoom'), view.zoom, view.cx, view.cy);
    this.bind(this.pressTex, 5);
    this.bind(this.velTex, 6);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  private blurPass(src: Target, dst: Target, sx: number, sy: number): void {
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fb);
    gl.viewport(0, 0, dst.w, dst.h);
    this.bind(src.tex, 0);
    gl.uniform2f(this.uniformLoc(this.blur, 'uStep'), sx, sy);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  /** Point a texture unit at a texture; each sampler was told its unit once at link time. */
  private bind(tex: WebGLTexture, unit: number): void {
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, tex);
  }

  /** A location by program and name, asking the driver only on a cache miss. */
  private uniformLoc(prog: WebGLProgram, name: string): WebGLUniformLocation | null {
    let byName = this.locs.get(prog);
    if (!byName) this.locs.set(prog, (byName = new Map()));
    const hit = byName.get(name);
    const loc = hit === undefined ? this.gl.getUniformLocation(prog, name) : hit;
    if (hit === undefined) byName.set(name, loc);
    return loc;
  }

  private texture(filter?: number): WebGLTexture {
    const gl = this.gl;
    const t = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, t);
    const f = filter ?? gl.NEAREST;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, f);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, f);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  }

  private target(w: number, h: number, internal: number, filter: number): WebGLTexture {
    const gl = this.gl;
    const t = this.texture(filter);
    gl.texStorage2D(gl.TEXTURE_2D, 1, internal, w, h);
    return t;
  }

  private fbTarget(w: number, h: number, internal: number): Target {
    const gl = this.gl;
    const tex = this.target(w, h, internal, gl.LINEAR);
    const fb = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    return { tex, fb, w, h };
  }

  /** Link, then set the sampler uniforms once: a sampler's texture unit never changes. */
  private program(frag: string, samplers: Array<[string, number]>): WebGLProgram {
    const gl = this.gl;
    const compile = (type: number, src: string): WebGLShader => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(`Shader: ${gl.getShaderInfoLog(s)}`);
      return s;
    };
    const p = gl.createProgram()!;
    gl.attachShader(p, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(p, compile(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(`Program: ${gl.getProgramInfoLog(p)}`);
    gl.useProgram(p);
    for (const [name, unit] of samplers) gl.uniform1i(this.uniformLoc(p, name), unit);
    return p;
  }
}
