import Layout from '../layout'
import type { User } from '#models/user'
import { Head } from '@inertiajs/react'

interface UsersProps {
  user: User
}

const DashboardPage = ({ user }: UsersProps) => {
  return (
    <>
      <Head title="Dashboard" />
      <Layout>
        <div className="p-6">
          <h1 className="text-2xl font-bold">Welcome, {user.username}!</h1>
          <p className="text-lg">
            Your email: <span className="font-medium">{user.email}</span>
          </p>
        </div>
      </Layout>
    </>
  )
}

export default DashboardPage
