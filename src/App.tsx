import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from '@shared/layouts/DashboardLayout'
import RequireRole from '@shared/auth/RequireRole'

const Login = lazy(() => import('./pages/Login'))
const Home = lazy(() => import('./pages/Home'))
const Pacientes = lazy(() => import('./pages/Pacientes'))
const Profile = lazy(() => import('./pages/Profile'))
const Prontuario = lazy(() => import('./pages/Prontuario'))
const PacienteHome = lazy(() => import('./pages/PacienteHome'))
const HomeAdm = lazy(() => import('@features/admin/pages/HomeAdm'))
const UsuariosList = lazy(() => import('@features/admin/pages/UsuariosList'))
const PerfisList = lazy(() => import('./features/admin/pages/PerfisList'))
const CriarPerfil = lazy(() => import('./features/admin/pages/CriarPerfil'))
const CriarPsicologo = lazy(() => import('./features/admin/pages/CriarPsicologo'))

const pageLoader = (
  <div className="flex min-h-[240px] items-center justify-center" role="status" aria-label="Carregando página">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
  </div>
)

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={pageLoader}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<DashboardLayout />}>
          <Route element={<RequireRole allowed={['Psicologo']} />}>
            <Route path="/dashboard" element={<Home />} />
            <Route path="/pacientes" element={<Pacientes />} />
            <Route path="/pacientes/:id" element={<Prontuario />} />
            <Route path="/perfil" element={<Profile />} />
          </Route>
          <Route element={<RequireRole allowed={['Usuario', 'Paciente']} />}>
            <Route path="/paciente/home" element={<PacienteHome />} />
          </Route>

          {/* Rotas Administrativas */}
          <Route element={<RequireRole allowed={['Administrador']} />}>
            <Route path="/admin/dashboard" element={<HomeAdm />} />
            <Route path="/admin/usuarios" element={<UsuariosList />} />
            <Route path="/admin/perfis" element={<PerfisList />} />
            <Route path="/admin/perfis/novo" element={<CriarPerfil />} />
            <Route path="/admin/psicologo/novo" element={<CriarPsicologo />} />
          </Route>
        </Route>
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
