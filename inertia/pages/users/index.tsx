import { Link, Head } from '@inertiajs/react'
import Layout from '../layout'
import type { User } from '#models/user'

interface UsersProps {
  users: User[]
}

const Users = ({ users }: UsersProps) => {
  console.log('USERS LOOSERS', users)
  return (
    <>
      <Head title="Users" />
      <Layout>
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Username</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Created At</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: User) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{user.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.username}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(user.createdAt.toString()).toLocaleString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <Link
                      href={`/users/${user.id}`}
                      className="text-indigo-600 hover:text-indigo-500"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Layout>
    </>
  )
}

export default Users
