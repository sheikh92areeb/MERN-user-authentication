import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {

    const navigate = useNavigate()
  return (
    <nav className='w-full flex justify-between items-center p-4 sm:py-2 sm:px-24 sticky top-0 border-b border-b-gray-200 shadow-md'>
        <div className="logo flex gap-3">
            <img src={assets.Logo} alt="Site Logo" className='w-10' />
            <h1 className='text-3xl' >Auth</h1>
        </div>
        <button onClick={() => navigate('/login')} className='flex items-center gap-2 border border-gray-500 rounded-full px-4 py-1 text-gray-800 hover:bg-gray-100 hover:cursor-pointer transition-all'>
            Login
            <img src={assets.arrow_icon} alt="Icon" />
        </button>
    </nav>
  )
}

export default Navbar
