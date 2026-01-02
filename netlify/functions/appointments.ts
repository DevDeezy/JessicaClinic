import { Handler } from '@netlify/functions'
import { prisma } from './lib/prisma'
import { getUserFromRequest } from './lib/auth'
import { success, error, unauthorized, options } from './lib/response'

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return options()
  }

  const user = getUserFromRequest(event.headers.authorization)
  
  if (!user) {
    return unauthorized()
  }

  try {
    if (event.httpMethod === 'GET') {
      const params = event.queryStringParameters || {}
      const limit = params.limit ? parseInt(params.limit) : undefined
      const upcoming = params.upcoming === 'true'
      const date = params.date
      const clientId = params.clientId

      const where: any = { userId: user.id }

      if (upcoming) {
        where.date = { gte: new Date() }
        where.status = 'scheduled'
      }

      if (date) {
        const targetDate = new Date(date)
        const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate())
        const endOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate() + 1)
        where.date = { gte: startOfDay, lt: endOfDay }
      }

      if (clientId) {
        where.clientId = clientId
      }

      const appointments = await prisma.appointment.findMany({
        where,
        include: {
          client: {
            select: { id: true, name: true, phone: true, email: true },
          },
          comments: true,
          files: true,
        },
        orderBy: { date: 'asc' },
        take: limit,
      })

      return success(appointments)
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}')
      const { clientId, date, duration, type, notes } = body

      if (!clientId || !date) {
        return error('Client and date are required')
      }

      const appointment = await prisma.appointment.create({
        data: {
          clientId,
          userId: user.id,
          date: new Date(date),
          duration: duration || 60,
          type: type || 'consulta',
          notes,
          status: 'scheduled',
        },
        include: { client: true },
      })

      return success(appointment, 201)
    }

    return error('Method not allowed', 405)
  } catch (err) {
    console.error('Appointments error:', err)
    return error('Internal server error', 500)
  }
}

