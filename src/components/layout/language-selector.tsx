"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";

const localeLabels: Record<Locale, string> = {
  es: "ES",
  en: "EN",
  fr: "FR",
};

interface LanguageSelectorProps {
  variant?: "default" | "light";
  size?: "default" | "lg";
}

export function LanguageSelector({ variant = "default", size = "default" }: LanguageSelectorProps) {
  const currentLocale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  const handleChange = (locale: Locale) => {
    router.replace(pathname, { locale });
  };

  const isLight = variant === "light";
  const isLg = size === "lg";

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Language selector">
      {(Object.entries(localeLabels) as [Locale, string][]).map(([locale, label], i) => (
        <span key={locale} className="flex items-center">
          {i > 0 && (
            <span
              className={cn(
                "mx-1",
                isLg ? "text-base" : "text-xs",
                isLight ? "text-white/30" : "text-neutral-300"
              )}
              aria-hidden="true"
            >
              /
            </span>
          )}
          <button
            onClick={() => handleChange(locale)}
            aria-label={`Switch to ${label}`}
            aria-current={locale === currentLocale ? "true" : undefined}
            className={cn(
              "font-medium tracking-wider transition-colors",
              isLg ? "text-base" : "text-xs",
              isLight
                ? locale === currentLocale
                  ? "text-white"
                  : "text-white/50 hover:text-white"
                : locale === currentLocale
                  ? "text-brand-600"
                  : "text-neutral-400 hover:text-neutral-900"
            )}
          >
            {label}
          </button>
        </span>
      ))}
    </div>
  );
}
