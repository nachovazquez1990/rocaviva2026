"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { RichTextEditor } from "./rich-text-editor";

const LANGS = [
  { key: "es", label: "ES" },
  { key: "en", label: "EN" },
  { key: "fr", label: "FR" },
] as const;

interface LocalizedRichTextProps {
  label: string;
  values: { es: string; en: string; fr: string };
  onChange: (lang: string, value: string) => void;
  required?: boolean;
}

export function LocalizedRichText({
  label,
  values,
  onChange,
  required,
}: LocalizedRichTextProps) {
  const [activeLang, setActiveLang] = useState<"es" | "en" | "fr">("es");

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <label className="text-sm font-medium text-neutral-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="flex gap-1 ml-auto">
          {LANGS.map((lang) => (
            <button
              key={lang.key}
              type="button"
              onClick={() => setActiveLang(lang.key)}
              className={cn(
                "px-2 py-0.5 text-xs font-medium transition-colors",
                activeLang === lang.key
                  ? "bg-brand-600 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              )}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Render editor for active language, keep others hidden to preserve state */}
      {LANGS.map((lang) => (
        <div key={lang.key} className={activeLang === lang.key ? "" : "hidden"}>
          <RichTextEditor
            content={values[lang.key]}
            onChange={(html) => onChange(lang.key, html)}
          />
        </div>
      ))}

      <p className="text-xs text-neutral-400 mt-1">
        Editando: {activeLang === "es" ? "Espanol" : activeLang === "en" ? "English" : "Francais"}
        {" | "}Soporta negrita, cursiva, subrayado y listas
      </p>
    </div>
  );
}
