# Portfolio Design Research: Elite AI / Computer-Vision Engineer Portfolios
**Subject:** Ryas Rafi Karim — AI Systems & Edge Vision Engineer, Jakarta, Indonesia
**Target:** mid-to-senior AI / Computer Vision roles
**Current sections:** Hero → Career Timeline (2020–2026) → Deployments on Video (3 demos) → Tech Stacks & Domains (6 domains) → Contact footer

---

## 0. Evidence base & method

`web_search` hard-failed in this session (backend HTTP 404) and `web_fetch` failed on several hosts, so I harvested **primary sources directly** — real portfolio pages (DOM heading order + hero copy extracted from live HTML), award-gallery winner listings, the 1,981-entry `developer-portfolios` awesome list, and NN/g eyetracking research — rather than relying on ranking listicles. Key sources cited inline.

---

## 1. Ranked recommendations (highest impact first)

### R1 — Move PROOF above chronology: reorder to Hero → Proof/Selected Work → Experience → Skills → Contact
**Why it matters.** Every strong AI portfolio I extracted puts *demonstrated capability* before *career history*. `brhane.vercel.app` (AI Engineer) runs `Hero → "Engineering at Scale" → Education → Achievements → Technical Expertise → Professional Journey → Featured Projects → Contact`. `joshuapaul.me` (Senior Fullstack & AI Engineer) runs `Hero → Work → Stack → Writing → Connect`. `adityanamdeo.qzz.io` (Data & ML Systems) runs `About → Projects → Experience → Skills → Contact`. Career Timeline as section 2 is backwards for AI roles: a hiring manager decides *can this person ship a model to production* before they care *where they worked in 2020*. NN/g's fold research found the content just above the fold is viewed **102% more** than content just below it, and the average above/below-fold attention gap is **84%** — so whatever is at position 2 receives a fraction of the attention position 1 gets.
**Implementation.** Keep a compact hero; make the very next band a 3–4 card "Selected Systems" row with one hard metric per card; demote Career Timeline to section 3 or fold it into a single dense "Experience" block (not a 2020-2026 animated spine, which is a long linear scroll for little info).
**Sources:** https://brhane.vercel.app · https://joshuapaul.me · https://adityanamdeo.qzz.io · https://www.nngroup.com/articles/page-fold-manifesto/ · https://www.nngroup.com/articles/scrolling-and-attention/

### R2 — Rewrite the hero headline as a quantified *claim*, not a job title
**Why it matters.** The best pages do not say "I am an AI Engineer." `amankumar.ai` (AI Engineer) opens with a point of view: **"Agents break on software built for people."** `abhaysingh.in` (Awwwards developer/portfolio winner) opens with **"Design rescue for noteworthy brands"** then proves it with "Went from 0 → ₹40m revenue in five years." `aaabadcode.com` (AI Engineer) opens **"Hey, I'm Aaaaby 👋 / AI Engineer."** `dinq.me/elonfeng` (Founding AI Engineer) uses the line **"Translating chaos into code"** plus the substrate: *"Built a multi-agent AI orchestration platform… Architected and operated at production scale."* NN/g's inverted-pyramid guidance: put the single most important fact first so a reader who stops after one sentence still gets the point.
**Implementation.** Headline formula: **`{Outcome/point-of-view} for {who/what you build}`** — e.g. *"Real-time vision on the edge — sub-30ms inference on hardware that costs less than a phone."* Then one sub-headline line in the form **`{Role} · {domain} · {hardest thing you've shipped}`** — e.g. *"AI Systems & Edge Vision Engineer · Jakarta · shipped 8 production CV pipelines on Jetson/Android/TFLite."* Avoid "passionate about AI."
**Sources:** https://amankumar.ai · https://www.abhaysingh.in/ · https://dinq.me/elonfeng · https://www.nngroup.com/articles/inverted-pyramid/ · https://www.nngroup.com/articles/headings-pickup-lines/

