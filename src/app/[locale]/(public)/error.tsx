"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error("Public route error:", error);
  }, [error]);

  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center mb-6">
        <svg
          className="w-8 h-8 text-brand-600"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
          />
        </svg>
      </div>

      <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900">
        {t("title")}
      </h1>

      <p className="text-neutral-500 text-base sm:text-lg max-w-md mt-4">
        {t("description")}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mt-10">
        <button
          onClick={reset}
          className="inline-block px-8 py-3.5 text-xs font-medium tracking-[0.15em] uppercase bg-brand-600 text-white hover:bg-brand-700 transition-colors duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
        >
          {t("retry")}
        </button>
        <Link
          href="/"
          className="inline-block px-8 py-3.5 text-xs font-medium tracking-[0.15em] uppercase border border-neutral-300 text-neutral-700 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
        >
          {t("backHome")}
        </Link>
      </div>
    </section>
  );
}
