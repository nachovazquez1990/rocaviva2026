import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getLocalizedField } from "@/lib/supabase/types";
import type { Exhibition, ExhibitionImage, Project } from "@/lib/supabase/types";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProjectHero } from "@/components/projects/project-hero";
import { ExhibitionContent } from "@/components/projects/exhibition-content";

export const revalidate = 3600;

type Props = {
  params: Promise<{ locale: string; slug: string; exhibition: string }>;
};

// --- Data fetching ---

async function getProject(slug: string): Promise<Project | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
}

async function getExhibition(
  projectId: string,
  exhibitionSlug: string
): Promise<Exhibition | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("exhibitions")
      .select("*")
      .eq("project_id", projectId)
      .eq("slug", exhibitionSlug)
      .eq("is_published", true)
      .single();

    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
}

async function getExhibitionImages(
  exhibitionId: string
): Promise<ExhibitionImage[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("exhibition_images")
      .select("*")
      .eq("exhibition_id", exhibitionId)
      .order("display_order", { ascending: true });

    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}

// --- Mock data ---
// Uses the same exhibition list as the project detail page so every timeline
// link resolves. Exhibitions without detailed mock data get a generated fallback.

type MockExhibitionBase = {
  slug: string;
  city: string;
  venue: string | null;
  dateFrom: string | null;
  dateTo: string | null;
};

type MockExhibitionResolved = MockExhibitionBase & {
  description: Record<string, string>;
  gradient: string;
  images: { url: string; alt: string }[];
};

type MockProjectRef = {
  slug: string;
  title: Record<string, string>;
  gradient: string;
  exhibitions: MockExhibitionBase[];
};

