export async function getAllPlayers() {
  // Cambiamos la URL local por la de Render
  const response = await fetch('https://api-inazuma.onrender.com/jugadores');
  
  if (!response.ok) throw new Error('Error al cargar jugadores');
  
  const data = await response.json();
  
  // Aquí es donde verás el campo "matchStats" que configuramos
  // y podrás aplicar los modificadores (0.5 para heredero y 0.3 para copia)
  return data; 
};