"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import type { CollaboratorItem } from "./logo-grid";

interface LogoMarqueeProps {
  collaborators: CollaboratorItem[];
  visitWebsiteLabel: string;
}

export function LogoMarquee({ collaborators, visitWebsiteLabel }: LogoMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mql.matches); // eslint-disable-line react-hooks/set-state-in-effect -- subscribing to media query
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      setIsPaused((p) => !p);
    }
  }, []);

  if (collaborators.length === 0) return null;

  // Duplicate for seamless loop
  const items = [...collaborators, ...collaborators];
  const duration = collaborators.length * 3;

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden py-8"
      role="region"
      aria-label="Collaborators marquee"
      tabIndex={0}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
    >
      {/* Gradient masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-neutral-50 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-neutral-50 to-transparent z-10" />

      <div
        className="flex items-center gap-12 sm:gap-16 w-max"
        style={{
          animation: prefersReducedMotion ? "none" : `marquee ${duration}s linear infinite`,
          animationPlayState: isPaused ? "paused" : "running",
        }}
      >
        {items.map((collab, i) => {
          const content = (
            <div className="group flex-shrink-0 flex items-center justify-center h-16 sm:h-20 w-32 sm:w-40 transition-all duration-300">
              <Image
                src={collab.logo_url}
                alt={collab.name}
                width={160}
                height={80}
                className="max-h-12 sm:max-h-16 w-auto object-contain grayscale opacity-60 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
              />
            </div>
          );

          return collab.website_url ? (
            <a
              key={`${collab.id}-${i}`}
              href={collab.website_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${collab.name} — ${visitWebsiteLabel}`}
            >
              {content}
            </a>
          ) : (
            <div key={`${collab.id}-${i}`}>{content}</div>
          );
        })}
      </div>
    </div>
  );
}
