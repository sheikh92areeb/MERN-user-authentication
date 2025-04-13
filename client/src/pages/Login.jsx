import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()
  const [state, setState] = useState('Sign Up')
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <div className='flex justify-center items-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
      <div onClick={() => navigate('/')} className="logo flex gap-3 absolute left-5 sm:left-20 top-5 cursor-pointer">
        <img src={assets.Logo} alt="Logo" className='w-8 sm:w-10' />
        <h1 className='text-3xl' >Auth</h1>
      </div>

      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>
          {state === 'Sign Up'? 'Create Account': 'Login'}
        </h2>

        <p className='text-center text-sm mb-6'>
          {state === 'Sign Up'? 'Create Your Account': 'Login to Your Account!'}
        </p>

        <form>
          {state === 'Sign Up' && (
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.person_icon} alt="Person Icon" />
            <input onChange={e => setName(e.target.value)} value={name} type="text" placeholder='Full Name' required className='bg-transparent outline-none' />
          </div>
          )}

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt="Mail Icon" />
            <input onChange={e => setEmail(e.target.value)} value={email} type="email" placeholder='Email' required className='bg-transparent outline-none' />
          </div>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt="Lock Icon" />
            <input onChange={e => setPassword(e.target.value)} value={password} type="password" placeholder='Password' required className='bg-transparent outline-none' />
          </div>

          <p onClick={()=> navigate('/reset-password')} className='mb-4 text-indigo-500 cursor-pointer'>Forgot Password?</p>

          <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium cursor-pointer'>
            {state}
          </button>
        </form>

        {state === 'Sign Up' ? (
          <p className='text-gray-400 text-center text-xs mt-4'>
            Already Have an Account? {' '} 
            <span onClick={()=> setState("Login")} className='text-blue-400 cursor-pointer underline'>Login Here</span>
          </p>) 
        :(
          <p className='text-gray-400 text-center text-xs mt-4'>
            Don't Have an Account? {' '} 
            <span onClick={()=> setState("Sign Up")} className='text-blue-400 cursor-pointer underline'>Sign Up</span>
          </p>
        )}                
      </div>
    </div>
  )
}

export default Login
