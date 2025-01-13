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

  static createExchange(apiKey: ApiKeyPick): Exchange {
    const exchangeClass = (ccxt as any)[apiKey.exchangeId]
    if (!exchangeClass) {
      throw new Error(`L'exchange ${apiKey.exchangeId} n'est pas supporté`)
    }

    const exchange: Exchange = new exchangeClass({
      apiKey: apiKey.apiKey,
      secret: apiKey.secret,
      enableRateLimit: true,
    })

    return exchange
  }

  static async getRegisterBroker(user: User) {
    const res = await db.from('api_keys').where('user_id', user.id).select('exchange_id')
    return res.map((row) => row.exchange_id)
  }

  static async getPairsBySymbol(exchange: Exchange, symbol: string) {
    await exchange.loadMarkets()
    const symbols = Object.keys(exchange.markets)
    return symbols.filter((s) => s.includes(symbol))
  }

  static async getSymbolsPerExchange(apiKeys: ApiKeyPick[], quoteCurrency: string) {
    try {
      const promises = apiKeys.map(async (apiKeyInfo) => {
        const exchange = this.createExchange(apiKeyInfo)

        // Charger les marchés et filtrer ceux qui sont Spot avec la quoteCurrency
        await exchange.loadMarkets()
        const spotMarkets = Object.values(exchange.markets).filter(
          (market) => market.type === 'spot' && market.quote === quoteCurrency
        )

        // Récupérer les tickers uniquement pour les symboles Spot
        const symbols = spotMarkets.map((market) => market.symbol)
        const tickers = await exchange.fetchTickers(symbols)

        // Formater les tickers pour cet échange
        const formattedTickers = Object.values(tickers).reduce(
          (acc: { [key: string]: any }, ticker) => {
            acc[ticker.symbol] = {
              base: ticker.symbol.split('/')[0],
              quote: ticker.symbol.split('/')[1],
              lastPrice: ticker.last,
              volume: ticker.baseVolume,
              high: ticker.high,
              low: ticker.low,
            }
            return acc
          },
          {}
        )

        // Retourner l'objet structuré pour cet échange
        return { [exchange.describe().name]: formattedTickers }
      })

      // Résoudre toutes les promesses
      const results = await Promise.all(promises)

      // Fusionner les résultats par échange dans un seul objet
      return results.reduce((acc, curr) => ({ ...acc, ...curr }), {})
    } catch (error) {
      console.error('Error fetching spot symbols per exchange:', error)
      throw error
    }
  }
}
