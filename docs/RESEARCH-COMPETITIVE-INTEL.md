# Competitive Intelligence: AI / CV / Robotics Engineer Portfolio Websites
**Prepared for:** Ryas Rafi Karim — AI Systems & Edge Vision Engineer, Jakarta, Indonesia
**Target:** Mid-to-senior roles
**Method:** Primary-source analysis. Every site marked ✅ was actually fetched and its DOM/text read. Sites marked ⚠️ were unreachable and are reported from search snippets only.

---

## 0. Session Caveats (read this first)

- **`web_search` was intermittently hard-failing** (`DeepSeek API error HTTP 404`, `TypeError: fetch failed`). It recovered near the end of the session, which is when most of the discovery searches above ran.
- **Direct HTML search engines were mostly blocked:** DuckDuckGo HTML/lite → `fetch failed`; Brave → `fetch failed`; Mojeek → CAPTCHA ("JavaScript is required"); searx instances → `fetch failed`.
- **Bing HTML search returned HTTP 200 but was effectively useless** — it silently dropped `site:` and quoted operators and returned dictionary/Wikipedia/Shopee definitions for query terms. **Do not trust Bing-scraped results in this session.**
- **Consequence:** I could not systematically enumerate "the 20 most famous AI engineers' personal sites" via search. Instead I harvested real candidate URLs from the GitHub **`emmabostian/developer-portfolios`** README (1,981 tagged portfolios, raw README fetchable), plus search leads, and then **fetched each site directly** to analyse real structure. This is stronger evidence than a listicle roundup, but the sample is biased toward discoverable/indie/early-career sites rather than celebrity researchers.

**All URLs cited are real and were retrieved live unless marked ⚠️.**

---

## 1. Table of Real Portfolio Examples

