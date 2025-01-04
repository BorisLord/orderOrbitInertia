import { Head, usePage } from '@inertiajs/react'
import Layout from '../layout'

interface Balance {
  asset: string
  free: string
  total: string
  used: string
}

type BalancesRecord = Record<string, Balance[]>

const Account = () => {
  const { balances } = usePage<{ balances: BalancesRecord }>().props

  // console.log(balances)
  // console.log(balances.binance)

  return (
    <>
      <Head title="Account" />
      <Layout>
        <div className="p-4">
          <h1 className="text-xl font-bold mb-4">Account Balances</h1>
          {Object.entries(balances).map(([broker, brokerBalances]) => (
            <div key={broker} className="mb-8">
              <h2 className="text-lg font-semibold mb-2">{broker.toUpperCase()}</h2>
              <table className="table-auto w-full border-collapse border border-gray-300 mb-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Asset</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Free</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Used</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {brokerBalances.map((balance) => (
                    <tr key={balance.asset}>
                      <td className="border border-gray-300 px-4 py-2">{balance.asset}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {balance.free}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {balance.used}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {parseFloat(balance.free) + parseFloat(balance.used)}
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

export default Account
