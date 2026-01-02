import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Save, Calendar, Clock, User, FileText, MessageSquare, FolderOpen, 
  Plus, ExternalLink, CheckCircle2, XCircle, AlertCircle, Phone, Edit2
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { pt } from 'date-fns/locale'
import toast from 'react-hot-toast'
import { useAuthStore } from '../../store/auth'
import { api } from '../../lib/api'

const statusColors: Record<string, string> = {
  scheduled: 'bg-blue-100 text-blue-700 border-blue-200',
  completed: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
  'no-show': 'bg-orange-100 text-orange-700 border-orange-200',
}

const statusLabels: Record<string, string> = {
  scheduled: 'Agendada',
  completed: 'Concluída',
  cancelled: 'Cancelada',
  'no-show': 'Faltou',
}

export default function ConsultaDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuthStore()
  const [appointment, setAppointment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({ date: '', time: '', duration: 60, type: 'consulta', notes: '', treatmentNotes: '' })
  const [newComment, setNewComment] = useState('')
  const [showFileModal, setShowFileModal] = useState(false)
  const [newFile, setNewFile] = useState({ name: '', url: '', description: '', type: 'document' })
  const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'files'>('details')

  useEffect(() => {
    if (token && id) fetchAppointment()
  }, [token, id])

  const fetchAppointment = async () => {
    try {
      const data = await api.getAppointment(token!, id!)
      setAppointment(data)
      const date = parseISO(data.date)
      setFormData({
        date: format(date, 'yyyy-MM-dd'),
        time: format(date, 'HH:mm'),
        duration: data.duration,
        type: data.type,
        notes: data.notes || '',
        treatmentNotes: data.treatmentNotes || ''
      })
    } catch (error) {
      toast.error('Consulta não encontrada')
      navigate('/dashboard/consultas')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const [hours, minutes] = formData.time.split(':').map(Number)
      const dateTime = new Date(formData.date)
      dateTime.setHours(hours, minutes, 0, 0)
      await api.updateAppointment(token!, id!, {
        date: dateTime.toISOString(),
        duration: formData.duration,
        type: formData.type,
        notes: formData.notes,
        treatmentNotes: formData.treatmentNotes
      })
      toast.success('Consulta atualizada!')
      setEditMode(false)
      fetchAppointment()
    } catch (error) {
      toast.error('Erro ao atualizar consulta')
    } finally {
      setSaving(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      await api.updateAppointment(token!, id!, { status: newStatus })
      toast.success('Estado atualizado!')
      fetchAppointment()
    } catch (error) {
      toast.error('Erro ao atualizar estado')
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return
    try {
      await api.addAppointmentComment(token!, id!, newComment)
      toast.success('Comentário adicionado')
      setNewComment('')
      fetchAppointment()
    } catch (error) {
      toast.error('Erro ao adicionar comentário')
    }
  }

  const handleAddFile = async () => {
    if (!newFile.name || !newFile.url) {
      toast.error('Nome e URL são obrigatórios')
      return
    }
    try {
      await api.addAppointmentFile(token!, id!, newFile)
      toast.success('Ficheiro adicionado')
      setNewFile({ name: '', url: '', description: '', type: 'document' })
      setShowFileModal(false)
      fetchAppointment()
    } catch (error) {
      toast.error('Erro ao adicionar ficheiro')
    }
  }

  const timeSlots = []
  for (let h = 8; h <= 20; h++) {
    for (let m = 0; m < 60; m += 30) {
      timeSlots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-sage-200 border-t-sage-600 rounded-full" />
      </div>
    )
  }

  if (!appointment) return null

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard/consultas" className="p-2 rounded-xl hover:bg-sage-100">
              <ArrowLeft className="w-5 h-5 text-sage-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-display font-semibold text-sage-800">Consulta - {appointment.client.name}</h1>
              <p className="text-sage-500 mt-1">{format(parseISO(appointment.date), "EEEE, d 'de' MMMM 'às' HH:mm", { locale: pt })}</p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-xl border font-medium ${statusColors[appointment.status]}`}>
            {statusLabels[appointment.status]}
          </div>
        </div>

        {appointment.status === 'scheduled' && (
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => handleStatusChange('completed')} className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl font-medium hover:bg-green-200">
              <CheckCircle2 className="w-4 h-4" />Marcar como Concluída
            </button>
            <button onClick={() => handleStatusChange('cancelled')} className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-xl font-medium hover:bg-red-200">
              <XCircle className="w-4 h-4" />Cancelar
            </button>
            <button onClick={() => handleStatusChange('no-show')} className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-xl font-medium hover:bg-orange-200">
              <AlertCircle className="w-4 h-4" />Faltou
            </button>
          </div>
        )}

        <div className="flex gap-2 border-b border-sage-200 pb-2">
          {[
            { id: 'details', label: 'Detalhes', icon: FileText },
            { id: 'comments', label: 'Notas de Sessão', icon: MessageSquare, count: appointment.comments?.length },
            { id: 'files', label: 'Ficheiros', icon: FolderOpen, count: appointment.files?.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === tab.id ? 'bg-sage-700 text-white' : 'text-sage-600 hover:bg-sage-100'}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.count !== undefined && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-sage-600' : 'bg-sage-200'}`}>{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'details' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-sage-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-terracotta-500" />Cliente
              </h3>
              <div className="space-y-3">
                <Link to={`/dashboard/clientes/${appointment.client.id}`} className="font-semibold text-sage-800 hover:text-terracotta-500 text-lg">
                  {appointment.client.name}
                </Link>
                <div className="flex items-center gap-2 text-sage-600">
                  <Phone className="w-4 h-4" />{appointment.client.phone}
                </div>
                <Link to={`/dashboard/clientes/${appointment.client.id}`} className="inline-block mt-2 text-terracotta-500 hover:text-terracotta-600 text-sm font-medium">
                  Ver ficha completa →
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-sage-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-terracotta-500" />Detalhes
                </h3>
                {!editMode && (
                  <button onClick={() => setEditMode(true)} className="flex items-center gap-1 text-sm text-sage-500 hover:text-sage-700">
                    <Edit2 className="w-4 h-4" />Editar
                  </button>
                )}
              </div>
              {editMode ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="px-3 py-2 rounded-lg border" />
                    <select value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} className="px-3 py-2 rounded-lg border">
                      {timeSlots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <select value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })} className="px-3 py-2 rounded-lg border">
                      <option value={30}>30 min</option>
                      <option value={45}>45 min</option>
                      <option value={60}>60 min</option>
                      <option value={90}>90 min</option>
                    </select>
                    <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="px-3 py-2 rounded-lg border">
                      <option value="consulta">Consulta</option>
                      <option value="avaliacao">Avaliação</option>
                      <option value="sessao">Sessão</option>
                      <option value="followup">Follow-up</option>
                    </select>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => setEditMode(false)} className="px-4 py-2 rounded-lg border text-sage-600">Cancelar</button>
                    <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-sage-700 text-white rounded-lg">
                      {saving ? 'A guardar...' : 'Guardar'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-sage-600">
                  <div className="flex items-center gap-2"><Calendar className="w-4 h-4" />{format(parseISO(appointment.date), "d 'de' MMMM 'de' yyyy", { locale: pt })}</div>
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4" />{format(parseISO(appointment.date), 'HH:mm')} • {appointment.duration} minutos</div>
                  <div className="px-2 py-1 bg-sage-100 rounded inline-block">{appointment.type}</div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm md:col-span-2">
              <h3 className="font-semibold text-sage-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-terracotta-500" />Notas
              </h3>
              {editMode ? (
                <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={4} className="w-full px-4 py-3 rounded-xl border border-sage-200 resize-none" placeholder="Notas..." />
              ) : (
                <p className="text-sage-600 whitespace-pre-wrap">{appointment.notes || 'Sem notas'}</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-sage-800 mb-4">Adicionar Nota de Sessão</h3>
              <div className="flex gap-4">
                <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Notas sobre esta sessão..." className="flex-1 px-4 py-3 rounded-xl border border-sage-200 resize-none" rows={3} />
                <button onClick={handleAddComment} disabled={!newComment.trim()} className="px-6 py-3 bg-sage-700 text-white rounded-xl font-medium disabled:opacity-50 self-end">Adicionar</button>
              </div>
            </div>
            {appointment.comments?.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center">
                <MessageSquare className="w-12 h-12 text-sage-300 mx-auto mb-3" />
                <p className="text-sage-500">Sem notas de sessão</p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointment.comments?.map((comment: any) => (
                  <div key={comment.id} className="bg-white rounded-2xl p-6 shadow-sm">
                    <p className="text-sage-700 whitespace-pre-wrap">{comment.content}</p>
                    <p className="text-sm text-sage-400 mt-3">{format(parseISO(comment.createdAt), "d 'de' MMMM 'às' HH:mm", { locale: pt })}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'files' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button onClick={() => setShowFileModal(true)} className="flex items-center gap-2 px-4 py-2 bg-sage-700 text-white rounded-xl font-medium hover:bg-sage-800">
                <Plus className="w-4 h-4" />Adicionar Ficheiro
              </button>
            </div>
            {appointment.files?.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center">
                <FolderOpen className="w-12 h-12 text-sage-300 mx-auto mb-3" />
                <p className="text-sage-500">Sem ficheiros</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {appointment.files?.map((file: any) => (
                  <div key={file.id} className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center"><FolderOpen className="w-5 h-5 text-blue-600" /></div>
                        <div>
                          <p className="font-medium text-sage-800">{file.name}</p>
                          {file.description && <p className="text-sm text-sage-500">{file.description}</p>}
                        </div>
                      </div>
                      <a href={file.url} target="_blank" rel="noopener noreferrer" className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><ExternalLink className="w-4 h-4" /></a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {showFileModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold text-sage-800 mb-6">Adicionar Ficheiro</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">Nome *</label>
                  <input type="text" value={newFile.name} onChange={(e) => setNewFile({ ...newFile, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-sage-200" placeholder="Ex: Relatório" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">URL do Google Drive *</label>
                  <input type="url" value={newFile.url} onChange={(e) => setNewFile({ ...newFile, url: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-sage-200" placeholder="https://drive.google.com/..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">Descrição</label>
                  <input type="text" value={newFile.description} onChange={(e) => setNewFile({ ...newFile, description: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-sage-200" placeholder="Descrição opcional" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowFileModal(false)} className="px-4 py-2 rounded-xl border text-sage-700 hover:bg-sage-50">Cancelar</button>
                <button onClick={handleAddFile} className="px-4 py-2 bg-sage-700 text-white rounded-xl hover:bg-sage-800">Adicionar</button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

