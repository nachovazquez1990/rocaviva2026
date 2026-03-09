"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import type { Easing } from "framer-motion";
import type { HomeContentMap } from "@/app/[locale]/(public)/page";

const ease: Easing = [0.16, 1, 0.3, 1];

export function ContactSection({ content }: { content: HomeContentMap }) {
  const t = useTranslations("home");
  const c = (dbKey: string, tKey: string) => content[dbKey] || t(tKey);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 md:py-32 lg:py-40 bg-neutral-900" aria-labelledby="contact-title">
      <div ref={ref} className="max-w-4xl mx-auto px-6 text-center">
        <motion.h2
          id="contact-title"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease }}
          className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6"
        >
          {c("contact_title", "contactTitle")}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.15, ease }}
          className="text-lg md:text-xl text-neutral-300 mb-12 max-w-2xl mx-auto"
        >
          {c("contact_cta", "contactCta")}
        </motion.p>

        {/* Contact details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.3, ease }}
          className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 mb-12"
        >
          <a
            href="mailto:eventos@rocaviva.eu"
            className="text-white hover:text-brand-300 transition-colors duration-300 flex items-center gap-3"
          >
            <MailIcon />
            <span className="text-sm tracking-[0.1em]">eventos@rocaviva.eu</span>
          </a>

          <a
            href="tel:+34925474267"
            className="text-white hover:text-brand-300 transition-colors duration-300 flex items-center gap-3"
          >
            <PhoneIcon />
            <span className="text-sm tracking-[0.1em]">92 547 42 67</span>
          </a>

          <a
            href="tel:+34686519372"
            className="text-white hover:text-brand-300 transition-colors duration-300 flex items-center gap-3"
          >
            <PhoneIcon />
            <span className="text-sm tracking-[0.1em]">686 519 372</span>
          </a>
        </motion.div>

        {/* CTA button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.45, ease }}
        >
          <a
            href="mailto:eventos@rocaviva.eu"
            className="inline-block px-10 py-4 text-xs font-medium tracking-[0.2em] uppercase bg-brand-600 text-white hover:bg-brand-700 transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            {c("contact_button", "contactButton")}
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
