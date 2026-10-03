/**
 * Protege a API administrativa (/api/admin/*) com um token secreto.
 *   - produção: `npx wrangler secret put ADMIN_TOKEN`
 *   - local:    arquivo .dev.vars com ADMIN_TOKEN=...
 * Quando o /admin for criado, recomenda-se também colocar /admin* atrás do
 * Cloudflare Access (login por e-mail, sem código extra).
 */
import { defineMiddleware } from 'astro:middleware';
import { env } from 'cloudflare:workers';

const encoder = new TextEncoder();

async function safeEqual(a: string, b: string): Promise<boolean> {
  // compara hashes para não vazar o tamanho do token pelo tempo de resposta
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(a)),
    crypto.subtle.digest('SHA-256', encoder.encode(b)),
  ]);
  // timingSafeEqual é uma extensão do runtime Workers (não existe no tipo DOM)
  const subtle = crypto.subtle as SubtleCrypto & { timingSafeEqual(a: ArrayBuffer, b: ArrayBuffer): boolean };
  return subtle.timingSafeEqual(ha, hb);
}

const deny = (status: number, error: string) =>
  new Response(JSON.stringify({ error }), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

export const onRequest = defineMiddleware(async (context, next) => {
  if (!context.url.pathname.startsWith('/api/admin')) return next();

  const token = (env as { ADMIN_TOKEN?: string }).ADMIN_TOKEN;
  if (!token) return deny(503, 'API administrativa desativada: defina o secret ADMIN_TOKEN.');

  const header = context.request.headers.get('authorization') ?? '';
  const provided = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!provided || !(await safeEqual(provided, token))) return deny(401, 'Não autorizado');

  return next();
});
