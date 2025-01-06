import ApiKey from '#models/api_key'
import type { HttpContext } from '@adonisjs/core/http'
import encryption from '@adonisjs/core/services/encryption'
import ccxt, { Exchange } from 'ccxt'
import fs from 'node:fs/promises'

export default class OrdersControllersController {
  public async getOrders({ auth, inertia, response }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }

    const exchangeIds = await ApiKey.query().where('user_id', user?.id).select('exchangeId')

    const apiKeys = await ApiKey.query()
      .where('user_id', user?.id)
      .select('exchangeId', 'apiKey', 'secret')

    const formattedApiKeys = apiKeys.map((apiKey) => ({
      exchangeId: apiKey.exchangeId,
      apiKey: apiKey.apiKey,
      secret: encryption.decrypt(apiKey.secret),
    }))

    for (const apiKey of formattedApiKeys) {
      try {
        const exchangeId = exchangeIds[0].exchangeId
        const exchangeClass = (ccxt as any)[exchangeId]
        const exchange: Exchange = new exchangeClass({
          apiKey: apiKey.apiKey,
          secret: apiKey.secret,
          enableRateLimit: true,
        })
        exchange.options['warnOnFetchOpenOrdersWithoutSymbol'] = false

        const orders = await exchange.fetchOpenOrders()
        const jsonContent = JSON.stringify(orders, null, 2)
        await fs.writeFile('./app/controllers/fetchOpenOrders.json', jsonContent, 'utf8')
        console.log(orders)
      } catch (err) {
        console.log(err)
      }
    }

    // const exchangeId = exchangeIds[0].exchangeId
    // const ex = new ccxt.binance()
    // ex.options['warnOnFetchOpenOrdersWithoutSymbol'] = false
    // const ticker = await ex.fetchOpenOrders()

    // const jsonContent = JSON.stringify(ticker, null, 2)
    // await fs.writeFile('./app/controllers/tickers.json', jsonContent, 'utf8')

    // console.log(ex.fetchTickers(['ETH/BTC', 'BTC/USDT']))
    // exchangeIds[0].fetchTickers(['ETH/BTC', 'BTC/USDT'])
    console.log(exchangeIds[0].exchangeId)
    // exchangeIds.forEach((ex) => {
    //   console.log(ex.exchangeId)
    // })

    return inertia.render('users/Orders')
  }
}
