import redis from '@adonisjs/redis/services/main'
import { BalanceService } from './balance_service.js'
import { OrderService } from './order_service.js'
import { UserService } from './user_service.js'
import User from '#models/user'

export class WorkerService {
  static activeWorkers: Map<string, NodeJS.Timeout> = new Map()

  static async start() {
    setInterval(async () => {
      const keys = await redis.keys('user:*')
      console.log('redisKeys', keys)
      for (const key of keys) {
        const userId = key.split(':')[1]
        if (!this.activeWorkers.has(userId)) {
          this.startWorker(userId)
        }
      }
    }, 30000)
  }

  static startWorker(userId: string) {
    console.log(`SSSSStarting worker for user: ${userId}`)

    const intervalId = setInterval(async () => {
      const user = await UserService.findUserById(Number(userId))
      if (user === null || undefined) {
        console.log('user is null ou undefined')
      } else {
        BalanceService.fetchBalanceFromBroker(user as unknown as User)
        OrderService.fetchOrderFromBroker(user as unknown as User)
      }
    }, 30000)

    this.activeWorkers.set(userId, intervalId)

    this.monitorUserActivity(userId, intervalId)
  }

  static async monitorUserActivity(userId: string, intervalId: NodeJS.Timeout) {
    const key = `user:${userId}`
    const checkInterval = setInterval(async () => {
      const exists = await redis.exists(key)
      if (!exists) {
        clearInterval(intervalId)
        this.activeWorkers.delete(userId)
        clearInterval(checkInterval)
        console.log(`Stopped workerrrrrr for user: ${userId}`)
      }
    }, 30000)
  }

  static shutdown() {
    console.log('Shuttinggggggg down all workers...')
    this.activeWorkers.forEach((intervalId, userId) => {
      clearInterval(intervalId)
      console.log(`Stoppeddddddd worker for user: ${userId}`)
    })
    this.activeWorkers.clear()
  }
}

export default new WorkerService()
