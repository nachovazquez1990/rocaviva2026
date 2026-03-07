import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";

export default function LocaleNotFound() {
  const t = useTranslations("notFound");

  return (
    <html>
      <body className="font-sans antialiased bg-neutral-50 text-neutral-900">
        <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
          <span className="font-display text-[8rem] sm:text-[12rem] font-bold leading-none text-brand-100 select-none">
            404
          </span>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 -mt-6 sm:-mt-10">
            {t("title")}
          </h1>

          <p className="text-neutral-500 text-base sm:text-lg max-w-md mt-4">
            {t("description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <Link
              href="/"
              className="inline-block px-8 py-3.5 text-xs font-medium tracking-[0.15em] uppercase bg-brand-600 text-white hover:bg-brand-700 transition-colors duration-300"
            >
              {t("backHome")}
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
