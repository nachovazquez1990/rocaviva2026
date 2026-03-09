import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getLocalizedField } from "@/lib/supabase/types";
import type { Project, Exhibition, ProjectImage } from "@/lib/supabase/types";
import { formatDate } from "@/lib/utils";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProjectHero } from "@/components/projects/project-hero";
import { ProjectContent } from "@/components/projects/project-content";

export const revalidate = 3600;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
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

async function getExhibitions(projectId: string): Promise<Exhibition[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("exhibitions")
      .select("*")
      .eq("project_id", projectId)
      .eq("is_published", true)
      .order("date_from", { ascending: true });

    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}

async function getProjectImages(projectId: string): Promise<ProjectImage[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("project_images")
      .select("*")
      .eq("project_id", projectId)
      .order("display_order", { ascending: true });

    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}

// --- Mock data ---

type MockProjectDetail = {
  slug: string;
  title: Record<string, string>;
  description: Record<string, string>;
  gradient: string;
  dossierUrl: string | null;
  exhibitions: {
    slug: string;
    city: string;
    venue: string | null;
    dateFrom: string | null;
    dateTo: string | null;
  }[];
  images: { url: string; alt: string }[];
};

const MOCK_PROJECTS: MockProjectDetail[] = [
  {
    slug: "mujeres-nobel",
    title: {
      es: "Mujeres Nobel",
      en: "Nobel Women",
      fr: "Femmes Nobel",
    },
    description: {
      es: "La exposicion Mujeres Nobel es un recorrido por la vida y obra de las mujeres galardonadas con el Premio Nobel en todas sus categorias: Paz, Literatura, Medicina, Fisica, Quimica y Economia. Desde Marie Curie hasta las mas recientes galardonadas, la muestra ofrece una vision completa de las contribuciones femeninas al progreso de la humanidad.\n\nLa exposicion ha contado con la colaboracion de las propias galardonadas, sus familiares y las fundaciones que custodian sus legados, asi como el Museo Nobel de Estocolmo, el Instituto Nobel de Oslo y numerosas embajadas y universidades de todo el mundo.\n\nVarias mujeres que han sido galardonadas con el Premio Nobel, como Elizabeth Blackburn (Nobel de Medicina 2009), May-Britt Moser (Premio Nobel de Medicina 2014) o Ouided Bouchamaoui (Premio Nobel de la Paz 2015), han acudido a inauguraciones de distintas sedes de la exposicion y han participado en actos paralelos.",
      en: "The Nobel Women exhibition is a journey through the life and work of women awarded the Nobel Prize in all categories: Peace, Literature, Medicine, Physics, Chemistry and Economics. From Marie Curie to the most recent laureates, the exhibition offers a complete vision of female contributions to human progress.\n\nThe exhibition has had the collaboration of the laureates themselves, their families and the foundations that guard their legacies, as well as the Nobel Museum in Stockholm, the Nobel Institute in Oslo and numerous embassies and universities worldwide.\n\nSeveral Nobel Prize-winning women, such as Elizabeth Blackburn (Nobel in Medicine 2009), May-Britt Moser (Nobel in Medicine 2014) or Ouided Bouchamaoui (Nobel Peace Prize 2015), have attended openings at various exhibition venues and participated in parallel events.",
      fr: "L'exposition Femmes Nobel est un parcours a travers la vie et l'oeuvre des femmes laureates du prix Nobel dans toutes les categories : Paix, Litterature, Medecine, Physique, Chimie et Economie. De Marie Curie aux laureates les plus recentes, l'exposition offre une vision complete des contributions feminines au progres de l'humanite.\n\nL'exposition a beneficie de la collaboration des laureates elles-memes, de leurs familles et des fondations qui gardent leurs heritages, ainsi que du Musee Nobel de Stockholm, de l'Institut Nobel d'Oslo et de nombreuses ambassades et universites du monde entier.",
    },
    gradient: "from-brand-800 via-brand-900 to-neutral-900",
    dossierUrl: "#dossier-mujeres-nobel",
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
    images: [
      { url: "https://picsum.photos/seed/nobel1/800/600", alt: "Exposicion Mujeres Nobel - Vista general" },
      { url: "https://picsum.photos/seed/nobel2/800/600", alt: "Panel Marie Curie" },
      { url: "https://picsum.photos/seed/nobel3/800/600", alt: "Visitantes recorriendo la exposicion" },
      { url: "https://picsum.photos/seed/nobel4/800/600", alt: "Panel Malala Yousafzai" },
      { url: "https://picsum.photos/seed/nobel5/800/600", alt: "Inauguracion oficial" },
      { url: "https://picsum.photos/seed/nobel6/800/600", alt: "Detalle de los paneles informativos" },
      { url: "https://picsum.photos/seed/nobel7/800/600", alt: "Conferencia inaugural" },
      { url: "https://picsum.photos/seed/nobel8/800/600", alt: "Actividad educativa con estudiantes" },
    ],
  },
  {
    slug: "marie-curie",
    title: {
      es: "Maria Sklodowska-Curie. Una polaca en Paris",
      en: "Maria Sklodowska-Curie. A Polish Woman in Paris",
      fr: "Maria Sklodowska-Curie. Une Polonaise a Paris",
    },
    description: {
      es: "Esta exposicion cuenta la extraordinaria historia de Maria Sklodowska-Curie, la cientifica polaca que revoluciono la fisica y la quimica con sus descubrimientos sobre la radiactividad. Primera mujer en ganar un Premio Nobel y unica persona en ganar el Nobel en dos disciplinas cientificas diferentes, su legado trasciende la ciencia para convertirse en un simbolo universal de la determinacion y el talento femenino.\n\nLa muestra ha contado con la colaboracion de Pierre Joliot y Helene Langevin-Joliot, nietos de Marie Curie, quienes han aportado testimonios y documentos familiares ineditos.",
      en: "This exhibition tells the extraordinary story of Maria Sklodowska-Curie, the Polish scientist who revolutionized physics and chemistry with her discoveries about radioactivity. The first woman to win a Nobel Prize and the only person to win the Nobel in two different scientific disciplines, her legacy transcends science to become a universal symbol of female determination and talent.\n\nThe exhibition has had the collaboration of Pierre Joliot and Helene Langevin-Joliot, Marie Curie's grandchildren, who have contributed testimonies and unpublished family documents.",
      fr: "Cette exposition raconte l'histoire extraordinaire de Maria Sklodowska-Curie, la scientifique polonaise qui a revolutionne la physique et la chimie avec ses decouvertes sur la radioactivite. Premiere femme a remporter un prix Nobel et seule personne a remporter le Nobel dans deux disciplines scientifiques differentes, son heritage transcende la science pour devenir un symbole universel de la determination et du talent feminins.",
    },
    gradient: "from-accent-800 via-accent-900 to-neutral-900",
    dossierUrl: "#dossier-marie-curie",
    exhibitions: [
      { slug: "paris-2015", city: "Paris", venue: "Institut Curie", dateFrom: "07/11/2015", dateTo: "28/02/2016" },
      { slug: "varsovia-2016", city: "Varsovia", venue: "Museo Maria Sklodowska-Curie", dateFrom: "15/04/2016", dateTo: "30/07/2016" },
      { slug: "madrid-2017", city: "Madrid", venue: "Residencia de Estudiantes", dateFrom: "10/01/2017", dateTo: "20/05/2017" },
      { slug: "cracovia-2017", city: "Cracovia", venue: "Universidad Jagellonica", dateFrom: "15/09/2017", dateTo: "28/02/2018" },
      { slug: "barcelona-2018", city: "Barcelona", venue: "Museo de Historia de Cataluna", dateFrom: "20/04/2018", dateTo: "15/01/2019" },
      { slug: "toledo-2019", city: "Toledo", venue: "Centro Cultural San Marcos", dateFrom: "01/03/2019", dateTo: "30/06/2019" },
    ],
    images: [
      { url: "https://picsum.photos/seed/curie1/800/600", alt: "Exposicion Marie Curie - Vista general" },
      { url: "https://picsum.photos/seed/curie2/800/600", alt: "Laboratorio recreado" },
      { url: "https://picsum.photos/seed/curie3/800/600", alt: "Documentos historicos" },
      { url: "https://picsum.photos/seed/curie4/800/600", alt: "Pierre y Marie Curie" },
      { url: "https://picsum.photos/seed/curie5/800/600", alt: "Inauguracion en Paris" },
      { url: "https://picsum.photos/seed/curie6/800/600", alt: "Nietos de Marie Curie en la exposicion" },
    ],
  },
  {
    slug: "teresa-de-jesus",
    title: {
      es: "Teresa de Jesus. Corazon en Espana, alma en America",
      en: "Teresa de Jesus. Heart in Spain, Soul in the Americas",
      fr: "Teresa de Jesus. Coeur en Espagne, ame en Amerique",
    },
    description: {
      es: "La exposicion Teresa de Jesus explora la vida y el legado de Santa Teresa de Avila, una de las figuras mas importantes de la literatura y la espiritualidad espanola. Mistica, escritora y reformadora, Teresa de Jesus rompio moldes en el siglo XVI y su influencia se extendio desde Espana hasta America.\n\nLa muestra incluye documentos historicos, reproducciones de sus manuscritos y material audiovisual que permite al visitante sumergirse en la epoca y comprender la magnitud de su obra.",
      en: "The Teresa de Jesus exhibition explores the life and legacy of Saint Teresa of Avila, one of the most important figures in Spanish literature and spirituality. A mystic, writer and reformer, Teresa de Jesus broke molds in the 16th century and her influence spread from Spain to the Americas.\n\nThe exhibition includes historical documents, reproductions of her manuscripts and audiovisual material that allows visitors to immerse themselves in the era and understand the magnitude of her work.",
      fr: "L'exposition Teresa de Jesus explore la vie et l'heritage de Sainte Therese d'Avila, l'une des figures les plus importantes de la litterature et de la spiritualite espagnoles. Mystique, ecrivaine et reformatrice, Teresa de Jesus a brise les moules au XVIe siecle et son influence s'est etendue de l'Espagne aux Ameriques.",
    },
    gradient: "from-amber-800 via-amber-900 to-neutral-900",
    dossierUrl: "#dossier-teresa",
    exhibitions: [
      { slug: "avila-2015", city: "Avila", venue: "Centro de Interpretacion del Misticismo", dateFrom: "15/10/2015", dateTo: "20/12/2015" },
      { slug: "toledo-2015", city: "Toledo", venue: "Convento de Santo Domingo el Antiguo", dateFrom: "10/01/2016", dateTo: "30/04/2016" },
      { slug: "madrid-2016", city: "Madrid", venue: "Biblioteca Nacional", dateFrom: "15/05/2016", dateTo: "30/09/2016" },
      { slug: "sevilla-2017", city: "Sevilla", venue: "Archivo General de Indias", dateFrom: "10/02/2017", dateTo: "20/06/2017" },
      { slug: "mexico-2017", city: "Mexico DF", venue: "Museo del Carmen", dateFrom: "01/09/2017", dateTo: "15/03/2018" },
    ],
    images: [
      { url: "https://picsum.photos/seed/teresa1/800/600", alt: "Exposicion Teresa de Jesus" },
      { url: "https://picsum.photos/seed/teresa2/800/600", alt: "Manuscritos de Santa Teresa" },
      { url: "https://picsum.photos/seed/teresa3/800/600", alt: "Vista de la exposicion en Avila" },
      { url: "https://picsum.photos/seed/teresa4/800/600", alt: "Lectura dramatizada" },
      { url: "https://picsum.photos/seed/teresa5/800/600", alt: "Visitantes en la exposicion" },
    ],
  },
  {
    slug: "astronautas",
    title: {
      es: "Mujeres Astronautas",
      en: "Women Astronauts",
      fr: "Femmes Astronautes",
    },
    description: {
      es: "Mujeres Astronautas es una exposicion que rinde homenaje a las mujeres que han viajado al espacio, desde Valentina Tereshkova hasta las astronautas del siglo XXI. La muestra recorre la historia de la conquista espacial desde una perspectiva de genero, destacando los logros y las barreras superadas por estas pioneras.\n\nLa exposicion incluye material cedido por agencias espaciales como la NASA y la ESA, asi como testimonios de las propias astronautas.",
      en: "Women Astronauts is an exhibition that pays tribute to the women who have traveled to space, from Valentina Tereshkova to 21st-century astronauts. The exhibition covers the history of space conquest from a gender perspective, highlighting the achievements and barriers overcome by these pioneers.\n\nThe exhibition includes material provided by space agencies such as NASA and ESA, as well as testimonies from the astronauts themselves.",
      fr: "Femmes Astronautes est une exposition qui rend hommage aux femmes qui ont voyage dans l'espace, de Valentina Tereshkova aux astronautes du XXIe siecle. L'exposition parcourt l'histoire de la conquete spatiale dans une perspective de genre, mettant en lumiere les realisations et les barrieres surmontees par ces pionnieres.",
    },
    gradient: "from-indigo-800 via-indigo-900 to-neutral-900",
    dossierUrl: "#dossier-astronautas",
    exhibitions: [
      { slug: "madrid-2022", city: "Madrid", venue: "Museo Nacional de Ciencia y Tecnologia", dateFrom: "20/03/2022", dateTo: "15/01/2023" },
      { slug: "barcelona-2023", city: "Barcelona", venue: "Museu de la Ciencia", dateFrom: "01/03/2023", dateTo: "30/07/2023" },
      { slug: "valencia-2024", city: "Valencia", venue: "Ciudad de las Artes y las Ciencias", dateFrom: "15/01/2024", dateTo: "30/06/2024" },
    ],
    images: [
      { url: "https://picsum.photos/seed/astro1/800/600", alt: "Exposicion Mujeres Astronautas" },
      { url: "https://picsum.photos/seed/astro2/800/600", alt: "Traje espacial en exhibicion" },
      { url: "https://picsum.photos/seed/astro3/800/600", alt: "Panel Valentina Tereshkova" },
      { url: "https://picsum.photos/seed/astro4/800/600", alt: "Material de la NASA" },
    ],
  },
  {
    slug: "concha-espina",
    title: {
      es: "Concha Espina. Luz y tiniebla",
      en: "Concha Espina. Light and Darkness",
      fr: "Concha Espina. Lumiere et tenebres",
    },
    description: {
      es: "Concha Espina. Luz y tiniebla es una exposicion dedicada a la escritora cantabra Concha Espina, una de las autoras mas importantes de la literatura espanola del siglo XX. Nominada al Premio Nobel de Literatura, su obra refleja con extraordinaria sensibilidad la realidad social de su epoca.\n\nLa exposicion se complementa con la lectura dramatizada de su vida, basada en sus propios escritos, con la participacion del reconocido actor Manuel Galiana.",
      en: "Concha Espina. Light and Darkness is an exhibition dedicated to the Cantabrian writer Concha Espina, one of the most important authors of 20th-century Spanish literature. Nominated for the Nobel Prize in Literature, her work reflects with extraordinary sensitivity the social reality of her time.\n\nThe exhibition is complemented by a dramatized reading of her life, based on her own writings, with the participation of renowned actor Manuel Galiana.",
      fr: "Concha Espina. Lumiere et tenebres est une exposition dediee a l'ecrivaine cantabre Concha Espina, l'une des auteures les plus importantes de la litterature espagnole du XXe siecle. Nominee au prix Nobel de litterature, son oeuvre reflete avec une sensibilite extraordinaire la realite sociale de son epoque.",
    },
    gradient: "from-emerald-800 via-emerald-900 to-neutral-900",
    dossierUrl: "#dossier-concha-espina",
    exhibitions: [
      { slug: "santander-2019", city: "Santander", venue: "Palacio de Festivales", dateFrom: "01/06/2019", dateTo: "30/09/2019" },
      { slug: "madrid-2020", city: "Madrid", venue: "Ateneo de Madrid", dateFrom: "15/01/2020", dateTo: "20/06/2020" },
      { slug: "barcelona-2021", city: "Barcelona", venue: "Ateneu Barcelones", dateFrom: "10/02/2021", dateTo: "30/07/2021" },
      { slug: "valladolid-2022", city: "Valladolid", venue: "Palacio de Santa Cruz", dateFrom: "01/03/2022", dateTo: "15/09/2022" },
    ],
    images: [
      { url: "https://picsum.photos/seed/espina1/800/600", alt: "Exposicion Concha Espina" },
      { url: "https://picsum.photos/seed/espina2/800/600", alt: "Manuel Galiana en la lectura dramatizada" },
      { url: "https://picsum.photos/seed/espina3/800/600", alt: "Manuscritos originales" },
      { url: "https://picsum.photos/seed/espina4/800/600", alt: "Inauguracion en Santander" },
      { url: "https://picsum.photos/seed/espina5/800/600", alt: "Paneles de la exposicion" },
      { url: "https://picsum.photos/seed/espina6/800/600", alt: "Publico asistente" },
    ],
  },
];

