import Layout from '../layout'
import { Head, router, usePage } from '@inertiajs/react'
import { useUser } from '../../context/UserContext'
import { DateTime } from 'luxon'
import { useState } from 'react'
import type { ApiKeyPick } from '#models/api_key'

function formatDate(date: string | Date | DateTime<boolean> | null | undefined): string {
  if (!date) return 'Date non disponible'
  if (date instanceof DateTime) {
    return date.isValid ? date.setLocale('fr').toFormat('d MMMM yyyy') : 'Date invalide'
  }
  const parsedDate = typeof date === 'string' ? DateTime.fromISO(date) : DateTime.fromJSDate(date)
  return parsedDate.isValid ? parsedDate.setLocale('fr').toFormat('d MMMM yyyy') : 'Date invalide'
}

const initApiKey = { apiKey: '', secret: '', exchangeId: '' }

type ApiKeyPickWithId = ApiKeyPick & { id: number; createdAt: DateTime }

const DashboardPage = () => {
  const { apiKeys, exchangesList } = usePage().props as unknown as {
    apiKeys: ApiKeyPickWithId[]
    exchangesList: string[]
  }

  const { user } = useUser()
  // console.log('APIKEYINFRONT', apiKeys)

  // console.log('EXCHGES', exchangesList)

  // État pour gérer l'affichage du champ d'entrée
  const [isAddingKey, setIsAddingKey] = useState(false)
  const [newApiKey, setNewApiKey] = useState<ApiKeyPick>(initApiKey)
  const [message, setMessage] = useState('')

  // console.log(newApiKey)

  // Fonction pour gérer les changements des champs d'entrée
  const handleInputChange =
    (field: keyof ApiKeyPick) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setNewApiKey((prev) => ({
        ...prev,
        [field]: e.target.value,
      }))
    }

  const handleDelete = (id: number) => {
    console.log('ON DELETE TO SETUP BRUH', id)
    if (confirm('Are you sure you want to delete this key?')) {
      router.post('/deleteApiKey', { id })
    }
  }

  // Gérer la soumission de la clé API
  const handleAddApiKey = async () => {
    if (!newApiKey) {
      setMessage('La clé API ne peut pas être vide.')
      return
    }
    try {
      router.post('/addApiKey', newApiKey)
      // console.log('APIKEYSENDED TO ZE MOON', newApiKey)
      setMessage('Clé API ajoutée avec succès.')
      setNewApiKey(initApiKey)
      setIsAddingKey(false) // Masquer le champ
    } catch (error) {
      console.error('Erreur lors de l’ajout de la clé API:', error)
      setMessage('Erreur lors de l’ajout de la clé API.')
    }
  }

  return (
    <>
      <Head title="Dashboard" />
      <Layout>
        <div className="p-6">
          <h1 className="text-2xl font-bold">Welcome, {user?.username}!</h1>
          <p className="text-lg">
            Member since: <span className="font-medium">{formatDate(user?.createdAt)}</span>
          </p>
          <p className="text-lg">
            Your email: <span className="font-medium">{user?.email}</span>
          </p>

          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => router.get('/accounts')}
          >
            Check Accounts
          </button>
          <button
            className="ml-4 mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => router.get('/orders')}
          >
            Check Orders
          </button>

          <h2 className="text-xl font-bold mt-6">Your API Keys</h2>
          <table className="border-collapse border border-gray-300 w-full mt-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Exchange</th>
                <th className="border border-gray-300 px-4 py-2">Public API Key</th>
                <th className="border border-gray-300 px-4 py-2">Add date</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map((key) => (
                <tr key={key.exchangeId} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{key.exchangeId}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {key.apiKey.slice(0, 6)} **** {key.apiKey.slice(-6)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{formatDate(key.createdAt)}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      onClick={() => handleDelete(key.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete Key
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Gestion des clés API */}
          <div className="mt-6">
            <h2 className="text-xl font-bold">Manage API Keys</h2>

            {isAddingKey ? (
              <form
                className="flex flex-col items-start mt-4 space-y-4 w-full max-w-md"
                onSubmit={(e) => {
                  e.preventDefault()
                  handleAddApiKey()
                }}
              >
                <select
                  required
                  id="exchange"
                  value={newApiKey.exchangeId}
                  onChange={handleInputChange('exchangeId')}
                  className="border border-gray-300 rounded px-4 py-2 w-full"
                >
                  <option value="" disabled>
                    Select an Exchange
                  </option>
                  {exchangesList.map((exchange) => (
                    <option key={exchange} value={exchange}>
                      {exchange}
                    </option>
                  ))}
                </select>
                <input
                  required
                  type="text"
                  value={newApiKey.apiKey}
                  onChange={handleInputChange('apiKey')}
                  placeholder="Public API key"
                  className="border border-gray-300 rounded px-4 py-2 w-full"
                />
                <input
                  required
                  type="text"
                  value={newApiKey.secret}
                  onChange={handleInputChange('secret')}
                  placeholder="Private API key"
                  className="border border-gray-300 rounded px-4 py-2 w-full"
                />
                <input
                  type="text"
                  value={newApiKey.uid || ''}
                  onChange={handleInputChange('uid')}
                  placeholder="User ID (optional)"
                  className="border border-gray-300 rounded px-4 py-2 w-full"
                />
                <input
                  type="text"
                  value={newApiKey.password || ''}
                  onChange={handleInputChange('password')}
                  placeholder="Password (optional)"
                  className="border border-gray-300 rounded px-4 py-2 w-full"
                />
                <div className="flex justify-center w-full mt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ml-10"
                    onClick={() => {
                      setIsAddingKey(false)
                      setNewApiKey(initApiKey) // Réinitialise les champs
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => setIsAddingKey(true)}
              >
                Add API Key
              </button>
            )}

            {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
          </div>
        </div>
      </Layout>
    </>
  )
}

export default DashboardPage
