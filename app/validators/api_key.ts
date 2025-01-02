import vine from '@vinejs/vine'

export const apiKeySchema = vine.compile(
  vine.object({
    exchangeId: vine.string(), // check with ccxt broker list
    apiKey: vine.string().minLength(6).maxLength(255),
    secret: vine.string().minLength(6).maxLength(255),
    uid: vine.string().minLength(6).maxLength(255).optional(),
    password: vine.string().minLength(6).maxLength(255).optional(),
  })
)
