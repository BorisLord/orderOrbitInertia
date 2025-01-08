import User from '#models/user'

type CreateUser = Pick<User, 'email' | 'username' | 'password'>

export class UserService {
  static async createUser(data: CreateUser) {
    try {
      await User.create({
        email: data.email,
        username: data.username,
        password: data.password,
      })
    } catch (error) {
      console.error('Erreur lors de la création de l’utilisateur :', error.message)
      throw new Error('Impossible de créer l’utilisateur.')
    }
  }
}
