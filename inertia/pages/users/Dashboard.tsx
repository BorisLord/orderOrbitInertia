import Layout from '../layout'
import { Head } from '@inertiajs/react'
import { useUser } from '../../UserContext'
import { DateTime } from 'luxon'

const DashboardPage = () => {
  const { user } = useUser()

  function formatDate(date: string | Date | DateTime<boolean> | null | undefined): string {
    if (!date) return 'Date non disponible'

    // Si la date est déjà un DateTime
    if (date instanceof DateTime) {
      return date.isValid ? date.setLocale('fr').toFormat('d MMMM yyyy') : 'Date invalide'
    }

    // Si la date est une chaîne ISO ou un objet Date natif
    const parsedDate = typeof date === 'string' ? DateTime.fromISO(date) : DateTime.fromJSDate(date)

    return parsedDate.isValid ? parsedDate.setLocale('fr').toFormat('d MMMM yyyy') : 'Date invalide'
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
        </div>
      </Layout>
    </>
  )
}

export default DashboardPage
