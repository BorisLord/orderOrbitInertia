import Balance from '#models/balance'
import User from '#models/user'
import { ApiKeyService } from './api_key_service.js'
import { BrokerService } from './broker_service.js'
import { CcxtService } from './ccxt_service.js'

export class BalanceService {
  static async importBalance(user: User) {
    const userId = user.id
    const apiKeys = await ApiKeyService.getApiKeysByUser(userId, true)

    await Promise.all(
      apiKeys.map(async (apiKey) => {
        try {
          const exchange = BrokerService.createExchange(apiKey)

          const balance = await exchange.fetchBalance()

          const trimmedBalance = CcxtService.trimBalance(balance)

          // Retrieve current balances from the database
          const existingBalances = await Balance.query()
            .where('userId', userId)
            .andWhere('exchangeId', exchange.id)

          // Map current balances to a dictionary for quick lookup
          const existingBalancesMap = new Map(existingBalances.map((bal) => [`${bal.asset}`, bal]))

          // Process the fetched balances
          for (const fetched of trimmedBalance) {
            const existingBalance = existingBalancesMap.get(fetched.asset)

            if (fetched.total === 0) {
              // Remove balance if total is zero
              if (existingBalance) {
                await existingBalance.delete()
              }
            } else if (existingBalance) {
              // Update balance if it exists and values differ
              if (
                existingBalance.free !== fetched.free ||
                existingBalance.used !== fetched.used ||
                existingBalance.total !== fetched.total
              ) {
                existingBalance.free = fetched.free
                existingBalance.used = fetched.used
                existingBalance.total = fetched.total
                await existingBalance.save()
              }
            } else {
              // Insert new balance if it does not exist
              await Balance.create({
                exchangeId: exchange.id,
                asset: fetched.asset,
                free: fetched.free,
                used: fetched.used,
                total: fetched.total,
                userId,
              })
            }
          }

          // Identify and remove balances that are not present in the fetched data
          const fetchedAssets = new Set(trimmedBalance.map((bal) => bal.asset))
          for (const existing of existingBalances) {
            if (!fetchedAssets.has(existing.asset)) {
              await existing.delete()
            }
          }

          // const balancesToInsert = trimmedBalance.map((bal) => ({
          //   exchangeId: exchange.id,
          //   asset: bal.asset,
          //   free: bal.free,
          //   used: bal.used,
          //   total: bal.total,
          //   userId,
          // }))

          // await Balance.createMany(balancesToInsert)
        } catch (error) {
          console.error(`Failed to fetch or insert balance for ${apiKey.exchangeId}:`, error)
        }
      })
    )
  }
}
