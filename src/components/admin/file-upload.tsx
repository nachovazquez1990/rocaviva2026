"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  accept?: string;
  hint?: string;
  className?: string;
}

export function FileUpload({
  value,
  onChange,
  folder = "files",
  label,
  accept = ".pdf,.odt",
  hint = "PDF o ODT. Max 60MB",
  className,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File) {
    setError("");

    // Client-side file type validation
    const allowedExts = accept.split(",").map((e) => e.trim().toLowerCase());
    const fileExt = `.${file.name.split(".").pop()?.toLowerCase()}`;
    if (!allowedExts.includes(fileExt)) {
      const readable = allowedExts.map((e) => e.replace(".", "").toUpperCase()).join(", ");
      setError(`Formato no permitido. Solo se aceptan: ${readable}`);
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al subir archivo");
        setUploading(false);
        return;
      }

      onChange(data.url);
    } catch {
      setError("Error de conexion");
    }
    setUploading(false);
  }

  async function handleRemove() {
    if (!value) return;

    try {
      await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: value }),
      });
    } catch {
      // ignore
    }

    onChange("");
  }

  const fileName = value ? decodeURIComponent(value.split("/").pop() || "") : "";

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-2">{label}</label>
      )}

      {value ? (
        <div className="flex items-center gap-3 p-3 border border-neutral-200 bg-neutral-50">
          <FileText size={20} className="text-brand-600 shrink-0" />
          <span className="text-sm text-neutral-700 truncate flex-1" title={fileName}>
            {fileName}
          </span>
          <button
            type="button"
            onClick={handleRemove}
            className="p-1 text-neutral-400 hover:text-red-600 transition-colors shrink-0"
            title="Eliminar archivo"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files?.[0];
            if (file) handleUpload(file);
          }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          className={cn(
            "border-2 border-dashed px-6 py-6 text-center cursor-pointer transition-colors",
            dragOver
              ? "border-brand-500 bg-brand-50"
              : "border-neutral-300 hover:border-brand-400",
            uploading && "pointer-events-none opacity-60"
          )}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 size={24} className="animate-spin text-brand-600" />
              <span className="text-sm text-neutral-500">Subiendo...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload size={24} className="text-neutral-400" />
              <span className="text-sm text-neutral-500">Arrastra un archivo o haz clic para seleccionar</span>
              <span className="text-xs text-neutral-400">{hint}</span>
            </div>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
          e.target.value = "";
        }}
      />

      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}
