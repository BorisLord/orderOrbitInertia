import { ApiKeyService } from '#services/api_key_service'
import { BrokerService } from '#services/broker_service'
import { CcxtService } from '#services/ccxt_service'
import { OrderService } from '#services/order_service'
import type { HttpContext } from '@adonisjs/core/http'
import ccxt, { Exchange, Order, Currencies, Market } from 'ccxt'

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

  public async cancelOrder({ auth, response, request, inertia }: HttpContext) {
    const user = auth.getUserOrFail()

    const { id, exchangeId, symbol } = request.only(['id', 'exchangeId', 'symbol'])

    const apiKeys = await ApiKeyService.getApiKeysByUserAndExchange(user.id, exchangeId, true)

    const exchange = BrokerService.createExchange(apiKeys[0])

    const cancelOrder = await exchange.cancelOrder(id, symbol)
    console.log('cancelOrder (delete me)', cancelOrder)

    return inertia.render('users/Orders')
  }

  public async createOrder({ auth, response, request, inertia }: HttpContext) {
    const user = auth.getUserOrFail()
    const exchangeIds = ['binance', 'phemex']
    const symbol = 'BTC/USDC'
    const type = 'limit'
    const side = 'buy'
    const amount = 1

    // const exchangeIds = request.input('exchangeId')
    // Recuperer un [] avec quel exchange ?
    //          symbol "BTC/USDC"
    //          type   "limit | market"
    //          side   "buy | sell"
    //          amount  number

    // createOrderParam
    // symbol: string,
    // type: OrderType,
    // side: OrderSide,
    // amount: number,
    // price?: Num,
    // params?: {}

    const apiKeys = await ApiKeyService.getApiKeysByUser(user.id, true)

    const commonApiKeys = apiKeys.filter((apiKey) => exchangeIds.includes(apiKey.exchangeId))

    const orders = await Promise.all(
      commonApiKeys.map(async (apiKey) => {
        try {
          const exchange = BrokerService.createExchange(apiKey)

          const order = await exchange.createOrder(symbol, type, side, amount)

          return { [apiKey.exchangeId]: trimmedBalance }
        } catch (error) {
          console.error(`Failed to fetch balance for ${apiKey.exchangeId}:`, error)
          return { [apiKey.exchangeId]: { error: error.message } }
        }
      })
    )

    return inertia.render('users/CreateOrders')
  }
}
