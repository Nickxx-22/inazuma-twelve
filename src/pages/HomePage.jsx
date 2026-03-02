import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, Zap, Swords, Shield, ArrowRight, Star, Loader2, Heart } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { getAllPlayers } from '../services/playerService'
import SectionHeader from '../components/common/SectionHeader'
import CharacterCard from '../components/players/CharacterCard'
import styles from './HomePage.module.css'

const SECTIONS = [
  { title: 'Jugadores',  desc: 'Explora todos los personajes',      href: '/personajes', icon: Users,  color: '#3d7eff', bg: 'rgba(61,126,255,0.1)'  },
  { title: 'Técnicas',   desc: 'Descubre todas las supertécnicas',  href: '/tecnicas',   icon: Zap,    color: '#ff6b35', bg: 'rgba(255,107,53,0.1)'  },
  { title: 'Equipos',    desc: 'Consulta los equipos de cada temp', href: '/equipos',    icon: Swords, color: '#36d399', bg: 'rgba(54,211,153,0.1)'  },
  { title: 'Mi Equipo',  desc: 'Crea y guarda tu equipo ideal',     href: '/mi-equipo',  icon: Shield, color: '#f471b5', bg: 'rgba(244,113,181,0.1)' },
]

// ─── Lista de imágenes en public ─────────────────────────────
// Asegúrate de que los nombres coincidan exactamente con tus archivos
const SLIDER_IMAGES = [
  'axel.png',
  'axel_capucha.png',
  'byron_love.gif',
  'inazuma_japon.png',
  'shawn_ventisca.gif',
  'xavier_descenso.gif',
]

export default function HomePage() {
  const { user } = useAuth()
  const [favoriteCharacters, setFavoriteCharacters] = useState([])
  const [loadingFavs, setLoadingFavs] = useState(true)

  useEffect(() => {
    async function loadFavorites() {
      if (!user) { setLoadingFavs(false); return; }
      try {
        setLoadingFavs(true)
        const userId = user.id || user._id
        const [allPlayers, userRes] = await Promise.all([
          getAllPlayers(),
          fetch(`http://127.0.0.1:5000/obtener_usuario/${userId}`)
        ])
        const userData = await userRes.json()
        if (userRes.ok && userData.usuario?.favoritos) {
          const favIds = userData.usuario.favoritos
          const filtered = allPlayers.filter(char => 
            favIds.includes(char._id) || favIds.includes(char.id)
          )
          setFavoriteCharacters(filtered)
        }
      } catch (err) {
        console.error("Error cargando favoritos:", err)
      } finally {
        setLoadingFavs(false)
      }
    }
    loadFavorites()
  }, [user])

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
          <Link to="/mi-equipo" className={styles.btnSecondary}>
            <Shield size={16} /> Mi Equipo
          </Link>
        </div>
      </section>

      {/* ── Carrusel Infinito ──────────────────────────────────── */}
      <div className={styles.sliderContainer}>
        <div className={styles.sliderTrack}>
          {/* Duplicamos las imágenes para que el scroll sea infinito */}
          {[...SLIDER_IMAGES, ...SLIDER_IMAGES].map((img, index) => (
            <div key={index} className={styles.slide}>
              <img src={img} alt={`Slide ${index}`} />
            </div>
          ))}
        </div>
      </div>

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

      {/* ── Jugadores Favoritos ────────────────────────────────── */}
      <section className={styles.section}>
        <SectionHeader
          title="Jugadores Favoritos"
          subtitle="Tus estrellas personalizadas del campo"
          href="/personajes"
        />

        {!user ? (
          <div className={styles.placeholder}>
            <Heart size={32} style={{ color: '#ff4d4d' }} />
            <p>Inicia sesión para ver tus favoritos</p>
          </div>
        ) : loadingFavs ? (
          <div className={styles.placeholder}>
            <Loader2 size={32} className={styles.spin} />
          </div>
        ) : favoriteCharacters.length === 0 ? (
          <div className={styles.placeholder}>
            <Heart size={32} />
            <p>Aún no tienes favoritos. ¡Añade algunos!</p>
          </div>
        ) : (
          <div className={styles.characterGrid}>
            {favoriteCharacters.map(char => (
              <CharacterCard key={char._id || char.id} character={char} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}