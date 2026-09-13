/**
 * Interactive Halftone Stage & Animated 6-Second Lap Circuit.
 *
 * 8,003 dots baked offscreen, mouse reticle crosshair with (col + row) % 2 === 0
 * chequerboard illumination, and an interactive 6s lap loop.
 */

import { subscribe, unsubscribe } from "../motion/ticker.js";
import { Spring, SPRING } from "../motion/spring.js";
import {
  DOTS,
  DOT_LATTICE,
  DOT_RADIUS,
  MAP_VIEW,
  CIRCUIT_PATH,
  CIRCUIT_MARKERS,
  FLAG_CUT,
  mapToArtboard,
} from "../data/circuit-data.js";

const MAX_RATIO =
  typeof window !== "undefined" &&
  window.matchMedia("(hover: none) and (pointer: coarse)").matches
    ? 1
    : 2;

const MIN_LEVEL = 0.02;
const POINTER_HEAT = 0.95;
const RETICLE_OPEN = 420;
const RETICLE_SETTLE = 900;
const SPREAD_OPEN = 0.38;
const SPREAD_SHUT = 0.09;
const RETICLE_ARM = 0.82;
const RETICLE_CORE = 54;
const POINTER_TRAIL = 0.07;
const POINTER_RISE = 0.14;
const POINTER_FALL = 0.3;

const CHEQUER_FILL = 1;
const CHEQUER_SEED = 0.7;

const approach = (from, to, dt, tau) =>
  from + (to - from) * (1 - Math.exp(-dt / Math.max(0.001, tau)));

const falloff = (t) => {
  if (t >= 1) return 0;
  const u = 1 - t;
  return u * u;
};

