import { Link } from 'react-router-dom'
import { Github, Twitter } from 'lucide-react'
import logoImg from '../img/inazuma_japon.png'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          <div className={styles.brandIcon}>
            <img src={logoImg} alt="Inazuma Twelve" className={styles.brandImg} />
          </div>
          <span>INAZUMA-TWELVE</span>
        </Link>

        <nav className={styles.links}>
          <Link to="/personajes">Jugadores</Link>
          <Link to="/tecnicas">Tecnicas</Link>
          <Link to="/equipos">Equipos</Link>
        </nav>

        <div className={styles.socials}>
          <a href="https://github.com/Nickxx-22" aria-label="GitHub"><Github size={16} /></a>
          <a href="https://x.com/PunchoYT" aria-label="Twitter"><Twitter size={16} /></a>
        </div>
      </div>
      <p className={styles.legal}>
        Inazuma Eleven es propiedad de Level-5. Proyecto fan no oficial.
      </p>
    </footer>
  )
}