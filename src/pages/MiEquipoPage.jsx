import { useState, useEffect, useMemo } from 'react'
import { Plus, X, Save, Trash2, Search, Loader2, Folder, PlusCircle, Check, Shield } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
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
      return (!search || c.name.toLowerCase().includes(q)) &&
             (!elFilter || c.element === elFilter) &&
             (!posFilter || c.position === posFilter);
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
              <option value="GK">Portero (GK)</option>
              <option value="DF">Defensa (DF)</option>
              <option value="MD">Centrocampista (MD)</option>
              <option value="FW">Delantero (FW)</option>
            </select>
          </div>
        </div>
        <div className={styles.pickerList}>
          {available.length === 0 && (
            <div className={styles.emptyPicker}>No hay jugadores disponibles</div>
          )}
          {available.map(char => (
            <div key={char._id || char.id} className={styles.pickerRow} onClick={() => onSelect(slotIndex, char._id || char.id)}>
              <div className={styles.pickerAvatarWrapper} style={{ borderLeft: `3px solid ${getElementColor(char.element)}` }}>
                <img src={char.image} alt="" className={styles.pickerAvatarImg} />
              </div>
              <div className={styles.pickerInfo}>
                <span className={styles.pickerName}>{char.name}</span>
                <span className={styles.pickerMeta}>
                  <span className={styles.posChip}>{char.position}</span>
                  <span className={styles.elChip} style={{ color: getElementColor(char.element) }}>{char.element?.toUpperCase()}</span>
                </span>
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

// ── HELPER: obtener el ID del usuario de forma fiable ──
function getUserId(user) {
  // Primero intenta desde el hook useAuth
  if (user?.id) return user.id;
  if (user?._id) return user._id;
  // Fallback: leer directo desde localStorage (igual que PrivateRoute)
  try {
    const stored = localStorage.getItem('inazuma-user');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed?.id || parsed?._id || null;
    }
  } catch { /* ignore */ }
  return null;
}

// ── PÁGINA PRINCIPAL ────────────────────────────────────────────────
export default function MiEquipoPage() {
  const { user } = useAuth()
  const navigate  = useNavigate()
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [saveStatus, setSaveStatus] = useState('idle')
  const [selectingSlot, setSelectingSlot] = useState(null)
  
  const [misEquipos, setMisEquipos] = useState({})
  const [equipoSeleccionado, setEquipoSeleccionado] = useState("")
  const [nombreTemp, setNombreTemp] = useState("")

  // Si el usuario es admin, redirigir al panel de administración
  useEffect(() => {
    const stored = localStorage.getItem('inazuma-user')
    const u = stored ? JSON.parse(stored) : null
    if (u?.role === 'admin') {
      navigate('/admin', { replace: true })
    }
  }, [navigate])

  const FORMATION = [
    { position: 'Portero' }, { position: 'Defensa' }, { position: 'Defensa' },
    { position: 'Defensa' }, { position: 'Defensa' }, { position: 'Centrocampista' },
    { position: 'Centrocampista' }, { position: 'Centrocampista' }, { position: 'Centrocampista' },
    { position: 'Delantero' }, { position: 'Delantero' }
  ];

  const [slots, setSlots] = useState(FORMATION.map(s => ({ ...s, characterId: null })));

  // ── Carga inicial: tolerante a useAuth lento y a rerenders por navegación ──
  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      // Intentamos obtener el userId: primero del hook, luego directo de localStorage
      const userId = getUserId(user);
      if (!userId) {
        // useAuth aún no hidrato — esperamos un tick y dejamos que la dependencia
        // [user] vuelva a disparar el effect cuando sí tenga valor
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [players, userRes] = await Promise.all([
          getAllPlayers(),
          fetch(`http://127.0.0.1:5000/obtener_usuario/${userId}`)
        ]);

        if (cancelled) return; // componente desmontado mientras esperábamos

        setCharacters(players);
        const data = await userRes.json();

        if (userRes.ok && data.usuario?.equipos) {
          const fetchedEquipos = data.usuario.equipos;
          setMisEquipos(fetchedEquipos);

          const nombres = Object.keys(fetchedEquipos);
          if (nombres.length > 0) {
            const primerNombre = nombres[0];
            setEquipoSeleccionado(primerNombre);
            setNombreTemp(primerNombre);
            const ids = fetchedEquipos[primerNombre];
            setSlots(FORMATION.map((s, i) => ({ ...s, characterId: ids[i] || null })));
          }
        }
      } catch (e) {
        console.error("Error cargando datos:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();

    // Limpieza: evita actualizar estado si el componente se desmontó (p.ej. al navegar)
    return () => { cancelled = true; };

  // Escuchamos el objeto `user` completo: si useAuth lo actualiza tarde,
  // el effect se re-dispara y ya encontrará el userId correcto.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSelectTeam = (nombre) => {
    setEquipoSeleccionado(nombre);
    setNombreTemp(nombre);
    const ids = misEquipos[nombre] || [];
    setSlots(FORMATION.map((s, i) => ({ ...s, characterId: ids[i] || null })));
  };

  const handleRemoveCharacter = (index, e) => {
    e.stopPropagation();
    setSlots(prev => prev.map((s, i) => i === index ? { ...s, characterId: null } : s));
  };

  const handleSave = async () => {
    const userId = getUserId(user);
    if (!userId || !nombreTemp.trim()) return;
    setIsSaving(true);
    const equipoIds = slots.map(s => s.characterId);
    try {
      const res = await fetch('http://127.0.0.1:5000/guardar_equipo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, equipo: equipoIds, nombre_equipo: nombreTemp })
      });
      if (res.ok) {
        setMisEquipos(prev => ({ ...prev, [nombreTemp]: equipoIds }));
        setEquipoSeleccionado(nombreTemp);
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    } catch (e) { setSaveStatus('error') } 
    finally { setIsSaving(false) }
  };

  const handleDeleteTeam = async () => {
    const userId = getUserId(user);
    if (!equipoSeleccionado || !userId) return;
    if (!window.confirm(`¿Eliminar el equipo "${equipoSeleccionado}"?`)) return;
    setIsDeleting(true);
    try {
      const res = await fetch('http://127.0.0.1:5000/eliminar_equipo', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, nombre_equipo: equipoSeleccionado })
      });
      if (res.ok) {
        const nuevos = { ...misEquipos };
        delete nuevos[equipoSeleccionado];
        setMisEquipos(nuevos);
        const nombres = Object.keys(nuevos);
        if (nombres.length > 0) {
          handleSelectTeam(nombres[0]);
        } else {
          setEquipoSeleccionado("");
          setNombreTemp("");
          setSlots(FORMATION.map(s => ({ ...s, characterId: null })));
        }
      }
    } catch (e) { console.error(e); }
    finally { setIsDeleting(false); }
  };

  // Stats
  const usedIds = slots.filter(s => s.characterId).map(s => s.characterId);
  const filledCount = usedIds.length;

  const totalPower = slots.reduce((sum, slot) => {
    const c = characters.find(ch => (ch._id === slot.characterId || ch.id === slot.characterId));
    if (!c) return sum;
    let p = c.power || 0;
    if (c.relation === 'heredero') p *= 0.5;
    if (c.isCopy) p *= 0.3;
    return sum + p;
  }, 0);

  const avgRating = filledCount > 0
    ? Math.round(totalPower / filledCount)
    : 0;

  // Rating tier label
  const getRatingTier = (avg) => {
    if (avg >= 90) return { label: 'ÉLITE', color: '#f6ad55' };
    if (avg >= 75) return { label: 'ORO', color: '#ecc94b' };
    if (avg >= 60) return { label: 'PLATA', color: '#a0aec0' };
    if (avg >= 40) return { label: 'BRONCE', color: '#c05621' };
    return { label: 'NOVATO', color: '#718096' };
  };
  const tier = getRatingTier(avgRating);

  if (loading) return (
    <div className={styles.loader}>
      <Loader2 size={40} className={styles.spin} />
      <span>Cargando equipo...</span>
    </div>
  );

  return (
    <div className={styles.page}>

      {/* ── MANAGEMENT BAR ── */}
      <div className={styles.managementBar}>
        {/* Team selector */}
        <div className={styles.teamSelectorGroup}>
          <div className={styles.selectBox}>
            <Folder size={15} className={styles.folderIcon} />
            <select value={equipoSeleccionado} onChange={(e) => handleSelectTeam(e.target.value)}>
              {Object.keys(misEquipos).length === 0
                ? <option value="">Sin equipos</option>
                : Object.keys(misEquipos).map(name => <option key={name} value={name}>{name}</option>)
              }
            </select>
          </div>
          <button
            className={styles.addBtn}
            title="Nuevo equipo"
            onClick={() => {
              const newName = `Equipo ${Object.keys(misEquipos).length + 1}`;
              setNombreTemp(newName);
              setSlots(FORMATION.map(s => ({ ...s, characterId: null })));
              setEquipoSeleccionado("");
            }}
          >
            <PlusCircle size={18} />
          </button>
        </div>

        {/* Name input */}
        <div className={styles.nameInputWrapper}>
          <input
            value={nombreTemp}
            onChange={e => setNombreTemp(e.target.value)}
            placeholder="Nombre del equipo..."
          />
        </div>

        {/* Actions */}
        <div className={styles.actionBtns}>
          <button
            className={`${styles.saveBtn} ${saveStatus === 'success' ? styles.saveBtnSuccess : ''}`}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving
              ? <Loader2 size={16} className={styles.spin} />
              : saveStatus === 'success'
                ? <Check size={16} />
                : <Save size={16} />
            }
            <span>{saveStatus === 'success' ? '¡Guardado!' : 'Guardar'}</span>
          </button>

          {equipoSeleccionado && (
            <button
              className={styles.deleteBtn}
              onClick={handleDeleteTeam}
              disabled={isDeleting}
              title="Eliminar equipo"
            >
              {isDeleting ? <Loader2 size={16} className={styles.spin} /> : <Trash2 size={16} />}
            </button>
          )}
        </div>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className={styles.mainLayout}>

        {/* ── PITCH ── */}
        <div className={styles.pitchWrapper}>
          <div className={styles.pitchInner}>
            {/* Field markings */}
            <div className={styles.fieldMarkings}>
              <div className={styles.centerLine} />
              <div className={styles.centerCircle} />
              <div className={styles.penaltyTop} />
              <div className={styles.penaltyBottom} />
            </div>

            {slots.map((slot, i) => {
              const char = characters.find(c => (c._id === slot.characterId || c.id === slot.characterId));
              return (
                <div
                  key={i}
                  className={`${styles.slot} ${styles['p' + i]}`}
                  onClick={() => !char && setSelectingSlot(i)}
                >
                  {char ? (
                    <div className={styles.playerCard}>
                      <div className={styles.avatarCircle} style={{ borderColor: getElementColor(char.element) }}>
                        <img src={char.image} alt={char.name} />
                        <button className={styles.remove} onClick={(e) => handleRemoveCharacter(i, e)}>
                          <X size={10} />
                        </button>
                      </div>
                      <div className={styles.nameTag}>{char.name.split(' ')[0]}</div>
                      <div className={styles.posTag} style={{ background: getElementColor(char.element) }}>
                        {slot.position.substring(0, 2).toUpperCase()}
                      </div>
                    </div>
                  ) : (
                    <div className={styles.emptySlot}>
                      <Plus size={13} />
                      <span>{slot.position.substring(0, 2).toUpperCase()}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── STATS PANEL ── */}
        <div className={styles.statsPanel}>
          <div className={styles.statsPanelTitle}>
            <Shield size={16} />
            <span>Estadísticas</span>
          </div>

          <div className={styles.bigStat}>
            <span className={styles.bigStatVal}>{Math.round(totalPower).toLocaleString()}</span>
            <span className={styles.bigStatLabel}>POTENCIA TOTAL</span>
          </div>

          <div className={styles.divider} />

          <div className={styles.ratingBlock}>
            <span className={styles.avgVal} style={{ color: tier.color }}>{avgRating}</span>
            <span className={styles.avgLabel}>MEDIA DEL EQUIPO</span>
            <span className={styles.tierBadge} style={{ background: `${tier.color}22`, color: tier.color, borderColor: `${tier.color}44` }}>
              {tier.label}
            </span>
          </div>

          <div className={styles.divider} />

          <div className={styles.slotList}>
            {slots.map((slot, i) => {
              const char = characters.find(c => (c._id === slot.characterId || c.id === slot.characterId));
              return (
                <div key={i} className={styles.slotListItem}>
                  <span className={styles.slotPosLabel}>{slot.position.substring(0, 3).toUpperCase()}</span>
                  {char ? (
                    <>
                      <span className={styles.slotCharName}>{char.name.split(' ')[0]}</span>
                      <span className={styles.slotCharPwr} style={{ color: getElementColor(char.element) }}>{char.power}</span>
                    </>
                  ) : (
                    <span className={styles.slotEmpty}>—</span>
                  )}
                </div>
              );
            })}
          </div>

          <div className={styles.filledCount}>
            <span>{filledCount}</span> / 11 jugadores
          </div>
        </div>
      </div>

      {/* ── PICKER MODAL ── */}
      {selectingSlot !== null && (
        <CharacterPickerModal 
          slotIndex={selectingSlot}
          slotPosition={slots[selectingSlot].position}
          usedIds={usedIds}
          characters={characters}
          onSelect={(idx, id) => {
            setSlots(prev => prev.map((s, i) => i === idx ? { ...s, characterId: id } : s));
            setSelectingSlot(null);
          }}
          onClose={() => setSelectingSlot(null)}
        />
      )}
    </div>
  );
}