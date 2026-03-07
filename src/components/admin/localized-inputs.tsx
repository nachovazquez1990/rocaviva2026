"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const LANGS = [
  { key: "es", label: "ES" },
  { key: "en", label: "EN" },
  { key: "fr", label: "FR" },
] as const;

interface LocalizedInputsProps {
  field: string;
  label: string;
  values: { es: string; en: string; fr: string };
  onChange: (lang: string, value: string) => void;
  multiline?: boolean;
  required?: boolean;
}

export function LocalizedInputs({
  field,
  label,
  values,
  onChange,
  multiline,
  required,
}: LocalizedInputsProps) {
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
      {multiline ? (
        <textarea
          id={`${field}_${activeLang}`}
          value={values[activeLang]}
          onChange={(e) => onChange(activeLang, e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-neutral-300 text-sm focus:outline-none focus:border-brand-600 transition-colors resize-none"
          required={required && activeLang === "es"}
        />
      ) : (
        <input
          id={`${field}_${activeLang}`}
          type="text"
          value={values[activeLang]}
          onChange={(e) => onChange(activeLang, e.target.value)}
          className="w-full px-3 py-2 border border-neutral-300 text-sm focus:outline-none focus:border-brand-600 transition-colors"
          required={required && activeLang === "es"}
        />
      )}
      <p className="text-xs text-neutral-400 mt-1">
        Editando: {activeLang === "es" ? "Espanol" : activeLang === "en" ? "English" : "Francais"}
      </p>
    </div>
  );
}
