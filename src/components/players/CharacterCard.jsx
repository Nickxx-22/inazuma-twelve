import { Link } from 'react-router-dom'
import { getElementColor, getNatureColor } from '../../utils/colors'
import styles from './CharacterCard.module.css'

export default function CharacterCard({ character }) {
  const elColor  = getElementColor(character.element)
  const natColor = getNatureColor(character.nature)

  return (
    <Link to={`/personajes/${character.id}`} className={styles.link}>
      <div className={`${styles.card} card-hover`}>

        {/* CONTENEDOR DE IMAGEN PRINCIPAL */}
        <div className={styles.imageArea}>

          <img
            src={character.image}
            alt={character.name}
            className={styles.characterImage}
          />

          <div
            className={styles.overlay}
            style={{ background: `linear-gradient(135deg, ${elColor}33, ${natColor}33)` }}
          />

          {/* Badges superiores */}
          <div className={styles.topBadges}>
            <span className={styles.badge} style={{ background: natColor }}>
              {character.nature}
            </span>
            <span className={`${styles.badge} ${styles.badgePrimary}`}>
              {character.position}
            </span>
          </div>

          {/* Elemento + Power + Bandera inferiores */}
          <div className={styles.bottomRow}>
            <div className={styles.elementDot} style={{ background: elColor }}>
              {character.element.charAt(0)}
            </div>

            {/* Bandera del país (si existe) */}
            {character.countryImg && (
              <img
                src={character.countryImg}
                alt={character.country || ''}
                className={styles.flagBadge}
                title={character.country}
              />
            )}

            <div className={styles.powerBadge}>PWR {character.power}</div>
          </div>
        </div>

        {/* Info del personaje */}
        <div className={styles.info}>
          <h3 className={styles.name}>{character.name}</h3>
          <p className={styles.jaName}>{character.japaneseName}</p>
          <div className={styles.meta}>
            <span>{character.role}</span>
            {character.country && (
              <>
                <span className={styles.sep}>|</span>
                <span className={styles.countryText}>{character.country}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}