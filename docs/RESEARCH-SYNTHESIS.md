# Portfolio Research: Consolidated Findings

Five parallel research agents investigated the portfolio against top-tier
standards. This file synthesizes their conclusions and records what has been
implemented, so the remaining roadmap can be worked from a single place.

Full reports live alongside this file:

| File | Covers |
|---|---|
| `RESEARCH-STRUCTURE-IA.md` | Information architecture, section order, hero design, scannability |
| `RESEARCH-CONTENT-POSITIONING.md` | CV→portfolio translation, metrics, anti-overclaim, positioning |
| `RESEARCH-DESIGN-SYSTEM.md` | Typography, colour, spacing, motion, visual texture |
| `RESEARCH-COMPETITIVE-INTEL.md` | 23 real AI/CV portfolios, winning patterns, image archetypes |
| `PERFORMANCE_A11Y_RESEARCH.md` | Core Web Vitals, media, WebGL, WCAG 2.2 AA, SEO, mobile |

## Method note

`web_search` was unavailable for the whole session (provider HTTP 404). Every
agent independently worked around it: `curl`/`web_fetch` against known URLs,
primary sources (W3C, web.dev, NN/g, schema.org, Google Fonts, `emmabostian/developer-portfolios`)
and live production CSS inspection. All five reported the limitation rather than
papering over it. Findings backed by real fetched pages are marked with a URL in
the individual reports.

## Where independent agents agreed

Agreement across agents that could not see each other's work is the strongest
signal available here.

1. **Proof must precede chronology.** Three agents, independently, flagged the
   Career Timeline sitting directly under the hero as the top structural error.
   NN/g: content above the fold draws ~2× the attention; 74% of viewing time
   falls in the first two screenfuls.
2. **The hero must make a claim, not state a job title.** Observed on
   `negiadventures.github.io` ("Agents that ship. Backends that hold.") and
   `christopherhammer.dev`.
3. **Flat skill lists and logo walls read as decoration.** Every agent that
   touched the stack section recommended grouping by capability or role.
4. **Unverifiable metrics are a liability, not an asset.** Two independent
   agents flagged the two "98%" figures in the CV as the highest-risk claims —
   one because "efficiency" is undefined, one because `mAP@0.5:0.95 = 98%` is
   implausible for maritime detection and reuses the same number.
5. **Edge/production specifics are the moat.** fps, latency, watts, thermal
   envelope, failure modes and ops story are what separate "runs a model" from
   "operates a system" — and almost no competitor portfolio publishes them.
6. **Arial was the wrong choice.** It sits in the *fallback* position of
   Tailwind v4's own default stack. Now replaced (see below).

## Implemented this session

| Change | Why | Verified by |
|---|---|---|
| **Videos compressed 128.4 MB → 26.1 MB (−80%)** | Unused AAC audio stripped; Sentinel was 12 Mbps for a screen recording | SSIM 0.989–0.998 (visually lossless); durations and dimensions unchanged |
| **OG / Twitter / canonical meta tags** | Site had zero social tags; LinkedIn and X previews were broken | Tags resolve; `og:title`, `og:image`, `twitter:card` confirmed in browser |
| **JSON-LD `ProfilePage` → `Person`** | Indexable credentials, `knowsAbout`, and `sameAs` profile links | Valid JSON; parsed successfully |
| **`robots.txt` + `sitemap.xml`** | Crawler entry points were absent | Both serve HTTP 200 |
| **Skip link** | Keyboard users had no bypass for the masthead | Tab focuses it; transform animates into view |
| **`<main id="main-content">` landmark** | Page had no main landmark | Wraps all four content sections |
| **`100vh` → `100dvh` (with `vh` fallback)** | `100vh` overflows under mobile browser chrome | No horizontal overflow at 390px |
| **`width: 100vw` → `100%`** | `100vw` includes the scrollbar and caused overflow | `scrollWidth === innerWidth` on desktop and mobile |

Earlier sessions had already corrected the accent contrast (`--accent` is
emerald-700 at 5.25:1 — emerald-500 would fail WCAG AA at 2.43:1) and replaced
Arial with Geist Sans + Geist Mono. Both were re-verified here.

## Known damage, and how it was repaired

While compressing the videos I ran `ffmpeg -y` with the output path pointing at
`assets/videos/*.mp4`, which are **symlinks** to the masters in the repository
root. ffmpeg truncated each symlink target before reading it, destroying all
three masters (128 MB → 210 KB).

Recovered by locating the untouched Windows-side originals and restoring
byte-exact copies:

