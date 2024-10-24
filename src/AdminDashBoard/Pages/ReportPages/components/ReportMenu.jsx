import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ReportMenu() {
    const navigate = useNavigate();
    const [selectedReport, setSelectedReport] = useState('/Total_procedures'); // Default value

    // Function to handle selection and navigation
    const handleNavigation = (path) => {
        setSelectedReport(path); // Set the selected value
        if (path) navigate(path); // Navigate to the corresponding path
    };

    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center mb-4">
                {/* <h1 className='bg-error'> need to fix</h1> */}
                <label htmlFor="report-selector" className="block font-semibold mr-4">
                    Select Reports:
                </label>

                <select
                    id="report-selector"
                    value={selectedReport} // Bind to state
                    onChange={(e) => handleNavigation(e.target.value)} // Handle changes
                    className="block p-2 border border-gray-400 rounded-md focus:outline-none transition max-w-xs"
                >
                    <option value="/Total_procedures">Procedure Summary</option>
                    <option value="/Report_Monthly_Appointment">Appointment Summary</option>
                    <option value="/Patient_Visits">Patient Visits Summary</option>
                    <option value="/IncomeReport">Income Report Summary</option>
                    <option value="/Patient_Procedures_done">Patient Procedures Done</option>
                </select>
            </div>
        </div>
    );
}
