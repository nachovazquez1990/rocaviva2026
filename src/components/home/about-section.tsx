"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import type { Easing } from "framer-motion";
import type { HomeContentMap } from "@/lib/supabase/types";

const ease: Easing = [0.16, 1, 0.3, 1];

const exhibitions = [
  { db: "about_exhibition_1", t: "aboutExhibition1" },
  { db: "about_exhibition_2", t: "aboutExhibition2" },
  { db: "about_exhibition_3", t: "aboutExhibition3" },
  { db: "about_exhibition_4", t: "aboutExhibition4" },
] as const;

export function AboutSection({ content }: { content: HomeContentMap }) {
  const t = useTranslations("home");
  const c = (dbKey: string, tKey: string) => content[dbKey] || t(tKey);

  return (
    <section className="py-24 md:py-32 lg:py-40 bg-white" aria-labelledby="about-title">
      <div className="max-w-6xl mx-auto px-6">
        {/* Title with decorative line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease }}
          className="mb-16 md:mb-24"
        >
          <h2
            id="about-title"
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-neutral-900"
          >
            {c("about_title", "aboutTitle")}
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, delay: 0.3, ease }}
            className="h-px bg-brand-600 mt-6 origin-left max-w-[120px]"
          />
        </motion.div>

        {/* Intro paragraph — large text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
          className="mb-16 md:mb-20"
        >
          <p className="text-xl sm:text-2xl md:text-3xl leading-relaxed text-neutral-800 font-light max-w-4xl">
            {c("about_intro", "aboutIntro")}
          </p>
        </motion.div>

        {/* Key exhibitions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
          className="mb-16 md:mb-20"
        >
          <div className="grid grid-cols-1 gap-4 max-w-4xl">
            {exhibitions.map(({ db, t: tKey }, i) => (
              <motion.div
                key={db}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease }}
                className="flex items-start gap-3 py-3"
              >
                <span className="mt-1.5 w-2 h-2 bg-brand-600 shrink-0" />
                <span className="font-display text-lg md:text-xl italic text-neutral-800">
                  {c(db, tKey)}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Body paragraphs in two-column on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 max-w-6xl">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease }}
            >
              <p className="text-base md:text-lg leading-relaxed text-neutral-600">
                {c("about_projects", "aboutProjects")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.1, ease }}
            >
              <p className="text-base md:text-lg leading-relaxed text-neutral-600">
                {c("about_collaborators", "aboutCollaborators")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.2, ease }}
            >
              <p className="text-base md:text-lg leading-relaxed text-neutral-600">
                {c("about_readings", "aboutReadings")}
              </p>
            </motion.div>
          </div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease }}
            >
              <p className="text-base md:text-lg leading-relaxed text-neutral-600">
                {c("about_nobel", "aboutNobel")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.1, ease }}
            >
              <p className="text-base md:text-lg leading-relaxed text-neutral-600">
                {c("about_yo_te_aplaudo", "aboutYoTeAplaudo")}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
