import { EscrowIntent, ID, ItemInstance, memory, now, uid } from '#app/libs/db/memory'

const EscrowService = {
  createIntent(userId: ID, itemIds: ID[]): EscrowIntent {
    // Mark items as intent
    for (const id of itemIds) {
      const it = memory.items.get(id)
      if (!it || it.userId !== userId) continue
      it.escrowState = 'intent'
      memory.items.set(id, it)
    }
    const intent: EscrowIntent = {
      id: uid('esc_'),
      userId,
      itemIds,
      tradeUrl: `https://steamcommunity.com/tradeoffer/new/?partner=lootfi-bot&token=${uid('').slice(0,8)}`,
      status: 'PENDING',
      createdAt: now(),
    }
    memory.escrowIntents.set(intent.id, intent)
    return intent
  },
  acceptIntent(intentId: ID) {
    const intent = memory.escrowIntents.get(intentId)
    if (!intent) return
    intent.status = 'ACCEPTED'
    memory.escrowIntents.set(intentId, intent)
    for (const id of intent.itemIds) {
      const it = memory.items.get(id)
      if (!it) continue
      it.escrowState = 'locked'
      memory.items.set(id, it)
    }
  }
}

export default EscrowService

