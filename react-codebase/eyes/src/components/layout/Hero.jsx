import React from 'react'
import { ReactTyped } from 'react-typed';
import CustomButton from '../ui/Button.jsx'
import { useNavigate } from 'react-router-dom';

function Hero(){
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate('/start')
  }
  
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
          <div className='text-center mb-3 w-full'>
            <div className='inline-flex items-baseline mx-auto px-4'>
              <p className='text-xl sm:text-3xl md:text-4xl font-bold pr-2'>
                Built for
              </p>
                <ReactTyped 
                  className='text-xl sm:text-3xl md:text-4xl font-bold text-[#9fe7ff] inline-block'
                  strings={['Neighborhoods', 'Cities', 'Communities', 'Schools']} 
                  typeSpeed={120} 
                  backSpeed={140} 
                  loop
                />
            </div>
          </div>
          <p className='text-gray-400 text-lg sm:text-xl md:text-2xl font-medium max-w-2xl mx-auto mb-4'>
            Post Issues in your Community and Help Everyone Stay Safe
          </p>
          <div>
            <CustomButton text='Get Started' onClick={goToLogin}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero