"use client";

import { useEffect } from "react";

const TARGET = ".onboard-liquid-card";
const SNAPSHOT = "#onboard-liquid-snapshot";
const CUBE_RAIN = "#onboard-cube-rain";

/** Cap live refraction to a 1080p pixel budget without upscaling small screens. */
const MAX_TEXTURE_WIDTH = 1920;
const MAX_TEXTURE_HEIGHT = 1080;

function getTextureScale(snapshotEl) {
  const rect = snapshotEl.getBoundingClientRect();
  if (!rect.width || !rect.height) return 1;

  return Math.max(
    0.1,
    Math.min(
      1,
      MAX_TEXTURE_WIDTH / rect.width,
      MAX_TEXTURE_HEIGHT / rect.height,
    ),
  );
}

/**
 * Soft CSS glass if WebGL init fails.
 * rgba only — no Tailwind oklab.
 */
const FALLBACK_GLASS = {
  background: "rgba(255, 255, 255, 0.28)",
  backdropFilter: "blur(28px) saturate(165%)",
  webkitBackdropFilter: "blur(28px) saturate(165%)",
  border: "1px solid rgba(255, 255, 255, 0.55)",
  boxShadow:
    "0 10px 36px rgba(15, 70, 130, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.55)",
  opacity: "1",
};

function applyFallbackGlass() {
  document.querySelectorAll(TARGET).forEach((el) => {
    Object.assign(el.style, FALLBACK_GLASS);
  });
}

function cleanupLiquidGl() {
  const renderer = window.__liquidGLRenderer__;
  if (!renderer) return;

  if (renderer._rafId) {
    window.cancelAnimationFrame(renderer._rafId);
    renderer._rafId = null;
  }
  if (renderer._customResize) {
    window.removeEventListener("resize", renderer._customResize);
    renderer._customResize = null;
  }
  renderer._liveSync = null;

  renderer.lenses?.forEach((lens) => {
    lens._shadowEl?.remove();
    lens._mirrorCanvas?.remove();
    lens._mirror?.remove();
    if (lens.el) {
      lens.el.style.background = "";
      lens.el.style.backgroundColor = "";
      lens.el.style.backdropFilter = "";
      lens.el.style.webkitBackdropFilter = "";
      lens.el.style.boxShadow = "";
      lens.el.style.opacity = "";
      lens.el.style.pointerEvents = "";
      lens.el.style.border = "";
    }
  });

  renderer.canvas?.remove();
  document.getElementById("liquid-gl-dynamic-styles")?.remove();
  window.__liquidGLRenderer__ = undefined;
}

/** Reused 2d buffer so we don't alloc a canvas every frame. */
let _bgBuf = null;
let _bgCtx = null;

/**
 * Paint what the user actually sees behind the glass:
 * page gradient + current cube-rain frame.
 */
function paintBackgroundTexture(snapshotEl, cubeCanvas, scale) {
  const rect = snapshotEl.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width * scale));
  const height = Math.max(1, Math.round(rect.height * scale));

  if (!_bgBuf) {
    _bgBuf = document.createElement("canvas");
    _bgCtx = _bgBuf.getContext("2d");
  }
  if (!_bgCtx) return null;

  if (_bgBuf.width !== width || _bgBuf.height !== height) {
    _bgBuf.width = width;
    _bgBuf.height = height;
  }

  const ctx = _bgCtx;
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "#EAF7FF");
  gradient.addColorStop(0.5, "#C5E7FF");
  gradient.addColorStop(1, "#4E9FE6");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  if (cubeCanvas && cubeCanvas.width > 0 && cubeCanvas.height > 0) {
    try {
      ctx.drawImage(cubeCanvas, 0, 0, width, height);
    } catch {
      // ignore zero-size / lost context races
    }
  }

  return _bgBuf;
}

