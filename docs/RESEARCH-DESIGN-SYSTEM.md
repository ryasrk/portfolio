# Top-Tier Design Systems Research Report — 2024–2026 Standards
### For: Ryas Rafi Karim — AI Systems & Edge Vision Engineer (Jakarta, Indonesia)
### Deliverable: Definitive, implementable design specification (no code)

---

## 0. RESEARCH METHOD & SOURCE-QUALITY NOTE

**Tool status (important context):** `web_search` hard-failed for the entire session (repeated provider HTTP 404), and several hosts were unreachable via `web_fetch`. Evidence below is therefore drawn from **primary sources fetched directly** (W3C/WAI specs, web.dev, MDN, NN/g, Tailwind v4 theme source, Vercel Geist docs, Anthropic's live CSS, Linear's live CSS/brand page, Google Fonts), plus **direct inspection of production design tokens** from award-caliber technical sites. Where a claim is inference rather than a citable fact, it is marked **[INFERENCE]**. Raw fetched evidence is preserved at `/tmp/RESEARCH-REPORT-ryas-design-system.md` (this file).

**Primary sources used (all fetched, HTTP 200):**
- W3C WCAG 2.2 — Contrast Minimum: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- W3C WCAG 2.2 — Non-text Contrast: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- W3C WCAG 2.2 — Animation from Interactions: https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
- W3C WCAG 2.2 — Focus Appearance: https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html
- W3C WCAG 2.2 Quickref: https://www.w3.org/WAI/WCAG22/quickref/
- web.dev — `prefers-reduced-motion`: https://web.dev/articles/prefers-reduced-motion
- web.dev — High-performance CSS animations: https://web.dev/articles/animations-guide
- web.dev — Learn Design: Typography: https://web.dev/learn/design/typography
- NN/g — "Executing UX Animations: Duration and Motion Characteristics": https://www.nngroup.com/articles/animation-duration/
- MDN — `<easing-function>`: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/easing-function
- MDN — `oklch()`: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch
- MDN — `backdrop-filter`: https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter
- MDN — `animation-timeline`: https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline
- MDN — `<feTurbulence>`: https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feTurbulence
- Tailwind CSS v4 `theme.css` (source of truth for tokens): https://raw.githubusercontent.com/tailwindlabs/tailwindcss/main/packages/tailwindcss/theme.css
- Vercel Geist Design System: https://vercel.com/geist/{introduction,colors,typography,materials,grid}
- Vercel Geist Font: https://vercel.com/font
- Linear brand & production CSS: https://linear.app/brand , https://linear.app (confirms `https://static.linear.app/fonts/InterVariable.woff2`)
- Anthropic production CSS tokens (fluid `clamp()` scale): https://www.anthropic.com
- Inter: https://rsms.me/inter/ , https://github.com/rsms/inter (license: SIL OFL 1.1)
- Geist font: https://github.com/vercel/geist-font (license: SIL OFL 1.1)
- Refactoring UI (Wathan/Schoger tactics): https://www.refactoringui.com/
- Typescale ratios: https://typescale.com/ (Minor Third 1.200, Major Third 1.250, Perfect Fourth 1.333, Perfect Fifth 1.500, Golden Ratio 1.618)

---

## 1. TYPOGRAPHY SYSTEMS FOR TECHNICAL / AI PORTFOLIOS

### 1.1 The Arial / Times New Roman verdict — **DEFINITIVE**

**Arial is not viable for a top-tier/award-caliber technical portfolio. Neither is Times New Roman. Replace both.**

Reasons, grounded in evidence:

1. **Arial is the browser *fallback*, not a design decision.** Tailwind CSS v4's own default sans stack ends with `Arial, sans-serif` — i.e. Arial is literally what production-grade frameworks use as the last-resort fallback: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', Arial, sans-serif`. Source: `https://raw.githubusercontent.com/tailwindlabs/tailwindcss/main/packages/tailwindcss/theme.css`. Similarly Times New Roman appears in Tailwind's *serif fallback tail*: `ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif`. When a designer hands off Arial as the primary face, it signals "I stopped at the default." **[INFERENCE — but strongly supported: it sits in the fallback position of the industry-standard framework.]**

2. **Arial has no credible technical heritage.** It is a 1982 Monotype Helvetica clone licensed with Windows. Every serious technical brand has invested in a bespoke or OFL licensed face: Vercel commissioned **Geist** (explicitly "specifically designed for developers and designers… drawing inspiration from the renowned Swiss design movement"); Linear ships **Inter** (confirmed: `https://static.linear.app/fonts/InterVariable.woff2`); Anthropic ships a custom fluid display system. Arial reads as "unstyled localhost."

3. **Arial has weak technical features for an AI/vision portfolio.** It lacks first-class monospace numerals, no variable weight axis, no optical-size axis, no slashed zero, no tabular figures by default. An "Edge Vision Engineer" whose credibility depends on numbers (FPS, mAP, latency, IoU) needs **tabular figures** and a **true mono** for data.

4. **Times New Roman is worse** — it is a 1931 newspaper type reviving 19th-century transitional serif, reads as a Word document, and has zero association with modern AI/edge systems.

**Exception (partial):** A *system-ui* stack is defensible **only** if you deliberately own it as a "brutalist / OS-native" aesthetic (e.g. a site that renders in San Francisco on macOS and Segoe Variable on Windows). That is a deliberate, risky art direction — not a default. The safer, higher-credibility move is to **explicitly self-host an OFL face**. **[INFERENCE]**

### 1.2 What top-tier technical portfolios actually use

