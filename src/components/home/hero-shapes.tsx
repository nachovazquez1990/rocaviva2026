"use client";

import type { CSSProperties } from "react";

/**
 * Diagonal band of harlequin diamonds inspired by rocaviva exhibition posters.
 * Each diamond fades in along a diagonal stagger and then breathes opacity
 * slowly on an individual phase, so the band feels alive without distracting.
 *
 * Implemented with CSS animations driven by per-element custom properties —
 * lighter than running framer-motion on ~50 SVG nodes and SSR-friendly.
 */

const VB_W = 1600;
const VB_H = 900;
const S = 110; // diamond half-diagonal in SVG units (diamond = 220x220)
const ENTRY_DUR = 0.55; // seconds
const ENTRY_BUFFER = 1.5; // breath starts after all entries have finished

const COLORS = {
  navy: "#3d5a92",
  rose: "#c97a8e",
};

type Cell = {
  key: string;
  cx: number;
  cy: number;
  color: string;
  opacity: number;
  diag: number;
};

function hash(row: number, col: number, salt = 0) {
  return ((row + 100) * 2654435761 + (col + 100) * 40503 + salt) >>> 0;
}

function buildCells(): Cell[] {
  const cells: Cell[] = [];
  const cols = Math.ceil(VB_W / (2 * S)) + 2;
  const rows = Math.ceil(VB_H / S) + 2;

  for (let row = -1; row < rows; row++) {
    const cy = row * S + S / 2;
    const xOffset = row % 2 === 0 ? 0 : S;
    for (let col = -1; col < cols; col++) {
      const cx = col * 2 * S + xOffset + S;

      // Mask: keep only cells near the main diagonal of the viewBox
      const yOnDiag = (cx / VB_W) * VB_H;
      if (Math.abs(cy - yOnDiag) >= VB_H * 0.28) continue;

      const bucket = hash(row, col) % 100;
      let color: string;
      let opacity: number;
      if (bucket < 45) {
        color = COLORS.navy;
        opacity = 0.9;
      } else if (bucket < 80) {
        color = COLORS.rose;
        opacity = 0.7;
      } else {
        continue;
      }

      cells.push({
        key: `${row}:${col}`,
        cx,
        cy,
        color,
        opacity,
        diag: row + col,
      });
    }
  }
  return cells;
}

const CELLS = buildCells();
const MIN_DIAG = Math.min(...CELLS.map((c) => c.diag));

const STYLES = `
  .hero-diamond {
    opacity: 0;
    animation:
      hero-fade-in ${ENTRY_DUR}s cubic-bezier(0.16, 1, 0.3, 1) var(--entry-delay) both,
      hero-breath var(--breath-dur) ease-in-out var(--breath-delay) infinite;
  }
  @keyframes hero-fade-in {
    from { opacity: 0; }
    to { opacity: var(--op); }
  }
  @keyframes hero-breath {
    0%, 100% { opacity: var(--op); }
    50% { opacity: var(--dim); }
  }
  @media (prefers-reduced-motion: reduce) {
    .hero-diamond {
      opacity: var(--op);
      animation: none;
    }
  }
`;

export function HeroShapes() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <style>{STYLES}</style>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMid slice"
      >
        {CELLS.map((cell) => {
          const points = `${cell.cx},${cell.cy - S} ${cell.cx + S},${cell.cy} ${cell.cx},${cell.cy + S} ${cell.cx - S},${cell.cy}`;
          const entryDelay = (cell.diag - MIN_DIAG) * 0.045;
          const period =
            7 + ((hash(Math.round(cell.cx), Math.round(cell.cy), 1) % 1000) / 1000) * 5;
          const phase =
            ((hash(Math.round(cell.cx), Math.round(cell.cy), 2) % 1000) / 1000) * period;

          const style: CSSProperties & Record<`--${string}`, string | number> = {
            "--op": cell.opacity,
            "--dim": cell.opacity * 0.55,
            "--entry-delay": `${entryDelay}s`,
            "--breath-dur": `${period}s`,
            "--breath-delay": `${ENTRY_BUFFER + phase}s`,
          };

          return (
            <polygon
              key={cell.key}
              className="hero-diamond"
              points={points}
              fill={cell.color}
              style={style}
            />
          );
        })}
      </svg>
    </div>
  );
}
