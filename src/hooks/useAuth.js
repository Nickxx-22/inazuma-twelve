import { useState, useEffect } from 'react'
import { getUser } from '../services/authService'

// Hook para leer el usuario autenticado
// Se puede mejorar con Context para compartirlo sin prop-drilling
export function useAuth() {
  const [user, setUser] = useState(() => getUser())

  useEffect(() => {
    // Sincroniza cuando otra pestaña cambia el localStorage
    const onStorage = () => setUser(getUser())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const refresh = () => setUser(getUser())

  return { user, refresh }
}
