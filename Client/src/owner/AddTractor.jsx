import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import axios from 'axios'
import { Tractor, MapPin, CheckCircle2, ArrowRight } from 'lucide-react'

const AddTractor = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    tractorName: '', tractorType: '', pricePerHour: '', location: ''
  })
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState('')
  const [error, setError]       = useState('')

  const tractorTypes = ['Ploughing', 'Harvesting', 'Seeding', 'Spraying']

  const validate = () => {
    const errs = {}
    if (!form.tractorName.trim())         errs.tractorName  = 'Enter tractor name'
    if (!form.tractorType)                errs.tractorType  = 'Select tractor type'
    if (!form.pricePerHour || form.pricePerHour < 100)
      errs.pricePerHour = 'Minimum price is ₹100/hr'
    if (!form.location.trim())            errs.location     = 'Enter location'
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true); setError(''); setSuccess('')
    try {
      await axios.post(
  `${import.meta.env.VITE_BASE_URL}/tractorAdd/addTractor`,
  form,
  { withCredentials: true }   // ✅ this sends cookies
)
      
      setSuccess('Tractor added successfully!')
      setTimeout(() => navigate('/owner/dashboard'), 1800)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add tractor.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a150a] py-12 px-4">
      <div className="max-w-lg mx-auto">

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Tractor className="w-8 h-8 text-[#0a150a]" />
          </div>
          <p className="text-yellow-600 text-xs font-bold uppercase tracking-widest mb-1">Driver Panel</p>
          <h1 className="text-3xl font-black text-white">Add Your Tractor</h1>
        </div>

        <div className="bg-[#111f11] border border-[#1f3a1f] rounded-2xl p-7">
          <h3 className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="w-6 h-0.5 bg-yellow-600 inline-block" />
            Tractor Details
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

            {/* Tractor Name */}
            <div>
              <label className="text-[#a3c4a3] text-xs font-bold uppercase tracking-widest mb-2 block">Tractor Name</label>
              <div className={`flex items-center gap-3 bg-[#0a150a] border-2 rounded-xl px-4 py-3.5 transition-colors ${
                fieldErrors.tractorName ? 'border-red-800' : 'border-[#2d4a2d] focus-within:border-yellow-600'
              }`}>
                <Tractor className="w-4 h-4 text-[#6b8f6b] shrink-0" />
                <input
                  type="text"
                  placeholder="e.g. Mahindra 575"
                  value={form.tractorName}
                  onChange={e => setForm({ ...form, tractorName: e.target.value })}
                  className="w-full bg-transparent outline-none text-green-100 placeholder-[#3a5a3a] text-sm"
                />
              </div>
              {fieldErrors.tractorName && <p className="text-red-500 text-xs mt-1.5">{fieldErrors.tractorName}</p>}
            </div>

            {/* Tractor Type */}
            <div>
              <label className="text-[#a3c4a3] text-xs font-bold uppercase tracking-widest mb-3 block">Tractor Type</label>
              <div className="grid grid-cols-2 gap-2">
                {tractorTypes.map(type => (
                  <label key={type} className="cursor-pointer">
                    <input
                      type="radio"
                      name="tractorType"
                      value={type}
                      checked={form.tractorType === type}
                      onChange={e => setForm({ ...form, tractorType: e.target.value })}
                      className="sr-only"
                    />
                    <div className={`px-4 py-3 rounded-xl border-2 text-sm font-semibold text-center transition-all ${
                      form.tractorType === type
                        ? 'border-yellow-600 bg-[#1a1200] text-yellow-400'
                        : 'border-[#2d4a2d] text-green-500 hover:border-yellow-800'
                    }`}>
                      {type}
                    </div>
                  </label>
                ))}
              </div>
              {fieldErrors.tractorType && <p className="text-red-500 text-xs mt-1.5">{fieldErrors.tractorType}</p>}
            </div>

            {/* Price Per Hour */}
            <div>
              <label className="text-[#a3c4a3] text-xs font-bold uppercase tracking-widest mb-2 block">Price Per Hour (₹)</label>
              <div className={`flex items-center gap-3 bg-[#0a150a] border-2 rounded-xl px-4 py-3.5 transition-colors ${
                fieldErrors.pricePerHour ? 'border-red-800' : 'border-[#2d4a2d] focus-within:border-yellow-600'
              }`}>
                <span className="text-yellow-500 font-bold text-sm shrink-0">₹</span>
                <input
                  type="number"
                  placeholder="Minimum ₹100"
                  min="100"
                  value={form.pricePerHour}
                  onChange={e => setForm({ ...form, pricePerHour: e.target.value })}
                  className="w-full bg-transparent outline-none text-green-100 placeholder-[#3a5a3a] text-sm"
                />
                <span className="text-[#4b6b4b] text-xs shrink-0">/hr</span>
              </div>
              {fieldErrors.pricePerHour && <p className="text-red-500 text-xs mt-1.5">{fieldErrors.pricePerHour}</p>}
            </div>

            {/* Location */}
            <div>
              <label className="text-[#a3c4a3] text-xs font-bold uppercase tracking-widest mb-2 block">Location</label>
              <div className={`flex items-center gap-3 bg-[#0a150a] border-2 rounded-xl px-4 py-3.5 transition-colors ${
                fieldErrors.location ? 'border-red-800' : 'border-[#2d4a2d] focus-within:border-yellow-600'
              }`}>
                <MapPin className="w-4 h-4 text-[#6b8f6b] shrink-0" />
                <input
                  type="text"
                  placeholder="e.g. Ahmedabad, Gujarat"
                  value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                  className="w-full bg-transparent outline-none text-green-100 placeholder-[#3a5a3a] text-sm"
                />
              </div>
              {fieldErrors.location && <p className="text-red-500 text-xs mt-1.5">{fieldErrors.location}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 text-[#0a150a] font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              {loading
                ? <span className="w-5 h-5 border-2 border-[#0a150a] border-t-transparent rounded-full animate-spin" />
                : <><span>Add Tractor</span><ArrowRight className="w-4 h-4" /></>
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddTractor