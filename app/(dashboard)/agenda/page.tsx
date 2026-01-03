'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon,
  Clock,
  User
} from 'lucide-react'
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameDay, 
  addWeeks, 
  subWeeks,
  parseISO,
  isToday,
  addDays,
  getHours,
  getMinutes,
  differenceInMinutes,
  setHours,
  setMinutes
} from 'date-fns'
import { pt } from 'date-fns/locale'

interface Appointment {
  id: string
  date: string
  duration: number
  status: string
  type: string
  client: {
    id: string
    name: string
    phone: string
  }
}

const statusColors: Record<string, { bg: string; border: string; text: string }> = {
  scheduled: { bg: 'bg-sky-100', border: 'border-sky-400', text: 'text-sky-800' },
  completed: { bg: 'bg-emerald-100', border: 'border-emerald-400', text: 'text-emerald-800' },
  cancelled: { bg: 'bg-red-100', border: 'border-red-400', text: 'text-red-800' },
  'no-show': { bg: 'bg-amber-100', border: 'border-amber-400', text: 'text-amber-800' },
}

const HOUR_HEIGHT = 60 // pixels per hour
const START_HOUR = 7 // 7 AM
const END_HOUR = 24 // Midnight
const HOURS = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i)

export default function AgendaPage() {
  const router = useRouter()
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/appointments')
      if (res.ok) {
        const data = await res.json()
        setAppointments(data)
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 })
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter(apt => 
      isSameDay(parseISO(apt.date), day)
    )
  }

  // Calculate position and height for an appointment
  const getAppointmentStyle = (apt: Appointment) => {
    const date = parseISO(apt.date)
    const hours = getHours(date)
    const minutes = getMinutes(date)
    
    const topOffset = (hours - START_HOUR) * HOUR_HEIGHT + (minutes / 60) * HOUR_HEIGHT
    const height = (apt.duration / 60) * HOUR_HEIGHT
    
    return {
      top: `${topOffset}px`,
      height: `${Math.max(height, 24)}px`, // Minimum height of 24px
    }
  }

  // Calculate current time indicator position
  const getCurrentTimePosition = () => {
    const hours = getHours(currentTime)
    const minutes = getMinutes(currentTime)
    
    if (hours < START_HOUR || hours > END_HOUR) return null
    
    const topOffset = (hours - START_HOUR) * HOUR_HEIGHT + (minutes / 60) * HOUR_HEIGHT
    return topOffset
  }

  const currentTimePosition = getCurrentTimePosition()
  const todayIndex = weekDays.findIndex(day => isToday(day))

  // Handle click on empty time slot
  const handleTimeSlotClick = useCallback((day: Date, event: React.MouseEvent<HTMLDivElement>) => {
    // Get click position relative to the container
    const rect = event.currentTarget.getBoundingClientRect()
    const clickY = event.clientY - rect.top
    
    // Calculate the hour and minutes from click position
    const totalMinutes = (clickY / HOUR_HEIGHT) * 60
    const hour = Math.floor(totalMinutes / 60) + START_HOUR
    const minutes = Math.floor(totalMinutes % 60 / 15) * 15 // Round to nearest 15 minutes
    
    // Create the datetime
    const selectedDateTime = setMinutes(setHours(day, hour), minutes)
    
    // Format for URL
    const dateParam = format(selectedDateTime, 'yyyy-MM-dd')
    const timeParam = format(selectedDateTime, 'HH:mm')
    
    // Navigate to new appointment page with pre-filled date and time
    router.push(`/consultas/nova?date=${dateParam}&time=${timeParam}`)
  }, [router])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-semibold text-sage-800">Agenda</h1>
          <p className="text-sage-500 mt-1">Vista semanal das suas consultas</p>
        </div>
        <Link
          href="/consultas/nova"
          className="flex items-center gap-2 px-5 py-2.5 bg-terracotta-500 text-white rounded-xl font-medium hover:bg-terracotta-600 transition-all"
        >
          <Plus className="w-4 h-4" />
          Nova Consulta
        </Link>
      </div>

      {/* Calendar Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm overflow-hidden"
      >
        {/* Navigation Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-sage-100">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentWeek(new Date())}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-sage-100 text-sage-700 hover:bg-sage-200 transition-colors"
            >
              Hoje
            </button>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
                className="p-2 rounded-lg hover:bg-sage-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-sage-600" />
              </button>
              <button
                onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
                className="p-2 rounded-lg hover:bg-sage-50 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-sage-600" />
              </button>
            </div>
            <h2 className="text-lg font-semibold text-sage-800">
              {format(weekStart, "d 'de' MMMM", { locale: pt })} - {format(weekEnd, "d 'de' MMMM yyyy", { locale: pt })}
            </h2>
          </div>
          
          {/* Legend */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-sky-200 border border-sky-400" />
              <span className="text-xs text-sage-600">Agendada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-emerald-200 border border-emerald-400" />
              <span className="text-xs text-sage-600">Concluída</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-red-200 border border-red-400" />
              <span className="text-xs text-sage-600">Cancelada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-amber-200 border border-amber-400" />
              <span className="text-xs text-sage-600">Faltou</span>
            </div>
          </div>
        </div>

        {/* Week Header */}
        <div className="grid grid-cols-8 border-b border-sage-100">
          {/* Time column header */}
          <div className="p-3 text-center text-sm text-sage-400 border-r border-sage-100" />
          
          {/* Day headers */}
          {weekDays.map((day, index) => {
            const dayIsToday = isToday(day)
            const dayAppointments = getAppointmentsForDay(day)
            
            return (
              <div
                key={index}
                className={`p-3 text-center border-r border-sage-100 last:border-r-0 ${
                  dayIsToday ? 'bg-terracotta-50' : ''
                }`}
              >
                <div className={`text-xs font-medium uppercase tracking-wide ${
                  dayIsToday ? 'text-terracotta-600' : 'text-sage-500'
                }`}>
                  {format(day, 'EEE', { locale: pt })}
                </div>
                <div className={`mt-1 inline-flex items-center justify-center w-10 h-10 rounded-full text-lg font-semibold ${
                  dayIsToday 
                    ? 'bg-terracotta-500 text-white' 
                    : 'text-sage-800'
                }`}>
                  {format(day, 'd')}
                </div>
                {dayAppointments.length > 0 && (
                  <div className={`text-xs mt-1 ${dayIsToday ? 'text-terracotta-600' : 'text-sage-400'}`}>
                    {dayAppointments.length} consulta{dayAppointments.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Time Grid */}
        <div className="grid grid-cols-8 overflow-auto max-h-[calc(100vh-320px)]" style={{ minHeight: `${HOURS.length * HOUR_HEIGHT}px` }}>
          {/* Time labels column */}
          <div className="border-r border-sage-100 relative">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="absolute right-0 left-0 text-right pr-3 text-xs text-sage-400"
                style={{ 
                  top: `${(hour - START_HOUR) * HOUR_HEIGHT}px`,
                  transform: 'translateY(-50%)'
                }}
              >
                {hour === 24 ? '00:00' : `${hour}:00`}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map((day, dayIndex) => {
            const dayAppointments = getAppointmentsForDay(day)
            const dayIsToday = isToday(day)
            
            return (
              <div
                key={dayIndex}
                onClick={(e) => handleTimeSlotClick(day, e)}
                className={`relative border-r border-sage-100 last:border-r-0 cursor-pointer hover:bg-sage-50/50 transition-colors ${
                  dayIsToday ? 'bg-terracotta-50/30 hover:bg-terracotta-50/50' : ''
                }`}
              >
                {/* Hour lines */}
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="absolute left-0 right-0 border-t border-sage-100"
                    style={{ top: `${(hour - START_HOUR) * HOUR_HEIGHT}px` }}
                  />
                ))}

                {/* Half hour lines */}
                {HOURS.slice(0, -1).map((hour) => (
                  <div
                    key={`half-${hour}`}
                    className="absolute left-0 right-0 border-t border-sage-50"
                    style={{ top: `${(hour - START_HOUR) * HOUR_HEIGHT + HOUR_HEIGHT / 2}px` }}
                  />
                ))}

                {/* Current time indicator */}
                {dayIsToday && currentTimePosition !== null && (
                  <div
                    className="absolute left-0 right-0 z-20 flex items-center"
                    style={{ top: `${currentTimePosition}px` }}
                  >
                    <div className="w-3 h-3 rounded-full bg-red-500 -ml-1.5" />
                    <div className="flex-1 h-0.5 bg-red-500" />
                  </div>
                )}

                {/* Appointments */}
                {dayAppointments.map((apt) => {
                  const style = getAppointmentStyle(apt)
                  const colors = statusColors[apt.status] || statusColors.scheduled
                  const aptDate = parseISO(apt.date)
                  const aptHour = getHours(aptDate)
                  
                  // Only show if within visible hours
                  if (aptHour < START_HOUR || aptHour >= END_HOUR) return null
                  
                  return (
                    <Link
                      key={apt.id}
                      href={`/consultas/${apt.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className={`absolute left-1 right-1 rounded-lg border-l-4 ${colors.bg} ${colors.border} ${colors.text} p-2 overflow-hidden hover:shadow-md transition-shadow z-10 cursor-pointer`}
                      style={style}
                    >
                      <div className="text-xs font-semibold truncate">
                        {format(aptDate, 'HH:mm')}
                      </div>
                      <div className="text-xs font-medium truncate mt-0.5">
                        {apt.client.name}
                      </div>
                      {parseInt(style.height) >= 50 && (
                        <div className="text-xs opacity-75 truncate">
                          {apt.type}
                        </div>
                      )}
                    </Link>
                  )
                })}
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Today's Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 shadow-sm"
      >
        <h3 className="font-semibold text-sage-800 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-terracotta-500" />
          Consultas de Hoje
        </h3>
        
        {(() => {
          const todayAppointments = getAppointmentsForDay(new Date()).sort((a, b) => 
            new Date(a.date).getTime() - new Date(b.date).getTime()
          )
          
          if (loading) {
            return (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="p-4 bg-cream-50 rounded-xl animate-pulse">
                    <div className="h-4 bg-sage-100 rounded w-20 mb-2" />
                    <div className="h-5 bg-sage-100 rounded w-32" />
                  </div>
                ))}
              </div>
            )
          }
          
          if (todayAppointments.length === 0) {
            return (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 text-sage-300 mx-auto mb-3" />
                <p className="text-sage-500">Não tem consultas agendadas para hoje.</p>
                <Link
                  href="/consultas/nova"
                  className="inline-block mt-4 text-terracotta-500 hover:text-terracotta-600 font-medium text-sm"
                >
                  Agendar consulta
                </Link>
              </div>
            )
          }

          return (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {todayAppointments.map((apt) => {
                const colors = statusColors[apt.status] || statusColors.scheduled
                return (
                  <Link
                    key={apt.id}
                    href={`/consultas/${apt.id}`}
                    className={`flex items-center gap-4 p-4 rounded-xl border-l-4 ${colors.bg} ${colors.border} hover:shadow-md transition-all`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/50 flex items-center justify-center text-sage-700 font-semibold">
                      {apt.client.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${colors.text}`}>{apt.client.name}</p>
                      <p className="text-sm opacity-75">
                        {format(parseISO(apt.date), 'HH:mm')} • {apt.duration} min
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          )
        })()}
      </motion.div>
    </div>
  )
}
