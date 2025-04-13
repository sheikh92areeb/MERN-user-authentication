import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Login from './Pages/Login'
import EmailVerify from './Pages/EmailVerify'
import ResetPassword from './Pages/ResetPassword'

function App() {
  
  return (
    <>
      <div>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/email-verify' element={<EmailVerify/>} />
          <Route path='/reset-password' element={<ResetPassword/>} />
        </Routes>
      </div>
    </>
  )
}

export default App
