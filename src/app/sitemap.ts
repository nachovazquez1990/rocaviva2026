import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rocaviva.eu";

const staticPages = [
  "",
  "/projects",
  "/communication",
  "/books",
  "/collaborators",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of staticPages) {
    for (const locale of locales) {
      entries.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === "" ? "weekly" : "monthly",
        priority: page === "" ? 1.0 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${BASE_URL}/${l}${page}`])
          ),
        },
      });
    }
  }

  return entries;
}
