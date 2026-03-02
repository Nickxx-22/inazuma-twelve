import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, User, Lock, LogIn } from 'lucide-react' // Cambié Mail por User
import { loginUser } from '../services/authService'
import { useAuth } from '../hooks/useAuth' // Importante para actualizar el estado global
import styles from './AuthPage.module.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const { refresh } = useAuth() // Para que el Header se entere del login
  const [username, setUsername] = useState('') // Cambiado de email a username
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // Ahora enviamos 'username' tal como probaste en Thunder Client
      await loginUser({ username, password })
      if (refresh) refresh() 
      navigate('/mi-equipo')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoWrap}>
          <div className={styles.logoIcon}><Zap size={22} /></div>
          <h1 className={styles.heading}>Iniciar Sesión</h1>
          <p className={styles.sub}>Accede con tu usuario de la Inazuma DB</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Usuario</label>
            <div className={styles.inputWrap}>
              <User size={15} className={styles.inputIcon} />
              <input 
                type="text" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                placeholder="nico" 
                className={styles.input} 
                required 
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Contraseña</label>
            <div className={styles.inputWrap}>
              <Lock size={15} className={styles.inputIcon} />
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="Tu contraseña" 
                className={styles.input} 
                required 
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? 'Iniciando sesión...' : <><LogIn size={15} /> Iniciar Sesión</>}
          </button>
        </form>

        <p className={styles.switchText}>
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className={styles.switchLink}>Regístrate</Link>
        </p>
      </div>
    </div>
  )
}