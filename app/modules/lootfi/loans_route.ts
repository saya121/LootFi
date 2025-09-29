import { DoneFuncWithErrOrRes, FastifyInstance, FastifyPluginOptions } from 'fastify'
import { AuthedRequest, requireAuth } from '#app/libs/utils/auth_middleware'
import { memory } from '#app/libs/db/memory'
import LoanService from '#app/modules/lootfi/services/loan_service'

export default function (app: FastifyInstance, _opts: FastifyPluginOptions, done: DoneFuncWithErrOrRes) {
  app.post('/loans', {
    preHandler: requireAuth,
    schema: {
      tags: ['Loan'],
      body: {
        type: 'object', required: ['quoteId', 'wallet'], properties: {
          quoteId: { type: 'string' },
          wallet: { type: 'string' }
        }
      }
    }
  }, async (req: AuthedRequest, reply) => {
    const { quoteId, wallet } = req.body as { quoteId: string, wallet: string }
    const quote = memory.quotes.get(quoteId)
    if (!quote || quote.userId !== req.user!.id) return reply.status(404).send({ message: 'Quote not found' })
    const loan = LoanService.issue(req.user!.id, quote, wallet)
    reply.json({ loan })
  })

  app.post('/loans/:id/repay', { preHandler: requireAuth, schema: { tags: ['Loan'] } }, async (req: AuthedRequest, reply) => {
    const { id } = req.params as { id: string }
    const { amount } = req.body as { amount: number }
    const loan = LoanService.repay(id, amount)
    reply.json({ loan })
  })

  app.get('/loans/:id', { preHandler: requireAuth, schema: { tags: ['Loan'] } }, async (req: AuthedRequest, reply) => {
    const { id } = req.params as { id: string }
    const loan = LoanService.get(id)
    if (!loan) return reply.status(404).send({ message: 'Not found' })
    const collateralValue = loan.itemIds.reduce((acc, i) => acc + (memory.items.get(i)?.value ?? 0), 0)
    const outstanding = Math.max(0, loan.principal - loan.repaidAmount)
    reply.json({ loan, stats: { collateralValue, outstanding, ltv: Number((outstanding / Math.max(1, collateralValue)).toFixed(2)) } })
  })

  done()
}

