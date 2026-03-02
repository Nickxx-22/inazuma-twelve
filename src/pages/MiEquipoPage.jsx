import { useState, useEffect, useMemo } from 'react'
import { Plus, X, Save, Trash2, Search, Loader2, Users, Check, ChevronDown, Folder, PlusCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { getElementColor } from '../utils/colors'
import { getAllPlayers } from '../services/playerService'
import styles from './MiEquipoPage.module.css'

// ── PICKER MODAL ──────────────────────────────────────────────────
function CharacterPickerModal({ slotIndex, slotPosition, usedIds, characters, onSelect, onClose }) {
  const [search, setSearch] = useState('')
  const [elFilter, setElFilter] = useState('')
  
  const getInitialPos = (pos) => {
    const p = pos.toLowerCase();
    if (p.includes('portero')) return 'GK';
    if (p.includes('defensa')) return 'DF';
    if (p.includes('centro')) return 'MD';
    if (p.includes('delantero')) return 'FW';
    return '';
  };

  const [posFilter, setPosFilter] = useState(getInitialPos(slotPosition))

  const available = useMemo(() => {
    return characters.filter(c => {
      const isUsed = usedIds.some(id => id === c._id || id === c.id);
      if (isUsed) return false;

      const q = search.toLowerCase();
      const matchesSearch = !search || 
                           c.name.toLowerCase().includes(q) || 
                           (c.japaneseName && c.japaneseName.toLowerCase().includes(q));
      
      const matchesElement = !elFilter || c.element === elFilter;
      const matchesPosition = !posFilter || c.position === posFilter;

      return matchesSearch && matchesElement && matchesPosition;
    }).sort((a, b) => (b.power || 0) - (a.power || 0));
  }, [characters, usedIds, search, elFilter, posFilter]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.pickerModal} onClick={e => e.stopPropagation()}>
        <div className={styles.pickerHeader}>
          <div>
            <h3 className={styles.pickerTitle}>Fichar {slotPosition}</h3>
            <span className={styles.pickerCount}>{available.length} candidatos</span>
          </div>
          <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
        </div>

        <div className={styles.pickerSearch}>
          <Search size={18} className={styles.pickerSearchIcon} />
          <input
            type="text"
            placeholder="Buscar jugador..."
            className={styles.pickerSearchInput}
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
        </div>

        <div className={styles.pickerFilters}>
          <select value={elFilter} onChange={e => setElFilter(e.target.value)} className={styles.pickerSelect}>
            <option value="">Elemento</option>
            {["Fuego", "Bosque", "Aire", "Montaña"].map(el => (
              <option key={el} value={el}>{el}</option>
            ))}
          </select>
          <select value={posFilter} onChange={e => setPosFilter(e.target.value)} className={styles.pickerSelect}>
            <option value="GK">GK</option>
            <option value="DF">DF</option>
            <option value="MD">MD</option>
            <option value="FW">FW</option>
          </select>
        </div>

        <div className={styles.pickerList}>
          {available.map(char => (
            <button key={char._id || char.id} className={styles.pickerRow} onClick={() => onSelect(slotIndex, char._id || char.id)}>
              <div className={styles.pickerAvatar} style={{ borderLeft: `4px solid ${getElementColor(char.element)}` }}>
                {char.image ? <img src={char.image} alt="" /> : <div className={styles.charInitial}>{char.name[0]}</div>}
              </div>
              <div className={styles.pickerInfo}>
                <span className={styles.pickerName}>{char.name}</span>
                <span className={styles.pickerMeta}>{char.position} • {char.element}</span>
              </div>
              <div className={styles.pickerPower}>
                <span className={styles.pwrVal}>{char.power || 0}</span>
                <span className={styles.pwrLabel}>PWR</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── PÁGINA PRINCIPAL ────────────────────────────────────────────────
export default function MiEquipoPage() {
  const { user } = useAuth()
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  const [misEquipos, setMisEquipos] = useState({}) 
  const [equipoSeleccionado, setEquipoSeleccionado] = useState("Nuevo Equipo")
  const [selectingSlot, setSelectingSlot] = useState(null)

  const DEFAULT_FORMATION = [
    { position: 'Portero' }, { position: 'Defensa' }, { position: 'Defensa' },
    { position: 'Defensa' }, { position: 'Defensa' }, { position: 'Centrocampista' },
    { position: 'Centrocampista' }, { position: 'Centrocampista' }, { position: 'Centrocampista' },
    { position: 'Delantero' }, { position: 'Delantero' }
  ];

  const [slots, setSlots] = useState(DEFAULT_FORMATION.map(s => ({ ...s, characterId: null })));

  // Carga inicial
  useEffect(() => {
    async function init() {
      try {
        setLoading(true)
        const allPlayers = await getAllPlayers()
        setCharacters(allPlayers)
        
        if (user?.id) {
          const res = await fetch(`http://127.0.0.1:5000/obtener_usuario/${user.id}`)
          const data = await res.json()
          // Asumimos que en el usuario guardas un objeto 'equipos'
          if (res.ok && data.usuario.equipos) {
            setMisEquipos(data.usuario.equipos)
            const nombres = Object.keys(data.usuario.equipos)
            if (nombres.length > 0) {
              cargarEquipo(nombres[0], data.usuario.equipos[nombres[0]])
            }
          }
        }
      } catch (err) { console.error(err) } finally { setLoading(false) }
    }
    init()
  }, [user?.id])

  const cargarEquipo = (nombre, ids) => {
    setEquipoSeleccionado(nombre)
    setSlots(DEFAULT_FORMATION.map((s, i) => ({ ...s, characterId: ids[i] || null })))
  }

  const handleNewTeam = () => {
    const nuevoNombre = prompt("Nombre del nuevo equipo:")
    if (nuevoNombre && nuevoNombre.trim()) {
      setEquipoSeleccionado(nuevoNombre)
      setSlots(DEFAULT_FORMATION.map(s => ({ ...s, characterId: null })))
    }
  }

  const handleSaveTeam = async () => {
    if (!user?.id) return alert("Inicia sesión para guardar")
    setIsSaving(true)
    try {
      const equipoIds = slots.map(s => s.characterId)
      const res = await fetch('http://127.0.0.1:5000/guardar_equipo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          equipo: equipoIds,
          nombre_equipo: equipoSeleccionado
        })
      })
      if (res.ok) {
        setMisEquipos(prev => ({ ...prev, [equipoSeleccionado]: equipoIds }))
        alert("✅ Equipo guardado correctamente")
      }
    } catch (e) { console.error(e) } finally { setIsSaving(false) }
  }

  const handleDeleteTeam = async () => {
    if (equipoSeleccionado === "Nuevo Equipo") return
    if (!confirm(`¿Estás seguro de borrar "${equipoSeleccionado}"?`)) return
    
    try {
      // Opcional: Llamada al backend para eliminar del objeto
      await fetch('http://127.0.0.1:5000/eliminar_equipo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, nombre_equipo: equipoSeleccionado })
      });

      const nuevosEquipos = { ...misEquipos }
      delete nuevosEquipos[equipoSeleccionado]
      setMisEquipos(nuevosEquipos)
      
      const restantes = Object.keys(nuevosEquipos)
      if (restantes.length > 0) {
        cargarEquipo(restantes[0], nuevosEquipos[restantes[0]])
      } else {
        setEquipoSeleccionado("Nuevo Equipo")
        setSlots(DEFAULT_FORMATION.map(s => ({ ...s, characterId: null })))
      }
    } catch (e) { console.error(e) }
  }

  // Lógica de poder (Reglas de usuario aplicadas)
  const usedIds = slots.filter(s => s.characterId).map(s => s.characterId)
  const totalPower = slots.reduce((sum, slot) => {
    const c = characters.find(ch => (ch.id === slot.characterId || ch._id === slot.characterId))
    if (!c) return sum
    let pwr = c.power || 0
    if (c.relation === 'heredero') pwr *= 0.5 // [cite: 2026-02-27]
    if (c.isCopy) pwr *= 0.3 // [cite: 2026-02-11]
    return sum + pwr
  }, 0)

  if (loading) return <div className={styles.loadingState}><Loader2 className={styles.spinner} /></div>

  return (
    <div className={styles.page}>
      <div className={styles.pageTop}>
        <div className={styles.teamSelectorSection}>
          <div className={styles.selectWrapper}>
            <Folder size={18} className={styles.folderIcon} />
            <select 
              value={equipoSeleccionado} 
              onChange={(e) => cargarEquipo(e.target.value, misEquipos[e.target.value])}
              className={styles.teamDropdown}
            >
              <option value="Nuevo Equipo" disabled>Seleccionar equipo...</option>
              {Object.keys(misEquipos).map(nom => (
                <option key={nom} value={nom}>{nom}</option>
              ))}
            </select>
            <ChevronDown size={16} className={styles.chevronIcon} />
          </div>
          <button onClick={handleNewTeam} className={styles.btnIcon} title="Crear nuevo equipo">
            <PlusCircle size={22} />
          </button>
        </div>

        <div className={styles.topActions}>
          <button className={styles.btnDanger} onClick={handleDeleteTeam} title="Borrar equipo actual">
            <Trash2 size={18} />
          </button>
          <button className={styles.btnSave} onClick={handleSaveTeam} disabled={isSaving}>
            {isSaving ? <Loader2 className={styles.spinner} size={18}/> : <Save size={18}/>}
            <span>Guardar</span>
          </button>
        </div>
      </div>

      <div className={styles.fieldContainer}>
        <div className={styles.soccerField}>
          <div className={styles.areaTop}></div>
          <div className={styles.circleCenter}></div>
          <div className={styles.areaBottom}></div>

          {slots.map((slot, index) => {
            const char = characters.find(c => (c._id === slot.characterId || c.id === slot.characterId));
            return (
              <div key={index} className={`${styles.fieldSlot} ${styles['pos' + index]}`} onClick={() => !char && setSelectingSlot(index)}>
                {char ? (
                  <div className={styles.playerNode}>
                    <div className={styles.playerArt} style={{ borderColor: getElementColor(char.element) }}>
                      {char.image ? <img src={char.image} alt="" /> : <div className={styles.placeholderArt}>{char.name[0]}</div>}
                    </div>
                    <button className={styles.miniRemove} onClick={(e) => { e.stopPropagation(); setSlots(prev => prev.map((s, i) => i === index ? { ...s, characterId: null } : s)); }}>
                      <X size={10} />
                    </button>
                    <div className={styles.playerNameTag}>{char.name.split(' ')[0]}</div>
                    <div className={styles.playerPosTag} style={{background: getElementColor(char.element)}}>{slot.position.substring(0,2).toUpperCase()}</div>
                  </div>
                ) : (
                  <div className={styles.emptyNode}>
                    <Plus size={16} />
                    <small>{slot.position.substring(0,2)}</small>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className={styles.summaryGrid}>
        <div className={styles.summaryBox}>
          <span>{Math.round(totalPower)}</span>
          <small>POTENCIA TOTAL</small>
        </div>
        <div className={styles.summaryBox}>
          <span>{usedIds.length > 0 ? Math.round(totalPower/usedIds.length) : 0}</span>
          <small>MEDIA EQUIPO</small>
        </div>
        <div className={styles.summaryBox}>
          <span>{usedIds.length}/11</span>
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