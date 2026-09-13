/**
 * RYAS RAFI KARIM — AI SYSTEMS ENGINEER PORTFOLIO
 * High-Craft Interactive Engine: Bento Grid, Telemetry Inspector,
 * Case Study Slide-Over Drawer, Lightbox & Tactile Feedback.
 */

// --- 1. COMPREHENSIVE PRODUCTION SYSTEMS DATASET ---
const PRODUCTION_PROJECTS = [
  {
    id: "mining-vision",
    category: "cv",
    isFlagship: true,
    bentoSpan: "bento-span-7",
    title: "MiningVision (SENTINEL-CV)",
    subtitle: "Industrial Mining Haulage & Edge OCR Telemetry Platform",
    client: "Gerbang Data Indonesia · Mining Fleet Operations (KPP, ABB)",
    repo: "GDI-Analytics-AI/centralized-ai",
    private: true,
    image: "truck-hull-recognition.png",
    rawImage: "Truck Hull Recognition.png",
    metric: "90,722+ Tons Haulage Tracked · Zero Frame Drops",
    tags: ["YOLOv8 ONNX", "PaddleOCR", "Linux Ramdisk /dev/shm", "FastAPI", "Multi-RTSP", "AdaFace IR-101"],
    summary: "High-throughput industrial computer vision system running across distributed CCTV feeds on active haul roads. Features automated 'No. Lambung' truck plate recognition, ground calibrated speed calculation, and driver safety compliance.",
    caseStudy: {
      context: "Open-pit mining operations across expansive haul roads suffered from manual bottlenecked haulage tracking and severe road safety hazards. Dusty outdoor cameras and simultaneous high-bitrate RTSP streams caused heavy CPU/disk bottlenecks in conventional video pipelines.",
      role: "Lead AI & Systems Engineer — Architected the multi-RTSP streaming pipeline, engineered the 'No. Lambung' (hull number) detection and OCR subsystem, optimized frame distribution, and integrated multi-tenant alerts.",
      whatWasDone: [
        "Architected a zero-disk-bottleneck pipeline utilizing Linux Ramdisk (/dev/shm) for IPC frame sharing between RTSP decoders and inference workers, eliminating I/O stalls completely.",
        "Built a specialized two-stage YOLOv8 + PaddleOCR pipeline that localizes haul truck bodies, isolates the hull number plate (e.g. LD0531, LD0541), applies perspective rectification, and performs OCR with speed calculation based on ground calibration markers.",
        "Engineered License Plate Recognition (LPR) coupled with a 41-class YOLOv8 ONNX vehicle brand classifier and vehicle color recognition.",
        "Integrated AdaFace IR-101 facial recognition with Qdrant vector database for site access security, plus smoke/fire detection and PPE compliance alarms.",
        "Developed a FastAPI operator dashboard serving GPU-accelerated HLS video streams, watchdog-driven configuration updates (polling every 60s), and standardized Jakarta WIB (UTC+7) event telemetry."
      ],
      outcome: "Successfully deployed on active mining sites tracking over 90,722+ tons of haulage with zero frame loss across concurrent feeds, automating haul road speed enforcement and delivering actionable telemetry directly to dispatch control.",
      techStack: ["Python 3.11", "FastAPI", "Ultralytics YOLOv8", "ONNX Runtime GPU (CUDA 12.8)", "PaddleOCR", "Qdrant Vector DB", "Linux Ramdisk", "systemd", "HLS Streaming"]
    }
  },
  {
    id: "tugboats-analytics",
    category: "cv",
    isFlagship: true,
    bentoSpan: "bento-span-5",
    title: "Tugboats Fleet Analytics",
    subtitle: "24/7 Maritime Vessel Safety Surveillance Across 26 Ships",
    client: "Gerbang Data Indonesia · Maritime Fleet Operations",
    repo: "GDI-Analytics-AI/Tugboats-Analytics",
    private: true,
    image: "person-tugboat-detection.jpeg",
    rawImage: "Person in Tugboat detection.jpeg",
    metric: "26 Vessels Monitored · 98% mAP@0.5:0.95 · Zero False Glare Drops",
    tags: ["YOLO11", "NVIDIA TensorRT", "Teltonika IoT API", "Telegram Bot", "Edge Computing", "Burst Voting"],
    summary: "Fleet-wide edge-deployed CCTV monitoring platform operating across 26 commercial marine tugboats (TB. MICHAEL, TB. ELWOOD). Features YOLO11 quantized with TensorRT, Teltonika GPS integration, and Burst Voting filtering out harsh sea glare.",
    caseStudy: {
      context: "Maritime safety regulations mandate continuous crew presence in vessel wheelhouses. Operating offshore creates unique hurdles: severe wave motion, sun glare off water reflections, camera vibration, and fluctuating satellite/cellular uplinks.",
      role: "AI Engineer & Project Manager — Led cross-functional team defining requirements and deployment across 26 tugboats. Quantized models with TensorRT, engineered the Burst Voting filter, and integrated Teltonika telematics.",
      whatWasDone: [
        "Deployed and quantized YOLO11 models to NVIDIA TensorRT achieving 98% mAP@0.5:0.95 with ultra-low inference latency on compact edge hardware.",
        "Developed a proprietary Burst Voting algorithm that aggregates detections across sequential video bursts, completely filtering out false alarms caused by ocean glare, sea spray, and vessel pitch/roll.",
        "Integrated Teltonika telematics API with RTSP video frames to cross-verify vessel GPS movement with bridge crew alertness.",
        "Engineered an automated alert pipeline dispatching annotated CCTV captures to fleet operations via Telegram whenever bridge presence drops below mandatory safety thresholds (< 2 persons).",
        "Built resilient auto-reconnecting video loaders with watchdog recovery to handle offshore satellite connection drops."
      ],
      outcome: "Successfully deployed 24/7 autonomous safety surveillance across all 26 commercial tugboats with zero false drops during turbulent sea conditions.",
      techStack: ["Python", "YOLO11", "NVIDIA TensorRT", "PyTorch", "OpenCV", "Teltonika API", "Telegram Bot API", "Linux Daemons"]
    }
  },
  {
    id: "versigent-ops",
    category: "automation",
    isFlagship: true,
    bentoSpan: "bento-span-5",
    title: "Versigent Ops & AutoCAD OCR",
    subtitle: "Automated Vector CAD Extraction & Wire-Harness Pipeline",
    client: "Gerbang Data Indonesia · Automotive Electrical Engineering",
    repo: "GDI-Analytics-AI/versigent-ops",
    private: true,
    image: "cad-drawing-conversion.png",
    rawImage: "CAD drawing conversion.png",
    metric: "Turnaround: 3 Days → < 5 Mins (-99.2%) · 6 Workbooks Automated",
    tags: ["Vector Line OCR", "Graph Routing (NetworkX)", "FastAPI", "ES Modules Canvas", "OpenPyXL", "Delphi/Aptiv"],
    summary: "Automated extraction pipeline that parses massive single-page AutoCAD wire-harness PDF schematics, traces wiring topology using graph theory, and compiles 6 industry-standard Excel manufacturing workbooks.",
    caseStudy: {
      context: "Automotive wire-harness manufacturing engineers manually reviewed dense multi-megapixel CAD diagrams to extract connectors, splice points, wire routes, and dimensions. Drafting the 6 required manufacturing Excel workbooks took up to 3 days per drawing with high risk of human transcription errors.",
      role: "Lead AI & Algorithm Engineer — Designed the vector geometry extraction engine, graph theory wire routing solver, master catalog cross-referencing logic, and the interactive ES Modules review canvas.",
      whatWasDone: [
        "Engineered a high-speed vector geometry parser that extracts vector lines, tables, and connector callouts in milliseconds directly from PDF vector primitives without heavy deep learning overhead.",
        "Developed a raster skeletonization and graph routing algorithm (NetworkX) that solves shortest paths for physical wire harnesses and anchors dimension text with orthogonal segment projection snapping.",
        "Built an automated cross-referencing engine querying Delphi and Aptiv component master catalogs to determine terminal types, seals, blanking plugs, and wire gauge compatibility.",
        "Constructed an interactive web canvas dashboard (/label-dot) using native ES Modules featuring local-first offline outbox queuing, optimistic UI updates, disk caching, and 60-second cloud synchronization.",
        "Automated the simultaneous generation of all 6 standard manufacturing workbooks formatted with formulas, pin-to-pin wiring maps, and cut specifications."
      ],
      outcome: "Cut engineering document preparation time from 3 days to under 5 minutes per harness. Guaranteed 100% computational accuracy across BOM and circuit schedules with full engineer-in-the-loop interactive verification.",
      techStack: ["Python", "OpenCV", "PyMuPDF (fitz)", "NetworkX", "FastAPI", "OpenPyXL", "JavaScript ES Modules", "Canvas 2D API", "Delphi/Aptiv Catalogs"]
    }
  },
  {
    id: "lpr-jakartasmarteye",
    category: "cv",
    isFlagship: true,
    bentoSpan: "bento-span-7",
    title: "Jakarta SmartEye & Urban Analytics",
    subtitle: "Metropolitan Scale Video Analytics Across 3,000+ CCTV Feeds",
    client: "PT Bali Towerindo Sentra Tbk · Metropolitan Infrastructure",
    repo: "Private Enterprise / Bali Tower Infrastructure",
    private: true,
    schematic: "JAKARTA SMARTEYE · 3,000+ CCTVS · LPR · POLYGON WASTE · MBG CROWD",
    metric: "3,000+ CCTV Cameras · 98% Urban Analytics Accuracy",
    tags: ["LPR", "Jakarta SmartEye", "YOLO", "Edge Linux Servers", "Waste Polygon Segmentation", "Crowd Analytics"],
    summary: "Maintained and optimized the production License Plate Recognition system powering Jakarta SmartEye across 3,000+ metropolitan CCTV feeds. Deployed polygon-based waste segmentation and crowd analytics across 3 Linux production environments.",
    caseStudy: {
      context: "PT Bali Towerindo Sentra Tbk operates extensive telecommunication towers and municipal CCTV infrastructure across DKI Jakarta. The metropolitan LPR system required robust throughput and high plate detection accuracy across differing illumination, rain, and rapid traffic movements.",
      role: "AI Engineer — Maintained inference services, deployment, and monitoring across 3 Linux production zones; engineered polygon waste segmentation and crowd detection pipelines.",
      whatWasDone: [
        "Maintained, optimized, and tuned License Plate Recognition (LPR) models processing vehicular feeds from over 3,000+ operational CCTV cameras across Jakarta.",
        "Trained and deployed deep-learning models for waste segmentation utilizing polygon-based coverage percentage calculations, improving maintenance tracking accuracy by 98%.",
        "Engineered people counting and crowd density analytics for Makan Bergizi Gratis (MBG) initiatives and infrastructure maintenance schedules.",
        "Managed three distinct Linux production environments: high-speed inference microservices, deployment pipelines, and observability monitoring."
      ],
      outcome: "Sustained high-availability LPR and city surveillance across 3,000+ cameras with 98% accuracy, reducing manual urban monitoring overhead significantly.",
      techStack: ["Python", "PyTorch", "YOLO", "OpenCV", "Ubuntu Production Server", "Docker", "Linux systemd", "Edge Computing"]
    }
  },
  {
    id: "medvance-ai",
    category: "rag",
    title: "Medvance AI Analytics",
    subtitle: "Automated Medical Claim Validation & Regulatory RAG Assistant",
    client: "Gerbang Data Indonesia · Healthcare Analytics",
    repo: "GDI-Analytics-AI/medvance",
    private: true,
    metric: "80%+ Routine Claim Audits Automated · Scoped API Security",
    tags: ["Healthcare AI", "BPJS Validation", "Regulatory RAG", "ICD-10/ICD-9CM", "FastAPI", "DeepSeek / OpenAI"],
    summary: "Intelligent medical claim auditing backend combining OCR parsing, deterministic clinical rules, and a regulatory RAG assistant to verify Indonesian BPJS health claims against national medical guidelines.",
    caseStudy: {
      context: "Hospital insurance claim adjusters faced immense workloads reviewing multi-page claim PDFs, clinical notes, lab results, and hospital billing against thousands of ICD-10 diagnostic codes and complex Indonesian BPJS healthcare regulations.",
      role: "Backend AI & RAG Architect — Designed the document extraction pipeline, deterministic validation logic, domain-specific RAG knowledge base, and dual-mode conversational assistant.",
      whatWasDone: [
        "Constructed an ingestion pipeline supporting complex hospital claim PDFs and JSON payloads, extracting diagnoses, itemized pharmacy bills, lab values, and procedural records.",
        "Built a multi-tier deterministic validation rules engine validating identity integrity, billing cross-totals, mandatory diagnostic prerequisite tests, and ICD-10 / ICD-9CM procedural compatibility.",
        "Engineered a domain-specific RAG policy knowledge base indexing BPJS circulars, clinical pathway manuals, and healthcare tariff tables.",
        "Created a dual-mode claim assistant: Mode A for automated ICD lookup and guideline validation, and Mode B for conversational policy exploration with strict document citation verification.",
        "Implemented enterprise-grade security with granular scoped API keys and patient PII sanitization."
      ],
      outcome: "Automated over 80% of routine claim compliance audits, pinpointed invalid diagnostic codes before submission, and drastically reduced human review turnaround times.",
      techStack: ["FastAPI", "Python", "PyMuPDF", "DeepSeek API / OpenAI", "Vector Database", "Pydantic V2", "Scoped API Auth"]
    }
  },
  {
    id: "hrm-chatbot",
    category: "rag",
    title: "Enterprise HRM Chatbot",
    subtitle: "Privacy-Preserving On-Premise Enterprise AI with Legal Citations",
    client: "Gerbang Data Indonesia · Corporate HR Systems",
    repo: "GDI-Analytics-AI/HRM-Chatbot",
    private: true,
    metric: "100% On-Premise · Sub-second Hybrid RRF Retrieval",
    tags: ["Local-First LLM", "Ollama Qwen3", "Qdrant Vector DB", "Hybrid RRF", "UU Ketenagakerjaan", "Staffora HRIS"],
    summary: "On-premises enterprise HR assistant answering corporate policy and Indonesian labor law (UU Ketenagakerjaan) questions with hybrid dense/sparse retrieval, exact BAB/Pasal legal citations, and Staffora HRIS integration.",
    caseStudy: {
      context: "Enterprises required an intelligent chatbot to answer complex employee inquiries regarding company SOPs, leave entitlements, and labor laws without leaking confidential employee records to third-party public cloud LLMs.",
      role: "LLM & RAG Systems Engineer — Architected the local-first RAG pipeline, dense+sparse hybrid retrieval with Reciprocal Rank Fusion, legal citation anchoring, and PII masking.",
      whatWasDone: [
        "Architected an entirely on-premises AI stack using Ollama (qwen3:8b), LiteLLM Proxy gateway, and embedded/cloud Qdrant vector database.",
        "Engineered an advanced Hybrid Retrieval pipeline merging dense semantic vectors (nomic-embed-text) with sparse lexical keywords using Reciprocal Rank Fusion (RRF) and lightweight reranking.",
        "Built a strict citation engine that extracts and guarantees exact document references down to the chapter (BAB) and article (Pasal) of Indonesian Labor Law.",
        "Integrated Staffora HRIS APIs for employee-specific queries (leave balance, attendance) with automatic PII masking.",
        "Implemented SSE streaming endpoints and an automated LLM-as-a-judge evaluation suite to benchmark answer quality."
      ],
      outcome: "Delivered a zero-data-leak corporate AI assistant with high answer faithfulness, sub-second token streaming, and full compliance with enterprise privacy guidelines.",
      techStack: ["FastAPI", "Ollama", "Qwen 3 8B", "LiteLLM", "Qdrant", "nomic-embed-text", "RRF Hybrid Search", "Python"]
    }
  },
  {
    id: "ai-cs-saas",
    category: "rag",
    title: "AI Customer Service SaaS (AI-CS)",
    subtitle: "Enterprise Conversational AI on WhatsApp & Telegram",
    client: "Gerbang Data Indonesia · Commercial SaaS Platform",
    repo: "GDI-Analytics-AI/AI-CS",
    private: true,
    metric: "< 2s Response Latency · Multi-Tenant Isolation",
    tags: ["React 19", "FastAPI", "PostgreSQL pgvector", "DeepSeek API", "WhatsApp Baileys", "shadcn/ui"],
    summary: "Multi-channel AI customer service SaaS automating customer inquiries on WhatsApp and Telegram using business-specific knowledge bases, PostgreSQL pgvector retrieval, and DeepSeek LLMs.",
    caseStudy: {
      context: "Indonesian businesses experience high lead drop-off due to slow customer support responses on WhatsApp and Telegram. Off-the-shelf bots lacked domain-specific catalog retrieval and cultural fluency in colloquial Indonesian.",
      role: "Full Stack AI Engineer — Built the multi-channel gateway, the pgvector knowledge base retrieval layer, the DeepSeek completion engine, and the React 19 administrative portal.",
      whatWasDone: [
        "Engineered a multi-channel messaging gateway connecting WhatsApp (using the Baileys socket engine) and Telegram Bot API into an asynchronous event queue.",
        "Implemented a scalable business knowledge RAG system utilizing PostgreSQL with the pgvector extension and local embeddings (nomic-embed-text).",
        "Integrated DeepSeek Cloud API (deepseek-v4-flash) configured with localized personas for natural, polite Indonesian business communication.",
        "Built a modern full-stack web application featuring a React 19 + Vite + Tailwind CSS 4 + shadcn/ui frontend dashboard and a concurrent FastAPI backend."
      ],
      outcome: "Enabled instantaneous 24/7 customer engagement, automated FAQ resolution, and supported multi-tenant knowledge base isolation with real-time conversation analytics.",
      techStack: ["React 19", "Tailwind CSS 4", "shadcn/ui", "FastAPI", "PostgreSQL + pgvector", "DeepSeek API", "Baileys WhatsApp", "Telegram API"]
    }
  },
  {
    id: "annotator-app",
    category: "automation",
    title: "Nexus Annotator Platform",
    subtitle: "Full-Stack Data Annotation, Auto-Labeling & YOLO Training Web App",
    client: "Open Source / Gerbang Data Indonesia Infrastructure",
    repo: "ryasrk/AnnotatorAPP",
    private: false,
    metric: "End-to-End Dataset Labeling → YOLO Model Training",
    tags: ["Flask", "Socket.IO", "Ultralytics YOLO", "Polygon Segmentation", "Vanilla JS", "Ubuntu Server"],
    summary: "High-productivity multi-user YOLO annotation and training web platform built with Flask, SocketIO, and vanilla JavaScript. Features bounding boxes, polygon vertex segmentation, AI auto-annotation, and one-click training.",
    caseStudy: {
      context: "Training custom industrial YOLO models required an agile annotation tool that allowed team members to collaborate on labeling without exporting/importing large dataset archives or paying exorbitant SaaS per-seat licenses.",
      role: "Sole Creator & Lead Full-Stack AI Engineer — Built the frontend canvas annotation engine, Flask-SocketIO backend, and automated training pipeline.",
      whatWasDone: [
        "Engineered an interactive web canvas supporting click-and-drag bounding box labeling and multi-point polygon segmentation with real-time vertex adding, dragging, and deletion.",
        "Built an AI Auto-Annotate feature running background YOLO inference with configurable confidence/IoU thresholds and class filtering to pre-label raw images.",
        "Implemented real-time multi-user synchronization and collaboration via Flask-SocketIO on Ubuntu Server.",
        "Constructed an integrated training pipeline enabling users to trigger and monitor Ultralytics YOLO training directly from the web interface."
      ],
      outcome: "Streamlined GDI's internal dataset creation workflows, accelerating model turnaround times from raw CCTV footage to trained weights by over 60%.",
      techStack: ["Python 3.12", "Flask", "Flask-SocketIO", "Ultralytics YOLO", "JavaScript Canvas 2D", "Ubuntu Server", "HTML5/CSS3"]
    }
  },
  {
    id: "ryasai-chatbot",
    category: "rag",
    title: "ryasai Enterprise Assistant",
    subtitle: "Multi-Tenant Enterprise AI Assistant Routing SQL, RAG & APIs",
    client: "Enterprise SaaS Architecture (ryasrk)",
    repo: "ryasrk/ryasai-chatbot",
    private: false,
    metric: "Multi-Tenant SaaS · Enterprise Guardrails & Tool Routing",
    tags: ["TypeScript", "Multi-Tenant", "Document RAG", "SQL Agent", "REST API Router", "Security Isolation"],
    summary: "Production-grade multi-tenant enterprise AI assistant that intelligently routes user queries to SQL databases, document RAG, external REST APIs, or general conversation with strict organizational isolation.",
    caseStudy: {
      context: "Enterprises require a unified conversational assistant capable of answering questions from diverse data silos (structured SQL databases, unstructured PDF policies, external CRM APIs) while enforcing strict multi-tenant isolation.",
      role: "Architect & Lead Engineer — Designed the multi-tenant routing engine, tool calling abstractions, and enterprise security guardrails.",
      whatWasDone: [
        "Architected an intelligent router that evaluates user intent and dispatches queries to SQL query generators, document RAG, or external REST API plugins.",
        "Built multi-tenant organizational isolation ensuring enterprise data, embeddings, and chat histories remain strictly partitioned.",
        "Integrated security guardrails preventing prompt injection and unredacted confidential data leakage.",
        "Provided modular plugin interfaces for seamless integration into existing enterprise backends."
      ],
      outcome: "Delivered a scalable multi-tenant AI assistant architecture ready for commercial enterprise deployment.",
      techStack: ["TypeScript", "Node.js", "Vector DB", "SQL Alchemy / TypeORM", "RESTful APIs", "Docker"]
    }
  },
  {
    id: "dsh-awesome-skills",
    category: "automation",
    title: "dsh-awesome-skills Indexer",
    subtitle: "Semantic Vector Search over 6,097 Agent Skills for DeepSeek Harness",
    client: "Open Source Ecosystem (ryasrk)",
    repo: "ryasrk/dsh-awesome-skills",
    private: false,
    metric: "Sub-Second Vector Search across 6,097 Agent Skills",
    tags: ["TypeScript", "Vector Search", "DeepSeek Harness", "Agent Memory", "Semantic Index", "Node.js"],
    summary: "DeepSeek Harness plugin bundle providing autonomous coding agents with instant semantic vector search over a local corpus of 6,097 curated skills without exhausting per-turn context windows.",
    caseStudy: {
      context: "AI agent harnesses degrade in performance when overloaded with thousands of skill instructions in prompt context. Agents need a way to perform just-in-time semantic search for relevant playbooks.",
      role: "Author & Maintainer — Vector-indexed the curated 6,097-skill corpus and engineered the native DSH search bundle.",
      whatWasDone: [
        "Indexed 6,097 agent skills using high-density vector embeddings.",
        "Engineered a sub-second search CLI and API bundle for DeepSeek Harness.",
        "Eliminated context window pollution while guaranteeing agents discover tested engineering playbooks before execution."
      ],
      outcome: "Widely utilized across autonomous agent development, providing rapid access to verified testing, frontend, backend, and DevOps skills.",
      techStack: ["TypeScript", "Node.js", "Vector Embeddings", "DeepSeek Harness Bundle Protocol"]
    }
  },
  {
    id: "chat-room-x",
    category: "rag",
    title: "Chat Room X Gateway",
    subtitle: "Cloud AI Multi-Agent Orchestration & Bun Inference Manager",
    client: "Open Source / ryasrk Project",
    repo: "ryasrk/chat-room-x",
    private: false,
    metric: "Zero Local Inference Overhead · Cloud Provider Routing",
    tags: ["Bun", "Vite + React", "Multi-Agent AI", "OpenAI / Anthropic", "EnowxAI Gateway", "TypeScript"],
    summary: "Cloud-only AI chat room featuring multi-agent architecture with zero local inference burden, routing queries through cloud gateways with an ultra-fast Bun inference manager.",
    caseStudy: {
      context: "Coordinating multi-agent collaborative discussions often requires high compute resources if hosted locally. Chat Room X solves this by distributing multi-agent turns across high-throughput cloud providers via a lightweight runtime.",
      role: "Architect & Developer — Built the Bun inference manager and the Vite React monitoring dashboard.",
      whatWasDone: [
        "Developed a high-performance inference manager in Bun (:18247) handling multi-agent orchestration and conversation state.",
        "Built a modern React + Vite dashboard (:7391) featuring real-time agent monitor views and provider latency telemetry.",
        "Integrated dynamic routing across multiple cloud LLM providers (OpenAI, Anthropic, EnowxAI)."
      ],
      outcome: "Enabled responsive multi-agent brainstorming and automated discussions with minimal local resource footprint.",
      techStack: ["Bun", "React", "Vite", "TypeScript", "Cloud LLM APIs", "WebSocket"]
    }
  },
  {
    id: "chord-recognition",
    category: "cv",
    title: "DeepChroma ChordRecognition",
    subtitle: "Deep Learning Audio AI & Musical Information Retrieval",
    client: "Open Source Audio AI (ryasrk)",
    repo: "ryasrk/ChordRecognition",
    private: false,
    metric: "Real-Time Audio Chord Transcription & Visual Playback",
    tags: ["Python", "Flask", "madmom", "Deep Learning Audio", "Chroma Features", "Music Information Retrieval"],
    summary: "Deep-learning music information retrieval (MIR) web platform extracting and visualizing musical chords in real time from uploaded audio and video files using convolutional Deep Chroma processors.",
    caseStudy: {
      context: "Transcribing musical harmony from polyphonic audio recordings requires specialized signal processing and deep neural networks trained on spectrogram chromagrams.",
      role: "Author & Audio AI Engineer — Built the neural audio processing pipeline and interactive web player.",
      whatWasDone: [
        "Integrated madmom's DeepChromaProcessor and DeepChromaChordRecognitionProcessor for sequential neural feature extraction.",
        "Handled multi-format audio/video ingestion (WAV, MP3, FLAC, MP4, MKV) with automated conversion via PyDub and FFmpeg.",
        "Constructed a clean Flask player UI that renders detected chord progressions in sync with audio playback."
      ],
      outcome: "High-accuracy automated chord charting for musicians, musicologists, and audio enthusiasts.",
      techStack: ["Python", "Flask", "madmom", "NumPy", "PyDub", "HTML5 Audio API"]
    }
  },
  {
    id: "oil-palm-ai",
    category: "cv",
    title: "Oil Palm Precision Vision Suite",
    subtitle: "Aerial & Ground Computer Vision for Plantation Yield Optimization",
    client: "Gerbang Data Indonesia · AgriTech Operations",
    repo: "GDI-Analytics-AI/oil-palm",
    private: true,
    metric: "3 Custom YOLO Models Deployed · Automated Tree Census",
    tags: ["Computer Vision", "Ultralytics YOLO", "Streamlit", "Drone Orthomosaics", "AgriTech"],
    summary: "Multi-task computer vision suite for oil palm plantations encompassing drone orthomosaic crown counting, fresh fruit bunch (FFB) detection, and automated harvest ripeness classification.",
    caseStudy: {
      context: "Managing massive palm oil plantations requires accurate tree census counts and precise ripeness grading of harvested bunches. Underripe or overripe fruit drastically reduces mill Oil Extraction Rates (OER).",
      role: "Computer Vision Engineer — Trained and optimized three distinct YOLO object detection models and built an interactive web dashboard for plantation agronomists.",
      whatWasDone: [
        "Trained a satellite/drone orthomosaic model for aerial tree crown detection and plantation density inventory.",
        "Developed a fresh fruit bunch (FFB/TBS) detector for counting harvested bunches on ground collection points.",
        "Trained a multi-class ripeness model classifying oil palm fruit bunches into Unripe, Ripe, and Overripe states.",
        "Constructed a Streamlit interactive dashboard with image upload, custom confidence filtering, and instant annotated detection analytics."
      ],
      outcome: "Standardized harvest quality grading across plantation collection points and provided automated canopy counts for estate yield forecasting.",
      techStack: ["Python", "Ultralytics YOLO", "OpenCV", "Streamlit", "Pillow", "Pandas"]
    }
  },
  {
    id: "bangkit-wastewizard",
    category: "cv",
    title: "Waste Wizard (CNN Capstone)",
    subtitle: "Google & Bangkit Academy Distinction Project",
    client: "Bangkit Academy 2023 (Google, GoTo, Traveloka)",
    repo: "ryasrk/ML-CapstoneWasteWizard",
    private: false,
    metric: "Distinction Graduate (Top 10%) · 95% Model Accuracy",
    tags: ["TensorFlow", "Keras", "Convolutional Neural Networks", "Google Cloud", "Computer Vision"],
    summary: "CNN-based municipal waste classification system achieving 95% validation accuracy, built during the 6-month Bangkit Academy Machine Learning program.",
    caseStudy: {
      context: "Urban municipal waste sorting requires accurate, real-time visual categorization into recyclable, organic, and hazardous streams.",
      role: "Lead Machine Learning Engineer — Engineered the data augmentation pipeline, CNN model architecture, and cloud deployment.",
      whatWasDone: [
        "Trained deep convolutional neural networks with transfer learning achieving 95% classification accuracy on unseen waste items.",
        "Built automated preprocessing and data augmentation pipelines with TensorFlow and Keras.",
        "Collaborated with cloud and mobile engineers to deploy inference APIs to Google Cloud Platform."
      ],
      outcome: "Graduated with Distinction in the top 10% of Bangkit Academy (Google, Tokopedia, Gojek, Traveloka).",
      techStack: ["TensorFlow", "Keras", "Python", "Google Cloud Platform", "CNNs"]
    }
  }
];

