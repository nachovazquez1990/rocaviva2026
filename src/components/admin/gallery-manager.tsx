"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryImage {
  id?: string;
  image_url: string;
  alt_es?: string;
  alt_en?: string;
  alt_fr?: string;
  display_order: number;
}

interface GalleryManagerProps {
  images: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
  folder?: string;
  label?: string;
  maxImages?: number;
  maxSizeMB?: number;
}

export function GalleryManager({
  images,
  onChange,
  folder = "gallery",
  label = "Galeria de imagenes",
  maxImages = 20,
  maxSizeMB = 5,
}: GalleryManagerProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(files: FileList) {
    const remaining = maxImages - images.length;
    if (remaining <= 0) {
      setError(`Maximo ${maxImages} imagenes permitidas`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remaining);
    setError("");
    setUploading(true);

    const newImages: GalleryImage[] = [];

    for (const file of filesToUpload) {
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`"${file.name}" supera los ${maxSizeMB}MB. Se ha omitido.`);
        continue;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();

        if (res.ok) {
          newImages.push({
            image_url: data.url,
            display_order: images.length + newImages.length,
          });
        }
      } catch {
        // skip failed uploads
      }
    }

    if (newImages.length > 0) {
      onChange([...images, ...newImages]);
    }
    setUploading(false);
  }

  async function handleRemove(index: number) {
    const img = images[index];

    // Delete from blob
    try {
      await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: img.image_url }),
      });
    } catch {
      // ignore
    }

    const updated = images
      .filter((_, i) => i !== index)
      .map((img, i) => ({ ...img, display_order: i }));
    onChange(updated);
  }

  function moveImage(index: number, direction: "left" | "right") {
    const swapIdx = direction === "left" ? index - 1 : index + 1;
    if (swapIdx < 0 || swapIdx >= images.length) return;

    const updated = [...images];
    [updated[index], updated[swapIdx]] = [updated[swapIdx], updated[index]];
    onChange(updated.map((img, i) => ({ ...img, display_order: i })));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-neutral-700">{label}</label>
        <span className="text-xs text-neutral-400">
          {images.length}/{maxImages}
        </span>
      </div>

      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mb-3">
          {images.map((img, idx) => (
            <div
              key={img.image_url + idx}
              className="relative group aspect-square bg-neutral-100 overflow-hidden border border-neutral-200"
            >
              <Image
                src={img.image_url}
                alt=""
                fill
                className="object-cover"
                unoptimized
              />

              {/* Overlay controls */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => moveImage(idx, "left")}
                  disabled={idx === 0}
                  className="p-1 bg-white/90 text-neutral-700 disabled:opacity-30"
                  title="Mover izquierda"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="p-1 bg-red-500 text-white"
                  title="Eliminar"
                >
                  <X size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => moveImage(idx, "right")}
                  disabled={idx === images.length - 1}
                  className="p-1 bg-white/90 text-neutral-700 disabled:opacity-30"
                  title="Mover derecha"
                >
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* Order number */}
              <span className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 font-mono">
                {idx + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {images.length < maxImages && (
        <div
          onClick={() => inputRef.current?.click()}
          className={cn(
            "border-2 border-dashed border-neutral-300 hover:border-brand-400 px-4 py-4 text-center cursor-pointer transition-colors",
            uploading && "pointer-events-none opacity-60"
          )}
        >
          {uploading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 size={18} className="animate-spin text-brand-600" />
              <span className="text-sm text-neutral-500">Subiendo...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Upload size={18} className="text-neutral-400" />
              <span className="text-sm text-neutral-500">Anadir imagenes</span>
              <span className="text-xs text-neutral-400">(max {maxSizeMB}MB/foto, max {maxImages} fotos)</span>
            </div>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) handleUpload(e.target.files);
          e.target.value = "";
        }}
      />

      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}
