"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Exhibition, Project, ExhibitionImage } from "@/lib/supabase/types";
import { AdminModal } from "@/components/admin/admin-modal";
import { LocalizedRichText } from "@/components/admin/localized-rich-text";
import { ImageUpload } from "@/components/admin/image-upload";
import { GalleryManager } from "@/components/admin/gallery-manager";
import { Plus, Pencil, Trash2, Eye, EyeOff, Filter } from "lucide-react";

interface ExhibitionForm {
  project_id: string;
  slug: string;
  city: string;
  venue: string;
  date_from: string;
  date_to: string;
  description_es: string;
  description_en: string;
  description_fr: string;
  image_url: string;
  is_published: boolean;
}

interface GalleryImage {
  id?: string;
  image_url: string;
  alt_es?: string;
  alt_en?: string;
  alt_fr?: string;
  display_order: number;
}

const emptyForm: ExhibitionForm = {
  project_id: "",
  slug: "",
  city: "",
  venue: "",
  date_from: "",
  date_to: "",
  description_es: "",
  description_en: "",
  description_fr: "",
  image_url: "",
  is_published: true,
};

export default function ExhibitionsAdminPage() {
  const supabase = createClient();
  const [items, setItems] = useState<(Exhibition & { project_title?: string })[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterProject, setFilterProject] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ExhibitionForm>(emptyForm);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [saving, setSaving] = useState(false);
  const [slugError, setSlugError] = useState("");

  const fetchData = useCallback(async () => {
    const [{ data: exh }, { data: proj }] = await Promise.all([
      supabase.from("exhibitions").select("*").order("display_order", { ascending: true }),
      supabase.from("projects").select("*").order("display_order", { ascending: true }),
    ]);
    setProjects((proj as Project[]) || []);
    const projectMap = new Map((proj || []).map((p) => [p.id, p.title_es]));
    setItems(
      ((exh as Exhibition[]) || []).map((e) => ({
        ...e,
        project_title: projectMap.get(e.project_id) || "—",
      }))
    );
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch from external system (Supabase)
    void fetchData();
  }, [fetchData]);

  async function loadGallery(exhibitionId: string) {
    const { data } = await supabase
      .from("exhibition_images")
      .select("*")
      .eq("exhibition_id", exhibitionId)
      .order("display_order", { ascending: true });
    setGalleryImages(
      (data || []).map((img: ExhibitionImage) => ({
        id: img.id,
        image_url: img.image_url,
        alt_es: img.alt_es || "",
        alt_en: img.alt_en || "",
        alt_fr: img.alt_fr || "",
        display_order: img.display_order,
      }))
    );
  }

  const filteredItems = filterProject
    ? items.filter((i) => i.project_id === filterProject)
    : items;

  function openCreate() {
    setEditingId(null);
    setForm({ ...emptyForm, project_id: filterProject || (projects[0]?.id ?? "") });
    setGalleryImages([]);
    setModalOpen(true);
  }

  function openEdit(item: Exhibition) {
    setEditingId(item.id);
    setForm({
      project_id: item.project_id,
      slug: item.slug,
      city: item.city,
      venue: item.venue || "",
      date_from: item.date_from || "",
      date_to: item.date_to || "",
      description_es: item.description_es || "",
      description_en: item.description_en || "",
      description_fr: item.description_fr || "",
      image_url: item.image_url || "",
      is_published: item.is_published,
    });
    loadGallery(item.id);
    setModalOpen(true);
  }

  async function checkSlugExists(slug: string, projectId: string): Promise<boolean> {
    const query = supabase.from("exhibitions").select("id").eq("slug", slug).eq("project_id", projectId);
    if (editingId) query.neq("id", editingId);
    const { data } = await query;
    return (data?.length || 0) > 0;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSlugError("");

    const slugTaken = await checkSlugExists(form.slug, form.project_id);
    if (slugTaken) {
      setSlugError("Este slug ya existe para este proyecto. Elige otro.");
      setSaving(false);
      return;
    }

    const payload = {
      ...form,
      venue: form.venue || null,
      date_from: form.date_from || null,
      date_to: form.date_to || null,
      description_en: form.description_en || null,
      description_fr: form.description_fr || null,
      image_url: form.image_url || null,
    };

    let exhibitionId = editingId;

    if (editingId) {
      await supabase.from("exhibitions").update(payload).eq("id", editingId);
    } else {
      const maxOrder = items.length > 0 ? Math.max(...items.map((i) => i.display_order)) + 1 : 0;
      const { data } = await supabase
        .from("exhibitions")
        .insert({ ...payload, display_order: maxOrder })
        .select("id")
        .single();
      exhibitionId = data?.id || null;
    }

    // Save gallery images
    if (exhibitionId) {
      const { data: existingImgs } = await supabase
        .from("exhibition_images")
        .select("id")
        .eq("exhibition_id", exhibitionId);
      const existingIds = (existingImgs || []).map((i: { id: string }) => i.id);
      const currentIds = galleryImages.filter((g) => g.id).map((g) => g.id!);
      const toDelete = existingIds.filter((id: string) => !currentIds.includes(id));

      if (toDelete.length > 0) {
        await supabase.from("exhibition_images").delete().in("id", toDelete);
      }

      for (const img of galleryImages) {
        if (img.id) {
          await supabase
            .from("exhibition_images")
            .update({ display_order: img.display_order })
            .eq("id", img.id);
        } else {
          await supabase.from("exhibition_images").insert({
            exhibition_id: exhibitionId,
            image_url: img.image_url,
            alt_es: img.alt_es || null,
            alt_en: img.alt_en || null,
            alt_fr: img.alt_fr || null,
            display_order: img.display_order,
          });
        }
      }
    }

    setSaving(false);
    setModalOpen(false);
    fetchData();
  }

  async function handleDelete(id: string, city: string) {
    if (!window.confirm(`Eliminar exposicion "${city}"?`)) return;
    await supabase.from("exhibitions").delete().eq("id", id);
    fetchData();
  }

  async function togglePublished(id: string, current: boolean) {
    await supabase.from("exhibitions").update({ is_published: !current }).eq("id", id);
    fetchData();
  }

  function autoSlug(city: string) {
    return city
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  if (loading) return <div className="text-neutral-500">Cargando...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Exposiciones</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors"
        >
          <Plus size={16} />
          Nueva exposicion
        </button>
      </div>

      {/* Filter by project */}
      <div className="flex items-center gap-2 mb-4">
        <Filter size={16} className="text-neutral-500" />
        <select
          value={filterProject}
          onChange={(e) => setFilterProject(e.target.value)}
          className="px-3 py-1.5 border border-neutral-300 text-sm focus:outline-none focus:border-brand-600"
        >
          <option value="">Todos los proyectos</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title_es}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white border border-neutral-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200">
              <th className="text-left px-4 py-3 font-medium text-neutral-600">Ciudad</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-600">Proyecto</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-600">Recinto</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-600">Fechas</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-600 w-20">Estado</th>
              <th className="text-right px-4 py-3 font-medium text-neutral-600 w-28">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                <td className="px-4 py-3 font-medium text-neutral-900">{item.city}</td>
                <td className="px-4 py-3 text-neutral-500">{item.project_title}</td>
                <td className="px-4 py-3 text-neutral-500">{item.venue || "—"}</td>
                <td className="px-4 py-3 text-neutral-500 text-xs">
                  {item.date_from && item.date_to
                    ? `${item.date_from} — ${item.date_to}`
                    : item.date_from || "—"}
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => togglePublished(item.id, item.is_published)}>
                    {item.is_published ? (
                      <Eye size={16} className="text-green-600" />
                    ) : (
                      <EyeOff size={16} className="text-neutral-400" />
                    )}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEdit(item)} className="p-1.5 text-neutral-500 hover:text-brand-600" aria-label="Editar">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => handleDelete(item.id, item.city)} className="p-1.5 text-neutral-500 hover:text-red-600" aria-label="Eliminar">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredItems.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-neutral-400">
                  No hay exposiciones.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Editar exposicion" : "Nueva exposicion"} wide>
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Proyecto *</label>
            <select
              value={form.project_id}
              onChange={(e) => setForm((f) => ({ ...f, project_id: e.target.value }))}
              required
              className="w-full px-3 py-2 border border-neutral-300 text-sm focus:outline-none focus:border-brand-600"
            >
              <option value="">Seleccionar...</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.title_es}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Ciudad *</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => {
                  setForm((f) => ({ ...f, city: e.target.value }));
                  if (!editingId) setForm((f) => ({ ...f, slug: autoSlug(e.target.value), city: e.target.value }));
                }}
                required
                className="w-full px-3 py-2 border border-neutral-300 text-sm focus:outline-none focus:border-brand-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Slug</label>
              <p className="text-xs text-neutral-400 mb-2">Auto-generado de la ciudad.</p>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => {
                  setForm((f) => ({ ...f, slug: e.target.value }));
                  setSlugError("");
                }}
                required
                className={`w-full px-3 py-2 border text-sm focus:outline-none ${slugError ? "border-red-500 focus:border-red-500" : "border-neutral-300 focus:border-brand-600"}`}
              />
              {slugError && <p className="text-xs text-red-600 mt-1">{slugError}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Recinto</label>
            <input
              type="text"
              value={form.venue}
              onChange={(e) => setForm((f) => ({ ...f, venue: e.target.value }))}
              className="w-full px-3 py-2 border border-neutral-300 text-sm focus:outline-none focus:border-brand-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Fecha inicio</label>
              <input
                type="date"
                value={form.date_from}
                onChange={(e) => setForm((f) => ({ ...f, date_from: e.target.value }))}
                className="w-full px-3 py-2 border border-neutral-300 text-sm focus:outline-none focus:border-brand-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Fecha fin</label>
              <input
                type="date"
                value={form.date_to}
                onChange={(e) => setForm((f) => ({ ...f, date_to: e.target.value }))}
                className="w-full px-3 py-2 border border-neutral-300 text-sm focus:outline-none focus:border-brand-600"
              />
            </div>
          </div>

          <LocalizedRichText
            label="Descripcion"
            values={{ es: form.description_es, en: form.description_en, fr: form.description_fr }}
            onChange={(lang, val) => setForm((f) => ({ ...f, [`description_${lang}`]: val }))}
          />

          <ImageUpload
            label="Imagen principal"
            value={form.image_url}
            onChange={(url) => setForm((f) => ({ ...f, image_url: url }))}
            folder="exhibitions"
          />

          {/* Gallery */}
          <GalleryManager
            images={galleryImages}
            onChange={setGalleryImages}
            folder="exhibitions/gallery"
            label="Galeria de imagenes"
            maxImages={20}
            maxSizeMB={5}
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="exh_published"
              checked={form.is_published}
              onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))}
              className="w-4 h-4 accent-brand-600"
            />
            <label htmlFor="exh_published" className="text-sm text-neutral-700">Publicado</label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-neutral-600 hover:text-neutral-900">Cancelar</button>
            <button type="submit" disabled={saving} className="px-6 py-2 bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 disabled:opacity-50">
              {saving ? "Guardando..." : editingId ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
