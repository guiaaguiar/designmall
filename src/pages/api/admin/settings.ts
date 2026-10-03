/**
 * GET  /api/admin/settings  → configurações globais (nav, rodapé, horários, endereço, SEO…)
 * PUT  /api/admin/settings  → substitui/mescla as configurações (validadas)
 */
import type { APIRoute } from 'astro';
import { ValidationError } from '../../../lib/admin/crud';
import { getDb, handleError, json, readBody } from '../../../lib/admin/http';
import { parseJson } from '../../../lib/content/mappers';
import { settingsSchema } from '../../../lib/content/schema';
import { seedSettings } from '../../../lib/content/seed';

async function current(db: D1Database) {
  const row = await db.prepare(`SELECT value FROM settings WHERE key = 'site'`).first<{ value: string }>();
  return { ...seedSettings, ...parseJson<Record<string, unknown>>(row?.value, {}) };
}

export const GET: APIRoute = async () => {
  try {
    return json(await current(getDb()));
  } catch (error) {
    return handleError(error);
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const db = getDb();
    const patch = await readBody(request);
    const parsed = settingsSchema.safeParse({ ...(await current(db)), ...patch });
    if (!parsed.success) {
      throw new ValidationError(parsed.error.issues.map((i) => ({ path: i.path as (string | number)[], message: i.message })));
    }
    await db
      .prepare(
        `INSERT INTO settings (key, value) VALUES ('site', ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')`,
      )
      .bind(JSON.stringify(parsed.data))
      .run();
    return json(parsed.data);
  } catch (error) {
    return handleError(error);
  }
};