| # | Site / Person | URL | Positioning | Visual style | Standout trait | Fetched? |
|---|---|---|---|---|---|---|
| 1 | **Christopher L. Hammer** | https://christopherhammer.dev | "AI agent engineer · product builder", local-first AI | Dark, restrained; heavy use of monospace code blocks as evidence | **16 narrated video proof demos**; portfolio organised "by what each project *proves*"; explicit "Before/After" failure metrics per infra project | ✅ ✅ (richest example found) |
| 2 | **Anirudh Negi** | https://negiadventures.github.io | "AI Systems & Backend Engineer" — *closest analog to Ryas* | Minimal, light, large type, product screenshots | Hero: "Agents that ship. Backends that hold."; each project tagged **Live / Beta / Labs** with live domain links; shows 236-tool registry exposed 6 ways | ✅ |
| 3 | **Mihir Chauhan** | https://chauhan-mihir.vercel.app | ML/AI Engineer — "production systems, end to end" | **"Technical specification" / ML-lab aesthetic** — labelled blocks (`CLASS`, `TRAINING`, `MODALITIES`, `DEPLOYED AT`, `STATUS`), `FIG. 1`, `§ 01` section marks, animated counters | Skills presented as a *spec sheet*; metric counters (GPA, % CV accuracy, −% query time); résumé PDF + publications; copy witty ("none invented where it doesn't") | ✅ |
| 4 | **Aryan Raj** | https://www.aryanraj.cv | Software Engineer (AI/ML) @ ValueLabs | Clean light, conventional product-page feel | **Section order is the template to copy:** About → Work → Education → Projects → Writing → Engineering (skills+publications) → Contact; IEEE/Springer publication + arXiv + DOI; Cal.com booking link; résumé PDF | ✅ |
| 5 | **Parth Kale** | https://parkky.vercel.app | "AI Engineer", Mumbai | Playful "scrapbook" aesthetic; "exhibit A", handwritten asides | **"The Rule Book"** — 6 engineering principles as an opinionated manifesto; deep-dive Medium posts on GPT architecture, causal attention, Paged Attention — *not* "intro to AI" | ✅ |
| 6 | **Walter "Myzhar" Lucetti** | https://myzhar.tech/about/ | Computer Engineer — Robotics, CV, AI; Senior SWE @ Stereolabs | Classic Jekyll "Minimal Mistakes" blog | **THE edge-robotics archetype**: names NVIDIA Jetson™ platforms, CUDA, ROS 2, OpenCV, stereo vision, 3D perception; hardware robot (MyzharBot, 3D-printed); dense tutorial/blog engine; open-source ROS 2 drivers | ✅ |
| 7 | **Manikanta Darapureddy** | https://www.manikantadarapureddy.in | "Computer Vision Engineer shipping production AI SaaS" | Dark, animated, skill-percentage bars | Splits **Products (monetized, live) vs Projects (open source)**; explicit tech taxonomy incl. a "Computer Vision" group (OpenCV, YOLO, MediaPipe, ONNX, Face-api); hero code block of a real LangChain agent | ✅ |
| 8 | **Ezra Desmond Sutanto** | https://www.ezradesmonds.my.id | Informatics student · AI & Full-Stack Builder | Editorial/archival — "Case files", `file / 01.`, numbered dossiers | Every project is a **full case study page** with real numbers (302 registrations, 1,300 attendees); operational principles ("Clarity before speed / Systems before vibes"); states unfinished work honestly ("load … pending validation") | ✅ |
| 9 | **Paul Pietzko** | https://www.paulpietzko.com | Full-stack dev, CH | Swiss-minimal, numbered sections (01–06), generous whitespace | **"Receipts" section** — GitHub API stats pulled live (commits, reviews, PRs, 12-month contribution graph) with the line "a portfolio should be able to show its working"; conference/event photo gallery | ✅ |
| 10 | **Gowtham Sridhar** | https://www.gowthamsridhar.com | Applied AI × HCI × Robotics, Junior Scientist @ AIT | Minimal single-page anchors | Very short; hero = one sentence + role; nav Home/Projects/Awards/Contact; CV as Google Drive link. **A cautionary contrast: thin content** | ✅ |
| 11 | **Mydhily M R** | https://mydhily-mr.github.io/portfolio/ | Embedded Systems / Electronics Engineer | Plain static, dark-light toggle | Demonstrates **edge/embedded signalling with zero flash**: UART, RS485, I2C, register-level config, driver porting, frame parsing, checksum validation | ✅ |
| 12 | **Naveed Sohail Gung** | https://naveed-gung.dev | Full-stack / mobile / infra | Plain docs-style | Explicitly tells the reader the site's purpose: "so recruiters, clients, and search systems can inspect real implementation areas instead of generic profile copy"; adds **Case Studies** + **Cyber Lab** (990+ TryHackMe rooms) as separate crawlable proof archives | ✅ |
| 13 | **Andrej Karpathy** | https://karpathy.ai | Director of AI @ Tesla (fmr), OpenAI founding member, educator | ~Zero design. "Pure HTML and CSS in two static files" | **The anti-portfolio benchmark.** Authority comes 100% from artefacts: talks, papers, courses (CS231n), three blogs, pet projects. Explicitly rejects heavy sites: "seriously allergic to 500-pound websites" | ✅ |
| 14 | **Paul Pietzko / sobolevn (Nikita Sobolev)** | https://sobolevn.me | Python tooling expert | Blog-first, chronological archive | **Blog-as-portfolio**: 40+ deep technical posts become the credential; portfolio page is minimal | ✅ |
| 15 | **Muhammad Hassan Nazar** | https://hassannazar72.github.io/portfolio/ | Full-Stack Developer (not AI) — *control sample* | Dark, "Hello, World!" terminal-ish hero | **What an average portfolio looks like**: timeline, project grid of 4 repos, percentage-free flat tech list, LeetCode stats, reveal-email button. Clean but generic — no metrics, no case studies | ✅ |
| 16 | **Mustafa Yalçın** | https://mylcin.vercel.app | Front-end | — | ⚠️ **Rendered to one line of text** ("Mustafa Yalçın") to a fetcher — pure-JS SPA. Invisible to non-JS crawlers | ✅ (but near-empty) |
| 17 | **Adam Alston** | https://www.adamalston.com | ML/DS engineer | — | ⚠️ Same problem: single line to a fetcher | ✅ (near-empty) |
| 18 | **Ali Saleem** | https://alisaleem252.com | WordPress dev | — | ⚠️ Title only | ✅ (near-empty) |
| 19 | **Tufail Ahmed Khan** | https://www.tufail.dev | Senior SWE — Python, FastAPI, AI | — | ⚠️ Title only | ✅ (near-empty) |
| 20 | **Pablo Álvarez (paxdev)** | https://github.com/pabloalvarez99/paxdev | "**Evidence-first** AI systems portfolio" | — | ⚠️ Repo only, site unreachable. Concept worth noting: the framing *is* the differentiator | ⚠️ |
| 21 | **Harsh Bhate** | https://harshbhate.com | Hero literally reads "I'M AN AI/ML ENGINEER SPECIALIZING IN **EDGE AI**" | — | ⚠️ Unreachable in this session; headline captured from search snippet. Directly relevant comparator if reachable later | ⚠️ |
| 22 | **Marcus Mayo** | https://github.com/marcusmayo/machine-learning-portfolio | ML portfolio (template-style) | — | ⚠️ GitHub Pages 404 at guessed URL; repo indexed | ⚠️ |
| 23 | **David Romero** | https://github.com/davidromeroy/computer-vision-portfolio | "Object detection, 3D vision, robot perception" | — | ⚠️ Pages 404; repo indexed. Useful as *project-naming* reference | ⚠️ |

**Also found and useful as evidence, not as exemplars:**
- `emmabostian/developer-portfolios` — 1,981 portfolios, tagged by role; the only large real corpus I could mine without search. https://raw.githubusercontent.com/emmabostian/developer-portfolios/master/README.md
- `alexeygrigorev/ai-engineering-field-guide` → `portfolio/06-common-mistakes.md` — an AI-engineering-specific portfolio critique. https://github.com/alexeygrigorev/ai-engineering-field-guide/blob/main/portfolio/06-common-mistakes.md
- `aojedao/MESGRO` — a Jekyll template built *specifically* for robotics/mechatronics portfolios (3D models, schematics). https://github.com/aojedao/MESGRO
- Awwwards portfolio tag (⚠️ unreachable): https://www.awwwards.com/websites/portfolio/

