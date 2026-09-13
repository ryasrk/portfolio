# Portfolio Performance, Accessibility, SEO & Media Engineering Report

**Scope:** static HTML5/CSS3/ES-modules portfolio, no build tooling, served statically.
**Stack as found:** Three.js WebGL hero (`js/hero/scene.js`, 27 KB, tier system in `tier.js`), 4 CSS files (44 KB), `app.js` (54 KB), 3 mp4 videos (~23/43/63 MB), canvas scroll animations, sticky scroll layers, modal dossier system, fullscreen mobile menu, system Arial font.
**Method:** official-source research (web.dev, W3C WAI, MDN, schema.org, Google Search Central) + direct audit of the live site via curl. All thresholds verified on-page in Sep 2026.

> Note on tooling: `web_search` hard-failed in this session (backend HTTP 404). All sources below were fetched directly with `curl`/`web_fetch`; every source URL is a specific, already-fetched page.

---

## 0. Measured baseline of THIS site (evidence, not opinion)

| Finding | Measurement | Impact |
|---|---|---|
| **No compression at all** | `Accept-Encoding: gzip, br` → response has only `Content-Length`, no `Content-Encoding`/`Vary` | **Critical.** `app.js` 54 KB → 17 KB gzip; `index.html` 34 KB → 7.8 KB gzip; `sections.css` 20.8 KB → 3.9 KB gzip. ~70–80% waste on every text asset. |
| **No cache headers** | No `Cache-Control`, `ETag`, `Vary` on any asset | Re-downloads on every visit. |
| **Videos 22.7 / 43.1 / 62.6 MB** | `assets/videos/*.mp4` are symlinks to root files; largest 62.6 MB | Catastrophic on mobile. 100×+ over budget. |
| **Videos are `preload="none"` + `data-src`** | One `<video>` found: `preload="none" poster=... loop muted playsinline`, no `src` | ✅ Good pattern already — but no `<source type>`, no dimensions, no codec variants. |
| **Zero OG/Twitter/canonical/JSON-LD** | `grep` for `og:`, `twitter:`, `rel="canonical"`, `ld+json`, `rel="manifest"` → **0 matches** | Broken LinkedIn/X previews; no entity signal to Google. |
| **No `robots.txt`, no `sitemap.xml`** | Not present at site root | No crawl guidance. |
| **Font comment says "Google Fonts: Oswald, Space Grotesk, JetBrains Mono" but no `<link>` exists** | Line 10 comment only; no font request | Neutral today; see §6 before adding. |
| **No skip link** | `grep -c skip index.html` → 0 | WCAG 2.4.1 fail. |
| **No `<main>` landmark** | Only `<header>`, `<nav>`, `<footer>`, `<section>` | WCAG 1.3.1 / SR navigation degraded. |
| **Modal:** `role="dialog" aria-modal="true"` + JS focus trap + Escape + focus restore | `js/modal.js:172,181,200-221` | ✅ Good — but no `aria-labelledby` on the dialog, and background is not `inert`/`aria-hidden`. |
| **Mobile menu sheet** has `aria-label="Close menu"` but **no trigger with `aria-expanded`/`aria-controls` found in markup** | `menu-sheet` is a plain div | Screen readers cannot discover state or relationship. |
| **`prefers-reduced-motion` handled in JS** (`tier.js`) and 2 CSS blocks | `css/base.css:132`, `css/components.css:603`, `tier.js` | ✅ Good coverage. |
| **DPR cap exists** (`mobile 1 / tablet 1.25 / desktop 1.5`), `powerPreference: "high-performance"`, `antialias` desktop-only, ACES tone mapping | `tier.js`, `scene.js:336-350` | ✅ Strong. See §3 for the few gaps. |
| **`100vh` used raw** (2 places) | `css/sections.css:160,352` | iOS Safari address-bar jump. |
| **Focus style present** | `css/base.css:93-96`: `outline: 2px solid var(--accent); outline-offset: 3px` | ✅ Meets 2.4.13 area; verify 3:1 change-of-contrast. |
| **`backdrop-filter: blur()` × 8** | `components.css:107,354`, `sections.css:95,128,196` | GPU/scroll-jank risk on mobile. |
| **`aria-hidden` / `inert`: 0 occurrences** | `js/modal.js` | AT can reach background content behind modal. |
| **`width`/`height` absent on `<video>`** | The single `<video>` tag | Layout shift risk when poster decodes. |

**Total critical-path text weight as served:** `index.html` 34.4 KB + CSS 44.1 KB + `scene.js`+`tier.js`+`vision-overlay.js` 41.2 KB + `app.js` 54.2 KB ≈ **174 KB uncompressed → ~45 KB if gzipped.** Three.js and Lenis load from jsDelivr via importmap (cross-origin, third-party dependency).

---

## 1. CORE WEB VITALS — thresholds, why portfolios fail, fixes

### 1.1 Current thresholds (verified Sept 2026)

Google's defining-thresholds page (last updated **7 May 2025**) gives this normative table, measured at the **75th percentile** of page loads, with the **same thresholds on mobile and desktop**:

| Metric | Good | Poor | Percentile | Field source |
|---|---|---|---|---|
| **Largest Contentful Paint (LCP)** | **≤ 2500 ms** | **> 4000 ms** | 75 | CrUX |
| **Interaction to Next Paint (INP)** | **≤ 200 ms** | **> 500 ms** | 75 | CrUX |
| **Cumulative Layout Shift (CLS)** | **≤ 0.1** | **> 0.25** | 75 | CrUX |

Between "good" and "poor" is **"needs improvement."** A site is "good" for a metric only if ≥75% of page views meet the good threshold. **INP replaced First Input Delay (FID) as a stable Core Web Vital in March 2024** — FID is retired and must not be cited or optimised for.

Sources:
- https://web.dev/articles/defining-core-web-vitals-thresholds
- https://web.dev/articles/vitals
- https://web.dev/articles/lcp , https://web.dev/articles/inp , https://web.dev/articles/cls

