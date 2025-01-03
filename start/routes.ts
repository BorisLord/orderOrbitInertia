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
const ApiKeysController = () => import('#controllers/api_keys_controller')
// const ExchangesController = () => import('#controllers/exchanges_controller')

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
  .get('users/dashboard', [UsersController, 'getUserData'])
  .use(middleware.auth())
  .as('users.dashboard')

router.post('/logout', [UsersController, 'logout']).use(middleware.auth())

// ! Protect This Route to admin only
router.get('users/index', [UsersController, 'index'])

// Création d'un utilisateur
router.post('/create_users', [UsersController, 'store']).as('users.store')

// Login d'un utilisateur
router.post('/login_user', [UsersController, 'login'])
// .as('user_login')

// router.get('/exchanges', [ExchangesController, 'listExchanges']).as('exchanges')

router.post('/addApiKey', [ApiKeysController, 'store']).use(middleware.auth())
router.post('/deleteApiKey', [ApiKeysController, 'delete']).use(middleware.auth())
