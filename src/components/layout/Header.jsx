import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Zap, Home, Users, Shield, Swords, Menu, X, LogIn, LogOut, Settings, User } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { logoutUser } from '../../services/authService'
import styles from './Header.module.css'

const NAV_ITEMS = [
  { href: '/',           label: 'Inicio',    icon: Home   },
  { href: '/personajes', label: 'Jugadores', icon: Users  },
  { href: '/tecnicas',   label: 'Tecnicas',  icon: Zap    },
  { href: '/equipos',    label: 'Equipos',   icon: Swords },
  { href: '/mi-equipo',  label: 'Mi Equipo', icon: Shield },
]

export default function Header() {
  const { pathname }      = useLocation()
  const navigate          = useNavigate()
  const { user, refresh } = useAuth()
  const [open, setOpen]   = useState(false)

  // Escucha el evento personalizado 'auth-change' que dispara loginUser/logoutUser
  // Esto actualiza el header en la MISMA pestaña sin necesitar recargar
  useEffect(() => {
    const onAuthChange = () => refresh()
    window.addEventListener('auth-change', onAuthChange)
    return () => window.removeEventListener('auth-change', onAuthChange)
  }, [refresh])

  function handleLogout() {
    logoutUser()
    refresh()
    window.dispatchEvent(new Event('auth-change'))
    setOpen(false)
    navigate('/')
  }

  function isActive(href) {
    return href === '/' ? pathname === '/' : pathname.startsWith(href)
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>

        {/* Logo */}
        <Link to="/" className={styles.logo} onClick={() => setOpen(false)}>
          <div className={styles.logoIcon}><Zap size={18} /></div>
          <span className={`${styles.logoText} neon-text-blue`}>INAZUMA-TWELVE</span>
        </Link>

        {/* Desktop nav */}
        <nav className={styles.desktopNav}>
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              to={href}
              className={`${styles.navLink} ${isActive(href) ? styles.navLinkActive : ''}`}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className={`${styles.navLink} ${isActive('/admin') ? styles.navLinkAdmin : ''}`}
            >
              <Settings size={15} /> Admin
            </Link>
          )}
        </nav>

        {/* Actions */}
        <div className={styles.actions}>
          {user ? (
            <div className={styles.userControls}>
              <div className={styles.userLabel}>
                <User size={14} />
                <span className={styles.userName}>{user.username}</span>
              </div>
              <button onClick={handleLogout} className={styles.btnSecondary}>
                <LogOut size={15} /> <span>Salir</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className={styles.btnPrimary}>
              <LogIn size={15} /> <span>Acceder</span>
            </Link>
          )}

          {/* Mobile burger */}
          <button className={styles.burger} onClick={() => setOpen(o => !o)} aria-label="Menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className={styles.mobileNav}>
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              to={href}
              onClick={() => setOpen(false)}
              className={`${styles.mobileLink} ${isActive(href) ? styles.mobileLinkActive : ''}`}
            >
              <Icon size={16} /> {label}
            </Link>
          ))}
          {user && (
            <button onClick={handleLogout} className={styles.mobileLogoutBtn}>
              <LogOut size={16} /> Cerrar Sesion
            </button>
          )}
        </nav>
      )}
    </header>
  )
}