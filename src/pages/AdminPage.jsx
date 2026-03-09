import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { Shield, Trash2, ChevronDown, Users, Star, Zap, Folder, RefreshCw, Loader2, X, AlertTriangle } from 'lucide-react'
import styles from './AdminPage.module.css'

import { BASE_URL } from '../config'

function getToken() {
  return localStorage.getItem('inazuma-token') || ''
}

const ROLE_LABELS = { admin: 'Admin', user: 'Usuario', banned: 'Baneado' }
const ROLE_COLORS = { admin: '#f59e0b', user: '#3d7eff', banned: '#ef4444' }

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.confirmBox} onClick={e => e.stopPropagation()}>
        <AlertTriangle size={28} className={styles.warnIcon} />
        <p className={styles.confirmMsg}>{message}</p>
        <div className={styles.confirmBtns}>
          <button className={styles.cancelBtn} onClick={onCancel}>Cancelar</button>
          <button className={styles.deleteBtn} onClick={onConfirm}>Confirmar</button>
        </div>
      </div>
    </div>
  )
}

function UserRow({ user, onDelete, onRoleChange }) {
  const [open,      setOpen]      = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [dropPos,   setDropPos]   = useState({ top: 0, right: 0 })
  const btnRef = useRef(null)

  const roleColor = ROLE_COLORS[user.role] || '#888'

  function handleOpen() {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setDropPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right })
    }
    setOpen(v => !v)
  }

  const handleRoleChange = async (newRole) => {
    if (newRole === user.role) { setOpen(false); return }
    setLoading(true)
    await onRoleChange(user.id, newRole)
    setLoading(false)
    setOpen(false)
  }

  return (
    <div className={`${styles.userRow} ${user.role === 'banned' ? styles.banned : ''}`}>
      <div className={styles.avatar} style={{ background: `${roleColor}22`, borderColor: `${roleColor}44` }}>
        <span style={{ color: roleColor }}>{user.username.charAt(0).toUpperCase()}</span>
      </div>

      <div className={styles.userInfo}>
        <span className={styles.username}>{user.username}</span>
        <span className={styles.email}>{user.email}</span>
      </div>

      <div className={styles.userStats}>
        <span className={styles.statPill} title="Jugadores favoritos">
          <Star size={10} /> {user.favoritos}
        </span>
        <span className={styles.statPill} title="Técnicas favoritas">
          <Zap size={10} /> {user.favoritos_tecnicas}
        </span>
        <span className={styles.statPill} title="Equipos guardados">
          <Folder size={10} /> {user.equipos}
        </span>
      </div>

      <div className={styles.roleWrap}>
        <button
          ref={btnRef}
          className={styles.roleBtn}
          style={{ background: `${roleColor}18`, color: roleColor, borderColor: `${roleColor}44` }}
          onClick={handleOpen}
          disabled={loading}
        >
          {loading ? <Loader2 size={12} className={styles.spin} /> : null}
          {ROLE_LABELS[user.role] || user.role}
          <ChevronDown size={12} />
        </button>
        {open && (
          <div className={styles.roleDropdown} style={{ top: dropPos.top, right: dropPos.right }}>
            {Object.entries(ROLE_LABELS).map(([key, label]) => (
              <button
                key={key}
                className={`${styles.roleOption} ${key === user.role ? styles.roleOptionActive : ''}`}
                style={{ '--rc': ROLE_COLORS[key] }}
                onClick={() => handleRoleChange(key)}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <button className={styles.deleteRowBtn} onClick={() => onDelete(user)} title="Eliminar usuario">
        <Trash2 size={15} />
      </button>
    </div>
  )
}

export default function AdminPage() {
  const { user }          = useAuth()
  const navigate          = useNavigate()
  const [users,   setUsers]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [search,  setSearch]  = useState('')
  const [confirm, setConfirm] = useState(null)   // { id, username }

  useEffect(() => {
    const stored = localStorage.getItem('inazuma-user')
    const u = stored ? JSON.parse(stored) : null
    if (!u || u.role !== 'admin') {
      navigate('/', { replace: true })
    }
  }, [navigate])

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const res  = await fetch(`${BASE_URL}/admin/usuarios`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setUsers(data.usuarios)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const handleDelete = async () => {
    if (!confirm) return
    try {
      await fetch(`${BASE_URL}/admin/usuarios/${confirm.id}`, {
        method:  'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      })
      setUsers(prev => prev.filter(u => u.id !== confirm.id))
    } catch (e) {
      alert('Error al eliminar: ' + e.message)
    } finally {
      setConfirm(null)
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    try {
      await fetch(`${BASE_URL}/admin/usuarios/${userId}/role`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body:    JSON.stringify({ role: newRole })
      })
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
    } catch (e) {
      alert('Error al cambiar role: ' + e.message)
    }
  }

  const filtered = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    total:  users.length,
    admins: users.filter(u => u.role === 'admin').length,
    banned: users.filter(u => u.role === 'banned').length,
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <div className={styles.titleIcon}><Shield size={20} /></div>
          <div>
            <h1 className={styles.title}>Panel de Administración</h1>
            <p className={styles.subtitle}>Gestión de usuarios del sistema</p>
          </div>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <Users size={16} className={styles.statIcon} />
            <span className={styles.statNum}>{stats.total}</span>
            <span className={styles.statLbl}>Usuarios</span>
          </div>
          <div className={styles.statCard} style={{ '--sc': '#f59e0b' }}>
            <Shield size={16} className={styles.statIcon} style={{ color: '#f59e0b' }} />
            <span className={styles.statNum} style={{ color: '#f59e0b' }}>{stats.admins}</span>
            <span className={styles.statLbl}>Admins</span>
          </div>
          <div className={styles.statCard} style={{ '--sc': '#ef4444' }}>
            <X size={16} className={styles.statIcon} style={{ color: '#ef4444' }} />
            <span className={styles.statNum} style={{ color: '#ef4444' }}>{stats.banned}</span>
            <span className={styles.statLbl}>Baneados</span>
          </div>
        </div>
      </div>

      <div className={styles.toolbar}>
        <input
          className={styles.searchInput}
          placeholder="Buscar por nombre o email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className={styles.refreshBtn} onClick={fetchUsers} disabled={loading}>
          <RefreshCw size={15} className={loading ? styles.spin : ''} />
        </button>
      </div>

      <div className={styles.list}>
        {loading && (
          <div className={styles.centered}>
            <Loader2 size={32} className={styles.spin} />
            <span>Cargando usuarios…</span>
          </div>
        )}
        {!loading && error && (
          <div className={styles.centered}>
            <AlertTriangle size={24} style={{ color: '#ef4444' }} />
            <span style={{ color: '#ef4444' }}>{error}</span>
          </div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div className={styles.centered}><span>Sin resultados</span></div>
        )}
        {!loading && !error && filtered.map(u => (
          <UserRow
            key={u.id}
            user={u}
            onDelete={u => setConfirm(u)}
            onRoleChange={handleRoleChange}
          />
        ))}
      </div>

      {confirm && (
        <ConfirmModal
          message={`¿Eliminar permanentemente a "${confirm.username}"? Esta acción no se puede deshacer.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  )
}