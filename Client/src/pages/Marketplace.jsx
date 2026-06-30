import React, { useEffect, useState } from 'react'
import { Link } from 'react-router'
import axios from 'axios'
import { ShoppingCart, Search, Package, Plus, CheckCircle2 } from 'lucide-react'

const Marketplace = () => {
  const [products, setProducts]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [search, setSearch]       = useState('')
  const [category, setCategory]   = useState('all')
  const [addingId, setAddingId]   = useState('')
  const [addedId, setAddedId]     = useState('')
  const [cartCount, setCartCount] = useState(0)

  const BASE = import.meta.env.VITE_BASE_URL
  const categories = ['all', 'seeds', 'fertilizer', 'tools', 'equipment']

  const categoryColors = {
    seeds:      'bg-green-900/50 text-green-300',
    fertilizer: 'bg-yellow-900/50 text-yellow-300',
    tools:      'bg-blue-900/50 text-blue-300',
    equipment:  'bg-purple-900/50 text-purple-300',
  }

  const categoryEmojis = {
    seeds: '🌱', fertilizer: '🧪', tools: '🔧', equipment: '⚙️'
  }

  useEffect(() => {
    fetchProducts()
    fetchCartCount()
  }, [category, search])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = {}
      if (category !== 'all') params.category = category
      if (search.trim()) params.search = search
      const res = await axios.get(`${BASE}/product`, { params, withCredentials: true })
      setProducts(res.data.data)
    } catch {
      setError('Failed to load products.')
    } finally {
      setLoading(false)
    }
  }

  const fetchCartCount = async () => {
    try {
      const res = await axios.get(`${BASE}/cart`, { withCredentials: true })
      setCartCount(res.data.data?.items?.length || 0)
    } catch { }
  }

  const handleAddToCart = async (productId) => {
    setAddingId(productId)
    try {
      await axios.post(`${BASE}/cart/add`, { productId, quantity: 1 }, { withCredentials: true })
      setAddedId(productId)
      setCartCount(c => c + 1)
      setTimeout(() => setAddedId(''), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add to cart.')
      setTimeout(() => setError(''), 3000)
    } finally {
      setAddingId('')
    }
  }

  return (
    <div className="min-h-screen bg-[#0a150a] pb-16">

      <div className="bg-[#111f11] border-b border-yellow-900/40 px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <p className="text-yellow-600 text-xs font-bold uppercase tracking-widest mb-2">Farmer Store</p>
              <h1 className="text-3xl font-black text-white">Marketplace</h1>
            </div>
            <Link to="/cart"
              className="flex items-center gap-2 px-5 py-3 bg-yellow-600 hover:bg-yellow-500 text-[#0a150a] font-bold text-sm rounded-xl transition-colors relative">
              <ShoppingCart className="w-4 h-4" />
              View Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-3 flex-1 bg-[#0a150a] border-2 border-[#2d4a2d] focus-within:border-yellow-600 rounded-xl px-4 py-3 transition-colors">
              <Search className="w-4 h-4 text-[#6b8f6b] shrink-0" />
              <input type="text" placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-transparent outline-none text-green-100 placeholder-[#3a5a3a] text-sm"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold capitalize border transition-all ${
                    category === cat
                      ? 'bg-yellow-600 border-yellow-600 text-[#0a150a]'
                      : 'border-[#2d4a2d] text-green-400 hover:border-yellow-700'
                  }`}>
                  {categoryEmojis[cat] || '🛒'} {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8">
        {error && (
          <div className="bg-red-950 border border-red-900 text-red-400 text-sm px-4 py-3 rounded-xl mb-5">{error}</div>
        )}

        {loading && (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-24">
            <Package className="w-16 h-16 text-[#2d4a2d] mx-auto mb-4" />
            <p className="text-[#4b6b4b] text-lg font-semibold">No products found</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map(product => (
            <div key={product._id}
              className="bg-[#111f11] border border-[#1f3a1f] hover:border-yellow-800/60 rounded-2xl p-5 flex flex-col gap-4 transition-all duration-300 group">

              <div className="w-full h-36 bg-[#0d1a0d] rounded-xl flex items-center justify-center text-5xl border border-[#1f3a1f] overflow-hidden">
                {product.image
                  ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  : <span>{categoryEmojis[product.category] || '📦'}</span>
                }
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-white font-bold text-base leading-tight">{product.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${categoryColors[product.category]}`}>
                    {product.category}
                  </span>
                </div>
    
                {product.description && (
                  <p className="text-[#4b6b4b] text-xs leading-relaxed mt-1 line-clamp-2">{product.description}</p>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-[#1f3a1f] pt-3">
                <span className="text-yellow-400 text-xl font-black">₹{product.price}</span>
                <span className={`text-xs font-semibold ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>

              <button
                onClick={() => handleAddToCart(product._id)}
                disabled={product.stock === 0 || addingId === product._id || addedId === product._id}
                className={`w-full py-3 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 transition-all duration-200 ${
                  addedId === product._id
                    ? 'bg-green-700 text-white'
                    : product.stock === 0
                    ? 'bg-[#1f3a1f] text-[#4b6b4b] cursor-not-allowed'
                    : 'bg-yellow-600 hover:bg-yellow-500 text-[#0a150a]'
                }`}>
                {addingId === product._id
                  ? <span className="w-4 h-4 border-2 border-[#0a150a] border-t-transparent rounded-full animate-spin" />
                  : addedId === product._id
                  ? <><CheckCircle2 className="w-4 h-4" /> Added!</>
                  : <><Plus className="w-4 h-4" /> Add to Cart</>
                }
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Marketplace