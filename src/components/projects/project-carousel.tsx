"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, type Easing } from "framer-motion";
import { ChevronLeft, ChevronRight, MoveHorizontal } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { MetroTimeline } from "./metro-timeline";

const ease: Easing = [0.16, 1, 0.3, 1];

export type CarouselExhibition = {
  slug: string;
  city: string;
  dateFrom: string | null;
  dateTo: string | null;
};

export type CarouselProject = {
  slug: string;
  title: string;
  image_url: string | null;
  gradient?: string | null;
  exhibitions: CarouselExhibition[];
};

type ProjectCarouselProps = {
  projects: CarouselProject[];
};

export function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const t = useTranslations("projects");
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const currentRef = useRef(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const [showSwipeHint, setShowSwipeHint] = useState(true);

  const total = projects.length;

  const goTo = useCallback(
    (index: number) => {
      if (index === currentRef.current) return;
      const dir = index > currentRef.current ? 1 : -1;
      currentRef.current = index;
      setDirection(dir);
      setCurrent(index);
    },
    [total]
  );

  const next = useCallback(() => {
    const nextIdx = (currentRef.current + 1) % total;
    currentRef.current = nextIdx;
    setDirection(1);
    setCurrent(nextIdx);
  }, [total]);

  const prev = useCallback(() => {
    const prevIdx = (currentRef.current - 1 + total) % total;
    currentRef.current = prevIdx;
    setDirection(-1);
    setCurrent(prevIdx);
  }, [total]);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [next, prev]);

  // Hide swipe hint after first interaction
  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchMove(e: React.TouchEvent) {
    touchEndX.current = e.touches[0].clientX;
  }

  function handleTouchEnd() {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 60) {
      setShowSwipeHint(false);
      if (diff > 0) next();
      else prev();
    }
  }

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5, ease },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
      transition: { duration: 0.5, ease },
    }),
  };

  const project = projects[current];

  if (!projects.length) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-neutral-400">
        <p className="text-lg">{t("noProjects")}</p>
      </div>
    );
  }

  return (
    <section
      className="relative h-[calc(100vh-5rem)] overflow-hidden bg-neutral-950"
      aria-roledescription="carousel"
      aria-label={t("title")}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
          aria-roledescription="slide"
          aria-label={`${current + 1} / ${total}: ${project.title}`}
        >
          {/* Project image */}
          {project.image_url ? (
            <Image
              src={project.image_url}
              alt={project.title}
              fill
              className="object-cover"
              priority={current === 0}
              sizes="100vw"
            />
          ) : (
            <div
              className={`absolute inset-0 bg-gradient-to-br ${project.gradient ?? "from-neutral-800 via-neutral-900 to-accent-900"}`}
            />
          )}

          {/* Overlays for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/70" />

          {/* Metro Timeline — top (z-30 to sit above the project link) */}
          <div className="absolute top-0 left-0 right-0 z-30">
            <MetroTimeline
              key={project.slug}
              projectSlug={project.slug}
              exhibitions={project.exhibitions}
            />
          </div>

          {/* Project info — bottom */}
          <Link
            href={`/projects/${project.slug}`}
            className="absolute inset-0 z-10 flex flex-col justify-end p-8 sm:p-12 md:p-16 lg:p-20 pt-40 group focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white"
          >
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease }}
              className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight max-w-4xl"
            >
              {project.title}
            </motion.h2>

            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease }}
              className="inline-flex items-center gap-2 mt-6 text-xs tracking-[0.2em] uppercase text-white/70 group-hover:text-white transition-colors duration-300"
            >
              {t("viewProject")}
              <ChevronRight className="w-4 h-4" />
            </motion.span>
          </Link>
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows — desktop */}
      <div className="hidden md:flex absolute inset-y-0 left-0 z-20 items-center pl-4 lg:pl-8">
        <button
          onClick={prev}
          aria-label={t("previousProject")}
          className="p-3 text-white/50 hover:text-white transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      </div>
      <div className="hidden md:flex absolute inset-y-0 right-0 z-20 items-center pr-4 lg:pr-8">
        <button
          onClick={next}
          aria-label={t("nextProject")}
          className="p-3 text-white/50 hover:text-white transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      {/* Mobile swipe indicator */}
      <AnimatePresence>
        {showSwipeHint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex md:hidden absolute bottom-24 left-1/2 -translate-x-1/2 z-20"
          >
            <motion.div
              animate={{ x: [-12, 12, -12] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-sm rounded-full"
            >
              <MoveHorizontal className="w-4 h-4 text-white/60" />
              <span className="text-[10px] tracking-[0.15em] uppercase text-white/60">
                {t("swipeHint")}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Counter + dots */}
      <div className="absolute bottom-8 sm:bottom-12 right-8 sm:right-12 md:right-16 lg:right-20 z-20 flex items-center gap-6">
        {/* Dots */}
        <div className="flex gap-2" role="tablist" aria-label={t("title")}>
          {projects.map((p, i) => (
            <button
              key={p.slug}
              role="tab"
              aria-selected={i === current}
              aria-label={p.title}
              onClick={() => goTo(i)}
              className={`h-0.5 transition-all duration-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
                i === current
                  ? "w-8 bg-white"
                  : "w-4 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>

        {/* Counter */}
        <span className="text-xs tracking-widest text-white/50 font-mono tabular-nums">
          {String(current + 1).padStart(2, "0")} /{" "}
          {String(total).padStart(2, "0")}
        </span>
      </div>
    </section>
  );
}
