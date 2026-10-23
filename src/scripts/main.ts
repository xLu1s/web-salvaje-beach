const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.add('js');

// ---------- Menú móvil ----------
const toggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]');
const nav = document.querySelector<HTMLElement>('[data-nav]');
const setNav = (open: boolean) => {
  toggle?.setAttribute('aria-expanded', String(open));
  toggle?.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  nav?.classList.toggle('is-open', open);
  document.body.style.overflow = open ? 'hidden' : '';
};
toggle?.addEventListener('click', () => setNav(toggle.getAttribute('aria-expanded') !== 'true'));
nav?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setNav(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setNav(false); });

// ---------- Cabecera sólida al salir del hero ----------
const header = document.querySelector('[data-header]');
const onScroll = () => header?.classList.toggle('is-scrolled', window.scrollY > window.innerHeight * 0.6);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// ---------- Vídeo del hero: versión horizontal (escritorio) o vertical (móvil) ----------
const video = document.querySelector<HTMLVideoElement>('[data-hero-video]');
const vToggle = document.querySelector<HTMLButtonElement>('[data-video-toggle]');
if (video) {
  if (reduced) {
    vToggle?.setAttribute('hidden', '');
  } else {
    const wide = window.matchMedia('(min-width: 768px) and (min-aspect-ratio: 9/10)').matches;
    const kind = wide ? 'desktop' : 'mobile';
    const canWebm = video.canPlayType('video/webm; codecs="vp9"') !== '';
    video.src = (canWebm ? video.dataset[`${kind}Webm`] : video.dataset[`${kind}Mp4`]) ?? '';
    video.addEventListener('playing', () => video.classList.add('is-playing'), { once: true });
    video.play().catch(() => { /* autoplay bloqueado: queda el póster */ });
    vToggle?.addEventListener('click', () => {
      const pause = !video.paused;
      if (pause) video.pause(); else video.play();
      vToggle.setAttribute('aria-pressed', String(pause));
      vToggle.setAttribute('aria-label', pause ? 'Reproducir el vídeo de fondo' : 'Pausar el vídeo de fondo');
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => {
        if (vToggle?.getAttribute('aria-pressed') === 'true') return;
        if (e.isIntersecting) video.play().catch(() => {}); else video.pause();
      }).observe(video);
    }
  }
}

// ---------- Vídeos secundarios: se cargan al acercarse (y nunca con reduced-motion) ----------
const lazyVideos = Array.from(document.querySelectorAll<HTMLVideoElement>('[data-lazy-video]'));
if (!reduced && 'IntersectionObserver' in window) {
  const vio = new IntersectionObserver((entries) => entries.forEach((e) => {
    const v = e.target as HTMLVideoElement;
    if (e.isIntersecting) {
      if (!v.dataset.loaded) {
        v.querySelectorAll<HTMLSourceElement>('source[data-src]').forEach((s) => { s.src = s.dataset.src!; });
        v.load();
        v.dataset.loaded = '1';
      }
      v.play().catch(() => {});
    } else if (v.dataset.loaded) v.pause();
  }), { rootMargin: '200px 0px' });
  lazyVideos.forEach((v) => vio.observe(v));
}

// ---------- Día actual en el horario ----------
const today = new Date().getDay();
document.querySelectorAll<HTMLTableRowElement>('[data-hours] tr[data-days]').forEach((tr) => {
  if (tr.dataset.days!.split(',').map(Number).includes(today)) tr.classList.add('is-today');
});

// ---------- Reveal al hacer scroll ----------
const reveals = document.querySelectorAll<HTMLElement>('.reveal');
if (reduced || !('IntersectionObserver' in window)) {
  reveals.forEach((el) => el.classList.add('is-visible'));
} else {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
    }),
    { rootMargin: '0px 0px -6% 0px', threshold: 0.08 },
  );
  reveals.forEach((el) => io.observe(el));
  // Carruseles horizontales en móvil: las tarjetas fuera de pantalla se revelan con su contenedor
  document.querySelectorAll<HTMLElement>('.dishes, .plans').forEach((track) => {
    new IntersectionObserver(([e], obs) => {
      if (e.isIntersecting) { track.querySelectorAll('.reveal').forEach((r) => r.classList.add('is-visible')); obs.disconnect(); }
    }, { threshold: 0.15 }).observe(track);
  });
}

// ---------- Parallax suave (solo transform, rAF; sin reduced-motion; elementos en escritorio) ----------
const heroMedia = document.querySelector<HTMLElement>('[data-parallax]');
const frames = Array.from(document.querySelectorAll<HTMLElement>('[data-speed]'));
const desktop = window.matchMedia('(min-width: 901px)');
if (!reduced) {
  let ticking = false;
  const update = () => {
    const vh = window.innerHeight;
    if (heroMedia && window.scrollY < vh * 1.2) heroMedia.style.setProperty('--py', `${(window.scrollY * 0.3).toFixed(1)}px`);
    if (desktop.matches) {
      frames.forEach((f) => {
        const r = f.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        const center = r.top + r.height / 2 - vh / 2;
        f.style.setProperty('--gy', `${(-center * Number(f.dataset.speed)).toFixed(1)}px`);
      });
    }
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

// ---------- Botón Reservar flotante: oculto en la zona del teléfono (Visítanos) y en el pie ----------
const fab = document.querySelector<HTMLElement>('.fab');
const hideOn = Array.from(document.querySelectorAll<HTMLElement>('.visit__block--phone, .footer'));
if (fab && hideOn.length && 'IntersectionObserver' in window) {
  const visible = new Set<Element>();
  const io2 = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
    fab.classList.toggle('is-hidden', visible.size > 0);
  }, { threshold: 0.1 });
  hideOn.forEach((el) => io2.observe(el));
}

// ---------- Mapa bajo demanda (sin cookies de Google hasta que se pide) ----------
document.querySelector<HTMLButtonElement>('[data-map-load]')?.addEventListener('click', (e) => {
  const btn = e.currentTarget as HTMLButtonElement;
  const box = btn.closest<HTMLElement>('[data-map]');
  if (!box) return;
  const f = document.createElement('iframe');
  f.src = btn.dataset.src!;
  f.title = 'Mapa: Salvaje Beach, Passeig Marítim de Neptú 81, Gandia';
  f.loading = 'lazy';
  f.referrerPolicy = 'no-referrer-when-downgrade';
  box.appendChild(f);
  box.classList.add('is-loaded');
  f.focus();
});
