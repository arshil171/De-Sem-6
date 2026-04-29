import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import axios from 'axios'
import { MapPin, Clock, Tractor, CheckCircle2, ArrowRight } from 'lucide-react'

const BookTractor = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tractor, setTractor]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState('')

  const [form, setForm] = useState({
    hours: 1,
    serviceType: '',
    farmLocation: '',
  })
  const [fieldErrors, setFieldErrors] = useState({})

  const serviceTypes = ['Ploughing', 'Harvesting', 'Seeding', 'Spraying']

  useEffect(() => {
    fetchTractor()
  }, [id])

  const fetchTractor = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/tractorAdd/getTractors`,
        { withCredentials: true }
      )
      const found = res.data.data.find(t => t._id === id)
      setTractor(found)
    } catch {
      setError('Failed to load tractor details.')
    } finally {
      setLoading(false)
    }
  }

  const validate = () => {
    const errs = {}
    if (!form.serviceType)       errs.serviceType   = 'Select a service type'
    if (!form.farmLocation.trim()) errs.farmLocation = 'Enter your farm location'
    if (form.hours < 1)          errs.hours         = 'Minimum 1 hour'
    if (tractor && form.hours > tractor.maxHoursPerBooking)
      errs.hours = `Maximum ${tractor.maxHoursPerBooking} hours`
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setError('')
    try {
      const totalPrice = tractor.pricePerHour * form.hours
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/bookingPage/bookTractor`,
        {
          tractorId:    tractor._id,
          driverId:     tractor.driverId._id,
          hours:        form.hours,
          serviceType:  form.serviceType,
          farmLocation: form.farmLocation,
          pricePerHour: tractor.pricePerHour,
          totalPrice,
        },
        { withCredentials: true }
      )
      setSuccess('Booking confirmed! Redirecting...')
      setTimeout(() => navigate('/my-bookings'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading)
    return (
      <div className="min-h-screen bg-[#0a150a] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )

  if (!tractor)
    return (
      <div className="min-h-screen bg-[#0a150a] flex items-center justify-center">
        <p className="text-red-400">Tractor not found.</p>
      </div>
    )

  const totalPrice = tractor.pricePerHour * form.hours

  return (
    <div className="min-h-screen bg-[#0a150a] py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Tractor Summary Card */}
        <div className="bg-[#111f11] border border-[#1f3a1f] rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-yellow-600 rounded-2xl flex items-center justify-center shrink-0">
              <Tractor className="w-7 h-7 text-[#0a150a]" />
            </div>
            <div className="flex-1">
              <h2 className="text-white font-black text-xl">{tractor.tractorName}</h2>
              <div className="flex items-center gap-4 mt-1 text-sm">
                <span className="flex items-center gap-1 text-green-500">
                  <MapPin className="w-3.5 h-3.5 text-yellow-700" />{tractor.location}
                </span>
                <span className="text-yellow-400 font-bold">₹{tractor.pricePerHour}/hr</span>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-green-900 text-green-300">
              {tractor.tractorType}
            </span>
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-[#111f11] border border-[#1f3a1f] rounded-2xl p-6">
          <h3 className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="w-6 h-0.5 bg-yellow-600 inline-block" />
            Booking Details
          </h3>

          {success && (
            <div className="flex items-center gap-3 bg-[#162716] border border-green-800 text-green-400 text-sm px-4 py-3 rounded-xl mb-5">
              <CheckCircle2 className="w-4 h-4 text-yellow-500 shrink-0" /> {success}
            </div>
          )}
          {error && (
            <div className="bg-red-950 border border-red-900 text-red-400 text-sm px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Service Type */}
            <div>
              <label className="text-[#a3c4a3] text-xs font-bold uppercase tracking-widest mb-3 block">
                Service Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {serviceTypes.map(type => (
                  <label key={type} className="cursor-pointer">
                    <input
                      type="radio"
                      name="serviceType"
                      value={type}
                      checked={form.serviceType === type}
                      onChange={e => setForm({ ...form, serviceType: e.target.value })}
                      className="sr-only"
                    />
                    <div className={`px-4 py-3 rounded-xl border-2 text-sm font-semibold text-center transition-all duration-200 ${
                      form.serviceType === type
                        ? 'border-yellow-600 bg-[#1a1200] text-yellow-400'
                        : 'border-[#2d4a2d] text-green-500 hover:border-yellow-800'
                    }`}>
                      {type}
                    </div>
                  </label>
                ))}
              </div>
              {fieldErrors.serviceType && <p className="text-red-500 text-xs mt-1.5">{fieldErrors.serviceType}</p>}
            </div>

            {/* Farm Location */}
            <div>
              <label className="text-[#a3c4a3] text-xs font-bold uppercase tracking-widest mb-2 block">
                Farm Location
              </label>
              <div className={`flex items-center gap-3 bg-[#0a150a] border-2 rounded-xl px-4 py-3.5 transition-colors ${
                fieldErrors.farmLocation ? 'border-red-800' : 'border-[#2d4a2d] focus-within:border-yellow-600'
              }`}>
                <MapPin className="w-4 h-4 text-[#6b8f6b] shrink-0" />
                <input
                  type="text"
                  placeholder="Enter your farm location"
                  value={form.farmLocation}
                  onChange={e => setForm({ ...form, farmLocation: e.target.value })}
                  className="w-full bg-transparent outline-none text-green-100 placeholder-[#3a5a3a] text-sm"
                />
              </div>
              {fieldErrors.farmLocation && <p className="text-red-500 text-xs mt-1.5">{fieldErrors.farmLocation}</p>}
            </div>

            {/* Hours */}
            <div>
              <label className="text-[#a3c4a3] text-xs font-bold uppercase tracking-widest mb-2 block">
                Hours Needed
              </label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, hours: Math.max(1, f.hours - 1) }))}
                  className="w-10 h-10 rounded-xl bg-[#1f3a1f] hover:bg-yellow-900 text-white font-bold text-lg transition-colors"
                >-</button>
                <div className="flex-1 text-center">
                  <span className="text-yellow-400 text-3xl font-black">{form.hours}</span>
                  <span className="text-[#4b6b4b] text-sm ml-1">hrs</span>
                </div>
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, hours: Math.min(tractor.maxHoursPerBooking, f.hours + 1) }))}
                  className="w-10 h-10 rounded-xl bg-[#1f3a1f] hover:bg-yellow-900 text-white font-bold text-lg transition-colors"
                >+</button>
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-[#4b6b4b] text-xs">Max: {tractor.maxHoursPerBooking} hours</p>
                {fieldErrors.hours && <p className="text-red-500 text-xs">{fieldErrors.hours}</p>}
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-[#0d1a0d] border border-[#1f3a1f] rounded-xl p-4">
              <div className="flex justify-between text-sm text-green-500 mb-2">
                <span>Rate</span>
                <span>₹{tractor.pricePerHour} × {form.hours}h</span>
              </div>
              <div className="flex justify-between items-center border-t border-[#1f3a1f] pt-3 mt-2">
                <span className="text-white font-bold text-sm">Total Amount</span>
                <span className="text-yellow-400 text-2xl font-black">₹{totalPrice}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 text-[#0a150a] font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              {submitting
                ? <span className="w-5 h-5 border-2 border-[#0a150a] border-t-transparent rounded-full animate-spin" />
                : <><span>Confirm Booking</span><ArrowRight className="w-4 h-4" /></>
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BookTractor