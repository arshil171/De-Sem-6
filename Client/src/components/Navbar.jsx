import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import logo from '../assets/images/Logo.png'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/logout`,
        {},
        { withCredentials: true }
      )
    } catch (err) {
      console.error(err)
    } finally {
      logout()
      navigate('/login')
      setMenuOpen(false)
    }
  }

  // FARMER links
  const farmerLinks = [
    { label: 'Home',        to: '/home' },
    { label: 'Tractors',    to: '/tractors' },
    { label: 'My Bookings', to: '/my-bookings' },
    { label: 'Marketplace', to: '/marketplace' },
    { label: 'About Us',    to: '/about' },   // 
  ]

  //  DRIVER links 
  const driverLinks = [
    { label: 'Home',        to: '/home' },
    { label: 'Dashboard',   to: '/owner/dashboard' },
    { label: 'Add Tractor', to: '/owner/add-tractor' },
    { label: 'About Us',    to: '/about' },  
  ]

  // ADMIN links
  const adminLinks = [
    { label: 'Dashboard', to: '/admin/dashboard' },
    { label: 'Users',     to: '/admin/users' },
    { label: 'Bookings',  to: '/admin/bookings' },
    { label: 'Tractors',  to: '/admin/tractors' },
    { label: 'Products',  to: '/admin/products' },
  ]

  // GUEST links
  const guestLinks = [
    { label: 'Home',     to: '/home' },
    { label: 'About Us', to: '/about' },   
  ]

  const getLinks = () => {
    if (user?.role === 'farmer') return farmerLinks
    if (user?.role === 'driver') return driverLinks
    if (user?.role === 'admin')  return adminLinks
    return guestLinks
  }

  const getRoleBadge = () => {
    if (user?.role === 'farmer')
      return (
        <span className="text-[10px] bg-green-900 text-yellow-300 font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
          Farmer
        </span>
      )
    if (user?.role === 'driver')
      return (
        <span className="text-[10px] bg-yellow-900 text-yellow-200 font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
          Driver
        </span>
      )
    if (user?.role === 'admin')
      return (
        <span className="text-[10px] bg-red-900 text-red-200 font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
          Admin
        </span>
      )
    return null
  }

  return (
    <nav className="bg-[#111f11] border-b-2 border-yellow-700 shadow-xl sticky top-0 z-50">
      <div className="h-0.5 bg-yellow-600 w-full" />

      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">

        {/* ── Logo ── */}
        <Link to="/home" className="flex items-center gap-3 shrink-0">
          <img
            src={logo}
            alt="FarmTrac"
            className="h-12 w-12 object-contain"
            onError={(e) => { e.target.style.display = 'none' }}
          />
          <div className="hidden sm:block">
            <p className="text-yellow-400 text-lg font-extrabold tracking-wide leading-none">
              Farm<span className="text-white">TRAC</span>
            </p>
            <p className="text-yellow-700 text-[9px] tracking-[3px] uppercase mt-0.5">
              Smart Farming
            </p>
          </div>
        </Link>

        {/* ── Desktop Nav Links ── */}
        <ul className="hidden lg:flex items-center gap-7 list-none m-0 p-0">
          {getLinks().map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className="text-green-300 hover:text-yellow-400 text-sm font-medium transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-500 group-hover:w-full transition-all duration-300" />
              </Link>
            </li>
          ))}
        </ul>

        {/* ── Desktop Right Side ── */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-yellow-600 flex items-center justify-center text-[#0a150a] text-sm font-extrabold shrink-0">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-white text-sm font-semibold">{user.name}</span>
                  {getRoleBadge()}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-5 py-2 rounded-full bg-yellow-600 hover:bg-yellow-500 text-[#0a150a] text-sm font-bold transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-full border-2 border-yellow-600 text-yellow-400 hover:bg-yellow-600 hover:text-[#0a150a] text-sm font-bold transition-all duration-200"
              >
                Login
              </Link>
              <Link
                to="/register?role=farmer"
                className="px-4 py-2 rounded-full bg-green-800 hover:bg-green-700 text-yellow-300 text-xs font-bold transition-colors duration-200 flex items-center gap-1.5"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Farmer
              </Link>
              <Link
                to="/register?role=driver"
                className="px-4 py-2 rounded-full bg-yellow-700 hover:bg-yellow-600 text-white text-xs font-bold transition-colors duration-200 flex items-center gap-1.5"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M3 17h4a2 2 0 002-2V9a2 2 0 00-2-2H3"/>
                  <circle cx="7" cy="17" r="2"/>
                  <path d="M14 17h4"/>
                  <circle cx="17" cy="17" r="2"/>
                  <path d="M9 9h6l2 4H9V9z"/>
                </svg>
                Driver
              </Link>
            </div>
          )}
        </div>

        {/* ── Hamburger ── */}
        <button
          className="lg:hidden text-yellow-400 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div className="lg:hidden bg-[#0d1a0d] border-t border-green-900 px-6 pb-6 pt-4 flex flex-col gap-4">

          {user && (
            <div className="flex items-center gap-3 pb-3 border-b border-green-900">
              <div className="w-9 h-9 rounded-full bg-yellow-600 flex items-center justify-center text-[#0a150a] font-extrabold shrink-0">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-white text-sm font-semibold">{user.name}</p>
                {getRoleBadge()}
              </div>
            </div>
          )}

          {getLinks().map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-green-300 hover:text-yellow-400 text-sm font-medium transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <div className="flex flex-col gap-2.5 pt-3 border-t border-green-900">
            {user ? (
              <button
                onClick={handleLogout}
                className="py-2.5 rounded-full bg-yellow-600 text-[#0a150a] font-bold text-sm hover:bg-yellow-500 transition-colors"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="py-2.5 rounded-full border-2 border-yellow-600 text-yellow-400 text-sm font-bold text-center hover:bg-yellow-600 hover:text-[#0a150a] transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register?role=farmer"
                  onClick={() => setMenuOpen(false)}
                  className="py-2.5 rounded-full bg-green-800 text-yellow-300 text-sm font-bold text-center hover:bg-green-700 transition-colors"
                >
                  Register as Farmer
                </Link>
                <Link
                  to="/register?role=driver"
                  onClick={() => setMenuOpen(false)}
                  className="py-2.5 rounded-full bg-yellow-700 text-white text-sm font-bold text-center hover:bg-yellow-600 transition-colors"
                >
                  Register as Driver
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar