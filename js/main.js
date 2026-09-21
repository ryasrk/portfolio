/**
 * Main application coordinator for Ryas Rafi Karim's AI Systems Engineer Portfolio.
 */

import { initSmoothScroll, getLenis } from "./motion/smooth-scroll.js";
import { lockScroll, unlockScroll } from "./motion/scroll-lock.js";
import { initStickyStack } from "./motion/sticky-stack.js";
import { splitReveal, onInView } from "./motion/text-reveal.js";
import { Spring, SPRING } from "./motion/spring.js";
import { subscribe, unsubscribe } from "./motion/ticker.js";
import { HeroScene, DEFAULT_PARAMS, fitSubjectToBox } from "./hero/scene.js";
import { initChequeredDissolve } from "./systems/chequered-dissolve.js";
import { initTimeline } from "./timeline/timeline.js";
import { initFieldBlock } from "./field/field-block.js";
import { initContourField } from "./field/contour-field.js";
import { initModal } from "./modal.js";
import {
  loadContent,
  renderTimeline,
  renderCertificates,
  getVideoStreams,
} from "./content-store.js";

// Always start at top
history.scrollRestoration = "manual";
window.scrollTo(0, 0);

/**
 * Arm the entrance animations.
 *
 * Everything marked [data-reveal] renders fully visible until this class is
 * set, so a module failure or a trigger that never fires can only cost the
 * animation — never the content itself.
 */
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reducedMotion) document.documentElement.classList.add("js-motion");

/** Show a [data-reveal] element. Safe to call twice, safe if el is null. */
const reveal = (el, delay = 0) => {
  if (!el) return;
  if (delay > 0) {
    setTimeout(() => el.classList.add("is-revealed"), delay);
  } else {
    el.classList.add("is-revealed");
  }
};

/** Last-resort guard: if the entrance never ran, show everything anyway. */
setTimeout(() => {
  document
    .querySelectorAll("[data-reveal]:not(.is-revealed)")
    .forEach((el) => el.classList.add("is-revealed"));
}, 6000);

