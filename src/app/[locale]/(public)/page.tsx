import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getLocalizedField } from "@/lib/supabase/types";
import { HeroSection } from "@/components/home/hero-section";
import { AboutSection } from "@/components/home/about-section";
import { ServicesSection } from "@/components/home/services-section";
import { ContactSection } from "@/components/home/contact-section";
import { InstagramFeed } from "@/components/home/instagram-feed";

export type HomeContentMap = Record<string, string>;

type Props = {
  params: Promise<{ locale: string }>;
};

async function getHomeContent(locale: string): Promise<HomeContentMap> {
  const supabase = await createClient();
  const { data } = await supabase.from("home_content").select("*");
  const map: HomeContentMap = {};
  for (const item of data || []) {
    const value = getLocalizedField(item, "value", locale);
    if (value) map[item.key] = value;
  }
  return map;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  const canonicalPath = locale === "es" ? "/" : `/${locale}`;

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: canonicalPath,
      languages: {
        es: "/",
        en: "/en",
        fr: "/fr",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: canonicalPath,
      siteName: "Rocaviva Eventos",
      locale: locale === "es" ? "es_ES" : locale === "fr" ? "fr_FR" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const content = await getHomeContent(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Rocaviva Eventos",
    url: "https://rocaviva.eu",
    logo: "https://rocaviva.eu/images/rocaviva_logo.svg",
    description:
      "Empresa de divulgacion cultural especializada en la difusion de personajes historicos.",
    foundingDate: "2005",
    email: "eventos@rocaviva.eu",
    telephone: ["+34925474267", "+34686519372"],
    sameAs: [
      "https://facebook.com/RocavivaEventos/",
      "https://instagram.com/rocavivaeventos",
      "https://twitter.com/rocaviva_",
      "https://youtube.com/@rocavivaeventos",
      "https://linkedin.com/company/rocaviva-eventos/",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection content={content} />
      <AboutSection content={content} />
      <ServicesSection content={content} />
      <InstagramFeed content={content} />
      <ContactSection content={content} />
    </>
  );
}
