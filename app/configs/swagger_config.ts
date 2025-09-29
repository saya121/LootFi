const swaggerConfigSetup = (host: string) => ({
  mode: 'dynamic',
  swagger: {
    info: {
      title: 'LootFi API Documentation',
      description: 'API documentation for LootFi Backend (MVP)',
      version: '0.1.0',
      contact: {
        name: 'LootFi API Support',
      },
    },
    host: `${host}`,
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      { name: 'Auth', description: 'Steam login and JWT issuance' },
      { name: 'Inventory', description: 'Sync and view user Steam inventory' },
      { name: 'Pricing', description: 'Item valuation and LTV quotes' },
      { name: 'Escrow', description: 'Trade intents and item locking' },
      { name: 'Loan', description: 'Issue, repay, and view loans' },
    ],
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
        description:
          'Enter the token with the `Bearer: ` prefix, e.g. "Bearer abcde12345".',
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  exposeRoute: true,
  hideUntagged: false,
})

export default swaggerConfigSetup
