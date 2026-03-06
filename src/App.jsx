import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import PersonajesPage from './pages/PersonajesPage'
import PersonajeDetailPage from './pages/PersonajeDetailPage'
import TecnicasPage from './pages/TecnicasPage'
import EquiposPage from './pages/EquiposPage'
import MiEquipoPage from './pages/MiEquipoPage'
import LoginPage from './pages/LoginPage'
import RegistroPage from './pages/RegistroPage'
import AdminPage from './pages/AdminPage'

function PrivateRoute({ children }) {
  const user = localStorage.getItem('inazuma-user')
  return user ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const stored = localStorage.getItem('inazuma-user')
  const user = stored ? JSON.parse(stored) : null
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="personajes" element={<PersonajesPage />} />
          <Route path="personajes/:id" element={<PersonajeDetailPage />} />
          <Route path="tecnicas" element={<TecnicasPage />} />
          <Route path="equipos" element={<EquiposPage />} />
          <Route path="mi-equipo" element={
            <PrivateRoute><MiEquipoPage /></PrivateRoute>
          } />
          <Route path="admin" element={
            <AdminRoute><AdminPage /></AdminRoute>
          } />
          <Route path="login" element={<LoginPage />} />
          <Route path="registro" element={<RegistroPage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}