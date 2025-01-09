import type { HttpContext } from '@adonisjs/core/http'
import { ApiKeyService } from '#services/api_key_service'
import { BrokerService } from '#services/broker_service'
import { CcxtService } from '#services/ccxt_service'
import { BalanceService } from '#services/balance_service'

export default class BrokerController {
  public async getBalances({ auth, inertia }: HttpContext) {
    const user = auth.getUserOrFail()

    // ! NON CONCURRENCE
    // const balances: Record<string, Balance[] | { error: string }> = {}

    // for (const apiKey of apiKeys) {
    //   try {
    //     const exchange = BrokerService.createExchange(apiKey)

    //     const balance = await exchange.fetchBalance()

    //     const trimmedBalance = BrokerService.trimBalance(balance)

    //     balances[apiKey.exchangeId] = trimmedBalance
    //   } catch (error) {
    //     console.error(`Failed to fetch balance for ${apiKey.exchangeId}:`, error)
    //     balances[apiKey.exchangeId] = { error: error.message }
    //   }
    // }

    // ! CONCURRENCE
    // const balances = await Promise.all(
    // apiKeys.map(async (apiKey) => {
    // try {
    // const exchange = BrokerService.createExchange(apiKey)

    // const balance = await exchange.fetchBalance()

    // const trimmedBalance = CcxtService.trimBalance(balance)

    // return { [apiKey.exchangeId]: trimmedBalance }
    // } catch (error) {
    // console.error(`Failed to fetch balance for ${apiKey.exchangeId}:`, error)
    // return { [apiKey.exchangeId]: { error: error.message } }
    // }
    // })
    // )

    const balances = await BalanceService.getBalance(user)
    const formattedBalances = balances.reduce(
      (acc, balance) => {
        if (!acc[balance.exchangeId]) {
          acc[balance.exchangeId] = []
        }
        acc[balance.exchangeId].push(balance)
        return acc
      },
      {} as Record<string, any[]>
    )

    return inertia.render('users/Account', { balances: formattedBalances })

    // return response.json({
    // message: 'get Balance OK',
    // balances,
    // })
  }
}
