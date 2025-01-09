import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, beforeCreate, column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import ApiKey from './api_key.js'
import Balance from './balance.js'
import Order from './order.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userUuid: string

  @column()
  declare username: string

  @column()
  declare email: string

  @column()
  public isAdmin: boolean = false

  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => ApiKey)
  declare apiKeys: HasMany<typeof ApiKey>

  @hasMany(() => Balance)
  declare balances: HasMany<typeof Balance>

  @hasMany(() => Order)
  declare orders: HasMany<typeof Order>

  @beforeCreate()
  static async assignUuid(user: User) {
    user.userUuid = crypto.randomUUID()
  }
}

export type PickUser = Pick<User, 'email' | 'username' | 'password'>

export type { User }
