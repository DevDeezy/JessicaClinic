'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Save, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase, 
  Heart, 
  AlertTriangle, 
  Pill, 
  FileText,
  Calendar,
  MessageSquare,
  FolderOpen,
  Plus,
  ExternalLink,
  Trash2,
  Clock,
  Edit2
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { pt } from 'date-fns/locale'
import toast from 'react-hot-toast'

interface Client {
  id: string
  name: string
  email: string | null
  phone: string
  birthDate: string | null
  address: string | null
  occupation: string | null
  emergencyContact: string | null
  emergencyPhone: string | null
  medicalHistory: string | null
  allergies: string | null
  medications: string | null
  notes: string | null
  createdAt: string
  appointments: any[]
  comments: any[]
  files: any[]
  _count: {
    appointments: number
  }
}

export default function ClienteDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState<any>({})
  const [newComment, setNewComment] = useState('')
  const [showFileModal, setShowFileModal] = useState(false)
  const [newFile, setNewFile] = useState({ name: '', url: '', description: '', type: 'document' })
  const [activeTab, setActiveTab] = useState<'info' | 'appointments' | 'comments' | 'files'>('info')

  useEffect(() => {
    fetchClient()
  }, [params.id])

  const fetchClient = async () => {
    try {
      const res = await fetch(`/api/clients/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setClient(data)
        setFormData({
          name: data.name,
          email: data.email || '',
          phone: data.phone,
          birthDate: data.birthDate ? format(parseISO(data.birthDate), 'yyyy-MM-dd') : '',
          address: data.address || '',
          occupation: data.occupation || '',
          emergencyContact: data.emergencyContact || '',
          emergencyPhone: data.emergencyPhone || '',
          medicalHistory: data.medicalHistory || '',
          allergies: data.allergies || '',
          medications: data.medications || '',
          notes: data.notes || ''
        })
      } else {
        toast.error('Cliente não encontrado')
        router.push('/clientes')
      }
    } catch (error) {
      console.error('Error fetching client:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/clients/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        toast.success('Cliente atualizado com sucesso!')
        setEditMode(false)
        fetchClient()
      } else {
        toast.error('Erro ao atualizar cliente')
      }
    } catch (error) {
      toast.error('Erro ao atualizar cliente')
    } finally {
      setSaving(false)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    try {
      const res = await fetch(`/api/clients/${params.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment })
      })

      if (res.ok) {
        toast.success('Comentário adicionado')
        setNewComment('')
        fetchClient()
      }
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
      const res = await fetch(`/api/clients/${params.id}/files`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFile)
      })

      if (res.ok) {
        toast.success('Ficheiro adicionado')
        setNewFile({ name: '', url: '', description: '', type: 'document' })
        setShowFileModal(false)
        fetchClient()
      }
    } catch (error) {
      toast.error('Erro ao adicionar ficheiro')
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    try {
      const res = await fetch(`/api/clients/${params.id}/comments?commentId=${commentId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        toast.success('Comentário eliminado')
        fetchClient()
      }
    } catch (error) {
      toast.error('Erro ao eliminar comentário')
    }
  }

  const handleDeleteFile = async (fileId: string) => {
    try {
      const res = await fetch(`/api/clients/${params.id}/files?fileId=${fileId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        toast.success('Ficheiro eliminado')
        fetchClient()
      }
    } catch (error) {
      toast.error('Erro ao eliminar ficheiro')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-sage-200 border-t-sage-600 rounded-full" />
      </div>
    )
  }

  if (!client) return null

  const tabs = [
    { id: 'info', label: 'Informação', icon: User },
    { id: 'appointments', label: 'Consultas', icon: Calendar, count: client._count.appointments },
    { id: 'comments', label: 'Comentários', icon: MessageSquare, count: client.comments.length },
    { id: 'files', label: 'Ficheiros', icon: FolderOpen, count: client.files.length },
  ]

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/clientes"
              className="p-2 rounded-xl hover:bg-sage-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-sage-600" />
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sage-300 to-sage-500 flex items-center justify-center text-white font-semibold text-2xl">
                {client.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-display font-semibold text-sage-800">{client.name}</h1>
                <p className="text-sage-500">{client.phone} {client.email && `• ${client.email}`}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/consultas/nova?clientId=${client.id}`}
              className="flex items-center gap-2 px-4 py-2 bg-terracotta-500 text-white rounded-xl font-medium hover:bg-terracotta-600 transition-all"
            >
              <Plus className="w-4 h-4" />
              Nova Consulta
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-sage-200 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-sage-700 text-white'
                  : 'text-sage-600 hover:bg-sage-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.count !== undefined && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-sage-600' : 'bg-sage-200'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'info' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              {editMode ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 rounded-xl border border-sage-200 text-sage-700 font-medium hover:bg-sage-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-sage-700 text-white rounded-xl font-medium hover:bg-sage-800 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'A guardar...' : 'Guardar'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-sage-200 text-sage-700 font-medium hover:bg-sage-50"
                >
                  <Edit2 className="w-4 h-4" />
                  Editar
                </button>
              )}
            </div>

            {/* Info Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-sage-800 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-terracotta-500" />
                  Dados Pessoais
                </h3>
                <div className="space-y-4">
                  {editMode ? (
                    <>
                      <input name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border" placeholder="Nome" />
                      <input name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border" placeholder="Telefone" />
                      <input name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border" placeholder="Email" />
                      <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border" />
                      <input name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border" placeholder="Morada" />
                      <input name="occupation" value={formData.occupation} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border" placeholder="Profissão" />
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 text-sage-600">
                        <Phone className="w-4 h-4" />
                        {client.phone}
                      </div>
                      {client.email && (
                        <div className="flex items-center gap-3 text-sage-600">
                          <Mail className="w-4 h-4" />
                          {client.email}
                        </div>
                      )}
                      {client.birthDate && (
                        <div className="flex items-center gap-3 text-sage-600">
                          <Calendar className="w-4 h-4" />
                          {format(parseISO(client.birthDate), "d 'de' MMMM 'de' yyyy", { locale: pt })}
                        </div>
                      )}
                      {client.address && (
                        <div className="flex items-center gap-3 text-sage-600">
                          <MapPin className="w-4 h-4" />
                          {client.address}
                        </div>
                      )}
                      {client.occupation && (
                        <div className="flex items-center gap-3 text-sage-600">
                          <Briefcase className="w-4 h-4" />
                          {client.occupation}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-sage-800 mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-terracotta-500" />
                  Contacto de Emergência
                </h3>
                {editMode ? (
                  <div className="space-y-4">
                    <input name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border" placeholder="Nome" />
                    <input name="emergencyPhone" value={formData.emergencyPhone} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border" placeholder="Telefone" />
                  </div>
                ) : (
                  <div className="space-y-2 text-sage-600">
                    {client.emergencyContact ? (
                      <>
                        <p>{client.emergencyContact}</p>
                        <p>{client.emergencyPhone}</p>
                      </>
                    ) : (
                      <p className="text-sage-400">Não definido</p>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm md:col-span-2">
                <h3 className="font-semibold text-sage-800 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-terracotta-500" />
                  Informação Médica
                </h3>
                {editMode ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-sage-600">Histórico Médico</label>
                      <textarea name="medicalHistory" value={formData.medicalHistory} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border mt-1" rows={3} />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-sage-600">Alergias</label>
                        <input name="allergies" value={formData.allergies} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border mt-1" />
                      </div>
                      <div>
                        <label className="text-sm text-sage-600">Medicação</label>
                        <input name="medications" value={formData.medications} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border mt-1" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {client.medicalHistory && (
                      <div>
                        <p className="text-sm text-sage-500 mb-1">Histórico Médico</p>
                        <p className="text-sage-700">{client.medicalHistory}</p>
                      </div>
                    )}
                    <div className="grid md:grid-cols-2 gap-4">
                      {client.allergies && (
                        <div className="p-3 bg-orange-50 rounded-lg">
                          <p className="text-sm text-orange-600 font-medium flex items-center gap-1">
                            <AlertTriangle className="w-4 h-4" />
                            Alergias
                          </p>
                          <p className="text-orange-800">{client.allergies}</p>
                        </div>
                      )}
                      {client.medications && (
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-600 font-medium flex items-center gap-1">
                            <Pill className="w-4 h-4" />
                            Medicação
                          </p>
                          <p className="text-blue-800">{client.medications}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {(client.notes || editMode) && (
                <div className="bg-white rounded-2xl p-6 shadow-sm md:col-span-2">
                  <h3 className="font-semibold text-sage-800 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-terracotta-500" />
                    Notas
                  </h3>
                  {editMode ? (
                    <textarea name="notes" value={formData.notes} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border" rows={4} />
                  ) : (
                    <p className="text-sage-600 whitespace-pre-wrap">{client.notes}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            {client.appointments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-sage-300 mx-auto mb-3" />
                <p className="text-sage-500">Sem consultas registadas</p>
                <Link
                  href={`/consultas/nova?clientId=${client.id}`}
                  className="inline-flex items-center gap-2 mt-4 text-terracotta-500 hover:text-terracotta-600 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Agendar consulta
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {client.appointments.map((apt) => (
                  <Link
                    key={apt.id}
                    href={`/consultas/${apt.id}`}
                    className="flex items-center justify-between p-4 bg-cream-50 rounded-xl hover:bg-cream-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-sage-200 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-sage-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sage-800">
                          {format(parseISO(apt.date), "d 'de' MMMM 'às' HH:mm", { locale: pt })}
                        </p>
                        <p className="text-sm text-sage-500">{apt.type} • {apt.duration} min</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      apt.status === 'completed' ? 'bg-green-100 text-green-700' :
                      apt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {apt.status === 'scheduled' ? 'Agendada' :
                       apt.status === 'completed' ? 'Concluída' :
                       apt.status === 'cancelled' ? 'Cancelada' : apt.status}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-sage-800 mb-4">Adicionar Comentário</h3>
              <div className="flex gap-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escreva um comentário sobre o cliente..."
                  className="flex-1 px-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 outline-none transition-all resize-none"
                  rows={3}
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="px-6 py-3 bg-sage-700 text-white rounded-xl font-medium hover:bg-sage-800 disabled:opacity-50 self-end"
                >
                  Adicionar
                </button>
              </div>
            </div>

            {client.comments.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center">
                <MessageSquare className="w-12 h-12 text-sage-300 mx-auto mb-3" />
                <p className="text-sage-500">Sem comentários</p>
              </div>
            ) : (
              <div className="space-y-4">
                {client.comments.map((comment: any) => (
                  <div key={comment.id} className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-start">
                      <p className="text-sage-700 whitespace-pre-wrap">{comment.content}</p>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-sage-400 mt-3">
                      {format(parseISO(comment.createdAt), "d 'de' MMMM 'às' HH:mm", { locale: pt })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'files' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={() => setShowFileModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-sage-700 text-white rounded-xl font-medium hover:bg-sage-800"
              >
                <Plus className="w-4 h-4" />
                Adicionar Ficheiro
              </button>
            </div>

            {client.files.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center">
                <FolderOpen className="w-12 h-12 text-sage-300 mx-auto mb-3" />
                <p className="text-sage-500">Sem ficheiros</p>
                <p className="text-sm text-sage-400 mt-1">Adicione links do Google Drive para guardar ficheiros</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {client.files.map((file: any) => (
                  <div key={file.id} className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <FolderOpen className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sage-800">{file.name}</p>
                          {file.description && (
                            <p className="text-sm text-sage-500">{file.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDeleteFile(file.id)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-sage-400 mt-3">
                      Adicionado em {format(parseISO(file.createdAt), "d 'de' MMMM", { locale: pt })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* File Modal */}
        {showFileModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-semibold text-sage-800 mb-6">Adicionar Ficheiro</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">Nome *</label>
                  <input
                    type="text"
                    value={newFile.name}
                    onChange={(e) => setNewFile({ ...newFile, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 outline-none"
                    placeholder="Ex: Raio-X Joelho"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">URL do Google Drive *</label>
                  <input
                    type="url"
                    value={newFile.url}
                    onChange={(e) => setNewFile({ ...newFile, url: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 outline-none"
                    placeholder="https://drive.google.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">Descrição</label>
                  <input
                    type="text"
                    value={newFile.description}
                    onChange={(e) => setNewFile({ ...newFile, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 outline-none"
                    placeholder="Descrição opcional"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">Tipo</label>
                  <select
                    value={newFile.type}
                    onChange={(e) => setNewFile({ ...newFile, type: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 outline-none"
                  >
                    <option value="document">Documento</option>
                    <option value="image">Imagem</option>
                    <option value="xray">Raio-X</option>
                    <option value="report">Relatório</option>
                    <option value="other">Outro</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowFileModal(false)}
                  className="px-4 py-2 rounded-xl border border-sage-200 text-sage-700 hover:bg-sage-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddFile}
                  className="px-4 py-2 bg-sage-700 text-white rounded-xl hover:bg-sage-800"
                >
                  Adicionar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

