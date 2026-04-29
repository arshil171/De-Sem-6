import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { MapPin, Clock, Tractor, Calendar } from 'lucide-react'

const MyBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading]  = useState(true)
  const [error, setError]      = useState('')

  useEffect(() => { fetchBookings() }, [])

  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/bookingPage/myBookings`,
        { withCredentials: true }
      )
      setBookings(res.data.data)
    } catch {
      setError('Failed to load bookings.')
    } finally {
      setLoading(false)
    }
  }

  const statusConfig = {
    pending:   { label: 'Pending',   class: 'bg-yellow-900 text-yellow-300 border-yellow-800' },
    accepted:  { label: 'Accepted',  class: 'bg-green-900  text-green-300  border-green-800'  },
    completed: { label: 'Completed', class: 'bg-blue-900   text-blue-300   border-blue-800'   },
    cancelled: { label: 'Cancelled', class: 'bg-red-950    text-red-400    border-red-900'    },
  }

  return (
    <div className="min-h-screen bg-[#0a150a] pb-16">
      <div className="bg-[#111f11] border-b border-yellow-900/40 px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <p className="text-yellow-600 text-xs font-bold uppercase tracking-widest mb-2">My Activity</p>
          <h1 className="text-3xl font-black text-white">My Bookings</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-8">
        {loading && (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {error && <div className="bg-red-950 border border-red-900 text-red-400 px-5 py-4 rounded-xl text-sm">{error}</div>}

        {!loading && bookings.length === 0 && (
          <div className="text-center py-24">
            <Calendar className="w-16 h-16 text-[#2d4a2d] mx-auto mb-4" />
            <p className="text-[#4b6b4b] text-lg font-semibold">No bookings yet</p>
            <p className="text-[#3a5a3a] text-sm mt-1">Book a tractor to get started</p>
          </div>
        )}

        <div className="space-y-4">
          {bookings.map(booking => {
            const s = statusConfig[booking.status] || statusConfig.pending
            return (
              <div key={booking._id} className="bg-[#111f11] border border-[#1f3a1f] rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#1a2e1a] border border-[#2d4a2d] rounded-xl flex items-center justify-center shrink-0">
                      <Tractor className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold">{booking.tractorId?.tractorName}</h3>
                      <div className="flex flex-wrap gap-3 mt-1 text-xs text-green-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-yellow-700" />{booking.farmLocation}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />{booking.hours}h · {booking.serviceType}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-yellow-400 text-xl font-black">₹{booking.totalPrice}</p>
                      <p className="text-[#4b6b4b] text-xs">₹{booking.pricePerHour}/hr</p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${s.class}`}>
                      {s.label}
                    </span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-[#1f3a1f] flex items-center justify-between text-xs text-[#4b6b4b]">
                  <span>Driver: <span className="text-green-400">{booking.driverId?.name}</span></span>
                  <span>{new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MyBookings