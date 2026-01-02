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

  const pathParts = event.path.split('/')
  const appointmentId = pathParts[pathParts.length - 1]

  if (!appointmentId || appointmentId === 'appointment') {
    return error('Appointment ID is required')
  }

  try {
    if (event.httpMethod === 'GET') {
      const appointment = await prisma.appointment.findFirst({
        where: { id: appointmentId, userId: user.id },
        include: {
          client: true,
          comments: { orderBy: { createdAt: 'desc' } },
          files: { orderBy: { createdAt: 'desc' } },
        },
      })

      if (!appointment) {
        return notFound('Appointment')
      }

      return success(appointment)
    }

    if (event.httpMethod === 'PATCH' || event.httpMethod === 'PUT') {
      const existing = await prisma.appointment.findFirst({
        where: { id: appointmentId, userId: user.id },
      })

      if (!existing) {
        return notFound('Appointment')
      }

      const body = JSON.parse(event.body || '{}')

      const appointment = await prisma.appointment.update({
        where: { id: appointmentId },
        data: {
          ...(body.date && { date: new Date(body.date) }),
          ...(body.duration && { duration: body.duration }),
          ...(body.type && { type: body.type }),
          ...(body.status && { status: body.status }),
          ...(body.notes !== undefined && { notes: body.notes }),
          ...(body.treatmentNotes !== undefined && { treatmentNotes: body.treatmentNotes }),
        },
        include: { client: true },
      })

      return success(appointment)
    }

    if (event.httpMethod === 'DELETE') {
      const existing = await prisma.appointment.findFirst({
        where: { id: appointmentId, userId: user.id },
      })

      if (!existing) {
        return notFound('Appointment')
      }

      await prisma.appointment.delete({ where: { id: appointmentId } })

      return success({ success: true })
    }

    return error('Method not allowed', 405)
  } catch (err) {
    console.error('Appointment error:', err)
    return error('Internal server error', 500)
  }
}

