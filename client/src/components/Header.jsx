import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContent } from '../context/AppContext'

const Header = () => {
  const {userData} = useContext(AppContent)

  return (
    <div className='flex flex-col items-center mt-15 px-4 text-center text-gray-800'>
        <img src={assets.header_img} alt="Header Image" className='w-36 h-36 rounded-full mb-4'/>

        <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>
            Hey { userData ? userData.name : 'Developer' }!
            <img src={assets.hand_wave} alt="Hand Wave" className='w-8 aspect-square' />
        </h1>

        <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome to Our App</h2>

        <p className='mb-8 max-w-md'>
            Let's start with a quick product tour and we will have you up and running in no time!
        </p>

        <button className='flex gap-2 border border-gray-500 rounded-full px-8 py-2 hover:bg-gray-100 transition-all hover:cursor-pointer'>
            Get Started
            <img src={assets.arrow_icon} alt="Icon" />
        </button>
    </div>
  )
}

export default Header
