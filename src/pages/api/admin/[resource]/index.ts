/**
 * GET  /api/admin/:resource → lista (sections | stores | events | categories)
 * POST /api/admin/:resource → cria (id, slug e posição são gerados se omitidos)
 */
import type { APIRoute } from 'astro';
import { createItem, listItems } from '../../../../lib/admin/crud';
import { getDb, handleError, json, readBody } from '../../../../lib/admin/http';
import { getResource } from '../../../../lib/admin/resources';

export const GET: APIRoute = async ({ params }) => {
  const res = getResource(params.resource);
  if (!res) return json({ error: 'Recurso inexistente' }, 404);
  try {
    return json(await listItems(getDb(), res));
  } catch (error) {
    return handleError(error);
  }
};

export const POST: APIRoute = async ({ params, request }) => {
  const res = getResource(params.resource);
  if (!res) return json({ error: 'Recurso inexistente' }, 404);
  try {
    return json(await createItem(getDb(), res, await readBody(request)), 201);
  } catch (error) {
    return handleError(error);
  }
};