---

## 2. Structural Analysis (Section Order, Hero, Projects, Skills, Contact)

### 2.1 Dominant section order (synthesised from the fetched set)

The convergent, near-universal order among strong sites:

```
Hero (name + role + one-line outcome claim)
→ Selected Work / Projects  (with proof)
→ Experience
→ Skills / Stack
→ Writing / Publications / Tutorials
→ Contact
```

Deviations and why they work:
- **Aryan Raj** puts `Work → Education → Projects → Writing → Engineering (skills + publications) → Contact`, and offers a `⌘K` command palette. Skills are deliberately pushed **late** — proof first, list last.
- **Anirudh Negi** puts `Selected Work` immediately after the hero and *deletes* the conventional "skills section" in favour of per-project stack chips. Strong.
- **Christopher Hammer** inverts it entirely: `Selected Work → Workflow → Demos → Projects → Impact → Use Cases → Local Business → Proof`. It is organised by *argument*, not by résumé chronology. This is the most sophisticated ordering I found.
- **Mihir Chauhan** uses `01 Overview → 02 Experience → 03 Projects → 04 Skills → 05 Publications → 06 Contact` with **numbered section markers**, which makes a long single page feel navigable.
- **Nav patterns:** anchor-based single page (Gowtham, Mihir, Manikanta, Hassan, Mydhily) vs multi-route SPA (Parth: `/projects`, `/about`, `/resume`). Single-page anchors dominate in this sample because they let a recruiter scroll once and see everything.

### 2.2 Hero headline styles — five repeatable patterns

| Pattern | Formula | Real examples |
|---|---|---|
| **Outcome claim (best)** | One sentence naming what ships and why it's hard | Negi: *"Agents that ship. Backends that hold."* / Hammer: *"I build local-first AI agents that work in real-world environments."* |
| **Spec-sheet** | Structured key/value identity block | Chauhan: `CLASS ML / AI Engineer — production systems, end to end`, `MODALITIES …`, `DEPLOYED AT SharkNinja · CU Anschutz · Honda 99P Labs` |
| **Role + scale claim** | Title + a scale/craft adjective | Aryan Raj: *"Building deep learning solutions, generative AI products, and data infrastructure at scale."* |
| **Manikanta** | Metaphor | *"Building the intelligent web one model at a time."* |
| **Terminal/greeting** | `Hello, World!` / `hi, human 👋` | Hassan (`Hello, World!`), Parth (`hi, human 👋`) — *works against credibility if unsupported by proof* |

**Weakest pattern observed:** name + generic role + no claim (Gowtham: *"Junior Scientist at AIT focusing on Human-Computer Interaction, AI, XR Applications, and Robotics"* is fine, but the page then delivers almost no project evidence).

### 2.3 How they present projects

Ranked from weakest to strongest, with real instances:

1. **GitHub link grid** (weakest) — Hassan: 4 cards, each a title + 1 sentence + repo link. No user, no metric, no outcome.
2. **Stack-chipped cards** — Manikanta, Aryan Raj: title, category, 2–4 sentence description, technology chips, live link. Solid baseline.
3. **Case-study pages** — Ezra: every build gets its own route (`/work/tokokaret/`) with a narrative ("Case files from the systems, products, and experiments behind the positioning") and **hard numbers** (302 registrations, 284 approved participants, 1,212 event participants).
4. **Proof-of-workpage with narrated demos** (strongest) — Hammer: each repo answers *"who would use this, what pain does it remove, and what proof can someone watch without running the code?"* — then a **narrated MP4** and a **Before/After** block, e.g.:
   ```
   Before: API timeout / Malformed JSON / Dead source link / Prompt too large
   After:  Retry 2 succeeded / JSON repaired / 11/12 links verified
           Context reduced 38% / Failure metadata attached
   ```
5. **The "what this proves" framing** — Hammer again: projects 01–05 are labelled `Flagship / Builder / Infrastructure / Context / Proof Apps`. Negi labels each `Live / Beta / Labs`. Manikanta splits `Products (monetized, live)` vs `Projects (open source)`. **Labelling projects by their evidentiary role is the single most transferable tactic in this dataset.**

### 2.4 How they present skills/stack

- **Flat chip list** (most common, weakest differentiation) — Hassan, Naveen Gung. Naveen's is one long comma-run of 30+ items: React, Angular, TypeScript, … DevOps, Machine Learning, AI Agents, Odoo ERP. Dilutes signal.
- **Categorised groups** — Manikanta is the best example: Languages / Frameworks / AI-ML / Data & Databases / Cloud & DevOps / Tools & Platforms / AI Tools & LLMs / **Computer Vision** / Productivity / Others, each with a % badge, plus a **"Currently Exploring"** block (LangGraph, AI Agents, LLM Fine-Tuning, GraphRAG).
- **Spec-sheet modalities** — Chauhan: `MODALITIES LLM evaluation · Multi-agent systems · RAG · MLOps · AWS`.
- **Per-project chips only, no global skills section** — Negi. Forces skills to be *evidenced* rather than *claimed*.
- **Tool-centric with links** — Pietzko links each stack item to its docs, signalling literacy over recitation.

