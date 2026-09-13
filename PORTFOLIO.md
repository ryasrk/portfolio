# Ryas Rafi Karim — AI Engineer Portfolio
**Title:** AI Engineer | Computer Vision, Edge AI, LLM & Production AI Systems  
**Location:** Jakarta, Indonesia  
**Email:** [ryasrafikarim123@gmail.com](mailto:ryasrafikarim123@gmail.com) | **Phone / WhatsApp:** [+62 813 8040 3298](https://wa.me/6281380403298)  
**LinkedIn:** [linkedin.com/in/ryasrafikarim](https://linkedin.com/in/ryasrafikarim) | **GitHub:** [github.com/ryasrk](https://github.com/ryasrk)  

---

## Executive Summary

AI Engineer and Electrical Engineering graduate (GPA 3.78/4.00, Universitas Singaperbangsa Karawang) with 1.5+ years of dedicated production experience designing, training, optimizing, and deploying mission-critical Computer Vision, Edge AI, and Enterprise Generative AI / RAG systems.

Distinction Graduate of Bangkit Academy (Top 10%), Google Certified TensorFlow Developer, and Stanford University Machine Learning Specialization credential holder. Proven track record deploying 24/7 video analytics pipelines across Ubuntu Server, NVIDIA Jetson Orin Nano, and GPU cloud servers, monitoring 26 marine vessels, 3,000+ metropolitan CCTV cameras, and heavy industrial mining fleets.

---

## Verified Professional Experience

### 1. AI Engineer / Project Manager — Gerbang Data Indonesia (GDI)
*Aug 2025 – Present | Jakarta, Indonesia*
- **Fleet Surveillance Across 26 Marine Vessels**: Led cross-functional engineering teams in defining technical specifications, training pipelines, and real-time deployment strategies across 26 commercial tugboats.
- **Telematics & API Integration**: Integrated Teltonika GPS telematics API, operational dashboards, RESTful APIs, and automated Telegram alert bots to safeguard bridge crew operations.
- **7-Module Mining SaaS Architecture**: Architected the multi-tenant computer vision platform covering Face Recognition (AdaFace IR-101), PPE Detection, Danger Zone Intrusion, Vehicle Hull Number (No. Lambung OCR), Plate Recognition (LPR), Fire & Smoke Detection, and Vehicle Classification.
- **Pipeline Optimization**: Optimized 24/7 streaming video pipelines with ONNX Runtime, TensorRT quantization, HLS streaming, and zero-drop Linux Ramdisk (`/dev/shm`) frame buffering across Ubuntu Server, Jetson Orin Nano, and GPU clouds.
- **Nexus Annotator Platform (`AnnotatorAPP`)**: Built a full-stack multi-user Ultralytics YOLO annotation and training web platform on Ubuntu Server, streamlining internal dataset labeling to model training.
- **Enterprise LLM & Agentic Workflows**: Implemented local-first LLM workflows with Ollama, llama.cpp, LangChain, LangGraph, Qdrant vector database, OpenAI-compatible local APIs, and N8N workflow automation (`turboquant-x`).

### 2. AI Engineer — PT Bali Towerindo Sentra Tbk
*Jan 2025 – Aug 2025 | Jakarta, Indonesia*
- **Jakarta SmartEye LPR Across 3,000+ Cameras**: Maintained, tuned, and optimized License Plate Recognition (LPR) models processing vehicular video feeds from over 3,000+ operational CCTV cameras throughout Jakarta.
- **Waste & Crowd Analytics**: Led multiple computer vision initiatives including polygon-based coverage percentage calculation for waste segmentation (improving maintenance tracking accuracy by 98%), people counting, and crowd detection for Makan Bergizi Gratis (MBG) programs.
- **Linux Production Management**: Managed three distinct Linux server tiers: low-latency inference services, continuous deployment pipelines, and observability/system monitoring.

### 3. Machine Learning Cohort (Distinction Graduate - Top 10%) — Bangkit Academy 2023
*Aug 2023 – Jan 2024 | Led by Google, Tokopedia, Gojek, Traveloka*
- Completed an intensive 6-month curriculum covering TensorFlow, Keras, deep convolutional networks, data pipelines, and cloud model serving.
- Developed **Waste Wizard**, a CNN-based municipal waste classification model achieving **95% accuracy**, collaborating with cloud and mobile teams for Google Cloud deployment.

---

## Education, Honors & Certifications

### Education
- **Universitas Singaperbangsa Karawang** (Sep 2020 – Jul 2024)
  - Bachelor of Electrical Engineering
  - **GPA: 3.78 / 4.00**
  - Final Project Award: **Top Project Award – SELMA** (GPT-based Smart English Learning Machine Assistant, Favorite Final Project in Electrical Engineering 2024).
  - Volunteer, Equipment Division for PROTEK & HIMTEL CUP 2022.

### Professional Certifications
1. **TensorFlow Developer Certificate** — Google
2. **Machine Learning Specialization** — Stanford University & DeepLearning.AI (Coursera)
3. **TensorFlow: Data and Deployment Specialization** — DeepLearning.AI & Coursera
4. **DHSP - Video Surveillance System** — Dahua Technology Co. LTD
5. **SEPT TOEFL English Proficiency Score:** 522 | Native Bahasa Indonesia

---

## Production Systems & Featured Case Studies

### 1. MiningVision (SENTINEL-CV) — Industrial Mining Haulage & Telemetry Platform
- **Repository**: `GDI-Analytics-AI/centralized-ai` (Private Enterprise)
- **Role**: Lead AI & Systems Architect
- **Evidence Screenshot**: `Truck Hull Recognition.png` / `truck-hull-recognition.png`
- **Impact**: **90,722+ tons** haulage tracked, zero frame drops across active RTSP feeds.
- **Key Engineering**:
  - Two-stage detection + OCR pipeline extracting heavy mining dump truck hull numbers ("No. Lambung", e.g. `LD0531`) on dusty haul roads.
  - Directional vehicle speed radar calculated from calibrated ground reference points.
  - License Plate Recognition (LPR) coupled with a 41-class vehicle brand classifier (YOLOv8 ONNX).
  - Linux Ramdisk (`/dev/shm`) shared memory architecture eliminating disk I/O bottlenecks during simultaneous multi-stream video ingestion.
  - Watchdog daemon polling config APIs every 60s with automatic process restarts.

### 2. Versigent Ops & AutoCAD OCR — Automated Wire-Harness Engineering Pipeline
- **Repositories**: `GDI-Analytics-AI/versigent-ops`, `autocad-ocr` (Private Enterprise)
- **Role**: Lead AI & Algorithm Engineer
- **Evidence Screenshot**: `CAD drawing conversion.png` / `cad-drawing-conversion.png`
- **Impact**: Turnaround time cut from **3 days to under 5 minutes** (-99.2%); 100% automated Excel manufacturing workbook generation.
- **Key Engineering**:
  - Vector geometry line and table extraction parsing dense single-page PDF drawings directly in milliseconds.
  - Raster skeletonization and graph theory routing (NetworkX) calculating wire segment lengths with orthogonal projection snapping.
  - Delphi and Aptiv manufacturer catalog cross-referencing for terminals, seals, and plugs.
  - Automated compilation of 6 technical Excel workbooks: ICWC, EBOM, Crimping List, PCE, SoC, and Wire Cut List.
  - Native ES Modules interactive review canvas (`/label-dot`) with local-first offline outbox queuing, disk caching, and 60-second cloud sync.

### 3. Tugboats Analytics — Fleet Safety Monitoring Across 26 Marine Vessels
- **Repository**: `GDI-Analytics-AI/Tugboats-Analytics` (Private Enterprise)
- **Role**: AI Engineer & Project Manager
- **Evidence Screenshot**: `Person in Tugboat detection.jpeg` / `person-tugboat-detection.jpeg`
- **Impact**: **98% mAP@0.5:0.95** on internal validation data across 26 tugboats (e.g., TB. MICHAEL, TB. ELWOOD).
- **Key Engineering**:
  - YOLO11 quantized to NVIDIA TensorRT (`convert_to_tensorrt.py`) for low-power edge computer execution.
  - Proprietary **Burst Voting algorithm** evaluating consecutive frame bursts to eliminate false positive alerts caused by harsh ocean glare, sea spray, and vessel vibration.
  - Teltonika GPS telematics API integration cross-referencing vessel navigation with wheelhouse crew staffing.
  - Automated Telegram alert bot dispatching annotated photographic evidence when bridge presence drops below safety thresholds (< 2 persons).

### 4. Jakarta SmartEye LPR & Metropolitan Video Analytics
- **Organization**: PT Bali Towerindo Sentra Tbk
- **Role**: AI Engineer
- **Impact**: **3,000+ CCTV feeds** continuously monitored across Jakarta; **98% accuracy** in urban maintenance analytics.
- **Key Engineering**:
  - Maintained and tuned metropolitan LPR pipelines across 3,000+ CCTV towers.
  - Deployed polygon-based waste segmentation calculating coverage percentages.
  - People counting and crowd density estimation for Makan Bergizi Gratis (MBG) infrastructure.

### 5. Nexus Annotator — Multi-User YOLO Annotation & Training Platform
- **Repository**: [github.com/ryasrk/AnnotatorAPP](https://github.com/ryasrk/AnnotatorAPP) (Public Open Source)
- **Role**: Sole Creator & Full-Stack AI Engineer
- **Impact**: End-to-end dataset creation and one-click training workflow on Ubuntu Server.
- **Key Engineering**:
  - Interactive HTML5 Canvas 2D supporting bounding box labeling and multi-vertex polygon segmentation.
  - AI Auto-Annotation powered by Ultralytics YOLO with configurable confidence/IoU thresholds and class filters.
  - Real-time multi-user synchronization via Flask-SocketIO.
  - Direct training execution and monitoring from the web interface.

### 6. ryasai — Multi-Tenant Enterprise AI Assistant SaaS
- **Repository**: [github.com/ryasrk/ryasai-chatbot](https://github.com/ryasrk/ryasai-chatbot) (Public Open Source)
- **Role**: Architect & Lead Developer
- **Impact**: Production-ready enterprise assistant routing SQL queries, document RAG, and REST APIs.
- **Key Engineering**:
  - Multi-tenant tenant isolation with strict organizational data partitioning.
  - Intelligent query routing between structured SQL databases and unstructured documents.
  - Security guardrails preventing prompt injection and data exfiltration.

### 7. Medvance AI Analytics — Healthcare & BPJS Claim Intelligence
- **Repository**: `GDI-Analytics-AI/medvance` (Private Enterprise)
- **Role**: Backend AI & RAG Architect
- **Impact**: **80%+ routine claim compliance audits automated**.
- **Key Engineering**:
  - Hospital claim PDF/JSON parsing extracting billing breakdowns and diagnoses.
  - Deterministic medical rules engine cross-checking ICD-10 and ICD-9CM codes.
  - Dual-mode conversational assistant (ICD lookup mode + regulatory RAG with strict policy citations).

### 8. Enterprise HRM Chatbot — Local-First Hybrid RAG Assistant
- **Repository**: `GDI-Analytics-AI/HRM-Chatbot` (Private Enterprise)
- **Role**: LLM & RAG Systems Engineer
- **Impact**: **100% On-Premises (Zero Data Leaks)**; sub-second hybrid retrieval.
- **Key Engineering**:
  - Local model runtime via Ollama (`qwen3:8b`) with LiteLLM gateway and Qdrant vector database.
  - Hybrid retrieval combining dense semantic vectors (`nomic-embed-text`) with sparse lexical matching via Reciprocal Rank Fusion (RRF).
  - Exact citation anchoring to chapters (`BAB`) and articles (`Pasal`) of Indonesian Labor Law (UU Ketenagakerjaan).
  - Staffora HRIS API integration with automated PII redaction and SSE streaming.

### 9. AI Customer Service SaaS (AI-CS)
- **Repository**: `GDI-Analytics-AI/AI-CS` (Private Enterprise)
- **Role**: Full Stack AI Engineer
- **Impact**: < 2s response latency on WhatsApp and Telegram.
- **Key Engineering**:
  - Multi-channel gateway connecting WhatsApp (Baileys socket engine) and Telegram Bot API.
  - PostgreSQL + pgvector knowledge base retrieval.
  - DeepSeek Cloud API (`deepseek-v4-flash`) integration with localized personas.
  - Full-stack web dashboard built in React 19 + Vite + Tailwind CSS 4 + shadcn/ui.

### 10. dsh-awesome-skills — Semantic Vector Search over 6,097 Agent Skills
- **Repository**: [github.com/ryasrk/dsh-awesome-skills](https://github.com/ryasrk/dsh-awesome-skills) (Public Open Source)
- **Role**: Author & Maintainer
- **Impact**: Sub-second semantic skill lookup across 6,097 playbooks for autonomous agents.
- **Key Engineering**:
  - Indexed 6,097 curated agent playbooks (skills.sh top 100 + a5c-ai/babysitter).
  - Implemented vector similarity search CLI and API for DeepSeek Harness.
  - Prevents prompt context window exhaustion while providing instant agent tool discovery.

### 11. Chat Room X — Cloud AI Multi-Agent Gateway Room
- **Repository**: [github.com/ryasrk/chat-room-x](https://github.com/ryasrk/chat-room-x) (Public Open Source)
- **Role**: Full-Stack AI Developer
- **Key Engineering**: High-throughput Bun inference manager (:18247) and Vite React dashboard (:7391) coordinating multi-agent cloud LLM conversations.

### 12. DeepChroma ChordRecognition — Audio AI & Music Information Retrieval
- **Repository**: [github.com/ryasrk/ChordRecognition](https://github.com/ryasrk/ChordRecognition) (Public Open Source)
- **Role**: Audio AI Developer
- **Key Engineering**: Deep convolutional chromagram processors (`madmom`) for real-time chord transcription and synchronized HTML5 audio playback.

### 13. Precision Agriculture Oil Palm Vision Suite
- **Repository**: `GDI-Analytics-AI/oil-palm` (Private Enterprise)
- **Role**: Computer Vision Engineer
- **Key Engineering**: 3 custom YOLO models for drone orthomosaic tree counting, ground fresh fruit bunch (FFB) detection, and ripeness grading via Streamlit.

### 14. Waste Wizard — CNN Waste Classification (Bangkit Capstone)
- **Repository**: [github.com/ryasrk/ML-CapstoneWasteWizard](https://github.com/ryasrk/ML-CapstoneWasteWizard) (Public Open Source)
- **Role**: Lead Machine Learning Engineer
- **Impact**: 95% validation accuracy; Distinction Graduate in Top 10% of Bangkit Academy.

---

## Technical Competencies Matrix

```
+---------------------------------------------------------------------------------------+
|                              RYAS RAFI KARIM — AI STACK                               |
+------------------------------------+--------------------------------------------------+
| COMPUTER VISION & EDGE AI          | GENERATIVE AI & RAG SYSTEMS                      |
| - YOLOv8, YOLO11, Ultralytics      | - Ollama, llama.cpp, Qwen3:8B                    |
| - NVIDIA TensorRT Quantization     | - LiteLLM Gateway, LangChain, LangGraph          |
| - ONNX Runtime (CUDA / Jetson)     | - Qdrant Vector DB, pgvector, FAISS              |
| - OpenCV, PaddleOCR, PyMuPDF       | - Dense + Sparse Hybrid Search (RRF)             |
| - Multi-RTSP Streaming, HLS Video  | - PII Redaction, Citations (BAB/Pasal)           |
| - Linux Ramdisk (/dev/shm) Buffering| - DeepSeek & OpenAI-compatible Cloud APIs       |
| - AdaFace Facial Embeddings        | - LLM-as-a-Judge Quality Benchmarks              |
+------------------------------------+--------------------------------------------------+
| BACKEND & SYSTEMS INFRASTRUCTURE   | FRONTEND & DATA DASHBOARDS                       |
| - Python 3.11/3.12 (FastAPI, Flask)| - React 19, Vite, TypeScript                     |
| - Linux Ubuntu Server, systemd     | - Tailwind CSS 4, shadcn/ui                      |
| - Docker, CI/CD, GitHub Actions    | - Native ES Modules 2D Canvas API                |
| - Teltonika IoT Telematics API     | - Streamlit, Jinja2 Templates                    |
| - NetworkX Graph Routing Solvers   | - Socket.IO Real-Time Collaboration              |
| - PostgreSQL, SQLite, OpenPyXL     | - PyDub, madmom Audio MIR Signal Processing      |
+------------------------------------+--------------------------------------------------+
```

---

## Direct Contact Information
- **Full Name**: Ryas Rafi Karim
- **Email**: [ryasrafikarim123@gmail.com](mailto:ryasrafikarim123@gmail.com)
- **Phone / WhatsApp**: [+62 813 8040 3298](https://wa.me/6281380403298)
- **LinkedIn**: [linkedin.com/in/ryasrafikarim](https://linkedin.com/in/ryasrafikarim)
- **GitHub**: [github.com/ryasrk](https://github.com/ryasrk)
- **Location**: Jakarta, Indonesia (WIB, UTC+7)
- **ATS Resume Download**: [Ryas_Rafi_Karim_AI_Engineer_ATS.pdf](Ryas_Rafi_Karim_AI_Engineer_ATS.pdf)
