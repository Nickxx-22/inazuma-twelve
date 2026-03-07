import { BASE_URL } from '../config'

export async function getAllPlayers() {
  const response = await fetch(`${BASE_URL}/jugadores`)
  if (!response.ok) throw new Error('Error al cargar jugadores')
  return response.json()
}