"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type ProjectHeroProps = {
  title: string;
  imageUrl: string | null;
  gradient: string | null;
};

const ease = [0.16, 1, 0.3, 1] as const;

export function ProjectHero({ title, imageUrl, gradient }: ProjectHeroProps) {
  return (
    <section className="relative h-[calc(100vh-8rem)] sm:h-[60vh] md:h-[65vh] overflow-hidden bg-neutral-950">
      {/* Background */}
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      ) : (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient ?? "from-neutral-800 via-neutral-900 to-accent-900"}`}
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

      {/* Title */}
      <div className="absolute inset-0 flex items-end">
        <div className="w-full max-w-5xl mx-auto px-6 sm:px-8 md:px-12 pb-10 sm:pb-14 md:pb-16">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight"
          >
            {title}
          </motion.h1>
        </div>
      </div>
    </section>
  );
}
