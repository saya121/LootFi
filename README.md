<img width="100" height="100" alt="lootfi" src="https://github.com/user-attachments/assets/bcc5967e-5057-42af-9144-9987b65dd8e6" />

# LootFi

<<<<<<< HEAD
## Overview
=======
## LootFi Backend Spec
>>>>>>> d82e202eb06727bf1bfad9c0368bc9cd93c06502

LootFi is a gaming-finance backend that lets players borrow crypto against their Steam CS2 skins. Users log in with Steam, deposit selected items to escrow, receive an instant crypto loan, and reclaim their skins upon repayment. Automatic liquidation protects the treasury if a borrower misses payments or collateral LTV breaches.

## Features

- **Steam Login + Inventory**: OAuth-like Steam login and CS2 inventory sync
- **Real-Time Valuation**: Price items and compute LTV in real time
- **Escrow via Trade Bot**: Create trade intents and lock items as collateral
- **Instant Loan Disbursal**: Send crypto to borrower wallet (mock treasury in MVP)
- **Repayment + Reclaim**: Repay anytime and receive items back
- **Automatic Liquidation**: Sell collateral after grace period or LTV breach
- **Loan Dashboard**: Track loan status, outstanding, collateral value, and LTV

## How It Works

1. **Login & Sync**: Steam login → fetch CS2 inventory
2. **Quote & Deposit**: Price items → generate loan quote → trade intent for escrow
3. **Loan Disbursal**: Crypto sent to wallet, items locked in escrow
4. **Repayment**: Borrower repays → skins returned to the user
5. **Liquidation**: Missed payment or LTV breach → sell items → repay loan

## Tech Stack

- **Backend**: Node.js with Fastify (TypeScript)
- **Data**: In-memory store (MVP) with Prisma skeleton for future Postgres
- **Auth**: JWT
- **API Documentation**: Swagger/OpenAPI (`/documentation` in dev)
- **Games**: Counter‑Strike 2 (MVP)
- **Chain**: Mock chain for treasury (Base/Polygon planned)

## Quick Start

### Prerequisites

- Node.js 18+

### Installation

```bash
# Clone the repository
git clone git@github.com:saya121/LootFi.git

# Navigate to project directory
cd LootFi

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Optional: Prisma skeleton (not required for MVP runtime)
npx prisma generate
# npx prisma db push
# npx prisma db seed

# Start development server
npm run dev
```

### Environment Variables

```env
# App
APP_PORT=3000
NODE_ENV=development
LOGGER=true

# JWT
JWT_SECRET=your_jwt_secret

# Pricing & Treasury (MVP uses mocks)
PRICING_PROVIDER=mock
BASE_CHAIN=mock    # base | polygon | mock
TREASURY_WALLET=

# Steam (optional for real integration)
STEAM_API_KEY=

# Legacy/Optional
ENCRYPTION_KEY_1=
ENCRYPTION_KEY_2=

# Database (unused in MVP; kept for Prisma migration)
DATABASE_URL=
```

## Usage

### For Borrowers

1. Authenticate with Steam
2. Sync CS2 inventory
3. Select items and request a quote
4. Create escrow trade intent and deposit items
5. Receive instant loan; repay to reclaim items

### For Admins (MVP)

1. Configure LTV and risk bounds via env
2. Monitor loans; liquidation triggers automatically

## Project Structure

```
lootfi/
├── app/
│   ├── configs/           # App + Swagger configuration
│   ├── exceptions/        # Exceptions and error codes
│   ├── libs/
│   │   ├── db/            # In-memory data store
│   │   └── utils/         # jwt, auth middleware, encryption
│   ├── modules/
│   │   └── lootfi/        # Core LootFi routes & services
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
│   └── routes/            # API version mounting
│       ├── index.ts
│       └── v1.ts
├── prisma/
│   ├── schemas/
│   │   ├── schema.prisma
│   │   └── user.prisma
│   └── seeders/
│       └── index.ts
├── types/
│   └── fastify.d.ts
└── index.ts               # Application entry point
```

<<<<<<< HEAD
## Contributing

We welcome contributions from the community! Please read our Contributing Guidelines before submitting pull requests.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and commit: `git commit -m 'Add amazing feature'`
4. Push to your branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## API Documentation

### Authentication

```http
POST /v1/auth/steam
```

### Inventory

```http
POST /v1/inventory/sync
```

### Pricing & Quotes

```http
POST /v1/quotes
```

### Escrow

```http
POST /v1/escrow/intents
```

### Loans

```http
POST /v1/loans
POST /v1/loans/:id/repay
GET  /v1/loans/:id
```

## Database Schema

MVP uses an in-memory store. Prisma models are scaffolded for future migrations. Essential entities:

- **User**: steam_id, wallet, KYC status
- **ItemInstance**: game, name, value, escrow state
- **Loan**: principal, APR, due date, status
- **Quote**: valuation, LTV, fees, expiry
- **Ledger**: disbursal, repayment, liquidation events

Run `npx prisma studio` after configuring a database if you want to preview models.

## Security

- JWT auth for protected endpoints
- Secrets via environment variables
- Webhook signatures, fraud checks, and blacklists: planned
- Minimal KYC at launch

## Supported Platforms

- **Game**: Counter‑Strike 2 (MVP)
- **Blockchain**: Mock chain (Base/Polygon planned)

## Roadmap

- [ ] Real Steam OAuth + inventory API
- [ ] Marketplace pricing integrations with confidence scoring
- [ ] Dota 2 support
- [ ] Treasury on Base or Polygon
- [ ] Email notifications
- [ ] Admin dashboard & risk overrides

## Tokenomics

Not applicable. LootFi issues loans; no platform reward token in MVP.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Steam and CS2 communities
- Open source maintainers of Fastify, Prisma, Zod, and friends
- Early testers and contributors

=======
## Notes
- Swagger UI available at `/documentation` in development.
- Pricing and treasury are mocked; swap implementations later without changing routes.
>>>>>>> d82e202eb06727bf1bfad9c0368bc9cd93c06502