| Tier of face | What top sites use | Evidence |
|---|---|---|
| **Geometric / neo-grotesque sans (default choice)** | **Inter**, **Geist Sans**, SF Pro, Untitled Sans | Linear ships `InterVariable.woff2` (`https://static.linear.app/fonts/InterVariable.woff2`); Vercel built Geist Sans + Geist Mono; Inter's own site is presented as "the 21st century standard" |
| **Distinctive display sans** | Geist Sans, Space Grotesk, Söhne, GT America, Founders Grotesk | Vercel Geist docs; Space Grotesk free |
| **Monospace for data/code** | **Geist Mono**, **JetBrains Mono**, **IBM Plex Mono**, Berkeley Mono | Vercel ships Geist Mono; both Geist Mono and JetBrains Mono are on Google Fonts and GitHub |
| **Editorial serif (contrast/accent)** | Instrument Serif, Newsreader, Fraunces | Anthropic uses a display serif token: `var(--_typography---font--display-serif-family)` |
| **NO ONE** award-caliber | Arial, Times New Roman, Courier New, Comic Sans, Papyrus | Arial/Times only appear as fallback tails |

### 1.3 The recommended type construct: a **one-superfamily + mono** system

Award-caliber technical portfolios in 2024–2026 overwhelmingly use **one variable sans superfamily** (not a decorative serif+sans pairing) plus **one monospace** for data, labels, and numerals. This is the Vercel/Linear/Anthropic pattern. It reads as engineered, not styled.

**Three concrete, free, OFL-licensed options (pick one — see §7 for the definitive pick):**

| Slot | OPTION A — "Geist" (Vercel-native) | OPTION B — "Inter" (Linear-native, max ubiquity) | OPTION C — "Space Grotesk + JetBrains" (distinctive) |
|---|---|---|---|
| Display / headings | **Geist Sans** | **Inter** (variable, optical size) | **Space Grotesk** |
| Body / UI | **Geist Sans** | **Inter** | **Inter** or **DM Sans** |
| Monospace (data) | **Geist Mono** | **Geist Mono** or **JetBrains Mono** | **JetBrains Mono** |
| Optional editorial accent | — | — | **Instrument Serif** (only for pull-quotes) |
| Source | Google Fonts: https://fonts.google.com/specimen/Geist ; GitHub: https://github.com/vercel/geist-font | https://rsms.me/inter/ ; https://github.com/rsms/inter ; Google Fonts: https://fonts.google.com/specimen/Inter | Google Fonts: https://fonts.google.com/specimen/Space+Grotesk ; https://fonts.google.com/specimen/JetBrains+Mono ; https://github.com/JetBrains/JetBrainsMono |
| License | SIL OFL 1.1 (verified) | SIL OFL 1.1 (verified) | SIL OFL 1.1 (all) |
| Why | Officially "designed for developers"; Swiss-minimal; pairs perfectly with a mono sibling; still feels premium and slightly less over-used than Inter | The most battle-tested UI face on earth; variable + optical size; ships tabular & slashed-zero features; used by Linear | Highest visual distinctiveness; Space Grotesk's quirky `g`/`R` gives a memorable technical personality |

**All fonts above verified live (HTTP 200) on Google Fonts CSS API:** Inter, Geist, Geist Mono, JetBrains Mono, IBM Plex Mono, Space Grotesk, Instrument Serif, DM Sans, Manrope, Sora, Outfit, Fraunces, Newsreader.

**OpenType features to enable (evidence-based):**
- Inter: `font-feature-settings: 'liga' 1, 'calt' 1` — Inter's own site notes this as a Chrome fix, and Inter documents `slashed zero`, tabular numbers, and contextual alternates. Source: https://rsms.me/inter/
- Data/numerals everywhere: `font-variant-numeric: tabular-nums` — Vercel Geist's type system explicitly calls this out ("Label 13 … with **Tabular (123)** … used when conveying numbers for consistent spacing"), and Vercel's homepage ships `font-feature-settings: tnum`. Source: https://vercel.com/geist/typography
- Use `slashed zero` (`zero`) in mono for IDs, hashes, latency figures.

### 1.4 Type scale ratios — what to use and why

Typescale documents the canonical ratios: Minor Second 1.067, Major Second 1.125, **Minor Third 1.200**, **Major Third 1.250**, Perfect Fourth 1.333, Augmented Fourth 1.414, Perfect Fifth 1.500, Golden Ratio 1.618. Source: https://typescale.com/

Guidance:
- **1.250 (Major Third)** — the safest premium technical choice; Vercel's Geist heading ladder (72/64/56/48/40/32/24/20/16/14) is close to a **1.125–1.25 hybrid emphasizing the top** (72→64 = 1.125, 64→56 = 1.143, 56→48 = 1.167, 48→40 = 1.2, 40→32 = 1.25, 32→24 = 1.333). This **tightening at the top** is the signature of the modern "engineered" look: big display sizes are spaced *closely* so the hero feels dense and confident, not airy. Sources: https://vercel.com/geist/typography , https://typescale.com/
- **1.333 (Perfect Fourth)** — use if you want a more editorial, dramatic hero.
- **1.618 (Golden Ratio)** — **avoid for body-adjacent scales**; jumps become absurd above 3 steps. Fine for a single display/nav contrast. **[INFERENCE]**
- **Fluid `clamp()` is now standard at the top end.** Anthropic's live tokens are the best public example: `--font-size--display-xxl: clamp(3rem, 2.3877551020408165rem + 2.612244897959184vw, 5rem)` and `--font-size--display-xl: clamp(2.5rem, 2.04rem + 1.959vw, 4rem)`. Source: https://www.anthropic.com (inspected live CSS).

