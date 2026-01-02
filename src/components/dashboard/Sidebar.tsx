import { Link, useLocation } from 'react-router-dom'
import {
  Heart,
  LayoutDashboard,
  Calendar,
  Users,
  ClipboardList,
  Settings,
  LogOut,
  X,
} from 'lucide-react'
import { useAuthStore } from '../../store/auth'
import { clsx } from 'clsx'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Agenda', href: '/dashboard/agenda', icon: Calendar },
  { name: 'Consultas', href: '/dashboard/consultas', icon: ClipboardList },
  { name: 'Clientes', href: '/dashboard/clientes', icon: Users },
  { name: 'Definições', href: '/dashboard/definicoes', icon: Settings },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation()
  const { logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  return (
    <aside
      className={clsx(
        'fixed inset-y-0 left-0 w-64 bg-sage-800 text-white flex flex-col transform transition-transform duration-200 z-30',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0 lg:static lg:transform-none'
      )}
    >
      {/* Logo / Close */}
      <div className="p-6 border-b border-sage-700 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-3" onClick={onClose}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-terracotta-400 to-terracotta-600 flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-2xl font-semibold">Jessica</span>
        </Link>
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-sage-700/50 transition-colors"
          onClick={onClose}
          aria-label="Fechar menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive =
            location.pathname === item.href ||
            (item.href !== '/dashboard' && location.pathname.startsWith(item.href))
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                isActive
                  ? 'bg-sage-700 text-white'
                  : 'text-sage-300 hover:bg-sage-700/50 hover:text-white'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-sage-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sage-300 hover:bg-sage-700/50 hover:text-white transition-all w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </aside>
  )
}

