import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from '../lib/api'

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: true,

      login: async (email: string, password: string) => {
        const response = await api.login(email, password)
        set({
          token: response.token,
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
        })
      },

      register: async (name: string, email: string, password: string, phone?: string) => {
        const response = await api.register(name, email, password, phone)
        set({
          token: response.token,
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
        })
      },

      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        })
      },

      checkAuth: async () => {
        const { token } = get()
        if (!token) {
          set({ isLoading: false })
          return
        }

        try {
          const user = await api.getMe(token)
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch {
          set({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      },
    }),
    {
      name: 'jessica-auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.checkAuth()
      },
    }
  )
)

