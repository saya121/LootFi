import { ItemInstance, memory } from '#app/libs/db/memory'

type Price = { value: number, confidence: number }

const fallbackPrices: Record<string, Price> = {
  'AK-47 | Redline (Field-Tested)': { value: 15, confidence: 0.9 },
  'AWP | Dragon Lore (Factory New)': { value: 1500, confidence: 0.7 },
  'Glock-18 | Water Elemental (Minimal Wear)': { value: 5, confidence: 0.95 },
}

const PricingService = {
  priceItems(itemIds: string[]): { total: number, items: ItemInstance[] } {
    let total = 0
    const updated: ItemInstance[] = []
    for (const id of itemIds) {
      const item = memory.items.get(id)
      if (!item) continue
      const price = fallbackPrices[item.name] ?? { value: 2 + Math.random() * 20, confidence: 0.6 + Math.random() * 0.4 }
      item.value = Number(price.value.toFixed(2))
      item.confidence = Number(price.confidence.toFixed(2))
      total += item.value
      memory.items.set(item.id, item)
      updated.push(item)
    }
    return { total: Number(total.toFixed(2)), items: updated }
  }
}

export default PricingService

