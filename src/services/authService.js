// Servicio de autenticación — demo con localStorage
// Reemplaza estas funciones con llamadas a tu API real

export function getUser() {
  const stored = localStorage.getItem('inazuma-user')
  return stored ? JSON.parse(stored) : null
}

export function loginUser({ email, password }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!email || !password) {
        reject(new Error('Email y contraseña son obligatorios'))
        return
      }
      // Demo: admin hardcodeado, cualquier otro combo es user normal
      const role = email === 'admin@inazuma.com' && password === 'admin' ? 'admin' : 'user'
      const name = role === 'admin' ? 'Admin' : email.split('@')[0]
      const user = { email, role, name }
      localStorage.setItem('inazuma-user', JSON.stringify(user))
      resolve(user)
    }, 500)
  })
}

export function registerUser({ name, email, password }) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = { email, role: 'user', name }
      localStorage.setItem('inazuma-user', JSON.stringify(user))
      resolve(user)
    }, 500)
  })
}

export function logoutUser() {
  localStorage.removeItem('inazuma-user')
  localStorage.removeItem('inazuma-my-team')
}