### 1.2 LCP — what it is and why this portfolio will fail

LCP = render time of the largest image/text block in the viewport. It decomposes into four sub-parts that Google's guide teaches you to measure separately:

1. **TTFB** (server/network first byte)
2. **Resource load delay** (discovery → download start)
3. **Resource load duration** (download time)
4. **Element render delay** (download end → first paint of the element)

**Likely failure causes specific to this site, in order of severity:**

- **The loading veil blocks first meaningful paint.** `#loading-veil` is in the DOM at byte ~2 KB and is removed only when JS decides loading is done. That covers the hero (the LCP element) behind a decorative spring/meter animation. If LCP is painted after the veil lifts, **LCP ≈ time-to-veil-removal**, and no amount of image optimisation beats a JS-gated reveal. Fix: paint hero LCP content *behind* the veil at first paint, and cap veil duration hard.
- **A 62.6 MB / 43.1 MB video on `assets/videos/` symlinks** — if any of these ever become an LCP candidate or are ever fetched eagerly, LCP is dead. Keep `preload="none"` (already present) and add `loading="lazy"`.
- **`fetchpriority="high"` is absent everywhere.** Chrome gives in-viewport images `Low` priority initially, boosts only *after* layout, and auto-boosts only the first five large images to `Medium`. An explicit hint is strictly better for the hero poster. (Note: `fetchpriority` **cannot be set on `<video poster>`** — preload the poster file with `<link rel="preload" as="image" fetchpriority="high">` instead, per web.dev.)
- **No compression** inflates the discovery→download window for CSS/JS that gate first paint.
- **Third-party ESM from jsDelivr** (`three@0.185.0`, `lenis@1.3.26`) adds DNS + TLS + RTT before the hero can render. `importmap` does not preconnect.

**Fixes, in priority order:**
1. Serve with `Content-Encoding: gzip` (or brotli) + `Cache-Control: public, max-age=31536000, immutable` for hashed/static assets, `Vary: Accept-Encoding`.
2. Repaint the veil so the hero's LCP element paints immediately; never let JS gate first paint.
3. `<link rel="preload" as="image" href="assets/images/poster-sentinel.jpg" fetchpriority="high">` for the hero poster if it is above the fold.
4. Add `fetchpriority="high"` on the hero `<img>`/poster and `fetchpriority="low"` on below-fold images.
5. `<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>` (and `dns-prefetch` as fallback) before the importmap so the Three.js download overlaps with HTML parsing.
6. If a video element genuinely is the LCP element, do **not** lazy-load it; give it a poster + preload of the poster instead.

### 1.3 INP — the metric this site is most likely to fail

INP observes the latency of **all** interactions and reports (near) the worst. It is almost always a **main-thread** problem: long tasks delay the next paint after an interaction.

**Why this site is at risk:**
- A **WebGL render loop** + **canvas scroll animations** + **Lenis smooth scroll** + **IntersectionObserver-driven sticky layers** all share the main thread.
- `app.js` is 54 KB uncompressed of parse+execute work on load.
- `backdrop-filter: blur()` (8 instances) forces expensive compositing on every scroll frame.
- Sticky/scroll animations that read layout (`getBoundingClientRect`) then write styles create **layout thrashing**.

**Fixes:**
- Move genuinely heavy computation off the main thread with Web Workers (the render loop cannot move, but data prep, decoding and post-processing can).
- Break long tasks: yield with `scheduler.yield()` / `await` between batches so input handlers can interleave.
- **Never** do layout reads in the scroll handler; cache measurements and use `requestAnimationFrame`, or drive purely from `transform`/`opacity` (compositor-only properties).
- Reduce DOM size and avoid re-computing style for large subtrees.
- Apply `content-visibility: auto` + `contain-intrinsic-size: <w> <h>` to off-screen sections so their layout/paint is skipped; web.dev measured **232 ms → 30 ms** rendering on initial load (a 7× improvement) in their demo. Off-screen content **stays in the accessibility tree** (unlike `visibility: hidden`), so this is a11y-safe.

Sources: https://web.dev/articles/inp , https://web.dev/articles/optimize-inp , https://web.dev/articles/content-visibility , https://web.dev/articles/optimize-long-tasks

### 1.4 CLS — why media-rich portfolios shift

Per the CLS guide, a shift counts only when an **existing visible element changes its start position** between frames. Score = `impact fraction × distance fraction`, and the reported value is the **largest session window** (shifts <1 s apart, max 5 s window). Shifts within **500 ms of user input** carry the `hadRecentInput` flag and are excluded.

**This site's risks:**
- `<video>` has **no `width`/`height`** — poster decode can resize the box.
- The **modal** injects `#modal-img` and dynamically populated `#modal-metrics`; if the image has no intrinsic dimensions reserved, the dialog reflows on open.
- The **veil removal** changes visibility of the whole hero → if the hero's box isn't already at final size, everything below shifts.
- Font swap (if web fonts are added) — a fallback-vs-webfont metric mismatch is the textbook CLS cause.

**Fixes:**
- Always set `width`/`height` (or `aspect-ratio`) on `<img>`/`<video>`; give the modal image a fixed `aspect-ratio` container.
- Reserve space for JS-populated blocks (skeletons with fixed height).
- If you add web fonts: `<link rel="preload" as="font" type="font/woff2" crossorigin>` + `font-display` strategy + `size-adjust`/`ascent-override` on the fallback `@font-face` so metrics match.
- Animate only `transform`/`opacity` (the guide explicitly notes `transform` is shift-free).

Sources: https://web.dev/articles/cls , https://web.dev/articles/optimize-cls

---

## 2. HEAVY MEDIA — 3 videos (~20–63 MB each)

### 2.1 Current markup vs. recommended markup

**Found:** `<video id="field-video-player" class="video-player-element" data-src="assets/videos/sentinel-15-cctv.mp4" poster="assets/images/poster-sentinel.jpg" preload="none" loop muted playsinline>`

