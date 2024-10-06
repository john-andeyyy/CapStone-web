import React, { useState } from 'react';
import Dashboard_Announcement from './Dashboard components/Dashboard_Announcement';
import Dashboard_Calendar from './Dashboard components/Dashboard_Calendar';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false);
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
    });

    return (
        <div>
            <div className="p-4">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <div className="text-gray-600">{formattedDate}</div>

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
                    <div className="w-full p-4 border border-primary rounded-lg">
                        {/* <Dashboard_Procedures /> Replace with your actual component */}

                    </div>
                    <div className="w-full p-4 border border-primary rounded-lg">
                        <button
                            onClick={() => setIsOpen(true)}
                            className='bg-secondary p-3 rounded-xl text-xl font-semibold text'
                        >Report Overview</button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
                    <dialog className="modal" open>
                        <div className="modal-box relative">
                            <form method="dialog">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                                    onClick={() => setIsOpen(false)}
                                >
                                    ✕
                                </button>
                            </form>
                            <h3 className="font-bold text-lg">Hello!</h3>
                            <button className="py-4" onClick={() => navigate('/Total_procedures')}> Report of Procedures</button>
                        </div>
                    </dialog>
                </div>
            )}

        </div>
    );
}
