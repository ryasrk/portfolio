/**
 * The text engine.
 *
 * A block of text is split into words or letters, each in an inline-block span,
 * and each unit runs its own spring from *Out to *In:
 *   words   { opacity 0, y "0.35em" } -> { opacity 1, y "0em" }
 *   letters { opacity 0, y "0.3em"  } -> { opacity 1, y "0em" }
 * Unit i starts at delayIn + i * stagger ms.
 *
 * A visually-hidden copy of the plain string stays for assistive technology and
 * the animated spans are aria-hidden. No overflow clip anywhere — the display
 * leadings (0.95, 0.72) would shave descenders.
 */

import { subscribe, unsubscribe } from "./ticker.js";
import { Spring, SPRING } from "./spring.js";

const reduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const splitReveal = (element, options = {}) => {
  const {
    mode = "words",
    stagger = mode === "letters" ? 26 : 110,
    delayIn = 0,
    config = SPRING.REVEAL,
    columnGap = null,
    forward = true,
  } = options;

  const source = (element.textContent || "").trim();
  if (!source) return { play: () => {}, element };

  const travel = mode === "letters" ? 0.3 : 0.35;
  element.textContent = "";
  element.classList.add("reveal-flow");
  if (columnGap !== null) element.style.columnGap = `${columnGap}em`;

  // Assistive copy of the plain string.
  const assistive = document.createElement("span");
  assistive.className = "sr-only";
  assistive.textContent = source;
  element.appendChild(assistive);

  const holder = document.createElement("span");
  holder.setAttribute("aria-hidden", "true");
  holder.style.display = "contents";
  element.appendChild(holder);

  const units = [];
  const pieces = mode === "letters" ? [...source] : source.split(/\s+/);

  for (const piece of pieces) {
    if (piece === " ") continue;
    const span = document.createElement("span");
    span.className = "reveal-unit";
    span.textContent = piece;
    if (mode === "letters" && piece === " ") span.innerHTML = "&nbsp;";
    span.style.opacity = "0";
    span.style.transform = `translateY(${travel}em)`;
    holder.appendChild(span);
    units.push(span);
  }

  if (reduced()) {
    for (const unit of units) {
      unit.style.opacity = "1";
      unit.style.transform = "none";
    }
    return { play: () => {}, element, units };
  }

  const springs = units.map(
    () => new Spring({ ...config, precision: 0.001, from: 0 }),
  );

  let started = false;
  let startedAt = 0;
  let last = 0;
  let tick = null;

  const play = () => {
    if (started) return;
    started = true;
    startedAt = performance.now();
    last = startedAt;

    tick = (time) => {
      const delta = time - last;
      last = time;
      const elapsed = time - startedAt;
      let allResting = true;

      for (let i = 0; i < springs.length; i += 1) {
        const spring = springs[i];
        if (elapsed >= delayIn + i * stagger) spring.set(1);
        const value = spring.step(delta);
        if (!spring.resting) allResting = false;
        const unit = units[i];
        unit.style.opacity = `${value}`;
        unit.style.transform = `translateY(${(1 - value) * travel}em)`;
      }

      if (allResting && elapsed > delayIn + springs.length * stagger) {
        for (const unit of units) {
          unit.style.opacity = "1";
          unit.style.transform = "none";
          unit.style.willChange = "auto";
        }
        unsubscribe(tick);
      }
    };
    subscribe(tick, () => 0);
  };

  return { play, element, units, forward };
};

/**
 * Fires once when the element enters the viewport inset by rootMargin.
 * `0% 0% -25% 0%` for timeline rows, `0% 0% -20% 0%` for the calendar strip.
 */
export const onInView = (element, callback, rootMargin = "0% 0% -15% 0%") => {
  if (!element) return () => {};
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        callback(entry);
        observer.disconnect();
      }
    },
    { rootMargin },
  );
  observer.observe(element);
  return () => observer.disconnect();
};
