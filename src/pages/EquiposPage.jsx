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
        const res = await fetch('http://127.0.0.1:5000/equipos')
        const data = await res.json()
        
        // Si tu API devuelve { teams: [...] } en lugar de [...]
        const finalData = Array.isArray(data) ? data : (data.teams || [])
        setTeams(finalData)
      } catch (err) {
        console.error("Error cargando equipos:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchTeams()
  }, [])

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
                <img 
                  src={team.image?.url || team.image} 
                  alt="" 
                  className={styles.teamIcon} 
                  onError={(e) => e.target.src = 'https://via.placeholder.com/50?text=Team'}
                />
                <div>
                  <h3 className={styles.teamName}>{team.name}</h3>
                  <p className={styles.captain}>Plantilla: {team.players?.length || 0} jugadores</p>
                </div>
              </div>
              <span className={styles.season}>{team.category || "Junior"}</span>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.memberList}>
                {team.players?.slice(0, 4).map((p, idx) => (
                  <div key={idx} className={styles.memberChip}>
                    <img src={p.image_url} className={styles.memberAvatarImg} alt="" />
                    <span className={styles.memberNameText}>{p.name?.split(' ')[0]}</span>
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
              style={{ background: `linear-gradient(135deg, ${selectedTeam.color_primary || '#1e293b'}CC, #0f172a)` }}
            >
              <img 
                src={selectedTeam.image?.url || selectedTeam.image} 
                className={styles.modalLogo} 
                alt="" 
                onError={(e) => e.target.src = 'https://via.placeholder.com/80?text=Logo'}
              />
              <div className={styles.modalHeaderText}>
                <h2 className={styles.modalTitle}>{selectedTeam.name}</h2>
                <div className={styles.modalBadges}>
                  <span><Shield size={14}/> {selectedTeam.academy}</span>
                  <span><MapPin size={14}/> {selectedTeam.country || 'Japan'}</span>
                  <span className={styles.countBadge}>
                    <Users size={12} /> {selectedTeam.players?.length || 0} Fichas
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.modalBody}>
              <h4 className={styles.sectionTitle}><Users size={16} /> PLANTILLA DEL EQUIPO</h4>
              
              <div className={styles.fullPlayerList}>
                {selectedTeam.players && selectedTeam.players.length > 0 ? (
                  selectedTeam.players.map((player, index) => (
                    <Link 
                      key={index} 
                      to={`/personajes/${selectedTeam.player_ids ? selectedTeam.player_ids[index] : ''}`} 
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
                          <p className={styles.pPos}>{player.element || 'Jugador'}</p>
                        </div>
                      </div>

                      <div className={styles.playerStatsSide}>
                        {/* Stamina */}
                        <div className={styles.playerPowerBadge}>
                          <Zap size={12} fill="#fbbf24" color="#fbbf24" />
                          <span>{player.matchStats?.stamina || 0}</span>
                        </div>
                        
                        {/* Tensión */}
                        {player.matchStats?.tension && (
                          <div className={styles.playerTensionBadge} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#60a5fa', fontWeight: 'bold', fontSize: '0.85rem' }}>
                            <Activity size={12} />
                            <span>{player.matchStats.tension}</span>
                          </div>
                        )}
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className={styles.noPlayersBox}>
                    <p>No se han encontrado datos en <code>selectedTeam.players</code>.</p>
                    <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Verifica que tu API de Flask esté enviando el array de jugadores correctamente.</p>
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