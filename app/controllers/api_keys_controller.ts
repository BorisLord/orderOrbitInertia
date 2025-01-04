import { apiKeySchema } from '#validators/api_key'
import type { HttpContext } from '@adonisjs/core/http'
import ApiKey from '#models/api_key'
import ccxt from 'ccxt'

export default class ApiKeysController {
  public async store({ auth, request, response, inertia }: HttpContext) {
    try {
      // console.log('KEY CCXXT EXCHANGES', Object.values(ccxt.exchanges))
      const data = await request.validateUsing(apiKeySchema)

      const user = auth.user
      //   console.log('User lol', user)
      if (!user) {
        throw new Error('User not authenticated')
      }

      type ExchangeId = (typeof ccxt.exchanges)[number]

      const exchangeId: ExchangeId = data.exchangeId
      // const exchange = new (ccxt as any)[exchangeId]()
      // Créer une instance de l'exchange avec les credentials
      const exchangeClass = (ccxt as any)[exchangeId]
      const exchange = new exchangeClass({
        apiKey: data.apiKey,
        secret: data.secret,
        enableRateLimit: true, // Activer le limiteur de requêtes
      })

      const balance = await exchange.fetchBalance()
      console.log('Credentials are valid. Balance:', balance)

      await ApiKey.create({
        ...data,
        userId: user.id,
      })

      const apiKeys = await ApiKey.query()
        .where('user_id', user.id)
        .select('exchangeId', 'apiKey', 'createdAt', 'id')

      //   console.log('APIKEY in da booty trunk', apiKeys)

      return inertia.render('users/Dashboard', { apiKeys })
    } catch (error) {
      console.log('Error in APIKEYCONTROLLER', error)
      return response.badRequest({ message: 'Api Not Register' })
    }
  }

  public async delete({ auth, request, response, inertia }: HttpContext) {
    // console.log('IDIDIDID', request.input('id'))

    // Récupère l'utilisateur authentifié
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }

    // Récupère l'ID de la clé API depuis la requête
    const apiKeyId = request.input('id') // Assurez-vous que l'ID est envoyé dans la requête

    if (!apiKeyId) {
      return response.badRequest({ message: 'API Key ID is required' })
    }

    // Vérifie et supprime la clé API
    try {
      const apiKey = await ApiKey.query()
        .where('id', apiKeyId)
        .andWhere('user_id', user.id) // Vérifie que la clé appartient bien à l'utilisateur
        .firstOrFail() // Lance une exception si non trouvé

      await apiKey.delete()

      const apiKeys = await ApiKey.query()
        .where('user_id', user.id)
        .select('exchangeId', 'apiKey', 'createdAt', 'id')

      return inertia.render('users/Dashboard', { apiKeys })
    } catch (error) {
      console.error('Error deleting API Key:', error)
      return response.notFound({ message: 'API Key not found or does not belong to the user' })
    }
  }
}
