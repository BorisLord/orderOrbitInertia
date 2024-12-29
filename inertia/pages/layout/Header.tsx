import { Link } from '@inertiajs/react'
import React from 'react'

const Header: React.FC = () => {
  // const { user, logout } = useUser();
  // const navigate = useNavigate();

  // const handleLogout = () => {
  //   logout();
  //   navigate('/login');
  // };

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <img src="/orderOrbitLogo.png" alt="OrderOrbit Logo" className="h-8 w-8 mr-2" />
          </Link>
          <h1 className="text-xl font-bold">
            <Link href="/">OrderOrbit</Link>
          </h1>
        </div>
        <nav>
          <Link href="/register" className="mr-4">
            Register
          </Link>
          {/* {user ? (
            <>
              <Link to='/profile' className='mr-4'>
                <span>{user.username}</span>
              </Link>
              <button onClick={handleLogout} className='mr-4'>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to='/login' className='mr-4'>
                Login
              </Link>
              <Link to='/register' className='mr-4'>
                Register
              </Link>
            </>
          )} */}
        </nav>
      </div>
    </header>
  )
}

export default Header
