/**
 * The chequered flag dissolve — the seam between sections.
 *
 * A canvas band over the section top, scrubbed by a scroll trigger
 * start "top bottom" -> end "top top" (TRIGGER {140, 30}).
 */

import { scrub } from "../motion/scroll-trigger.js";

const CELL = 24;
const SOLID_UNTIL = 0.16;
const LIFT = 2;
const ACCENT_SHARE = 0.06;

const clamp01 = (v) => Math.min(1, Math.max(0, v));

const noise = (x, y) => {
  let h = Math.imul(x, 374761393) + Math.imul(y, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
};

export const initChequeredDissolve = (canvas, carry = "light") => {
  if (!canvas) return () => {};
  const context = canvas.getContext("2d");
  if (!context) return () => {};

  let width = 0;
  let height = 0;
  let cell = CELL;

  const getTokens = () => {
    const style = getComputedStyle(document.documentElement);
    const accent = style.getPropertyValue("--border-strong").trim() || "#d4d4d8";
    const bg = style.getPropertyValue("--background").trim() || "#fafaf9";
    const surfaceMuted = style.getPropertyValue("--surface-muted").trim() || "#f4f4f5";
    return { accent, surface: carry === "light" ? bg : surfaceMuted };
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, Math.round(rect.width));
    height = Math.max(1, Math.round(rect.height));
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    const override = parseFloat(
      getComputedStyle(canvas).getPropertyValue("--flag-cell"),
    );
    cell = !isNaN(override) && override > 0 ? override : CELL;
  };

  const render = (progress) => {
    if (!width || !height) return;
    const { accent, surface } = getTokens();
    const columns = Math.ceil(width / cell);
    const rows = Math.ceil(height / cell);
    const lift = progress * LIFT;

    context.clearRect(0, 0, width, height);

    for (let y = 0; y < rows; y += 1) {
      const depth = y / Math.max(1, rows - 1) + lift;
      if (depth > 1) break;
      const solid = depth <= SOLID_UNTIL;
      const fade = clamp01(1 - (depth - SOLID_UNTIL) / (1 - SOLID_UNTIL));
      if (!solid && fade <= 0) break;

      for (let x = 0; x < columns; x += 1) {
        if (!solid) {
          if ((x + y) % 2 !== 0) continue;
          if (noise(x, y) > fade) continue;
        }
        context.fillStyle =
          !solid && noise(x + 101, y + 57) < ACCENT_SHARE ? accent : surface;
        context.fillRect(x * cell, y * cell, cell, cell);
      }
    }
  };

  resize();
  render(0);

  const cleanupScrub = scrub(canvas, {
    start: "top bottom",
    end: "top top",
    from: 0,
    to: 1,
    apply: (_, progress) => render(progress),
  });

  window.addEventListener("resize", () => { resize(); render(0); }, { passive: true });

  return () => {
    cleanupScrub();
  };
};
