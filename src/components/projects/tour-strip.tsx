"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";

type TourStop = {
  slug: string;
  city: string;
  dateFrom: string | null;
  dateTo: string | null;
};

type TourStripProps = {
  projectSlug: string;
  exhibitions: TourStop[];
};

function formatDates(from: string | null, to: string | null) {
  if (from && to && from !== to) return `${from} — ${to}`;
  return from ?? to ?? "";
}

export function TourStrip({ projectSlug, exhibitions }: TourStripProps) {
  const t = useTranslations("projects");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState<{
    canScrollLeft: boolean;
    canScrollRight: boolean;
  }>({ canScrollLeft: false, canScrollRight: false });

  // Convert vertical wheel into horizontal scroll while the cursor is over
  // the strip, and only preventDefault when the strip actually needs to scroll
  // — otherwise we'd hijack the page scroll.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 1) return; // no overflow → let the page scroll normally
      // While the strip has horizontal overflow, capture the wheel entirely
      // — even at edges — so the page doesn't suddenly jump vertically.
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    const updateEdges = () => {
      const max = el.scrollWidth - el.clientWidth;
      setOverflow({
        canScrollLeft: el.scrollLeft > 1,
        canScrollRight: el.scrollLeft < max - 1,
      });
    };

    updateEdges();
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("scroll", updateEdges, { passive: true });
    const ro = new ResizeObserver(updateEdges);
    ro.observe(el);

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("scroll", updateEdges);
      ro.disconnect();
    };
  }, [exhibitions]);

  if (!exhibitions.length) return null;

  // Stop touch events from bubbling to the carousel so the user can scroll
  // the strip horizontally without changing slides.
  const stop = (e: React.TouchEvent) => e.stopPropagation();

  return (
    <div
      className="w-full pt-6 pb-3"
      onTouchStart={stop}
      onTouchMove={stop}
      onTouchEnd={stop}
    >
      <div className="px-6 sm:px-12 md:px-16 lg:px-20 flex items-baseline gap-3 mb-3">
        <span className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-white/90 font-medium">
          {t("onTour")}
        </span>
        <span className="text-white/40">·</span>
        <span className="text-[10px] sm:text-xs tracking-[0.25em] uppercase text-white/80 font-mono tabular-nums">
          {exhibitions.length} {t("stops")}
        </span>
      </div>

      <div className="relative">
        {/* Left/right fade hints with chevron — visible only when there's
            content beyond, subtle scroll affordance. */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-20 bg-gradient-to-r from-black/70 to-transparent transition-opacity duration-200 ${
            overflow.canScrollLeft ? "opacity-100" : "opacity-0"
          }`}
        >
          <ChevronLeft className="absolute left-1.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
        </div>
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-20 bg-gradient-to-l from-black/70 to-transparent transition-opacity duration-200 ${
            overflow.canScrollRight ? "opacity-100" : "opacity-0"
          }`}
        >
          <ChevronRight className="absolute right-1.5 sm:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
        </div>

        <div
          ref={scrollerRef}
          className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          style={{ touchAction: "pan-x" }}
        >
          <div className="flex items-stretch pl-6 pr-6 sm:pl-12 sm:pr-12 md:pl-16 md:pr-16 lg:pl-20 lg:pr-20 snap-x">
            {exhibitions.map((ex, i) => (
              <Link
                key={ex.slug}
                href={`/projects/${projectSlug}/${ex.slug}`}
                className={`group snap-start shrink-0 min-w-[112px] sm:min-w-[140px] py-2 pr-5 sm:pr-8 ${
                  i === 0
                    ? "pl-0"
                    : "pl-5 sm:pl-8 border-l border-white/20"
                } focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`}
              >
                <span className="block text-sm sm:text-base font-semibold tracking-[0.08em] uppercase text-white whitespace-nowrap group-hover:text-brand-400 transition-colors duration-200">
                  {ex.city}
                </span>
                {(ex.dateFrom || ex.dateTo) && (
                  <span className="block mt-1 text-[10px] sm:text-xs text-white/70 font-mono tabular-nums whitespace-nowrap">
                    {formatDates(ex.dateFrom, ex.dateTo)}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
