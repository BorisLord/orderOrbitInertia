import vine from '@vinejs/vine'
import ccxt from 'ccxt'

export const apiKeySchema = vine.compile(
  vine.object({
    exchangeId: vine.enum(Object.values(ccxt.exchanges)),
    apiKey: vine.string().minLength(6).maxLength(255),
    secret: vine.string().minLength(6).maxLength(255),
    uid: vine.string().minLength(4).maxLength(255).optional(),
    password: vine.string().minLength(4).maxLength(255).optional(),
  })
)
