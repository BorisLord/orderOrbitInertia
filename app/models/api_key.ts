import { DateTime } from 'luxon'
import {
  afterCreate,
  BaseModel,
  beforeDelete,
  beforeSave,
  belongsTo,
  column,
} from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import ApiKeyAudit from './api_key_audit.js'
import encryption from '@adonisjs/core/services/encryption'

export default class ApiKey extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare exchangeId: string

  @column()
  declare apiKey: string

  @column()
  declare secret: string

  @column()
  declare uid?: string

  @column()
  declare password?: string

  @column()
  declare userId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  public user!: BelongsTo<typeof User>

  @beforeSave()
  static async hashSensitiveData(apiKey: ApiKey) {
    if (apiKey.$dirty.secret) {
      apiKey.secret = encryption.encrypt(apiKey.secret)
    }

    if (apiKey.password) {
      if (apiKey.$dirty.password) {
        apiKey.password = encryption.encrypt(apiKey.password)
      }
    }
  }

  @beforeDelete()
  static async logDeletion(apiKey: ApiKey) {
    await ApiKeyAudit.create({
      userId: apiKey.userId,
      apiKeyId: apiKey.id,
      action: 'delete',
    })
  }

  @afterCreate()
  static async logCreation(apiKey: ApiKey) {
    await ApiKeyAudit.create({
      userId: apiKey.userId,
      apiKeyId: apiKey.id,
      action: 'create',
    })
  }
}

export type ApiKeyPick = Pick<ApiKey, 'exchangeId' | 'apiKey' | 'secret' | 'uid' | 'password'>

export type { ApiKey }
