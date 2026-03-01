import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import styles from './SectionHeader.module.css'

/**
 * Cabecera de sección con título, subtítulo y enlace opcional
 * Props: title, subtitle, href (opcional), linkLabel
 */
export default function SectionHeader({ title, subtitle, href, linkLabel = 'Ver todos' }) {
  return (
    <div className={styles.wrapper}>
      <div>
        <h2 className={styles.title}>{title}</h2>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {href && (
        <Link to={href} className={styles.link}>
          {linkLabel} <ArrowRight size={14} />
        </Link>
      )}
    </div>
  )
}
