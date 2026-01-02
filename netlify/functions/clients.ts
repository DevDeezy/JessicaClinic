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
      const search = params.search
      const limit = params.limit ? parseInt(params.limit) : undefined

      const where: any = { userId: user.id }

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search } },
        ]
      }

      const clients = await prisma.client.findMany({
        where,
        include: {
          _count: { select: { appointments: true } },
        },
        orderBy: { name: 'asc' },
        take: limit,
      })

      return success(clients)
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}')
      const {
        name,
        email,
        phone,
        birthDate,
        address,
        occupation,
        emergencyContact,
        emergencyPhone,
        medicalHistory,
        allergies,
        medications,
        notes,
      } = body

      if (!name || !phone) {
        return error('Name and phone are required')
      }

      const client = await prisma.client.create({
        data: {
          name,
          email,
          phone,
          birthDate: birthDate ? new Date(birthDate) : null,
          address,
          occupation,
          emergencyContact,
          emergencyPhone,
          medicalHistory,
          allergies,
          medications,
          notes,
          userId: user.id,
        },
      })

      return success(client, 201)
    }

    return error('Method not allowed', 405)
  } catch (err) {
    console.error('Clients error:', err)
    return error('Internal server error', 500)
  }
}