### R3 — Put credibility markers *in* the hero (proof-over-claims)
**Why it matters.** `joshuapaul.me` puts "over six years across fintech, SaaS, edtech, health tech, EPoS, applied AI" and "Currently building backend infrastructure and AI systems at **ThriveCart**" directly in the hero — a named employer is stronger social proof than a logo wall. `adityanamdeo.qzz.io` puts a three-stat strip immediately under the headline: **"05+ MODELS DEPLOYED · 17 CORE REPOS"** plus named selection (HPAIR Harvard Conference delegate). `abhaysingh.in` puts a metric under every project title.
**Implementation.** Above the fold include exactly three credibility atoms: (1) current/most-credible role or client by name, (2) years of shipped production work, (3) one verifiable number (models deployed, devices running inference, throughput). Do not use an unquantified "5+ years experience" badge — bind the number to an artifact.
**Sources:** https://joshuapaul.me · https://adityanamdeo.qzz.io · https://www.abhaysingh.in/

### R4 — Replace the "Deployments on Video" section with 3 full case studies in Problem → Approach → Result form
**Why it matters.** Video demos alone show *that* something works, not *how you think* — and they are the least scannable format (no headings, no keywords for the layer-cake scan). The award-winning pattern is text+visual case studies with a metric payoff. `abhaysingh.in` repeats the exact structure per project: a one-line *what it is* ("Clean, low-code software which is a delight to use"), then a bounded claim ("Usage increased from 1k → 10k teams, and 20x revenue after two years"), each linking to a "Case study." `brhane.vercel.app` lists named systems with descriptive titles ("Curricula — AI-Powered Academic Advisor", "LLM-Based Healthcare Data Harmonization"). User case studies should follow the **problem → approach → result** arc with the result stated as a number.
**Implementation.** Keep the videos, but wrap each in a case-study card: **Context/problem (1 line) → Constraint (latency/bandwidth/hardware/accuracy) → Approach (model + engineering choices) → Result (metric + artifact link)**. A 90-second demo video *inside* the case study is fine; a bare video grid as a top-level section is not.
**Sources:** https://www.abhaysingh.in/ · https://brhane.vercel.app · https://www.nngroup.com/articles/layer-cake-pattern-scanning/

### R5 — Express "Tech Stacks & Domains" as evidence-backed capability, not a logo wall
**Why it matters.** NN/g: users engaged in the layer-cake scan pattern skip body text and read only descriptive headings — so a 6-domain logo grid reads as decoration, while a labelled domain with a proof line reads as evidence. `amankumar.ai` labels each capability with a mechanism ("Engineering autonomous software agents that can read codebases, write code, run test suites, and self-correct using LLM reasoning loops"), not a tool name. `haffee.dev` structures skills as scannable groups ("Technical Skills") and pairs publications/certs as named credentials.
**Implementation.** For each of the 6 domains, one heading + one proof sentence + the 3 tools that matter: e.g. **"Edge inference — quantized INT8 models running 24/7 on Jetson Orin; TensorRT, ONNX Runtime, TFLite."** Cut the unqualified percentage-bars / star ratings (see Anti-patterns).
**Sources:** https://amankumar.ai · https://www.haffee.dev · https://www.nngroup.com/articles/layer-cake-pattern-scanning/

### R6 — Cut total page copy toward ~600–900 words and front-load every block
**Why it matters.** NN/g's naturalistic study: users read **at most 28% of words** on an average page, ~**20% realistically**, and pages only reach "half read" below ~111 words; the average page sampled had 593 words. A long animated Career Timeline plus six domain blocks plus video captions will overflow what even a motivated recruiter reads. Inverted-pyramid writing keeps the page valuable at *any* scroll depth.
**Implementation.** Budget each section to 60–120 words of core copy; make the first sentence of every block the load-bearing one; use bold lead-ins so a layer-cake scan alone conveys the story.
**Sources:** https://www.nngroup.com/articles/how-little-do-users-read/ · https://www.nngroup.com/articles/inverted-pyramid/

