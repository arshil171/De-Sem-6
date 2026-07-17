import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import axios from 'axios'
import { CheckCircle2, Package, ArrowRight, ShoppingBag, Tractor } from 'lucide-react'

const OrderSuccess = () => {
  const { id } = useParams()
  const [order, setOrder]   = useState(null)
  const [loading, setLoading] = useState(true)

  const BASE = import.meta.env.VITE_BASE_URL

  useEffect(() => { fetchOrder() }, [id])

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`${BASE}/payment/my-orders/${id}`, { withCredentials: true })
      setOrder(res.data.data)
    } catch {
      // order might not load — still show success
    } finally {
      setLoading(false)
    }
  }

  const categoryEmojis = {
    seeds: '🌱', fertilizer: '🧪', tools: '🔧', equipment: '⚙️'
  }

  return (
    <div className="min-h-screen bg-[#0a150a] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">

        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-green-800/40 border-4 border-green-600 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-12 h-12 text-green-400" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Payment Successful!</h1>
          <p className="text-green-400 text-base">
            Your order has been placed and payment confirmed.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-[#111f11] border border-[#1f3a1f] rounded-2xl p-6 mb-5">
          <h3 className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-5 flex items-center gap-2">
            <span className="w-6 h-0.5 bg-yellow-600 inline-block" />
            Order Details
          </h3>

          {loading && (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && order && (
            <>
              {/* Order ID + Payment ID */}
              <div className="bg-[#0d1a0d] rounded-xl p-4 mb-5 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#4b6b4b] uppercase tracking-wide">Order ID</span>
                  <span className="text-green-300 font-mono font-semibold">{order._id?.slice(-8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#4b6b4b] uppercase tracking-wide">Payment ID</span>
                  <span className="text-green-300 font-mono font-semibold">{order.razorpayPaymentId?.slice(-12)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#4b6b4b] uppercase tracking-wide">Status</span>
                  <span className="text-green-400 font-bold uppercase">✅ {order.status}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#4b6b4b] uppercase tracking-wide">Date</span>
                  <span className="text-green-300">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2 mb-5">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-[#1f3a1f] last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{categoryEmojis[item.productId?.category] || '📦'}</span>
                      <div>
                        <p className="text-white text-sm font-semibold">{item.name}</p>
                        <p className="text-[#4b6b4b] text-xs">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="text-yellow-400 font-bold text-sm">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center pt-3 border-t border-[#1f3a1f]">
                <span className="text-white font-bold">Total Paid</span>
                <span className="text-yellow-400 text-2xl font-black">₹{order.totalAmount}</span>
              </div>
            </>
          )}

          {!loading && !order && (
            <div className="text-center py-6">
              <Package className="w-10 h-10 text-[#2d4a2d] mx-auto mb-2" />
              <p className="text-[#4b6b4b] text-sm">Payment was successful! Order details will be available shortly.</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/marketplace"
            className="flex-1 py-3.5 bg-yellow-600 hover:bg-yellow-500 text-[#0a150a] font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            Shop More
          </Link>
          <Link
            to="/tractors"
            className="flex-1 py-3.5 bg-[#111f11] border border-green-700 hover:border-green-500 text-green-300 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Tractor className="w-4 h-4" />
            Book a Tractor
          </Link>
        </div>

        <p className="text-center text-[#3a5a3a] text-xs mt-6">
          A confirmation has been sent to your email · FarmTrac Support: support@farmtrac.com
        </p>
      </div>
    </div>
  )
}

export default OrderSuccess