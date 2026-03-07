"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { NewsCard, type NewsItem, type MediaType } from "./news-card";
import { NewsFilter } from "./news-filter";
import { Button } from "@/components/ui/button";
import { staggerContainer } from "@/components/animations/motion-variants";

const ITEMS_PER_PAGE = 9;

interface NewsGridProps {
  items: NewsItem[];
  locale: string;
}

export function NewsGrid({ items, locale }: NewsGridProps) {
  const t = useTranslations("communication");
  const [activeFilter, setActiveFilter] = useState<MediaType | "all">("all");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const counts = useMemo(() => {
    const c: Record<MediaType | "all", number> = { all: items.length, press: 0, radio: 0, tv: 0, video: 0 };
    for (const item of items) {
      c[item.media_type]++;
    }
    return c;
  }, [items]);

  const filteredItems = useMemo(() => {
    if (activeFilter === "all") return items;
    return items.filter((item) => item.media_type === activeFilter);
  }, [items, activeFilter]);

  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  const handleFilterChange = useCallback((filter: MediaType | "all") => {
    setActiveFilter(filter);
    setVisibleCount(ITEMS_PER_PAGE);
  }, []);

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  }, []);

  return (
    <div>
      {/* Filter */}
      <div className="mb-8 sm:mb-10">
        <NewsFilter
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          counts={counts}
        />
      </div>

      {/* Grid */}
      {filteredItems.length === 0 ? (
        <p className="text-center text-neutral-400 py-16 text-sm tracking-wide">
          {items.length === 0 ? t("noResults") : t("noResultsFilter")}
        </p>
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {visibleItems.map((item) => (
                <NewsCard key={item.id} item={item} locale={locale} />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Load more / counter */}
          <div className="mt-10 sm:mt-12 flex flex-col items-center gap-4">
            <p className="text-xs text-neutral-400 tracking-wide" aria-live="polite" aria-atomic="true">
              {t("showing", {
                count: visibleItems.length,
                total: filteredItems.length,
              })}
            </p>
            {hasMore && (
              <Button variant="outline" size="md" onClick={handleLoadMore}>
                {t("loadMore")}
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
