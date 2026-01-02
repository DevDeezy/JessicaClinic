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
  const clientId = params.clientId

  if (!clientId) {
    return error('Client ID is required')
  }

  try {
    const client = await prisma.client.findFirst({
      where: { id: clientId, userId: user.id },
    })

    if (!client) {
      return notFound('Client')
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}')
      const { name, url, description, type } = body

      if (!name || !url) {
        return error('Name and URL are required')
      }

      const file = await prisma.clientFile.create({
        data: {
          name,
          url,
          description,
          type: type || 'document',
          clientId,
        },
      })

      return success(file, 201)
    }

    if (event.httpMethod === 'DELETE') {
      const fileId = params.fileId

      if (!fileId) {
        return error('File ID is required')
      }

      await prisma.clientFile.delete({ where: { id: fileId } })

      return success({ success: true })
    }

    return error('Method not allowed', 405)
  } catch (err) {
    console.error('Client files error:', err)
    return error('Internal server error', 500)
  }
}

