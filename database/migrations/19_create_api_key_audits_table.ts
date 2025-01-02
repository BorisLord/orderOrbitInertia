import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'api_key_audits'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('user_id') // Clé étrangère vers l'utilisateur
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table
        .integer('api_key_id') // Clé étrangère vers la clé API
        .unsigned()
        .nullable() // Peut être `null` si la clé est supprimée
        .references('id')
        .inTable('api_keys')
        .onDelete('SET NULL') // Garde l'historique même si la clé est supprimée

      table.enum('action', ['create', 'delete']).notNullable() // Action effectuée
      table.timestamp('action_at', { useTz: true }).defaultTo(this.now()) // Date de l'action

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
