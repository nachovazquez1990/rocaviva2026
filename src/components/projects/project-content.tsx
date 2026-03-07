"use client";

import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { fadeInUp } from "@/components/animations/motion-variants";
import { RichTextDisplay } from "@/components/ui/rich-text-display";
import { ImageGallery } from "./image-gallery";
import { ProjectTimeline } from "./project-timeline";

type GalleryImage = {
  url: string;
  alt: string;
};

type TimelineExhibition = {
  slug: string;
  city: string;
  venue: string | null;
  dateFrom: string | null;
  dateTo: string | null;
};

type ProjectContentProps = {
  description: string;
  dossierUrl: string | null;
  dossierLabel: string;
  galleryImages: GalleryImage[];
  galleryTitle: string;
  exhibitions: TimelineExhibition[];
  projectSlug: string;
  exhibitionsLabel: string;
  galleryLabel: string;
};

export function ProjectContent({
  description,
  dossierUrl,
  dossierLabel,
  galleryImages,
  galleryTitle,
  exhibitions,
  projectSlug,
  exhibitionsLabel,
  galleryLabel,
}: ProjectContentProps) {
  return (
    <div className="space-y-16 sm:space-y-20">
      {/* Description + Dossier */}
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

          {dossierUrl && (
            <div className="mt-10">
              <a
                href={dossierUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-7 py-3 bg-brand-600 text-white text-sm font-medium tracking-[0.15em] uppercase hover:bg-brand-700 transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
              >
                <Download className="w-4 h-4" />
                {dossierLabel}
              </a>
            </div>
          )}
        </motion.div>
      )}

      {/* Gallery */}
      {galleryImages.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
          aria-labelledby="gallery-heading"
        >
          <h2
            id="gallery-heading"
            className="font-display text-2xl sm:text-3xl font-semibold text-neutral-900 mb-8"
          >
            {galleryLabel}
          </h2>
          <ImageGallery images={galleryImages} title={galleryTitle} />
        </motion.section>
      )}

      {/* Timeline */}
      {exhibitions.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
          aria-labelledby="exhibitions-heading"
        >
          <h2
            id="exhibitions-heading"
            className="font-display text-2xl sm:text-3xl font-semibold text-neutral-900 mb-8"
          >
            {exhibitionsLabel}
          </h2>
          <ProjectTimeline
            projectSlug={projectSlug}
            exhibitions={exhibitions}
          />
        </motion.section>
      )}
    </div>
  );
}
