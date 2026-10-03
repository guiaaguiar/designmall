/**
 * Leitura do conteúdo da landing a partir do D1.
 *
 * Resiliência: se o banco não existir, estiver vazio ou falhar, a página é
 * renderizada com o conteúdo de `seed.ts`. Seções com dados inválidos são
 * ignoradas individualmente (e logadas), sem derrubar o restante.
 */
import { env } from 'cloudflare:workers';
import { categoryFromRow, eventFromRow, parseJson, storeFromRow } from './mappers';
import {
  isSectionType,
  parseSectionData,
  settingsSchema,
  type Section,
  type SiteContent,
} from './schema';
import { seedCategories, seedEvents, seedSections, seedSettings, seedStores } from './seed';

type Row = Record<string, unknown>;

export function getSeedContent(): SiteContent {
  return {
    settings: seedSettings,
    sections: seedSections,
    categories: seedCategories,
    stores: seedStores,
    events: seedEvents,
    source: 'seed',
  };
}

function getDb(): D1Database | undefined {
  return (env as { DB?: D1Database }).DB;
}

export async function getSiteContent(): Promise<SiteContent> {
  const db = getDb();
  if (!db) return getSeedContent();

  try {
    const [settingsRes, sectionsRes, categoriesRes, storesRes, eventsRes] = await db.batch<Row>([
      db.prepare(`SELECT value FROM settings WHERE key = 'site'`),
      db.prepare(`SELECT * FROM sections WHERE enabled = 1 ORDER BY position, id`),
      db.prepare(`SELECT * FROM categories ORDER BY position, name`),
      db.prepare(`SELECT * FROM stores WHERE active = 1 ORDER BY featured DESC, position, name`),
      db.prepare(`SELECT * FROM events WHERE active = 1 ORDER BY position, starts_at`),
    ]);

    const sectionRows = sectionsRes.results ?? [];
    if (sectionRows.length === 0) return getSeedContent();

    // Configurações: valores do banco sobrescrevem os padrões campo a campo.
    const storedSettings = parseJson<Record<string, unknown>>(settingsRes.results?.[0]?.value, {});
    const settingsParsed = settingsSchema.safeParse({ ...seedSettings, ...storedSettings });
    if (!settingsParsed.success) {
      console.warn('[content] settings inválidas, usando padrão', settingsParsed.error.issues);
    }

    const sections: Section[] = [];
    for (const row of sectionRows) {
      const type = String(row.type);
      if (!isSectionType(type)) {
        console.warn(`[content] tipo de seção desconhecido: ${type}`);
        continue;
      }
      const parsed = parseSectionData(type, parseJson(row.data, {}));
      if (!parsed.success) {
        console.warn(`[content] seção "${row.id}" ignorada — dados inválidos`, parsed.error.issues);
        continue;
      }
      sections.push({
        id: String(row.id),
        type,
        anchor: row.anchor ? String(row.anchor) : null,
        position: Number(row.position),
        enabled: true,
        data: parsed.data,
      } as Section);
    }

    return {
      settings: settingsParsed.success ? settingsParsed.data : seedSettings,
      sections,
      categories: (categoriesRes.results ?? []).map(categoryFromRow),
      stores: (storesRes.results ?? []).map(storeFromRow),
      events: (eventsRes.results ?? []).map(eventFromRow),
      source: 'database',
    };
  } catch (error) {
    console.error('[content] falha ao ler o D1, usando conteúdo padrão', error);
    return getSeedContent();
  }
}
