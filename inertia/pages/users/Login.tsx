import { useState } from 'react'
import { useUser } from '../../context/UserContext'
import { Head, Link, router } from '@inertiajs/react'
import Layout from '../layout'
import type { User } from '#models/user'

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)
  const { setUser } = useUser()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    router.post('/login_user', form, {
      onSuccess: (page) => {
        // Récupérer les données utilisateur depuis les props Inertia
        const user = page.props.user
        setUser(user as User) // Mettre à jour le contexte utilisateur
      },
      onError: (errors) => {
        console.error('Login failed:', errors)
      },
    })
  }

  return (
    <Layout>
      <Head title="Login" />
      <div className="max-w-md mx-auto mt-8 p-4 bg-white shadow-md rounded-md">
        <h1 className="text-xl font-bold mb-4 text-center">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="gnomy@email.com"
              autoComplete="current-email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="12 characters minimum"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="users/register" className="text-indigo-600 hover:text-indigo-500">
            Register
          </Link>
        </p>

        {/* Toast Message */}
        {/* {toast.message && (
        <div
          className={`mt-4 p-3 rounded-md text-white ${
            toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'
          }`}
        >
          {toast.message}
        </div>
      )} */}
      </div>
    </Layout>
  )
}

export default LoginPage
