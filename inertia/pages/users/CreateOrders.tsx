import { Head, usePage } from '@inertiajs/react'
import Layout from '../layout'
import { useState, useEffect } from 'react'

const CreateOrders = () => {
  const { exchangeIds } = usePage().props

  const [selectedExchange, setSelectedExchange] = useState('')
  const [symbols, setSymbols] = useState([])
  const [selectedSymbol, setSelectedSymbol] = useState('')
  const [type, setType] = useState('limit')
  const [side, setSide] = useState('buy')
  const [amount, setAmount] = useState('')

  // Simule une récupération de symboles pour un exchange donné
  useEffect(() => {
    if (selectedExchange) {
      // Simuler une API qui récupère les symboles pour l'exchange sélectionné
      const fetchSymbols = async (exchange: any) => {
        const availableSymbols: Record<string, string[]> = {
          binance: ['BTC/USDT', 'BTC/USDC', 'ETH/USDT', 'ETH/USDC'],
          phemex: ['BTC/USD', 'ETH/USD', 'XRP/USD'],
        }
        return availableSymbols[exchange] || []
      }

      fetchSymbols(selectedExchange).then((symbols) => setSymbols(symbols as any))
    } else {
      setSymbols([])
    }
  }, [selectedExchange])

  // Gestion de la soumission du formulaire
  const handleSubmit = (e: any) => {
    e.preventDefault()

    // Construire l'objet de commande
    const orderData = {
      exchange: selectedExchange,
      symbol: selectedSymbol,
      type,
      side,
      amount: parseFloat(amount),
    }

    // console.log('Order Data:', orderData)

    // Simuler une soumission via une API
    alert(`Order created: ${JSON.stringify(orderData)}`)
  }

  return (
    <>
      <Head title="Create Orders" />
      <Layout>
        <div className="max-w-xl mx-auto p-4 bg-white shadow rounded">
          <h1 className="text-xl font-bold mb-4">Create an Order</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Sélection de l'exchange */}
            <div>
              <label htmlFor="exchange" className="block font-medium">
                Select Exchange
              </label>
              <select
                id="exchange"
                value={selectedExchange}
                onChange={(e) => setSelectedExchange(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
                required
              >
                <option value="">Select an Exchange</option>
                {exchangeIds?.map((exchange: any) => (
                  <option key={exchange} value={exchange}>
                    {exchange}
                  </option>
                ))}
              </select>
            </div>

            {/* Sélection de la paire */}
            <div>
              <label htmlFor="symbol" className="block font-medium">
                Select Symbol
              </label>
              <select
                id="symbol"
                value={selectedSymbol}
                onChange={(e) => setSelectedSymbol(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
                required
                disabled={!symbols.length}
              >
                <option value="">Select a Symbol</option>
                {symbols.map((symbol) => (
                  <option key={symbol} value={symbol}>
                    {symbol}
                  </option>
                ))}
              </select>
            </div>

            {/* Sélection du type */}
            <div>
              <label htmlFor="type" className="block font-medium">
                Order Type
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
              >
                <option value="limit">Limit</option>
                <option value="market">Market</option>
              </select>
            </div>

            {/* Sélection du côté */}
            <div>
              <label htmlFor="side" className="block font-medium">
                Order Side
              </label>
              <select
                id="side"
                value={side}
                onChange={(e) => setSide(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
              >
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>
            </div>

            {/* Quantité */}
            <div>
              <label htmlFor="amount" className="block font-medium">
                Amount
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
                min="0.0001"
                step="0.0001"
                placeholder="Enter amount"
                required
              />
            </div>

            {/* Bouton de soumission */}
            <div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                Create Order
              </button>
            </div>
          </form>
        </div>
      </Layout>
    </>
  )
}

export default CreateOrders
