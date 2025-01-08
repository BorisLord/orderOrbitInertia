import ApiKey, { ApiKeyPick } from '#models/api_key'

export class ApiKeyService {
  static async createApiKey(data: ApiKeyPick, userId: number) {
    return await ApiKey.create({
      ...data,
      userId,
    })
  }

  static async getApiKeysByUser(userId: number) {
    return await ApiKey.query()
      .where('user_id', userId)
      .select('exchangeId', 'apiKey', 'createdAt', 'id')
  }

  static async deleteApiKey(apiKeyId: string, userId: number) {
    const apiKey = await ApiKey.query()
      .where('id', apiKeyId)
      .andWhere('user_id', userId)
      .firstOrFail()

    await apiKey.delete()
  }
}
