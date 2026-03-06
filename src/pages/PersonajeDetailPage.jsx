import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Zap, Heart, Activity, Play, X, ExternalLink, Loader2 } from 'lucide-react' 
import { useAuth } from '../hooks/useAuth' // Importamos tu hook de auth
import { getElementColor, getNatureColor } from '../utils/colors'
import styles from './PersonajeDetailPage.module.css'

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function PersonajeDetailPage() {
  const { id } = useParams()
  const { user } = useAuth() // Obtenemos el usuario global
  const [character, setCharacter] = useState(null)
  const [techniques, setTechniques] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTech, setSelectedTech] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLiking, setIsLiking] = useState(false)

  // 1. Cargar datos del personaje y verificar si es favorito
  useEffect(() => {
    async function fetchCharacter() {
      try {
        const res = await fetch(`http://127.0.0.1:5000/jugadores/${id}`)
        if (!res.ok) throw new Error("Error al cargar el jugador")
        const data = await res.json()
        
        setCharacter(data.character)
        setTechniques(data.techniques)

        // Verificamos si ya es favorito en los datos del usuario
        if (user && data.character) {
            const userId = user.id || user._id;
            const userRes = await fetch(`http://127.0.0.1:5000/obtener_usuario/${userId}`);
            const userData = await userRes.json();
            if (userRes.ok) {
                const favs = userData.usuario.favoritos || [];
                setIsFavorite(favs.includes(id));
            }
        }
      } catch (err) { 
        console.error("Error fetch:", err) 
      } finally { 
        setLoading(false) 
      }
    }
    fetchCharacter()
  }, [id, user])

  // 2. Manejar el click en Favoritos (Toggle)
    const handleLike = async () => {
    if (!user) {
      alert("Debes iniciar sesión para añadir a favoritos")
      return
    }

    const token = localStorage.getItem('inazuma-token');
    const userId = user.id || user._id;
    
    setIsLiking(true);
    try {
      const res = await fetch('http://127.0.0.1:5000/toggle_favorito', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ user_id: userId, personaje_id: id }) // id viene de useParams
      });

      const data = await res.json();

      if (res.ok) {
        // Usamos lo que el servidor nos diga que es la realidad
        setIsFavorite(data.isFavorite);
      } else {
        console.error("Error del servidor:", data.message);
      }
    } catch (err) {
      console.error("Error de red:", err);
    } finally {
      setIsLiking(false);
    }
  }

  if (loading || !character) return (
    <div className={styles.loadingCenter}>
        <Loader2 className={styles.spin} size={40} />
        <p>Buscando en los archivos de la Royal Academy...</p>
    </div>
  )

  const elColor  = getElementColor(character.element)
  const natColor = getNatureColor(character.nature)

  // Configuración del Radar (usando stats del JSON)
  const radarData = {
    labels: ['Tiro', 'Físico', 'Control', 'Defensa', 'Velocidad', 'Técnica'],
    datasets: [
      {
        label: 'Stats Base',
        data: [
          character.stats?.kicking || 0,
          character.stats?.physique || 0,
          character.stats?.control || 0,
          character.stats?.defense || 0,
          character.stats?.agility || 0,
          character.stats?.technique || 0,
        ],
        backgroundColor: `${elColor}44`,
        borderColor: elColor,
        borderWidth: 2,
        pointBackgroundColor: elColor,
      },
    ],
  }

  const radarOptions = {
    scales: { 
        r: { 
            angleLines: { color: 'rgba(255,255,255,0.1)' }, 
            grid: { color: 'rgba(255,255,255,0.1)' }, 
            pointLabels: { color: '#94a3b8', font: { size: 11 } }, 
            ticks: { display: false }, 
            suggestedMin: 0, 
            suggestedMax: 140 
        } 
    },
    plugins: { legend: { display: false } },
  }

  const statEntries = [
    { name: 'Tiro', value: character.stats?.kicking },
    { name: 'Cuerpo', value: character.stats?.physique },
    { name: 'Control', value: character.stats?.control },
    { name: 'Parada', value: character.stats?.pressure },
    { name: 'Velocidad', value: character.stats?.agility },
    { name: 'Técnica', value: character.stats?.technique },
    { name: 'Inteligencia', value: character.stats?.intelligence },
    { name: 'Defensa', value: character.stats?.defense },
    { name: 'Disputa', value: character.stats?.dispute },
  ]

  return (
    <div className={styles.page}>
      <Link to="/personajes" className={styles.back}>
        <ArrowLeft size={15} /> Volver a jugadores
      </Link>

      <div className={styles.layout}>
        {/* PANEL IZQUIERDO: Info Básica */}
        <aside className={styles.aside}>
          <div className={styles.card}>
            <div className={styles.avatarArea} style={{ background: `linear-gradient(135deg, ${elColor}33, ${natColor}33)` }}>
              <img src={character.image} alt={character.name} className={styles.characterImg} />
              {/* Badge naturaleza (izquierda) + badge posición con imagen (derecha) */}
              <div className={styles.topBadges}>
                <span className={styles.badge} style={{ background: natColor }}>
                  {character.nature?.toUpperCase()}
                </span>
                {character.positionImg
                  ? <img src={character.positionImg} alt={character.position} className={styles.positionBadgeImg} title={character.position} />
                  : <span className={styles.badge} style={{ background: 'var(--primary)' }}>{character.position}</span>
                }
              </div>
            </div>

            <div className={styles.cardBody}>
              <h1 className={styles.name}>{character.name}</h1>
              <p className={styles.jaName}>{character.japaneseName}</p>

              {/* Fila de tags: elemento (con img) · rol · país (con bandera) */}
              <div className={styles.tags}>
                {/* Elemento */}
                {character.elementImg
                  ? (
                    <span className={styles.tagElement} style={{ borderColor: `${elColor}55`, background: `${elColor}18` }}>
                      <img src={character.elementImg} alt={character.element} className={styles.tagElementImg} />
                      <span style={{ color: elColor }}>{character.element}</span>
                    </span>
                  ) : (
                    <span className={styles.tag} style={{ background: elColor }}>{character.element}</span>
                  )
                }
                {/* Rol */}
                <span className={`${styles.tag} ${styles.tagSecondary}`}>{character.role}</span>
                {/* País con bandera */}
                {character.country && (
                  <span className={styles.tagCountry}>
                    {character.countryImg && (
                      <img src={character.countryImg} alt={character.country} className={styles.flagImg} />
                    )}
                    {character.country}
                  </span>
                )}
              </div>

              <p className={styles.desc}>{character.description}</p>
              
              <div className={styles.powerRow}>
                <div className={styles.powerBox}>
                  <span className={styles.powerNum}>{character.power}</span>
                  <small>POTENCIA</small>
                </div>
                {/* Botón de Like con feedback de carga */}
                <button 
                    className={`${styles.iconBtn} ${!user ? styles.disabled : ''} ${isFavorite ? styles.activeLike : ''}`} 
                    onClick={handleLike}
                    disabled={isLiking}
                >
                  {isLiking ? <Loader2 size={20} className={styles.spin} /> : <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />}
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* PANEL DERECHO: Stats y Técnicas */}
        <div className={styles.main}>
          <div className={styles.statsCard}>
            <h2 className={styles.cardTitle}>Estadísticas</h2>
            <div className={styles.radarWrapper}><Radar data={radarData} options={radarOptions} /></div>
            
            {/* Pais del jugador */}
            {character.country && (
              <div className={styles.countryRow}>
                {character.countryImg && (
                  <img src={character.countryImg} alt={character.country} className={styles.flagBig} />
                )}
                <span className={styles.countryName}>{character.country}</span>
              </div>
            )}

            {/* Campo matchStats requerido */}
            <div className={styles.matchStatsRow}>
              <div className={styles.matchStatCard}><Activity size={16} /> PE: <strong>{character.matchStats?.stamina || 100}</strong></div>
              <div className={styles.matchStatCard}><Zap size={16} /> PT: <strong>{character.matchStats?.tension || 80}</strong></div>
            </div>

            <div className={styles.statsGrid}>
              {statEntries.map(stat => (
                <div key={stat.name} className={styles.statBox}>
                  <div className={styles.statHeader}>
                    <span className={styles.statName}>{stat.name}</span>
                    <span className={styles.statValue}>{stat.value ?? '—'}</span>
                  </div>
                  <div className={styles.statBarBg}>
                    <div className={styles.statBar} style={{ width: `${Math.min((stat.value / 150) * 100, 100)}%`, background: elColor }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.techCard}>
            <div className={styles.techHeader}>
              <Zap size={18} style={{ color: '#ffaa00' }} />
              <h2 className={styles.cardTitle}>Técnicas Especiales</h2>
            </div>
            <div className={styles.techList}>
              {techniques.map(tech => (
                <div key={tech.id} className={styles.techWrapper}>
                  <div 
                    className={`${styles.techItem} ${tech.videoUrl ? styles.hasVideo : ''}`}
                    onClick={() => tech.videoUrl && setSelectedTech(tech)}
                  >
                    <div className={styles.techMainInfo}>
                      <span className={styles.techName}>{tech.name}</span>
                      <span className={styles.techSub}>{tech.type} | {tech.element}</span>
                    </div>
                    <div className={styles.techRight}>
                      <span className={styles.finalPower}>{tech.finalPower} <small>PWR</small></span>
                      {tech.videoUrl && <Play size={14} className={styles.playIcon} fill="currentColor" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE VIDEO (Igual que antes pero limpio) */}
      {selectedTech && (
        <div className={styles.modalOverlay} onClick={() => setSelectedTech(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeModal} onClick={() => setSelectedTech(null)}><X size={20} /></button>
            <div className={styles.modalHeader} style={{ background: `linear-gradient(135deg, ${getElementColor(selectedTech.element)}CC, #1a1a2e)` }}>
                <h2 className={styles.modalTechName}>{selectedTech.name}</h2>
            </div>
            <div className={styles.modalBody}>
                <video key={selectedTech.videoUrl} autoPlay loop playsInline className={styles.modalVideo}>
                  <source src={selectedTech.videoUrl} type="video/mp4" />
                </video>
                <div className={styles.modalStatsSection}>
                    <div className={styles.modalStatBox}>
                        <span className={styles.modalStatValue}>{selectedTech.finalPower}</span>
                        <span className={styles.modalStatLabel}>POTENCIA TÉCNICA</span>
                    </div>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}