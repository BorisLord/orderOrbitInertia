import { apiKeySchema } from '#validators/api_key'
import type { HttpContext } from '@adonisjs/core/http'
import { ApiKeyService } from '#services/api_key_service'
import { BrokerService } from '#services/broker_service'

export default class ApiKeysController {
  public async store({ auth, request, response, inertia }: HttpContext) {
    const user = auth.getUserOrFail()

    try {
      const data = await request.validateUsing(apiKeySchema)

      await BrokerService.verifyConnection(data)

      await ApiKeyService.createApiKey({ ...data }, user.id)

      const apiKeys = await ApiKeyService.getApiKeysByUser(user.id)

      return inertia.render('users/Dashboard', { apiKeys })
    } catch (error) {
      console.log('Error in APIKEYCONTROLLER', error)
      return response.badRequest({ message: 'Invalid Credential API' })
    }
  }

  public async delete({ auth, request, response, inertia }: HttpContext) {
    const user = auth.getUserOrFail()

    const apiKeyId = request.input('id')
    if (!apiKeyId) {
      return response.badRequest({ message: 'API Key ID is required' })
    }

    try {
      await ApiKeyService.deleteApiKey(apiKeyId, user.id)
      const apiKeys = await ApiKeyService.getApiKeysByUser(user.id)

      return inertia.render('users/Dashboard', { apiKeys })
    } catch (error) {
      console.error('Error deleting API Key:', error)
      return response.notFound({ message: 'API Key not found or does not belong to the user' })
    }
  }
}
