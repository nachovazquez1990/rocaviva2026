"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { submitBookDownload, type BookFormState } from "@/app/[locale]/(public)/books/actions";
import { fadeInUp, staggerContainer, staggerItem } from "@/components/animations/motion-variants";
import type { BookFilePart } from "@/app/[locale]/(public)/books/page";

interface BookFormProps {
  bookId: string;
  files: BookFilePart[];
}

const initialState: BookFormState = {
  success: false,
  error: null,
  bookId: null,
};

export function BookForm({ bookId, files }: BookFormProps) {
  const t = useTranslations("books");
  const [state, formAction, isPending] = useActionState(submitBookDownload, initialState);

  if (state.success) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="space-y-8"
      >
        {/* Thank you message */}
        <motion.div variants={fadeInUp} className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-6 border-2 border-brand-600 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-brand-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
            {t("thankYou")}
          </h3>
        </motion.div>

        {/* Download buttons - one per file part */}
        {files.length > 0 && (
          <motion.div
            variants={staggerContainer}
            className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center"
          >
            {files.map((file, idx) => (
              <motion.div key={file.part_number} variants={staggerItem}>
                <a
                  href={file.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                >
                  <Button
                    variant={idx === 0 ? "primary" : "outline"}
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {file.label || (files.length === 1
                      ? t("download")
                      : `${t("download")} - ${t("part")} ${file.part_number}`)}
                  </Button>
                </a>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
      <h3 className="font-display text-xl sm:text-2xl font-bold text-neutral-900 mb-6">
        {t("downloadForm")}
      </h3>

      <form action={formAction} className="space-y-6">
        <input type="hidden" name="bookId" value={bookId} />

        <Input
          name="name"
          label={t("name")}
          required
          minLength={2}
          placeholder={t("name")}
          aria-invalid={state.error === "name"}
        />

        <Input
          name="email"
          type="email"
          label={t("email")}
          required
          placeholder={t("email")}
          aria-invalid={state.error === "email"}
        />

        <div>
          <label htmlFor="interest" className="block text-sm font-medium text-neutral-700 mb-2">
            {t("interest")}
          </label>
          <div className="flex flex-wrap gap-4" role="radiogroup" aria-label={t("interest")}>
            {(["personal", "professional", "gift"] as const).map((value) => (
              <label
                key={value}
                className="flex items-center gap-2 cursor-pointer text-sm text-neutral-700"
              >
                <input
                  type="radio"
                  name="interest"
                  value={value}
                  required
                  className="w-4 h-4 text-brand-600 border-neutral-300 focus:ring-brand-500"
                />
                {t(`interest${value.charAt(0).toUpperCase() + value.slice(1)}`)}
              </label>
            ))}
          </div>
          <AnimatePresence>
            {state.error === "interest" && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {t("interest")}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <Input
          name="profession"
          label={t("profession")}
          placeholder={t("profession")}
        />

        <Textarea
          name="comments"
          label={t("comments")}
          placeholder={t("comments")}
          rows={3}
        />

        <AnimatePresence>
          {state.error === "server" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-red-600"
              role="alert"
            >
              {t("serverError")}
            </motion.p>
          )}
        </AnimatePresence>

        <Button type="submit" size="lg" disabled={isPending} className="w-full sm:w-auto">
          {isPending ? "..." : t("download")}
        </Button>
      </form>
    </motion.div>
  );
}
