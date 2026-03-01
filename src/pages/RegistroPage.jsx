import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, Mail, Lock, User, UserPlus } from 'lucide-react'
import { registerUser } from '../services/authService'
import styles from './AuthPage.module.css'

export default function RegistroPage() {
  const navigate = useNavigate()
  const [name,            setName]            = useState('')
  const [email,           setEmail]           = useState('')
  const [password,        setPassword]        = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error,           setError]           = useState('')
  const [loading,         setLoading]         = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!name || !email || !password) { setError('Todos los campos son obligatorios'); return }
    if (password !== confirmPassword)  { setError('Las contraseñas no coinciden'); return }
    if (password.length < 6)           { setError('La contraseña debe tener al menos 6 caracteres'); return }
    setLoading(true)
    try {
      await registerUser({ name, email, password })
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
          <div className={`${styles.logoIcon} ${styles.logoIconOrange}`}><Zap size={22} /></div>
          <h1 className={styles.heading}>Crear Cuenta</h1>
          <p className={styles.sub}>Únete para crear tu equipo ideal</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Nombre</label>
            <div className={styles.inputWrap}>
              <User size={15} className={styles.inputIcon} />
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre" className={styles.input} />
            </div>
          </div>

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
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" className={styles.input} />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Confirmar Contraseña</label>
            <div className={styles.inputWrap}>
              <Lock size={15} className={styles.inputIcon} />
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repite tu contraseña" className={styles.input} />
            </div>
          </div>

          <button type="submit" disabled={loading} className={`${styles.submitBtn} ${styles.submitBtnOrange}`}>
            <UserPlus size={15} /> {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <p className={styles.switchText}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className={styles.switchLink}>Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}
