import { DoneFuncWithErrOrRes, FastifyInstance, FastifyPluginOptions } from 'fastify'
import { memory, uid } from '#app/libs/db/memory'
import JwtUtil from '#app/libs/utils/jwt_util'

export default function (app: FastifyInstance, _opts: FastifyPluginOptions, done: DoneFuncWithErrOrRes) {
  app.post('/auth/steam', {
    schema: {
      tags: ['Auth'],
      body: {
        type: 'object',
        required: ['steamId'],
        properties: {
          steamId: { type: 'string' },
          accessToken: { type: 'string' },
        }
      }
    }
  }, async (req, reply) => {
    const { steamId } = req.body as { steamId: string, accessToken?: string }
    // Find or create user
    let userId = memory.usersBySteam.get(steamId)
    if (!userId) {
      userId = uid('usr_')
      memory.users.set(userId, { id: userId, steamId, wallet: null, kycStatus: 'none' })
      memory.usersBySteam.set(steamId, userId)
    }
    const token = JwtUtil.sign({ sub: userId, steamId })
    reply.json({ token, user: memory.users.get(userId) })
  })

  done()
}

