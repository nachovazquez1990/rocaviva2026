"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "@/lib/i18n/navigation";
import type { HomeContentMap } from "@/app/[locale]/(public)/page";

export function HeroSection({ content }: { content: HomeContentMap }) {
  const t = useTranslations("home");
  const c = (dbKey: string, tKey: string) => content[dbKey] || t(tKey);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section
      ref={ref}
      className="relative h-screen -mt-20 overflow-hidden"
      aria-label={t("heroTitle")}
    >
      {/* Background image with parallax */}
      <motion.div
        style={{ y, scale }}
        className="absolute inset-0"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-accent-900" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
      </motion.div>

      {/* Content — no layout-shifting animations, only opacity fades */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center"
      >
        <p className="text-xs tracking-[0.35em] uppercase text-white/90 mb-6">
          {c("hero_subtitle", "heroSubtitle")}
        </p>

        <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight text-white">
          ROCAVIVA
        </h1>

        <span className="font-display text-lg sm:text-xl md:text-2xl tracking-[0.3em] uppercase text-white mt-2">
          EVENTOS
        </span>

        <div className="mt-12">
          <Link
            href="/projects"
            className="inline-block px-10 py-4 text-xs font-medium tracking-[0.2em] uppercase text-white border border-white/60 hover:bg-white hover:text-neutral-900 transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {c("hero_cta", "heroCta")}
          </Link>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 border border-white/40 rounded-full flex justify-center pt-1.5"
        >
          <div className="w-1 h-2 bg-white/70 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