### R7 — Add a persistent, visible CTA and repeat it at every scroll depth
**Why it matters.** `joshuapaul.me` repeats "Open to consulting, building, and collaborating" and keeps `Connect` in the nav; `brhane.vercel.app` ends with "Let's Connect…" and has "Let's Talk" in the top nav; `amankumar.ai` has "🚀 View Projects / 📬 Let's Talk" in the hero. Since most users never reach the footer, a footer-only CTA is seen by a small minority. NN/g's fold data (102% more attention above fold) means the hero must carry a working CTA.
**Implementation.** Hero CTA pair: primary **"Hire me →" / "Download CV"** plus secondary **"See systems ↓"**. Repeat the CTA in the global nav (sticky), after the proof/work section, and in the footer. State availability explicitly ("Open to mid-senior CV/AI roles — remote or Jakarta").
**Sources:** https://joshuapaul.me · https://brhane.vercel.app · https://amankumar.ai

### R8 — Add a "Selected Systems / Impact" stats band immediately below the hero
**Why it matters.** This is the single most repeatable award-portfolio device: `adityanamdeo.qzz.io` ("05+ MODELS DEPLOYED · 17 CORE REPOS"), `abhaysingh.in` (per-project "0 → ₹40m", "1k → 10k teams", "4k → 80k followers"), and `brhane.vercel.app` ("Engineering at Scale" as its own top section). Digits are a **spotted-pattern** scan target — NN/g found people scan specifically for digits and numerals when skimming, so numbers get found even when prose is skipped.
**Implementation.** 3–4 metric cards: models in production, devices/endpoints running inference, best latency/throughput achieved, datasets or labeled samples processed. Each must be defensible if asked in interview.
**Sources:** https://adityanamdeo.qzz.io · https://www.abhaysingh.in/ · https://brhane.vercel.app · https://www.nngroup.com/articles/web-writing-show-numbers-as-numerals/ · https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/

### R9 — Show 3–4 projects, not everything; make each one deep rather than wide
**Why it matters.** Depth signals seniority; breadth signals juniors. `brhane.vercel.app` "Featured Projects" is a curated set of named systems; `abhaysingh.in` shows 4 case studies total (March, Appsmith, Sleepy Owl, Pune Artistry Works); `joshuapaul.me` has "Featured Work" and a separate "View all work" escape hatch. Recommend **3 flagship case studies + a compact "More work / GitHub" row**, rather than 8–10 equal-weight tiles.
**Implementation.** Order by the target role: put the most edge-vision / production-relevant case first even if it's not your favourite. For mid-to-senior, at least 2 of 3 case studies should show *production* concerns (latency, quantization, monitoring, failure modes), not just accuracy on a benchmark.
**Sources:** https://brhane.vercel.app · https://www.abhaysingh.in/ · https://joshuapaul.me

### R10 — Give each case study one dominant visual proof artifact (architecture diagram > screenshot)
**Why it matters.** For AI/CV roles the hiring signal is *systems thinking*: how data flows from sensor → preprocessing → model → post-processing → action, and where the failure modes are. A labelled architecture/pipeline diagram communicates this faster than a UI screenshot, and `adityanamdeo.qzz.io` explicitly tags its projects with capability labels (`#COMPUTER_VISION #GENERATIVE_AI`) and links `GITHUB` + `LIVE_VIEW` per project. Supporting-formats hierarchy: **architecture diagram → before/after output frames → metric card → short demo video**.
**Implementation.** Each case study leads with a diagram captioned by the constraint it solves; pair with a before/after detection frame strip; keep the video as tertiary evidence, muted, `preload="none"`.
**Sources:** https://adityanamdeo.qzz.io · https://www.nngroup.com/articles/photos-as-web-content/

