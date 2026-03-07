import { Link } from 'react-router-dom'
import { getElementColor, getNatureColor } from '../../utils/colors'
import { imgUrl } from '../../config'
import styles from './CharacterListItem.module.css'

const TIER_COLORS = {
  'S+': '#ff6b35', 'S': '#ff9500', 'A+': '#f5c518', 'A': '#f5c518',
  'B+': '#36d399', 'B': '#36d399', 'C': '#94a3b8', 'D': '#64748b'
}

const STAT_KEYS = [
  { key: 'kicking',      label: 'TIR' },
  { key: 'control',      label: 'CON' },
  { key: 'technique',    label: 'TEC' },
  { key: 'pressure',     label: 'PRE' },
  { key: 'physique',     label: 'FIS' },
  { key: 'agility',      label: 'AGI' },
  { key: 'intelligence', label: 'INT' },
  { key: 'defense',      label: 'DEF' },
]

export default function CharacterListItem({ character }) {
  const elColor  = getElementColor(character.element)
  const natColor = getNatureColor(character.nature)
  const tierColor = TIER_COLORS[character.tier] || '#94a3b8'
  const stats = character.stats || {}

  return (
    <Link to={`/personajes/${character.id}`} className={`${styles.row} card-hover`}>

      {/* Avatar */}
      <div className={styles.avatarWrap} style={{ background: `linear-gradient(135deg, ${elColor}33, ${natColor}22)` }}>
        {character.image
          ? <img src={imgUrl(character.image)} alt={character.name} className={styles.avatarImg} />
          : <span className={styles.avatarFallback} style={{ background: `linear-gradient(135deg, ${elColor}, ${natColor})` }}>{character.name.charAt(0)}</span>
        }
      </div>

      {/* Nombre + japonés */}
      <div className={styles.nameBlock}>
        <span className={styles.name}>{character.name}</span>
        <span className={styles.jaName}>{character.japaneseName}</span>
      </div>

      {/* Posición */}
      <div className={styles.posCol}>
        {character.positionImg
          ? <img src={imgUrl(character.positionImg)} alt={character.position} className={styles.posImg} title={character.position} />
          : <span className={styles.posBadge}>{character.position}</span>
        }
      </div>

      {/* Elemento */}
      <div className={styles.elCol}>
        {character.elementImg
          ? <img src={imgUrl(character.elementImg)} alt={character.element} className={styles.elImg} title={character.element} />
          : <span className={styles.elBadge} style={{ background: elColor }}>{character.element}</span>
        }
      </div>

      {/* Naturaleza */}
      <div className={styles.natCol}>
        <span className={styles.natBadge} style={{ background: natColor }}>{character.nature}</span>
      </div>

      {/* Tier */}
      <div className={styles.tierCol}>
        {character.tier && (
          <span className={styles.tierBadge} style={{ color: tierColor, borderColor: `${tierColor}55`, background: `${tierColor}18` }}>
            {character.tier}
          </span>
        )}
      </div>

      {/* Stats individuales */}
      <div className={styles.statsRow}>
        {STAT_KEYS.map(({ key, label }) => (
          <div key={key} className={styles.statCell}>
            <span className={styles.statVal}>{stats[key] ?? '—'}</span>
            <span className={styles.statLbl}>{label}</span>
          </div>
        ))}
      </div>

      {/* PWR total */}
      <div className={styles.power}>
        <span style={{ color: elColor }}>{character.power}</span>
        <small>PWR</small>
      </div>
    </Link>
  )
}