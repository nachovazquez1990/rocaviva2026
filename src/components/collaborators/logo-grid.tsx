"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/animations/motion-variants";

export interface CollaboratorItem {
  id: string;
  name: string;
  logo_url: string;
  website_url: string | null;
}

interface LogoGridProps {
  collaborators: CollaboratorItem[];
  visitWebsiteLabel: string;
}

export function LogoGrid({ collaborators, visitWebsiteLabel }: LogoGridProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5"
    >
      {collaborators.map((collab) => {
        const content = (
          <div className="group relative bg-white p-6 sm:p-8 flex items-center justify-center aspect-[3/2] transition-shadow duration-300 hover:shadow-md">
            <Image
              src={collab.logo_url}
              alt={collab.name}
              width={240}
              height={140}
              className="max-h-20 sm:max-h-28 w-auto object-contain opacity-100 transition-all duration-300 group-hover:grayscale group-hover:opacity-60"
            />
            <span className="absolute inset-x-0 bottom-0 bg-neutral-900/90 text-white text-xs text-center py-1.5 px-2 opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 truncate">
              {collab.name}
            </span>
          </div>
        );

        return (
          <motion.div key={collab.id} variants={staggerItem}>
            {collab.website_url ? (
              <a
                href={collab.website_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${collab.name} — ${visitWebsiteLabel}`}
              >
                {content}
              </a>
            ) : (
              content
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
