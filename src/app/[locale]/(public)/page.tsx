import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getLocalizedField } from "@/lib/supabase/types";
import type { HomeContentMap } from "@/lib/supabase/types";
import { HeroSection } from "@/components/home/hero-section";

// Below-fold sections: lazy-loaded to reduce initial JS bundle
const AboutSection = dynamic(
  () =>
    import("@/components/home/about-section").then((m) => ({
      default: m.AboutSection,
    })),
  { ssr: true },
);
const ServicesSection = dynamic(
  () =>
    import("@/components/home/services-section").then((m) => ({
      default: m.ServicesSection,
    })),
  { ssr: true },
);
const InstagramFeed = dynamic(
  () =>
    import("@/components/home/instagram-feed").then((m) => ({
      default: m.InstagramFeed,
    })),
  { ssr: true },
);
const ContactSection = dynamic(
  () =>
    import("@/components/home/contact-section").then((m) => ({
      default: m.ContactSection,
    })),
  { ssr: true },
);

type Props = {
  params: Promise<{ locale: string }>;
};

async function getHomeContent(locale: string): Promise<HomeContentMap> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("home_content").select("*");
    const map: HomeContentMap = {};
    for (const item of data || []) {
      const value = getLocalizedField(item, "value", locale);
      if (value) map[item.key] = value;
    }
    return map;
  } catch {
    return {};
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://rocaviva.eu";
  const canonicalPath = locale === "es" ? "/" : `/${locale}`;

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `${baseUrl}${canonicalPath}`,
      languages: {
        es: `${baseUrl}/`,
        en: `${baseUrl}/en`,
        fr: `${baseUrl}/fr`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${baseUrl}${canonicalPath}`,
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
