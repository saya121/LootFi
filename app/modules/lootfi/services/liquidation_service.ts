import { ID, ItemInstance, Loan, memory, now, uid } from '#app/libs/db/memory'
import TreasuryService from '#app/modules/lootfi/services/treasury_service'

const LiquidationService = {
  checkAndLiquidate(loan: Loan) {
    if (loan.status !== 'active') return loan
    const pastDue = now() > loan.dueDate
    const collateralValue = loan.itemIds.reduce((acc, id) => acc + (memory.items.get(id)?.value ?? 0), 0)
    const ltv = loan.principal / Math.max(1, collateralValue)
    const breach = ltv > 0.75 // simple threshold
    if (pastDue || breach) {
      loan.status = 'liquidating'
      // Mark items as sold and create ledger events
      let proceeds = 0
      for (const id of loan.itemIds) {
        const it = memory.items.get(id)
        if (!it) continue
        it.escrowState = 'sold'
        // Sell below market value
        const sale = (it.value || 0) * 0.9
        proceeds += sale
        memory.items.set(id, it)
      }
      // Apply proceeds as repayment
      TreasuryService.repay(loan.id, proceeds)
      loan.repaidAmount += proceeds
      if (loan.repaidAmount >= loan.principal) {
        loan.status = 'liquidated'
      }
      memory.loans.set(loan.id, loan)
    }
    return loan
  }
}

export default LiquidationService