**Concrete scale to implement (Major Third 1.25 base 16px, fluid above 2rem):**
| Token | Size | Line-height | Weight | Tracking | Use |
|---|---|---|---|---|---|
| `display-xl` | `clamp(3rem, 2.4rem + 2.6vw, 5rem)` → 48–80px | 1.0 | 600 | `-0.03em` | Hero name / thesis |
| `display-l` | `clamp(2.5rem, 2rem + 2vw, 4rem)` → 40–64px | 1.05 | 600 | `-0.025em` | Section titles |
| `display-m` | `clamp(2rem, 1.7rem + 1.3vw, 3rem)` → 32–48px | 1.1 | 600 | `-0.02em` | Sub-section |
| `h3` | 1.75rem / 28px | 1.2 | 600 | `-0.015em` | Project titles |
| `h4` | 1.375rem / 22px | 1.3 | 600 | `-0.01em` | Card titles |
| `body-lg` | 1.125rem / 18px | 1.65 | 400 | `0` | Lead paragraph |
| `body` | 1rem / 16px | 1.7 | 400 | `0` | Body |
| `body-sm` | 0.875rem / 14px | 1.6 | 400 | `0` | Captions |
| `label` | 0.75rem / 12px | 1.4 | 500 | `0.06em` UPPERCASE | Eyebrow / category |
| `mono-sm` | 0.8125rem / 13px | 1.5 | 400 | `0` tabular | Data, metrics |
| `mono-xs` | 0.6875rem / 11px | 1.5 | 500 | `0.04em` UPPERCASE | Chips, kbd, IDs |

**Negative tracking on large sizes is non-negotiable for the premium feel** — optical correction, mirrors what Anthropic/Linear/Vercel do. **[INFERENCE, standard practice]**

### 1.5 Arial → replacement mapping (drop-in)
- `font-family: Arial` → `font-family: 'Geist', 'Inter', system-ui, sans-serif` (self-host; do not leave Arial in the visible stack)
- Headings weight: Arial default 400 → use **600** for display, **500** for labels (Arial only has 400/700, which is why current headings look thin or crude)
- Add `font-feature-settings: 'liga' 1, 'calt' 1, 'ss03' 1` sparingly; always `tnum` on numeric UI
- Set `-webkit-font-smoothing: antialiased` and `text-rendering: optimizeLegibility` for the crisp look at 13–16px

---

## 2. COLOR SYSTEMS

### 2.1 2025–2026 strategy, evidence-based

**Direction: monochrome neutral foundation + ONE functional accent, expressed in OKLCH.**
- Tailwind v4 migrated its entire palette to **OKLCH** (e.g. `--color-zinc-500: oklch(55.2% 0.016 285.938)`). OKLCH is the current professional default because lightness is perceptually uniform: a `zinc-500` and an `emerald-500` have the *same perceived lightness*, so ramps stay balanced. Source: https://raw.githubusercontent.com/tailwindlabs/tailwindcss/main/packages/tailwindcss/theme.css ; https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch
- **Neutral-first**: Vercel Geist's color system is built around **two backgrounds + 10 semantic roles** (Background 1/2; Colors 1–3 component backgrounds; 4–6 borders; 7–8 high-contrast; 9–10 text/icons). This "roles, not colors" model is the standard for technical products. Source: https://vercel.com/geist/colors
- **Never more than one accent hue** on a technical portfolio. Multiple accents read as amateur. **[INFERENCE]**
- **Light vs dark:** both are credible in 2025–26. Light monochrome = "Swiss/architectural, engineering-document". Dark = "terminal/infrastructure". **For an AI Systems & Edge Vision Engineer, a light-first monochrome with a dark mode is the strongest differentiator** because almost every AI portfolio defaults to dark "AI glow" purple. Standing out *away* from the crowd is how award juries notice. **[INFERENCE — but consistent with Geist/Linear/Vercel all shipping light-first.]**

### 2.2 Accent psychology for AI / vision — and a critical audit of your current color

**Your current accent `#10b981` (emerald-500) FAILS WCAG AA for text.** Computed contrast ratios (sRGB, WCAG 2.x relative-luminance formula, per §1.4.3 of WCAG 2.2 — 4.5:1 normal text, 3:1 large text and non-text UI):

| Pair | Ratio | Verdict |
|---|---|---|
| `#10b981` on `#fafaf9` | **2.43:1** | ❌ FAILS even the 3:1 large-text / non-text threshold |
| `#059669` (emerald-600) on `#fafaf9` | 3.61:1 | ⚠️ passes non-text (3:1) only |
| `#047857` (emerald-700) on `#fafaf9` | **5.25:1** | ✅ passes AA text |
| `#34d399` (emerald-400) on `#0c0a09` | 10.28:1 | ✅ excellent on dark |
| `#10b981` on `#0a0a0a` | 7.8:1 | ✅ works on dark |

**This is the single highest-impact fix in your current design.** Emerald-500 as a *text/icon* color on `#fafaf9` is effectively invisible to low-vision users and is likely the reason the accent "reads cheap" — it's washing out. Use **`#047857` (emerald-700) for accent text on light**, **`#10b981`/`#34d399` only on dark**, and **`#059669` only for non-text** (focus ring, 3:1).

**Accent hue psychology for AI/vision:** green/teal reads "live, verified, system-OK, signal, tracking, matrix". Teal/cyan reads "sensor, depth map, lidar". Indigo/violet reads "model/neural" (over-used). Amber/orange reads "warning, attention". For **Edge Vision** specifically, **emerald → teal (165–180°) is the most semantically on-target and least clichéd**. Sources: WCAG 2.2 1.4.3 (https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) and 1.4.11 (https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).

### 2.3 THREE proven, concrete palette directions (all hex values)

#### PALETTE 1 — "Stone Emerald" (RECOMMENDED — evolution of your current direction)
Light-first architectural monochrome, warm-neutral (stone), emerald accent. This *keeps* your existing identity but fixes contrast and adds depth.