// --- 2. TELEMETRY INSPECTOR BENCHMARK PROFILES ---
const INSPECTOR_PROFILES = {
  "mining-cv": {
    name: "MiningVision (Haul Road CV)",
    status: "HEALTHY",
    throughput: "15 Concurrent RTSP Streams",
    fps: "25.0 FPS / Cam",
    latency: {
      ingest: "5.8 ms",
      ipc: "0.2 ms",
      yolo: "18.4 ms",
      ocr: "24.2 ms"
    },
    pipeline: [
      { phase: "Phase 1", name: "RTSP Video Ingestion", stat: "H.264 / Multi-Cam (5.8ms)" },
      { phase: "Phase 2", name: "Linux Ramdisk /dev/shm", stat: "Zero-Copy IPC (0.2ms)" },
      { phase: "Phase 3", name: "YOLOv8 Body Detect", stat: "ONNX Runtime CUDA (18.4ms)" },
      { phase: "Phase 4", name: "Hull Plate Rectification", stat: "Affine Transform (< 1ms)" },
      { phase: "Phase 5", name: "PaddleOCR Text Read", stat: "PP-OCRv4 (24.2ms)" },
      { phase: "Phase 6", name: "Ground Speed Radar", stat: "Pixel-to-Meter Delta (1.1ms)" },
      { phase: "Phase 7", name: "FastAPI Dispatch API", stat: "JSON Telemetry Push (3.4ms)" }
    ],
    sampleLog: [
      { time: "16:47:02.108", type: "info", msg: "[INGEST] RTSP frame decoded from camera 'Pos-25 Haul Road' (1920x1080 @ 25fps)" },
      { time: "16:47:02.114", type: "info", msg: "[IPC] Zero-copy memory buffer written to /dev/shm/frame_pos25_0814.raw" },
      { time: "16:47:02.133", type: "success", msg: "[YOLOv8-ONNX] Heavy Dump Truck detected with confidence 0.96 | BBox: [120, 340, 890, 680]" },
      { time: "16:47:02.158", type: "success", msg: "[PaddleOCR] Hull Plate Crop -> Extracted: 'LD0531' (Confidence: 0.984)" },
      { time: "16:47:02.161", type: "info", msg: "[RADAR] Ground calibration offset: 0.00 m/s -> Vehicle state: STATIONARY (0 km/h)" },
      { time: "16:47:02.165", type: "success", msg: "[TELEMETRY] Event dispatched to centralized-ai backend. Total pipeline latency: 57.2 ms" }
    ]
  },
  "tugboats": {
    name: "Tugboats Fleet (26 Vessels)",
    status: "HEALTHY",
    throughput: "26 Vessels Monitored 24/7",
    fps: "15.0 FPS / Cam",
    latency: {
      ingest: "6.2 ms",
      ipc: "0.1 ms",
      yolo: "14.5 ms",
      ocr: "N/A"
    },
    pipeline: [
      { phase: "Phase 1", name: "Wheelhouse Video Ingest", stat: "RTSP Stream (6.2ms)" },
      { phase: "Phase 2", name: "YOLO11 INT8 Model", stat: "NVIDIA TensorRT (14.5ms)" },
      { phase: "Phase 3", name: "Burst Voting Filter", stat: "5-Frame Buffer (Sliding Window)" },
      { phase: "Phase 4", name: "Teltonika GPS Telematics", stat: "REST API Poll (Every 10s)" },
      { phase: "Phase 5", name: "Telegram Bot Dispatch", stat: "Alert On Crew < 2 (< 800ms)" }
    ],
    sampleLog: [
      { time: "17:48:10.012", type: "info", msg: "[VESSEL] Active asset: TB. MICHAEL | Wheelhouse Bridge Cam 01" },
      { time: "17:48:10.027", type: "info", msg: "[TensorRT-INT8] Inference complete in 14.5 ms. Detected 2 persons (Confidence: 0.94, 0.91)" },
      { time: "17:48:10.035", type: "success", msg: "[BURST-VOTING] Aggregated 5 consecutive frames: 2 / 2 / 2 / 2 / 2 settled. False ocean glare eliminated." },
      { time: "17:48:10.048", type: "info", msg: "[TELTONIKA] Vessel speed: 8.4 knots. Heading: 214° SW. Safety rule satisfied." },
      { time: "17:48:10.052", type: "success", msg: "[WATCHER] Wheelhouse fully staffed. Status logged to operational dashboard." }
    ]
  },
  "cad-ocr": {
    name: "AutoCAD Wire-Harness Pipeline",
    status: "IDLE_STANDBY",
    throughput: "Batch On-Demand Execution",
    fps: "N/A",
    latency: {
      ingest: "48.0 ms",
      ipc: "1.2 ms",
      yolo: "120.0 ms",
      ocr: "35.0 ms"
    },
    pipeline: [
      { phase: "Phase 1", name: "Vector Geometry Parser", stat: "PyMuPDF Primitives (48ms)" },
      { phase: "Phase 2", name: "NetworkX Graph Router", stat: "Shortest Path (120ms)" },
      { phase: "Phase 3", name: "Delphi/Aptiv Catalog", stat: "Part Number Lookup (35ms)" },
      { phase: "Phase 4", name: "Interactive ES Canvas", stat: "/label-dot Review (Real-time)" },
      { phase: "Phase 5", name: "OpenPyXL 6 Workbooks", stat: "ICWC, EBOM, Crimping (1.2s)" }
    ],
    sampleLog: [
      { time: "14:12:00.040", type: "info", msg: "[PARSER] Parsing AutoCAD schematic PDF (Drawing 842-WH-REV-D)..." },
      { time: "14:12:00.088", type: "info", msg: "[VECTOR] Extracted 4,218 line segments, 48 connector callouts, 12 splice clusters." },
      { time: "14:12:00.208", type: "success", msg: "[NETWORKX] Graph solved with orthogonal snapping. Wire length calculations completed." },
      { time: "14:12:00.243", type: "info", msg: "[CATALOG] Delphi 12015792 & Aptiv 15300027 matched for 16 AWG terminals." },
      { time: "14:12:01.443", type: "success", msg: "[WORKBOOKS] 6 technical Excel workbooks compiled in 1.40s. Turnaround: 4m 38s total." }
    ]
  },
  "local-rag": {
    name: "Enterprise Local-First RAG",
    status: "HEALTHY",
    throughput: "48 Tokens/sec Streaming",
    fps: "N/A",
    latency: {
      ingest: "12.0 ms",
      ipc: "2.4 ms",
      yolo: "18.0 ms",
      ocr: "140.0 ms"
    },
    pipeline: [
      { phase: "Phase 1", name: "Query Ingestion & PII Mask", stat: "Regex + Presidio (12ms)" },
      { phase: "Phase 2", name: "Hybrid Retrieval (RRF)", stat: "Dense nomic + Sparse (18ms)" },
      { phase: "Phase 3", name: "Qdrant Vector Database", stat: "Cosine Similarity (< 10ms)" },
      { phase: "Phase 4", name: "Ollama Qwen3:8B Local", stat: "Zero Cloud Leaks (48 tok/s)" },
      { phase: "Phase 5", name: "Citation Verifier", stat: "Exact BAB / Pasal Check" }
    ],
    sampleLog: [
      { time: "11:05:22.014", type: "info", msg: "[QUERY] 'Berapa hari hak cuti melahirkan menurut UU Ketenagakerjaan?'" },
      { time: "11:05:22.026", type: "info", msg: "[PII] Sanitized prompt. Zero PII detected. Routing to hybrid retriever." },
      { time: "11:05:22.044", type: "success", msg: "[HYBRID-RRF] Top matched document: UU No. 13 Tahun 2003 (Score: 0.942)" },
      { time: "11:05:22.052", type: "success", msg: "[CITATION] Anchored: BAB X Pasal 82 ayat (1) — Hak istirahat 1.5 bulan sebelum & sesudah melahirkan." },
      { time: "11:05:22.192", type: "info", msg: "[OLLAMA] Streaming response from local qwen3:8b via SSE endpoint." }
    ]
  }
};

