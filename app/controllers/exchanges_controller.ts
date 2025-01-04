import type { HttpContext } from '@adonisjs/core/http'
import ApiKey from '#models/api_key'
import encryption from '@adonisjs/core/services/encryption'

import ccxt from 'ccxt'

export default class ExchangesController {
  public async getBalances({ auth, inertia, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      throw new Error('User not authenticated')
    }

    const apiKeys = await ApiKey.query()
      .where('user_id', user?.id)
      .select('exchangeId', 'apiKey', 'secret')

    const formattedApiKeys = apiKeys.map((apiKey) => ({
      exchangeId: apiKey.exchangeId,
      apiKey: apiKey.apiKey,
      secret: encryption.decrypt(apiKey.secret),
    }))

    const balances: { [key: string]: any } = {}

    for (const apiKey of formattedApiKeys) {
      try {
        const exchangeClass = (ccxt as any)[apiKey.exchangeId]
        const exchange = new exchangeClass({
          apiKey: apiKey.apiKey,
          secret: apiKey.secret,
          enableRateLimit: true, // Active le limiteur de requêtes
        })

        const balance = await exchange.fetchBalance({ type: 'spot' })
        console.log('All filtered balances:', balance)
        balances[apiKey.exchangeId] = balance

        // // Supprime les balances égales à 0
        // const filteredBalance = Object.fromEntries(
        //   Object.entries(balance.total || {}).filter(([_, value]) => value !== 0)
        // )

        // console.log(`Filtered Balance for ${apiKey.exchangeId}:`, filteredBalance)
      } catch (error) {
        console.error(`Failed to fetch balance for ${apiKey.exchangeId}:`, error)
        balances[apiKey.exchangeId] = { error: error.message }
      }
    }

    console.log('All filtered balances:', balances)
    // type ExchangeId = (typeof ccxt.exchanges)[number]

    // const exchangeId: ExchangeId = apiKeys.exchangeId
    // const exchangeClass = (ccxt as any)[exchangeId]
    // const exchange = new exchangeClass({
    //   apiKey: data.apiKey,
    //   secret: data.secret,
    //   enableRateLimit: true, // Activer le limiteur de requêtes
    // })

    // const balance = await exchange.fetchBalance()
    // console.log('Credentials are valid. Balance:', balance)

    // return inertia.render('users/Account')
    return response.json({
      message: 'get Balance OK',
      balances,
    })
  }
}
