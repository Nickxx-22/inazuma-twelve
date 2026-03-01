import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Swords, Users, Loader2 } from 'lucide-react'
import EmptyState from '../components/common/EmptyState'
import styles from './EquiposPage.module.css'

export default function EquiposPage() {
  const [teams, setTeams] = useState([])
  const [players, setPlayers] = useState([]) // Para el lookup de miembros
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargamos equipos y jugadores en paralelo para que el lookup funcione
        const [teamsRes, playersRes] = await Promise.all([
          fetch('http://127.0.0.1:5000/equipos'),
          fetch('http://127.0.0.1:5000/jugadores')
        ])
        
        const teamsData = await teamsRes.json()
        const playersData = await playersRes.json()
        
        setTeams(teamsData)
        setPlayers(playersData)
      } catch (err) {
        console.error("Error cargando datos de equipos:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return (
    <div className={styles.loadingState}>
      <Loader2 className="animate-spin" /> Cargando liga...
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

      {teams.length === 0
        ? <EmptyState icon={Swords} title="Sin equipos" description="No se han encontrado equipos en la base de datos" />
        : (
          <div className={styles.grid}>
            {teams.map(team => {
              // Buscamos los objetos completos de los jugadores usando player_ids
              const members = players.filter(p => team.player_ids?.includes(p._id))
              // Buscamos al capitán (asumiendo que el primero de la lista suele serlo o basándonos en tu lógica)
              const captain = members.find(m => m._id === team.player_ids[0])?.name || "No asignado"

              return (
                <div key={team._id} className={`${styles.card} card-hover`}>
                  <div className={styles.cardHeader} style={{ borderLeft: `4px solid ${team.color_primary || 'var(--primary)'}` }}>
                    <div className={styles.headerMain}>
                      <img src={team.image?.url} alt="" className={styles.teamIcon} />
                      <div>
                        <h3 className={styles.teamName}>{team.name}</h3>
                        <p className={styles.captain}>Capitán: {captain}</p>
                      </div>
                    </div>
                    <span className={styles.season}>{team.category || team.seasons?.[0]}</span>
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.membersLabel}>
                      <Users size={12} /> {team.player_ids?.length || 0} miembros en plantilla
                    </div>
                    
                    <div className={styles.memberList}>
                      {members.slice(0, 5).map(m => (
                        <Link key={m._id} to={`/personajes/${m._id}`} className={styles.memberChip}>
                          {m.image?.url ? (
                            <img src={m.image.url} className={styles.memberAvatarImg} alt="" />
                          ) : (
                            <div className={styles.memberAvatar}>{m.name.charAt(0)}</div>
                          )}
                          <span className={styles.memberNameText}>{m.name}</span>
                        </Link>
                      ))}
                      
                      {members.length > 5 && (
                        <div className={styles.memberMore}>
                          +{members.length - 5} más
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )
      }
    </div>
  )
}