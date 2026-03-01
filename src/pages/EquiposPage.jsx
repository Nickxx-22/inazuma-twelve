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
        // Nos aseguramos de capturar el array correctamente
        setTeams(Array.isArray(data) ? data : (data.teams || []))
      } catch (err) {
        console.error("Error cargando equipos:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchTeams()
  }, [])

  if (loading) return (
    <div className={styles.loadingState}><Loader2 className={styles.spinner} /><p>Cargando liga...</p></div>
  )

  return (
    <div className={styles.page}>
      <div className={styles.grid}>
        {teams.map(team => (
          <div key={team._id} className={styles.card} onClick={() => setSelectedTeam(team)}>
            <div className={styles.cardHeader} style={{ borderLeft: `4px solid ${team.color_primary || '#3d7eff'}` }}>
              <div className={styles.headerMain}>
                <img src={team.image?.url} alt="" className={styles.teamIcon} />
                <div>
                  <h3 className={styles.teamName}>{team.name}</h3>
                  <p className={styles.captain}>{team.players?.length || 0} jugadores</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedTeam && (
        <div className={styles.modalOverlay} onClick={() => setSelectedTeam(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelectedTeam(null)}><X size={20} /></button>

            <div className={styles.modalHeaderInfo} style={{ background: `linear-gradient(135deg, ${selectedTeam.color_primary || '#1e293b'}CC, #0f172a)` }}>
              <img src={selectedTeam.image?.url} className={styles.modalLogo} alt="" />
              <div className={styles.modalHeaderText}>
                <h2 className={styles.modalTitle}>{selectedTeam.name}</h2>
                <div className={styles.modalBadges}>
                  <span><Shield size={14}/> {selectedTeam.academy}</span>
                  <span className={styles.countBadge}><Users size={12} /> {selectedTeam.players?.length || 0} Jugadores</span>
                </div>
              </div>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.fullPlayerList}>
                {selectedTeam.players && selectedTeam.players.length > 0 ? (
                  selectedTeam.players.map((player, index) => (
                    <div key={index} className={styles.playerRow}>
                      <div className={styles.playerMain}>
                        <div className={styles.playerThumbWrapper}>
                          <img src={player.image_url} className={styles.playerThumb} alt={player.name} />
                        </div>
                        <div className={styles.playerMeta}>
                          <p className={styles.pName}>{player.name}</p>
                          <p className={styles.pPos}>{player.element}</p>
                        </div>
                      </div>
                      <div className={styles.playerStatsSide}>
                        <div className={styles.playerPowerBadge}>
                          <Zap size={12} fill="#fbbf24" color="#fbbf24" />
                          <span>{player.matchStats?.stamina || 0}</span>
                        </div>
                        <div className={styles.playerTensionBadge} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#60a5fa', fontWeight: 'bold' }}>
                          <Activity size={12} />
                          <span>{player.matchStats?.tension || 0}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.noPlayersBox}>
                    <p>No se han encontrado jugadores procesados para el equipo {selectedTeam.name}.</p>
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