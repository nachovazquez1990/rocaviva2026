const fs = require('fs');
const data = JSON.parse(fs.readFileSync('c:/Projects/rocaviva/src/content/Press.json', 'utf-8'));
const es = data.press_es;
const en = data.press_en;
const fr = data.press_fr;

const typeMap = { prensa: 'press', radio: 'radio', tv: 'tv', youtube: 'video' };
const BLOB_BASE = 'https://your-blob-url.vercel-storage.com/communication';

function esc(str) {
  if (!str) return 'NULL';
  return "'" + str.replace(/'/g, "''") + "'";
}

let sql = `-- Insert news records from Press.json
-- Images should be uploaded to Vercel Blob under: communication/
-- Example: communication/1.jpg, communication/2.jpg, etc.

INSERT INTO news (title_es, title_en, title_fr, description_es, description_en, description_fr, image_url, date, link_url, media_type, is_published)
VALUES\n`;

const rows = [];

for (let i = 0; i < es.length; i++) {
  const e = es[i];
  const n = en[i];
  const f = fr[i];

  // Title is the same across languages (media name)
  const title_es = esc(e.title);
  const title_en = esc(n.title);
  const title_fr = esc(f.title);

  const desc_es = esc(e.description);
  const desc_en = esc(n.description);
  const desc_fr = esc(f.description);

  // Image URL - convert to Vercel Blob path
  const imgFile = e.image ? e.image.replace('/assets/press/', '') : null;
  const image_url = imgFile ? esc(`${BLOB_BASE}/${imgFile}`) : 'NULL';

  // Date
  const date = esc(e.formated_date);

  // Primary link (first one)
  const primaryLink = (e.links && e.links.length > 0) ? e.links[0] : null;
  const link_url = primaryLink ? esc(primaryLink.link) : 'NULL';

  // Media type from first link type
  const rawType = primaryLink ? primaryLink.type : 'prensa';
  const media_type = esc(typeMap[rawType] || 'press');

  rows.push(`(${title_es}, ${title_en}, ${title_fr}, ${desc_es}, ${desc_en}, ${desc_fr}, ${image_url}, ${date}, ${link_url}, ${media_type}, true)`);
}

sql += rows.join(',\n') + ';\n';

// Also report multi-link items that lose secondary links
console.log('--- MULTI-LINK ITEMS (secondary links will be lost) ---');
for (const item of es) {
  if (item.links && item.links.length > 1) {
    console.log(`ID ${item.id} (${item.title}): ${item.links.map(l => l.type + ': ' + l.link).join(' | ')}`);
  }
}

fs.writeFileSync('c:/Projects/rocaviva2026/scripts/insert-news.sql', sql, 'utf-8');
console.log(`\nGenerated ${rows.length} rows -> scripts/insert-news.sql`);
console.log('Unique images referenced:', new Set(es.map(e => e.image).filter(Boolean)).size);
