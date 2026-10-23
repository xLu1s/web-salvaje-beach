# web-salvaje-beach (demo)

Web demo de **Salvaje Beach – Chiringuito Nº6** (restaurante + beach club · Passeig Marítim de Neptú, 81 · Playa Nord de Gandia). Sitio estático en [Astro](https://astro.build) 7.4.2, en español, pensado para GitHub Pages.

`site: 'https://xlu1s.github.io'`, `base: '/web-salvaje-beach'` (nombre de repo provisional) → https://xlu1s.github.io/web-salvaje-beach/

> No confundir con Salvaje World (Marbella), otro negocio.

## Desarrollo
Node.js >= 22.23.4 (Astro 7).
```bash
npm ci && npm run dev     # desarrollo
npm run build             # dist/
npm run preview           # sirve dist/ respetando el base
python3 scripts/shots.py  # capturas (con el preview en marcha)
```

## Contenido
- Datos del negocio, horario (editable) y JSON-LD de horario: `src/data/site.ts`. Horario = ficha de Google (23/10/2026) ⚠️ por confirmar.
- Secciones: `src/components/` (Hero, Split 50/50, Restaurante, Carta, BeachClub, Agenda, Gallery, Visit, Footer).
- Carta: `Carta.astro` es un placeholder («Carta próximamente — pendiente de recibir del local»).
- Agenda: solo formatos reales vistos en Instagram, sin fechas; las próximas fechas se derivan a Instagram.
- Reseñas: no hay sección (en el material no hay reseñas de 5★ en español con autor).
- Hero: `public/video/hero-{desktop,mobile}.{webm,mp4}` + pósters (día → fiesta; incluye planos de reel_01 de @samuel_st12, con permiso). Beach Club: `fiesta.{webm,mp4}` (reel_01) y `tardeo.{webm,mp4}`. `main.ts` elige versión según viewport; con `prefers-reduced-motion` no se carga el vídeo.
- SEO: `src/layouts/Base.astro` (title/description, canonical, OG, geo, JSON-LD `Restaurant`+`BarOrPub` sin aggregateRating), `sitemap.xml`, `robots.txt`, `public/og-image.jpg`. Solo español (sin hreflang).
- Medios y permisos: `docs/FUENTES-web.md`.

## Publicación en GitHub Pages
`.github/workflows/deploy.yml` (Node 22.23.4, `npm ci`, `npm run build`, publica `dist/`). En el repo: **Settings → Pages → Source = GitHub Actions** y push a `main`.
