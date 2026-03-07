import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// This endpoint creates the admin user. It should only be called once during setup.
// After the first admin is created, protect or remove this endpoint.
export async function POST(request: NextRequest) {
  const setupKey = request.headers.get("x-setup-key");
  if (setupKey !== process.env.ADMIN_SETUP_KEY) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email y contrasena requeridos" }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "La contrasena debe tener al menos 8 caracteres" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    message: `Usuario admin creado: ${data.user.email}`,
    userId: data.user.id,
  });
}
