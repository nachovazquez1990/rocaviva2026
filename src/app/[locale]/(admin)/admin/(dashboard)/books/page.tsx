"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Book, BookFile } from "@/lib/supabase/types";
import { AdminModal } from "@/components/admin/admin-modal";
import { LocalizedInputs } from "@/components/admin/localized-inputs";
import { LocalizedRichText } from "@/components/admin/localized-rich-text";
import { ImageUpload } from "@/components/admin/image-upload";
import { FileUpload } from "@/components/admin/file-upload";
import { Plus, Pencil, Trash2, Eye, EyeOff, X } from "lucide-react";

interface BookForm {
  title_es: string;
  title_en: string;
  title_fr: string;
  description_es: string;
  description_en: string;
  description_fr: string;
  image_url: string;
  extra_image_url: string;
  is_published: boolean;
}

interface FilePart {
  id?: string;
  file_url: string;
  label: string;
  part_number: number;
}

const emptyForm: BookForm = {
  title_es: "",
  title_en: "",
  title_fr: "",
  description_es: "",
  description_en: "",
  description_fr: "",
  image_url: "",
  extra_image_url: "",
  is_published: true,
};

export default function BooksAdminPage() {
  const supabase = createClient();
  const [items, setItems] = useState<(Book & { file_count?: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BookForm>(emptyForm);
  const [fileParts, setFileParts] = useState<FilePart[]>([]);
  const [saving, setSaving] = useState(false);

  const fetchItems = useCallback(async () => {
    const { data: books } = await supabase.from("books").select("*").order("created_at", { ascending: false });
    const { data: files } = await supabase.from("book_files").select("book_id");

    const fileCounts = new Map<string, number>();
    (files || []).forEach((f: { book_id: string }) => {
      fileCounts.set(f.book_id, (fileCounts.get(f.book_id) || 0) + 1);
    });

    setItems(
      ((books as Book[]) || []).map((b) => ({
        ...b,
        file_count: fileCounts.get(b.id) || 0,
      }))
    );
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  async function loadFileParts(bookId: string) {
    const { data } = await supabase
      .from("book_files")
      .select("*")
      .eq("book_id", bookId)
      .order("part_number", { ascending: true });

    setFileParts(
      (data || []).map((f: BookFile) => ({
        id: f.id,
        file_url: f.file_url,
        label: f.label || "",
        part_number: f.part_number,
      }))
    );
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setFileParts([]);
    setModalOpen(true);
  }

  function openEdit(item: Book) {
    setEditingId(item.id);
    setForm({
      title_es: item.title_es,
      title_en: item.title_en || "",
      title_fr: item.title_fr || "",
      description_es: item.description_es || "",
      description_en: item.description_en || "",
      description_fr: item.description_fr || "",
      image_url: item.image_url || "",
      extra_image_url: item.extra_image_url || "",
      is_published: item.is_published,
    });
    loadFileParts(item.id);
    setModalOpen(true);
  }

  function addFilePart() {
    const nextNum = fileParts.length > 0 ? Math.max(...fileParts.map((f) => f.part_number)) + 1 : 1;
    setFileParts([...fileParts, { file_url: "", label: "", part_number: nextNum }]);
  }

  function removeFilePart(index: number) {
    const part = fileParts[index];
    // Delete file from blob if it has a URL
    if (part.file_url) {
      fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: part.file_url }),
      }).catch(() => {});
    }
    setFileParts(fileParts.filter((_, i) => i !== index).map((f, i) => ({ ...f, part_number: i + 1 })));
  }

  function updateFilePart(index: number, updates: Partial<FilePart>) {
    setFileParts(fileParts.map((f, i) => (i === index ? { ...f, ...updates } : f)));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title_es: form.title_es,
      title_en: form.title_en || null,
      title_fr: form.title_fr || null,
      description_es: form.description_es,
      description_en: form.description_en || null,
      description_fr: form.description_fr || null,
      image_url: form.image_url || null,
      extra_image_url: form.extra_image_url || null,
      is_published: form.is_published,
    };

    let bookId = editingId;

    if (editingId) {
      await supabase.from("books").update(payload).eq("id", editingId);
    } else {
      const { data } = await supabase.from("books").insert(payload).select("id").single();
      bookId = data?.id || null;
    }

    // Save file parts
    if (bookId) {
      // Delete all existing and re-insert (simpler than diffing)
      await supabase.from("book_files").delete().eq("book_id", bookId);

      const validParts = fileParts.filter((f) => f.file_url);
      if (validParts.length > 0) {
        await supabase.from("book_files").insert(
          validParts.map((f, i) => ({
            book_id: bookId,
            file_url: f.file_url,
            label: f.label || null,
            part_number: i + 1,
          }))
        );
      }
    }

    setSaving(false);
    setModalOpen(false);
    fetchItems();
  }

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Eliminar libro "${title}"?`)) return;
    await supabase.from("books").delete().eq("id", id);
    fetchItems();
  }

  async function togglePublished(id: string, current: boolean) {
    await supabase.from("books").update({ is_published: !current }).eq("id", id);
    fetchItems();
  }

  if (loading) return <div className="text-neutral-500">Cargando...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Libros</h1>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white text-sm font-medium hover:bg-brand-700">
          <Plus size={16} /> Nuevo libro
        </button>
      </div>

      <div className="bg-white border border-neutral-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200">
              <th className="text-left px-4 py-3 font-medium text-neutral-600">Titulo</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-600">Archivos</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-600 w-20">Estado</th>
              <th className="text-right px-4 py-3 font-medium text-neutral-600 w-28">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {item.image_url && <img src={item.image_url} alt="" className="w-10 h-14 object-cover" />}
                    <span className="font-medium text-neutral-900">{item.title_es}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-neutral-500 text-xs">
                  {item.file_count ? `${item.file_count} parte${item.file_count > 1 ? "s" : ""}` : "Sin archivos"}
                </td>
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
            {items.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-neutral-400">No hay libros.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Editar libro" : "Nuevo libro"} wide>
        <form onSubmit={handleSave} className="space-y-5">
          <LocalizedInputs
            field="title"
            label="Titulo"
            values={{ es: form.title_es, en: form.title_en, fr: form.title_fr }}
            onChange={(lang: string, val: string) => setForm((f) => ({ ...f, [`title_${lang}`]: val }))}
            required
          />

          <LocalizedRichText
            label="Descripcion"
            values={{ es: form.description_es, en: form.description_en, fr: form.description_fr }}
            onChange={(lang: string, val: string) => setForm((f) => ({ ...f, [`description_${lang}`]: val }))}
          />

          <div className="grid grid-cols-2 gap-4">
            <ImageUpload
              label="Imagen portada"
              value={form.image_url}
              onChange={(url) => setForm((f) => ({ ...f, image_url: url }))}
              folder="books"
            />
            <ImageUpload
              label="Imagen sello (opcional)"
              value={form.extra_image_url}
              onChange={(url) => setForm((f) => ({ ...f, extra_image_url: url }))}
              folder="books"
            />
          </div>

          {/* Book file parts */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-neutral-700">
                Archivos del libro <span className="text-neutral-400 font-normal">(PDF / ebook)</span>
              </label>
              <button
                type="button"
                onClick={addFilePart}
                className="flex items-center gap-1 px-3 py-1 text-xs font-medium bg-brand-600 text-white hover:bg-brand-700 transition-colors"
              >
                <Plus size={12} />
                Anadir parte
              </button>
            </div>

            {fileParts.length === 0 && (
              <p className="text-sm text-neutral-400 py-3 text-center border border-dashed border-neutral-300">
                Sin archivos. Pulsa &quot;Anadir parte&quot; para subir el libro.
              </p>
            )}

            <div className="space-y-3">
              {fileParts.map((part, idx) => (
                <div key={idx} className="border border-neutral-200 p-3 bg-neutral-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-neutral-500">Parte {idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeFilePart(idx)}
                      className="p-1 text-neutral-400 hover:text-red-600 transition-colors"
                      title="Eliminar parte"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={part.label}
                      onChange={(e) => updateFilePart(idx, { label: e.target.value })}
                      placeholder={`Etiqueta (ej: "Parte ${idx + 1}", "Capitulos 1-5"...)`}
                      className="w-full px-3 py-1.5 border border-neutral-300 text-sm focus:outline-none focus:border-brand-600"
                    />
                    <FileUpload
                      value={part.file_url}
                      onChange={(url) => updateFilePart(idx, { file_url: url })}
                      folder="books/files"
                      accept=".pdf,.epub,.mobi"
                      hint="PDF, EPUB o MOBI. Max 50MB"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="book_pub" checked={form.is_published} onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))} className="w-4 h-4 accent-brand-600" />
            <label htmlFor="book_pub" className="text-sm text-neutral-700">Publicado</label>
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
