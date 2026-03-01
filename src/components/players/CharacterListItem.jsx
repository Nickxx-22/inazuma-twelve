import { Link } from 'react-router-dom'
import { getElementColor, getNatureColor } from '../../utils/colors'
import styles from './CharacterListItem.module.css'

/**
 * Fila de personaje (vista lista)
 * Props: character
 */
export default function CharacterListItem({ character }) {
  const elColor  = getElementColor(character.element)
  const natColor = getNatureColor(character.nature)

  return (
    <Link to={`/personajes/${character.id}`} className={`${styles.row} card-hover`}>
      {/* Avatar */}
      <div
        className={styles.avatar}
        style={{ background: `linear-gradient(135deg, ${elColor}, ${natColor})` }}
      >
        {character.name.charAt(0)}
      </div>

      {/* Nombre */}
      <div className={styles.nameBlock}>
        <span className={styles.name}>{character.name}</span>
        <span className={styles.jaName}>{character.japaneseName}</span>
      </div>

      {/* Tags */}
      <div className={styles.tags}>
        <span className={styles.tag} style={{ background: elColor }}>{character.element}</span>
        <span className={`${styles.tag} ${styles.tagNature}`} style={{ background: natColor }}>{character.nature}</span>
        <span className={`${styles.tag} ${styles.tagSecondary}`}>{character.position}</span>
        <span className={`${styles.tag} ${styles.tagSecondary}`}>{character.season}</span>
      </div>

      {/* Power */}
      <div className={styles.power}>
        <span>{character.power}</span>
        <small>PWR</small>
      </div>
    </Link>
  )
}