### R11 — Add a compact, factual "Experience" block that survives the 20%-read rule
**Why it matters.** Even proof-first portfolios still need employment legibility for ATS/recruiter cross-checking. `haffee.dev` does it as tight entries (role + org + one outcome line); `brhane.vercel.app` runs a "Professional Journey" timeline with role → employer → one line each. A 2020–2026 animated spine with little text fails both the scannability test and the AI-relevance test.
**Implementation.** Reverse-chronological, ≤4 roles, each: `Role, Company · dates · one quantified outcome`. Convert the existing 2020-2026 spine into this compact list and let the flagship case studies carry the depth.
**Sources:** https://www.haffee.dev · https://brhane.vercel.app

### R12 — End with a decision-ready contact block (not just an email icon)
**Why it matters.** The footer is the conversion surface. `amankumar.ai` puts GitHub/LinkedIn/Email in the hero *and* keeps a Contact nav item; `adityanamdeo.qzz.io` offers `EXPLORE FILES` + `GET_RESUME.PDF` as explicit downloads. Recruiters convert on *low-friction next steps*, so an email icon alone undersells.
**Implementation.** Footer: one-line availability statement + `Email` + `LinkedIn` + `GitHub` + `Download CV (PDF)` + `Book a 15-min call` if applicable, plus location/timezone ("Jakarta, GMT+7 — overlaps EU mornings & US evenings").
**Sources:** https://amankumar.ai · https://adityanamdeo.qzz.io

### R13 — Make section headings descriptive (mini-IA), not cute
**Why it matters.** NN/g's layer-cake pattern: users scan *headings only*, so a heading must describe **all and only** its section content — the article calls the set of a page's headings its "mini-IA." "Deployments on Video" and "Tech Stacks & Domains" are opaque; "Systems I've Shipped," "Edge Vision in Production," and "Stack & Capabilities" are scannable. Cute names cost you the scan.
**Implementation.** Rewrite every heading to name the content; keep them ≤6 words; ensure headings are visually differentiated (size/weight/colour) so the layer-cake scan engages.
**Sources:** https://www.nngroup.com/articles/layer-cake-pattern-scanning/ · https://www.nngroup.com/articles/mini-ia-structuring-information/

### R14 — Add role/skill keywords for ATS and recruiter search
**Why it matters.** Portfolios are increasingly parsed by ATS and searched with boolean queries; the developer-portfolios corpus shows the convention of an explicit bracketed role tag per person (e.g. `[AI Engineer]`, `[Machine Learning Engineer]`, `[Computer Vision Engineer]`, `[Founding AI Engineer]`). `dinq.me/elonfeng` renders a literal **"Skills and tags: AI Engineer, multi-agent, Full-Stack, Production Architect"** line — a deliberate indexable keyword block.
**Implementation.** Include one plain-text keyword line (visible or in metadata): `AI Engineer · Computer Vision · Edge AI · TensorRT · ONNX · TFLite · Jetson · PyTorch · Production ML`. Keep the phrasing matched to the job titles Ryas targets.
**Sources:** https://github.com/emmabostian/developer-portfolios · https://dinq.me/elonfeng

### R15 — Set generous target metrics: 6–8 top-level sections, ~1.5–3 screen heights of real density, 3–4 proof rows
**Why it matters.** Synthesising the extracted structures: elite AI portfolios converge on **6–8 top-level sections**, roughly **1.5–3 viewport-heights** of dense, scannable content before the long-tail project detail, and a "3 featured + a few more" project count. More than that and the 20%-read rule means the tail is never seen; fewer and it reads as thin for a mid-to-senior candidate.
**Implementation.** Target order/section count as in §2 below; verify by scrolling on a 1440×900 laptop and a 390px phone — if a section contains no number or no named system, cut or merge it.
**Sources:** https://www.nngroup.com/articles/how-little-do-users-read/ · https://brhane.vercel.app · https://joshuapaul.me

