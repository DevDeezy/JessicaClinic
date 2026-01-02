import type { HandlerEvent } from '@netlify/functions'

export function logRequest(functionName: string, event: HandlerEvent) {
  const safeBody = event.body ? event.body : '<empty>'
  console.log(
    `[${functionName}] ${event.httpMethod} ${event.path} ${event.queryStringParameters ? JSON.stringify(event.queryStringParameters) : ''} body=${safeBody}`
  )
}

export function logError(functionName: string, error: unknown) {
  console.error(`[${functionName}] Error:`, error)
}