// All projects and exhibitions — mirrors the project detail page mock data
const MOCK_PROJECTS: MockProjectRef[] = [
  {
    slug: "mujeres-nobel",
    title: { es: "Mujeres Nobel", en: "Nobel Women", fr: "Femmes Nobel" },
    gradient: "from-brand-800 via-brand-900 to-neutral-900",
    exhibitions: [
      { slug: "madrid-2018", city: "Madrid", venue: "Museo Nacional de Ciencias Naturales", dateFrom: "15/03/2018", dateTo: "20/09/2019" },
      { slug: "barcelona-2019", city: "Barcelona", venue: "CosmoCaixa", dateFrom: "10/10/2019", dateTo: "15/12/2019" },
      { slug: "valencia-2019", city: "Valencia", venue: "Museo de las Ciencias", dateFrom: "20/01/2020", dateTo: "30/06/2020" },
      { slug: "sevilla-2020", city: "Sevilla", venue: "Casa de la Ciencia", dateFrom: "15/09/2020", dateTo: "20/12/2020" },
      { slug: "toledo-2020", city: "Toledo", venue: "Centro Cultural San Marcos", dateFrom: "10/01/2021", dateTo: "30/04/2021" },
      { slug: "zaragoza-2021", city: "Zaragoza", venue: "CaixaForum", dateFrom: "15/05/2021", dateTo: "30/09/2021" },
      { slug: "bilbao-2022", city: "Bilbao", venue: "Biblioteca de Bidebarrieta", dateFrom: "10/02/2022", dateTo: "20/06/2022" },
      { slug: "valladolid-2023", city: "Valladolid", venue: "Museo de la Ciencia", dateFrom: "05/01/2023", dateTo: "15/04/2023" },
      { slug: "cracovia-2023", city: "Cracovia", venue: "Muzeum Narodowe", dateFrom: "01/09/2023", dateTo: "15/02/2024" },
      { slug: "oslo-2024", city: "Oslo", venue: "Nobel Peace Center", dateFrom: "01/04/2024", dateTo: "30/07/2024" },
      { slug: "estocolmo-2025", city: "Estocolmo", venue: "Nobel Prize Museum", dateFrom: "10/01/2025", dateTo: "30/05/2025" },
    ],
  },
  {
    slug: "marie-curie",
    title: { es: "Maria Sklodowska-Curie. Una polaca en Paris", en: "Maria Sklodowska-Curie. A Polish Woman in Paris", fr: "Maria Sklodowska-Curie. Une Polonaise a Paris" },
    gradient: "from-accent-800 via-accent-900 to-neutral-900",
    exhibitions: [
      { slug: "paris-2015", city: "Paris", venue: "Institut Curie", dateFrom: "07/11/2015", dateTo: "28/02/2016" },
      { slug: "varsovia-2016", city: "Varsovia", venue: "Museo Maria Sklodowska-Curie", dateFrom: "15/04/2016", dateTo: "30/07/2016" },
      { slug: "madrid-2017", city: "Madrid", venue: "Residencia de Estudiantes", dateFrom: "10/01/2017", dateTo: "20/05/2017" },
      { slug: "cracovia-2017", city: "Cracovia", venue: "Universidad Jagellonica", dateFrom: "15/09/2017", dateTo: "28/02/2018" },
      { slug: "barcelona-2018", city: "Barcelona", venue: "Museo de Historia de Cataluna", dateFrom: "20/04/2018", dateTo: "15/01/2019" },
      { slug: "toledo-2019", city: "Toledo", venue: "Centro Cultural San Marcos", dateFrom: "01/03/2019", dateTo: "30/06/2019" },
    ],
  },
  {
    slug: "teresa-de-jesus",
    title: { es: "Teresa de Jesus. Corazon en Espana, alma en America", en: "Teresa de Jesus. Heart in Spain, Soul in the Americas", fr: "Teresa de Jesus. Coeur en Espagne, ame en Amerique" },
    gradient: "from-amber-800 via-amber-900 to-neutral-900",
    exhibitions: [
      { slug: "avila-2015", city: "Avila", venue: "Centro de Interpretacion del Misticismo", dateFrom: "15/10/2015", dateTo: "20/12/2015" },
      { slug: "toledo-2015", city: "Toledo", venue: "Convento de Santo Domingo el Antiguo", dateFrom: "10/01/2016", dateTo: "30/04/2016" },
      { slug: "madrid-2016", city: "Madrid", venue: "Biblioteca Nacional", dateFrom: "15/05/2016", dateTo: "30/09/2016" },
      { slug: "sevilla-2017", city: "Sevilla", venue: "Archivo General de Indias", dateFrom: "10/02/2017", dateTo: "20/06/2017" },
      { slug: "mexico-2017", city: "Mexico DF", venue: "Museo del Carmen", dateFrom: "01/09/2017", dateTo: "15/03/2018" },
    ],
  },
  {
    slug: "astronautas",
    title: { es: "Mujeres Astronautas", en: "Women Astronauts", fr: "Femmes Astronautes" },
    gradient: "from-indigo-800 via-indigo-900 to-neutral-900",
    exhibitions: [
      { slug: "madrid-2022", city: "Madrid", venue: "Museo Nacional de Ciencia y Tecnologia", dateFrom: "20/03/2022", dateTo: "15/01/2023" },
      { slug: "barcelona-2023", city: "Barcelona", venue: "Museu de la Ciencia", dateFrom: "01/03/2023", dateTo: "30/07/2023" },
      { slug: "valencia-2024", city: "Valencia", venue: "Ciudad de las Artes y las Ciencias", dateFrom: "15/01/2024", dateTo: "30/06/2024" },
    ],
  },
  {
    slug: "concha-espina",
    title: { es: "Concha Espina. Luz y tiniebla", en: "Concha Espina. Light and Darkness", fr: "Concha Espina. Lumiere et tenebres" },
    gradient: "from-emerald-800 via-emerald-900 to-neutral-900",
    exhibitions: [
      { slug: "santander-2019", city: "Santander", venue: "Palacio de Festivales", dateFrom: "01/06/2019", dateTo: "30/09/2019" },
      { slug: "madrid-2020", city: "Madrid", venue: "Ateneo de Madrid", dateFrom: "15/01/2020", dateTo: "20/06/2020" },
      { slug: "barcelona-2021", city: "Barcelona", venue: "Ateneu Barcelones", dateFrom: "10/02/2021", dateTo: "30/07/2021" },
      { slug: "valladolid-2022", city: "Valladolid", venue: "Palacio de Santa Cruz", dateFrom: "01/03/2022", dateTo: "15/09/2022" },
    ],
  },
];

