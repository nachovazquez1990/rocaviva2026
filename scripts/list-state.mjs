import { createClient } from "@supabase/supabase-js";
import { list } from "@vercel/blob";
import { readFileSync } from "fs";
import { resolve } from "path";

const envPath = resolve(process.cwd(), ".env.local");
const envContent = readFileSync(envPath, "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    let v = match[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    env[match[1].trim()] = v;
  }
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

const { data: projects, error } = await supabase
  .from("projects")
  .select("id, slug, title_es, image_url, display_order")
  .order("display_order");

if (error) {
  console.error(error);
  process.exit(1);
}

console.log("=== PROJECTS IN DB ===");
for (const p of projects) {
  console.log(`[${p.display_order}] ${p.slug}`);
  console.log(`    title: ${p.title_es}`);
  console.log(`    image: ${p.image_url ?? "NULL"}`);
}

console.log("\n=== VERCEL BLOB CONTENTS ===");
let cursor;
let total = 0;
do {
  const res = await list({
    token: env.BLOB_READ_WRITE_TOKEN,
    limit: 1000,
    cursor,
  });
  for (const b of res.blobs) {
    console.log(`${b.pathname}  (${(b.size / 1024).toFixed(1)}KB)`);
    total++;
  }
  cursor = res.cursor;
} while (cursor);
console.log(`\nTotal blobs: ${total}`);
