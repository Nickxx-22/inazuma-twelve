import { useState, useEffect, useMemo } from 'react'
import { Plus, X, Save, Trash2, Search, Loader2, Users } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { getElementColor } from '../utils/colors'
import { getAllPlayers } from '../services/playerService'
import styles from './MiEquipoPage.module.css'

// ── PICKER MODAL ────────────────────────────────────────────────────
function CharacterPickerModal({ slotIndex, slotPosition, usedIds, characters, onSelect, onClose }) {
  const [search, setSearch] = useState('')
  const [elFilter, setElFilter] = useState('')
  
  // Sincronización estricta con los códigos de tu base de datos
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
            <span className={styles.pickerCount}>{available.length} jugadores encontrados</span>
          </div>
          <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
        </div>

        <div className={styles.pickerSearch}>
          <Search size={18} className={styles.pickerSearchIcon} />
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
            {["Fuego", "Bosque", "Aire", "Montaña"].map(el => (
              <option key={el} value={el}>{el}</option>
            ))}
          </select>
          <select value={posFilter} onChange={e => setPosFilter(e.target.value)} className={styles.pickerSelect}>
            <option value="">Posiciones</option>
            <option value="GK">Portero (GK)</option>
            <option value="DF">Defensa (DF)</option>
            <option value="MD">Medio (MD)</option>
            <option value="FW">Delantero (FW)</option>
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

// ── HOOK DE LÓGICA ──────────────────────────────────────────────────
const DEFAULT_FORMATION = [
  { position: 'Portero',          characterId: null }, // 0
  { position: 'Defensa',          characterId: null }, // 1
  { position: 'Defensa',          characterId: null }, // 2
  { position: 'Defensa',          characterId: null }, // 3
  { position: 'Defensa',          characterId: null }, // 4: Abajo derecha corregido a Defensa
  { position: 'Centrocampista',   characterId: null }, // 5
  { position: 'Centrocampista',   characterId: null }, // 6
  { position: 'Centrocampista',   characterId: null }, // 7
  { position: 'Centrocampista',   characterId: null }, // 8
  { position: 'Delantero',        characterId: null }, // 9
  { position: 'Delantero',        characterId: null }, // 10
]

export function useMyTeam(characters = []) {
  const [teamName, setTeamName] = useState('Mi Equipo')
  const [slots, setSlots] = useState(DEFAULT_FORMATION)
  const [saved, setSaved] = useState(false)

  const loadFromMongo = (equipoIds, nombre) => {
    if (nombre) setTeamName(nombre);
    if (equipoIds) {
      setSlots(prev => prev.map((s, i) => ({ ...s, characterId: equipoIds[i] || null })));
    }
  };

  const totalPower = slots.reduce((sum, slot) => {
    const c = characters.find(ch => (ch.id === slot.characterId || ch._id === slot.characterId));
    if (!c) return sum;

    // Se incluye el campo matchStats en el JSON del jugador [cite: 2026-02-25]
    let pwr = c.power || 0;
    if (c.relation === 'heredero') pwr *= 0.5; // Modificador heredero 0.5 [cite: 2026-02-27]
    if (c.isCopy) pwr *= 0.3; // Modificador copia 0.3 [cite: 2026-02-11]

    return sum + pwr;
  }, 0);

  return {
    slots, addPlayer: (idx, id) => setSlots(prev => prev.map((s, i) => i === idx ? { ...s, characterId: id } : s)),
    removePlayer: (idx) => setSlots(prev => prev.map((s, i) => i === idx ? { ...s, characterId: null } : s)),
    handleClear: () => setSlots(DEFAULT_FORMATION),
    loadFromMongo, usedIds: slots.filter(s => s.characterId).map(s => s.characterId),
    filledSlots: slots.filter(s => s.characterId).length, totalPower, saved
  }
}

// ── PÁGINA PRINCIPAL ────────────────────────────────────────────────
export default function MiEquipoPage() {
  const { user } = useAuth()
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectingSlot, setSelectingSlot] = useState(null)

  const { slots, addPlayer, removePlayer, handleClear, loadFromMongo, saved, usedIds, filledSlots, totalPower } = useMyTeam(characters)

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
          <div className={styles.topBadge}><Users size={14}/> {filledSlots}/11</div>
        </div>
        <div className={styles.topActions}>
          <button className={styles.btnSecondary} onClick={handleClear}><Trash2 size={15} /></button>
          <button className={styles.btnSave}>{saved ? 'Guardado' : 'Guardar'}</button>
        </div>
      </div>

      <div className={styles.fieldContainer}>
        <div className={styles.soccerField}>
          {slots.map((slot, index) => {
            const char = characters.find(c => (c._id === slot.characterId || c.id === slot.characterId));
            return (
              <div key={index} className={`${styles.fieldSlot} ${styles['pos' + index]}`} onClick={() => !char && setSelectingSlot(index)}>
                {char ? (
                  <div className={styles.playerNode}>
                    <div className={styles.playerArt} style={{ borderColor: getElementColor(char.element) }}>
                      {char.image ? <img src={char.image} alt="" /> : <div className={styles.placeholderArt}>{char.name[0]}</div>}
                    </div>
                    <button className={styles.miniRemove} onClick={(e) => { e.stopPropagation(); removePlayer(index); }}><X size={10} /></button>
                    <div className={styles.playerNameTag}>{char.name.split(' ')[0]}</div>
                    <div className={styles.playerPosTag} style={{background: getElementColor(char.element)}}>
                        {/* Ahora mostrará DE correctamente para los 4 de abajo */}
                        {slot.position.substring(0,2).toUpperCase()}
                    </div>
                  </div>
                ) : (
                  <div className={styles.emptyNode}><Plus size={16} /><small>{slot.position.substring(0,2)}</small></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.summaryGrid}>
        <div className={styles.summaryBox}><span>{Math.round(totalPower)}</span><small>POTENCIA TOTAL</small></div>
      </div>

      {selectingSlot !== null && (
        <CharacterPickerModal 
          slotIndex={selectingSlot} slotPosition={slots[selectingSlot].position}
          usedIds={usedIds} characters={characters}
          onSelect={(idx, id) => { addPlayer(idx, id); setSelectingSlot(null); }}
          onClose={() => setSelectingSlot(null)}
        />
      )}
    </div>
  )
}