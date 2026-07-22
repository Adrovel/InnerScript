"use client";

import { useEffect, useRef } from "react";

// Background gradient (top → bottom): #EAF7FF → #C5E7FF → #4E9FE6
// Cubes use the reverse: sky blue at top → white at bottom
const COLOR_TOP = { r: 78, g: 159, b: 230 }; // #4E9FE6
const COLOR_MID = { r: 197, g: 231, b: 255 }; // #C5E7FF
const COLOR_BOT = { r: 255, g: 255, b: 255 }; // #FFFFFF

// Dense enough that liquid glass has structure to refract through the panes
const CUBE_COUNT = 64;
const SIZE_MIN = 7;
const SIZE_MAX = 18;
const SPEED_MIN = 24;
const SPEED_MAX = 68;
const SPIN_MIN = -0.7;
const SPIN_MAX = 0.7;
const DRIFT_MAX = 14;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function mix(c1, c2, t) {
  return {
    r: Math.round(lerp(c1.r, c2.r, t)),
    g: Math.round(lerp(c1.g, c2.g, t)),
    b: Math.round(lerp(c1.b, c2.b, t)),
  };
}

/** Opposite of page gradient by vertical position (0 top → 1 bottom). */
function colorAtDepth(t) {
  const clamped = Math.min(1, Math.max(0, t));
  if (clamped < 0.5) {
    return mix(COLOR_TOP, COLOR_MID, clamped * 2);
  }
  return mix(COLOR_MID, COLOR_BOT, (clamped - 0.5) * 2);
}

function createCube(width, height, fromTop) {
  const size = rand(SIZE_MIN, SIZE_MAX);
  return {
    x: rand(0, Math.max(1, width)),
    y: fromTop ? rand(-height * 0.2, 0) : rand(0, height),
    size,
    speed: rand(SPEED_MIN, SPEED_MAX),
    drift: rand(-DRIFT_MAX, DRIFT_MAX),
    spin: rand(SPIN_MIN, SPIN_MAX),
    rotation: rand(0, Math.PI * 2),
    opacity: rand(0.42, 0.88),
  };
}

function createCubes(width, height) {
  return Array.from({ length: CUBE_COUNT }, () =>
    createCube(width, height, false),
  );
}

function drawCube(ctx, cube, fill) {
  const { x, y, size, rotation } = cube;
  const half = size / 2;
  const depth = size * 0.35;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  // Simple isometric-ish cube: face + top + side
  const face = `rgba(${fill.r}, ${fill.g}, ${fill.b}, ${cube.opacity})`;
  const top = `rgba(${Math.min(255, fill.r + 28)}, ${Math.min(255, fill.g + 28)}, ${Math.min(255, fill.b + 28)}, ${cube.opacity * 0.95})`;
  const side = `rgba(${Math.max(0, fill.r - 24)}, ${Math.max(0, fill.g - 24)}, ${Math.max(0, fill.b - 24)}, ${cube.opacity * 0.9})`;

  // Front face
  ctx.fillStyle = face;
  ctx.fillRect(-half, -half, size, size);

  // Top face
  ctx.beginPath();
  ctx.moveTo(-half, -half);
  ctx.lineTo(-half + depth, -half - depth);
  ctx.lineTo(half + depth, -half - depth);
  ctx.lineTo(half, -half);
  ctx.closePath();
  ctx.fillStyle = top;
  ctx.fill();

  // Right face
  ctx.beginPath();
  ctx.moveTo(half, -half);
  ctx.lineTo(half + depth, -half - depth);
  ctx.lineTo(half + depth, half - depth);
  ctx.lineTo(half, half);
  ctx.closePath();
  ctx.fillStyle = side;
  ctx.fill();

  ctx.restore();
}

export function CubeRainField({ onReady }) {
  const canvasRef = useRef(null);
  const frameRef = useRef(0);
  const lastTimeRef = useRef(0);
  const cubesRef = useRef([]);
  const sizeRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const reduced = prefersReducedMotion();

    const resize = () => {
      const parent = canvas.parentElement;
      const width = parent?.clientWidth || window.innerWidth;
      const height = parent?.clientHeight || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      sizeRef.current = { width, height };

      if (cubesRef.current.length === 0) {
        cubesRef.current = createCubes(width, height);
      }
    };

    resize();

    const paintStatic = () => {
      const { width, height } = sizeRef.current;
      ctx.clearRect(0, 0, width, height);
      cubesRef.current.forEach((cube) => {
        const fill = colorAtDepth(cube.y / Math.max(1, height));
        drawCube(ctx, cube, fill);
      });
    };

    // Paint first frame before signaling ready — glass snapshot needs pixels
    paintStatic();
    onReady?.();

    if (reduced) {
      window.addEventListener("resize", resize);
      return () => window.removeEventListener("resize", resize);
    }

    const step = (time) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const deltaMs = Math.min(48, time - lastTimeRef.current);
      lastTimeRef.current = time;
      const dt = deltaMs / 1000;

      const { width, height } = sizeRef.current;
      ctx.clearRect(0, 0, width, height);

      cubesRef.current.forEach((cube, index) => {
        cube.y += cube.speed * dt;
        cube.x += cube.drift * dt;
        cube.rotation += cube.spin * dt;

        if (cube.y - cube.size > height) {
          cubesRef.current[index] = createCube(width, height, true);
          return;
        }

        if (cube.x < -cube.size * 2) cube.x = width + cube.size;
        if (cube.x > width + cube.size * 2) cube.x = -cube.size;

        const fill = colorAtDepth(cube.y / Math.max(1, height));
        drawCube(ctx, cube, fill);
      });

      frameRef.current = window.requestAnimationFrame(step);
    };

    frameRef.current = window.requestAnimationFrame(step);
    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [onReady]);

  return (
    <canvas
      id="onboard-cube-rain"
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      style={{
        // liquidGL snapshots this node with html2canvas, which cannot parse the
        // color()/oklab() border and outline values inherited from Tailwind.
        borderColor: "rgba(0, 0, 0, 0)",
        outlineColor: "rgba(0, 0, 0, 0)",
      }}
    />
  );
}
