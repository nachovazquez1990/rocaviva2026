"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Collaborator } from "@/lib/supabase/types";
import { AdminModal } from "@/components/admin/admin-modal";
import { ImageUpload } from "@/components/admin/image-upload";
import { Plus, Pencil, Trash2, Eye, EyeOff, ArrowUp, ArrowDown } from "lucide-react";

interface CollabForm {
  name: string;
  logo_url: string;
  website_url: string;
  is_published: boolean;
}

const emptyForm: CollabForm = { name: "", logo_url: "", website_url: "", is_published: true };

export default function CollaboratorsAdminPage() {
  const supabase = createClient();
  const [items, setItems] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CollabForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchItems = useCallback(async () => {
    const { data } = await supabase.from("collaborators").select("*").order("display_order", { ascending: true });
    setItems((data as Collaborator[]) || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(item: Collaborator) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      logo_url: item.logo_url,
      website_url: item.website_url || "",
      is_published: item.is_published,
    });
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name: form.name,
      logo_url: form.logo_url,
      website_url: form.website_url || null,
      is_published: form.is_published,
    };

    if (editingId) {
      await supabase.from("collaborators").update(payload).eq("id", editingId);
    } else {
      const maxOrder = items.length > 0 ? Math.max(...items.map((i) => i.display_order)) + 1 : 0;
      await supabase.from("collaborators").insert({ ...payload, display_order: maxOrder });
    }

    setSaving(false);
    setModalOpen(false);
    fetchItems();
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Eliminar colaborador "${name}"?`)) return;
    await supabase.from("collaborators").delete().eq("id", id);
    fetchItems();
  }

  async function togglePublished(id: string, current: boolean) {
    await supabase.from("collaborators").update({ is_published: !current }).eq("id", id);
    fetchItems();
  }

  async function moveOrder(id: string, direction: "up" | "down") {
    const idx = items.findIndex((i) => i.id === id);
    if ((direction === "up" && idx === 0) || (direction === "down" && idx === items.length - 1)) return;

    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    const currentOrder = items[idx].display_order;
    const swapOrder = items[swapIdx].display_order;

    await Promise.all([
      supabase.from("collaborators").update({ display_order: swapOrder }).eq("id", items[idx].id),
      supabase.from("collaborators").update({ display_order: currentOrder }).eq("id", items[swapIdx].id),
    ]);
    fetchItems();
  }

  if (loading) return <div className="text-neutral-500">Cargando...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">
          Colaboradores <span className="text-sm font-normal text-neutral-500">({items.length})</span>
        </h1>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white text-sm font-medium hover:bg-brand-700">
          <Plus size={16} /> Nuevo colaborador
        </button>
      </div>

      <div className="bg-white border border-neutral-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200">
              <th className="text-left px-4 py-3 font-medium text-neutral-600 w-20">Orden</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-600">Nombre</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-600">Logo</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-600">Web</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-600 w-20">Estado</th>
              <th className="text-right px-4 py-3 font-medium text-neutral-600 w-28">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => moveOrder(item.id, "up")} disabled={idx === 0} className="p-0.5 text-neutral-400 hover:text-neutral-700 disabled:opacity-30" aria-label="Subir">
                      <ArrowUp size={14} />
                    </button>
                    <button onClick={() => moveOrder(item.id, "down")} disabled={idx === items.length - 1} className="p-0.5 text-neutral-400 hover:text-neutral-700 disabled:opacity-30" aria-label="Bajar">
                      <ArrowDown size={14} />
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-neutral-900">{item.name}</td>
                <td className="px-4 py-3">
                  <img src={item.logo_url} alt={item.name} className="h-8 w-auto max-w-[100px] object-contain" />
                </td>
                <td className="px-4 py-3 text-neutral-500 text-xs truncate max-w-[200px]">
                  {item.website_url || "—"}
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => togglePublished(item.id, item.is_published)}>
                    {item.is_published ? <Eye size={16} className="text-green-600" /> : <EyeOff size={16} className="text-neutral-400" />}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEdit(item)} className="p-1.5 text-neutral-500 hover:text-brand-600" aria-label="Editar"><Pencil size={15} /></button>
                    <button onClick={() => handleDelete(item.id, item.name)} className="p-1.5 text-neutral-500 hover:text-red-600" aria-label="Eliminar"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-neutral-400">No hay colaboradores.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Editar colaborador" : "Nuevo colaborador"}>
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Nombre *</label>
            <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required className="w-full px-3 py-2 border border-neutral-300 text-sm focus:outline-none focus:border-brand-600" />
          </div>
          <ImageUpload
            label="Logo *"
            value={form.logo_url}
            onChange={(url) => setForm((f) => ({ ...f, logo_url: url }))}
            folder="collaborators"
          />
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">URL web</label>
            <input type="url" value={form.website_url} onChange={(e) => setForm((f) => ({ ...f, website_url: e.target.value }))} className="w-full px-3 py-2 border border-neutral-300 text-sm focus:outline-none focus:border-brand-600" placeholder="https://..." />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="collab_pub" checked={form.is_published} onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))} className="w-4 h-4 accent-brand-600" />
            <label htmlFor="collab_pub" className="text-sm text-neutral-700">Publicado</label>
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
