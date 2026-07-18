// import React, { useEffect, useState } from 'react'
// import axios from 'axios'
// import { MapPin, Clock, Tractor, Calendar, Star, X } from 'lucide-react'

// const MyBookings = () => {
//   const [bookings, setBookings]       = useState([])
//   const [loading, setLoading]         = useState(true)
//   const [error, setError]             = useState('')
//   const [success, setSuccess]         = useState('')
//   const [filter, setFilter]           = useState('all')
//   const [reviewModal, setReviewModal] = useState(null)
//   const [reviewForm, setReviewForm]   = useState({ rating: 5, review: '' })
//   const [submitting, setSubmitting]   = useState(false)

//   const BASE = import.meta.env.VITE_BASE_URL

//   useEffect(() => { fetchBookings() }, [])

//   const fetchBookings = async () => {
//     try {
//       // ✅ FIXED: /booking/my
//       const res = await axios.get(`${BASE}/booking/my`, { withCredentials: true })
//       setBookings(res.data.data)
//     } catch {
//       setError('Failed to load bookings.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const flash = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000) }

//   const handleCancel = async (id) => {
//     try {
//       // ✅ FIXED: /booking/cancel/:id
//       await axios.put(`${BASE}/booking/cancel/${id}`, {}, { withCredentials: true })
//       setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'cancelled' } : b))
//       flash('Booking cancelled.')
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to cancel.')
//     }
//   }

