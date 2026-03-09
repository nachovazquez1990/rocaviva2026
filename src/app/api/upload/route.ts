import { NextRequest, NextResponse } from "next/server";
import { put, del } from "@vercel/blob";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  // Verify auth
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string) || "general";

  if (!file) {
    return NextResponse.json({ error: "No se ha proporcionado archivo" }, { status: 400 });
  }

  // Validate file type (by MIME and extension, some browsers misreport ODT MIME)
  const ext = file.name.split(".").pop()?.toLowerCase();
  const isDossier = folder === "dossiers";

  if (isDossier) {
    // Dossiers: only PDF and ODT
    const dossierMimes = ["application/pdf", "application/vnd.oasis.opendocument.text"];
    const dossierExts = ["pdf", "odt"];
    if (!dossierMimes.includes(file.type) && (!ext || !dossierExts.includes(ext))) {
      return NextResponse.json(
        { error: "Solo se permiten archivos PDF o ODT." },
        { status: 400 }
      );
    }
  } else {
    // Other uploads: images only
    const imageTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif"];
    const imageExts = ["jpg", "jpeg", "png", "webp", "svg", "gif"];
    if (!imageTypes.includes(file.type) && (!ext || !imageExts.includes(ext))) {
      return NextResponse.json(
        { error: "Solo se permiten imagenes: JPG, PNG, WebP, SVG o GIF." },
        { status: 400 }
      );
    }
  }

  // Max 60MB for dossiers, 10MB for images
  const maxSize = isDossier ? 60 * 1024 * 1024 : 10 * 1024 * 1024;
  if (file.size > maxSize) {
    const maxMB = maxSize / (1024 * 1024);
    return NextResponse.json({ error: `El archivo supera los ${maxMB}MB` }, { status: 400 });
  }

  // Generate unique filename
  const fileExt = file.name.split(".").pop() || "jpg";
  const timestamp = Date.now();
  const safeName = file.name
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .slice(0, 50);
  const pathname = `rocaviva/${folder}/${safeName}-${timestamp}.${fileExt}`;

  const blob = await put(pathname, file, {
    access: "public",
    addRandomSuffix: false,
  });

  return NextResponse.json({ url: blob.url });
}

export async function DELETE(request: NextRequest) {
  // Verify auth
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { url } = await request.json();
  if (!url) {
    return NextResponse.json({ error: "URL requerida" }, { status: 400 });
  }

  // Only delete from Vercel Blob (check hostname)
  try {
    if (url.includes("vercel-storage.com") || url.includes("blob.vercel-storage.com")) {
      await del(url);
    }
  } catch {
    // File may already be deleted, ignore
  }

  return NextResponse.json({ ok: true });
}
