import vine from '@vinejs/vine'

export const registerSchema = vine.compile(
  vine.object({
    email: vine.string().email().unique({ table: 'users', column: 'email' }),
    username: vine.string().trim().minLength(3).maxLength(255),
    password: vine.string().minLength(8).maxLength(255).confirmed(),
  })
)
