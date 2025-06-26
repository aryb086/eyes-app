import React from 'react'
import { ReactTyped } from 'react-typed';
import CustomButton from '../ui/Button.jsx'

const Hero = () => {
  return (
    <div className='text-white text-center h-screen flex items-center justify-center'>
      <div className='max-w-[800px] w-full px-4 sm:px-6 -mt-40'>
        <div className='space-y-4'>
          <p className='text-[#9fe7ff] font-bold text-lg sm:text-xl md:text-2xl mb-1'>
            KNOW YOUR COMMUNITY
          </p>
          <h1 className='text-4xl sm:text-6xl md:text-7xl font-bold mb-2'>
            EYES.
          </h1>
          <div className='flex justify-center items-center space-x-2 mb-3'>
            <p className='text-xl sm:text-3xl md:text-4xl font-bold'>
              Built for
            </p>
            <ReactTyped 
              className='text-xl sm:text-3xl md:text-4xl font-bold text-[#9fe7ff] min-w-[200px] text-left'
              strings={['Neighborhoods', 'Cities', 'Communities', 'Schools']} 
              typeSpeed={120} 
              backSpeed={140} 
              loop
            />
          </div>
          <p className='text-gray-400 text-lg sm:text-xl md:text-2xl font-medium max-w-2xl mx-auto mb-4'>
            Post Issues in your Community and Help Everyone Stay Safe
          </p>
          <div>
            <CustomButton text='Get Started'/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero