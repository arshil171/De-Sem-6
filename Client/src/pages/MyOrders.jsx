import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Package, CheckCircle2, XCircle, Clock } from 'lucide-react'

const MyOrders = () => {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  const BASE = import.meta.env.VITE_BASE_URL

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${BASE}/payment/my-orders`, { withCredentials: true })
      setOrders(res.data.data)
    } catch {
      setError('Failed to load orders.')
    } finally {
      setLoading(false)
    }
  }

  const statusConfig = {
    paid:    { label: 'Paid',    cls: 'bg-green-900/50 text-green-300 border-green-800',  icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    created: { label: 'Pending', cls: 'bg-yellow-900/50 text-yellow-300 border-yellow-800', icon: <Clock className="w-3.5 h-3.5" /> },
    failed:  { label: 'Failed',  cls: 'bg-red-950/50 text-red-400 border-red-900',       icon: <XCircle className="w-3.5 h-3.5" /> },
  }

  const categoryEmojis = {
    seeds: '🌱', fertilizer: '🧪', tools: '🔧', equipment: '⚙️'
  }

  return (
    <div className="min-h-screen bg-[#0a150a] pb-16">

      <div className="bg-[#111f11] border-b border-yellow-900/40 px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <p className="text-yellow-600 text-xs font-bold uppercase tracking-widest mb-2">Farmer Store</p>
          <h1 className="text-3xl font-black text-white">My Orders</h1>
          <p className="text-green-600 text-sm mt-1">{orders.length} total orders</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-8">

        {error && <div className="bg-red-950 border border-red-900 text-red-400 text-sm px-4 py-3 rounded-xl mb-5">{error}</div>}

        {loading && (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div className="text-center py-24">
            <Package className="w-16 h-16 text-[#2d4a2d] mx-auto mb-4" />
            <p className="text-[#4b6b4b] text-lg font-semibold">No orders yet</p>
            <p className="text-[#3a5a3a] text-sm mt-1">Your purchase history will appear here</p>
          </div>
        )}

        <div className="space-y-4">
          {orders.map(order => {
            const s = statusConfig[order.status] || statusConfig.created
            return (
              <div key={order._id} className="bg-[#111f11] border border-[#1f3a1f] rounded-2xl p-6">

                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                  <div>
                    <p className="text-[#4b6b4b] text-xs uppercase tracking-wide">Order ID</p>
                    <p className="text-white font-mono font-bold text-sm">{order._id?.slice(-10).toUpperCase()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-yellow-400 text-xl font-black">₹{order.totalAmount}</p>
                    <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${s.cls}`}>
                      {s.icon}{s.label}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2 mb-4">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-[#1f3a1f] last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{categoryEmojis[item.productId?.category] || '📦'}</span>
                        <div>
                          <p className="text-green-300 text-sm font-semibold">{item.name}</p>
                          <p className="text-[#4b6b4b] text-xs">Qty: {item.quantity} × ₹{item.price}</p>
                        </div>
                      </div>
                      <span className="text-yellow-400 font-bold text-sm">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex justify-between text-xs text-[#4b6b4b] pt-2 border-t border-[#1f3a1f]">
                  <span>Payment: <span className="text-green-400 font-mono">{order.razorpayPaymentId?.slice(-10) || '—'}</span></span>
                  <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MyOrders