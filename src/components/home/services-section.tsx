"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import type { Easing } from "framer-motion";
import type { HomeContentMap } from "@/lib/supabase/types";

const ease: Easing = [0.16, 1, 0.3, 1];

const services = [
  { dbKey: "service_exhibitions", tKey: "Exhibitions", icon: GalleryIcon },
  { dbKey: "service_guided_tours", tKey: "GuidedTours", icon: MapIcon },
  { dbKey: "service_conferences", tKey: "Conferences", icon: MicIcon },
  { dbKey: "service_readings", tKey: "Readings", icon: BookOpenIcon },
  { dbKey: "service_workshops", tKey: "Workshops", icon: PaletteIcon },
  { dbKey: "service_commemorations", tKey: "Commemorations", icon: TreeIcon },
] as const;

export function ServicesSection({ content }: { content: HomeContentMap }) {
  const t = useTranslations("home");
  const c = (dbKey: string, tKey: string) => content[dbKey] || t(tKey);
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-80px" });

  return (
    <section className="py-24 md:py-32 lg:py-40 bg-neutral-50" aria-labelledby="services-title">
      <div className="max-w-6xl mx-auto px-6">
        {/* Title */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0 }}
          animate={titleInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, ease }}
          className="text-center mb-16 md:mb-24"
        >
          <h2
            id="services-title"
            className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-neutral-900"
          >
            {c("services_title", "servicesTitle")}
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={titleInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1, delay: 0.3, ease }}
            className="h-px bg-brand-600 mt-6 mx-auto max-w-[120px]"
          />
        </motion.div>

        {/* Services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {services.map(({ dbKey, tKey, icon: Icon }, i) => (
            <motion.div
              key={dbKey}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease }}
              className="group bg-white p-8 md:p-10 hover:shadow-lg transition-shadow duration-500"
            >
              <div className="w-12 h-12 mb-6 text-brand-600 group-hover:text-brand-700 transition-colors duration-300">
                <Icon />
              </div>
              <h3 className="font-display text-xl md:text-2xl font-bold text-neutral-900 mb-3">
                {c(dbKey, `service${tKey}`)}
              </h3>
              <p className="text-sm md:text-base leading-relaxed text-neutral-500">
                {c(`${dbKey}_desc`, `service${tKey}Desc`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Icons — minimal stroke style matching the design system */

function GalleryIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="8" width="40" height="32" rx="2" />
      <path d="M4 32l12-10 8 6 8-8 12 12" />
      <circle cx="16" cy="18" r="3" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 4C17.4 4 12 9.4 12 16c0 10 12 28 12 28s12-18 12-28c0-6.6-5.4-12-12-12z" />
      <circle cx="24" cy="16" r="5" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="16" y="4" width="16" height="24" rx="8" />
      <path d="M8 24a16 16 0 0 0 32 0" />
      <line x1="24" y1="40" x2="24" y2="44" />
      <line x1="16" y1="44" x2="32" y2="44" />
    </svg>
  );
}

function BookOpenIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8h16a4 4 0 0 1 4 4v28a3 3 0 0 0-3-3H4V8z" />
      <path d="M44 8H28a4 4 0 0 0-4 4v28a3 3 0 0 1 3-3h17V8z" />
    </svg>
  );
}

function PaletteIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 4a20 20 0 0 0-2 39.9c1.8.2 3.4-1.2 3.4-3V36a4 4 0 0 1 4-4h5.2c1.7 0 3-.9 3.6-2.2A20 20 0 0 0 24 4z" />
      <circle cx="14" cy="18" r="2.5" />
      <circle cx="22" cy="12" r="2.5" />
      <circle cx="32" cy="14" r="2.5" />
      <circle cx="12" cy="28" r="2.5" />
    </svg>
  );
}

function TreeIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 4L10 22h8l-6 12h8v10h8V34h8l-6-12h8L24 4z" />
    </svg>
  );
}
