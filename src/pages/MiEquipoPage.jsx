import { useState, useEffect } from 'react'
import { Shield, Plus, X, Save, Trash2, Search, Loader2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useMyTeam } from '../hooks/useMyTeam'
import { getElementColor } from '../utils/colors'
import { elements, positions } from '../data/constants'
import { getAllPlayers } from '../services/playerService' // Crea este servicio si no existe
import styles from './MiEquipoPage.module.css'

// ── Picker Modal ────────────────────────────────────────────────────
function CharacterPickerModal({ slotIndex, slotPosition, usedIds, characters, onSelect, onClose }) {
  const [search, setSearch] = useState('')
  const [elFilter, setElFilter] = useState('')
  const [posFilter, setPosFilter] = useState(slotPosition || '') // Filtro inteligente por defecto

  const available = characters
    .filter(c => !usedIds.includes(c.id))
    .filter(c => {
      const q = search.toLowerCase()
      return (
        (!search    || c.name.toLowerCase().includes(q) || (c.japaneseName && c.japaneseName.toLowerCase().includes(q))) &&
        (!elFilter  || c.element  === elFilter) &&
        (!posFilter || c.position === posFilter)
      )
    })
    .sort((a, b) => (b.power || 0) - (a.power || 0))

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.pickerModal} onClick={e => e.stopPropagation()}>
        <div className={styles.pickerHeader}>
          <div>
            <h3 className={styles.pickerTitle}>Seleccionar Jugador</h3>
            <p className={styles.pickerSub}>Slot {slotIndex + 1} — {slotPosition}</p>
          </div>
          <button onClick={onClose} className={styles.closeBtn}><X size={18} /></button>
        </div>

        <div className={styles.pickerSearch}>
          <Search size={14} className={styles.pickerSearchIcon} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar jugador..."
            className={styles.pickerSearchInput}
            autoFocus
          />
        </div>

        <div className={styles.pickerFilters}>
          <select value={elFilter} onChange={e => setElFilter(e.target.value)} className={styles.pickerSelect}>
            <option value="">Elemento</option>
            {elements.map(el => <option key={el} value={el}>{el}</option>)}
          </select>
          <select value={posFilter} onChange={e => setPosFilter(e.target.value)} className={styles.pickerSelect}>
            <option value="">Posición</option>
            {positions.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <p className={styles.pickerCount}>{available.length} jugadores disponibles</p>

        <div className={styles.pickerList}>
          {available.length === 0
            ? <p className={styles.noAvail}>No se encontraron jugadores</p>
            : available.map(char => (
              <button key={char.id} onClick={() => onSelect(slotIndex, char.id)} className={styles.pickerRow}>
                <div className={styles.pickerAvatar} style={{ background: getElementColor(char.element) }}>
                  {char.image ? <img src={char.image} alt={char.name} /> : char.name.charAt(0)}
                </div>
                <div className={styles.pickerInfo}>
                  <span className={styles.pickerName}>{char.name}</span>
                  <span className={styles.pickerMeta}>{char.position} — {char.element}</span>
                </div>
                <div className={styles.pickerPower}>
                  <span>{char.power}</span><small>PWR</small>
                </div>
              </button>
            ))
          }
        </div>
      </div>
    </div>
  )
}

