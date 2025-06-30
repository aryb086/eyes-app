import React from 'react'
import CustomButton from '../ui/Button.jsx'

const Start = () => {
  return (
    <div className='flex-col pt-10'>
        <h1 className='md:text-5xl sm:text-4xl text-3xl text-[#9fe7ff] font-bold text-center'>
            CREATE AN ACCOUNT.
        </h1>
        <p className='pt-4 pb-4 text-white font-mono font-semibold text-center md:text-xl'>
            Get Started Today! Create an Account Below:
        </p>
        <div className='flex justify-center pt-4 px-4'>
            <input 
                type='email'
                placeholder='Email' 
                className='md:w-full max-w-sm p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-center text-lg' 
            />
        </div>
        <div className='flex justify-center pt-4 px-4'>
            <input 
                type='password'
                placeholder='Password' 
                className='md:w-full max-w-sm p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-center text-lg' 
            />
        </div>
        <div className='pt-6'>
            <CustomButton text='Create Account'/>
        </div>
    </div>
  )
}

export default Start