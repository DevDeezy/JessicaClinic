import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, User, Phone, Mail, MapPin, Briefcase, Heart, AlertTriangle, Pill, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '../../store/auth'
import { api } from '../../lib/api'

export default function ClienteNovoPage() {
  const navigate = useNavigate()
  const { token } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    address: '',
    occupation: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalHistory: '',
    allergies: '',
    medications: '',
    notes: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const client = await api.createClient(token!, formData)
      toast.success('Cliente criado com sucesso!')
      navigate(`/dashboard/clientes/${client.id}`)
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar cliente')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard/clientes"
            className="p-2 rounded-xl hover:bg-sage-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-sage-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-display font-semibold text-sage-800">Novo Cliente</h1>
            <p className="text-sage-500 mt-1">Preencha os dados do novo cliente</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-sage-800 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-terracotta-500" />
              Informação Básica
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">Nome Completo *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 outline-none"
                  placeholder="Ex: Maria Santos"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">Telefone *</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 outline-none"
                    placeholder="+351 912 345 678"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 outline-none"
                    placeholder="email@exemplo.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">Data de Nascimento</label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">Morada</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 outline-none"
                    placeholder="Rua, número, cidade"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">Profissão</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
                  <input
                    type="text"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 outline-none"
                    placeholder="Ex: Engenheiro"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-sage-800 mb-6 flex items-center gap-2">
              <Heart className="w-5 h-5 text-terracotta-500" />
              Contacto de Emergência
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">Nome</label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 outline-none"
                  placeholder="Nome do contacto"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">Telefone</label>
                <input
                  type="tel"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 outline-none"
                  placeholder="+351 912 345 678"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-sage-800 mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-terracotta-500" />
              Informação Médica
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">Histórico Médico</label>
                <textarea
                  name="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 outline-none resize-none"
                  placeholder="Cirurgias, lesões anteriores, condições crónicas..."
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    Alergias
                  </label>
                  <input
                    type="text"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 outline-none"
                    placeholder="Ex: Látex, Anti-inflamatórios"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2 flex items-center gap-2">
                    <Pill className="w-4 h-4 text-blue-500" />
                    Medicação Atual
                  </label>
                  <input
                    type="text"
                    name="medications"
                    value={formData.medications}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 outline-none"
                    placeholder="Ex: Ibuprofeno, Paracetamol"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-sage-800 mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-terracotta-500" />
              Notas Adicionais
            </h2>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 outline-none resize-none"
              placeholder="Observações gerais sobre o cliente..."
            />
          </div>

          <div className="flex justify-end gap-4">
            <Link
              to="/dashboard/clientes"
              className="px-6 py-3 rounded-xl border border-sage-200 text-sage-700 font-medium hover:bg-sage-50 transition-all"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-sage-700 text-cream-50 rounded-xl font-medium hover:bg-sage-800 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? 'A guardar...' : 'Guardar Cliente'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

