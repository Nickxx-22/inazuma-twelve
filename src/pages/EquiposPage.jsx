import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Swords, Users, Loader2, X, MapPin, Shield, Zap, Activity } from 'lucide-react'
import EmptyState from '../components/common/EmptyState'
import styles from './EquiposPage.module.css'

export default function EquiposPage() {
  const [teams, setTeams] = useState([])
  const [allPlayers, setAllPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTeam, setSelectedTeam] = useState(null)

  // Definimos la base de la API para las imágenes
  const API_BASE = 'http://127.0.0.1:5000'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamsRes, playersRes] = await Promise.all([
          fetch(`${API_BASE}/equipos`),
          fetch(`${API_BASE}/jugadores`)
        ])
        
        const teamsData = await teamsRes.json()
        const playersData = await playersRes.json()

        setTeams(teamsData)
        setAllPlayers(playersData)
      } catch (err) {
        console.error("Error en la API:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Función para abrir el equipo con filtrado robusto de IDs (Sincronizado con tu BBDD)
  const handleOpenTeam = (team) => {
    const teamMembers = allPlayers.filter(player => 
      team.player_ids?.some(id => String(id).trim() === String(player._id).trim())
    )
    
    setSelectedTeam({
      ...team,
      fullMembers: teamMembers
    })
  }

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
        {teams.map(team => {
          const membersPreview = allPlayers.filter(p => 
            team.player_ids?.some(id => String(id).trim() === String(p._id).trim())
          )
          
          return (
            <div 
              key={team._id} 
              className={`${styles.card} card-hover`}
              onClick={() => handleOpenTeam(team)}
            >
              <div className={styles.cardHeader} style={{ borderLeft: `4px solid ${team.color_primary || '#3d7eff'}` }}>
                <div className={styles.headerMain}>
                  <img src={`${API_BASE}${team.image?.url}`} alt="" className={styles.teamIcon} />
                  <div>
                    <h3 className={styles.teamName}>{team.name}</h3>
                    <p className={styles.captain}>Plantilla: {team.player_ids?.length || 0} jugadores</p>
                  </div>
                </div>
                <span className={styles.season}>{team.category || "Junior"}</span>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.memberList}>
                  {membersPreview.slice(0, 4).map(m => (
                    <div key={m._id} className={styles.memberChip}>
                      <img src={`${API_BASE}${m.image?.url}`} className={styles.memberAvatarImg} alt="" />
                      <span className={styles.memberNameText}>{m.name.split(' ')[0]}</span>
                    </div>
                  ))}
                  {membersPreview.length > 4 && (
                    <div className={styles.memberMore}>+{membersPreview.length - 4}</div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* --- MODAL DETALLADO DEL EQUIPO --- */}
      {selectedTeam && (
        <div className={styles.modalOverlay} onClick={() => setSelectedTeam(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelectedTeam(null)}>
              <X size={20} />
            </button>

            {/* Cabecera estilizada con Contador */}
            <div 
              className={styles.modalHeaderInfo} 
              style={{ background: `linear-gradient(135deg, ${selectedTeam.color_primary || '#1e293b'}DD, #0f172a)` }}
            >
              <img src={`${API_BASE}${selectedTeam.image?.url}`} className={styles.modalLogo} alt={selectedTeam.name} />
              <div className={styles.modalHeaderText}>
                <h2 className={styles.modalTitle}>{selectedTeam.name}</h2>
                <div className={styles.modalBadges}>
                  <span><Shield size={14}/> {selectedTeam.academy}</span>
                  <span><MapPin size={14}/> {selectedTeam.country || 'Japan'}</span>
                  {/* Contador de jugadores encontrados */}
                  <span className={styles.playerCounter}>
                    <Users size={14} /> {selectedTeam.fullMembers.length} / {selectedTeam.player_ids?.length || 0}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.modalBody}>
              <h4 className={styles.sectionTitle}><Users size={16} /> PLANTILLA DEL EQUIPO</h4>
              
              <div className={styles.fullPlayerList}>
                {selectedTeam.fullMembers && selectedTeam.fullMembers.length > 0 ? (
                  selectedTeam.fullMembers.map((player, index) => (
                    <Link 
                      key={player._id} 
                      to={`/personajes/${player._id}`} 
                      className={styles.playerRow}
                    >
                      <div className={styles.playerMain}>
                        <span className={styles.playerIndex}>{String(index + 1).padStart(2, '0')}</span>
                        
                        <div className={styles.playerThumbWrapper}>
                          <img 
                            src={`${API_BASE}${player.image?.url}`} 
                            className={styles.playerThumb} 
                            alt={player.name}
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/45?text=?' }} 
                          />
                        </div>

                        <div className={styles.playerMeta}>
                          <p className={styles.pName}>{player.name}</p>
                          <p className={styles.pPos}>{player.position || 'Jugador'}</p>
                        </div>
                      </div>

                      <div className={styles.playerStatsSide}>
                        {/* Poder Base desde stats.power */}
                        <div className={styles.playerPowerBadge}>
                          <Zap size={12} fill="#fbbf24" color="#fbbf24" />
                          <span>{player.stats?.power || 0}</span>
                        </div>
                        
                        {/* Tensión desde matchStats.tension */}
                        {player.matchStats && (
                          <div className={styles.playerTensionBadge}>
                            <Activity size={10} />
                            <span>{player.matchStats.tension} TSN</span>
                          </div>
                        )}
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className={styles.noPlayersBox}>
                    <p>No se han encontrado jugadores vinculados a este equipo.</p>
                    <small>ID del equipo buscado: <strong>{selectedTeam._id}</strong></small>
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