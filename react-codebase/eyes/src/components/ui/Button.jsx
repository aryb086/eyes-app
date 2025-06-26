import React from 'react'

function CustomButton({ text, className = "", ...props }) {
  return (
    <div className="flex justify-center">
      <button 
        className={`px-8 py-3 sm:py-3.5 bg-[#9fe7ff] hover:bg-[#89d1e8] text-gray-900 
                  font-bold rounded-lg text-base sm:text-lg md:text-xl tracking-wide uppercase 
                  whitespace-nowrap transition-all duration-300 transform hover:scale-105 ${className}`}
        {...props}
      >
        {text.toUpperCase()}
      </button>
    </div>
  )
}

export default CustomButton