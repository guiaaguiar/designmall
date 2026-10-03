/**
 * Registro tipo de seção → componente.
 * Para uma nova seção: crie o schema (schema.ts), o componente e adicione aqui.
 */
import type { SectionType } from '../../lib/content/schema';
import Events from './Events.astro';
import Experiences from './Experiences.astro';
import Faq from './Faq.astro';
import Feature from './Feature.astro';
import Gallery from './Gallery.astro';
import Hero from './Hero.astro';
import Manifesto from './Manifesto.astro';
import Marquee from './Marquee.astro';
import Newsletter from './Newsletter.astro';
import Stats from './Stats.astro';
import Stores from './Stores.astro';
import Tour from './Tour.astro';
import Visit from './Visit.astro';

// Componentes .astro não têm tipagem de props genérica; o contrato é:
// { data, anchor, content } — garantido pelo schema de cada tipo.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sectionComponents: Record<SectionType, any> = {
  hero: Hero,
  marquee: Marquee,
  manifesto: Manifesto,
  experiences: Experiences,
  stores: Stores,
  events: Events,
  feature: Feature,
  stats: Stats,
  tour: Tour,
  gallery: Gallery,
  visit: Visit,
  faq: Faq,
  newsletter: Newsletter,
};