```
--bg:            #fafaf9   /* stone-50  — page */
--bg-subtle:     #f5f5f4   /* stone-100 — section band */
--surface:       #ffffff   /* cards */
--border:        #e7e5e4   /* stone-200 */
--border-strong: #d6d3d1   /* stone-300 — hover border */
--text:          #1c1917   /* stone-900 — primary (18.9:1 on bg) */
--text-secondary:#57534e   /* stone-600 — 7.5:1 ✅ */
--text-muted:    #78716c   /* stone-500 — 4.6:1 ✅ AA */
--text-faint:    #a8a29e   /* stone-400 — ❌ decorative/meta only, never body */

--accent:        #047857   /* emerald-700 — accent TEXT on light, 5.25:1 ✅ */
--accent-bg:     #ecfdf5   /* emerald-50 — chip/soft fill */
--accent-border: #a7f3d0   /* emerald-200 — chip border */
--accent-strong: #065f46   /* emerald-800 — pressed/hover text */
--accent-raw:    #10b981   /* emerald-500 — ONLY on dark, or 1px decorative rule */

/* dark mode */
--bg-dark:       #0c0a09   /* stone-950 */
--surface-dark:  #1c1917   /* stone-900 */
--border-dark:   #292524   /* stone-800 */
--text-dark:     #e7e5e4   /* stone-200 — 15.7:1 ✅ */
--text-2-dark:   #a8a29e   /* stone-400 — 7.8:1 ✅ */
--accent-dark:   #34d399   /* emerald-400 — 10.3:1 ✅ */
```

#### PALETTE 2 — "Terminal Zinc" (cool neutral, dark-first)
For an infrastructural/edge-compute feel. Cool zinc neutrals + emerald.

```
--bg:            #09090b   /* zinc-950 */
--bg-subtle:     #18181b   /* zinc-900 */
--surface:       #1c1c1f
--border:        #27272a   /* zinc-800 */
--text:          #fafafa   /* zinc-50  — 18.9:1 */
--text-secondary:#a1a1aa   /* zinc-400 — 8.1:1 ✅ */
--text-muted:    #71717a   /* zinc-500 — 4.6:1 ✅ */
--accent:        #10b981   /* emerald-500 — 7.8:1 ✅ on this bg */
--accent-hi:     #34d399   /* emerald-400 */
--accent-dim:    #064e3b   /* emerald-900 — fills */
```
Light counterpart: `#fafafa` bg, `#18181b` text, `#d4d4d8` borders, `#047857` accent text.

#### PALETTE 3 — "Signal Teal" (most differentiated, sensor/vision semantics)
Swiss cool-neutral (slate) + teal accent. Signals depth/sensor data rather than generic "eco green".

```
--bg:            #f8fafc   /* slate-50 */
--bg-subtle:     #f1f5f9   /* slate-100 */
--surface:       #ffffff
--border:        #e2e8f0   /* slate-200 */
--text:          #0f172a   /* slate-900 — 16.9:1 */
--text-secondary:#475569   /* slate-600 — 7.5:1 ✅ */
--text-muted:    #64748b   /* slate-500 — 5.0:1 ✅ */
--accent:        #0f766e   /* teal-700 — 5.24:1 ✅ AA on light */
--accent-soft:   #f0fdfa   /* teal-50 */
--accent-border: #99f6e4   /* teal-200 */
/* dark */
--bg-dark:       #020617   /* slate-950 */
--text-dark:     #e2e8f0
--accent-dark:   #2dd4bf   /* teal-400 */
```

### 2.4 Neutral ramp (do not hand-roll grays — use a perceptually-tuned ramp)
Use **stone** (warm, editorial, recommended with Palette 1), **zinc** (cool, technical), or **slate** (blue-tinted, infra). Ramps from Tailwind v4 in OKLCH, with approximate hex:

| Step | stone | zinc | slate |
|---|---|---|---|
| 50 | `#fafaf9` | `#fafafa` | `#f8fafc` |
| 100 | `#f5f5f4` | `#f4f4f5` | `#f1f5f9` |
| 200 | `#e7e5e4` | `#e4e4e7` | `#e2e8f0` |
| 300 | `#d6d3d1` | `#d4d4d8` | `#cbd5e1` |
| 400 | `#a8a29e` | `#a1a1aa` | `#94a3b8` |
| 500 | `#78716c` | `#71717a` | `#64748b` |
| 600 | `#57534e` | `#52525b` | `#475569` |
| 700 | `#44403c` | `#3f3f46` | `#334155` |
| 800 | `#292524` | `#27272a` | `#1e293b` |
| 900 | `#1c1917` | `#18181b` | `#0f172a` |
| 950 | `#0c0a09` | `#09090b` | `#020617` |

Source: Tailwind v4 `theme.css` (OKLCH values above converted to nearest hex; OKLCH originals are authoritative if you build in OKLCH).

### 2.5 Semantics & accessibility rules
- Semantic roles, not raw colors (Vercel Geist model): `bg`, `bg-subtle`, `surface`, `border`, `border-hover`, `text`, `text-secondary`, `text-muted`, `accent`, `accent-soft`, `success`, `warning`, `danger`.
- **Text:** body ≥ 4.5:1; large (≥24px, or ≥18.66px bold) ≥ 3:1. **Non-text (borders that carry meaning, icons, focus rings, chart lines) ≥ 3:1.** Sources: WCAG 2.2 SC 1.4.3 and SC 1.4.11.
- **Focus ring must be ≥ 2 CSS px thick and ≥ 3:1** against adjacent colors (SC 2.4.13 Focus Appearance, AAA; SC 1.4.11, AA). Use a 2px accent ring + 2px offset. Source: https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html
- **Don't rely on color alone** to convey state (SC 1.4.1) — pair accent with an icon/label change.
- Provide a **theme toggle** — WCAG explicitly encourages user-controllable foreground/background (§1.4.3 intent: "we allow and encourage authors to provide mechanisms to adjust the foreground and background colors").

