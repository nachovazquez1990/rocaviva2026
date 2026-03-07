"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { News } from "@/lib/supabase/types";
import { AdminModal } from "@/components/admin/admin-modal";
import { LocalizedInputs } from "@/components/admin/localized-inputs";
import { LocalizedRichText } from "@/components/admin/localized-rich-text";
import { ImagePicker } from "@/components/admin/image-picker";
import { Plus, Pencil, Trash2, Eye, EyeOff, Filter } from "lucide-react";

interface NewsForm {
  title_es: string;
  title_en: string;
  title_fr: string;
  description_es: string;
  description_en: string;
  description_fr: string;
  image_url: string;
  date: string;
  link_url: string;
  media_type: "press" | "radio" | "tv" | "video";
  is_published: boolean;
}

const emptyForm: NewsForm = {
  title_es: "",
  title_en: "",
  title_fr: "",
  description_es: "",
  description_en: "",
  description_fr: "",
  image_url: "",
  date: new Date().toISOString().split("T")[0],
  link_url: "",
  media_type: "press",
  is_published: true,
};

const typeLabels: Record<string, string> = {
  press: "Prensa",
  radio: "Radio",
  tv: "TV",
  video: "Video",
};

export default function CommunicationAdminPage() {
  const supabase = createClient();
  const [items, setItems] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<NewsForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchItems = useCallback(async () => {
    const { data } = await supabase
      .from("news")
      .select("*")
      .order("date", { ascending: false });
    setItems((data as News[]) || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const filteredItems = filterType
    ? items.filter((i) => i.media_type === filterType)
    : items;

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(item: News) {
    setEditingId(item.id);
    setForm({
      title_es: item.title_es,
      title_en: item.title_en || "",
      title_fr: item.title_fr || "",
      description_es: item.description_es || "",
      description_en: item.description_en || "",
      description_fr: item.description_fr || "",
      image_url: item.image_url || "",
      date: item.date,
      link_url: item.link_url || "",
      media_type: item.media_type,
      is_published: item.is_published,
    });
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      title_en: form.title_en || null,
      title_fr: form.title_fr || null,
      description_en: form.description_en || null,
      description_fr: form.description_fr || null,
      image_url: form.image_url || null,
      link_url: form.link_url || null,
    };

    if (editingId) {
      await supabase.from("news").update(payload).eq("id", editingId);
    } else {
      await supabase.from("news").insert(payload);
    }

    setSaving(false);
    setModalOpen(false);
    fetchItems();
  }

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Eliminar noticia "${title}"?`)) return;
    await supabase.from("news").delete().eq("id", id);
    fetchItems();
  }

  async function togglePublished(id: string, current: boolean) {
    await supabase.from("news").update({ is_published: !current }).eq("id", id);
    fetchItems();
  }

  if (loading) return <div className="text-neutral-500">Cargando...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Comunicacion</h1>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white text-sm font-medium hover:bg-brand-700">
          <Plus size={16} /> Nueva noticia
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Filter size={16} className="text-neutral-500" />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-1.5 border border-neutral-300 text-sm focus:outline-none focus:border-brand-600"
        >
          <option value="">Todos los tipos</option>
          <option value="press">Prensa</option>
          <option value="radio">Radio</option>
          <option value="tv">TV</option>
          <option value="video">Video</option>
        </select>
      </div>

      <div className="bg-white border border-neutral-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200">
              <th className="text-left px-4 py-3 font-medium text-neutral-600">Titulo</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-600 w-20">Tipo</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-600 w-28">Fecha</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-600 w-20">Estado</th>
              <th className="text-right px-4 py-3 font-medium text-neutral-600 w-28">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {item.image_url && <img src={item.image_url} alt="" className="w-10 h-10 object-cover" />}
                    <span className="font-medium text-neutral-900 line-clamp-1">{item.title_es}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-xs font-medium">
                    {typeLabels[item.media_type]}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-500">{item.date}</td>
                <td className="px-4 py-3">
                  <button onClick={() => togglePublished(item.id, item.is_published)}>
                    {item.is_published ? <Eye size={16} className="text-green-600" /> : <EyeOff size={16} className="text-neutral-400" />}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEdit(item)} className="p-1.5 text-neutral-500 hover:text-brand-600" aria-label="Editar"><Pencil size={15} /></button>
                    <button onClick={() => handleDelete(item.id, item.title_es)} className="p-1.5 text-neutral-500 hover:text-red-600" aria-label="Eliminar"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredItems.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-neutral-400">No hay noticias.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Editar noticia" : "Nueva noticia"} wide>
        <form onSubmit={handleSave} className="space-y-5">
          <LocalizedInputs
            field="title"
            label="Titulo"
            values={{ es: form.title_es, en: form.title_en, fr: form.title_fr }}
            onChange={(lang, val) => setForm((f) => ({ ...f, [`title_${lang}`]: val }))}
            required
          />

          <LocalizedRichText
            label="Descripcion"
            values={{ es: form.description_es, en: form.description_en, fr: form.description_fr }}
            onChange={(lang, val) => setForm((f) => ({ ...f, [`description_${lang}`]: val }))}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Tipo *</label>
              <select
                value={form.media_type}
                onChange={(e) => setForm((f) => ({ ...f, media_type: e.target.value as NewsForm["media_type"] }))}
                className="w-full px-3 py-2 border border-neutral-300 text-sm focus:outline-none focus:border-brand-600"
              >
                <option value="press">Prensa</option>
                <option value="radio">Radio</option>
                <option value="tv">TV</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Fecha *</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-neutral-300 text-sm focus:outline-none focus:border-brand-600"
              />
            </div>
          </div>

          <ImagePicker
            label="Imagen"
            value={form.image_url}
            onChange={(url) => setForm((f) => ({ ...f, image_url: url }))}
            folder="news"
          />

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">URL enlace externo</label>
            <input type="url" value={form.link_url} onChange={(e) => setForm((f) => ({ ...f, link_url: e.target.value }))} className="w-full px-3 py-2 border border-neutral-300 text-sm focus:outline-none focus:border-brand-600" placeholder="https://..." />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="news_pub" checked={form.is_published} onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))} className="w-4 h-4 accent-brand-600" />
            <label htmlFor="news_pub" className="text-sm text-neutral-700">Publicado</label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-neutral-600">Cancelar</button>
            <button type="submit" disabled={saving} className="px-6 py-2 bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 disabled:opacity-50">
              {saving ? "Guardando..." : editingId ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
