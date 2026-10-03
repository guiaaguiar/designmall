// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Troque pelo domínio final antes do deploy (usado em canonical/OG).
  site: 'https://designmall.com.br',
  output: 'server',
  adapter: cloudflare({
    // Imagens já são servidas otimizadas (WebP em /public ou, no futuro, R2).
    imageService: 'passthrough',
  }),
  // Sem sessões por enquanto: evita provisionar um KV que não seria usado.
  session: false,
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
  },
});
