# Ryas Rafi Karim — AI Engineer Portfolio

A modern, high-performance portfolio website showcasing production-grade Artificial Intelligence, Computer Vision, Edge AI, and Enterprise LLM/RAG systems engineered by **Ryas Rafi Karim**.

---

## 🌟 Portfolio Overview

This portfolio integrates verified production achievements from enterprise deployments at **Gerbang Data Indonesia (GDI)**, **PT Bali Towerindo Sentra Tbk**, **Bangkit Academy (Google, Tokopedia, Gojek, Traveloka)**, and Ryas's active open-source repositories:

1. **Tugboat Analytics Platform** — 24/7 bridge crew safety monitoring across **26 marine vessels** with YOLO11, TensorRT quantization, and Teltonika IoT telematics (`GDI-Analytics-AI/Tugboats-Analytics`).
2. **MiningVision (SENTINEL-CV)** — Multi-RTSP Industrial Mining Haulage & Safety Analytics tracking **90,722+ tons** (`GDI-Analytics-AI/centralized-ai`).
   - Image evidence: `Truck Hull Recognition.png` / `truck-hull-recognition.png`
3. **Versigent Ops & AutoCAD OCR** — Automated CAD Wire-Harness Vector Geometry & Routing Pipeline reducing turnaround time from **3 days to < 5 minutes** (`GDI-Analytics-AI/versigent-ops`).
   - Image evidence: `CAD drawing conversion.png` / `cad-drawing-conversion.png`
