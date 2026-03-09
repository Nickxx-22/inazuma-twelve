import { useState, useEffect, useMemo } from 'react'
import { Search, SlidersHorizontal, X, Zap, Activity, Heart, Loader2 } from 'lucide-react'
import FilterSelect from '../components/common/FilterSelect'
import EmptyState from '../components/common/EmptyState'
import { useAuth } from '../hooks/useAuth'
import { getElementColor } from '../utils/colors'
import { BASE_URL, imgUrl } from '../config'
import styles from './TecnicasPage.module.css'

const ELEMENTS = ['Fuego', 'Montaña', 'Aire', 'Bosque']
const TYPE_MAP = { shot: 'Tiro', dribble: 'Regate', defense: 'Defensa', save: 'Parada' }
const TYPES = ['Tiro', 'Parada', 'Regate', 'Defensa']
const TYPE_COLORS = { Tiro: '#ff6b35', Parada: '#3d7eff', Regate: '#36d399', Defensa: '#f471b5' }

function getStoredSession() {
  try {
    const user  = localStorage.getItem('inazuma-user')
    const token = localStorage.getItem('inazuma-token')
    return { user: user ? JSON.parse(user) : null, token: token || null }
  } catch { return { user: null, token: null } }
}

export default function TecnicasPage() {
  const { user } = useAuth()
  const [techniques,    setTechniques]    = useState([])
  const [loading,       setLoading]       = useState(true)
  const [search,        setSearch]        = useState('')
  const [elementFilter, setElementFilter] = useState('')
  const [typeFilter,    setTypeFilter]    = useState('')
  const [sortBy,        setSortBy]        = useState('power')
  const [showFilters,   setShowFilters]   = useState(false)
  const [selectedTech,  setSelectedTech]  = useState(null)
  const [favTecnicas,   setFavTecnicas]   = useState(new Set())
  const [likingId,      setLikingId]      = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const res  = await fetch(`${BASE_URL}/tecnicas`)
        if (!res.ok) throw new Error('Error API')
        const data = await res.json()
        setTechniques(data)

        const { user: su, token } = getStoredSession()
        const userId = su?.id || su?._id
        
        if (userId && token) {
          const uRes  = await fetch(`${BASE_URL}/obtener_usuario/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          const uData = await uRes.json()
          if (uRes.ok && uData.usuario?.favoritos_tecnicas) {
            setFavTecnicas(new Set(uData.usuario.favoritos_tecnicas))
          }
        }
      } catch (err) {
        console.error('Error cargando tecnicas:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  const handleToggleFav = async (tecnicaId, e) => {
    e.stopPropagation()
    const { user: su, token } = getStoredSession()
    const userId = su?.id || su?._id
    if (!userId || !token) { alert('Debes iniciar sesion para guardar favoritos'); return }

    setLikingId(tecnicaId)
    try {
      const res  = await fetch(`${BASE_URL}/toggle_favorito_tecnica`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body:    JSON.stringify({ user_id: userId, tecnica_id: tecnicaId })
      })
      const data = await res.json()
      if (res.ok) {
        setFavTecnicas(prev => {
          const next = new Set(prev)
          data.isFavorite ? next.add(tecnicaId) : next.delete(tecnicaId)
          return next
        })
      }
    } catch (err) {
      console.error('Error toggle favorito:', err)
    } finally {
      setLikingId(null)
    }
  }

  const filtered = useMemo(() => {
    return techniques.filter(t => {
      const q = search.toLowerCase()
      const translatedType = TYPE_MAP[t.type] || t.type
      return (
        (!search        || t.name.toLowerCase().includes(q) || (t.japaneseName && t.japaneseName.toLowerCase().includes(q))) &&
        (!elementFilter || t.element === elementFilter) &&
        (!typeFilter    || translatedType === typeFilter)
      )
    }).sort((a, b) =>
      sortBy === 'power' ? (b.basePower || 0) - (a.basePower || 0) : a.name.localeCompare(b.name)
    )
  }, [techniques, search, elementFilter, typeFilter, sortBy])

  if (loading) return (
    <div className={styles.loading}>
      <Loader2 size={36} className={styles.spin} />
      <span>Cargando libro de tecnicas...</span>
    </div>
  )

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Técnicas</h1>
        <p className={styles.subtitle}>
          Base de datos oficial de supertecnicas
          <span className={styles.countBadge}>{techniques.length} técnicas</span>
        </p>
      </div>

      <div className={styles.typeStats}>
        {TYPES.map(type => {
          const count = techniques.filter(t => (TYPE_MAP[t.type] || t.type) === type).length
          const color = TYPE_COLORS[type]
          const isActive = typeFilter === type
          return (
            <button
              key={type}
              onClick={() => setTypeFilter(isActive ? '' : type)}
              className={`${styles.typeStat} ${isActive ? styles.typeStatActive : ''}`}
              style={isActive ? { borderColor: color, background: `${color}18`, boxShadow: `0 0 20px ${color}33` } : {}}
            >
              <div className={styles.typeStatInner}>
                <span className={styles.typeCount} style={{ color }}>{count}</span>
                <span className={styles.typeName}>{type}s</span>
              </div>
              <div
                className={styles.typeBar}
                style={{ background: isActive ? color : `${color}44`, width: isActive ? '100%' : '40%' }}
              />
            </button>
          )
        })}
      </div>

      <div className={styles.filterPanel}>
        <div className={styles.searchRow}>
          <div className={styles.searchWrap}>
            <Search size={15} className={styles.searchIcon} />
            <input
              type="text" value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar tecnica..."
              className={styles.searchInput}
            />
            {search && (
              <button className={styles.clearSearch} onClick={() => setSearch('')}><X size={14} /></button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`${styles.filterBtn} ${showFilters ? styles.filterBtnActive : ''}`}
          >
            <SlidersHorizontal size={15} /> Filtros
          </button>
        </div>
        {showFilters && (
          <div className={styles.filterRow}>
            <FilterSelect label="Elemento" value={elementFilter} onChange={setElementFilter} options={ELEMENTS} />
            <FilterSelect label="Tipo"     value={typeFilter}    onChange={setTypeFilter}    options={TYPES} />
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className={styles.sortSelect}>
              <option value="power">Mayor Potencia</option>
              <option value="name">Orden Alfabetico</option>
            </select>
          </div>
        )}
      </div>

      <p className={styles.resultCount}>{filtered.length} resultados</p>

      <div className={styles.grid}>
        {filtered.length === 0
          ? <EmptyState />
          : filtered.map(tech => (
              <TechniqueCard
                key={tech._id}
                technique={tech}
                isFav={favTecnicas.has(tech._id)}
                isLiking={likingId === tech._id}
                onOpen={() => setSelectedTech(tech)}
                onToggleFav={(e) => handleToggleFav(tech._id, e)}
                isLoggedIn={!!(user || getStoredSession().user)}
              />
            ))
        }
      </div>

      {selectedTech && (
        <div className={styles.modalOverlay} onClick={() => setSelectedTech(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelectedTech(null)}><X size={20} /></button>
            <div
              className={styles.modalHeader}
              style={{ background: `linear-gradient(135deg, ${getElementColor(selectedTech.element)}CC 0%, #0f172a 100%)` }}
            >
              <div className={styles.modalHeaderGlow} style={{ background: getElementColor(selectedTech.element) }} />
              <div className={styles.headerInfo}>
                <span className={styles.typeBadge}>
                  {selectedTech.element} · {(TYPE_MAP[selectedTech.type] || selectedTech.type).toUpperCase()}
                </span>
                <h2 className={styles.modalTitle}>{selectedTech.name}</h2>
                <p className={styles.modalSub}>{selectedTech.japaneseName}</p>
              </div>
              <button
                className={`${styles.modalFavBtn} ${favTecnicas.has(selectedTech._id) ? styles.modalFavActive : ''}`}
                onClick={(e) => handleToggleFav(selectedTech._id, e)}
                disabled={likingId === selectedTech._id}
              >
                {likingId === selectedTech._id
                  ? <Loader2 size={20} className={styles.spin} />
                  : <Heart size={20} fill={favTecnicas.has(selectedTech._id) ? 'currentColor' : 'none'} />
                }
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.videoContainer}>
                <video key={selectedTech.videoUrl} autoPlay loop playsInline className={styles.mainVideo}>
                  <source src={imgUrl(selectedTech.videoUrl)} type="video/mp4" />
                </video>
              </div>
              <h4 className={styles.sectionTitle}><Zap size={14} /> ESTADISTICAS</h4>
              <div className={styles.statsGrid}>
                <div className={styles.statBox}>
                  <span className={styles.statValue}>{selectedTech.basePower}</span>
                  <span className={styles.statLabel}>POTENCIA</span>
                </div>
                <div className={styles.statBox}>
                  <span className={styles.statValue}>{selectedTech.cost?.tension || 0}</span>
                  <span className={styles.statLabel}>TENSION</span>
                </div>
              </div>
              <div className={styles.requirementRow}>
                <Activity size={16} />
                <span>Requiere {selectedTech.cost?.stamina || 0} PE de Resistencia</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function TechniqueCard({ technique, isFav, isLiking, onOpen, onToggleFav, isLoggedIn }) {
  const color          = getElementColor(technique.element)
  const translatedType = TYPE_MAP[technique.type] || technique.type
  const typeColor      = TYPE_COLORS[translatedType] || '#888'
  const typeLabels     = { Tiro: 'SHOT', Parada: 'SAVE', Regate: 'DRIB', Defensa: 'DEF' }
  const typeLabel      = typeLabels[translatedType] ?? '??'
  const powerPct       = Math.min((technique.basePower / 120) * 100, 100)

  return (
    <div className={styles.techCard} onClick={onOpen}>
      <div className={styles.techSideline} style={{ background: `linear-gradient(180deg, ${color}, ${typeColor})` }} />

      <div className={styles.techCardHeader}>
        <div
          className={styles.techTypePill}
          style={{ background: `${typeColor}22`, color: typeColor, borderColor: `${typeColor}44` }}
        >
          <span className={styles.techTypeDot} style={{ background: typeColor }} />
          {typeLabel}
        </div>
        <div className={styles.techElementPill} style={{ background: `${color}22`, color }}>
          {technique.element}
        </div>
        <button
          className={`${styles.favBtn} ${isFav ? styles.favBtnActive : ''}`}
          onClick={onToggleFav}
          disabled={isLiking}
          title={isLoggedIn ? (isFav ? 'Quitar favorito' : 'Añadir favorito') : 'Inicia sesion'}
        >
          {isLiking
            ? <Loader2 size={13} className={styles.spin} />
            : <Heart size={13} fill={isFav ? 'currentColor' : 'none'} />
          }
        </button>
      </div>

      <div className={styles.techNames}>
        <h3 className={styles.techName}>{technique.name}</h3>
        {technique.japaneseName && <p className={styles.techJa}>{technique.japaneseName}</p>}
      </div>

      <div className={styles.techStats}>
        <div className={styles.powerRowFull}>
          <div className={styles.powerMeta}>
            <span className={styles.powerLabel}>POTENCIA</span>
            <span className={styles.powerNum} style={{ color }}>{technique.basePower}</span>
          </div>
          <div className={styles.powerBarTrack}>
            <div
              className={styles.powerBarFill}
              style={{ width: `${powerPct}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }}
            />
            {[25, 50, 75].map(p => (
              <div key={p} className={styles.powerTick} style={{ left: `${p}%` }} />
            ))}
          </div>
        </div>
        <div className={styles.costRow}>
          <span className={styles.costChip}>
            <Activity size={10} /> {technique.cost?.stamina || 0} PE
          </span>
          <span className={styles.costChip}>
            <Zap size={10} /> {technique.cost?.tension || 0} PT
          </span>
        </div>
      </div>

      <div
        className={styles.techHoverGlow}
        style={{ background: `radial-gradient(circle at 50% 100%, ${color}18, transparent 70%)` }}
      />
    </div>
  )
}