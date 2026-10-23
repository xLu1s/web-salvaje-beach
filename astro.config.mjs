// @ts-check
import { defineConfig } from 'astro/config';

// Proyecto de GitHub Pages (nombre de repo provisional): https://xlu1s.github.io/web-salvaje-beach/
export default defineConfig({
  site: 'https://xlu1s.github.io',
  base: '/web-salvaje-beach',
  output: 'static',
  trailingSlash: 'always',
});
