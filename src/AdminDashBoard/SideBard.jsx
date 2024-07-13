import React, { useState } from 'react';
import { FaHome, FaCalendarAlt, FaUser, FaFileAlt, FaUserPlus, FaPlus, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeItem, setActiveItem] = useState('');
    const navigate = useNavigate();

    const handleNavigate = (path, item) => {
        setActiveItem(item);
        navigate(path);
        if (isOpen) setIsOpen(false);
    };

    const handleImageClick = () => {
        setActiveItem('');
        navigate('/ProfilePage');
        if (isOpen) setIsOpen(false);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden fixed top-4 left-4 z-50">
                {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
            <div className={`fixed z-50 h-screen w-60 bg-base-200 p-4 flex flex-col justify-between transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <div>
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold">Alejandria's Dental Clinic</h2>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden">
                            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>
                    <div className="flex flex-col items-center mb-8" onClick={handleImageClick}>
                        <div className="avatar">
                            <div className="w-24 rounded-full cursor-pointer">
                                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="Profile" />
                            </div>
                        </div>
                        <span className="font-semibold">Boss Karen</span>
                    </div>
                    <div className="flex-grow">
                        <ul className="space-y-2">
                            <li
                                className={`flex items-center p-2 rounded cursor-pointer ${activeItem === 'general' ? 'bg-neutral' : 'hover:bg-neutral'}`}
                                onClick={() => handleNavigate('/dashboard', 'general')}
                            >
                                <FaHome className="mr-3" />
                                <span>General</span>
                            </li>
                            <li
                                className={`flex items-center p-2 rounded cursor-pointer ${activeItem === 'appointments' ? 'bg-neutral' : 'hover:bg-neutral'}`}
                                onClick={() => handleNavigate('/appointments', 'appointments')}
                            >
                                <FaCalendarAlt className="mr-3" />
                                <span>Appointments</span>
                            </li>
                            <li
                                className={`flex items-center p-2 rounded cursor-pointer ${activeItem === 'patients' ? 'bg-neutral' : 'hover:bg-neutral'}`}
                                onClick={() => handleNavigate('/patients', 'patients')}
                            >
                                <FaUser className="mr-3" />
                                <span>Patients</span>
                            </li>
                            <li
                                className={`flex items-center p-2 rounded cursor-pointer ${activeItem === 'medical-requests' ? 'bg-neutral' : 'hover:bg-neutral'}`}
                                onClick={() => handleNavigate('/Medical_requests', 'medical-requests')}
                            >
                                <FaFileAlt className="mr-3" />
                                <span>Medical Requests</span>
                            </li>
                            <li
                                className={`flex items-center p-2 rounded cursor-pointer ${activeItem === 'create-admin' ? 'bg-neutral' : 'hover:bg-neutral'}`}
                                onClick={() => handleNavigate('/create-admin', 'create-admin')}
                            >
                                <FaUserPlus className="mr-3" />
                                <span>Create New Admin <br />(put in the profile) </span>
                            </li>
                            <li
                                className={`flex items-center p-2 rounded cursor-pointer ${activeItem === 'add-procedure' ? 'bg-neutral' : 'hover:bg-neutral'}`}
                                onClick={() => handleNavigate('/Add_Procedure', 'add-procedure')}
                            >
                                <FaPlus className="mr-3" />
                                <span>Add Procedure</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="">
                    <button className="w-full py-2 bg-red-500 text-white rounded flex items-center justify-center" onClick={() => {
                        localStorage.clear();
                        navigate('/');
                        window.location.reload();
                    }}>
                        <FaSignOutAlt className="mr-2" />
                        Log out
                    </button>
                </div>
            </div>
        </>
    );
}
