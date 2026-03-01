import { Link } from 'react-router-dom'
import { Users, Zap, Swords, Shield, ArrowRight, Star, TrendingUp } from 'lucide-react'
import SectionHeader from '../components/common/SectionHeader'
import CharacterCard from '../components/players/CharacterCard'
import styles from './HomePage.module.css'

// ─── Datos de navegación de sección ─────────────────────────────
const SECTIONS = [
  { title: 'Jugadores',  desc: 'Explora todos los personajes',      href: '/personajes', icon: Users,  color: '#3d7eff', bg: 'rgba(61,126,255,0.1)'  },
  { title: 'Técnicas',   desc: 'Descubre todas las supertécnicas',  href: '/tecnicas',   icon: Zap,    color: '#ff6b35', bg: 'rgba(255,107,53,0.1)'  },
  { title: 'Equipos',    desc: 'Consulta los equipos de cada temp', href: '/equipos',    icon: Swords, color: '#36d399', bg: 'rgba(54,211,153,0.1)'  },
  { title: 'Mi Equipo',  desc: 'Crea y guarda tu equipo ideal',     href: '/mi-equipo',  icon: Shield, color: '#f471b5', bg: 'rgba(244,113,181,0.1)' },
]

export default function HomePage() {
  // TODO: Reemplaza estos arrays con datos reales de tu API
  // Ejemplo: const { data: featuredCharacters } = useFeaturedCharacters()
  const featuredCharacters = []  // <- aquí irán los personajes destacados
  const topTechniques      = []  // <- aquí irán las técnicas top

  return (
    <div className={styles.page}>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroBadge}>
          <Star size={14} /> Base de Datos Inazuma Eleven
        </div>
        <h1 className={styles.heroTitle}>
          <span className="neon-text-blue">Descubre</span> el universo{' '}
          <span className="neon-text-orange">Inazuma</span>
        </h1>
        <p className={styles.heroSub}>
          Explora personajes, técnicas y equipos. Crea tu equipo ideal y domina el campo de juego.
        </p>
        <div className={styles.heroActions}>
          <Link to="/personajes" className={styles.btnPrimary}>
            <Users size={16} /> Ver Jugadores
          </Link>
          <Link to="/tecnicas" className={styles.btnSecondary}>
            <Zap size={16} /> Ver Técnicas
          </Link>
        </div>
      </section>

      {/* ── Quick Nav ───────────────────────────────────────────── */}
      <section className={styles.quickNav}>
        {SECTIONS.map(({ title, desc, href, icon: Icon, color, bg }) => (
          <Link key={href} to={href} className={`${styles.navCard} card-hover`}>
            <div className={styles.navIcon} style={{ background: bg }}>
              <Icon size={20} style={{ color }} />
            </div>
            <h3 className={styles.navTitle}>{title}</h3>
            <p className={styles.navDesc}>{desc}</p>
            <span className={styles.navExplore} style={{ color }}>
              Explorar <ArrowRight size={12} />
            </span>
          </Link>
        ))}
      </section>

      {/* ── Personajes Destacados ──────────────────────────────── */}
      <section className={styles.section}>
        <SectionHeader
          title="Jugadores Destacados"
          subtitle="Los mejores del universo Inazuma"
          href="/personajes"
        />
        {featuredCharacters.length === 0 ? (
          <div className={styles.placeholder}>
            <Users size={32} />
            <p>Los personajes aparecerán aquí cuando conectes tu API</p>
          </div>
        ) : (
          <div className={styles.characterGrid}>
            {featuredCharacters.map(char => (
              <CharacterCard key={char.id} character={char} />
            ))}
          </div>
        )}
      </section>

      {/* ── Técnicas Top ──────────────────────────────────────── */}
      <section className={styles.section}>
        <SectionHeader
          title="Técnicas Más Poderosas"
          subtitle="Las supertécnicas con mayor poder"
          href="/tecnicas"
        />
        {topTechniques.length === 0 ? (
          <div className={styles.placeholder}>
            <Zap size={32} />
            <p>Las técnicas aparecerán aquí cuando conectes tu API</p>
          </div>
        ) : (
          <div className={styles.techGrid}>
            {topTechniques.map((tech, i) => (
              <Link key={tech.id} to="/tecnicas" className={`${styles.techCard} card-hover`}>
                <div className={styles.techRank}>{i + 1}</div>
                <div className={styles.techInfo}>
                  <span className={styles.techName}>{tech.name}</span>
                  <span className={styles.techSub}>{tech.type} - {tech.element}</span>
                </div>
                <div className={styles.techPower}>
                  <TrendingUp size={14} /> {tech.basePower}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

    </div>
  )
}
