"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { ImageUpload } from "./image-upload";
import { Images, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

export function ImagePicker({ value, onChange, folder = "news", label }: ImagePickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const loadExistingImages = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("news")
      .select("image_url")
      .not("image_url", "is", null)
      .order("date", { ascending: false });

    if (data) {
      // Deduplicate
      const unique = [...new Set(data.map((d) => d.image_url).filter(Boolean))] as string[];
      setExistingImages(unique);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetching images from external system (Supabase)
    if (showPicker) void loadExistingImages();
  }, [showPicker, loadExistingImages]);

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-2">{label}</label>
      )}

      {/* Upload or pick toggle */}
      <div className="flex items-center gap-2 mb-2">
        <button
          type="button"
          onClick={() => setShowPicker(false)}
          className={cn(
            "px-3 py-1 text-xs font-medium transition-colors",
            !showPicker ? "bg-brand-600 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
          )}
        >
          Subir nueva
        </button>
        <button
          type="button"
          onClick={() => setShowPicker(true)}
          className={cn(
            "px-3 py-1 text-xs font-medium transition-colors flex items-center gap-1",
            showPicker ? "bg-brand-600 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
          )}
        >
          <Images size={12} />
          Elegir existente
        </button>
      </div>

      {showPicker ? (
        <div>
          {loading ? (
            <div className="text-sm text-neutral-500 py-4 text-center">Cargando imagenes...</div>
          ) : existingImages.length === 0 ? (
            <div className="text-sm text-neutral-400 py-4 text-center">No hay imagenes existentes</div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 max-h-60 overflow-y-auto p-2 border border-neutral-200 bg-neutral-50">
              {existingImages.map((url) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => {
                    onChange(url);
                    setShowPicker(false);
                  }}
                  className={cn(
                    "aspect-square overflow-hidden border-2 transition-colors",
                    value === url ? "border-brand-600" : "border-transparent hover:border-brand-300"
                  )}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Show current selection */}
          {value && (
            <div className="mt-2 relative group inline-block">
              <img src={value} alt="Seleccionada" className="h-20 w-auto object-contain border border-neutral-200" />
              <button
                type="button"
                onClick={() => onChange("")}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          )}
        </div>
      ) : (
        <ImageUpload value={value} onChange={onChange} folder={folder} />
      )}
    </div>
  );
}
