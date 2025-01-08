import { ApiKeyPick } from '#models/api_key'
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
}
