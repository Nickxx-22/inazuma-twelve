import { useState, useEffect, useMemo, useCallback } from 'react'
import { Plus, X, Save, Trash2, Search, Loader2, Folder, PlusCircle, Check, Shield } from 'lucide-react'
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
      const charId = c._id || c.id;
      if (usedIds.includes(charId)) return false;
      const q = search.toLowerCase();
      const matchesSearch = !search || c.name.toLowerCase().includes(q);
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
            <h3 className={styles.pickerTitle}>FICHAR {slotPosition.toUpperCase()}</h3>
            <span className={styles.pickerCount}>{available.length} disponibles</span>
          </div>
          <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
        </div>
        <div className={styles.pickerSearchArea}>
          <div className={styles.searchWrapper}>
            <Search size={16} className={styles.searchIcon} />
            <input className={styles.pickerSearchInput} placeholder="Buscar jugador..." value={search} onChange={e => setSearch(e.target.value)} autoFocus />
          </div>
          <div className={styles.filterRow}>
            <select value={elFilter} onChange={e => setElFilter(e.target.value)}>
              <option value="">Todos los elementos</option>
              {["Fuego", "Bosque", "Aire", "Montaña"].map(el => <option key={el} value={el}>{el}</option>)}
            </select>
            <select value={posFilter} onChange={e => setPosFilter(e.target.value)}>
              <option value="">Todas las pos.</option>
              <option value="GK">GK</option><option value="DF">DF</option><option value="MD">MD</option><option value="FW">FW</option>
            </select>
          </div>
        </div>
        <div className={styles.pickerList}>
          {available.map(char => (
            <div key={char._id || char.id} className={styles.pickerRow} onClick={() => onSelect(slotIndex, char._id || char.id)}>
              <div className={styles.pickerAvatarWrapper} style={{ borderLeft: `3px solid ${getElementColor(char.element)}` }}>
                <img src={char.image} alt="" className={styles.pickerAvatarImg} />
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
  const [saveStatus, setSaveStatus] = useState('idle')
  const [selectingSlot, setSelectingSlot] = useState(null)
  
  const [misEquipos, setMisEquipos] = useState({})
  const [equipoSeleccionado, setEquipoSeleccionado] = useState("")
  const [nombreTemp, setNombreTemp] = useState("")

  const FORMATION = [
    { position: 'Portero' }, { position: 'Defensa' }, { position: 'Defensa' },
    { position: 'Defensa' }, { position: 'Defensa' }, { position: 'Centrocampista' },
    { position: 'Centrocampista' }, { position: 'Centrocampista' }, { position: 'Centrocampista' },
    { position: 'Delantero' }, { position: 'Delantero' }
  ];

  const [slots, setSlots] = useState(FORMATION.map(s => ({ ...s, characterId: null })));

  // Carga de datos robusta
  useEffect(() => {
    let isMounted = true;
    async function init() {
      const token = localStorage.getItem('inazuma-token');
      const userId = user?.id || user?._id || JSON.parse(localStorage.getItem('inazuma-user'))?.id;

      if (!userId || !token) {
        setLoading(false);
        return;
      }

      try {
        const [allPlayers, res] = await Promise.all([
          getAllPlayers(),
          fetch(`http://127.0.0.1:5000/obtener_usuario/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (!isMounted) return;
        setCharacters(allPlayers);

        const data = await res.json();
        if (res.ok && data.usuario?.equipos) {
          setMisEquipos(data.usuario.equipos);
          const names = Object.keys(data.usuario.equipos);
          if (names.length > 0) {
            setEquipoSeleccionado(names[0]);
            setNombreTemp(names[0]);
            const ids = data.usuario.equipos[names[0]];
            setSlots(FORMATION.map((s, i) => ({ ...s, characterId: ids[i] || null })));
          }
        }
      } catch (err) {
        console.error("Error en init:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    init();
    return () => { isMounted = false; };
  }, [user]);

  const handleSelectTeam = (name) => {
    setEquipoSeleccionado(name);
    setNombreTemp(name);
    const ids = misEquipos[name] || [];
    setSlots(FORMATION.map((s, i) => ({ ...s, characterId: ids[i] || null })));
  };

  const handleSave = async () => {
    const token = localStorage.getItem('inazuma-token');
    const userId = user?.id || user?._id;
    if (!userId || !token || !nombreTemp.trim()) return;

    setIsSaving(true);
    try {
      const ids = slots.map(s => s.characterId);
      const res = await fetch('http://127.0.0.1:5000/guardar_equipo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ user_id: userId, equipo: ids, nombre_equipo: nombreTemp })
      });
      if (res.ok) {
        setMisEquipos(prev => ({ ...prev, [nombreTemp]: ids }));
        setEquipoSeleccionado(nombreTemp);
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    } catch (e) { setSaveStatus('error'); }
    finally { setIsSaving(false); }
  };

  // Stats y cálculos
  const usedIds = slots.filter(s => s.characterId).map(s => s.characterId);
  const totalPower = slots.reduce((sum, slot) => {
    const c = characters.find(ch => (ch._id === slot.characterId || ch.id === slot.characterId));
    if (!c) return sum;
    let p = c.power || 0;
    if (c.relation === 'heredero') p *= 0.5;
    if (c.isCopy) p *= 0.3;
    return sum + p;
  }, 0);

  if (loading) return <div className={styles.loader}><Loader2 className={styles.spin} /></div>

  return (
    <div className={styles.page}>
      <div className={styles.managementBar}>
        <div className={styles.teamSelectorGroup}>
          <div className={styles.selectBox}>
            <Folder size={16} />
            <select value={equipoSeleccionado} onChange={e => handleSelectTeam(e.target.value)}>
              {Object.keys(misEquipos).map(n => <option key={n} value={n}>{n}</option>)}
              {Object.keys(misEquipos).length === 0 && <option value="">Nuevo Equipo</option>}
            </select>
          </div>
          <button className={styles.addBtn} onClick={() => {
            setNombreTemp(`Equipo ${Object.keys(misEquipos).length + 1}`);
            setSlots(FORMATION.map(s => ({ ...s, characterId: null })));
            setEquipoSeleccionado("");
          }}><PlusCircle size={20} /></button>
        </div>

        <input className={styles.nameInput} value={nombreTemp} onChange={e => setNombreTemp(e.target.value)} placeholder="Nombre..." />

        <div className={styles.actionBtns}>
          <button className={styles.saveBtn} onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className={styles.spin} size={16} /> : <Save size={16} />}
            <span>{saveStatus === 'success' ? 'Guardado' : 'Guardar'}</span>
          </button>
        </div>
      </div>

      <div className={styles.mainLayout}>
        <div className={styles.pitch}>
          {slots.map((slot, i) => {
            const char = characters.find(c => (c._id === slot.characterId || c.id === slot.characterId));
            return (
              <div key={i} className={`${styles.slot} ${styles['p' + i]}`} onClick={() => !char && setSelectingSlot(i)}>
                {char ? (
                  <div className={styles.playerCard}>
                    <div className={styles.avatarCircle} style={{ borderColor: getElementColor(char.element) }}>
                      <img src={char.image} alt="" />
                      <button className={styles.remove} onClick={(e) => {
                        e.stopPropagation();
                        setSlots(prev => prev.map((s, idx) => idx === i ? { ...s, characterId: null } : s));
                      }}><X size={10} /></button>
                    </div>
                    <div className={styles.nameTag}>{char.name.split(' ')[0]}</div>
                    <div className={styles.posTag} style={{ background: getElementColor(char.element) }}>{slot.position.substring(0,2).toUpperCase()}</div>
                  </div>
                ) : (
                  <div className={styles.emptySlot}><Plus size={14} /><span>{slot.position.substring(0,2)}</span></div>
                )}
              </div>
            )
          })}
        </div>

        {/* Panel lateral de Stats corregido */}
        <div className={styles.statsPanel}>
          <div className={styles.statBox}>
            <span className={styles.statVal}>{Math.round(totalPower)}</span>
            <span className={styles.statLabel}>POTENCIA TOTAL</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statVal}>{usedIds.length}/11</span>
            <span className={styles.statLabel}>JUGADORES</span>
          </div>
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