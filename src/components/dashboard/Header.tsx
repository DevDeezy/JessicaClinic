import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Search, Plus } from 'lucide-react'

interface HeaderProps {
  user: {
    name: string
    email: string
  } | null
}

export default function Header({ user }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="h-16 bg-white border-b border-sage-100 px-6 flex items-center justify-between">
      {/* Search */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Pesquisar clientes, consultas..."
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 outline-none transition-all bg-cream-50"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <Link
          to="/dashboard/consultas/nova"
          className="flex items-center gap-2 px-4 py-2 bg-terracotta-500 text-white rounded-xl font-medium hover:bg-terracotta-600 transition-all"
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

