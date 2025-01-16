import { Head } from '@inertiajs/react'
import Layout from './layout'

export default function Terms() {
  return (
    <Layout>
      <Head title="Terms" />

      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-center p-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Terms</h1>
          <p className="text-lg text-gray-600">We have none</p>
        </div>
      </div>
    </Layout>
  )
}
