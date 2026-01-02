import { Handler } from '@netlify/functions'
import { prisma } from './lib/prisma'
import { getUserFromRequest } from './lib/auth'
import { success, error, unauthorized, notFound, options } from './lib/response'

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return options()
  }

  const user = getUserFromRequest(event.headers.authorization)
  
  if (!user) {
    return unauthorized()
  }

  const params = event.queryStringParameters || {}
  const appointmentId = params.appointmentId

  if (!appointmentId) {
    return error('Appointment ID is required')
  }

  try {
    const appointment = await prisma.appointment.findFirst({
      where: { id: appointmentId, userId: user.id },
    })

    if (!appointment) {
      return notFound('Appointment')
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}')
      const { name, url, description, type } = body

      if (!name || !url) {
        return error('Name and URL are required')
      }

      const file = await prisma.appointmentFile.create({
        data: {
          name,
          url,
          description,
          type: type || 'document',
          appointmentId,
        },
      })

      return success(file, 201)
    }

    return error('Method not allowed', 405)
  } catch (err) {
    console.error('Appointment files error:', err)
    return error('Internal server error', 500)
  }
}

