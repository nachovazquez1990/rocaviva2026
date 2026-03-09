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
  city_es: string;
  city_en: string | null;
  city_fr: string | null;
  venue_es: string | null;
  venue_en: string | null;
  venue_fr: string | null;
  date_from: string | null;
  date_to: string | null;
  description_es: string | null;
  description_en: string | null;
  description_fr: string | null;
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
  stamp_message_es: string | null;
  stamp_message_en: string | null;
  stamp_message_fr: string | null;
  download_url_part1: string | null;
  download_url_part2: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface BookFile {
  id: string;
  book_id: string;
  file_url: string;
  label: string | null;
  part_number: number;
  created_at: string;
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

export interface PageView {
  id: string;
  page_path: string;
  locale: string | null;
  country: string | null;
  city: string | null;
  referrer: string | null;
  user_agent: string | null;
  device_type: "desktop" | "mobile" | "tablet" | null;
  session_id: string | null;
  is_new_visitor: boolean;
  created_at: string;
}

export interface AnalyticsEvent {
  id: string;
  event_type: "click" | "download" | "form_submit" | "dossier_download";
  element_id: string | null;
  element_text: string | null;
  page_path: string | null;
  metadata: Record<string, unknown> | null;
  session_id: string | null;
  created_at: string;
}

// Home content map (key → localized value)
export type HomeContentMap = Record<string, string>;

// Helper type to get localized field
export type LocalizedField<T> = T extends { [K in `${string}_es`]: infer V } ? V : never;

// Utility to get the right locale field with fallback chain: locale → en → es
export function getLocalizedField(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any,
  field: string,
  locale: string
): string {
  const key = `${field}_${locale}`;
  const value = item[key] as string;
  if (value) return value;

  if (locale !== "en") {
    const enValue = item[`${field}_en`] as string;
    if (enValue) return enValue;
  }

  if (locale !== "es") {
    const esValue = item[`${field}_es`] as string;
    if (esValue) return esValue;
  }

  return (item[field] as string) || "";
}
