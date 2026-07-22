"use client";

import { useEffect, useRef } from "react";
import { PatternArcs } from "./pattern-arcs";
import { PatternBloom } from "./pattern-bloom";

const SHAPES = [
  {
    kind: "bloom",
    src: "/onboard/mask-bg-sky.png",
    size: 220,
    opacity: 0.34,
  },
  {
    kind: "arcs",
    src: "/onboard/mask-bg-cobalt.png",
    size: 205,
    opacity: 0.28,
  },
  {
    kind: "bloom",
    src: "/onboard/mask-bg-navy.png",
    size: 230,
    opacity: 0.26,
  },
  {
    kind: "arcs",
    src: "/onboard/mask-bg-sky.png",
    size: 176,
    opacity: 0.3,
  },
  {
    kind: "bloom",
    src: "/onboard/mask-bg-cobalt.png",
    size: 188,
    opacity: 0.22,
  },
];

const SPEED_MIN = 3.5;
const SPEED_MAX = 7;
const SPIN_MIN = 0.6;
const SPIN_MAX = 1.4;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function randomVelocity() {
  const speed = rand(SPEED_MIN, SPEED_MAX);
  const angle = Math.random() * Math.PI * 2;
  return {
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
  };
}

function randomSpin() {
  const spin = rand(SPIN_MIN, SPIN_MAX);
  return Math.random() < 0.5 ? -spin : spin;
}

function resolveSize(baseSize, width) {
  return Math.min(baseSize, Math.max(112, width * 0.16));
}

function createBodies(width, height) {
  return SHAPES.map((shape) => {
    const size = resolveSize(shape.size, width);
    const maxX = Math.max(0, width - size);
    const maxY = Math.max(0, height - size);
    const { vx, vy } = randomVelocity();

    return {
      ...shape,
      size,
      x: Math.random() * maxX,
      y: Math.random() * maxY,
      vx,
      vy,
      rotation: rand(0, 360),
      spin: randomSpin(),
      scaleX: 1,
      scaleY: 1,
    };
  });
}

export function FloatingPatternField({ onReady }) {
  const containerRef = useRef(null);
  const nodeRefs = useRef([]);
  const bodiesRef = useRef([]);
  const frameRef = useRef(0);
  const lastTimeRef = useRef(0);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const reduced = prefersReducedMotion();
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    bodiesRef.current = createBodies(width, height);

    const applyTransforms = () => {
      bodiesRef.current.forEach((body, index) => {
        const node = nodeRefs.current[index];
        if (!node) return;
        node.style.width = `${body.size}px`;
        node.style.height = `${body.size}px`;
        node.style.left = "0px";
        node.style.top = "0px";
        node.style.opacity = String(body.opacity);
        node.style.transform = `translate3d(${body.x}px, ${body.y}px, 0) rotate(${body.rotation}deg) scale(${body.scaleX}, ${body.scaleY})`;
      });
    };

    applyTransforms();
    onReady?.();

    if (reduced) return undefined;

    const step = (time) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const deltaMs = Math.min(48, time - lastTimeRef.current);
      lastTimeRef.current = time;
      const dt = deltaMs / 1000;

      const w = container.clientWidth;
      const h = container.clientHeight;

      bodiesRef.current.forEach((body) => {
        const maxX = Math.max(0, w - body.size);
        const maxY = Math.max(0, h - body.size);

        body.x += body.vx * dt;
        body.y += body.vy * dt;
        body.rotation += body.spin * dt;

        if (body.x <= 0) {
          body.x = 0;
          body.vx = Math.abs(body.vx);
          body.scaleX *= -1;
        } else if (body.x >= maxX) {
          body.x = maxX;
          body.vx = -Math.abs(body.vx);
          body.scaleX *= -1;
        }

        if (body.y <= 0) {
          body.y = 0;
          body.vy = Math.abs(body.vy);
          body.scaleY *= -1;
        } else if (body.y >= maxY) {
          body.y = maxY;
          body.vy = -Math.abs(body.vy);
          body.scaleY *= -1;
        }
      });

      applyTransforms();
      frameRef.current = window.requestAnimationFrame(step);
    };

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      bodiesRef.current.forEach((body, index) => {
        body.size = resolveSize(SHAPES[index].size, w);
        body.x = Math.min(body.x, Math.max(0, w - body.size));
        body.y = Math.min(body.y, Math.max(0, h - body.size));
      });
      applyTransforms();
    };

    frameRef.current = window.requestAnimationFrame(step);
    window.addEventListener("resize", onResize);

    return () => {
      window.cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [onReady]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {SHAPES.map((shape, index) => (
        <div
          key={`${shape.kind}-${shape.src}-${index}`}
          ref={(node) => {
            nodeRefs.current[index] = node;
          }}
          className="absolute will-change-transform"
          style={{
            left: 0,
            top: 0,
            width: shape.size,
            height: shape.size,
            opacity: 0,
          }}
        >
          {shape.kind === "bloom" ? (
            <PatternBloom src={shape.src} className="size-full" />
          ) : (
            <PatternArcs src={shape.src} className="size-full" />
          )}
        </div>
      ))}
    </div>
  );
}
