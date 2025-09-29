import { z } from 'zod'

// Keep legacy fields optional to avoid boot-time failures while we pivot to LootFi.
const appConfigSchema = z.object({
  // Core
  JWT_SECRET: z.string().min(10, 'JWT_SECRET must be set and at least 10 chars'),

  // Optional legacy keys
  ENCRYPTION_KEY_1: z.string().optional().default(''),
  ENCRYPTION_KEY_2: z.string().optional().default(''),
  APPLE_CLIENT_ID: z.string().optional().default(''),
  IOS_GOOGLE_CLIENT_ID: z.string().optional().default(''),
  ANDROID_GOOGLE_CLIENT_ID: z.string().optional().default(''),

  // LootFi specific (optional for local dev)
  STEAM_API_KEY: z.string().optional().default(''),
  PRICING_PROVIDER: z.string().optional().default('mock'),
  BASE_CHAIN: z.enum(['base', 'polygon', 'mock']).optional().default('mock'),
  TREASURY_WALLET: z.string().optional().default(''),
  LTV_BASE_PCT: z.coerce.number().optional().default(40),
  LTV_MIN_PCT: z.coerce.number().optional().default(30),
  LTV_MAX_PCT: z.coerce.number().optional().default(50),
  GRACE_DAYS: z.coerce.number().optional().default(3),
})

const appConfig = appConfigSchema.parse({
  JWT_SECRET: process.env.JWT_SECRET,

  ENCRYPTION_KEY_1: process.env.ENCRYPTION_KEY_1,
  ENCRYPTION_KEY_2: process.env.ENCRYPTION_KEY_2,
  APPLE_CLIENT_ID: process.env.APPLE_CLIENT_ID,
  IOS_GOOGLE_CLIENT_ID: process.env.IOS_GOOGLE_CLIENT_ID,
  ANDROID_GOOGLE_CLIENT_ID: process.env.ANDROID_GOOGLE_CLIENT_ID,

  STEAM_API_KEY: process.env.STEAM_API_KEY,
  PRICING_PROVIDER: process.env.PRICING_PROVIDER,
  BASE_CHAIN: process.env.BASE_CHAIN as any,
  TREASURY_WALLET: process.env.TREASURY_WALLET,
  LTV_BASE_PCT: process.env.LTV_BASE_PCT,
  LTV_MIN_PCT: process.env.LTV_MIN_PCT,
  LTV_MAX_PCT: process.env.LTV_MAX_PCT,
  GRACE_DAYS: process.env.GRACE_DAYS,
})

export default appConfig
