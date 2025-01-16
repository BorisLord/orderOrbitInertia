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
const ExchangesController = () => import('#controllers/broker_controller')
const OrdersController = () => import('#controllers/orders_controller')
const BrokerController = () => import('#controllers/broker_controller')
const RedisTestController = () => import('#controllers/redis_tests_controller')

router.get('/', async ({ inertia }) => {
  return inertia.render('Home')
})

router.get('/Terms', async ({ inertia }) => {
  return inertia.render('Terms')
})

router.get('/Privacy', async ({ inertia }) => {
  return inertia.render('Privacy')
})

router.get('/Contact', async ({ inertia }) => {
  return inertia.render('Contact')
})

router.get('users/register', async ({ inertia }) => {
  return inertia.render('users/Register')
})

router.get('users/login', async ({ inertia }) => {
  return inertia.render('users/Login')
})

router
  .get('users/dashboard', [UsersController, 'getUserData'])
  .use(middleware.auth())
  .as('users.dashboard')

router.post('/logout', [UsersController, 'logout']).use(middleware.auth())

router.post('/create_users', [UsersController, 'store']).as('users.store')

router.post('/login_user', [UsersController, 'login'])

router.post('/addApiKey', [ApiKeysController, 'store']).use(middleware.auth())
router.post('/deleteApiKey', [ApiKeysController, 'delete']).use(middleware.auth())

router.get('/accounts', [ExchangesController, 'getBalances']).use(middleware.auth())

router.get('/openorders', [OrdersController, 'getOrders']).use(middleware.auth())

router.get('/createorders', [BrokerController, 'getBrokers']).use(middleware.auth())

router.post('/createOrder', [OrdersController, 'createOrder']).use(middleware.auth())

router.post('/cancelOrder', [OrdersController, 'cancelOrder']).use(middleware.auth())

router.get('/test-redis', [RedisTestController, 'testConnection'])

router.get('/healthCheck', async () => {
  return { status: 'ok' }
})
