import React, { useEffect, useState } from 'react'
import { Link } from 'react-router'
import axios from 'axios'
import {
  Tractor, MapPin, Plus, Pencil, Trash2,
  ToggleLeft, ToggleRight, CheckCircle2,
  X, Phone, User, Clock, Check, XCircle, Flag,
  Star, Calendar
} from 'lucide-react'

const OwnerDashboard = () => {
  const [tractors, setTractors]           = useState([])
  const [products, setProducts]           = useState([])
  const [bookings, setBookings]           = useState([])
  const [loadingT, setLoadingT]           = useState(true)
  const [loadingP, setLoadingP]           = useState(true)
  const [loadingB, setLoadingB]           = useState(true)
  const [activeTab, setActiveTab]         = useState('tractors')
  const [error, setError]                 = useState('')
  const [success, setSuccess]             = useState('')
  const [editTractor, setEditTractor]     = useState(null)
  const [editForm, setEditForm]           = useState({})
  const [updating, setUpdating]           = useState(false)
  const [deleteId, setDeleteId]           = useState(null)
  const [actionLoading, setActionLoading] = useState('')
  const [bookingFilter, setBookingFilter] = useState('all')

  const statusConfig = {
    pending:   { label: 'Pending',   cls: 'bg-yellow-900/50 text-yellow-300 border-yellow-800' },
    accepted:  { label: 'Accepted',  cls: 'bg-green-900/50  text-green-300  border-green-800' },
    completed: { label: 'Completed', cls: 'bg-blue-900/50   text-blue-300   border-blue-800' },
    cancelled: { label: 'Cancelled', cls: 'bg-red-950/50    text-red-400    border-red-900' },
  }

  const tractorTypes = ['Ploughing', 'Harvesting', 'Seeding', 'Spraying']
  const BASE = import.meta.env.VITE_BASE_URL

  useEffect(() => {
    fetchMyTractors()
    fetchMyProducts()
    fetchDriverBookings()
  }, [])

  const flash = (msg, isError = false) => {
    if (isError) setError(msg)
    else setSuccess(msg)
    setTimeout(() => { setSuccess(''); setError('') }, 3000)
  }

  const fetchMyTractors = async () => {
    try {
      const res = await axios.get(`${BASE}/tractor/getMyTractor`, { withCredentials: true })
      setTractors(res.data.data)
    } catch { flash('Failed to load tractors.', true) }
    finally { setLoadingT(false) }
  }

  const fetchMyProducts = async () => {
    try {
      const res = await axios.get(`${BASE}/product/seller/my-products`, { withCredentials: true })
      setProducts(res.data.data || [])
    } catch { flash('Failed to load products.', true) }
    finally { setLoadingP(false) }
  }

  const fetchDriverBookings = async () => {
    try {
      const res = await axios.get(`${BASE}/booking/driver`, { withCredentials: true })
      setBookings(res.data.data || [])
    } catch (err) {
      flash(err.response?.data?.message || 'Failed to load bookings.', true)
    } finally { setLoadingB(false) }
  }

  const handleToggle = async (id) => {
    try {
      const res = await axios.put(`${BASE}/tractor/toggle/${id}`, {}, { withCredentials: true })
      setTractors(prev => prev.map(t => t._id === id ? res.data.data : t))
      flash('Availability updated!')
    } catch { flash('Failed to toggle.', true) }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE}/tractor/deleteTractor/${id}`, { withCredentials: true })
      setTractors(prev => prev.filter(t => t._id !== id))
      setDeleteId(null)
      flash('Tractor removed!')
    } catch { flash('Failed to delete tractor.', true) }
  }

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return
    try {
      await axios.delete(`${BASE}/product/${id}`, { withCredentials: true })
      setProducts(prev => prev.filter(p => p._id !== id))
      flash('Product deleted!')
    } catch { flash('Failed to delete product.', true) }
  }

  const openEdit = (tractor) => {
    setEditTractor(tractor)
    setEditForm({
      tractorName:  tractor.tractorName,
      tractorType:  tractor.tractorType,
      pricePerHour: tractor.pricePerHour,
      location:     tractor.location,
    })
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setUpdating(true)
    try {
      // ✅ FIXED: /tractor/updateTractor/:id
      const res = await axios.put(
        `${BASE}/tractor/updateTractor/${editTractor._id}`,
        editForm,
        { withCredentials: true }
      )
      setTractors(prev => prev.map(t => t._id === editTractor._id ? res.data.data : t))
      setEditTractor(null)
      flash('Tractor updated!')
    } catch { flash('Failed to update.', true) }
    finally { setUpdating(false) }
  }

  // ✅ FIXED: /booking/accept/:id  /booking/reject/:id  /booking/complete/:id
  const handleBookingAction = async (id, action) => {
    setActionLoading(id + action)
    try {
      await axios.put(`${BASE}/booking/${action}/${id}`, {}, { withCredentials: true })
      
      let newStatus = 'pending'
      if (action === 'accept') newStatus = 'accepted'
      else if (action === 'reject') newStatus = 'cancelled'
      else if (action === 'complete') newStatus = 'completed'

      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: newStatus } : b))
      flash(`Booking status updated to ${newStatus}!`)
    } catch (err) {
      flash(err.response?.data?.message || `Failed to update booking status.`, true)
    } finally { setActionLoading('') }
  }

  const typeColors = {
    Ploughing:  'bg-yellow-900/50 text-yellow-300',
    Harvesting: 'bg-green-900/50  text-green-300',
    Seeding:    'bg-blue-900/50   text-blue-300',
    Spraying:   'bg-purple-900/50 text-purple-300',
  }

  return (
    <div className="min-h-screen bg-[#0a150a] pb-16">
      <div className="bg-[#111f11] border-b border-yellow-900/40 px-6 py-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-yellow-600 text-xs font-bold uppercase tracking-widest mb-2">Driver Panel</p>
            <h1 className="text-3xl font-black text-white">Dashboard</h1>
          </div>
          <div className="flex gap-3">
            <Link to="/owner/add-tractor"
              className="flex items-center gap-2 px-5 py-3 bg-yellow-600 hover:bg-yellow-500 text-[#0a150a] font-bold text-sm rounded-xl transition-colors">
              <Plus className="w-4 h-4" /> Add Tractor
            </Link>
            <Link to="/owner/add-product"
              className="flex items-center gap-2 px-5 py-3 bg-[#1a2e1a] hover:bg-[#2d4a2d] border border-[#2d4a2d] text-green-400 hover:text-white font-bold text-sm rounded-xl transition-colors">
              <Plus className="w-4 h-4" /> Add Product
            </Link>
          </div>
        </div>
        <div className="max-w-6xl mx-auto flex gap-2 mt-6">
          {['tractors', 'products', 'bookings'].map(tab => {
            const activeBookingsCount = bookings.filter(b => b.status === 'pending' || b.status === 'accepted').length
            return (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                  activeTab === tab ? 'bg-yellow-600 text-[#0a150a]' : 'bg-[#1f3a1f] text-green-400 hover:bg-[#2d4a2d]'
                }`}>
                {tab}
                {tab === 'bookings' && activeBookingsCount > 0 && (
                  <span className="ml-2 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">{activeBookingsCount}</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-8">
        {success && (
          <div className="flex items-center gap-3 bg-[#162716] border border-green-800 text-green-400 text-sm px-4 py-3 rounded-xl mb-5">
            <CheckCircle2 className="w-4 h-4 text-yellow-500 shrink-0" />{success}
          </div>
        )}
        {error && (
          <div className="bg-red-950 border border-red-900 text-red-400 text-sm px-4 py-3 rounded-xl mb-5">{error}</div>
        )}

        {/* ── TRACTORS TAB ── */}
        {activeTab === 'tractors' && (
          <>
            {loadingT && <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin" /></div>}
            {!loadingT && tractors.length === 0 && (
              <div className="text-center py-24">
                <Tractor className="w-16 h-16 text-[#2d4a2d] mx-auto mb-4" />
                <p className="text-[#4b6b4b] text-lg font-semibold">No tractors added yet</p>
                <Link to="/owner/add-tractor" className="text-yellow-500 text-sm hover:underline mt-2 inline-block">Add your first tractor →</Link>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {tractors.map(tractor => (
                <div key={tractor._id} className="bg-[#111f11] border border-[#1f3a1f] rounded-2xl p-6 flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 bg-[#1a2e1a] border border-[#2d4a2d] rounded-xl flex items-center justify-center">
                      <Tractor className="w-6 h-6 text-yellow-500" />
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${typeColors[tractor.tractorType]}`}>{tractor.tractorType}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{tractor.tractorName}</h3>
                    <div className="flex items-center gap-1.5 mt-1 text-green-600 text-sm">
                      <MapPin className="w-3.5 h-3.5 text-yellow-700" />{tractor.location}
                    </div>
                    <p className="text-yellow-400 font-black text-2xl mt-2">₹{tractor.pricePerHour}<span className="text-[#4b6b4b] text-xs font-normal">/hr</span></p>
                  </div>
                  <button onClick={() => handleToggle(tractor._id)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                      tractor.availability ? 'bg-green-900/20 border-green-800 text-green-400' : 'bg-red-950/20 border-red-900 text-red-400'
                    }`}>
                    <span className="text-sm font-semibold">{tractor.availability ? '● Available' : '○ Unavailable'}</span>
                    {tractor.availability ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                  </button>
                  <div className="flex gap-2 pt-1 border-t border-[#1f3a1f]">
                    <button onClick={() => openEdit(tractor)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#1a2e1a] hover:bg-yellow-900/20 border border-[#2d4a2d] hover:border-yellow-800 text-yellow-400 text-sm font-semibold transition-all">
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button onClick={() => setDeleteId(tractor._id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-950/20 hover:bg-red-950/40 border border-red-900/40 hover:border-red-800 text-red-400 text-sm font-semibold transition-all">
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── PRODUCTS TAB ── */}
        {activeTab === 'products' && (
          <>
            {loadingP && <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin" /></div>}
            {!loadingP && products.length === 0 && (
              <div className="text-center py-24">
                <Tractor className="w-16 h-16 text-[#2d4a2d] mx-auto mb-4" />
                <p className="text-[#4b6b4b] text-lg font-semibold">No products added yet</p>
                <Link to="/owner/add-product" className="text-yellow-500 text-sm hover:underline mt-2 inline-block">Add your first product →</Link>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map(product => (
                <div key={product._id} className="bg-[#111f11] border border-[#1f3a1f] rounded-2xl p-6 flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 bg-[#1a2e1a] border border-[#2d4a2d] rounded-xl flex items-center justify-center overflow-hidden">
                       <span className="text-yellow-500 text-xl font-bold">{product.name.charAt(0)}</span>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-green-900/50 text-green-300 capitalize`}>{product.category}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg line-clamp-1">{product.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1 text-green-600 text-sm">
                      <MapPin className="w-3.5 h-3.5 text-yellow-700" /> Stock: {product.stock} units
                    </div>
                    <p className="text-yellow-400 font-black text-2xl mt-2">₹{product.price}</p>
                  </div>
                  <div className="flex gap-2 pt-1 border-t border-[#1f3a1f] mt-auto">
                    <button onClick={() => handleDeleteProduct(product._id)}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-950/20 hover:bg-red-950/40 border border-red-900/40 hover:border-red-800 text-red-400 text-sm font-semibold transition-all">
                      <Trash2 className="w-3.5 h-3.5" /> Delete Product
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── BOOKINGS TAB ── */}
        {activeTab === 'bookings' && (
          <>
            <div className="flex gap-2 flex-wrap mb-6">
              {['all', 'pending', 'accepted', 'completed', 'cancelled'].map(f => (
                <button key={f} onClick={() => setBookingFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
                    bookingFilter === f ? 'bg-yellow-600 text-[#0a150a]' : 'bg-[#1f3a1f] text-green-400 hover:bg-[#2d4a2d]'
                  }`}>
                  {f} <span className="ml-1 opacity-60">({bookings.filter(b => f === 'all' || b.status === f).length})</span>
                </button>
              ))}
            </div>

            {loadingB && <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin" /></div>}
            
            {!loadingB && bookings.filter(b => bookingFilter === 'all' || b.status === bookingFilter).length === 0 && (
              <div className="text-center py-24">
                {bookingFilter === 'pending' || bookingFilter === 'all' ? (
                  <CheckCircle2 className="w-16 h-16 text-[#2d4a2d] mx-auto mb-4" />
                ) : (
                  <Calendar className="w-16 h-16 text-[#2d4a2d] mx-auto mb-4" />
                )}
                <p className="text-[#4b6b4b] text-lg font-semibold">No {bookingFilter !== 'all' ? bookingFilter : ''} bookings</p>
                {bookingFilter === 'all' && <p className="text-[#3a5a3a] text-sm mt-1">New requests will appear here</p>}
              </div>
            )}

            <div className="space-y-4">
              {bookings
                .filter(b => bookingFilter === 'all' || b.status === bookingFilter)
                .map(booking => (
                  <div key={booking._id} className="bg-[#111f11] border border-[#1f3a1f] rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-yellow-600 rounded-xl flex items-center justify-center shrink-0">
                          <Tractor className="w-5 h-5 text-[#0a150a]" />
                        </div>
                        <div>
                          <h3 className="text-white font-bold">{booking.tractorId?.tractorName || 'Tractor'}</h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeColors[booking.serviceType] || 'bg-green-900/50 text-green-300'}`}>
                            {booking.serviceType}
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <p className="text-yellow-400 text-xl font-black">₹{booking.totalPrice}</p>
                        <p className="text-[#4b6b4b] text-xs mb-1.5">{booking.hours}h × ₹{booking.pricePerHour}/hr</p>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusConfig[booking.status]?.cls || 'border-[#1f3a1f] text-green-400'}`}>
                          {statusConfig[booking.status]?.label || booking.status}
                        </span>
                      </div>
                    </div>
                    <div className="bg-[#0d1a0d] rounded-xl p-4 mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-yellow-700 shrink-0" />
                        <div>
                          <p className="text-[#4b6b4b] text-[10px] uppercase tracking-wide">Farmer</p>
                          <p className="text-green-300 text-sm font-semibold">{booking.farmerId?.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-yellow-700 shrink-0" />
                        <div>
                          <p className="text-[#4b6b4b] text-[10px] uppercase tracking-wide">Phone</p>
                          <p className="text-green-300 text-sm font-semibold">{booking.farmerId?.phone || '—'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-yellow-700 shrink-0" />
                        <div>
                          <p className="text-[#4b6b4b] text-[10px] uppercase tracking-wide">Location</p>
                          <p className="text-green-300 text-sm font-semibold">{booking.farmLocation}</p>
                        </div>
                      </div>
                    </div>

                    {booking.rating && (
                      <div className="bg-[#0d1a0d] rounded-xl p-4 mb-4">
                        <div className="flex items-center gap-1 mb-1">
                          {Array.from({ length: booking.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                          ))}
                        </div>
                        {booking.review && <p className="text-green-400 text-xs italic">"{booking.review}"</p>}
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-xs text-[#4b6b4b] mb-4">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {booking.hours} hours</span>
                      <span>{new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      {booking.status === 'pending' && (
                        <>
                          <button onClick={() => handleBookingAction(booking._id, 'accept')}
                            disabled={actionLoading === booking._id + 'accept'}
                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-700 hover:bg-green-600 text-white text-sm font-bold transition-colors disabled:opacity-50">
                            {actionLoading === booking._id + 'accept'
                              ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              : <><Check className="w-4 h-4" /> Accept Booking</>}
                          </button>
                          <button onClick={() => handleBookingAction(booking._id, 'reject')}
                            disabled={actionLoading === booking._id + 'reject'}
                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-800 hover:bg-red-700 text-white text-sm font-bold transition-colors disabled:opacity-50">
                            {actionLoading === booking._id + 'reject'
                              ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              : <><XCircle className="w-4 h-4" /> Reject</>}
                          </button>
                        </>
                      )}
                      {booking.status === 'accepted' && (
                        <button onClick={() => handleBookingAction(booking._id, 'complete')}
                          disabled={actionLoading === booking._id + 'complete'}
                          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-[#0a150a] text-sm font-extrabold transition-colors disabled:opacity-50">
                          {actionLoading === booking._id + 'complete'
                            ? <span className="w-4 h-4 border-2 border-[#0a150a] border-t-transparent rounded-full animate-spin" />
                            : <><Flag className="w-4 h-4" /> Mark as Completed</>}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      {editTractor && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
          <div className="bg-[#111f11] border border-[#1f3a1f] rounded-2xl p-7 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-black text-xl">Edit Tractor</h2>
              <button onClick={() => setEditTractor(null)} className="text-[#4b6b4b] hover:text-white transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="text-[#a3c4a3] text-xs font-bold uppercase tracking-widest mb-2 block">Tractor Name</label>
                <input type="text" value={editForm.tractorName}
                  onChange={e => setEditForm({ ...editForm, tractorName: e.target.value })}
                  className="w-full bg-[#0a150a] border-2 border-[#2d4a2d] focus:border-yellow-600 rounded-xl px-4 py-3 text-green-100 text-sm outline-none transition-colors" />
              </div>
              <div>
                <label className="text-[#a3c4a3] text-xs font-bold uppercase tracking-widest mb-3 block">Tractor Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {tractorTypes.map(type => (
                    <label key={type} className="cursor-pointer">
                      <input type="radio" name="editType" value={type}
                        checked={editForm.tractorType === type}
                        onChange={e => setEditForm({ ...editForm, tractorType: e.target.value })}
                        className="sr-only" />
                      <div className={`px-3 py-2.5 rounded-xl border-2 text-xs font-semibold text-center transition-all ${
                        editForm.tractorType === type ? 'border-yellow-600 bg-[#1a1200] text-yellow-400' : 'border-[#2d4a2d] text-green-500 hover:border-yellow-800'
                      }`}>{type}</div>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[#a3c4a3] text-xs font-bold uppercase tracking-widest mb-2 block">Price Per Hour (₹)</label>
                <input type="number" min="100" value={editForm.pricePerHour}
                  onChange={e => setEditForm({ ...editForm, pricePerHour: e.target.value })}
                  className="w-full bg-[#0a150a] border-2 border-[#2d4a2d] focus:border-yellow-600 rounded-xl px-4 py-3 text-green-100 text-sm outline-none transition-colors" />
              </div>
              <div>
                <label className="text-[#a3c4a3] text-xs font-bold uppercase tracking-widest mb-2 block">Location</label>
                <input type="text" value={editForm.location}
                  onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                  className="w-full bg-[#0a150a] border-2 border-[#2d4a2d] focus:border-yellow-600 rounded-xl px-4 py-3 text-green-100 text-sm outline-none transition-colors" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditTractor(null)}
                  className="flex-1 py-3 rounded-xl border border-[#2d4a2d] text-green-400 text-sm font-semibold hover:bg-[#1a2e1a] transition-colors">Cancel</button>
                <button type="submit" disabled={updating}
                  className="flex-1 py-3 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-[#0a150a] text-sm font-extrabold transition-colors disabled:opacity-50">
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
          <div className="bg-[#111f11] border border-red-900 rounded-2xl p-7 w-full max-w-sm text-center">
            <div className="w-14 h-14 bg-red-950 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-red-400" />
            </div>
            <h2 className="text-white font-black text-xl mb-2">Delete Tractor?</h2>
            <p className="text-[#4b6b4b] text-sm mb-6">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 py-3 rounded-xl border border-[#2d4a2d] text-green-400 text-sm font-semibold hover:bg-[#1a2e1a] transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteId)}
                className="flex-1 py-3 rounded-xl bg-red-700 hover:bg-red-600 text-white text-sm font-extrabold transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OwnerDashboard