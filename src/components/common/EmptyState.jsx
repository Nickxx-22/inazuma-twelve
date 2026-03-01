import styles from './EmptyState.module.css'

/**
 * Estado vacío reutilizable
 * Props: icon (componente lucide), title, description
 */
export default function EmptyState({ icon: Icon, title = 'Sin resultados', description }) {
  return (
    <div className={styles.wrapper}>
      {Icon && <Icon size={40} className={styles.icon} />}
      <p className={styles.title}>{title}</p>
      {description && <p className={styles.desc}>{description}</p>}
    </div>
  )
}
