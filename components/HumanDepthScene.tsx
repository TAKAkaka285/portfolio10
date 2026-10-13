"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

// ── Config ────────────────────────────────────────────────────────────────────
const PRELOAD_FRAMES  = 30;
const FPS_INTERVAL    = 112;

const COLS            = 200;
const ROWS            = 270;
const INSTANCE_COUNT  = COLS * ROWS;
const BOX_SIZE        = 0.024;
const DEPTH_SCALE     = 2.0;
const ALPHA_THRESHOLD = 50;
const SIZE_MULTIPLIER = 0.92;

// ── Video source ──────────────────────────────────────────────────────────────
const TOTAL_FRAMES = 2131;
const COLOR_PATH   = "/video/masked";
const DEPTH_PATH   = "/video/depth";

// Depth color gradient (green)
const C_SHALLOW = new THREE.Color(0xffffff);
const C_MID     = new THREE.Color(0xff0073);
const C_DEEP    = new THREE.Color(0x330017);

function depthToColor(d: number, out: THREE.Color): void {
  if (d > 0.5) {
    out.lerpColors(C_MID, C_SHALLOW, Math.pow((d - 0.5) * 2.0, 1.8));
  } else {
    out.lerpColors(C_DEEP, C_MID, Math.pow(d * 2.0, 1.8));
  }
}

function padFrame(n: number): string {
  return String(n).padStart(4, "0");
}

// ── Round levels: depth range → geometry ─────────────────────────────────────
const LEVEL_BOUNDS = [0.25, 0.5, 0.75, 1.01];

