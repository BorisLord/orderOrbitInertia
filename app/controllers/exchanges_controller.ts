import type { HttpContext } from '@adonisjs/core/http'

import ccxt from 'ccxt'

export default class ExchangesController {
  public async listExchanges({ inertia }: HttpContext) {
    const exchanges = ccxt.exchanges
    return inertia.render('Exchanges/Index', { exchanges })
  }
}
