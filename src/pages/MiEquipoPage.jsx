import { useState, useEffect, useMemo } from 'react'
import { Plus, X, Save, Trash2, Search, Loader2, ChevronDown, Folder, PlusCircle, Edit3 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { getElementColor } from '../utils/colors'
import { getAllPlayers } from '../services/playerService'
import styles from './MiEquipoPage.module.css'

// ── MODAL DE SELECCIÓN (Estilo Captura 202313) ──────────────────────
function CharacterPickerModal({ slotIndex, slotPosition, usedIds, characters, onSelect, onClose }) {
  const [search, setSearch] = useState('')
  const [posFilter, setPosFilter] = useState('')

  const available = useMemo(() => {
    return characters.filter(c => {
      const isUsed = usedIds.some(id => id === c._id || id === c.id);
      if (isUsed) return false;
      const q = search.toLowerCase();
      const matchesSearch = !search || c.name.toLowerCase().includes(q);
      const matchesPosition = !posFilter || c.position === posFilter;
      return matchesSearch && matchesPosition;
    }).sort((a, b) => (b.power || 0) - (a.power || 0));
  }, [characters, usedIds, search, posFilter]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.pickerModal} onClick={e => e.stopPropagation()}>
        <div className={styles.pickerHeader}>
          <div>
            <h3 className={styles.pickerTitle}>Seleccionar {slotPosition}</h3>
            <span className={styles.pickerCount}>{available.length} Jugadores disponibles</span>
          </div>
          <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
        </div>

        <div className={styles.pickerSearch}>
          <Search size={16} className={styles.pickerSearchIcon} />
          <input 
            className={styles.pickerSearchInput}
            placeholder="Buscar por nombre..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>

        <div className={styles.pickerFilters}>
          <select value={posFilter} onChange={e => setPosFilter(e.target.value)} className={styles.pickerSelect}>
            <option value="">Todas las Posiciones</option>
            <option value="GK">Portero (GK)</option>
            <option value="DF">Defensa (DF)</option>
            <option value="MD">Medio (MD)</option>
            <option value="FW">Delantero (FW)</option>
          </select>
        </div>

        <div className={styles.pickerList}>
          {available.map(char => (
            <div 
              key={char._id || char.id} 
              className={styles.pickerRow} 
              onClick={() => onSelect(slotIndex, char._id || char.id)}
              style={{ borderLeft: `4px solid ${getElementColor(char.element)}` }}
            >
              <div className={styles.pickerAvatar}>
                <img src={char.image} alt={char.name} />
              </div>
              <div className={styles.pickerInfo}>
                <span className={styles.pickerName}>{char.name}</span>
                <span className={styles.pickerMeta}>{char.position} • {char.element?.toUpperCase()}</span>
              </div>
              <div className={styles.pickerPower}>
                <span className={styles.pwrVal}>{char.power}</span>
                <span className={styles.pwrLabel}>PWR</span>
              </div>
            </div>
          ))}
          {available.length === 0 && <div className={styles.noAvail}>No se encontraron jugadores</div>}
        </div>
      </div>
    </div>
  );
}

