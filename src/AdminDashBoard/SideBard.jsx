import React, { useEffect, useState } from 'react';
import { FaHome, FaCalendarAlt, FaUser, FaFileAlt, FaUserPlus, FaPlus, FaSignOutAlt, FaBars, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { get_profile } from './Fetchs/Admin/admin_profile';
import ThemeController from '../Guest/GuestComponents/ThemeController';
import Daisyui_modal from './Components/Daisyui_modal';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeItem, setActiveItem] = useState('');
    const [profilePic, setProfilePic] = useState('../../public/default-avatar.jpg');
    const [name, setName] = useState('name');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
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
        console.log('get data from the side bar fetching');
    }, []);

    const handleNavigate = (path, item) => {
        setActiveItem(item);
        navigate(path);

        if (item !== 'appointmentList' && item !== 'calendar') {
            setIsDropdownOpen(false);
        }

        if (isOpen) setIsOpen(false);
    };

    const handleImageClick = () => {
        setActiveItem('');
        navigate('/ProfilePage');
        if (isOpen) setIsOpen(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
        window.location.reload();
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden fixed top-4 left-4 z-50 text-primary"
            >
                {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>

            <div className={`fixed z-20 h-screen w-60 bg-primary p-4 flex flex-col justify-between transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <div>
                    <div className="flex justify-between items-center mb-8">
                        <button className="" onClick={() => setIsModalOpen(true)}>
                            <span className="material-symbols-outlined text-red-500">
                                logout
                            </span>
                        </button>

                        <h2 className="text-xl font-bold hidden md:block"><span className='text-white'>Alejandria's Dental</span> Clinic</h2>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden"
                        >
                            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>
                    <div className="flex flex-col items-center mb-8" onClick={handleImageClick}>
                        <div className="avatar">
                            <div className="w-20 h-20 rounded-full cursor-pointer overflow-hidden ">
                                <img src={profilePic} alt="Profile" className="object-cover w-full h-full" />
                            </div>
                        </div>
                        <span className="font-semibold text-center mt-2 text-white ">{name}</span>
                    </div>
                    <div className="flex-grow text-white">
                        <ul className="space-y-2">
                            <li
                                className={`flex items-center p-2 rounded cursor-pointer ${activeItem === 'general' ? 'bg-secondary text-gray-800  ' : 'hover:bg-secondary'}`}
                                onClick={() => handleNavigate('/dashboard', 'general')}
                            >
                                <FaHome className="mr-3" />
                                <span>General</span>
                            </li>

                            <li className="relative">
                                <div
                                    className={`flex items-center p-2 rounded cursor-pointer ${activeItem === 'appointments' ? 'bg-secondary text-gray-800' : 'hover:bg-secondary'}`}
                                    onClick={toggleDropdown}
                                >
                                    <FaCalendarAlt className="mr-3" />
                                    <span className="">Appointments</span>
                                    {isDropdownOpen ? <FaChevronUp className="ml-auto" /> : <FaChevronDown className="ml-auto" />}
                                </div>

                                {isDropdownOpen && (
                                    <ul className="ml-8 mt-2 space-y-1">
                                        <li
                                            className={`p-2 rounded cursor-pointer flex items-center ${activeItem === 'appointmentList' ? 'bg-secondary text-gray-800' : 'hover:bg-secondary'}`}
                                            onClick={() => handleNavigate('/appointments', 'appointmentList')}
                                        >
                                            <span className="material-symbols-outlined mr-2">
                                                event_available
                                            </span>
                                            Appointments
                                        </li>
                                        <li
                                            className={`p-2 rounded cursor-pointer flex items-center ${activeItem === 'calendar' ? 'bg-secondary text-gray-800' : 'hover:bg-secondary'}`}
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
                                className={`flex items-center p-2 rounded cursor-pointer ${activeItem === 'patients' ? 'bg-secondary text-gray-800' : 'hover:bg-secondary'}`}
                                onClick={() => handleNavigate('/patients', 'patients')}
                            >
                                <FaUser className="mr-3" />
                                <span className="">Patients</span>
                            </li>

                            <li
                                className={`flex items-center p-2 rounded cursor-pointer ${activeItem === 'medical-requests' ? 'bg-secondary text-gray-800' : 'hover:bg-secondary'}`}
                                onClick={() => handleNavigate('/Medical_requests', 'medical-requests')}
                            >
                                <FaFileAlt className="mr-3" />
                                <span className="">Medical Requests</span>
                            </li>

                            <li
                                className={`flex items-center p-2 rounded cursor-pointer ${activeItem === 'add-procedure' ? 'bg-secondary text-gray-800' : 'hover:bg-secondary'}`}
                                onClick={() => handleNavigate('/Add_Procedure', 'add-procedure')}
                            >
                                <FaPlus className="mr-3" />
                                <span className="">Add Procedure</span>
                            </li>
                            <li
                                className={`flex items-center p-2 rounded cursor-pointer ${activeItem === 'Dentist' ? 'bg-secondary text-gray-800' : 'hover:bg-secondary'}`}
                                onClick={() => handleNavigate('/Dentist', 'Dentist')}
                            >
                                <FaPlus className="mr-3" />
                                <span className="">Dentist</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="py-6">
                    <button
                        className="w-full py-2 bg-red-500 text-white rounded flex items-center justify-center"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <FaSignOutAlt className="mr-2" />
                        <span className="">Log out</span>
                    </button>
                </div>

            </div>

            {/* Modal for logout confirmation */}
            <Daisyui_modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
                <h2 className="text-xl font-semibold mb-4 text-center">Confirm Logout</h2>
                <p className="text-center">Are you sure you want to log out?</p>
                <div className="flex justify-between mt-6">
                    <button
                        className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
                        onClick={handleLogout}
                    >
                        Yes, Logout
                    </button>
                    <button
                        className="py-2 px-4 border border-gray-300 rounded bg-warning transition duration-200"
                        onClick={() => setIsModalOpen(false)}
                    >
                        Cancel
                    </button>
                </div>
            </Daisyui_modal>

        </>
    );
}
