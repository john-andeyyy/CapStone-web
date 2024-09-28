import React from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

export default function Dashboard() {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            <div className="text-gray-600 mb-8">{formattedDate}</div>

            {/* <h1 className='Title-Color'>graphs</h1> */}
            {/* <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Appointment Requests History</h2>
                <div className="space-y-4">

                    <div className="p-4 bg-base-200 rounded flex justify-between items-center">
                        <div>
                            <div className="font-semibold">3:30pm - 4:00pm May 12, 2024</div>
                            <div className="text-gray-600">Alice Wonderland</div>
                            <div>Check up and cleaning</div>
                        </div>
                        <div className="flex space-x-2">
                            <button className="p-2 bg-green-500 text-white rounded">
                                <FaCheck />
                            </button>
                            <button className="p-2 bg-red-500 text-white rounded">
                                <FaTimes />
                            </button>
                        </div>
                    </div>

                </div>
            </div> */}


        </div>
    );
}
