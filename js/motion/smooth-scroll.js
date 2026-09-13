/**
 * Lenis runs from the shared ticker, registered first, so every scroll reader
 * on the page sees this frame's scrollY. Under prefers-reduced-motion we skip
 * it entirely and let the platform scroll.
 */

import { subscribe } from "./ticker.js";

export let lenis = null;

/** Live accessor — a plain `import { lenis }` would capture the null binding. */
export const getLenis = () => lenis;

export const initSmoothScroll = async () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;
  try {
    const { default: Lenis } = await import("lenis");
    lenis = new Lenis({ smoothWheel: true });
    subscribe((time) => lenis.raf(time), () => 0);
    return lenis;
  } catch (error) {
    console.warn("[smooth-scroll] Lenis unavailable, native scroll retained", error);
    return null;
  }
};
