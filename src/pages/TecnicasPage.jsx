import { useState, useEffect, useMemo } from 'react'
import { Search, SlidersHorizontal, X, Zap, Activity, ExternalLink } from 'lucide-react'
import FilterSelect from '../components/common/FilterSelect'
import EmptyState from '../components/common/EmptyState'
import { getElementColor } from '../utils/colors'
import styles from './TecnicasPage.module.css'

const ELEMENTS = ['Fuego', 'Montaña', 'Aire', 'Bosque']
// Mapeo para traducir lo que viene de la DB a lo que mostramos en UI
const TYPE_MAP = { shot: 'Tiro', dribble: 'Regate', defense: 'Defensa', save: 'Parada' };
const TYPES = ['Tiro', 'Parada', 'Regate', 'Defensa']
const TYPE_COLORS = { Tiro: '#ff6b35', Parada: '#3d7eff', Regate: '#36d399', Defensa: '#f471b5' }

export default function TecnicasPage() {
  const [techniques, setTechniques] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [elementFilter, setElementFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [sortBy, setSortBy] = useState('power')
  const [showFilters, setShowFilters] = useState(true)
  const [selectedTech, setSelectedTech] = useState(null)

  useEffect(() => {
    const fetchTechniques = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5000/tecnicas')
        if (!res.ok) throw new Error('Error al conectar con la API')
        const data = await res.json()
        setTechniques(data)
      } catch (err) {
        console.error("Error cargando técnicas:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchTechniques()
  }, [])

  const filtered = useMemo(() => {
    return techniques.filter(t => {
      const q = search.toLowerCase()
      // Traducimos el tipo de la técnica para comparar con el filtro de la UI
      const translatedType = TYPE_MAP[t.type] || t.type;

      const matchesSearch = !search || 
        t.name.toLowerCase().includes(q) || 
        (t.japaneseName && t.japaneseName.toLowerCase().includes(q))
      
      const matchesElement = !elementFilter || t.element === elementFilter
      const matchesType = !typeFilter || translatedType === typeFilter

      return matchesSearch && matchesElement && matchesType
    }).sort((a, b) => {
      if (sortBy === 'power') return (b.basePower || 0) - (a.basePower || 0);
      return a.name.localeCompare(b.name);
    });
  }, [techniques, search, elementFilter, typeFilter, sortBy])

  if (loading) return <div className={styles.loading}>Cargando libro de técnicas...</div>

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.titleRow}>
          <Zap size={22} style={{ color: '#ffaa00' }} />
          <h1 className={styles.title}>Técnicas</h1>
        </div>
        <p className={styles.subtitle}>Base de datos oficial de supertécnicas</p>
      </div>

      <div className={styles.typeStats}>
        {TYPES.map(type => {
          // Contamos comparando el tipo traducido
          const count = techniques.filter(t => (TYPE_MAP[t.type] || t.type) === type).length
          const color = TYPE_COLORS[type]
          return (
            <button
              key={type}
              onClick={() => setTypeFilter(typeFilter === type ? '' : type)}
              className={`${styles.typeStat} ${typeFilter === type ? styles.typeStatActive : ''}`}
              style={typeFilter === type ? { borderColor: color, background: `${color}11` } : {}}
            >
              <span className={styles.typeCount} style={{ color }}>{count}</span>
              <p className={styles.typeName}>{type}s</p>
            </button>
          )
        })}
      </div>

      {/* FILTROS */}
      <div className={styles.filterPanel}>
        <div className={styles.searchRow}>
          <div className={styles.searchWrap}>
            <Search size={15} className={styles.searchIcon} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar técnica..."
              className={styles.searchInput}
            />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className={styles.filterBtn}>
            <SlidersHorizontal size={15} /> Filtros
          </button>
        </div>

        {showFilters && (
          <div className={styles.filterRow}>
            <FilterSelect label="Elemento" value={elementFilter} onChange={setElementFilter} options={ELEMENTS} />
            <FilterSelect label="Tipo" value={typeFilter} onChange={setTypeFilter} options={TYPES} />
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className={styles.sortSelect}>
              <option value="power">Mayor Potencia</option>
              <option value="name">Orden Alfabético</option>
            </select>
          </div>
        )}
      </div>

      <div className={styles.grid}>
        {filtered.map(tech => (
          <TechniqueCard key={tech._id} technique={tech} onOpen={() => setSelectedTech(tech)} />
        ))}
      </div>

      {/* MODAL DETALLADO */}
      {selectedTech && (
        <div className={styles.modalOverlay} onClick={() => setSelectedTech(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelectedTech(null)}><X size={20} /></button>
            
            <div className={styles.modalHeader} style={{ background: `linear-gradient(135deg, ${getElementColor(selectedTech.element)}CC, #0f172a)` }}>
              <div className={styles.headerInfo}>
                <span className={styles.typeBadge}>
                  {selectedTech.element} | {(TYPE_MAP[selectedTech.type] || selectedTech.type).toUpperCase()}
                </span>
                <h2 className={styles.modalTitle}>{selectedTech.name}</h2>
                <p className={styles.modalSub}>{selectedTech.japaneseName}</p>
              </div>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.videoContainer}>
                <video key={selectedTech.videoUrl} autoPlay loop playsInline className={styles.mainVideo}>
                  <source src={selectedTech.videoUrl} type="video/mp4" />
                </video>
              </div>

              <h4 className={styles.sectionTitle}><Zap size={14} /> ESTADÍSTICAS</h4>
              <div className={styles.statsGrid}>
                <div className={styles.statBox}>
                  <span className={styles.statValue}>{selectedTech.basePower}</span>
                  <span className={styles.statLabel}>POTENCIA</span>
                </div>
                <div className={styles.statBox}>
                  <span className={styles.statValue}>{selectedTech.cost?.tension || 0}</span>
                  <span className={styles.statLabel}>TENSIÓN</span>
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

function TechniqueCard({ technique, onOpen }) {
  const color = getElementColor(technique.element)
  
  // Aquí usamos el mapeo para saber qué sigla poner
  const translatedType = TYPE_MAP[technique.type] || technique.type;
  const typeShort = { Tiro: 'SH', Parada: 'GK', Regate: 'DR', Defensa: 'DF' }

  return (
    <div className={`${styles.techCard} card-hover`} onClick={onOpen} style={{ cursor: 'pointer' }}>
      <div className={styles.techAccent} style={{ background: color }} />
      <div className={styles.techBody}>
        <div className={styles.techTop}>
          <div className={styles.techIcon} style={{ background: color, fontWeight: '900' }}>
            {typeShort[translatedType] ?? '??'}
          </div>
          <div className={styles.techNames}>
            <h3 className={styles.techName}>{technique.name}</h3>
            <p className={styles.techJa}>{technique.japaneseName}</p>
          </div>
        </div>

        <div className={styles.statsContainer}>
          <div className={styles.powerRow}>
            <span className={styles.powerLabel}>Potencia</span>
            <div className={styles.powerBarBg}>
              <div className={styles.powerBar} style={{ width: `${Math.min(technique.basePower, 100)}%`, background: '#ff8000' }} />
            </div>
            <span className={styles.powerValue}>{technique.basePower}</span>
          </div>
          <div className={styles.powerRow}>
            <span className={styles.powerLabel}>Tensión</span>
            <div className={styles.powerBarBg}>
              <div className={styles.powerBar} style={{ width: `${Math.min(technique.cost?.tension || 0, 100)}%`, background: '#00d2ff' }} />
            </div>
            <span className={styles.powerValue}>{technique.cost?.tension || 0}</span>
          </div>
        </div>
      </div>
    </div>
  )
}