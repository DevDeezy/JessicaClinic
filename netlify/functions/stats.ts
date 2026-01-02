import { Handler } from '@netlify/functions'
import { prisma } from './lib/prisma'
import { getUserFromRequest } from './lib/auth'
import { success, error, unauthorized, options } from './lib/response'

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return options()
  }

  if (event.httpMethod !== 'GET') {
    return error('Method not allowed', 405)
  }

  const user = getUserFromRequest(event.headers.authorization)
  
  if (!user) {
    return unauthorized()
  }

  try {
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay() + 1)
    startOfWeek.setHours(0, 0, 0, 0)
    
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 7)
    
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)

    const [totalClients, todayAppointments, weekAppointments, monthAppointments] = await Promise.all([
      prisma.client.count({ where: { userId: user.id } }),
      prisma.appointment.count({
        where: {
          userId: user.id,
          date: { gte: startOfDay, lt: endOfDay },
        },
      }),
      prisma.appointment.count({
        where: {
          userId: user.id,
          date: { gte: startOfWeek, lt: endOfWeek },
        },
      }),
      prisma.appointment.count({
        where: {
          userId: user.id,
          date: { gte: startOfMonth, lt: endOfMonth },
        },
      }),
    ])

    return success({
      totalClients,
      todayAppointments,
      weekAppointments,
      monthAppointments,
    })
  } catch (err) {
    console.error('Stats error:', err)
    return error('Internal server error', 500)
  }
}

