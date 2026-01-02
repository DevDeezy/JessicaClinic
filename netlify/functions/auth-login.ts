import { Handler } from '@netlify/functions'
import { prisma } from './lib/prisma'
import { comparePassword, generateToken } from './lib/auth'
import { success, error, options } from './lib/response'
import { logRequest, logError } from './lib/logger'

export const handler: Handler = async (event) => {
  logRequest('auth-login', event)
  if (event.httpMethod === 'OPTIONS') {
    return options()
  }

  if (event.httpMethod !== 'POST') {
    return error('Method not allowed', 405)
  }

  try {
    const { email, password } = JSON.parse(event.body || '{}')

    if (!email || !password) {
      return error('Email and password are required')
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return error('Invalid credentials', 401)
    }

    const isValid = await comparePassword(password, user.password)

    if (!isValid) {
      return error('Invalid credentials', 401)
    }

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
    logError('auth-login', err)
    return error('Internal server error', 500)
  }
}

