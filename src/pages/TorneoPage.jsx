import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trophy, Shield, Swords, Play, ChevronRight, Loader2, Star, Target, Zap } from 'lucide-react'
import { BASE_URL, imgUrl } from '../config'
import CuadroBracket from './BracketView'
import styles from './TorneoPage.module.css'

function getStoredSession() {
  try {
    const u = localStorage.getItem('inazuma-user')
    const t = localStorage.getItem('inazuma-token')
    return { user: u ? JSON.parse(u) : null, token: t || null }
  } catch { return { user: null, token: null } }
}

const RONDA_NOMBRES = {
  1: 'Dieciseisavos De Final', 2: 'Octavos De Final',
  3: 'Cuartos De Final', 4: 'Semifinal', 5: 'Final'
}

// ── Evento del partido (feed con línea central) ────────────────
function EventoItem({ evento, nombreLocal, imagenLocal, imagenVisitante }) {
  const [showVideo, setShowVideo] = useState(false)

  const tecVideo = evento.tecnica?.tiro?.video_url
    || evento.tecnica?.parada?.video_url
    || evento.tecnica?.regate?.video_url
    || evento.tecnica?.robo?.video_url

  const iconMap   = { tiro:'⚽', regate:'💨', robo:'🛡️', ocasion:'🎯', penaltis:'🥅' }
  const colorMap  = {
    tiro:    evento.es_gol ? '#36d399' : '#3d7eff',
    regate:  '#f59e0b', robo: '#f471b5', ocasion: '#ff6b35', penaltis: '#a78bfa',
  }
  const color = colorMap[evento.tipo] || '#6b7a9e'

  // ¿Es evento del equipo local (usuario)?
  const esLocal = evento.equipo === nombreLocal
  const imagenEquipo = esLocal ? imagenLocal : imagenVisitante

  return (
    <>
      <div
        className={`${styles.eventoRow} ${esLocal ? styles.eventoLeft : styles.eventoRight}`}
        onClick={() => tecVideo && setShowVideo(true)}
      >
        {/* Lado izquierdo (local) */}
        <div className={`${styles.eventoSide} ${styles.eventoSideLeft}`}>
          {esLocal && (
            <div className={`${styles.eventoCard} ${evento.es_gol ? styles.eventoGol : ''}`}
              style={{ borderColor: color }}>
              {imagenEquipo
                ? <img src={imgUrl(imagenEquipo)} alt="" className={styles.eventoEscudo} />
                : <span className={styles.eventoIcono}>{iconMap[evento.tipo] || '⚡'}</span>
              }
              <p className={styles.eventoDesc}>{evento.descripcion}</p>
              {tecVideo && (
                <button className={styles.eventoVideoBtn} style={{ color }}>
                  <Play size={12} fill="currentColor" /> Ver
                </button>
              )}
            </div>
          )}
        </div>

        {/* Línea central con minuto */}
        <div className={styles.eventoCentro}>
          <span className={styles.eventoMinuto} style={{ color }}>{evento.minuto}'</span>
        </div>

        {/* Lado derecho (visitante) */}
        <div className={`${styles.eventoSide} ${styles.eventoSideRight}`}>
          {!esLocal && (
            <div className={`${styles.eventoCard} ${evento.es_gol ? styles.eventoGol : ''}`}
              style={{ borderColor: color }}>
              {imagenEquipo
                ? <img src={imgUrl(imagenEquipo)} alt="" className={styles.eventoEscudo} />
                : <span className={styles.eventoIcono}>{iconMap[evento.tipo] || '⚡'}</span>
              }
              <p className={styles.eventoDesc}>{evento.descripcion}</p>
              {tecVideo && (
                <button className={styles.eventoVideoBtn} style={{ color }}>
                  <Play size={12} fill="currentColor" /> Ver
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {showVideo && tecVideo && (
        <div className={styles.videoOverlay} onClick={() => setShowVideo(false)}>
          <div className={styles.videoModal} onClick={e => e.stopPropagation()}>
            <button className={styles.videoClose} onClick={() => setShowVideo(false)}>✕</button>
            <p className={styles.videoTitle}>
              {evento.tecnica?.tiro?.nombre || evento.tecnica?.parada?.nombre
               || evento.tecnica?.regate?.nombre || evento.tecnica?.robo?.nombre}
            </p>
            <video autoPlay loop playsInline className={styles.videoPlayer}>
              <source src={imgUrl(tecVideo)} type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </>
  )
}

// ── Card mini de jugador para estadísticas ─────────────────────
function JugadorStatCard({ jugadorId, stat, statLabel, statColor }) {
  const [data, setData] = useState(null)

  useEffect(() => {
    if (!jugadorId) return
    fetch(`${BASE_URL}/jugadores/${jugadorId}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => d && setData(d.character))
      .catch(() => {})
  }, [jugadorId])

  return (
    <div className={styles.jugadorStatCard}>
      <div className={styles.jugadorStatImg}>
        {data?.image
          ? <img src={data.image} alt={data.name} className={styles.jugadorStatAvatar} />
          : <Shield size={22} style={{ color: '#3d7eff', opacity: 0.6 }} />
        }
      </div>
      <div className={styles.jugadorStatInfo}>
        <span className={styles.jugadorStatNombre}>{data?.name || jugadorId}</span>
        <span className={styles.jugadorStatPosicion}>{data?.position || ''}</span>
      </div>
      <div className={styles.jugadorStatValor} style={{ color: statColor }}>
        <span className={styles.jugadorStatNum}>{stat}</span>
        <span className={styles.jugadorStatLbl}>{statLabel}</span>
      </div>
    </div>
  )
}


// ── Card MVP del torneo (estilo PersonajeDetail) ───────────────
function MvpCard({ stats }) {
  const [mvp, setMvp] = useState(null)

  useEffect(() => {
    // El MVP es el máximo goleador del torneo
    const goleadores = stats?.goleadores || []
    if (!goleadores.length) return
    // goleadores viene ordenado de mayor a menor
    const top = goleadores[0]
    if (!top?.nombre) return

    // Buscar por nombre en /jugadores (filtrando por nombre exacto)
    // Primero intentamos con el id si existe, si no buscamos por nombre
    const buscar = async () => {
      try {
        // Intentar con el id directo si stats tiene el id
        if (top.id && !top.id.includes(' ')) {
          const r = await fetch(`${BASE_URL}/jugadores/${top.id}`)
          if (r.ok) { const d = await r.json(); setMvp({ ...d.character, goles: top.goles }); return }
        }
        // Fallback: listar jugadores y filtrar por nombre
        const r = await fetch(`${BASE_URL}/jugadores`)
        if (r.ok) {
          const lista = await r.json()
          const found = lista.find(j => j.name === top.nombre)
          if (found) {
            const r2 = await fetch(`${BASE_URL}/jugadores/${found.id}`)
            if (r2.ok) { const d = await r2.json(); setMvp({ ...d.character, goles: top.goles }) }
          }
        }
      } catch {}
    }
    buscar()
  }, [stats])

  if (!mvp) return null

  return (
    <div className={styles.mvpSection}>
      <h3 className={styles.mvpTitle}>⭐ MVP del Torneo</h3>
      <div className={styles.mvpCard}>
        {/* Imagen del jugador — izquierda */}
        <div className={styles.mvpAvatarWrap}
          style={{ background: `linear-gradient(135deg, rgba(245,158,11,0.25), rgba(10,14,28,0.9))` }}>
          <img
            src={mvp.image}
            alt={mvp.name}
            className={styles.mvpAvatar}
            onError={e => { e.target.style.display = 'none' }}
          />
          {/* Badges encima */}
          <div className={styles.mvpBadges}>
            {mvp.nature && (
              <span className={styles.mvpBadge} style={{ background: '#f59e0b' }}>
                {mvp.nature.toUpperCase()}
              </span>
            )}
            {mvp.positionImg
              ? <img src={mvp.positionImg} alt={mvp.position} className={styles.mvpPosImg} />
              : mvp.position && <span className={styles.mvpBadge} style={{ background:'#3d7eff' }}>{mvp.position}</span>
            }
          </div>
        </div>

        {/* Info derecha */}
        <div className={styles.mvpBody}>
          <div className={styles.mvpName}>{mvp.name}</div>
          {mvp.japaneseName && <div className={styles.mvpJaName}>{mvp.japaneseName}</div>}

          <div className={styles.mvpTags}>
            {mvp.elementImg
              ? <span className={styles.mvpTagEl}>
                  <img src={mvp.elementImg} alt={mvp.element} className={styles.mvpTagElImg} />
                  <span>{mvp.element}</span>
                </span>
              : mvp.element && <span className={styles.mvpTag}>{mvp.element}</span>
            }
            {mvp.role && <span className={styles.mvpTagSec}>{mvp.role}</span>}
          </div>

          {mvp.tier && (
            <div className={styles.mvpTierRow}>
              <span className={styles.mvpTierLabel}>TIER</span>
              <span className={styles.mvpTierBadge} data-tier={mvp.tier}>{mvp.tier}</span>
            </div>
          )}

          {/* Stats del torneo */}
          <div className={styles.mvpStatRow}>
            <div className={styles.mvpStatBox}>
              <span className={styles.mvpStatNum} style={{ color:'#f59e0b' }}>{mvp.goles}</span>
              <small>GOLES</small>
            </div>
            <div className={styles.mvpStatBox}>
              <span className={styles.mvpStatNum}>{mvp.power || mvp.stats?.kicking || '—'}</span>
              <small>POTENCIA</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Stats torneo ───────────────────────────────────────────────
function EstadisticasPanel({ stats }) {
  if (!stats) return null
  return (
    <div className={styles.statsPanel}>
      <h3 className={styles.statsPanelTitle}><Trophy size={16} /> Estadísticas del torneo</h3>
      <div className={styles.statsResumen}>
        {[
          { num: stats.partidos_jugados, lbl: 'Partidos' },
          { num: stats.partidos_ganados, lbl: 'Victorias', color: '#36d399' },
          { num: stats.goles_marcados,   lbl: 'Goles',     color: '#ff6b35' },
          { num: stats.ronda_alcanzada,  lbl: 'Ronda',     color: '#f471b5' },
        ].map(({ num, lbl, color }) => (
          <div key={lbl} className={styles.statsResumenItem}>
            <span className={styles.statsResumenNum} style={color ? { color } : {}}>{num}</span>
            <span className={styles.statsResumenLbl}>{lbl}</span>
          </div>
        ))}
      </div>
      {stats.goleadores?.length > 0 && (
        <div className={styles.statsGroup}>
          <h4 className={styles.statsGroupTitle}><Target size={13} /> Goleadores</h4>
          {stats.goleadores.map((g, i) => (
            <div key={i} className={styles.statsRow}>
              <span className={styles.statsRank}>#{i+1}</span>
              <span className={styles.statsNombre}>{g.nombre}</span>
              <span className={styles.statsVal} style={{ color: '#36d399' }}>{g.goles} goles</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Página principal ───────────────────────────────────────────
export default function TorneoPage() {
  const navigate = useNavigate()
  const { user, token } = getStoredSession()

  const [fase, setFase]         = useState('inicio')
  const [torneo, setTorneo]     = useState(null)
  const [misEquipos, setMisEquipos] = useState({})
  const [equipoSel, setEquipoSel]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const [eventos, setEventos]   = useState([])
  const [marcador, setMarcador] = useState({ local: 0, visitante: 0, nombreLocal: '', nombreVisitante: '', imagenLocal: '', imagenVisitante: '' })
  const [resultado, setResultado] = useState(null)
  const [statsPartido, setStatsPartido] = useState(null)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    async function cargar() {
      try {
        const res  = await fetch(`${BASE_URL}/obtener_usuario/${user.id || user._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        if (res.ok) {
          const eqs = data.usuario?.equipos || {}
          setMisEquipos(eqs)
          const nombres = Object.keys(eqs)
          if (nombres.length > 0) setEquipoSel(nombres[0])
        }
      } catch (e) { console.error(e) }
    }
    cargar()
  }, [])

  async function handleCrearTorneo() {
    if (!equipoSel) { setError('Selecciona un equipo primero'); return }
    setLoading(true); setError('')
    try {
      const res  = await fetch(`${BASE_URL}/torneos/crear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:   JSON.stringify({ nombre_equipo: equipoSel })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setTorneo(data)
      setFase('cuadro')
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  async function handleSimular() {
    setLoading(true); setFase('simulando'); setError('')
    try {
      const res  = await fetch(`${BASE_URL}/torneos/${torneo.torneo_id}/simular`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:   JSON.stringify({ nombre_equipo: equipoSel })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      const ronda_key = `ronda_${torneo.ronda_actual || 1}`
      const enf       = torneo.cuadro?.[ronda_key] || []
      const match     = enf.find(e => e.local?.es_usuario || e.visitante?.es_usuario)
      // ✅ FIX: "local"/"visitante" del cuadro no implica que TU equipo sea el local del
      // enfrentamiento. Identificamos tu equipo y el rival por es_usuario, así el feed
      // siempre pinta a tu equipo a la izquierda sin importar el sorteo del bracket.
      const esUsuarioLocal  = !!match?.local?.es_usuario
      const tuEquipo        = esUsuarioLocal ? match?.local     : match?.visitante
      const rivalReal       = esUsuarioLocal ? match?.visitante : match?.local
      const nombreLocal     = tuEquipo?.nombre  || equipoSel
      const nombreVisitante = rivalReal?.nombre || 'Rival'
      const imagenLocal     = tuEquipo?.imagen  || ''
      const imagenVisitante = rivalReal?.imagen || ''

      setEventos(data.eventos || [])
      setMarcador({
        local: data.goles_local, visitante: data.goles_visitante,
        nombreLocal, nombreVisitante, imagenLocal, imagenVisitante,
      })
      setResultado(data.resultado)
      setStatsPartido(data.estadisticas_partido)
      setTorneo(prev => ({
        ...prev,
        ronda_actual: data.ronda_actual,
        estado:       data.torneo_estado,
        cuadro:       data.cuadro,
        estadisticas: data.estadisticas || prev.estadisticas,
      }))
      setFase(data.torneo_estado === 'finalizado' ? 'finalizado' : 'resultado')
    } catch (e) {
      setError(e.message || 'Error al simular')
      setFase('previo')
    } finally { setLoading(false) }
  }

  async function handleSiguiente() {
    setLoading(true)
    try {
      const res  = await fetch(`${BASE_URL}/torneos/${torneo.torneo_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setTorneo(data)
      setEventos([])
      setFase('cuadro')
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  // ── INICIO ────────────────────────────────────────────────────
  if (fase === 'inicio') return (
    <div className={styles.page}>
      <div className={styles.heroSection}>
        <div className={styles.heroField}>
          <div className={styles.heroSpotlight} />
          <div className={styles.heroSpotlightAlt} />
          <div className={styles.heroFieldLines} />
          <div className={styles.heroCenterCircle} />
          <div className={styles.heroCenterDot} />
          <div className={styles.heroArcLeft} />
          <div className={styles.heroArcRight} />
          <div className={styles.heroVignette} />

          <div className={styles.heroContent}>
            <span className={styles.heroEyebrow}>Temporada en curso · 16 equipos</span>
            <h1 className={styles.heroTitle}>Modo Torneo</h1>
            <p className={styles.heroSub}>Elige tu once titular y abre camino hasta la final</p>
            <div className={styles.heroTrophyGlow}>
              <Trophy size={34} />
            </div>
          </div>
        </div>
      </div>
      {error && <div className={styles.error}>{error}</div>}
      {Object.keys(misEquipos).length === 0 ? (
        <div className={styles.noEquipo}>
          <Shield size={32} />
          <p>No tienes equipos guardados</p>
          <button className={styles.btnPrimary} onClick={() => navigate('/mi-equipo')}>Crear mi equipo</button>
        </div>
      ) : (
        <div className={styles.startCard}>
          <label className={styles.selectLabel}>Elige tu equipo</label>
          <select value={equipoSel} onChange={e => setEquipoSel(e.target.value)} className={styles.equipoSelect}>
            {Object.keys(misEquipos).map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <div className={styles.equipoPreview}>
            <p className={styles.equipoPreviewTitle}>{equipoSel}</p>
            <p className={styles.equipoPreviewSub}>{(misEquipos[equipoSel] || []).filter(Boolean).length} / 11 jugadores</p>
          </div>
          <button className={styles.btnStart} onClick={handleCrearTorneo} disabled={loading}>
            {loading ? <><Loader2 size={18} className={styles.spin} /> Sorteando...</> : <><Trophy size={18} /> Participar en el torneo</>}
          </button>
        </div>
      )}
    </div>
  )

  // ── CUADRO ────────────────────────────────────────────────────
  if (fase === 'cuadro') return (
    <div className={styles.page}>
      <div className={styles.rondaHeader}>
        <span className={styles.rondaBadge}>{RONDA_NOMBRES[torneo.ronda_actual] || `Ronda ${torneo.ronda_actual}`}</span>
        <h2 className={styles.rondaTitle}>Cuadro del Torneo</h2>
      </div>
      <CuadroBracket cuadro={torneo.cuadro} rondaActual={torneo.ronda_actual} />
      <div className={styles.accionesFinal}>
        <button className={styles.btnStart} onClick={() => setFase('previo')}>
          <Swords size={18} /> Continuar al partido
        </button>
      </div>
    </div>
  )

  // ── PREVIO ────────────────────────────────────────────────────
  if (fase === 'previo') {
    const ronda_key = `ronda_${torneo.ronda_actual || 1}`
    const enf       = torneo.cuadro?.[ronda_key] || []
    const miPartido = enf.find(e => e.local?.es_usuario || e.visitante?.es_usuario)
    const rival     = miPartido?.local?.es_usuario ? miPartido.visitante : miPartido?.local
    return (
      <div className={styles.page}>
        <div className={styles.rondaHeader}>
          <span className={styles.rondaBadge}>{RONDA_NOMBRES[torneo.ronda_actual] || `Ronda ${torneo.ronda_actual}`}</span>
          <h2 className={styles.rondaTitle}>Próximo partido</h2>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.matchPreview}>
          <div className={styles.matchTeam}>
            <div className={styles.matchTeamAvatar} style={{ background:'#3d7eff22', borderColor:'#3d7eff44' }}>
              <Shield size={28} style={{ color:'#3d7eff' }} />
            </div>
            <span className={styles.matchTeamName}>{equipoSel}</span>
            <span className={styles.matchTeamLabel}>Tu equipo</span>
          </div>
          <div className={styles.matchVs}>VS</div>
          <div className={styles.matchTeam}>
            <div className={styles.matchTeamAvatar} style={{ background:'#ff6b3522', borderColor:'#ff6b3544' }}>
              {rival?.imagen
                ? <img src={imgUrl(rival.imagen)} alt={rival.nombre} style={{ width:40, height:40, objectFit:'contain' }} />
                : <Swords size={28} style={{ color:'#ff6b35' }} />
              }
            </div>
            <span className={styles.matchTeamName}>{rival?.nombre || '???'}</span>
            <span className={styles.matchTeamLabel}>Rival</span>
          </div>
        </div>
        <button className={styles.btnStart} onClick={handleSimular} disabled={loading}>
          {loading ? <><Loader2 size={18} className={styles.spin} /> Simulando...</> : <><Play size={18} fill="currentColor" /> Jugar partido</>}
        </button>
      </div>
    )
  }

  // ── SIMULANDO ─────────────────────────────────────────────────
  if (fase === 'simulando') return (
    <div className={styles.page}>
      <div className={styles.loadingPartido}>
        <Loader2 size={48} className={styles.spin} />
        <p>Simulando el partido...</p>
      </div>
    </div>
  )

  // ── RESULTADO / FINALIZADO ─────────────────────────────────────
  if (fase === 'resultado' || fase === 'finalizado') return (
    <div className={styles.page}>
      {/* Marcador — fondo siempre neutro */}
      <div className={styles.marcador}>
        <div className={styles.marcadorLado}>
          {marcador.imagenLocal
            ? <img src={imgUrl(marcador.imagenLocal)} alt="" className={styles.marcadorEscudo} />
            : <Shield size={26} style={{ color: 'rgba(255,255,255,0.3)' }} />
          }
          <div className={styles.marcadorEquipo}>{marcador.nombreLocal}</div>
        </div>
        <div className={styles.marcadorScore}>
          <span style={{ color: resultado === 'victoria' ? '#36d399' : 'white' }}>{marcador.local}</span>
          <span className={styles.marcadorGuion}>-</span>
          <span style={{ color: resultado === 'derrota' ? '#36d399' : 'white' }}>{marcador.visitante}</span>
        </div>
        <div className={styles.marcadorLado}>
          {marcador.imagenVisitante
            ? <img src={imgUrl(marcador.imagenVisitante)} alt="" className={styles.marcadorEscudo} />
            : <Shield size={26} style={{ color: 'rgba(255,255,255,0.3)' }} />
          }
          <div className={styles.marcadorEquipo}>{marcador.nombreVisitante}</div>
        </div>
      </div>
      <div className={`${styles.resultadoBadge} ${resultado === 'victoria' ? styles.resultadoVictoria : styles.resultadoDerrota}`}>
        {resultado === 'victoria' ? '🏆 ¡Victoria!' : '💔 Eliminado'}
      </div>

      {/* Feed con línea central */}
      <div className={styles.feedSection}>
        {/* Cabecera con escudos y nombres de equipos */}
        <div className={styles.feedHeader}>
          <div className={styles.feedHeaderEquipo}>
            {marcador.imagenLocal && <img src={imgUrl(marcador.imagenLocal)} alt="" className={styles.feedHeaderEscudo} />}
            <span style={{ color: '#3d7eff' }}>{marcador.nombreLocal}</span>
          </div>
          <span className={styles.feedHeaderSep}>—</span>
          <div className={styles.feedHeaderEquipo}>
            <span style={{ color: '#ff6b35' }}>{marcador.nombreVisitante}</span>
            {marcador.imagenVisitante && <img src={imgUrl(marcador.imagenVisitante)} alt="" className={styles.feedHeaderEscudo} />}
          </div>
        </div>
        {/* Línea vertical central y eventos */}
        <div className={styles.feedTimeline}>
          <div className={styles.feedLineaCentral} />
          {eventos.map((ev, i) => (
            <EventoItem
              key={i}
              evento={ev}
              nombreLocal={marcador.nombreLocal}
              imagenLocal={marcador.imagenLocal}
              imagenVisitante={marcador.imagenVisitante}
            />
          ))}
        </div>
      </div>

      {/* Stats del partido con cards de jugadores */}
      {statsPartido && (
        <div className={styles.statsPartidoSection}>
          <h3 className={styles.feedTitle}>Estadísticas del partido</h3>
          <div className={styles.statsPartidoGrid}>
            {statsPartido.goleadores?.length > 0 && (
              <div className={styles.statsPartidoGroup}>
                <h4>⚽ Goleadores</h4>
                {statsPartido.goleadores.map((g, i) => (
                  <JugadorStatCard key={i} jugadorId={g.id || g.nombre} stat={g.goles} statLabel="goles" statColor="#36d399" />
                ))}
              </div>
            )}
            {statsPartido.porteros?.length > 0 && (
              <div className={styles.statsPartidoGroup}>
                <h4>🧤 Porteros</h4>
                {statsPartido.porteros.map((p, i) => (
                  <JugadorStatCard key={i} jugadorId={p.id || p.nombre} stat={p.paradas} statLabel="paradas" statColor="#3d7eff" />
                ))}
              </div>
            )}
            {statsPartido.regates?.length > 0 && (
              <div className={styles.statsPartidoGroup}>
                <h4>💨 Regates</h4>
                {statsPartido.regates.map((r, i) => (
                  <JugadorStatCard key={i} jugadorId={r.id || r.nombre} stat={r.regates} statLabel="regates" statColor="#f59e0b" />
                ))}
              </div>
            )}
            {statsPartido.robos?.length > 0 && (
              <div className={styles.statsPartidoGroup}>
                <h4>🛡️ Robos</h4>
                {statsPartido.robos.map((r, i) => (
                  <JugadorStatCard key={i} jugadorId={r.id || r.nombre} stat={r.robos} statLabel="robos" statColor="#f471b5" />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className={styles.accionesFinal}>
        {fase === 'resultado' && resultado === 'victoria' && (
          <button className={styles.btnStart} onClick={handleSiguiente}>
            <ChevronRight size={18} /> Siguiente ronda
          </button>
        )}
        {fase === 'finalizado' && (
          <>
            {resultado === 'victoria' && (
              <>
                <div className={styles.campeonBanner}>
                  <Star size={32} style={{ color: '#f59e0b' }} />
                  <p>¡¡¡CAMPEÓN DEL TORNEO!!!</p>
                </div>
                <MvpCard stats={torneo.estadisticas} />
              </>
            )}
            <EstadisticasPanel stats={torneo.estadisticas} />
            <button className={styles.btnSecondary} onClick={() => { setFase('inicio'); setTorneo(null) }}>
              Nuevo torneo
            </button>
          </>
        )}
        <button className={styles.btnSecondary} onClick={() => navigate('/mi-equipo')}>
          Volver a Mi Equipo
        </button>
      </div>
    </div>
  )

  return null
}