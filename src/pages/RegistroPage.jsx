import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, Mail, Lock, User, UserPlus, Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react'
import styles from './AuthPage.module.css'

const BASE_URL = 'http://127.0.0.1:5000'

// Validaciones en tiempo real
function validateField(name, value, password) {
  switch (name) {
    case 'username':
      if (!value) return 'El nombre de usuario es obligatorio'
      if (value.length < 3) return 'Minimo 3 caracteres'
      return ''
    case 'email':
      if (!value) return 'El email es obligatorio'
      if (!/^[\w.-]+@[\w.-]+\.(com|es)$/.test(value)) return 'Email invalido (debe terminar en .com o .es)'
      return ''
    case 'password':
      if (!value) return 'La contrasena es obligatoria'
      if (value.length < 6) return 'Minimo 6 caracteres'
      return ''
    case 'confirmPassword':
      if (!value) return 'Confirma tu contrasena'
      if (value !== password) return 'Las contrasenas no coinciden'
      return ''
    default:
      return ''
  }
}

export default function RegistroPage() {
  const navigate = useNavigate()

  const [fields, setFields] = useState({
    username:        '',
    email:           '',
    password:        '',
    confirmPassword: '',
  })
  const [touched,     setTouched]     = useState({})
  const [showPwd,     setShowPwd]     = useState(false)
  const [showPwdConf, setShowPwdConf] = useState(false)
  const [apiError,    setApiError]    = useState('')
  const [loading,     setLoading]     = useState(false)
  const [success,     setSuccess]     = useState(false)

  const errors = {
    username:        validateField('username',        fields.username,        fields.password),
    email:           validateField('email',           fields.email,           fields.password),
    password:        validateField('password',        fields.password,        fields.password),
    confirmPassword: validateField('confirmPassword', fields.confirmPassword, fields.password),
  }
  const isFormValid = Object.values(errors).every(e => e === '')

  function handleChange(e) {
    const { name, value } = e.target
    setFields(prev => ({ ...prev, [name]: value }))
    setApiError('')
  }
  function handleBlur(e) {
    setTouched(prev => ({ ...prev, [e.target.name]: true }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    // Marcar todos como tocados para mostrar errores
    setTouched({ username: true, email: true, password: true, confirmPassword: true })
    if (!isFormValid) return

    setLoading(true)
    setApiError('')

    try {
      const res = await fetch(`${BASE_URL}/registrar`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          username:         fields.username,
          email:            fields.email,
          password:         fields.password,
          confirm_password: fields.confirmPassword,
        })
      })

      const data = await res.json()

      if (!res.ok) {
        // El backend devuelve mensajes como "El correo ya esta en uso"
        setApiError(data.message || 'Error al crear la cuenta')
        return
      }

      // Registro exitoso: mostramos confirmacion y redirigimos al login
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)

    } catch (err) {
      setApiError('No se pudo conectar con el servidor. Revisa que el backend este activo.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.successWrap}>
            <div className={styles.successIcon}><CheckCircle2 size={48} /></div>
            <h2 className={styles.heading}>Cuenta creada</h2>
            <p className={styles.sub}>Redirigiendo al inicio de sesion...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoWrap}>
          <div className={`${styles.logoIcon} ${styles.logoIconOrange}`}><Zap size={22} /></div>
          <h1 className={styles.heading}>Crear Cuenta</h1>
          <p className={styles.sub}>Unete para crear tu equipo ideal</p>
        </div>

        {apiError && <div className={styles.error}>{apiError}</div>}

        <form onSubmit={handleSubmit} className={styles.form} noValidate>

          {/* Username */}
          <div className={styles.field}>
            <label className={styles.label}>Nombre de usuario</label>
            <div className={`${styles.inputWrap} ${touched.username && errors.username ? styles.inputError : touched.username && !errors.username ? styles.inputOk : ''}`}>
              <User size={15} className={styles.inputIcon} />
              <input
                type="text" name="username"
                value={fields.username} onChange={handleChange} onBlur={handleBlur}
                placeholder="Tu nombre de usuario"
                className={styles.input}
                autoComplete="username"
              />
              {touched.username && (errors.username
                ? <XCircle size={15} className={styles.fieldIconError} />
                : <CheckCircle2 size={15} className={styles.fieldIconOk} />
              )}
            </div>
            {touched.username && errors.username && <span className={styles.fieldError}>{errors.username}</span>}
          </div>

          {/* Email */}
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <div className={`${styles.inputWrap} ${touched.email && errors.email ? styles.inputError : touched.email && !errors.email ? styles.inputOk : ''}`}>
              <Mail size={15} className={styles.inputIcon} />
              <input
                type="email" name="email"
                value={fields.email} onChange={handleChange} onBlur={handleBlur}
                placeholder="tu@email.com"
                className={styles.input}
                autoComplete="email"
              />
              {touched.email && (errors.email
                ? <XCircle size={15} className={styles.fieldIconError} />
                : <CheckCircle2 size={15} className={styles.fieldIconOk} />
              )}
            </div>
            {touched.email && errors.email && <span className={styles.fieldError}>{errors.email}</span>}
          </div>

          {/* Password */}
          <div className={styles.field}>
            <label className={styles.label}>Contrasena</label>
            <div className={`${styles.inputWrap} ${touched.password && errors.password ? styles.inputError : touched.password && !errors.password ? styles.inputOk : ''}`}>
              <Lock size={15} className={styles.inputIcon} />
              <input
                type={showPwd ? 'text' : 'password'} name="password"
                value={fields.password} onChange={handleChange} onBlur={handleBlur}
                placeholder="Minimo 6 caracteres"
                className={styles.input}
                autoComplete="new-password"
              />
              <button type="button" className={styles.eyeBtn} onClick={() => setShowPwd(v => !v)}>
                {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {touched.password && errors.password && <span className={styles.fieldError}>{errors.password}</span>}
          </div>

          {/* Confirm password */}
          <div className={styles.field}>
            <label className={styles.label}>Confirmar contrasena</label>
            <div className={`${styles.inputWrap} ${touched.confirmPassword && errors.confirmPassword ? styles.inputError : touched.confirmPassword && !errors.confirmPassword ? styles.inputOk : ''}`}>
              <Lock size={15} className={styles.inputIcon} />
              <input
                type={showPwdConf ? 'text' : 'password'} name="confirmPassword"
                value={fields.confirmPassword} onChange={handleChange} onBlur={handleBlur}
                placeholder="Repite tu contrasena"
                className={styles.input}
                autoComplete="new-password"
              />
              <button type="button" className={styles.eyeBtn} onClick={() => setShowPwdConf(v => !v)}>
                {showPwdConf ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {touched.confirmPassword && errors.confirmPassword && <span className={styles.fieldError}>{errors.confirmPassword}</span>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`${styles.submitBtn} ${styles.submitBtnOrange}`}
          >
            <UserPlus size={15} />
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <p className={styles.switchText}>
          Ya tienes cuenta?{' '}
          <Link to="/login" className={styles.switchLink}>Inicia sesion</Link>
        </p>
      </div>
    </div>
  )
}