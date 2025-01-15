import Order from '#models/order'
import User from '#models/user'
import ccxt from 'ccxt'
import { ApiKeyService } from './api_key_service.js'
import { BrokerService } from './broker_service.js'
import { CcxtService } from './ccxt_service.js'
import db from '@adonisjs/lucid/services/db'

export class OrderService {
  static async fetchOrderFromBroker(user: User) {
    const userId = user.id
    const apiKeys = await ApiKeyService.getApiKeysByUser(userId, true)

    await Promise.all(
      apiKeys.map(async (apiKey) => {
        try {
          const exchange = BrokerService.createExchange(apiKey)
          exchange.options['warnOnFetchOpenOrdersWithoutSymbol'] = false

          if (exchange.has['fetchOpenOrders']) {
            try {
              // Tente de récupérer les ordres sans symbole
              const orders = await exchange.fetchOpenOrders()
              const trimmedOrders = CcxtService.trimOrder(orders)

              // Synchroniser les ordres avec la base
              await syncOrders(trimmedOrders, apiKey.exchangeId, userId)
            } catch (e) {
              if (e instanceof ccxt.ArgumentsRequired) {
                console.log(
                  `${exchange.id}: fetchOpenOrders requires a symbol argument. Fetching symbols...`
                )

                // Charger les marchés pour récupérer les symboles
                await exchange.loadMarkets()
                const symbols = Object.keys(exchange.markets) // Liste des symboles disponibles
                const usdPairs = symbols.filter((symbol) => symbol.includes('USDC')) // Filtrer pour "USD"

                // Itérer sur chaque symbole pour récupérer les ordres ouverts
                const ordersBySymbol = await Promise.all(
                  usdPairs.map(async (symbol) => {
                    try {
                      return await exchange.fetchOpenOrders(symbol)
                    } catch (err) {
                      console.error(
                        `${exchange.id}: Error fetching orders for symbol ${symbol}:`,
                        err.message
                      )
                      return [] // Ignorer les erreurs par symbole
                    }
                  })
                )

                // Combiner tous les ordres en une seule liste
                const allOrders = ordersBySymbol.flat()
                const trimmedOrders = CcxtService.trimOrder(allOrders)

                // Synchroniser les ordres avec la base
                await syncOrders(trimmedOrders, apiKey.exchangeId, userId)
              } else {
                console.log(`${exchange.id}: fetchOpenOrders failed with:`, e.message)
                throw e // Relancer si ce n'est pas une erreur ArgumentsRequired
              }
            }
          }
        } catch (error) {
          console.error(`Failed to fetch or sync orders for API key ${apiKey.exchangeId}:`, error)
        }
      })
    )

    // eslint-disable-next-line @typescript-eslint/no-shadow
    async function syncOrders(trimmedOrders: any, exchangeId: any, userId: any) {
      const existingOrders = await Order.query()
        .where('userId', userId)
        .andWhere('exchangeId', exchangeId)

      const existingOrdersMap = new Map(existingOrders.map((order) => [order.clientOrderId, order]))

      const trimmedOrdersMap = new Map(
        trimmedOrders.map((order: any) => [order.clientOrderId, order])
      )

      // Ajouter ou mettre à jour les ordres
      for (const trimmedOrder of trimmedOrders) {
        if (existingOrdersMap.has(trimmedOrder.clientOrderId)) {
          const existingOrder = existingOrdersMap.get(trimmedOrder.clientOrderId)
          if (!trimmedOrder.id) {
            console.error('Order IIIIIIIIIIDDDDID is missing, skipping order:', trimmedOrder)
            continue
          }
          if (existingOrder) {
            await Order.query().where('id', existingOrder.id).update({
              orderId: trimmedOrder.orderId,
              status: trimmedOrder.status,
              type: trimmedOrder.type,
              side: trimmedOrder.side,
              price: trimmedOrder.price,
              amount: trimmedOrder.amount,
              filled: trimmedOrder.filled,
              remaining: trimmedOrder.remaining,
              cost: trimmedOrder.cost,
            })
          }
        } else {
          // Ajouter un nouvel ordre
          await Order.create({
            userId,
            exchangeId,
            orderId: trimmedOrder.orderId,
            symbol: trimmedOrder.symbol,
            status: trimmedOrder.status,
            type: trimmedOrder.type,
            side: trimmedOrder.side,
            price: trimmedOrder.price,
            amount: trimmedOrder.amount,
            filled: trimmedOrder.filled,
            remaining: trimmedOrder.remaining,
            cost: trimmedOrder.cost,
          })
        }
      }

      // Supprimer les ordres qui ne sont plus dans `trimmedOrders`
      for (const existingOrder of existingOrders) {
        if (!trimmedOrdersMap.has(existingOrder.clientOrderId)) {
          await Order.query().where('id', existingOrder.id).delete()
        }
      }
    }

    // await Promise.all(
    //   apiKeys.map(async (apikey) => {
    //     try {
    //       const exchange = BrokerService.createExchange(apikey)
    //       exchange.options['warnOnFetchOpenOrdersWithoutSymbol'] = false
    //       const orders = await exchange.fetchOpenOrders()
    //       const trimmedOrders = CcxtService.trimOrder(orders)

    //       const existingOrders = await Order.query()
    //         .where('userId', userId)
    //         .andWhere('exchangeId', exchange.id)

    //       const existingOrdersMap = new Map(
    //         existingOrders.map((order) => [order.clientOrderId, order])
    //       )

    //       const trimmedOrdersMap = new Map(
    //         trimmedOrders.map((order) => [order.clientOrderId, order])
    //       )

    //       // Ajouter ou mettre à jour les ordres
    //       for (const trimmedOrder of trimmedOrders) {
    //         if (existingOrdersMap.has(trimmedOrder.clientOrderId)) {
    //           // Mettre à jour si l'ordre existe déjà
    //           const existingOrder = existingOrdersMap.get(trimmedOrder.clientOrderId)
    //           if (existingOrder) {
    //             await Order.query().where('id', existingOrder.id).update({
    //               status: trimmedOrder.status,
    //               type: trimmedOrder.type,
    //               side: trimmedOrder.side,
    //               price: trimmedOrder.price,
    //               amount: trimmedOrder.amount,
    //               filled: trimmedOrder.filled,
    //               remaining: trimmedOrder.remaining,
    //               cost: trimmedOrder.cost,
    //             })
    //           }
    //         } else {
    //           // Ajouter un nouvel ordre
    //           await Order.create({
    //             userId,
    //             exchangeId: exchange.id,
    //             clientOrderId: trimmedOrder.clientOrderId,
    //             symbol: trimmedOrder.symbol,
    //             status: trimmedOrder.status,
    //             type: trimmedOrder.type,
    //             side: trimmedOrder.side,
    //             price: trimmedOrder.price,
    //             amount: trimmedOrder.amount,
    //             filled: trimmedOrder.filled,
    //             remaining: trimmedOrder.remaining,
    //             cost: trimmedOrder.cost,
    //           })
    //         }
    //       }

    //       // Supprimer les ordres qui ne sont plus dans `trimmedOrders`
    //       for (const existingOrder of existingOrders) {
    //         if (!trimmedOrdersMap.has(existingOrder.clientOrderId)) {
    //           await Order.query().where('id', existingOrder.id).delete()
    //         }
    //       }
    //     } catch (error) {
    //       console.error(`Failed to fetch or sync orders for API key ${apikey.exchangeId}:`, error)
    //     }
    //   })
    // )
  }

  static async getOrder(user: User) {
    const orders = await db.from('orders').where('user_id', user.id)
    const groupedOrders = orders.reduce((result, order) => {
      const exchange = order.exchange_id
      if (!result[exchange]) {
        result[exchange] = []
      }
      result[exchange].push(order)
      return result
    }, {})
    return groupedOrders
  }
}