// Color utilities
const parseHex = (hex) => {
  const clean = hex.trim().replace("#", "");
  if (clean.length !== 6) return [24, 24, 27];
  const n = parseInt(clean, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const mix = (a, b, t) => [
  Math.round(a[0] + (b[0] - a[0]) * t),
  Math.round(a[1] + (b[1] - a[1]) * t),
  Math.round(a[2] + (b[2] - a[2]) * t),
];

const css = ([r, g, b]) => `rgb(${r} ${g} ${b})`;

// Circuit trace constants
const LINE_WIDTH = 5.9;
const GLOW_WIDTH = 15;
const HEAD_UNITS = 210;
const MARKER_POP_UNITS = 90;
const CORNER_BRAKE = 9;
const CIRCUIT_STEP = 3;

const CUT_CENTRE = mapToArtboard(FLAG_CUT.x, FLAG_CUT.y);
const CUT_SCALE = 1438.43 / 2560;
const CUT_ALONG = FLAG_CUT.along * CUT_SCALE;
const CUT_ACROSS = FLAG_CUT.across * CUT_SCALE;

const CUMULATIVE = CIRCUIT_PATH.reduce((acc, point, index) => {
  if (index === 0) return [0];
  const previous = CIRCUIT_PATH[index - 1];
  acc.push(
    acc[index - 1] + Math.hypot(point[0] - previous[0], point[1] - previous[1]),
  );
  return acc;
}, []);
const TOTAL = CUMULATIVE[CUMULATIVE.length - 1];

const TIME_AT = (() => {
  const count = CIRCUIT_PATH.length;
  const turn = new Array(count).fill(0);
  for (let i = 1; i < count - 1; i += 1) {
    const [ax, ay] = CIRCUIT_PATH[i - 1];
    const [bx, by] = CIRCUIT_PATH[i];
    const [cx, cy] = CIRCUIT_PATH[i + 1];
    const ux = bx - ax;
    const uy = by - ay;
    const vx = cx - bx;
    const vy = cy - by;
    const lengths = (Math.hypot(ux, uy) || 1) * (Math.hypot(vx, vy) || 1);
    turn[i] = Math.acos(
      Math.min(1, Math.max(-1, (ux * vx + uy * vy) / lengths)),
    );
  }
  const win = 6;
  const smoothed = turn.map((_, i) => {
    let sum = 0;
    let n = 0;
    for (
      let j = Math.max(0, i - win);
      j <= Math.min(count - 1, i + win);
      j += 1
    ) {
      sum += turn[j];
      n += 1;
    }
    return sum / n;
  });
  const accumulated = [0];
  for (let i = 1; i < count; i += 1) {
    const span = CUMULATIVE[i] - CUMULATIVE[i - 1];
    const speed = 1 / (1 + CORNER_BRAKE * smoothed[i]);
    accumulated.push(accumulated[i - 1] + span / speed);
  }
  const total = accumulated[count - 1] || 1;
  return accumulated.map((value) => value / total);
})();

const distanceAtTime = (time) => {
  if (time <= 0) return 0;
  if (time >= 1) return TOTAL;
  let low = 0;
  let high = TIME_AT.length - 1;
  while (low < high - 1) {
    const mid = (low + high) >> 1;
    if (TIME_AT[mid] <= time) low = mid;
    else high = mid;
  }
  const span = TIME_AT[high] - TIME_AT[low] || 1;
  const ratio = (time - TIME_AT[low]) / span;
  return CUMULATIVE[low] + (CUMULATIVE[high] - CUMULATIVE[low]) * ratio;
};

export const initHalftoneStage = (container) => {
  if (!container) return () => {};

  const halftoneCanvas = container.querySelector("#halftone-canvas");
  const traceCanvas = container.querySelector("#circuit-trace-canvas");
  if (!halftoneCanvas || !traceCanvas) return () => {};

  const hCtx = halftoneCanvas.getContext("2d");
  const tCtx = traceCanvas.getContext("2d");
  if (!hCtx || !tCtx) return () => {};

  // Build lattice spatial index once
  const { columns, rows, points, count } = DOTS;
  let minI = Infinity;
  let maxI = -Infinity;
  let minJ = Infinity;
  let maxJ = -Infinity;
  for (let i = 0; i < count; i += 1) {
    if (columns[i] < minI) minI = columns[i];
    if (columns[i] > maxI) maxI = columns[i];
    if (rows[i] < minJ) minJ = rows[i];
    if (rows[i] > maxJ) maxJ = rows[i];
  }
  const gridW = maxI - minI + 1;
  const gridH = maxJ - minJ + 1;
  const cellGrid = new Int32Array(gridW * gridH).fill(-1);
  for (let i = 0; i < count; i += 1) {
    cellGrid[(rows[i] - minJ) * gridW + (columns[i] - minI)] = i;
  }

  let baked = null;
  const level = new Float32Array(count);
  const active = new Int32Array(count);
  const inList = new Uint8Array(count);
  let activeCount = 0;

  const pointer = { x: 1280, y: 720, heat: 0 };
  const target = { x: 1280, y: 720, on: false };
  let spread = 0;
  let lastTime = 0;
  let dirty = true;
  let inView = false;
  let grace = 0;

  // Lap state
  let lapProgress = 0;
  let lapHeat = 1;
  let lapStarted = false;
  let lapStartTime = 0;
  let lapCooling = false;
  let lapCoolStartTime = 0;

  const palette = {
    dot: [212, 212, 216],
    accent: [24, 24, 27],
    bright: [82, 82, 91],
    white: [255, 255, 255],
  };

  const updatePalette = () => {
    const style = getComputedStyle(document.documentElement);
    palette.accent = parseHex(style.getPropertyValue("--accent") || "#18181b");
    palette.dot = parseHex(style.getPropertyValue("--map-dot") || "#d4d4d8");
    palette.bright = parseHex(style.getPropertyValue("--foreground-muted") || "#52525b");
    palette.white = parseHex(style.getPropertyValue("--surface-raised") || "#ffffff");
  };

  // Bake resting dots offscreen
  const bake = () => {
    updatePalette();
    const ratio = Math.min(window.devicePixelRatio || 1, MAX_RATIO);
    const w = Math.round(MAP_VIEW.width * ratio * (halftoneCanvas.clientWidth / MAP_VIEW.width));
    const h = Math.round(MAP_VIEW.height * ratio * (halftoneCanvas.clientHeight / MAP_VIEW.height));
    if (!w || !h) return;

    halftoneCanvas.width = w;
    halftoneCanvas.height = h;

    baked = document.createElement("canvas");
    baked.width = w;
    baked.height = h;
    const bCtx = baked.getContext("2d");
    if (!bCtx) return;

    const scale = w / MAP_VIEW.width;
    bCtx.setTransform(scale, 0, 0, scale, 0, 0);
    bCtx.clearRect(0, 0, MAP_VIEW.width, MAP_VIEW.height);
    bCtx.fillStyle = css(palette.dot);
    bCtx.beginPath();
    for (let i = 0; i < count; i += 1) {
      const x = points[i * 2];
      const y = points[i * 2 + 1];
      bCtx.moveTo(x + DOT_RADIUS, y);
      bCtx.arc(x, y, DOT_RADIUS, 0, Math.PI * 2);
    }
    bCtx.fill();
    dirty = true;
  };

  const addLight = (i, val) => {
    if (val <= MIN_LEVEL) return;
    if (val > level[i]) level[i] = val;
    if (!inList[i]) {
      inList[i] = 1;
      active[activeCount] = i;
      activeCount += 1;
    }
  };

  const addPointLight = (source, reach) => {
    if (source.heat <= 0.01) return;
    const i0 = Math.floor((source.x - reach - DOT_LATTICE.originX) / DOT_LATTICE.pitchX);
    const i1 = Math.ceil((source.x + reach - DOT_LATTICE.originX) / DOT_LATTICE.pitchX);
    const j0 = Math.floor((source.y - reach - DOT_LATTICE.originY) / DOT_LATTICE.pitchY);
    const j1 = Math.ceil((source.y + reach - DOT_LATTICE.originY) / DOT_LATTICE.pitchY);

    for (let j = Math.max(minJ, j0); j <= Math.min(minJ + gridH - 1, j1); j += 1) {
      const rowOffset = (j - minJ) * gridW;
      for (let i = Math.max(minI, i0); i <= Math.min(minI + gridW - 1, i1); i += 1) {
        const idx = cellGrid[rowOffset + (i - minI)];
        if (idx < 0) continue;
        const d = Math.hypot(points[idx * 2] - source.x, points[idx * 2 + 1] - source.y);
        addLight(idx, falloff(d / reach) * source.heat);
      }
    }
  };

  const addReticle = (source) => {
    if (source.heat <= 0.01) return;
    const ci = Math.round((source.x - DOT_LATTICE.originX) / DOT_LATTICE.pitchX);
    const cj = Math.round((source.y - DOT_LATTICE.originY) / DOT_LATTICE.pitchY);
    const arm = RETICLE_ARM * source.heat;
    const reach = RETICLE_OPEN * spread;

    if (reach > 1 && cj >= minJ && cj < minJ + gridH) {
      const rowOffset = (cj - minJ) * gridW;
      const span = Math.ceil(reach / DOT_LATTICE.pitchX);
      const from = Math.max(minI, ci - span);
      const to = Math.min(minI + gridW - 1, ci + span);
      for (let i = from; i <= to; i += 1) {
        const idx = cellGrid[rowOffset + (i - minI)];
        if (idx < 0) continue;
        const d = Math.abs(points[idx * 2] - source.x);
        addLight(idx, (1 - d / reach) * arm);
      }
    }

    if (reach > 1 && ci >= minI && ci < minI + gridW) {
      const span = Math.ceil(reach / DOT_LATTICE.pitchY);
      const from = Math.max(minJ, cj - span);
      const to = Math.min(minJ + gridH - 1, cj + span);
      for (let j = from; j <= to; j += 1) {
        const idx = cellGrid[(j - minJ) * gridW + (ci - minI)];
        if (idx < 0) continue;
        const d = Math.abs(points[idx * 2 + 1] - source.y);
        addLight(idx, (1 - d / reach) * arm);
      }
    }

    addPointLight(source, RETICLE_CORE);
  };

  const drawHalftone = () => {
    if (!baked || !halftoneCanvas.width) return;
    const scale = halftoneCanvas.width / MAP_VIEW.width;
    hCtx.setTransform(scale, 0, 0, scale, 0, 0);
    hCtx.clearRect(0, 0, MAP_VIEW.width, MAP_VIEW.height);
    hCtx.drawImage(baked, 0, 0, MAP_VIEW.width, MAP_VIEW.height);

    const threshold = 0.34;
    const span = 1 - threshold;
    const box = DOT_RADIUS * 2 + 1;

    // Pass 1: clear lit dots
    let drew = 0;
    for (let k = 0; k < activeCount; k += 1) {
      const idx = active[k];
      if (level[idx] < threshold) continue;
      hCtx.clearRect(
        points[idx * 2] - DOT_RADIUS - 0.5,
        points[idx * 2 + 1] - DOT_RADIUS - 0.5,
        box,
        box,
      );
      drew += 1;
    }
    if (!drew) return;

    // Pass 2: draw chequerboard
    for (let k = 0; k < activeCount; k += 1) {
      const idx = active[k];
      const val = level[idx];
      if (val < threshold) continue;
      if ((columns[idx] + rows[idx]) & 1) continue;

      const t = Math.min(1, (val - threshold) / span);
      const side =
        DOT_LATTICE.pitchX * (CHEQUER_SEED + (CHEQUER_FILL - CHEQUER_SEED) * t);
      hCtx.fillStyle = css(
        val > 0.8
          ? palette.white
          : val > 0.5
            ? palette.bright
            : mix(palette.accent, palette.bright, val),
      );
      hCtx.fillRect(
        points[idx * 2] - side / 2,
        points[idx * 2 + 1] - side / 2,
        side,
        side,
      );
    }
  };

  // Trace rendering
  const trailUpTo = (distance) => {
    const out = [];
    for (let i = 0; i < CIRCUIT_PATH.length; i += 1) {
      if (CUMULATIVE[i] <= distance) {
        out.push(CIRCUIT_PATH[i]);
        continue;
      }
      const a = CIRCUIT_PATH[i - 1];
      const b = CIRCUIT_PATH[i];
      const segRatio =
        (distance - CUMULATIVE[i - 1]) / (CUMULATIVE[i] - CUMULATIVE[i - 1]);
      out.push([
        a[0] + (b[0] - a[0]) * segRatio,
        a[1] + (b[1] - a[1]) * segRatio,
      ]);
      break;
    }
    return out;
  };

  const strokePath = (ctx, pts, from = 0) => {
    ctx.beginPath();
    ctx.moveTo(pts[from][0], pts[from][1]);
    for (let i = from + 1; i < pts.length; i += 1) {
      ctx.lineTo(pts[i][0], pts[i][1]);
    }
    ctx.stroke();
  };

  const drawTrace = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, MAX_RATIO);
    const w = 1440;
    const h = 800;
    if (traceCanvas.width !== Math.round(w * ratio)) {
      traceCanvas.width = Math.round(w * ratio);
      traceCanvas.height = Math.round(h * ratio);
    }
    tCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
    tCtx.clearRect(0, 0, w, h);

    const distance = distanceAtTime(lapProgress);
    const pts = trailUpTo(distance);
    if (pts.length < 2) return;

    tCtx.lineCap = "round";
    tCtx.lineJoin = "round";

    // Glow
    tCtx.save();
    tCtx.globalCompositeOperation = "lighter";
    tCtx.strokeStyle = `rgba(${palette.accent.join(",")}, 0.05)`;
    tCtx.lineWidth = GLOW_WIDTH;
    strokePath(tCtx, pts);
    tCtx.strokeStyle = `rgba(${palette.accent.join(",")}, 0.1)`;
    tCtx.lineWidth = GLOW_WIDTH * 0.45;
    strokePath(tCtx, pts);
    tCtx.restore();

    // Hot line
    const head = Math.max(2, Math.round(HEAD_UNITS / CIRCUIT_STEP));
    const from = Math.max(0, pts.length - head);
    const tip = pts[pts.length - 1];
    const hot = tCtx.createLinearGradient(
      pts[from][0],
      pts[from][1],
      tip[0],
      tip[1],
    );
    hot.addColorStop(0, `rgba(${palette.accent.join(",")}, 0)`);
    hot.addColorStop(0.45, `rgba(${palette.accent.join(",")}, 0.9)`);
    hot.addColorStop(1, css(mix(palette.accent, palette.bright, lapHeat)));
    tCtx.strokeStyle = hot;
    tCtx.lineWidth = LINE_WIDTH;
    strokePath(tCtx, pts, from);

    // White filament
    const coreFrom = Math.max(0, pts.length - Math.round(head * 0.42));
    if (pts.length - coreFrom > 1) {
      const core = tCtx.createLinearGradient(
        pts[coreFrom][0],
        pts[coreFrom][1],
        tip[0],
        tip[1],
      );
      core.addColorStop(0, `rgba(${palette.bright.join(",")}, 0)`);
      core.addColorStop(1, `rgba(${palette.white.join(",")}, ${0.95 * lapHeat})`);
      tCtx.strokeStyle = core;
      tCtx.lineWidth = LINE_WIDTH * 0.38;
      strokePath(tCtx, pts, coreFrom);
    }

    // Spark at tip
    tCtx.save();
    tCtx.globalCompositeOperation = "lighter";
    const spark = tCtx.createRadialGradient(
      tip[0],
      tip[1],
      0,
      tip[0],
      tip[1],
      LINE_WIDTH * 2.6,
    );
    spark.addColorStop(0, `rgba(${palette.white.join(",")}, ${0.85 * lapHeat})`);
    spark.addColorStop(0.35, `rgba(${palette.bright.join(",")}, ${0.4 * lapHeat})`);
    spark.addColorStop(1, `rgba(${palette.accent.join(",")}, 0)`);
    tCtx.fillStyle = spark;
    tCtx.beginPath();
    tCtx.arc(tip[0], tip[1], LINE_WIDTH * 2.6, 0, Math.PI * 2);
    tCtx.fill();
    tCtx.restore();

    // Finish cut
    tCtx.save();
    tCtx.translate(CUT_CENTRE[0], CUT_CENTRE[1]);
    tCtx.rotate((FLAG_CUT.angle * Math.PI) / 180);
    tCtx.clearRect(-CUT_ALONG / 2, -CUT_ACROSS / 2, CUT_ALONG, CUT_ACROSS);
    tCtx.restore();

    // Markers
    for (const marker of CIRCUIT_MARKERS) {
      if (distance < marker.d) continue;
      const age = Math.min(1, (distance - marker.d) / MARKER_POP_UNITS);
      const rad = 12 + (1 - age) * 14;
      const glow = tCtx.createRadialGradient(
        marker.x,
        marker.y,
        0,
        marker.x,
        marker.y,
        rad,
      );
      glow.addColorStop(
        0,
        `rgba(${palette.bright.join(",")}, ${0.5 + 0.45 * (1 - age)})`,
      );
      glow.addColorStop(0.45, `rgba(${palette.accent.join(",")}, 0.32)`);
      glow.addColorStop(1, `rgba(${palette.accent.join(",")}, 0)`);
      tCtx.save();
      tCtx.globalCompositeOperation = "lighter";
      tCtx.fillStyle = glow;
      tCtx.beginPath();
      tCtx.arc(marker.x, marker.y, rad, 0, Math.PI * 2);
      tCtx.fill();
      tCtx.restore();

      if (age < 1) {
        tCtx.strokeStyle = `rgba(${palette.bright.join(",")}, ${(1 - age) * 0.6})`;
        tCtx.lineWidth = 1;
        tCtx.beginPath();
        tCtx.arc(marker.x, marker.y, 9 + age * 20, 0, Math.PI * 2);
        tCtx.stroke();
      }
    }
  };

  // Main frame loop
  const frame = (time) => {
    if (!inView) {
      if (grace <= 0) return;
      grace -= 1;
    }

    const dt = lastTime ? Math.min(0.1, (time - lastTime) / 1000) : 0;
    lastTime = time;

    // Lap 6-second progress
    if (lapStarted) {
      if (lapProgress < 1) {
        const u = Math.min(1, (time - lapStartTime) / 6000);
        // Ease in-out sine
        lapProgress = -(Math.cos(Math.PI * u) - 1) / 2;
        drawTrace();
      } else if (!lapCooling) {
        lapCooling = true;
        lapCoolStartTime = time;
      } else if (lapHeat > 0) {
        const u = Math.min(1, (time - lapCoolStartTime) / 800);
        // Ease out cubic
        lapHeat = 1 - Math.pow(1 - u, 3);
        drawTrace();
      }
    }

    // Reticle cursor physics
    const wanted = target.on ? POINTER_HEAT : 0;
    if (pointer.heat <= 0.001 && wanted > 0) {
      pointer.x = target.x;
      pointer.y = target.y;
    } else if (dt > 0) {
      const px = pointer.x;
      const py = pointer.y;
      pointer.x = approach(px, target.x, dt, POINTER_TRAIL);
      pointer.y = approach(py, target.y, dt, POINTER_TRAIL);
      const speed = Math.hypot(pointer.x - px, pointer.y - py) / dt;
      const wantedSpread = Math.max(0, 1 - speed / RETICLE_SETTLE);
      spread = approach(
        spread,
        wantedSpread,
        dt,
        wantedSpread > spread ? SPREAD_OPEN : SPREAD_SHUT,
      );
    }
    pointer.heat = approach(
      pointer.heat,
      wanted,
      dt,
      wanted > pointer.heat ? POINTER_RISE : POINTER_FALL,
    );
    if (pointer.heat < 0.005) {
      pointer.heat = 0;
      spread = 0;
    }

    // Decay lit dots
    const decay = Math.exp(-dt / 0.3);
    let write = 0;
    for (let k = 0; k < activeCount; k += 1) {
      const idx = active[k];
      const val = level[idx] * decay;
      if (val > MIN_LEVEL) {
        level[idx] = val;
        active[write] = idx;
        write += 1;
      } else {
        level[idx] = 0;
        inList[idx] = 0;
      }
    }
    const before = activeCount;
    activeCount = write;

    addReticle(pointer);

    if (activeCount > 0 || before > 0 || dirty) {
      dirty = false;
      drawHalftone();
    }
  };

  // Pointer listener
  const onPointerMove = (e) => {
    const rect = halftoneCanvas.getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      target.on = false;
      return;
    }
    target.on = true;
    target.x = ((e.clientX - rect.left) / rect.width) * MAP_VIEW.width;
    target.y = ((e.clientY - rect.top) / rect.height) * MAP_VIEW.height;
  };

  const onPointerLeave = () => {
    target.on = false;
  };

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  document.addEventListener("pointerleave", onPointerLeave, { passive: true });
  window.addEventListener("blur", onPointerLeave);

  // In-view gate & trigger lap on arrival
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        inView = entry.isIntersecting;
        if (inView) {
          grace = 10;
          if (!lapStarted && entry.intersectionRatio >= 0.25) {
            lapStarted = true;
            lapStartTime = performance.now();
          }
        }
      }
    },
    { threshold: [0, 0.25, 0.5] },
  );
  observer.observe(container);

  bake();
  subscribe(frame, () => 16);
  window.addEventListener("resize", bake, { passive: true });

  return () => {
    unsubscribe(frame);
    observer.disconnect();
    window.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerleave", onPointerLeave);
    window.removeEventListener("blur", onPointerLeave);
  };
};
