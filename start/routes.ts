/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const UsersController = () => import('#controllers/users_controllers')

// Page d'accueil
router.get('/', async ({ inertia }) => {
  return inertia.render('Home')
})
//   .as('home')

// Page d'inscription
router.get('/register', async ({ inertia }) => {
  return inertia.render('Register')
})
//   .as('register')

// Création d'un utilisateur
router.post('/users', [UsersController, 'store']).as('users.store')
