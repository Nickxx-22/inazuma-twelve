import { useState, useEffect } from 'react'
import { saveTeam } from '../services/teamStorage'

const DEFAULT_FORMATION = [
  { position: 'Portero',         characterId: null },
  { position: 'Defensa',         characterId: null },
  { position: 'Defensa',         characterId: null },
  { position: 'Defensa',         characterId: null },
  { position: 'Centrocampista',  characterId: null },
  { position: 'Centrocampista',  characterId: null },
  { position: 'Centrocampista',  characterId: null },
  { position: 'Centrocampista',  characterId: null },
  { position: 'Delantero',       characterId: null },
  { position: 'Delantero',       characterId: null },
  { position: 'Delantero',       characterId: null },
]

export function useMyTeam(characters = []) {
  const [teamName, setTeamName] = useState('Mi Equipo')
  const [slots, setSlots]       = useState(DEFAULT_FORMATION)
  const [saved, setSaved]       = useState(false)

  // 1. Función para cargar datos desde MongoDB
  function loadTeamFromDB(equipoIds, nombre) {
    if (nombre) setTeamName(nombre);
    if (equipoIds && Array.isArray(equipoIds)) {
      setSlots(prev => prev.map((slot, i) => ({
        ...slot,
        characterId: equipoIds[i] || null
      })));
    }
  }

  function addPlayer(slotIndex, characterId) {
    setSlots(prev =>
      prev.map((s, i) => i === slotIndex ? { ...s, characterId } : s)
    )
  }

  function removePlayer(slotIndex) {
    setSlots(prev =>
      prev.map((s, i) => i === slotIndex ? { ...s, characterId: null } : s)
    )
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

  // 2. Cálculo de Poder con Modificadores
  const totalPower = slots.reduce((sum, slot) => {
    if (!slot.characterId) return sum;
    
    // IMPORTANTE: Buscamos por .id o ._id para evitar fallos de Mongo
    const c = characters.find(ch => (ch.id === slot.characterId || ch._id === slot.characterId));
    
    if (!c) return sum;

    let powerValue = c.power || 0;

    // Modificador Heredero (0.5)
    if (c.relation === 'heredero') {
      powerValue *= 0.5;
    }

    // Modificador Copia (0.3)
    if (c.isCopy) {
      powerValue *= 0.3;
    }

    return sum + powerValue;
  }, 0);

  return {
    teamName, setTeamName,
    slots,
    addPlayer, removePlayer,
    handleSave, handleClear,
    loadTeamFromDB, // Exportamos esta nueva función
    saved, usedIds, filledSlots, totalPower,
  }
}