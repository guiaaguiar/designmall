# Design Mall — Landing page

Landing page modular do **Design Mall**, hospedada no **Cloudflare Workers**, com conteúdo
(textos, ordem das seções, lojas, eventos) guardado no **Cloudflare D1** e pronto para ser
editado por um futuro painel `/admin`.

- **Front:** Astro 7 (renderização no servidor) + Tailwind CSS 4, JS mínimo e sem framework no cliente
- **Banco:** Cloudflare D1 (SQLite gerenciado). Não "dorme" por inatividade e tem backup automático (Time Travel, 30 dias)
- **API:** CRUD REST em `/api/admin/*`, protegido por token
- **Design:** identidade do *Manual de Identidade Design Mall* + estrutura de referência do Liv Mall (veja `docs/design-system.md`)

---

## Storytelling da página

A narrativa nasce do conceito da marca, **"Um presente para todos"**: a sacola com o "X" de laço.
Cada seção é um passo de "abrir o presente":

| # | Seção (tipo)              | Papel na história |
|---|---------------------------|-------------------|
| 1 | `hero`                    | **Viva o novo.** Convite: o mall como um presente para a cidade |
| 2 | `marquee`                 | Tudo o que existe lá dentro, em movimento |
| 3 | `manifesto` (#conceito)   | O porquê: cuidado em cada detalhe (texto que "acende" ao rolar) |
| 4 | `experiences`             | O que você encontra: moda, sabores, serviços… (leva ao filtro de lojas) |
| 5 | `stores` (#lojas)         | Quem está lá: vitrine filtrável de lojas |
| 6 | `events` (#agenda)        | O que está acontecendo: agenda que se renova |
| 7 | `stats` (#conexao)        | **Conexão com tudo e todos**: os grafismos como diversidade |
| 8 | `feature` (#lojista)      | Convite para marcas (seção genérica reutilizável) |
| 9 | `visit` (#visite)         | Como chegar, horários e serviços (embrulho para presente grátis 🎁) |
| 10 | `faq` (#duvidas)         | Dúvidas frequentes |
| 11 | `newsletter`             | **Abra um presente toda semana**: inscrição no Substack |

Os textos de lojas e eventos são *placeholders* (lorem ipsum), prontos para serem trocados.

---

## Rodando localmente

Requisitos: Node 22.18+ (testado no 24).

```bash
npm install
npm run db:setup:local     # cria as tabelas e popula o D1 local com o conteúdo inicial
cp .dev.vars.example .dev.vars   # defina um ADMIN_TOKEN para testar a API
npm run dev                # http://localhost:4321
```

> Sem banco (ou com o banco vazio) a página funciona assim mesmo, com o conteúdo de
> `src/lib/content/seed.ts`. Se uma seção tiver dados inválidos, só ela é ocultada.

| Rota | O que é |
|------|---------|
| `/` | Landing page |
| `/lojas` | Guia de lojas com busca e filtro |
| `/lojas/:slug` | Página de cada loja (gerada automaticamente) |
| `/api/content` | Todo o conteúdo público em JSON |
| `/api/admin/*` | CRUD (requer token) |

---

## Arquitetura do conteúdo

```
src/
├─ lib/content/
│  ├─ schema.ts       ← fonte única de verdade: schema (zod) de cada seção, loja, evento…
│  ├─ seed.ts         ← conteúdo inicial / fallback
│  ├─ repository.ts   ← lê o D1 e valida (com fallback)
│  └─ mappers.ts      ← linha do banco ⇄ objeto
├─ lib/admin/         ← CRUD genérico + recursos editáveis
├─ components/
│  ├─ sections/       ← um componente por tipo de seção + registry.ts
│  ├─ stores/         ← card, grade com filtro/busca, capa provisória
│  ├─ brand/          ← logo vetorial, grafismos (Tile/Mosaic)
│  └─ layout/         ← Header (pill), Footer, PageIntro
├─ pages/             ← rotas (/, /lojas, /lojas/[slug], /api/…)
└─ styles/global.css  ← tokens de design (cores, tipografia, movimento)
migrations/           ← SQL versionado do D1
scripts/generate-seed.ts → gera db/seed.sql a partir do seed.ts
```

### Tabelas (D1)

| Tabela | Conteúdo |
|--------|----------|
| `settings` | JSON global (`key = 'site'`): menu, CTA do header, endereço, horários, redes, rodapé, SEO |
| `sections` | Seções da landing: `type`, `position` (ordem), `enabled`, `anchor` (#id do menu), `data` (JSON) |
| `categories` | Experiências / categorias de loja (tom de cor e ícone) |
| `stores` | Lojas: nome, slug, categoria, piso, unidade, descrições, logo, capa, contatos, destaque, ordem, ativa |
| `events` | Agenda: título, tag, descrição, imagem, datas (eventos vencidos somem sozinhos), CTA |

Marcação simples nos textos: `*ênfase*` (rosa), `**destaque**` (usado no manifesto) e quebra de linha.

### Como criar uma nova seção

1. Adicione o schema em `sectionSchemas` (`src/lib/content/schema.ts`)
2. Crie o componente em `src/components/sections/MinhaSecao.astro` (recebe `data`, `anchor`, `content`)
3. Registre em `src/components/sections/registry.ts`
4. Crie o registro pela API (`POST /api/admin/sections`) ou no seed. Pronto: ela aparece na posição definida

Para conteúdo pontual, prefira o tipo genérico **`feature`** (imagem + texto + bullets + CTA), que já existe.

---

## API administrativa (base do futuro `/admin`)

Autenticação: `Authorization: Bearer <ADMIN_TOKEN>`.
Requisições de escrita precisam do cabeçalho `Origin` do próprio site (proteção CSRF do Astro); o
`/admin` no mesmo domínio envia isso automaticamente. Em scripts, adicione `-H "Origin: https://seu-dominio"`.

| Método | Rota | Ação |
|--------|------|------|
| GET / PUT | `/api/admin/settings` | Ler / atualizar configurações globais |
| GET / POST | `/api/admin/{sections\|stores\|events\|categories}` | Listar / criar |
| GET / PUT / PATCH / DELETE | `/api/admin/{recurso}/{id}` | Ler / atualizar (campos omitidos são mantidos) / remover |
| POST | `/api/admin/{recurso}/reorder` | `{"ids": [...]}`: nova ordem (arrastar e soltar) |

Respostas de erro: `401` sem token · `404` não encontrado · `409` slug duplicado · `422` dados inválidos
(com `issues` apontando o campo exato, ex.: `["data","title"]`).

```bash
# criar uma loja (id, slug e posição são gerados automaticamente)
curl -X POST https://SEU-DOMINIO/api/admin/stores \
  -H "Authorization: Bearer $ADMIN_TOKEN" -H "Origin: https://SEU-DOMINIO" \
  -H "content-type: application/json" \
  -d '{"name":"Loja Nova","categoryId":"cat-moda","floor":"Piso 1","unit":"Loja 110","shortDescription":"..."}'

# desativar a seção de estatísticas
curl -X PATCH https://SEU-DOMINIO/api/admin/sections/conexao \
  -H "Authorization: Bearer $ADMIN_TOKEN" -H "Origin: https://SEU-DOMINIO" \
  -H "content-type: application/json" -d '{"enabled":false}'
```

> Em `sections`, o `data` enviado é mesclado ao atual: basta mandar os campos que mudaram.
> Listas (ex.: `items` do FAQ) são substituídas por inteiro.

---

## Newsletter (Substack)

Basta informar a URL da publicação na seção `newsletter`:

```bash
curl -X PATCH https://SEU-DOMINIO/api/admin/sections/newsletter \
  -H "Authorization: Bearer $ADMIN_TOKEN" -H "Origin: https://SEU-DOMINIO" \
  -H "content-type: application/json" \
  -d '{"data": {"substackUrl": "https://designmall.substack.com"}}'
```

- `mode: "form"` (padrão): formulário no design do site; envia direto para o Substack e abre a confirmação em nova aba
- `mode: "embed"`: iframe oficial do Substack, emoldurado no layout
- Sem URL, o formulário valida o e-mail e mostra a mensagem `pendingMessage` ("quase pronta")

---

## Deploy no Cloudflare Workers

```bash
npx wrangler login                                   # uma vez
npx wrangler d1 create design-mall-db               # copie o database_id para wrangler.jsonc
npm run db:migrate:remote                            # cria as tabelas
npm run db:seed:remote                               # conteúdo inicial
npx wrangler secret put ADMIN_TOKEN                  # token forte para a API
npm run deploy                                       # build + publicação
```

Depois: ajuste `site` em `astro.config.mjs` para o domínio final e conecte o domínio em
*Workers → design-mall → Settings → Domains & Routes*.

### Próximos passos sugeridos

- **`/admin`**: página no mesmo projeto, protegida com **Cloudflare Access** (login por e-mail, grátis até 50 usuários), consumindo a API acima. Os schemas zod já descrevem cada formulário
- **Upload de imagens**: bucket **R2** (`MEDIA`, já comentado no `wrangler.jsonc`) + rota `/media/*`
- **Fontes da marca**: adicione os arquivos licenciados de *Noah* e *Trenda* em `public/fonts/` e declare o `@font-face`. Os tokens já os priorizam (`--font-display` / `--font-sans`)
- Trocar as fotos/placeholders pelas imagens reais do shopping e das lojas
