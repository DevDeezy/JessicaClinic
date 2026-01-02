// Netlify Functions base; override with VITE_API_URL if provided
const API_URL = import.meta.env.VITE_API_URL || 'https://6957dbf51d1643cf129703cd--jessicaclinic.netlify.app/.netlify/functions'

interface RequestOptions {
  method?: string
  body?: any
  token?: string | null
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}/${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Request failed')
  }

  return data
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<{ token: string; user: any }>('auth-login', {
      method: 'POST',
      body: { email, password },
    }),

  getMe: (token: string) =>
    request<any>('auth-me', { token }),

  // Stats
  getStats: (token: string) =>
    request<any>('stats', { token }),

  // Clients
  getClients: (token: string, search?: string) =>
    request<any[]>(`clients${search ? `?search=${encodeURIComponent(search)}` : ''}`, { token }),

  getClient: (token: string, id: string) =>
    request<any>(`client/${id}`, { token }),

  createClient: (token: string, data: any) =>
    request<any>('clients', { method: 'POST', body: data, token }),

  updateClient: (token: string, id: string, data: any) =>
    request<any>(`client/${id}`, { method: 'PATCH', body: data, token }),

  deleteClient: (token: string, id: string) =>
    request<any>(`client/${id}`, { method: 'DELETE', token }),

  addClientComment: (token: string, clientId: string, content: string) =>
    request<any>(`client-comments?clientId=${clientId}`, { 
      method: 'POST', 
      body: { content }, 
      token 
    }),

  deleteClientComment: (token: string, clientId: string, commentId: string) =>
    request<any>(`client-comments?clientId=${clientId}&commentId=${commentId}`, { 
      method: 'DELETE', 
      token 
    }),

  addClientFile: (token: string, clientId: string, data: any) =>
    request<any>(`client-files?clientId=${clientId}`, { 
      method: 'POST', 
      body: data, 
      token 
    }),

  deleteClientFile: (token: string, clientId: string, fileId: string) =>
    request<any>(`client-files?clientId=${clientId}&fileId=${fileId}`, { 
      method: 'DELETE', 
      token 
    }),

  // Appointments
  getAppointments: (token: string, params?: { limit?: number; upcoming?: boolean; date?: string; clientId?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.limit) searchParams.set('limit', String(params.limit))
    if (params?.upcoming) searchParams.set('upcoming', 'true')
    if (params?.date) searchParams.set('date', params.date)
    if (params?.clientId) searchParams.set('clientId', params.clientId)
    const query = searchParams.toString()
    return request<any[]>(`appointments${query ? `?${query}` : ''}`, { token })
  },

  getAppointment: (token: string, id: string) =>
    request<any>(`appointment/${id}`, { token }),

  createAppointment: (token: string, data: any) =>
    request<any>('appointments', { method: 'POST', body: data, token }),

  updateAppointment: (token: string, id: string, data: any) =>
    request<any>(`appointment/${id}`, { method: 'PATCH', body: data, token }),

  deleteAppointment: (token: string, id: string) =>
    request<any>(`appointment/${id}`, { method: 'DELETE', token }),

  addAppointmentComment: (token: string, appointmentId: string, content: string) =>
    request<any>(`appointment-comments?appointmentId=${appointmentId}`, { 
      method: 'POST', 
      body: { content }, 
      token 
    }),

  addAppointmentFile: (token: string, appointmentId: string, data: any) =>
    request<any>(`appointment-files?appointmentId=${appointmentId}`, { 
      method: 'POST', 
      body: data, 
      token 
    }),
}

