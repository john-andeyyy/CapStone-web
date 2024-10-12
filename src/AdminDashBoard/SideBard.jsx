import React, { useEffect, useState } from 'react';
import {
    FaHome, FaCalendarAlt, FaUser, FaFileAlt,
    FaUserPlus, FaPlus, FaSignOutAlt, FaBars,
    FaTimes, FaChevronDown, FaChevronUp
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { get_profile } from './Fetchs/Admin/admin_profile';
import ThemeController from '../Guest/GuestComponents/ThemeController';
import Daisyui_modal from './Components/Daisyui_modal';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeItem, setActiveItem] = useState('general');
    const [profilePic, setProfilePic] = useState('../../public/default-avatar.jpg');
    const [name, setName] = useState('name');
    const [isMedicalRequestsDropdownOpen, setIsMedicalRequestsDropdownOpen] = useState(false);
    const [isAppointmentsDropdownOpen, setIsAppointmentsDropdownOpen] = useState(false);
    const [isLandingPageDropdownOpen, setIsLandingPageDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
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
        closeDropdowns();
    };

    const handleImageClick = () => {
        setActiveItem('');
        navigate('/ProfilePage');
        closeDropdowns();
    };

    const closeDropdowns = () => {
        setIsOpen(false);
        setIsAppointmentsDropdownOpen(false);
        setIsLandingPageDropdownOpen(false);
        setIsMedicalRequestsDropdownOpen(false);
    };

    const toggleAppointmentsDropdown = () => {
        setIsAppointmentsDropdownOpen(!isAppointmentsDropdownOpen);
        setIsLandingPageDropdownOpen(false); // Close landing page dropdown when opening appointments
        setIsMedicalRequestsDropdownOpen(false); // Close medical requests dropdown
    };

    const toggleLandingPageDropdown = () => {
        setIsLandingPageDropdownOpen(!isLandingPageDropdownOpen);
        setIsAppointmentsDropdownOpen(false); // Close appointments dropdown when opening landing page
        setIsMedicalRequestsDropdownOpen(false); // Close medical requests dropdown
    };

    const toggleMedicalRequestsDropdown = () => {
        setIsMedicalRequestsDropdownOpen(!isMedicalRequestsDropdownOpen);
        setIsAppointmentsDropdownOpen(false); // Close other dropdowns
        setIsLandingPageDropdownOpen(false); // Close landing page dropdown
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
        window.location.reload();
    };

    return (
        <div className='text-white'>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 text-primary"
            >
                {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>

            <div className={`fixed z-10 h-screen w-60 bg-primary p-4 flex flex-col justify-between transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div>
                    <div className="flex justify-between items-center pb-3">
                        <button className="" onClick={() => setIsModalOpen(true)}>
                            <span className="material-symbols-outlined text-red-500">logout</span>
                        </button>
                        <h2 className="text-xl font-bold hidden md:block">
                            <span className='text-white'>Alejandria's Dental</span> Clinic
                        </h2>
                        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
                            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>

                    <div className="flex flex-col items-center pb-3" onClick={handleImageClick}>
                        <div className="avatar">
                            <div className="w-20 h-20 rounded-full cursor-pointer overflow-hidden">
                                <img src={profilePic} alt="Profile" className="object-cover w-full h-full" />
                            </div>
                        </div>
                        <span className="font-semibold text-center mt-2 text-white">{name}</span>
                    </div>

                    <div className="flex-grow text-white">
                        <ul className="space-y-2 text-sm">
                            <li className={`flex items-center p-2 rounded cursor-pointer ${activeItem === 'general' ? 'bg-secondary text-gray-800' : 'hover:bg-secondary'}`} onClick={() => handleNavigate('/dashboard', 'general')}>
                                <FaHome className="mr-3" />
                                <span>General</span>
                            </li>

                            {/* Appointments Dropdown */}
                            <li className="relative">
                                <div className={`flex items-center p-2 rounded cursor-pointer ${activeItem === 'appointments' ? 'bg-secondary text-gray-800' : 'hover:bg-secondary'}`} onClick={toggleAppointmentsDropdown}>
                                    <FaCalendarAlt className="mr-3" />
                                    <span>Appointments</span>
                                    {isAppointmentsDropdownOpen ? <FaChevronUp className="ml-auto" /> : <FaChevronDown className="ml-auto" />}
                                </div>

                                {isAppointmentsDropdownOpen && (
                                    <ul className="ml-8 mt-2 space-y-1">
                                        <li className={`p-2 rounded cursor-pointer flex items-center ${activeItem === 'appointmentList' ? 'bg-secondary text-gray-800' : 'hover:bg-secondary'}`} onClick={() => handleNavigate('/appointments', 'appointmentList')}>
                                            <span className="material-symbols-outlined mr-2">event_available</span>
                                            Appointments
                                        </li>
                                        <li className={`p-2 rounded cursor-pointer flex items-center ${activeItem === 'calendar' ? 'bg-secondary text-gray-800' : 'hover:bg-secondary'}`} onClick={() => handleNavigate('/CalendarComponent', 'calendar')}>
                                            <span className="material-symbols-outlined mr-2">calendar_month</span>
                                            Calendar
                                        </li>
                                    </ul>
                                )}
                            </li>

                            <li className={`flex items-center p-2 rounded cursor-pointer ${activeItem === 'patients' ? 'bg-secondary text-gray-800' : 'hover:bg-secondary'}`} onClick={() => handleNavigate('/patients', 'patients')}>
                                <FaUser className="mr-3" />
                                <span>Patients</span>
                            </li>

                            {/* Medical Requests Dropdown */}
                            <li className="relative">
                                <div className={`flex items-center p-2 rounded cursor-pointer ${activeItem === 'medical-requests' ? 'bg-secondary text-gray-800' : 'hover:bg-secondary'}`} onClick={toggleMedicalRequestsDropdown}>
                                    <FaFileAlt className="mr-3" />
                                    <span>Documents</span>
                                    {isMedicalRequestsDropdownOpen ? <FaChevronUp className="ml-auto" /> : <FaChevronDown className="ml-auto" />}
                                </div>

                                {isMedicalRequestsDropdownOpen && (
                                    <ul className="ml-8 mt-2 space-y-1">
                                        <li className={`flex items-center p-2 rounded cursor-pointer ${activeItem === 'medical-requests' ? 'bg-secondary text-gray-800' : 'hover:bg-secondary'}`} onClick={() => handleNavigate('/Medical_requests', 'medical-requests')}>
                                            <FaFileAlt className="mr-3" />
                                            <span>Medical Requests</span>
                                        </li>
                                        <li className={`p-2 rounded cursor-pointer flex items-center ${activeItem === 'completedRequests' ? 'bg-secondary text-gray-800' : 'hover:bg-secondary'}`} onClick={() => handleNavigate('/Medical_requests/completed', 'completedRequests')}>
                                            <span className="material-symbols-outlined mr-2">done</span>
                                            Completed Requests
                                        </li>
                                    </ul>
                                )}
                            </li>

                            <li className={`flex items-center p-2 rounded cursor-pointer ${activeItem === 'add-procedure' ? 'bg-secondary text-gray-800' : 'hover:bg-secondary'}`} onClick={() => handleNavigate('/Add_Procedure', 'add-procedure')}>
                                <FaPlus className="mr-3" />
                                <span>Add Procedure</span>
                            </li>

                            <li className={`flex items-center p-2 rounded cursor-pointer ${activeItem === 'Dentist' ? 'bg-secondary text-gray-800' : 'hover:bg-secondary'}`} onClick={() => handleNavigate('/Dentist', 'Dentist')}>
                                <span className="material-symbols-outlined mr-2">edit</span>
                                <span>Dentist</span>
                            </li>

                            {/* Landing Page Dropdown */}
                            <li className="relative">
                                <div className={`flex items-center p-2 rounded cursor-pointer ${activeItem === 'landing-page' ? 'bg-secondary text-gray-800' : 'hover:bg-secondary'}`} onClick={toggleLandingPageDropdown}>
                                    <span className="material-symbols-outlined mr-2">home</span>
                                    <span>Landing Page</span>
                                    {isLandingPageDropdownOpen ? <FaChevronUp className="ml-auto" /> : <FaChevronDown className="ml-auto" />}
                                </div>

                                {isLandingPageDropdownOpen && (
                                    <ul className="ml-8 mt-2 space-y-1">
                                        <li
                                            className={`p-2 rounded cursor-pointer flex items-center ${activeItem === 'AddGroupMember' ? 'bg-secondary text-gray-800' : 'hover:bg-secondary'}`}
                                            onClick={() => handleNavigate('/Grouplist', 'Grouplist')}
                                        >
                                            <span className="material-symbols-outlined mr-2">
                                                event_available
                                            </span>
                                            Group Member
                                            <h1 className='font-bold text-green-500'>  DONE!!</h1>
                                        </li>

                                    </ul>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <ThemeController />
                    <button onClick={handleLogout} className="flex items-center p-2 rounded hover:bg-secondary">
                        <FaSignOutAlt className="mr-2" />
                        Logout
                    </button>
                </div>
            </div>
            <Daisyui_modal isOpen={isModalOpen} setIsOpen={setIsModalOpen} handleLogout={handleLogout} />
        </div>
    );
}
