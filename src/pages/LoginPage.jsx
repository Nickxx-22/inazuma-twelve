import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, Mail, Lock, LogIn } from 'lucide-react'
import { loginUser } from '../services/authService'
import styles from './AuthPage.module.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await loginUser({ email, password })
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
        {/* Logo */}
        <div className={styles.logoWrap}>
          <div className={styles.logoIcon}><Zap size={22} /></div>
          <h1 className={styles.heading}>Iniciar Sesión</h1>
          <p className={styles.sub}>Accede a tu cuenta para gestionar tu equipo</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <div className={styles.inputWrap}>
              <Mail size={15} className={styles.inputIcon} />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" className={styles.input} />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Contraseña</label>
            <div className={styles.inputWrap}>
              <Lock size={15} className={styles.inputIcon} />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Tu contraseña" className={styles.input} />
            </div>
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            <LogIn size={15} /> {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <p className={styles.switchText}>
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className={styles.switchLink}>Regístrate</Link>
        </p>

        <div className={styles.demo}>
          <p>Demo: usa cualquier email/contraseña para entrar como usuario</p>
          <p>Admin: admin@inazuma.com / admin</p>
        </div>
      </div>
    </div>
  )
}
