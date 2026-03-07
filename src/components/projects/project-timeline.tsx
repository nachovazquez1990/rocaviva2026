"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";

type TimelineExhibition = {
  slug: string;
  city: string;
  venue: string | null;
  dateFrom: string | null;
  dateTo: string | null;
};

type ProjectTimelineProps = {
  projectSlug: string;
  exhibitions: TimelineExhibition[];
};

export function ProjectTimeline({
  projectSlug,
  exhibitions,
}: ProjectTimelineProps) {
  const t = useTranslations("projects");

  if (exhibitions.length === 0) return null;

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 sm:left-5 top-0 bottom-0 w-px bg-neutral-200" />

      <div className="space-y-0">
        {exhibitions.map((exhibition, i) => (
          <motion.div
            key={exhibition.slug}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="relative pl-12 sm:pl-14 py-4 group"
          >
            {/* Metro dot */}
            <div className="absolute left-2.5 sm:left-3.5 top-6 w-3 h-3 rounded-full border-2 border-neutral-300 bg-white group-hover:border-brand-500 group-hover:bg-brand-500 transition-colors duration-300 z-10" />

            {/* Content */}
            <Link
              href={`/projects/${projectSlug}/${exhibition.slug}`}
              className="block p-4 sm:p-5 bg-white hover:shadow-md transition-shadow duration-300 group/link focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
            >
              <h3 className="font-display text-lg sm:text-xl font-semibold text-neutral-900 group-hover/link:text-brand-600 transition-colors">
                {exhibition.city}
              </h3>

              {exhibition.venue && (
                <p className="text-sm text-neutral-500 mt-1">
                  {exhibition.venue}
                </p>
              )}

              {(exhibition.dateFrom || exhibition.dateTo) && (
                <p className="text-sm text-neutral-400 mt-2 font-mono tabular-nums">
                  {exhibition.dateFrom && (
                    <>
                      <span className="text-neutral-300">{t("from")}</span>{" "}
                      {exhibition.dateFrom}
                    </>
                  )}
                  {exhibition.dateFrom && exhibition.dateTo && (
                    <span className="mx-2 text-neutral-300">—</span>
                  )}
                  {exhibition.dateTo && (
                    <>
                      <span className="text-neutral-300">{t("to")}</span>{" "}
                      {exhibition.dateTo}
                    </>
                  )}
                </p>
              )}

              <span className="inline-flex items-center mt-3 text-xs tracking-[0.15em] uppercase text-neutral-400 group-hover/link:text-brand-500 transition-colors">
                {t("viewExhibition")}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
