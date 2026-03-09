"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { HomeContent } from "@/lib/supabase/types";
import { LocalizedInputs } from "@/components/admin/localized-inputs";
import { Save, Check, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionConfig {
  label: string;
  keys: { key: string; label: string; multiline?: boolean }[];
}

const SECTIONS: SectionConfig[] = [
  {
    label: "Hero",
    keys: [
      { key: "hero_subtitle", label: "Subtitulo" },
      { key: "hero_cta", label: "Boton CTA" },
    ],
  },
  {
    label: "Quienes Somos",
    keys: [
      { key: "about_title", label: "Titulo" },
      { key: "about_intro", label: "Parrafo introductorio", multiline: true },
      { key: "about_exhibition_1", label: "Exposicion destacada 1" },
      { key: "about_exhibition_2", label: "Exposicion destacada 2" },
      { key: "about_exhibition_3", label: "Exposicion destacada 3" },
      { key: "about_exhibition_4", label: "Exposicion destacada 4" },
      { key: "about_projects", label: "Texto proyectos", multiline: true },
      { key: "about_collaborators", label: "Texto colaboradores", multiline: true },
      { key: "about_nobel", label: "Texto Mujeres Nobel", multiline: true },
      { key: "about_readings", label: "Texto lecturas dramatizadas", multiline: true },
      { key: "about_yo_te_aplaudo", label: "Texto #YoTeAplaudo", multiline: true },
    ],
  },
  {
    label: "Servicios",
    keys: [
      { key: "services_title", label: "Titulo seccion" },
      { key: "service_exhibitions", label: "Exposiciones - titulo" },
      { key: "service_exhibitions_desc", label: "Exposiciones - descripcion", multiline: true },
      { key: "service_guided_tours", label: "Visitas guiadas - titulo" },
      { key: "service_guided_tours_desc", label: "Visitas guiadas - descripcion", multiline: true },
      { key: "service_conferences", label: "Conferencias - titulo" },
      { key: "service_conferences_desc", label: "Conferencias - descripcion", multiline: true },
      { key: "service_readings", label: "Lecturas - titulo" },
      { key: "service_readings_desc", label: "Lecturas - descripcion", multiline: true },
      { key: "service_workshops", label: "Talleres - titulo" },
      { key: "service_workshops_desc", label: "Talleres - descripcion", multiline: true },
      { key: "service_commemorations", label: "Conmemorativas - titulo" },
      { key: "service_commemorations_desc", label: "Conmemorativas - descripcion", multiline: true },
    ],
  },
  {
    label: "Contacto",
    keys: [
      { key: "contact_title", label: "Titulo" },
      { key: "contact_cta", label: "Subtitulo / CTA" },
      { key: "contact_button", label: "Texto boton" },
    ],
  },
  {
    label: "Redes Sociales",
    keys: [
      { key: "social_title", label: "Titulo seccion" },
    ],
  },
];

const ALL_KEYS = SECTIONS.flatMap((s) => s.keys.map((k) => k.key));

export default function HomeContentAdminPage() {
  const supabase = createClient();
  const [items, setItems] = useState<HomeContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [forms, setForms] = useState<Record<string, { es: string; en: string; fr: string }>>({});
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(SECTIONS.map((s) => [s.label, true]))
  );

  const fetchItems = useCallback(async () => {
    const { data } = await supabase.from("home_content").select("*").order("key");
    const contentItems = (data as HomeContent[]) || [];
    setItems(contentItems);

    const formData: Record<string, { es: string; en: string; fr: string }> = {};
    contentItems.forEach((item) => {
      formData[item.key] = {
        es: item.value_es || "",
        en: item.value_en || "",
        fr: item.value_fr || "",
      };
    });

    // Initialize missing keys with empty values
    for (const key of ALL_KEYS) {
      if (!formData[key]) {
        formData[key] = { es: "", en: "", fr: "" };
      }
    }

    setForms(formData);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch from external system (Supabase)
    void fetchItems();
  }, [fetchItems]);

  function updateField(key: string, lang: string, value: string) {
    setForms((prev) => ({
      ...prev,
      [key]: { ...prev[key], [lang]: value },
    }));
    setSaved(false);
  }

  function toggleSection(label: string) {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  async function handleSave() {
    setSaving(true);

    const existingKeys = new Set(items.map((i) => i.key));
    const updates = ALL_KEYS.map((key) => {
      const values = forms[key];
      if (existingKeys.has(key)) {
        return supabase
          .from("home_content")
          .update({
            value_es: values?.es || null,
            value_en: values?.en || null,
            value_fr: values?.fr || null,
          })
          .eq("key", key)
          .then();
      } else {
        return supabase
          .from("home_content")
          .insert({
            key,
            value_es: values?.es || null,
            value_en: values?.en || null,
            value_fr: values?.fr || null,
          })
          .then();
      }
    });

    await Promise.all(updates);
    await fetchItems();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading) return <div className="text-neutral-500">Cargando...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Contenido Home</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 disabled:opacity-50"
        >
          {saved ? <Check size={16} /> : <Save size={16} />}
          {saving ? "Guardando..." : saved ? "Guardado" : "Guardar todo"}
        </button>
      </div>

      <div className="space-y-4">
        {SECTIONS.map((section) => {
          const isOpen = openSections[section.label];
          return (
            <div key={section.label} className="bg-white border border-neutral-200">
              <button
                type="button"
                onClick={() => toggleSection(section.label)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-neutral-50 transition-colors"
              >
                <h2 className="text-lg font-semibold text-neutral-900">{section.label}</h2>
                {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              </button>

              <div
                className={cn(
                  "overflow-hidden transition-all duration-300",
                  isOpen ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <div className="px-4 pb-4 space-y-5 border-t border-neutral-100 pt-4">
                  {section.keys.map(({ key, label, multiline }) => (
                    <div key={key}>
                      <LocalizedInputs
                        field={key}
                        label={label}
                        values={forms[key] || { es: "", en: "", fr: "" }}
                        onChange={(lang, val) => updateField(key, lang, val)}
                        multiline={multiline}
                      />
                      <p className="text-xs text-neutral-400 mt-1">
                        Clave: <code className="bg-neutral-100 px-1">{key}</code>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
