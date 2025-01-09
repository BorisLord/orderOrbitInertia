import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'balances'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id') // Clé primaire
      table.string('exchange_id').notNullable() // Colonne exchangeId
      table.string('asset').notNullable() // Colonne asset
      table.float('free').notNullable() // Colonne free
      table.float('used').notNullable() // Colonne used
      table.float('total').notNullable() // Colonne total

      table
        .integer('user_id') // Clé étrangère vers users
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE') // Supprime les balances si l'utilisateur est suppri

      table.timestamp('created_at')
      table.timestamp('updated_at')

      // Ajoute une contrainte unique pour éviter les doublons
      table.unique(['user_id', 'exchange_id', 'asset'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
