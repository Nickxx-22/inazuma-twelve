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

        <div className={styles.imageArea}>
          <img src={imgUrl(character.image)} alt={character.name} className={styles.characterImage} />
          <div className={styles.overlay} style={{ background: `linear-gradient(135deg, ${elColor}22, ${natColor}22)` }} />
          <span className={styles.natureBadge} style={{ background: natColor }}>{character.nature}</span>
          <div className={styles.positionBadge}>
            {character.positionImg
              ? <img src={imgUrl(character.positionImg)} alt={character.position} className={styles.positionImg} title={character.position} />
              : <span className={styles.positionText}>{character.position}</span>
            }
          </div>
        </div>

        <div className={styles.info}>
          {/* Nombre + PWR en la misma fila */}
          <div className={styles.nameRow}>
            <h3 className={styles.name}>{character.name}</h3>
            <div className={styles.powerBadge}>PWR {character.power}</div>
          </div>

          {/* Fila inferior: role+país izq, elemento+bandera der */}
          <div className={styles.bottomRow}>
            <div className={styles.roleCol}>
              <span className={styles.roleText}>{character.role}</span>
              {character.country && <span className={styles.countryText}>{character.country}</span>}
            </div>
            <div className={styles.iconsRow}>
              {character.elementImg
                ? <img src={imgUrl(character.elementImg)} alt={character.element} className={styles.elementImg} title={character.element} />
                : <div className={styles.elementDot} style={{ background: elColor }}>{character.element.charAt(0)}</div>
              }
              {character.countryImg && (
                <img src={imgUrl(character.countryImg)} alt={character.country || ''} className={styles.flagBadge} title={character.country} />
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}