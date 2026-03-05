import { Link } from 'react-router-dom'
import { Zap, Github, Twitter } from 'lucide-react'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          <div className={styles.brandIcon}><Zap size={14} /></div>
          <span>INAZUMA DB</span>
        </Link>

        <nav className={styles.links}>
          <Link to="/personajes">Jugadores</Link>
          <Link to="/tecnicas">Técnicas</Link>
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
