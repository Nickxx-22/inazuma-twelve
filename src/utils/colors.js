// Helpers de color para elementos y naturalezas
// Cuando tu API devuelva personajes, estos ya están listos para usarse

export function getElementColor(element) {
  const colors = {
    Fuego:   '#ef4444',
    Montaña: '#9e590b',
    Aire:    '#3b82f6',
    Bosque:  '#22c55e',
  }
  return colors[element] ?? '#6b7280'
}

export function getNatureColor(nature) {
  const colors = {
    Justicia:      '#3b82f6',
    Tension:       '#ef4444',
    Contraataque:  '#f97316',
    Afinidad:      '#ec4899',
    Brecha:        '#8b5cf6',
    'Juego Sucio': '#6b7280',
  }
  return colors[nature] ?? '#6b7280'
}
