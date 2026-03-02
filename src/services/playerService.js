export async function getAllPlayers() {
  const response = await fetch('http://127.0.0.1:5000/jugadores');
  if (!response.ok) throw new Error('Error al cargar jugadores');
  return await response.json(); // Esto devuelve la lista completa
}