"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Project, ProjectImage } from "@/lib/supabase/types";
import { AdminModal } from "@/components/admin/admin-modal";
import { LocalizedInputs } from "@/components/admin/localized-inputs";
import { LocalizedRichText } from "@/components/admin/localized-rich-text";
import { ImageUpload } from "@/components/admin/image-upload";
import { FileUpload } from "@/components/admin/file-upload";
import { GalleryManager } from "@/components/admin/gallery-manager";
import { Plus, Pencil, Trash2, GripVertical, Eye, EyeOff } from "lucide-react";
import { CompletenessIndicator, getProjectMissing } from "@/components/admin/completeness-indicator";

interface ProjectForm {
  slug: string;
  title_es: string;
  title_en: string;
  title_fr: string;
  description_es: string;
  description_en: string;
  description_fr: string;
  image_url: string;
  dossier_url_es: string;
  dossier_url_en: string;
  dossier_url_fr: string;
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

const emptyForm: ProjectForm = {
  slug: "",
  title_es: "",
  title_en: "",
  title_fr: "",
  description_es: "",
  description_en: "",
  description_fr: "",
  image_url: "",
  dossier_url_es: "",
  dossier_url_en: "",
  dossier_url_fr: "",
  is_published: true,
};

export default function ProjectsAdminPage() {
  const supabase = createClient();
  const [items, setItems] = useState<(Project & { image_count: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectForm>(emptyForm);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [saving, setSaving] = useState(false);
  const [slugError, setSlugError] = useState("");

  const fetchItems = useCallback(async () => {
    const [{ data }, { data: imgData }] = await Promise.all([
      supabase.from("projects").select("*").order("display_order", { ascending: true }),
      supabase.from("project_images").select("project_id"),
    ]);
    const imgCounts = new Map<string, number>();
    (imgData || []).forEach((img: { project_id: string }) => {
      imgCounts.set(img.project_id, (imgCounts.get(img.project_id) || 0) + 1);
    });
    setItems(
      ((data as Project[]) || []).map((p) => ({
        ...p,
        image_count: imgCounts.get(p.id) || 0,
      }))
    );
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch from external system (Supabase)
    void fetchItems();
  }, [fetchItems]);

  async function loadGallery(projectId: string) {
    const { data } = await supabase
      .from("project_images")
      .select("*")
      .eq("project_id", projectId)
      .order("display_order", { ascending: true });
    setGalleryImages(
      (data || []).map((img: ProjectImage) => ({
        id: img.id,
        image_url: img.image_url,
        alt_es: img.alt_es || "",
        alt_en: img.alt_en || "",
        alt_fr: img.alt_fr || "",
        display_order: img.display_order,
      }))
    );
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setGalleryImages([]);
    setModalOpen(true);
  }

  function openEdit(item: Project) {
    setEditingId(item.id);
    setForm({
      slug: item.slug,
      title_es: item.title_es,
      title_en: item.title_en || "",
      title_fr: item.title_fr || "",
      description_es: item.description_es || "",
      description_en: item.description_en || "",
      description_fr: item.description_fr || "",
      image_url: item.image_url || "",
      dossier_url_es: item.dossier_url_es || "",
      dossier_url_en: item.dossier_url_en || "",
      dossier_url_fr: item.dossier_url_fr || "",
      is_published: item.is_published,
    });
    loadGallery(item.id);
    setModalOpen(true);
  }

  async function checkSlugExists(slug: string): Promise<boolean> {
    const query = supabase.from("projects").select("id").eq("slug", slug);
    if (editingId) query.neq("id", editingId);
    const { data } = await query;
    return (data?.length || 0) > 0;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSlugError("");

    // Check slug uniqueness
    const slugTaken = await checkSlugExists(form.slug);
    if (slugTaken) {
      setSlugError("Este slug ya esta en uso. Elige otro.");
      setSaving(false);
      return;
    }

    const payload = {
      ...form,
      title_en: form.title_en || null,
      title_fr: form.title_fr || null,
      description_en: form.description_en || null,
      description_fr: form.description_fr || null,
      image_url: form.image_url || null,
      dossier_url_es: form.dossier_url_es || null,
      dossier_url_en: form.dossier_url_en || null,
      dossier_url_fr: form.dossier_url_fr || null,
    };

    let projectId = editingId;

    if (editingId) {
      await supabase.from("projects").update(payload).eq("id", editingId);
    } else {
      const maxOrder = items.length > 0 ? Math.max(...items.map((i) => i.display_order)) + 1 : 0;
      const { data } = await supabase
        .from("projects")
        .insert({ ...payload, display_order: maxOrder })
        .select("id")
        .single();
      projectId = data?.id || null;
    }

    // Save gallery images
    if (projectId) {
      // Delete removed images
      const { data: existingImgs } = await supabase
        .from("project_images")
        .select("id")
        .eq("project_id", projectId);
      const existingIds = (existingImgs || []).map((i: { id: string }) => i.id);
      const currentIds = galleryImages.filter((g) => g.id).map((g) => g.id!);
      const toDelete = existingIds.filter((id: string) => !currentIds.includes(id));

      if (toDelete.length > 0) {
        await supabase.from("project_images").delete().in("id", toDelete);
      }

      // Upsert images
      for (const img of galleryImages) {
        if (img.id) {
          await supabase
            .from("project_images")
            .update({ display_order: img.display_order })
            .eq("id", img.id);
        } else {
          await supabase.from("project_images").insert({
            project_id: projectId,
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
    fetchItems();
  }

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Eliminar proyecto "${title}"? Se eliminaran tambien sus exposiciones e imagenes.`)) return;
    await supabase.from("projects").delete().eq("id", id);
    fetchItems();
  }

  async function togglePublished(id: string, current: boolean) {
    await supabase.from("projects").update({ is_published: !current }).eq("id", id);
    fetchItems();
  }

  async function moveOrder(id: string, direction: "up" | "down") {
    const idx = items.findIndex((i) => i.id === id);
    if ((direction === "up" && idx === 0) || (direction === "down" && idx === items.length - 1)) return;

    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    const currentOrder = items[idx].display_order;
    const swapOrder = items[swapIdx].display_order;

    await Promise.all([
      supabase.from("projects").update({ display_order: swapOrder }).eq("id", items[idx].id),
      supabase.from("projects").update({ display_order: currentOrder }).eq("id", items[swapIdx].id),
    ]);
    fetchItems();
  }

  function autoSlug(title: string) {
    return title
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
        <h1 className="text-2xl font-bold text-neutral-900">Proyectos</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors"
        >
          <Plus size={16} />
          Nuevo proyecto
        </button>
      </div>

      <div className="bg-white border border-neutral-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200">
              <th className="text-left px-4 py-3 font-medium text-neutral-600 w-10"></th>
              <th className="text-left px-4 py-3 font-medium text-neutral-600">Proyecto</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-600">Slug</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-600 w-20">Info</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-600 w-20">Estado</th>
              <th className="text-right px-4 py-3 font-medium text-neutral-600 w-32">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveOrder(item.id, "up")}
                      disabled={idx === 0}
                      className="text-neutral-400 hover:text-neutral-700 disabled:opacity-30"
                      aria-label="Subir"
                    >
                      <GripVertical size={14} />
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {item.image_url && (
                      <Image src={item.image_url} alt="" width={40} height={40} className="w-10 h-10 object-cover" unoptimized />
                    )}
                    <span className="font-medium text-neutral-900">{item.title_es}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-neutral-500">{item.slug}</td>
                <td className="px-4 py-3">
                  <CompletenessIndicator missing={getProjectMissing(item)} />
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => togglePublished(item.id, item.is_published)}
                    className="flex items-center gap-1"
                    title={item.is_published ? "Publicado" : "Borrador"}
                  >
                    {item.is_published ? (
                      <Eye size={16} className="text-green-600" />
                    ) : (
                      <EyeOff size={16} className="text-neutral-400" />
                    )}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEdit(item)} className="p-1.5 text-neutral-500 hover:text-brand-600 transition-colors" aria-label="Editar">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => handleDelete(item.id, item.title_es)} className="p-1.5 text-neutral-500 hover:text-red-600 transition-colors" aria-label="Eliminar">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-neutral-400">
                  No hay proyectos. Crea el primero.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Editar proyecto" : "Nuevo proyecto"}
        wide
      >
        <form onSubmit={handleSave} className="space-y-5">
          <LocalizedInputs
            field="title"
            label="Titulo"
            values={{ es: form.title_es, en: form.title_en, fr: form.title_fr }}
            onChange={(lang, val) => {
              setForm((f) => ({ ...f, [`title_${lang}`]: val }));
              if (lang === "es" && !editingId) {
                setForm((f) => ({ ...f, slug: autoSlug(val), [`title_${lang}`]: val }));
              }
            }}
            required
          />

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Slug</label>
            <p className="text-xs text-neutral-400 mb-2">Se genera automaticamente del titulo. Puedes editarlo.</p>
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

          <LocalizedRichText
            label="Descripcion"
            values={{ es: form.description_es, en: form.description_en, fr: form.description_fr }}
            onChange={(lang, val) => setForm((f) => ({ ...f, [`description_${lang}`]: val }))}
          />

          <ImageUpload
            label="Imagen principal (hero)"
            value={form.image_url}
            onChange={(url) => setForm((f) => ({ ...f, image_url: url }))}
            folder="projects"
          />

          {/* Gallery */}
          <GalleryManager
            images={galleryImages}
            onChange={setGalleryImages}
            folder="projects/gallery"
            label="Galeria de imagenes"
            maxImages={20}
            maxSizeMB={5}
          />

          {/* Dossiers */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              Dossier PDF <span className="text-neutral-400 font-normal">(opcional, por idioma)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FileUpload
                label="Espanol"
                value={form.dossier_url_es}
                onChange={(url) => setForm((f) => ({ ...f, dossier_url_es: url }))}
                folder="dossiers"
                accept=".pdf,.odt"
                hint="PDF o ODT. Max 60MB"
              />
              <FileUpload
                label="Ingles"
                value={form.dossier_url_en}
                onChange={(url) => setForm((f) => ({ ...f, dossier_url_en: url }))}
                folder="dossiers"
                accept=".pdf,.odt"
                hint="PDF o ODT. Max 60MB"
              />
              <FileUpload
                label="Frances"
                value={form.dossier_url_fr}
                onChange={(url) => setForm((f) => ({ ...f, dossier_url_fr: url }))}
                folder="dossiers"
                accept=".pdf,.odt"
                hint="PDF o ODT. Max 60MB"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_published"
              checked={form.is_published}
              onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))}
              className="w-4 h-4 accent-brand-600"
            />
            <label htmlFor="is_published" className="text-sm text-neutral-700">
              Publicado
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm text-neutral-600 hover:text-neutral-900"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 disabled:opacity-50"
            >
              {saving ? "Guardando..." : editingId ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
