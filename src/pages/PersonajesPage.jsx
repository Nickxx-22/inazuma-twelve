import { useState, useMemo, useEffect } from 'react'
import { Search, SlidersHorizontal, LayoutGrid, List, X } from 'lucide-react'
import CharacterCard from '../components/players/CharacterCard'
import CharacterListItem from '../components/players/CharacterListItem'
import FilterSelect from '../components/common/FilterSelect'
import EmptyState from '../components/common/EmptyState'
import styles from './PersonajesPage.module.css'

// Opciones de filtro — cuando vengan de tu API, cámbialas aquí
const ELEMENTS  = ['Fuego', 'Montaña', 'Aire', 'Bosque']
const POSITIONS = ['FW', 'MD', 'DF', 'GK']
const GENDERS   = ['Masculino', 'Femenino']
const NATURES   = ['Justicia', 'Tension', 'Contraataque', 'Afinidad', 'Brecha', 'Juego Sucio']
const SEASONS   = ['IE1', 'IE2', 'IE3']

export default function PersonajesPage() {
  // TODO: Reemplaza con tu hook/fetch de personajes
  // Ejemplo: const { data: characters = [], isLoading } = useCharacters()
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)
  const [search,          setSearch]          = useState('')
  const [elementFilter,   setElementFilter]   = useState('')
  const [positionFilter,  setPositionFilter]  = useState('')
  const [genderFilter,    setGenderFilter]    = useState('')
  const [natureFilter,    setNatureFilter]    = useState('')
  const [roleFilter,      setRoleFilter]      = useState('')
  const [seasonFilter,    setSeasonFilter]    = useState('')
  const [sortBy,          setSortBy]          = useState('name')
  const [viewMode,        setViewMode]        = useState('grid')
  const [showFilters,     setShowFilters]     = useState(true)

  useEffect(() => {
  async function fetchPlayers() {
    try {
      const res = await fetch("http://127.0.0.1:5000/jugadores")
      const data = await res.json()
      setCharacters(data)
    } catch (error) {
      console.error("Error cargando jugadores:", error)
    } finally {
      setLoading(false)
    }
  }

  fetchPlayers()
}, [])

  const filtered = useMemo(() => {
    let result = characters.filter(c => {
      const q = search.toLowerCase()
      return (
        (!search         || c.name.toLowerCase().includes(q) || c.japaneseName.toLowerCase().includes(q)) &&
        (!elementFilter  || c.element  === elementFilter)  &&
        (!positionFilter || c.position === positionFilter) &&
        (!genderFilter   || c.gender   === genderFilter)   &&
        (!natureFilter   || c.nature   === natureFilter)   &&
        (!roleFilter     || c.role     === roleFilter)     &&
        (!seasonFilter   || c.season   === seasonFilter)
      )
    })
    return sortBy === 'power'
      ? [...result].sort((a, b) => b.power - a.power)
      : [...result].sort((a, b) => a.name.localeCompare(b.name))
  }, [characters, search, elementFilter, positionFilter, genderFilter, natureFilter, roleFilter, seasonFilter, sortBy])

  const activeCount = [elementFilter, positionFilter, genderFilter, natureFilter, roleFilter, seasonFilter].filter(Boolean).length

  function clearFilters() {
    setSearch(''); setElementFilter(''); setPositionFilter('')
    setGenderFilter(''); setNatureFilter(''); setRoleFilter(''); setSeasonFilter('')
  }

  if (loading) return <p style={{padding:20}}>Cargando jugadores...</p>
  
  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Jugadores</h1>
        <p className={styles.subtitle}>Explora todos los personajes del universo Inazuma Eleven</p>
      </div>

      {/* Search + Filters */}
      <div className={styles.filterPanel}>
        <div className={styles.searchRow}>
          <div className={styles.searchWrap}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nombre o apodo..."
              className={styles.searchInput}
            />
          </div>
          <button
            onClick={() => setShowFilters(f => !f)}
            className={`${styles.filterBtn} ${showFilters ? styles.filterBtnActive : ''}`}
          >
            <SlidersHorizontal size={15} />
            Filtros
            {activeCount > 0 && <span className={styles.filterCount}>{activeCount}</span>}
          </button>
        </div>

        {showFilters && (
          <div className={styles.filterGrid}>
            <FilterSelect label="Elemento"   value={elementFilter}  onChange={setElementFilter}  options={ELEMENTS} />
            <FilterSelect label="Arquetipo" value={natureFilter}   onChange={setNatureFilter}   options={NATURES} />
            <FilterSelect label="Posición"   value={positionFilter} onChange={setPositionFilter} options={POSITIONS} />
            <FilterSelect label="Género"     value={genderFilter}   onChange={setGenderFilter}   options={GENDERS} />
            <FilterSelect label="Temporada"  value={seasonFilter}   onChange={setSeasonFilter}   options={SEASONS} />
          </div>
        )}

        <div className={styles.sortRow}>
          <div className={styles.sortLeft}>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className={styles.sortSelect}>
              <option value="name">Ordenar por nombre</option>
              <option value="power">Ordenar por potencia</option>
            </select>
            {activeCount > 0 && (
              <button onClick={clearFilters} className={styles.clearBtn}>
                <X size={12} /> Limpiar filtros
              </button>
            )}
          </div>
          <span className={styles.resultCount}>
            Mostrando {filtered.length} de {characters.length}
          </span>
        </div>
      </div>

      {/* View toggle */}
      <div className={styles.viewToggle}>
        <button
          onClick={() => setViewMode('grid')}
          className={`${styles.toggleBtn} ${viewMode === 'grid' ? styles.toggleBtnActive : ''}`}
          aria-label="Vista cuadrícula"
        >
          <LayoutGrid size={16} />
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`${styles.toggleBtn} ${viewMode === 'list' ? styles.toggleBtnActive : ''}`}
          aria-label="Vista lista"
        >
          <List size={16} />
        </button>
      </div>

      {/* Results */}
      {filtered.length === 0
        ? <EmptyState icon={Search} title="Sin resultados" description="Intenta ajustar los filtros de búsqueda" />
        : viewMode === 'grid'
          ? <div className={styles.grid}>{filtered.map(c => <CharacterCard key={c.id} character={c} />)}</div>
          : <div className={styles.list}>{filtered.map(c => <CharacterListItem key={c.id} character={c} />)}</div>
      }
    </div>
  )
}
