import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock } from 'lucide-react'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO, isToday } from 'date-fns'
import { pt } from 'date-fns/locale'
import { useAuthStore } from '../../store/auth'
import { api } from '../../lib/api'

const statusColors: Record<string, string> = {
  scheduled: 'bg-blue-500',
  completed: 'bg-green-500',
  cancelled: 'bg-red-500',
  'no-show': 'bg-orange-500',
}

export default function AgendaPage() {
  const { token } = useAuthStore()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const getAppointmentsForDay = (day: Date) => appointments.filter(apt => isSameDay(parseISO(apt.date), day))

  const selectedDayAppointments = getAppointmentsForDay(selectedDate).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-semibold text-sage-800">Agenda</h1>
          <p className="text-sage-500 mt-1">Visualize e gerencie as suas consultas</p>
        </div>
        <Link
          to={`/dashboard/consultas/nova?date=${format(selectedDate, 'yyyy-MM-dd')}`}
          className="flex items-center gap-2 px-5 py-2.5 bg-terracotta-500 text-white rounded-xl font-medium hover:bg-terracotta-600"
        >
          <Plus className="w-4 h-4" />Nova Consulta
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-sage-800">{format(currentMonth, 'MMMM yyyy', { locale: pt })}</h2>
            <div className="flex gap-2">
              <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 rounded-lg hover:bg-sage-50">
                <ChevronLeft className="w-5 h-5 text-sage-600" />
              </button>
              <button onClick={() => setCurrentMonth(new Date())} className="px-3 py-1 text-sm rounded-lg hover:bg-sage-50 text-sage-600">Hoje</button>
              <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 rounded-lg hover:bg-sage-50">
                <ChevronRight className="w-5 h-5 text-sage-600" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-sage-500 py-2">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => {
              const dayAppointments = getAppointmentsForDay(day)
              const isCurrentMonth = isSameMonth(day, currentMonth)
              const isSelected = isSameDay(day, selectedDate)
              const isTodayDate = isToday(day)
              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(day)}
                  className={`relative p-2 min-h-[80px] rounded-xl text-left transition-all
                    ${isCurrentMonth ? 'bg-cream-50' : 'bg-gray-50 opacity-50'}
                    ${isSelected ? 'ring-2 ring-terracotta-500 bg-terracotta-50' : 'hover:bg-sage-50'}
                    ${isTodayDate ? 'ring-2 ring-sage-400' : ''}`}
                >
                  <span className={`text-sm font-medium ${isSelected ? 'text-terracotta-600' : isCurrentMonth ? 'text-sage-700' : 'text-sage-400'} ${isTodayDate ? 'font-bold' : ''}`}>
                    {format(day, 'd')}
                  </span>
                  {dayAppointments.length > 0 && (
                    <div className="mt-1 space-y-1">
                      {dayAppointments.slice(0, 2).map((apt) => (
                        <div key={apt.id} className={`text-xs px-1 py-0.5 rounded truncate text-white ${statusColors[apt.status] || statusColors.scheduled}`}>
                          {format(parseISO(apt.date), 'HH:mm')}
                        </div>
                      ))}
                      {dayAppointments.length > 2 && <div className="text-xs text-sage-500 px-1">+{dayAppointments.length - 2} mais</div>}
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          <div className="flex gap-6 mt-6 pt-4 border-t border-sage-100">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500" /><span className="text-sm text-sage-600">Agendada</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500" /><span className="text-sm text-sage-600">Concluída</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500" /><span className="text-sm text-sage-600">Cancelada</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500" /><span className="text-sm text-sage-600">Faltou</span></div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-sage-800">{format(selectedDate, "d 'de' MMMM", { locale: pt })}</h3>
              <p className="text-sm text-sage-500">{format(selectedDate, 'EEEE', { locale: pt })}</p>
            </div>
            <Link
              to={`/dashboard/consultas/nova?date=${format(selectedDate, 'yyyy-MM-dd')}`}
              className="p-2 rounded-lg hover:bg-sage-50"
            >
              <Plus className="w-5 h-5 text-sage-600" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="p-4 bg-cream-50 rounded-xl animate-pulse"><div className="h-4 bg-sage-100 rounded w-20 mb-2" /><div className="h-5 bg-sage-100 rounded w-32" /></div>)}</div>
          ) : selectedDayAppointments.length === 0 ? (
            <div className="text-center py-8">
              <CalendarIcon className="w-12 h-12 text-sage-300 mx-auto mb-3" />
              <p className="text-sage-500">Sem consultas neste dia</p>
              <Link
                to={`/dashboard/consultas/nova?date=${format(selectedDate, 'yyyy-MM-dd')}`}
                className="inline-block mt-4 text-terracotta-500 hover:text-terracotta-600 font-medium text-sm"
              >
                Agendar consulta
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedDayAppointments.map((apt) => (
                <Link key={apt.id} to={`/dashboard/consultas/${apt.id}`} className="block p-4 bg-cream-50 rounded-xl hover:bg-cream-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-2 h-2 rounded-full ${statusColors[apt.status]}`} />
                    <span className="text-sm font-medium text-sage-600">{format(parseISO(apt.date), 'HH:mm')}</span>
                    <span className="text-xs text-sage-400">{apt.duration} min</span>
                  </div>
                  <p className="font-medium text-sage-800">{apt.client.name}</p>
                  <p className="text-sm text-sage-500 mt-1">{apt.type}</p>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-semibold text-sage-800 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-terracotta-500" />Consultas de Hoje
        </h3>
        {(() => {
          const todayAppointments = getAppointmentsForDay(new Date()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          if (todayAppointments.length === 0) return <p className="text-sage-500">Não tem consultas agendadas para hoje.</p>
          return (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {todayAppointments.map((apt) => (
                <Link key={apt.id} to={`/dashboard/consultas/${apt.id}`} className="flex items-center gap-4 p-4 bg-cream-50 rounded-xl hover:bg-cream-100">
                  <div className="w-12 h-12 rounded-xl bg-sage-200 flex items-center justify-center text-sage-700 font-semibold">{apt.client.name.charAt(0)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sage-800 truncate">{apt.client.name}</p>
                    <p className="text-sm text-sage-500">{format(parseISO(apt.date), 'HH:mm')} • {apt.duration} min</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${statusColors[apt.status]}`} />
                </Link>
              ))}
            </div>
          )
        })()}
      </motion.div>
    </div>
  )
}

