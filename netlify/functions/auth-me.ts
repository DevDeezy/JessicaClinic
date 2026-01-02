import { Handler } from '@netlify/functions'
import { prisma } from './lib/prisma'
import { getUserFromRequest } from './lib/auth'
import { success, error, unauthorized, options } from './lib/response'
import { logRequest, logError } from './lib/logger'

export const handler: Handler = async (event) => {
  logRequest('auth-me', event)
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
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
      },
    })

    if (!dbUser) {
      return unauthorized()
    }

    return success(dbUser)
  } catch (err) {
    logError('auth-me', err)
    return error('Internal server error', 500)
  }
}

