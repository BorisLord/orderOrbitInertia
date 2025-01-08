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

  // Hook pour hasher secret et password avant de sauvegarder
  @beforeSave()
  static async hashSensitiveData(apiKey: ApiKey) {
    // Encrypt `secret` si modifié
    if (apiKey.$dirty.secret) {
      apiKey.secret = encryption.encrypt(apiKey.secret)
    }

    // Encrypt `password` si modifié
    if (apiKey.password) {
      if (apiKey.$dirty.password) {
        apiKey.password = encryption.encrypt(apiKey.password)
      }
    }
  }

  // Hook pour enregistrer les suppressions
  @beforeDelete()
  static async logDeletion(apiKey: ApiKey) {
    await ApiKeyAudit.create({
      userId: apiKey.userId,
      apiKeyId: apiKey.id,
      action: 'delete',
    })
  }

  // Hook pour enregistrer les créations
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