function getLevelIndex(d: number): number {
  for (let i = 0; i < LEVEL_BOUNDS.length; i++) {
    if (d < LEVEL_BOUNDS[i]) return i;
  }
  return LEVEL_BOUNDS.length - 1;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function HumanDepthScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Renderer ──────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // ── Scene & Camera ────────────────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 3;

    // ── Geometries: sharp cube → fully round sphere ───────────────────────
    const S = BOX_SIZE;
    const geos = [
      new THREE.BoxGeometry(S, S, S),                          // level 0: sharp
      new RoundedBoxGeometry(S, S, S, 4, S * 0.18),           // level 1: slightly rounded
      new RoundedBoxGeometry(S, S, S, 4, S * 0.38),           // level 2: more rounded
      new THREE.SphereGeometry(S * 0.5, 8, 8),                // level 3: full sphere
    ];

    const mat   = new THREE.MeshBasicMaterial();
    const insts = geos.map((geo) => new THREE.InstancedMesh(geo, mat, INSTANCE_COUNT));

    const hiddenMatrix = new THREE.Matrix4().makeScale(0, 0, 0);
    for (const inst of insts) {
      inst.rotation.z = -Math.PI / 2;
      inst.position.y = 0.4;
      scene.add(inst);
      for (let i = 0; i < INSTANCE_COUNT; i++) inst.setMatrixAt(i, hiddenMatrix);
      inst.instanceMatrix.needsUpdate = true;
    }

    // ── Grid step ─────────────────────────────────────────────────────────
    let stepX = S;
    let stepY = S;
    let aspectApplied = false;
    function applyAspect(_img: HTMLImageElement | ImageBitmap) {
      if (aspectApplied) return;
      aspectApplied = true;
      const vFov = (75 * Math.PI) / 180;
      const visH  = 2 * Math.tan(vFov / 2) * camera.position.z;
      const s = (visH * SIZE_MULTIPLIER) / COLS;
      stepX = s; stepY = s;
    }

    // ── Offscreen canvases ────────────────────────────────────────────────
    const colorCanvas = document.createElement("canvas");
    colorCanvas.width = COLS; colorCanvas.height = ROWS;
    const colorCtx = colorCanvas.getContext("2d", { willReadFrequently: true } as CanvasRenderingContext2DSettings)!;

    const depthCanvas = document.createElement("canvas");
    depthCanvas.width = COLS; depthCanvas.height = ROWS;
    const depthCtx = depthCanvas.getContext("2d", { willReadFrequently: true } as CanvasRenderingContext2DSettings)!;

    const dummy = new THREE.Object3D();
    const col   = new THREE.Color();

    // ── Update instances ──────────────────────────────────────────────────
    function updateInstances(colorTex: THREE.Texture, depthTex: THREE.Texture) {
      const colorImg = colorTex.image as CanvasImageSource;
      const depthImg = depthTex.image as CanvasImageSource;
      if (!colorImg || !depthImg) return;

      colorCtx.drawImage(colorImg, 0, 0, COLS, ROWS);
      depthCtx.drawImage(depthImg, 0, 0, COLS, ROWS);

      const colorPx = colorCtx.getImageData(0, 0, COLS, ROWS).data;
      const depthPx = depthCtx.getImageData(0, 0, COLS, ROWS).data;

      for (let row = 0; row < ROWS; row++) {
        for (let c = 0; c < COLS; c++) {
          const pixIdx  = (row * COLS + c) * 4;
          const instIdx = row * COLS + c;
          const alpha   = colorPx[pixIdx + 3];

          if (alpha < ALPHA_THRESHOLD) {
            dummy.scale.set(0, 0, 0); dummy.position.set(0, 0, 0); dummy.updateMatrix();
            for (const inst of insts) inst.setMatrixAt(instIdx, dummy.matrix);
          } else {
            const depthVal = depthPx[pixIdx] / 255;
            const x = (c    - COLS / 2 + 0.5) * stepX;
            const y = (ROWS / 2 - row  - 0.5) * stepY;
            const z = depthVal * DEPTH_SCALE;
            const s = 1.0 - depthVal * 0.75;
            const lvl = getLevelIndex(depthVal);

            depthToColor(depthVal, col);

            for (let li = 0; li < insts.length; li++) {
              if (li === lvl) {
                dummy.position.set(x, y, z);
                dummy.scale.set(s, s, s);
                dummy.updateMatrix();
                insts[li].setMatrixAt(instIdx, dummy.matrix);
                insts[li].setColorAt(instIdx, col);
              } else {
                dummy.scale.set(0, 0, 0); dummy.position.set(0, 0, 0); dummy.updateMatrix();
                insts[li].setMatrixAt(instIdx, dummy.matrix);
              }
            }
          }
        }
      }

      for (const inst of insts) {
        inst.instanceMatrix.needsUpdate = true;
        if (inst.instanceColor) inst.instanceColor.needsUpdate = true;
      }
    }

    // ── Texture cache ─────────────────────────────────────────────────────
    const loader = new THREE.TextureLoader();

    const colorCache = new Array<THREE.Texture | null>(TOTAL_FRAMES).fill(null);
    const depthCache = new Array<THREE.Texture | null>(TOTAL_FRAMES).fill(null);

    let lazyInterval: ReturnType<typeof setInterval> | null = null;

    function loadFrame(index: number) {
      const id = padFrame(index);
      if (!colorCache[index]) {
        loader.load(`${COLOR_PATH}/frame_${id}.webp`, (tex) => {
          tex.minFilter = THREE.LinearFilter;
          colorCache[index] = tex;
          if (index === 0) applyAspect(tex.image as HTMLImageElement);
        });
      }
      if (!depthCache[index]) {
        loader.load(`${DEPTH_PATH}/frame_${id}.webp`, (tex) => {
          tex.minFilter = THREE.LinearFilter;
          depthCache[index] = tex;
        });
      }
    }

    function startLazyLoad(fromIndex: number) {
      if (lazyInterval) clearInterval(lazyInterval);
      let lazyIndex = fromIndex;
      lazyInterval = window.setInterval(() => {
        if (lazyIndex >= TOTAL_FRAMES) { clearInterval(lazyInterval!); lazyInterval = null; return; }
        for (let b = 0; b < 5 && lazyIndex < TOTAL_FRAMES; b++, lazyIndex++) loadFrame(lazyIndex);
      }, 100);
    }

    for (let i = 0; i < PRELOAD_FRAMES; i++) loadFrame(i);
    startLazyLoad(PRELOAD_FRAMES);

    // ── Animation state ───────────────────────────────────────────────────
    let currentFrame     = 0;
    let lastFrameTime    = performance.now();
    let lastUpdatedFrame = -1;

    const targetOffset  = new THREE.Vector2(0, 0);
    const currentOffset = new THREE.Vector2(0, 0);

    // ── Idle visibility ───────────────────────────────────────────────────
    let idleTimer: ReturnType<typeof setTimeout> | null = null;
    function showScene() { mount.style.opacity = "1"; }
    function hideScene() { mount.style.opacity = "0"; }
    function resetIdleTimer() {
      hideScene();
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(showScene, 5000);
    }
    resetIdleTimer();

    // ── Events ────────────────────────────────────────────────────────────
    function onMouseMove(e: MouseEvent) {
      const nx =  (e.clientX / window.innerWidth)  * 2 - 1;
      const ny = -((e.clientY / window.innerHeight) * 2 - 1);
      targetOffset.set(nx * 0.3, ny * 0.3);
      resetIdleTimer();
    }
    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize",    onResize);

    // ── Render loop ───────────────────────────────────────────────────────
    let animId: number;
    function animate(now: number) {
      animId = requestAnimationFrame(animate);
      if (now - lastFrameTime >= FPS_INTERVAL) {
        currentFrame = (currentFrame + 1) % TOTAL_FRAMES;
        lastFrameTime = now;
      }
      if (currentFrame !== lastUpdatedFrame) {
        const ct = colorCache[currentFrame];
        const dt = depthCache[currentFrame];
        if (ct && dt) { updateInstances(ct, dt); lastUpdatedFrame = currentFrame; }
      }
      currentOffset.lerp(targetOffset, 0.05);
      camera.position.x = currentOffset.x;
      camera.position.y = currentOffset.y;
      renderer.render(scene, camera);
    }
    animId = requestAnimationFrame(animate);

    // ── Cleanup ───────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      if (lazyInterval) clearInterval(lazyInterval);
      if (idleTimer) clearTimeout(idleTimer);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize",    onResize);
      renderer.dispose();
      geos.forEach((g) => g.dispose());
      mat.dispose();
      insts.forEach((inst) => inst.dispose());
      colorCache.forEach((t) => t?.dispose());
      depthCache.forEach((t) => t?.dispose());
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9999,
        opacity: 0,
      }}
    />
  );
}
