import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, Users, Shield, Swords, Menu, X, LogIn, LogOut, Settings, User, Zap, BookOpen } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { logoutUser } from '../../services/authService'
import logoImg from '../img/inazuma_japon.png'
import styles from './Header.module.css'

const NAV_ITEMS_USER = [
  { href: '/',           label: 'Inicio',    icon: Home,    accent: '#3d7eff' },
  { href: '/personajes', label: 'Jugadores', icon: Users,   accent: '#36d399' },
  { href: '/tecnicas',   label: 'Tecnicas',  icon: BookOpen, accent: '#f59e0b' },
  { href: '/equipos',    label: 'Equipos',   icon: Swords,  accent: '#f471b5' },
  { href: '/mi-equipo',  label: 'Mi Equipo', icon: Shield,  accent: '#a78bfa' },
]

const NAV_ITEMS_ADMIN = [
  { href: '/',           label: 'Inicio',    icon: Home,     accent: '#3d7eff' },
  { href: '/personajes', label: 'Jugadores', icon: Users,    accent: '#36d399' },
  { href: '/tecnicas',   label: 'Tecnicas',  icon: BookOpen, accent: '#f59e0b' },
  { href: '/equipos',    label: 'Equipos',   icon: Swords,   accent: '#f471b5' },
  { href: '/admin',      label: 'Admin',     icon: Settings, accent: '#ff8c00' },
]

export default function Header() {
  const { pathname }      = useLocation()
  const navigate          = useNavigate()
  const { user, refresh } = useAuth()
  const [open, setOpen]   = useState(false)

  const NAV_ITEMS = user?.role === 'admin' ? NAV_ITEMS_ADMIN : NAV_ITEMS_USER

  useEffect(() => {
    const onAuthChange = () => refresh()
    window.addEventListener('auth-change', onAuthChange)
    return () => window.removeEventListener('auth-change', onAuthChange)
  }, [refresh])

  function handleLogout() {
    logoutUser(); refresh()
    window.dispatchEvent(new Event('auth-change'))
    setOpen(false); navigate('/')
  }

  function isActive(href) {
    return href === '/' ? pathname === '/' : pathname.startsWith(href)
  }

  const activeItem = NAV_ITEMS.find(item => isActive(item.href))

  return (
    <header className={styles.header}>
      <div className={styles.inner}>

        {/* Logo */}
        <Link to="/" className={styles.logo} onClick={() => setOpen(false)}>
          <div className={styles.logoIcon}>
            <img src={logoImg} alt="Inazuma Twelve" className={styles.logoImg} />
          </div>
          <div className={styles.logoTextWrap}>
            <span className={styles.logoText}>INAZUMA</span>
            <span className={styles.logoTextSub}>TWELVE</span>
          </div>
        </Link>

        {/* Desktop nav — píldoras con acento de color */}
        <nav className={styles.desktopNav}>
          {NAV_ITEMS.map(({ href, label, icon: Icon, accent }) => {
            const active = isActive(href)
            return (
              <Link
                key={href}
                to={href}
                className={`${styles.navLink} ${active ? styles.navLinkActive : ''}`}
                style={active ? { '--accent': accent } : {}}
              >
                <span className={styles.navIcon} style={active ? { color: accent } : {}}>
                  <Icon size={14} />
                </span>
                <span className={styles.navLabel}>{label}</span>
                {active && <span className={styles.navDot} style={{ background: accent }} />}
              </Link>
            )
          })}
        </nav>

        {/* Actions */}
        <div className={styles.actions}>
          {user ? (
            <div className={styles.userControls}>
              <div className={styles.userChip}>
                <div className={styles.userAvatar}>
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className={styles.userName}>{user.username}</span>
              </div>
              <button onClick={handleLogout} className={styles.logoutBtn} title="Cerrar sesion">
                <LogOut size={14} />
                <span>Salir</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className={styles.loginBtn}>
              <LogIn size={14} />
              <span>Acceder</span>
            </Link>
          )}
          <button className={styles.burger} onClick={() => setOpen(o => !o)} aria-label="Menu">
            <span className={`${styles.burgerLine} ${open ? styles.burgerLineTop : ''}`} />
            <span className={`${styles.burgerLine} ${open ? styles.burgerLineMid : ''}`} />
            <span className={`${styles.burgerLine} ${open ? styles.burgerLineBot : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className={styles.mobileNav}>
          <div className={styles.mobileGrid}>
            {NAV_ITEMS.map(({ href, label, icon: Icon, accent }) => {
              const active = isActive(href)
              return (
                <Link
                  key={href}
                  to={href}
                  onClick={() => setOpen(false)}
                  className={`${styles.mobileCard} ${active ? styles.mobileCardActive : ''}`}
                  style={active ? { borderColor: accent, background: `${accent}12` } : {}}
                >
                  <Icon size={20} style={active ? { color: accent } : {}} />
                  <span>{label}</span>
                </Link>
              )
            })}
          </div>
          {user && (
            <button onClick={handleLogout} className={styles.mobileLogout}>
              <LogOut size={16} /> Cerrar Sesion
            </button>
          )}
        </nav>
      )}
    </header>
  )
}