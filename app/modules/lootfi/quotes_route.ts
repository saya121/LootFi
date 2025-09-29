import { DoneFuncWithErrOrRes, FastifyInstance, FastifyPluginOptions } from 'fastify'
import { AuthedRequest, requireAuth } from '#app/libs/utils/auth_middleware'
import PricingService from '#app/modules/lootfi/services/pricing_service'
import CreditEngine from '#app/modules/lootfi/services/credit_engine'
import { Quote, memory, uid, now } from '#app/libs/db/memory'

export default function (app: FastifyInstance, _opts: FastifyPluginOptions, done: DoneFuncWithErrOrRes) {
  app.post('/quotes', {
    preHandler: requireAuth,
    schema: {
      tags: ['Pricing'],
      body: {
        type: 'object',
        required: ['itemIds'],
        properties: { itemIds: { type: 'array', items: { type: 'string' } } }
      }
    }
  }, async (req: AuthedRequest, reply) => {
    const { itemIds } = req.body as { itemIds: string[] }
    const { total, items } = PricingService.priceItems(itemIds)
    const ltvPct = CreditEngine.computeLtv(items.map(i => i.confidence))
    const principal = Number(((total * ltvPct) / 100).toFixed(2))
    const fees = Number((principal * 0.01).toFixed(2))
    const quote: Quote = {
      id: uid('qte_'),
      userId: req.user!.id,
      itemIds,
      valuation: total,
      ltvPct,
      fees,
      principal: principal - fees,
      expiresAt: now() + 15 * 60 * 1000, // 15 min
    }
    memory.quotes.set(quote.id, quote)
    reply.json({ quote })
  })
  done()
}

