import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import axios from 'axios'
import { Package, Tag, CheckCircle2, ArrowRight } from 'lucide-react'

const AddProduct = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', stock: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState('')
  const [error, setError]       = useState('')

  const categories = ['seeds', 'fertilizer', 'tools', 'equipment']
  const BASE = import.meta.env.VITE_BASE_URL

  const validate = () => {
    const errs = {}
    if (!form.name.trim())                  errs.name     = 'Enter product name'
    if (!form.price || form.price < 1)      errs.price    = 'Minimum price is ₹1'
    if (!form.category)                     errs.category = 'Select product category'
    if (form.stock === '' || form.stock < 0) errs.stock   = 'Enter valid stock quantity'
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true); setError(''); setSuccess('')
    try {
      await axios.post(`${BASE}/product`, form, { withCredentials: true })
      setSuccess('Product added successfully!')
      setTimeout(() => navigate('/owner/dashboard'), 1800)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a150a] py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-[#0a150a]" />
          </div>
          <p className="text-yellow-600 text-xs font-bold uppercase tracking-widest mb-1">Driver Panel</p>
          <h1 className="text-3xl font-black text-white">Add Marketplace Product</h1>
        </div>

        <div className="bg-[#111f11] border border-[#1f3a1f] rounded-2xl p-7">
          <h3 className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="w-6 h-0.5 bg-yellow-600 inline-block" />
            Product Details
          </h3>

          {success && (
            <div className="flex items-center gap-3 bg-[#162716] border border-green-800 text-green-400 text-sm px-4 py-3 rounded-xl mb-5">
              <CheckCircle2 className="w-4 h-4 text-yellow-500 shrink-0" />{success}
            </div>
          )}
          {error && (
            <div className="bg-red-950 border border-red-900 text-red-400 text-sm px-4 py-3 rounded-xl mb-5">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[#a3c4a3] text-xs font-bold uppercase tracking-widest mb-2 block">Product Name</label>
              <div className={`flex items-center gap-3 bg-[#0a150a] border-2 rounded-xl px-4 py-3.5 transition-colors ${
                fieldErrors.name ? 'border-red-800' : 'border-[#2d4a2d] focus-within:border-yellow-600'
              }`}>
                <Package className="w-4 h-4 text-[#6b8f6b] shrink-0" />
                <input type="text" placeholder="e.g. Hybrid Seeds"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-transparent outline-none text-green-100 placeholder-[#3a5a3a] text-sm" />
              </div>
              {fieldErrors.name && <p className="text-red-500 text-xs mt-1.5">{fieldErrors.name}</p>}
            </div>

            <div>
              <label className="text-[#a3c4a3] text-xs font-bold uppercase tracking-widest mb-3 block">Category</label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map(cat => (
                  <label key={cat} className="cursor-pointer">
                    <input type="radio" name="category" value={cat}
                      checked={form.category === cat}
                      onChange={e => setForm({ ...form, category: e.target.value })}
                      className="sr-only" />
                    <div className={`px-4 py-3 rounded-xl border-2 text-sm font-semibold text-center transition-all capitalize ${
                      form.category === cat
                        ? 'border-yellow-600 bg-[#1a1200] text-yellow-400'
                        : 'border-[#2d4a2d] text-green-500 hover:border-yellow-800'
                    }`}>{cat}</div>
                  </label>
                ))}
              </div>
              {fieldErrors.category && <p className="text-red-500 text-xs mt-1.5">{fieldErrors.category}</p>}
            </div>

            <div>
              <label className="text-[#a3c4a3] text-xs font-bold uppercase tracking-widest mb-2 block">Price (₹)</label>
              <div className={`flex items-center gap-3 bg-[#0a150a] border-2 rounded-xl px-4 py-3.5 transition-colors ${
                fieldErrors.price ? 'border-red-800' : 'border-[#2d4a2d] focus-within:border-yellow-600'
              }`}>
                <span className="text-yellow-500 font-bold text-sm shrink-0">₹</span>
                <input type="number" placeholder="Price" min="1"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                  className="w-full bg-transparent outline-none text-green-100 placeholder-[#3a5a3a] text-sm" />
              </div>
              {fieldErrors.price && <p className="text-red-500 text-xs mt-1.5">{fieldErrors.price}</p>}
            </div>

            <div>
              <label className="text-[#a3c4a3] text-xs font-bold uppercase tracking-widest mb-2 block">Stock Quantity</label>
              <div className={`flex items-center gap-3 bg-[#0a150a] border-2 rounded-xl px-4 py-3.5 transition-colors ${
                fieldErrors.stock ? 'border-red-800' : 'border-[#2d4a2d] focus-within:border-yellow-600'
              }`}>
                <Tag className="w-4 h-4 text-[#6b8f6b] shrink-0" />
                <input type="number" placeholder="Available units" min="0"
                  value={form.stock}
                  onChange={e => setForm({ ...form, stock: e.target.value })}
                  className="w-full bg-transparent outline-none text-green-100 placeholder-[#3a5a3a] text-sm" />
              </div>
              {fieldErrors.stock && <p className="text-red-500 text-xs mt-1.5">{fieldErrors.stock}</p>}
            </div>

            <div>
              <label className="text-[#a3c4a3] text-xs font-bold uppercase tracking-widest mb-2 block">Description (Optional)</label>
              <div className={`flex bg-[#0a150a] border-2 rounded-xl px-4 py-3.5 transition-colors border-[#2d4a2d] focus-within:border-yellow-600`}>
                <textarea placeholder="Tell us more about the product"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-transparent outline-none text-green-100 placeholder-[#3a5a3a] text-sm resize-none h-24" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-4 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 text-[#0a150a] font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              {loading
                ? <span className="w-5 h-5 border-2 border-[#0a150a] border-t-transparent rounded-full animate-spin" />
                : <><span>Add Product</span><ArrowRight className="w-4 h-4" /></>
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddProduct
