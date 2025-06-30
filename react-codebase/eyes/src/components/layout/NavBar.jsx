import React, { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { useNavigate, useLocation } from 'react-router-dom';

function Navbar(){
    const [nav, setNav] = useState(false)

    const handleNav = () => (
        setNav(!nav)
    )

    const navigate = useNavigate();
    const location = useLocation();

    const navigateTo = (path) => {
        navigate(path);
        setNav(false); // Close mobile menu after navigation
    };

    const isActive = (path) => {
        return location.pathname === path ? 'text-[#9fe7ff]' : '';
    }

    return(
        <div className="flex justify-between items-center h-16 md:h-20 max-w-[1240px] mx-auto px-4 text-white">
            <div className="flex items-center h-full">
                <span className="text-2xl md:text-3xl font-bold text-white">EYES.</span>
            </div>
            <ul className="hidden md:flex items-center h-full space-x-1">
                <li 
                    className={`px-3 py-2 hover:text-[#9fe7ff] cursor-pointer transition-colors ${isActive('/')}`}
                    onClick={() => navigateTo('/')}
                >
                    Home
                </li>
                <li 
                    className={`px-3 py-2 hover:text-[#9fe7ff] cursor-pointer transition-colors ${isActive('/login')}`}
                    onClick={() => navigateTo('/login')}
                >
                    Login
                </li>
                <li 
                    className={`px-3 py-2 hover:text-[#9fe7ff] cursor-pointer transition-colors ${isActive('/start')}`}
                    onClick={() => navigateTo('/start')}
                >
                    Get Started
                </li>
            </ul>
            <div onClick={handleNav} className="block md:hidden z-50">
                {nav ? <AiOutlineClose size={20}/> : <AiOutlineMenu size={20}/>}
            </div>
            <div className={nav ? "fixed left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500 z-40" : "fixed left-[-100%]"}>
                <div className="flex justify-center p-4">
                    <span className="text-3xl font-bold text-[#9fe7ff]">EYES.</span>
                </div>
                <ul className="uppercase p-4">
                    <li 
                    className={`p-4 border-b border-gray-600 hover:text-[#9fe7ff] cursor-pointer transition-colors ${isActive('/')}`}
                    onClick={() => navigateTo('/')}
                >
                    Home
                </li>
                <li 
                    className={`p-4 border-b border-gray-600 hover:text-[#9fe7ff] cursor-pointer transition-colors ${isActive('/login')}`}
                    onClick={() => navigateTo('/login')}
                >
                    Login
                </li>
                <li 
                    className={`p-4 border-b border-gray-600 hover:text-[#9fe7ff] cursor-pointer transition-colors ${isActive('/start')}`}
                    onClick={() => navigateTo('/start')}
                >
                    Get Started
                </li>
                </ul>
            </div>
        </div>
    )
}

export default Navbar