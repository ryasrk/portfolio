/**
 * Device tier for the hero scene — decided once at construction, read by
 * everything (DPR, frame budget, pointer, antialias, mask cost) so values can
 * never drift apart.
 *
 * Re-read when the container's width changes or the pointer class flips: a
 * device does not change tier mid-session, but a window dragged across a
 * breakpoint and a device emulator switched off both do. What is baked into
 * shader source or the GL context (trailSamples, antialias) stays as built.
 */

/**
 * The cap for touch tiers, as the shared ticker measures it.
 *
 * The ticker skips while `time - last <= framerate`, so a budget of exactly
 * 1000/60 lets a 60Hz screen through every tick and on a 120Hz screen the first
 * tick past it lands at 25ms — 40fps, not 60. Two milliseconds under puts 60Hz
 * on every tick and 120Hz on every second one.
 */
const CAP_60 = 1000 / 60 - 2;

/**
 * The nearest web-exposed proxy for iOS Low Power Mode, which has no API.
 * Save-Data is an explicit request to spend less; 2GB or under is the class of
 * device that cannot hold a 60fps fragment loop anyway.
 */
const isEnergySaver = () => {
  const nav = navigator;
  return Boolean(nav.connection?.saveData) || (nav.deviceMemory ?? 8) <= 2;
};

export const getSceneTier = () => {
  // The coarse-pointer clause is what catches tablets and large phones; width
  // alone misses an iPad in landscape.
  const coarse = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  const width = window.innerWidth;
  const name =
    width < 768 || (coarse && width < 1024)
      ? "mobile"
      : coarse || width < 1280
        ? "tablet"
        : "desktop";

  const mobile = name === "mobile";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saver = isEnergySaver();

  return {
    name,
    mobile,
    coarsePointer: coarse,
    reducedMotion,
    // 1 -> 1.25 -> 1.5. Held at 1 on a phone rather than lower: this scene
    // draws hairline backdrop contours, and sub-1.0 aliases them visibly.
    maxDpr: mobile ? 1 : name === "tablet" ? 1.25 : 1.5,
    frameInterval: name === "desktop" ? 0 : CAP_60,
    pointerEnabled: !coarse && !reducedMotion,
    antialias: name === "desktop",
    /**
     * Length of the reveal's pointer history, and therefore the per-fragment
     * loop bound. The single biggest fill-rate lever in this scene: the mask is
     * evaluated over a full-screen backdrop, so every sample is paid for across
     * the frame.
     */
    trailSamples: mobile ? 28 : name === "tablet" ? 44 : 72,
    /** Whether the liquid reveal runs at all after the entrance. */
    reveal: !mobile,
    /** Play the entrance, then stop drawing on a settled frame. */
    freeze: reducedMotion || (mobile && saver),
  };
};
