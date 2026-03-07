import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import DashboardLayout from '@shared/layouts/DashboardLayout'
import Home from './pages/Home'
import Pacientes from './pages/Pacientes'
import Profile from './pages/Profile'
import Prontuario from './pages/Prontuario'
import HomeAdm from '@features/admin/pages/HomeAdm'
import UsuariosList from '@features/admin/pages/UsuariosList'
import PerfisList from './features/admin/pages/PerfisList'
import CriarPerfil from './features/admin/pages/CriarPerfil'
import CriarPsicologo from './features/admin/pages/CriarPsicologo'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/pacientes" element={<Pacientes />} />
          <Route path="/pacientes/:id" element={<Prontuario />} />
          <Route path="/perfil" element={<Profile />} />

          {/* Rotas Administrativas */}
          <Route path="/admin/dashboard" element={<HomeAdm />} />
          <Route path="/admin/usuarios" element={<UsuariosList />} />
          <Route path="/admin/perfis" element={<PerfisList />} />
          <Route path="/admin/perfis/novo" element={<CriarPerfil />} />
          <Route path="/admin/psicologo/novo" element={<CriarPsicologo />} />
        </Route>
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
