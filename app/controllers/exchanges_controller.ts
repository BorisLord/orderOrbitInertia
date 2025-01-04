import type { HttpContext } from '@adonisjs/core/http'
import ApiKey from '#models/api_key'
import encryption from '@adonisjs/core/services/encryption'
import ccxt from 'ccxt'

interface Balance {
  asset: string
  free: string
  total: string
  used: string
}

type BalancesRecord = Record<string, Balance[] | { error: string }>

export default class ExchangesController {
  public async getBalances({ auth, inertia }: HttpContext) {
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

    const balances: BalancesRecord = {}

    for (const apiKey of formattedApiKeys) {
      try {
        const exchangeClass = (ccxt as any)[apiKey.exchangeId]
        const exchange = new exchangeClass({
          apiKey: apiKey.apiKey,
          secret: apiKey.secret,
          enableRateLimit: true, // Active le limiteur de requêtes
        })

        const balance = await exchange.fetchBalance()
        // console.log(balance)

        const trimmedBalances = Object.keys(balance.total)
          .map((asset) => ({
            asset,
            free: balance.free[asset] || 0,
            used: balance.used[asset] || 0,
            total: balance.total[asset] || 0,
          }))
          .filter((entry) => entry.free !== 0 || entry.used !== 0 || entry.total !== 0) // Filtrer les actifs sans solde

        balances[apiKey.exchangeId] = trimmedBalances

        // const jsonContent = JSON.stringify(balances, null, 2)
        // await fs.writeFile('./app/controllers/balance.json', jsonContent, 'utf8')
      } catch (error) {
        console.error(`Failed to fetch balance for ${apiKey.exchangeId}:`, error)
        balances[apiKey.exchangeId] = { error: error.message }
      }
    }

    return inertia.render('users/Account', { balances })
    // return response.json({
    // message: 'get Balance OK',
    // balances,
    // })
  }
}
