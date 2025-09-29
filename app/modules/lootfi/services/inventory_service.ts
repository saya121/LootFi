import { ID, ItemInstance, memory, uid } from '#app/libs/db/memory'

const InventoryService = {
  // Mock Steam sync; CS2 only
  async sync(userId: ID): Promise<ItemInstance[]> {
    // Pretend to fetch Steam inventory; create if empty
    const has = Array.from(memory.items.values()).some(it => it.userId === userId)
    if (!has) {
      const samples: Omit<ItemInstance, 'id'>[] = [
        { userId, game: 'CS2', name: 'AK-47 | Redline (Field-Tested)', value: 0, confidence: 0, escrowState: 'free' },
        { userId, game: 'CS2', name: 'Glock-18 | Water Elemental (Minimal Wear)', value: 0, confidence: 0, escrowState: 'free' },
      ]
      for (const s of samples) {
        const id = uid('itm_')
        memory.items.set(id, { id, ...s })
      }
    }
    return Array.from(memory.items.values()).filter(it => it.userId === userId)
  },
}

export default InventoryService