/** Upload (or replace) the WebGL background texture. */
function uploadBackgroundTexture(renderer) {
  const snapshotEl = document.querySelector(SNAPSHOT);
  const cubeCanvas = document.querySelector(CUBE_RAIN);
  if (!renderer?.gl || !snapshotEl) return false;

  const scale = getTextureScale(snapshotEl);
  const snap = paintBackgroundTexture(snapshotEl, cubeCanvas, scale);
  if (!snap) return false;

  renderer.scaleFactor = scale;
  const gl = renderer.gl;

  renderer.staticSnapshotCanvas = snap;

  if (
    renderer.texture &&
    snap.width === renderer.textureWidth &&
    snap.height === renderer.textureHeight
  ) {
    gl.bindTexture(gl.TEXTURE_2D, renderer.texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texSubImage2D(
      gl.TEXTURE_2D,
      0,
      0,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      snap,
    );
    return true;
  }

  const copy = document.createElement("canvas");
  copy.width = snap.width;
  copy.height = snap.height;
  copy.getContext("2d")?.drawImage(snap, 0, 0);
  renderer._uploadTexture(copy);
  return !!renderer.texture;
}

/**
 * Show WebGL glass. Shell is transparent so the shared canvas (z = lensZ - 1)
 * paints the refraction; content children stay visible at z-[3].
 */
function activateWebGlGlass(renderer) {
  if (!renderer?.texture) return false;

  renderer.canvas.style.opacity = "1";
  renderer.lenses?.forEach((lens) => {
    lens._revealProgress = 1;
    if (lens.el) {
      lens.el.style.opacity = "1";
      lens.el.style.background = "transparent";
      lens.el.style.backgroundColor = "transparent";
      lens.el.style.backdropFilter = "none";
      lens.el.style.webkitBackdropFilter = "none";
      lens.el.style.border = "none";
      lens.el.style.pointerEvents = "none";
      lens.el.querySelectorAll("a, button").forEach((node) => {
        node.style.pointerEvents = "auto";
      });
    }
    if (lens._shadowEl) lens._shadowEl.style.opacity = "1";
  });
  return true;
}

/**
 * Hook live background sync into liquidGL's render loop so glass always
 * samples the same frame the user sees behind the cards.
 */
function attachLiveBackgroundSync(renderer) {
  if (!renderer || renderer._liveSync) return;

  renderer._videoNodes = [];

  const originalRender = renderer.render.bind(renderer);

  renderer.render = function liveSyncedRender() {
    try {
      uploadBackgroundTexture(this);
    } catch {
      // never let sync kill the glass loop
    }
    originalRender();
  };

  renderer._liveSync = true;
}

/**
 * Init liquidGL while the page is still hidden.
 * Calls `onReady` only after glass is fully painted (or CSS fallback applied).
 * Parent should keep the screen opacity:0 until then.
 */
export function useLiquidGlass({ enabled = true, onReady } = {}) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return undefined;

    let cancelled = false;
    let bootTimer = 0;
    let didSignalReady = false;

    const signalReady = () => {
      if (cancelled || didSignalReady) return;
      didSignalReady = true;
      onReady?.();
    };

    const boot = async () => {
      // Wait for layout of the (still-hidden) DOM
      await new Promise((resolve) => {
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(resolve);
        });
      });
      if (cancelled) return;

      const targets = document.querySelectorAll(TARGET);
      const snapshot = document.querySelector(SNAPSHOT);
      if (!targets.length || !snapshot) {
        applyFallbackGlass();
        signalReady();
        return;
      }

      cleanupLiquidGl();
      if (cancelled) return;

      try {
        const { default: liquidGL } = await import("liquid-gl");
        if (cancelled) return;

        // Keep shells styled for fallback if WebGL path fails mid-boot
        applyFallbackGlass();

        const textureScale = getTextureScale(snapshot);

        liquidGL({
          target: TARGET,
          snapshot: SNAPSHOT,
          resolution: textureScale,
          refraction: 0.028,
          bevelDepth: 0.1,
          bevelWidth: 0.14,
          frost: 0.15,
          shadow: true,
          specular: true,
          reveal: "none",
          tilt: false,
          magnify: 1,
        });

        const renderer = window.__liquidGLRenderer__;
        if (!renderer || cancelled) {
          applyFallbackGlass();
          signalReady();
          return;
        }

        renderer.captureSnapshot = async function customCapture() {
          if (this._capturing) return false;
          this._capturing = true;
          try {
            return uploadBackgroundTexture(this);
          } finally {
            this._capturing = false;
          }
        };

        // Wait for cube rain to paint at least one frame
        await new Promise((resolve) => window.requestAnimationFrame(resolve));
        if (cancelled) return;

        const ok = uploadBackgroundTexture(renderer);
        if (!ok) {
          console.warn("liquidGL custom snapshot failed — CSS glass fallback");
          cleanupLiquidGl();
          applyFallbackGlass();
          signalReady();
          return;
        }

        attachLiveBackgroundSync(renderer);

        // One more render pass so the first visible frame is correct
        renderer.render();
        await new Promise((resolve) => window.requestAnimationFrame(resolve));
        if (cancelled) return;

        activateWebGlGlass(renderer);

        const onResize = (() => {
          let t = 0;
          return () => {
            window.clearTimeout(t);
            t = window.setTimeout(() => {
              if (cancelled || !window.__liquidGLRenderer__) return;
              uploadBackgroundTexture(window.__liquidGLRenderer__);
              window.__liquidGLRenderer__.lenses?.forEach((l) =>
                l.updateMetrics?.(),
              );
            }, 200);
          };
        })();
        renderer._customResize = onResize;
        window.addEventListener("resize", onResize, { passive: true });

        // Final paint with live texture + active lenses, then reveal page
        renderer.render();
        await new Promise((resolve) => window.requestAnimationFrame(resolve));
        if (cancelled) return;

        signalReady();
      } catch (error) {
        console.error("liquidGL init failed", error);
        if (!cancelled) {
          cleanupLiquidGl();
          applyFallbackGlass();
          signalReady();
        }
      }
    };

    // Short delay so React has committed card DOM after field-ready
    bootTimer = window.setTimeout(() => {
      boot();
    }, 16);

    return () => {
      cancelled = true;
      window.clearTimeout(bootTimer);
      cleanupLiquidGl();
    };
  }, [enabled, onReady]);
}