function getMockData(
  projectSlug: string,
  exhibitionSlug: string
): { project: MockProjectRef; exhibition: MockExhibitionResolved } | null {
  const project = MOCK_PROJECTS.find((p) => p.slug === projectSlug);
  if (!project) return null;

  const base = project.exhibitions.find((e) => e.slug === exhibitionSlug);
  if (!base) return null;

  // Generate placeholder images and description from base data
  const exhibition: MockExhibitionResolved = {
    ...base,
    gradient: project.gradient,
    description: {
      es: `La exposicion ${project.title.es} se presento en ${base.city}${base.venue ? `, en ${base.venue}` : ""}. La muestra ofrecio al publico local la oportunidad de conocer de cerca este proyecto cultural de Rocaviva Eventos.\n\nDurante su estancia se organizaron visitas guiadas, conferencias y actividades educativas complementarias.`,
      en: `The ${project.title.en} exhibition was presented in ${base.city}${base.venue ? ` at ${base.venue}` : ""}. The exhibition offered the local public the opportunity to experience this cultural project by Rocaviva Eventos up close.\n\nDuring its stay, guided tours, conferences and complementary educational activities were organized.`,
      fr: `L'exposition ${project.title.fr} a ete presentee a ${base.city}${base.venue ? `, au ${base.venue}` : ""}. L'exposition a offert au public local l'opportunite de decouvrir de pres ce projet culturel de Rocaviva Eventos.\n\nPendant son sejour, des visites guidees, des conferences et des activites educatives complementaires ont ete organisees.`,
    },
    images: Array.from({ length: 4 }, (_, i) => ({
      url: `https://picsum.photos/seed/${projectSlug}-${exhibitionSlug}-${i + 1}/800/600`,
      alt: `${project.title.es} - ${base.city} (${i + 1})`,
    })),
  };

  return { project, exhibition };
}