### 2.5 Blog / publications / tutorials presence

| Site | Writing | Publications | Notes |
|---|---|---|---|
| Karpathy | 3 blogs, ~20 listed posts | Full paper list + Google Scholar | Blog and papers are the *entire* portfolio |
| Myzhar | Large tutorial engine (ROS 2 QoS, OpenCV+CUDA builds, Jetson notes) | — | Tutorials are the credibility engine |
| Aryan Raj | Medium articles + `/blog` | Springer LNNS + arXiv + DOI | Both — strong |
| Chauhan | Medium (99P Labs) write-up | JOOSDT paper, 96.5% accuracy | Both — strong |
| Parth | 3 deep Medium posts (GPT architecture, causal attention, Paged Attention) | — | Depth over volume — very effective |
| Naveen Gung | Blog + Case Studies + Hub + Cyber Lab | — | **Proof archives as first-class nav items** |
| sobolevn | 40+ posts | — | Blog-first |
| Hassan | none | none | |
| Gowtham | none | none listed | |
| Manikanta | none | none (open-source links only) | Gap even though site is otherwise strong |

**Pattern:** the top-quartile sites pair *evidence of building* with *evidence of thinking*. Sites with neither writing nor publications must compensate with unusually strong demos (Hammer) or extraordinary brand authority (Karpathy).

### 2.6 Contact approach

- Plain `mailto:` + LinkedIn/GitHub icons — the default (Aryan, Negi, Hassan, Parth, Myzhar).
- **Cal.com 30-minute booking link** with the copy *"Book a 30-minute call to discuss AI/ML projects"* — Aryan Raj. **Highest-conversion pattern in the set.**
- **Purpose-stated CTA** — Hammer: `Request audit` and `$500 starter build / $199/mo / $499/mo growth` — converts the portfolio into a sales surface.
- **Reveal-email button** — Hassan. Reduces scraping but adds friction; I'd avoid for inbound recruiting.
- **Google Drive CV link** — Gowtham (weaker: no ATS-readable PDF).
- **Downloadable résumé PDF** — Chauhan, Aryan, Ezra, Manikanta. Table stakes.

### 2.7 Page length & visual weight

- Karpathy: two static files, ~0 frameworks.
- Chauhan: one long page, dense, numbered, ~6 sections.
- Hammer: very long (10+ sections) but with `Start here` / `Watch the proof` jump links and video.
- Gowtham: extremely short — and it reads as *thin*, not *focused*.
- **Verdict:** length is not the variable; **evidence density per screen** is. Hammer is long but every section carries proof. Gowtham is short and carries almost none.

---

## 3. Recurring Winning Patterns (the top-10% signals)

1. **Numbered, outcome-claiming hero.** Not a name — a claim about what ships. Negi's *"Agents that ship. Backends that hold."*, Hammer's *"I build local-first AI agents that work in real-world environments."* Pair it with a role label so a recruiter's 6-second scan lands. → *Top 10% because it answers "what do you do" before "who are you".*

2. **Projects labelled by evidentiary role, not by chronology.** `Flagship / Builder / Infrastructure / Context` (Hammer), `Live / Beta / Labs` (Negi), `Products vs Projects` (Manikanta). → Forces the reader to understand *why* each item is there and prevents a flat repo grid.

3. **Before/After or hard-number metrics on every claim.** Hammer: *"Context reduced 38%"*, *"11/12 links verified"*. Chauhan: counter cards with CV-model accuracy and query-time reduction. Manikanta: downloads, AES-256, Razorpay. → Numbers are the cheapest possible credibility and almost nobody does it.

4. **Live, clickable artefacts.** Negi links every project to a real domain (`utilix.tech`, `karyfy.com`, `papertrade-arena.vercel.app`); Manikanta links live SaaS. → A `Live` badge with a working URL distinguishes shipping engineers from tutorial-followers.

5. **Video / narrated demo proof.** Hammer's 16 narrated demos with the instruction *"Watch the work before reading the resume."* → Highest-bandwidth proof; also the rarest, which is exactly why it differentiates.

6. **Case-study depth over repo breadth.** Ezra's per-project dossiers with real user counts; Naveen Gung separating Case Studies from Blog from Hub from Cyber Lab. → Three deep write-ups beat twenty cards.

7. **A technical-writing engine with *narrow, deep* topics.** Parth writes on GPT internals, causal attention, Paged Attention — not "Introduction to Machine Learning". Myzhar writes ROS 2 QoS and building OpenCV 5 with CUDA. → Depth signals you are in the codebase, not adjacent to it.

