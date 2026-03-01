import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Zap, Heart, Activity, Play, X, ExternalLink } from 'lucide-react' 
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
  const [character, setCharacter] = useState(null)
  const [techniques, setTechniques] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [selectedTech, setSelectedTech] = useState(null);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false) 
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    async function fetchCharacter() {
      try {
        const res = await fetch(`http://127.0.0.1:5000/jugadores/${id}`)
        if (!res.ok) throw new Error("Error al cargar el jugador")
        const data = await res.json()
        setCharacter(data.character)
        setTechniques(data.techniques)
      } catch (err) { 
        console.error("Error fetch:", err) 
      } finally { 
        setLoading(false) 
      }
    }
    fetchCharacter()
  }, [id])

  const handleLike = () => {
    if (!isLoggedIn) {
      alert("Debes iniciar sesión para añadir a favoritos")
      return
    }
    setIsFavorite(!isFavorite)
  }

  if (loading || !character) return <p className={styles.loading}>Cargando personaje...</p>

  const elColor  = getElementColor(character.element)
  const natColor = getNatureColor(character.nature)

  const radarData = {
    labels: ['Tiro', 'Físico', 'Control', 'Defensa', 'Velocidad', 'Técnica'],
    datasets: [
      {
        label: 'Stats',
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
    scales: { r: { angleLines: { color: 'rgba(255,255,255,0.1)' }, grid: { color: 'rgba(255,255,255,0.1)' }, pointLabels: { color: '#94a3b8', font: { size: 11 } }, ticks: { display: false }, suggestedMin: 0, suggestedMax: 140, }, },
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
        {/* PANEL IZQUIERDO */}
        <aside className={styles.aside}>
          <div className={styles.card}>
            <div className={styles.avatarArea} style={{ background: `linear-gradient(135deg, ${elColor}33, ${natColor}33)` }}>
              <img src={character.image} alt={character.name} className={styles.characterImg} onError={(e) => { e.target.src = "https://via.placeholder.com/400?text=No+Image" }} />
              <div className={styles.topBadges}>
                <span className={styles.badge} style={{ background: natColor }}>{character.nature?.toUpperCase()}</span>
                <span className={styles.badge} style={{ background: 'var(--primary)' }}>{character.position}</span>
              </div>
            </div>
            <div className={styles.cardBody}>
              <h1 className={styles.name}>{character.name}</h1>
              <p className={styles.jaName}>{character.japaneseName}</p>
              <div className={styles.tags}>
                <span className={styles.tag} style={{ background: elColor }}>{character.element}</span>
                <span className={`${styles.tag} ${styles.tagSecondary}`}>{character.role}</span>
                <span className={`${styles.tag} ${styles.tagSecondary}`}>{character.season}</span>
              </div>
              <p className={styles.desc}>{character.description}</p>
              <div className={styles.powerRow}>
                <div className={styles.powerBox}>
                  <span className={styles.powerNum}>{character.power}</span>
                  <small>POTENCIA</small>
                </div>
                <button className={`${styles.iconBtn} ${!isLoggedIn ? styles.disabled : ''} ${isFavorite ? styles.activeLike : ''}`} onClick={handleLike}>
                  <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* PANEL DERECHO */}
        <div className={styles.main}>
          <div className={styles.statsCard}>
            <h2 className={styles.cardTitle}>Estadísticas</h2>
            <div className={styles.radarWrapper}><Radar data={radarData} options={radarOptions} /></div>
            <div className={styles.matchStatsRow}>
              <div className={styles.matchStatCard}><Activity size={16} /> PE: <strong>{character.matchStats?.stamina}</strong></div>
              <div className={styles.matchStatCard}><Zap size={16} /> PT: <strong>{character.matchStats?.tension}</strong></div>
            </div>
            <div className={styles.statsGrid}>
              {statEntries.map(stat => (
                <div key={stat.name} className={styles.statBox}>
                  <div className={styles.statHeader}><span className={styles.statName}>{stat.name}</span><span className={styles.statValue}>{stat.value ?? '—'}</span></div>
                  <div className={styles.statBarBg}><div className={styles.statBar} style={{ width: `${Math.min((stat.value / 150) * 100, 100)}%`, background: elColor }} /></div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.techCard}>
            <div className={styles.techHeader}>
              <Zap size={18} style={{ color: '#ffaa00' }} />
              <h2 className={styles.cardTitle}>Técnicas ({techniques.length})</h2>
            </div>
            <div className={styles.techList}>
              {techniques.map(tech => (
                <div key={tech.id} className={styles.techWrapper}>
                  <div 
                    className={`${styles.techItem} ${tech.videoUrl ? styles.hasVideo : ''}`}
                    onClick={() => tech.videoUrl && setSelectedTech(tech)}
                    title={tech.videoUrl ? 'Haz clic para ver detalles' : ''}
                  >
                    <div className={styles.techMainInfo}>
                      <span className={styles.techName}>{tech.name}</span>
                      <span className={styles.techSub}>{tech.type} | {tech.element}</span>
                    </div>
                    <div className={styles.techRight}>
                      {tech.relation !== 'creador' && <span className={styles.relationTag}>{tech.relation}</span>}
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

      {/* --- MODAL DE DETALLES DE TÉCNICA (Similitud con la imagen) --- */}
      {selectedTech && (
        <div className={styles.modalOverlay} onClick={() => setSelectedTech(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            
            <button className={styles.closeModal} onClick={() => setSelectedTech(null)}>
              <X size={20} />
            </button>

            <div className={styles.modalHeader} style={{ background: `linear-gradient(135deg, ${getElementColor(selectedTech.element)}CC, #1a1a2e)` }}>
              <div className={styles.headerInfo}>
                <span className={styles.techTypeBadge}>
                  {selectedTech.element} | {selectedTech.type.toUpperCase()}
                </span>
                <h2 className={styles.modalTechName}>{selectedTech.name}</h2>
                <p className={styles.modalTechSub}>{selectedTech.japaneseName || 'God Knows • ゴッドノウズ'}</p>
              </div>
              <div className={styles.headerOrb} style={{ background: getElementColor(selectedTech.element), boxShadow: `0 0 30px ${getElementColor(selectedTech.element)}` }}></div>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.videoPlayerContainer}>
                {/* REPRODUCTOR EN BUCLE Y AUTO-PLAY */}
                <video 
                  key={selectedTech.videoUrl} 
                  autoPlay 
                  loop 
                  playsInline 
                  className={styles.modalVideo}
                >
                  <source src={selectedTech.videoUrl} type="video/mp4" />
                  Tu navegador no soporta videos.
                </video>
                <a href={selectedTech.videoUrl} target="_blank" rel="noopener noreferrer" className={styles.externalLink}>
                  <ExternalLink size={12} /> Abrir video en nueva pestaña
                </a>
              </div>

              <div className={styles.modalStatsSection}>
                <h3 className={styles.sectionTitle}><Zap size={16} /> ESTADÍSTICAS</h3>
                <div className={styles.modalStatsGrid}>
                  <div className={styles.modalStatBox}>
                    <span className={styles.modalStatValue}>{selectedTech.finalPower}</span>
                    <span className={styles.modalStatLabel}>POTENCIA</span>
                  </div>
                  <div className={styles.modalStatBox}>
                    <span className={styles.modalStatValue}>{selectedTech.cost?.tension || 0}</span>
                    <span className={styles.modalStatLabel}>TENSIÓN</span>
                  </div>
                </div>
              </div>
              
              <div className={styles.peCostInfo}>
                <Activity size={14} /> Requiere {selectedTech.cost?.stamina || 0} PE de Resistencia
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}