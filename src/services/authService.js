const BASE_URL = 'https://api-inazuma.onrender.com';

export function getUser() {
  const stored = localStorage.getItem('inazuma-user');
  return stored ? JSON.parse(stored) : null;
}

// LOGIN REAL contra Flask
export async function loginUser({ username, password }) {
  const response = await fetch(`${BASE_URL}/iniciar_sesion`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al iniciar sesion');
  }

  localStorage.setItem('inazuma-token', data.token);
  localStorage.setItem('inazuma-user', JSON.stringify(data.usuario));

  // Notifica a todos los componentes en la misma pestana (Header, etc.)
  window.dispatchEvent(new Event('auth-change'));

  return data.usuario;
}

// REGISTRO REAL contra Flask
export async function registerUser({ username, email, password, confirm_password }) {
  const response = await fetch(`${BASE_URL}/registrar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password, confirm_password })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error en el registro');
  }

  return data;
}

// CERRAR SESION
export function logoutUser() {
  localStorage.removeItem('inazuma-user');
  localStorage.removeItem('inazuma-token');
  localStorage.removeItem('inazuma-my-team');

  // Notifica a todos los componentes
  window.dispatchEvent(new Event('auth-change'));
}