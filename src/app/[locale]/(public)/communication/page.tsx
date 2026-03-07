import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getLocalizedField } from "@/lib/supabase/types";
import type { News } from "@/lib/supabase/types";
import { NewsGrid } from "@/components/communication/news-grid";
import type { NewsItem, MediaType } from "@/components/communication/news-card";

export const revalidate = 3600;

type Props = {
  params: Promise<{ locale: string }>;
};

// --- Data fetching ---

async function getNews(): Promise<News[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("is_published", true)
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching news:", error.message);
      return [];
    }

    return data ?? [];
  } catch {
    return [];
  }
}

// --- Mock data ---

interface MockNews {
  id: string;
  title: Record<string, string>;
  description: Record<string, string>;
  image_url: string | null;
  date: string;
  link_url: string | null;
  media_type: MediaType;
}

const MOCK_NEWS: MockNews[] = [
  {
    id: "1",
    title: {
      es: "Inauguracion de Mujeres Nobel en el Nobel Peace Center de Oslo",
      en: "Nobel Women Exhibition Opens at the Nobel Peace Center in Oslo",
      fr: "Inauguration de Femmes Nobel au Nobel Peace Center d'Oslo",
    },
    description: {
      es: "La exposicion Mujeres Nobel se inaugura en el Nobel Peace Center de Oslo, con la asistencia de tres premios Nobel y representantes de numerosas embajadas.",
      en: "The Nobel Women exhibition opens at the Nobel Peace Center in Oslo, attended by three Nobel laureates and representatives from numerous embassies.",
      fr: "L'exposition Femmes Nobel s'ouvre au Nobel Peace Center d'Oslo, en presence de trois laureats du prix Nobel et de representants de nombreuses ambassades.",
    },
    image_url: "https://picsum.photos/seed/news1/800/500",
    date: "2024-04-01",
    link_url: "https://example.com/news/nobel-oslo",
    media_type: "press",
  },
  {
    id: "2",
    title: {
      es: "Elizabeth Blackburn visita la exposicion en Madrid",
      en: "Elizabeth Blackburn Visits the Exhibition in Madrid",
      fr: "Elizabeth Blackburn visite l'exposition a Madrid",
    },
    description: {
      es: "La premio Nobel de Medicina 2009 Elizabeth Blackburn visito la exposicion Mujeres Nobel en el Museo Nacional de Ciencias Naturales de Madrid.",
      en: "Nobel Prize in Medicine 2009 laureate Elizabeth Blackburn visited the Nobel Women exhibition at the National Museum of Natural Sciences in Madrid.",
      fr: "La laureate du prix Nobel de medecine 2009 Elizabeth Blackburn a visite l'exposition Femmes Nobel au Musee national des sciences naturelles de Madrid.",
    },
    image_url: "https://picsum.photos/seed/news2/800/500",
    date: "2024-03-15",
    link_url: "https://example.com/news/blackburn-madrid",
    media_type: "press",
  },
  {
    id: "3",
    title: {
      es: "Entrevista en Radio Nacional sobre Mujeres Astronautas",
      en: "Radio Nacional Interview about Women Astronauts",
      fr: "Interview sur Radio Nacional sur les Femmes Astronautes",
    },
    description: {
      es: "Entrevista en directo en Radio Nacional de Espana sobre la exposicion Mujeres Astronautas y su recorrido por las principales ciudades de Espana.",
      en: "Live interview on Radio Nacional de Espana about the Women Astronauts exhibition and its tour through Spain's major cities.",
      fr: "Interview en direct sur Radio Nacional de Espana sur l'exposition Femmes Astronautes et son parcours dans les principales villes d'Espagne.",
    },
    image_url: "https://picsum.photos/seed/news3/800/500",
    date: "2024-02-20",
    link_url: "https://example.com/news/rne-astronautas",
    media_type: "radio",
  },
  {
    id: "4",
    title: {
      es: "TVE reportaje: Concha Espina. Luz y tiniebla",
      en: "TVE Report: Concha Espina. Light and Darkness",
      fr: "Reportage TVE : Concha Espina. Lumiere et tenebres",
    },
    description: {
      es: "Television Espanola dedica un reportaje especial a la exposicion Concha Espina con la participacion del actor Manuel Galiana en la lectura dramatizada.",
      en: "Spanish Television dedicates a special report to the Concha Espina exhibition featuring actor Manuel Galiana's dramatized reading.",
      fr: "La Television espagnole consacre un reportage special a l'exposition Concha Espina avec la participation de l'acteur Manuel Galiana dans la lecture dramatisee.",
    },
    image_url: "https://picsum.photos/seed/news4/800/500",
    date: "2024-01-10",
    link_url: "https://example.com/news/tve-concha-espina",
    media_type: "tv",
  },
  {
    id: "5",
    title: {
      es: "Video: Recorrido virtual por Marie Curie en Paris",
      en: "Video: Virtual Tour of Marie Curie in Paris",
      fr: "Video : Visite virtuelle de Marie Curie a Paris",
    },
    description: {
      es: "Recorrido virtual en video por la exposicion Maria Sklodowska-Curie en el Institut Curie de Paris, con testimonios de los nietos de la cientifica.",
      en: "Virtual video tour of the Maria Sklodowska-Curie exhibition at the Institut Curie in Paris, featuring testimonies from the scientist's grandchildren.",
      fr: "Visite virtuelle en video de l'exposition Maria Sklodowska-Curie a l'Institut Curie de Paris, avec les temoignages des petits-enfants de la scientifique.",
    },
    image_url: "https://picsum.photos/seed/news5/800/500",
    date: "2023-11-20",
    link_url: "https://example.com/news/video-curie-paris",
    media_type: "video",
  },
  {
    id: "6",
    title: {
      es: "La Vanguardia: Mujeres Nobel llega a Barcelona",
      en: "La Vanguardia: Nobel Women Arrives in Barcelona",
      fr: "La Vanguardia : Femmes Nobel arrive a Barcelone",
    },
    description: {
      es: "El periodico La Vanguardia cubre la llegada de la exposicion Mujeres Nobel al CosmoCaixa de Barcelona, destacando su impacto educativo.",
      en: "La Vanguardia newspaper covers the arrival of the Nobel Women exhibition at CosmoCaixa Barcelona, highlighting its educational impact.",
      fr: "Le journal La Vanguardia couvre l'arrivee de l'exposition Femmes Nobel au CosmoCaixa de Barcelone, soulignant son impact educatif.",
    },
    image_url: "https://picsum.photos/seed/news6/800/500",
    date: "2023-10-10",
    link_url: "https://example.com/news/vanguardia-barcelona",
    media_type: "press",
  },
  {
    id: "7",
    title: {
      es: "SER: Entrevista sobre Teresa de Jesus en America",
      en: "SER: Interview About Teresa de Jesus in the Americas",
      fr: "SER : Interview sur Teresa de Jesus en Amerique",
    },
    description: {
      es: "La Cadena SER entrevista al equipo de Rocaviva sobre la expansion de la exposicion Teresa de Jesus a Mexico y otros paises de America Latina.",
      en: "Cadena SER interviews the Rocaviva team about the expansion of the Teresa de Jesus exhibition to Mexico and other Latin American countries.",
      fr: "La Cadena SER interviewe l'equipe de Rocaviva sur l'expansion de l'exposition Teresa de Jesus au Mexique et dans d'autres pays d'Amerique latine.",
    },
    image_url: "https://picsum.photos/seed/news7/800/500",
    date: "2023-09-05",
    link_url: "https://example.com/news/ser-teresa-america",
    media_type: "radio",
  },
  {
    id: "8",
    title: {
      es: "Canal 24 Horas: Mujeres Nobel de la Paz",
      en: "Canal 24 Horas: Nobel Peace Prize Women",
      fr: "Canal 24 Horas : Femmes Nobel de la Paix",
    },
    description: {
      es: "El Canal 24 Horas de RTVE emite un especial sobre las mujeres galardonadas con el Premio Nobel de la Paz y su presencia en la exposicion.",
      en: "RTVE's Canal 24 Horas broadcasts a special about women awarded the Nobel Peace Prize and their presence in the exhibition.",
      fr: "Le Canal 24 Horas de RTVE diffuse un special sur les femmes laureates du prix Nobel de la paix et leur presence dans l'exposition.",
    },
    image_url: "https://picsum.photos/seed/news8/800/500",
    date: "2023-08-15",
    link_url: "https://example.com/news/24h-nobel-paz",
    media_type: "tv",
  },
  {
    id: "9",
    title: {
      es: "Video: May-Britt Moser en la inauguracion de Valladolid",
      en: "Video: May-Britt Moser at the Valladolid Opening",
      fr: "Video : May-Britt Moser a l'inauguration de Valladolid",
    },
    description: {
      es: "La premio Nobel de Medicina 2014 May-Britt Moser inaugura la exposicion Mujeres Nobel en el Museo de la Ciencia de Valladolid.",
      en: "2014 Nobel Prize in Medicine laureate May-Britt Moser opens the Nobel Women exhibition at the Science Museum of Valladolid.",
      fr: "La laureate du prix Nobel de medecine 2014 May-Britt Moser inaugure l'exposition Femmes Nobel au Musee de la science de Valladolid.",
    },
    image_url: "https://picsum.photos/seed/news9/800/500",
    date: "2023-07-01",
    link_url: "https://example.com/news/video-moser-valladolid",
    media_type: "video",
  },
  {
    id: "10",
    title: {
      es: "El Pais: Rocaviva Eventos y la divulgacion cultural",
      en: "El Pais: Rocaviva Eventos and Cultural Outreach",
      fr: "El Pais : Rocaviva Eventos et la diffusion culturelle",
    },
    description: {
      es: "El Pais publica un articulo en profundidad sobre la trayectoria de Rocaviva Eventos y su papel en la divulgacion cultural a traves de exposiciones itinerantes.",
      en: "El Pais publishes an in-depth article about Rocaviva Eventos' trajectory and its role in cultural outreach through traveling exhibitions.",
      fr: "El Pais publie un article approfondi sur la trajectoire de Rocaviva Eventos et son role dans la diffusion culturelle a travers des expositions itinerantes.",
    },
    image_url: "https://picsum.photos/seed/news10/800/500",
    date: "2023-06-15",
    link_url: "https://example.com/news/elpais-rocaviva",
    media_type: "press",
  },
  {
    id: "11",
    title: {
      es: "Onda Cero: La ciencia como herramienta de igualdad",
      en: "Onda Cero: Science as a Tool for Equality",
      fr: "Onda Cero : La science comme outil d'egalite",
    },
    description: {
      es: "Entrevista en Onda Cero sobre como las exposiciones de Rocaviva utilizan la ciencia y la historia para promover la igualdad de genero.",
      en: "Interview on Onda Cero about how Rocaviva's exhibitions use science and history to promote gender equality.",
      fr: "Interview sur Onda Cero sur la facon dont les expositions de Rocaviva utilisent la science et l'histoire pour promouvoir l'egalite des genres.",
    },
    image_url: "https://picsum.photos/seed/news11/800/500",
    date: "2023-05-20",
    link_url: "https://example.com/news/ondacero-igualdad",
    media_type: "radio",
  },
  {
    id: "12",
    title: {
      es: "Telemadrid: Exposicion Mujeres Astronautas en Madrid",
      en: "Telemadrid: Women Astronauts Exhibition in Madrid",
      fr: "Telemadrid : Exposition Femmes Astronautes a Madrid",
    },
    description: {
      es: "Telemadrid cubre la inauguracion de la exposicion Mujeres Astronautas en el Museo Nacional de Ciencia y Tecnologia de Madrid.",
      en: "Telemadrid covers the opening of the Women Astronauts exhibition at the National Museum of Science and Technology in Madrid.",
      fr: "Telemadrid couvre l'inauguration de l'exposition Femmes Astronautes au Musee national des sciences et de la technologie de Madrid.",
    },
    image_url: "https://picsum.photos/seed/news12/800/500",
    date: "2023-04-10",
    link_url: "https://example.com/news/telemadrid-astronautas",
    media_type: "tv",
  },
];

