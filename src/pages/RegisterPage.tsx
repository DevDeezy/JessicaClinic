import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Heart, Mail, Lock, ArrowLeft, User, Phone } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/auth'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, isAuthenticated } = useAuthStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(name, email, password, phone || undefined)
      toast.success('Conta criada com sucesso!')
      navigate('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Não foi possível criar a conta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-cream-50 to-sage-100 flex items-center justify-center p-6">
      <div className="absolute inset-0 pattern-grid opacity-30" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sage-600 hover:text-sage-800 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao site
        </Link>

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sage-500 to-sage-700 flex items-center justify-center">
                <Heart className="w-6 h-6 text-cream-50" />
              </div>
              <span className="font-display text-3xl font-semibold text-sage-800">Jessica</span>
            </Link>
            <h1 className="text-2xl font-semibold text-sage-800 mb-2">Criar conta</h1>
            <p className="text-sage-500">Registe-se para começar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                Nome
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 outline-none transition-all"
                  placeholder="O seu nome"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 outline-none transition-all"
                  placeholder="email@exemplo.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                Telemóvel (opcional)
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 outline-none transition-all"
                  placeholder="+351..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                Palavra-passe
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 outline-none transition-all"
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-sage-700 text-cream-50 rounded-xl font-semibold hover:bg-sage-800 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'A criar...' : 'Criar conta'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-sage-600">
            Já tem conta?{' '}
            <Link to="/login" className="text-sage-700 font-semibold hover:text-sage-900">
              Entrar
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}