4. **Jakarta SmartEye LPR & MBG Analytics** — License Plate Recognition across **3,000+ metropolitan CCTV feeds** and polygon waste segmentation with 98% accuracy (PT Bali Towerindo Sentra Tbk).
5. **Nexus Annotator** — Multi-user YOLO annotation and training platform with polygon vertex editing and AI auto-annotation ([github.com/ryasrk/AnnotatorAPP](https://github.com/ryasrk/AnnotatorAPP)).
6. **ryasai Enterprise Assistant** — Multi-tenant SaaS assistant routing SQL queries, document RAG, and REST API calls with strict security guardrails ([github.com/ryasrk/ryasai-chatbot](https://github.com/ryasrk/ryasai-chatbot)).
7. **Medvance AI Analytics** — Healthcare & BPJS Medical Claim Verification with ICD-10/ICD-9CM deterministic rules (`GDI-Analytics-AI/medvance`).
8. **Enterprise HRM Chatbot** — 100% On-Premise Local-First Hybrid RAG Assistant with dense+sparse RRF and BAB/Pasal legal citations (`GDI-Analytics-AI/HRM-Chatbot`).
9. **AI Customer Service SaaS (AI-CS)** — Multi-Channel WhatsApp (Baileys) & Telegram Conversational Platform (`GDI-Analytics-AI/AI-CS`).
10. **Chat Room X** — Cloud AI Multi-Agent Gateway Room with Bun inference manager ([github.com/ryasrk/chat-room-x](https://github.com/ryasrk/chat-room-x)).
11. **dsh-awesome-skills** — Vector-indexed semantic search bundle over 6,097 agent skills for DeepSeek Harness ([github.com/ryasrk/dsh-awesome-skills](https://github.com/ryasrk/dsh-awesome-skills)).
12. **DeepChroma ChordRecognition** — Deep learning music information retrieval (MIR) using convolutional chromagram processors ([github.com/ryasrk/ChordRecognition](https://github.com/ryasrk/ChordRecognition)).
13. **Precision Agriculture Oil Palm Vision** — Drone & Ground YOLO Models for Tree Counting & Harvest Grading (`GDI-Analytics-AI/oil-palm`).
14. **Waste Wizard CNN** — Distinction Capstone Project (Top 10%) at Bangkit Academy 2023 with 95% validation accuracy ([github.com/ryasrk/ML-CapstoneWasteWizard](https://github.com/ryasrk/ML-CapstoneWasteWizard)).

---

## 📁 Directory Structure

```text
portfolio/
├── index.html                           # Main portfolio web application
├── styles.css                           # Modern cyber dark styling, glassmorphism & responsive layout
├── app.js                               # Interactive engine: filters, case study modals, terminal & lightbox
├── PORTFOLIO.md                         # Comprehensive textual case-study portfolio documentation
├── README.md                            # Project documentation and quick start guide
├── Ryas_Rafi_Karim_AI_Engineer_ATS.pdf  # Official ATS-friendly Resume (PDF)
├── cv.pdf                               # Symlink to ATS Resume
├── project-private.txt                  # List of private GitHub enterprise repositories
├── CAD drawing conversion.png           # Original screenshot: AutoCAD harness vector extraction
├── cad-drawing-conversion.png           # Web-friendly symlink
├── Person in Tugboat detection.jpeg     # Original screenshot: Maritime bridge crew detection
├── person-tugboat-detection.jpeg        # Web-friendly symlink
├── Truck Hull Recognition.png           # Original screenshot: MiningVision truck detection & OCR
└── truck-hull-recognition.png           # Web-friendly symlink
```

---

## 🚀 How to Run Locally

You can preview the portfolio using any local web server:

### Option 1: Python Built-In HTTP Server (Recommended)
```bash
cd /home/ryasr/project/portfolio
python3 -m http.server 8080
```
Open your browser at:
```text
http://localhost:8080
```

### Option 2: Node.js `npx serve`
```bash
cd /home/ryasr/project/portfolio
npx serve .
```

---

## 💻 Interactive Features

- **Direct ATS Resume Download**: One-click download button in navigation bar and hero header linking directly to `Ryas_Rafi_Karim_AI_Engineer_ATS.pdf`.
- **Career Timeline & Experience**: Full work history covering Gerbang Data Indonesia, PT Bali Towerindo Sentra Tbk, and Bangkit Academy (Google/GoTo/Traveloka).
- **Verified Credentials**: Google TensorFlow Developer Certificate, Stanford Machine Learning Specialization, and Dahua DHSP Video Surveillance certification.
- **Evidence-Based Case Study Modals**: Structured via the context-role-action-outcome paradigm with full engineering breakdowns and technology badges.
- **Interactive Live Telemetry Terminal**: Emulates real-time system diagnostics with commands like `status`, `experience`, `education`, `certifications`, `cv`, `models`, `metrics`, `run cctv`, `run tugboat`, and `query bpjs`.
- **High-Resolution Image Lightbox**: Zoom into actual operational screenshots of deployed computer vision systems.
- **Instant Contact Clipboard**: One-click copy for `ryasrafikarim123@gmail.com` and direct WhatsApp button for `+62 813 8040 3298`.

---

## 👤 Contact
- **Engineer**: Ryas Rafi Karim
- **Email**: [ryasrafikarim123@gmail.com](mailto:ryasrafikarim123@gmail.com)
- **WhatsApp**: [+62 813 8040 3298](https://wa.me/6281380403298)
- **LinkedIn**: [https://linkedin.com/in/ryasrafikarim](https://linkedin.com/in/ryasrafikarim)
- **GitHub**: [https://github.com/ryasrk](https://github.com/ryasrk)

---

## 🔐 Content Admin (/admin) — Password Protected

Kelola konten situs tanpa menyentuh kode: **`http://127.0.0.1:8080/admin.html`**

### Menjalankan (satu command — API pasti online)
```bash
./start-portfolio.sh             # situs + admin API, health-checked
./start-portfolio.sh 9000        # custom port
```
Launcher otomatis mematikan instance lama di port yang sama, men-start server,
dan menunggu `/api/health` OK sebelum melapor sukses.

### Password
| Kredensial | Nilai | Fungsi |
|---|---|---|
| Login admin | `Ryas4321` | masuk ke dashboard /admin.html |
| API token | `Ryas4312` | header `X-Admin-Token` / `Bearer` untuk /api/* |

Keduanya saling diterima (login dengan salah satu valid, token keduanya valid).
Seluruh endpoint `/api/*` (kecuali `/api/health`) menuntut token; situs publik
tetap terbuka untuk pengunjung.

### Deploy di Vercel (tanpa run apa pun)

API berjalan sebagai **Vercel Serverless Functions** (`api/index.py`) — ikut
ter-deploy bersama repo, tidak perlu server proses terpisah:

1. Push repo ini ke GitHub (sudah).
2. Di Vercel: **Add New → Project → import `ryasrk/portfolio`**, framework =
   **Other**, tanpa build command.
3. Set **Environment Variable** (Project → Settings → Environment Variables):
   - `GITHUB_TOKEN` = GitHub token dengan scope **repo** (buat di
     github.com → Settings → Developer settings → Personal access tokens).
   - opsional: `GITHUB_REPO` (default `ryasrk/portfolio`), `GITHUB_BRANCH`
     (default `main`).
4. Deploy. Admin: `https://<domain>.vercel.app/admin.html`.

**Cara kerja di Vercel:** tombol *Save* menulis `content.json` dan
**/api/upload-image** meng-commit gambar (maks 4 MB, jpg/png/webp/avif) ke
repo via GitHub Contents API → Vercel mendeteksi push dan **redeploy otomatis
±1 menit**. Satu jalur upload untuk semua gambar (timeline, sertifikat,
poster video). File video (mp4/webm) di-commit manual ke `assets/videos/`
karena melebihi limit body 4 MB. Jika `GITHUB_TOKEN` belum di-set, API tetap
online (login & edit berfungsi) dan menampilkan pesan yang jelas saat save.

### Yang bisa dikelola
- **Career Timeline** — edit tahun/organisasi/judul/deskripsi/tag, **sort ▲▼**, tambah & hapus deployment, **upload/replace gambar** (otomatis tersimpan ke `assets/timeline/`).
- **Certificates** — tambah/edit/sort/hapus kartu, upload `cert-N.jpg` (grid 3 kolom otomatis menyesuaikan jumlah).
- **Videos** — tambah stream baru (upload mp4/webm + poster), edit judul/path, sort tab.
- **Raw JSON** — edit langsung `assets/data/content.json` bila diperlukan.

### Cara kerja
- Konten dinamis bersumber dari **`assets/data/content.json`** (di-render `js/content-store.js`).
- Bila JSON tidak tersedia (mis. deploy statis tanpa API), situs **tetap tampil** memakai HTML statis bawaan.
- API hanya menerima koneksi lokal (`127.0.0.1`), memvalidasi JSON & ekstensi file, dan menolak path traversal.
