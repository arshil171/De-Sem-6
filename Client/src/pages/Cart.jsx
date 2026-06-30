import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import axios from 'axios'
import { ShoppingCart, Trash2, Plus, Minus, Package, ArrowRight, CheckCircle2 } from 'lucide-react'

const Cart = () => {
  const [cart, setCart]         = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState('')
  const [updatingId, setUpdatingId] = useState('')
  const [clearing, setClearing] = useState(false)

  const BASE = import.meta.env.VITE_BASE_URL
  const navigate = useNavigate()

  useEffect(() => { fetchCart() }, [])

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${BASE}/cart`, { withCredentials: true })
      setCart(res.data.data)
    } catch {
      setError('Failed to load cart.')
    } finally {
      setLoading(false)
    }
  }

  const flash = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000) }

  const handleQuantity = async (productId, newQty) => {
    if (newQty < 1) return
    setUpdatingId(productId)
    try {
      const res = await axios.put(
        `${BASE}/cart/update/${productId}`,
        { quantity: newQty },
        { withCredentials: true }
      )
      setCart(res.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update.')
      setTimeout(() => setError(''), 3000)
    } finally {
      setUpdatingId('')
    }
  }

  const handleRemove = async (productId) => {
    setUpdatingId(productId)
    try {
      const res = await axios.delete(`${BASE}/cart/remove/${productId}`, { withCredentials: true })
      setCart(res.data.data)
      flash('Item removed from cart.')
    } catch {
      setError('Failed to remove item.')
    } finally {
      setUpdatingId('')
    }
  }

  const handleClear = async () => {
    setClearing(true)
    try {
      const res = await axios.delete(`${BASE}/cart/clear`, { withCredentials: true })
      setCart(res.data.data)
      flash('Cart cleared.')
    } catch {
      setError('Failed to clear cart.')
    } finally {
      setClearing(false)
    }
  }

  const categoryEmojis = {
    seeds: '🌱', fertilizer: '🧪', tools: '🔧', equipment: '⚙️'
  }

  if (loading)
    return (
      <div className="min-h-screen bg-[#0a150a] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )

  const items = cart?.items || []
  const totalPrice = cart?.totalPrice || 0

  return (
    <div className="min-h-screen bg-[#0a150a] pb-16">

      {/* Header */}
      <div className="bg-[#111f11] border-b border-yellow-900/40 px-6 py-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-yellow-600 text-xs font-bold uppercase tracking-widest mb-2">Farmer Store</p>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <ShoppingCart className="w-8 h-8 text-yellow-500" />
              My Cart
              {items.length > 0 && (
                <span className="text-sm font-semibold text-[#4b6b4b]">({items.length} item{items.length > 1 ? 's' : ''})</span>
              )}
            </h1>
          </div>
          <Link to="/marketplace"
            className="px-5 py-3 border-2 border-yellow-700 text-yellow-400 hover:bg-yellow-700/20 font-bold text-sm rounded-xl transition-colors">
            ← Continue Shopping
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-8">
        {success && (
          <div className="flex items-center gap-3 bg-[#162716] border border-green-800 text-green-400 text-sm px-4 py-3 rounded-xl mb-5">
            <CheckCircle2 className="w-4 h-4 text-yellow-500 shrink-0" />{success}
          </div>
        )}
        {error && (
          <div className="bg-red-950 border border-red-900 text-red-400 text-sm px-4 py-3 rounded-xl mb-5">{error}</div>
        )}

        {/* Empty Cart */}
        {items.length === 0 && (
          <div className="text-center py-24">
            <ShoppingCart className="w-20 h-20 text-[#2d4a2d] mx-auto mb-4" />
            <p className="text-[#4b6b4b] text-xl font-semibold mb-2">Your cart is empty</p>
            <p className="text-[#3a5a3a] text-sm mb-8">Add products from the marketplace to get started</p>
            <Link to="/marketplace"
              className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-[#0a150a] font-bold text-sm rounded-xl transition-colors">
              Browse Marketplace <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {items.length > 0 && (
          <div className="flex flex-col lg:flex-row gap-6">

            {/* Cart Items */}
            <div className="flex-1 space-y-3">
              {/* Clear all button */}
              <div className="flex justify-end mb-2">
                <button onClick={handleClear} disabled={clearing}
                  className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50">
                  <Trash2 className="w-3.5 h-3.5" />
                  {clearing ? 'Clearing...' : 'Clear All'}
                </button>
              </div>

              {items.map(item => {
                const product = item.productId
                if (!product) return null
                return (
                  <div key={item._id} className="bg-[#111f11] border border-[#1f3a1f] rounded-2xl p-5 flex items-center gap-4">

                    {/* Product image / emoji */}
                    <div className="w-16 h-16 bg-[#0d1a0d] rounded-xl flex items-center justify-center text-2xl shrink-0 border border-[#1f3a1f] overflow-hidden">
  {product.image
    ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
    : <span>{categoryEmojis[product.category] || '📦'}</span>
  }
</div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold text-sm truncate">{product.name}</h3>
                      <p className="text-[#4b6b4b] text-xs capitalize mt-0.5">{product.category}</p>
                      <p className="text-yellow-400 font-black text-base mt-1">₹{product.price} <span className="text-[#4b6b4b] text-xs font-normal">each</span></p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleQuantity(product._id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || updatingId === product._id}
                        className="w-8 h-8 rounded-lg bg-[#1f3a1f] hover:bg-yellow-900/30 text-green-300 flex items-center justify-center transition-colors disabled:opacity-40"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-white font-black text-base w-8 text-center">
                        {updatingId === product._id
                          ? <span className="inline-block w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin" />
                          : item.quantity
                        }
                      </span>
                      <button
                        onClick={() => handleQuantity(product._id, item.quantity + 1)}
                        disabled={item.quantity >= product.stock || updatingId === product._id}
                        className="w-8 h-8 rounded-lg bg-[#1f3a1f] hover:bg-yellow-900/30 text-green-300 flex items-center justify-center transition-colors disabled:opacity-40"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right shrink-0 min-w-[60px]">
                      <p className="text-yellow-400 font-black text-base">₹{product.price * item.quantity}</p>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => handleRemove(product._id)}
                      disabled={updatingId === product._id}
                      className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-40 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:w-80 shrink-0">
              <div className="bg-[#111f11] border border-[#1f3a1f] rounded-2xl p-6 sticky top-24">
                <h3 className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-5 flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-yellow-600 inline-block" />
                  Order Summary
                </h3>

                <div className="space-y-3 mb-5">
                  {items.map(item => {
                    const product = item.productId
                    if (!product) return null
                    return (
                      <div key={item._id} className="flex justify-between text-sm">
                        <span className="text-green-400 truncate max-w-[140px]">{product.name} × {item.quantity}</span>
                        <span className="text-white font-semibold shrink-0">₹{product.price * item.quantity}</span>
                      </div>
                    )
                  })}
                </div>

                <div className="border-t border-[#1f3a1f] pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold">Total</span>
                    <span className="text-yellow-400 text-2xl font-black">₹{totalPrice}</span>
                  </div>
                  <p className="text-[#4b6b4b] text-xs mt-1">{items.length} item{items.length > 1 ? 's' : ''} in cart</p>
                </div>

                <button
                  onClick={() => {
                    flash('Order placed successfully! (Payment integration coming soon)')
                  }}
                  className="w-full py-4 bg-yellow-600 hover:bg-yellow-500 text-[#0a150a] font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </button>

                <Link to="/marketplace"
                  className="w-full mt-3 py-3 border border-[#2d4a2d] text-green-400 hover:bg-[#1a2e1a] text-sm font-semibold rounded-xl flex items-center justify-center transition-colors">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart