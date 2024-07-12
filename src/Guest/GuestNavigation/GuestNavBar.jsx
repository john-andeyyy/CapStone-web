import React, { useState } from 'react';
import ThemeController from '../GuestComponents/ThemeController';
import { useNavigate } from 'react-router-dom';

export default function GuestNavBar() {
    const navigate = useNavigate()
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="bg-base-100 sticky top-0 z-50">
            <div className="navbar container mx-auto flex items-center justify-between flex-wrap">
                <div className="flex-1">
                    <a className="btn btn-ghost text-xl text-green-400" onClick={() => navigate('/')}>DenTeam</a>
                </div>
                <div className="block lg:hidden">
                    <button onClick={toggleMenu} className="btn btn-ghost text-green-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}></path>
                        </svg>
                    </button>
                </div>
                <div className={`flex-none ${isMenuOpen ? 'block' : 'hidden'} lg:flex lg:items-center lg:w-auto w-full`}>
                    <ul className="menu menu-horizontal px-1 font-semibold space-x-3 lg:space-x-3 flex flex-col lg:flex-row">
                        <li className="mb-2 md:mb-0">
                            <button className="btn btn-ghost text-green-500" onClick={()=> navigate('/')}>HOME</button>
                        </li>
                        <li className="mb-2 md:mb-0">
                            <button className="btn btn-ghost">SERVICES</button>
                        </li>
                        <li className="mb-2 md:mb-0">
                            <button className="btn btn-ghost">CONTACT</button>
                        </li>
                        <li className="mb-2 md:mb-0">
                            <button className="btn btn-outline btn-success" onClick={() => {
                                navigate('/CreateAccount')
                                toggleMenu
                            }}>SIGN UP</button>
                        </li>
                        <li className="mb-2 md:mb-0">
                            <button className="btn btn-success text-white hover:text-black" onClick={() => navigate('/AdminLogin')}>LOGIN</button>
                        </li>
                        <ThemeController />
                    </ul>
                </div>
            </div>
        </div>
    );
}
