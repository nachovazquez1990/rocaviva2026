/**
 * Updates projects.image_url with the new (timestamp-free) blob URLs.
 * Mobile variants are resolved at render time via convention:
 *   /projects/foo.jpg -> /projects/mobile/foo-m.jpg
 *
 * Usage: node scripts/update-project-images.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

const envPath = resolve(process.cwd(), ".env.local");
const env = {};
readFileSync(envPath, "utf-8")
  .split("\n")
  .forEach((line) => {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (!m) return;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    env[m[1].trim()] = v;
  });

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

const BLOB_PREFIX = "https://xwol5lxaqceczvs1.public.blob.vercel-storage.com/rocaviva/projects";

// slug → blob basename (without extension, without -m suffix)
const MAPPING = {
  "mujeres-nobel": "web-portada-mujeres-nobel",
  "mujeres-nobel-de-ciencias": "web-portada-ciencias",
  "mujeres-nobel-de-literatura": "web-portada-literatura",
  "mujeres-nobel-de-la-paz": "web-portada-mujeres-paz",
  "concha-espina-una-pionera-en-el-mundo-literario": "web-portada-concha",
  "teresa-de-jesus-corazon-en-espana-alma-en-america": "web-portada-la-santa",
  "maria-sklodowska-curie": "web-curie",
  "polacas-que-han-cambiado-el-mundo": "web-polacas",
  "margarita-salas-ciencia-con-nombre-de-mujer": "web-portada-ciencia",
  astronautas: "web-portada-moon",
  "filatelia-y-salud": "web-portada-correos",
  "handimals-arte-en-las-manos": "web-portada-handimals",
};

let ok = 0;
let fail = 0;

for (const [slug, basename] of Object.entries(MAPPING)) {
  const url = `${BLOB_PREFIX}/${basename}.jpg`;
  const { error } = await supabase
    .from("projects")
    .update({ image_url: url })
    .eq("slug", slug);

  if (error) {
    console.error(`✗ ${slug}: ${error.message}`);
    fail++;
  } else {
    console.log(`✓ ${slug} -> ${basename}.jpg`);
    ok++;
  }
}

console.log(`\nDone. ${ok} updated, ${fail} failed.`);
process.exit(fail > 0 ? 1 : 0);