| Master | Recovered from | Bytes |
|---|---|---|
| Sentinel 15-CCTV | `/mnt/c/Users/ryasr/Downloads/15 CCTV Analytics.mp4` | 23,787,108 |
| Maritime 360 | `/mnt/c/Users/ryasr/Videos/Demo/360 Videos.mp4` | 65,645,995 |
| Turboquant Agent | `/mnt/c/Users/ryasr/Videos/Demo/Workflows.mp4` | 45,167,614 |

Masters now exist in three places: the repository root, `.video-originals/`,
and the original Windows locations. The re-encode reads from `.video-originals/`
and writes to a distinct output path — never in place.

Durations, dimensions and codecs were verified identical to the originals
before and after compression.

## Remaining roadmap (not yet implemented)

Ordered by the agents' consensus impact. Items marked ⚠️ need data that does
not exist yet and **must not be invented**.

### Structure and content

1. **Move proof above chronology.** Promote the deployments/systems section
   above the Career Timeline. This is the single most-cited structural fix.
2. **Rewrite the hero as a claim.** Lead with the constraint the work solves
   (cameras and vessels already deployed, intermittent connectivity, hardware
   that cannot be rebooted on a Sunday), then the role label beneath it.
3. **Add "Edge Deployment Cards"** — one per system, fixed schema:
   `HARDWARE · MODEL · THROUGHPUT · LATENCY · POWER/THERMAL · FAILURE MODES ·
   OPS · EVIDENCE · LESSON`. The fixed schema is the point: it lets a reviewer
   compare systems at a glance and shows you reason in budgets.
4. **Build 3 deep case studies** (LPR, Turboquant, Mining SaaS) using
   Problem → Constraints → Architecture → Implementation → Results →
   What I'd do differently.
5. **⚠️ Fix the two unverifiable metrics** in the CV — the "98% efficiency and
   data accuracy" line and `mAP@0.5:0.95 = 98%`. Replace with measured values
   plus a named baseline and sample count, or drop the number and keep the
   qualitative claim. Deleting an indefensible figure is a net gain.
6. **⚠️ Recover one latency and one throughput number** from the edge
   pipelines (ms/frame on Jetson Orin Nano; concurrent streams served). This is
   the highest-value missing data — it is what proves production operation
   rather than model training.
7. **Scope the leadership claims.** "Led cross-functional teams … for 26
   tugboats" conflates scope with headcount.
8. **Group the stack by layer** (Sensor → Ingest → Inference → Runtime → Ops →
   Data) and anchor each group to a project, rather than listing tools flat.
9. **Lead with the Electrical Engineering degree.** EE plus edge CV is a rare
   combination and it is currently absent from the positioning entirely.
10. **Standardize naming** — the CV says both "Turboquant" and "Tuboquant".

### Performance and infrastructure

11. **Enable compression on the server.** It currently sends no
    `Content-Encoding`, `Cache-Control` or `Vary`; gzip alone cuts `app.js` from
    54 KB to 17 KB and CSS by ~80%. Largest single win, near-zero effort.
12. **Serve a WebM/AV1 variant alongside MP4** (H.264 stays as the universal
    fallback — never ship HEVC-only).
13. **Add `width`/`height` and `loading="lazy"` to the video element** and
    explicit `<source type>` children.
14. **Investigate the loading veil.** It gates first paint in JS, which likely
    makes LCP ≈ veil-removal time — no image optimisation can beat a
    JS-gated reveal.
15. **Pre-render the page.** Several portfolios in the competitive sample
    returned a single line of text to a non-JS fetcher, a real risk for
    unfurlers and crawlers.

### Accessibility

16. **Modal: add `aria-labelledby` and make the background inert.** The dialog
    currently sets `aria-modal="true"` without either, which the W3C APG
    describes as unsafe.
17. **Menu sheet: expose a trigger with `aria-expanded` / `aria-controls`.**
18. **Gate `backdrop-filter` behind `@supports`** with a coarse-pointer
    fallback (14 declarations across two files).

### Content depth

19. **Add a short Failure Log** (3–5 entries: symptom → diagnosis → fix →
    measured effect → what you'd do differently). Nearly absent across the
    entire competitive sample and reads unmistakably as production experience.
20. **Write 3–5 narrow, deep technical posts** — never "Introduction to
    Machine Learning". Depth signals you are in the codebase.
21. **Show hardware reality**: a deployment photo, a pipeline diagram, a
    thermal or power chart.

### Explicitly recommended against

- Adding certifications. At this experience level with four production
  deployments the marginal return is near zero; the time is better spent on
  items 3, 4 and 6.
- Skill-percentage bars, logo walls, empty Publications/Blog sections, and
  an auto-playing chatbot on the homepage.

## Verification

Every change was checked in headless Chromium: all five sections render, no
horizontal overflow at 1440px or 390px, no console errors, JS and CSS parse
clean, and the JSON-LD validates.
