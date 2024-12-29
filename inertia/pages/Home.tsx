import { Head } from '@inertiajs/react'
import Layout from './layout'

export default function Home() {
  return (
    <Layout>
      <Head title="Homepage" />

      <div className="flex flex-col items-center justify-center h-full">
        <img src="/orderOrbitLogo.png" alt="OrderOrbit Logo" className="h-36 w-36" />
        <div className="text-center p-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Trade Once <br />
            Expand Everywhere
          </h1>
          <p className="text-lg text-gray-600">
            Simplify your trading experience by executing a single trade and spreading it across
            multiple brokers seamlessly
          </p>
        </div>
      </div>
    </Layout>
  )
}
