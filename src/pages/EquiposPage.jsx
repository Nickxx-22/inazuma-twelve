import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Swords, Users, Loader2, X, MapPin, Shield, Zap, Activity } from 'lucide-react'
import styles from './EquiposPage.module.css'

export default function EquiposPage() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTeam, setSelectedTeam] = useState(null)

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        // Solo necesitamos llamar a /equipos porque ya trae a los jugadores dentro
        const res = await fetch('http://127.0.0.1:5000/equipos')
        const data = await res.json()
        setTeams(data)
      } catch (err) {
        console.error("Error cargando equipos:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchTeams()
  }, [])

  if (loading) return (
    <div className={styles.loadingState}>
      <Loader2 className={styles.spinner} /> 
      <p>Cargando liga Inazuma...</p>
    </div>
  )

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.titleRow}>
          <Swords size={22} style={{ color: 'var(--neon-green)' }} />
          <h1 className={styles.title}>Equipos</h1>
        </div>
        <p className={styles.subtitle}>Base de datos de clubes y selecciones</p>
      </div>

      <div className={styles.grid}>
        {teams.map(team => (
          <div 
            key={team._id} 
            className={`${styles.card} card-hover`}
            onClick={() => setSelectedTeam(team)}
          >
            <div className={styles.cardHeader} style={{ borderLeft: `4px solid ${team.color_primary || '#3d7eff'}` }}>
              <div className={styles.headerMain}>
                <img src={team.image?.url} alt="" className={styles.teamIcon} />
                <div>
                  <h3 className={styles.teamName}>{team.name}</h3>
                  <p className={styles.captain}>Plantilla: {team.players?.length || 0} jugadores</p>
                </div>
              </div>
              <span className={styles.season}>{team.category || "Junior"}</span>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.memberList}>
                {/* Usamos team.players que ya viene del backend */}
                {team.players?.slice(0, 4).map((p, idx) => (
                  <div key={idx} className={styles.memberChip}>
                    <img src={p.image_url} className={styles.memberAvatarImg} alt="" />
                    <span className={styles.memberNameText}>{p.name.split(' ')[0]}</span>
                  </div>
                ))}
                {team.players?.length > 4 && (
                  <div className={styles.memberMore}>+{team.players.length - 4}</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODAL DETALLADO --- */}
      {selectedTeam && (
        <div className={styles.modalOverlay} onClick={() => setSelectedTeam(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelectedTeam(null)}>
              <X size={20} />
            </button>

            <div 
              className={styles.modalHeaderInfo} 
              style={{ background: `linear-gradient(135deg, ${selectedTeam.color_primary || '#1e293b'}DD, #0f172a)` }}
            >
              <img src={selectedTeam.image?.url} className={styles.modalLogo} alt="" />
              <div className={styles.modalHeaderText}>
                <h2 className={styles.modalTitle}>{selectedTeam.name}</h2>
                <div className={styles.modalBadges}>
                  <span><Shield size={14}/> {selectedTeam.academy}</span>
                  <span><MapPin size={14}/> {selectedTeam.country}</span>
                  <span className={styles.countBadge}>{selectedTeam.players?.length || 0} Jugadores</span>
                </div>
              </div>
            </div>

            <div className={styles.modalBody}>
              <h4 className={styles.sectionTitle}><Users size={16} /> PLANTILLA DEL EQUIPO</h4>
              
              <div className={styles.fullPlayerList}>
                {selectedTeam.players && selectedTeam.players.length > 0 ? (
                  selectedTeam.players.map((player, index) => (
                    /* Nota: Como el backend no manda el _id del jugador en el array players, 
                       usamos el player_ids[index] para el link */
                    <Link 
                      key={index} 
                      to={`/personajes/${selectedTeam.player_ids[index]}`} 
                      className={styles.playerRow}
                    >
                      <div className={styles.playerMain}>
                        <span className={styles.playerIndex}>{String(index + 1).padStart(2, '0')}</span>
                        <div className={styles.playerThumbWrapper}>
                          <img 
                            src={player.image_url} 
                            className={styles.playerThumb} 
                            alt={player.name}
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/45?text=?' }} 
                          />
                        </div>
                        <div className={styles.playerMeta}>
                          <p className={styles.pName}>{player.name}</p>
                          <p className={styles.pPos}>{player.element}</p> {/* Mostramos el elemento como posición/info */}
                        </div>
                      </div>

                      <div className={styles.playerStatsSide}>
                        {/* Stamina */}
                        <div className={styles.playerPowerBadge}>
                          <Zap size={12} fill="#fbbf24" color="#fbbf24" />
                          <span>{player.matchStats?.stamina || 0} ST</span>
                        </div>
                        
                        {/* Tensión */}
                        <div className={styles.playerTensionBadge} style={{ color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                          <Activity size={12} />
                          <span>{player.matchStats?.tension || 0} TSN</span>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className={styles.noPlayersBox}>
                    <p>No hay jugadores cargados en este equipo.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}