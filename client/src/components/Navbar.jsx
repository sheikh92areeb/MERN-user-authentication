import React, {useContext} from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import {AppContent} from '../context/AppContext'
import {toast} from 'react-toastify'
import axios from 'axios'

const Navbar = () => {

  const navigate = useNavigate()
  const {userData, backendUrl, setUserData, setIsLoggedin} = useContext(AppContent)

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;

      const {data} = await axios.post(backendUrl + '/api/auth/send-verify-otp')

      if (data.success) {
        navigate('/email-verify')
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  const logout = async () => {
    try {
      axios.default.withCredentials = true
      const {data} = await axios.post(backendUrl + '/api/auth/logout')
      data.success && setIsLoggedin(false)
      data.success && setUserData(false)
      navigate('/')
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <nav className='w-full flex justify-between items-center p-4 sm:py-2 sm:px-24 sticky top-0 border-b border-b-gray-200 shadow-md'>
        <div className="logo flex gap-3">
            <img src={assets.Logo} alt="Site Logo" className='w-10' />
            <h1 className='text-3xl font-bold text-gray-700' >Auth</h1>
        </div>
        {userData ?
          <div className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group'>
            {userData.name[0].toUpperCase()}
            <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10'>
              <ul className='list-none m-0 p-2 bg-gray-100 text-sm'>
                {!userData.isVerified && <li className='py-1 px-2 hover:bg-gray-200 cursor-pointer'>Verify Email</li> }                
                <li onClick={logout} className='py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10'>Logout</li>
              </ul>
            </div>
          </div>
        : <button onClick={() => navigate('/login')} className='flex items-center gap-2 border border-gray-500 rounded-full px-4 py-1 text-gray-800 hover:bg-gray-100 hover:cursor-pointer transition-all'>
            Login
            <img src={assets.arrow_icon} alt="Icon" />
          </button>
        }
        
    </nav>
  )
}

export default Navbar
