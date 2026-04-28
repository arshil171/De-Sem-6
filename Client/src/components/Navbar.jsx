import React from 'react'
import { Link, useNavigate } from 'react-router'
import logo from '../assets/images/Logo.png'
import axios from 'axios'

const Navbar = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/logout`,
        {},
        { withCredentials: true }
      )
      localStorage.removeItem("token")
      navigate("/login")
    } catch (err) {
      console.error("Logout failed", err)
    }
  }
  const token = localStorage.getItem("token")

  return (
    <nav className="bg-green-800 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo + Brand */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="" className="h-9 w-9 object-contain rounded-lg bg-green-100 p-1"/>
          <span className="text-white text-xl font-bold tracking-wide">FarmTrac</span>
        </Link>

        <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
          <li><Link to="/home" className="text-green-100 hover:text-white text-sm font-medium transition-colors duration-200 hover:border-b-2 hover:border-green-300 pb-0.5"> Home </Link></li>
          <li><Link to="/products" className="text-green-100 hover:text-white text-sm font-medium transition-colors duration-200 hover:border-b-2 hover:border-green-300 pb-0.5">Products</Link></li>
          <li> <Link to="/my-bookings" className="text-green-100 hover:text-white text-sm font-medium transition-colors duration-200 hover:border-b-2 hover:border-green-300 pb-0.5">My Bookings</Link></li>
          <li> <Link to="/dashboard" className="text-green-100 hover:text-white text-sm font-medium transition-colors duration-200 hover:border-b-2 hover:border-green-300 pb-0.5">Dashboard</Link></li>
        </ul>

        <div className="hidden md:flex items-center gap-3">
          {!token ? ( <Link to="/login" className="px-5 py-2 rounded-full border border-green-300 text-white text-sm font-medium hover:bg-green-700 transition-colors duration-200"> Login </Link>
          ) : (
            <button onClick={handleLogout} className="px-5 py-2 rounded-full bg-green-600 text-white text-sm font-medium hover:bg-green-500 transition-colors duration-200"> Logout</button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar