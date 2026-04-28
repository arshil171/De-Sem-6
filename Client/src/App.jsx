import React from 'react'
import { Route, Routes } from 'react-router'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ForgotPassword from './pages/ForgotPassword'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/home' element={<><Navbar /><Home /><Footer /></>} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
      </Routes>
    </div>
  )
}

export default App