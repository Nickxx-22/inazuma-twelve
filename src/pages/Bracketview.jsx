import { useState, useEffect } from 'react'
import { Shield } from 'lucide-react'
import { imgUrl } from '../config'

function CuadroBracket({ cuadro }) {
  const r1 = cuadro?.ronda_1 || []
  const r2 = cuadro?.ronda_2 || []
  const r3 = cuadro?.ronda_3 || []
  const r4 = cuadro?.ronda_4 || []

  // Cache de imágenes de escudos cargadas como <image> SVG
  const [imgCache, setImgCache] = useState({})

  // Recopilar todas las IDs de equipos reales para pre-cargar sus imágenes
  useEffect(() => {
    const equipos = cuadro?.equipos || []
    const cache = {}
    equipos.forEach(eq => {
      if (eq.imagen) {
        cache[eq.nombre] = imgUrl(eq.imagen)
      }
    })
    setImgCache(cache)
  }, [cuadro])

  const winnerOf = (m) => {
    if (!m?.jugado) return null
    const gl = Number(m.resultado?.goles_local  || 0)
    const gv = Number(m.resultado?.goles_visitante || 0)
    if (gl === gv) return m.resultado?.ganador || null
    return gl > gv ? (m.local?.nombre || null) : (m.visitante?.nombre || null)
  }

  const CW  = 188
  const CH  = 70
  const GAP = 56
  const SVG_W = 1700
  const SVG_H = 980

  // X columnas izquierda: octavos, cuartos, semis
  const xL = [16, 16 + CW + GAP, 16 + (CW + GAP) * 2]
  // X columnas derecha: espejo exacto desde el borde derecho
  const xR = [SVG_W - 16 - CW, SVG_W - 16 - CW - (CW + GAP), SVG_W - 16 - CW - (CW + GAP) * 2]
  // X final: centrada en el hueco libre entre el final de semis-izq y el inicio de semis-der
  const semisIzqRight = xL[2] + CW   // borde derecho de la columna de semis izquierda
  const semisDerLeft  = xR[2]        // borde izquierdo de la columna de semis derecha
  const xFinal = Math.round(semisIzqRight + (semisDerLeft - semisIzqRight) / 2 - CW / 2)

  const GAP_V  = 52
  const STEP   = CH + GAP_V
  const blockH = 4 * CH + 3 * GAP_V
  const topY   = Math.round((SVG_H - blockH) / 2)

  const yR1 = [0, 1, 2, 3].map(i => topY + i * STEP)
  const yR2 = [0, 1].map(i => {
    const c1 = yR1[i * 2] + CH / 2
    const c2 = yR1[i * 2 + 1] + CH / 2
    return Math.round((c1 + c2) / 2 - CH / 2)
  })
  const yR3 = (() => {
    const c1 = yR2[0] + CH / 2
    const c2 = yR2[1] + CH / 2
    return Math.round((c1 + c2) / 2 - CH / 2)
  })()
  const yFinal = Math.round(SVG_H / 2 - CH / 2 - 40)

  const leftR1  = r1.slice(0, 4)
  const rightR1 = r1.slice(4, 8)

  const leftR2 = r2.length >= 2 ? r2.slice(0, 2) : [0, 1].map(i => ({
    local:     { nombre: winnerOf(leftR1[i * 2])     || '...' },
    visitante: { nombre: winnerOf(leftR1[i * 2 + 1]) || '...' },
    jugado: false,
  }))
  const rightR2 = r2.length >= 4 ? r2.slice(2, 4) : [0, 1].map(i => ({
    local:     { nombre: winnerOf(rightR1[i * 2])     || '...' },
    visitante: { nombre: winnerOf(rightR1[i * 2 + 1]) || '...' },
    jugado: false,
  }))
  const leftR3  = r3.length >= 1 ? r3.slice(0, 1) : [{ local: { nombre: winnerOf(leftR2[0])  || '...' }, visitante: { nombre: winnerOf(leftR2[1])  || '...' }, jugado: false }]
  const rightR3 = r3.length >= 2 ? r3.slice(1, 2) : [{ local: { nombre: winnerOf(rightR2[0]) || '...' }, visitante: { nombre: winnerOf(rightR2[1]) || '...' }, jugado: false }]
  const finalMatch = r4.length > 0 ? r4[0] : {
    local:     { nombre: winnerOf(leftR3[0])  || '...' },
    visitante: { nombre: winnerOf(rightR3[0]) || '...' },
    jugado: false,
  }
  const campeon = winnerOf(finalMatch)

  // ── Tarjeta SVG con escudo ────────────────────────────────────
  function Card({ match, x, y }) {
    if (!match) return null
    const played  = !!match.jugado
    const winner  = winnerOf(match)
    const localW  = winner != null && winner === match?.local?.nombre
    const visitW  = winner != null && winner === match?.visitante?.nombre
    const isUserL = !!match?.local?.es_usuario
    const isUserV = !!match?.visitante?.es_usuario

    const ICON_S = 18   // tamaño del escudo
    const ICON_X = x + 8
    const TEXT_X = x + ICON_S + 14  // texto desplazado a la derecha del escudo
    const TEXT_MAX = 16  // chars máx para el nombre (CW=188 da algo más de margen)

    const imgL = imgCache[match?.local?.nombre]
    const imgV = imgCache[match?.visitante?.nombre]

    return (
      <g>
        <rect x={x} y={y} width={CW} height={CH} rx="9"
          fill="rgba(10,14,28,0.97)"
          stroke={played ? 'rgba(255,107,53,0.4)' : 'rgba(255,255,255,0.09)'}
          strokeWidth="1" />

        {localW  && <rect x={x+1} y={y+1}      width={CW-2} height={CH/2-1} rx="8" fill="rgba(54,211,153,0.12)" />}
        {visitW  && <rect x={x+1} y={y+CH/2}   width={CW-2} height={CH/2-1} rx="8" fill="rgba(54,211,153,0.12)" />}

        <line x1={x+8} y1={y+CH/2} x2={x+CW-8} y2={y+CH/2} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />

        {/* Escudo local */}
        {imgL
          ? <image href={imgL} x={ICON_X} y={y + CH/4 - ICON_S/2} width={ICON_S} height={ICON_S} />
          : <Shield x={ICON_X} y={y + CH/4 - ICON_S/2} size={ICON_S}
              fill={isUserL ? '#3d7eff33' : 'rgba(255,255,255,0.05)'}
              stroke={isUserL ? '#3d7eff' : 'rgba(255,255,255,0.2)'} strokeWidth="1" />
        }

        {/* Nombre local */}
        <text x={TEXT_X} y={y + CH/4 + 5}
          fontSize="11" fontWeight={localW ? '800' : '500'}
          fill={isUserL ? '#3d7eff' : localW ? '#36d399' : 'rgba(255,255,255,0.78)'}
          fontFamily="system-ui,sans-serif">
          <title>{match?.local?.nombre || 'TBD'}</title>
          {(match?.local?.nombre || 'TBD').slice(0, TEXT_MAX)}
        </text>

        {/* Escudo visitante */}
        {imgV
          ? <image href={imgV} x={ICON_X} y={y + CH*3/4 - ICON_S/2} width={ICON_S} height={ICON_S} />
          : <Shield x={ICON_X} y={y + CH*3/4 - ICON_S/2} size={ICON_S}
              fill={isUserV ? '#3d7eff33' : 'rgba(255,255,255,0.05)'}
              stroke={isUserV ? '#3d7eff' : 'rgba(255,255,255,0.2)'} strokeWidth="1" />
        }

        {/* Nombre visitante */}
        <text x={TEXT_X} y={y + CH*3/4 + 5}
          fontSize="11" fontWeight={visitW ? '800' : '500'}
          fill={isUserV ? '#3d7eff' : visitW ? '#36d399' : 'rgba(255,255,255,0.78)'}
          fontFamily="system-ui,sans-serif">
          <title>{match?.visitante?.nombre || 'TBD'}</title>
          {(match?.visitante?.nombre || 'TBD').slice(0, TEXT_MAX)}
        </text>

        {/* Marcador */}
        {played && (
          <g>
            <rect x={x+CW-38} y={y+CH/2-12} width={34} height={24} rx="6" fill="rgba(255,255,255,0.07)" />
            <text x={x+CW-21} y={y+CH/2+5}
              fontSize="11" fontWeight="800" fill="white"
              textAnchor="middle" fontFamily="system-ui,sans-serif">
              {match.resultado?.goles_local}-{match.resultado?.goles_visitante}
            </text>
          </g>
        )}
      </g>
    )
  }

  function Bracket({ x1, y1a, y1b, x2, mirror }) {
    const ca  = y1a + CH / 2
    const cb  = y1b + CH / 2
    const mid = (ca + cb) / 2
    const ex1 = mirror ? x1      : x1 + CW
    const ex2 = mirror ? x2 + CW : x2
    const bx  = mirror ? (ex1 + ex2) / 2 + 10 : (ex1 + ex2) / 2 - 10
    const L   = 'rgba(255,255,255,0.13)'
    return (
      <g stroke={L} strokeWidth="1.5" fill="none">
        <line x1={ex1} y1={ca} x2={bx} y2={ca} />
        <line x1={ex1} y1={cb} x2={bx} y2={cb} />
        <line x1={bx} y1={ca} x2={bx} y2={cb} />
        <line x1={bx} y1={mid} x2={ex2} y2={mid} />
      </g>
    )
  }

  function Line({ x1, y1, x2, y2 }) {
    return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.13)" strokeWidth="1.5" />
  }

  const labelStyle = {
    fontSize: 9, fontWeight: 700, fill: 'rgba(255,107,53,0.75)',
    fontFamily: 'system-ui,sans-serif', letterSpacing: 1.5,
  }

  return (
    <div style={{ width: '100%', padding: '10px 0' }}>
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        width="100%"
        height="auto"
        style={{ display: 'block', margin: '0 auto', maxWidth: SVG_W }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Etiquetas */}
        {[
          { label: 'OCTAVOS',   x: xL[0]+CW/2 }, { label: 'CUARTOS',   x: xL[1]+CW/2 },
          { label: 'SEMIFINAL', x: xL[2]+CW/2 }, { label: 'FINAL',     x: xFinal+CW/2 },
          { label: 'SEMIFINAL', x: xR[2]+CW/2 }, { label: 'CUARTOS',   x: xR[1]+CW/2 },
          { label: 'OCTAVOS',   x: xR[0]+CW/2 },
        ].map(({ label, x }, i) => (
          <text key={i} {...labelStyle} x={x} y={18} textAnchor="middle">{label}</text>
        ))}

        {/* Conectores izq */}
        <Bracket x1={xL[0]} y1a={yR1[0]} y1b={yR1[1]} x2={xL[1]} />
        <Bracket x1={xL[0]} y1a={yR1[2]} y1b={yR1[3]} x2={xL[1]} />
        <Bracket x1={xL[1]} y1a={yR2[0]} y1b={yR2[1]} x2={xL[2]} />
        {/* Semi izq → Final: conector con esquina única, sin tramos ambiguos */}
        {(() => {
          const startX = xL[2] + CW
          const startY = yR3 + CH / 2
          const midX   = startX + 32
          const endY   = yFinal + CH / 4
          const endX   = xFinal
          return (
            <polyline
              points={`${startX},${startY} ${midX},${startY} ${midX},${endY} ${endX},${endY}`}
              fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth="1.5"
            />
          )
        })()}

        {/* Conectores der */}
        <Bracket x1={xR[0]} y1a={yR1[0]} y1b={yR1[1]} x2={xR[1]} mirror />
        <Bracket x1={xR[0]} y1a={yR1[2]} y1b={yR1[3]} x2={xR[1]} mirror />
        <Bracket x1={xR[1]} y1a={yR2[0]} y1b={yR2[1]} x2={xR[2]} mirror />
        {/* Semi der → Final: conector con esquina única, sin tramos ambiguos */}
        {(() => {
          const startX = xR[2]
          const startY = yR3 + CH / 2
          const midX   = startX - 32
          const endY   = yFinal + CH * 3 / 4
          const endX   = xFinal + CW
          return (
            <polyline
              points={`${startX},${startY} ${midX},${startY} ${midX},${endY} ${endX},${endY}`}
              fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth="1.5"
            />
          )
        })()}

        {/* Tarjetas izq */}
        {leftR1.map((m, i)  => <Card key={`lR1-${i}`} match={m} x={xL[0]} y={yR1[i]} />)}
        {leftR2.map((m, i)  => <Card key={`lR2-${i}`} match={m} x={xL[1]} y={yR2[i]} />)}
        {leftR3.map((m, i)  => <Card key={`lR3-${i}`} match={m} x={xL[2]} y={yR3} />)}

        {/* Tarjetas der */}
        {rightR1.map((m, i) => <Card key={`rR1-${i}`} match={m} x={xR[0]} y={yR1[i]} />)}
        {rightR2.map((m, i) => <Card key={`rR2-${i}`} match={m} x={xR[1]} y={yR2[i]} />)}
        {rightR3.map((m, i) => <Card key={`rR3-${i}`} match={m} x={xR[2]} y={yR3} />)}

        {/* Final */}
        <Card match={finalMatch} x={xFinal} y={yFinal} />

        {/* Trofeo / Campeón */}
        {campeon ? (
          <g>
            <rect x={xFinal-10} y={yFinal+CH+14} width={CW+20} height={44} rx="12"
              fill="rgba(245,158,11,0.15)" stroke="rgba(245,158,11,0.4)" strokeWidth="1.5" />
            <text x={xFinal+CW/2} y={yFinal+CH+42}
              fontSize="13" fontWeight="800" fill="#f59e0b"
              textAnchor="middle" fontFamily="system-ui,sans-serif">
              🏆 {campeon.slice(0, 22)}
            </text>
          </g>
        ) : (
          <g>
            <rect x={xFinal+CW/2-36} y={yFinal+CH+14} width={72} height={72} rx="18"
              fill="rgba(245,158,11,0.12)" stroke="rgba(245,158,11,0.35)" strokeWidth="1.5" />
            <text x={xFinal+CW/2} y={yFinal+CH+62} fontSize="32" textAnchor="middle">🏆</text>
          </g>
        )}
      </svg>
    </div>
  )
}

export default CuadroBracket