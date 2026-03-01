import { Link } from 'react-router-dom'
import { Swords, Users } from 'lucide-react'
import EmptyState from '../components/common/EmptyState'
import styles from './EquiposPage.module.css'

export default function EquiposPage() {
  // TODO: Reemplaza con tu fetch/hook
  // Ejemplo: const { data: teams = [] } = useTeams()
  const teams      = []   // <- equipos de la API
  const characters = []   // <- personajes (para lookup de miembros)

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
        ? <EmptyState icon={Swords} title="Sin equipos" description="Los equipos aparecerán aquí cuando conectes tu API" />
        : (
          <div className={styles.grid}>
            {teams.map(team => {
              const members = characters.filter(c => team.members?.includes(c.id))
              return (
                <div key={team.id} className={`${styles.card} card-hover`}>
                  <div className={styles.cardHeader}>
                    <div>
                      <h3 className={styles.teamName}>{team.name}</h3>
                      <p className={styles.captain}>Capitán: {team.captain}</p>
                    </div>
                    <span className={styles.season}>{team.season}</span>
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.membersLabel}>
                      <Users size={12} /> {members.length} miembros registrados
                    </div>
                    <div className={styles.memberList}>
                      {members.slice(0, 5).map(m => (
                        <Link key={m.id} to={`/personajes/${m.id}`} className={styles.memberChip}>
                          <div className={styles.memberAvatar}>{m.name.charAt(0)}</div>
                          {m.name}
                        </Link>
                      ))}
                      {members.length > 5 && (
                        <span className={styles.memberMore}>+{members.length - 5} más</span>
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