8. **Named platforms, versions, and constraints instead of adjectives.** Myzhar: `NVIDIA Jetson`, `CUDA`, `ROS/ROS 2`, `OpenCV`, `stereo vision`, `Point-to-Line ICP`. Mydhily: `UART, RS485, I2C, register-level configuration, frame parsing, checksum validation`. Negi: `failure semantics, tool contracts, guardrails`. → Specific nouns are unfakeable; "passionate about AI" is fakeable.

9. **Stated opinions/manifesto.** Parth's "Rule Book" (*"own the whole thing: the prototype, the prod deploy, and the 3am logs"*). Ezra's operating notes (*"Clarity before speed / Systems before vibes / Execution before talk"*). Hammer naming agent failure modes as *the* interesting problem. → Signals seniority-of-judgement; rare below senior level.

10. **Purpose-explicit site architecture + crawlability.** Naveen Gung states outright that the site exists so "recruiters, clients, and search systems can inspect real implementation areas". Pietzko adds a live GitHub "Receipts" panel *"because a portfolio should be able to show its working."* → Deliberate, defensible information design.

11. **Publications/DOIs where they exist, omitted where they don't.** Chauhan (JOOSDT paper) and Aryan Raj (Springer LNNS + arXiv + DOI) present them formally. Nobody fakes them. → If you have none, do not build an empty section.

---

## 4. Gaps — What Is Commonly Missing Even From Good AI Portfolios

Evidence: this is the intersection of what the fetched strong sites omit **and** what `ai-engineering-field-guide/portfolio/06-common-mistakes.md` explicitly warns about.

1. **Evaluation evidence.** Almost nobody shows a test set, error analysis, or precision/recall/F1 on a real dataset. The field guide is blunt: *"An AI portfolio project needs a way to tell whether it improved… Start with 20-50 examples"*, including messy cases, out-of-scope requests, and refusal cases. **This is the #1 differentiator available and it is empty.**
2. **Baselines.** No one shows "v1 heuristic vs v2 model" or "before/after fine-tuning". Without a baseline, a metric is a number, not an improvement.
3. **Cost / latency / throughput budgets.** Only Hammer gestures at this (`Context reduced 38%`). For edge work this is the *entire job* — fps per stream, watts, thermal envelope, model size in MB, RAM ceiling. Nobody publishes it.
4. **Observability / failure handling.** Hammer is the sole example (Tool Use Guardian: retries, timeouts, JSON repair, failure metadata). The field guide's "No Monitoring Plan" section — request ID, model version, prompt version, retrieved sources, tool calls, latency, token use, cost — is essentially unimplemented across this whole sample.
5. **Honest failure sections / what didn't work.** Ezra comes closest ("full load … remain pending validation"). Almost universally everyone presents only successes. An explicit "what broke and what I changed" section is near-zero competition.
6. **Hardware/constraint reality for edge work.** No site in this sample (except Myzhar's *mentions*) shows a device photo, a wiring diagram, a thermal/power measurement, or an EMC field note. MESGRO (the robotics Jekyll template) exists precisely because this is underserved.
7. **Deployment/infra specifics.** "Docker, AWS, Kubernetes" chips appear everywhere; nobody shows a Dockerfile size budget, a CI eval gate, an ONNX/TensorRT export, or a rollback story.
8. **Data provenance and labelling.** How was the training/validation data collected, labelled, versioned, and how is drift detected? Silent everywhere.
9. **Industry/domain framing.** Most sites describe *technology*; almost none name the *user, workflow, and cost of the old process*. The field guide: *"A domain isn't a problem… Before building, write: who uses it, what input they provide, what output they need, what version 1 will do, how you'll check it."*
10. **Non-JS-renderable content.** Empirically demonstrated: `adamalston.com`, `alisaleem252.com`, `tufail.dev`, `mylcin.vercel.app` returned essentially **a single line of text** to a non-JS fetcher. Their content is invisible to many ATS-adjacent crawlers, Slack/LinkedIn unfurlers, and some recruiter tooling. (Note: this is a *rendering* observation from my fetcher, not proof those sites are broken in a browser — but the risk is real and easily mitigated with pre-rendering/SSG.)
11. **A single obvious "start here" path.** Only Hammer does this explicitly (*"Start here · narrated proof — Watch the work before reading the resume"*). Everyone else assumes linear scrolling.

---

## 5. Specialist vs Generalist — Differentiation Strategy for "AI Systems & Edge Vision Engineer"

### 5.1 The three archetypes you must NOT resemble

| Archetype | Tell | Why it fails you |
|---|---|---|
| **"AI enthusiast"** | "Passionate about AI/ML", LangChain + Streamlit chatbot demos, no numbers, no users | Reads as a course graduate; undermines 4 real production systems |
| **Researcher** | Papers-first, benchmarks on public datasets, no deployment story | Signals you'd rather publish than ship; the opposite of your edge-production value |
| **Generic full-stack + "AI"** | Catalogues of tech chips, LeetCode counter, GitHub link grid | Your CCTV/maritime/CAD work becomes invisible — it's your only moat |

### 5.2 The positioning claim

Do not claim "AI Engineer". Claim the **hard intersection** — the thing that is expensive to get wrong:

> **"I make vision models run on the cameras and boats that are already deployed — in the rain, on 4G, on hardware nobody can reboot on a Sunday."**

That is a *constraint* claim, and constraints cannot be bluffed. Every one of your four real projects is a constraint story:
- **CCTV analytics** → multi-stream decode, sustained fps, night/low-light, no cloud egress, privacy.
- **Maritime fleet vision** → intermittent connectivity, motion, glare/salt, horizon, GPS/time sync.
- **Local LLM agents** → no external API, quantisation, RAM/VRAM ceiling, latency budget, offline operation.
- **CAD automation** → deterministic pipeline correctness, regression safety, format fidelity.

### 5.3 What content *proves* edge/production competence

Design the portfolio so each artefact could only have been produced by someone who actually deployed. Concretely:

**A. An "Edge Deployment Cards" section — one card per system, each with the same fixed schema.** This alone would put you ahead of ~every portfolio in this report.

```
SYSTEM      Multi-camera intrusion analytics — 12 streams, Jakarta
HARDWARE    Jetson Orin NX 16GB · 12 × 1080p RTSP
MODEL       YOLOv8n → ONNX → TensorRT FP16, 6.4 MB, INT8 calibrated
THROUGHPUT  12 × 25 fps sustained; p99 decode-to-alert 310 ms
ENVELOPE    11–14 W; 62 °C steady-state with passive heatsink
FAILURE     Stream drop → auto-reconnect + frame-gap detection
            Night IR false positives → per-camera ROI + temporal vote (FP −71%)
OPS         systemd + watchdog, remote log pull, OTA model swap, rollback to v3
EVIDENCE    [30 s screen capture] [fps/power chart] [confusion matrix on 4,000 local frames]
LESSON      INT8 quantisation cost 3.1 pts mAP but doubled throughput — worth it
```

Repeat this schema for maritime fleet vision, local LLM agents, and CAD automation. **The fixed schema is the product**: a reviewer can compare systems at a glance and can see you think in budgets, not in buzzwords.

**B. Numbers that only a production engineer has.**
- fps per stream, and fps *under* the worst realistic load
- milliseconds: ingest → inference → alert
- watts, °C, MB of model, GB of RAM headroom
- uptime / days without manual intervention, and the size of the ops surface
- **error rates on YOUR data, not COCO** — with the labelling method named
- cost per camera per month vs the cloud alternative
- false-positive reduction from a specific, nameable engineering change

**C. A short "Failure Log / Postmortems" section.** 3–5 entries: symptom → diagnosis → fix → measured effect → what you'd do differently. This is nearly unique in the entire sample and reads unmistakably as production experience.

**D. A short "Constraints & Trade-offs" note per project.** Why quantise, why on-device not cloud, why this sensor, why this latency budget, what you'd trade if the budget doubled.

**E. Depth writing, narrowly targeted** (the Parth/Myzhar pattern): e.g. *"Running a 3B local LLM on an 8 GB edge box: what actually fit"*, *"Why our CCTV model's night false positives were a labelling problem, not a model problem"*, *"Maritime horizon detection when the IMU drifts"*. Never "intro to computer vision".

**F. Hardware reality made visible.** A photo of the actual deployment rig, a wiring/pipeline diagram, a thermal or power chart, a screenshot of a real ops dashboard. Myzhar proves the value of *showing the robot*; nobody in the AI sub-sample does the edge equivalent.

**G. Precision about the stack, with versions and trade-offs.** `TensorRT 10 / INT8 / CUDA 12`, `GStreamer`, `DeepStream`, `ONNX Runtime`, `llama.cpp Q4_K_M`, `RTSP/NVENC`, `Raspberry Pi 5 + Hailo`. Naming the accelerator and the quantisation format is unfakeable and immediately separates you from the "AI enthusiast".

**H. A one-line "what I am NOT"** for honesty and differentiation, e.g. *"I don't train foundation models. I make models survive deployment."* This is a *credibility accelerator* — it makes the rest of your claims more believable.

### 5.4 Message hierarchy for Ryas

1. Constraint-first hero (edge/on-prem/offline) — one sentence.
2. Four **edge deployment cards**, fixed schema, each with a numeric proof and a demo artefact.
3. "Failure log / postmortems" (3–5 entries).
4. Writing (3–5 narrow, deep posts).
5. Stack, grouped by *layer* (Sensor → Ingest → Inference → Runtime → Ops → Data), not alphabetically.
6. Contact with a booking link + résumé PDF + GitHub.

---

## 6. Visual Style Scan — Which Identities Read as Credible Now

### 6.1 Identities observed in the sample

| Identity | Real instances | Credibility read | Fit for Ryas |
|---|---|---|---|
| **"Technical spec / ML lab"** | Chauhan (`CLASS`, `MODALITIES`, `FIG. 1`, `§ 01`, animated counters) | **Highest for ML/AI** — reads as instrumentation, not marketing | ★★★★★ Adapt to hardware: `PLATFORM`, `THROUGHPUT`, `ENVELOPE`, `FAILURE MODES` |
| **Terminal / monospace** | Hammer (code blocks as evidence), Hassan (`Hello, World!`), Parth (`hi, human 👋`) | **High when used as *data display***; falls to "student portfolio" when used as a *joke* | ★★★★☆ Monospace for metrics/logs/CLI output only; no fake shell gimmick |
| **Swiss / minimal, numbered** | Pietzko (01–06), Chauhan, Negi | **Very high** — restraint reads as confidence; ages well | ★★★★★ Best default chassis |
| **Dark minimal / dark product** | Manikanta, Hammer, Hassan | **High** — reads "systems/infra"; ubiquitous though, so it must be earned by content | ★★★★☆ |
| **Editorial / archival dossier** | Ezra (`file / 01.`, "Case files") | **High and rare** — signals research rigour | ★★★★☆ Excellent fit for "you can only learn this by operating the system" |
| **Blog-first / docs** | sobolevn, Myzhar, Naveen Gung | **High for depth**, low for visual memorability | ★★★☆☆ Good for the writing engine |
| **Plain HTML, zero design** | Karpathy | **Maximum, but only with elite artefacts**; otherwise reads as neglected | ★☆☆☆☆ Not transferable |
| **Playful/scrapbook** | Parth | Warm and memorable; can undercut senior signalling | ★★☆☆☆ |
| **Awwwards/GSAP spectacle** | (Awwwards tag, unreachable ⚠️) | Diminished credibility for infra roles; great for design roles | ★☆☆☆☆ Avoid |
| **Pure-JS SPA, no SSR** | adamalston.com, tufail.dev, alisaleem252.com, mylcin.vercel.app — **all rendered to ~one line of text** | **Credibility risk**: content may be invisible to crawlers, unfurlers, and some recruiter tooling | ✗ Avoid |

### 6.2 The most effective visual identity for you, right now

**Swiss-minimal chassis + "technical spec / ML lab" instrumentation + a monospace metrics layer, in dark or neutral.**

Rationale: for edge/production AI, credibility comes from **precision and constraint**, and the spec-sheet language *is* the precision. It also has a real mechanical benefit — `THROUGHPUT 12 × 25 fps`, `p99 310 ms`, `62 °C` presented as a labelled field reads as a measurement, and measurements are believed. The monospace layer (logs, failure traces, CLI output, `Before/After` blocks à la Hammer) supplies the "this person debugs at 3am" texture without cosplay.

**Do not** use: an animated terminal where you type "whoami"; particle/neural-network background canvases; a chatbot on your own homepage; GSAP scroll-jacking; skill percentage bars with no meaning (Manikanta's 95%/92% bars are the weakest element on an otherwise strong site).

**Do** use: a real deployment photograph; a pipeline diagram (sensor → ingest → inference → alert → dashboard); a live metrics panel with genuine numbers; one restrained accent colour; numbered sections; and a dense `Download résumé` in the top-right.

---

## 7. Ranked List of What to Add (impact × effort)

| Rank | Addition | Why it wins | Effort |
|---|---|---|---|
| **1** | **Four "Edge Deployment Cards" with a fixed schema** (hardware, model, throughput, latency, power/thermal, failure modes, ops, evidence, lesson) | Directly encodes the differentiator; nobody in the sample does the edge equivalent; completely unfakeable | M |
| **2** | **Numeric proof on every project** (fps, ms, W, °C, MB, FP-reduction %, uptime, error rate on *your* data) | Cheapest credibility available; only Hammer/Chauhan do it | S |
| **3** | **Constraint-first hero + a one-line "what I don't do"** | Instantly separates you from enthusiast/researcher; honest framing raises believability of everything else | S |
| **4** | **"Failure Log / Postmortems" (3–5 entries)** | Near-zero competition; unmistakably production; great interview bait | M |
| **5** | **Project labels by evidentiary role** (`Shipped / Client / Internal / Lab`) | Structural clarity à la Hammer/Negi/Manikanta; costs nothing | S |
| **6** | **3–5 narrow, deep technical write-ups** (local LLM on 8 GB; night-time FP postmortem; maritime horizon with IMU drift) | The Parth/Myzhar pattern; proves the thinking behind the shipping | M–L |
| **7** | **Narrated or screen-captured 20–40 s demos** for at least 2 systems | Highest-bandwidth proof; rarest asset in the sample | M |
| **8** | **Evaluation section**: test-set size, labelling method, confusion matrix / PR curve, baseline comparison | The single biggest gap across *all* AI portfolios (field-guide-confirmed) | M |
| **9** | **Ops & reproducibility**: systemd/watchdog, remote log pull, OTA model swap + rollback, CI eval gate | Proves you own the 3am; only Hammer hints at it | M |
| **10** | **Stack grouped by layer** (Sensor → Ingest → Inference → Runtime → Ops → Data) with versions | Kills the meaningless chip list; shows architectural literacy | S |
| **11** | **A short "Constraints & Trade-offs" paragraph per project** (why quantise, why on-device, what you'd trade) | Signals senior judgement; invites the right interview questions | S |
| **12** | **Booking link (Cal.com) + résumé PDF in the top-right** | Aryan Raj's highest-conversion contact pattern; removes all friction | S |
| **13** | **Real deployment photograph + pipeline diagram** | The edge analogue of Myzhar showing MyzharBot; nobody in the AI sub-sample does it | S–M |
| **14** | **Pre-render / SSR the site (no pure-JS SPA)** | Four sites in this study rendered to a single line of text to a non-JS fetcher — a self-inflicted visibility risk | S |
| **15** | **"Start here" jump link to the best proof** | Hammer's one deliberate onboarding affordance; costs one line | S |
| **16** | **Live GitHub "Receipts" panel** (commits/PRs/review graph) | Pietzko's transparency move; only worth it if your graph is strong | S |
| **17** | **Datasets & labels section**: how data was collected, labelled, versioned, and how drift is detected | Almost universally missing; very high signal for CV roles | M |
| **18** | *(Only if genuinely true)* **Publications / DOI list** | Chauhan + Aryan Raj pattern; omit rather than pad | — |
| **19** | **Narrow newsletter/RSS or LinkedIn repost cadence for the deep posts** | Turns the writing engine into a compounding asset | S |
| **20** | **An "industries deployed" strip** (CCTV/security, maritime, manufacturing/CAD) | Domain framing over technology framing — the field guide's core point | S |

**Suggested sequence:** 1 → 2 → 3 → 4 → 6 → 5 → 12 → 7 → 8 → 9 → 10/11 → 13 → 14.

---

## 8. Source Index (all real, all cited)

**Fetched and analysed (✅):**
- https://christopherhammer.dev — Christopher L. Hammer
- https://negiadventures.github.io — Anirudh Negi
- https://chauhan-mihir.vercel.app — Mihir Chauhan
- https://www.aryanraj.cv — Aryan Raj
- https://parkky.vercel.app — Parth Kale
- https://myzhar.tech/about/ — Walter Lucetti (Myzhar)
- https://www.manikantadarapureddy.in — Manikanta Darapureddy
- https://www.ezradesmonds.my.id — Ezra Desmond Sutanto
- https://www.paulpietzko.com — Paul Pietzko
- https://www.gowthamsridhar.com — Gowtham Sridhar
- https://mydhily-mr.github.io/portfolio/ — Mydhily M R
- https://naveed-gung.dev — Naveed Sohail Gung
- https://karpathy.ai and https://karpathy.github.io — Andrej Karpathy
- https://sobolevn.me — Nikita Sobolev
- https://hassannazar72.github.io/portfolio/ — Muhammad Hassan Nazar (control)
- https://www.adamalston.com · https://alisaleem252.com · https://www.tufail.dev · https://mylcin.vercel.app — SPA/near-empty renders
- https://www.sadoukas.com/fr — AKLI Massinissa Sadek (FR, sci-fi node-graph nav)
- https://github.com/emmabostian/developer-portfolios (README) — 1,981 tagged portfolios

**From search results / snippet-only (⚠️ not fetchable this session):**
- https://harshbhate.com — "I'M AN AI/ML ENGINEER SPECIALIZING IN EDGE AI" (closest direct comparator; retry later)
- https://github.com/pabloalvarez99/paxdev — "Evidence-first AI systems portfolio"
- https://github.com/davidromeroy/computer-vision-portfolio — CV/3D vision/robot perception projects
- https://github.com/marcusmayo/machine-learning-portfolio
- https://github.com/aojedao/MESGRO — robotics/mechatronics portfolio template
- https://github.com/alexeygrigorev/ai-engineering-field-guide/blob/main/portfolio/06-common-mistakes.md
- https://github.com/IbrarArif/ai-developer-portfolio · https://github.com/Drashtika-Yukti/Ankur_AI_Engineer · https://github.com/Lakan1509/lakan-portfolio · https://github.com/christopherlhammer11-ai/christopherhammer.dev
- https://neeraj1909.github.io/ — Neeraj Kumar Singh | AI Engineer (fetch failed)
- https://www.awwwards.com/websites/portfolio/ — Awwwards portfolio tag (fetch failed)
- https://www.framer.com/marketplace/templates/alpine/ · .../arita/ · .../aivor/ · .../clifolio/ — AI/portfolio template marketplace (for aesthetic reference)
- https://github.com/H-Freax/TermHub · https://github.com/kiingxo/portfolio-website — terminal-style portfolio templates
- https://github.com/shengjidaguai-china/personal-homepage-skill/blob/main/STYLE_PRESETS.md — style presets (fetch failed)

**Tooling limitations (documented for reproducibility):** `web_search` (HTTP 404 / fetch failed, intermittent), DuckDuckGo HTML & lite (fetch failed), Brave (fetch failed), Mojeek (CAPTCHA), searx.be (fetch failed), Bing (HTTP 200 but operator-blind and semantically degraded — results unusable).
