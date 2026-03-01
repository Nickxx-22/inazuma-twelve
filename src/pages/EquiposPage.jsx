import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Swords, Users, Loader2, X, MapPin, Shield, Zap } from 'lucide-react'
import EmptyState from '../components/common/EmptyState'
import styles from './EquiposPage.module.css'

export default function EquiposPage() {
  const [teams, setTeams] = useState([])
  const [allPlayers, setAllPlayers] = useState([]) // Todos los jugadores de la DB
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

        console.log("Equipos cargados:", teamsData)
        console.log("Jugadores cargados:", playersData)

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

  // Función para abrir el equipo y filtrar sus jugadores
  const handleOpenTeam = (team) => {
    // IMPORTANTE: Buscamos qué jugadores de 'allPlayers' están en la lista 'player_ids' del equipo
    const teamMembers = allPlayers.filter(p => 
      team.player_ids && team.player_ids.includes(p._id)
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
          // Filtrado rápido para la previsualización de la tarjeta (chips)
          const membersPreview = allPlayers.filter(p => team.player_ids?.includes(p._id))
          
          return (
            <div 
              key={team._id} 
              className={`${styles.card} card-hover`}
              onClick={() => handleOpenTeam(team)}
            >
              <div className={styles.cardHeader} style={{ borderLeft: `4px solid ${team.color_primary || '#3d7eff'}` }}>
                <div className={styles.headerMain}>
                  <img src={team.image?.url} alt="" className={styles.teamIcon} />
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
                      <img src={m.image?.url} className={styles.memberAvatarImg} alt="" />
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

      {/* --- MODAL CON LA LISTA DE JUGADORES (CORREGIDO) --- */}
      {selectedTeam && (
        <div className={styles.modalOverlay} onClick={() => setSelectedTeam(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelectedTeam(null)}><X size={20} /></button>

            <div className={styles.modalHeaderInfo} style={{ backgroundColor: selectedTeam.color_primary || '#1e293b' }}>
              <img src={selectedTeam.image?.url} className={styles.modalLogo} alt="" />
              <div className={styles.modalHeaderText}>
                <h2 className={styles.modalTitle}>{selectedTeam.name}</h2>
                <p className={styles.modalSub}>{selectedTeam.academy}</p>
              </div>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.fullPlayerList}>
                {selectedTeam.fullMembers.length > 0 ? (
                  selectedTeam.fullMembers.map((player, index) => (
                    <Link key={player._id} to={`/personajes/${player._id}`} className={styles.playerRow}>
                      <div className={styles.playerMain}>
                        <span className={styles.playerIndex}>{index + 1}</span>
                        <div className={styles.playerThumbWrapper}>
                          <img src={player.image?.url} className={styles.playerThumb} alt={player.name} />
                        </div>
                        <div>
                          <p className={styles.pName}>{player.name}</p>
                          <p className={styles.pPos}>{player.position || 'Jugador'}</p>
                        </div>
                      </div>
                      <div className={styles.playerPower}>
                        <Zap size={12} /> {player.basePower || 0}
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className={styles.noPlayers}>No hay datos de jugadores para este equipo.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}