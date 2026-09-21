/**
 * Block 4: Production Video Console & Pipeline Deployment Strip.
 *
 * Implements crawling dashed connectors, live pulse ring, bracket spread,
 * video matrix stream switcher, and letter reveals for the pipeline cards.
 */

import { onInView, splitReveal } from "../motion/text-reveal.js";
import { Spring, SPRING } from "../motion/spring.js";
import { subscribe, unsubscribe } from "../motion/ticker.js";

const escAttr = (s) =>
  String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

/** "SENTINEL 15-CCTV MULTI-STREAM ANALYTICS" -> "Sentinel CCTV" style label */
const shortTabLabel = (title) => {
  const words = String(title || "").split(/[\s—-]+/).filter(Boolean);
  return words.slice(0, 2).join(" ") || "Stream";
};

export const initFieldBlock = (container, dynamicStreams = null) => {
  if (!container) return () => {};

  const videoElement = container.querySelector("#field-video-player");
  const tabButtons = [...container.querySelectorAll("[data-stream-tab]")];
  const scrubberFill = container.querySelector("#field-scrubber-fill");
  const timecodeDisplay = container.querySelector("#field-timecode");

  // Video Matrix Stream Switcher — static defaults, overridden by
  // assets/data/content.json when the /admin content store provides streams.
  const staticStreams = [
    {
      id: "sentinel",
      src: "assets/videos/sentinel-15-cctv.mp4",
      poster: "assets/images/poster-sentinel.jpg",
      title: "SENTINEL 15-CCTV MULTI-STREAM ANALYTICS",
      aspectRatio: "1920 / 1080",
    },
    {
      id: "maritime",
      src: "assets/videos/360-analytics-depth.mp4",
      poster: "assets/images/poster-360-analytics.jpg",
      title: "360 MARITIME PANORAMA & DEPTH METROLOGY",
      aspectRatio: "1916 / 874",
    },
    {
      id: "turboquant",
      src: "assets/videos/turboquant-ai-agent.mp4",
      poster: "assets/images/poster-turboquant.jpg",
      title: "TURBOQUANT LOCAL LLM & TOOL EXECUTION AGENT",
      aspectRatio: "1904 / 862",
    },
  ];

  const streams =
    dynamicStreams && dynamicStreams.length ? dynamicStreams : staticStreams;

  // Sync tab buttons with the stream list (count may differ from static HTML).
  const tabBar = tabButtons[0]?.parentElement;
  if (tabBar && streams.length !== tabButtons.length) {
    tabBar.innerHTML = streams
      .map(
        (s, i) =>
          `<button class="stream-tab-btn${i === 0 ? " is-active" : ""}" data-stream-tab="${escAttr(s.id || i)}">${escAttr(shortTabLabel(s.title))}</button>`,
      )
      .join("");
    tabButtons.length = 0;
    tabBar.querySelectorAll("[data-stream-tab]").forEach((b) => tabButtons.push(b));
  }

  let currentStreamIndex = 0;

  const switchStream = (index) => {
    if (index < 0 || index >= streams.length) return;
    currentStreamIndex = index;
    const stream = streams[index];

    tabButtons.forEach((btn, i) => {
      btn.classList.toggle("is-active", i === index);
    });

    if (videoElement) {
      if (stream.aspectRatio) {
        videoElement.style.aspectRatio = stream.aspectRatio;
      }
      videoElement.src = stream.src;
      videoElement.poster = stream.poster;
      videoElement.load();
      videoElement.play().catch(() => {});
    }

    const titleEl = container.querySelector("#field-stream-title");
    if (titleEl) titleEl.textContent = stream.title;
  };

  tabButtons.forEach((btn, idx) => {
    btn.addEventListener("click", () => switchStream(idx));
  });

  // Autoplay and Deferred Ingestion with IntersectionObserver
  if (videoElement) {
    if (streams[0].aspectRatio) {
      videoElement.style.aspectRatio = streams[0].aspectRatio;
    }
    const titleEl0 = container.querySelector("#field-stream-title");
    if (titleEl0) titleEl0.textContent = streams[0].title;

    videoElement.addEventListener("loadedmetadata", () => {
      if (videoElement.videoWidth && videoElement.videoHeight) {
        videoElement.style.aspectRatio = `${videoElement.videoWidth} / ${videoElement.videoHeight}`;
      }
    });
    let loaded = false;
    const videoObs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!loaded && videoElement.dataset.src) {
              videoElement.src = videoElement.dataset.src;
              videoElement.load();
              loaded = true;
            }
            videoElement.play().catch(() => {});
          } else {
            videoElement.pause();
          }
        }
      },
      { rootMargin: "200px 0px", threshold: 0.15 },
    );
    videoObs.observe(videoElement);

    videoElement.addEventListener("timeupdate", () => {
      if (!videoElement.duration) return;
      const progress = (videoElement.currentTime / videoElement.duration) * 100;
      if (scrubberFill) scrubberFill.style.width = `${progress}%`;
      if (timecodeDisplay) {
        const cur = Math.floor(videoElement.currentTime);
        const dur = Math.floor(videoElement.duration);
        const formatTime = (s) =>
          `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
        timecodeDisplay.textContent = `${formatTime(cur)} / ${formatTime(dur)}`;
      }
    });

    // Scrubber click and pointer seek support
    const scrubberTrack = container.querySelector(".scrubber-track");
    if (scrubberTrack) {
      const handleSeek = (e) => {
        if (!videoElement.duration) return;
        const rect = scrubberTrack.getBoundingClientRect();
        const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
        const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        videoElement.currentTime = pos * videoElement.duration;
      };

      scrubberTrack.addEventListener("click", handleSeek);

      let isDragging = false;
      scrubberTrack.addEventListener("pointerdown", (e) => {
        isDragging = true;
        handleSeek(e);
        try {
          scrubberTrack.setPointerCapture(e.pointerId);
        } catch (_) {}
      });
      scrubberTrack.addEventListener("pointermove", (e) => {
        if (isDragging) handleSeek(e);
      });
      const stopDrag = (e) => {
        if (isDragging) {
          isDragging = false;
          try {
            scrubberTrack.releasePointerCapture(e.pointerId);
          } catch (_) {}
        }
      };
      scrubberTrack.addEventListener("pointerup", stopDrag);
      scrubberTrack.addEventListener("pointercancel", stopDrag);
    }
  }

  return () => {};
};