export default function MiEquipoPage() {
  const { user } = useAuth()
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const [misEquipos, setMisEquipos] = useState({}) 
  const [equipoSeleccionado, setEquipoSeleccionado] = useState("Nuevo Equipo")
  const [nombreTemporal, setNombreTemporal] = useState("") 
  const [selectingSlot, setSelectingSlot] = useState(null)

  const DEFAULT_FORMATION = [
    { position: 'Portero' }, { position: 'Defensa' }, { position: 'Defensa' },
    { position: 'Defensa' }, { position: 'Defensa' }, { position: 'Centrocampista' },
    { position: 'Centrocampista' }, { position: 'Centrocampista' }, { position: 'Centrocampista' },
    { position: 'Delantero' }, { position: 'Delantero' }
  ];

  const [slots, setSlots] = useState(DEFAULT_FORMATION.map(s => ({ ...s, characterId: null })));

  useEffect(() => {
    async function init() {
      try {
        setLoading(true)
        const allPlayers = await getAllPlayers()
        setCharacters(allPlayers)
        if (user?.id) {
          const res = await fetch(`http://127.0.0.1:5000/obtener_usuario/${user.id}`)
          const data = await res.json()
          if (res.ok && data.usuario.equipos) {
            setMisEquipos(data.usuario.equipos)
            const nombres = Object.keys(data.usuario.equipos)
            if (nombres.length > 0) {
              const inicial = nombres[0]
              setEquipoSeleccionado(inicial); setNombreTemporal(inicial);
              setSlots(DEFAULT_FORMATION.map((s, i) => ({ ...s, characterId: data.usuario.equipos[inicial][i] || null })))
            }
          }
        }
      } catch (err) { console.error(err) } finally { setLoading(false) }
    }
    init()
  }, [user?.id])

  const cargarEquipo = (nombre) => {
    if (nombre === "No hay equipos") return;
    setEquipoSeleccionado(nombre); setNombreTemporal(nombre);
    const ids = misEquipos[nombre] || []
    setSlots(DEFAULT_FORMATION.map((s, i) => ({ ...s, characterId: ids[i] || null })))
  }

  const handleNewTeam = () => {
    const nuevo = "Nuevo Equipo " + (Object.keys(misEquipos).length + 1)
    setEquipoSeleccionado(nuevo); setNombreTemporal(nuevo);
    setSlots(DEFAULT_FORMATION.map(s => ({ ...s, characterId: null })))
  }

  const handleSaveTeam = async () => {
    if (!user?.id) return
    setIsSaving(true)
    const equipoIds = slots.map(s => s.characterId)
    try {
      const res = await fetch('http://127.0.0.1:5000/guardar_equipo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, equipo: equipoIds, nombre_equipo: nombreTemporal })
      })
      if (res.ok) {
        setMisEquipos(prev => ({ ...prev, [nombreTemporal]: equipoIds }))
        setEquipoSeleccionado(nombreTemporal)
        alert("Equipo guardado con éxito")
      }
    } catch (e) { console.error(e) } finally { setIsSaving(false) }
  }

  const handleDeleteTeam = async () => {
    if (!user?.id || equipoSeleccionado === "Nuevo Equipo") return;
    if (!confirm(`¿Borrar definitivamente "${equipoSeleccionado}"?`)) return;
    setIsDeleting(true);
    try {
      const res = await fetch('http://127.0.0.1:5000/eliminar_equipo', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, nombre_equipo: equipoSeleccionado })
      });
      const data = await res.json();
      if (res.ok) {
        const restantes = data.equipos || {}; setMisEquipos(restantes);
        const nombres = Object.keys(restantes);
        if (nombres.length > 0) cargarEquipo(nombres[0]);
        else { setEquipoSeleccionado("Nuevo Equipo"); setNombreTemporal(""); setSlots(DEFAULT_FORMATION.map(s => ({ ...s, characterId: null }))); }
      }
    } catch (e) { console.error(e) } finally { setIsDeleting(false) }
  };

  const usedIds = slots.filter(s => s.characterId).map(s => s.characterId)
  const totalPower = slots.reduce((sum, slot) => {
    const c = characters.find(ch => (ch.id === slot.characterId || ch._id === slot.characterId))
    if (!c) return sum
    let pwr = c.power || 0
    if (c.relation === 'heredero') pwr *= 0.5 
    if (c.isCopy) pwr *= 0.3 
    return sum + pwr
  }, 0)

  if (loading) return <div className={styles.loadingState}><Loader2 className={styles.spinner} /></div>

  return (
    <div className={styles.page}>
      <div className={styles.pageTop}>
        <div className={styles.managementCard}>
          <div className={styles.selectorArea}>
            <div className={styles.customSelect}>
              <Folder size={16} className={styles.iconMuted} />
              <select value={equipoSeleccionado} onChange={(e) => cargarEquipo(e.target.value)}>
                {Object.keys(misEquipos).length === 0 && <option>No hay equipos</option>}
                {Object.keys(misEquipos).map(nom => <option key={nom} value={nom}>{nom}</option>)}
              </select>
              <ChevronDown size={14} />
            </div>
            <button onClick={handleNewTeam} className={styles.actionCircle}><PlusCircle size={20} /></button>
          </div>
          <div className={styles.nameArea}>
            <Edit3 size={14} className={styles.iconMuted} />
            <input type="text" className={styles.nameInput} value={nombreTemporal} onChange={(e) => setNombreTemporal(e.target.value)} placeholder="Nombre del equipo..." />
          </div>
          <div className={styles.buttonGroup}>
            <button className={styles.btnTrash} onClick={handleDeleteTeam} disabled={isDeleting}>
              {isDeleting ? <Loader2 size={18} className={styles.spinner} /> : <Trash2 size={18} />}
            </button>
            <button className={styles.btnPrimary} onClick={handleSaveTeam} disabled={isSaving}>
              {isSaving ? <Loader2 size={18} className={styles.spinner} /> : <Save size={18} />}
              <span>Guardar</span>
            </button>
          </div>
        </div>
      </div>

      <div className={styles.fieldContainer}>
        <div className={styles.soccerField}>
          <div className={styles.fieldLines}>
            <div className={styles.areaTop}></div>
            <div className={styles.circleCenter}></div>
            <div className={styles.areaBottom}></div>
          </div>
          {slots.map((slot, index) => {
            const char = characters.find(c => (c._id === slot.characterId || c.id === slot.characterId));
            return (
              <div key={index} className={`${styles.fieldSlot} ${styles['pos' + index]}`} onClick={() => !char && setSelectingSlot(index)}>
                {char ? (
                  <div className={styles.playerNode}>
                    <div className={styles.playerArt} style={{ borderColor: getElementColor(char.element) }}>
                      <img src={char.image} alt={char.name} />
                      <button className={styles.miniRemove} onClick={(e) => { e.stopPropagation(); setSlots(prev => prev.map((s, i) => i === index ? { ...s, characterId: null } : s)); }}>
                        <X size={10} />
                      </button>
                    </div>
                    <div className={styles.playerNameTag}>{char.name.split(' ')[0]}</div>
                    <div className={styles.playerPosTag} style={{ background: getElementColor(char.element) }}>
                      {slot.position.substring(0,2).toUpperCase()}
                    </div>
                  </div>
                ) : (
                  <div className={styles.emptyNode}>
                    <Plus size={14} />
                    <small>{slot.position.substring(0,2)}</small>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.summaryGrid}>
        <div className={styles.summaryBox}>
          <span>{Math.round(totalPower)}</span>
          <small>POTENCIA TOTAL</small>
        </div>
        <div className={styles.summaryBox}>
          <span>{usedIds.length} / 11</span>
          <small>JUGADORES</small>
        </div>
      </div>

      {selectingSlot !== null && (
        <CharacterPickerModal 
          slotIndex={selectingSlot} slotPosition={slots[selectingSlot].position}
          usedIds={usedIds} characters={characters}
          onSelect={(idx, id) => { 
            setSlots(prev => prev.map((s, i) => i === idx ? { ...s, characterId: id } : s));
            setSelectingSlot(null); 
          }}
          onClose={() => setSelectingSlot(null)}
        />
      )}
    </div>
  )
}