import appConfig from '#app/configs/app_config'

const CreditEngine = {
  // Apply haircut for low confidence pricing
  computeLtv(confidences: number[]): number {
    const base = appConfig.LTV_BASE_PCT
    // Reduce LTV up to -10pp if avg confidence < 0.8
    const avg = confidences.length ? confidences.reduce((a,b)=>a+b,0)/confidences.length : 1
    let adj = base
    if (avg < 0.8) adj -= Math.min(10, Math.round((0.8 - avg) * 20))
    if (adj < appConfig.LTV_MIN_PCT) adj = appConfig.LTV_MIN_PCT
    if (adj > appConfig.LTV_MAX_PCT) adj = appConfig.LTV_MAX_PCT
    return adj
  },
}

export default CreditEngine

