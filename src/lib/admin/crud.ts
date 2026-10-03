/**
 * CRUD genérico sobre o D1. Colunas vêm sempre de `toRow` (lista fechada)
 * e valores são sempre passados como parâmetros — sem SQL montado com input.
 */
import type { Resource } from './resources';

type Row = Record<string, unknown>;

export class ValidationError extends Error {
  constructor(public issues: { path: (string | number)[]; message: string }[]) {
    super('Dados inválidos');
  }
}

export class NotFoundError extends Error {}

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

export const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

function validate<T extends { id: string }>(res: Resource<T>, input: unknown): T {
  const parsed = res.schema.safeParse(input);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues.map((i) => ({ path: i.path as (string | number)[], message: i.message })),
    );
  }
  return parsed.data;
}

export async function listItems<T extends { id: string }>(db: D1Database, res: Resource<T>): Promise<T[]> {
  const { results } = await db.prepare(`SELECT * FROM ${res.table} ORDER BY ${res.orderBy}`).all<Row>();
  return (results ?? []).map(res.fromRow);
}

export async function getItem<T extends { id: string }>(db: D1Database, res: Resource<T>, id: string): Promise<T> {
  const row = await db.prepare(`SELECT * FROM ${res.table} WHERE id = ?`).bind(id).first<Row>();
  if (!row) throw new NotFoundError();
  return res.fromRow(row);
}

export async function createItem<T extends { id: string }>(
  db: D1Database,
  res: Resource<T>,
  input: Record<string, unknown>,
): Promise<T> {
  const draft = { ...input };
  // slug e id automáticos quando não informados
  if (!draft.slug && typeof (draft.name ?? draft.title) === 'string') {
    draft.slug = slugify(String(draft.name ?? draft.title));
  }
  if (!draft.id) draft.id = `${res.idPrefix}-${draft.slug ?? crypto.randomUUID().slice(0, 8)}`;
  if (draft.position === undefined) {
    const max = await db.prepare(`SELECT COALESCE(MAX(position), 0) AS max FROM ${res.table}`).first<{ max: number }>();
    draft.position = (max?.max ?? 0) + 10;
  }

  const item = validate(res, draft);
  const row = res.toRow(item);
  const cols = Object.keys(row);
  await db
    .prepare(`INSERT INTO ${res.table} (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`)
    .bind(...cols.map((c) => row[c] ?? null))
    .run();
  return item;
}

export async function updateItem<T extends { id: string }>(
  db: D1Database,
  res: Resource<T>,
  id: string,
  patch: Record<string, unknown>,
): Promise<T> {
  const current = (await getItem(db, res, id)) as T & { data?: unknown };
  // PATCH semântico: campos ausentes mantêm o valor atual; o id não muda.
  // Para seções, `data` também é mesclado (basta enviar os campos alterados).
  const merged: Record<string, unknown> = { ...current, ...patch, id };
  if (isPlainObject(current.data) && isPlainObject(patch.data)) {
    merged.data = { ...current.data, ...patch.data };
  }
  const item = validate(res, merged);
  const row = res.toRow(item);
  const cols = Object.keys(row).filter((c) => c !== 'id');
  const sets = cols.map((c) => `${c} = ?`);
  if (res.timestamps) sets.push(`updated_at = datetime('now')`);
  await db
    .prepare(`UPDATE ${res.table} SET ${sets.join(', ')} WHERE id = ?`)
    .bind(...cols.map((c) => row[c] ?? null), id)
    .run();
  return item;
}

export async function deleteItem<T extends { id: string }>(db: D1Database, res: Resource<T>, id: string): Promise<void> {
  const result = await db.prepare(`DELETE FROM ${res.table} WHERE id = ?`).bind(id).run();
  if (!result.meta.changes) throw new NotFoundError();
}

/** Reordena itens: a ordem do array vira a ordem de exibição (10, 20, 30…). */
export async function reorderItems<T extends { id: string }>(
  db: D1Database,
  res: Resource<T>,
  ids: string[],
): Promise<void> {
  const stmt = db.prepare(`UPDATE ${res.table} SET position = ? WHERE id = ?`);
  await db.batch(ids.map((id, i) => stmt.bind((i + 1) * 10, id)));
}