// --- 3. DOM INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
  renderBentoGrid();
  renderCatalogGrid("all");
  initCategoryFilters();
  initInspectorTabs();
  initSimulationButton();
  initModals();
  initLightbox();
  initTactileCopyButtons();
  initContactForm();
  initMobileMenu();
});

// --- 4. RENDER BENTO GRID (FLAGSHIP EVIDENCE) ---
function renderBentoGrid() {
  const container = document.getElementById("bento-grid");
  if (!container) return;

  const flagships = PRODUCTION_PROJECTS.filter(p => p.isFlagship);

  container.innerHTML = flagships.map(project => {
    let viewportHtml = "";

    if (project.image) {
      viewportHtml = `
        <div class="canvas-viewport" onclick="openLightbox('${project.rawImage}')" title="Click to view full resolution inspection evidence">
          <div class="viewport-topbar">
            <span class="viewport-tag viewport-tag-green">ACTIVE IN PRODUCTION</span>
            <span class="viewport-tag">${project.category === 'cv' ? 'EDGE VISION' : 'CAD AUTOMATION'}</span>
          </div>
          <img src="${project.image}" alt="${project.title}" loading="lazy" />
          <div class="viewport-overlay-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            ${project.metric.split("·")[0].trim()}
          </div>
          <div class="viewport-inspect-hint">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
            <span>Zoom Evidence</span>
          </div>
        </div>
      `;
    } else {
      viewportHtml = `
        <div class="schematic-canvas" onclick="openCaseStudy('${project.id}')" title="Inspect system architecture">
          <div class="schematic-nodes-diagram">
            <div class="schematic-node">3,000+ CCTVs</div>
            <div class="schematic-arrow">→</div>
            <div class="schematic-node">Linux Edge GPU</div>
            <div class="schematic-arrow">→</div>
            <div class="schematic-node">SmartEye API</div>
          </div>
          <div class="schematic-caption">${project.schematic || 'METROPOLITAN DISTRIBUTED VISION'}</div>
        </div>
      `;
    }

    const techChips = project.tags.slice(0, 4).map(t => `<span class="tech-chip">${t}</span>`).join("");

    const badgeHtml = project.private
      ? `<span class="bento-badge-private"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> Enterprise Private</span>`
      : `<span class="bento-badge-oss"><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg> Open Source</span>`;

    return `
      <div class="bento-card ${project.bentoSpan}">
        ${viewportHtml}
        <div class="bento-content">
          <div class="bento-meta-row">
            <span class="bento-client">${project.client.split("·")[0].trim()}</span>
            ${badgeHtml}
          </div>
          <h3 class="bento-title">${project.title}</h3>
          <p class="bento-desc">${project.summary}</p>
          
          <div class="bento-metric-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>${project.metric}</span>
          </div>

          <div class="tech-chips-row">
            ${techChips}
          </div>

          <div class="bento-footer">
            <button class="btn-inspect" onclick="openCaseStudy('${project.id}')">
              <span>Inspect Architecture</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
            <span class="bento-repo-link">${project.repo.split("/")[1] || project.repo}</span>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// --- 5. RENDER ALL SYSTEMS CATALOG (FILTERABLE) ---
function renderCatalogGrid(filterCategory = "all") {
  const container = document.getElementById("catalog-grid");
  if (!container) return;

  const filtered = PRODUCTION_PROJECTS.filter(p => {
    if (filterCategory === "all") return true;
    return p.category === filterCategory;
  });

  container.innerHTML = filtered.map(project => {
    const techChips = project.tags.slice(0, 3).map(t => `<span class="tech-chip">${t}</span>`).join("");
    
    const categoryLabel = project.category === 'cv' 
      ? 'Computer Vision & Edge' 
      : (project.category === 'rag' ? 'Enterprise LLM & RAG' : 'Engineering Automation');

    return `
      <div class="catalog-card" data-category="${project.category}">
        <div class="catalog-card-header">
          <span class="catalog-category-tag">${categoryLabel}</span>
          <span class="bento-badge-private">${project.private ? 'Enterprise' : 'Public OSS'}</span>
        </div>
        <h3 class="catalog-title">${project.title}</h3>
        <p class="catalog-desc">${project.summary}</p>

        <div class="catalog-metric">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>${project.metric}</span>
        </div>

        <div class="tech-chips-row" style="margin-bottom: var(--space-4);">
          ${techChips}
        </div>

        <div class="catalog-footer">
          <button class="btn-inspect" onclick="openCaseStudy('${project.id}')">
            <span>Read Dossier</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
          <span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-tertiary);">${project.client.split("·")[0].trim()}</span>
        </div>
      </div>
    `;
  }).join("");
}

// --- 6. CATEGORY FILTER CONTROLS ---
function initCategoryFilters() {
  const chips = document.querySelectorAll(".filter-chip");
  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      chips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      const category = chip.getAttribute("data-category");
      renderCatalogGrid(category);
    });
  });
}

// --- 7. TELEMETRY INSPECTOR CONTROLS ---
function initInspectorTabs() {
  const tabBtns = document.querySelectorAll(".inspector-tab-btn");
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const profileKey = btn.getAttribute("data-profile");
      loadInspectorProfile(profileKey);
    });
  });

  // Load default profile
  loadInspectorProfile("mining-cv");
}

function loadInspectorProfile(profileKey) {
  const profile = INSPECTOR_PROFILES[profileKey];
  if (!profile) return;

  const titleEl = document.getElementById("inspector-subservice-title");
  const throughputEl = document.getElementById("stat-throughput");
  const latencyIngestEl = document.getElementById("stat-latency-ingest");
  const latencyYoloEl = document.getElementById("stat-latency-yolo");
  const latencyOcrEl = document.getElementById("stat-latency-ocr");
  const stepsContainer = document.getElementById("pipeline-steps-container");
  const logContainer = document.getElementById("telemetry-log-output");

  if (titleEl) titleEl.textContent = `${profile.name} — Execution Breakdown`;
  if (throughputEl) throughputEl.textContent = profile.throughput;
  if (latencyIngestEl) latencyIngestEl.textContent = profile.latency.ingest;
  if (latencyYoloEl) latencyYoloEl.textContent = profile.latency.yolo;
  if (latencyOcrEl) latencyOcrEl.textContent = profile.latency.ocr;

  if (stepsContainer) {
    stepsContainer.innerHTML = profile.pipeline.map((step, idx) => {
      const arrow = idx < profile.pipeline.length - 1 ? `<div class="pipeline-arrow">→</div>` : '';
      return `
        <div class="pipeline-step">
          <div class="pipeline-step-phase">${step.phase}</div>
          <div class="pipeline-step-name">${step.name}</div>
          <div class="pipeline-step-stat">${step.stat}</div>
        </div>
        ${arrow}
      `;
    }).join("");
  }

  if (logContainer) {
    logContainer.innerHTML = profile.sampleLog.map(log => {
      return `<div><span class="log-time">[${log.time}]</span> <span class="log-${log.type}">${log.msg}</span></div>`;
    }).join("");
  }
}

function initSimulationButton() {
  const btn = document.getElementById("btn-run-simulation");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const logContainer = document.getElementById("telemetry-log-output");
    if (!logContainer) return;

    btn.textContent = "Simulating Pipeline...";
    btn.disabled = true;

    const now = new Date().toLocaleTimeString("id-ID", { hour12: false }) + "." + Math.floor(Math.random() * 900 + 100);
    const newEntry = document.createElement("div");
    newEntry.innerHTML = `<span class="log-time">[${now}]</span> <span class="log-success">[LIVE SIMULATION] Frame burst passed verification. All health checks confirmed 0.00% frame loss.</span>`;

    setTimeout(() => {
      logContainer.appendChild(newEntry);
      logContainer.scrollTop = logContainer.scrollHeight;
      btn.textContent = "Re-Simulate Pipeline";
      btn.disabled = false;
      showToast("✓ Live pipeline benchmark completed with 0 errors");
    }, 450);
  });
}

// --- 8. CASE STUDY SLIDE-OVER DRAWER / MODAL ---
function initModals() {
  const backdrop = document.getElementById("case-study-modal");
  const closeBtn = document.getElementById("modal-close-btn");

  if (!backdrop) return;

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
      closeLightbox();
    }
  });
}

function openCaseStudy(projectId) {
  const project = PRODUCTION_PROJECTS.find(p => p.id === projectId);
  if (!project) return;

  const backdrop = document.getElementById("case-study-modal");
  const titleEl = document.getElementById("modal-title");
  const eyebrowEl = document.getElementById("modal-eyebrow");
  const bodyEl = document.getElementById("modal-body-content");

  titleEl.textContent = project.title;
  eyebrowEl.textContent = `${project.client} · Repository: ${project.repo}`;

  const bulletsHtml = project.caseStudy.whatWasDone
    .map(item => `<li style="margin-bottom: 8px;">${item}</li>`)
    .join("");

  const techBadgesHtml = project.caseStudy.techStack
    .map(t => `<span class="tech-chip">${t}</span>`)
    .join(" ");

  let previewImageHtml = "";
  if (project.image) {
    previewImageHtml = `
      <div>
        <div class="modal-section-title">Production Interface & Live Inspection Capture</div>
        <img src="${project.image}" class="modal-img-preview" alt="${project.title}" onclick="openLightbox('${project.rawImage}')" title="Click to zoom full resolution" />
      </div>
    `;
  }

  bodyEl.innerHTML = `
    ${previewImageHtml}

    <div>
      <div class="modal-section-title">Context & Operational Challenge</div>
      <div class="modal-section-content">${project.caseStudy.context}</div>
    </div>

    <div>
      <div class="modal-section-title">Engineering Role & Ownership</div>
      <div class="modal-section-content"><strong>${project.caseStudy.role}</strong></div>
    </div>

    <div>
      <div class="modal-section-title">Key Architectural Decisions & Implementation</div>
      <div class="modal-section-content">
        <ul style="padding-left: 20px;">${bulletsHtml}</ul>
      </div>
    </div>

    <div>
      <div class="modal-section-title">Quantified Production Impact</div>
      <div class="modal-metric-card">${project.caseStudy.outcome}</div>
    </div>

    <div>
      <div class="modal-section-title">Verified Technology Stack</div>
      <div class="tech-chips-row">${techBadgesHtml}</div>
    </div>
  `;

  backdrop.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const backdrop = document.getElementById("case-study-modal");
  if (backdrop) {
    backdrop.classList.remove("open");
    document.body.style.overflow = "";
  }
}

// --- 9. FULLSCREEN IMAGE LIGHTBOX ---
function initLightbox() {
  const lightbox = document.getElementById("image-lightbox");
  const closeBtn = document.getElementById("lightbox-close-btn");

  if (!lightbox) return;

  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

function openLightbox(imgSrc) {
  const lightbox = document.getElementById("image-lightbox");
  const img = document.getElementById("lightbox-img");
  if (!lightbox || !img) return;

  img.src = imgSrc;
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  const lightbox = document.getElementById("image-lightbox");
  if (lightbox) {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }
}

// --- 10. TACTILE COPY INTERACTIONS ---
function initTactileCopyButtons() {
  const copyButtons = document.querySelectorAll(".btn-tactile-copy");
  copyButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const email = "ryasrafikarim123@gmail.com";
      navigator.clipboard.writeText(email).then(() => {
        btn.classList.add("copied");
        const originalText = btn.innerHTML;
        btn.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>Email Copied!</span>
        `;
        showToast("✓ Copied direct email: " + email);

        setTimeout(() => {
          btn.classList.remove("copied");
          btn.innerHTML = originalText;
        }, 2600);
      }).catch(() => {
        showToast("Direct Email: " + email);
      });
    });
  });
}

