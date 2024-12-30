/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const UsersController = () => import('#controllers/users_controllers')

// Page d'accueil
router.get('/', async ({ inertia }) => {
  return inertia.render('Home')
})
//   .as('home')

// Page d'inscription
router.get('users/register', async ({ inertia }) => {
  return inertia.render('users/Register')
})
//   .as('register')

router.get('users/login', async ({ inertia }) => {
  return inertia.render('users/Login')
})

router
  .get('users/dashboard', async ({ inertia }) => {
    return inertia.render('users/Dashboard')
  })
  .use(middleware.auth())

// ! Protect This Route to admin only
router.get('users/index', [UsersController, 'index'])

// Création d'un utilisateur
router.post('/create_users', [UsersController, 'store']).as('users.store')

// Login d'un utilisateur
router.post('/login_user', [UsersController, 'login'])
// .as('user_login')
