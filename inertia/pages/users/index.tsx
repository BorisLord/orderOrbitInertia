import { Link, Head } from '@inertiajs/react'

const Users = ({ users }) => {
  return (
    <>
      <Head title="Users" />

      <div>
        {users.map((user) => (
          <div key={user.id}>
            <Link href={`/users/${user.id}`}>{user.name}</Link>
            <div>{user.email}</div>
          </div>
        ))}
      </div>
    </>
  )
}

export default Users
