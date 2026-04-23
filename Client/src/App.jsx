import React from 'react'
import { Route, Routes } from 'react-router'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/home' element={<><Navbar/> <Home/> <Footer/></>}/>
        {/* <Route path='/forgotPassword' element={<Register/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/register' element={<Register/>}/> */}
      </Routes>
    </div>
  )
}

export default App