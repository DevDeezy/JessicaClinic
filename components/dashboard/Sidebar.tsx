'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Heart, 
  LayoutDashboard, 
  Calendar, 
  Users, 
  ClipboardList,
  Settings,
  LogOut
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { clsx } from 'clsx'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Agenda', href: '/agenda', icon: Calendar },
  { name: 'Consultas', href: '/consultas', icon: ClipboardList },
  { name: 'Clientes', href: '/clientes', icon: Users },
  { name: 'Definições', href: '/definicoes', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-sage-800 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sage-700">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-terracotta-400 to-terracotta-600 flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-2xl font-semibold">Jessica</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
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
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sage-300 hover:bg-sage-700/50 hover:text-white transition-all w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </aside>
  )
}

