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
      const { content } = body

      if (!content) {
        return error('Content is required')
      }

      const comment = await prisma.clientComment.create({
        data: { content, clientId },
      })

      return success(comment, 201)
    }

    if (event.httpMethod === 'DELETE') {
      const commentId = params.commentId

      if (!commentId) {
        return error('Comment ID is required')
      }

      await prisma.clientComment.delete({ where: { id: commentId } })

      return success({ success: true })
    }

    return error('Method not allowed', 405)
  } catch (err) {
    console.error('Client comments error:', err)
    return error('Internal server error', 500)
  }
}

