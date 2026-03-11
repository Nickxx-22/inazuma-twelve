import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Lock, LogIn, Eye, EyeOff, Loader2, Zap, Trophy } from 'lucide-react'
import { loginUser } from '../services/authService'
import { useAuth } from '../hooks/useAuth'
import styles from './AuthPage.module.css'

export default function LoginPage() {
  const navigate         = useNavigate()
  const { refresh }      = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd,  setShowPwd]  = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
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
    <div className={styles.splitPage}>

      <div className={styles.leftPanel}>
        <div className={styles.leftOverlay} />
        <div className={styles.leftContent}>
          <h2 className={styles.leftTitle}>
            El campo<br/>te <em>espera</em>,<br/>entrenador.
          </h2>
          <p className={styles.leftSub}>
            Accede a tu cuenta para gestionar tu equipo, explorar tecnicas y construir tu plantilla ideal.
          </p>
          <div className={styles.leftStats}>
            <div className={styles.leftStat}>
              <span className={styles.leftStatNum}>200+</span>
              <span className={styles.leftStatLabel}>Jugadores</span>
            </div>
            <div className={styles.leftStat}>
              <span className={styles.leftStatNum}>150+</span>
              <span className={styles.leftStatLabel}>Tecnicas</span>
            </div>
            <div className={styles.leftStat}>
              <span className={styles.leftStatNum}>30+</span>
              <span className={styles.leftStatLabel}>Equipos</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.formCard}>

          <div className={styles.formHead}>
            <h1 className={styles.formTitle}>Iniciar<br/>Sesion</h1>
            <p className={styles.formSubtitle}>Introduce tus credenciales para acceder</p>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Usuario</label>
              <div className={styles.inputWrap}>
                <User size={15} className={styles.inputIcon} />
                <input
                  type="text" value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="tu_nombre_de_usuario"
                  className={styles.input} required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Contraseña</label>
              <div className={styles.inputWrap}>
                <Lock size={15} className={styles.inputIcon} />
                <input
                  type={showPwd ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={styles.input} required
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPwd(v => !v)}>
                  {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading
                ? <><Loader2 size={16} className={styles.btnSpin} /> Verificando...</>
                : <><LogIn size={16} /> Entrar al campo</>
              }
            </button>
          </form>

          <div className={styles.divider}><span>o</span></div>

          <p className={styles.switchText}>
            Primera vez?{' '}
            <Link to="/registro" className={styles.switchLink}>Crea tu cuenta gratis</Link>
          </p>
        </div>
      </div>
    </div>
  )
}