//   const handleReview = async (e) => {
//     e.preventDefault()
//     setSubmitting(true)
//     try {
//       // ✅ FIXED: /booking/review/:id
//       await axios.put(`${BASE}/booking/review/${reviewModal}`, reviewForm, { withCredentials: true })
//       setBookings(prev => prev.map(b =>
//         b._id === reviewModal ? { ...b, rating: reviewForm.rating, review: reviewForm.review } : b
//       ))
//       setReviewModal(null)
//       flash('Review submitted!')
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to submit review.')
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const statusConfig = {
//     pending:   { label: 'Pending',   cls: 'bg-yellow-900/50 text-yellow-300 border-yellow-800' },
//     accepted:  { label: 'Accepted',  cls: 'bg-green-900/50  text-green-300  border-green-800'  },
//     completed: { label: 'Completed', cls: 'bg-blue-900/50   text-blue-300   border-blue-800'   },
//     cancelled: { label: 'Cancelled', cls: 'bg-red-950/50    text-red-400    border-red-900'    },
//   }

//   const filters = ['all', 'pending', 'accepted', 'completed', 'cancelled']
//   const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

//   return (
//     <div className="min-h-screen bg-[#0a150a] pb-16">
//       <div className="bg-[#111f11] border-b border-yellow-900/40 px-6 py-10">
//         <div className="max-w-5xl mx-auto">
//           <p className="text-yellow-600 text-xs font-bold uppercase tracking-widest mb-2">Farmer Panel</p>
//           <h1 className="text-3xl font-black text-white mb-5">My Bookings</h1>
//           <div className="flex gap-2 flex-wrap">
//             {filters.map(f => (
//               <button key={f} onClick={() => setFilter(f)}
//                 className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
//                   filter === f ? 'bg-yellow-600 text-[#0a150a]' : 'bg-[#1f3a1f] text-green-400 hover:bg-[#2d4a2d]'
//                 }`}>
//                 {f}{f !== 'all' && <span className="ml-1 opacity-60">({bookings.filter(b => b.status === f).length})</span>}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="max-w-5xl mx-auto px-6 pt-8">
//         {success && <div className="bg-[#162716] border border-green-800 text-green-400 text-sm px-4 py-3 rounded-xl mb-5">{success}</div>}
//         {error && <div className="bg-red-950 border border-red-900 text-red-400 text-sm px-4 py-3 rounded-xl mb-5">{error}</div>}
//         {loading && <div className="flex justify-center py-24"><div className="w-10 h-10 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin" /></div>}
//         {!loading && filtered.length === 0 && (
//           <div className="text-center py-24">
//             <Calendar className="w-16 h-16 text-[#2d4a2d] mx-auto mb-4" />
//             <p className="text-[#4b6b4b] text-lg font-semibold">No {filter !== 'all' ? filter : ''} bookings</p>
//           </div>
//         )}

//         <div className="space-y-4">
//           {filtered.map(booking => {
//             const s = statusConfig[booking.status] || statusConfig.pending
//             return (
//               <div key={booking._id} className="bg-[#111f11] border border-[#1f3a1f] rounded-2xl p-6">
//                 <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
//                   <div className="flex items-center gap-4">
//                     <div className="w-12 h-12 bg-[#1a2e1a] border border-[#2d4a2d] rounded-xl flex items-center justify-center shrink-0">
//                       <Tractor className="w-6 h-6 text-yellow-500" />
//                     </div>
//                     <div>
//                       <h3 className="text-white font-bold text-base">{booking.tractorId?.tractorName || 'Tractor'}</h3>
//                       <div className="flex flex-wrap gap-3 mt-1 text-xs text-green-600">
//                         <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-yellow-700" />{booking.farmLocation}</span>
//                         <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{booking.hours}h · {booking.serviceType}</span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-3 shrink-0">
//                     <div className="text-right">
//                       <p className="text-yellow-400 text-xl font-black">₹{booking.totalPrice}</p>
//                       <p className="text-[#4b6b4b] text-xs">₹{booking.pricePerHour}/hr</p>
//                     </div>
//                     <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${s.cls}`}>{s.label}</span>
//                   </div>
//                 </div>

//                 <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#4b6b4b] pb-4 border-b border-[#1f3a1f]">
//                   <span>Driver: <span className="text-green-400 font-medium">{booking.driverId?.name || '—'}</span></span>
//                   <span>{new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
//                 </div>

//                 {booking.rating && (
//                   <div className="mt-3 bg-[#0d1a0d] rounded-xl px-4 py-3">
//                     <div className="flex items-center gap-1 mb-1">
//                       {Array.from({ length: booking.rating }).map((_, i) => (
//                         <Star key={i} className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
//                       ))}
//                     </div>
//                     {booking.review && <p className="text-green-400 text-xs italic">"{booking.review}"</p>}
//                   </div>
//                 )}

//                 <div className="flex flex-wrap gap-2 mt-4">
//                   {(booking.status === 'pending' || booking.status === 'accepted') && (
//                     <button onClick={() => handleCancel(booking._id)}
//                       className="px-4 py-2 rounded-xl bg-red-950/30 hover:bg-red-950/60 border border-red-900/50 text-red-400 text-xs font-bold transition-colors">
//                       Cancel Booking
//                     </button>
//                   )}
//                   {booking.status === 'completed' && !booking.rating && (
//                     <button onClick={() => { setReviewModal(booking._id); setReviewForm({ rating: 5, review: '' }) }}
//                       className="px-4 py-2 rounded-xl bg-yellow-900/30 hover:bg-yellow-900/50 border border-yellow-800/50 text-yellow-400 text-xs font-bold transition-colors flex items-center gap-1.5">
//                       <Star className="w-3.5 h-3.5" /> Add Review
//                     </button>
//                   )}
//                 </div>
//               </div>
//             )
//           })}
//         </div>
//       </div>

//       {/* Review Modal */}
//       {reviewModal && (
//         <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
//           <div className="bg-[#111f11] border border-[#1f3a1f] rounded-2xl p-7 w-full max-w-md">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-white font-black text-xl">Add Review</h2>
//               <button onClick={() => setReviewModal(null)} className="text-[#4b6b4b] hover:text-white transition-colors"><X className="w-5 h-5" /></button>
//             </div>
//             <form onSubmit={handleReview} className="space-y-5">
//               <div>
//                 <label className="text-[#a3c4a3] text-xs font-bold uppercase tracking-widest mb-3 block">Rating</label>
//                 <div className="flex gap-2">
//                   {[1,2,3,4,5].map(star => (
//                     <button key={star} type="button" onClick={() => setReviewForm(f => ({ ...f, rating: star }))} className="transition-transform hover:scale-110">
//                       <Star className={`w-8 h-8 transition-colors ${star <= reviewForm.rating ? 'text-yellow-500 fill-yellow-500' : 'text-[#2d4a2d]'}`} />
//                     </button>
//                   ))}
//                 </div>
//               </div>
//               <div>
//                 <label className="text-[#a3c4a3] text-xs font-bold uppercase tracking-widest mb-2 block">Your Review</label>
//                 <textarea rows={4} placeholder="Share your experience..."
//                   value={reviewForm.review}
//                   onChange={e => setReviewForm(f => ({ ...f, review: e.target.value }))}
//                   className="w-full bg-[#0a150a] border-2 border-[#2d4a2d] focus:border-yellow-600 rounded-xl px-4 py-3 text-green-100 text-sm outline-none transition-colors resize-none placeholder-[#3a5a3a]" />
//               </div>
//               <div className="flex gap-3">
//                 <button type="button" onClick={() => setReviewModal(null)}
//                   className="flex-1 py-3 rounded-xl border border-[#2d4a2d] text-green-400 text-sm font-semibold hover:bg-[#1a2e1a] transition-colors">Cancel</button>
//                 <button type="submit" disabled={submitting}
//                   className="flex-1 py-3 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-[#0a150a] text-sm font-extrabold transition-colors disabled:opacity-50">
//                   {submitting ? 'Submitting...' : 'Submit Review'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default MyBookings

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router'
import { MapPin, Clock, Tractor, Calendar, Star, X } from 'lucide-react'

const MyBookings = () => {
  const [bookings, setBookings]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState('')
  const [success, setSuccess]         = useState('')
  const [filter, setFilter]           = useState('all')
  const [reviewModal, setReviewModal] = useState(null)
  const [reviewForm, setReviewForm]   = useState({ rating: 5, review: '' })
  const [submitting, setSubmitting]   = useState(false)

  const navigate = useNavigate()
  const BASE = import.meta.env.VITE_BASE_URL

  useEffect(() => { fetchBookings() }, [])

  const fetchBookings = async () => {
    try {
      // ✅ FIXED: /booking/my
      const res = await axios.get(`${BASE}/booking/my`, { withCredentials: true })
      setBookings(res.data.data)
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login')
      } else {
        setError('Failed to load bookings.')
      }
    } finally {
      setLoading(false)
    }
  }

  const flash = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000) }

  const handleCancel = async (id) => {
    try {
      // ✅ FIXED: /booking/cancel/:id
      await axios.put(`${BASE}/booking/cancel/${id}`, {}, { withCredentials: true })
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'cancelled' } : b))
      flash('Booking cancelled.')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel.')
    }
  }

  const handleComplete = async (id) => {
    try {
      await axios.put(`${BASE}/booking/complete/${id}`, {}, { withCredentials: true })
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'completed' } : b))
      flash('Booking completed!')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete booking.')
    }
  }

  const handleReview = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      // ✅ FIXED: /booking/review/:id
      await axios.put(`${BASE}/booking/review/${reviewModal}`, reviewForm, { withCredentials: true })
      setBookings(prev => prev.map(b =>
        b._id === reviewModal ? { ...b, rating: reviewForm.rating, review: reviewForm.review } : b
      ))
      setReviewModal(null)
      flash('Review submitted!')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review.')
    } finally {
      setSubmitting(false)
    }
  }

  const statusConfig = {
    pending:   { label: 'Pending',   cls: 'bg-yellow-900/50 text-yellow-300 border-yellow-800' },
    accepted:  { label: 'Accepted',  cls: 'bg-green-900/50  text-green-300  border-green-800'  },
    completed: { label: 'Completed', cls: 'bg-blue-900/50   text-blue-300   border-blue-800'   },
    cancelled: { label: 'Cancelled', cls: 'bg-red-950/50    text-red-400    border-red-900'    },
  }

  const filters = ['all', 'pending', 'accepted', 'completed', 'cancelled']
  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  return (
    <div className="min-h-screen bg-[#0a150a] pb-16">
      <div className="bg-[#111f11] border-b border-yellow-900/40 px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <p className="text-yellow-600 text-xs font-bold uppercase tracking-widest mb-2">Farmer Panel</p>
          <h1 className="text-3xl font-black text-white mb-5">My Bookings</h1>
          <div className="flex gap-2 flex-wrap">
            {filters.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
                  filter === f ? 'bg-yellow-600 text-[#0a150a]' : 'bg-[#1f3a1f] text-green-400 hover:bg-[#2d4a2d]'
                }`}>
                {f}{f !== 'all' && <span className="ml-1 opacity-60">({bookings.filter(b => b.status === f).length})</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-8">
        {success && <div className="bg-[#162716] border border-green-800 text-green-400 text-sm px-4 py-3 rounded-xl mb-5">{success}</div>}
        {error && <div className="bg-red-950 border border-red-900 text-red-400 text-sm px-4 py-3 rounded-xl mb-5">{error}</div>}
        {loading && <div className="flex justify-center py-24"><div className="w-10 h-10 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin" /></div>}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-24">
            <Calendar className="w-16 h-16 text-[#2d4a2d] mx-auto mb-4" />
            <p className="text-[#4b6b4b] text-lg font-semibold">No {filter !== 'all' ? filter : ''} bookings</p>
          </div>
        )}

        <div className="space-y-4">
          {filtered.map(booking => {
            const s = statusConfig[booking.status] || statusConfig.pending
            return (
              <div key={booking._id} className="bg-[#111f11] border border-[#1f3a1f] rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#1a2e1a] border border-[#2d4a2d] rounded-xl flex items-center justify-center shrink-0">
                      <Tractor className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-base">{booking.tractorId?.tractorName || 'Tractor'}</h3>
                      <div className="flex flex-wrap gap-3 mt-1 text-xs text-green-600">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-yellow-700" />{booking.farmLocation}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{booking.hours}h · {booking.serviceType}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-yellow-400 text-xl font-black">₹{booking.totalPrice}</p>
                      <p className="text-[#4b6b4b] text-xs">₹{booking.pricePerHour}/hr</p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${s.cls}`}>{s.label}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#4b6b4b] pb-4 border-b border-[#1f3a1f]">
                  <span>Driver: <span className="text-green-400 font-medium">{booking.driverId?.name || '—'}</span></span>
                  <span>{new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>

                {booking.rating && (
                  <div className="mt-3 bg-[#0d1a0d] rounded-xl px-4 py-3">
                    <div className="flex items-center gap-1 mb-1">
                      {Array.from({ length: booking.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                    {booking.review && <p className="text-green-400 text-xs italic">"{booking.review}"</p>}
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mt-4">
                  {booking.status === 'pending' && (
                    <button onClick={() => handleCancel(booking._id)}
                      className="px-4 py-2 rounded-xl bg-red-950/30 hover:bg-red-950/60 border border-red-900/50 text-red-400 text-xs font-bold transition-colors">
                      Cancel Booking
                    </button>
                  )}
                  {booking.status === 'accepted' && (
                    <button onClick={() => handleCancel(booking._id)}
                      className="px-4 py-2 rounded-xl bg-red-950/30 hover:bg-red-950/60 border border-red-900/50 text-red-400 text-xs font-bold transition-colors">
                      Cancel
                    </button>
                  )}
                  {booking.status === 'completed' && !booking.rating && (
                    <button onClick={() => { setReviewModal(booking._id); setReviewForm({ rating: 5, review: '' }) }}
                      className="px-4 py-2 rounded-xl bg-yellow-900/30 hover:bg-yellow-900/50 border border-yellow-800/50 text-yellow-400 text-xs font-bold transition-colors flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5" /> Add Review
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
          <div className="bg-[#111f11] border border-[#1f3a1f] rounded-2xl p-7 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-black text-xl">Add Review</h2>
              <button onClick={() => setReviewModal(null)} className="text-[#4b6b4b] hover:text-white transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleReview} className="space-y-5">
              <div>
                <label className="text-[#a3c4a3] text-xs font-bold uppercase tracking-widest mb-3 block">Rating</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(star => (
                    <button key={star} type="button" onClick={() => setReviewForm(f => ({ ...f, rating: star }))} className="transition-transform hover:scale-110">
                      <Star className={`w-8 h-8 transition-colors ${star <= reviewForm.rating ? 'text-yellow-500 fill-yellow-500' : 'text-[#2d4a2d]'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[#a3c4a3] text-xs font-bold uppercase tracking-widest mb-2 block">Your Review</label>
                <textarea rows={4} placeholder="Share your experience..."
                  value={reviewForm.review}
                  onChange={e => setReviewForm(f => ({ ...f, review: e.target.value }))}
                  className="w-full bg-[#0a150a] border-2 border-[#2d4a2d] focus:border-yellow-600 rounded-xl px-4 py-3 text-green-100 text-sm outline-none transition-colors resize-none placeholder-[#3a5a3a]" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setReviewModal(null)}
                  className="flex-1 py-3 rounded-xl border border-[#2d4a2d] text-green-400 text-sm font-semibold hover:bg-[#1a2e1a] transition-colors">Cancel</button>
                <button type="submit" disabled={submitting}
                  className="flex-1 py-3 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-[#0a150a] text-sm font-extrabold transition-colors disabled:opacity-50">
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyBookings