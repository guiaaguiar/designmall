/**
 * Fonte única de verdade do conteúdo do site.
 *
 * Cada seção da landing é um registro `{ type, data }` no banco (tabela `sections`).
 * O `data` é validado pelo schema correspondente abaixo — se um texto for salvo
 * com formato inválido pelo /admin, só aquela seção é ignorada, a página continua no ar.
 *
 * Para criar um novo tipo de seção:
 *   1. adicione o schema em `sectionSchemas`
 *   2. crie o componente em `src/components/sections/`
 *   3. registre o componente em `src/components/sections/registry.ts`
 */
import { z } from 'zod';

/* ------------------------------------------------------------------ */
/* Primitivos                                                          */
/* ------------------------------------------------------------------ */

export const toneSchema = z.enum(['pink', 'teal', 'violet', 'purple', 'light']);
export type Tone = z.infer<typeof toneSchema>;

export const linkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});
export type Link = z.infer<typeof linkSchema>;

export const imageSchema = z.object({
  src: z.string().min(1),
  alt: z.string().default(''),
  /** srcset opcional, ex.: "/img-720.webp 720w, /img-1400.webp 1400w" */
  srcset: z.string().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});
export type Image = z.infer<typeof imageSchema>;

const text = z.string().default('');

/* ------------------------------------------------------------------ */
/* Configurações globais do site                                       */
/* ------------------------------------------------------------------ */

export const settingsSchema = z.object({
  name: z.string().default('Design Mall'),
  tagline: z.string().default('Um presente para todos'),
  seo: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string().default('/images/og-design-mall.jpg'),
  }),
  address: z.object({
    street: text,
    district: text,
    city: text,
    state: text,
    zip: text,
  }),
  contact: z.object({
    phone: text,
    whatsapp: text,
    email: text,
  }),
  hours: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
  social: z
    .array(
      z.object({
        network: z.enum(['instagram', 'facebook', 'tiktok', 'youtube', 'whatsapp', 'linkedin']),
        url: z.string(),
      }),
    )
    .default([]),
  nav: z.array(linkSchema).default([]),
  headerCta: linkSchema.optional(),
  footer: z.object({
    tagline: text,
    copyright: text,
    credits: text,
    columns: z.array(z.object({ title: z.string(), links: z.array(linkSchema) })).default([]),
  }),
});
export type Settings = z.infer<typeof settingsSchema>;

/* ------------------------------------------------------------------ */
/* Seções                                                              */
/* ------------------------------------------------------------------ */

const sectionHeader = {
  eyebrow: text,
  title: text,
  subtitle: text,
};

export const sectionSchemas = {
  /** Abertura em tela cheia. `title` aceita quebra de linha (\n) e *ênfase*. */
  hero: z.object({
    eyebrow: text,
    title: z.string(),
    subtitle: text,
    primaryCta: linkSchema.optional(),
    secondaryCta: linkSchema.optional(),
    image: imageSchema.optional(),
    /**
     * Vídeo de abertura conduzido pelo scroll: rolar para baixo toca `src` (e trava a página
     * até o fim); rolar para cima no topo toca `reverseSrc` (o mesmo vídeo invertido).
     */
    video: z
      .object({
        src: z.string(),
        reverseSrc: z.string(),
        /** primeiro quadro (mostrado antes de tocar e enquanto o vídeo carrega) */
        poster: z.string(),
        /** último quadro — a imagem que permanece na hero depois da animação */
        posterEnd: z.string().optional(),
      })
      .optional(),
    /** legenda que surge no fim do vídeo */
    endLabel: text,
    endText: text,
    /** brand = tonaliza a foto para o cinza da marca; none = foto original */
    imageTone: z.enum(['brand', 'none']).default('brand'),
    highlights: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
    scrollLabel: z.string().default('Role para descobrir'),
  }),

  /** Faixa tipográfica em movimento. */
  marquee: z.object({
    items: z.array(z.string()).min(1),
    /** segundos para uma volta completa */
    duration: z.number().positive().default(38),
  }),

  /** Texto-manifesto revelado palavra por palavra. **trecho** = destaque. */
  manifesto: z.object({
    eyebrow: text,
    text: z.string(),
    signature: text,
    image: imageSchema.optional(),
    caption: text,
  }),

  /** Grade de experiências/categorias (bento). */
  experiences: z.object({
    ...sectionHeader,
    items: z
      .array(
        z.object({
          title: z.string(),
          description: text,
          icon: z.string().default('bag'),
          tone: toneSchema.default('pink'),
          href: z.string().optional(),
          /** slug da categoria — ao clicar, filtra a vitrine de lojas */
          category: z.string().optional(),
          image: imageSchema.optional(),
        }),
      )
      .default([]),
  }),

  /** Destaque de vídeo (YouTube, inclusive 360°). Carrega o player só ao clicar. */
  tour: z.object({
    ...sectionHeader,
    /** id do vídeo do YouTube (o que vem depois de v=) */
    videoId: z.string().min(1),
    poster: imageSchema.optional(),
    playLabel: z.string().default('Assistir ao tour'),
    /** selo sobre o vídeo, ex.: "360°" */
    badge: text,
    /** dica de interação, ex.: "Arraste para olhar ao redor" */
    hint: text,
    bullets: z.array(z.string()).default([]),
  }),

  /** Mosaico editorial de fotos dos espaços. */
  gallery: z.object({
    ...sectionHeader,
    items: z
      .array(
        z.object({
          image: imageSchema,
          title: z.string(),
          text: text,
          tag: text,
        }),
      )
      .default([]),
  }),

  /** Vitrine de lojas (dados vêm da tabela `stores`). */
  stores: z.object({
    ...sectionHeader,
    showFilters: z.boolean().default(true),
    featuredOnly: z.boolean().default(false),
    limit: z.number().int().positive().default(12),
    allLabel: z.string().default('Todas'),
    cta: linkSchema.optional(),
  }),

  /** Agenda / novidades (dados vêm da tabela `events`). */
  events: z.object({
    ...sectionHeader,
    hideExpired: z.boolean().default(true),
    cta: linkSchema.optional(),
  }),

  /** Seção genérica imagem + texto — reutilizável para qualquer conteúdo novo. */
  feature: z.object({
    ...sectionHeader,
    text: text,
    image: imageSchema.optional(),
    cta: linkSchema.optional(),
    reverse: z.boolean().default(false),
    bullets: z.array(z.string()).default([]),
  }),

  /** Números + grafismos animados. */
  stats: z.object({
    ...sectionHeader,
    text: text,
    items: z
      .array(
        z.object({
          value: z.number(),
          prefix: text,
          suffix: text,
          label: z.string(),
        }),
      )
      .default([]),
  }),

  /** Como chegar: mapa, horários (de settings) e informações úteis. */
  visit: z.object({
    ...sectionHeader,
    mapEmbedUrl: text,
    mapsUrl: text,
    wazeUrl: text,
    image: imageSchema.optional(),
    info: z
      .array(z.object({ icon: z.string().default('info'), title: z.string(), text: z.string() }))
      .default([]),
  }),

  faq: z.object({
    ...sectionHeader,
    items: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
  }),

  /** Newsletter via Substack. Basta preencher `substackUrl`. */
  newsletter: z.object({
    eyebrow: text,
    title: z.string(),
    text: text,
    /** ex.: https://designmall.substack.com */
    substackUrl: text,
    /** form = formulário no design do site; embed = iframe oficial do Substack */
    mode: z.enum(['form', 'embed']).default('form'),
    placeholder: z.string().default('seu@email.com'),
    buttonLabel: z.string().default('Quero receber'),
    disclaimer: text,
    successMessage: z.string().default('Pronto! Confira seu e-mail para confirmar a inscrição.'),
    pendingMessage: z.string().default('Nossa newsletter está quase pronta. Volte em breve!'),
    perks: z.array(z.string()).default([]),
  }),
} as const;

