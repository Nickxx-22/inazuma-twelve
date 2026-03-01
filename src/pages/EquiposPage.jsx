import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Swords, Users, Loader2, X, MapPin, Shield, Zap } from 'lucide-react'
import EmptyState from '../components/common/EmptyState'
import styles from './EquiposPage.module.css'

export default function EquiposPage() {
  const [teams, setTeams] = useState([])
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTeam, setSelectedTeam] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamsRes, playersRes] = await Promise.all([
          fetch('http://127.0.0.1:5000/equipos'),
          fetch('http://127.0.0.1:5000/jugadores')
        ])
        const teamsData = await teamsRes.json()
        const playersData = await playersRes.json()
        setTeams(teamsData)
        setPlayers(playersData)
      } catch (err) {
        console.error("Error cargando datos:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleOpenTeam = (team, members) => {
    setSelectedTeam({ ...team, fullMembers: members })
  }

  if (loading) return (
    <div className={styles.loadingState}>
      <Loader2 className={styles.spinner} /> 
      <p>Cargando liga...</p>
    </div>
  )

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.titleRow}>
          <Swords size={22} style={{ color: 'var(--neon-green)' }} />
          <h1 className={styles.title}>Equipos</h1>
        </div>
        <p className={styles.subtitle}>Todos los equipos del universo Inazuma Eleven</p>
      </div>

      {teams.length === 0 ? (
        <EmptyState icon={Swords} title="Sin equipos" description="No se han encontrado equipos" />
      ) : (
        <div className={styles.grid}>
          {teams.map(team => {
            const members = players.filter(p => team.player_ids?.includes(p._id))
            const captain = members.find(m => m._id === team.player_ids?.[0])?.name || "No asignado"

            return (
              <div 
                key={team._id} 
                className={`${styles.card} card-hover`}
                onClick={() => handleOpenTeam(team, members)}
              >
                <div className={styles.cardHeader} style={{ borderLeft: `4px solid ${team.color_primary || 'var(--primary)'}` }}>
                  <div className={styles.headerMain}>
                    <img src={team.image?.url} alt="" className={styles.teamIcon} />
                    <div>
                      <h3 className={styles.teamName}>{team.name}</h3>
                      <p className={styles.captain}>Capitán: {captain}</p>
                    </div>
                  </div>
                  <span className={styles.season}>{team.category || "Junior"}</span>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.membersLabel}>
                    <Users size={12} /> {team.player_ids?.length || 0} miembros
                  </div>
                  <div className={styles.memberList}>
                    {members.slice(0, 5).map(m => (
                      <Link 
                        key={m._id} 
                        to={`/personajes/${m._id}`} 
                        className={styles.memberChip}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {m.image?.url ? (
                          <img src={m.image.url} className={styles.memberAvatarImg} alt="" />
                        ) : (
                          <div className={styles.memberAvatar}>{m.name.charAt(0)}</div>
                        )}
                        <span className={styles.memberNameText}>{m.name}</span>
                      </Link>
                    ))}
                    {members.length > 5 && (
                      <div className={styles.memberMore}>+{members.length - 5}</div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* --- MODAL DETALLADO DEL EQUIPO --- */}
      {selectedTeam && (
        <div className={styles.modalOverlay} onClick={() => setSelectedTeam(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelectedTeam(null)}>
              <X size={20} />
            </button>

            {/* Cabecera con el color del equipo */}
            <div className={styles.modalHeaderInfo} style={{ background: `linear-gradient(135deg, ${selectedTeam.color_primary}DD, #0f172a)` }}>
              <img src={selectedTeam.image?.url} className={styles.modalLogo} alt={selectedTeam.name} />
              <div>
                <h2 className={styles.modalTitle}>{selectedTeam.name}</h2>
                <div className={styles.modalBadges}>
                  <span><Shield size={14}/> {selectedTeam.academy}</span>
                  <span><MapPin size={14}/> {selectedTeam.country}</span>
                </div>
              </div>
            </div>

            <div className={styles.modalBody}>
              <h4 className={styles.sectionTitle}><Users size={16} /> PLANTILLA DEL EQUIPO</h4>
              
              <div className={styles.fullPlayerList}>
                {selectedTeam.fullMembers.map((player, index) => (
                  <Link 
                    key={player._id} 
                    to={`/personajes/${player._id}`} 
                    className={styles.playerRow}
                  >
                    <div className={styles.playerMain}>
                      <span className={styles.playerIndex}>{String(index + 1).padStart(2, '0')}</span>
                      
                      {/* Contenedor de la imagen del jugador */}
                      <div className={styles.playerThumbContainer}>
                        <img 
                          src={player.image?.url} 
                          className={styles.playerThumb} 
                          alt={player.name}
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/40?text=?' }} 
                        />
                      </div>

                      <div className={styles.playerMeta}>
                        <p className={styles.pName}>{player.name}</p>
                        <p className={styles.pPos}>{player.position || 'Jugador'}</p>
                      </div>
                    </div>

                    <div className={styles.playerPowerBadge}>
                      <Zap size={12} fill="#fbbf24" />
                      <span>{player.basePower || 0}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}