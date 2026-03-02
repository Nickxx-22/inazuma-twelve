import { useState, useEffect } from 'react'
import { Shield, Plus, X, Save, Trash2, Search, Loader2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useMyTeam } from '../hooks/useMyTeam'
import { getElementColor } from '../utils/colors'
import { elements, positions } from '../data/constants'
import { getAllPlayers } from '../services/playerService'
import styles from './MiEquipoPage.module.css'

// --- Picker Modal (Sin cambios, solo corrección de id/_id) ---
function CharacterPickerModal({ slotIndex, slotPosition, usedIds, characters, onSelect, onClose }) {
  const [search, setSearch] = useState('')
  const [elFilter, setElFilter] = useState('')
  const [posFilter, setPosFilter] = useState(slotPosition || '')

  const available = characters
    .filter(c => !usedIds.includes(c._id) && !usedIds.includes(c.id)) // Doble check de ID
    .filter(c => {
      const q = search.toLowerCase()
      return (
        (!search || c.name.toLowerCase().includes(q)) &&
        (!elFilter || c.element === elFilter) &&
        (!posFilter || c.position === posFilter)
      )
    })
    .sort((a, b) => (b.power || 0) - (a.power || 0))

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.pickerModal} onClick={e => e.stopPropagation()}>
        <div className={styles.pickerHeader}>
          <h3>Seleccionar {slotPosition}</h3>
          <button onClick={onClose} className={styles.closeBtn}><X size={18} /></button>
        </div>
        <div className={styles.pickerSearch}>
          <Search size={14} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..." />
        </div>
        <div className={styles.pickerList}>
          {available.map(char => (
            <button key={char._id || char.id} onClick={() => onSelect(slotIndex, char._id || char.id)} className={styles.pickerRow}>
              <div className={styles.pickerAvatar} style={{ background: getElementColor(char.element) }}>
                {char.image ? <img src={char.image} alt="" /> : char.name[0]}
              </div>
              <div className={styles.pickerInfo}>
                <span className={styles.pickerName}>{char.name}</span>
                <span className={styles.pickerMeta}>{char.element} · PWR {char.power}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function MiEquipoPage() {
  const { user } = useAuth()
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectingSlot, setSelectingSlot] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  // Extraemos las funciones del Hook
  const {
    teamName, setTeamName, slots, addPlayer, removePlayer,
    handleSave: saveLocal, handleClear, loadTeamFromDB,
    saved, usedIds, filledSlots, totalPower,
  } = useMyTeam(characters)

  // ÚNICO useEffect para cargar todo al inicio
  useEffect(() => {
    async function cargarTodo() {
      try {
        setLoading(true)
        // 1. Cargar Jugadores
        const todos = await getAllPlayers()
        setCharacters(todos)

        // 2. Cargar Equipo del Usuario
        if (user?.id) {
          const res = await fetch(`http://127.0.0.1:5000/obtener_equipo/${user.id}`)
          if (res.ok) {
            const data = await res.json()
            if (data.equipo) {
              loadTeamFromDB(data.equipo, data.nombre_equipo)
            }
          }
        }
      } catch (err) {
        console.error("Error inicial:", err)
      } finally {
        setLoading(false)
      }
    }
    cargarTodo()
  }, [user?.id]) // Solo se ejecuta cuando el usuario cambia o entra

  async function handleCloudSave() {
    if (!user) return alert("Inicia sesión")
    setIsSaving(true)
    try {
      const response = await fetch('http://127.0.0.1:5000/guardar_equipo', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('inazuma-token')
        },
        body: JSON.stringify({
          user_id: user.id,
          nombre_equipo: teamName,
          equipo: slots.map(s => s.characterId)
        })
      })
      if (response.ok) saveLocal()
    } catch (err) {
      alert("Error al guardar")
    } finally { setIsSaving(false) }
  }

  if (loading) return <div className={styles.loadingState}><Loader2 className="spinner" /></div>

  const GROUPS = [
    { label: 'Portero', slots: slots.map((s, i) => ({ ...s, index: i })).filter(s => s.position === 'Portero') },
    { label: 'Defensa', slots: slots.map((s, i) => ({ ...s, index: i })).filter(s => s.position === 'Defensa') },
    { label: 'Centrocampista', slots: slots.map((s, i) => ({ ...s, index: i })).filter(s => s.position === 'Centrocampista') },
    { label: 'Delantero', slots: slots.map((s, i) => ({ ...s, index: i })).filter(s => s.position === 'Delantero') },
  ]

  return (
    <div className={styles.page}>
      <header className={styles.pageTop}>
        <h1>Mi Equipo</h1>
        <div className={styles.topActions}>
          <button onClick={handleClear} className={styles.btnSecondary}><Trash2 size={15}/> Limpiar</button>
          <button onClick={handleCloudSave} className={styles.btnSave} disabled={isSaving}>
            <Save size={15}/> {saved ? '¡Guardado!' : 'Guardar en Nube'}
          </button>
        </div>
      </header>

      {/* Resumen de Potencia */}
      <div className={styles.summaryGrid}>
        <div className={styles.summaryBox}>
            <span>{totalPower}</span>
            <small>POTENCIA TOTAL</small>
        </div>
      </div>

      <input 
        className={styles.nameInput} 
        value={teamName} 
        onChange={e => setTeamName(e.target.value)} 
        placeholder="Nombre del equipo"
      />

      {GROUPS.map(group => (
        <div key={group.label} className={styles.group}>
          <h3 className={styles.groupLabel}>{group.label}</h3>
          <div className={styles.groupGrid}>
            {group.slots.map(slot => {
              // Buscamos el personaje por ID o _ID
              const char = characters.find(c => c._id === slot.characterId || c.id === slot.characterId)
              return (
                <div key={slot.index} className={styles.slot}>
                  {char ? (
                    <div className={styles.filledSlot}>
                      <span>{char.name}</span>
                      <button onClick={() => removePlayer(slot.index)}><X size={12}/></button>
                    </div>
                  ) : (
                    <button className={styles.emptySlot} onClick={() => setSelectingSlot(slot.index)}>
                      <Plus size={16}/> Añadir
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {selectingSlot !== null && (
        <CharacterPickerModal
          slotIndex={selectingSlot}
          slotPosition={slots[selectingSlot].position}
          usedIds={usedIds}
          characters={characters}
          onSelect={(idx, id) => { addPlayer(idx, id); setSelectingSlot(null); }}
          onClose={() => setSelectingSlot(null)}
        />
      )}
    </div>
  )
}