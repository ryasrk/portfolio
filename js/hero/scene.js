/**
 * The hero WebGL scene for Ryas Rafi Karim — depth-parallax head plane,
 * normal-map cursor relighting, liquid trail cursor reveal, and procedural
 * animated contour lines rolling across the backdrop.
 *
 * Built with plain Three.js, driven via the shared ticker loop.
 */

import {
  ACESFilmicToneMapping,
  Color,
  Group,
  LinearMipmapLinearFilter,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  RepeatWrapping,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  Texture,
  TextureLoader,
  Vector2,
  WebGLRenderer,
} from "three";
import { getSceneTier } from "./tier.js";
import { HeroVisionOverlay } from "./vision-overlay.js";

const ASSETS = "./assets/hero";

const readToken = (token) => {
  const probe = document.createElement("span");
  probe.style.cssText = `position:absolute;visibility:hidden;color:var(${token})`;
  document.body.appendChild(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();
  return resolved || "#e25066";
};

const HEAD_HEIGHT = 5.4;
const HEAD_ASPECT = 1147 / 1227;
const HEAD_WIDTH = HEAD_HEIGHT * HEAD_ASPECT;
const HEAD_EXTEND = 0.14;
const STATIC_POSE = { x: 0.3, y: 0.1 };
const BACKDROP_Z = -3;
const REFERENCE_ASPECT = 1.778;
const PORT_WIDTH = 1440;
const MIN_FIT = 0.9;
const NARROW_STEP = 0.25;
const STEP_UNDER = 1280;

export const CAMERA_FOV = 35;
export const CAMERA_Y = 0.1;

export const visibleWorldHeight = (cameraZ) =>
  2 * cameraZ * Math.tan((CAMERA_FOV * Math.PI) / 360);

export const fitSubjectToBox = (params, box, canvasHeight) => {
  if (canvasHeight <= 0 || box.height <= 0) {
    return { subjectScale: params.subjectScale, subjectY: params.subjectY };
  }
  const ratio = box.height / canvasHeight;
  const world = visibleWorldHeight(params.cameraZ);
  const centreShift = canvasHeight / 2 - (box.top + box.height / 2);
  return {
    subjectScale: params.subjectScale * ratio,
    subjectY:
      CAMERA_Y +
      (params.subjectY - CAMERA_Y) * ratio +
      (centreShift * world) / canvasHeight,
  };
};

const AUTO_SWEEP_PATH = [
  { x: -0.85, y: -0.62 },
  { x: 0.78, y: -0.2 },
  { x: -0.7, y: 0.2 },
  { x: 0.82, y: 0.6 },
];

const revealTrailFunction = (
  name,
  trail,
  boundsMin,
  boundsMax,
  pace,
  warp,
  length,
  radius,
  samples,
) => /* glsl */ `
  float ${name}(vec2 ndc) {
    float gate = smoothstep(uGateStart, uGateStart + uGateWidth, ${pace});
    if (gate <= 0.0) return 0.0;

    vec2 bounded = vec2(ndc.x * uAspect, ndc.y);
    if (any(lessThan(bounded, ${boundsMin})) || any(greaterThan(bounded, ${boundsMax}))) {
      return 0.0;
    }

    vec2 point = bounded;
    if (${warp} > 0.001) {
      vec2 noiseUv = ndc * 0.5 + 0.5;
      float nx = texture2D(uNoiseTex, noiseUv * uWarpScale + vec2(uTime * 0.07, uTime * 0.05)).r;
      float ny = texture2D(uNoiseTex, noiseUv * uWarpScale * 1.4 - vec2(uTime * 0.06, uTime * 0.09)).r;
      point += (vec2(nx, ny) - 0.5) * ${warp} * 0.22;
    }

    float r_scaled = ${radius} * mix(uIdleScale, 1.0, ${pace});
    float taper = uTaper * mix(uTaperIdle, uTaperFast, ${pace});

    float span = max(${length} * float(${samples} - 1), 1.0);
    float ceiling = uThreshold + uEdge;
    float tr = 0.0;
    for (int i = 0; i < ${samples} - 1; i++) {
      if (float(i) >= span) break;
      float weight = pow(1.0 - float(i) / span, taper);
      if (weight <= tr) break;

      vec2 a = vec2(${trail}[i].x * uAspect, ${trail}[i].y);
      vec2 b = vec2(${trail}[i + 1].x * uAspect, ${trail}[i + 1].y);
      float r = r_scaled * weight;
      tr = max(tr, weight * smoothstep(r, r * 0.35, revealSegment(point, a, b)));
      if (tr >= ceiling) break;
    }

    return smoothstep(uThreshold - uEdge, uThreshold + uEdge, tr) * gate;
  }
`;

const buildRevealDeclarations = (samples) => /* glsl */ `
  uniform vec2 uTrail[${samples}];
  uniform vec2 uTrailMin;
  uniform vec2 uTrailMax;
  uniform float uPace;
  uniform vec2 uSweep[${samples}];
  uniform vec2 uSweepMin;
  uniform vec2 uSweepMax;
  uniform float uSweepPace;
  uniform float uSweepWarp;
  uniform float uSweepLength;
  uniform float uSweepRadius;
  uniform float uAspect;
  uniform float uRadius;
  uniform float uIdleScale;
  uniform float uTaper;
  uniform float uTaperIdle;
  uniform float uTaperFast;
  uniform float uLength;
  uniform float uGateStart;
  uniform float uGateWidth;
  uniform float uWarpScale;
  uniform float uTime;
  uniform float uEdge;
  uniform float uThreshold;
  uniform float uWarp;
  uniform float uRevealMix;
  uniform sampler2D uNoiseTex;

  float revealSegment(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);
    return length(pa - ba * h);
  }

  ${revealTrailFunction("revealCursorTrail", "uTrail", "uTrailMin", "uTrailMax", "uPace", "uWarp", "uLength", "uRadius", samples)}
  ${revealTrailFunction("revealSweepTrail", "uSweep", "uSweepMin", "uSweepMax", "uSweepPace", "uSweepWarp", "uSweepLength", "uSweepRadius", samples)}

  float revealTrail(vec2 ndc) {
    float cursor = revealCursorTrail(ndc);
    if (cursor >= 1.0) return 1.0;
    return max(cursor, revealSweepTrail(ndc));
  }
`;

export const DEFAULT_PARAMS = {
  cameraZ: 6.5,
  subjectScale: 1.15,
  subjectX: 0,
  subjectY: 0.16,
  subjectParallax: 0.02,
  riseDistance: 200,
  riseDuration: 2,
  headScale: 0.8,
  headY: 0.58,
  headParallax: 0.005,
  headRelight: 0.32,
  trailRadius: 0.46,
  trailIdleScale: 0.28,
  trailTaper: 1.9,
  trailTaperIdle: 1.6,
  trailTaperFast: 1.25,
  trailLength: 0.64,
  revealThreshold: 0.08,
  revealEdge: 0.005,
  revealWarp: 1.29,
  revealWarpScale: 2.9,
  revealSpeed: 1.25,
  pointerLerp: 0.17,
  pacePeak: 0.029,
  paceAttack: 0.09,
  paceRelease: 0.205,
  paceThreshold: 0.06,
  paceRamp: 0.15,
  sweepWarp: 0.86,
  sweepLength: 0.67,
  sweepRadius: 0.33,
  bgLineScale: 3.8,
  bgLineCount: 2.5,
  bgLineThickness: 1.4,
  bgLineOpacity: 0.85,
  bgWaveAmount: 0.37,
  bgWaveSpeed: 1.66,
  bgRevealLightness: 0.62,
  bgRevealLightnessAlt: 0.44,
  bgRevealOpacity: 1,
  introDuration: 4,
  autoSweepAmount: 0,
  autoSweepPeriod: 5,
  autoSweepStroke: 0.45,
  autoSweepHold: 0,
};

const backdropVertex = /* glsl */ `
  varying vec4 vBackdropClip;
  void main() {
    vec4 clip = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vBackdropClip = clip;
    gl_Position = clip;
  }
`;

const buildBackdropFragment = (samples) => /* glsl */ `
  varying vec4 vBackdropClip;
  uniform vec3 uBackground;
  uniform vec3 uLineColor;
  uniform vec3 uRevealColor;
  uniform vec3 uRevealColorAlt;
  uniform float uLineScale;
  uniform float uLineCount;
  uniform float uLineThickness;
  uniform float uLineOpacity;
  uniform float uWaveAmount;
  uniform float uWaveSpeed;
  uniform float uRevealOpacity;
  ${buildRevealDeclarations(samples)}

  float backdropField(vec2 p, float t) {
    float f = sin(p.x * 1.00 + t * 0.60) * 0.50;
    f += sin(p.y * 0.85 - t * 0.45) * 0.45;
    f += sin((p.x + p.y) * 0.65 + t * 0.35) * 0.35;
    f += sin((p.x - p.y) * 0.95 - t * 0.55) * 0.25;
    return f * 0.5 + 0.5;
  }

  void main() {
    vec2 ndc = vBackdropClip.xy / vBackdropClip.w;
    vec2 p = vec2(ndc.x * uAspect, ndc.y) * uLineScale;
    float t = uTime * uWaveSpeed;
    vec2 q = p;
    q.x += sin(p.y * 0.8 + t * 0.7) * uWaveAmount;
    q.y += cos(p.x * 0.7 - t * 0.6) * uWaveAmount;

    float scaled = backdropField(q, t) * uLineCount;
    float w = max(fwidth(scaled) * uLineThickness, 1e-5);
    float line = 1.0 - smoothstep(0.0, w, abs(fract(scaled) - 0.5));

    // Subtle, high-precision contour lines
    vec3 color = mix(uBackground, uLineColor, line * uLineOpacity * uRevealMix * 0.45);

    // Natural studio radial ambient vignette behind portrait
    float radialDist = length(vec2(ndc.x * uAspect, ndc.y + 0.15));
    float vignette = smoothstep(0.25, 1.45, radialDist);
    vec3 studioShadow = mix(uBackground * 0.965, uBackground, vignette);
    color = min(color, studioShadow);

    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const headVertex = /* glsl */ `
  uniform float uExtend;
  varying vec2 vUv;
  varying vec3 vLocalPosition;
  void main() {
    vUv = vec2(uv.x, 1.0 - (1.0 - uv.y) * (1.0 + uExtend));
    vLocalPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const headFragment = /* glsl */ `
  uniform sampler2D uDiffuse;
  uniform sampler2D uDepth;
  uniform sampler2D uAlpha;
  uniform sampler2D uNormal;
  uniform vec2 uParallax;
  uniform float uReveal;
  uniform float uDepthScale;
  uniform float uRelight;
  uniform float uScanY;
  uniform float uScanMode;
  varying vec2 vUv;
  varying vec3 vLocalPosition;
  void main() {
    float depth = texture2D(uDepth, vUv).r;
    vec2 offset = uParallax * (depth - 0.5) * uDepthScale;
    vec2 uv = vUv + offset;
    vec4 rawColor = texture2D(uDiffuse, uv);
    float alpha = texture2D(uAlpha, uv).r;

    if (alpha < 0.02) discard;

    vec3 normal = normalize(texture2D(uNormal, uv).rgb * 2.0 - 1.0);
    vec3 lightDir = normalize(vec3(uParallax.x * 1.6, -uParallax.y * 1.6, 1.0));
    float lambert = max(dot(normal, lightDir), 0.0) - 0.72;

    // 1. BEFORE MODE: Clean authentic natural photograph
    vec3 beforeColor = rawColor.rgb * (1.0 + lambert * uRelight * 0.40);

    // 2. AFTER MODE: Edge AI Computer Vision depth perception with realistic studio tones
    // Subtle cool-emerald depth shading preserving authentic face/hair textures
    float luma = dot(rawColor.rgb, vec3(0.299, 0.587, 0.114));
    vec3 visionTint = mix(vec3(luma), rawColor.rgb, 0.65);
    vec3 emeraldAccent = vec3(0.016, 0.471, 0.341) * (depth * 0.25);
    vec3 afterColor = (visionTint + emeraldAccent) * (1.0 + lambert * uRelight * 1.2);

    // 3. SINGLE UNIFIED BEFORE / AFTER SCAN BOUNDARY
    float distToScan = vLocalPosition.y - uScanY;
    float isScanned = smoothstep(-0.04, 0.04, distToScan);
    vec3 color = mix(beforeColor, afterColor, isScanned * uScanMode);

    // 4. Glowing Emerald Horizon Beam on the Scan Edge
    float beam = exp(-abs(distToScan) * 35.0);
    vec3 beamColor = vec3(0.12, 0.85, 0.58);
    color += beamColor * beam * 1.15 * uScanMode;

    gl_FragColor = vec4(clamp(color, 0.0, 1.0), alpha * uReveal);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export class HeroScene {
  constructor(canvas) {
    this._tier = getSceneTier();
    this.samples = this._tier.trailSamples;
    this.trail = Array.from(
      { length: this.samples },
      () => new Vector2(STATIC_POSE.x, -STATIC_POSE.y),
    );
    this.sweepTrail = Array.from(
      { length: this.samples },
      () => new Vector2(AUTO_SWEEP_PATH[0].x, -AUTO_SWEEP_PATH[0].y),
    );

    this.renderer = new WebGLRenderer({
      canvas,
      alpha: false,
      antialias: this._tier.antialias,
      stencil: false,
      powerPreference: this._tier.mobile ? "default" : "high-performance",
    });
    // The canvas ground must match the page background, or the portrait sits
    // on a visible seam. Read it from the token so the palette is single-sourced.
    this.renderer.setClearColor(new Color(readToken("--background")));
    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, this._tier.maxDpr),
    );
    this.renderer.toneMapping = ACESFilmicToneMapping;

    this.scene = new Scene();
    this.camera = new PerspectiveCamera(CAMERA_FOV, 1, 0.1, 50);
    this.camera.position.set(0, CAMERA_Y, 6.5);

    this.headMaterial = null;
    this.headMesh = null;
    this.revealUniforms = null;
    this.subjectGroup = new Group();
    this.backdropMesh = null;
    this.backdropMaterial = null;
    this.params = { ...DEFAULT_PARAMS };

    this.pointer = { x: 0, y: 0 };
    this.smoothed = { x: 0, y: 0 };
    this.lastSmoothed = { x: 0, y: 0 };
    this.pointerSeen = false;
    this.pace = 0;

    this.readyAt = null;
    this.intro = 0;
    this.viewportHeight = 1;
    this.viewportWidth = 1;
    this.riseStarted = false;
    this.riseAt = null;

    this.sweepPointer = { x: AUTO_SWEEP_PATH[0].x, y: AUTO_SWEEP_PATH[0].y };
    this.sweepSmoothed = { ...this.sweepPointer };
    this.sweepLast = { ...this.sweepPointer };
    this.sweepPace = 0;
    this.sweepCycle = 0;

    this.aspect = 1;
    this.reveal = 0;
    this.settled = false;
    this.disposed = false;
    this.startTime = null;

    this.ready = false;
    this.onReady = null;
    this.onError = null;

    if (!this._tier.pointerEnabled) this.parkPointer();

    this.visionOverlay = new HeroVisionOverlay();

    this.scene.add(this.subjectGroup);
    void this.load();
  }

  get tier() {
    return this._tier;
  }

  retune() {
    const fresh = getSceneTier();
    const previous = this._tier;
    this._tier = {
      ...fresh,
      antialias: previous.antialias,
      trailSamples: previous.trailSamples,
    };
    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, this._tier.maxDpr),
    );
    if (!this._tier.pointerEnabled) this.parkPointer();
    else if (!previous.pointerEnabled) this.pointerSeen = false;
    if (!this._tier.freeze) this.settled = false;
    return this._tier;
  }

  parkPointer() {
    this.pointer = { ...STATIC_POSE };
    this.smoothed = { ...STATIC_POSE };
    this.lastSmoothed = { ...STATIC_POSE };
    this.pointerSeen = false;
  }

  beginRise() {
    this.riseStarted = true;
  }

  setPointer(x, y) {
    this.pointer.x = x;
    this.pointer.y = y;
    if (!this.pointerSeen) {
      this.pointerSeen = true;
      this.smoothed.x = x;
      this.smoothed.y = y;
      this.lastSmoothed.x = x;
      this.lastSmoothed.y = y;
    }
  }

  setParams(partial) {
    Object.assign(this.params, partial);
    this.settled = false;
  }

  resize(width, height) {
    this.renderer.setSize(width, height, false);
    this.viewportHeight = Math.max(height, 1);
    this.viewportWidth = Math.max(width, 1);
    this.aspect = width / height;
    this.camera.aspect = this.aspect;
    this.camera.updateProjectionMatrix();
    if (this.revealUniforms) this.revealUniforms.uAspect.value = this.aspect;
  }

  update(time) {
    if (this.disposed || this.settled) return;
    if (this.startTime === null) this.startTime = time;
    const t = (time - this.startTime) / 1000;
    const p = this.params;

    if (this._tier.freeze && this.reveal > 0.995 && this.intro >= 1) {
      this.settled = true;
    }

    const autoEnabled =
      p.autoSweepAmount > 0 && !this._tier.freeze && this.intro >= 1;
    if (autoEnabled) {
      const cycle = t % Math.max(p.autoSweepPeriod, 0.001);
      if (cycle < this.sweepCycle) this.resetSweep();
      this.sweepCycle = cycle;

      const legs = AUTO_SWEEP_PATH.length - 1;
      const stroke = Math.max(p.autoSweepStroke, 0.05);
      const slot = stroke + Math.max(p.autoSweepHold, 0);
      const leg = Math.floor(cycle / slot);

      if (leg < legs) {
        const local = Math.min(1, (cycle - leg * slot) / stroke);
        const eased = 1 - (1 - local) * (1 - local);
        const from = AUTO_SWEEP_PATH[leg];
        const to = AUTO_SWEEP_PATH[leg + 1];
        this.sweepPointer.x =
          (from.x + (to.x - from.x) * eased) * p.autoSweepAmount;
        this.sweepPointer.y =
          (from.y + (to.y - from.y) * eased) * p.autoSweepAmount;
      }
    }

    this.sweepSmoothed.x +=
      (this.sweepPointer.x - this.sweepSmoothed.x) * p.pointerLerp;
    this.sweepSmoothed.y +=
      (this.sweepPointer.y - this.sweepSmoothed.y) * p.pointerLerp;

    const sweepStep = Math.hypot(
      this.sweepSmoothed.x - this.sweepLast.x,
      this.sweepSmoothed.y - this.sweepLast.y,
    );
    const sweepTarget = autoEnabled
      ? Math.min(1, sweepStep / Math.max(p.pacePeak, 1e-5))
      : 0;
    this.sweepPace +=
      (sweepTarget - this.sweepPace) *
      (sweepTarget > this.sweepPace ? p.paceAttack : p.paceRelease);
    this.sweepLast.x = this.sweepSmoothed.x;
    this.sweepLast.y = this.sweepSmoothed.y;

    const oldestSweep = this.sweepTrail.pop();
    if (oldestSweep) {
      oldestSweep.set(this.sweepSmoothed.x, -this.sweepSmoothed.y);
      this.sweepTrail.unshift(oldestSweep);
    }

    this.smoothed.x += (this.pointer.x - this.smoothed.x) * p.pointerLerp;
    this.smoothed.y += (this.pointer.y - this.smoothed.y) * p.pointerLerp;

    if (this.ready) {
      if (this.readyAt === null) this.readyAt = t;
      this.intro = Math.min(
        1,
        (t - this.readyAt) / Math.max(p.introDuration, 0.001),
      );
      if (this._tier.freeze) this.intro = 1;
    }

    this.camera.position.z = p.cameraZ;
    this.subjectGroup.scale.setScalar(p.subjectScale * this.narrowFit());
    this.subjectGroup.position.x =
      p.subjectX +
      (this.viewportWidth < STEP_UNDER && this.aspect >= 1.2 ? NARROW_STEP : 0) +
      this.smoothed.x * p.subjectParallax;
    this.subjectGroup.position.y =
      (this.aspect < 0.8 ? -0.12 : p.subjectY) -
      this.smoothed.y * p.subjectParallax -
      this.riseOffset(t, p);

    if (this.headMaterial) {
      this.headMaterial.uniforms.uParallax.value.set(
        this.smoothed.x,
        -this.smoothed.y,
      );
      this.headMaterial.uniforms.uReveal.value = this.reveal;
      this.headMaterial.uniforms.uDepthScale.value = p.headParallax;
      this.headMaterial.uniforms.uRelight.value = p.headRelight;
    }
    if (this.headMesh) {
      this.headMesh.scale.setScalar(p.headScale);
      this.headMesh.position.y =
        -0.55 + p.headY - (HEAD_HEIGHT * HEAD_EXTEND * p.headScale) / 2;
    }

    if (this.visionOverlay) {
      this.visionOverlay.update(
        t,
        this.smoothed.x,
        this.smoothed.y,
        this.intro,
        this.reveal,
        this.viewportWidth,
        this.aspect,
      );
      if (this.headMaterial) {
        this.headMaterial.uniforms.uScanY.value = this.visionOverlay.scanY;
        this.headMaterial.uniforms.uScanMode.value = 1.0;
      }
    }

    const step = Math.hypot(
      this.smoothed.x - this.lastSmoothed.x,
      this.smoothed.y - this.lastSmoothed.y,
    );
    if (this._tier.pointerEnabled) {
      const target = Math.min(1, step / Math.max(p.pacePeak, 1e-5));
      this.pace +=
        (target - this.pace) *
        (target > this.pace ? p.paceAttack : p.paceRelease);
    } else if (!autoEnabled && this.intro >= 1 && this._tier.reveal) {
      this.pace = 1;
    }
    this.lastSmoothed.x = this.smoothed.x;
    this.lastSmoothed.y = this.smoothed.y;

    const oldest = this.trail.pop();
    if (oldest) {
      oldest.set(this.smoothed.x, -this.smoothed.y);
      this.trail.unshift(oldest);
    }

    if (this.revealUniforms) {
      this.revealUniforms.uAspect.value = this.aspect;
      this.revealUniforms.uRadius.value = p.trailRadius;
      this.revealUniforms.uIdleScale.value = p.trailIdleScale;
      this.revealUniforms.uTaper.value = p.trailTaper;
      this.revealUniforms.uTaperIdle.value = p.trailTaperIdle;
      this.revealUniforms.uTaperFast.value = p.trailTaperFast;
      this.revealUniforms.uLength.value = p.trailLength;
      this.revealUniforms.uPace.value = this.pace;
      this.revealUniforms.uGateStart.value = p.paceThreshold;
      this.revealUniforms.uGateWidth.value = p.paceRamp;
      this.revealUniforms.uWarpScale.value = p.revealWarpScale;
      this.revealUniforms.uTime.value = t * p.revealSpeed;
      this.revealUniforms.uRevealMix.value = this.reveal;
      this.revealUniforms.uThreshold.value = p.revealThreshold;
      this.revealUniforms.uEdge.value = p.revealEdge;
      this.revealUniforms.uWarp.value = p.revealWarp;

      this.revealUniforms.uSweepPace.value = this.sweepPace;
      this.revealUniforms.uSweepWarp.value = p.sweepWarp;
      this.revealUniforms.uSweepLength.value = p.sweepLength;
      this.revealUniforms.uSweepRadius.value = p.sweepRadius;

      this.writeTrailBounds(
        this.trail,
        p.trailLength,
        p.revealWarp,
        p.trailRadius,
        this.revealUniforms.uTrailMin.value,
        this.revealUniforms.uTrailMax.value,
      );
      this.writeTrailBounds(
        this.sweepTrail,
        p.sweepLength,
        p.sweepWarp,
        p.sweepRadius,
        this.revealUniforms.uSweepMin.value,
        this.revealUniforms.uSweepMax.value,
      );
    }

    if (this.backdropMesh && this.backdropMaterial) {
      const distance = this.camera.position.z - BACKDROP_Z;
      const height =
        2 * distance * Math.tan((this.camera.fov * Math.PI) / 360) * 1.06;
      this.backdropMesh.scale.set(height * this.aspect, height, 1);

      const bg = this.backdropMaterial.uniforms;
      bg.uLineScale.value = p.bgLineScale;
      bg.uLineCount.value = p.bgLineCount;
      bg.uLineThickness.value = p.bgLineThickness;
      bg.uLineOpacity.value = p.bgLineOpacity;
      bg.uWaveAmount.value = p.bgWaveAmount;
      bg.uWaveSpeed.value = p.bgWaveSpeed;
      bg.uRevealOpacity.value = p.bgRevealOpacity;
      bg.uRevealColor.value.setScalar(p.bgRevealLightness);
      bg.uRevealColorAlt.value.setScalar(p.bgRevealLightnessAlt);
    }

    this.renderer.render(this.scene, this.camera);
  }

  riseOffset(t, p) {
    if (this._tier.freeze || p.riseDistance === 0) return 0;
    let remaining = 1;
    if (this.riseStarted) {
      if (this.riseAt === null) this.riseAt = t;
      const u = Math.min(1, (t - this.riseAt) / Math.max(p.riseDuration, 0.001));
      remaining = 1 - (1 - (1 - u) * (1 - u));
    }
    if (remaining <= 0) return 0;
    const visible = 2 * p.cameraZ * Math.tan((this.camera.fov * Math.PI) / 360);
    return remaining * p.riseDistance * (visible / this.viewportHeight);
  }

  resetSweep() {
    const start = AUTO_SWEEP_PATH[0];
    const amount = this.params.autoSweepAmount;
    const x = start.x * amount;
    const y = start.y * amount;
    this.sweepPointer.x = x;
    this.sweepPointer.y = y;
    this.sweepSmoothed.x = x;
    this.sweepSmoothed.y = y;
    this.sweepLast.x = x;
    this.sweepLast.y = y;
    this.sweepPace = 0;
    for (const sample of this.sweepTrail) sample.set(x, -y);
  }

  narrowFit() {
    if (this.viewportWidth >= PORT_WIDTH) return 1;
    if (this.aspect < 0.6) return 0.58;
    if (this.aspect < 1.0) return 0.72;
    if (this.aspect < 1.2) return 0.85;
    return Math.max(MIN_FIT, Math.min(1, this.aspect / REFERENCE_ASPECT));
  }

  writeTrailBounds(trail, length, warp, radius, min, max) {
    const active = Math.min(
      trail.length,
      Math.ceil(length * (this.samples - 1)) + 1,
    );
    const margin = radius + warp * 0.22 + 0.05;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (let i = 0; i < active; i++) {
      const sample = trail[i];
      const x = sample.x * this.aspect;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (sample.y < minY) minY = sample.y;
      if (sample.y > maxY) maxY = sample.y;
    }
    min.set(minX - margin, minY - margin);
    max.set(maxX + margin, maxY + margin);
  }

  dispose() {
    this.disposed = true;
    this.scene.traverse((object) => {
      if (object.geometry) object.geometry.dispose();
      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];
      for (const material of materials) {
        if (!material) continue;
        if (material.uniforms) {
          for (const uniform of Object.values(material.uniforms)) {
            if (uniform?.value instanceof Texture) {
              uniform.value.dispose();
            }
          }
        }
        for (const value of Object.values(material)) {
          if (value instanceof Texture) value.dispose();
        }
        material.dispose();
      }
    });
    this.visionOverlay?.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss?.();
  }

  async load() {
    const textureLoader = new TextureLoader();
    const loadTexture = (file, srgb = false) =>
      new Promise((resolve, reject) => {
        textureLoader.load(
          `${ASSETS}/${file}`,
          (texture) => {
            if (srgb) texture.colorSpace = SRGBColorSpace;
            texture.minFilter = LinearMipmapLinearFilter;
            texture.generateMipmaps = true;
            resolve(texture);
          },
          undefined,
          (err) => {
            const url = `${ASSETS}/${file}`;
            this.onError?.(url);
            reject(new Error(`Failed to load ${url}`));
          },
        );
      });

    try {
      const [diffuse, depth, alpha, normal, noise] = await Promise.all([
        loadTexture("person-diffuse.webp", true),
        loadTexture("person-depth.webp"),
        loadTexture("person-alpha.webp"),
        loadTexture("person-normal.webp"),
        loadTexture("noise.webp"),
      ]);

      if (this.disposed) return;

      this.buildHead(diffuse, depth, alpha, normal);
      this.buildBackdrop(noise);
      this.reveal = 1;

      // Prewarm
      for (const texture of [diffuse, depth, alpha, normal, noise]) {
        this.renderer.initTexture(texture);
      }
      await this.renderer.compileAsync(this.scene, this.camera);
      if (this.disposed) return;
      this.renderer.render(this.scene, this.camera);

      this.ready = true;
      this.onReady?.();
    } catch (err) {
      console.error("[hero-scene] Load failure", err);
      this.onError?.(err.message);
    }
  }

  buildHead(diffuse, depth, alpha, normal) {
    this.headMaterial = new ShaderMaterial({
      vertexShader: headVertex,
      fragmentShader: headFragment,
      uniforms: {
        uDiffuse: { value: diffuse },
        uDepth: { value: depth },
        uAlpha: { value: alpha },
        uNormal: { value: normal },
        uParallax: { value: new Vector2() },
        uReveal: { value: 0 },
        uDepthScale: { value: DEFAULT_PARAMS.headParallax },
        uRelight: { value: DEFAULT_PARAMS.headRelight },
        uExtend: { value: HEAD_EXTEND },
        uScanY: { value: -0.45 },
        uScanMode: { value: 1.0 },
      },
      transparent: true,
    });
    const geometry = new PlaneGeometry(
      HEAD_WIDTH,
      HEAD_HEIGHT * (1 + HEAD_EXTEND),
    );
    const head = new Mesh(geometry, this.headMaterial);
    head.position.set(0, -0.55, 0);
    this.headMesh = head;
    if (this.visionOverlay) {
      this.headMesh.add(this.visionOverlay.group);
    }
    this.subjectGroup.add(head);
  }

  buildBackdrop(noise) {
    noise.wrapS = RepeatWrapping;
    noise.wrapT = RepeatWrapping;

    this.revealUniforms = {
      uTrail: { value: this.trail },
      uTrailMin: { value: new Vector2(-1e3, -1e3) },
      uTrailMax: { value: new Vector2(1e3, 1e3) },
      uSweep: { value: this.sweepTrail },
      uSweepMin: { value: new Vector2(-1e3, -1e3) },
      uSweepMax: { value: new Vector2(1e3, 1e3) },
      uSweepPace: { value: 0 },
      uSweepWarp: { value: DEFAULT_PARAMS.sweepWarp },
      uSweepLength: { value: DEFAULT_PARAMS.sweepLength },
      uSweepRadius: { value: DEFAULT_PARAMS.sweepRadius },
      uAspect: { value: this.aspect },
      uRadius: { value: DEFAULT_PARAMS.trailRadius },
      uIdleScale: { value: DEFAULT_PARAMS.trailIdleScale },
      uTaper: { value: DEFAULT_PARAMS.trailTaper },
      uTaperIdle: { value: DEFAULT_PARAMS.trailTaperIdle },
      uTaperFast: { value: DEFAULT_PARAMS.trailTaperFast },
      uLength: { value: DEFAULT_PARAMS.trailLength },
      uPace: { value: 0 },
      uGateStart: { value: DEFAULT_PARAMS.paceThreshold },
      uGateWidth: { value: DEFAULT_PARAMS.paceRamp },
      uWarpScale: { value: DEFAULT_PARAMS.revealWarpScale },
      uTime: { value: 0 },
      uThreshold: { value: DEFAULT_PARAMS.revealThreshold },
      uEdge: { value: DEFAULT_PARAMS.revealEdge },
      uWarp: { value: DEFAULT_PARAMS.revealWarp },
      uRevealMix: { value: 0 },
      uNoiseTex: { value: noise },
    };

    this.backdropMaterial = new ShaderMaterial({
      vertexShader: backdropVertex,
      fragmentShader: buildBackdropFragment(this.samples),
      depthWrite: false,
      uniforms: {
        ...this.revealUniforms,
        uNoiseTex: { value: noise },
        uBackground: { value: new Color(readToken("--background")) },
        uLineColor: { value: new Color(readToken("--surface-soft")) },
        uRevealColor: {
          value: new Color().setScalar(DEFAULT_PARAMS.bgRevealLightness),
        },
        uRevealColorAlt: {
          value: new Color().setScalar(DEFAULT_PARAMS.bgRevealLightnessAlt),
        },
        uLineScale: { value: DEFAULT_PARAMS.bgLineScale },
        uLineCount: { value: DEFAULT_PARAMS.bgLineCount },
        uLineThickness: { value: DEFAULT_PARAMS.bgLineThickness },
        uLineOpacity: { value: DEFAULT_PARAMS.bgLineOpacity },
        uWaveAmount: { value: DEFAULT_PARAMS.bgWaveAmount },
        uWaveSpeed: { value: DEFAULT_PARAMS.bgWaveSpeed },
        uRevealOpacity: { value: DEFAULT_PARAMS.bgRevealOpacity },
      },
    });

    const backdrop = new Mesh(new PlaneGeometry(1, 1), this.backdropMaterial);
    backdrop.position.z = BACKDROP_Z;
    backdrop.renderOrder = -1;
    this.backdropMesh = backdrop;
    this.scene.add(backdrop);
  }
}