**Recommended attribute set (in a tabbed console, user-initiated):**
- `preload="none"` ✅ keep — web.dev notes the default is `metadata`, which still fetches bytes because the browser cannot know where metadata lives in the file; `none` is the only reliable "fetch nothing."
- `loading="lazy"` **add** — makes the browser defer *both the video and the poster* until near the viewport, and defers autoplay too. Note this attribute must **not** be used if the video is an LCP element.
- `poster="…"` ✅ keep — gives the element its placeholder.
- `width` / `height` on the element (or `aspect-ratio` in CSS) — **add**, CLS.
- `playsinline` ✅ keep — **required for iOS autoplay** (WebKit's policy).
- `muted` ✅ keep — modern browsers block unmuted autoplay.
- `loop` ✅ keep.
- `controls` — add if the user is meant to scrub; if you build custom controls, keep `controls` off but provide full keyboard-accessible custom controls (§4.3).
- `onmouseenter="event.target.setAttribute('preload','metadata')"` — optional enhancement: fetch metadata on hover intent so playback starts faster without loading on idle.
- Replace the single `src` with **multiple `<source>` children with explicit `type`** so the browser picks the codec it can decode without a probe request.

**Poster as LCP:** if a poster is the LCP element, preload it with `fetchpriority="high"` (you cannot set `fetchpriority` on the `poster` attribute yet — a known WHATWG issue), and do **not** add `loading="lazy"`:
```
<link rel="preload" href="assets/images/poster-sentinel.jpg" as="image" fetchpriority="high">
```

Source: https://web.dev/articles/lazy-loading-video , https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video

### 2.2 Codec & container choice

MDN's codec guide (verified current) states support as:

| Codec | Containers | Chrome | Firefox | Safari | Notes |
|---|---|---|---|---|---|
| **AV1** | MP4, WebM | 70+ | 67+ | **17+ but only on hardware-decoder devices** (M3 MacBooks+, iPhone 15 Pro+, iPhone 16+) | Royalty-free; ~50% better than AVC. Safari coverage is the caveat. |
| **AVC (H.264)** | MP4, 3GP | All | All (OS-dependent) | All | Universal. Licensing requirements apply. **Keep as the baseline fallback.** |
| **HEVC / H.265** | MP4 only | partial/OS | partial | Yes | ~half AVC size at equal quality, but **fragile cross-browser on the web**. Do not rely on it as the only source. |
| **VP9** | MP4, WebM, Ogg | Yes | Yes | Yes (recent) | Good royalty-free fallback; broadly safe. |

**Recommendation for this portfolio (no build tooling, static host):**
1. **Always keep an H.264/MP4 source** as the last `<source>` — it is the only universally safe one.
2. **Add a VP9 or AV1/WebM source first** for capable browsers to get the size win. For a portfolio where most traffic is Chrome/Android + Safari/iOS, laying out `AV1/WebM → VP9/WebM → H.264/MP4` captures nearly all savings while keeping a hard fallback for older Apple silicon.
3. Do **not** ship HEVC-only.
4. Re-encode aggressively: **target 1080p max for embedded console videos**, CRF-based two-pass, and drop audio entirely (`-an`) if the videos are silent — audio tracks are pure waste for a muted console clip. A 62 MB clip at 1080p/CRF 28 with no audio should land near 4–8 MB.
5. Use a **short separate loop file** (5–10 s, ~1–2 MB) rather than the full 60 MB recording for any autoplaying background loop.

Sources: https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Video_codecs , https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Containers

### 2.3 Responsive video

- Provide **multiple `<source>` entries** with `media`/size-appropriate renditions (e.g. 720p and 1080p files) — there is no `srcset` for `<video>`, so size selection is done by offering separate `<source>` files or via JS selecting on `matchMedia`.
- For **background/decorative** video: `autoplay muted loop playsinline preload="none" loading="lazy"`, and consider a `<canvas>`/poster-only fallback under `prefers-reduced-motion: reduce` and for users who requested reduced data.
- Keep posters **the same aspect ratio** as the video and compressed (WebP/AVIF where possible; JPEG is fine for a photographic poster).

### 2.4 Avoiding blocking the critical path

- **Never** place background videos in the initial HTML `<video>` with `preload="auto"`.
- Defer *any* video JS to after first paint (`type="module"` is deferred by default — good; keep `app.js` as a module and do not add `defer`/`async` inconsistencies).
- Give the hero canvas and videos a **poster/first frame** so the page looks complete before media arrives.
- Consider `disableRemotePlayback`/`disablePictureInPicture` only if they add no value; they are minor.
- Serve videos from the **same origin** (they are local) so no extra DNS/TLS; but consider a separate subdomain only if you need cookieless caching.

---

## 3. WEBGL / THREE.JS HERO — code-level guidance

**Good news: this implementation is already ahead of the standard.** Verified in `js/hero/tier.js` and `js/hero/scene.js`:

| Best practice | Status on this site |
|---|---|
| DPR cap | ✅ `setPixelRatio(Math.min(devicePixelRatio, maxDpr))`; mobile 1, tablet 1.25, desktop 1.5 |
| `powerPreference` | ✅ `"high-performance"` desktop, `"default"` mobile |
| `antialias` off on low tiers | ✅ `antialias: name === "desktop"` |
| `stencil: false` | ✅ reduces context cost |
| Tier by pointer class **and** width | ✅ catches iPad landscape via `(hover: none) and (pointer: coarse)` |
| Energy-saver / Save-Data detection | ✅ `navigator.connection.saveData` and `navigator.deviceMemory <= 2` |
| Reduced motion | ✅ `prefers-reduced-motion: reduce` → freeze after entrance |
| Frame budget for touch tiers | ✅ `CAP_60 = 1000/60 - 2` with explicit reasoning about 120 Hz |
| Shader-cost knob by tier | ✅ `trailSamples` 28/44/72 controls the per-fragment loop |
| ACES tone mapping | ✅ |
| `dispose()` on texts/geometries | ✅ multiple `dispose()` calls |

### Remaining gaps / recommendations

1. **Pause when off-screen and when the tab is hidden.** There is `tier.js` "freeze on settled frame", but verify there is an explicit `IntersectionObserver` on the hero container that stops the render loop when the hero is fully out of view, and a `document.visibilitychange` handler that stops the loop when `document.hidden`. Both are essential: a portfolio user scrolls away from the hero within seconds, and a hidden tab still burns GPU/CPU and battery otherwise. (The ticker centralises timing, so the clean fix is one gate there.)
2. **Cap work, not just pixels.** Already done via `trailSamples`. Extend the same idea: clamp the number of animated meshes/instanced objects per tier; avoid per-frame allocations (`new Vector3()` in the loop) — pool them.
3. **Frustum culling** is on by default in Three.js, but it is defeated if you set `mesh.frustumCulled = false` or use a single full-screen plane. For this scene the backdrop is intentionally full-screen, so the real lever is **fill rate** — which `trailSamples`, DPR cap and `antialias:false` already address. Keep it that way; do not raise DPR on desktop beyond 1.5 for a decorative hero.
4. **Textures:** author hero textures at the **minimum resolution that survives the max on-screen size**; generate mipmaps (`LinearMipmapLinearFilter` is already imported/used) and use `RepeatWrapping` only where needed (already referenced). For new textures prefer **WebP/AVIF** source images; for compressed GPU-ready delivery use **KTX2/Basis Universal** (a `.ktx2` file decodes to the GPU-native format, avoiding a full CPU decode + upload and cutting VRAM). Since there is no build tooling, KTX2 is a manual pre-step, not a runtime dependency — worth it only if hero textures are large (multi-MB) or numerous.
5. **Shader complexity:** keep fragment loops bounded by a uniform (as `trailSamples` does), avoid dynamic branching in fragment loops, avoid `pow`/`exp`/`sin` in inner loops where a texture lookup or polynomial works, and avoid full-screen `discard` (it disables early-Z).
6. **Mobile degradation strategy (already present):** mobile = DPR 1, `trailSamples` 28, reveal disabled, antialias off, freeze under energy saver. Recommended additions: if the canvas fails to acquire a context (`WebGL context lost`), fall back to a **static poster image** of the hero; and stop the loop entirely when `prefers-reduced-motion` is set (already partly done via `freeze`).
7. **Context-loss handling:** listen for `webglcontextlost` on the canvas and show the poster fallback; do not attempt to recreate the scene on low-tier devices.
8. **Do not load Three.js until the hero is needed.** Three.js from jsDelivr is a cross-origin ESM dependency. Consider `import()` *after* first paint so it never competes with the LCP element, and add the `<link rel="preconnect">`.

Sources: https://threejs.org/manual/#en/optimize-lots-of-objects , https://threejs.org/docs/#api/en/renderers/WebGLRenderer , https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices

---

## 4. ACCESSIBILITY — WCAG 2.2 AA, concrete requirements

All criteria below are **Level AA** unless noted. Source: https://www.w3.org/WAI/WCAG22/quickref/ and the per-criterion Understanding pages.

### 4.1 Contrast (SC 1.4.3 / 1.4.11)
- **Body text:** contrast ratio **≥ 4.5:1** ("normal" = under 18 pt, or under 14 pt bold).
- **Large text:** **≥ 3:1** (≥ 18 pt, or ≥ 14 pt bold; roughly 1.5 em / 1.2 em).
- Ratios are **thresholds and must not be rounded** — 4.499:1 fails 4.5:1.
- Evaluate in **sRGB** unless you have a reason not to.
- **Non-text contrast (SC 1.4.11):** UI component boundaries and states (focus rings, input borders, icon-only controls, video play buttons) need **≥ 3:1** against adjacent colours.
- **This site:** the hero sits over a WebGL canvas; any text over the animated backdrop must be measured against the *worst-case* frame, or given an opaque/scrim backing. `--accent` on `--background` must be checked numerically.

### 4.2 Focus visibility (SC 2.4.7, 2.4.11, 2.4.13)
- **2.4.7 Focus Visible (A):** any keyboard-focusable element has a visible focus indicator.
- **2.4.13 Focus Appearance (AA, new in 2.2):** the indicator must (a) be **at least as large as a 2 CSS-pixel-thick perimeter** of the unfocused component, and (b) have **≥ 3:1 contrast between focused and unfocused states**. A solid `outline: 2px solid` satisfies (a); `outline` on multi-line links is explicitly acceptable.
- **2.4.11 Focus Not Obscured (Minimum):** when a component receives focus, **no part of it may be hidden by author-created content** — this is the sticky-header/footer failure (technique F110). **Directly relevant here:** the masthead is sticky and there are sticky scroll layers; use **`scroll-padding-top`** equal to the sticky header height so focused targets are never under it, and ensure the mobile menu / modal do not cover the focused element.
- **This site:** `css/base.css:93-96` already does `outline: 2px solid var(--accent); outline-offset: 3px` — **verify** `--accent` vs `--background` is ≥3:1, and add `scroll-padding-top` for the sticky masthead.

### 4.3 Keyboard & modal/menu/video patterns
- **SC 2.1.1 Keyboard (A):** everything operable by keyboard; **no pointer-only handlers** (technique F54).
- **Modal (`role="dialog"`)** — the W3C APG modal pattern requires:
  - container has `role="dialog"` (or `<dialog>`) and **`aria-modal="true"`** ✅ present;
  - **`aria-labelledby` pointing to the dialog title, or `aria-label`** ❌ **missing** — add `aria-labelledby="modal-title"`;
  - focus **moves into** the dialog on open ✅ (`js/modal.js:172`);
  - `Tab`/`Shift+Tab` **cycle within** the dialog ✅ (trap at `js/modal.js:200-214`);
  - **`Escape` closes** ✅ (`js/modal.js:220`);
  - **focus returns to the invoking element** on close ✅ (`js/modal.js:181`);
  - **content outside must be inert for both AT and pointer** ❌ — APG is emphatic: only mark `aria-modal="true"` when application code truly prevents interaction outside *and* visual styling obscures it. This site sets `aria-modal="true"` but uses neither `inert` nor `aria-hidden` on the background. **Fix:** put `inert` on the background wrapper (or `aria-hidden="true"` per inert layer, never on an ancestor of the dialog).
- **Mobile menu (fullscreen sheet):** the trigger needs **`aria-expanded="true|false"`** and **`aria-controls="<sheet-id>"`**; the sheet should be a `role="dialog"` (or use `inert` on the page behind), trap focus, close on `Escape`, and return focus to the trigger. Currently the sheet is a plain `<div id="menu-sheet">` with a close button only.
- **Video players (custom controls):** a `<video>` **with `controls`** is keyboard-accessible natively. If you remove `controls` and build your own, you must provide: a focusable play/pause button, keyboard-operable seek and volume, accessible names for each, and visible focus. Do not ship an unlabelled clickable `<div>`.

### 4.4 Motion (SC 2.3.3, 2.2.2)
- **SC 2.3.3 Animation from Interactions (AAA)** is the strict one, but AA portfolios should implement **`prefers-reduced-motion: reduce`** regardless — this site already has JS (`tier.js`) and two CSS blocks. **Extend it to:** the canvas scroll animations (halftone / contour / chequered dissolve), the Lenis smooth scroll, the sticky-layer parallax, and the veil animation. Reduced motion should also disable WebGL reveal, not merely freeze after the entrance.
- **SC 2.2.2 Pause, Stop, Hide (A):** any auto-playing, moving, blinking or scrolling content that lasts >5 s and is presented in parallel with other content needs a **pause/stop/hide** mechanism. **Autoplaying background video is directly in scope** — if any video autoplays, provide a visible pause control (or don't autoplay).

### 4.5 Structure & screen readers (SC 1.3.1, 2.4.1, 4.1.2)
- **Semantic landmarks:** wrap the main content in **`<main>`**; the page currently has `header`, `nav`, `footer`, `section` but **no `main`**. That hurts landmark navigation.
- **SC 2.4.1 Bypass Blocks (A):** provide a **skip link** as the first focusable element inline on focus, targeting the main content (`#main`). **Missing — 0 occurrences.**
- **Headings:** one `<h1>` (present, `#hero-name`), then a logical `h2`/`h3` order. Verify the modal's `h2#modal-title` is not skipped into an illogical order.
- **Text alternatives (SC 1.1.1):** every meaningful image needs `alt`; decorative ones `alt=""`. The modal image currently uses `alt="System Artifact"` — that is a placeholder, not a description; gallery/dossier images need image-specific alt text.
- **Canvas & WebGL:** a `<canvas>` is invisible to AT. Give the hero canvas **`aria-hidden="true"`** if purely decorative **and** ensure the same information exists as real text/HTML; if the canvas encodes meaningful content, provide an accessible alternative (a text summary associated via `aria-describedby`).
- **Time-based media (SC 1.2.2 Captions (A), 1.2.3 Audio Description (A)):** if any video has meaningful speech, **captions are required at Level A**; audio description for visual-only information. If the console videos have narration, add `<track kind="captions">`. For silent demo loops, document that there is no audio track.
- **SC 1.4.10 Reflow / 1.4.12 Text Spacing:** content must work at 320 CSS px width without two-dimensional scrolling, and survive user text-spacing overrides. Test the tabbed console and the modal at 320 px and at 400% zoom.
- **SC 2.5.7 Dragging Movements (AA, new in 2.2):** any drag operation (e.g. a slider or drag-to-compare) needs a single-pointer non-dragging alternative.
- **SC 3.3.7 Redundant Entry (A), 3.3.8 Accessible Authentication (AA, new in 2.2):** relevant only if you add a contact form / gated area.

### 4.6 Target size (SC 2.5.8, Level AA, new in 2.2)
- Pointer targets must be **at least 24 × 24 CSS pixels**, except:
  - **Spacing:** undersized targets pass if a 24 CSS-px-diameter circle centred on each target does not intersect another target's circle;
  - **Equivalent / Inline / Essential** exceptions.
- The requirement is **independent of zoom** — you cannot claim the user will zoom. A solid 24×24 CSS-px square must fit entirely inside the target.
- **This site:** the masthead nav links, the modal close button, the menu-sheet links, and especially the **tab buttons in the tabbed video console** are the risk points. Best practice per W3C is to meet 24×24 outright, and for important controls aim at the stricter **2.5.5 Target Size (Enhanced) = 44 × 44 CSS px** (which also matches Apple's 44 pt and Android's 48 dp guidance).

Sources: https://www.w3.org/WAI/WCAG22/quickref/ , https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html , https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html , https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html , https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/ , https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/

---

## 5. SEO & SOCIAL — meta, Open Graph, JSON-LD, canonical, sitemap

### 5.1 Current state: essentially nothing
`index.html` has `<title>`, `meta description`, `charset`, `viewport` — and **no** `canonical`, **no** `og:*`, **no** `twitter:*`, **no** JSON-LD, **no** manifest. Shared on LinkedIn/X today, it will render a bare or broken card.

### 5.2 Exact tags to add (values illustrative for this site)

```html
<link rel="canonical" href="https://<your-domain>/" />

<!-- Open Graph (ogp.me) -->
<meta property="og:type" content="profile" />
<meta property="og:title" content="Ryas Rafi Karim — AI Systems & Edge Vision Engineer" />
<meta property="og:description" content="Computer vision, edge AI, TensorRT optimisation and enterprise local LLMs — production systems across 26 marine vessels and 3,000+ CCTV cameras." />
<meta property="og:url" content="https://<your-domain>/" />
<meta property="og:site_name" content="Ryas Rafi Karim" />
<meta property="og:locale" content="en_US" />
<meta property="og:image" content="https://<your-domain>/assets/images/og-card.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Portfolio hero: edge-vision console over a maritime analytics dashboard" />
<meta property="profile:first_name" content="Ryas Rafi" />
<meta property="profile:last_name" content="Karim" />

<!-- X / Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Ryas Rafi Karim — AI Systems & Edge Vision Engineer" />
<meta name="twitter:description" content="Edge vision, TensorRT optimisation and local LLM agents in production." />
<meta name="twitter:image" content="https://<your-domain>/assets/images/og-card.jpg" />
<meta name="twitter:image:alt" content="Portfolio hero and AI deployment console" />
```

Rules verified from ogp.me: `og:title`, `og:type`, `og:image`, `og:url` are the four **required** properties; `og:image:width`, `og:image:height`, `og:image:alt` are recommended structured sub-properties, and **if you specify `og:image` you should specify `og:image:alt`**. Use absolute, HTTPS, publicly reachable URLs. LinkedIn and X both fall back to `og:*` when `twitter:*` is absent, so the OG block alone already fixes LinkedIn.

Feature-image guidance: **1200×630 px**, ≤ ~5 MB, JPEG/PNG, no text near edges (LinkedIn crops it), safe-zone margins ~60–80 px. Source: https://ogp.me/

### 5.3 Structured data — JSON-LD `Person` on a `ProfilePage`

Google's `ProfilePage` documentation states the markup is for "any site where creators (either people or organizations) share first-hand perspectives." For a personal portfolio, the recommended shape is `ProfilePage` whose `mainEntity` is a `Person`:

```json
{
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "dateCreated": "2024-01-01T00:00:00+07:00",
  "dateModified": "2026-09-12T00:00:00+07:00",
  "mainEntity": {
    "@type": "Person",
    "name": "Ryas Rafi Karim",
    "jobTitle": "AI Systems & Edge Vision Engineer",
    "url": "https://<your-domain>/",
    "image": "https://<your-domain>/assets/images/me.jpg",
    "description": "AI Systems Engineer specialising in computer vision, edge AI, TensorRT optimisation and enterprise local LLMs.",
    "email": "mailto:ryasrafikarim123@gmail.com",
    "knowsAbout": [
      "Computer Vision",
      "Edge AI",
      "TensorRT",
      "Large Language Models",
      "Video Analytics"
    ],
    "worksFor": { "@type": "Organization", "name": "PT Bali Towerindo Sentra Tbk" },
    "sameAs": [
      "https://www.linkedin.com/in/<handle>",
      "https://github.com/<handle>",
      "https://x.com/<handle>"
    ]
  }
}
```

Notes:
- `sameAs` is the single strongest entity signal — it ties the page to your LinkedIn/GitHub profiles in Google's Knowledge Graph. Populate it with **every** profile you own.
- `Person` properties worth adding where true: `alumniOf`, `knowsLanguage`, `award`, `address`.
- Validate with the **Rich Results Test** (https://search.google.com/test/rich-results) before shipping.
- Put the JSON-LD in a single `<script type="application/ld+json">` in `<head>` or end of `<body>`.

Sources: https://developers.google.com/search/docs/appearance/structured-data/profile-page , https://schema.org/Person , https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data

### 5.4 Canonical, sitemap, robots

- **Canonical:** include a **self-referential** `<link rel="canonical">` on the canonical page itself. Don't use `noindex` to manage canonicals; don't declare conflicting canonicals across techniques (sitemap vs `rel="canonical"`). Use only one canonical URL per page.
- **`robots.txt`** at site root. Minimal:
  ```
  User-agent: *
  Allow: /
  Sitemap: https://<your-domain>/sitemap.xml
  ```
  Remember: `robots.txt` **does not remove a page from Google** — it manages crawl traffic only; a blocked URL can still appear in results. For exclusions use `noindex` or auth.
- **`sitemap.xml`** at site root: UTF-8, `<?xml version="1.0" encoding="UTF-8"?>`, `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`, one `<url><loc>…</loc></url>`. Limits: **50 MB uncompressed or 50,000 URLs** per file; reference it from `robots.txt` with the `Sitemap:` line. For a one-page portfolio this is small but still worth having so the URL is discoverable and re-crawlable.
- Additional: `<meta name="theme-color">` for mobile browser chrome; a `rel="manifest"` if you want installability (optional for a portfolio).

Sources: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls , https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap , https://developers.google.com/search/docs/crawling-indexing/robots/intro

---

## 6. FONT LOADING

**Current state:** the HTML comment mentions "Google Fonts: Oswald, Space Grotesk, JetBrains Mono" but **no font `<link>` exists** — the site renders in system Arial. This is actually the fastest, most private, and most CLS-safe option. Any move to web fonts is a **performance cost**, so do it deliberately.

If you keep system fonts: nothing to do; consider a deliberate stack (e.g. `ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial`) for cross-platform consistency. System fonts have **zero** download cost, no FOIT, no FOUT, no CLS.

If you adopt web fonts (web.dev best practices, https://web.dev/articles/font-best-practices):

1. **Self-hosting is not automatically faster — be careful.** web.dev's own guidance is explicitly nuanced: "On paper, using a self-hosted font should deliver better performance as it eliminates a third-party connection setup. In practice, the performance differences between these two options is less clear cut" — the Web Almanac found sites using third-party fonts rendered *faster* than first-party fonts. The page then states that self-hosting is only likely to win **if your site uses a CDN and HTTP/2**. This site currently runs an HTTP/1.0 dev server with no gzip and no CDN, so a self-hosted font would likely be **slower** than Google Fonts' optimised CDN. Decide after fixing §9 items 1 and 30: once you have gzip + HTTP/2 + long-lived caching, self-hosting becomes the better choice because it removes a third-party origin and the render-blocking third-party CSS hop.
2. **Use `woff2` only** — universally supported, smallest.
3. **Preload with care** — web.dev warns that `preload` "comes at the cost of taking away browser resources from the loading of other resources" and **bypasses `unicode-range`** (it loads the whole font, ignoring subsets), so preload **only a single font format** and only the font used by above-the-fold text:
   ```html
   <link rel="preload" href="/fonts/oswald-v49-latin-600.woff2" as="font" type="font/woff2" crossorigin>
   ```
   `crossorigin` is mandatory even same-origin for fonts; without it the preload is wasted and the font is fetched twice.
4. **`font-display: swap`** (or `optional`) — web.dev's guidance is that a swap trades a brief FOUT for never blocking text; `optional` eliminates CLS entirely by only using the webfont if it arrives within ~100 ms. For a hero headline, `swap` + a metric-matched fallback is the usual choice.
5. **Reduce layout shift on swap** with `size-adjust`, `ascent-override`, `descent-override`, `line-gap-override` on a local `@font-face` fallback so the fallback's metrics match the webfont. This is the difference between a visible jump and none.
6. **Subset** to the characters you actually use (`unicode-range` + a Latin-only subset is typically a 60–80% size cut vs the full font). Subsetting requires a pre-step (you have no build tooling, so do it once manually with `glyphhanger`/`fonttools pyftsubset` and commit the result).
7. **Prefer variable fonts** if you need multiple weights — one file replaces N static files. But **don't** preload a variable font if you only use one or two instances of it; a full-axis variable font can be larger than two subsets of two weights. Only preload the *one* font used for the LCP text.
8. Avoid `local()` in `src` on Safari (it can pick a corrupt local copy); modern practice is to omit it.

---

## 7. MOBILE & RESPONSIVE

### 7.1 Breakpoints
- The CSS already uses semantic breakpoints and a `hide-below-sm` utility; `tier.js` uses 768 / 1024 / 1280 with a coarse-pointer clause. Keep a small set (e.g. ~480, 768, 1024, 1280) and prefer **container queries** where a component (the tabbed console, the dossier modal) should respond to its own width rather than the viewport.
- **Test at 320 CSS px** (SC 1.4.10 Reflow): no horizontal scrolling except for content that legitimately requires 2D (data tables, maps, the console if it truly needs it).

### 7.2 Touch targets
- **24 × 24 CSS px minimum** (WCAG 2.5.8 AA, §4.6).
- **44 × 44 CSS px** is the platform-grade target (Apple HIG 44 pt; Material 48 dp) and satisfies the stricter 2.5.5. Use 44 as the design default for masthead links, tab buttons, close buttons, and menu-sheet links.
- Ensure ≥8 px spacing between adjacent small targets, or meet the 24-px-circle spacing exception.

### 7.3 iOS Safari specifics
- **Video autoplay:** requires `muted`, `playsinline` (and `autoplay`). Without `playsinline`, iOS forces fullscreen playback — this site already has it ✅. Audio must be muted or user-initiated.
- **`100vh`** is unreliable on iOS Safari (the URL bar changes the viewport). Replace `100vh` (`css/sections.css:160,352`) with **`100dvh`** (dynamic) or `100svh` (small, for always-filled backgrounds). Provide `100vh` as a fallback line before `100dvh` for older engines.
- **`backdrop-filter`** is supported in Safari but **expensive**; it is applied 8× here. On low-end devices it can drop frames during scroll. Gate the heavy blurs behind `@supports (backdrop-filter: blur(1px))` **and** a coarse-pointer / `prefers-reduced-motion` fallback to a solid translucent colour. Note Safari historically needs `-webkit-backdrop-filter` for older versions.
- **Safe areas:** `viewport-fit=cover` is set ✅, and `safe-area-inset-*` is used in 2 places ✅ (`components.css:551,621`). Ensure the fixed masthead and the mobile menu sheet respect `env(safe-area-inset-top/bottom)` (they do), and that the modal's internal scroll area does too.
- **Momentum/rubber-band:** Lenis smooth-scroll + `data-lenis-prevent` inside the modal is used — verify `-webkit-overflow-scrolling: touch` behaviour on the modal body and that background scroll is actually locked.
- **Input zoom:** input font-size must be **≥16 px** on iOS or Safari zooms on focus. Relevant if you add a contact form.

---

## 8. MEASUREMENT TOOLS & REALISTIC TARGETS

| Tool | What it gives | Realistic target for THIS site |
|---|---|---|
| **Lighthouse** (lab) | Synthetic single-run scores; the CWV weight in "Performance" | **Performance ≥ 90 desktop / ≥ 80 mobile**; **Accessibility = 100**; **Best Practices ≥ 95**; **SEO = 100** (trivially achievable once §5 is done). |
| **PageSpeed Insights** | Lab (Lighthouse) + **field CrUX** for the origin | CrUX only exists for origins with enough traffic; a personal portfolio usually has **no CrUX data**, so PSI will show lab only. Use lab for regression, not as truth. |
| **WebPageTest** | Multi-run, filmstrip, connection throttling, repeat-view | Use for the video/veil timing: verify **LCP < 2.5 s and no shift after first paint** on "Motorola G4 / 4G" or "Moto G Power" profiles. |
| **Chrome DevTools Performance / Coverage** | Long tasks, layout thrashing, unused CSS/JS | Find the INP culprits: look for tasks >50 ms during scroll and after tab/video clicks. |
| **crUX / RUM** | Real user p75 | If you add RUM (`web-vitals` JS from a CDN or inlined), you get real INP per interaction. Recommended for a portfolio that actually gets traffic. |

**Honest tradeoffs for a media-rich portfolio:**
- A **WebGL hero + 60 MB video + canvas scroll effects** will **not** score 100 on mobile Lighthouse, and chasing it will destroy the design. The defensible target is: **lab Performance ≥ 80 mobile**, **all three CWV "good" in the field** (LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1), **Accessibility 100**, **SEO 100**.
- **LCP and CLS are non-negotiable** — they are cheap to fix (compression, poster, dimensions, no JS-gated paint).
- **INP is the hard one** for this design; it is won by moving work off the main thread and by not doing layout reads in scroll handlers, not by shrinking images.
- The videos should be treated as **on-demand** (tabbed console) and **re-encoded** — a 20–30 MB target per video is still 5–10× too big; aim for **2–8 MB** per console clip at 1080p, and ~1–2 MB for any looping background clip.
- Enable compression, long-lived caching and (where possible) HTTP/2 or HTTP/3 on the host — the current `SimpleHTTP/0.6 Python/3.12.3` dev server sends **HTTP/1.0, no compression, no cache headers**, which alone caps Lighthouse Performance.

---

## 9. PRIORITIZED FIX LIST

### CRITICAL (do first — largest metric impact, low effort)
1. **Enable gzip/brotli + cache headers on the static host.** ~70–80% text-asset reduction; the single biggest LCP/TTFB win. (Currently HTTP/1.0 with no `Content-Encoding`, no `Cache-Control`.)
2. **Re-encode the 3 videos** to 1080p H.264 + a VP9/AV1 WebM variant, **drop audio if silent**, target **2–8 MB each** (from 22.7/43.1/62.6 MB). Add explicit `<source type="…">` children; keep `preload="none"` + `playsinline` + `muted`, add `loading="lazy"` and `width`/`height`.
3. **Stop JS from gating first paint.** Ensure the hero's LCP element paints immediately behind/without the `#loading-veil`, and hard-cap the veil duration.
4. **Add the SEO/social head block (§5.2):** canonical, OG, Twitter. Zero-effort, fixes LinkedIn/X previews entirely.
5. **Add `robots.txt` + `sitemap.xml`** at site root.
6. **Add a skip link** and wrap content in **`<main id="main">`** (WCAG 2.4.1 / 1.3.1).
7. **Modal a11y:** add `aria-labelledby="modal-title"` to `#modal-backdrop`, and set **`inert`** on the background while it is open (currently `aria-modal="true"` without inert background).
8. **Mobile menu a11y:** give the open button `aria-expanded` + `aria-controls`, make the sheet a labelled `role="dialog"`, trap focus, restore focus on close.

### HIGH (structural, high impact)
9. **`<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>`** (and consider `dns-prefetch`) before the importmap; consider deferring the Three.js `import()` until after first paint.
10. **`fetchpriority="high"`** on the hero poster/image; preload the poster with `as="image"`. `fetchpriority="low"` on below-fold images.
11. **Add `width`/`height` or `aspect-ratio`** to every `<img>`/`<video>` and to the modal media frame (CLS).
12. **Add the JSON-LD `ProfilePage`/`Person`** block with a fully populated `sameAs` list.
13. **INP work:** audit for long tasks and layout thrashing; move non-render work to Web Workers; cache layout reads; animate only `transform`/`opacity`. Add `content-visibility: auto` + `contain-intrinsic-size` to off-screen sections.
14. **Gate `backdrop-filter` blurs** behind `@supports` + a coarse-pointer/reduced-motion fallback (8 instances today).
15. **Replace `100vh` with `100dvh`** (2 places) with a `100vh` fallback line.
16. **WebGL loop lifecycle:** verify/implement stop-on-off-screen (`IntersectionObserver`) and stop-on-hidden-tab (`visibilitychange`), plus a `webglcontextlost` → poster fallback.
17. **Reduced-motion coverage:** extend `prefers-reduced-motion` to the canvas scroll animations, Lenis smooth scroll, and sticky parallax — not just the WebGL entrance.
18. **Touch targets:** ≥24×24 CSS px everywhere (WCAG 2.5.8), aim for 44×44 on masthead links, tab buttons, and close buttons.
19. **`scroll-padding-top`** equal to the sticky masthead height (WCAG 2.4.11).

### MEDIUM
20. **Contrast audit over the WebGL hero** and for `--accent` on `--background`; add scrims where text sits over animation.
21. **Modal image `alt` text** — replace the generic `"System Artifact"` with per-project descriptions.
22. **Captions (`<track kind="captions">`)** if any console video has meaningful narration (WCAG 1.2.2, Level A).
23. **Decorative canvas:** `aria-hidden="true"` on the hero canvas if purely decorative, with equivalent text in HTML.
24. **Hero textures:** WebP/AVIF sources; consider KTX2/Basis only if textures are large/numerous. Keep mipmaps and cap texture resolution to on-screen need.
25. **`theme-color` meta** for mobile browser chrome.
26. **`prefers-reduced-motion` alternative for the poster/loop** and a `Save-Data` path that skips the WebGL hero entirely.
27. **Re-run Lighthouse Accessibility to 100** after the a11y fixes.

### NICE-TO-HAVE
28. Self-host a subsetted variable font only if the design truly needs one (§6); otherwise keep the system stack.
29. Add lightweight RUM (`web-vitals`) to get real field INP per interaction.
30. HTTP/2 or HTTP/3 + immutable caching for hashed assets if you ever introduce hashing.
31. Personalized "Add to Calendar"/`sameAs`-rich entity work (e.g. `alumniOf`, `award`) in the Person schema.
32. WebPageTest filmstrip regression run on a Moto G4 profile before each release.

---

## 10. SOURCE INDEX (all fetched directly)

Core Web Vitals & performance
- https://web.dev/articles/vitals
- https://web.dev/articles/defining-core-web-vitals-thresholds
- https://web.dev/articles/lcp
- https://web.dev/articles/optimize-lcp
- https://web.dev/articles/cls
- https://web.dev/articles/optimize-cls
- https://web.dev/articles/inp
- https://web.dev/articles/optimize-inp
- https://web.dev/articles/fetch-priority
- https://web.dev/articles/content-visibility
- https://web.dev/articles/font-best-practices

Media
- https://web.dev/articles/lazy-loading-video
- https://web.dev/articles/video-and-source-tags
- https://web.dev/articles/preload-critical-assets
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video
- https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Video_codecs
- https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Containers

WebGL / Three.js
- https://threejs.org/manual/#en/optimize-lots-of-objects
- https://threejs.org/docs/#api/en/renderers/WebGLRenderer
- https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices

Accessibility
- https://www.w3.org/WAI/WCAG22/quickref/
- https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion

SEO & social
- https://ogp.me/
- https://schema.org/Person
- https://developers.google.com/search/docs/appearance/structured-data/profile-page
- https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://developers.google.com/search/docs/crawling-indexing/robots/intro