---

## 2. Recommended ideal section ORDER (with justification)

**For Ryas Rafi Karim — AI Systems & Edge Vision Engineer**

1. **Hero (name · role · claim headline · 1-line sub-claim · proof atoms · CTA pair)** — Inverted pyramid + fold research: the top bar of the F-pattern gets the most gazes; must contain role, credibility, and a working CTA. *(R2, R3, R7)*
2. **Impact / Selected Systems stats band (3–4 metric cards)** — Digits are spotted-pattern targets; proves scale in <5 seconds. *(R8, R1)*
3. **Selected Systems / Case Studies (3 flagship, Problem → Approach → Result, each with a diagram + metric)** — Proof before chronology; the core hiring signal for mid-senior AI/CV. *(R4, R9, R10)*
4. **Experience (compact reverse-chron: role · org · dates · one quantified outcome)** — Recruiter/ATS legibility without a long animated spine. *(R11)*
5. **Stack & Capabilities (domains with proof sentences, not logo walls) + the ATS keyword line** — Evidence-backed capability + discoverability. *(R5, R14)*
6. **Writing / Talks / Publications / Certifications (optional, only if real)** — Trust signals that distinguish senior candidates; skip entirely if you have none. *(see Anti-patterns)*
7. **Contact / CTA (availability line · email · LinkedIn · GitHub · Download CV)** — Conversion surface with low interaction cost. *(R12)*

