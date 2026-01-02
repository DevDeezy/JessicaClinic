import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Calendar, Clock, User, FileText } from 'lucide-react'
import { format, addDays, setHours, setMinutes } from 'date-fns'
import toast from 'react-hot-toast'
import { useAuthStore } from '../../store/auth'
import { api } from '../../lib/api'

export default function ConsultaNovaPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preSelectedClientId = searchParams.get('clientId')
  const preSelectedDate = searchParams.get('date')
  const { token } = useAuthStore()
  
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    clientId: preSelectedClientId || '',
    date: preSelectedDate || format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    time: '10:00',
    duration: 60,
    type: 'consulta',
    notes: ''
  })

  useEffect(() => {
    if (token) fetchClients()
  }, [token])

  const fetchClients = async () => {
    try {
      const data = await api.getClients(token!)
      setClients(data)
    } catch (error) {
      console.error('Error fetching clients:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.clientId) {
      toast.error('Selecione um cliente')
      return
    }
    setLoading(true)
    try {
      const [hours, minutes] = formData.time.split(':').map(Number)
      const dateTime = setMinutes(setHours(new Date(formData.date), hours), minutes)
      const appointment = await api.createAppointment(token!, {
        clientId: formData.clientId,
        date: dateTime.toISOString(),
        duration: formData.duration,
        type: formData.type,
        notes: formData.notes
      })
      toast.success('Consulta agendada com sucesso!')
      navigate(`/dashboard/consultas/${appointment.id}`)
    } catch (error: any) {
      toast.error(error.message || 'Erro ao agendar consulta')
    } finally {
      setLoading(false)
    }
  }

  const timeSlots = []
  for (let h = 8; h <= 20; h++) {
    for (let m = 0; m < 60; m += 30) {
      timeSlots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/consultas" className="p-2 rounded-xl hover:bg-sage-100">
            <ArrowLeft className="w-5 h-5 text-sage-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-display font-semibold text-sage-800">Nova Consulta</h1>
            <p className="text-sage-500 mt-1">Agende uma nova consulta</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-sage-800 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-terracotta-500" />
              Cliente
            </h2>
            {clients.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sage-500 mb-4">Ainda não tem clientes registados</p>
                <Link to="/dashboard/clientes/novo" className="text-terracotta-500 hover:text-terracotta-600 font-medium">Criar primeiro cliente</Link>
              </div>
            ) : (
              <select
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 outline-none bg-white"
                required
              >
                <option value="">Selecione um cliente</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>{client.name} - {client.phone}</option>
                ))}
              </select>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-sage-800 mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-terracotta-500" />
              Data e Hora
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">Data *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">Hora *</label>
                <select
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 outline-none bg-white"
                  required
                >
                  {timeSlots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-sage-800 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-terracotta-500" />
              Detalhes
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">Duração</label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 outline-none bg-white"
                >
                  <option value={30}>30 minutos</option>
                  <option value={45}>45 minutos</option>
                  <option value={60}>1 hora</option>
                  <option value={90}>1 hora e 30 minutos</option>
                  <option value={120}>2 horas</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">Tipo</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 outline-none bg-white"
                >
                  <option value="consulta">Consulta</option>
                  <option value="avaliacao">Avaliação Inicial</option>
                  <option value="sessao">Sessão de Tratamento</option>
                  <option value="followup">Follow-up</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-sage-800 mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-terracotta-500" />
              Notas
            </h2>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 outline-none resize-none"
              placeholder="Motivo da consulta, observações prévias..."
            />
          </div>

          <div className="flex justify-end gap-4">
            <Link to="/dashboard/consultas" className="px-6 py-3 rounded-xl border border-sage-200 text-sage-700 font-medium hover:bg-sage-50">Cancelar</Link>
            <button
              type="submit"
              disabled={loading || clients.length === 0}
              className="flex items-center gap-2 px-6 py-3 bg-terracotta-500 text-white rounded-xl font-medium hover:bg-terracotta-600 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? 'A agendar...' : 'Agendar Consulta'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

