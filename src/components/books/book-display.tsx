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
      {/* Left: Book cover + stamp image */}
      <motion.div variants={staggerItem} className="space-y-8">
        {book.image_url && (
          <div className="relative aspect-[3/4] w-full max-w-md mx-auto lg:mx-0 bg-white shadow-lg">
            <Image
              src={book.image_url}
              alt={book.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        )}

        {book.extra_image_url && (
          <motion.div variants={fadeInUp}>
            <div className="relative aspect-[4/1] w-full mx-auto lg:mx-0 bg-neutral-100 overflow-hidden">
              <Image
                src={book.extra_image_url}
                alt=""
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Right: Description + Form */}
      <div className="space-y-10">
        <motion.div variants={fadeInUp}>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 mb-6">
            {book.title}
          </h2>
          <RichTextDisplay
            html={book.description}
            className="text-neutral-600 leading-relaxed text-base sm:text-lg"
          />
        </motion.div>

        {/* Separator */}
        <motion.div
          variants={fadeInUp}
          className="w-16 h-px bg-brand-600"
          aria-hidden="true"
        />

        {/* Download form */}
        {book.files.length > 0 && (
          <motion.div variants={fadeInUp}>
            <BookForm
              bookId={book.id}
              files={book.files}
            />
          </motion.div>
        )}
      </div>
    </motion.article>
  );
}
