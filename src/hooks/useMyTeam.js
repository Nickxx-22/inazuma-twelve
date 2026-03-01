import { useState, useEffect } from 'react'
import { saveTeam, loadTeam } from '../services/teamStorage'

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

  // Carga equipo guardado al montar
  useEffect(() => {
    const stored = loadTeam()
    if (stored) {
      setSlots(stored.slots)
      setTeamName(stored.name)
    }
  }, [])

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
  const totalPower  = usedIds.reduce((sum, id) => {
    const c = characters.find(ch => ch.id === id)
    return sum + (c?.power ?? 0)
  }, 0)

  return {
    teamName, setTeamName,
    slots,
    addPlayer, removePlayer,
    handleSave, handleClear,
    saved, usedIds, filledSlots, totalPower,
  }
}
