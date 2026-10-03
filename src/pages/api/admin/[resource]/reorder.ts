/**
 * POST /api/admin/:resource/reorder  { "ids": ["hero", "manifesto", ...] }
 * A ordem do array passa a ser a ordem de exibição (usado no arrastar-e-soltar do /admin).
 */
import type { APIRoute } from 'astro';
import { reorderItems, ValidationError } from '../../../../lib/admin/crud';
import { getDb, handleError, json, readBody } from '../../../../lib/admin/http';
import { getResource } from '../../../../lib/admin/resources';

export const POST: APIRoute = async ({ params, request }) => {
  const res = getResource(params.resource);
  if (!res) return json({ error: 'Recurso inexistente' }, 404);
  try {
    const { ids } = await readBody(request);
    if (!Array.isArray(ids) || !ids.every((id) => typeof id === 'string')) {
      throw new ValidationError([{ path: ['ids'], message: 'Envie "ids" como lista de textos' }]);
    }
    await reorderItems(getDb(), res, ids as string[]);
    return json({ ok: true, order: ids });
  } catch (error) {
    return handleError(error);
  }
};