function showToast(message) {
  let toast = document.getElementById("toast-notification");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-notification";
    toast.className = "toast-msg";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}

// --- 11. CONTACT FORM LOGIC ---
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = form.querySelector("button[type='submit']");
    const originalText = btn.innerHTML;
    btn.textContent = "Routing Message...";
    btn.disabled = true;

    setTimeout(() => {
      const name = document.getElementById("form-name")?.value || "";
      const email = document.getElementById("form-email")?.value || "";
      const msg = document.getElementById("form-msg")?.value || "";
      
      showToast("✓ Opening your default mail application...");
      const mailtoUrl = `mailto:ryasrafikarim123@gmail.com?subject=Engineering Inquiry from ${encodeURIComponent(name)}&body=${encodeURIComponent(msg + "\n\nFrom: " + name + " <" + email + ">")}`;
      window.location.href = mailtoUrl;

      btn.innerHTML = originalText;
      btn.disabled = false;
      form.reset();
    }, 500);
  });
}

// --- 12. MOBILE NAVIGATION ---
function initMobileMenu() {
  const toggleBtn = document.getElementById("mobile-menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener("click", () => {
    const isVisible = navLinks.style.display === "flex";
    if (isVisible) {
      navLinks.style.display = "";
    } else {
      navLinks.style.display = "flex";
      navLinks.style.flexDirection = "column";
      navLinks.style.position = "absolute";
      navLinks.style.top = "64px";
      navLinks.style.left = "0";
      navLinks.style.width = "100%";
      navLinks.style.background = "rgba(9, 9, 11, 0.98)";
      navLinks.style.backdropFilter = "blur(20px)";
      navLinks.style.padding = "24px";
      navLinks.style.borderBottom = "1px solid rgba(255, 255, 255, 0.1)";
      navLinks.style.gap = "16px";
      navLinks.style.zIndex = "99";
    }
  });

  const links = navLinks.querySelectorAll(".nav-link");
  links.forEach(link => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        navLinks.style.display = "";
      }
    });
  });
}
