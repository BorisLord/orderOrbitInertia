import vine from '@vinejs/vine'

export const registerSchema = vine.compile(
  vine.object({
    email: vine.string().email().unique({ table: 'users', column: 'email' }),
    username: vine.string().trim().minLength(3).maxLength(255),
    password: vine
      .string()
      .minLength(12)
      .maxLength(255)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/)
      .confirmed(),
  })
)
