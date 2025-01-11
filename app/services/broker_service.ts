import { ApiKeyPick } from '#models/api_key'
import User from '#models/user'
import db from '@adonisjs/lucid/services/db'
import ccxt, { Exchange, exchanges, pro } from 'ccxt'

export class BrokerService {
  static validateExchangeId(exchangeId: string): boolean {
    const isStandardExchange = exchangeId in exchanges
    const isProExchange = exchangeId in pro

    if (!isStandardExchange && !isProExchange) {
      throw new Error(`L'exchange '${exchangeId}' n'est pas supporté.`)
    }
    return true
  }

  static async verifyConnection(data: ApiKeyPick): Promise<Exchange> {
    // TODO Verifier si la clef n'est pas deja en bdd
    try {
      this.validateExchangeId(data.exchangeId)

      const exchangeClass = (ccxt as any)[data.exchangeId]

      if (!exchangeClass) {
        throw new Error(`Impossible d'initialiser l'exchange '${data.exchangeId}'.`)
      }

      const exchange: Exchange = new exchangeClass({
        apiKey: data.apiKey,
        secret: data.secret,
        enableRateLimit: true,
      })

      await exchange.fetchBalance()

      return exchange
    } catch (error) {
      console.error(`Erreur de connexion au broker '${data.exchangeId}':`, error.message)
      throw new Error(`Connexion au broker '${data.exchangeId}' impossible. Vérifiez vos clés API.`)
    }
  }

  static createExchange(apiKeys: ApiKeyPick): Exchange {
    const exchangeClass = (ccxt as any)[apiKeys.exchangeId]
    if (!exchangeClass) {
      throw new Error(`L'exchange ${apiKeys.exchangeId} n'est pas supporté`)
    }

    const exchange: Exchange = new exchangeClass({
      apiKey: apiKeys.apiKey,
      secret: apiKeys.secret,
      enableRateLimit: true,
    })

    return exchange
  }

  static async getRegisterBroker(user: User) {
    const res = await db.from('api_keys').where('user_id', user.id).select('exchange_id')
    return res.map((row) => row.exchange_id)
  }
}