/** Scroll to an element through Lenis when it is active, natively otherwise. */
const scrollToTarget = (target) => {
  const isTopTarget =
    !target ||
    target === document.body ||
    target === document.documentElement ||
    target.id === "hero" ||
    target.id === "main-content" ||
    target.closest?.("#hero");

  const smooth = getLenis();
  if (isTopTarget) {
    if (smooth) {
      smooth.scrollTo(0, { immediate: false });
    } else {
      window.scrollTo({
        top: 0,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    }
    return;
  }

  const offset = -(parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0);
  if (smooth) {
    smooth.scrollTo(target, { offset });
  } else {
    target.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Initialize Smooth Scroll (Lenis)
  await initSmoothScroll();

  // 2. Loading Veil Orchestration
  const veil = document.querySelector("#loading-veil");
  const veilMeter = document.querySelector("#veil-meter-fill");
  const veilSilhouette = document.querySelector("#veil-silhouette-fill");
  const veilContent = document.querySelector("#veil-content");
  const veilName = document.querySelector("#veil-name");

  const progressSpring = new Spring({
    ...SPRING.PROGRESS_WAITING,
    precision: 0.001,
    from: 0,
  });
  progressSpring.set(0.7);

  let veilReady = false;
  let veilLast = performance.now();

  const tickVeil = (time) => {
    const dt = time - veilLast;
    veilLast = time;
    const val = progressSpring.step(dt);

    if (veilMeter) veilMeter.style.transform = `scaleX(${val})`;
    if (veilSilhouette) veilSilhouette.style.transform = `scaleY(${val})`;

    if (veilReady && (progressSpring.resting || val >= 0.96)) {
      unsubscribe(tickVeil);
      liftVeil();
    }
  };
  subscribe(tickVeil, () => 0);

  // 3. WebGL Hero Scene Setup
  const heroCanvas = document.querySelector("#hero-canvas");
  const heroSection = document.querySelector("[data-hero]");
  const heroFitBox = document.querySelector("#hero-fit-box");
  let heroScene = null;

  if (heroCanvas) {
    heroScene = new HeroScene(heroCanvas);
    window.heroScene = heroScene;

    const applyFit = () => {
      if (!heroScene || !heroSection) return;
      const b = heroFitBox && heroFitBox.getBoundingClientRect().height > 100
        ? heroFitBox.getBoundingClientRect()
        : null;

      const fitted = b
        ? fitSubjectToBox(
            DEFAULT_PARAMS,
            { top: b.top - heroSection.getBoundingClientRect().top, height: b.height },
            heroSection.clientHeight,
          )
        : {};

      heroScene.setParams({
        ...DEFAULT_PARAMS,
        ...fitted,
        ...(window.matchMedia("(max-width: 1023px)").matches
          ? { bgRevealOpacity: 0 }
          : null),
        ...(window.matchMedia("(hover: none)").matches
          ? { autoSweepAmount: 0.76 }
          : null),
        ...(window.matchMedia("(max-width: 639px)").matches
          ? { sweepRadius: 0.95, sweepWarp: 0.18, autoSweepAmount: 0.55 }
          : null),
        ...(!heroScene.tier.reveal ? { autoSweepAmount: 0 } : null),
      });

      heroScene.resize(heroSection.clientWidth, heroSection.clientHeight);
    };

    window.addEventListener("resize", applyFit, { passive: true });
    applyFit();

    // Scene render loop
    const tickScene = (time) => {
      if (!heroScene) return;
      if (window.scrollY <= window.innerHeight * 1.15) {
        heroScene.update(time);
      }
    };
    subscribe(tickScene, () => heroScene.tier.frameInterval);

    // Pointer move for WebGL relighting
    if (heroScene.tier.pointerEnabled) {
      window.addEventListener(
        "pointermove",
        (e) => {
          const px = (e.clientX / window.innerWidth) * 2 - 1;
          const py = (e.clientY / window.innerHeight) * 2 - 1;
          heroScene.setPointer(px, py);
        },
        { passive: true },
      );
    }

    // When WebGL compiled & ready
    heroScene.onReady = () => {
      veilReady = true;
      progressSpring.tension = SPRING.PROGRESS_READY.tension;
      progressSpring.friction = SPRING.PROGRESS_READY.friction;
      progressSpring.set(1);
    };

    // Error banner fallback
    heroScene.onError = (url) => {
      const banner = document.createElement("div");
      banner.className = "asset-error";
      banner.textContent = `[Asset Warning] Resource unavailable: ${url}. Proceeding with high-fidelity canvas fallback.`;
      document.body.prepend(banner);
      setTimeout(() => banner.remove(), 8000);
      veilReady = true;
      progressSpring.set(1);
    };
  }

  // Fallback timeout in case WebGL or network stalls
  setTimeout(() => {
    veilReady = true;
    progressSpring.tension = 240;
    progressSpring.friction = 22;
    progressSpring.set(1);
    setTimeout(liftVeil, 200);
  }, 800);

  // 4. Veil Exit Handover & Hero Entrance
  let veilLifted = false;
  const liftVeil = () => {
    if (veilLifted) return;
    veilLifted = true;

    if (veilContent) {
      veilContent.style.transition = "opacity 300ms cubic-bezier(0.2,0,0,1), transform 300ms cubic-bezier(0.2,0,0,1)";
      veilContent.style.opacity = "0";
      veilContent.style.transform = "translateY(-0.75rem)";
    }

    setTimeout(() => {
      heroScene?.beginRise();

      if (veil) {
        veil.style.transition = "opacity 400ms cubic-bezier(0.2,0,0,1)";
        veil.style.opacity = "0";
        veil.style.pointerEvents = "none";

        setTimeout(() => {
          veil.remove();
        }, 450);
      }

      playHeroEntrance();
    }, 200);
  };

  // 5. Hero Entrance Timeline (+0, +180, +900, +1500)
  const playHeroEntrance = () => {
    const heroName = document.querySelector("#hero-name");
    const heroId = document.querySelector("#hero-id");
    const heroMetaRows = [...document.querySelectorAll("[data-hero-meta-row]")];
    const heroPanels = document.querySelector("[data-hero-panels]");
    const heroActions = document.querySelector("[data-hero-actions]");

    // +180: name words reveal, kicker fades in
    reveal(heroId, 180);
    setTimeout(() => {
      if (heroName) {
        const { play } = splitReveal(heroName, {
          mode: "words",
          stagger: 110,
          config: SPRING.REVEAL,
        });
        play();
      }
    }, 180);

    // +440: role line and credential bar rise
    heroMetaRows.forEach((row, i) => reveal(row, 440 + i * 130));

    // +900: metric cluster
    reveal(heroPanels, 900);

    // +1200: actions
    reveal(heroActions, 1200);
  };

  // Chequered Dissolve Seams
  const dissolveCanvases = [...document.querySelectorAll("[data-chequered-seam]")];
  dissolveCanvases.forEach((c) => {
    initChequeredDissolve(c, c.dataset.carry || "light");
  });

  // 5b. Dynamic Content (assets/data/content.json — managed via /admin).
  //     If the JSON is missing/unparsable, the static HTML ships as-is.
  let videoStreams = null;
  try {
    const content = await loadContent();
    if (content) {
      renderTimeline(document.querySelector(".timeline-container"), content);
      renderCertificates(document.querySelector(".cert-grid"), content);
      videoStreams = getVideoStreams(content);
    }
  } catch (err) {
    console.warn("[content] render failed, static fallback:", err);
  }

  // 6. Section 2: Career Timeline Stack
  const timelineSection = document.querySelector("[data-timeline-section]");
  if (timelineSection) {
    initTimeline(timelineSection);
  }

  // 8. Section 4: Production Video & Pipeline Strip
  const fieldSection = document.querySelector("[data-field-section]");
  if (fieldSection) {
    initFieldBlock(fieldSection, videoStreams);
    const fieldContourCanvas = fieldSection.querySelector("#field-contour-canvas");
    if (fieldContourCanvas) {
      initContourField(fieldContourCanvas, "--field-contour");
    }
  }

  // 9. Section 5: Footer & Navigation
  const footerSection = document.querySelector("[data-footer-section]");
  if (footerSection) {
    const footerContourCanvas = footerSection.querySelector("#footer-contour-canvas");
    if (footerContourCanvas) {
      initContourField(footerContourCanvas, "--footer-contour");
    }

    // Nav reveals
    const navLinks = [...footerSection.querySelectorAll("[data-footer-nav-link]")];
    onInView(
      footerSection,
      () => {
        navLinks.forEach((link, i) => {
          link.style.opacity = "0";
          link.style.transform = "translateY(8px)";
          link.style.transition = "opacity 0.4s ease, transform 0.4s ease";
          setTimeout(() => {
            link.style.opacity = "1";
            link.style.transform = "none";
          }, 200 + i * 70);
        });
      },
      "0% 0% -15% 0%",
    );
  }

  // 10. Sticky Stack
  initStickyStack(document);

  // 11. Modal Lightbox
  initModal();

  // 11b. Certificate Lightbox (click a cert card to view full image)
  const certCards = [...document.querySelectorAll("[data-cert-lightbox]")];
  if (certCards.length) {
    const lightbox = document.createElement("div");
    lightbox.className = "cert-lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Certificate preview");
    lightbox.innerHTML = `
      <button type="button" class="cert-lightbox-close" aria-label="Close preview">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      <img alt="Certificate" />
    `;
    document.body.appendChild(lightbox);

    const lbImg = lightbox.querySelector("img");
    const lbClose = lightbox.querySelector(".cert-lightbox-close");
    let lbReturnFocus = null;

    const closeLightbox = () => {
      lightbox.classList.remove("is-open");
      unlockScroll();
      lbReturnFocus?.focus?.({ preventScroll: true });
    };

    certCards.forEach((card) => {
      card.addEventListener("click", () => {
        const img = card.querySelector("img");
        if (!img) return;
        lbReturnFocus = card;
        lbImg.src = img.src;
        lbImg.alt = img.alt || "Certificate";
        lightbox.classList.add("is-open");
        lockScroll();
        lbClose?.focus();
      });
    });

    lbClose?.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightbox.classList.contains("is-open")) {
        closeLightbox();
      }
    });
  }

  // 12. Fullscreen Menu Sheet (Mobile / Responsive)
  const menuBtn = document.querySelector("#menu-toggle-btn");
  const menuSheet = document.querySelector("#menu-sheet");
  const menuCloseBtn = document.querySelector("#menu-sheet-close");
  const sheetNavLinks = [...document.querySelectorAll("[data-sheet-link]")];

  if (menuBtn && menuSheet) {
    const openMenu = () => {
      menuSheet.classList.add("is-open");
      lockScroll();
      menuBtn.setAttribute("aria-expanded", "true");
      sheetNavLinks.forEach((link, i) => {
        setTimeout(() => link.classList.add("is-revealed"), 120 + i * 55);
      });
      menuCloseBtn?.focus();
    };

    const closeMenu = () => {
      menuSheet.classList.remove("is-open");
      unlockScroll();
      menuBtn.setAttribute("aria-expanded", "false");
      // Links reset only after the sheet has finished sliding away, so they
      // never flash transparent while it is still on screen.
      setTimeout(() => {
        if (menuSheet.classList.contains("is-open")) return;
        sheetNavLinks.forEach((link) => link.classList.remove("is-revealed"));
      }, 450);
    };

    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.addEventListener("click", openMenu);
    menuCloseBtn?.addEventListener("click", closeMenu);

    // An in-page jump must wait for the lock to lift, otherwise the browser
    // scrolls a still-locked document and lands nowhere.
    sheetNavLinks.forEach((l) =>
      l.addEventListener("click", (e) => {
        const id = l.getAttribute("href");
        closeMenu();
        if (id?.startsWith("#")) {
          e.preventDefault();
          const target = document.querySelector(id);
          if (target) {
            requestAnimationFrame(() => scrollToTarget(target));
          }
        }
      }),
    );

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menuSheet.classList.contains("is-open")) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 1280 && menuSheet.classList.contains("is-open")) {
        closeMenu();
      }
    });
  }

  // 13. In-page anchors outside the menu sheet.
  //
  // Native anchor jumps fight Lenis: the browser moves the document while
  // Lenis still believes it is at the old offset, so the next wheel event
  // snaps back. Routing every jump through Lenis keeps the two in agreement.
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    if (link.hasAttribute("data-sheet-link")) return;
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      scrollToTarget(target);
      // Keep the URL shareable without letting the browser do the jump.
      history.replaceState(null, "", id);
    });
  });
});
