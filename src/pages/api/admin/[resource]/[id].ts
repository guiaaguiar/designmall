/**
 * GET    /api/admin/:resource/:id → item
 * PUT    /api/admin/:resource/:id → atualiza (campos omitidos mantêm o valor atual)
 * PATCH  /api/admin/:resource/:id → idem ao PUT
 * DELETE /api/admin/:resource/:id → remove
 */
import type { APIRoute } from 'astro';
import { deleteItem, getItem, updateItem } from '../../../../lib/admin/crud';
import { getDb, handleError, json, readBody } from '../../../../lib/admin/http';
import { getResource } from '../../../../lib/admin/resources';

export const GET: APIRoute = async ({ params }) => {
  const res = getResource(params.resource);
  if (!res || !params.id) return json({ error: 'Recurso inexistente' }, 404);
  try {
    return json(await getItem(getDb(), res, params.id));
  } catch (error) {
    return handleError(error);
  }
};

export const PUT: APIRoute = async ({ params, request }) => {
  const res = getResource(params.resource);
  if (!res || !params.id) return json({ error: 'Recurso inexistente' }, 404);
  try {
    return json(await updateItem(getDb(), res, params.id, await readBody(request)));
  } catch (error) {
    return handleError(error);
  }
};

export const PATCH = PUT;

export const DELETE: APIRoute = async ({ params }) => {
  const res = getResource(params.resource);
  if (!res || !params.id) return json({ error: 'Recurso inexistente' }, 404);
  try {
    await deleteItem(getDb(), res, params.id);
    return new Response(null, { status: 204 });
  } catch (error) {
    return handleError(error);
  }
};
