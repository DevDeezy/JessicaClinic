import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Users, 
  Calendar, 
  Clock, 
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  XCircle
} from 'lucide-react'
import { format, parseISO, isToday, isTomorrow } from 'date-fns'
import { pt } from 'date-fns/locale'
import { useAuthStore } from '../../store/auth'
import { api } from '../../lib/api'

interface Stats {
  totalClients: number
  todayAppointments: number
  weekAppointments: number
  monthAppointments: number
}

interface Appointment {
  id: string
  date: string
  duration: number
  status: string
  type: string
  client: {
    id: string
    name: string
  }
}

const statusColors: Record<string, string> = {
  scheduled: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  'no-show': 'bg-orange-100 text-orange-700',
}

const statusLabels: Record<string, string> = {
  scheduled: 'Agendada',
  completed: 'Concluída',
  cancelled: 'Cancelada',
  'no-show': 'Faltou',
}

const statusIcons: Record<string, any> = {
  scheduled: Clock,
  completed: CheckCircle2,
  cancelled: XCircle,
  'no-show': AlertCircle,
}

export default function DashboardPage() {
  const { token } = useAuthStore()
  const [stats, setStats] = useState<Stats | null>(null)
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      fetchData()
    }
  }, [token])

  const fetchData = async () => {
    try {
      const [statsData, appointmentsData] = await Promise.all([
        api.getStats(token!),
        api.getAppointments(token!, { limit: 5, upcoming: true })
      ])
      setStats(statsData)
      setUpcomingAppointments(appointmentsData)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatAppointmentDate = (dateStr: string) => {
    const date = parseISO(dateStr)
    if (isToday(date)) {
      return `Hoje às ${format(date, 'HH:mm', { locale: pt })}`
    }
    if (isTomorrow(date)) {
      return `Amanhã às ${format(date, 'HH:mm', { locale: pt })}`
    }
    return format(date, "d 'de' MMMM 'às' HH:mm", { locale: pt })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
              <div className="w-12 h-12 bg-sage-100 rounded-xl mb-4" />
              <div className="h-8 bg-sage-100 rounded w-20 mb-2" />
              <div className="h-4 bg-sage-50 rounded w-32" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-semibold text-sage-800">
          Bom dia! 👋
        </h1>
        <p className="text-sage-500 mt-1">
          Aqui está um resumo da sua clínica
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total de Clientes', value: stats?.totalClients || 0, icon: Users, color: 'sage' },
          { label: 'Consultas Hoje', value: stats?.todayAppointments || 0, icon: Calendar, color: 'terracotta' },
          { label: 'Esta Semana', value: stats?.weekAppointments || 0, icon: Clock, color: 'cream' },
          { label: 'Este Mês', value: stats?.monthAppointments || 0, icon: TrendingUp, color: 'sage' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`w-12 h-12 rounded-xl bg-${stat.color}-100 flex items-center justify-center text-${stat.color}-600 mb-4`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold text-sage-800">{stat.value}</p>
            <p className="text-sage-500 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-sage-800">Próximas Consultas</h2>
            <Link 
              to="/dashboard/agenda"
              className="flex items-center gap-1 text-sm text-terracotta-500 hover:text-terracotta-600"
            >
              Ver agenda
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-sage-300 mx-auto mb-3" />
              <p className="text-sage-500">Nenhuma consulta agendada</p>
              <Link
                to="/dashboard/consultas/nova"
                className="inline-block mt-4 text-terracotta-500 hover:text-terracotta-600 font-medium"
              >
                Agendar consulta
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => {
                const StatusIcon = statusIcons[appointment.status] || Clock
                return (
                  <Link
                    key={appointment.id}
                    to={`/dashboard/consultas/${appointment.id}`}
                    className="flex items-center gap-4 p-4 rounded-xl bg-cream-50 hover:bg-cream-100 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-sage-200 flex items-center justify-center text-sage-700 font-semibold">
                      {appointment.client.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sage-800 truncate">{appointment.client.name}</p>
                      <p className="text-sm text-sage-500">{formatAppointmentDate(appointment.date)}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[appointment.status] || statusColors.scheduled}`}>
                      <span className="flex items-center gap-1">
                        <StatusIcon className="w-3 h-3" />
                        {statusLabels[appointment.status] || appointment.status}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold text-sage-800 mb-6">Ações Rápidas</h2>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Nova Consulta', href: '/dashboard/consultas/nova', icon: Calendar, color: 'terracotta' },
              { label: 'Novo Cliente', href: '/dashboard/clientes/novo', icon: Users, color: 'sage' },
              { label: 'Ver Agenda', href: '/dashboard/agenda', icon: Clock, color: 'cream' },
              { label: 'Consultas', href: '/dashboard/consultas', icon: TrendingUp, color: 'sage' },
            ].map((action) => (
              <Link
                key={action.label}
                to={action.href}
                className={`p-6 rounded-xl bg-${action.color}-50 hover:bg-${action.color}-100 transition-colors group`}
              >
                <action.icon className={`w-8 h-8 text-${action.color}-600 mb-3 group-hover:scale-110 transition-transform`} />
                <p className="font-medium text-sage-800">{action.label}</p>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

