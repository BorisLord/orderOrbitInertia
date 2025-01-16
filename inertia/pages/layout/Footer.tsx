import { Link } from '@inertiajs/react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white p-4">
      <div className="container mx-auto text-center">
        <div className="flex justify-center space-x-4">
          <Link href="Terms" className="text-sm text-gray-400 hover:text-white">
            Terms of Use
          </Link>
          <Link href="Privacy" className="text-sm text-gray-400 hover:text-white">
            Privacy Policy
          </Link>
          <Link href="Contact" className="text-sm text-gray-400 hover:text-white">
            Contact Us
          </Link>
        </div>
        <p className="mt-4 text-sm text-gray-400">&copy; 2025 OrderOrbit. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
