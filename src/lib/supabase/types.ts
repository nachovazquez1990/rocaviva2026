export interface Project {
  id: string;
  slug: string;
  title_es: string;
  title_en: string | null;
  title_fr: string | null;
  description_es: string | null;
  description_en: string | null;
  description_fr: string | null;
  image_url: string | null;
  dossier_url_es: string | null;
  dossier_url_en: string | null;
  dossier_url_fr: string | null;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  alt_es: string | null;
  alt_en: string | null;
  alt_fr: string | null;
  display_order: number;
  created_at: string;
}

export interface Exhibition {
  id: string;
  project_id: string;
  slug: string;
  city: string;
  venue: string | null;
  date_from: string | null;
  date_to: string | null;
  description_es: string | null;
  description_en: string | null;
  description_fr: string | null;
  image_url: string | null;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExhibitionImage {
  id: string;
  exhibition_id: string;
  image_url: string;
  alt_es: string | null;
  alt_en: string | null;
  alt_fr: string | null;
  display_order: number;
  created_at: string;
}

export interface News {
  id: string;
  title_es: string;
  title_en: string | null;
  title_fr: string | null;
  description_es: string | null;
  description_en: string | null;
  description_fr: string | null;
  image_url: string | null;
  date: string;
  link_url: string | null;
  media_type: "press" | "radio" | "tv" | "video";
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Book {
  id: string;
  title_es: string;
  title_en: string | null;
  title_fr: string | null;
  description_es: string | null;
  description_en: string | null;
  description_fr: string | null;
  image_url: string | null;
  extra_image_url: string | null;
  download_url_part1: string | null;
  download_url_part2: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface BookDownload {
  id: string;
  book_id: string | null;
  name: string;
  email: string;
  interest: "personal" | "professional" | "gift" | null;
  profession: string | null;
  comments: string | null;
  created_at: string;
}

export interface Collaborator {
  id: string;
  name: string;
  logo_url: string;
  website_url: string | null;
  display_order: number;
  is_published: boolean;
  created_at: string;
}

export interface HomeContent {
  id: string;
  key: string;
  value_es: string | null;
  value_en: string | null;
  value_fr: string | null;
  updated_at: string;
}

// Helper type to get localized field
export type LocalizedField<T> = T extends { [K in `${string}_es`]: infer V } ? V : never;

// Utility to get the right locale field
export function getLocalizedField<T extends Record<string, unknown>>(
  item: T,
  field: string,
  locale: string
): string {
  const key = `${field}_${locale}` as keyof T;
  const fallbackKey = `${field}_es` as keyof T;
  return (item[key] as string) || (item[fallbackKey] as string) || "";
}
