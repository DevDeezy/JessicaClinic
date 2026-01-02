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

  // Extract client ID from path: /api/client/[id]
  const pathParts = event.path.split('/')
  const clientId = pathParts[pathParts.length - 1]

  if (!clientId || clientId === 'client') {
    return error('Client ID is required')
  }

  try {
    if (event.httpMethod === 'GET') {
      const client = await prisma.client.findFirst({
        where: { id: clientId, userId: user.id },
        include: {
          appointments: {
            orderBy: { date: 'desc' },
            take: 10,
            include: { comments: true, files: true },
          },
          comments: { orderBy: { createdAt: 'desc' } },
          files: { orderBy: { createdAt: 'desc' } },
          _count: { select: { appointments: true } },
        },
      })

      if (!client) {
        return notFound('Client')
      }

      return success(client)
    }

    if (event.httpMethod === 'PATCH' || event.httpMethod === 'PUT') {
      const existing = await prisma.client.findFirst({
        where: { id: clientId, userId: user.id },
      })

      if (!existing) {
        return notFound('Client')
      }

      const body = JSON.parse(event.body || '{}')

      const client = await prisma.client.update({
        where: { id: clientId },
        data: {
          ...(body.name && { name: body.name }),
          ...(body.email !== undefined && { email: body.email }),
          ...(body.phone && { phone: body.phone }),
          ...(body.birthDate !== undefined && { birthDate: body.birthDate ? new Date(body.birthDate) : null }),
          ...(body.address !== undefined && { address: body.address }),
          ...(body.occupation !== undefined && { occupation: body.occupation }),
          ...(body.emergencyContact !== undefined && { emergencyContact: body.emergencyContact }),
          ...(body.emergencyPhone !== undefined && { emergencyPhone: body.emergencyPhone }),
          ...(body.medicalHistory !== undefined && { medicalHistory: body.medicalHistory }),
          ...(body.allergies !== undefined && { allergies: body.allergies }),
          ...(body.medications !== undefined && { medications: body.medications }),
          ...(body.notes !== undefined && { notes: body.notes }),
        },
      })

      return success(client)
    }

    if (event.httpMethod === 'DELETE') {
      const existing = await prisma.client.findFirst({
        where: { id: clientId, userId: user.id },
      })

      if (!existing) {
        return notFound('Client')
      }

      await prisma.client.delete({ where: { id: clientId } })

      return success({ success: true })
    }

    return error('Method not allowed', 405)
  } catch (err) {
    console.error('Client error:', err)
    return error('Internal server error', 500)
  }
}

