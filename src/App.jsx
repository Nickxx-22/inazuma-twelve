import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import PersonajesPage from './pages/PersonajesPage'
import PersonajeDetailPage from './pages/PersonajeDetailPage'
import TecnicasPage from './pages/TecnicasPage'
import EquiposPage from './pages/EquiposPage'
import MiEquipoPage from './pages/MiEquipoPage'
import LoginPage from './pages/LoginPage'
import RegistroPage from './pages/RegistroPage'

// Protege rutas que requieren login
function PrivateRoute({ children }) {
  const user = localStorage.getItem('inazuma-user')
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
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
          <Route path="login" element={<LoginPage />} />
          <Route path="registro" element={<RegistroPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
