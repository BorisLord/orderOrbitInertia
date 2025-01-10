import { Balances, Order } from 'ccxt'

export class CcxtService {
  static trimBalance(balance: Balances) {
    return Object.keys(balance.total)
      .filter((key) => key !== 'info' && key !== 'timestamp' && key !== 'datetime')
      .map((asset) => ({
        asset,
        free: balance[asset].free || 0,
        used: balance[asset].used || 0,
        total: balance[asset].total || 0,
      }))
      .filter(({ free, used, total }) => free !== 0 || used !== 0 || total !== 0)
  }

  static trimOrder(orders: Order[]) {
    return orders.map((order) => ({
      orderId: order?.id,
      symbol: order.symbol,
      clientOrderId: order.clientOrderId,
      status: order?.status,
      type: order?.type,
      side: order?.side,
      price: order.price,
      amount: order.amount,
      filled: order.filled,
      remaining: order.remaining,
      cost: order.cost,
    }))
  }
}
