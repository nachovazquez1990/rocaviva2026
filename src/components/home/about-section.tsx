"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import type { Easing } from "framer-motion";

const ease: Easing = [0.16, 1, 0.3, 1];

const exhibitions = [
  "aboutExhibition1",
  "aboutExhibition2",
  "aboutExhibition3",
  "aboutExhibition4",
] as const;

function AnimatedBlock({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.7, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AboutSection() {
  const t = useTranslations("home");
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-80px" });

  return (
    <section className="py-24 md:py-32 lg:py-40 bg-white" aria-labelledby="about-title">
      <div className="max-w-6xl mx-auto px-6">
        {/* Title with decorative line */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0 }}
          animate={titleInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, ease }}
          className="mb-16 md:mb-24"
        >
          <h2
            id="about-title"
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-neutral-900"
          >
            {t("aboutTitle")}
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={titleInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1, delay: 0.3, ease }}
            className="h-px bg-brand-600 mt-6 origin-left max-w-[120px]"
          />
        </motion.div>

        {/* Intro paragraph — large text */}
        <AnimatedBlock className="mb-16 md:mb-20">
          <p className="text-xl sm:text-2xl md:text-3xl leading-relaxed text-neutral-800 font-light max-w-4xl">
            {t("aboutIntro")}
          </p>
        </AnimatedBlock>

        {/* Key exhibitions */}
        <AnimatedBlock delay={0.1} className="mb-16 md:mb-20">
          <div className="grid grid-cols-1 gap-4 max-w-4xl">
            {exhibitions.map((key, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease }}
                className="flex items-start gap-3 py-3"
              >
                <span className="mt-1.5 w-2 h-2 bg-brand-600 shrink-0" />
                <span className="font-display text-lg md:text-xl italic text-neutral-800">
                  {t(key)}
                </span>
              </motion.div>
            ))}
          </div>
        </AnimatedBlock>

        {/* Body paragraphs in two-column on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 max-w-6xl">
          <div className="space-y-8">
            <AnimatedBlock>
              <p className="text-base md:text-lg leading-relaxed text-neutral-600">
                {t("aboutProjects")}
              </p>
            </AnimatedBlock>

            <AnimatedBlock delay={0.1}>
              <p className="text-base md:text-lg leading-relaxed text-neutral-600">
                {t("aboutCollaborators")}
              </p>
            </AnimatedBlock>

            <AnimatedBlock delay={0.2}>
              <p className="text-base md:text-lg leading-relaxed text-neutral-600">
                {t("aboutReadings")}
              </p>
            </AnimatedBlock>
          </div>

          <div className="space-y-8">
            <AnimatedBlock>
              <p className="text-base md:text-lg leading-relaxed text-neutral-600">
                {t("aboutNobel")}
              </p>
            </AnimatedBlock>

            <AnimatedBlock delay={0.1}>
              <p className="text-base md:text-lg leading-relaxed text-neutral-600">
                {t("aboutYoTeAplaudo")}
              </p>
            </AnimatedBlock>
          </div>
        </div>
      </div>
    </section>
  );
}
