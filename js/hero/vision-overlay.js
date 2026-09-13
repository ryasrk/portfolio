/**
 * Authentic MediaPipe 3D FaceMesh & Biometric Spatial HUD for Three.js.
 *
 * Powered by Google MediaPipe 478-Point 3D FaceLandmarker Topology:
 * - 100% Genuine 478 MediaPipe 3D Landmark Embeddings with bilateral axis-symmetry.
 * - Dynamic Before/After LiDAR Laser Scan Horizon Sweep (GPU per-vertex clipped).
 * - Real-time Spatial Biometric Identity Callouts anchored to physical facial landmarks:
 *     1. [BIO-METRICS // IDENTITY LOCK 99.8%] -> Forehead (10)
 *     2. [SPATIAL GAZE // ACTIVE VECTOR] -> Left Eye & Iris (468)
 *     3. [ACADEMIC CREDENTIALS // B.ENG GPA 3.78] -> Left Jaw (234)
 *     4. [PRODUCTION FLEET // 26 TUGBOATS] -> Right Jaw (454)
 * - 3D Chamfered Metrology Bounding Box & Target Reticle at Gaze Axis.
 * - Floating Volumetric 3D Particle Cloud.
 */

import {
  BufferGeometry,
  CanvasTexture,
  Color,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  LinearMipmapLinearFilter,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Points,
  PointsMaterial,
  ShaderMaterial,
  SRGBColorSpace,
  Vector3,
} from "three";
import { MEDIAPIPE_FACEMESH } from "./mediapipe-facemesh.js";

