import React, {useState} from "react";
import {AiOutlineClose, AiOutlineMenu} from 'react-icons/ai';
import logo from '../assets/eyes_logo.png';

const Navbar=() => {
    const [nav, setNav] = useState(false)

    const handleNav = () => (
        setNav(!nav)
    )

    return(
        <div className="flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4 text-white">
            <div className="flex items-center">
                <img 
                    src={logo}
                    alt='EYES Logo'
                    className="top-10 h-24 w-auto"
                />
            </div>
            <ul className="hidden md:flex">
                <li className="p-4 hover:text-[#00b6df] cursor-pointer transition-colors">Home</li>
                <li className="p-4 hover:text-[#00b6df] cursor-pointer transition-colors">Login</li>
                <li className="p-4 hover:text-[#00b6df] cursor-pointer transition-colors">About</li>
                <li className="p-4 hover:text-[#00b6df] cursor-pointer transition-colors">Support</li>
            </ul>
            <div onClick={handleNav} className="block md:hidden z-50">
                {nav ? <AiOutlineClose size={24}/> : <AiOutlineMenu size={24}/>}
            </div>
            <div className={nav ? "fixed left-0 top-0 w-[60%] border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500" : "fixed left-[-100%]"}>
                <img 
                    src={logo}
                    alt='EYES Logo'
                    className="top-10 h-24 w-auto"
                />
                <ul className="uppercase p-4">
                    <li className="p-4 border-b border-gray-600">Home</li>
                    <li className="p-4 border-b border-gray-600">Login</li>
                    <li className="p-4 border-b border-gray-600">About</li>
                    <li className="p-4">Suport</li>
                </ul>
            </div>
        </div>
    )
}

export default Navbar