function getMockProject(slug: string): MockProjectDetail | undefined {
  return MOCK_PROJECTS.find((p) => p.slug === slug);
}

// --- Metadata ---

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });

  // Try Supabase first, fallback to mock
  const project = await getProject(slug);
  const mockProject = !project ? getMockProject(slug) : null;

  const title = project
    ? getLocalizedField(project, "title", locale)
    : mockProject?.title[locale] ?? mockProject?.title.es ?? slug;

  const description = project
    ? getLocalizedField(project, "description", locale)
    : mockProject?.description[locale] ?? mockProject?.description.es ?? "";

  const url = `https://rocaviva.eu/${locale}/projects/${slug}`;

  return {
    title: `${title} | ${t("title")} | Rocaviva Eventos`,
    description: description.slice(0, 160),
    alternates: {
      canonical: url,
      languages: {
        es: `https://rocaviva.eu/es/projects/${slug}`,
        en: `https://rocaviva.eu/en/projects/${slug}`,
        fr: `https://rocaviva.eu/fr/projects/${slug}`,
      },
    },
    openGraph: {
      title: `${title} | Rocaviva Eventos`,
      description: description.slice(0, 160),
      url,
      siteName: "Rocaviva Eventos",
      locale: locale === "es" ? "es_ES" : locale === "fr" ? "fr_FR" : "en_US",
      type: "website",
      ...(project?.image_url ? { images: [{ url: project.image_url }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Rocaviva Eventos`,
      description: description.slice(0, 160),
    },
  };
}

// --- Page ---

export default async function ProjectDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "projects" });

  // Try Supabase
  const project = await getProject(slug);
  const mockProject = !project ? getMockProject(slug) : null;

  if (!project && !mockProject) {
    notFound();
  }

  // Resolve data — Supabase or mock
  const title = project
    ? getLocalizedField(project, "title", locale)
    : mockProject!.title[locale] ?? mockProject!.title.es;

  const description = project
    ? getLocalizedField(project, "description", locale)
    : mockProject!.description[locale] ?? mockProject!.description.es;

  const imageUrl = project?.image_url ?? null;
  const gradient = !imageUrl
    ? mockProject?.gradient ?? "from-neutral-800 via-neutral-900 to-accent-900"
    : null;

  // Dossier URL — fallback chain: current locale → en → es
  const dossierUrl = project
    ? getLocalizedField(project, "dossier_url", locale) || null
    : mockProject?.dossierUrl ?? null;

  // Exhibitions
  const dbExhibitions = project ? await getExhibitions(project.id) : [];
  const exhibitions =
    dbExhibitions.length > 0
      ? dbExhibitions.map((e) => ({
          slug: e.slug,
          city: getLocalizedField(e, "city", locale),
          venue: getLocalizedField(e, "venue", locale) || null,
          dateFrom: e.date_from ? formatDate(e.date_from, locale) : null,
          dateTo: e.date_to ? formatDate(e.date_to, locale) : null,
        }))
      : mockProject?.exhibitions ?? [];

  // Project images
  const dbImages = project ? await getProjectImages(project.id) : [];
  const galleryImages =
    dbImages.length > 0
      ? dbImages.map((img) => ({
          url: img.image_url,
          alt: getLocalizedField(img, "alt", locale) || title,
        }))
      : mockProject?.images ?? [];

  // Breadcrumbs
  const breadcrumbItems = [
    { label: t("title"), href: `/projects` },
    { label: title },
  ];

  // JSON-LD (uses raw DB dates for structured data)
  const jsonLdSubEvents = dbExhibitions.length > 0
    ? dbExhibitions.map((e) => {
        const eCity = getLocalizedField(e, "city", locale);
        const eVenue = getLocalizedField(e, "venue", locale) || null;
        return {
          "@type": "ExhibitionEvent" as const,
          name: `${title} - ${eCity}`,
          location: {
            "@type": "Place" as const,
            name: eVenue ?? eCity,
            address: { "@type": "PostalAddress" as const, addressLocality: eCity },
          },
          ...(e.date_from ? { startDate: e.date_from } : {}),
          ...(e.date_to ? { endDate: e.date_to } : {}),
        };
      })
    : exhibitions.map((e) => ({
        "@type": "ExhibitionEvent" as const,
        name: `${title} - ${e.city}`,
        location: {
          "@type": "Place" as const,
          name: e.venue ?? e.city,
          address: { "@type": "PostalAddress" as const, addressLocality: e.city },
        },
      }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ExhibitionEvent",
    name: title,
    description: description.slice(0, 300),
    url: `https://rocaviva.eu/${locale}/projects/${slug}`,
    organizer: {
      "@type": "Organization",
      name: "Rocaviva Eventos",
      url: "https://rocaviva.eu",
    },
    ...(imageUrl ? { image: imageUrl } : {}),
    ...(jsonLdSubEvents.length > 0 ? { subEvent: jsonLdSubEvents } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <ProjectHero
        title={title}
        imageUrl={imageUrl}
        gradient={gradient}
      />

      {/* Content */}
      <main className="bg-neutral-50">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 md:px-12 py-12 sm:py-16 md:py-20">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} />

          {/* Description */}
          <ProjectContent
            description={description}
            dossierUrl={dossierUrl}
            dossierLabel={t("downloadDossier")}
            galleryImages={galleryImages}
            galleryTitle={title}
            exhibitions={exhibitions}
            projectSlug={slug}
            exhibitionsLabel={t("exhibitions")}
            galleryLabel={t("gallery")}
          />
        </div>
      </main>
    </>
  );
}
