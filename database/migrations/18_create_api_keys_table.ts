import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'api_keys'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('exchange_id').notNullable() // Identifiant de la plateforme (CCXT)
      table.string('api_key', 255).notNullable()
      table.string('secret', 255).notNullable()
      table.string('uid', 255).nullable()
      table.string('password', 255).nullable()

      table
        .integer('user_id') // Clé étrangère vers la table `users`
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE') // Supprime les clés API si l'utilisateur est supprimé

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
