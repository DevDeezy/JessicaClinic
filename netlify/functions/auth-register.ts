import { Handler } from '@netlify/functions'
import { prisma } from './lib/prisma'
import { hashPassword, generateToken } from './lib/auth'
import { success, error, options } from './lib/response'
import { logRequest, logError } from './lib/logger'

export const handler: Handler = async (event) => {
  logRequest('auth-register', event)

  if (event.httpMethod === 'OPTIONS') {
    return options()
  }

  if (event.httpMethod !== 'POST') {
    return error('Method not allowed', 405)
  }

  try {
    const { email, password, name, phone } = JSON.parse(event.body || '{}')

    if (!email || !password || !name) {
      return error('Name, email and password are required', 400)
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return error('Email already registered', 400)
    }

    const hashed = await hashPassword(password)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        name,
        phone,
      },
    })

    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    })

    return success({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (err) {
    logError('auth-register', err)
    return error('Internal server error', 500)
  }
}