---

## 3. LAYOUT GRID & SPACING

### 3.1 Concrete standards
- **Spacing base unit: 4px (`0.25rem`)**, expressed as an 8pt-multiple scale for macro spacing. Tailwind v4 literally defines `--spacing: 0.25rem` and all spacing utilities derive from it. Source: `theme.css`. **Use 4px for micro (icon gaps, padding inside chips), 8px for component spacing, 16/24/32/48/64/96/128 for layout.** **[INFERENCE — universal practice.]**
- **Max content width: use a two-track system.**
  - **Prose/reading column: `42rem` (672px)** — Tailwind `--container-2xl: 42rem`. This is the sweet spot for ~70–75 characters per line. Source: `theme.css`.
  - **Full layout container: `72rem` (1152px)** — Tailwind `--container-6xl: 72rem`. Or `80rem` (1280px, `--container-7xl`) for wider grids. **Recommend `72rem` max with 24–32px gutters.**
  - Available container tokens (Tailwind v4): `3xs 16rem, 2xs 18rem, xs 20rem, sm 24rem, md 28rem, lg 32rem, xl 36rem, 2xl 42rem, 3xl 48rem, 4xl 56rem, 5xl 64rem, 6xl 72rem, 7xl 80rem`.
- **Grid: 12-column with an 8pt gutter** for desktop (≥1024px); collapse to 6-col (768–1023px) and 4-col (≥480px), single column below 480px. Vercel's Geist ships a **12-column guide-based grid** with **3 breakpoints**, requiring columns/rows be set at **all three breakpoints**. Sources: `theme.css` (breakpoints), https://vercel.com/geist/grid
- **Container padding:** `16px` mobile, `24px` tablet, `32–48px` desktop. **[INFERENCE]**
- **Section vertical rhythm:** minimum `96px` mobile, `128px` tablet, `160–192px` desktop between major sections. Use a consistent rhythm token, e.g. `--space-section: clamp(5rem, 8vw, 12rem)` → 80–192px. **[INFERENCE, matches Vercel/Linear/Anthropic observed density.]**
- **Vertical rhythm inside blocks:** heading→subhead `8px`, subhead→body `24px`, body→CTA `32px`. Tight inside a group, loose between groups (Refactoring UI's grouping tactic). Source: https://www.refactoringui.com/
- **Breakpoints (Tailwind v4 defaults):** `sm 640px, md 768px, lg 1024px, xl 1280px, 2xl 1536px`. Source: `theme.css`.
- **Line length:** 60–75 characters for body. Force with `max-width: 65ch` on prose blocks. **[INFERENCE — typographic standard.]**

### 3.2 Recommended spacing token set
```
--space-1:  4px    --space-6:  24px    --space-16: 64px
--space-2:  8px    --space-8:  32px    --space-20: 80px
--space-3:  12px   --space-10: 40px    --space-24: 96px
--space-4:  16px   --space-12: 48px    --space-32: 128px
--space-5:  20px   --space-14: 56px    --space-40: 160px
```

### 3.3 Radius & elevation tokens (from Vercel Geist "Materials" — directly usable)
Vercel's material system (https://vercel.com/geist/materials) is the cleanest public spec: `base`/`small` → **6px radius**; `medium`/`large` → **12px**; `tooltip` → **6px**; `menu`/`modal` → **12px**; `fullscreen` → **16px**. Tailwind radii: `--radius-xs 0.125rem, sm .25rem, md .375rem, lg .5rem, xl .75rem, 2xl 1rem, 3xl 1.5rem`. **Recommendation for an architectural portfolio: use small radii — `4px` for chips/badges, `6px` for cards/inputs, `12px` for modals — and consider `0` radius for a truly Swiss/brutalist read.**

---

## 4. MOTION & MICRO-INTERACTIONS

### 4.1 Durations (authoritative figures — NN/g)
From NN/g "Executing UX Animations" (https://www.nngroup.com/articles/animation-duration/):
- **Most animations: 100–500 ms.** "It is far more common for animations to be too long than too short."
- **Simple feedback (checkbox, toggle, button press): ~100 ms** — "feels immediate."
- **Substantial screen changes (modal, panel): 200–300 ms.**
- **At 500 ms animations "start to feel like a real drag."** Practical range: **100–400 ms**, with 400 ms reserved for large-screen movements.
- **Entering elements need slightly longer than exiting:** e.g. **300 ms in, 200–250 ms out.**
- **Easing: default to `ease-out`** ("starts quickly but slows down… feels responsive"). Avoid `linear`. Use `ease-in`/`ease-in-out` for exiting elements only.

### 4.2 Concrete easing curves (exact values)
- Tailwind v4: `--ease-in: cubic-bezier(0.4, 0, 1, 1)`, `--ease-out: cubic-bezier(0, 0, 0.2, 1)`, `--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)`. Source: `theme.css`
- MDN keyword equivalents: `ease` = `cubic-bezier(0.25, 0.1, 0.25, 1)`; `ease-out` = `cubic-bezier(0, 0, 0.58, 1)`. Source: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/easing-function
- **Premium "expressive" easings to hand-roll** (widely used in award-caliber motion work): 
  - `--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)` — the signature "settle" curve for reveals
  - `--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1)`
  - `--ease-in-out-quint: cubic-bezier(0.83, 0, 0.17, 1)`
  - `--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)` — subtle overshoot, use *once* per page max
  **[INFERENCE — these are the de-facto standard "designer curves", not vendor-published specs.]**

### 4.3 Recommended motion spec
| Interaction | Duration | Easing | Property |
|---|---|---|---|
| Hover color/opacity | 120 ms | ease-out | `color`, `background-color`, `opacity` |
| Link underline slide | 180 ms | `cubic-bezier(0.16,1,0.3,1)` | `background-size` / `transform: scaleX` |
| Card lift on hover | 200 ms | ease-out | `transform: translateY(-2px)`, `box-shadow` |
| Button press | 100 ms | ease-out | `transform: scale(0.98)` |
| Section reveal on scroll | 400 ms, 60 ms stagger | `cubic-bezier(0.16,1,0.3,1)` | `opacity` 0→1, `translateY(16px)`→0 |
| Accordion/expand | 250 ms in / 200 ms out | ease-out / ease-in | `height`/`grid-template-rows`, `opacity` |
| Modal enter/exit | 300 / 200 ms | ease-out / ease-in | `opacity`, `transform: scale(0.98)` |
| Theme toggle | 200 ms | ease-out | `color`, `background-color` |
| Nav shrink on scroll | 200 ms | ease-out | height/padding |

### 4.4 Performance limits (hard rules — web.dev)
From https://web.dev/articles/animations-guide:
- **Only animate `transform` and `opacity`** (plus `filter` sparingly). These are compositor-only. Animating `width`, `height`, `top/left`, `margin` triggers layout and causes jank.
- Use `will-change: transform` **sparingly** and remove it after animation (over-use creates layer explosions).
- Never animate `box-shadow` — animate `opacity` of a pre-rendered shadow layer instead.
- **Scroll-driven animations** are now native: `animation-timeline: view()` / `scroll()` (MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline). Prefer CSS `animation-timeline` over JS scroll listeners for reveal-on-scroll — it runs off the main thread. Provide a JS/IntersectionObserver fallback for older browsers. **[INFERENCE on the fallback.]**

### 4.5 Accessibility limits — non-negotiable
- **Honor `prefers-reduced-motion`.** web.dev: "let's you design a motion-reduced variant." WCAG SC 2.3.3 (Animation from Interactions, AAA): "Motion animation triggered by interaction can be disabled, unless the animation is essential." Sources: https://web.dev/articles/prefers-reduced-motion , https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
- **Parallax and scroll-jacking are the two biggest offenders** for vestibular disorders — NN/g and WCAG both single them out. Avoid parallax on this portfolio, or make it opt-out.
- Reduced-motion behavior: replace movement with **instant state change or a ≤100 ms opacity fade**; do not simply set `animation: none` (which can leave elements invisible if the animation was also the reveal). Always end in the "visible" resting state without animation. **[INFERENCE]**
- Avoid **flashing** (SC 2.3.1: no more than 3 flashes/second).
- Respect `prefers-contrast` where feasible. **[INFERENCE]**

---

## 5. VISUAL TEXTURE — 2025–2026 direction

### 5.1 What's in, what's out
| Technique | 2025–26 verdict for a technical portfolio | Concrete spec |
|---|---|---|
| **Hairline borders + generous whitespace** | ✅ **Dominant "top-ranking" direction** | 1px `#e7e5e4`; grid-rule lines; Vercel's guide-grid aesthetic |
| **Swiss / architectural minimalism** | ✅ **The current award-caliber default for engineering** | Left-aligned, strict grid, one accent, typographic hierarchy carries everything |
| **Subtle elevation (not glassmorphism)** | ✅ | `0 1px 2px rgb(0 0 0 / 0.05)` (`--shadow-xs`), `0 1px 3px 0 rgb(0 0 0/0.1), 0 1px 2px -1px rgb(0 0 0/0.1)` (`--shadow-sm`) |
| **Noise / grain** | ✅ in moderation — adds "physical material" | SVG `feTurbulence` with `type="turbulence" baseFrequency="0.8" numOctaves="4"` at 3–6% opacity, `mix-blend-mode: overlay` (MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feTurbulence) |
| **Gradients** | ⚠️ only subtle, low-chroma, single-hue washes | Never rainbow. Use OKLCH interpolation: `linear-gradient(in oklab, ...)` for smoothness (MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/linear-gradient) |
| **Glassmorphism (`backdrop-filter: blur`)** | ⚠️ use once — sticky nav only, and it's a performance cost | `backdrop-filter: blur(12px)` + `background: rgb(255 255 255 / 0.7)` (MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter). Tailwind blur tokens: `xs 4px, sm 8px, md 12px, lg 16px, xl 24px` |
| **Brutalist (raw borders, monospace, no shadows)** | ✅ as a *sub-mode* for a technical/terminal section — but full-page brutalism reads unfinished to non-technical recruiters | 0 radius, 1px black borders, mono labels, no shadows |
| **Chamfers / bevels** | ❌ avoid — reads dated/game-UI | — |
| **Heavy glow / neon** | ❌ the "AI purple glow" cliché; juries are fatigued | — |
| **Mesh gradients / aurora** | ❌ over-used in AI branding 2023–2024, now dated | — |

**Most "top ranking" for a technical portfolio right now: Swiss/architectural minimalism, light-first, hairline-bordered grid, one restrained accent, generous whitespace, tiny optional grain, and motion used only for reveal.** This is exactly the Vercel Geist / Linear / Anthropic lineage. **[INFERENCE — synthesized from source aesthetics; no single "award" citation was retrievable due to the search outage.]**

### 5.2 Texture spec (concrete)
- Page background: flat `#fafaf9`. Optional 3% grain overlay (SVG turbulence, `pointer-events: none`, fixed, z-index above bg below content).
- Section separators: 1px `#e7e5e4` full-bleed rules, OR a 12-column guide grid where rules are visible (Vercel Geist Grid pattern — mark guides `aria-hidden="true"`; https://vercel.com/geist/grid).
- Cards: `#ffffff` surface, 1px `#e7e5e4` border, `--shadow-xs`, **no radius or 6px**.
- Hover: border → `#d6d3d1`, shadow → `--shadow-sm`, translateY(-2px).
- One optional hero texture: a faint blueprint/dot grid or a single corner radial glow in `emerald-50`, ≤ 8% opacity.

---

## 6. CREDIBILITY CUES

### 6.1 The governing principle
**Credibility comes from evidence density and restraint, not from badges.** Award-caliber technical sites present credibility as:
1. **Metrics as typography** — big tabular numbers with small uppercase mono labels. Use `font-variant-numeric: tabular-nums`, mono labels at 11px/0.06em tracking.
2. **Named, specific, verifiable facts** — "1.2 ms inference latency on Jetson Orin Nano" beats "high performance AI".
3. **Logos in monochrome**, desaturated, uniform optical size, in a quiet bordered grid strip. Never full-color logo soup.
4. **Certifications as a list, not a badge wall** — text rows with issuer + year.

### 6.2 Concrete patterns (anti-clutter rules)
- **Metric display:** 3–4 metrics max per row. Each: huge number (`display-l`, tabular) + 11px uppercase mono label (`0.06em` tracking, `--text-muted`) + optional 1px top rule. Consistent baseline grid.
- **Logo strip:** grayscale (`filter: grayscale(1)`), uniform height (`20–24px`), opacity `0.6` → `1.0` on hover, `gap: 48–64px`, wrapped in generous `padding: 48px 0` with a 1px top/bottom rule. Vercel's brand guidance supports monochrome usage: "Monochrome usage is preferred with the brand colors below" (https://linear.app/brand).
- **Certifications:** a two-column definition list — issuer (`--text`, 14px/500) / credential + year (`--text-muted`, mono 13px tabular). Separated by 1px rules. No badge images unless they are the official, high-res, monochrome-able version.
- **Awards / honors:** text rows, left-aligned, year in mono tabular right-aligned. No laurel graphics.
- **Trust density check:** every credibility element must be *earned and verifiable*. Remove anything you cannot link to.
- **"Featured in" / press:** same monochrome treatment as the logo strip, one line, `--text-muted`.
- **Repo/OSS signals:** star counts, download counts, commit activity as tabular mono stats.
- **Photo:** a single high-quality, desaturated portrait with flat lighting. Avoid stock imagery entirely.

### 6.3 Spacing for credibility blocks
- Wrap each credibility strip in **`padding: 64px 0`** with a **1px `#e7e5e4`** top border.
- Constrain the logo/metric grids to the **`72rem`** container with the **12-col grid**; leave empty columns — negative space is the credibility signal.
- **Never** put more than ~6 logos or ~4 badges in one viewport band.

---

## 7. RECOMMENDED DEFINITIVE DESIGN DIRECTION — "ARCHITECTURAL SENSOR"

Full implementable specification. One superfamily + one mono, light-first, Swiss grid, emerald-teal accent, restrained motion, grain optional.

### 7.1 Typography (definitive)
```
Primary superfamily: GEIST  (Sans + Mono)
  Sans: https://fonts.google.com/specimen/Geist        (or self-host https://github.com/vercel/geist-font)
  Mono: https://fonts.google.com/specimen/Geist+Mono
  License: SIL OFL 1.1 (verified — free for commercial use, self-hosting allowed)
  Reasoning: purpose-built "for developers and designers", Swiss-minimal, and having a
  matched Sans+Mono sibling makes the whole site feel like one engineered artifact.

Fallback stack (production):
  font-family: 'Geist', 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  font-family-mono: 'Geist Mono', 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;

If you prefer maximum ubiquity over distinctiveness, substitute INTER everywhere:
  https://rsms.me/inter/  (variable, optical size, slashed zero, tabular nums)
  (This is exactly what Linear ships: https://static.linear.app/fonts/InterVariable.woff2)

OpenType:
  body:   font-feature-settings: 'liga' 1, 'calt' 1;
  data:   font-variant-numeric: tabular-nums;  (+ 'zero' for slashed zero in mono)
  smoothing: -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility;
```

Type scale (fluid at top, Major Third 1.25 below, tightened at the very top):
```
display-xl : clamp(3rem, 2.4rem + 2.6vw, 5rem)      / 1.0   / 600 / -0.03em   → hero
display-l  : clamp(2.5rem, 2rem + 2vw, 4rem)         / 1.05  / 600 / -0.025em  → section
display-m  : clamp(2rem, 1.7rem + 1.3vw, 3rem)       / 1.1   / 600 / -0.02em   → sub-section
h3         : 1.75rem (28px) / 1.2   / 600 / -0.015em → project titles
h4         : 1.375rem (22px)/ 1.3   / 600 / -0.01em  → cards
body-lg    : 1.125rem (18px)/ 1.65  / 400 / 0        → lead copy
body       : 1rem (16px)   / 1.7    / 400 / 0        → prose (max 65ch)
body-sm    : 0.875rem (14px)/1.6    / 400 / 0        → captions
label      : 0.75rem (12px) / 1.4   / 500 / 0.06em UPPERCASE → eyebrows
mono-sm    : 0.8125rem(13px)/1.5    / 400 / 0 tabular → metrics
mono-xs    : 0.6875rem(11px)/1.5    / 500 / 0.04em UPPER → chips/kbd/IDs
```

### 7.2 Color (definitive)
```
LIGHT (default)
  --bg:              #fafaf9   /* stone-50 */
  --bg-subtle:       #f5f5f4   /* stone-100 */
  --surface:         #ffffff
  --border:          #e7e5e4   /* stone-200 */
  --border-strong:   #d6d3d1   /* stone-300 — hover */
  --text:            #1c1917   /* stone-900 · 18.9:1 */
  --text-secondary:  #57534e   /* stone-600 · 7.5:1  */
  --text-muted:      #78716c   /* stone-500 · 4.6:1 AA */
  --accent:          #047857   /* emerald-700 · 5.25:1 AA text ✅ */
  --accent-soft:     #ecfdf5   /* emerald-50  — chip fill */
  --accent-border:   #a7f3d0   /* emerald-200 */
  --accent-strong:   #065f46   /* emerald-800 */
  --focus-ring:      #059669   /* emerald-600 · 3.61:1 ≥3:1 non-text ✅ */
  --success:         #047857
  --warning:         #b45309   /* amber-700 */
  --danger:          #b91c1c   /* red-700 */

DARK
  --bg:              #0c0a09   /* stone-950 */
  --surface:         #1c1917   /* stone-900 */
  --border:          #292524   /* stone-800 */
  --text:            #e7e5e4   /* stone-200 · 15.7:1 */
  --text-secondary:  #a8a29e   /* stone-400 · 7.8:1  */
  --text-muted:      #78716c   /* stone-500 */
  --accent:          #34d399   /* emerald-400 · 10.3:1 ✅ */
  --focus-ring:      #10b981
```
**Mandatory change vs. current design:** `#10b981` (2.43:1 on `#fafaf9`) must NOT be used for text on the light background. Use `#047857` for accent text on light; keep `#10b981`/`#34d399` for dark mode and decorative rules only.

### 7.3 Layout (definitive)
```
Base unit:      4px  (0.25rem); macro steps are 8px multiples
Container:      max-width 72rem (1152px); full-bleed allowed for rules/dividers
Prose column:   max-width 65ch (~42rem / 672px)
Grid:           12 columns desktop ≥1024px | 6 cols 768–1023 | 4 cols ≥480 | 1 col <480
Gutter:         24px desktop / 16px mobile
Page padding:   32–48px desktop / 24px tablet / 16px mobile
Section rhythm: padding-block: clamp(5rem, 8vw, 12rem)   → 80–192px
Intra-block:    heading→sub 8px | sub→body 24px | body→CTA 32px
Radius:         chips 4px | cards/inputs 6px | modals 12px | (0px for brutalist mode)
Shadows:        xs: 0 1px 2px 0 rgb(0 0 0 / .05)
                sm: 0 1px 3px 0 rgb(0 0 0 / .1), 0 1px 2px -1px rgb(0 0 0 / .1)
                lg: 0 10px 15px -3px rgb(0 0 0 / .1), 0 4px 6px -4px rgb(0 0 0 / .1)
```

### 7.4 Motion (definitive)
```
Tokens:
  --dur-instant: 100ms;  --dur-fast: 150ms;  --dur-base: 200ms;
  --dur-slow: 300ms;     --dur-reveal: 400ms;
  --ease-out:   cubic-bezier(0, 0, 0.2, 1);          /* Tailwind default */
  --ease-in:    cubic-bezier(0.4, 0, 1, 1);
  --ease-in-out:cubic-bezier(0.4, 0, 0.2, 1);
  --ease-expo:  cubic-bezier(0.16, 1, 0.3, 1);       /* signature reveal curve */

Rules:
  • Animate ONLY transform + opacity (compositor-only). Never width/height/top/left/box-shadow.
  • Default easing = var(--ease-expo) or --ease-out. Never linear.
  • Hover: 120–200ms color/border/opacity; card lift translateY(-2px) 200ms.
  • Press: scale(0.98) 100ms.
  • Scroll reveal: opacity 0→1 + translateY(16px→0), 400ms --ease-expo, 60ms stagger, once only.
  • Modal: 300ms in / 200ms out. Accordion: 250ms in / 200ms out.
  • Use CSS `animation-timeline: view()` for reveals (off-main-thread); IntersectionObserver fallback.
  • prefers-reduced-motion: reduce → no transforms, opacity fades ≤100ms, final state must be visible.
  • No parallax. No scroll-jacking. No flashing (>3/sec). 
```

### 7.5 Texture (definitive)
Flat `#fafaf9`. 1px `#e7e5e4` rules. White cards on a 12-col guide grid. Optional 3% SVG grain. Optional single-corner `emerald-50` wash at ≤8%. Sticky nav may use `backdrop-filter: blur(12px)` + 70% white — once, nowhere else.

### 7.6 Migration checklist (highest impact first)
1. **Replace Arial** with Geist (or Inter) + Geist Mono — immediately removes the "default/low-effort" read. (§1)
2. **Fix emerald text contrast:** `#10b981` → `#047857` for text on light. (§2.2) — *currently failing WCAG AA at 2.43:1.*
3. **Adopt the fluid type scale** + negative tracking on display sizes; enable `tnum` on all data. (§1.4)
4. **Introduce the 12-col grid, `72rem` container, `65ch` prose, 4px/8pt spacing.** (§3)
5. **Add motion tokens** (100/150/200/300/400ms + expo ease) with a proper `prefers-reduced-motion` path. (§4)
6. **Restructure credibility cues** into monochrome strips + tabular metric displays. (§6)

---

## 8. EVIDENCE LIMITATIONS (disclose to parent)
- `web_search` failed all session (provider 404); no first-party award-jury citation could be retrieved. Award-direction claims in §5 are **[INFERENCE]** from direct inspection of production tokens on Vercel, Linear, Anthropic, Railway, and Tailwind.
- DynamoDB of "most-used-fonts-on-awwwards" statistics could not be sourced; font recommendations rest on (a) verified production usage (Linear = InterVariable; Vercel = Geist), (b) verified OFL licensing, (c) Tailwind's own fallback stacks showing Arial/Times in fallback position.
- All hex contrast ratios in §2.2 were computed locally with the WCAG 2.x relative-luminance formula and should be treated as authoritative.
