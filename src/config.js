// ─── Configuración global de la API ──────────────────────────────
// Cambia este valor para alternar entre desarrollo y producción.
// En desarrollo: 'http://127.0.0.1:5000'
// En producción: 'https://api-inazuma.onrender.com'

export const BASE_URL = 'https://api-inazuma.onrender.com'

/**
 * Convierte una ruta relativa de imagen/vídeo del backend
 * en una URL absoluta apuntando al servidor correcto.
 *
 * Ejemplos:
 *   imgUrl('/img/jugadores/axel.png')
 *   → 'https://api-inazuma.onrender.com/img/jugadores/axel.png'
 *
 *   imgUrl({ url: '/img/equipos/raimon.png' })
 *   → 'https://api-inazuma.onrender.com/img/equipos/raimon.png'
 *
 *   imgUrl(null)  → ''
 */
export function imgUrl(path) {
  if (!path) return ''

  // Si nos pasan un objeto { url: '...' }, extraemos el campo
  const raw = typeof path === 'object' ? path.url : path

  if (!raw) return ''

  // Si ya es una URL absoluta (http / https / blob) la devolvemos tal cual
  if (/^https?:\/\//.test(raw) || raw.startsWith('blob:')) return raw

  // Ruta relativa → prefijamos BASE_URL
  return `${BASE_URL}${raw.startsWith('/') ? '' : '/'}${raw}`
}