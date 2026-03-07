"use client";

import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { fadeInUp } from "@/components/animations/motion-variants";
import { RichTextDisplay } from "@/components/ui/rich-text-display";
import { ImageGallery } from "./image-gallery";

type GalleryImage = {
  url: string;
  alt: string;
};

type ExhibitionContentProps = {
  projectTitle: string;
  city: string;
  venue: string | null;
  dateFrom: string | null;
  dateTo: string | null;
  description: string;
  galleryImages: GalleryImage[];
  galleryTitle: string;
  projectSlug: string;
  backLabel: string;
  galleryLabel: string;
  fromLabel: string;
  toLabel: string;
  venueLabel: string;
  datesLabel: string;
};

export function ExhibitionContent({
  projectTitle,
  city,
  venue,
  dateFrom,
  dateTo,
  description,
  galleryImages,
  galleryTitle,
  projectSlug,
  backLabel,
  galleryLabel,
  fromLabel,
  toLabel,
  venueLabel,
  datesLabel,
}: ExhibitionContentProps) {
  return (
    <div className="space-y-16 sm:space-y-20">
      {/* Back to project link */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <Link
          href={`/projects/${projectSlug}`}
          className="inline-flex items-center gap-2 text-sm tracking-[0.1em] uppercase text-neutral-400 hover:text-brand-600 transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
        >
          <ArrowLeft className="w-4 h-4" />
          {backLabel}
        </Link>

        {/* Project title subtitle */}
        <p className="mt-3 text-sm text-neutral-400 italic font-display">
          {projectTitle}
        </p>
      </motion.div>

      {/* Exhibition info card */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={fadeInUp}
        className="bg-white p-6 sm:p-8 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-start gap-6 sm:gap-10">
          {/* Venue */}
          {venue && (
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brand-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs tracking-[0.15em] uppercase text-neutral-400 mb-1">
                  {venueLabel}
                </p>
                <p className="text-neutral-900 font-medium">{venue}</p>
                <p className="text-sm text-neutral-500">{city}</p>
              </div>
            </div>
          )}

          {/* Dates */}
          {(dateFrom || dateTo) && (
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-brand-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs tracking-[0.15em] uppercase text-neutral-400 mb-1">
                  {datesLabel}
                </p>
                <p className="text-neutral-900 font-mono tabular-nums">
                  {dateFrom && (
                    <>
                      <span className="text-neutral-400">{fromLabel}</span>{" "}
                      {dateFrom}
                    </>
                  )}
                  {dateFrom && dateTo && (
                    <span className="mx-2 text-neutral-300">—</span>
                  )}
                  {dateTo && (
                    <>
                      <span className="text-neutral-400">{toLabel}</span>{" "}
                      {dateTo}
                    </>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Description */}
      {description && (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
        >
          <RichTextDisplay
            html={description}
            className="text-neutral-700 leading-relaxed text-lg"
          />
        </motion.div>
      )}

      {/* Gallery */}
      {galleryImages.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
          aria-labelledby="exhibition-gallery-heading"
        >
          <h2
            id="exhibition-gallery-heading"
            className="font-display text-2xl sm:text-3xl font-semibold text-neutral-900 mb-8"
          >
            {galleryLabel}
          </h2>
          <ImageGallery images={galleryImages} title={galleryTitle} />
        </motion.section>
      )}
    </div>
  );
}