const scanOverlayVertexShader = /* glsl */ `
  attribute vec3 aColor;
  attribute float aSize;
  varying vec3 vColor;
  varying float vAlpha;
  uniform float uScanY;
  uniform float uBaseAlpha;
  uniform float uPulseAlpha;

  void main() {
    float dist = position.y - uScanY;

    // Laser scan visibility:
    // Above laser (scanned): visible; Below laser (raw photo): completely hidden (alpha = 0)
    float isScanned = smoothstep(-0.02, 0.04, dist);
    float laserPulse = exp(-abs(dist) * 25.0);

    vAlpha = clamp(isScanned * uBaseAlpha + laserPulse * uPulseAlpha, 0.0, 1.0);
    // Brighten color right at the laser pulse
    vColor = aColor + vec3(0.25, 0.55, 0.35) * laserPulse;

    gl_PointSize = aSize > 0.0 ? aSize : 3.5;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const scanOverlayFragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  uniform float uMasterOpacity;

  void main() {
    float alpha = vAlpha * uMasterOpacity;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

/**
 * Generates an ultra-crisp high-DPI canvas texture for a floating biometric callout card.
 */
function createCardTexture({ tag, title, items, width = 680, height = 270 }) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, width, height);

  const r = 12;
  const pad = 6;
  const w = width - pad * 2;
  const h = height - pad * 2;

  // Background Card: High-contrast Solid Dark Zinc with Emerald Border
  ctx.save();
  ctx.fillStyle = "rgba(18, 18, 22, 0.96)"; // Rich dark obsidian
  ctx.strokeStyle = "#047857"; // Emerald #047857
  ctx.lineWidth = 3.5;

  ctx.beginPath();
  ctx.roundRect(pad, pad, w, h, r);
  ctx.fill();
  ctx.stroke();

  // Header Banner Pill
  ctx.fillStyle = "rgba(4, 120, 87, 0.30)";
  ctx.beginPath();
  ctx.roundRect(pad, pad, w, 54, [r, r, 0, 0]);
  ctx.fill();

  // Header Separator
  ctx.strokeStyle = "rgba(52, 211, 153, 0.45)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(pad, pad + 54);
  ctx.lineTo(pad + w, pad + 54);
  ctx.stroke();

  // Status Indicator Dot (glowing pulse)
  ctx.fillStyle = "#34d399";
  ctx.beginPath();
  ctx.arc(pad + 26, pad + 27, 6, 0, Math.PI * 2);
  ctx.fill();

  // Tag Category Text
  ctx.font = "bold 20px 'JetBrains Mono', 'Geist Mono', monospace";
  ctx.fillStyle = "#34d399";
  ctx.textBaseline = "middle";
  ctx.fillText(tag, pad + 44, pad + 28);

  // Main Card Title
  ctx.font = "bold 26px 'Geist', 'Inter', -apple-system, sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(title, pad + 22, pad + 94);

  // Data Items (Key-Value Telemetry)
  ctx.font = "bold 18px 'JetBrains Mono', 'Geist Mono', monospace";
  let curY = pad + 138;
  items.forEach((item) => {
    const parts = item.split(":");
    if (parts.length >= 2) {
      ctx.fillStyle = "#94a3b8"; // Muted slate label
      const label = parts[0] + ":";
      ctx.fillText(label, pad + 22, curY);
      const labelWidth = ctx.measureText(label + " ").width;
      ctx.fillStyle = "#34d399"; // Crisp bright emerald value
      ctx.fillText(parts.slice(1).join(":").trim(), pad + 22 + labelWidth, curY);
    } else {
      ctx.fillStyle = "#ffffff";
      ctx.fillText(item, pad + 22, curY);
    }
    curY += 32;
  });

  // Futuristic Chamfer Corner Marks
  ctx.strokeStyle = "#34d399";
  ctx.lineWidth = 3.5;
  // Top-Left corner tick
  ctx.beginPath();
  ctx.moveTo(pad, pad + 18);
  ctx.lineTo(pad, pad);
  ctx.lineTo(pad + 18, pad);
  ctx.stroke();
  // Bottom-Right corner tick
  ctx.beginPath();
  ctx.moveTo(pad + w - 18, pad + h);
  ctx.lineTo(pad + w, pad + h);
  ctx.lineTo(pad + w, pad + h - 18);
  ctx.stroke();

  ctx.restore();

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  return { texture, canvasWidth: width, canvasHeight: height };
}

export class HeroVisionOverlay {
  constructor() {
    this.group = new Group();
    this.group.name = "mediapipe-vision-ai-overlay";

    this.scanBeam = null;
    this.boxLines = null;
    this.targetReticle = null;
    this.pointCloud = null;
    this.pointPositions = null;
    this.pointOriginals = null;

    this.landmarkPoints = null;
    this.contourLines = null;
    this.tessellationLines = null;

    this.kpMaterial = null;
    this.contourMaterial = null;
    this.tessMaterial = null;

    // Biometric Callout Nodes
    this.calloutNodes = [];

    this.scanY = 0.0;
    this.materials = [];
    this.init();
  }

  init() {
    const { landmarks, contours, tessellation, key_points } = MEDIAPIPE_FACEMESH;

    // -------------------------------------------------------------
    // 1. 3D Volumetric LiDAR Particle Matrix (Ambient Point Cloud)
    // -------------------------------------------------------------
    const pointCount = 300;
    const positions = new Float32Array(pointCount * 3);
    const originals = new Float32Array(pointCount * 3);

    let idx = 0;
    for (let i = 0; i < pointCount; i++) {
      const u = (Math.random() - 0.5) * 5.2;
      const v = (Math.random() - 0.5) * 5.6;
      const w = (Math.random() - 0.5) * 1.5;

      positions[idx] = u;
      positions[idx + 1] = v;
      positions[idx + 2] = w;

      originals[idx] = u;
      originals[idx + 1] = v;
      originals[idx + 2] = w;
      idx += 3;
    }

    this.pointPositions = positions;
    this.pointOriginals = originals;

    const pointGeo = new BufferGeometry();
    pointGeo.setAttribute("position", new Float32BufferAttribute(positions, 3));

    const pointMat = new PointsMaterial({
      color: new Color(0x71717a),
      size: 3.0,
      sizeAttenuation: false,
      transparent: true,
      opacity: 0.20,
    });
    this.materials.push(pointMat);
    this.pointCloud = new Points(pointGeo, pointMat);
    this.pointCloud.position.set(0, 0, 0.02);
    this.group.add(this.pointCloud);

    // -------------------------------------------------------------
    // 2. 3D Chamfered Bounding Box Framing the Symmetrical Face Topology
    // -------------------------------------------------------------
    const bw = 1.15;
    const bh = 1.25;
    const cw = 0.25;
    const cx = key_points.midline_x || 0.1078;
    const cy = 0.650;
    const z = 0.12;

    const boxCoords = [
      // Top-Left corner
      cx - bw, cy + bh - cw, z,   cx - bw, cy + bh, z,
      cx - bw, cy + bh, z,        cx - bw + cw, cy + bh, z,

      // Top-Right corner
      cx + bw - cw, cy + bh, z,   cx + bw, cy + bh, z,
      cx + bw, cy + bh, z,        cx + bw, cy + bh - cw, z,

      // Bottom-Right corner
      cx + bw, cy - bh + cw, z,   cx + bw, cy - bh, z,
      cx + bw, cy - bh, z,        cx + bw - cw, cy - bh, z,

      // Bottom-Left corner
      cx - bw + cw, cy - bh, z,   cx - bw, cy - bh, z,
      cx - bw, cy - bh, z,        cx - bw, cy - bh + cw, z,

      // Side guide ticks
      cx - bw - 0.08, cy, z,      cx - bw + 0.08, cy, z,
      cx + bw - 0.08, cy, z,      cx + bw + 0.08, cy, z,
    ];

    const boxGeo = new BufferGeometry();
    boxGeo.setAttribute("position", new Float32BufferAttribute(boxCoords, 3));

    const boxMat = new LineBasicMaterial({
      color: new Color(0x18181b),
      transparent: true,
      opacity: 0.45,
    });
    this.materials.push(boxMat);
    this.boxLines = new LineSegments(boxGeo, boxMat);
    this.group.add(this.boxLines);

    // -------------------------------------------------------------
    // 3. Center Target Reticle at Gaze Axis (Nose Bridge: 168)
    // -------------------------------------------------------------
    const reticleCoords = [
      -0.10, 0, 0,   0.10, 0, 0,
      0, -0.10, 0,   0, 0.10, 0,
      -0.04, 0, 0,   0, 0.04, 0,
      0, 0.04, 0,    0.04, 0, 0,
      0.04, 0, 0,    0, -0.04, 0,
      0, -0.04, 0,   -0.04, 0, 0,
    ];

    const reticleGeo = new BufferGeometry();
    reticleGeo.setAttribute(
      "position",
      new Float32BufferAttribute(reticleCoords, 3),
    );

    const reticleMat = new LineBasicMaterial({
      color: new Color(0x047857),
      transparent: true,
      opacity: 0.85,
    });
    this.materials.push(reticleMat);
    this.targetReticle = new LineSegments(reticleGeo, reticleMat);
    const bridgePos = landmarks[key_points.nose_bridge] || [0.108, 1.04, 0.13];
    this.targetReticle.position.set(bridgePos[0], bridgePos[1], bridgePos[2] + 0.02);
    this.group.add(this.targetReticle);

    // -------------------------------------------------------------
    // 4. Authentic MediaPipe 478 3D Landmarks (Points)
    // -------------------------------------------------------------
    const kpPositions = [];
    const kpColors = [];
    const kpSizes = [];

    const irisIndices = new Set([468, 469, 470, 471, 472, 473, 474, 475, 476, 477]);

    landmarks.forEach(([x, y, pz], i) => {
      kpPositions.push(x, y, pz);
      if (irisIndices.has(i)) {
        kpColors.push(0.06, 0.85, 0.60); // bright teal-emerald for irises
        kpSizes.push(4.5);
      } else {
        kpColors.push(0.016, 0.471, 0.341); // authentic emerald #047857
        kpSizes.push(3.0);
      }
    });

    const kpGeo = new BufferGeometry();
    kpGeo.setAttribute("position", new Float32BufferAttribute(kpPositions, 3));
    kpGeo.setAttribute("aColor", new Float32BufferAttribute(kpColors, 3));
    kpGeo.setAttribute("aSize", new Float32BufferAttribute(kpSizes, 1));

    this.kpMaterial = new ShaderMaterial({
      vertexShader: scanOverlayVertexShader,
      fragmentShader: scanOverlayFragmentShader,
      uniforms: {
        uScanY: { value: 0.0 },
        uBaseAlpha: { value: 0.85 },
        uPulseAlpha: { value: 1.0 },
        uMasterOpacity: { value: 1.0 },
      },
      transparent: true,
      depthWrite: false,
    });
    this.materials.push(this.kpMaterial);
    this.landmarkPoints = new Points(kpGeo, this.kpMaterial);
    this.group.add(this.landmarkPoints);

    // -------------------------------------------------------------
    // 5. MediaPipe Canonical Face Mesh Tessellation (Triangles)
    // -------------------------------------------------------------
    const tessPositions = [];
    const tessColors = [];

    for (let i = 0; i < tessellation.length; i += 2) {
      const idx1 = tessellation[i];
      const idx2 = tessellation[i + 1];
      const p1 = landmarks[idx1];
      const p2 = landmarks[idx2];
      if (p1 && p2) {
        tessPositions.push(p1[0], p1[1], p1[2], p2[0], p2[1], p2[2]);
        tessColors.push(0.02, 0.45, 0.32, 0.02, 0.45, 0.32);
      }
    }

    const tessGeo = new BufferGeometry();
    tessGeo.setAttribute(
      "position",
      new Float32BufferAttribute(tessPositions, 3),
    );
    tessGeo.setAttribute(
      "aColor",
      new Float32BufferAttribute(tessColors, 3),
    );

    this.tessMaterial = new ShaderMaterial({
      vertexShader: scanOverlayVertexShader,
      fragmentShader: scanOverlayFragmentShader,
      uniforms: {
        uScanY: { value: 0.0 },
        uBaseAlpha: { value: 0.35 },
        uPulseAlpha: { value: 0.85 },
        uMasterOpacity: { value: 1.0 },
      },
      transparent: true,
      depthWrite: false,
    });
    this.materials.push(this.tessMaterial);
    this.tessellationLines = new LineSegments(tessGeo, this.tessMaterial);
    this.group.add(this.tessellationLines);

    // -------------------------------------------------------------
    // 6. MediaPipe Primary Anatomical Contours (Eyes, Lips, Nose, Oval)
    // -------------------------------------------------------------
    const contourPositions = [];
    const contourColors = [];

    for (let i = 0; i < contours.length; i += 2) {
      const idx1 = contours[i];
      const idx2 = contours[i + 1];
      const p1 = landmarks[idx1];
      const p2 = landmarks[idx2];
      if (p1 && p2) {
        contourPositions.push(p1[0], p1[1], p1[2], p2[0], p2[1], p2[2]);
        contourColors.push(0.03, 0.65, 0.45, 0.03, 0.65, 0.45);
      }
    }

    const contourGeo = new BufferGeometry();
    contourGeo.setAttribute(
      "position",
      new Float32BufferAttribute(contourPositions, 3),
    );
    contourGeo.setAttribute(
      "aColor",
      new Float32BufferAttribute(contourColors, 3),
    );

    this.contourMaterial = new ShaderMaterial({
      vertexShader: scanOverlayVertexShader,
      fragmentShader: scanOverlayFragmentShader,
      uniforms: {
        uScanY: { value: 0.0 },
        uBaseAlpha: { value: 0.70 },
        uPulseAlpha: { value: 1.0 },
        uMasterOpacity: { value: 1.0 },
      },
      transparent: true,
      depthWrite: false,
    });
    this.materials.push(this.contourMaterial);
    this.contourLines = new LineSegments(contourGeo, this.contourMaterial);
    this.group.add(this.contourLines);

    // -------------------------------------------------------------
    // 7. Dynamic Biometric Identity HUD Callouts Anchored to Key Landmarks
    // -------------------------------------------------------------
    const calloutConfigs = [
      {
        id: "identity",
        landmarkIdx: key_points.forehead || 10,
        anchorY: 1.594,
        elbow: [0.85, 1.60, 0.16],
        pin: [1.10, 1.60, 0.16],
        cardPos: [1.80, 1.60, 0.16],
        cardSize: [1.32, 0.52],
        data: {
          tag: "BIO-ID // LOCK 99.8%",
          title: "RYAS RAFI KARIM",
          items: ["ROLE: AI SYSTEMS ENGINEER", "CORE: REAL-TIME EDGE VISION"],
        },
      },
      {
        id: "deployment",
        landmarkIdx: key_points.right_jaw || 454,
        anchorY: 0.735,
        elbow: [1.15, 0.45, 0.12],
        pin: [1.40, 0.45, 0.12],
        cardPos: [2.10, 0.45, 0.12],
        cardSize: [1.32, 0.52],
        data: {
          tag: "PRODUCTION DEPLOYED",
          title: "MARITIME AI FLEET",
          items: ["FLEET: 26 TUGBOATS LIVE", "INGEST: 3,000+ RTSP @ 45FPS"],
        },
      },
      {
        id: "perception",
        landmarkIdx: key_points.left_pupil || 468,
        anchorY: 1.014,
        elbow: [-0.90, 0.85, 0.14],
        pin: [-1.15, 0.85, 0.14],
        cardPos: [-1.85, 0.85, 0.14],
        cardSize: [1.32, 0.52],
        data: {
          tag: "SPATIAL SENSING // ACTIVE",
          title: "GAZE & DEPTH METROLOGY",
          items: ["LATENCY: 8.2ms p95 ON-DEVICE", "ENGINE: TENSORRT FP16"],
        },
      },
      {
        id: "academic",
        landmarkIdx: key_points.left_jaw || 234,
        anchorY: 0.740,
        elbow: [-0.95, 0.15, 0.12],
        pin: [-1.20, 0.15, 0.12],
        cardPos: [-1.90, 0.15, 0.12],
        cardSize: [1.32, 0.52],
        data: {
          tag: "ACADEMIC CREDENTIALS",
          title: "B.ENG ELECTRICAL",
          items: ["GPA: 3.78 / 4.00 (HONORS)", "BANGKIT: TOP 10% GRADUATE"],
        },
      },
    ];

    this.calloutNodes = calloutConfigs.map((cfg) => {
      const origin = landmarks[cfg.landmarkIdx] || [0, cfg.anchorY, 0.1];
      const { elbow, pin, cardPos, cardSize, data } = cfg;

      // 1. Leader Line Geometry (Origin -> Elbow -> Pin)
      const lineCoords = [
        origin[0], origin[1], origin[2],   elbow[0], elbow[1], elbow[2],
        elbow[0], elbow[1], elbow[2],     pin[0], pin[1], pin[2],
      ];

      // Anchor Pin reticle [+]
      const pr = 0.035;
      const pinCoords = [
        origin[0] - pr, origin[1], origin[2] + 0.01, origin[0] + pr, origin[1], origin[2] + 0.01,
        origin[0], origin[1] - pr, origin[2] + 0.01, origin[0], origin[1] + pr, origin[2] + 0.01,
      ];

      const fullLineGeo = new BufferGeometry();
      fullLineGeo.setAttribute(
        "position",
        new Float32BufferAttribute([...lineCoords, ...pinCoords], 3),
      );

      const lineMat = new LineBasicMaterial({
        color: new Color(0x047857),
        transparent: true,
        opacity: 0.0,
      });
      this.materials.push(lineMat);
      const lineMesh = new LineSegments(fullLineGeo, lineMat);
      this.group.add(lineMesh);

      // 2. High-DPI Biometric Card Texture
      const { texture } = createCardTexture(data);
      const cardGeo = new PlaneGeometry(cardSize[0], cardSize[1]);
      const cardMat = new MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.0,
        side: DoubleSide,
        depthTest: false,
        toneMapped: false,
      });
      this.materials.push(cardMat);
      const cardMesh = new Mesh(cardGeo, cardMat);
      cardMesh.position.set(cardPos[0], cardPos[1], cardPos[2]);
      this.group.add(cardMesh);

      return {
        id: cfg.id,
        anchorY: origin[1],
        lineMesh,
        lineMat,
        cardMesh,
        cardMat,
        cardBasePos: new Vector3(cardPos[0], cardPos[1], cardPos[2]),
        lineBasePos: new Vector3(0, 0, 0),
      };
    });

    // -------------------------------------------------------------
    // 8. Sweeping Emerald Laser Horizon Beam (Single Razor Line)
    // -------------------------------------------------------------
    const beamGeo = new PlaneGeometry(4.8, 0.018);
    const beamMat = new MeshBasicMaterial({
      color: new Color(0x34d399),
      transparent: true,
      opacity: 0.95,
      side: DoubleSide,
    });
    this.materials.push(beamMat);
    this.scanBeam = new Mesh(beamGeo, beamMat);
    this.scanBeam.position.set(0, 0, 0.16);
    this.group.add(this.scanBeam);
  }

  update(timeSeconds, parallaxX, parallaxY, introProgress, revealOpacity) {
    const masterOpacity = Math.max(0, Math.min(1, introProgress * (revealOpacity || 1)));

    // Laser sweep oscillation across face: y = -0.40 (chin) to y = +1.80 (forehead/hair)
    const sweepY = 0.70 + Math.sin(timeSeconds * 1.35) * 1.15;
    this.scanY = sweepY;

    if (this.scanBeam) {
      this.scanBeam.position.y = sweepY;
      const pulse = 0.80 + Math.sin(timeSeconds * 4.0) * 0.20;
      this.scanBeam.material.opacity = pulse * masterOpacity;
    }

    // Parallax depth displacements
    if (this.boxLines) {
      this.boxLines.position.x = parallaxX * 0.08;
      this.boxLines.position.y = -parallaxY * 0.08;
      this.boxLines.material.opacity = 0.45 * masterOpacity;
    }

    if (this.targetReticle) {
      const bridgeX = 0.1078;
      const bridgeY = 1.040;
      this.targetReticle.position.x = bridgeX + parallaxX * 0.16;
      this.targetReticle.position.y = bridgeY - parallaxY * 0.16;
      this.targetReticle.rotation.z = timeSeconds * 0.6;
      this.targetReticle.material.opacity = 0.85 * masterOpacity;
    }

    // Update GPU shader uniforms for true Before/After scan clipping
    if (this.kpMaterial) {
      this.kpMaterial.uniforms.uScanY.value = sweepY;
      this.kpMaterial.uniforms.uMasterOpacity.value = masterOpacity;
    }
    if (this.landmarkPoints) {
      this.landmarkPoints.position.x = parallaxX * 0.12;
      this.landmarkPoints.position.y = -parallaxY * 0.12;
    }

    if (this.tessMaterial) {
      this.tessMaterial.uniforms.uScanY.value = sweepY;
      this.tessMaterial.uniforms.uMasterOpacity.value = masterOpacity;
    }
    if (this.tessellationLines) {
      this.tessellationLines.position.x = parallaxX * 0.12;
      this.tessellationLines.position.y = -parallaxY * 0.12;
    }

    if (this.contourMaterial) {
      this.contourMaterial.uniforms.uScanY.value = sweepY;
      this.contourMaterial.uniforms.uMasterOpacity.value = masterOpacity;
    }
    if (this.contourLines) {
      this.contourLines.position.x = parallaxX * 0.12;
      this.contourLines.position.y = -parallaxY * 0.12;
    }

    // -------------------------------------------------------------
    // Update Biometric Callouts & Reveal Animations on Laser Scan
    // -------------------------------------------------------------
    this.calloutNodes.forEach((node) => {
      // In shader: features ABOVE laser (node.anchorY > sweepY) are in SCANNED state
      const distToScan = node.anchorY - sweepY;
      const isScanned = distToScan > -0.05 ? 1.0 : 0.0;
      const laserPulse = Math.exp(-Math.abs(distToScan) * 12.0);

      // Target alpha: high contrast when scanned, with an intense emerald glow when laser sweeps past
      const targetAlpha = (isScanned * 0.92 + laserPulse * 0.38) * masterOpacity;

      node.cardMat.opacity = Math.min(1.0, Math.max(0.0, targetAlpha));
      node.lineMat.opacity = Math.min(1.0, Math.max(0.0, (isScanned * 0.75 + laserPulse * 0.45) * masterOpacity));

      // Parallax displacement
      node.cardMesh.position.x = node.cardBasePos.x + parallaxX * 0.18;
      node.cardMesh.position.y = node.cardBasePos.y - parallaxY * 0.18;

      node.lineMesh.position.x = parallaxX * 0.14;
      node.lineMesh.position.y = -parallaxY * 0.14;
    });

    // Point cloud physics with cursor dispersion
    if (this.pointCloud && this.pointPositions && this.pointOriginals) {
      const pos = this.pointPositions;
      const orig = this.pointOriginals;
      const count = pos.length / 3;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const ox = orig[i3];
        const oy = orig[i3 + 1];
        const oz = orig[i3 + 2];

        const wave = Math.sin(timeSeconds * 1.8 + ox * 1.2 + oy * 1.2) * 0.06;
        const dx = ox - parallaxX * 1.8;
        const dy = oy + parallaxY * 1.8;
        const distSq = dx * dx + dy * dy;

        let push = 0;
        if (distSq < 2.0) {
          push = (2.0 - distSq) * 0.1;
        }

        pos[i3] = ox + (dx / (distSq + 0.1)) * push * 0.15;
        pos[i3 + 1] = oy + (dy / (distSq + 0.1)) * push * 0.15;
        pos[i3 + 2] = oz + wave + push;
      }
      this.pointCloud.geometry.attributes.position.needsUpdate = true;
      this.pointCloud.material.opacity = 0.20 * masterOpacity;
    }
  }

  dispose() {
    this.materials.forEach((mat) => mat.dispose());
    this.group.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
    });
  }
}
