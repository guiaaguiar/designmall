/**
 * Conteúdo inicial (placeholder) da landing.
 *
 * - Usado para gerar `db/seed.sql` (npm run db:seed:generate)
 * - Usado como fallback caso o banco esteja vazio/indisponível — a página nunca cai.
 *
 * Observação: este arquivo é lido também pelo Node puro (script de seed),
 * por isso só usa `import type` e dados literais.
 */
import type { Category, MallEvent, Section, Settings, Store } from './schema.ts';

const img = (name: string, alt: string, sizes: [number, number] = [720, 1400]) => ({
  src: `/images/${name}-${sizes[1]}.webp`,
  srcset: `/images/${name}-${sizes[0]}.webp ${sizes[0]}w, /images/${name}-${sizes[1]}.webp ${sizes[1]}w`,
  alt,
});

/* ------------------------------------------------------------------ */
/* Configurações                                                       */
/* ------------------------------------------------------------------ */

export const seedSettings: Settings = {
  name: 'Design Mall',
  tagline: 'Um presente para todos',
  seo: {
    title: 'Design Mall — Um presente para todos',
    description:
      'Moda, gastronomia, serviços e encontros conectados em um só lugar. Conheça as lojas, a agenda e tudo o que o Design Mall preparou para você.',
    image: '/images/mall-fachada-1280.webp',
  },
  address: {
    street: 'Av. Lorem Ipsum, 1000',
    district: 'Bairro Dolor',
    city: 'Cidade',
    state: 'UF',
    zip: '00000-000',
  },
  contact: {
    phone: '(00) 0000-0000',
    whatsapp: '',
    email: 'contato@designmall.com.br',
  },
  hours: [
    { label: 'Lojas', value: 'Seg a sáb · 10h às 22h' },
    { label: 'Domingos e feriados', value: '14h às 20h' },
    { label: 'Gastronomia', value: 'Todos os dias · 11h às 23h' },
  ],
  social: [
    { network: 'instagram', url: 'https://instagram.com/' },
    { network: 'facebook', url: 'https://facebook.com/' },
    { network: 'tiktok', url: 'https://tiktok.com/' },
  ],
  nav: [
    { label: 'O Mall', href: '#conceito' },
    { label: 'Experiências', href: '#experiencias' },
    { label: 'Lojas', href: '#lojas' },
    { label: 'Agenda', href: '#agenda' },
    { label: 'Visite', href: '#visite' },
  ],
  headerCta: { label: 'Receber novidades', href: '#newsletter' },
  footer: {
    tagline: 'Um presente para todos.',
    copyright: '© {ano} Design Mall. Todos os direitos reservados.',
    credits: 'Design Life Center',
    columns: [
      {
        title: 'Explore',
        links: [
          { label: 'O conceito', href: '#conceito' },
          { label: 'Lojas', href: '#lojas' },
          { label: 'Agenda', href: '#agenda' },
          { label: 'Como chegar', href: '#visite' },
        ],
      },
      {
        title: 'Atendimento',
        links: [
          { label: 'Perguntas frequentes', href: '#duvidas' },
          { label: 'Seja um lojista', href: '#lojista' },
          { label: 'Fale conosco', href: 'mailto:contato@designmall.com.br' },
          { label: 'Newsletter', href: '#newsletter' },
        ],
      },
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Seções (a ordem do array = ordem na página)                         */
/* ------------------------------------------------------------------ */

const sectionList = [
  {
    id: 'hero',
    type: 'hero',
    anchor: 'inicio',
    data: {
      eyebrow: 'Design Life Center',
      title: 'Viva\no *novo.*',
      subtitle:
        'Moda, sabores, serviços e encontros conectados em um só lugar. O Design Mall foi pensado como um presente — para a cidade e para você.',
      primaryCta: { label: 'Explorar lojas', href: '#lojas' },
      secondaryCta: { label: 'Como chegar', href: '#visite' },
      image: {
        src: '/images/mall-fachada-2400.webp',
        srcset: '/images/mall-fachada-1280.webp 1280w, /images/mall-fachada-2400.webp 2400w',
        alt: 'Fachada do Design Mall com torre e galerias de lojas',
        width: 2400,
        height: 1698,
      },
      imageTone: 'brand',
      highlights: [
        { value: '+120', label: 'lojas e serviços' },
        { value: '7 dias', label: 'por semana' },
        { value: '1.200', label: 'vagas cobertas' },
      ],
      scrollLabel: 'Role para descobrir',
    },
  },
  {
    id: 'marquee-categorias',
    type: 'marquee',
    anchor: null,
    data: {
      items: ['Moda', 'Gastronomia', 'Serviços', 'Bem-estar', 'Kids', 'Casa & Design', 'Cultura', 'Encontros'],
      duration: 38,
    },
  },
  {
    id: 'manifesto',
    type: 'manifesto',
    anchor: 'conceito',
    data: {
      eyebrow: 'O conceito',
      text:
        'Todo presente começa com cuidado. Por isso cada detalhe do Design Mall foi pensado para que a sua visita seja como **abrir algo especial**: um ambiente bonito, feito para pessoas e sempre preocupado em **oferecer o melhor** para quem chega. Aqui, o novo é para **todos**.',
      signature: 'Um presente para todos.',
      image: img('presente-sacola', 'Sacola do Design Mall com grafismos coloridos', [800, 1600]),
      caption: 'A sacola que vira presente: o símbolo que inspirou a nossa marca.',
    },
  },
  {
    id: 'experiencias',
    type: 'experiences',
    anchor: 'experiencias',
    data: {
      eyebrow: 'Experiências',
      title: 'Tudo o que você procura, *conectado.*',
      subtitle:
        'Do look da semana ao café com quem você gosta: um mix pensado para o seu dia a dia — e para os dias especiais também.',
      items: [
        { title: 'Moda & Acessórios', description: 'Marcas que vestem do básico ao inesquecível.', icon: 'bag', tone: 'pink', category: 'moda' },
        { title: 'Gastronomia', description: 'Cafés, restaurantes e sabores para todas as horas.', icon: 'utensils', tone: 'teal', category: 'gastronomia' },
        { title: 'Serviços', description: 'Praticidade para resolver a vida em um só endereço.', icon: 'scissors', tone: 'violet', category: 'servicos' },
        { title: 'Bem-estar', description: 'Saúde, beleza e cuidado para corpo e mente.', icon: 'heart', tone: 'teal', category: 'bem-estar' },
        { title: 'Kids & Lazer', description: 'Diversão para os pequenos e programas em família.', icon: 'smile', tone: 'pink', category: 'kids' },
        { title: 'Casa & Design', description: 'Peças e ideias para deixar seu espaço com a sua cara.', icon: 'home', tone: 'violet', category: 'casa' },
      ],
    },
  },
  {
    id: 'lojas',
    type: 'stores',
    anchor: 'lojas',
    data: {
      eyebrow: 'Lojas',
      title: 'Marcas que fazem parte *da nossa história.*',
      subtitle: 'Filtre por experiência e descubra onde encontrar cada uma delas.',
      showFilters: true,
      featuredOnly: false,
      limit: 12,
      allLabel: 'Todas',
      cta: { label: 'Ver todas as lojas', href: '/lojas' },
    },
  },
  {
    id: 'agenda',
    type: 'events',
    anchor: 'agenda',
    data: {
      eyebrow: 'Acontece aqui',
      title: 'Sempre tem algo *novo* para viver.',
      subtitle: 'Eventos, campanhas e experiências que transformam cada visita em um encontro.',
      hideExpired: true,
    },
  },
  {
    id: 'conexao',
    type: 'stats',
    anchor: 'conexao',
    data: {
      eyebrow: 'Conexão com tudo e todos',
      title: 'Formas que se encontram. *Pessoas também.*',
      subtitle: '',
      text:
        'Nossos grafismos nasceram das conexões orgânicas entre etnias, culturas e estilos — diversidade transformada em arte. É essa mistura que dá vida ao Design Mall.',
      items: [
        { value: 120, prefix: '+', suffix: '', label: 'lojas e serviços' },
        { value: 35, prefix: '', suffix: ' mil m²', label: 'para viver e conviver' },
        { value: 1200, prefix: '', suffix: '', label: 'vagas de estacionamento' },
        { value: 365, prefix: '', suffix: '', label: 'dias de programação' },
      ],
    },
  },
  {
    id: 'lojista',
    type: 'feature',
    anchor: 'lojista',
    data: {
      eyebrow: 'Seja um lojista',
      title: 'Sua marca no lugar *mais conectado* da cidade.',
      subtitle: '',
      text:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Espaços versáteis, fluxo qualificado e um time dedicado a fazer a sua operação crescer junto com a gente.',
      image: img('grafismos-parede', 'Parede com os grafismos geométricos do Design Mall', [800, 1600]),
      cta: { label: 'Falar com o comercial', href: 'mailto:comercial@designmall.com.br' },
      reverse: false,
      bullets: ['Lojas de 30 a 600 m²', 'Quiosques e espaços de experiência', 'Mídia e ativações de marca'],
    },
  },
  {
    id: 'visite',
    type: 'visit',
    anchor: 'visite',
    data: {
      eyebrow: 'Visite',
      title: 'Fácil de chegar. *Difícil de ir embora.*',
      subtitle:
        'No coração da cidade, com estacionamento coberto, acessibilidade e tudo pensado para o seu conforto.',
      mapEmbedUrl: '',
      mapsUrl: 'https://maps.google.com/?q=Design+Mall',
      wazeUrl: 'https://waze.com/ul?q=Design%20Mall',
      image: img('estacionamento', 'Estacionamento coberto do Design Mall'),
      info: [
        { icon: 'car', title: 'Estacionamento', text: '1.200 vagas cobertas, preferenciais e bicicletário.' },
        { icon: 'navigation', title: 'Transporte público', text: 'Ponto de ônibus em frente à entrada principal.' },
        { icon: 'wifi', title: 'Wi-Fi gratuito', text: 'Conexão rápida em todos os pisos.' },
        { icon: 'gift', title: 'Embrulho para presente', text: 'Grátis no balcão de atendimento. É a nossa cara.' },
      ],
    },
  },
  {
    id: 'duvidas',
    type: 'faq',
    anchor: 'duvidas',
    data: {
      eyebrow: 'Dúvidas',
      title: 'Perguntas *frequentes.*',
      subtitle: 'Não encontrou o que procurava? Fale com a gente pelo e-mail contato@designmall.com.br.',
      items: [
        {
          question: 'Qual é o horário de funcionamento?',
          answer:
            'As lojas abrem de segunda a sábado, das 10h às 22h, e aos domingos e feriados, das 14h às 20h. A gastronomia funciona todos os dias, das 11h às 23h.',
        },
        {
          question: 'O estacionamento é pago?',
          answer:
            'Os primeiros 15 minutos são gratuitos. Lorem ipsum dolor sit amet: consulte a tabela completa nos totens de pagamento e no balcão de atendimento.',
        },
        {
          question: 'Posso levar meu pet?',
          answer:
            'Sim! O Design Mall é pet friendly. Pets de pequeno porte são bem-vindos nas áreas comuns, com guia ou no colo.',
        },
        {
          question: 'Vocês fazem embrulho para presente?',
          answer:
            'Claro — presente é a nossa essência. O embrulho é gratuito no balcão de atendimento, no piso térreo.',
        },
        {
          question: 'Como abro uma loja no Design Mall?',
          answer: 'Fale com o nosso time comercial pelo e-mail comercial@designmall.com.br. Vamos adorar conhecer a sua marca.',
        },
        {
          question: 'Como fico sabendo de eventos e promoções?',
          answer:
            'Assine a nossa newsletter aqui embaixo e siga o Design Mall nas redes sociais. As novidades chegam primeiro por lá.',
        },
      ],
    },
  },
  {
    id: 'newsletter',
    type: 'newsletter',
    anchor: 'newsletter',
    data: {
      eyebrow: 'Newsletter',
      title: 'Abra um presente *toda semana.*',
      text:
        'Novidades das lojas, agenda de eventos e convites exclusivos direto no seu e-mail. Leve, curtinha e sem spam.',
      substackUrl: '',
      mode: 'form',
      placeholder: 'seu@email.com',
      buttonLabel: 'Quero receber',
      disclaimer: 'Enviada pelo Substack. Você pode cancelar a inscrição quando quiser.',
      successMessage: 'Pronto! Confira seu e-mail para confirmar a inscrição.',
      pendingMessage: 'Nossa newsletter está quase pronta. Volte em breve!',
      perks: ['Convites para eventos', 'Ofertas das lojas', 'Lançamentos em primeira mão'],
    },
  },
] as const;

export const seedSections = sectionList.map((section, index) => ({
  ...section,
  position: (index + 1) * 10,
  enabled: true,
})) as unknown as Section[];

/* ------------------------------------------------------------------ */
/* Categorias, lojas e eventos                                         */
/* ------------------------------------------------------------------ */

export const seedCategories: Category[] = [
  { id: 'cat-moda', slug: 'moda', name: 'Moda & Acessórios', tone: 'pink', icon: 'bag', position: 10 },
  { id: 'cat-gastronomia', slug: 'gastronomia', name: 'Gastronomia', tone: 'teal', icon: 'utensils', position: 20 },
  { id: 'cat-servicos', slug: 'servicos', name: 'Serviços', tone: 'violet', icon: 'scissors', position: 30 },
  { id: 'cat-bem-estar', slug: 'bem-estar', name: 'Bem-estar', tone: 'teal', icon: 'heart', position: 40 },
  { id: 'cat-kids', slug: 'kids', name: 'Kids & Lazer', tone: 'pink', icon: 'smile', position: 50 },
  { id: 'cat-casa', slug: 'casa', name: 'Casa & Design', tone: 'violet', icon: 'home', position: 60 },
];

const lorem = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Sed do eiusmod tempor incididunt ut labore et dolore magna.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
  'Duis aute irure dolor in reprehenderit in voluptate velit.',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa.',
  'Nemo enim ipsam voluptatem quia voluptas sit aspernatur.',
];

const storeRows: Array<[string, string, string, string, string, boolean]> = [
  // [nome, slug, categoria, piso, unidade, destaque]
  ['Lorem Moda', 'lorem-moda', 'cat-moda', 'Piso 1', 'Loja 104', true],
  ['Ipsum Café', 'ipsum-cafe', 'cat-gastronomia', 'Térreo', 'Loja 012', true],
  ['Dolor Studio', 'dolor-studio', 'cat-servicos', 'Piso 2', 'Loja 215', false],
  ['Amet Beauty', 'amet-beauty', 'cat-bem-estar', 'Piso 1', 'Loja 131', true],
  ['Sit Kids', 'sit-kids', 'cat-kids', 'Piso 2', 'Loja 240', false],
  ['Consectetur Casa', 'consectetur-casa', 'cat-casa', 'Piso 2', 'Loja 202', true],
  ['Adipiscing Jeans', 'adipiscing-jeans', 'cat-moda', 'Piso 1', 'Loja 118', false],
  ['Elit Bistrô', 'elit-bistro', 'cat-gastronomia', 'Térreo', 'Loja 021', false],
  ['Tempor Fit', 'tempor-fit', 'cat-bem-estar', 'Piso 3', 'Loja 301', false],
  ['Magna Ótica', 'magna-otica', 'cat-servicos', 'Piso 1', 'Loja 109', false],
  ['Aliqua Atelier', 'aliqua-atelier', 'cat-moda', 'Piso 1', 'Loja 122', true],
  ['Veniam Burger', 'veniam-burger', 'cat-gastronomia', 'Térreo', 'Loja 030', false],
];

export const seedStores: Store[] = storeRows.map(([name, slug, categoryId, floor, unit, featured], i) => ({
  id: `store-${slug}`,
  slug,
  name,
  categoryId,
  floor,
  unit,
  shortDescription: lorem[i % lorem.length],
  description: `${lorem[i % lorem.length]} ${lorem[(i + 2) % lorem.length]}`,
  logoUrl: null,
  coverUrl: null,
  phone: '',
  whatsapp: '',
  instagram: '',
  website: '',
  hours: '',
  tags: [],
  featured,
  position: (i + 1) * 10,
  active: true,
}));

export const seedEvents: MallEvent[] = [
  {
    id: 'evt-semana-moda',
    slug: 'semana-moda',
    title: 'Semana Moda',
    tag: 'Moda',
    description: 'Desfiles, lançamentos e condições especiais nas lojas participantes. Lorem ipsum dolor sit amet.',
    imageUrl: '/images/campanha-semana-moda-1400.webp',
    startsAt: '2026-10-19',
    endsAt: '2026-10-25',
    ctaLabel: 'Ver programação',
    ctaUrl: '#agenda',
    position: 10,
    active: true,
  },
  {
    id: 'evt-viva-o-novo',
    slug: 'viva-o-novo',
    title: 'Viva o novo',
    tag: 'Campanha',
    description: 'A temporada que celebra o que acabou de chegar: novas marcas, novas coleções e novas experiências.',
    imageUrl: '/images/campanha-viva-o-novo-1400.webp',
    startsAt: '2026-10-01',
    endsAt: '2026-11-30',
    ctaLabel: 'Saiba mais',
    ctaUrl: '#agenda',
    position: 20,
    active: true,
  },
  {
    id: 'evt-play-kids',
    slug: 'play-kids',
    title: 'Play Kids',
    tag: 'Família',
    description: 'Oficinas, brincadeiras e espetáculos para a criançada todos os fins de semana. Consectetur adipiscing elit.',
    imageUrl: '/images/campanha-redes-1400.webp',
    startsAt: '2026-10-10',
    endsAt: '2026-10-12',
    ctaLabel: 'Inscrever meu filho',
    ctaUrl: '#agenda',
    position: 30,
    active: true,
  },
  {
    id: 'evt-bem-estar',
    slug: 'conectado-bem-estar',
    title: 'Conectado com o seu bem-estar',
    tag: 'Bem-estar',
    description: 'Aulas abertas, avaliações gratuitas e bate-papos sobre saúde e autocuidado. Sed do eiusmod tempor.',
    imageUrl: '/images/campanha-bem-estar-1400.webp',
    startsAt: '2026-11-03',
    endsAt: '2026-11-08',
    ctaLabel: 'Ver agenda',
    ctaUrl: '#agenda',
    position: 40,
    active: true,
  },
  {
    id: 'evt-noites-design',
    slug: 'noites-de-design',
    title: 'Noites de Design',
    tag: 'Cultura',
    description: 'Exposições, música ao vivo e encontros com artistas locais no átrio central. Ut enim ad minim veniam.',
    imageUrl: '/images/painel-interno-1400.webp',
    startsAt: '2026-11-14',
    endsAt: null,
    ctaLabel: 'Quero ir',
    ctaUrl: '#agenda',
    position: 50,
    active: true,
  },
];
