/**
 * Scroll triggers — both flavours read the element's rect inside the ticker.
 *
 * A `scrub` trigger interpolates from -> to linearly by progress; a `toggle`
 * snaps at progress >= 1. Each trigger also runs an IntersectionObserver: it
 * only computes while its element is in view plus ten more frames after it
 * leaves — the "loop in view" rule every canvas on the page uses too.
 */

import { subscribe, unsubscribe } from "./ticker.js";
import { Spring, SPRING } from "./spring.js";

const positions = (bb, vh) => ({
  top_top: bb.top,
  center_top: bb.top + bb.height / 2,
  bottom_top: bb.bottom,
  top_bottom: bb.top - vh,
  center_bottom: bb.top + bb.height / 2 - vh,
  bottom_bottom: bb.bottom - vh,
  top_center: bb.top - vh / 2,
  center_center: bb.top + bb.height / 2 - vh / 2,
  bottom_center: bb.bottom - vh / 2,
});

export const computeProgress = (element, start, end) => {
  const bb = element.getBoundingClientRect();
  const vh = window.innerHeight || 1;
  const poses = positions(bb, vh);
  const scrollStart = poses[start];
  const scrollEnd = poses[end];
  const length = Math.abs(scrollStart - scrollEnd) || 1;
  return Math.min(Math.max(0, 1 - (scrollStart + length) / length), 1);
};

/** Interpolates a bare number, a "<number><unit>" string, or fn(<number><unit>). */
const interpolate = (from, to, t) => {
  if (typeof from === "number" && typeof to === "number") {
    return from + (to - from) * t;
  }
  const pattern = /^(-?[\d.]+)([a-z%]*)$/i;
  const wrapped = /^([a-zA-Z]+)\((-?[\d.]+)([a-z%]*)\)$/;

  const fw = String(from).match(wrapped);
  const tw = String(to).match(wrapped);
  if (fw && tw && fw[1] === tw[1]) {
    const value = Number(fw[2]) + (Number(tw[2]) - Number(fw[2])) * t;
    return `${fw[1]}(${value}${fw[3] || tw[3]})`;
  }

  const fm = String(from).match(pattern);
  const tm = String(to).match(pattern);
  if (fm && tm) {
    const value = Number(fm[1]) + (Number(tm[1]) - Number(fm[1])) * t;
    return `${value}${fm[2] || tm[2]}`;
  }
  return t >= 1 ? to : from;
};

export const scrub = (element, options) => {
  const {
    start = "top bottom",
    end = "bottom top",
    from,
    to,
    apply,
    framerate = 10,
  } = options;

  const startKey = start.replace(" ", "_");
  const endKey = end.replace(" ", "_");

  let inView = false;
  let grace = 0;
  const smoothed = new Spring({ ...SPRING.TRIGGER, precision: 0.0005, from: 0 });
  let last = performance.now();

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        inView = entry.isIntersecting;
        if (inView) grace = 10;
      }
    },
    { rootMargin: "10% 0px 10% 0px" },
  );
  observer.observe(element);

  const tick = (time) => {
    if (!inView) {
      if (grace <= 0) return;
      grace -= 1;
    }
    const delta = time - last;
    last = time;
    const progress = computeProgress(element, startKey, endKey);
    smoothed.set(progress).step(delta);
    apply(interpolate(from, to, progress), progress, smoothed.value);
  };

  subscribe(tick, () => framerate);

  return () => {
    unsubscribe(tick);
    observer.disconnect();
  };
};

export const toggle = (element, options) => {
  const { start = "top center", end = "bottom bottom", onEnter } = options;
  const startKey = start.replace(" ", "_");
  const endKey = end.replace(" ", "_");
  let fired = false;

  const tick = () => {
    if (fired) return;
    if (computeProgress(element, startKey, endKey) >= 1) {
      fired = true;
      onEnter();
      unsubscribe(tick);
    }
  };
  subscribe(tick, () => 10);
  return () => unsubscribe(tick);
};
