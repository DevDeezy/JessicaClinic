import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Users, 
  Plus, 
  Search, 
  Phone, 
  Mail,
  Calendar,
  MoreVertical,
  Trash2,
  Edit
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '../../store/auth'
import { api } from '../../lib/api'

interface Client {
  id: string
  name: string
  email: string | null
  phone: string
  _count: {
    appointments: number
  }
}

export default function ClientesPage() {
  const { token } = useAuthStore()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  useEffect(() => {
    if (token) fetchClients()
  }, [token])

  const fetchClients = async (search?: string) => {
    try {
      const data = await api.getClients(token!, search)
      setClients(data)
    } catch (error) {
      console.error('Error fetching clients:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchClients(searchQuery)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem a certeza que deseja eliminar este cliente?')) return

    try {
      await api.deleteClient(token!, id)
      toast.success('Cliente eliminado')
      setClients(clients.filter(c => c.id !== id))
    } catch (error) {
      toast.error('Erro ao eliminar cliente')
    }
    setOpenMenuId(null)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-sage-100 rounded w-48 animate-pulse" />
          <div className="h-10 bg-sage-100 rounded w-32 animate-pulse" />
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-sage-100 rounded-full" />
                <div className="flex-1">
                  <div className="h-5 bg-sage-100 rounded w-40 mb-2" />
                  <div className="h-4 bg-sage-50 rounded w-60" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold text-sage-800">Clientes</h1>
          <p className="text-sage-500 mt-1">{clients.length} clientes registados</p>
        </div>
        <Link
          to="/dashboard/clientes/novo"
          className="flex items-center gap-2 px-5 py-2.5 bg-sage-700 text-cream-50 rounded-xl font-medium hover:bg-sage-800 transition-all"
        >
          <Plus className="w-4 h-4" />
          Novo Cliente
        </Link>
      </div>

      <form onSubmit={handleSearch} className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Pesquisar por nome, email ou telefone..."
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 outline-none transition-all bg-white"
        />
      </form>

      {clients.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <Users className="w-16 h-16 text-sage-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-sage-800 mb-2">Sem clientes</h3>
          <p className="text-sage-500 mb-6">Comece por adicionar o seu primeiro cliente</p>
          <Link
            to="/dashboard/clientes/novo"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-terracotta-500 text-white rounded-xl font-medium hover:bg-terracotta-600 transition-all"
          >
            <Plus className="w-4 h-4" />
            Adicionar Cliente
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {clients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sage-300 to-sage-500 flex items-center justify-center text-white font-semibold text-xl">
                  {client.name.charAt(0)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <Link 
                    to={`/dashboard/clientes/${client.id}`}
                    className="font-semibold text-sage-800 hover:text-terracotta-500 transition-colors"
                  >
                    {client.name}
                  </Link>
                  <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-sage-500">
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {client.phone}
                    </span>
                    {client.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {client.email}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {client._count.appointments} consultas
                    </span>
                  </div>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === client.id ? null : client.id)}
                    className="p-2 rounded-lg hover:bg-sage-50 transition-colors"
                  >
                    <MoreVertical className="w-5 h-5 text-sage-500" />
                  </button>

                  {openMenuId === client.id && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-sage-100 py-2 z-10">
                      <Link
                        to={`/dashboard/clientes/${client.id}`}
                        className="flex items-center gap-2 px-4 py-2 text-sage-700 hover:bg-sage-50"
                      >
                        <Edit className="w-4 h-4" />
                        Ver/Editar
                      </Link>
                      <Link
                        to={`/dashboard/consultas/nova?clientId=${client.id}`}
                        className="flex items-center gap-2 px-4 py-2 text-sage-700 hover:bg-sage-50"
                      >
                        <Calendar className="w-4 h-4" />
                        Agendar Consulta
                      </Link>
                      <button
                        onClick={() => handleDelete(client.id)}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full"
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