// ── Página principal ────────────────────────────────────────────────
export default function MiEquipoPage() {
  const { user } = useAuth()
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)

  // Carga real de jugadores desde tu API de Flask
  useEffect(() => {
  const cargarDatos = async () => {
    try {
      // 1. Cargamos todos los personajes para el Picker
      const todosLosJugadores = await getAllPlayers();
      setCharacters(todosLosJugadores);

      // 2. Si hay usuario, traemos su equipo de la DB
      if (user?.id) {
        const res = await fetch(`http://127.0.0.1:5000/obtener_equipo/${user.id}`);
        const data = await res.json();
        
        if (res.ok && data.equipo.length > 0) {
          // Aquí usamos una función de tu hook useMyTeam para "setear" los slots
          // Asumiendo que tu hook tiene una función llamada 'loadTeam'
          loadTeam(data.equipo, data.nombre_equipo);
        }
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };
  cargarDatos();
}, [user]);

  // En MiEquipoPage.jsx
  const {
    teamName, setTeamName,
    slots,
    addPlayer, removePlayer,
    handleSave: saveLocal, handleClear,
    loadTeamFromDB, // <-- Añade esto aquí
    saved, usedIds, filledSlots, totalPower,
  } = useMyTeam(characters);

  // Y en el useEffect, cámbialo por:
  if (res.ok && data.equipo) {
    loadTeamFromDB(data.equipo, data.nombre_equipo);
  }

  const [selectingSlot, setSelectingSlot] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  function handleSelect(slotIndex, characterId) {
    addPlayer(slotIndex, characterId)
    setSelectingSlot(null)
  }

  // Persistencia en base de datos
  async function handleCloudSave() {
    if (!user) {
      alert("Debes iniciar sesión para guardar tu equipo");
      return;
    }

    setIsSaving(true);
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
          equipo: slots.map(s => s.characterId) // Array de IDs
        })
      });

      if (response.ok) {
        saveLocal(); // Actualiza el estado visual de "Guardado"
      } else {
        throw new Error("Error al guardar en el servidor");
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  const GROUPS = [
    { label: 'Portero',        slots: slots.map((s, i) => ({ ...s, index: i })).filter(s => s.position === 'Portero') },
    { label: 'Defensa',        slots: slots.map((s, i) => ({ ...s, index: i })).filter(s => s.position === 'Defensa') },
    { label: 'Centrocampista', slots: slots.map((s, i) => ({ ...s, index: i })).filter(s => s.position === 'Centrocampista') },
    { label: 'Delantero',      slots: slots.map((s, i) => ({ ...s, index: i })).filter(s => s.position === 'Delantero') },
  ]

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <Loader2 className="spinner" size={40} />
        <p>Cargando plantilla...</p>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageTop}>
        <div>
          <div className={styles.titleRow}>
            <Shield size={22} style={{ color: 'var(--neon-pink)' }} />
            <h1 className={styles.title}>Mi Equipo</h1>
          </div>
          <p className={styles.subtitle}>Hola, {user?.username}! Crea tu equipo ideal</p>
        </div>
        <div className={styles.topActions}>
          <button onClick={handleClear} className={styles.btnSecondary}>
            <Trash2 size={15} /> Limpiar
          </button>
          <button 
            onClick={handleCloudSave} 
            className={`${styles.btnSave} ${saved ? styles.btnSaved : ''}`}
            disabled={isSaving}
          >
            {isSaving ? <Loader2 size={15} className="spinner" /> : <Save size={15} />}
            {saved ? '¡Guardado!' : 'Guardar'}
          </button>
        </div>
      </div>

      <div className={styles.summaryGrid}>
        <div className={styles.summaryBox}>
          <span>{filledSlots}<span className={styles.divider}>/11</span></span>
          <small>Jugadores</small>
        </div>
        <div className={styles.summaryBox}>
          <span style={{ color: 'var(--neon-orange)' }}>{totalPower}</span>
          <small>Potencia Total</small>
        </div>
        <div className={styles.summaryBox}>
          <span style={{ color: 'var(--neon-blue)' }}>
            {filledSlots > 0 ? Math.round(totalPower / filledSlots) : 0}
          </span>
          <small>Media PWR</small>
        </div>
      </div>

      <div className={styles.nameBox}>
        <label className={styles.nameLabel}>Nombre del equipo</label>
        <input
          type="text"
          value={teamName}
          onChange={e => setTeamName(e.target.value)}
          className={styles.nameInput}
        />
      </div>

      {GROUPS.map(group => (
        <div key={group.label} className={styles.group}>
          <h3 className={styles.groupLabel}>
            {group.label} ({group.slots.filter(s => s.characterId).length}/{group.slots.length})
          </h3>
          <div className={styles.groupGrid}>
            {group.slots.map(slot => {
              const char = slot.characterId ? characters.find(c => c.id === slot.characterId) : null
              return (
                <div key={slot.index} className={styles.slot}>
                  {char ? (
                    <div className={styles.filledSlot}>
                      <div className={styles.filledAvatar} style={{ background: getElementColor(char.element) }}>
                         {char.image ? <img src={char.image} alt={char.name} /> : char.name.charAt(0)}
                      </div>
                      <div className={styles.filledInfo}>
                        <span className={styles.filledName}>{char.name}</span>
                        <span className={styles.filledMeta}>{char.element} · PWR {char.power}</span>
                      </div>
                      <button
                        onClick={() => removePlayer(slot.index)}
                        className={styles.removeBtn}
                        aria-label={`Quitar ${char.name}`}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectingSlot(slot.index)}
                      className={styles.emptySlot}
                    >
                      <Plus size={16} /> Añadir {group.label}
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
          onSelect={handleSelect}
          onClose={() => setSelectingSlot(null)}
        />
      )}
    </div>
  )
}