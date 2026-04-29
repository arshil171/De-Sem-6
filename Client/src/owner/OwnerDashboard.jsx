import React, { useEffect, useState } from 'react'
import { Link } from 'react-router'
import axios from 'axios'
import {
  Tractor, MapPin, Plus, Pencil, Trash2,
  ToggleLeft, ToggleRight, CheckCircle2, X
} from 'lucide-react'

const OwnerDashboard = () => {
  const [tractors, setTractors]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [success, setSuccess]       = useState('')
  const [editTractor, setEditTractor] = useState(null)
  const [editForm, setEditForm]     = useState({})
  const [updating, setUpdating]     = useState(false)
  const [deleteId, setDeleteId]     = useState(null)

  const tractorTypes = ['Ploughing', 'Harvesting', 'Seeding', 'Spraying']

  useEffect(() => { fetchMyTractors() }, [])

  const fetchMyTractors = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/tractorAdd/getMyTractor`,
        { withCredentials: true }
      )
      setTractors(res.data.data)
    } catch {
      setError('Failed to load your tractors.')
    } finally {
      setLoading(false)
    }
  }

  const flash = (msg) => {
    setSuccess(msg)
    setTimeout(() => setSuccess(''), 3000)
  }

  // Toggle availability
  const handleToggle = async (id) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/tractorAdd/toggle/${id}`,
        {},
        { withCredentials: true }
      )
      setTractors(prev => prev.map(t => t._id === id ? res.data.data : t))
      flash('Availability updated!')
    } catch {
      setError('Failed to toggle availability.')
    }
  }

  // Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/tractorAdd/deleteTractor/${id}`,
        { withCredentials: true }
      )
      setTractors(prev => prev.filter(t => t._id !== id))
      setDeleteId(null)
      flash('Tractor removed successfully!')
    } catch {
      setError('Failed to delete tractor.')
    }
  }

  // Open edit modal
  const openEdit = (tractor) => {
    setEditTractor(tractor)
    setEditForm({
      tractorName:  tractor.tractorName,
      tractorType:  tractor.tractorType,
      pricePerHour: tractor.pricePerHour,
      location:     tractor.location,
    })
  }

  // Submit edit
  const handleUpdate = async (e) => {
    e.preventDefault()
    setUpdating(true)
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/tractorAdd/updateTractor/${editTractor._id}`,
        editForm,
        { withCredentials: true }
      )
      setTractors(prev => prev.map(t => t._id === editTractor._id ? res.data.data : t))
      setEditTractor(null)
      flash('Tractor updated successfully!')
    } catch {
      setError('Failed to update tractor.')
    } finally {
      setUpdating(false)
    }
  }

  const typeColors = {
    Ploughing:  'bg-yellow-900 text-yellow-300',
    Harvesting: 'bg-green-900  text-green-300',
    Seeding:    'bg-blue-900   text-blue-300',
    Spraying:   'bg-purple-900 text-purple-300',
  }

  return (
    <div className="min-h-screen bg-[#0a150a] pb-16">

      {/* Header */}
      <div className="bg-[#111f11] border-b border-yellow-900/40 px-6 py-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-yellow-600 text-xs font-bold uppercase tracking-widest mb-2">Driver Panel</p>
            <h1 className="text-3xl font-black text-white">My Tractors</h1>
          </div>
          <Link
            to="/owner/add-tractor"
            className="flex items-center gap-2 px-5 py-3 bg-yellow-600 hover:bg-yellow-500 text-[#0a150a] font-bold text-sm rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Tractor
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-8">

        {/* Alerts */}
        {success && (
          <div className="flex items-center gap-3 bg-[#162716] border border-green-800 text-green-400 text-sm px-4 py-3 rounded-xl mb-5">
            <CheckCircle2 className="w-4 h-4 text-yellow-500 shrink-0" />{success}
          </div>
        )}
        {error && (
          <div className="bg-red-950 border border-red-900 text-red-400 text-sm px-4 py-3 rounded-xl mb-5">{error}</div>
        )}

        {loading && (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && tractors.length === 0 && (
          <div className="text-center py-24">
            <Tractor className="w-16 h-16 text-[#2d4a2d] mx-auto mb-4" />
            <p className="text-[#4b6b4b] text-lg font-semibold">No tractors added yet</p>
            <Link to="/owner/add-tractor" className="text-yellow-500 text-sm hover:underline mt-2 inline-block">
              Add your first tractor →
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tractors.map(tractor => (
            <div key={tractor._id} className="bg-[#111f11] border border-[#1f3a1f] rounded-2xl p-6 flex flex-col gap-4">

              {/* Top Row */}
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 bg-[#1a2e1a] border border-[#2d4a2d] rounded-xl flex items-center justify-center">
                  <Tractor className="w-6 h-6 text-yellow-500" />
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${typeColors[tractor.tractorType]}`}>
                  {tractor.tractorType}
                </span>
              </div>

              {/* Info */}
              <div>
                <h3 className="text-white font-bold text-lg">{tractor.tractorName}</h3>
                <div className="flex items-center gap-1.5 mt-1 text-green-600 text-sm">
                  <MapPin className="w-3.5 h-3.5 text-yellow-700" />{tractor.location}
                </div>
                <p className="text-yellow-400 font-black text-xl mt-2">₹{tractor.pricePerHour}<span className="text-[#4b6b4b] text-xs font-normal">/hr</span></p>
              </div>

              {/* Toggle Availability */}
              <button
                onClick={() => handleToggle(tractor._id)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 ${
                  tractor.availability
                    ? 'bg-green-900/30 border-green-800 text-green-400'
                    : 'bg-red-950/30 border-red-900 text-red-400'
                }`}
              >
                <span className="text-sm font-semibold">
                  {tractor.availability ? 'Available' : 'Unavailable'}
                </span>
                {tractor.availability
                  ? <ToggleRight className="w-6 h-6 text-green-400" />
                  : <ToggleLeft className="w-6 h-6 text-red-400" />
                }
              </button>

              {/* Actions */}
              <div className="flex gap-2 pt-1 border-t border-[#1f3a1f]">
                <button
                  onClick={() => openEdit(tractor)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1a2e1a] hover:bg-yellow-900/30 border border-[#2d4a2d] hover:border-yellow-800 text-yellow-400 text-sm font-semibold transition-all"
                >
                  <Pencil className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => setDeleteId(tractor._id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-950/20 hover:bg-red-950/40 border border-red-900/40 hover:border-red-800 text-red-400 text-sm font-semibold transition-all"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Edit Modal ── */}
      {editTractor && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#111f11] border border-[#1f3a1f] rounded-2xl p-7 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-black text-xl">Edit Tractor</h2>
              <button onClick={() => setEditTractor(null)} className="text-[#4b6b4b] hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="text-[#a3c4a3] text-xs font-bold uppercase tracking-widest mb-2 block">Tractor Name</label>
                <input
                  type="text"
                  value={editForm.tractorName}
                  onChange={e => setEditForm({ ...editForm, tractorName: e.target.value })}
                  className="w-full bg-[#0a150a] border-2 border-[#2d4a2d] focus:border-yellow-600 rounded-xl px-4 py-3 text-green-100 text-sm outline-none transition-colors"
                />
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
                        editForm.tractorType === type
                          ? 'border-yellow-600 bg-[#1a1200] text-yellow-400'
                          : 'border-[#2d4a2d] text-green-500 hover:border-yellow-800'
                      }`}>{type}</div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[#a3c4a3] text-xs font-bold uppercase tracking-widest mb-2 block">Price Per Hour (₹)</label>
                <input
                  type="number" min="100"
                  value={editForm.pricePerHour}
                  onChange={e => setEditForm({ ...editForm, pricePerHour: e.target.value })}
                  className="w-full bg-[#0a150a] border-2 border-[#2d4a2d] focus:border-yellow-600 rounded-xl px-4 py-3 text-green-100 text-sm outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-[#a3c4a3] text-xs font-bold uppercase tracking-widest mb-2 block">Location</label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                  className="w-full bg-[#0a150a] border-2 border-[#2d4a2d] focus:border-yellow-600 rounded-xl px-4 py-3 text-green-100 text-sm outline-none transition-colors"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditTractor(null)}
                  className="flex-1 py-3 rounded-xl border border-[#2d4a2d] text-green-400 text-sm font-semibold hover:bg-[#1a2e1a] transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={updating}
                  className="flex-1 py-3 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-[#0a150a] text-sm font-extrabold transition-colors disabled:opacity-50">
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#111f11] border border-red-900 rounded-2xl p-7 w-full max-w-sm text-center">
            <div className="w-14 h-14 bg-red-950 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-red-400" />
            </div>
            <h2 className="text-white font-black text-xl mb-2">Delete Tractor?</h2>
            <p className="text-[#4b6b4b] text-sm mb-6">This action cannot be undone. The tractor will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 py-3 rounded-xl border border-[#2d4a2d] text-green-400 text-sm font-semibold hover:bg-[#1a2e1a] transition-colors">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteId)}
                className="flex-1 py-3 rounded-xl bg-red-700 hover:bg-red-600 text-white text-sm font-extrabold transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OwnerDashboard