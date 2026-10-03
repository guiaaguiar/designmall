/** Conteúdo público da landing em JSON (útil para o futuro /admin, apps e integrações). */
import type { APIRoute } from 'astro';
import { getSiteContent } from '../../lib/content/repository';

export const GET: APIRoute = async () => {
  const content = await getSiteContent();
  return new Response(JSON.stringify(content), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=60',
    },
  });
};
