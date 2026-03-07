import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, Loader2, X, Shield, Zap, Activity, ChevronRight, MapPin, Trophy } from 'lucide-react'
import styles from './EquiposPage.module.css'

const SEASON_COLORS = { IE1: '#36d399', IE2: '#3d7eff', IE3: '#f471b5' }

export default function EquiposPage() {
  const [teams, setTeams]             = useState([])
  const [loading, setLoading]         = useState(true)
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [seasonFilter, setSeasonFilter] = useState('')

  // Duplicate teams for infinite scroll
  const sliderTeams = teams.length > 0 ? [...teams, ...teams] : []

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res  = await fetch('https://api-inazuma.onrender.com/equipos')
        const data = await res.json()
        setTeams(Array.isArray(data) ? data : (data.teams || []))
      } catch (err) {
        console.error('Error cargando equipos:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTeams()
  }, [])

  const allSeasons = [...new Set(teams.flatMap(t => t.seasons || []))].sort()
  const filtered = seasonFilter ? teams.filter(t => (t.seasons || []).includes(seasonFilter)) : teams

  if (loading) return (
    <div className={styles.loadingState}>
      <Loader2 className={styles.spinner} />
      <p>Cargando liga...</p>
    </div>
  )

  return (
    <div className={styles.page}>

      {/* Header de página */}
      <div className={styles.pageHeader}>
        <div className={styles.titleRow}>
          <div className={styles.titleIcon}><Trophy size={20} /></div>
          <div>
            <h1 className={styles.title}>Equipos</h1>
            <p className={styles.subtitle}>
              Todos los equipos del universo Inazuma Eleven
              <span className={styles.countBadge}>{teams.length} equipos</span>
            </p>
          </div>
        </div>

        {/* Filtro rápido por temporada */}
        {allSeasons.length > 0 && (
          <div className={styles.seasonTabs}>
            <button
              className={`${styles.seasonTab} ${!seasonFilter ? styles.seasonTabActive : ''}`}
              onClick={() => setSeasonFilter('')}
            >
              Todos
            </button>
            {allSeasons.map(s => (
              <button
                key={s}
                className={`${styles.seasonTab} ${seasonFilter === s ? styles.seasonTabActive : ''}`}
                onClick={() => setSeasonFilter(s)}
                style={seasonFilter === s ? { borderColor: SEASON_COLORS[s], color: SEASON_COLORS[s], background: `${SEASON_COLORS[s]}18` } : {}}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid de equipos */}
      <div className={styles.grid}>
        {filtered.map(team => (
          <div
            key={team._id}
            className={styles.card}
            onClick={() => setSelectedTeam(team)}
            style={{ '--team-color': team.color_primary || '#3d7eff' }}
          >
            {/* Background image del equipo */}
            <div
              className={styles.cardBgImage}
              style={{ backgroundImage: `url(${team.image?.url})` }}
            />
            {/* Overlay de color */}
            <div className={styles.cardOverlay} style={{ background: `linear-gradient(to top, ${team.color_primary || '#0a0e16'}ee 0%, ${team.color_primary || '#0a0e16'}88 50%, transparent 100%)` }} />

            <div className={styles.cardBody}>
              <div className={styles.cardInfo}>
                <h3 className={styles.teamName}>{team.name}</h3>
                {team.academy && (
                  <p className={styles.teamAcademy}>
                    <Shield size={11} /> {team.academy}
                  </p>
                )}
                {team.country && (
                  <p className={styles.teamCountry}>
                    <MapPin size={11} /> {team.country}
                  </p>
                )}
              </div>

              {/* Footer de la card */}
              <div className={styles.cardFooter}>
                <div className={styles.cardMeta}>
                  <span className={styles.metaChip}>
                    <Users size={11} /> {team.players?.length || 0}
                  </span>
                  {(team.seasons || []).map(s => (
                    <span key={s} className={styles.seasonChip} style={{ color: SEASON_COLORS[s] || '#888', borderColor: `${SEASON_COLORS[s] || '#888'}44`, background: `${SEASON_COLORS[s] || '#888'}12` }}>
                      {s}
                    </span>
                  ))}
                </div>
                <ChevronRight size={16} className={styles.cardArrow} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal detallado */}
      {selectedTeam && (
        <div className={styles.modalOverlay} onClick={() => setSelectedTeam(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelectedTeam(null)}><X size={18} /></button>

            {/* Header del modal con gradiente del color del equipo */}
            <div
              className={styles.modalHeader}
              style={{ background: `linear-gradient(135deg, ${selectedTeam.color_primary || '#1e293b'}DD 0%, #0a0e16 100%)` }}
            >
              <div className={styles.modalHeaderGlow} style={{ background: selectedTeam.color_primary || '#3d7eff' }} />
              <div className={styles.modalLogoWrap}>
                <img src={selectedTeam.image?.url} className={styles.modalLogo} alt={selectedTeam.name} />
              </div>
              <div className={styles.modalHeaderText}>
                <div className={styles.modalSeasons}>
                  {(selectedTeam.seasons || []).map(s => (
                    <span key={s} className={styles.modalSeasonBadge} style={{ background: `${SEASON_COLORS[s] || '#888'}22`, color: SEASON_COLORS[s] || '#888', borderColor: `${SEASON_COLORS[s] || '#888'}44` }}>
                      {s}
                    </span>
                  ))}
                </div>
                <h2 className={styles.modalTitle}>{selectedTeam.name}</h2>
                <div className={styles.modalSubInfo}>
                  {selectedTeam.academy && <span><Shield size={13} /> {selectedTeam.academy}</span>}
                  {selectedTeam.country && <span><MapPin size={13} /> {selectedTeam.country}</span>}
                  <span><Users size={13} /> {selectedTeam.players?.length || 0} jugadores</span>
                </div>
              </div>
            </div>

            {/* Lista de jugadores */}
            <div className={styles.modalBody}>
              <p className={styles.playerListTitle}>
                <Zap size={13} style={{ color: '#ffaa00' }} /> PLANTILLA
              </p>
              <div className={styles.playerList}>
                {selectedTeam.players && selectedTeam.players.length > 0 ? (
                  selectedTeam.players.map((player) => (
                    <Link
                      key={player.id}
                      to={`/personajes/${player.id}`}
                      className={styles.playerRow}
                      onClick={() => setSelectedTeam(null)}
                    >
                      <span className={styles.playerNum}>
                        {player.number ? String(player.number).padStart(2, '0') : '??'}
                      </span>
                      <div className={styles.playerThumbWrap}>
                        <img src={player.image_url} className={styles.playerThumb} alt={player.name} />
                      </div>
                      <div className={styles.playerInfo}>
                        <p className={styles.pName}>{player.name}</p>
                        <p className={styles.pSub}>{player.element} · {player.position}</p>
                      </div>
                      <div className={styles.playerStats}>
                        <span className={styles.staminaStat}>
                          <Activity size={11} /> {player.matchStats?.stamina || 0}
                        </span>
                        <span className={styles.tensionStat}>
                          <Zap size={11} /> {player.matchStats?.tension || 0}
                        </span>
                      </div>
                      <ChevronRight size={14} className={styles.rowArrow} />
                    </Link>
                  ))
                ) : (
                  <div className={styles.emptyPlayers}>
                    <p>No hay jugadores registrados para este equipo.</p>
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