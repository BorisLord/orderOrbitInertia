import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare symbol: string

  @column()
  declare clientOrderId?: string

  @column()
  declare status: string

  @column()
  declare type?: string

  @column()
  declare side: string

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
