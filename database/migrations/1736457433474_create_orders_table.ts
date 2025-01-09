import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('symbol').notNullable() // Symbole de trading (ex: BTC/USDT)
      table.string('client_order_id').nullable() // Identifiant client de l'ordre
      table.string('status').notNullable() // Statut de l'ordre (open, closed, canceled)
      table.string('type').nullable() // Type de l'ordre (limit, market, etc.)
      table.string('side').notNullable() // Direction de l'ordre (buy ou sell)
      table.float('price').notNullable() // Prix défini pour l'ordre
      table.float('amount').notNullable() // Quantité totale de l'ordre
      table.float('filled').notNullable() // Quantité déjà remplie
      table.float('remaining').notNullable() // Quantité restante
      table.float('cost').notNullable() // Coût total de l'ordre exécuté
      table
        .integer('user_id') // Clé étrangère vers la table users
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE') // Supprime les ordres si l'utilisateur est supprimé
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
