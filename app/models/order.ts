import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare orderId: string | undefined

  @column()
  declare symbol: string

  @column()
  declare clientOrderId?: string

  @column()
  declare exchangeId: string

  @column()
  declare status: string | undefined

  @column()
  declare type?: string | undefined

  @column()
  declare side: string | undefined

  @column()
  declare price: number

  @column()
  declare amount: number

  @column()
  declare filled: number

  @column()
  declare remaining: number

  @column()
  declare cost: number

  @column()
  declare userId: number

  @belongsTo(() => User)
  public user!: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
