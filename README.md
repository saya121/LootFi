# LootFi Backend

Backend service implementing the LootFi MVP: Steam-based collateral loans against CS2 skins with instant crypto disbursal and automated liquidation.

## LootFi Backend Spec

### Core Features
- Steam OAuth login and inventory sync (CS2 only in MVP).
- Real-time skin valuation and LTV calculation.
- Deposit items to escrow via trade bot intent.
- Instant crypto loan disbursal (mock treasury for MVP).
- Loan repayment and skin reclaim.
- Automatic liquidation on missed payments or LTV breach.
- Loan dashboard endpoints for status and repayment tracking.

### Services
- Auth: Steam login, JWT issuance.
- Inventory: Fetch & normalize user skins.
- Pricing: Real-time item pricing from marketplaces (mocked in MVP).
- Escrow: Trade bot intent to receive/return items.
- Credit Engine: LTV calculation, loan quote generation.
- Loan: Issue, track, repay loans.
- Treasury: Handle crypto disbursal & repayment (mock chain).
- Liquidation: Sell collateral if default.
- Notifications: Alerts for due dates, liquidation (stub in MVP).
- Admin: Risk settings, overrides (out of scope for MVP).

### Data Model (Essentials)
- `User`: steam_id, wallet, KYC status.
- `ItemInstance`: game, name, value, escrow state.
- `Loan`: principal, APR, due date, status.
- `Quote`: valuation, LTV, fees, expiry.
- `Ledger`: disbursal, repayment, liquidation events.

### Core Flows
1. Login & Sync: Steam login → fetch inventory.
2. Quote & Deposit: Items valued → loan quote → trade bot receives escrow (intent → accept).
3. Loan Disbursal: Crypto sent to wallet (mock), items locked.
4. Repayment: User pays → skins returned.
5. Liquidation: Auto-sale if missed payment → proceeds repay loan.

### Risk & LTV
- Base LTV: 30–50% (configurable, default 40%).
- Haircut on low-confidence pricing.
- Grace period before liquidation (config; simplified in MVP).
- Auto top-up option (todo).

### APIs (Key Endpoints)
All routes are under `/v1`.
- `POST /auth/steam` – Steam login → JWT.
- `POST /inventory/sync` – Fetch inventory (CS2 mock data on first sync).
- `POST /quotes` – Get loan quote for selected item IDs.
- `POST /escrow/intents` – Create trade offer intent for selected item IDs.
- `POST /loans` – Issue loan from approved quote.
- `POST /loans/:id/repay` – Repay loan amount.
- `GET /loans/:id` – Loan status, collateral value, outstanding, LTV.

### MVP Scope
- CS2 support only.
- Single blockchain (mock chain; set with `BASE_CHAIN`).
- One liquidation marketplace (simulated sale at 90% of price).
- Email notifications not implemented; stub only.
- Basic admin settings via env only.

### Security & Compliance
- JWT auth on protected endpoints.
- Webhook signatures not required in MVP.
- Secrets via environment variables.
- Fraud checks and item blacklists: todo.
- Minimal KYC at launch.

## Tech Stack
- Node.js + Fastify (TypeScript)
- Swagger UI at `/documentation` in non-production
- Prisma present but not required for MVP; In-memory store used

## Quick Start

### Prerequisites
- Node.js 18+

### Setup
```bash
cp .env.example .env
npm install
npm run dev
```

### Example Flow (cURL)
```bash
# 1) Steam login (mock)
TOKEN=$(curl -s -X POST localhost:3000/v1/auth/steam -H 'content-type: application/json' \
  -d '{"steamId":"76561198000000000"}' | jq -r .data.token)

# 2) Sync inventory
curl -s -X POST localhost:3000/v1/inventory/sync -H "authorization: Bearer $TOKEN"

# 3) Create quote (use itemIds from sync response)
curl -s -X POST localhost:3000/v1/quotes -H 'content-type: application/json' -H "authorization: Bearer $TOKEN" \
  -d '{"itemIds":["itm_xxx","itm_yyy"]}'

# 4) Create escrow intent
curl -s -X POST localhost:3000/v1/escrow/intents -H 'content-type: application/json' -H "authorization: Bearer $TOKEN" \
  -d '{"itemIds":["itm_xxx","itm_yyy"]}'

# 5) Issue loan (use quoteId)
curl -s -X POST localhost:3000/v1/loans -H 'content-type: application/json' -H "authorization: Bearer $TOKEN" \
  -d '{"quoteId":"qte_xxx","wallet":"0xYourWallet"}'

# 6) Get status
curl -s localhost:3000/v1/loans/loan_xxx -H "authorization: Bearer $TOKEN"

# 7) Repay
curl -s -X POST localhost:3000/v1/loans/loan_xxx/repay -H 'content-type: application/json' -H "authorization: Bearer $TOKEN" \
  -d '{"amount": 10}'
```

## Environment Variables
```env
APP_PORT=3000
LOGGER=true

# JWT
JWT_SECRET=change_me_min_10_chars

# Optional: Pricing/Treasury config
PRICING_PROVIDER=mock
BASE_CHAIN=mock # base | polygon | mock
TREASURY_WALLET=

# Optional: Steam
STEAM_API_KEY=

# Database (unused in MVP; kept for future Prisma usage)
DATABASE_URL=
```

## Project Structure
```
lootfi-backend/
├── app/
│   ├── configs/
│   ├── exceptions/
│   ├── libs/
│   │   ├── db/                  # In-memory store (MVP)
│   │   └── utils/               # jwt, auth middleware, encryption
│   ├── modules/
│   │   └── lootfi/
│   │       ├── auth_steam_route.ts
│   │       ├── inventory_route.ts
│   │       ├── quotes_route.ts
│   │       ├── escrow_route.ts
│   │       ├── loans_route.ts
│   │       └── services/
│   │           ├── pricing_service.ts
│   │           ├── inventory_service.ts
│   │           ├── credit_engine.ts
│   │           ├── escrow_service.ts
│   │           ├── loan_service.ts
│   │           ├── treasury_service.ts
│   │           └── liquidation_service.ts
│   └── routes/
└── index.ts
```

## Notes
- Swagger UI available at `/documentation` in development.
- Pricing and treasury are mocked; swap implementations later without changing routes.
