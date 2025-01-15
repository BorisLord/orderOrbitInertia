import ApiKey, { ApiKeyPick } from '#models/api_key'
import Balance from '#models/balance'
import Order from '#models/order'
import encryption from '@adonisjs/core/services/encryption'

export class ApiKeyService {
  static async createApiKey(data: ApiKeyPick, userId: number) {
    return await ApiKey.create({
      ...data,
      userId,
    })
  }

  static async getApiKeysByUser(
    userId: number,
    includeSecret: boolean = false
  ): Promise<ApiKeyPick[]> {
    const query = ApiKey.query().where('user_id', userId)

    if (includeSecret) {
      query.select('id', 'exchangeId', 'apiKey', 'createdAt', 'secret')
    } else {
      query.select('id', 'exchangeId', 'apiKey', 'createdAt')
    }

    const apiKeys = await query

    if (includeSecret) {
      return this.decryptApiKey(apiKeys.map((apiKey) => apiKey.toJSON() as ApiKeyPick))
    }
    return apiKeys
  }

  static async getApiKeysByUserAndExchange(
    userId: number,
    exchangeId: string,
    includeSecret: boolean = false
  ): Promise<ApiKeyPick[]> {
    const query = ApiKey.query().where('user_id', userId).where('exchange_id', exchangeId)

    if (includeSecret) {
      query.select('id', 'exchangeId', 'apiKey', 'createdAt', 'secret')
    } else {
      query.select('id', 'exchangeId', 'apiKey', 'createdAt')
    }

    const apiKeys = await query

    if (includeSecret) {
      return this.decryptApiKey(apiKeys.map((apiKey) => apiKey.toJSON() as ApiKeyPick))
    }
    return apiKeys
  }

  public static decryptApiKey(data: ApiKeyPick[]) {
    return data.map((d) => ({
      ...d,
      secret: encryption.decrypt(d.secret) as string,
    }))
  }

  static async deleteApiKey(apiKeyId: string, userId: number) {
    const apiKey = await ApiKey.query()
      .where('id', apiKeyId)
      .andWhere('user_id', userId)
      .firstOrFail()

    const balances = await Balance.findManyBy({
      exchange_id: apiKey.exchangeId,
      user_id: userId,
    })

    const orders = await Order.findManyBy({
      exchange_id: apiKey.exchangeId,
      user_id: userId,
    })

    for (const order of orders) {
      await order.delete()
    }

    for (const balance of balances) {
      await balance.delete()
    }

    await apiKey.delete()
  }
}
