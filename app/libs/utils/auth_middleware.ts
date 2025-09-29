import { FastifyReply, FastifyRequest } from 'fastify'
import JwtUtil from '#app/libs/utils/jwt_util'
import AppException from '#app/exceptions/app_exception'
import ErrorCodes from '#app/exceptions/error_codes'

export type AuthedRequest = FastifyRequest & { user?: { id: string, steamId: string } }

export function requireAuth(request: AuthedRequest, _reply: FastifyReply, done: (err?: Error) => void) {
  try {
    const header = request.headers['authorization']
    if (!header || !header.startsWith('Bearer ')) {
      return done(new AppException(401, ErrorCodes.INVALID_ACCESS_TOKEN, 'Missing bearer token'))
    }
    const token = header.substring('Bearer '.length)
    const payload = JwtUtil.verify<{ sub: string, steamId: string }>(token)
    request.user = { id: payload.sub, steamId: payload.steamId }
    done()
  } catch (e) {
    done(new AppException(401, ErrorCodes.INVALID_ACCESS_TOKEN, 'Invalid or expired token'))
  }
}

