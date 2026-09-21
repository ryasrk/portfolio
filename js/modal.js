/**
 * Fullscreen Technical Lightbox & Deep Systems Dossier Modal.
 */

import { lockScroll, unlockScroll } from "./motion/scroll-lock.js";

const ARTIFACTS = {
  bangkit: {
    title: "BANGKIT ACADEMY — DISTINCTION GRADUATE",
    subtitle: "Google • GoTo • Traveloka • Top 10% Distinction",
    category: "Machine Learning Certification",
    metrics: [
      { label: "Cohort Rank", value: "Top 10%" },
      { label: "Model Acc", value: "95% Val Acc" },
      { label: "Certificate", value: "TensorFlow Dev" },
      { label: "Cloud", value: "GCP Certified" },
    ],
    tech: ["TensorFlow", "Keras CNN", "Google Cloud GCP", "FastAPI", "Docker", "Mobile Classification"],
    desc: "Machine Learning cohort under Google, Tokopedia, Gojek & Traveloka. Built Waste Wizard, a CNN municipal waste-classification mobile app reaching 95% validation accuracy with cloud deployment, and earned the Google TensorFlow Developer Certificate in a top-10% graduating cohort.",
    image: "assets/timeline/bangkit-academy.jpg",
  },
  sentinel: {
    title: "JAKARTA SMARTEYE — 3,000+ CAMERAS",
    subtitle: "PT Bali Towerindo Sentra Tbk • 3,000+ Metro Cameras",
    category: "Metro Video Analytics",
    metrics: [
      { label: "Throughput", value: "45 FPS" },
      { label: "P95 Latency", value: "8.2ms" },
      { label: "Accuracy", value: "99.2%" },
      { label: "Scale", value: "3,000+ CCTV" },
    ],
    tech: ["YOLOv8 LPR", "TensorRT FP16", "Linux /dev/shm", "FastAPI", "Redis", "HLS"],
    desc: "Maintained and tuned License Plate Recognition models across 3,000+ operational Jakarta CCTV feeds at 99.2% accuracy, alongside waste-segmentation and crowd analytics for the MBG program — all on three high-availability Linux production tiers.",
    image: "assets/timeline/jakarta-smarteye.jpg",
  },
  maritime: {
    title: "FLEET VISION ACROSS 26 MARINE VESSELS",
    subtitle: "Baramulti Group • 26 Commercial Vessels",
    category: "Maritime Edge AI",
    metrics: [
      { label: "Fleet Size", value: "26 Tugboats" },
      { label: "Reliability", value: "99.94%" },
      { label: "Modules", value: "7 Subsystems" },
      { label: "Uptime", value: "24/7 Marine" },
    ],
    tech: ["Jetson Orin Nano", "AdaFace IR-101", "360° Panorama", "Teltonika GPS", "Telegram Bot API"],
    desc: "AI Engineer & Project Lead deploying bridge-crew surveillance across 26 commercial tugboats: 360° panorama vision, AdaFace IR-101 crew identification, danger-zone intrusion alerts, and Teltonika satellite GPS telematics with automated Telegram dispatch.",
    image: "assets/timeline/fleet-vision.jpg",
  },
  cad: {
    title: "DRAWING CONVERTER — WIRE-HARNESS VECTORS",
    subtitle: "Versigent • PT Aptiv Components Indonesia",
    category: "Engineering CV Pipeline",
    metrics: [
      { label: "Speedup", value: "14x Manual" },
      { label: "OCR Accuracy", value: "98.4%" },
      { label: "Turnaround", value: "<5 Min" },
      { label: "Formats", value: "DWG / PDF / DXF" },
    ],
    tech: ["OpenCV", "NetworkX Graph", "PyMuPDF", "Custom OCR", "Delphi/Aptiv Catalog", "FastAPI"],
    desc: "Automated CAD wire-harness drawing converter: schematic parsing, vector skeletonization, and Delphi/Aptiv catalog cross-referencing extracting terminals, seals, and BoQ tables — cutting engineering turnaround from 3 days to under 5 minutes.",
    image: "assets/timeline/drawing-converter.jpg",
  },
  mining: {
    title: "SENTINEL AI — HULL NUMBER RECOGNITION",
    subtitle: "PT Asmin Bara Bronang • Mining Haul Road OCR",
    category: "Industrial Edge Vision",
    metrics: [
      { label: "Haulage Tracked", value: "90,722+ Tons" },
      { label: "Hull Classes", value: "41 Models" },
      { label: "Frame Buffer", value: "/dev/shm IPC" },
      { label: "Watchdog", value: "60s Health Check" },
    ],
    tech: ["YOLOv8 ONNX", "No. Lambung OCR", "Ground Radar", "FastAPI", "Linux /dev/shm"],
    desc: "Two-stage detection and OCR reading vessel hull numbers (No. Lambung) on dusty mining haul roads — 90,722+ tons of haulage tracked across 41 hull classes with calibrated ground-speed radar and zero-drop /dev/shm frame buffering.",
    image: "assets/timeline/sentinel-hull.jpg",
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
