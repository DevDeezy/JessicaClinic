import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, Search, Plus, Menu } from 'lucide-react'

interface HeaderProps {
  user: {
    name: string
    email: string
  } | null
  onOpenSidebar: () => void
}

export default function Header({ user, onOpenSidebar }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const query = searchQuery.trim()
    navigate(query ? `/dashboard/clientes?search=${encodeURIComponent(query)}` : '/dashboard/clientes')
  }

  return (
    <header className="h-16 bg-white border-b border-sage-100 px-4 md:px-6 flex items-center justify-between gap-4">
      {/* Mobile menu */}
      <button
        className="lg:hidden p-2 rounded-lg hover:bg-sage-50 transition-colors"
        onClick={onOpenSidebar}
        aria-label="Abrir menu"
      >
        <Menu className="w-5 h-5 text-sage-700" />
      </button>

      {/* Search */}
      <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Pesquisar clientes, consultas..."
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 outline-none transition-all bg-cream-50"
        />
      </form>

      {/* Right side */}
      <div className="flex items-center gap-3 md:gap-4">
        <Link
          to="/dashboard/consultas/nova"
          className="hidden sm:flex items-center gap-2 px-4 py-2 bg-terracotta-500 text-white rounded-xl font-medium hover:bg-terracotta-600 transition-all"
        >
          <Plus className="w-4 h-4" />
          Nova Consulta
        </Link>

        <button className="relative p-2 rounded-xl hover:bg-sage-50 transition-colors">
          <Bell className="w-5 h-5 text-sage-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-terracotta-500 rounded-full" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-sage-100">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center text-white font-medium">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-sage-800">{user?.name}</p>
            <p className="text-xs text-sage-500">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  )
}

