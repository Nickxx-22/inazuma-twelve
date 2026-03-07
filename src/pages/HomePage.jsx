import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, Zap, Shield, Loader2, Heart, Activity, X } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { getAllPlayers } from '../services/playerService'
import { getElementColor } from '../utils/colors'
import SectionHeader from '../components/common/SectionHeader'
import CharacterCard from '../components/players/CharacterCard'
import { BASE_URL, imgUrl } from '../config'
import styles from './HomePage.module.css'

const TYPE_MAP    = { shot: 'Tiro', dribble: 'Regate', defense: 'Defensa', save: 'Parada' }
const TYPE_COLORS = { Tiro: '#ff6b35', Parada: '#3d7eff', Regate: '#36d399', Defensa: '#f471b5' }

// ── Mini card de técnica favorita con modal de vídeo ───────────────
function TechFavCard({ tech }) {
  const [open, setOpen] = useState(false)
  const color        = getElementColor(tech.element)
  const translated   = TYPE_MAP[tech.type] || tech.type
  const typeColor    = TYPE_COLORS[translated] || '#888'
  const powerPct     = Math.min(((tech.basePower || 0) / 120) * 100, 100)

  return (
    <>
      <div className={styles.techFavCard} onClick={() => setOpen(true)}>
        <div className={styles.techFavSide} style={{ background: `linear-gradient(180deg, ${color}, ${typeColor})` }} />
        <div className={styles.techFavHeader}>
          <span className={styles.techFavType} style={{ background: `${typeColor}22`, color: typeColor, borderColor: `${typeColor}44` }}>
            <span className={styles.techFavDot} style={{ background: typeColor }} />
            {translated.toUpperCase()}
          </span>
          <span className={styles.techFavEl} style={{ background: `${color}22`, color }}>{tech.element}</span>
        </div>
        <div className={styles.techFavNames}>
          <h4 className={styles.techFavName}>{tech.name}</h4>
          {tech.japaneseName && <p className={styles.techFavJa}>{tech.japaneseName}</p>}
        </div>
        <div className={styles.techFavBar}>
          <div className={styles.techFavBarMeta}>
            <span className={styles.techFavBarLabel}>POTENCIA</span>
            <span className={styles.techFavBarNum} style={{ color }}>{tech.basePower}</span>
          </div>
          <div className={styles.techFavBarTrack}>
            <div className={styles.techFavBarFill} style={{ width: `${powerPct}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }} />
          </div>
        </div>
      </div>

      {/* Modal con video */}
      {open && (
        <div className={styles.techModalOverlay} onClick={() => setOpen(false)}>
          <div className={styles.techModalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.techModalClose} onClick={() => setOpen(false)}><X size={20} /></button>
            <div className={styles.techModalHeader} style={{ background: `linear-gradient(135deg, ${color}CC 0%, #0f172a 100%)` }}>
              <div className={styles.techModalGlow} style={{ background: color }} />
              <div>
                <span className={styles.techModalType}>{tech.element} · {translated.toUpperCase()}</span>
                <h2 className={styles.techModalTitle}>{tech.name}</h2>
                <p className={styles.techModalSub}>{tech.japaneseName}</p>
              </div>
            </div>
            <div className={styles.techModalBody}>
              {tech.videoUrl ? (
                <div className={styles.techVideoWrap}>
                  <video key={tech.videoUrl} autoPlay loop playsInline className={styles.techVideo}>
                    <source src={imgUrl(tech.videoUrl)} type="video/mp4" />
                  </video>
                </div>
              ) : (
                <div className={styles.techNoVideo}><Zap size={24} /><span>Sin vídeo disponible</span></div>
              )}
              <div className={styles.techModalStats}>
                <div className={styles.techStatBox}>
                  <span className={styles.techStatVal}>{tech.basePower}</span>
                  <span className={styles.techStatLbl}>POTENCIA</span>
                </div>
                <div className={styles.techStatBox}>
                  <span className={styles.techStatVal}>{tech.cost?.tension || 0}</span>
                  <span className={styles.techStatLbl}>TENSIÓN</span>
                </div>
              </div>
              <div className={styles.techModalCost}>
                <Activity size={14} />
                <span>Requiere {tech.cost?.stamina || 0} PE de Resistencia</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

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
        // ✅ Todas las URLs apuntan ahora a tu API en Render
        const [allPlayers, allTecnicas, allTeams, userRes] = await Promise.all([
          getAllPlayers(), // Asegúrate de que esta función también use la URL de Render
          fetch(`${BASE_URL}/tecnicas`).then(r => r.json()),
          fetch(`${BASE_URL}/equipos`).then(r => r.json()), 
          userId ? fetch(`${BASE_URL}/obtener_usuario/${userId}`, {
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
                  src={imgUrl(team.image)} 
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
        {!user ? (
          <div className={styles.placeholder}>
            <Zap size={32} style={{ color: '#ff6b35' }} />
            <p>Inicia sesion para ver tus técnicas favoritas</p>
          </div>
        ) : loadingTecFavs ? (
          <div className={styles.placeholder}><Loader2 size={32} className={styles.spin} /></div>
        ) : favTecnicas.length === 0 ? (
          <div className={styles.placeholder}><Zap size={32} /><p>Aun no tienes tecnicas favoritas.</p></div>
        ) : (
          <div className={styles.techFavGrid}>
            {favTecnicas.map(tech => (
              <TechFavCard key={tech._id} tech={tech} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}