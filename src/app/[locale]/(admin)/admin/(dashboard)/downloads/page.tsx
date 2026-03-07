"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { BookDownload } from "@/lib/supabase/types";
import { Download, FileDown } from "lucide-react";

export default function DownloadsAdminPage() {
  const supabase = createClient();
  const [items, setItems] = useState<(BookDownload & { book_title?: string })[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    const [{ data: downloads }, { data: books }] = await Promise.all([
      supabase.from("book_downloads").select("*").order("created_at", { ascending: false }),
      supabase.from("books").select("id, title_es"),
    ]);

    const bookMap = new Map((books || []).map((b) => [b.id, b.title_es]));
    setItems(
      ((downloads as BookDownload[]) || []).map((d) => ({
        ...d,
        book_title: d.book_id ? bookMap.get(d.book_id) || "—" : "—",
      }))
    );
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch from external system (Supabase)
    void fetchItems();
  }, [fetchItems]);

  function exportCSV() {
    const headers = ["Nombre", "Email", "Interes", "Profesion", "Comentarios", "Libro", "Fecha"];
    const rows = items.map((i) => [
      i.name,
      i.email,
      i.interest || "",
      i.profession || "",
      (i.comments || "").replace(/"/g, '""'),
      i.book_title || "",
      new Date(i.created_at).toLocaleDateString("es-ES"),
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `descargas-libros-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const interestLabels: Record<string, string> = {
    personal: "Personal",
    professional: "Profesional",
    gift: "Regalo",
  };

  if (loading) return <div className="text-neutral-500">Cargando...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">
          Descargas de libros <span className="text-sm font-normal text-neutral-500">({items.length})</span>
        </h1>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-accent-600 text-white text-sm font-medium hover:bg-accent-700 transition-colors"
        >
          <FileDown size={16} />
          Exportar CSV
        </button>
      </div>

      <div className="bg-white border border-neutral-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200">
              <th className="text-left px-4 py-3 font-medium text-neutral-600">Nombre</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-600">Email</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-600">Interes</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-600">Profesion</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-600">Libro</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-600">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                <td className="px-4 py-3 font-medium text-neutral-900">{item.name}</td>
                <td className="px-4 py-3 text-neutral-600">
                  <a href={`mailto:${item.email}`} className="hover:text-brand-600">{item.email}</a>
                </td>
                <td className="px-4 py-3 text-neutral-500">
                  {item.interest ? interestLabels[item.interest] || item.interest : "—"}
                </td>
                <td className="px-4 py-3 text-neutral-500">{item.profession || "—"}</td>
                <td className="px-4 py-3 text-neutral-500 text-xs">{item.book_title}</td>
                <td className="px-4 py-3 text-neutral-400 text-xs">
                  {new Date(item.created_at).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-neutral-400">
                  <Download size={24} className="mx-auto mb-2 text-neutral-300" />
                  No hay descargas registradas aun.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {items.length > 0 && items[0].comments && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-neutral-700 mb-3">Ultimos comentarios</h2>
          <div className="space-y-2">
            {items
              .filter((i) => i.comments)
              .slice(0, 10)
              .map((item) => (
                <div key={item.id} className="bg-white border border-neutral-200 p-4">
                  <p className="text-sm text-neutral-700 italic">&ldquo;{item.comments}&rdquo;</p>
                  <p className="text-xs text-neutral-400 mt-1">
                    — {item.name}, {new Date(item.created_at).toLocaleDateString("es-ES")}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
