import { ID, Loan, Quote, memory, now, uid } from '#app/libs/db/memory'
import TreasuryService from '#app/modules/lootfi/services/treasury_service'
import LiquidationService from '#app/modules/lootfi/services/liquidation_service'

const LoanService = {
  issue(userId: ID, quote: Quote, wallet: string): Loan {
    const apr = 0.15
    const created = now()
    const due = created + 14 * 24 * 60 * 60 * 1000 // 14 days
    const loan: Loan = {
      id: uid('loan_'),
      userId,
      principal: Math.round((quote.principal + Number.EPSILON) * 100) / 100,
      apr,
      createdAt: created,
      dueDate: due,
      status: 'active',
      itemIds: quote.itemIds,
      repaidAmount: 0,
    }
    memory.loans.set(loan.id, loan)
    // lock items
    for (const id of quote.itemIds) {
      const it = memory.items.get(id)
      if (!it) continue
      it.escrowState = 'locked'
      memory.items.set(id, it)
    }
    TreasuryService.disburse(loan, wallet)
    return loan
  },
  repay(loanId: ID, amount: number) {
    const loan = memory.loans.get(loanId)
    if (!loan) throw new Error('Loan not found')
    if (loan.status !== 'active') return loan
    TreasuryService.repay(loan.id, amount)
    loan.repaidAmount += amount
    if (loan.repaidAmount >= loan.principal) {
      loan.status = 'repaid'
      // Return items
      for (const id of loan.itemIds) {
        const it = memory.items.get(id)
        if (!it) continue
        it.escrowState = 'returned'
        memory.items.set(id, it)
      }
    }
    memory.loans.set(loan.id, loan)
    return loan
  },
  get(loanId: ID): Loan | undefined {
    const loan = memory.loans.get(loanId)
    if (!loan) return undefined
    // Opportunistic check for liquidation triggers
    return LiquidationService.checkAndLiquidate(loan)
  }
}

export default LoanService

