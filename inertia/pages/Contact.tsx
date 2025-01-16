import { Head } from '@inertiajs/react'
import Layout from './layout'

export default function Contact() {
  return (
    <Layout>
      <Head title="Contact" />

      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-center p-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Contact</h1>
          <p className="text-lg text-gray-600">Yes, you can contact us</p>
        </div>
      </div>
    </Layout>
  )
}
