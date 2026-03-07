"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { staggerItem } from "@/components/animations/motion-variants";

export type MediaType = "press" | "radio" | "tv" | "video";

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  date: string;
  link_url: string | null;
  media_type: MediaType;
}

const TYPE_COLORS: Record<MediaType, string> = {
  press: "bg-accent-600",
  radio: "bg-amber-600",
  tv: "bg-brand-600",
  video: "bg-emerald-700",
};

const TYPE_ICONS: Record<MediaType, React.ReactNode> = {
  press: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5" />
    </svg>
  ),
  radio: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 7.5l16.5-4.125M12 6.75c-2.708 0-5.363.224-7.948.655C2.999 7.58 2.25 8.507 2.25 9.574v9.176A2.25 2.25 0 0 0 4.5 21h15a2.25 2.25 0 0 0 2.25-2.25V9.574c0-1.067-.75-1.994-1.802-2.169A48.329 48.329 0 0 0 12 6.75Zm-1.683 6.443-.005.005-.006-.005.006-.005.005.005Zm-.005 2.127-.005-.006.005-.005.005.005-.005.006Zm-2.122-.006-.005.006-.006-.006.005-.005.006.005Zm0-2.209-.006.005-.005-.005.005-.006.006.005Zm2.127 0-.006.005-.005-.005.005-.005.006.005ZM9.75 12c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5.672-1.5 1.5-1.5 1.5.672 1.5 1.5Zm3 0h5.25M12 15h5.25M12 18h5.25" />
    </svg>
  ),
  tv: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125Z" />
    </svg>
  ),
  video: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
  ),
};

function getCta(type: MediaType, t: ReturnType<typeof useTranslations<"communication">>): string {
  switch (type) {
    case "press":
      return t("readArticle");
    case "radio":
      return t("listenProgram");
    case "tv":
      return t("watchTv");
    case "video":
      return t("watchVideo");
  }
}

function formatDate(dateStr: string, locale: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale === "es" ? "es-ES" : locale === "fr" ? "fr-FR" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

interface NewsCardProps {
  item: NewsItem;
  locale: string;
}

export function NewsCard({ item, locale }: NewsCardProps) {
  const t = useTranslations("communication");
  const ctaLabel = getCta(item.media_type, t);

  return (
    <motion.div variants={staggerItem}>
      <Card as="article" className="group overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-200">
              <span className="text-neutral-400">{TYPE_ICONS[item.media_type]}</span>
            </div>
          )}

          {/* Type badge */}
          <span
            className={cn(
              "absolute top-3 left-3 px-3 py-1 text-[10px] font-medium tracking-[0.15em] uppercase text-white flex items-center gap-1.5",
              TYPE_COLORS[item.media_type]
            )}
          >
            {TYPE_ICONS[item.media_type]}
            {t(item.media_type)}
          </span>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 flex flex-col flex-1">
          {/* Date */}
          <time
            dateTime={item.date}
            className="text-xs text-neutral-400 tracking-wide uppercase mb-2"
          >
            {formatDate(item.date, locale)}
          </time>

          {/* Title */}
          <h3 className="font-display text-lg sm:text-xl font-semibold text-neutral-900 mb-2 line-clamp-2 leading-snug">
            {item.title}
          </h3>

          {/* Description */}
          {item.description && (
            <p className="text-sm text-neutral-500 line-clamp-3 mb-4 flex-1">
              {item.description}
            </p>
          )}

          {/* CTA */}
          {item.link_url && (
            <a
              href={item.link_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.15em] uppercase text-brand-600 hover:text-brand-700 transition-colors mt-auto group/link"
              aria-label={`${ctaLabel}: ${item.title}`}
            >
              {ctaLabel}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-3.5 h-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5"
              >
                <path
                  fillRule="evenodd"
                  d="M5.22 14.78a.75.75 0 0 0 1.06 0l7.22-7.22v5.69a.75.75 0 0 0 1.5 0v-7.5a.75.75 0 0 0-.75-.75h-7.5a.75.75 0 0 0 0 1.5h5.69l-7.22 7.22a.75.75 0 0 0 0 1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
