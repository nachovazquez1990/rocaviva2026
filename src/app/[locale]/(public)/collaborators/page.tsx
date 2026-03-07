import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import type { Collaborator } from "@/lib/supabase/types";
import { LogoGrid, type CollaboratorItem } from "@/components/collaborators/logo-grid";
import { LogoMarquee } from "@/components/collaborators/logo-marquee";

export const revalidate = 3600;

type Props = {
  params: Promise<{ locale: string }>;
};

// --- Data fetching ---

async function getCollaborators(): Promise<Collaborator[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("collaborators")
      .select("*")
      .eq("is_published", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching collaborators:", error.message);
      return [];
    }

    return data ?? [];
  } catch {
    return [];
  }
}

// --- Mock data ---

const MOCK_COLLABORATORS: CollaboratorItem[] = Array.from({ length: 24 }, (_, i) => ({
  id: `mock-${i + 1}`,
  name: [
    "Museo Nobel de Estocolmo",
    "Instituto Nobel de Oslo",
    "Universidad Complutense de Madrid",
    "Embajada de Francia en Espana",
    "Embajada de Polonia en Espana",
    "Fundacion Ramon Areces",
    "Real Academia de Ciencias",
    "Instituto Cervantes",
    "Ministerio de Cultura",
    "Ayuntamiento de Madrid",
    "Comunidad de Madrid",
    "Fundacion Telefonica",
    "Hospital 12 de Octubre",
    "CSIC",
    "UNESCO",
    "Embajada de Suecia",
    "Fundacion Carolina",
    "Casa de America",
    "Instituto Polaco de Cultura",
    "Museo Nacional de Ciencias Naturales",
    "Biblioteca Nacional de Espana",
    "Real Jardin Botanico",
    "Fundacion BBVA",
    "Embajada de Noruega",
  ][i],
  logo_url: `https://picsum.photos/seed/collab-${i + 1}/200/120`,
  website_url: i % 5 === 4 ? null : `https://example.com/collaborator-${i + 1}`,
}));

// --- Metadata ---

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "collaborators" });

  const url = `https://rocaviva.eu/${locale}/collaborators`;
  const description =
    locale === "es"
      ? "Instituciones y entidades colaboradoras de Rocaviva Eventos en sus exposiciones culturales."
      : locale === "fr"
        ? "Institutions et organismes partenaires de Rocaviva Eventos dans ses expositions culturelles."
        : "Partner institutions and organizations of Rocaviva Eventos in their cultural exhibitions.";

  return {
    title: `${t("title")} | Rocaviva Eventos`,
    description,
    alternates: {
      canonical: url,
      languages: {
        es: "https://rocaviva.eu/es/collaborators",
        en: "https://rocaviva.eu/en/collaborators",
        fr: "https://rocaviva.eu/fr/collaborators",
      },
    },
    openGraph: {
      title: `${t("title")} | Rocaviva Eventos`,
      description,
      url,
      siteName: "Rocaviva Eventos",
      locale: locale === "es" ? "es_ES" : locale === "fr" ? "fr_FR" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${t("title")} | Rocaviva Eventos`,
    },
  };
}

// --- Page ---

export default async function CollaboratorsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "collaborators" });

  const dbCollaborators = await getCollaborators();
  const useMock = dbCollaborators.length === 0;

  const collaborators: CollaboratorItem[] = useMock
    ? MOCK_COLLABORATORS
    : dbCollaborators.map((c) => ({
        id: c.id,
        name: c.name,
        logo_url: c.logo_url,
        website_url: c.website_url,
      }));

  // JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("title"),
    url: `https://rocaviva.eu/${locale}/collaborators`,
    isPartOf: {
      "@type": "WebSite",
      name: "Rocaviva Eventos",
      url: "https://rocaviva.eu",
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: collaborators.length,
      itemListElement: collaborators.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Organization",
          name: c.name,
          logo: c.logo_url,
          ...(c.website_url ? { url: c.website_url } : {}),
        },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="bg-neutral-50 min-h-screen">
        {/* Page header */}
        <div className="bg-white border-b border-neutral-100">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-12 py-12 sm:py-16 md:py-20">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-900">
              {t("title")}
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-neutral-500 max-w-2xl">
              {t("subtitle")}
            </p>
          </div>
        </div>

        {/* Marquee banner */}
        <div className="bg-white border-b border-neutral-100">
          <div className="max-w-[100vw] mx-auto">
            <LogoMarquee
              collaborators={collaborators}
              visitWebsiteLabel={t("visitWebsite")}
            />
          </div>
        </div>

        {/* Logo grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20">
          <LogoGrid
            collaborators={collaborators}
            visitWebsiteLabel={t("visitWebsite")}
          />
        </div>
      </section>
    </>
  );
}
