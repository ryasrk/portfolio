/**
 * Content store — loads assets/data/content.json and renders the dynamic
 * sections (timeline, certificates, video streams).
 *
 * Failure mode: if the JSON is missing or malformed, every section keeps the
 * static HTML shipped in index.html. This module then renders nothing and the
 * page still works. A static snapshot of the JSON is also committed so the
 * site works on hosts without the admin API.
 */

const CONTENT_URL = "assets/data/content.json";

let cache = null;

export const loadContent = async () => {
  if (cache) return cache;
  try {
    const res = await fetch(CONTENT_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    cache = await res.json();
    return cache;
  } catch (err) {
    console.warn("[content] JSON unavailable, using static HTML:", err.message);
    cache = null;
    return null;
  }
};

/* ------------------------------------------------------------------ */
/* Timeline                                                            */
/* ------------------------------------------------------------------ */

const esc = (s) =>
  String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const UP_ARROW = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>';

export const renderTimeline = (container, data) => {
  if (!container || !data?.timeline?.length) return false;

  const rowsHtml = data.timeline
    .map(
      (item) => `
        <div class="timeline-row" data-timeline-row data-frame="centre">
          <div class="timeline-node-marker" aria-hidden="true">
            <span class="timeline-node-dot"></span>
            <span class="timeline-node-year">${esc(item.year)}</span>
          </div>

          <div class="timeline-copy-side" data-parallax-copy>
            <div class="timeline-card">
              <div class="timeline-card-header">
                <div class="timeline-badge-group">
                  <span class="timeline-year-badge" data-year-text>${esc(item.year)}</span>
                  <span class="timeline-org-badge">${esc(item.org)}</span>
                </div>
                <span class="timeline-status-badge">${esc(item.status)}</span>
              </div>

              <h3 class="timeline-role-title">${esc(item.title)}</h3>
              <p class="timeline-desc-text" data-copy-text>${esc(item.desc)}</p>

              <div class="timeline-tech-stack">
                ${(item.tags || []).map((t) => `<span class="tag-pill">${esc(t)}</span>`).join("")}
              </div>

              <div class="timeline-card-footer">
                <button type="button" class="timeline-action-btn" onclick="window.openDossier('${esc(item.dossier)}')">
                  <span>Inspect Dossier</span>
                  ${UP_ARROW}
                </button>
              </div>
            </div>
          </div>

          <div class="timeline-plate-side" data-parallax-plate>
            <div class="timeline-media-card" data-timeline-plate onclick="window.openDossier('${esc(item.dossier)}')">
              <div class="timeline-media-viewport">
                <div class="timeline-media-hud-bar">
                  <span class="hud-mono-tag">${esc(item.hudTag || "ARTIFACT")}</span>
                  <span class="hud-inspect-tag">EXPAND DOSSIER ↗</span>
                </div>
                <div class="timeline-media-frame">
                  <img src="${esc(item.image)}" alt="${esc(item.imageAlt || item.title)}" class="timeline-media-img" loading="lazy" />
                  <div class="timeline-media-corners">
                    <span class="corner-tl"></span>
                    <span class="corner-tr"></span>
                    <span class="corner-bl"></span>
                    <span class="corner-br"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>`,
    )
    .join("");

  // Replace static rows (rail SVG stays — it is a sibling of the rows).
  container.querySelectorAll("[data-timeline-row]").forEach((n) => n.remove());
  container.insertAdjacentHTML("beforeend", rowsHtml);
  return true;
};

/* ------------------------------------------------------------------ */
/* Certificates                                                        */
/* ------------------------------------------------------------------ */

export const renderCertificates = (grid, data) => {
  if (!grid || !data?.certificates) return false;

  const cardsHtml = data.certificates
    .map(
      (cert, i) => `
        <figure class="cert-card" data-cert-lightbox>
          <div class="cert-media">
            <img src="${esc(cert.image)}" alt="${esc(cert.title)} — ${esc(cert.issuer)}" loading="lazy" />
          </div>
          <figcaption class="cert-meta">
            <span class="cert-index">CERT-${String(i + 1).padStart(2, "0")}</span>
            <span class="cert-title">${esc(cert.title)}</span>
            <span class="cert-issuer">${esc(cert.issuer)}</span>
          </figcaption>
        </figure>`,
    )
    .join("");

  grid.innerHTML = cardsHtml;
  return true;
};

/* ------------------------------------------------------------------ */
/* Video streams (exported for field-block.js)                          */
/* ------------------------------------------------------------------ */

export const getVideoStreams = (data) => data?.videos || null;
