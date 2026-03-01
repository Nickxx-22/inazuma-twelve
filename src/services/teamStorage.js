// Persistencia del equipo en localStorage
// Cuando tengas backend, solo cambia estas funciones

const KEY = 'inazuma-my-team'

export function saveTeam({ name, slots }) {
  localStorage.setItem(KEY, JSON.stringify({ name, slots }))
}

export function loadTeam() {
  const stored = localStorage.getItem(KEY)
  return stored ? JSON.parse(stored) : null
}

export function clearTeam() {
  localStorage.removeItem(KEY)
}
