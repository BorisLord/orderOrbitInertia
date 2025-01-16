import Order from '#models/order'
import { ApiKeyService } from '#services/api_key_service'
import { BrokerService } from '#services/broker_service'
// import { CcxtService } from '#services/ccxt_service'
import { OrderService } from '#services/order_service'
import type { HttpContext } from '@adonisjs/core/http'
// import ccxt, { Exchange, Order, Currencies, Market } from 'ccxt'
// import { syncBuiltinESMExports } from 'module'

export default class OrdersControllersController {
  public async getOrders({ auth, inertia }: HttpContext) {
    const user = auth.getUserOrFail()

    // const apiKeys = await ApiKeyService.getApiKeysByUser(user.id, true)

    // const openOrders = await Promise.all(
    //   apiKeys.map(async (apiKey) => {
    //     try {
    //       const exchange = BrokerService.createExchange(apiKey)
    //       exchange.options['warnOnFetchOpenOrdersWithoutSymbol'] = false

    //       if (exchange.has['fetchOpenOrders']) {
    //         try {
    //           // Tente de récupérer les ordres sans symbol
    //           const orders = await exchange.fetchOpenOrders()
    //           const trimmedOrders = CcxtService.trimOrder(orders)
    //           return { [apiKey.exchangeId]: trimmedOrders }
    //         } catch (e) {
    //           if (e instanceof ccxt.ArgumentsRequired) {
    //             console.log(
    //               `${exchange.id}: fetchOpenOrders requires a symbol argument. Fetching symbols...`
    //             )
    //             // Charger les marchés pour récupérer les symboles
    //             await exchange.loadMarkets()
    //             const symbols = Object.keys(exchange.markets) // Récupère tous les symboles disponibles
    //             // console.log(symbols)
    //             const usdPairs = symbols.filter((symbol) => symbol.includes('USDC'))
    //             // exchange.throttler.config['maxCapacity'] = 10000

    //             // Itérer sur chaque symbole pour récupérer les ordres ouverts
    //             const ordersBySymbol = await Promise.all(
    //               usdPairs.map(async (symbol) => {
    //                 try {
    //                   return await exchange.fetchOpenOrders(symbol)
    //                 } catch (err) {
    //                   console.error(
    //                     `${exchange.id}: Error fetching orders for symbol ${symbol}:`,
    //                     err.message
    //                   )
    //                   return [] // Ignorer les erreurs par symbole
    //                 }
    //               })
    //             )

    //             // Combiner tous les ordres en une seule liste
    //             const allOrders = ordersBySymbol.flat()
    //             const trimmedOrders = CcxtService.trimOrder(allOrders)
    //             return { [apiKey.exchangeId]: trimmedOrders }
    //           } else {
    //             console.log(`${exchange.id}: fetchOpenOrders failed with:`, e.message)
    //             throw e // Relancer si ce n'est pas une erreur ArgumentsRequired
    //           }
    //         }
    //       }
    //     } catch (error) {
    //       console.error(`Failed to fetch orders for ${apiKey.exchangeId}:`, error)
    //       return { [apiKey.exchangeId]: { error: error.message } }
    //     }
    //   })
    // )

    const openOrders = await OrderService.getOrder(user)
    // console.log('OpenOrder', openOrders)

    // console.log('Hey Bastard', openOrders)
    return inertia.render('users/OpenOrders', { openOrders })
  }

  public async cancelOrder({ auth, request, inertia }: HttpContext) {
    const user = auth.getUserOrFail()

    const { id, exchangeId, symbol } = request.only(['id', 'exchangeId', 'symbol'])

    // console.log('CANCEL', id, exchangeId, symbol)

    const apiKeys = await ApiKeyService.getApiKeysByUserAndExchange(user.id, exchangeId, true)
    console.log('API', apiKeys)

    const exchange = BrokerService.createExchange(apiKeys[0])

    const order = await Order.query().where('id', id).andWhere('user_id', user.id)
    const exchangeOrderId: string = order[0].orderId?.toString() || ''

    await exchange.cancelOrder(exchangeOrderId, symbol)
    // console.log('cancelOrder (delete me)', cancelOrder)

    return inertia.render('users/OpenOrders')
  }

  public async createOrder({ auth, request, inertia }: HttpContext) {
    const user = auth.getUserOrFail()
    const { exchange, symbol, type, side, amount, price } = request.only([
      'exchange',
      'symbol',
      'type',
      'side',
      'amount',
      'price',
    ])

    const smallEx = exchange.toLowerCase()

    console.log('BODY', request.body())

    const apiKey = await ApiKeyService.getApiKeysByUserAndExchange(user.id, smallEx, true)

    const res = await Promise.all(
      apiKey.map(async (Key) => {
        try {
          const ex = BrokerService.createExchange(Key)
          let order
          if (type === 'limit') {
            order = await ex.createOrder(symbol, type, side, amount, price)
          } else {
            order = await ex.createOrder(symbol, type, side, amount)
          }
          return { [Key.exchangeId]: order }
        } catch (error) {
          console.error(`Failed to fetch balance for ${Key.exchangeId}:`, error)
          return { [Key.exchangeId]: { error: error.message } }
        }
      })
    )

    console.log('res', res)

    return inertia.render('users/Dashboard')
  }
}
