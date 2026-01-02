import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Bell, Shield, Palette, Clock, Save, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '../../store/auth'

export default function DefinicoesPage() {
  const { user } = useAuthStore()
  const [activeSection, setActiveSection] = useState('profile')
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    defaultDuration: 60,
    workStartTime: '09:00',
    workEndTime: '20:00',
    reminderEnabled: true,
    reminderHours: 24,
    theme: 'light'
  })

  const handleSave = async () => {
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success('Definições guardadas!')
    setSaving(false)
  }

  const sections = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'schedule', label: 'Horário', icon: Clock },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'appearance', label: 'Aparência', icon: Palette },
    { id: 'security', label: 'Segurança', icon: Shield },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-semibold text-sage-800">Definições</h1>
          <p className="text-sage-500 mt-1">Gerencie as suas preferências</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm h-fit">
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === section.id ? 'bg-sage-700 text-white' : 'text-sage-600 hover:bg-sage-50'}`}
                >
                  <section.icon className="w-5 h-5" />
                  <span className="font-medium">{section.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="md:col-span-3 space-y-6">
            {activeSection === 'profile' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-sage-800 mb-6">Perfil</h2>
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center text-white text-2xl font-semibold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sage-800 text-lg">{user?.name}</h3>
                    <p className="text-sage-500">{user?.email}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-2">Nome</label>
                    <input type="text" defaultValue={user?.name || ''} className="w-full px-4 py-3 rounded-xl border border-sage-200" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-2">Email</label>
                    <input type="email" defaultValue={user?.email || ''} className="w-full px-4 py-3 rounded-xl border border-sage-200" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-2">Telefone</label>
                    <input type="tel" placeholder="+351 912 345 678" className="w-full px-4 py-3 rounded-xl border border-sage-200" />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'schedule' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-sage-800 mb-6">Horário de Trabalho</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-sage-700 mb-2">Hora de Início</label>
                      <select value={settings.workStartTime} onChange={(e) => setSettings({ ...settings, workStartTime: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-sage-200">
                        {Array.from({ length: 24 }, (_, i) => <option key={i} value={`${i.toString().padStart(2, '0')}:00`}>{`${i.toString().padStart(2, '0')}:00`}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-sage-700 mb-2">Hora de Fim</label>
                      <select value={settings.workEndTime} onChange={(e) => setSettings({ ...settings, workEndTime: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-sage-200">
                        {Array.from({ length: 24 }, (_, i) => <option key={i} value={`${i.toString().padStart(2, '0')}:00`}>{`${i.toString().padStart(2, '0')}:00`}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-2">Duração Padrão</label>
                    <select value={settings.defaultDuration} onChange={(e) => setSettings({ ...settings, defaultDuration: parseInt(e.target.value) })} className="w-full px-4 py-3 rounded-xl border border-sage-200">
                      <option value={30}>30 minutos</option>
                      <option value={45}>45 minutos</option>
                      <option value={60}>1 hora</option>
                      <option value={90}>1 hora e 30 minutos</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-sage-800 mb-6">Notificações</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-cream-50 rounded-xl">
                    <div>
                      <p className="font-medium text-sage-800">Lembretes de Consulta</p>
                      <p className="text-sm text-sage-500">Receba notificações antes das consultas</p>
                    </div>
                    <button onClick={() => setSettings({ ...settings, reminderEnabled: !settings.reminderEnabled })} className={`w-12 h-6 rounded-full transition-colors ${settings.reminderEnabled ? 'bg-sage-600' : 'bg-sage-200'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.reminderEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                  {settings.reminderEnabled && (
                    <div>
                      <label className="block text-sm font-medium text-sage-700 mb-2">Tempo de Antecedência</label>
                      <select value={settings.reminderHours} onChange={(e) => setSettings({ ...settings, reminderHours: parseInt(e.target.value) })} className="w-full px-4 py-3 rounded-xl border border-sage-200">
                        <option value={1}>1 hora antes</option>
                        <option value={2}>2 horas antes</option>
                        <option value={24}>1 dia antes</option>
                        <option value={48}>2 dias antes</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeSection === 'appearance' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-sage-800 mb-6">Aparência</h2>
                <div className="space-y-4">
                  <p className="text-sm text-sage-600">Escolha o tema da aplicação</p>
                  <div className="grid grid-cols-3 gap-4">
                    {['light', 'dark', 'system'].map((theme) => (
                      <button key={theme} onClick={() => setSettings({ ...settings, theme })} className={`p-4 rounded-xl border-2 transition-all ${settings.theme === theme ? 'border-sage-600 bg-sage-50' : 'border-sage-200 hover:border-sage-300'}`}>
                        <div className={`w-full h-16 rounded-lg mb-3 ${theme === 'light' ? 'bg-cream-100' : theme === 'dark' ? 'bg-sage-800' : 'bg-gradient-to-r from-cream-100 to-sage-800'}`} />
                        <p className="text-sm font-medium text-sage-700 capitalize flex items-center justify-center gap-2">
                          {theme === 'light' ? 'Claro' : theme === 'dark' ? 'Escuro' : 'Sistema'}
                          {settings.theme === theme && <Check className="w-4 h-4 text-sage-600" />}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-sage-800 mb-6">Segurança</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-2">Palavra-passe Atual</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-sage-200" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-2">Nova Palavra-passe</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-sage-200" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-2">Confirmar</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-sage-200" />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-sage-700 text-white rounded-xl font-medium hover:bg-sage-800 disabled:opacity-50">
                <Save className="w-4 h-4" />{saving ? 'A guardar...' : 'Guardar Alterações'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

