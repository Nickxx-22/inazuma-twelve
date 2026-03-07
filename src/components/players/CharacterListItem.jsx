import { Link } from 'react-router-dom'
import { getElementColor, getNatureColor } from '../../utils/colors'
import { imgUrl } from '../../config'
import styles from './CharacterListItem.module.css'

export default function CharacterListItem({ character }) {
  const elColor  = getElementColor(character.element)
  const natColor = getNatureColor(character.nature)

  const seasonLabels = Array.isArray(character.seasons)
    ? character.seasons
    : character.season ? [character.season] : []

  return (
    <Link to={`/personajes/${character.id}`} className={`${styles.row} card-hover`}>

      {/* Avatar */}
      <div className={styles.avatarWrap} style={{ background: `linear-gradient(135deg, ${elColor}33, ${natColor}22)` }}>
        {character.image
          ? <img src={imgUrl(character.image)} alt={character.name} className={styles.avatarImg} />
          : <span className={styles.avatarFallback} style={{ background: `linear-gradient(135deg, ${elColor}, ${natColor})` }}>{character.name.charAt(0)}</span>
        }
      </div>

      {/* Nombre */}
      <div className={styles.nameBlock}>
        <span className={styles.name}>{character.name}</span>
        <span className={styles.jaName}>{character.japaneseName}</span>
      </div>

      {/* Tags */}
      <div className={styles.tags}>
        {character.elementImg
          ? <img src={imgUrl(character.elementImg)} alt={character.element} className={styles.tagImg} title={character.element} />
          : <span className={styles.tag} style={{ background: elColor }}>{character.element}</span>
        }
        <span className={styles.tag} style={{ background: natColor }}>{character.nature}</span>
        {character.positionImg
          ? <img src={imgUrl(character.positionImg)} alt={character.position} className={styles.tagImg} title={character.position} />
          : <span className={`${styles.tag} ${styles.tagSecondary}`}>{character.position}</span>
        }
        {seasonLabels.map(s => (
          <span key={s} className={`${styles.tag} ${styles.tagSeason}`}>{s}</span>
        ))}
        {character.countryImg && (
          <img src={imgUrl(character.countryImg)} alt={character.country} className={styles.flagTag} title={character.country} />
        )}
      </div>

      {/* Power */}
      <div className={styles.power}>
        <span style={{ color: elColor }}>{character.power}</span>
        <small>PWR</small>
      </div>
    </Link>
  )
}