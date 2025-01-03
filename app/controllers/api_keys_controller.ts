import { apiKeySchema } from '#validators/api_key'
import type { HttpContext } from '@adonisjs/core/http'
import ApiKey from '#models/api_key'

export default class ApiKeysController {
  public async store({ auth, request, response, inertia }: HttpContext) {
    try {
      const data = await request.validateUsing(apiKeySchema)

      const user = auth.user
      //   console.log('User lol', user)
      if (!user) {
        throw new Error('User not authenticated')
      }

      await ApiKey.create({
        ...data,
        userId: user.id,
      })

      const apiKeys = await ApiKey.query()
        .where('user_id', user.id)
        .select('exchangeId', 'apiKey', 'createdAt')

    //   console.log('APIKEY in da booty trunk', apiKeys)

      return inertia.render('users/Dashboard', { apiKeys })
    } catch (error) {
      console.log('Error in APIKEYCONTROLLER', error)
      return response.badRequest({ message: 'Api Not Register' })
    }
  }

  public async delete({ auth, request, response, inertia }: HttpContext) {
    console.log('INDELETE BREUH')
    console.log('IDIDIDID', request.input('id'))

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
        .select('exchangeId', 'apiKey', 'createdAt')

      return inertia.render('users/Dashboard', { apiKeys })
    } catch (error) {
      console.error('Error deleting API Key:', error)
      return response.notFound({ message: 'API Key not found or does not belong to the user' })
    }
  }
}
