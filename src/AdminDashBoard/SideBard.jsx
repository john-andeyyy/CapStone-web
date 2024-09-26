import React, { useEffect, useState } from 'react';
import { FaHome, FaCalendarAlt, FaUser, FaFileAlt, FaUserPlus, FaPlus, FaSignOutAlt, FaBars, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { get_profile } from './Fetchs/Admin/admin_profile';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeItem, setActiveItem] = useState('');
    const [profilePic, setProfilePic] = useState('../../public/default-avatar.jpg');
    const [name, setName] = useState('name');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown
    const navigate = useNavigate();

    const fetchProfile = async () => {
        try {
            const res = await get_profile();
            setProfilePic(res.ProfilePicture || profilePic);
            setName(res.FirstName || 'name');
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

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

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen); // Toggle the dropdown open/close
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden fixed top-4 left-4 z-50"
            >
                {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
            <div className={`fixed z-50 h-screen w-60 bg-base-200 p-4 flex flex-col justify-between transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <div>
                    <div className="flex justify-between items-center mb-8">

                        <button
                            className=""
                            onClick={() => {
                                localStorage.clear();
                                navigate('/');
                                window.location.reload();
                            }}
                        >
                            <span className="material-symbols-outlined text-red-500">
                                logout
                            </span>                        </button>
                        <h2 className="text-xl font-bold hidden md:block">Alejandria's Dental Clinic</h2>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden"
                        >
                            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>
                    <div className="flex flex-col items-center mb-8" onClick={handleImageClick}>
                        <div className="avatar">
                            <div className="w-20 h-20 rounded-full cursor-pointer overflow-hidden">
                                <img src={profilePic} alt="Profile" className="object-cover w-full h-full" />
                            </div>
                        </div>
                        <span className="font-semibold text-center mt-2">{name}</span>
                    </div>
                    <div className="flex-grow">
                        <ul className="space-y-2">
                            <li
                                className={`flex items-center p-2 rounded cursor-pointer ${activeItem === 'general' ? 'bg-neutral text-white' : 'hover:bg-base-300'}`}
                                onClick={() => handleNavigate('/dashboard', 'general')}
                            >
                                <FaHome className="mr-3" />
                                <span className="hidden md:inline">General</span>
                            </li>

                            {/* Appointments Dropdown */}
                            <li className="relative">
                                <div
                                    className={`flex items-center p-2 rounded cursor-pointer ${activeItem === 'appointments' ? 'bg-neutral text-white' : 'hover:bg-base-300'}`}
                                    onClick={toggleDropdown}
                                >
                                    <FaCalendarAlt className="mr-3" />
                                    <span className="hidden md:inline">Appointments</span>
                                    {isDropdownOpen ? <FaChevronUp className="ml-auto" /> : <FaChevronDown className="ml-auto" />}
                                </div>
                                {isDropdownOpen && (
                                    <ul className="ml-8 mt-2 space-y-1">
                                        <li
                                            className={`p-2 rounded cursor-pointer flex items-center ${activeItem === 'appointmentList' ? 'bg-neutral text-white' : 'hover:bg-base-300'}`}
                                            onClick={() => handleNavigate('/appointments', 'appointmentList')}
                                        >
                                            <span className="material-symbols-outlined mr-2">
                                                event_available
                                            </span>
                                            Appointments
                                        </li>
                                        <li
                                            className={`p-2 rounded cursor-pointer flex items-center ${activeItem === 'calendar' ? 'bg-neutral text-white' : 'hover:bg-base-300'}`}
                                            onClick={() => handleNavigate('/CalendarComponent', 'calendar')}
                                        >
                                            <span className="material-symbols-outlined mr-2 ">
                                                calendar_month
                                            </span>
                                            Calendar
                                        </li>
                                    </ul>

                                    
                                )}
                            </li>

                            <li
                                className={`flex items-center p-2 rounded cursor-pointer ${activeItem === 'patients' ? 'bg-neutral text-white' : 'hover:bg-base-300'}`}
                                onClick={() => handleNavigate('/patients', 'patients')}
                            >
                                <FaUser className="mr-3" />
                                <span className="hidden md:inline">Patients</span>
                            </li>

                            <li
                                className={`flex items-center p-2 rounded cursor-pointer ${activeItem === 'medical-requests' ? 'bg-neutral text-white' : 'hover:bg-base-300'}`}
                                onClick={() => handleNavigate('/Medical_requests', 'medical-requests')}
                            >
                                <FaFileAlt className="mr-3" />
                                <span className="hidden md:inline">Medical Requests</span>
                            </li>

                            <li
                                className={`flex items-center p-2 rounded cursor-pointer ${activeItem === 'add-procedure' ? 'bg-neutral text-white' : 'hover:bg-base-300'}`}
                                onClick={() => handleNavigate('/Add_Procedure', 'add-procedure')}
                            >
                                <FaPlus className="mr-3" />
                                <span className="hidden md:inline">Add Procedure</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="py-6">
                    <button
                        className="w-full py-2 bg-red-500 text-white rounded flex items-center justify-center"
                        onClick={() => {
                            localStorage.clear();
                            navigate('/');
                            window.location.reload();
                        }}
                    >
                        <FaSignOutAlt className="mr-2" />
                        <span className="hidden md:inline">Log out</span>
                    </button>
                </div>
            </div>
        </>
    );
}
