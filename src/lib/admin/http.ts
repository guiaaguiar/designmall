import { env } from 'cloudflare:workers';
import { NotFoundError, ValidationError } from './crud';

export const json = (data: unknown, status = 200, headers: HeadersInit = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers },
  });

export function getDb(): D1Database {
  const db = (env as { DB?: D1Database }).DB;
  if (!db) throw new Error('Binding D1 "DB" não configurado no wrangler.jsonc');
  return db;
}

export async function readBody(request: Request): Promise<Record<string, unknown>> {
  try {
    const body = await request.json();
    if (body && typeof body === 'object' && !Array.isArray(body)) return body as Record<string, unknown>;
  } catch {
    /* corpo vazio ou inválido */
  }
  throw new ValidationError([{ path: [], message: 'Envie um objeto JSON no corpo da requisição' }]);
}

/** Converte erros conhecidos em respostas HTTP coerentes. */
export function handleError(error: unknown): Response {
  if (error instanceof ValidationError) return json({ error: error.message, issues: error.issues }, 422);
  if (error instanceof NotFoundError) return json({ error: 'Registro não encontrado' }, 404);
  const message = error instanceof Error ? error.message : String(error);
  if (/UNIQUE constraint failed/i.test(message)) {
    return json({ error: 'Já existe um registro com esse id ou slug' }, 409);
  }
  console.error('[admin]', error);
  return json({ error: 'Erro interno' }, 500);
}
