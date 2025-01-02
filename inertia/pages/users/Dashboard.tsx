import Layout from '../layout'
import { Head } from '@inertiajs/react'
import { useUser } from '../../UserContext'
import { DateTime } from 'luxon'
import { useState } from 'react'

const DashboardPage = () => {
  const { user } = useUser()

  // État pour gérer l'affichage du champ d'entrée
  const [isAddingKey, setIsAddingKey] = useState(false)
  const [newApiKey, setNewApiKey] = useState('')
  const [message, setMessage] = useState('')

  function formatDate(date: string | Date | DateTime<boolean> | null | undefined): string {
    if (!date) return 'Date non disponible'
    if (date instanceof DateTime) {
      return date.isValid ? date.setLocale('fr').toFormat('d MMMM yyyy') : 'Date invalide'
    }
    const parsedDate = typeof date === 'string' ? DateTime.fromISO(date) : DateTime.fromJSDate(date)
    return parsedDate.isValid ? parsedDate.setLocale('fr').toFormat('d MMMM yyyy') : 'Date invalide'
  }

  // Gérer la soumission de la clé API
  const handleAddApiKey = async () => {
    if (!newApiKey) {
      setMessage('La clé API ne peut pas être vide.')
      return
    }

    try {
      // Envoyer la clé au backend
      // await axios.post('/users/addApiKey', { apiKey: newApiKey })

      setMessage('Clé API ajoutée avec succès.')
      setNewApiKey('') // Réinitialiser le champ
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

          {/* Gestion des clés API */}
          <div className="mt-6">
            <h2 className="text-xl font-bold">Manage API Keys</h2>

            {isAddingKey ? (
              <div className="flex items-center mt-4">
                <input
                  type="text"
                  value={newApiKey}
                  onChange={(e) => setNewApiKey(e.target.value)}
                  placeholder="Enter API key"
                  className="border border-gray-300 rounded px-4 py-2 mr-2"
                />
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={handleAddApiKey}
                >
                  Submit
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ml-2"
                  onClick={() => {
                    setIsAddingKey(false)
                    setNewApiKey('')
                  }}
                >
                  Cancel
                </button>
              </div>
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
