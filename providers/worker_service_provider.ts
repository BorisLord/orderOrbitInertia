import { WorkerService } from '#services/worker_service'
import type { ApplicationService } from '@adonisjs/core/types'

export default class WorkerServiceProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {}

  /**
   * The container bindings have booted
   */
  async boot() {}

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {
    if (process.env.RUNNING_MIGRATIONS === 'true') {
      console.log('Migrations in progress. Workers will not be started.')
      return
    }

    console.log('Starting WorkerService...')
    await WorkerService.start()
  }

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {
    WorkerService.shutdown()
  }
}