// --- Metadata ---

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug, exhibition: exhibitionSlug } = await params;

  const project = await getProject(slug);
  const dbExhibition =
    project && (await getExhibition(project.id, exhibitionSlug));

  const mock = !dbExhibition ? getMockData(slug, exhibitionSlug) : null;

  const projectTitle = project
    ? getLocalizedField(project, "title", locale)
    : mock?.project.title[locale] ?? mock?.project.title.es ?? slug;

  const city = dbExhibition?.city ?? mock?.exhibition.city ?? exhibitionSlug;
  const venue = dbExhibition?.venue ?? mock?.exhibition.venue ?? "";

  const title = `${city}${venue ? ` - ${venue}` : ""}`;

  const description = dbExhibition
    ? getLocalizedField(dbExhibition, "description", locale)
    : mock?.exhibition.description[locale] ??
      mock?.exhibition.description.es ??
      "";

  const url = `https://rocaviva.eu/${locale}/projects/${slug}/${exhibitionSlug}`;

  return {
    title: `${title} | ${projectTitle} | Rocaviva Eventos`,
    description: description.slice(0, 160) || `${projectTitle} - ${city}`,
    alternates: {
      canonical: url,
      languages: {
        es: `https://rocaviva.eu/es/projects/${slug}/${exhibitionSlug}`,
        en: `https://rocaviva.eu/en/projects/${slug}/${exhibitionSlug}`,
        fr: `https://rocaviva.eu/fr/projects/${slug}/${exhibitionSlug}`,
      },
    },
    openGraph: {
      title: `${title} | ${projectTitle} | Rocaviva Eventos`,
      description: description.slice(0, 160) || `${projectTitle} - ${city}`,
      url,
      siteName: "Rocaviva Eventos",
      locale: locale === "es" ? "es_ES" : locale === "fr" ? "fr_FR" : "en_US",
      type: "website",
      ...(dbExhibition?.image_url
        ? { images: [{ url: dbExhibition.image_url }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${projectTitle}`,
      description: description.slice(0, 160) || `${projectTitle} - ${city}`,
    },
  };
}

// --- Page ---

export default async function ExhibitionDetailPage({ params }: Props) {
  const { locale, slug, exhibition: exhibitionSlug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "projects" });

  // Try Supabase
  const project = await getProject(slug);
  const dbExhibition =
    project && (await getExhibition(project.id, exhibitionSlug));

  // Mock fallback
  const mock = !dbExhibition ? getMockData(slug, exhibitionSlug) : null;

  if (!dbExhibition && !mock) {
    notFound();
  }

  // Resolve data
  const projectTitle = project
    ? getLocalizedField(project, "title", locale)
    : mock!.project.title[locale] ?? mock!.project.title.es;

  const city = dbExhibition?.city ?? mock!.exhibition.city;
  const venue = dbExhibition?.venue ?? mock!.exhibition.venue;
  const dateFrom = dbExhibition?.date_from ?? mock!.exhibition.dateFrom;
  const dateTo = dbExhibition?.date_to ?? mock!.exhibition.dateTo;

  const description = dbExhibition
    ? getLocalizedField(dbExhibition, "description", locale)
    : mock!.exhibition.description[locale] ??
      mock!.exhibition.description.es ??
      "";

  const imageUrl = dbExhibition?.image_url ?? null;
  const gradient = !imageUrl
    ? mock?.exhibition.gradient ??
      "from-neutral-800 via-neutral-900 to-accent-900"
    : null;

  // Exhibition images
  const dbImages = dbExhibition
    ? await getExhibitionImages(dbExhibition.id)
    : [];
  const galleryImages =
    dbImages.length > 0
      ? dbImages.map((img) => ({
          url: img.image_url,
          alt: getLocalizedField(img, "alt", locale) || city,
        }))
      : mock?.exhibition.images ?? [];

  // Hero title: City name
  const heroTitle = city;

  // Breadcrumbs
  const breadcrumbItems = [
    { label: t("title"), href: `/projects` },
    { label: projectTitle, href: `/projects/${slug}` },
    { label: city },
  ];

  // JSON-LD ExhibitionEvent with location
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ExhibitionEvent",
    name: `${projectTitle} - ${city}`,
    description: description.slice(0, 300) || `${projectTitle} - ${city}`,
    url: `https://rocaviva.eu/${locale}/projects/${slug}/${exhibitionSlug}`,
    ...(imageUrl ? { image: imageUrl } : {}),
    ...(dateFrom ? { startDate: dateFrom } : {}),
    ...(dateTo ? { endDate: dateTo } : {}),
    location: {
      "@type": "Place",
      name: venue ?? city,
      address: {
        "@type": "PostalAddress",
        addressLocality: city,
      },
    },
    organizer: {
      "@type": "Organization",
      name: "Rocaviva Eventos",
      url: "https://rocaviva.eu",
    },
    superEvent: {
      "@type": "ExhibitionEvent",
      name: projectTitle,
      url: `https://rocaviva.eu/${locale}/projects/${slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <ProjectHero title={heroTitle} imageUrl={imageUrl} gradient={gradient} />

      {/* Content */}
      <main className="bg-neutral-50">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 md:px-12 py-12 sm:py-16 md:py-20">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} />

          {/* Exhibition Content */}
          <ExhibitionContent
            projectTitle={projectTitle}
            city={city}
            venue={venue}
            dateFrom={dateFrom}
            dateTo={dateTo}
            description={description}
            galleryImages={galleryImages}
            galleryTitle={`${projectTitle} - ${city}`}
            projectSlug={slug}
            backLabel={t("backToProject")}
            galleryLabel={t("gallery")}
            fromLabel={t("from")}
            toLabel={t("to")}
            venueLabel={t("venue")}
            datesLabel={t("dates")}
          />
        </div>
      </main>
    </>
  );
}
