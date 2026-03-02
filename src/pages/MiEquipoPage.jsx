import { useState, useEffect, useMemo } from 'react'
import { Plus, X, Save, Trash2, Search, Loader2, Users, Check, ChevronDown, Folder, PlusCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { getElementColor } from '../utils/colors'
import { getAllPlayers } from '../services/playerService'
import styles from './MiEquipoPage.module.css'

export default function MiEquipoPage() {
  const { user } = useAuth()
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  // ESTADOS DE EQUIPOS
  const [misEquipos, setMisEquipos] = useState({}) // { "Equipo A": [ids], "Equipo B": [ids] }
  const [equipoSeleccionado, setEquipoSeleccionado] = useState("Nuevo Equipo")
  const [selectingSlot, setSelectingSlot] = useState(null)

  const DEFAULT_FORMATION = [
    { position: 'Portero' }, { position: 'Defensa' }, { position: 'Defensa' },
    { position: 'Defensa' }, { position: 'Defensa' }, { position: 'Centrocampista' },
    { position: 'Centrocampista' }, { position: 'Centrocampista' }, { position: 'Centrocampista' },
    { position: 'Delantero' }, { position: 'Delantero' }
  ];

  const [slots, setSlots] = useState(DEFAULT_FORMATION.map(s => ({ ...s, characterId: null })));

  // Carga inicial de jugadores y equipos del usuario
  useEffect(() => {
    async function init() {
      try {
        setLoading(true)
        const allPlayers = await getAllPlayers()
        setCharacters(allPlayers)
        
        if (user?.id) {
          const res = await fetch(`http://127.0.0.1:5000/obtener_usuario/${user.id}`)
          const data = await res.json()
          if (res.ok && data.usuario.equipos_guardados) {
            setMisEquipos(data.usuario.equipos_guardados)
            // Si hay equipos, cargar el primero por defecto
            const nombres = Object.keys(data.usuario.equipos_guardados)
            if (nombres.length > 0) {
              cargarEquipo(nombres[0], data.usuario.equipos_guardados[nombres[0]])
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
    if (nuevoNombre) {
      setEquipoSeleccionado(nuevoNombre)
      setSlots(DEFAULT_FORMATION.map(s => ({ ...s, characterId: null })))
    }
  }

  const handleSaveTeam = async () => {
    if (!user?.id) return alert("Inicia sesión")
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
        alert("Equipo guardado!")
      }
    } catch (e) { console.error(e) } finally { setIsSaving(false) }
  }

  const handleDeleteTeam = async () => {
    if (!confirm(`¿Borrar "${equipoSeleccionado}"?`)) return
    // Aquí llamarías a un endpoint de borrado o actualizarías el documento quitando esa clave
    const nuevosEquipos = { ...misEquipos }
    delete nuevosEquipos[equipoSeleccionado]
    setMisEquipos(nuevosEquipos)
    // Volver al estado inicial
    setSlots(DEFAULT_FORMATION.map(s => ({ ...s, characterId: null })))
    setEquipoSeleccionado("Nuevo Equipo")
  }

  // Lógica de cálculo (0.3 copia, 0.5 heredero)
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
        <div className={styles.teamSelectorSection}>
          <div className={styles.selectWrapper}>
            <Folder size={18} />
            <select 
              value={equipoSeleccionado} 
              onChange={(e) => cargarEquipo(e.target.value, misEquipos[e.target.value])}
              className={styles.teamDropdown}
            >
              <option value="Nuevo Equipo">Seleccionar equipo...</option>
              {Object.keys(misEquipos).map(nom => (
                <option key={nom} value={nom}>{nom}</option>
              ))}
            </select>
            <ChevronDown size={16} />
          </div>
          <button onClick={handleNewTeam} className={styles.btnIcon} title="Nuevo equipo">
            <PlusCircle size={20} />
          </button>
        </div>

        <div className={styles.topActions}>
          <button className={styles.btnDanger} onClick={handleDeleteTeam} title="Eliminar equipo actual">
            <Trash2 size={18} />
          </button>
          <button className={styles.btnSave} onClick={handleSaveTeam} disabled={isSaving}>
            {isSaving ? <Loader2 className={styles.spinner} size={18}/> : <Save size={18}/>}
            Guardar
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
                  </div>
                ) : (
                  <div className={styles.emptyNode}><Plus size={16} /></div>
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