"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { HomeContent } from "@/lib/supabase/types";
import { LocalizedInputs } from "@/components/admin/localized-inputs";
import { LocalizedRichText } from "@/components/admin/localized-rich-text";
import { Save, Check } from "lucide-react";

export default function HomeContentAdminPage() {
  const supabase = createClient();
  const [items, setItems] = useState<HomeContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [forms, setForms] = useState<Record<string, { es: string; en: string; fr: string }>>({});

  const keyLabels: Record<string, string> = {
    hero_subtitle: "Subtitulo Hero",
    about_text: "Texto Quienes Somos",
    services_text: "Texto Servicios",
    contact_text: "Texto Contacto",
  };

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
    setForms(formData);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  function updateField(key: string, lang: string, value: string) {
    setForms((prev) => ({
      ...prev,
      [key]: { ...prev[key], [lang]: value },
    }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);

    const updates = items.map((item) => {
      const values = forms[item.key];
      return supabase
        .from("home_content")
        .update({
          value_es: values?.es || null,
          value_en: values?.en || null,
          value_fr: values?.fr || null,
        })
        .eq("id", item.id);
    });

    await Promise.all(updates);
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

      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white border border-neutral-200 p-6">
            {item.key === "hero_subtitle" ? (
              <LocalizedInputs
                field={item.key}
                label={keyLabels[item.key] || item.key}
                values={forms[item.key] || { es: "", en: "", fr: "" }}
                onChange={(lang, val) => updateField(item.key, lang, val)}
              />
            ) : (
              <LocalizedRichText
                label={keyLabels[item.key] || item.key}
                values={forms[item.key] || { es: "", en: "", fr: "" }}
                onChange={(lang, val) => updateField(item.key, lang, val)}
              />
            )}
            <p className="text-xs text-neutral-400 mt-2">
              Clave: <code className="bg-neutral-100 px-1">{item.key}</code>
            </p>
          </div>
        ))}

        {items.length === 0 && (
          <div className="bg-white border border-neutral-200 p-8 text-center text-neutral-400">
            No hay contenido editable. Ejecuta el schema SQL para crear los valores por defecto.
          </div>
        )}
      </div>
    </div>
  );
}
