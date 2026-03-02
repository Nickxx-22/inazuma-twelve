import { useState, useEffect, useMemo } from 'react'
import { Plus, X, Save, Trash2, Search, Loader2, Users } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useMyTeam } from '../hooks/useMyTeam'
import { getElementColor } from '../utils/colors'
import { getAllPlayers } from '../services/playerService'
import styles from './MiEquipoPage.module.css'

// ── PICKER MODAL (Sincronizado con códigos de API) ──────────────────
function CharacterPickerModal({ slotIndex, slotPosition, usedIds, characters, onSelect, onClose }) {
  const [search, setSearch] = useState('')
  const [elFilter, setElFilter] = useState('')
  
  // Mapeo para que el modal use FW, MD, DF, GK automáticamente
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
          <div className={styles.pickerTitleGroup}>
            <h3 className={styles.pickerTitle}>Seleccionar {slotPosition}</h3>
            <span className={styles.pickerCount}>{available.length} jugadores encontrados</span>
          </div>
          <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
        </div>

        <div className={styles.pickerSearch}>
          <Search size={16} className={styles.pickerSearchIcon} />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            className={styles.pickerSearchInput}
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
        </div>

        <div className={styles.pickerFilters}>
          <select value={elFilter} onChange={e => setElFilter(e.target.value)} className={styles.pickerSelect}>
            <option value="">Cualquier Elemento</option>
            {["Fuego", "Bosque", "Aire", "Montaña", "Nada"].map(el => (
              <option key={el} value={el}>{el}</option>
            ))}
          </select>
          <select value={posFilter} onChange={e => setPosFilter(e.target.value)} className={styles.pickerSelect}>
            <option value="">Todas las Posiciones</option>
            <option value="GK">Portero (GK)</option>
            <option value="DF">Defensa (DF)</option>
            <option value="MD">Medio (MD)</option>
            <option value="FW">Delantero (FW)</option>
          </select>
        </div>

        <div className={styles.pickerList}>
          {available.length === 0 ? (
            <div className={styles.noAvail}>
              <Users size={40} strokeWidth={1} style={{ marginBottom: 10, opacity: 0.5 }} />
              <p>No hay jugadores disponibles</p>
            </div>
          ) : (
            available.map(char => (
              <button 
                key={char._id || char.id} 
                className={styles.pickerRow}
                onClick={() => onSelect(slotIndex, char._id || char.id)}
              >
                <div className={styles.pickerAvatar} style={{ borderLeft: `4px solid ${getElementColor(char.element)}` }}>
                  {char.image ? (
                    <img src={char.image} alt={char.name} style={{ objectFit: 'cover' }} />
                  ) : (
                    <div className={styles.charInitial}>{char.name[0]}</div>
                  )}
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
            ))
          )}
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
  const [selectingSlot, setSelectingSlot] = useState(null)

  const {
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
      <div className={styles.pageTop}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>Mi Equipo</h1>
          <select className={styles.formationSelect}><option>4-4-2</option></select>
          <div className={styles.topBadge}><Users size={14}/> {filledSlots}/11</div>
        </div>
        <div className={styles.topActions}>
          <button className={styles.btnSecondary} onClick={handleClear}><Trash2 size={15} /></button>
          <button className={styles.btnSave} onClick={saveLocal}>
            <Save size={15} /> {saved ? 'Guardado' : 'Guardar'}
          </button>
        </div>
      </div>

      <div className={styles.fieldContainer}>
        <div className={styles.soccerField}>
          <div className={styles.areaTop}></div>
          <div className={styles.circleCenter}></div>
          <div className={styles.areaBottom}></div>

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
                    <div className={styles.playerArt} style={{ borderColor: getElementColor(char.element) }}>
                      {char.image ? <img src={char.image} alt="" /> : <div className={styles.placeholderArt}>{char.name[0]}</div>}
                    </div>
                    <button className={styles.miniRemove} onClick={(e) => { e.stopPropagation(); removePlayer(index); }}>
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
            );
          })}
        </div>
      </div>

      <div className={styles.summaryGrid}>
        <div className={styles.summaryBox}><span>{totalPower}</span><small>POTENCIA TOTAL</small></div>
        <div className={styles.summaryBox}><span>{filledSlots > 0 ? Math.round(totalPower/filledSlots) : 0}</span><small>MEDIA PWR</small></div>
      </div>

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