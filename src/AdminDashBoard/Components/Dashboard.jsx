import React, { useState } from 'react';
import Dashboard_Announcement from './Dashboard components/Dashboard_Announcement';
import Dashboard_Calendar from './Dashboard components/Dashboard_Calendar';
import { useNavigate } from 'react-router-dom';

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
        setIsOpen(false); // Close modal after navigating
    };

    return (
        <div className="p-4">
            <header>
                <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                <div className="text-gray-600">{formattedDate}</div>
            </header>

            {/* Responsive Container for Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-5">
                {/* First Row */}
                <div className="w-full p-4 border border-primary rounded-lg">
                    <Dashboard_Announcement />
                </div>
                <div className="w-full p-4 border border-primary rounded-lg">
                    <Dashboard_Calendar />
                </div>

                {/* Second Row */}
                <div className="w-full p-4 border border-primary rounded-lg flex flex-col">
                    {/* Placeholder for future component */}
                </div>
                <div className="w-full p-4 border border-primary rounded-lg flex justify-around">
                    <button
                        onClick={() => navigate('/Total_procedures')}
                        className='bg-secondary p-3 rounded-xl text-xl font-semibold text-white transition duration-300 hover:bg-green-600'
                    >
                        Report Overview
                    </button>
                    <button
                        onClick={() => setIsOpen(true)}
                        className='bg-secondary p-3 rounded-xl text-xl font-semibold text-white transition duration-300 hover:bg-green-600'
                    >
                        Edit BlogPage
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
                                    Group Member
                                </li>
                                <li
                                    className="p-2 rounded cursor-pointer flex items-center hover:bg-green-500 transition"
                                    onClick={() => handleNavigate('/Contactus_edit')}
                                >
                                    <span className="material-symbols-outlined mr-2">contacts</span>
                                    Contact Us Edit
                                </li>
                                <li
                                    className="p-2 rounded cursor-pointer flex items-center hover:bg-green-500 transition"
                                    onClick={() => handleNavigate('/Hero_edit')}
                                >
                                    <span className="material-symbols-outlined mr-2">contacts</span>
                                    Hero Edit
                                </li>
                            </ul>
                        </div>
                    </dialog>
                </div>
            )}
        </div>
    );
}
