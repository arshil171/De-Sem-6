import React, { useEffect, useState } from 'react'
import { Link } from 'react-router'
import axios from 'axios'
import { MapPin, Clock, Tractor, Search, Filter, Star } from 'lucide-react'

const TractorList = () => {
  const [tractors, setTractors]   = useState([])
  const [filtered, setFiltered]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [error, setError]         = useState('')

  const types = ['All', 'Ploughing', 'Harvesting', 'Seeding', 'Spraying']

  useEffect(() => {
    fetchTractors()
  }, [])

  useEffect(() => {
    let result = tractors
    if (search.trim())
      result = result.filter(t =>
        t.tractorName.toLowerCase().includes(search.toLowerCase()) ||
        t.location.toLowerCase().includes(search.toLowerCase())
      )
    if (typeFilter !== 'All')
      result = result.filter(t => t.tractorType === typeFilter)
    setFiltered(result)
  }, [search, typeFilter, tractors])

  const fetchTractors = async () => {
    try {
      setLoading(true)
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/tractorAdd/getTractors`,
        { withCredentials: true }
      )
      setTractors(res.data.data)
      setFiltered(res.data.data)
    } catch (err) {
      setError('Failed to load tractors.')
    } finally {
      setLoading(false)
    }
  }

  const typeColors = {
    Ploughing:  'bg-yellow-900 text-yellow-300',
    Harvesting: 'bg-green-900  text-green-300',
    Seeding:    'bg-blue-900   text-blue-300',
    Spraying:   'bg-purple-900 text-purple-300',
  }

  return (
    <div className="min-h-screen bg-[#0a150a] text-green-100 pb-16">

      {/* Header */}
      <div className="bg-[#111f11] border-b border-yellow-900/40 px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-yellow-600 text-xs font-bold uppercase tracking-widest mb-2">Browse Equipment</p>
          <h1 className="text-3xl font-black text-white mb-6">Available Tractors</h1>

          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-3 flex-1 bg-[#0a150a] border-2 border-[#2d4a2d] focus-within:border-yellow-600 rounded-xl px-4 py-3 transition-colors">
              <Search className="w-4 h-4 text-[#6b8f6b] shrink-0" />
              <input
                type="text"
                placeholder="Search by name or location..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-transparent outline-none text-green-100 placeholder-[#3a5a3a] text-sm"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {types.map(type => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-200 ${
                    typeFilter === type
                      ? 'bg-yellow-600 border-yellow-600 text-[#0a150a]'
                      : 'border-[#2d4a2d] text-green-400 hover:border-yellow-700 hover:text-yellow-400'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8">
        {loading && (
          <div className="flex justify-center items-center py-24">
            <div className="w-10 h-10 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="bg-red-950 border border-red-900 text-red-400 px-5 py-4 rounded-xl text-sm mb-6">
            {error}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-24">
            <Tractor className="w-16 h-16 text-[#2d4a2d] mx-auto mb-4" />
            <p className="text-[#4b6b4b] text-lg font-semibold">No tractors found</p>
            <p className="text-[#3a5a3a] text-sm mt-1">Try a different search or filter</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(tractor => (
            <div
              key={tractor._id}
              className="bg-[#111f11] border border-[#1f3a1f] hover:border-yellow-800 rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 group"
            >
              {/* Top */}
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 bg-[#1a2e1a] border border-[#2d4a2d] group-hover:border-yellow-800 rounded-xl flex items-center justify-center transition-colors">
                  <Tractor className="w-6 h-6 text-yellow-500" />
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${typeColors[tractor.tractorType]}`}>
                  {tractor.tractorType}
                </span>
              </div>

              {/* Info */}
              <div>
                <h3 className="text-white font-bold text-lg leading-tight">{tractor.tractorName}</h3>
                <div className="flex items-center gap-1.5 mt-1.5 text-green-600 text-sm">
                  <MapPin className="w-3.5 h-3.5 text-yellow-700" />
                  {tractor.location}
                </div>
              </div>

              {/* Driver */}
              <div className="flex items-center gap-2 bg-[#0d1a0d] rounded-lg px-3 py-2">
                <div className="w-7 h-7 rounded-full bg-yellow-700 flex items-center justify-center text-[#0a150a] text-xs font-extrabold">
                  {tractor.driverId?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-green-300 text-xs font-semibold">{tractor.driverId?.name}</p>
                  <p className="text-[#4b6b4b] text-[11px]">Verified Driver</p>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-yellow-400 text-xs font-bold">4.8</span>
                </div>
              </div>

              {/* Price + max hours */}
              <div className="flex items-center justify-between border-t border-[#1f3a1f] pt-3">
                <div>
                  <span className="text-yellow-400 text-xl font-black">₹{tractor.pricePerHour}</span>
                  <span className="text-[#4b6b4b] text-xs"> /hr</span>
                </div>
                <div className="flex items-center gap-1 text-[#4b6b4b] text-xs">
                  <Clock className="w-3.5 h-3.5" />
                  Max {tractor.maxHoursPerBooking}h
                </div>
              </div>

              {/* Book Button */}
              <Link
                to={`/book-tractor/${tractor._id}`}
                className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-[#0a150a] font-extrabold text-sm rounded-xl text-center transition-colors duration-200"
              >
                Book Now
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TractorList