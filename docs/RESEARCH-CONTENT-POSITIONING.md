# AI/CV Engineer Portfolio & Positioning Report
### Prepared for: Ryas Rafi Karim — AI Engineer | Computer Vision, Edge AI, LLM Systems — Jakarta, Indonesia
### 1.5+ years production experience · 4 real deployments · Bangkit ML Distinction (Top 10%) · TensorFlow Developer Certified · B.Eng EE 3.78/4.00

---

## 0. METHOD & EVIDENCE BASE

`web_search` hard-failed (DeepSeek API HTTP 404) for this entire session. Research was completed via direct `web_fetch` + `curl` on primary sources and via the `r.jina.ai` reading proxy. Sources actually retrieved and read:

| # | Source | URL | What it grounds in this report |
|---|---|---|---|
| S1 | NN/g — "How Users Read on the Web" (Nielsen, 1997; replicated findings) | https://www.nngroup.com/articles/how-users-read-on-the-web/ | Scannability, inverted pyramid, objectivity, anti-marketese. Measured: concise +58%, scannable +47%, objective +27%, combined +124% usability. |
| S2 | NN/g — "How Little Do Users Read?" (Nielsen, 2008) | https://www.nngroup.com/articles/how-little-do-users-read/ | Users read ~20–28% of words on an average page; only 4.4s more per +100 words. Hard word budgets for cards/case studies. |
| S3 | `lagnis337/ds-application-portfolio-guide` — case-study template + worked LLM example | https://github.com/lagnis337/ds-application-portfolio-guide (raw: `.../main/template/case-study-template.md`, `.../main/examples/02-slack-text-to-sql-analyst.md`) | The canonical Problem→Data→Approach→Results→What-I'd-do-differently→Code structure; "every number must be defensible"; baselines-over-headline-numbers; how to state proprietary work. |
| S4 | `cassidoo/getting-a-gig` (7.7k★) — resume/skills guidance | https://github.com/cassidoo/getting-a-gig | Remove objective; one page; sell skills by **What/Why/How/When/Who**; "don't say Python ninja"; skills proven by use. |
| S5 | `ather-techie/ai-system-design-interview` + `rag-interview-system` | https://github.com/ather-techie/ai-system-design-interview · https://github.com/ather-techie/rag-interview-system | The vocabulary senior AI interviewers probe: gateways, caching, streaming, cost, evals, observability, failure modes, capacity math — i.e. the metric set that reads as "production". |
| S6 | `emmabostian/developer-portfolios` (26.6k★, 1,981 portfolios) | https://github.com/emmabostian/developer-portfolios | Portfolio-inspiration corpus; AI Engineer entries exist but are a small minority → differentiation opportunity. |
| S7 | Google Careers "How we hire" (page shell retrieved; content JS-gated) | https://www.google.com/about/careers/applications/how-we-hire/ | Confirms structured/role-related hiring signal framing; content not machine-readable — treat as directional only. |

**Source caveats:** S1/S2 are 1997/2008 but are the most-cited, repeatedly replicated web-reading findings; the mechanism (scanning, not reading) is stronger today, not weaker. S3's examples are explicitly fictional — I use it for **structure**, not for numbers. No accessibility-blocked page (LinkedIn Pulse, levels.fyi blog, web.dev/learn, freeCodeCamp) was quoted; I am flagging this rather than inventing their content.

---

## 1. RESUME/CV → PORTFOLIO TRANSLATION

### 1.1 The three artifacts are different documents with different jobs

| | **CV bullet** | **Portfolio project card** | **Case study** |
|---|---|---|---|
| **Reader** | Recruiter (30–90s skim) + ATS parser | Recruiter or engineer (5–20s scan, S2) | Engineer / hiring manager / technical founder (4–10 min read) |
| **Job to do** | Get you past the screen; prove role fit | Make them click; establish category + scale in one glance | Prove you actually built it, can defend every number, and know its limits |
| **Length** | 1–2 lines | 40–90 words + 1 image + 3–5 tags | 600–1,200 words + 4–7 visuals |
| **Content unit** | Achievement + scope + result | Problem class + scale + stack + one headline outcome | Problem → Data/Constraints → Architecture → Implementation → Results (baseline vs. model) → Learnings → Code/artifacts |
| **Verbs** | Past tense, one action per bullet | Noun phrases, no verbs needed | First person, decisions and trade-offs |
| **Credibility mechanism** | Specificity + numbers | Scope ("3,000+ cameras") + artifact visible | Mechanism: what you tried, what failed, how you measured |
| **Failure mode** | Vague or unquantified | Repetitive CV copy-paste; no visual | Marketing deck with no methods |

**The translation rule (one line):** *A CV bullet asserts an outcome. A card makes that outcome scannable. A case study proves the outcome was real and explains what it cost.*

**Structural mapping — same fact, three densities (worked on Ryas's real work):**

- **CV bullet:** "Maintained/optimized License Plate Recognition for Jakarta SmartEye across 3,000+ CCTV cameras in Jakarta."
- **Card:** "**Jakarta SmartEye LPR — 3,000+ city CCTV cameras.** Kept a nation-scale license-plate recognition fleet accurate and online: ONNX/TensorRT inference on edge nodes, three managed Linux production areas (inference, deployment, monitoring). *Python · YOLO · ONNX Runtime · TensorRT · Ubuntu Server*"
- **Case study:** *Problem* — 3,000+ cameras feeding city-scale LPR; a single fixed confidence threshold was producing unusable false-alarm volume at night and in rain. *Constraints* — no GPU at most sites; bandwidth caps rule out shipping raw frames; per-camera retraining is operationally impossible. *Approach* — per-camera threshold recalibration from a rolling sample of detections; ONNX→TensorRT export to hit the edge latency budget; split work across three production areas so a model rollout never takes down inference. *Results* — [state only what you can defend; see §2.4]. *Learnings* — at fleet scale, the pipeline's monitoring and rollback path mattered more than the model's mAP.

### 1.2 Before/After transformations on Ryas's real CV content

**Note on discipline:** every "after" below uses **only facts present in the supplied CV**. Where the CV currently makes a claim that cannot be defended or that overreaches, I mark it **[RISK]** and give a scoped replacement rather than inventing a better number.

---

#### T1 — LPR / Jakarta SmartEye

**BEFORE (CV):** "Maintained/optimized License Plate Recognition for Jakarta SmartEye across 3,000+ CCTV cameras in Jakarta."

**AFTER — Card:**
> **Jakarta SmartEye — License Plate Recognition at city scale**
> Sustained and tuned an LPR system serving **3,000+ CCTV cameras** across Jakarta. Ran three separate Linux production environments — inference services, model deployment, and monitoring — so model updates never interrupted live recognition. Edge-optimized via ONNX Runtime and TensorRT.
> `Python` `YOLO` `OpenCV` `ONNX Runtime` `TensorRT` `Ubuntu Server` `Linux systemd`

**AFTER — Case study headline (H1):**
> *Keeping 3,000+ city cameras reading plates: operating an LPR fleet where uptime mattered more than mAP*

**[RISK] flag:** "Maintained/optimized" is invisible work to a reader. It is real and valuable, but it reads as junior. Do not inflate it to "architected" or "led development of" — you did not. Instead **name the specific engineering**. If you performed threshold recalibration, TensorRT export, camera onboarding, false-positive triage, or monitoring/alert setup, say which. "Owned production reliability for an LPR fleet of 3,000+ cameras, including per-camera tuning and rollout controls across three managed Linux environments" is both stronger and honest.

---

#### T2 — Tugboat / maritime fleet (26 vessels)

**BEFORE (CV):** "Integrated Teltonika API, operational dashboards, RESTful APIs, Telegram alerts for fleet monitoring across 26 assets."

This is a **list of nouns**. It tells a reader what you touched, not what the system does or why it matters.

**AFTER — Card:**
> **Maritime Fleet Vision — 26 tugboats, one operations view**
> Built the monitoring layer for a 26-vessel tugboat fleet: Teltonika GPS telemetry in, a live operations dashboard and Telegram alerting out, behind a REST API. Alerts fire on the events that actually matter to schedulers — vessel leaving its operating area, position staleness, route deviation — instead of raw GPS noise.
> `Python` `FastAPI` `Teltonika Telematics API` `Telegram Bot API` `PostgreSQL` `Ubuntu Server`

**AFTER — Case study headline:**
> *From raw GPS pings to a decision: designing tugboat fleet alerting that operators actually read*

**Why this rewrite works:** it converts an integration inventory into a *design decision* (alert on meaningful events, not raw telemetry). That single sentence is the difference between "implemented an API" and "understands why alerting systems get muted."

**[RISK] flag:** the CV says you "Led cross-functional teams defining requirements, system specs, deployment strategy for 26 tugboats." Two issues: (a) the object of "led" is the *team*, which for a 1.5-YOE engineer will be challenged in interview; (b) "for 26 tugboats" is scope, not team size. Safer and still strong: **"Led requirements definition and deployment strategy for the 26-vessel fleet platform, coordinating the engineering team and vessel-side stakeholders."** That claims the work, not a headcount you may have to defend.

---

#### T3 — Mining SaaS (7 AI analytics modules)

**BEFORE (CV):** "Designed Mining SaaS architecture: 7 AI analytics modules (Face Recognition, PPE Detection, Danger Zone, Hull Number, Plate Recognition, Fire & Smoke, Vehicle Classification)."

Good raw material — a **countable architecture** is strong evidence. But a bare list of 7 module names invites "did you actually build them or wire up off-the-shelf models?"

**AFTER — Card:**
> **Mining Site Safety & Analytics SaaS — 7 vision modules, one pipeline**
> Architected a multi-tenant mining analytics platform built around **seven CV modules** — PPE compliance, danger-zone intrusion, face recognition, hull-number and plate recognition, fire & smoke, and vehicle classification. All modules share one inference/serving stack (ONNX → TensorRT) and deploy to the same targets: Ubuntu Server, Jetson Orin Nano, and GPU cloud.
> `ONNX Runtime` `TensorRT` `Ultralytics` `HLS streaming` `Jetson Orin Nano` `Docker` `Ubuntu Server`

**AFTER — Case study hook (a genuinely strong interview story):**
> *Seven models, one platform: the shared inference substrate that made a mining SaaS affordable to run*

**Critical advice:** the *most* differentiating fact here is that you built **one shared substrate for seven models** instead of seven bespoke pipelines. That is a systems-design decision. Lead with it in the case study. "I built 7 modules" is a ticket count; "I built the shared runtime that made 7 modules ship without 7x the ops cost" is engineering judgment.

---

#### T4 — 24/7 production pipeline optimization

**BEFORE (CV):** "Optimized 24/7 video analytics pipelines with ONNX, TensorRT, HLS streaming, model serving, monitoring, deployments across Ubuntu Server, Jetson Orin Nano, GPU/cloud."

This is a **tool list masquerading as a bullet.** No reader learns what improved.

**AFTER (needs one real measurement to become excellent):**
> "Took 24/7 multi-camera video analytics from prototype-grade to production-grade: ONNX→TensorRT model export, HLS streaming, model serving and health monitoring, deployed across Ubuntu Server, Jetson Orin Nano, and GPU cloud."

**Then attach the number you already have or can recover** — streams per Jetson Orin Nano, p50/p95 per-frame latency, sustained FPS, GPU memory headroom, or peak concurrent streams. See §2.2 for the exact metric ladder to pick from. **If you recover a latency or throughput figure from this work, it is the single highest-value number in your entire portfolio** — it is the one metric that unambiguously separates "I trained a model" from "I ran a model in production."

**[RISK] flag:** "24/7" is a claim about *operational continuity*. Only keep it if the pipelines genuinely ran continuously in production. If they ran during working hours or pilot windows, say "production video analytics pipelines" instead.

---

#### T5 — Annotation web app

**BEFORE (CV):** "Built Ultralytics-based annotation web app on Ubuntu Server (annotation -> training end-to-end)."

Buried. This is a **genuinely differentiating piece of evidence** that most 1.5-YOE CV engineers cannot claim: you built the data flywheel, not just a model.

**AFTER — Card:**
> **In-house annotation → training loop**
> Built a self-hosted annotation web application (Ultralytics-based) so the team could label, version, and retrain without exporting to third-party tooling. Closes the loop from new labeled data to a retrained model on the same Ubuntu Server.
> `Python` `Ultralytics` `Flask/FastAPI` `Ubuntu Server` `Docker`

**Promote this in your ordering.** "I built the data pipeline that feeds my own models" is a *senior* signal. It should not be the fifth bullet under a job.

---

#### T6 — LLM/agentic workbench (Turboquant / Tuboquant)

**BEFORE (CV):** "Implemented LLM/agentic workflows: Ollama, llama.cpp, LangChain, LangGraph, Qdrant, RESTful APIs, self-hosted OpenAI-compatible provider, prompt-to-N8N automation."

**AFTER — Card:**
> **Turboquant — a local-first LLM agent workbench**
> Self-hosted LLM agent workbench: local inference (`Ollama`, `llama.cpp`), retrieval over a vector store (`Qdrant`), multi-step agent orchestration (`LangGraph`), and an OpenAI-compatible API shim so existing clients can point at the local stack unchanged. Includes prompt-to-automation handoff into `N8N`.
> `Ollama` `llama.cpp` `LangGraph` `LangChain` `Qdrant` `FastAPI` `Docker`

**AFTER — Case study angle (the strongest one you have for GenAI roles):**
> *Same API surface, zero cloud dependency: making a local LLM stack a drop-in for OpenAI clients*

**Naming flag:** the CV says both "Turboquant" and "Tuboquant". Pick one spelling and use it consistently across CV, portfolio, and GitHub. Inconsistent naming on a personal project reads as careless. (Note: **Turboquant may collide with a known quantization research term — consider a distinct project name** to avoid looking derivative.)

---

#### T7 — Bangkit "Waste Wizard" (single accuracy number)

**BEFORE (CV):** "Built 'Waste Wizard' CNN waste classification, 95% accuracy, deployed via Google Cloud."

**[RISK] flag — this is the most overclaim-prone line in your CV.** "95% accuracy" on an unspecified dataset is a classic interview trap: the next question is always *"95% on how many classes, and what was the baseline?"* If the answer is "6 classes on a clean, centered dataset," it will read as a coursework project — which is fine, but it must be presented as one.

**AFTER (safe, still impressive):**
> **Waste Wizard — waste classification CNN**
> Six-class waste image classifier trained with TensorFlow/Keras, reaching **95% accuracy on the program's held-out test set**, and deployed as a public endpoint on Google Cloud. Capstone project, Bangkit Academy (Google/GoTo/Tokopedia/Traveloka), graduated with Distinction — Top 10% of cohort.
> `TensorFlow` `Keras` `Google Cloud` `CNN`

Adding "on the program's held-out test set" costs four words and removes the entire overclaim risk. Adding "six-class" preempts the first challenge. This is what "scoping" means in practice.

---

#### T8 — Profile headline & summary

**BEFORE (CV):** "AI Engineer | Computer Vision, Edge AI, LLM & Production AI Systems"

This is a **keyword string**, not positioning. It lists four domains, which signals "spread thin."

**AFTER — headline (pick ONE primary identity):**
> **AI Engineer — Computer Vision & Edge AI in production**
> *I ship vision systems that run on real hardware: 3,000+ city cameras, 26 vessels, and a 7-module mining platform.*

**AFTER — "About" (≈85 words; deliberately under the 111-word half-read threshold from S2):**

> I build computer vision that runs in production, not in a notebook.
>
> Over the last year and a half I've kept a license-plate recognition fleet alive across 3,000+ Jakarta CCTV cameras, wired a 26-tugboat fleet into a live monitoring platform, and architected a mining-safety SaaS around seven vision modules sharing one inference stack. Most of that work happened on the unglamorous side of ML — ONNX/TensorRT export, edge deployment on Jetson Orin Nano, and monitoring that tells you a camera died.
>
> I care about systems that stay up. Currently in Jakarta. TensorFlow Developer Certified; Bangkit ML Distinction graduate.

**Why this voice works:** it leads with the *constraint* (production, not notebooks), names four real systems with real numbers, and ends on a specific value ("systems that stay up") instead of a generic passion claim. Nothing here is unverifiable. Nothing here is a cliché.

---

## 2. METRICS & EVIDENCE

### 2.1 A hierarchy of trust — what weights most for AI/CV roles

Interviewers weight metrics by **how hard they are to fake and how close to the production boundary they sit**. Ranked:

| Tier | Metric family | Examples relevant to Ryas | Why it carries weight |
|---|---|---|---|
| **1 — Highest** | **Operational reliability at scale** | Uptime %, MTTR, false-alarm rate per camera per day, cameras/vessels in continuous operation, stale-data incidents | Cannot be produced by a tutorial. Proves ownership of a live system. |
| **2 — Very high** | **Latency & throughput on real hardware** | p50/p95 end-to-end ms/frame, FPS per stream, concurrent streams per Jetson Orin Nano, GPU/VRAM utilization, bandwidth saved via HLS | Directly matches how senior AI interviewers probe (S5: capacity math, streaming, serving). Requires you to have profiled a real deployment. |
| **2 — Very high** | **Cost & resource economics** | $/camera/month, GPU count avoided by quantization/edge placement, cloud spend reduction, latency-vs-cost trade-off chosen | Signals you optimize under constraint, which is the whole job. |
| **3 — High** | **Task quality vs. a stated baseline** | mAP@0.5 (plain, honest), precision/recall at the operating threshold, false-positive rate at chosen confidence | Only credible *with a baseline and a threshold*. A bare "98% mAP" without baseline is discounted or distrusted. |
| **4 — Medium** | **Model/method metrics** | mAP@0.5:0.95, F1, accuracy, IoU on segmentation | Necessary but least differentiating — everyone has a number. Use as support, never as the headline. |
| **5 — Low alone** | **Process/vanity counts** | "7 modules", "3,000+ cameras", "26 assets", dataset size | Individually weak, but **excellent as scale qualifiers** attached to a Tier 1–3 metric. "7 modules" means little; "7 modules on one shared runtime that held p95 under X ms" is strong. |

**The practical rule:** for each project, try to report **one metric from Tier 1 or 2** and **one from Tier 3** with a named baseline. Two well-scoped metrics beat eight unqualified ones.

### 2.2 The metric recovery exercise (do this before writing anything)

You likely already possess numbers you haven't written down. Recover them from logs/dashboards/tickets:

- **Ops logs:** uptime windows, restart counts, incident tickets, alert volume, mean time to acknowledge.
- **Monitoring dashboards:** p50/p95/p99 latency, FPS, dropped frames, GPU memory, queue depth.
- **Cloud/Jetson billing or capacity:** instances, GPU hours, $/month, cost before/after TensorRT or quantization.
- **Annotation/training logs:** images labeled, sessions-to-retrain, training time per iteration, dataset growth.
- **Business-side conversations:** hours of manual review removed, alerts actioned, cameras onboarded, false positives suppressed.

### 2.3 The `[Action] → [Metric] → [Baseline] → [Method]` bullet pattern

The CV currently uses `[Action] → [Tool list]`. Convert every bullet to the pattern below:

> **[Verb] [what] so that [metric] improved from [baseline] to [result], measured by [method].**

Concrete conversions:

| Current | Rewritten |
|---|---|
| "Optimized video analytics pipelines with ONNX, TensorRT…" | "Cut per-frame inference latency from **[X] ms to [Y] ms** on Jetson Orin Nano by exporting YOLO models to ONNX/TensorRT (INT8), measured over a 24-hour sample of production streams." |
| "Maintained/optimized LPR across 3,000+ cameras" | "Held LPR availability at **[X]%** across 3,000+ cameras over [period] while reducing night-time false positives by **[Y]%** through per-camera threshold recalibration." |
| "Implemented… Telegram alerts" | "Replaced raw GPS polling with [N] event-based alerts per vessel-day, reducing operator alert volume from **[A]/day to [B]/day** with no missed [event type]." |

**If you cannot fill a bracket, do not write the bullet with a fake number.** Write a qualitative but specific version instead (see §2.4). A reviewer who catches one invented number distrusts the whole portfolio — S3's rule is blunt: *"Every number must be defensible. If an interviewer asks 'how did you measure that,' you need an answer. Leave out what you can't defend."*

### 2.4 Handling confidential / internal / NDA numbers — the credibility-preserving playbook

Clients like PT Bali Towerindo Sentra and Gerbang Data Indonesia have legitimate confidentiality interests. You can be maximally impressive **and** fully compliant using these six techniques, in ascending order of disclosure:

1. **Describe the system, not the client data.** Architecture, module counts, camera/vessel counts, and stack are almost always disclosable. Raw accuracy on client footage usually is not.
2. **Use ranges and orders of magnitude.** "Inference held under **100 ms/frame**" or "**low-single-digit seconds** end-to-end" is defensible and does not expose an exact SLA.
3. **Use ratios instead of absolutes.** "**≈3× throughput** per device after TensorRT export" reveals engineering value and no client secret.
4. **State the measurement scope honestly.** *"Internal validation on a held-out set of [N] labeled samples, not a client-verified production audit."* This sentence converts a soft number into a credibility asset — it proves you know the difference.
5. **Publish the method, not the artifact** (the exact maneuver S3 endorses): *"Code and client data are proprietary. This is a methods write-up: the pipeline, the constraints, and how results were measured. Figures shown are internal validation numbers, shared with permission."*
6. **Offer to walk a reviewer through it live.** A one-line note — *"Happy to walk through the deployment and metrics in a call under NDA."* — turns confidentiality from a gap into a demonstration of professionalism.

**Template block to paste on any employer-project case study:**

> **Note on data.** This system runs on client infrastructure under confidentiality terms. Code and client data are not public. Everything below describes the architecture, engineering decisions, and evaluation *method*, with figures limited to internal validation numbers approved for sharing. Happy to go deeper under NDA.

**Phrase bank for scoped metrics (use verbatim):**
- "measured by [instrument] on a [N]-hour/[N]-frame sample of production traffic"
- "internal validation, not independently audited"
- "on the program's held-out test set"
- "vs. a [rule-based / single-threshold / prior-model] baseline"
- "≈ — approximate, rounded to avoid disclosing client figures"

**One warning:** do **not** write "confidential, can't share" and then stop. A case study that withholds everything teaches the reader nothing. Withhold the *data*, publish the *thinking*.

### 2.5 Metrics-to-avoid (they actively cost credibility)

- **Bare "98% accuracy" with no dataset, baseline, or threshold.** (Your "98% mAP@0.5:0.95 internal validation" is close to this — see §2.6.)
- **"Improved efficiency by 98%"** — a 98% efficiency gain is not plausible without a definition; this reads as a typo or an invented figure.
- **Percentages with no denominator** ("+40% better").
- **Metrics about the *process* presented as outcomes** ("trained 20 models", "wrote 5,000 lines").
- **Numbers that are suspiciously round and unattributed** ("reduced cost by 50%", "99.9% uptime") with no period or measurement source.

### 2.6 Two specific CV claims that need immediate scoping

**(a) "improved operational efficiency and data accuracy by 98%"** (Bali Towerindo bullet)

This is the **single highest-risk sentence in your CV.** "Efficiency" and "data accuracy" are both undefined, and 98% is a number a hiring manager will read as either meaningless or inflated. **Replace it with one of:**

> "Reduced manual review effort on the MBG analytics pipeline by **[N] hours/week** (average of [period] records)."

> "Raised detection precision for crowd/waste analytics to **[X]%** at the deployed confidence threshold, measured on a [N]-frame held-out sample (baseline: [Y]%)."

> *(If no measurement exists)* "Built waste-segmentation (polygon coverage ratio), people-counting, and crowd-detection analytics for MBG maintenance workflows, replacing manual visual inspection with an automated pipeline."

The third option is the honest fallback and it is still a good bullet. **Deleting an indefensible number is a net gain.**

**(b) "Tugboat Analytics Platform 2026 — 98% mAP@0.5:0.95 internal validation"** (Achievements)

Two problems. First, `mAP@0.5:0.95` at 98% is **extremely high** for real-world detection on maritime imagery — most published COCO-style detectors on hard domains sit far below that at 0.5:0.95. Reviewers who train detectors will immediately question it. Second, `98%` at both `mAP@0.5:0.95` and in the efficiency claim looks like the same number reused, which is the classic pattern of a made-up figure.

**Replace with one of:**
> "Tugboat analytics platform — object detection validated at **mAP@0.5 = [X]**, **mAP@0.5:0.95 = [Y]** on an internal held-out set of [N] labeled frames (baseline: [model/rule])."

> "Tugboat analytics platform — detection validated on an internal held-out set; primary metric **[mAP@0.5 = X]** chosen because downstream alerting depends on recall at a fixed precision, not on tight box localization."

The second version is **better than a high number** because it explains *why you chose that metric*. That is a senior-AI-engineer move (S5: every answer leads with the decision and the trade-off).

---

## 3. TECHNICAL STACK PRESENTATION

### 3.1 Never a flat list. Never percentage bars. Use three tiers.

Your current CV skills block is a **flat 45-item list in five bureaucratic categories**. It is honest but it produces two failures: (a) it gives every item equal weight, so `NumPy` reads as equal to `TensorRT`; (b) it triggers keyword-stuffing perception, exactly the risk S4 warns about ("if you've only ever done 'Hello, world!' in Python, don't say you're a Python ninja").

**Recommended structure — 3 tiers:**

> **Core (daily, production, can defend under questioning)**
> Python · YOLO/Ultralytics · OpenCV · ONNX Runtime · TensorRT · Linux/Ubuntu Server · Docker · PyTorch · TensorFlow/Keras
>
> **Working (shipped something real, not an expert)**
> FastAPI · HLS streaming · NVIDIA Jetson Orin Nano · Intel Arc · systemd · Git/GitHub Actions · GCP · PostgreSQL · pandas/NumPy
>
> **Exposure (built with it, small surface area)**
> Ollama · llama.cpp · LangChain · LangGraph · Qdrant · HuggingFace · Teltonika Telematics API · N8N

**Why three tiers dominates a flat list:** it communicates *depth* (Tier 1) and *breadth* (Tiers 2–3) simultaneously, and it pre-empts the "you claim to know everything" objection by self-limiting. An interviewer reads Tier 3 as signaling *learning velocity* rather than mastery — which is precisely the right message at 1.5 years.

### 3.2 Tie every Tier-1 skill to a project — the anti-stuffing mechanism

The single strongest defense against keyword-stuffing perception is **evidence adjacency**: a skill appears next to the thing you built with it.

> `TensorRT` — LPR fleet (3,000+ cameras) and 7-module mining SaaS; used for ONNX→engine export and INT8 calibration
> `LangGraph` — Turboquant agent workbench; multi-step tool-calling orchestration

**Rule:** if you cannot name the project, it does not go in Tier 1. This one constraint eliminates almost all stuffing.

### 3.3 Depth vs. breadth at 1.5 years — what to signal

**Signal depth in 2 domains, breadth as a supporting fact.** Your two depth domains are unambiguous:

1. **Edge CV deployment** — ONNX/TensorRT, Jetson Orin Nano, 24/7 pipelines, multi-camera scale.
2. **Vision systems architecture** — shared multi-module runtime, annotation→training loop, production areas.

Your breadth (LLM/agentic, IoT/telematics, cloud, mining SaaS) should be **one line**, not a section: *"Adjacent experience: self-hosted LLM/agent stacks (Ollama, LangGraph, Qdrant) and IoT telemetry integration (Teltonika)."*

**Why:** at 1.5 years, breadth reads as *unfocused*; depth reads as *hireable*. Senior engineers can afford flat breadth because their depth is established. You establish depth first.

### 3.4 Things to remove or rename

| Remove / rename | Reason |
|---|---|
| `Python` listed twice (under AI/ML *and* under Programming & Data) | Duplicate entries look like list-padding. Appears once. |
| `Model Serving`, `Model Monitoring`, `Edge AI`, `Internet of Things`, `RAG`, `Semantic Search`, `Prompt Engineering` | These are **concepts, not tools**. They belong in a summary sentence, not a tools list. "Model Serving" needs a named tool (FastAPI, Triton, TorchServe) to mean anything. |
| `Re-ranking` without the library/model used | Same problem — a technique with no implementation attached. |
| `C` | Only if you would pass a C technical screen. Otherwise it is a liability in the interview it invites. |
| `Crowd detection`, `Danger Zone`, `Fire & Smoke` | These are product modules, not skills. They belong in project cards. |
| **Any skill-percentage bars / star ratings / proficiency levels** | See §7. |

**Compressed replacement block (≈1/3 the length, far more signal):**

> **Core:** Python · YOLO/Ultralytics · OpenCV · PyTorch · TensorFlow/Keras · ONNX Runtime · TensorRT · Linux/Ubuntu Server · Docker · Git
> **Deployment & MLOps:** FastAPI · HLS streaming · NVIDIA Jetson Orin Nano · Intel Arc · systemd · GitHub Actions/CI-CD · GCP · model health monitoring
> **LLM & Retrieval (self-hosted):** Ollama · llama.cpp · LangChain · LangGraph · Qdrant · HuggingFace · OpenAI-compatible serving
> **Data & IoT:** pandas · NumPy · PostgreSQL · Teltonika Telematics API · REST API integration
>
> *Adjacent: multi-tenant SaaS architecture, N8N automation, Dahua/DHSP video surveillance systems.*

---

## 4. CASE-STUDY STRUCTURE (gold standard + visuals)

The strongest structure available is the one in S3, which is purpose-built and battle-tested for technical readers. It beats the generic Problem→Architecture→Results skeleton because it forces **baselines, measurement scope, and honest limitations** — the three things that convert "project" into "evidence."

### 4.1 The canonical eight-section structure

| # | Section | Length | Must contain | Visual assets |
|---|---|---|---|---|
| 0 | **Title + meta line** | 1 line each | Title states *what it does*, not the internal product name. Meta: org · period · **your exact role**. | One hero image: system in situ (a camera node, the dashboard, the vessel map). Not a logo wall. |
| 1 | **Problem** | 2–4 sentences | What was happening, what it cost, and the **decision the system drives**. Give BOTH framings: business ("detect PPE violations before an inspector arrives") → ML ("multi-class object detection + tracking at frame t"). | Optional: one photo of the real operational context. |
| 2 | **Data / Constraints** | 1 short block + table | Unit of prediction (one frame? one camera-hour? one vessel-day?); label definition; scale (frames, classes, cameras, positive rate); known issues (night, rain, occlusion, class imbalance, label noise). | Table: `class | examples | known failure modes`. Sample frames (blurred/consented) showing the hard cases. |
| 3 | **Architecture** | Diagram + 5–10 bullets | End-to-end flow: source → preprocess → inference → postprocess → decision → alert/UI → feedback. Name the **choices and why** (why ONNX+TensorRT over PyTorch eager; why edge vs. cloud per site; why HLS over raw streams). | **The single most important visual.** A clean boxes-and-arrows diagram. Include a **latency/cost annotation on each hop**. Also: a deployment topology map (edge nodes, server, cloud). |
| 4 | **Implementation** | 6–12 bullets or short prose | What *you* built vs. what was integrated. The hard parts. What failed and what you changed. Retraining cadence, versioning, rollback. | Repo file tree; a code-shaped excerpt (no code in this report — but show *structure*, not implementation); a screenshot of the annotation tool or monitoring dashboard. |
| 5 | **Results** | Table + 2–4 sentences | **Baseline column vs. model column vs. how-measured column.** Offline metric (mAP/precision at threshold) + online/business metric (alerts actioned, manual hours saved, uptime). State confounds. | Comparison table; a PR/confidence curve or confusion matrix; a latency histogram; a **before/after** frame pair; a Grafana-style monitoring screenshot. |
| 6 | **What I'd do differently** | 3–6 sentences | Honest limitations + the next method you'd reach for. This is the section that most separates you from tutorial-builders (S3: "signals maturity and previews what you want to study"). | None needed. Optionally a small "next iteration" architecture sketch. |
| 7 | **Code & artifacts** | 1–3 lines | Repo link, or the proprietary-note block from §2.4. Named stack. Links to related posts/talks. | Repo link card; a short demo GIF/screen recording (strongest single artifact for CV/edge work). |

### 4.2 Visual-asset checklist per section (what actually belongs)

- **System in situ** — a camera on a pole, a Jetson in an enclosure, a tugboat bridge. Proves "real world," which no diagram can.
- **Architecture diagram** — boxes/arrows, annotated with latency and hardware. Highest-information-density image in the whole piece.
- **Data samples with hard cases** — night plates, rain, gloved hands, occlusion. Proves you know the domain's failure modes.
- **Monitoring / dashboard screenshot** — Grafana, an ops console, an alert thread. This is the artifact that says "production."
- **Before/after or side-by-side** — raw frame vs. annotated output; pre-TensorRT vs. post; false positive vs. corrected.
- **Latency/throughput chart or table** — even three rows (target / measured / margin) is enough.
- **Demo GIF** — 5–15 seconds, for anything interactive (annotation tool, agent workbench, dashboard).
- **Repo tree** — shows engineering hygiene without exposing proprietary code.
- **Confusion matrix / PR curve** — proves the metric was measured, not remembered.
- **Team/role caption on every project** — "Sole engineer", "Led 2, contributed on 5", "ML contributors ×3, platform team ×2". Ambiguity about your contribution is the fastest way to lose trust.

### 4.3 Word and length discipline (grounded in S2)

Users read ~20–28% of a page and gain only 4.4s per +100 words (S2). Therefore:

- **Card:** 40–90 words. Front-load the scale number in the first 8 words.
- **Case study:** 600–1,200 words, with every section scannable (sub-headings, bullets, tables) per S1.
- **Above the fold on the homepage:** ≤110 words, because "users read half the information only on pages with 111 words or less" (S2). Your hero + headline + 3 project cards should be the entire first screen.
- **No paragraph over 3 sentences.** S1: "one idea per paragraph."

### 4.4 Named case studies to build — ranked by expected impact

1. **Jakarta SmartEye LPR at 3,000+ cameras** (biggest scale number; most immediately legible to any CV hiring manager).
2. **Turboquant local LLM agent workbench** (strongest for GenAI/LLM roles; fully shareable code — no NDA constraints, so it can be the deepest write-up).
3. **Mining SaaS: 7 modules on one shared inference substrate** (best systems-design story).
4. **Tugboat fleet vision + alerting** (best "turned telemetry into decisions" story; strong IoT/edge crossover).
5. **Annotation → training loop** (best evidence of data-engineering maturity).
6. **CAD BoQ extraction** (differentiator; pairs well with the EE degree).
7. **Waste Wizard** (only as a clearly-labeled capstone; do not place it above production work).

---

## 5. CREDIBILITY & HIRING SIGNALS

### 5.1 The "ships real systems" vs. "did tutorials" decision table

| Signal a hiring manager reads | "Ships production systems" | "Did tutorials" |
|---|---|---|
| Scaling unit | Cameras/vessels/tenants + time in service | Datasets + epochs |
| Failure discussion | Names production failures: camera drop, false-positive storm, drift, device thermal throttling | "The model was accurate" |
| Latency/throughput | Real numbers on real hardware, with the measurement method | Absent or only training time |
| Deployment | Edge nodes, systemd, monitoring, rollback, three prod areas | `app.py` on a notebook/Colab |
| Constraints | States bandwidth, VRAM, cost, weather, no-GPU sites | States none |
| Metrics | Baseline vs. model vs. how measured | One headline number |
| Ownership | Clear: "sole engineer for X; team of 2 for Y" | Vague: "worked on a project" |
| Artifacts | Monitoring dashboards, architecture diagrams, demo GIFs, repo trees | A README with the dataset link |
| Data work | Built annotation tooling, retraining cadence, versioning | Downloaded a Kaggle set |
| After-action | "What I'd do differently" section exists | Absent |

**You already possess columns 1's inputs across the board.** What is missing is *presentation*: latency numbers, failure narratives, and the after-action sections. That is the whole gap.

### 5.2 Certifications — how much they matter, and how to display them

**Honest assessment by tier for AI/CV roles:**

| Credential | Real weight for a 1.5-YOE CV engineer | How to display |
|---|---|---|
| **TensorFlow Developer Certificate (Google)** | **Moderate.** Recognized, verifiable, covers training/deployment/serving — relevant to your stack. It will not get you an interview alone, and no senior hiring manager treats it as proof of production capability. Its *best* use is defeating the "self-taught, unverified" doubt for non-CS-degree screening. | Under **Certifications**, with issue year and a verification link. One line. |
| **Machine Learning Specialization (Stanford/DeepLearning.AI)** | **Low-to-moderate.** Enormously common; signal is weak because millions hold it. | One line, grouped. |
| **TensorFlow: Data and Deployment (DeepLearning.AI)** | **Low-to-moderate, but the most on-message of the three** for your edge-deployment positioning. | One line, grouped. |
| **DHSP Video Surveillance System (Dahua)** | **Higher than it looks** for *this* niche: it is vendor-specific surveillance-domain credentialing, which is directly aligned to LPR/CCTV work. Wasted on generic AI roles; valuable to a smart-surveillance employer. | One line, and mention in the LPR case study, not just the cert list. |
| **Bangkit Academy ML Distinction (Top 10%)** | **High for the Indonesian market**, moderate internationally. Google/GoTo/Tokopedia/Traveloka backing is meaningful locally. | List under **Experience** (as you do) *and* reference once in the About. Maintain the credential link. |
| **B.Eng Electrical Engineering, GPA 3.78/4.00** | **High and underused.** EE + CV/edge is a genuinely rare combination: you understand sensors, power, signals, and hardware constraints. This is your strongest differentiator after production scale. | Keep GPA (S4: include it while early-career). **And actively exploit the EE angle in your positioning.** |

**Display rules:**
1. **Certifications never lead.** One short section, below Experience.
2. **One line each**, formatted: *Name — Issuer, Year · [verify link]*.
3. **Never imply certification = production skill.** Do not write "Certified TensorFlow Developer" in your headline; it reads junior.
4. **Never list a cert you can't discuss technically.** Every listed credential is an interview invitation.
5. **Do not buy/stack more certs.** At 1.5 years with four real deployments, your marginal return from another certificate is near zero. Your marginal return from a measured latency number and one deep case study is very high. **This is the single most important strategic call in this report.**

### 5.3 The under-leveraged signal: your EE degree

Nothing in your current positioning connects **Electrical Engineering (3.78 GPA)** to **edge AI**. That link is your rarest asset. Almost every competing CV engineer is CS-trained; very few can reason about thermal envelopes, power budgets, camera hardware, and signal quality *and* train and deploy detectors.

**Fix — add one line to the About and one section to a case study:**
> "Electrical engineering background: I reason about the whole edge node — thermal envelope, power budget, sensor quality — not just the model."

### 5.4 Portfolio-level credibility mechanics

- **Verifiable links everywhere:** GitHub, credential URLs, live demos. S1: outbound links *increase* credibility.
- **Show one thing that runs publicly.** Turboquant is your best candidate (self-hosted, no client data). A public, reproducible artifact anchors the rest.
- **Include a short "how I work" or "engineering principles" note** (3–5 bullets). Cheap, and it reads as senior.
- **Write one technical post** on a real problem you solved (TensorRT export, multi-camera HLS, per-camera threshold calibration). A single well-written post outperforms a whole tutorials-style blog.
- **Never leave a dead demo link.** A broken demo is worse than no demo.

---

## 6. NARRATIVE & POSITIONING (1.5+ years, without overclaiming)

### 6.1 The positioning formula for your exact profile

Your honest, defensible, highly marketable narrative:

> **"I'm an edge-first CV engineer who has already operated vision systems at city scale — not a model trainer looking for a first production role."**

Three claims, each fully backed by your CV:
1. **Production operating experience at scale** (3,000+ cameras; 26 vessels; 24/7 pipelines).
2. **Full-stack deployment capability** (ONNX/TensorRT, Jetson, Linux, monitoring) — not just training.
3. **Systems breadth beyond CV** (LLM/agent stacks, SaaS architecture, IoT) — evidence of learning velocity.

**What you must NOT claim at 1.5 years:** research novelty, SOTA benchmarks, team leadership at scale, or "architected" anything you didn't personally design. Overclaiming is the #1 credibility killer in this market because it is trivially exposed in a technical interview.

### 6.2 The experience-count framing problem — and the exact fix

"1.5 years" is a real constraint. Do not hide it and do not apologize for it. Reframe **scope** instead of **tenure**:

> **Weak:** "1.5+ years of experience in AI and computer vision."
> **Strong:** "Two years of hands-on AI engineering, most of it on live production systems — a 3,000-camera LPR fleet, a 26-vessel fleet platform, and a multi-tenant mining analytics SaaS."

"Two years" is defensible if you count Bangkit (Aug 2023–Jan 2024) plus Bali Towerindo (Jan 2025–Aug 2025) plus Gerbang Data (Aug 2025–present) — but note the Bangkit period was a cohort program, so **state it as "including a 6-month intensive ML program."** Precision here is what makes the claim survive scrutiny.

### 6.3 "About" templates at three lengths

**A. One-liner (LinkedIn headline — 12 words):**
> AI Engineer — edge computer vision in production. 3,000+ city cameras · Jetson · ONNX/TensorRT.

**B. Short bio (60 words):**
> I build computer vision that runs on real hardware. I've operated LPR across 3,000+ Jakarta CCTV cameras, wired a 26-tugboat fleet into a live monitoring platform, and architected a mining-safety SaaS around seven vision modules on one shared inference stack. Electrical engineering background, so I think about the whole edge node — thermal, power, and sensor constraints included.

**C. Full About (110 words, for the portfolio homepage):**
> I build computer vision that runs in production, not in a notebook.
>
> I'm an AI engineer in Jakarta working on edge AI and vision systems. I've kept license-plate recognition alive across 3,000+ city CCTV cameras, turned raw Teltonika telemetry from 26 tugboats into alerts operators actually act on, and architected a mining-safety SaaS where seven vision modules share a single inference stack.
>
> Most of the work is the unglamorous part: ONNX/TensorRT export, deploying to Jetson Orin Nano, and building monitoring that tells you a camera died before a client does. My electrical engineering background means I think about the whole edge node — thermal envelope, power budget, sensor quality.
>
> I care about systems that stay up.

Note the deliberate structure: **claim → three proofs with numbers → the unglamorous truth → the differentiator (EE) → one memorable line.** No adjective is unearned. Nothing is a cliché (see §7).

### 6.4 Anti-cliché technique — replace adjectives with evidence

The mechanical rule: **delete every adjective that describes you; replace it with a noun + number that proves it.**

| Cliché | Evidence-based replacement |
|---|---|
| "passionate about AI" | "I've run vision models on 3,000+ cameras and know what breaks at night." |
| "strong problem solver" | "When per-camera false positives made LPR alerts unusable, I rebuilt thresholding per camera." |
| "fast learner" | "Shipped the LLM/agent stack (Ollama, LangGraph, Qdrant) as a working workbench, not a course exercise." |
| "detail-oriented" | "Built the annotation → retraining loop so labels and models stayed versioned together." |
| "team player" | "Owned reliability for the LPR fleet while the team's focus was on new modules." |

### 6.5 Jakarta / Southeast Asia positioning note

"Ships production systems" is the universal currency — the §5.1 table applies identically in Jakarta, Singapore, and remote-EU/US hiring. Two local-market additions that increase leverage:

- **Smart-city / surveillance and maritime logistics** are real, funded domains in Indonesia; your LPR and tugboat work is domain capital, not just engineering capital. Say the domain words.
- **If targeting remote international roles:** add explicit timezone/English-working notes only if you can support them, and make the Turbquant/agent workbench public so a reviewer can assess you without a client call.

---

## 7. STATEMENTS TO AVOID (with replacements)

### 7.1 Phrases that hurt credibility

| Avoid | Why it fails | Replace with |
|---|---|---|
| "Passionate about AI/ML/computer vision" | Pure assertion; appears on most resumes; tells the reader nothing (S1: users detest marketese, which "imposes a cognitive burden") | State what you built and what you learned from it |
| "Self-taught guru / ninja / rockstar / wizard" | S4 explicitly warns against this: it invites an interview you will fail | State the stack and the artifact |
| "Aspiring AI engineer" | Signals you are not one yet — contradicts your own CV | "AI Engineer" (you have the title and 4 deployments) |
| "Results-driven", "hard-working", "go-getter", "team player", "dynamic professional" | Zero information; universally ignored | Delete |
| "Leveraged cutting-edge AI to drive innovation" | Marketese; unfalsifiable | "Deployed YOLO-based detection to Jetson Orin Nano at X FPS" |
| "Responsible for…" / "Worked on…" / "Helped with…" | Describes presence, not contribution | "Built", "Designed", "Reduced", "Migrated", "Shipped", "Owned" |
| "Proficient in 25 technologies" | Multiplies keyword-stuffing perception by 25 | Tiered skills list with project evidence (§3.1) |
| "Improved efficiency by 98%" (undefined) | Not defensible; reads as fabricated | Hours saved, with measurement period (§2.6a) |
| "Expert in / Mastery of [X]" at 1.5 years | Invites a hostile technical screen | "Production experience with X — [project], [specific use]" |
| "Results may vary" / vague hedging | Sounds defensive | Scope precisely: "internal validation on N held-out samples" |
| Skill percentage bars / star ratings / radar charts | Universally ridiculed by engineers; implies a measurement that does not exist | Three-tier list, or project evidence |
| A separate "Soft Skills" section | Low signal; usually filler | Show collaboration inside project role captions ("coordinated 4 engineers") |
| "Objective:" line | S4: "Nobody looks at the objective" | Delete; use the space for a project or a proof line |
| Multi-page resume / "Click here for the full version" | S4: one page | One page; portfolio link for depth |
| Listing course numbers without titles | S4: "nobody knows what CS229 is" | Use course titles |
| "Just a beginner, but…", self-deprecation | Undercuts real achievements | State the honest level: "working experience with X" |
| Emoji-heavy sections, skill meters, "X years" badges per tool | Visual noise; reads as template filler | Clean text hierarchy |
| "I'm looking for an opportunity where I can grow" | About-you, not about-value | Frame what you bring: "I specialize in getting CV models onto constrained hardware" |
| Copy-pasting the same CV bullet into the portfolio card | Redundant; wastes the click | Rewrite at card density (§1.1) |
| Broken demo links / "coming soon" placeholders | Actively negative — worse than omitting | Remove until it works |

### 7.2 Sections to delete from the current CV/portfolio

| Section | Verdict |
|---|---|
| **"Objective"** (if present) | **Delete** (S4). |
| Flat 45-item skills block | **Replace** with three-tier structure (§3.1). |
| Duplicate `Python` entry | **Delete** the duplicate. |
| Concept-only "skills" (`Model Serving`, `Edge AI`, `RAG`, `Prompt Engineering`) | **Move** into a one-line summary or delete. |
| "Achievements" section restating project facts | **Keep only if** each line adds a verifiable claim; otherwise fold into Experience. Currently the "98% mAP / 98% efficiency / 7 modules / 3,000+ cameras" lines **duplicate** the Experience bullets and recycle the suspect `98%`. Restructure as a **Selected Work** section with honest metrics. |
| "Skills: [huge list]" on the portfolio homepage | **Delete.** Never show a skills dump to a reader who has zero context. Skill context belongs in cards/case studies. |
| Team-size-free "Led teams" claims | **Scope** with actual role and team composition (§1.2 T2). |
| "2026" dates on ongoing work | Verify. If a project is ongoing, write "2025–Present" rather than a future year — a future date reads as an error and damages trust in every other number. |

---

## 8. RANKED CONTENT IMPROVEMENTS (highest leverage first)

| Rank | Action | Why it ranks here | Effort | Impact |
|---|---|---|---|---|
| **1** | **Fix the two indefensible numbers** — "98% mAP@0.5:0.95" and "98% efficiency/accuracy" | They are the only claims in your CV a technical reviewer will actively distrust, and distrust contaminates every other number you report | 30 min | ★★★★★ |
| **2** | **Recover and publish one latency + one throughput number from the edge pipelines** (ms/frame on Jetson Orin Nano; concurrent streams served) | This is the single metric that proves production capability rather than training capability. Nothing else substitutes for it | 2–4 hrs | ★★★★★ |
| **3** | **Build 3 deep case studies** (LPR, Turboquant, Mining SaaS) using the §4.1 structure with diagrams and the §2.4 confidentiality block | Converts your real work into the only format that convinces a senior engineer | 1–2 days each | ★★★★★ |
| **4** | **Rewrite the CV into `[Action] → [Metric] → [Baseline] → [Method]` bullets** | Turns an inventory of tools into evidence; improves both ATS keyword coverage and human reading | 2–3 hrs | ★★★★☆ |
| **5** | **Replace the flat skills list with the three-tier, project-anchored structure** | Removes keyword-stuffing perception and correctly signals depth-vs-breadth | 45 min | ★★★★☆ |
| **6** | **Restructure the portfolio homepage to a ≤110-word fold** with 3 project cards leading with scale numbers | S2: readers finish only ~111-word pages; your best numbers are currently buried | 3–4 hrs | ★★★★☆ |
| **7** | **Write the About in the §6.3 voice; delete every cliché from §7.1** | Positioning is the highest-variance lever for how senior you read | 1 hr | ★★★★☆ |
| **8** | **Scope every team/leadership claim with role and team composition** | Protects you in the interview that the claim invites | 30 min | ★★★☆☆ |
| **9** | **Publicly ship Turboquant with a clean README, architecture diagram, and demo GIF** | Your only fully shareable artifact; anchors the whole portfolio | 1 day | ★★★☆☆ |
| **10** | **Exploit the EE + edge-AI differentiator** in the About and one case study | Rare combination; currently entirely absent from your positioning | 1 hr | ★★★☆☆ |
| **11** | **Add "What I'd do differently" to every case study** | The cheapest, highest-signal maturity marker available | 30 min each | ★★★☆☆ |
| **12** | **Standardize project naming** (Turboquant vs. Tuboquant) and verify all dates | Inconsistency reads as carelessness and undermines otherwise-good numbers | 15 min | ★★☆☆☆ |
| **13** | **Write one technical deep-dive post** (TensorRT export or per-camera threshold calibration) | Demonstrates communication + depth; strong referral bait | 3–4 hrs | ★★☆☆☆ |
| **14** | **Do NOT buy more certifications** | At 1.5 YOE with 4 production deployments, marginal return is near zero; spend the time on #1–#3 | — | ★★★★☆ (as an anti-action) |

---

## 9. WHAT YOU ALREADY HAVE THAT MOST CANDIDATES DON'T (use it harder)

1. **Numbers nobody can fake:** 3,000+ cameras, 26 vessels, 7 modules, 24/7. Scale qualifiers are rare at 1.5 years.
2. **The unglamorous production stack:** ONNX/TensorRT, Jetson Orin Nano, three managed Linux production areas, systemd, monitoring. This is the exact evidence that separates "ships systems" from "did tutorials" (§5.1).
3. **An annotation → training loop you built yourself** — a data-flywheel builder, not just a model trainer.
4. **Multi-domain systems experience:** CV + LLM/agents + IoT telematics + SaaS architecture.
5. **Electrical Engineering, 3.78 GPA** — the edge-hardware reasoning credential almost no competing CV engineer has, and it is currently unused in your positioning.
6. **A verified national credential** (Bangkit Top 10%) and a verifiable Google cert.

**The diagnosis in one sentence:** you have unusually strong *raw* evidence and systematically *under-encoded* it — numbers unqualified, skills untiered, achievements duplicated, and the best systems-design story (one substrate, seven modules) buried as a noun list. The fix is entirely presentational, and items #1–#4 in §8 capture most of the available gain.

---

## 10. SOURCE URLs

**Read and cited:**
- https://www.nngroup.com/articles/how-users-read-on-the-web/ — S1 (scannability, inverted pyramid, objectivity; +124% combined usability)
- https://www.nngroup.com/articles/how-little-do-users-read/ — S2 (28% max / ~20% realistic read fraction; 111-word half-read threshold; 4.4s per +100 words)
- https://github.com/lagnis337/ds-application-portfolio-guide — S3 (case-study template + worked LLM example)
  - https://raw.githubusercontent.com/lagnis337/ds-application-portfolio-guide/main/template/case-study-template.md
  - https://raw.githubusercontent.com/lagnis337/ds-application-portfolio-guide/main/examples/02-slack-text-to-sql-analyst.md
- https://github.com/cassidoo/getting-a-gig — S4 (resume/skills guidance; What/Why/How/When/Who; anti-"ninja")
- https://raw.githubusercontent.com/cassidoo/getting-a-gig/master/README.md
- https://github.com/ather-techie/ai-system-design-interview — S5 (production AI interview vocabulary: gateways, caching, streaming, cost, evals, capacity math)
- https://github.com/ather-techie/rag-interview-system — S5 (retrieval/LLM production metrics, observability, cost optimization)
- https://github.com/emmabostian/developer-portfolios — S6 (1,981-portfolio corpus; AI Engineer entries are a minority)

**Retrieved but blocked / not machine-readable (flagged, not quoted):**
- https://www.google.com/about/careers/applications/how-we-hire/ — page shell only; content JS-gated
- https://www.linkedin.com/pulse/ — TypeError on fetch
- https://web.dev/learn/ — fetch failed
- https://www.levels.fyi/blog/how-to-write-a-resume-for-software-engineers.html — 404
- https://www.freecodecamp.org/news/how-to-write-a-software-engineer-resume/ — fetch failed
- https://www.reddit.com/r/cscareerquestions/ — JS-gated, no content
- https://html.duckduckgo.com/html/ , https://lite.duckduckgo.com/lite/ — network blocked (code 000)
- https://search.brave.com/search — CAPTCHA wall
- https://raw.githubusercontent.com/emmabostian/developer-portfolios/master/README.md — fetched (list only)

**Unavailable surface:** `web_search` returned "DeepSeek API error (HTTP 404)" on every attempt (6 tries, including single-word queries). If this report is to be extended, use `web_fetch` on known-good URLs or the `r.jina.ai/<url>` prefix; Bing-via-Bing-HTML was degraded to ads and returns poor signal.

---

*Report scope: research and recommendation only. No code written, per instruction. All rewrite examples use only facts present in the supplied CV; placeholders in `[brackets]` mark numbers that must be recovered from real logs before publication.*
