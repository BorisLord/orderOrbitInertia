import User from '#models/user'
import { registerSchema } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import ccxt from 'ccxt'
import { UserService } from '#services/user_service'
import { ApiKeyService } from '#services/api_key_service'

export default class UsersController {
  // public async index({ inertia }: HttpContext) {
  //   const users = await User.all()

  //   return inertia.render('users/index', { users })
  // }

  public async store({ request, response, session }: HttpContext) {
    try {
      const data = await request.validateUsing(registerSchema)

      await UserService.createUser(data)

      session.flash({ success: 'Registration successful!' })
      return response.redirect('/')
    } catch (error) {
      session.flash({ errors: error.messages })
      return response.redirect('back')
    }
  }

  public async login({ request, auth, response }: HttpContext) {
    try {
      const { email, password } = request.only(['email', 'password'])

      const user = await User.verifyCredentials(email, password)

      await auth.use('web').login(user)
      response.redirect('users/dashboard')
    } catch (error) {
      console.log(error)
      return response.badRequest({ message: 'Invalid credentials' })
    }
  }

  public async getUserData({ auth, inertia }: HttpContext) {
    const user = auth.getUserOrFail()

    const apiKeys = await ApiKeyService.getApiKeysByUser(user.id)

    const exchangesList = ccxt.exchanges

    return inertia.render('users/Dashboard', {
      apiKeys,
      exchangesList,
      user: {
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        isAdmin: user.isAdmin,
        uuid: user.userUuid,
      },
    })
  }

  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect('/')
  }
}
