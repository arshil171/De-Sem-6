// import React from 'react'
// import { Route, Routes } from 'react-router'
// import Login from './pages/Login'
// import Register from './pages/Register'
// import Home from './pages/Home'
// import Navbar from './components/Navbar'
// import Footer from './components/Footer'
// import ForgotPassword from './pages/ForgotPassword'

// const App = () => {
//   return (
//     <div>
//       <Routes>
//         <Route path='/home' element={<><Navbar /><Home /><Footer /></>} />
//         <Route path='/login' element={<Login />} />
//         <Route path='/register' element={<Register />} />
//         <Route path='/forgot-password' element={<ForgotPassword />} />
//       </Routes>
//     </div>
//   )
// }

// export default App

import React from 'react'
import { Route, Routes } from 'react-router'
import Login          from './pages/Login'
import Register       from './pages/Register'
import Home           from './pages/Home'
import ForgotPassword from './pages/ForgotPassword'
import TractorList    from './pages/TractorList'
import BookTractor    from './pages/BookTractor'
import MyBookings     from './pages/MyBookings'
import OwnerDashboard from './owner/OwnerDashboard'
import AddTractor     from './owner/AddTractor'
import Navbar         from './components/Navbar'
import Footer         from './components/Footer'

const Layout = ({ children }) => (
  <><Navbar />{children}<Footer /></>
)

const App = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path='/login'           element={<Login />} />
      <Route path='/register'        element={<Register />} />
      <Route path='/forgot-password' element={<ForgotPassword />} />

      {/* With Navbar + Footer */}
      <Route path='/'                element={<Layout><Home /></Layout>} />
      <Route path='/home'            element={<Layout><Home /></Layout>} />
      <Route path='/tractors'        element={<Layout><TractorList /></Layout>} />
      <Route path='/book-tractor/:id' element={<Layout><BookTractor /></Layout>} />
      <Route path='/my-bookings'     element={<Layout><MyBookings /></Layout>} />

      {/* Driver routes */}
      <Route path='/owner/dashboard'  element={<Layout><OwnerDashboard /></Layout>} />
      <Route path='/owner/add-tractor' element={<Layout><AddTractor /></Layout>} />
    </Routes>
  )
}

export default App