import styles from './FilterSelect.module.css'

/**
 * Select reutilizable para filtros
 * Props: label, value, onChange, options (array de strings)
 */
export default function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={styles.select}
      >
        <option value="">Todos</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  )
}
