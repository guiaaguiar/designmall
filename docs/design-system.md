# Design Mall — Design system da landing

Base: *Manual de Identidade Corporativa Design Mall* (cores, logo, tipografia, grafismos) +
estrutura de navegação do Liv Mall (header em bolha, hero em tela cheia com conteúdo deslizando por cima).
Tokens em `src/styles/global.css`.

## Cores

| Token | Hex | Origem no manual | Uso |
|-------|-----|------------------|-----|
| `--color-bg` | `#2B2829` | derivado do Opcional 04 | Fundo da página (tema sempre escuro) |
| `--color-surface` | `#373435` | **Opcional 04** | Cards, header flutuante |
| `--color-surface-2` | `#423E40` | derivado | Hover / estados abertos |
| `--color-ink` | `#EEEEEE` | **Institucional 01** | Texto principal |
| `--color-pink` | `#F05F8E` | **Institucional 02** | CTA, ênfases, "MALL" |
| `--color-teal` | `#24AFC1` | **Opcional 03** | Eyebrows, foco, sucesso |
| `--color-violet` | `#6B4F9E` | **Opcional 01** | Grafismos (não usar em texto, pois tem pouco contraste) |
| `--color-purple` | `#48396F` | **Opcional 02** | Fundo dos grafismos, painel "Conexão" |

Contraste verificado sobre `--color-bg`: ink ≈ 12,5:1 · pink ≈ 4,7:1 · teal ≈ 5,5:1.
Texto secundário (`--color-ink-muted`) sobre cards (`--color-surface`) ≈ 5:1.
Texto sobre botão rosa usa `--color-on-accent` (`#221F20`, ≈ 5,2:1). Branco sobre rosa não atinge AA.

## Tipografia

- **Display:** Noah (marca) → fallback *Red Hat Display* 700–900, tracking negativo
- **Texto:** Trenda (marca) → fallback *Red Hat Text* 400–600
- Escala: hero `clamp(3.75rem, 12.5vw, 10.5rem)` · títulos de seção `clamp(2.375rem, 5.6vw, 4.5rem)` · lead 17–20px · corpo 16px
- Ênfase de título: `*palavra*` → rosa

## Grafismos

Seis peças (`src/components/brand/Tile.astro`): `arch`, `quarter`, `half`, `triangles`, `chevron`, `bullseye`,
nas cores rosa/teal/violeta sobre roxo, rotacionáveis em 90°.
`Mosaic.astro` compõe grades determinísticas (mesma `seed` = mesmo desenho) e, com `live`, gira uma
peça a cada ~2s enquanto visível, como "conexões" se reorganizando.

Usos: coluna do hero (como a capa do manual), card "Moda", painel de números, newsletter, faixa do rodapé,
capa provisória de lojas sem foto.

## Forma

- Raio: cards `1.75rem`, blocos/sheet `2.75rem`, botões e header flutuante em pílula
- Superfícies com borda interna sutil (`inset 0 0 0 1px rgb(238 238 238 / .1)`) em vez de sombras pesadas
- Hover de card: sobe 4px + borda e brilho na cor do tom (`data-tone`)

## Movimento

| Token | Curva | Uso |
|-------|-------|-----|
| `--ease-spring` | `cubic-bezier(.34,1.32,.5,1)` | Header virando bolha, botões, peças de grafismo |
| `--ease-out-expo` | `cubic-bezier(.16,1,.3,1)` | Entradas, revelações, transições de layout |

- **Header:** 100% no topo → bolha flutuante no primeiro scroll (largura, altura, raio e vidro fosco) + linha de progresso
- **Hero:** título revelado linha a linha por máscara; foto com zoom de entrada e parallax; conteúdo seguinte desliza por cima
- **Manifesto:** palavras acendem conforme a rolagem
- **Revelação:** `[data-reveal]` (fade + 28px), escalonado com `--delay`
- **Filtro de lojas:** View Transitions API
- `prefers-reduced-motion`: animações e parallax desligados, conteúdo aparece no estado final

## Acessibilidade

Skip link · foco visível (teal) · alvos ≥ 44px · menu mobile em `<dialog>` (foco preso, Esc) ·
carrossel com botões e setas do teclado · FAQ com `<details>` nativo · formulário com label visível,
validação ao sair do campo e mensagens em `aria-live` · ícones decorativos com `aria-hidden`.
