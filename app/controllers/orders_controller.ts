import ApiKey from '#models/api_key'
import type { HttpContext } from '@adonisjs/core/http'
import encryption from '@adonisjs/core/services/encryption'
import ccxt, { Exchange, Order } from 'ccxt'

export default class OrdersControllersController {
  public async getOrders({ auth, inertia, response }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }

    // const exchangeIds = await ApiKey.query().where('user_id', user?.id).select('exchangeId')

    const apiKeys = await ApiKey.query()
      .where('user_id', user?.id)
      .select('exchangeId', 'apiKey', 'secret')

    const formattedApiKeys = apiKeys.map((apiKey) => ({
      exchangeId: apiKey.exchangeId,
      apiKey: apiKey.apiKey,
      secret: encryption.decrypt(apiKey.secret),
    }))

    const openOrders: { [key: string]: any } = {}

    for (const apiKey of formattedApiKeys) {
      try {
        const exchangeId = apiKey.exchangeId
        const exchangeClass = (ccxt as any)[exchangeId]
        const exchange: Exchange = new exchangeClass({
          apiKey: apiKey.apiKey,
          secret: apiKey.secret,
          enableRateLimit: true,
        })

        exchange.options['warnOnFetchOpenOrdersWithoutSymbol'] = false
        const orders: Order[] = await exchange.fetchOpenOrders()
        // console.log(Object.keys(order))

        const trimmedOrders = orders.map((order) => ({
          id: order.id,
          symbol: order.symbol,
          type: order.type,
          side: order.side,
          price: order.price,
          amount: order.amount,
          dateTime: order.datetime,
        }))
        openOrders[apiKey.exchangeId] = trimmedOrders

        // const jsonContent = JSON.stringify(order, null, 2)
        // await fs.writeFile('./app/controllers/fetchOpenOrders.json', jsonContent, 'utf8')
        // console.log(orders)
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
    // console.log(exchangeIds[0].exchangeId)
    // exchangeIds.forEach((ex) => {
    //   console.log(ex.exchangeId)
    // })
    console.log('Hey Bastard')
    return inertia.render('users/OpenOrders', { openOrders })
  }

  public async cancelOrder({ auth, response, request, inertia }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({ message: 'User not auth,enticated' })
    }

    const id = request.input('id')
    const exchangeId = request.input('exchangeId')
    const symbol = request.input('symbol')

    const apiKeys = await ApiKey.query()
      .where('user_id', user?.id)
      .where('exchangeId', exchangeId)
      .select('apiKey', 'secret')

    console.log(apiKeys)

    const formattedApiKey = apiKeys.map((apiKey) => ({
      exchangeId,
      apiKey: apiKey.apiKey,
      secret: encryption.decrypt(apiKey.secret),
    }))

    const exchangeClass = (ccxt as any)[exchangeId]
    const exchange: Exchange = new exchangeClass({
      apiKey: formattedApiKey[0].apiKey,
      secret: formattedApiKey[0].secret,
      enableRateLimit: true, // Active le limiteur de requêtes
    })

    // console.log(exchange)
    console.log('symbol: ', symbol)
    const cancelOrder = await exchange.cancelOrder(id, symbol)
    console.log(cancelOrder)

    return inertia.render('users/Orders')
  }

  public async createOrder({ auth, response, request, inertia }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({ message: 'User not auth,enticated' })
    }
  }
}
