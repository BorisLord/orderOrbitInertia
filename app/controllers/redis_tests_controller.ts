// import type { HttpContext } from '@adonisjs/core/http'

import redis from '@adonisjs/redis/services/main'

export default class RedisTestsController {
  public async testConnection() {
    await redis.set('test-key', 'Hello, Redis!')

    const value = await redis.get('test-key')

    return { message: 'Connection successful', value }
  }
}
