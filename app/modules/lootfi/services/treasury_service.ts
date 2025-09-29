import { ID, LedgerEvent, Loan, memory, now, uid } from '#app/libs/db/memory'

const TreasuryService = {
  disburse(loan: Loan, wallet: string) {
    const evt: LedgerEvent = {
      id: uid('led_'),
      loanId: loan.id,
      type: 'DISBURSAL',
      amount: loan.principal,
      createdAt: now(),
      metadata: { chain: 'mock', wallet }
    }
    memory.ledger.set(evt.id, evt)
    return evt
  },
  repay(loanId: ID, amount: number) {
    const evt: LedgerEvent = {
      id: uid('led_'),
      loanId,
      type: 'REPAYMENT',
      amount,
      createdAt: now(),
    }
    memory.ledger.set(evt.id, evt)
    return evt
  }
}

export default TreasuryService

