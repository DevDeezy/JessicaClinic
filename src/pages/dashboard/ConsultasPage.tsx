import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Calendar, Plus, Clock, CheckCircle2, XCircle, AlertCircle, MoreVertical, Trash2, Edit } from 'lucide-react'
import { format, parseISO, isToday, isTomorrow, isPast } from 'date-fns'
import { pt } from 'date-fns/locale'
import toast from 'react-hot-toast'
import { useAuthStore } from '../../store/auth'
import { api } from '../../lib/api'

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

const typeLabels: Record<string, string> = {
  consulta: 'Consulta',
  sessao: 'Sessão',
  avaliacao: 'Avaliação',
  followup: 'Follow-up',
}

export default function ConsultasPage() {
  const { token } = useAuthStore()
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  useEffect(() => {
    if (token) fetchAppointments()
  }, [token])

  const fetchAppointments = async () => {
    try {
      const data = await api.getAppointments(token!)
      setAppointments(data)
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.updateAppointment(token!, id, { status: newStatus })
      toast.success('Estado atualizado')
      fetchAppointments()
    } catch (error) {
      toast.error('Erro ao atualizar estado')
    }
    setOpenMenuId(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem a certeza que deseja eliminar esta consulta?')) return
    try {
      await api.deleteAppointment(token!, id)
      toast.success('Consulta eliminada')
      setAppointments(appointments.filter(a => a.id !== id))
    } catch (error) {
      toast.error('Erro ao eliminar consulta')
    }
    setOpenMenuId(null)
  }

  const formatAppointmentDate = (dateStr: string) => {
    const date = parseISO(dateStr)
    if (isToday(date)) return { day: 'Hoje', time: format(date, 'HH:mm'), highlight: true }
    if (isTomorrow(date)) return { day: 'Amanhã', time: format(date, 'HH:mm'), highlight: false }
    return { day: format(date, "d 'de' MMMM", { locale: pt }), time: format(date, 'HH:mm'), highlight: false }
  }

  const filteredAppointments = filterStatus === 'all' ? appointments : appointments.filter(a => a.status === filterStatus)

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
                <div className="w-16 h-16 bg-sage-100 rounded-xl" />
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
          <h1 className="text-3xl font-display font-semibold text-sage-800">Consultas</h1>
          <p className="text-sage-500 mt-1">{appointments.length} consultas registadas</p>
        </div>
        <Link to="/dashboard/consultas/nova" className="flex items-center gap-2 px-5 py-2.5 bg-terracotta-500 text-white rounded-xl font-medium hover:bg-terracotta-600">
          <Plus className="w-4 h-4" />
          Nova Consulta
        </Link>
      </div>

      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'all', label: 'Todas', color: 'sage' },
          { key: 'scheduled', label: 'Agendadas', color: 'blue' },
          { key: 'completed', label: 'Concluídas', color: 'green' },
          { key: 'cancelled', label: 'Canceladas', color: 'red' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilterStatus(f.key)}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${filterStatus === f.key ? `bg-${f.color}-600 text-white` : 'bg-white text-sage-600 hover:bg-sage-50'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <Calendar className="w-16 h-16 text-sage-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-sage-800 mb-2">Sem consultas</h3>
          <p className="text-sage-500 mb-6">{filterStatus === 'all' ? 'Comece por agendar a primeira consulta' : 'Nenhuma consulta com este estado'}</p>
          <Link to="/dashboard/consultas/nova" className="inline-flex items-center gap-2 px-5 py-2.5 bg-terracotta-500 text-white rounded-xl font-medium hover:bg-terracotta-600">
            <Plus className="w-4 h-4" />
            Nova Consulta
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredAppointments.map((appointment, index) => {
            const dateInfo = formatAppointmentDate(appointment.date)
            const isPastAppointment = isPast(parseISO(appointment.date)) && appointment.status === 'scheduled'
            return (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all ${isPastAppointment ? 'border-l-4 border-orange-400' : ''}`}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-20 h-20 rounded-xl flex flex-col items-center justify-center ${dateInfo.highlight ? 'bg-terracotta-100 text-terracotta-700' : 'bg-sage-100 text-sage-700'}`}>
                    <span className="text-sm font-medium">{dateInfo.day}</span>
                    <span className="text-2xl font-bold">{dateInfo.time}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/dashboard/consultas/${appointment.id}`} className="font-semibold text-sage-800 hover:text-terracotta-500 text-lg">
                      {appointment.client.name}
                    </Link>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-sage-500">
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{appointment.duration} minutos</span>
                      <span className="px-2 py-0.5 bg-sage-100 rounded-full">{typeLabels[appointment.type] || appointment.type}</span>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-xl text-sm font-medium ${statusColors[appointment.status] || statusColors.scheduled}`}>
                    {statusLabels[appointment.status] || appointment.status}
                  </div>
                  <div className="relative">
                    <button onClick={() => setOpenMenuId(openMenuId === appointment.id ? null : appointment.id)} className="p-2 rounded-lg hover:bg-sage-50">
                      <MoreVertical className="w-5 h-5 text-sage-500" />
                    </button>
                    {openMenuId === appointment.id && (
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-sage-100 py-2 z-10">
                        <Link to={`/dashboard/consultas/${appointment.id}`} className="flex items-center gap-2 px-4 py-2 text-sage-700 hover:bg-sage-50">
                          <Edit className="w-4 h-4" />Ver Detalhes
                        </Link>
                        <div className="border-t border-sage-100 my-2" />
                        <button onClick={() => handleStatusChange(appointment.id, 'completed')} className="flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-green-50 w-full">
                          <CheckCircle2 className="w-4 h-4" />Marcar como Concluída
                        </button>
                        <button onClick={() => handleStatusChange(appointment.id, 'cancelled')} className="flex items-center gap-2 px-4 py-2 text-orange-600 hover:bg-orange-50 w-full">
                          <XCircle className="w-4 h-4" />Cancelar Consulta
                        </button>
                        <button onClick={() => handleStatusChange(appointment.id, 'no-show')} className="flex items-center gap-2 px-4 py-2 text-amber-600 hover:bg-amber-50 w-full">
                          <AlertCircle className="w-4 h-4" />Marcar Falta
                        </button>
                        <div className="border-t border-sage-100 my-2" />
                        <button onClick={() => handleDelete(appointment.id)} className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full">
                          <Trash2 className="w-4 h-4" />Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

