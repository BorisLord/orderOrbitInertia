import { Head, router, usePage } from '@inertiajs/react'
import Layout from '../layout'
import { useState, useEffect } from 'react'

import { PageProps as InertiaPageProps } from '@inertiajs/core'

interface PageProps extends InertiaPageProps {
  symbolsPerExchange: Record<string, Record<string, any>> // Structure des symboles
}

const CreateOrders = () => {
  const { symbolsPerExchange } = usePage<PageProps>().props

  const [selectedExchange, setSelectedExchange] = useState('')
  const [symbols, setSymbols] = useState<string[]>([])
  const [selectedSymbol, setSelectedSymbol] = useState('')
  const [type, setType] = useState<'market' | 'limit'>('limit')
  const [side, setSide] = useState<'sell' | 'buy'>('buy')
  const [amount, setAmount] = useState('')
  const [lastPrice, setLastPrice] = useState<number | null>(null) // Prix en USD pour la paire sélectionnée
  const [quantity, setQuantity] = useState<number | null>(null) // Quantité reçue calculée
  const [price, setPrice] = useState<number | ''>('') // Prix spécifié par l'utilisateur pour les ordres limit

  useEffect(() => {
    if (selectedExchange) {
      // Extraire les symboles disponibles pour l'échange sélectionné
      const exchangeSymbols = symbolsPerExchange[selectedExchange]
        ? Object.keys(symbolsPerExchange[selectedExchange])
        : []
      setSymbols(exchangeSymbols)
    } else {
      setSymbols([])
    }
  }, [selectedExchange, symbolsPerExchange])

  useEffect(() => {
    if (selectedExchange && selectedSymbol) {
      // Récupérer le prix de la paire sélectionnée
      const price = symbolsPerExchange[selectedExchange]?.[selectedSymbol]?.lastPrice || null
      setLastPrice(price)
      // Si le prix est défini, le définir automatiquement pour les ordres limit
      if (price && type === 'limit') {
        setPrice(price)
      }
    } else {
      setLastPrice(null)
      setPrice('') // Réinitialiser le prix si la paire change
    }
  }, [selectedExchange, selectedSymbol, symbolsPerExchange, type])

  useEffect(() => {
    if (lastPrice && amount) {
      // Calculer la quantité reçue en fonction du montant et du prix
      const baseAmount = parseFloat(amount)
      const calculatedQuantity = side === 'buy' ? baseAmount / lastPrice : baseAmount * lastPrice
      setQuantity(calculatedQuantity)
    } else {
      setQuantity(null)
    }
  }, [amount, lastPrice, side])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const orderData = {
      exchange: selectedExchange,
      symbol: selectedSymbol,
      type,
      side,
      amount: parseFloat(amount),
      price: type === 'limit' ? Number(price) : undefined, // Inclure le prix uniquement pour les ordres limit
    }

    console.log('DATA', orderData)
    router.post('/createOrder', orderData)
  }

  return (
    <>
      <Head title="Create Orders" />
      <Layout>
        <div className="max-w-xl mx-auto p-4 bg-white shadow rounded">
          <h1 className="text-xl font-bold mb-4">Create an Order</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Exchange selection */}
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
                {Object.keys(symbolsPerExchange).map((exchange) => (
                  <option key={exchange} value={exchange}>
                    {exchange}
                  </option>
                ))}
              </select>
            </div>

            {/* Symbol selection */}
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

            {/* Afficher le prix en USD */}
            {lastPrice !== null && (
              <div className="text-gray-700">
                <strong>Last Price:</strong> {lastPrice.toFixed(2)} USD
              </div>
            )}

            {/* Type */}
            <div>
              <label htmlFor="type" className="block font-medium">
                Type
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as 'market' | 'limit')}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
              >
                <option value="market">Market</option>
                <option value="limit">Limit</option>
              </select>
            </div>

            {/* Price (only for limit orders) */}
            {type === 'limit' && (
              <div>
                <label htmlFor="price" className="block font-medium">
                  Price (USD per {selectedSymbol.split('/')[0] || 'symbol'})
                </label>
                <input
                  type="number"
                  id="price"
                  value={price || ''}
                  onChange={(e) => setPrice(parseFloat(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded p-2"
                  min="0.0001"
                  step="0.0001"
                  placeholder="Enter the price"
                  required
                  disabled={!selectedSymbol}
                />
              </div>
            )}

            {/* Order Side */}
            <div>
              <label htmlFor="side" className="block font-medium">
                Order Side
              </label>
              <select
                id="side"
                value={side}
                onChange={(e) => setSide(e.target.value as 'sell' | 'buy')}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
              >
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>
            </div>

            {/* Amount */}
            <div>
              <label htmlFor="amount" className="block font-medium">
                Amountt ({selectedSymbol || 'Select a symbol'})
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
                min="0.000001"
                step="0.000001"
                placeholder="Enter amount in USD"
                required
                disabled={!selectedSymbol}
              />
            </div>

            {/* Afficher la quantité reçue */}
            {quantity !== null && (
              <div className="text-gray-700">
                {side === 'buy' ? (
                  <>
                    You will receive approximately <strong>{quantity.toFixed(6)}</strong>{' '}
                    {selectedSymbol.split('/')[0]}.
                  </>
                ) : (
                  <>
                    You will sell {amount} {selectedSymbol.split('/')[0]} for approximately{' '}
                    <strong>{quantity.toFixed(2)}</strong> USD.
                  </>
                )}
              </div>
            )}

            {/* Submit */}
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
