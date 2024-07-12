import React, { useState } from 'react';
import { FaHome, FaCalendarAlt, FaUser, FaFileAlt, FaUserPlus, FaPlus, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false); // State to manage sidebar visibility
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
        if (isOpen) setIsOpen(false); // Close sidebar on navigation if open
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden fixed top-4 left-4 z-50">
                {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
            <div className={`fixed z-50 h-screen w-60 bg-base-200 p-4 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">Alejandria's Dental Clinic</h2>
                </div>
                <div className="flex flex-col items-center mb-8">
                    <div className="avatar">
                        <div className="w-24 rounded-full">
                            <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                        </div>
                    </div>
                    <span className="font-semibold">Boss Karen</span>
                </div>
                <div className="flex-grow">
                    <ul className="space-y-2">
                        <li className="flex items-center p-2 rounded hover:bg-neutral cursor-pointer" onClick={() => handleNavigate('/dashboard')}>
                            <FaHome className="mr-3" />
                            <span>General</span>
                        </li>
                        <li className="flex items-center p-2 rounded hover:bg-neutral cursor-pointer" onClick={() => handleNavigate('/appointments')}>
                            <FaCalendarAlt className="mr-3" />
                            <span>Appointments</span>
                        </li>
                        <li className="flex items-center p-2 rounded hover:bg-neutral cursor-pointer" onClick={() => handleNavigate('/patients')}>
                            <FaUser className="mr-3" />
                            <span>Patients</span>
                        </li>
                        <li className="flex items-center p-2 rounded hover:bg-neutral cursor-pointer" onClick={() => handleNavigate('/medical-requests')}>
                            <FaFileAlt className="mr-3" />
                            <span>Medical Requests</span>
                        </li>
                        <li className="flex items-center p-2 rounded hover:bg-secondary cursor-pointer" onClick={() => handleNavigate('/create-admin')}>
                            <FaUserPlus className="mr-3" />
                            <span>Create New Admin</span>
                        </li>
                        <li className="flex items-center p-2 rounded hover:bg-neutral cursor-pointer" onClick={() => handleNavigate('/Add_Procedure')}>
                            <FaPlus className="mr-3" />
                            <span>Add Procedure</span>
                        </li>
                    </ul>
                </div>
                <div className="mt-4">
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
