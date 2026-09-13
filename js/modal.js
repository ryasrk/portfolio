/**
 * Fullscreen Technical Lightbox & Deep Systems Dossier Modal.
 */

import { lockScroll, unlockScroll } from "./motion/scroll-lock.js";

const ARTIFACTS = {
  sentinel: {
    title: "SENTINEL 15-CCTV LPR PIPELINE",
    subtitle: "PT Bali Towerindo Sentra Tbk • 3,000+ Metro Cameras",
    category: "Metro Video Analytics",
    metrics: [
      { label: "Throughput", value: "45 FPS" },
      { label: "P95 Latency", value: "8.2ms" },
      { label: "Accuracy", value: "99.2%" },
      { label: "Scale", value: "3,000+ CCTV" },
    ],
    tech: ["YOLOv8", "TensorRT FP16", "Linux /dev/shm", "FastAPI", "Redis", "HLS"],
    desc: "Production video analytics processing continuous RTSP streams with zero frame-dropping via Linux /dev/shm shared memory buffers and TensorRT FP16 quantization.",
    image: "assets/projects/sentinel_edge_lpr.jpg",
  },
  maritime: {
    title: "26 TUGBOAT FLEET VISION & 360 AI",
    subtitle: "Gerbang Data Indonesia • 26 Commercial Vessels",
    category: "Maritime Edge AI",
    metrics: [
      { label: "Fleet Size", value: "26 Tugboats" },
      { label: "Reliability", value: "99.94%" },
      { label: "Modules", value: "7 Subsystems" },
      { label: "Uptime", value: "24/7 Marine" },
    ],
    tech: ["Jetson Orin Nano", "AdaFace IR-101", "360 Panorama", "Teltonika GPS", "Telegram Bot API"],
    desc: "24/7 autonomous marine bridge surveillance system with 360 panoramic depth stitching, AdaFace IR-101 crew identification, danger zone intrusion warnings, and satellite-linked Teltonika GPS telematics.",
    image: "assets/projects/maritime_fleet_vision.jpg",
  },
  turboquant: {
    title: "TURBOQUANT-X LOCAL LLM & AGENTS",
    subtitle: "Autonomous Local Inference & Tool Execution",
    category: "Enterprise Local LLM",
    metrics: [
      { label: "Token Rate", value: "82 Tok/s" },
      { label: "Privacy", value: "Air-Gapped" },
      { label: "Embeddings", value: "Qdrant Vector" },
      { label: "Reasoning", value: "LangGraph" },
    ],
    tech: ["Ollama", "llama.cpp", "Qdrant Vector", "LangGraph", "Dense+Sparse RRF", "FastAPI"],
    desc: "Air-gapped enterprise tool execution workbench and autonomous agentic workflow orchestrator utilizing Ollama, llama.cpp, Qdrant vector database, and LangGraph multi-step reasoning.",
    image: "assets/projects/turboquant_agent_engine.jpg",
  },
  cad: {
    title: "AUTONOMOUS CAD BOQ & SKELETON",
    subtitle: "Computer Vision & Vector Geometry Extraction",
    category: "Engineering CV Pipeline",
    metrics: [
      { label: "Speedup", value: "14x Manual" },
      { label: "OCR Accuracy", value: "98.4%" },
      { label: "Turnaround", value: "<5 Min" },
      { label: "Formats", value: "DWG / PDF / DXF" },
    ],
    tech: ["OpenCV", "NetworkX Graph", "PyMuPDF", "Custom OCR", "Pandas", "FastAPI"],
    desc: "Automated schematic parsing and vector skeletonization pipeline extracting complex wire-harness lengths, electrical symbols, and Bill of Quantities (BoQ) tables directly from CAD blueprints.",
    image: "assets/projects/cad_boq_extraction.jpg",
  },
  embedded: {
    title: "ELECTRICAL & EMBEDDED FOUNDATIONS",
    subtitle: "Universitas Singaperbangsa Karawang • GPA 3.78/4.00",
    category: "Hardware & Low-Level Systems",
    metrics: [
      { label: "Degree GPA", value: "3.78 / 4.00" },
      { label: "Specialization", value: "Analog & DSP" },
      { label: "Controllers", value: "STM32 / ESP32" },
      { label: "Foundation", value: "Linux Kernel" },
    ],
    tech: ["C / C++", "STM32", "ESP32", "DSP", "Linux Kernel", "Circuit Design"],
    desc: "Foundational electrical engineering degree mastering analog circuitry, digital signal processing, microcontroller firmware, and low-level Linux kernel system architecture.",
    image: "assets/timeline/2020.webp",
  },
  robotics: {
    title: "ROBOTICS & COMPUTER VISION RESEARCH",
    subtitle: "Autonomous Navigation & Deep Neural Networks",
    category: "Autonomous Robotics",
    metrics: [
      { label: "Inference", value: "Real-Time" },
      { label: "Sensor Mode", value: "Fusion" },
      { label: "Architecture", value: "CNN / Kalman" },
      { label: "Framework", value: "ROS / PyTorch" },
    ],
    tech: ["OpenCV", "PyTorch", "ROS", "Kalman Filter", "LiDAR", "CUDA"],
    desc: "Architected real-time robotics vision pipelines, sensor fusion algorithms, and convolutional neural networks for autonomous navigation and dynamic obstacle avoidance.",
    image: "assets/timeline/2022.webp",
  },
  bangkit: {
    title: "BANGKIT ACADEMY — DISTINCTION GRADUATE",
    subtitle: "Google, GoTo, Traveloka • Top 10% Distinction",
    category: "Machine Learning Certification",
    metrics: [
      { label: "Cohort Rank", value: "Top 10%" },
      { label: "Model Acc", value: "95% Val Acc" },
      { label: "Certificate", value: "TensorFlow Dev" },
      { label: "Cloud", value: "GCP Certified" },
    ],
    tech: ["TensorFlow", "Google Cloud GCP", "Keras", "FastAPI", "Docker", "CNN"],
    desc: "Selected among top 10% distinction graduates in Bangkit Academy. Developed Waste Wizard CNN classification model with 95% accuracy and earned Google TensorFlow Developer Certification.",
    image: "assets/timeline/2023.webp",
  },
  mining: {
    title: "MININGVISION HAULAGE TRACKING",
    subtitle: "Heavy Mining Fleet & Telemetry Platform",
    category: "Industrial Edge Vision",
    metrics: [
      { label: "Haulage Tracked", value: "90,722+ Tons" },
      { label: "Brand Classes", value: "41 Models" },
      { label: "Frame Buffer", value: "/dev/shm IPC" },
      { label: "Watchdog", value: "60s Health Check" },
    ],
    tech: ["YOLOv8 ONNX", "No. Lambung OCR", "Ground Radar", "FastAPI", "Linux /dev/shm"],
    desc: "Two-stage detection and OCR extracting dump truck hull numbers on dusty mining haul roads with calibrated ground speed radar and zero-drop memory buffers.",
    image: "assets/images/truck-hull-recognition.png",
  },
};

