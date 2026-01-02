export const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
}

export function success(data: any, statusCode = 200) {
  return {
    statusCode,
    headers,
    body: JSON.stringify(data),
  }
}

export function error(message: string, statusCode = 400) {
  return {
    statusCode,
    headers,
    body: JSON.stringify({ error: message }),
  }
}

export function unauthorized() {
  return error('Unauthorized', 401)
}

export function notFound(resource = 'Resource') {
  return error(`${resource} not found`, 404)
}

export function options() {
  return {
    statusCode: 204,
    headers,
    body: '',
  }
}