// --- Metadata ---

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "communication" });
  const tMeta = await getTranslations({ locale, namespace: "metadata" });

  const url = `https://rocaviva.eu/${locale}/communication`;

  return {
    title: `${t("title")} | Rocaviva Eventos`,
    description: tMeta("communicationDescription"),
    alternates: {
      canonical: url,
      languages: {
        es: "https://rocaviva.eu/es/communication",
        en: "https://rocaviva.eu/en/communication",
        fr: "https://rocaviva.eu/fr/communication",
      },
    },
    openGraph: {
      title: `${t("title")} | Rocaviva Eventos`,
      description: tMeta("communicationDescription"),
      url,
      siteName: "Rocaviva Eventos",
      locale: locale === "es" ? "es_ES" : locale === "fr" ? "fr_FR" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${t("title")} | Rocaviva Eventos`,
      description: tMeta("communicationDescription"),
    },
  };
}

// --- Page ---

export default async function CommunicationPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "communication" });

  const dbNews = await getNews();
  const useMock = dbNews.length === 0;

  const newsItems: NewsItem[] = useMock
    ? MOCK_NEWS.map((n) => ({
        id: n.id,
        title: n.title[locale] ?? n.title.es,
        description: n.description[locale] ?? n.description.es,
        image_url: n.image_url,
        date: n.date,
        link_url: n.link_url,
        media_type: n.media_type,
      }))
    : dbNews.map((n) => ({
        id: n.id,
        title: getLocalizedField(n, "title", locale),
        description: getLocalizedField(n, "description", locale),
        image_url: n.image_url,
        date: n.date,
        link_url: n.link_url,
        media_type: n.media_type,
      }));

  // JSON-LD — CollectionPage with Article items
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("title"),
    description: t("subtitle"),
    url: `https://rocaviva.eu/${locale}/communication`,
    isPartOf: {
      "@type": "WebSite",
      name: "Rocaviva Eventos",
      url: "https://rocaviva.eu",
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: newsItems.length,
      itemListElement: newsItems.map((n, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Article",
          headline: n.title,
          datePublished: n.date,
          ...(n.image_url ? { image: n.image_url } : {}),
          ...(n.link_url ? { url: n.link_url } : {}),
          publisher: {
            "@type": "Organization",
            name: "Rocaviva Eventos",
          },
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
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-900 mb-3">
              {t("title")}
            </h1>
            <p className="text-neutral-500 text-base sm:text-lg max-w-2xl">
              {t("subtitle")}
            </p>
          </div>
        </div>

        {/* News grid */}
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-12 py-10 sm:py-14 md:py-16">
          <NewsGrid items={newsItems} locale={locale} />
        </div>
      </section>
    </>
  );
}
