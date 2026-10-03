/**
 * Gera db/seed.sql a partir de src/lib/content/seed.ts.
 * Uso: npm run db:seed:generate   (Node 22.18+ executa TypeScript nativamente)
 *
 * O seed usa INSERT OR REPLACE — rodar de novo restaura o conteúdo padrão
 * dos registros-semente, sem apagar lojas/eventos criados depois pelo /admin.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  seedCategories,
  seedEvents,
  seedSections,
  seedSettings,
  seedStores,
} from '../src/lib/content/seed.ts';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(root, 'db/seed.sql');

const sql = (v: unknown): string => {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'number') return String(v);
  if (typeof v === 'boolean') return v ? '1' : '0';
  return `'${String(v).replaceAll("'", "''")}'`;
};

const insert = (table: string, row: Record<string, unknown>) => {
  const cols = Object.keys(row);
  return `INSERT OR REPLACE INTO ${table} (${cols.join(', ')}) VALUES (${cols.map((c) => sql(row[c])).join(', ')});`;
};

const lines: string[] = ['-- Gerado por scripts/generate-seed.ts — não edite à mão.', ''];

lines.push(insert('settings', { key: 'site', value: JSON.stringify(seedSettings) }), '');

for (const s of seedSections) {
  lines.push(
    insert('sections', {
      id: s.id,
      type: s.type,
      anchor: s.anchor,
      position: s.position,
      enabled: s.enabled,
      data: JSON.stringify(s.data),
    }),
  );
}
lines.push('');

for (const c of seedCategories) lines.push(insert('categories', { ...c }));
lines.push('');

for (const s of seedStores) {
  lines.push(
    insert('stores', {
      id: s.id,
      slug: s.slug,
      name: s.name,
      category_id: s.categoryId,
      floor: s.floor,
      unit: s.unit,
      short_description: s.shortDescription,
      description: s.description,
      logo_url: s.logoUrl,
      cover_url: s.coverUrl,
      phone: s.phone,
      whatsapp: s.whatsapp,
      instagram: s.instagram,
      website: s.website,
      hours: s.hours,
      tags: JSON.stringify(s.tags),
      featured: s.featured,
      position: s.position,
      active: s.active,
    }),
  );
}
lines.push('');

for (const e of seedEvents) {
  lines.push(
    insert('events', {
      id: e.id,
      slug: e.slug,
      title: e.title,
      tag: e.tag,
      description: e.description,
      image_url: e.imageUrl,
      starts_at: e.startsAt,
      ends_at: e.endsAt,
      cta_label: e.ctaLabel,
      cta_url: e.ctaUrl,
      position: e.position,
      active: e.active,
    }),
  );
}

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, lines.join('\n') + '\n', 'utf8');
console.log(`seed gerado: ${out}`);
