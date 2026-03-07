import { Link } from 'react-router-dom'
import { getElementColor, getNatureColor } from '../../utils/colors'
import { imgUrl } from '../../config'
import styles from './CharacterCard.module.css'

export default function CharacterCard({ character }) {
  const elColor  = getElementColor(character.element)
  const natColor = getNatureColor(character.nature)

  return (
    <Link to={`/personajes/${character.id}`} className={styles.link}>
      <div className={`${styles.card} card-hover`}>

        {/* IMAGEN */}
        <div className={styles.imageArea}>
          <img src={imgUrl(character.image)} alt={character.name} className={styles.characterImage} />
          <div className={styles.overlay} style={{ background: `linear-gradient(135deg, ${elColor}22, ${natColor}22)` }} />

          <div className={styles.topBadges}>
            <span className={styles.badge} style={{ background: natColor }}>
              {character.nature}
            </span>
            {character.positionImg
              ? <img src={imgUrl(character.positionImg)} alt={character.position} className={styles.positionImg} title={character.position} />
              : <span className={`${styles.badge} ${styles.badgePrimary}`}>{character.position}</span>
            }
          </div>
        </div>

        {/* Info */}
        <div className={styles.info}>
          <h3 className={styles.name}>{character.name}</h3>
          <p className={styles.jaName}>{character.japaneseName}</p>

          <div className={styles.bottomMeta}>
            <div className={styles.metaLeft}>
              <span>{character.role}</span>
              {character.country && (
                <>
                  <span className={styles.sep}>|</span>
                  <span className={styles.countryText}>{character.country}</span>
                </>
              )}
            </div>
            <div className={styles.metaRight}>
              {character.elementImg
                ? <img src={imgUrl(character.elementImg)} alt={character.element} className={styles.elementImg} title={character.element} />
                : <div className={styles.elementDot} style={{ background: elColor }}>{character.element.charAt(0)}</div>
              }
              {character.countryImg && (
                <img src={imgUrl(character.countryImg)} alt={character.country || ''} className={styles.flagBadge} title={character.country} />
              )}
              <div className={styles.powerBadge}>PWR {character.power}</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}