export type SectionType = keyof typeof sectionSchemas;
export const sectionTypes = Object.keys(sectionSchemas) as SectionType[];

export type SectionData<T extends SectionType> = z.infer<(typeof sectionSchemas)[T]>;

export type Section = {
  [T in SectionType]: {
    id: string;
    type: T;
    /** id do elemento na página (usado no menu: href="#anchor") */
    anchor: string | null;
    position: number;
    enabled: boolean;
    data: SectionData<T>;
  };
}[SectionType];

export function parseSectionData<T extends SectionType>(type: T, data: unknown) {
  return sectionSchemas[type].safeParse(data);
}

export function isSectionType(value: string): value is SectionType {
  return value in sectionSchemas;
}

/* ------------------------------------------------------------------ */
/* Entidades: categorias, lojas, eventos                               */
/* ------------------------------------------------------------------ */

const slug = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use apenas letras minúsculas, números e hífen');

export const categorySchema = z.object({
  id: z.string().min(1),
  slug,
  name: z.string().min(1),
  tone: toneSchema.default('pink'),
  icon: z.string().default('bag'),
  position: z.number().int().default(0),
});
export type Category = z.infer<typeof categorySchema>;

export const storeSchema = z.object({
  id: z.string().min(1),
  slug,
  name: z.string().min(1),
  categoryId: z.string().nullable().default(null),
  floor: text,
  unit: text,
  shortDescription: text,
  description: text,
  logoUrl: z.string().nullable().default(null),
  coverUrl: z.string().nullable().default(null),
  phone: text,
  whatsapp: text,
  instagram: text,
  website: text,
  hours: text,
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  position: z.number().int().default(0),
  active: z.boolean().default(true),
});
export type Store = z.infer<typeof storeSchema>;

export const eventSchema = z.object({
  id: z.string().min(1),
  slug,
  title: z.string().min(1),
  tag: text,
  description: text,
  imageUrl: z.string().nullable().default(null),
  /** ISO date (YYYY-MM-DD) */
  startsAt: z.string().nullable().default(null),
  endsAt: z.string().nullable().default(null),
  ctaLabel: text,
  ctaUrl: text,
  position: z.number().int().default(0),
  active: z.boolean().default(true),
});
export type MallEvent = z.infer<typeof eventSchema>;

/* ------------------------------------------------------------------ */
/* Agregado usado pela página                                          */
/* ------------------------------------------------------------------ */

export interface SiteContent {
  settings: Settings;
  sections: Section[];
  categories: Category[];
  stores: Store[];
  events: MallEvent[];
  /** de onde veio o conteúdo — útil para debug */
  source: 'database' | 'seed';
}
