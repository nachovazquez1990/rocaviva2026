"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BookForm } from "@/components/books/book-form";
import { RichTextDisplay } from "@/components/ui/rich-text-display";
import { fadeInUp, staggerContainer, staggerItem } from "@/components/animations/motion-variants";
import type { BookItem } from "@/app/[locale]/(public)/books/page";

interface BookDisplayProps {
  book: BookItem;
}

export function BookDisplay({ book }: BookDisplayProps) {
  return (
    <motion.article
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={staggerContainer}
      className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16"
    >
      {/* Left on desktop (second on mobile): Banner + Form + Stamp + Message */}
      <motion.div variants={staggerItem} className="order-2 lg:order-1 space-y-8">
        {/* Banner image */}
        {book.image_url && (
          <motion.div variants={fadeInUp}>
            <div className="relative w-full overflow-hidden">
              <Image
                src={book.image_url}
                alt={book.title}
                width={800}
                height={200}
                className="w-full h-auto object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </motion.div>
        )}

        {/* Download form — always show */}
        <motion.div variants={fadeInUp}>
          <BookForm
            bookId={book.id}
            files={book.files}
          />
        </motion.div>

        {/* Stamp image */}
        {book.extra_image_url && (
          <motion.div variants={fadeInUp}>
            <div className="relative w-48 mx-auto lg:mx-0">
              <Image
                src={book.extra_image_url}
                alt=""
                width={192}
                height={96}
                className="w-auto h-auto object-contain"
                sizes="192px"
              />
            </div>
          </motion.div>
        )}

        {/* Stamp message */}
        {book.stamp_message && (
          <motion.p
            variants={fadeInUp}
            className="text-sm text-neutral-500 italic leading-relaxed lg:max-w-sm"
          >
            {book.stamp_message}
          </motion.p>
        )}
      </motion.div>

      {/* Right on desktop (first on mobile): Title + Description */}
      <motion.div variants={staggerItem} className="order-1 lg:order-2 space-y-8">
        <motion.div variants={fadeInUp}>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 mb-6">
            {book.title}
          </h2>
          <RichTextDisplay
            html={book.description}
            className="text-neutral-600 leading-relaxed text-base sm:text-lg"
          />
        </motion.div>
      </motion.div>
    </motion.article>
  );
}
