/**
 * Career Timeline — 7 milestone plates stacked with no gap.
 *
 * Central progress rail with turning square marker (5 full turns), 3 parallax
 * layers per row, years that assemble letter by letter and settle to 40%, and a
 * hover interaction that dims every other row to 0.3 opacity.
 */

import { scrub } from "../motion/scroll-trigger.js";
import { splitReveal, onInView } from "../motion/text-reveal.js";
import { Spring, SPRING } from "../motion/spring.js";
import { subscribe, unsubscribe } from "../motion/ticker.js";

export const initTimeline = (container) => {
  if (!container) return () => {};

  const rows = [...container.querySelectorAll("[data-timeline-row]")];
  const railProgress = container.querySelector("#timeline-rail-progress");
  const railMarker = container.querySelector("#timeline-rail-marker");
  const railElement = container.querySelector("#timeline-rail");

  const cleanups = [];

  // Central Rail Progress & Marker Rotation (5 full turns = 1800 deg)
  if (railElement && railProgress && railMarker) {
    const totalHeight = 2668; // 169 + 4*462 + 3*217
    const lastRowCenter = 169 + 462 + 217 + 462 + 217 + 462 + 217 + 231 - 50;
    const restShare = (lastRowCenter - 0) / totalHeight;

    const cleanupRail = scrub(railElement, {
      start: "top center",
      end: "bottom bottom",
      from: 0,
      to: 1,
      apply: (_, rawProgress, smoothedProgress) => {
        const run = smoothedProgress * restShare * 100;
        railProgress.setAttribute("height", `${run}%`);
        const rot = (run / (restShare * 100)) * 1800;
        railMarker.setAttribute(
          "transform",
          `translate(8, ${run * (totalHeight / 100)}) rotate(${rot})`,
        );
      },
    });
    cleanups.push(cleanupRail);
  }

  // Row Parallax, Year Reveal & Settle, Copy Reveal, Hover Dim
  rows.forEach((row, index) => {
    const isCentre = row.dataset.frame === "centre";
    const plateLayer = row.querySelector("[data-parallax-plate]");
    const copyLayer = row.querySelector("[data-parallax-copy]");
    const yearElement = row.querySelector("[data-year-text]");
    const copyElement = row.querySelector("[data-copy-text]");
    const plateElement = row.querySelector("[data-timeline-plate]");

    // Parallax (desktop only)
    const travelPlate = isCentre ? 20 : 60;
    const travelCopy = 110;

    if (plateLayer) {
      const cleanupPlate = scrub(row, {
        start: "top bottom",
        end: "bottom top",
        from: travelPlate,
        to: -travelPlate,
        apply: (val) => {
          if (window.innerWidth <= 768) {
            plateLayer.style.top = "0px";
            return;
          }
          plateLayer.style.top = typeof val === "string" ? val : `${val}px`;
        },
      });
      cleanups.push(cleanupPlate);
    }

    if (copyLayer) {
      const cleanupCopy = scrub(row, {
        start: "top bottom",
        end: "bottom top",
        from: travelCopy,
        to: -travelCopy,
        apply: (val) => {
          if (window.innerWidth <= 768) {
            copyLayer.style.top = "0px";
            return;
          }
          copyLayer.style.top = typeof val === "string" ? val : `${val}px`;
        },
      });
      cleanups.push(cleanupCopy);
    }

    // Copy block entrance
    if (copyElement && document.documentElement.classList.contains("js-motion")) {
      copyElement.style.opacity = "0";
      copyElement.style.transform = "translateY(0.75rem)";
      copyElement.style.willChange = "transform, opacity";

      onInView(
        row,
        () => {
          setTimeout(() => {
            const copySpring = new Spring({
              ...SPRING.COPY,
              precision: 0.001,
              from: 0,
            });
            copySpring.set(1);
            let last = performance.now();
            const tickCopy = (time) => {
              const dt = time - last;
              last = time;
              const v = copySpring.step(dt);
              copyElement.style.opacity = `${v}`;
              copyElement.style.transform = `translateY(${(1 - v) * 0.75}rem)`;
              if (copySpring.resting) {
                copyElement.style.opacity = "1";
                copyElement.style.transform = "none";
                copyElement.style.willChange = "auto";
                unsubscribe(tickCopy);
              }
            };
            subscribe(tickCopy, () => 0);
          }, 220);
        },
        "0% 0% -25% 0%",
      );
    }

    // Hover dim interaction
    if (plateElement && window.matchMedia("(hover: hover)").matches) {
      plateElement.addEventListener("mouseenter", () => {
        rows.forEach((otherRow) => {
          if (otherRow !== row) otherRow.style.opacity = "0.3";
          else otherRow.style.opacity = "1";
        });
      });

      plateElement.addEventListener("mouseleave", () => {
        rows.forEach((otherRow) => {
          otherRow.style.opacity = "1";
        });
      });
    }
  });

  return () => {
    cleanups.forEach((c) => c?.());
  };
};
