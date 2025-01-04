/* eslint-disable @typescript-eslint/no-shadow */
import User from '#models/user'
import { registerSchema } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import ccxt from 'ccxt'
import ApiKey from '#models/api_key'

export default class UsersController {
  // All Users listing, setup to only admin
  public async index({ inertia }: HttpContext) {
    const users = await User.all()

    return inertia.render('users/index', { users })
  }

  public async store({ request, response, session }: HttpContext) {
    try {
      const data = await request.validateUsing(registerSchema)
      await User.create({
        email: data.email,
        username: data.username,
        password: data.password,
      })

      session.flash({ success: 'Registration successful!' })
      return response.redirect('/')
    } catch (error) {
      session.flash({ errors: error.messages })
      return response.redirect('back')
      // const formattedErrors = error.messages.map((err: Error) => err.message)
      // session.flash({ errors: formattedErrors })
      // return response.redirect('back')
    }
  }

  public async login({ request, auth, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    try {
      // Vérifie les credentials et récupère l'utilisateur
      const user = await User.verifyCredentials(email, password)

      // Crée une session
      await auth.use('web').login(user)

      // Redirige vers une page protégée
      // ! Change redirection or not ?
      response.redirect('users/dashboard')

      // Need return a json for apiTesting
      // return response.json({
      // message: 'Login successful',
      // user,
      // })
    } catch (error) {
      console.log(error)
      return response.badRequest({ message: 'Invalid credentials' })
    }
  }

  public async getUserData({ auth, inertia }: HttpContext) {
    // Récupérer l'utilisateur connecté
    const user = auth.user

    if (!user) {
      throw new Error('User not authenticated')
    }
    // console.log('user pas lol', user)

    const exchangesList = ccxt.exchanges
    // console.log('UserShitStory', user.id)
    const apiKeys = await ApiKey.query()
      .where('user_id', user.id)
      .select('exchangeId', 'apiKey', 'createdAt', 'id')

    // Rendre la vue avec les données utilisateur
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
