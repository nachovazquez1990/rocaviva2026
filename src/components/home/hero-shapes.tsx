"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { useEffect } from "react";

type ShapeType = "triangle" | "square";

type Shape = {
  type: ShapeType;
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  rotation: number;
  depth: number;
  driftX: number;
  driftY: number;
  driftDurationX: number;
  driftDurationY: number;
  rotationDuration: number;
  delay: number;
};

const COLORS = {
  teal: "#5fb3a1",
  yellow: "#f4c542",
  magenta: "#c93974",
  brand: "#c32e25",
  navy: "#334e7b",
  white: "#ffffff",
};

const SHAPES: Shape[] = [
  { type: "triangle", x: 6,  y: 12, size: 200, color: COLORS.magenta, opacity: 0.7,  rotation: -15, depth: 1.0, driftX: -50, driftY: 60,  driftDurationX: 14, driftDurationY: 11, rotationDuration: 60, delay: 0 },
  { type: "square",   x: 22, y: 28, size: 110, color: COLORS.teal,    opacity: 0.65, rotation: 25,  depth: 0.6, driftX: 40,  driftY: -45, driftDurationX: 12, driftDurationY: 16, rotationDuration: 75, delay: 0.4 },
  { type: "triangle", x: 4,  y: 58, size: 160, color: COLORS.yellow,  opacity: 0.6,  rotation: 180, depth: 1.0, driftX: 70,  driftY: 30,  driftDurationX: 13, driftDurationY: 10, rotationDuration: 70, delay: 0.8 },
  { type: "square",   x: 12, y: 82, size: 80,  color: COLORS.white,   opacity: 0.4,  rotation: 45,  depth: 0.7, driftX: -55, driftY: -40, driftDurationX: 15, driftDurationY: 12, rotationDuration: 80, delay: 1.2 },
  { type: "triangle", x: 32, y: 8,  size: 90,  color: COLORS.brand,   opacity: 0.65, rotation: 60,  depth: 0.7, driftX: 35,  driftY: 55,  driftDurationX: 17, driftDurationY: 13, rotationDuration: 65, delay: 0.6 },
  { type: "triangle", x: 36, y: 86, size: 130, color: COLORS.navy,    opacity: 0.75, rotation: 200, depth: 0.9, driftX: -45, driftY: -50, driftDurationX: 11, driftDurationY: 15, rotationDuration: 58, delay: 1.0 },
  { type: "square",   x: 58, y: 14, size: 95,  color: COLORS.magenta, opacity: 0.55, rotation: 12,  depth: 0.6, driftX: 50,  driftY: -35, driftDurationX: 14, driftDurationY: 11, rotationDuration: 78, delay: 0.2 },
  { type: "triangle", x: 76, y: 22, size: 220, color: COLORS.teal,    opacity: 0.55, rotation: 130, depth: 1.0, driftX: -60, driftY: 50,  driftDurationX: 16, driftDurationY: 12, rotationDuration: 62, delay: 0.5 },
  { type: "square",   x: 86, y: 8,  size: 70,  color: COLORS.white,   opacity: 0.35, rotation: 30,  depth: 0.7, driftX: 45,  driftY: 60,  driftDurationX: 13, driftDurationY: 17, rotationDuration: 85, delay: 1.4 },
  { type: "triangle", x: 90, y: 52, size: 140, color: COLORS.yellow,  opacity: 0.6,  rotation: -45, depth: 0.9, driftX: -40, driftY: -55, driftDurationX: 12, driftDurationY: 14, rotationDuration: 68, delay: 0.7 },
  { type: "square",   x: 80, y: 74, size: 120, color: COLORS.brand,   opacity: 0.6,  rotation: 18,  depth: 0.7, driftX: 55,  driftY: 35,  driftDurationX: 15, driftDurationY: 11, rotationDuration: 72, delay: 1.1 },
  { type: "triangle", x: 66, y: 84, size: 100, color: COLORS.white,   opacity: 0.4,  rotation: -90, depth: 0.9, driftX: -50, driftY: 45,  driftDurationX: 13, driftDurationY: 16, rotationDuration: 66, delay: 1.6 },
  { type: "square",   x: 2,  y: 42, size: 60,  color: COLORS.navy,    opacity: 0.7,  rotation: 35,  depth: 0.5, driftX: 40,  driftY: -40, driftDurationX: 18, driftDurationY: 13, rotationDuration: 92, delay: 0.3 },
  { type: "triangle", x: 96, y: 36, size: 75,  color: COLORS.navy,    opacity: 0.7,  rotation: 90,  depth: 0.5, driftX: -35, driftY: 50,  driftDurationX: 16, driftDurationY: 12, rotationDuration: 88, delay: 0.9 },
  { type: "triangle", x: 26, y: 92, size: 110, color: COLORS.teal,    opacity: 0.55, rotation: 220, depth: 0.8, driftX: 60,  driftY: -45, driftDurationX: 12, driftDurationY: 15, rotationDuration: 64, delay: 1.3 },
  { type: "square",   x: 54, y: 2,  size: 75,  color: COLORS.yellow,  opacity: 0.6,  rotation: 8,   depth: 0.6, driftX: -45, driftY: 55,  driftDurationX: 14, driftDurationY: 11, rotationDuration: 74, delay: 0.1 },
];

function ShapeNode({
  shape,
  mx,
  my,
  reduce,
}: {
  shape: Shape;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  reduce: boolean;
}) {
  const parallaxX = useTransform(mx, [-1, 1], [-50 * shape.depth, 50 * shape.depth]);
  const parallaxY = useTransform(my, [-1, 1], [-35 * shape.depth, 35 * shape.depth]);

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${shape.x}%`,
        top: `${shape.y}%`,
        x: reduce ? 0 : parallaxX,
        y: reduce ? 0 : parallaxY,
        opacity: shape.opacity,
        mixBlendMode: "screen",
        willChange: "transform",
      }}
    >
      <motion.div
        animate={
          reduce
            ? { rotate: shape.rotation }
            : {
                x: [0, shape.driftX, 0],
                y: [0, shape.driftY, 0],
                rotate: [shape.rotation, shape.rotation + 360],
              }
        }
        transition={
          reduce
            ? undefined
            : {
                x: {
                  duration: shape.driftDurationX,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: shape.delay,
                },
                y: {
                  duration: shape.driftDurationY,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: shape.delay,
                },
                rotate: {
                  duration: shape.rotationDuration,
                  repeat: Infinity,
                  ease: "linear",
                },
              }
        }
        style={{ transformOrigin: "50% 50%" }}
      >
        {shape.type === "triangle" ? (
          <svg
            width={shape.size}
            height={shape.size}
            viewBox="0 0 100 100"
            style={{ display: "block" }}
          >
            <polygon points="50,5 95,92 5,92" fill={shape.color} />
          </svg>
        ) : (
          <div
            style={{
              width: shape.size,
              height: shape.size,
              backgroundColor: shape.color,
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}

export function HeroShapes() {
  const reduce = useReducedMotion() ?? false;
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    let pendingX = 0;
    let pendingY = 0;
    const handler = (e: MouseEvent) => {
      pendingX = (e.clientX / window.innerWidth - 0.5) * 2;
      pendingY = (e.clientY / window.innerHeight - 0.5) * 2;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        mx.set(pendingX);
        my.set(pendingY);
        raf = 0;
      });
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handler);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduce, mx, my]);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {SHAPES.map((s, i) => (
        <ShapeNode key={i} shape={s} mx={mx} my={my} reduce={reduce} />
      ))}
    </div>
  );
}
