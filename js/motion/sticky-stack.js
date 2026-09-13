/**
 * The sticky recede stack.
 *
 * Each layer is position:sticky; top:0. Inside, a transform-origin:center inner
 * wrapper holds the block, then a full-bleed absolute inset-0 shade. A passive
 * scroll listener (coalesced into one rAF) drives the recede: the covered layer
 * scales to 0.9 and darkens to 55% black rather than scrolling away.
 *
 * The transform lives on the inner wrapper, never on the sticky element — a
 * transformed ancestor takes position:sticky out of the viewport's frame.
 */

const RECEDE_SCALE = 0.9;
const RECEDE_SHADE = 0.4;

export const initStickyStack = (root = document) => {
  const layers = [...root.querySelectorAll("[data-pinned]")];
  if (!layers.length) return;

  const phone = window.matchMedia("(max-width: 639px)");

  const pinned = layers
    .map((layer) => {
      const inner = layer.querySelector("[data-pinned-inner]");
      const shade = layer.querySelector("[data-pinned-shade]");
      const next = layer.nextElementSibling;
      return inner && shade && next ? { layer, inner, shade, next } : null;
    })
    .filter(Boolean);

  if (!pinned.length) return;

  let queued = false;

  const apply = () => {
    queued = false;
    const view = window.innerHeight || 1;
    // No shrink on a phone, shade only.
    const shrink = phone.matches ? 0 : 1 - RECEDE_SCALE;

    for (const { layer, inner, shade, next } of pinned) {
      // 0 while the next block is still a full screen away,
      // 1 once it has taken the whole viewport.
      const p = Math.min(
        1,
        Math.max(0, 1 - next.getBoundingClientRect().top / view),
      );
      // No transform at rest — a scale(1) here makes the layer the containing
      // block for the hero's position:fixed loader, which would then centre in
      // the section instead of the viewport.
      inner.style.transform =
        p > 0 && shrink > 0 ? `scale(${1 - shrink * p})` : "";
      inner.style.willChange = p > 0 && shrink > 0 ? "transform" : "";
      shade.style.opacity = `${RECEDE_SHADE * p}`;
      // Fully covered: stop painting the scene and layer.
      inner.style.visibility = p >= 1 ? "hidden" : "visible";
      layer.style.visibility = p >= 1 ? "hidden" : "visible";
    }
  };

  const request = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(apply);
  };

  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request, { passive: true });
  phone.addEventListener?.("change", request);
  apply();
};
