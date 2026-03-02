import { useState, useEffect } from 'react'
import { saveTeam, loadTeam } from '../services/teamStorage'

const DEFAULT_FORMATION = [
  { position: 'Portero',         characterId: null },
  { position: 'Defensa',         characterId: null },
  { position: 'Defensa',         characterId: null },
  { position: 'Defensa',         characterId: null },
  { position: 'Defensa',         characterId: null },
  { position: 'Centrocampista',  characterId: null },
  { position: 'Centrocampista',  characterId: null },
  { position: 'Centrocampista',  characterId: null },
  { position: 'Centrocampista',  characterId: null },
  { position: 'Delantero',       characterId: null },
  { position: 'Delantero',       characterId: null },
]

export function useMyTeam(characters = []) {
  const [teamName, setTeamName] = useState('Mi Equipo')
  const [slots, setSlots]       = useState(DEFAULT_FORMATION)
  const [saved, setSaved]       = useState(false)

  // Carga inicial (LocalStorage)
  useEffect(() => {
    const stored = loadTeam()
    if (stored) {
      setSlots(stored.slots)
      setTeamName(stored.name)
    }
  }, [])

  // NUEVA: Función para cargar desde MongoDB
  const loadFromMongo = (equipoIds, nombre) => {
    if (nombre) setTeamName(nombre);
    if (equipoIds) {
      setSlots(prev => prev.map((s, i) => ({
        ...s,
        characterId: equipoIds[i] || null
      })));
    }
  };

  function addPlayer(slotIndex, characterId) {
    setSlots(prev => prev.map((s, i) => i === slotIndex ? { ...s, characterId } : s))
  }

  function removePlayer(slotIndex) {
    setSlots(prev => prev.map((s, i) => i === slotIndex ? { ...s, characterId: null } : s))
  }

  function handleSave() {
    saveTeam({ name: teamName, slots })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleClear() {
    setSlots(DEFAULT_FORMATION)
    setTeamName('Mi Equipo')
  }

  const usedIds     = slots.filter(s => s.characterId).map(s => s.characterId)
  const filledSlots = usedIds.length

  // CÁLCULO DE PODER CON MODIFICADORES REQUERIDOS
  const totalPower = slots.reduce((sum, slot) => {
    const c = characters.find(ch => (ch.id === slot.characterId || ch._id === slot.characterId));
    if (!c) return sum;

    let pwr = c.power || 0;
    
    // Aplicar modificador heredero: 0.5 [cite: 2026-02-27]
    if (c.relation === 'heredero') pwr *= 0.5;
    
    // Aplicar modificador copia: 0.3 [cite: 2026-02-11]
    if (c.isCopy) pwr *= 0.3;

    return sum + pwr;
  }, 0);

  return {
    teamName, setTeamName,
    slots,
    addPlayer, removePlayer,
    handleSave, handleClear,
    loadFromMongo, // Exportamos para usarla en la página
    saved, usedIds, filledSlots, totalPower,
  }
}