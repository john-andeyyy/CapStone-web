import React from 'react';
import Dashboard_Announcement from './Dashboard components/Dashboard_Announcement';
import Dashboard_Calendar from './Dashboard components/Dashboard_Calendar';

export default function Dashboard() {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
    });


    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="text-gray-600">{formattedDate}</div>

            {/* Responsive Container for Left and Right Columns */}
            <div className="flex flex-col lg:flex-row gap-3 h-full pt-5">
                {/* Left Column (Full width on small screens, half on larger screens) */}
                <div className="w-full lg:w-1/2 p-4 pt-0">
                    <Dashboard_Announcement />
                </div>

                {/* Right Column (Full width on small screens, half on larger screens) */}
                <div className="w-full lg:w-1/2 p-4 pt-0 border border-primary rounded-lg">
                    <Dashboard_Calendar />
                </div>
            </div>
        </div>
    );
}
