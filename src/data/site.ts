/**
 * Datos del negocio. TODO sale de /workspace/salvaje/brief.md (investigación del 23/10/2026).
 * No inventar: si un dato no tiene fuente, no se muestra.
 */
export const site = {
  name: 'Salvaje Beach',
  fullName: 'Salvaje Beach – Chiringuito Nº6',
  seal: 'Xiringuito Nº6 · Platja de Gandia', // texto del sello de la bandera (en valenciano)
  claim: 'Hazlo Salvaje o no lo hagas',
  tagline: 'Comidas, tardeo y copas frente al mar', // bio de Instagram
  phoneDisplay: '638 141 832',
  phoneE164: '+34638141832',
  instagram: 'https://www.instagram.com/salvajebeach.gandia/',
  instagramHandle: '@salvajebeach.gandia',
  address: {
    street: 'Passeig Marítim de Neptú, 81',
    postalCode: '46730',
    locality: 'Gandia',
    region: 'Valencia',
    zone: 'Playa Nord · zona de la Ducal',
  },
  geo: { lat: 39.00884, lng: -0.16517 },
  placeId: 'ChIJMXz6PBXDYQ0RPtYl74yKASI',
  priceRange: '10–20 €', // Google Maps: «De 10 € a 20 €» por persona
};

export const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Salvaje Beach Chiringuito Nº6 Gandia')}&query_place_id=${site.placeId}`;
export const mapsEmbed = `https://www.google.com/maps?q=${site.geo.lat},${site.geo.lng}&z=17&output=embed`;

/**
 * HORARIO — fuente: ficha de Google Maps consultada el 23/10/2026 (semana en curso).
 * ⚠️ Instagram (16/10/2026) decía «Nos vemos el finde de 12h-17h»: el horario de otoño cambia de una
 * semana a otra. Pendiente de confirmar con el local. Para editarlo basta con tocar esta lista.
 * day: 0 = domingo … 6 = sábado (como Date.getDay()).
 */
export const hoursLabel = 'Horario de otoño';
export const hours = [
  { label: 'Lunes a jueves', days: [1, 2, 3, 4], open: '11:00', close: '18:00' },
  { label: 'Viernes', days: [5], open: '11:00', close: '23:00' },
  { label: 'Sábado', days: [6], open: '11:00', close: '00:00' },
  { label: 'Domingo', days: [0], open: '10:00', close: '21:00' },
];

const schemaDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const openingHoursLd = hours.map((h) => ({
  '@type': 'OpeningHoursSpecification',
  dayOfWeek: h.days.map((d) => `https://schema.org/${schemaDay[d]}`),
  opens: h.open,
  closes: h.close === '00:00' ? '23:59' : h.close,
}));
