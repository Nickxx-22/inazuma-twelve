import { useState, useEffect } from 'react'
import { Shield, Plus, X, Save, Trash2, Search, Loader2, Download, Users } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useMyTeam } from '../hooks/useMyTeam'
import { getElementColor } from '../utils/colors'
import { getAllPlayers } from '../services/playerService'
import styles from './MiEquipoPage.module.css'

export default function MiEquipoPage() {
  const { user } = useAuth()
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)
  const [isCloudSaving, setIsCloudSaving] = useState(false)
  const [selectingSlot, setSelectingSlot] = useState(null)

  const {
    teamName, setTeamName,
    slots, addPlayer, removePlayer,
    handleSave: saveLocal, handleClear,
    loadFromMongo,
    saved, usedIds, filledSlots, totalPower,
  } = useMyTeam(characters)

  useEffect(() => {
    async function init() {
      try {
        setLoading(true)
        const allPlayers = await getAllPlayers()
        setCharacters(allPlayers)
        if (user?.id) {
          const res = await fetch(`http://127.0.0.1:5000/obtener_equipo/${user.id}`)
          const data = await res.json()
          if (res.ok && data.equipo) loadFromMongo(data.equipo, data.nombre_equipo)
        }
      } catch (err) { console.error(err) } finally { setLoading(false) }
    }
    init()
  }, [user?.id])

  if (loading) return <div className={styles.loadingState}><Loader2 className={styles.spinner} /></div>

  return (
    <div className={styles.page}>
      {/* HEADER SUPERIOR */}
      <div className={styles.pageTop}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>Mi Equipo</h1>
          <select className={styles.formationSelect}><option>4-4-2</option></select>
          <div className={styles.topBadge}><Users size={14}/> {filledSlots}/11</div>
        </div>
        <div className={styles.topActions}>
          <button className={styles.btnSecondary} onClick={() => {/* Lógica para ver otros equipos */}}>
            <Download size={15} /> Importar
          </button>
          <button className={styles.btnSecondary} onClick={handleClear}><Trash2 size={15} /></button>
          <button className={styles.btnSave} onClick={saveLocal} disabled={isCloudSaving}>
            <Save size={15} /> {saved ? 'Guardado' : 'Guardar'}
          </button>
        </div>
      </div>

      {/* CAMPO DE JUEGO */}
      <div className={styles.fieldContainer}>
        <div className={styles.soccerField}>
          {/* Líneas del campo (decoración CSS) */}
          <div className={styles.areaTop}></div>
          <div className={styles.circleCenter}></div>
          <div className={styles.areaBottom}></div>

          {/* ... dentro de soccerField ... */}
          {slots.map((slot, index) => {
            const char = slot.characterId ? characters.find(c => (c._id === slot.characterId || c.id === slot.characterId)) : null;
            return (
              <div 
                key={index} 
                className={`${styles.fieldSlot} ${styles['pos' + index]}`}
                onClick={() => !char && setSelectingSlot(index)}
              >
                {char ? (
                  <div className={styles.playerNode}>
                    {/* Círculo con borde de color de elemento */}
                    <div className={styles.playerArt} style={{ borderColor: getElementColor(char.element) }}>
                      {char.image ? <img src={char.image} alt="" /> : <div className={styles.placeholderArt}>{char.name[0]}</div>}
                    </div>
                    {/* Botón eliminar mini, ahora fuera de playerArt para mejor hover */}
                    <button className={styles.miniRemove} onClick={(e) => { e.stopPropagation(); removePlayer(index); }}>
                      <X size={10} />
                    </button>
                    
                    {/* Etiquetas de texto debajo */}
                    <div className={styles.playerNameTag}>{char.name.split(' ')[0]}</div>
                    <div className={styles.playerPosTag} style={{background: getElementColor(char.element)}}>{slot.position.substring(0,2).toUpperCase()}</div>
                  </div>
                ) : (
                  // Nodo vacío ajustado
                  <div className={styles.emptyNode}>
                    <Plus size={16} />
                    <small>{slot.position.substring(0,2)}</small>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* STATS INFERIORES */}
      <div className={styles.summaryGrid}>
        <div className={styles.summaryBox}><span>{totalPower}</span><small>POTENCIA TOTAL</small></div>
        <div className={styles.summaryBox}><span>{filledSlots > 0 ? Math.round(totalPower/filledSlots) : 0}</span><small>MEDIA PWR</small></div>
      </div>

      {/* MODAL (mantenemos el anterior) */}
      {selectingSlot !== null && (
        <CharacterPickerModal 
            slotIndex={selectingSlot} 
            slotPosition={slots[selectingSlot].position}
            usedIds={usedIds} characters={characters}
            onSelect={(idx, id) => { addPlayer(idx, id); setSelectingSlot(null); }}
            onClose={() => setSelectingSlot(null)}
        />
      )}
    </div>
  )
}