export const initModal = () => {
  const backdrop = document.querySelector("#modal-backdrop");
  const dialog = document.querySelector("#modal-dialog");
  const closeBtn = document.querySelector("#modal-close");
  if (!backdrop || !dialog) return;

  let previousActiveElement = null;

  const open = (key) => {
    previousActiveElement = document.activeElement;
    const data = ARTIFACTS[key] || ARTIFACTS.sentinel;

    const titleEl = dialog.querySelector("#modal-title");
    const subEl = dialog.querySelector("#modal-subtitle");
    const catEl = dialog.querySelector("#modal-cat");
    const imgEl = dialog.querySelector("#modal-img");
    const descEl = dialog.querySelector("#modal-desc");
    const techEl = dialog.querySelector("#modal-tech");
    const metricsEl = dialog.querySelector("#modal-metrics");

    if (titleEl) titleEl.textContent = data.title;
    if (subEl) subEl.textContent = data.subtitle;
    if (catEl) catEl.textContent = data.category;
    if (imgEl) {
      imgEl.src = data.image;
      imgEl.alt = data.title;
    }
    if (descEl) descEl.textContent = data.desc;

    if (techEl) {
      techEl.innerHTML = data.tech
        .map((t) => `<span class="tag-pill">${t}</span>`)
        .join("");
    }

    if (metricsEl) {
      metricsEl.innerHTML = data.metrics
        .map(
          (m) => `
          <div class="modal-metric-box">
            <div class="modal-metric-val">${m.value}</div>
            <div class="modal-metric-label">${m.label}</div>
          </div>
        `,
        )
        .join("");
    }

    backdrop.classList.add("is-open");
    lockScroll();
    closeBtn?.focus();
  };

  const close = () => {
    if (!backdrop.classList.contains("is-open")) return;
    backdrop.classList.remove("is-open");
    unlockScroll();
    // Focus goes back without yanking the page: the element is already in
    // view, and preventScroll stops the browser re-scrolling to it.
    previousActiveElement?.focus?.({ preventScroll: true });
  };

  closeBtn?.addEventListener("click", close);
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) close();
  });

  // Forward wheel events on backdrop to scroll dialog
  backdrop.addEventListener(
    "wheel",
    (e) => {
      if (e.target === backdrop && dialog.scrollHeight > dialog.clientHeight) {
        dialog.scrollTop += e.deltaY;
      }
    },
    { passive: true },
  );

  // Focus trap inside modal dialog
  dialog.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      const focusables = dialog.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        last.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && backdrop.classList.contains("is-open")) {
      close();
    }
  });

  // Global trigger
  window.openDossier = open;

  // Bind keyboard navigation to clickable cards
  document.querySelectorAll("[data-dossier]").forEach((card) => {
    const handler = () => open(card.dataset.dossier);
    card.addEventListener("click", handler);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handler();
      }
    });
  });
};
