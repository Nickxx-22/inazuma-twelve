import { useState, useEffect, useMemo } from 'react'
import { Plus, X, Save, Trash2, Search, Loader2, ChevronDown, Folder, PlusCircle, Edit3, Check } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { getElementColor } from '../utils/colors'
import { getAllPlayers } from '../services/playerService'
import styles from './MiEquipoPage.module.css'

// (CharacterPickerModal se mantiene igual que en tu código previo)

export default function MiEquipoPage() {
  const { user } = useAuth()
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const [misEquipos, setMisEquipos] = useState({}) 
  const [equipoSeleccionado, setEquipoSeleccionado] = useState("Nuevo Equipo")
  const [nombreTemporal, setNombreTemporal] = useState("") // Para editar el nombre
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
              setEquipoSeleccionado(inicial)
              setNombreTemporal(inicial)
              setSlots(DEFAULT_FORMATION.map((s, i) => ({ ...s, characterId: data.usuario.equipos[inicial][i] || null })))
            }
          }
        }
      } catch (err) { console.error(err) } finally { setLoading(false) }
    }
    init()
  }, [user?.id])

  const cargarEquipo = (nombre) => {
    setEquipoSeleccionado(nombre)
    setNombreTemporal(nombre)
    const ids = misEquipos[nombre] || []
    setSlots(DEFAULT_FORMATION.map((s, i) => ({ ...s, characterId: ids[i] || null })))
  }

  const handleNewTeam = () => {
    const nuevo = "Nuevo Equipo " + (Object.keys(misEquipos).length + 1)
    setEquipoSeleccionado(nuevo)
    setNombreTemporal(nuevo)
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
        body: JSON.stringify({
          user_id: user.id,
          equipo: equipoIds,
          nombre_equipo: nombreTemporal // Usamos el nombre del input
        })
      })
      if (res.ok) {
        setMisEquipos(prev => ({ ...prev, [nombreTemporal]: equipoIds }))
        setEquipoSeleccionado(nombreTemporal)
        alert("Equipo guardado con éxito")
      }
    } catch (e) { console.error(e) } finally { setIsSaving(false) }
  }

  const handleDeleteTeam = async () => {
    if (!user?.id || equipoSeleccionado === "Nuevo Equipo") return
    if (!confirm(`¿Borrar definitivamente "${equipoSeleccionado}"?`)) return
    
    setIsDeleting(true)
    try {
      const res = await fetch('http://127.0.0.1:5000/eliminar_equipo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, nombre_equipo: equipoSeleccionado })
      })

      if (res.ok) {
        const nuevosEquipos = { ...misEquipos }
        delete nuevosEquipos[equipoSeleccionado]
        setMisEquipos(nuevosEquipos)
        
        const restantes = Object.keys(nuevosEquipos)
        if (restantes.length > 0) {
          cargarEquipo(restantes[0])
        } else {
          handleNewTeam()
        }
      }
    } catch (e) { console.error(e) } finally { setIsDeleting(false) }
  }

  // Reglas de poder: 0.3 copia, 0.5 heredero
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
      {/* HEADER REDISEÑADO */}
      <div className={styles.pageTop}>
        <div className={styles.managementCard}>
          <div className={styles.selectorArea}>
            <div className={styles.customSelect}>
              <Folder size={16} className={styles.iconMuted} />
              <select 
                value={equipoSeleccionado} 
                onChange={(e) => cargarEquipo(e.target.value)}
              >
                {Object.keys(misEquipos).length === 0 && <option>No hay equipos</option>}
                {Object.keys(misEquipos).map(nom => (
                  <option key={nom} value={nom}>{nom}</option>
                ))}
              </select>
              <ChevronDown size={14} />
            </div>
            <button onClick={handleNewTeam} className={styles.actionCircle} title="Nuevo equipo">
              <PlusCircle size={20} />
            </button>
          </div>

          <div className={styles.nameArea}>
            <Edit3 size={14} className={styles.iconMuted} />
            <input 
              type="text" 
              className={styles.nameInput}
              value={nombreTemporal}
              onChange={(e) => setNombreTemporal(e.target.value)}
              placeholder="Nombre del equipo..."
            />
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
        {/* (Aquí va tu soccerField igual que antes) */}
      </div>

      <div className={styles.summaryGrid}>
        {/* (Aquí van tus summaryBox igual que antes) */}
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