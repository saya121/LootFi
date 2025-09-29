// Simple in-memory data store for LootFi MVP

export type ID = string

export type User = {
  id: ID
  steamId: string
  wallet?: string | null
  kycStatus?: 'none' | 'pending' | 'approved'
}

export type ItemInstance = {
  id: ID
  userId: ID
  game: 'CS2'
  name: string
  marketHashName?: string
  value: number // last priced value in USD
  confidence: number // 0..1
  escrowState: 'free' | 'intent' | 'locked' | 'returned' | 'sold'
}

export type Quote = {
  id: ID
  userId: ID
  itemIds: ID[]
  valuation: number
  ltvPct: number
  fees: number
  principal: number
  expiresAt: number // epoch ms
}

export type Loan = {
  id: ID
  userId: ID
  principal: number
  apr: number
  createdAt: number
  dueDate: number
  status: 'active' | 'repaid' | 'liquidating' | 'liquidated' | 'defaulted'
  itemIds: ID[]
  repaidAmount: number
}

export type LedgerEvent = {
  id: ID
  loanId: ID
  type: 'DISBURSAL' | 'REPAYMENT' | 'LIQUIDATION_SALE'
  amount: number
  createdAt: number
  metadata?: Record<string, unknown>
}

export type EscrowIntent = {
  id: ID
  userId: ID
  itemIds: ID[]
  tradeUrl: string
  status: 'PENDING' | 'ACCEPTED' | 'CANCELLED'
  createdAt: number
}

export const memory = {
  users: new Map<ID, User>(),
  usersBySteam: new Map<string, ID>(),
  items: new Map<ID, ItemInstance>(),
  quotes: new Map<ID, Quote>(),
  loans: new Map<ID, Loan>(),
  ledger: new Map<ID, LedgerEvent>(),
  escrowIntents: new Map<ID, EscrowIntent>(),
}

export function uid(prefix = ''): ID {
  return `${prefix}${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`
}

export function now() { return Date.now() }

