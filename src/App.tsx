import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/auth'

// Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import DashboardLayout from './layouts/DashboardLayout'
import DashboardPage from './pages/dashboard/DashboardPage'
import AgendaPage from './pages/dashboard/AgendaPage'
import ClientesPage from './pages/dashboard/ClientesPage'
import ClienteNovoPage from './pages/dashboard/ClienteNovoPage'
import ClienteDetailPage from './pages/dashboard/ClienteDetailPage'
import ConsultasPage from './pages/dashboard/ConsultasPage'
import ConsultaNovaPage from './pages/dashboard/ConsultaNovaPage'
import ConsultaDetailPage from './pages/dashboard/ConsultaDetailPage'
import DefinicoesPage from './pages/dashboard/DefinicoesPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-sage-200 border-t-sage-600 rounded-full" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="agenda" element={<AgendaPage />} />
        <Route path="clientes" element={<ClientesPage />} />
        <Route path="clientes/novo" element={<ClienteNovoPage />} />
        <Route path="clientes/:id" element={<ClienteDetailPage />} />
        <Route path="consultas" element={<ConsultasPage />} />
        <Route path="consultas/nova" element={<ConsultaNovaPage />} />
        <Route path="consultas/:id" element={<ConsultaDetailPage />} />
        <Route path="definicoes" element={<DefinicoesPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

