import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { HeroSection } from "@/components/home/hero-section";
import { AboutSection } from "@/components/home/about-section";
import { ServicesSection } from "@/components/home/services-section";
import { ContactSection } from "@/components/home/contact-section";
import { InstagramFeed } from "@/components/home/instagram-feed";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  const url = `https://rocaviva.eu/${locale}`;

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: url,
      languages: {
        es: "https://rocaviva.eu/es",
        en: "https://rocaviva.eu/en",
        fr: "https://rocaviva.eu/fr",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url,
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
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <InstagramFeed />
      <ContactSection />
    </>
  );
}
