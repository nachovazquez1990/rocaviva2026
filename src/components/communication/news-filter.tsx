"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { MediaType } from "./news-card";

const FILTERS: (MediaType | "all")[] = ["all", "press", "radio", "tv", "video"];

interface NewsFilterProps {
  activeFilter: MediaType | "all";
  onFilterChange: (filter: MediaType | "all") => void;
  counts: Record<MediaType | "all", number>;
}

export function NewsFilter({ activeFilter, onFilterChange, counts }: NewsFilterProps) {
  const t = useTranslations("communication");

  return (
    <div className="flex flex-wrap gap-2 sm:gap-3" role="group" aria-label={t("title")}>
      {FILTERS.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          aria-pressed={activeFilter === filter}
          className={cn(
            "px-4 sm:px-5 py-2 text-xs font-medium tracking-[0.15em] uppercase transition-colors duration-300",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500",
            activeFilter === filter
              ? "bg-neutral-900 text-white"
              : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
          )}
        >
          {t(filter)}
          <span className="ml-1.5 text-[10px] opacity-60">({counts[filter]})</span>
        </button>
      ))}
    </div>
  );
}
