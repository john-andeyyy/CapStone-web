import React, { useState } from 'react';
import Dashboard_Announcement from './Dashboard components/Dashboard_Announcement';
import Dashboard_Calendar from './Dashboard components/Dashboard_Calendar';
import { useNavigate } from 'react-router-dom';
import DashboardTips from './Dashboard components/DashboardTips';

export default function Dashboard() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
    });

    const handleNavigate = (path) => {
        navigate(path);
        setIsOpen(false);
    };

    return (
        <div className="p-4">
            <header>
                <h1 className="text-3xl font-bold ">Dashboard</h1>
                <div className="text-gray-600">{formattedDate}</div>
            </header>

            {/* Responsive Container for Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-5">
                {/* First Row */}
                <div className="w-full p-4 border border-primary rounded-lg">
                    <Dashboard_Announcement />
                </div>
                <div className="w-full  p-4 border border-primary rounded-lg">
                    <Dashboard_Calendar />
                </div>

                {/* Second Row */}
                <div className="w-full p-4 border border-primary rounded-lg flex flex-col">
                    <DashboardTips />
                </div>

                <div className="p-4 border border-primary rounded-lg flex flex-col justify-center items-center space-y-4">
                    <button
                        onClick={() => navigate('/Total_procedures')}
                        className='bg-[#3EB489] w-full h-12 rounded-xl text-xl font-semibold text-white transition duration-300 hover:bg-green-600 flex items-center justify-center space-x-2'
                    >
                        <span className="material-symbols-outlined">
                            summarize
                        </span>
                        <span>Report Overview</span>
                    </button>

                    <button
                        onClick={() => setIsOpen(true)}
                        className='bg-[#3EB489] w-full h-12 rounded-xl text-xl font-semibold text-white transition duration-300 hover:bg-green-600 flex items-center justify-center space-x-2'
                    >
                        <span className="material-symbols-outlined">
                            edit
                        </span>
                        Edit BlogPage
                    </button>
                    <button
                        onClick={() => navigate('/UnavailableClinic')}
                        className='bg-[#3EB489] w-full h-12 rounded-xl text-xl font-semibold text-white transition duration-300 hover:bg-green-600 flex items-center justify-center space-x-2'
                    >
                        <span className="material-symbols-outlined">
                            event_busy
                        </span>
                        <span>Clinic Close</span>
                    </button>
                </div>




            </div>

            {/* Modal for Editing BlogPage */}
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
                    <dialog className="modal" open>
                        <div className="modal-box relative bg-secondary p-4 rounded-lg">
                            <button
                                type="button"
                                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                                onClick={() => setIsOpen(false)}
                            >
                                ✕
                            </button>
                            <h3 className="font-bold text-lg">Edit BlogPage</h3>
                            <ul className="ml-8 mt-2 space-y-1 text-white">
                                <li
                                    className="p-2 rounded cursor-pointer flex items-center hover:bg-green-500 transition"
                                    onClick={() => handleNavigate('/Grouplist')}
                                >
                                    <span className="material-symbols-outlined mr-2">person</span>
                                    Edit Group Member
                                </li>
                                <li
                                    className="p-2 rounded cursor-pointer flex items-center hover:bg-green-500 transition"
                                    onClick={() => handleNavigate('/Contactus_edit')}
                                >
                                    <span className="material-symbols-outlined mr-2">call</span>
                                    Edit Contact Us
                                </li>
                                <li
                                    className="p-2 rounded cursor-pointer flex items-center hover:bg-green-500 transition"
                                    onClick={() => handleNavigate('/Hero_edit')}
                                >
                                    <span className="material-symbols-outlined mr-2">info</span>
                                    Edit Hero
                                </li>
                                <li
                                    className="p-2 rounded cursor-pointer flex items-center hover:bg-green-500 transition"
                                    onClick={() => handleNavigate('/TipsList')}
                                >
                                    <span className="material-symbols-outlined mr-2">recommend</span>
                                    Edit TIPS
                                </li>
                            </ul>
                        </div>
                    </dialog>
                </div>
            )}
        </div>
    );
}
