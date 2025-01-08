import { Head, router, usePage } from '@inertiajs/react'
import Layout from '../layout'

const Orders = () => {
  const { openOrders } = usePage<{ openOrders: Record<string, any[]> }>().props

  console.log('LOOL:', openOrders)

  return (
    <>
      <Head title="Open Orders" />
      <Layout>
        <div className="p-4">
          <h1 className="text-xl font-bold mb-4">Open Orders</h1>
          {Object.entries(openOrders).map(([broker, brokerOrders]) => (
            <div key={broker} className="mb-8">
              <h2 className="text-lg font-semibold mb-2">{broker.toUpperCase()}</h2>
              <table className="table-auto w-full border-collapse border border-gray-300 mb-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Symbol</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Side</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Price</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Amount</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {brokerOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="border border-gray-300 px-4 py-2">{order.symbol}</td>
                      <td className="border border-gray-300 px-4 py-2">{order.type}</td>
                      <td className="border border-gray-300 px-4 py-2">{order.side}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">{order.price}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {order.amount}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        <button
                          className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-700"
                          onClick={() =>
                            router.post('/cancelOrder', {
                              id: order.id,
                              exchangeId: broker,
                              symbol: order.symbol,
                            })
                          }
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </Layout>
    </>
  )
}

export default Orders
