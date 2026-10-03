/**
 * Recursos editáveis pelo /admin. Cada recurso declara tabela, schema de
 * validação e conversão objeto ↔ linha. O CRUD em `crud.ts` é genérico.
 */
import { z } from 'zod';
import {
  categoryFromRow,
  categoryToRow,
  eventFromRow,
  eventToRow,
  parseJson,
  storeFromRow,
  storeToRow,
} from '../content/mappers';
import {
  categorySchema,
  eventSchema,
  isSectionType,
  sectionSchemas,
  storeSchema,
  type SectionType,
} from '../content/schema';

type Row = Record<string, unknown>;

export interface Resource<T extends { id: string }> {
  table: string;
  schema: z.ZodType<T>;
  toRow: (item: T) => Record<string, unknown>;
  fromRow: (row: Row) => T;
  orderBy: string;
  /** a tabela tem coluna updated_at */
  timestamps: boolean;
  /** prefixo para ids gerados automaticamente */
  idPrefix: string;
}

/* ------------------------------- seções ------------------------------- */

export const sectionRecordSchema = z
  .object({
    id: z.string().min(1),
    type: z.string().refine(isSectionType, 'Tipo de seção desconhecido'),
    anchor: z
      .string()
      .regex(/^[a-z0-9-]+$/, 'Âncora: use letras minúsculas, números e hífen')
      .nullable()
      .default(null),
    position: z.number().int().default(0),
    enabled: z.boolean().default(true),
    data: z.record(z.string(), z.unknown()),
  })
  .superRefine((value, ctx) => {
    if (!isSectionType(value.type)) return;
    const parsed = sectionSchemas[value.type as SectionType].safeParse(value.data);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        ctx.addIssue({ code: 'custom', path: ['data', ...issue.path], message: issue.message });
      }
    }
  })
  .transform((value) => ({
    ...value,
    // guarda os dados já normalizados (com valores padrão aplicados)
    data: sectionSchemas[value.type as SectionType].parse(value.data) as Record<string, unknown>,
  }));

export type SectionRecord = z.infer<typeof sectionRecordSchema>;

const sectionToRow = (s: SectionRecord) => ({
  id: s.id,
  type: s.type,
  anchor: s.anchor,
  position: s.position,
  enabled: s.enabled ? 1 : 0,
  data: JSON.stringify(s.data),
});

const sectionFromRow = (r: Row): SectionRecord => ({
  id: String(r.id),
  type: String(r.type) as SectionType,
  anchor: r.anchor ? String(r.anchor) : null,
  position: Number(r.position),
  enabled: r.enabled === 1 || r.enabled === true,
  data: parseJson<Record<string, unknown>>(r.data, {}),
});

/* ------------------------------ registro ------------------------------ */

/** Mantém a tipagem de cada recurso e permite guardá-los num registro comum. */
const defineResource = <T extends { id: string }>(r: Resource<T>) => r as unknown as Resource<{ id: string }>;

export const resources = {
  sections: defineResource<SectionRecord>({
    table: 'sections',
    schema: sectionRecordSchema as unknown as z.ZodType<SectionRecord>,
    toRow: sectionToRow,
    fromRow: sectionFromRow,
    orderBy: 'position, id',
    timestamps: true,
    idPrefix: 'sec',
  }),
  stores: defineResource({
    table: 'stores',
    schema: storeSchema,
    toRow: storeToRow,
    fromRow: storeFromRow,
    orderBy: 'position, name',
    timestamps: true,
    idPrefix: 'store',
  }),
  events: defineResource({
    table: 'events',
    schema: eventSchema,
    toRow: eventToRow,
    fromRow: eventFromRow,
    orderBy: 'position, starts_at',
    timestamps: true,
    idPrefix: 'evt',
  }),
  categories: defineResource({
    table: 'categories',
    schema: categorySchema,
    toRow: categoryToRow,
    fromRow: categoryFromRow,
    orderBy: 'position, name',
    timestamps: false,
    idPrefix: 'cat',
  }),
};

export type ResourceName = keyof typeof resources;

export function getResource(name: string | undefined): Resource<{ id: string }> | null {
  if (!name || !Object.hasOwn(resources, name)) return null;
  return resources[name as ResourceName];
}
