import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getLocalizedField } from "@/lib/supabase/types";
import type { Project } from "@/lib/supabase/types";
import {
  ProjectCarousel,
  type CarouselProject,
  type CarouselExhibition,
} from "@/components/projects/project-carousel";

export const revalidate = 3600;

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });
  const tMeta = await getTranslations({ locale, namespace: "metadata" });

  const url = `https://rocaviva.eu/${locale}/projects`;

  return {
    title: `${t("title")} | Rocaviva Eventos`,
    description: tMeta("projectsDescription"),
    alternates: {
      canonical: url,
      languages: {
        es: "https://rocaviva.eu/es/projects",
        en: "https://rocaviva.eu/en/projects",
        fr: "https://rocaviva.eu/fr/projects",
      },
    },
    openGraph: {
      title: `${t("title")} | Rocaviva Eventos`,
      description: tMeta("projectsDescription"),
      url,
      siteName: "Rocaviva Eventos",
      locale: locale === "es" ? "es_ES" : locale === "fr" ? "fr_FR" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${t("title")} | Rocaviva Eventos`,
      description: tMeta("projectsDescription"),
    },
  };
}

async function getProjects(): Promise<Project[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("is_published", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching projects:", error.message);
      return [];
    }

    return data ?? [];
  } catch {
    return [];
  }
}

// --- Mock data for dev/preview when Supabase is empty ---

type MockProject = {
  slug: string;
  title: string;
  gradient: string;
  exhibitions: CarouselExhibition[];
};

const MOCK_EXHIBITIONS: Record<string, CarouselExhibition[]> = {
  "mujeres-nobel": [
    { slug: "madrid-2018", city: "Madrid", dateFrom: "15/03/18", dateTo: "20/09/19" },
    { slug: "barcelona-2019", city: "Barcelona", dateFrom: "10/10/19", dateTo: "15/12/19" },
    { slug: "valencia-2019", city: "Valencia", dateFrom: "20/01/20", dateTo: "30/06/20" },
    { slug: "sevilla-2020", city: "Sevilla", dateFrom: "15/09/20", dateTo: "20/12/20" },
    { slug: "toledo-2020", city: "Toledo", dateFrom: "10/01/21", dateTo: "30/04/21" },
    { slug: "zaragoza-2021", city: "Zaragoza", dateFrom: "15/05/21", dateTo: "30/09/21" },
    { slug: "bilbao-2022", city: "Bilbao", dateFrom: "10/02/22", dateTo: "20/06/22" },
    { slug: "valladolid-2023", city: "Valladolid", dateFrom: "05/01/23", dateTo: "15/04/23" },
    { slug: "cracovia-2023", city: "Cracovia", dateFrom: "01/09/23", dateTo: "15/02/24" },
    { slug: "oslo-2024", city: "Oslo", dateFrom: "01/04/24", dateTo: "30/07/24" },
    { slug: "estocolmo-2025", city: "Estocolmo", dateFrom: "10/01/25", dateTo: "30/05/25" },
  ],
  "marie-curie": [
    { slug: "paris-2015", city: "Paris", dateFrom: "07/11/15", dateTo: "28/02/16" },
    { slug: "varsovia-2016", city: "Varsovia", dateFrom: "15/04/16", dateTo: "30/07/16" },
    { slug: "madrid-2017", city: "Madrid", dateFrom: "10/01/17", dateTo: "20/05/17" },
    { slug: "cracovia-2017", city: "Cracovia", dateFrom: "15/09/17", dateTo: "28/02/18" },
    { slug: "barcelona-2018", city: "Barcelona", dateFrom: "20/04/18", dateTo: "15/01/19" },
    { slug: "toledo-2019", city: "Toledo", dateFrom: "01/03/19", dateTo: "30/06/19" },
  ],
  "teresa-de-jesus": [
    { slug: "avila-2015", city: "Avila", dateFrom: "15/10/15", dateTo: "20/12/15" },
    { slug: "toledo-2015", city: "Toledo", dateFrom: "10/01/16", dateTo: "30/04/16" },
    { slug: "madrid-2016", city: "Madrid", dateFrom: "15/05/16", dateTo: "30/09/16" },
    { slug: "sevilla-2017", city: "Sevilla", dateFrom: "10/02/17", dateTo: "20/06/17" },
    { slug: "mexico-2017", city: "Mexico DF", dateFrom: "01/09/17", dateTo: "15/03/18" },
  ],
  astronautas: [
    { slug: "madrid-2022", city: "Madrid", dateFrom: "20/03/22", dateTo: "15/01/23" },
    { slug: "barcelona-2023", city: "Barcelona", dateFrom: "01/03/23", dateTo: "30/07/23" },
    { slug: "valencia-2024", city: "Valencia", dateFrom: "15/01/24", dateTo: "30/06/24" },
  ],
  "concha-espina": [
    { slug: "santander-2019", city: "Santander", dateFrom: "01/06/19", dateTo: "30/09/19" },
    { slug: "madrid-2020", city: "Madrid", dateFrom: "15/01/20", dateTo: "20/06/20" },
    { slug: "barcelona-2021", city: "Barcelona", dateFrom: "10/02/21", dateTo: "30/07/21" },
    { slug: "valladolid-2022", city: "Valladolid", dateFrom: "01/03/22", dateTo: "15/09/22" },
  ],
};

const MOCK_PROJECTS: Record<string, MockProject[]> = {
  es: [
    { slug: "mujeres-nobel", title: "Mujeres Nobel", gradient: "from-brand-800 via-brand-900 to-neutral-900", exhibitions: MOCK_EXHIBITIONS["mujeres-nobel"] },
    { slug: "marie-curie", title: "Maria Sklodowska-Curie. Una polaca en Paris", gradient: "from-accent-800 via-accent-900 to-neutral-900", exhibitions: MOCK_EXHIBITIONS["marie-curie"] },
    { slug: "teresa-de-jesus", title: "Teresa de Jesus. Corazon en Espana, alma en America", gradient: "from-amber-800 via-amber-900 to-neutral-900", exhibitions: MOCK_EXHIBITIONS["teresa-de-jesus"] },
    { slug: "astronautas", title: "Mujeres Astronautas", gradient: "from-indigo-800 via-indigo-900 to-neutral-900", exhibitions: MOCK_EXHIBITIONS["astronautas"] },
    { slug: "concha-espina", title: "Concha Espina. Luz y tiniebla", gradient: "from-emerald-800 via-emerald-900 to-neutral-900", exhibitions: MOCK_EXHIBITIONS["concha-espina"] },
  ],
  en: [
    { slug: "mujeres-nobel", title: "Nobel Women", gradient: "from-brand-800 via-brand-900 to-neutral-900", exhibitions: MOCK_EXHIBITIONS["mujeres-nobel"] },
    { slug: "marie-curie", title: "Maria Sklodowska-Curie. A Polish Woman in Paris", gradient: "from-accent-800 via-accent-900 to-neutral-900", exhibitions: MOCK_EXHIBITIONS["marie-curie"] },
    { slug: "teresa-de-jesus", title: "Teresa de Jesus. Heart in Spain, Soul in the Americas", gradient: "from-amber-800 via-amber-900 to-neutral-900", exhibitions: MOCK_EXHIBITIONS["teresa-de-jesus"] },
    { slug: "astronautas", title: "Women Astronauts", gradient: "from-indigo-800 via-indigo-900 to-neutral-900", exhibitions: MOCK_EXHIBITIONS["astronautas"] },
    { slug: "concha-espina", title: "Concha Espina. Light and Darkness", gradient: "from-emerald-800 via-emerald-900 to-neutral-900", exhibitions: MOCK_EXHIBITIONS["concha-espina"] },
  ],
  fr: [
    { slug: "mujeres-nobel", title: "Femmes Nobel", gradient: "from-brand-800 via-brand-900 to-neutral-900", exhibitions: MOCK_EXHIBITIONS["mujeres-nobel"] },
    { slug: "marie-curie", title: "Maria Sklodowska-Curie. Une Polonaise a Paris", gradient: "from-accent-800 via-accent-900 to-neutral-900", exhibitions: MOCK_EXHIBITIONS["marie-curie"] },
    { slug: "teresa-de-jesus", title: "Teresa de Jesus. Coeur en Espagne, ame en Amerique", gradient: "from-amber-800 via-amber-900 to-neutral-900", exhibitions: MOCK_EXHIBITIONS["teresa-de-jesus"] },
    { slug: "astronautas", title: "Femmes Astronautes", gradient: "from-indigo-800 via-indigo-900 to-neutral-900", exhibitions: MOCK_EXHIBITIONS["astronautas"] },
    { slug: "concha-espina", title: "Concha Espina. Lumiere et tenebres", gradient: "from-emerald-800 via-emerald-900 to-neutral-900", exhibitions: MOCK_EXHIBITIONS["concha-espina"] },
  ],
};

// --- End mock data ---

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "projects" });
  const projects = await getProjects();

  const useMock = projects.length === 0;

  const carouselProjects: CarouselProject[] = useMock
    ? (MOCK_PROJECTS[locale] ?? MOCK_PROJECTS.es).map((m) => ({
        slug: m.slug,
        title: m.title,
        image_url: null,
        gradient: m.gradient,
        exhibitions: m.exhibitions,
      }))
    : projects.map((p) => ({
        slug: p.slug,
        title: getLocalizedField(p, "title", locale),
        image_url: p.image_url,
        gradient: null,
        exhibitions: [], // TODO: fetch from exhibitions table
      }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("title"),
    url: `https://rocaviva.eu/${locale}/projects`,
    isPartOf: {
      "@type": "WebSite",
      name: "Rocaviva Eventos",
      url: "https://rocaviva.eu",
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: carouselProjects.length,
      itemListElement: carouselProjects.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: p.title,
        url: `https://rocaviva.eu/${locale}/projects/${p.slug}`,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProjectCarousel projects={carouselProjects} />
    </>
  );
}
