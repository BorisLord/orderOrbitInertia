import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('order_id').notNullable() // orderId
      table.string('symbol').notNullable() // symbol
      table.string('client_order_id').nullable() // clientOrderId
      table.string('exchange_id').notNullable() // exchangeId
      table.string('status').nullable() // status
      table.string('type').nullable() // type
      table.string('side').nullable() // side
      table.decimal('price', 18, 8).notNullable() // price
      table.decimal('amount', 18, 8).notNullable() // amount
      table.decimal('filled', 18, 8).notNullable() // filled
      table.decimal('remaining', 18, 8).notNullable() // remaining
      table.decimal('cost', 18, 8).notNullable() // cost
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE') // userId avec relation
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
