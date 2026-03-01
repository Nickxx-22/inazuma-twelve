import { Link } from 'react-router-dom'
import { getElementColor, getNatureColor } from '../../utils/colors'
import styles from './CharacterCard.module.css'

/**
 * Tarjeta de personaje (vista grid)
 * Props: character (objeto del personaje)
 */

// ... resto de imports
// ... resto de imports

export default function CharacterCard({ character }) {
  const elColor  = getElementColor(character.element)
  const natColor = getNatureColor(character.nature)

  return (
    <Link to={`/personajes/${character.id}`} className={styles.link}>
      <div className={`${styles.card} card-hover`}>

        {/* CONTENEDOR DE IMAGEN PRINCIPAL */}
        <div className={styles.imageArea}>
          
          {/* La imagen real del personaje (Cuerpo entero si la hay) */}
          <img 
            src={character.image} 
            alt={character.name}
            className={styles.characterImage}
          />
          
          {/* Capa de degradado sutil en los bordes para estilo */}
          <div 
            className={styles.overlay}
            style={{ 
              background: `linear-gradient(135deg, ${elColor}33, ${natColor}33)`
            }}
          />

          {/* Badges superiores (Ajustados para no tapar la cara) */}
          <div className={styles.topBadges}>
            <span className={styles.badge} style={{ background: natColor }}>
              {character.nature}
            </span>
            <span className={`${styles.badge} ${styles.badgePrimary}`}>
              {character.position}
            </span>
          </div>

          {/* SE HA ELIMINADO EL AVATAR CENTRAL CON LA 'B' */}

          {/* Elemento + Power inferiores */}
          <div className={styles.bottomRow}>
            <div className={styles.elementDot} style={{ background: elColor }}>
              {character.element.charAt(0)}
            </div>
            <div className={styles.powerBadge}>PWR {character.power}</div>
          </div>
        </div>

        {/* Info del personaje */}
        <div className={styles.info}>
          <h3 className={styles.name}>{character.name}</h3>
          <p className={styles.jaName}>{character.japaneseName}</p>
          <div className={styles.meta}>
            <span>{character.role}</span>
            <span className={styles.sep}>|</span>
            <span>{character.team}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}