**Justification for the reorder vs. current site:** move **Proof/Systems (new #3) above Career Timeline (now #4)** because hiring decisions for AI/CV roles hinge on demonstrated production systems, and because everything below the fold is seen ~84% less; convert **"Deployments on Video" → case-study cards** so the video becomes supporting evidence inside a scannable structure; split **"Tech Stacks & Domains"** into proof-sentence capabilities + an indexable keyword line.
Kept from the current site (these are correct): a compact hero first; videos retained but demoted; contact last but upgraded to a multi-action block.

---

## 3. Real, top-tier example URLs — what to copy from each

| Portfolio | URL | What to copy |
|---|---|---|
| Brhane Giday (AI Engineer) | https://brhane.vercel.app | Section order: **proof ("Engineering at Scale") before "Professional Journey"**; descriptive project titles naming the system. |
| Joshua Paul (Senior Fullstack & AI Engineer) | https://joshuapaul.me | Hero credibility with a **named employer + years + domain list**; nav `About/Work/Stack/Writing/Connect`; "Featured Work" + "View all work". |
| Abhay Singh (Awwwards portfolio winner) | https://www.abhaysingh.in/ | The **one-line project summary → hard metric ("1k → 10k teams") → "Case study"** pattern; designer-grade restraint. |
| Aman Kumar Jha (AI Engineer) | https://amankumar.ai | **Point-of-view headline**, capability statements phrased as mechanisms, hero CTAs ("View Projects / Let's Talk"). |
| Aditya Namdeo (Data & ML Systems) | https://adityanamdeo.qzz.io | **Stat strip under hero (models deployed / repos)**; per-project capability tags (`#COMPUTER_VISION`) + `LIVE_VIEW`; verbatim scannable headings. |
| Elon Feng (Founding AI Engineer, DINQ.me) | https://dinq.me/elonfeng | **Explicit "Skills and tags" keyword line**; concise "Translating chaos into code" positioning + production-scale claim. |
| Hafeez Mohamad (SWE/AI) | https://www.haffee.dev | Tight **Experience entries** (role · org · one outcome) and skills grouped into scannable labelled clusters. |
| Gustavo Batista (Awwwards developer winner) | https://gustavobatista.dev/ | Explicit **nav IA** (`Home/Sobre/Serviço/Projetos/Contato`), CV download, service framing. |
| Gowtham Sridhar (Applied AI × HCI) | https://www.gowthamsridhar.com | Nav pattern `Home/About/Projects/Awards/Contact/CV` — a clean 6-item IA template. |
| Pragadheesh Raj (Awwwards portfolio winner) | https://www.spragadheeshraj.com | Craft/typography benchmark; custom-font hero treatment (use as aesthetic reference only). |

Award-gallery sources for further mining: Awwwards portfolio collection (https://www.awwwards.com/websites/portfolio/), Awwwards developer tag (https://www.awwwards.com/websites/developer/), the 1,981-entry real-portfolio list (https://github.com/emmabostian/developer-portfolios).

---

## 4. Anti-patterns to avoid

1. **Career timeline as section 2** — linear, low-density, and pushes proof below the 84% attention cliff. *(R1)*
2. **Unquantified skill bars / star ratings / percentage profiler** — "Python 90%" is unfalsifiable and reads as filler; use proof sentences instead. *(R5)*
3. **Logo walls as a substitute for capability** — a grid of 30 tool logos says nothing about depth.
4. **Bare video grids ("Deployments on Video")** — unscannable, no headings for the layer-cake scan, no metric, no architecture. *({R4)*
5. **Job-title-only hero ("I am an AI Engineer")** — wastes the highest-attention real estate; use a claim + proof. *(R2)*
6. **Footer-only CTA** — most users never reach it. *(R7)*
7. **Cute/opaque section names** ("Deployments", "Tech Stacks & Domains") — headings must self-describe their section. *(R13)*
8. **Equal-weight project dumping (8–10 tiles)** — depth over breadth for mid-senior roles. *(R9)*
9. **Fabricated or unverifiable metrics** — every number must survive an interview follow-up. *(R8)*
10. **Sections you can't fill credibly: empty "Publications"/"Testimonials"/"Blog" with 0–1 entries** — fluff sections read as red flags; cut them rather than pad them. *(§2, item 6)*
11. **"Passionate about AI" / "lifelong learner" boilerplate** — zero information; NN/g's "Blah-Blah text" rule applies. (https://www.nngroup.com/articles/blah-blah-text-keep-cut-or-kill/)
12. **Heavy scroll-jacking / long preloader animations** — an "engineering portfolio" that prioritises cinematic scroll over readable content trades away the recruiter audience; NN/g notes full-page intros create "false floors" that stop scrolling. (https://www.nngroup.com/articles/page-fold-manifesto/)
13. **Hidden nav anchors / no sticky nav** — users need low-interaction-cost jump targets on a long page (NN/g in-page links: https://www.nngroup.com/articles/in-page-links/).
14. **Auto-playing audio/video** — instant credibility loss in an office recruiter context.

---

## 5. Quick implementation checklist for Ryas

- [ ] Rewrite hero: claim headline + `role · domain · shipped-hardest-thing` sub-line + 3 credibility atoms + `Hire me / Download CV` + `See systems ↓`.
- [ ] Insert 3–4 metric cards directly under the hero.
- [ ] Convert the 3 video demos into 3 case studies: Problem → Constraint → Approach → Result (metric), each with an architecture diagram; keep videos inside the cards.
- [ ] Compress Career Timeline 2020–2026 into a tight reverse-chron Experience block (≤4 entries, one quantified outcome each).
- [ ] Rewrite "Tech Stacks & Domains" as 6 proof sentences (one per domain) + a single ATS keyword line.
- [ ] Rename headings to descriptive mini-IA; add a sticky nav with anchors.
- [ ] Upgrade footer to a multi-action conversion block with explicit availability + timezone.
- [ ] Trim total copy toward ~600–900 words of core text; bold the load-bearing first sentence of every block.
- [ ] Verify scan test: at each section, can a skimmer get meaning from headings + numbers alone?

---

*Report compiled from primary-source extraction of live portfolio DOMs and NN/g eyetracking research. `web_search` was unavailable in this session; findings are grounded in directly fetched pages, not listicles.*
