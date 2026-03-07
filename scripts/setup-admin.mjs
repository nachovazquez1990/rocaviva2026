/**
 * Script to create the admin user in Supabase.
 *
 * Usage:
 *   node scripts/setup-admin.mjs
 *
 * Requires:
 *   - NEXT_PUBLIC_SUPABASE_URL in .env.local
 *   - SUPABASE_SERVICE_ROLE_KEY in .env.local
 *   - ADMIN_EMAIL and ADMIN_PASSWORD env vars (or edit below)
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env.local
const envPath = resolve(process.cwd(), ".env.local");
const envContent = readFileSync(envPath, "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
});

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const EMAIL = process.env.ADMIN_EMAIL || "admin@rocaviva.eu";
const PASSWORD = process.env.ADMIN_PASSWORD || "";

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || SERVICE_ROLE_KEY === "placeholder-service-role-key") {
  console.error("Error: Configura NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local");
  process.exit(1);
}

if (!PASSWORD) {
  console.error("Error: Proporciona ADMIN_PASSWORD como variable de entorno");
  console.error("Ejemplo: ADMIN_PASSWORD=micontrasena123 node scripts/setup-admin.mjs");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function main() {
  console.log(`Creando usuario admin: ${EMAIL}...`);

  const { data, error } = await supabase.auth.admin.createUser({
    email: EMAIL,
    password: PASSWORD,
    email_confirm: true,
  });

  if (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }

  console.log("Usuario admin creado correctamente!");
  console.log(`  Email: ${data.user.email}`);
  console.log(`  ID: ${data.user.id}`);
  console.log(`\nYa puedes iniciar sesion en /admin/login`);
}

main();
