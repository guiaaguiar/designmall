/**
 * Conversão entre linhas do D1 (snake_case, JSON em texto, booleanos 0/1)
 * e os objetos tipados usados pela aplicação.
 */
import type { Category, MallEvent, Store } from './schema';

type Row = Record<string, unknown>;

const str = (v: unknown) => (v == null ? '' : String(v));
const nullable = (v: unknown) => (v == null || v === '' ? null : String(v));
const bool = (v: unknown) => v === 1 || v === true || v === '1';
const int = (v: unknown) => (typeof v === 'number' ? v : Number.parseInt(str(v) || '0', 10));

export function parseJson<T>(value: unknown, fallback: T): T {
  if (typeof value !== 'string' || value === '') return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

/* --------------------------------- categorias --------------------------------- */

export const categoryFromRow = (r: Row): Category => ({
  id: str(r.id),
  slug: str(r.slug),
  name: str(r.name),
  tone: str(r.tone) as Category['tone'],
  icon: str(r.icon),
  position: int(r.position),
});

export const categoryToRow = (c: Category) => ({
  id: c.id,
  slug: c.slug,
  name: c.name,
  tone: c.tone,
  icon: c.icon,
  position: c.position,
});

/* ----------------------------------- lojas ------------------------------------ */

export const storeFromRow = (r: Row): Store => ({
  id: str(r.id),
  slug: str(r.slug),
  name: str(r.name),
  categoryId: nullable(r.category_id),
  floor: str(r.floor),
  unit: str(r.unit),
  shortDescription: str(r.short_description),
  description: str(r.description),
  logoUrl: nullable(r.logo_url),
  coverUrl: nullable(r.cover_url),
  phone: str(r.phone),
  whatsapp: str(r.whatsapp),
  instagram: str(r.instagram),
  website: str(r.website),
  hours: str(r.hours),
  tags: parseJson<string[]>(r.tags, []),
  featured: bool(r.featured),
  position: int(r.position),
  active: bool(r.active),
});

export const storeToRow = (s: Store) => ({
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
  featured: s.featured ? 1 : 0,
  position: s.position,
  active: s.active ? 1 : 0,
});

/* ---------------------------------- eventos ----------------------------------- */

export const eventFromRow = (r: Row): MallEvent => ({
  id: str(r.id),
  slug: str(r.slug),
  title: str(r.title),
  tag: str(r.tag),
  description: str(r.description),
  imageUrl: nullable(r.image_url),
  startsAt: nullable(r.starts_at),
  endsAt: nullable(r.ends_at),
  ctaLabel: str(r.cta_label),
  ctaUrl: str(r.cta_url),
  position: int(r.position),
  active: bool(r.active),
});

export const eventToRow = (e: MallEvent) => ({
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
  active: e.active ? 1 : 0,
});
