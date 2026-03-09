"use client";

import { CheckCircle2, AlertCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface MissingItem {
  label: string;
}

interface CompletenessIndicatorProps {
  missing: MissingItem[];
}

export function CompletenessIndicator({ missing }: CompletenessIndicatorProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [position, setPosition] = useState<"bottom" | "top">("bottom");
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showTooltip && iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setPosition(spaceBelow < 150 ? "top" : "bottom");
    }
  }, [showTooltip]);

  if (missing.length === 0) {
    return (
      <div className="flex items-center" title="Completo">
        <CheckCircle2 size={16} className="text-green-600" />
      </div>
    );
  }

  return (
    <div
      ref={iconRef}
      className="relative flex items-center"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <AlertCircle size={16} className="text-amber-500 cursor-help" />
      {showTooltip && (
        <div
          className={`absolute z-50 left-1/2 -translate-x-1/2 w-56 bg-neutral-900 text-white text-xs p-3 shadow-lg ${
            position === "bottom" ? "top-full mt-2" : "bottom-full mb-2"
          }`}
        >
          <div
            className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-neutral-900 rotate-45 ${
              position === "bottom" ? "-top-1" : "-bottom-1"
            }`}
          />
          <p className="font-semibold mb-1.5 text-amber-400">
            Falta ({missing.length}):
          </p>
          <ul className="space-y-0.5">
            {missing.map((item, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-amber-400 mt-0.5 shrink-0">&#8226;</span>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// --- Completeness check helpers per entity type ---

export function getProjectMissing(project: {
  title_en?: string | null;
  title_fr?: string | null;
  description_es?: string | null;
  description_en?: string | null;
  description_fr?: string | null;
  image_url?: string | null;
  dossier_url_es?: string | null;
  dossier_url_en?: string | null;
  dossier_url_fr?: string | null;
  image_count?: number;
}): MissingItem[] {
  const missing: MissingItem[] = [];
  if (!project.title_en) missing.push({ label: "Titulo en ingles" });
  if (!project.title_fr) missing.push({ label: "Titulo en frances" });
  if (!project.description_es) missing.push({ label: "Descripcion en espanol" });
  if (!project.description_en) missing.push({ label: "Descripcion en ingles" });
  if (!project.description_fr) missing.push({ label: "Descripcion en frances" });
  if (!project.image_url) missing.push({ label: "Imagen principal" });
  if (!project.dossier_url_es) missing.push({ label: "Dossier en espanol" });
  if (!project.dossier_url_en) missing.push({ label: "Dossier en ingles" });
  if (!project.dossier_url_fr) missing.push({ label: "Dossier en frances" });
  if (project.image_count !== undefined && project.image_count === 0)
    missing.push({ label: "Galeria de imagenes" });
  return missing;
}

export function getExhibitionMissing(exhibition: {
  city_en?: string | null;
  city_fr?: string | null;
  venue_es?: string | null;
  venue_en?: string | null;
  venue_fr?: string | null;
  date_from?: string | null;
  date_to?: string | null;
  description_es?: string | null;
  description_en?: string | null;
  description_fr?: string | null;
  image_count?: number;
}): MissingItem[] {
  const missing: MissingItem[] = [];
  if (!exhibition.city_en) missing.push({ label: "Ciudad en ingles" });
  if (!exhibition.city_fr) missing.push({ label: "Ciudad en frances" });
  if (!exhibition.venue_es) missing.push({ label: "Recinto en espanol" });
  if (!exhibition.venue_en) missing.push({ label: "Recinto en ingles" });
  if (!exhibition.venue_fr) missing.push({ label: "Recinto en frances" });
  if (!exhibition.date_from) missing.push({ label: "Fecha inicio" });
  if (!exhibition.date_to) missing.push({ label: "Fecha fin" });
  if (!exhibition.description_es) missing.push({ label: "Descripcion en espanol" });
  if (!exhibition.description_en) missing.push({ label: "Descripcion en ingles" });
  if (!exhibition.description_fr) missing.push({ label: "Descripcion en frances" });
  if (exhibition.image_count !== undefined && exhibition.image_count === 0)
    missing.push({ label: "Galeria de imagenes" });
  return missing;
}

export function getNewsMissing(news: {
  title_en?: string | null;
  title_fr?: string | null;
  description_es?: string | null;
  description_en?: string | null;
  description_fr?: string | null;
  image_url?: string | null;
  link_url?: string | null;
}): MissingItem[] {
  const missing: MissingItem[] = [];
  if (!news.title_en) missing.push({ label: "Titulo en ingles" });
  if (!news.title_fr) missing.push({ label: "Titulo en frances" });
  if (!news.description_es) missing.push({ label: "Descripcion en espanol" });
  if (!news.description_en) missing.push({ label: "Descripcion en ingles" });
  if (!news.description_fr) missing.push({ label: "Descripcion en frances" });
  if (!news.image_url) missing.push({ label: "Imagen" });
  if (!news.link_url) missing.push({ label: "URL enlace" });
  return missing;
}

export function getBookMissing(book: {
  title_en?: string | null;
  title_fr?: string | null;
  description_es?: string | null;
  description_en?: string | null;
  description_fr?: string | null;
  image_url?: string | null;
  file_count?: number;
}): MissingItem[] {
  const missing: MissingItem[] = [];
  if (!book.title_en) missing.push({ label: "Titulo en ingles" });
  if (!book.title_fr) missing.push({ label: "Titulo en frances" });
  if (!book.description_es) missing.push({ label: "Descripcion en espanol" });
  if (!book.description_en) missing.push({ label: "Descripcion en ingles" });
  if (!book.description_fr) missing.push({ label: "Descripcion en frances" });
  if (!book.image_url) missing.push({ label: "Imagen portada" });
  if (book.file_count !== undefined && book.file_count === 0)
    missing.push({ label: "Archivos del libro" });
  return missing;
}

export function getCollaboratorMissing(collaborator: {
  logo_url?: string | null;
  website_url?: string | null;
}): MissingItem[] {
  const missing: MissingItem[] = [];
  if (!collaborator.logo_url) missing.push({ label: "Logo" });
  if (!collaborator.website_url) missing.push({ label: "URL web" });
  return missing;
}
