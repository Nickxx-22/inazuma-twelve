import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, Zap, Swords, Shield, ArrowRight, Star, Loader2, Heart, Activity } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { getAllPlayers } from '../services/playerService'
import SectionHeader from '../components/common/SectionHeader'
import CharacterCard from '../components/players/CharacterCard'
import styles from './HomePage.module.css'

const SECTIONS = [
  { title: 'Jugadores', desc: 'Explora todos los personajes',      href: '/personajes', icon: Users,  color: '#3d7eff', bg: 'rgba(61,126,255,0.1)'  },
  { title: 'Tecnicas',  desc: 'Descubre todas las supertecnicas', href: '/tecnicas',   icon: Zap,    color: '#ff6b35', bg: 'rgba(255,107,53,0.1)'  },
  { title: 'Equipos',   desc: 'Consulta los equipos de cada temp',href: '/equipos',    icon: Swords, color: '#36d399', bg: 'rgba(54,211,153,0.1)'  },
  { title: 'Mi Equipo', desc: 'Crea y guarda tu equipo ideal',     href: '/mi-equipo',  icon: Shield, color: '#f471b5', bg: 'rgba(244,113,181,0.1)' },
]

const SLIDER_IMAGES = [
  'axel.png', 'axel_capucha.png', 'byron_love.gif',
  'inazuma_japon.png', 'shawn_ventisca.gif', 'xavier_descenso.gif',
]

function getStoredSession() {
  try {
    const u = localStorage.getItem('inazuma-user')
    const t = localStorage.getItem('inazuma-token')
    return { user: u ? JSON.parse(u) : null, token: t || null }
  } catch { return { user: null, token: null } }
}

const TYPE_LABELS = { shot: 'TIRO', dribble: 'DRIB', defense: 'DEF', save: 'SAVE' }
const EL_COLORS   = { Fuego: '#ff6b35', Montana: '#a3855c', Aire: '#36d399', Bosque: '#22c55e', Montaña: '#a3855c' }

export default function HomePage() {
  const { user } = useAuth()

  const [favoriteCharacters, setFavoriteCharacters] = useState([])
  const [loadingFavs,        setLoadingFavs]        = useState(true)
  const [favTecnicas,   setFavTecnicas]   = useState([]) 
  const [loadingTecFavs, setLoadingTecFavs] = useState(true)

  // --- NUEVO ESTADO PARA EQUIPOS ---
  const [teams, setTeams] = useState([])

  useEffect(() => {
    let cancelled = false

    async function loadAll() {
      const { user: su, token } = getStoredSession()
      const userId = su?.id || su?._id

      try {
        // Añadimos la carga de equipos a tu Promise.all
        const [allPlayers, allTecnicas, allTeams, userRes] = await Promise.all([
          getAllPlayers(),
          fetch('http://127.0.0.1:5000/tecnicas').then(r => r.json()),
          fetch('http://127.0.0.1:5000/equipos').then(r => r.json()), // Carga de equipos
          userId ? fetch(`http://127.0.0.1:5000/obtener_usuario/${userId}`, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
          }) : Promise.resolve(null)
        ])

        if (cancelled) return

        // Guardamos los equipos
        if (Array.isArray(allTeams)) {
          setTeams(allTeams)
        }

        if (userRes && userRes.ok) {
          const userData = await userRes.json()
          if (userData.usuario) {
            const favIds = userData.usuario.favoritos || []
            setFavoriteCharacters(
              allPlayers.filter(c => favIds.includes(c._id) || favIds.includes(c.id))
            )

            const favTecIds = userData.usuario.favoritos_tecnicas || []
            setFavTecnicas(
              Array.isArray(allTecnicas)
                ? allTecnicas.filter(t => favTecIds.includes(t._id))
                : []
            )
          }
        }
      } catch (err) {
        console.error('Error cargando datos:', err)
      } finally {
        if (!cancelled) {
          setLoadingFavs(false)
          setLoadingTecFavs(false)
        }
      }
    }

    loadAll()
    return () => { cancelled = true }
  }, [user])

  // Duplicamos los equipos para el efecto de scroll infinito
  const sliderTeams = [...teams, ...teams]

  return (
    <div className={styles.page}>

      {/* --- NUEVO: Carrusel de logos de equipos al principio --- */}
      {teams.length > 0 && (
        <div className={styles.teamSliderContainer}>
          <div className={styles.teamSliderTrack} style={{ '--team-count': teams.length }}>
            {sliderTeams.map((team, i) => (
              <div key={i} className={styles.teamSlide}>
                <img 
                  src={team.image?.url} 
                  alt={team.name} 
                  className={styles.teamSlideImg} 
                  title={team.name}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hero */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          <span className="neon-text-blue">Descubre</span> el universo{' '}
          <span className="neon-text-yellow">Inazuma</span>
        </h1>
        <div className={styles.heroActions}>
          <Link to="/personajes" className={styles.btnPrimary}><Users size={16} /> Ver Jugadores</Link>
          <Link to="/mi-equipo"  className={styles.btnSecondary}><Shield size={16} /> Mi Equipo</Link>
        </div>
      </section>

      {/* Carrusel de imágenes (Axel, Shawn, etc) */}
      <div className={styles.sliderContainer}>
        <div className={styles.sliderTrack}>
          {[...SLIDER_IMAGES, ...SLIDER_IMAGES].map((img, i) => (
            <div key={i} className={styles.slide}>
              <img src={img} alt={`Slide ${i}`} />
            </div>
          ))}
        </div>
      </div>

      {/* ... Resto de tu código (Quick Nav, Favoritos, etc) queda igual ... */}
      
      {/* Quick Nav */}
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

      {/* Sección de Jugadores Favoritos */}
      <section className={styles.section}>
        <SectionHeader title="Jugadores Favoritos" subtitle="Tus estrellas personalizadas del campo" href="/personajes" />
        {/* Lógica de carga de favoritos... */}
        {!user ? (
          <div className={styles.placeholder}>
            <Heart size={32} style={{ color: '#ff4d4d' }} />
            <p>Inicia sesion para ver tus favoritos</p>
          </div>
        ) : loadingFavs ? (
          <div className={styles.placeholder}><Loader2 size={32} className={styles.spin} /></div>
        ) : favoriteCharacters.length === 0 ? (
          <div className={styles.placeholder}><Heart size={32} /><p>Aun no tienes favoritos.</p></div>
        ) : (
          <div className={styles.characterGrid}>
            {favoriteCharacters.map(char => <CharacterCard key={char._id || char.id} character={char} />)}
          </div>
        )}
      </section>

      {/* Sección de Tecnicas Favoritas */}
      <section className={styles.section}>
        <SectionHeader title="Tecnicas Favoritas" subtitle="Tus supertecnicas preferidas" href="/tecnicas" />
        {/* Tu mapeo de favTecnicas... */}
        {favTecnicas.length > 0 && (
          <div className={styles.techFavGrid}>
            {favTecnicas.map(tech => (
              <div key={tech._id} className={styles.techFavCard}>
                {/* Contenido de la carta de técnica */}
                <p className={styles.techFavName}>{tech.name}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}