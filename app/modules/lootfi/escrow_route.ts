import { DoneFuncWithErrOrRes, FastifyInstance, FastifyPluginOptions } from 'fastify'
import { AuthedRequest, requireAuth } from '#app/libs/utils/auth_middleware'
import EscrowService from '#app/modules/lootfi/services/escrow_service'

export default function (app: FastifyInstance, _opts: FastifyPluginOptions, done: DoneFuncWithErrOrRes) {
  app.post('/escrow/intents', {
    preHandler: requireAuth,
    schema: {
      tags: ['Escrow'],
      body: { type: 'object', required: ['itemIds'], properties: { itemIds: { type: 'array', items: { type: 'string' } } } }
    }
  }, async (req: AuthedRequest, reply) => {
    const { itemIds } = req.body as { itemIds: string[] }
    const intent = EscrowService.createIntent(req.user!.id, itemIds)
    reply.json({ intent })
  })
  done()
}

