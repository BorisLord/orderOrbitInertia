import { Head, router } from '@inertiajs/react'
import Layout from '../layout'
import { useState } from 'react'

export default function Register() {
  const [form, setForm] = useState({
    email: '',
    username: '',
    password: '',
    password_confirmation: '',
  })

  const [error, setError] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (
      !form.email ||
      !form.username ||
      form.password.length < 12 ||
      form.password !== form.password_confirmation
    ) {
      setError(true)
      setTimeout(() => setError(false), 1200)
      return
    }

    router.post('/create_users', form)
  }

  return (
    <Layout>
      <Head title="Register" />

      <div className="max-w-md mx-auto mt-8 p-4 bg-white shadow-md rounded-md">
        <h1 className="text-xl font-bold mb-4 text-center">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="gnomy@email.com"
              value={form.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              placeholder="Gnomy"
              autoComplete="username"
              value={form.username}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

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

          <div>
            <label
              htmlFor="password_confirmation"
              className="block text-sm font-medium text-gray-700"
            >
              Confirmed Password
            </label>
            <input
              id="password_confirmation"
              type="password"
              name="password_confirmation"
              placeholder="Same 12 characters"
              autoComplete="current-password_confirmation"
              value={form.password_confirmation}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <button
            type="submit"
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              error
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
            }`}
          >
            Register
          </button>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a href="login" className="text-indigo-600 hover:text-indigo-500">
              Login
            </a>
          </p>
        </form>
      </div>
    </Layout>
  )
}
