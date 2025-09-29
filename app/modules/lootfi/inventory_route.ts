import { DoneFuncWithErrOrRes, FastifyInstance, FastifyPluginOptions } from 'fastify'
import InventoryService from '#app/modules/lootfi/services/inventory_service'
import { AuthedRequest, requireAuth } from '#app/libs/utils/auth_middleware'

export default function (app: FastifyInstance, _opts: FastifyPluginOptions, done: DoneFuncWithErrOrRes) {
  app.post('/inventory/sync', {
    preHandler: requireAuth,
    schema: { tags: ['Inventory'] }
  }, async (req: AuthedRequest, reply) => {
    const items = await InventoryService.sync(req.user!.id)
    reply.json({ items })
  })
  done()
}

