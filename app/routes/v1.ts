import { FastifyInstance } from 'fastify'

import MainRoute from '#app/modules/main_route'
import AuthSteamRoute from '#app/modules/lootfi/auth_steam_route'
import InventoryRoute from '#app/modules/lootfi/inventory_route'
import QuotesRoute from '#app/modules/lootfi/quotes_route'
import EscrowRoute from '#app/modules/lootfi/escrow_route'
import LoansRoute from '#app/modules/lootfi/loans_route'

export default function (app: FastifyInstance) {
  app.register(MainRoute)
  app.register(AuthSteamRoute)
  app.register(InventoryRoute)
  app.register(QuotesRoute)
  app.register(EscrowRoute)
  app.register(LoansRoute)
}
