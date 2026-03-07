import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, UserPlus, Eye, EyeOff, CheckCircle2, XCircle, Loader2, Shield } from 'lucide-react'
import styles from './AuthPage.module.css'

import { BASE_URL } from '../config'

function validateField(name, value, password) {
  switch (name) {
    case 'username':
      if (!value) return 'El nombre es obligatorio'
      if (value.length < 3) return 'Minimo 3 caracteres'
      return ''
    case 'email':
      if (!value) return 'El email es obligatorio'
      if (!/^[\w.-]+@[\w.-]+\.(com|es)$/.test(value)) return 'Email invalido'
      return ''
    case 'password':
      if (!value) return 'La contrasena es obligatoria'
      if (value.length < 6) return 'Minimo 6 caracteres'
      return ''
    case 'confirmPassword':
      if (!value) return 'Confirma tu contrasena'
      if (value !== password) return 'Las contrasenas no coinciden'
      return ''
    default: return ''
  }
}

export default function RegistroPage() {
  const navigate = useNavigate()
  const [fields, setFields] = useState({ username: '', email: '', password: '', confirmPassword: '' })
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

  function handleChange(e) { const { name, value } = e.target; setFields(p => ({ ...p, [name]: value })); setApiError('') }
  function handleBlur(e)   { setTouched(p => ({ ...p, [e.target.name]: true })) }

  async function handleSubmit(e) {
    e.preventDefault()
    setTouched({ username: true, email: true, password: true, confirmPassword: true })
    if (!isFormValid) return
    setLoading(true); setApiError('')
    try {
      const res  = await fetch(`${BASE_URL}/registrar`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: fields.username, email: fields.email,
          password: fields.password, confirm_password: fields.confirmPassword
        })
      })
      const data = await res.json()
      if (!res.ok) { setApiError(data.message || 'Error al crear la cuenta'); return }
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2200)
    } catch {
      setApiError('No se pudo conectar con el servidor.')
    } finally {
      setLoading(false)
    }
  }

  if (success) return (
    <div className={styles.splitPage}>
      <div className={`${styles.leftPanel} ${styles.leftPanelRegister}`} />
      <div className={styles.rightPanel}>
        <div className={`${styles.formCard} ${styles.formCardOrange}`}>
          <div className={styles.successWrap}>
            <div className={styles.successIcon}><CheckCircle2 size={52} /></div>
            <h2 className={styles.formTitle}>Cuenta creada</h2>
            <p className={styles.sub}>Redirigiendo al inicio de sesion...</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className={styles.splitPage}>

      {/* Panel izquierdo — versión Registro */}
      <div className={`${styles.leftPanel} ${styles.leftPanelRegister}`}>
        <div className={styles.leftOverlay} />
        <div className={styles.leftContent}>
          <h2 className={`${styles.leftTitle} ${styles.leftTitleRegister}`}>
            Empieza tu<br/><em>leyenda</em><br/>hoy.
          </h2>
          <p className={styles.leftSub}>
            Registrate y construye el equipo de tus suenos. Tu plantilla ideal a un paso.
          </p>
          <div className={styles.benefitList}>
            <div className={styles.benefit}>
              <CheckCircle2 size={15} /> Guarda tu equipo personalizado
            </div>
            <div className={styles.benefit}>
              <CheckCircle2 size={15} /> Marca tecnicas y jugadores favoritos
            </div>
            <div className={styles.benefit}>
              <CheckCircle2 size={15} /> Accede desde cualquier dispositivo
            </div>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className={styles.rightPanel}>
        <div className={`${styles.formCard} ${styles.formCardOrange}`}>

          <div className={styles.formHead}>
            <h1 className={styles.formTitle}>Crear<br/>Cuenta</h1>
            <p className={styles.formSubtitle}>Registrate para empezar tu aventura</p>
          </div>

          {apiError && <div className={styles.error}>{apiError}</div>}

          <form onSubmit={handleSubmit} className={styles.form} noValidate>

            {/* Username + Email en fila */}
            <div className={styles.pwdRow}>
              <div className={styles.field}>
                <label className={styles.label}>Usuario</label>
                <div className={`${styles.inputWrap} ${touched.username && errors.username ? styles.inputError : touched.username && !errors.username ? styles.inputOk : ''}`}>
                  <User size={14} className={styles.inputIcon} />
                  <input type="text" name="username" value={fields.username}
                    onChange={handleChange} onBlur={handleBlur}
                    placeholder="tu_usuario" className={styles.input} autoComplete="username" />
                  {touched.username && (errors.username
                    ? <XCircle size={13} className={styles.fieldIconError} />
                    : <CheckCircle2 size={13} className={styles.fieldIconOk} />)}
                </div>
                {touched.username && errors.username && <span className={styles.fieldError}>{errors.username}</span>}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Email</label>
                <div className={`${styles.inputWrap} ${touched.email && errors.email ? styles.inputError : touched.email && !errors.email ? styles.inputOk : ''}`}>
                  <Mail size={14} className={styles.inputIcon} />
                  <input type="email" name="email" value={fields.email}
                    onChange={handleChange} onBlur={handleBlur}
                    placeholder="tu@email.com" className={styles.input} autoComplete="email" />
                  {touched.email && (errors.email
                    ? <XCircle size={13} className={styles.fieldIconError} />
                    : <CheckCircle2 size={13} className={styles.fieldIconOk} />)}
                </div>
                {touched.email && errors.email && <span className={styles.fieldError}>{errors.email}</span>}
              </div>
            </div>

            {/* Passwords */}
            <div className={styles.pwdRow}>
              <div className={styles.field}>
                <label className={styles.label}>Contrasena</label>
                <div className={`${styles.inputWrap} ${touched.password && errors.password ? styles.inputError : touched.password && !errors.password ? styles.inputOk : ''}`}>
                  <Lock size={14} className={styles.inputIcon} />
                  <input type={showPwd ? 'text' : 'password'} name="password" value={fields.password}
                    onChange={handleChange} onBlur={handleBlur}
                    placeholder="Min. 6 car." className={styles.input} autoComplete="new-password" />
                  <button type="button" className={styles.eyeBtn} onClick={() => setShowPwd(v => !v)}>
                    {showPwd ? <EyeOff size={13}/> : <Eye size={13}/>}
                  </button>
                </div>
                {touched.password && errors.password && <span className={styles.fieldError}>{errors.password}</span>}
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Repetir</label>
                <div className={`${styles.inputWrap} ${touched.confirmPassword && errors.confirmPassword ? styles.inputError : touched.confirmPassword && !errors.confirmPassword ? styles.inputOk : ''}`}>
                  <Lock size={14} className={styles.inputIcon} />
                  <input type={showPwdConf ? 'text' : 'password'} name="confirmPassword" value={fields.confirmPassword}
                    onChange={handleChange} onBlur={handleBlur}
                    placeholder="Repite" className={styles.input} autoComplete="new-password" />
                  <button type="button" className={styles.eyeBtn} onClick={() => setShowPwdConf(v => !v)}>
                    {showPwdConf ? <EyeOff size={13}/> : <Eye size={13}/>}
                  </button>
                </div>
                {touched.confirmPassword && errors.confirmPassword && <span className={styles.fieldError}>{errors.confirmPassword}</span>}
              </div>
            </div>

            <button type="submit" disabled={loading} className={`${styles.submitBtn} ${styles.submitBtnOrange}`}>
              {loading
                ? <><Loader2 size={15} className={styles.btnSpin} /> Creando cuenta...</>
                : <><UserPlus size={15} /> Unirme al campo</>
              }
            </button>
          </form>

          <div className={styles.divider}><span>o</span></div>
          <p className={styles.switchText}>
            Ya tienes cuenta?{' '}
            <Link to="/login" className={styles.switchLink}>Inicia sesion</Link>
          </p>
        </div>
      </div>
    </div>
  )
}