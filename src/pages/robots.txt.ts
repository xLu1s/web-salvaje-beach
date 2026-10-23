import type { APIRoute } from 'astro';
import { publicUrl } from '../lib/base';
// Nota: en GitHub Pages de proyecto, robots.txt queda bajo /web-salvaje-beach/ y los buscadores solo leen el de la raíz
// del dominio. Se genera igualmente para cuando la web pase a su propio dominio.
export const GET: APIRoute = ({ site }) =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL(publicUrl('sitemap.xml'), site).href}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
