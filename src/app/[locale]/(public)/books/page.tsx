import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getLocalizedField } from "@/lib/supabase/types";
import type { Book } from "@/lib/supabase/types";
import { BookDisplay } from "@/components/books/book-display";

export const revalidate = 3600;

type Props = {
  params: Promise<{ locale: string }>;
};

// --- Data fetching ---

async function getBooks(): Promise<Book[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching books:", error.message);
      return [];
    }

    return data ?? [];
  } catch {
    return [];
  }
}

async function getBookFiles(bookIds: string[]): Promise<Record<string, { file_url: string; label: string | null; part_number: number }[]>> {
  if (bookIds.length === 0) return {};
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("book_files")
      .select("*")
      .in("book_id", bookIds)
      .order("part_number", { ascending: true });

    if (error) return {};

    const grouped: Record<string, { file_url: string; label: string | null; part_number: number }[]> = {};
    for (const f of data ?? []) {
      if (!grouped[f.book_id]) grouped[f.book_id] = [];
      grouped[f.book_id].push({ file_url: f.file_url, label: f.label, part_number: f.part_number });
    }
    return grouped;
  } catch {
    return {};
  }
}

// --- Mock data ---

interface MockBook {
  id: string;
  title: Record<string, string>;
  description: Record<string, string>;
  image_url: string;
  extra_image_url: string;
  stamp_message: Record<string, string>;
  files: { file_url: string; label: string | null; part_number: number }[];
}

const MOCK_BOOKS: MockBook[] = [
  {
    id: "mock-1",
    title: {
      es: "Mujeres Nobel",
      en: "Nobel Women",
      fr: "Femmes Nobel",
    },
    description: {
      es: "Una obra que recoge las biografias de todas las mujeres galardonadas con el Premio Nobel desde su creacion en 1901. Este libro, fruto de anos de investigacion y colaboracion con las propias laureadas, sus familias y las instituciones que custodian sus legados, ofrece un recorrido unico por la vida y obra de estas mujeres extraordinarias que han marcado la historia de la humanidad en campos como la Paz, la Literatura, la Fisica, la Quimica, la Medicina y la Economia.",
      en: "A work that compiles the biographies of all women awarded the Nobel Prize since its creation in 1901. This book, the result of years of research and collaboration with the laureates themselves, their families, and the institutions that safeguard their legacies, offers a unique journey through the lives and work of these extraordinary women who have shaped the history of humanity in fields such as Peace, Literature, Physics, Chemistry, Medicine, and Economics.",
      fr: "Un ouvrage qui rassemble les biographies de toutes les femmes laureates du prix Nobel depuis sa creation en 1901. Ce livre, fruit d'annees de recherche et de collaboration avec les laureates elles-memes, leurs familles et les institutions qui preservent leurs heritages, offre un parcours unique a travers la vie et l'oeuvre de ces femmes extraordinaires qui ont marque l'histoire de l'humanite dans des domaines tels que la Paix, la Litterature, la Physique, la Chimie, la Medecine et l'Economie.",
    },
    image_url: "https://picsum.photos/seed/book-cover/600/800",
    extra_image_url: "https://picsum.photos/seed/book-stamp/400/200",
    stamp_message: {
      es: "La edición digital de este libro está subvencionada por el Ministerio de Cultura y Deporte",
      en: "The digital edition of this book is subsidized by the Ministry of Culture and Sport",
      fr: "L'édition numérique de ce livre est subventionnée par le Ministère de la Culture et du Sport",
    },
    files: [
      { file_url: "#download-part1", label: "Parte 1", part_number: 1 },
      { file_url: "#download-part2", label: "Parte 2", part_number: 2 },
    ],
  },
];

// --- Metadata ---

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "books" });

  const url = `https://rocaviva.eu/${locale}/books`;

  return {
    title: `${t("title")} | Rocaviva Eventos`,
    description:
      locale === "es"
        ? "Descarga los libros de Rocaviva Eventos sobre personajes historicos y exposiciones culturales."
        : locale === "fr"
          ? "Telechargez les livres de Rocaviva Eventos sur les personnages historiques et les expositions culturelles."
          : "Download Rocaviva Eventos books about historical figures and cultural exhibitions.",
    alternates: {
      canonical: url,
      languages: {
        es: "https://rocaviva.eu/es/books",
        en: "https://rocaviva.eu/en/books",
        fr: "https://rocaviva.eu/fr/books",
      },
    },
    openGraph: {
      title: `${t("title")} | Rocaviva Eventos`,
      description:
        locale === "es"
          ? "Descarga los libros de Rocaviva Eventos sobre personajes historicos y exposiciones culturales."
          : locale === "fr"
            ? "Telechargez les livres de Rocaviva Eventos sur les personnages historiques et les expositions culturelles."
            : "Download Rocaviva Eventos books about historical figures and cultural exhibitions.",
      url,
      siteName: "Rocaviva Eventos",
      locale: locale === "es" ? "es_ES" : locale === "fr" ? "fr_FR" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${t("title")} | Rocaviva Eventos`,
    },
  };
}

// --- Page ---

export interface BookFilePart {
  file_url: string;
  label: string | null;
  part_number: number;
}

export interface BookItem {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  extra_image_url: string | null;
  stamp_message: string | null;
  files: BookFilePart[];
}

export default async function BooksPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "books" });

  const dbBooks = await getBooks();
  const useMock = dbBooks.length === 0;

  const bookFiles = useMock ? {} : await getBookFiles(dbBooks.map((b) => b.id));

  const books: BookItem[] = useMock
    ? MOCK_BOOKS.map((b) => ({
        id: b.id,
        title: b.title[locale] ?? b.title.es,
        description: b.description[locale] ?? b.description.es,
        image_url: b.image_url,
        extra_image_url: b.extra_image_url,
        stamp_message: b.stamp_message[locale] ?? b.stamp_message.es ?? null,
        files: b.files,
      }))
    : dbBooks.map((b) => ({
        id: b.id,
        title: getLocalizedField(b, "title", locale),
        description: getLocalizedField(b, "description", locale),
        image_url: b.image_url,
        extra_image_url: b.extra_image_url,
        stamp_message: getLocalizedField(b, "stamp_message", locale) || null,
        files: bookFiles[b.id] || [],
      }));

  // JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("title"),
    url: `https://rocaviva.eu/${locale}/books`,
    isPartOf: {
      "@type": "WebSite",
      name: "Rocaviva Eventos",
      url: "https://rocaviva.eu",
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: books.length,
      itemListElement: books.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Book",
          name: b.title,
          description: b.description,
          ...(b.image_url ? { image: b.image_url } : {}),
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
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-900">
              {t("title")}
            </h1>
          </div>
        </div>

        {/* Books */}
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-12 py-10 sm:py-14 md:py-16">
          <div className="space-y-24">
            {books.map((book) => (
              <BookDisplay key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
