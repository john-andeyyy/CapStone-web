import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ReportMenu() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false); // State to manage dropdown visibility

    // Function to toggle the dropdown
    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

    const handleNavigation = (path) => {
        navigate(path);
        setIsOpen(false);
    };

    return (
        <div className="dropdown relative text-white ">

            <div tabIndex={0} role="button" onClick={toggleDropdown} className="btn m-1 text-white bg-green-500 hover:bg-green-300">
                Select Reports
            </div>
            {isOpen && (
                <ul className="dropdown-content menu bg-secondary rounded-box z-[1] w-52 p-2 shadow ">
                    <li>
                        <button onClick={() => handleNavigation('/Total_procedures')} className="w-full text-left">
                            Procedure Summary
                        </button>
                    </li>
                    <li>
                        <button onClick={() => handleNavigation('/Report_Monthly_Appointment')} className="w-full text-left">
                            Appointment Summary
                        </button>
                    </li>
                    <li>
                        <button onClick={() => handleNavigation('/Patient_Visits')} className="w-full text-left">
                            Patient Visits Summary
                        </button>
                    </li>
                    <li>
                        <button onClick={() => handleNavigation('/IncomeReport')} className="w-full text-left">
                            IncomeReport Summary
                        </button>
                    </li>
                    <li>
                        <button onClick={() => handleNavigation('/Patient_Procedures_done')} className="w-full text-left">
                            Patient_Procedures_done
                        </button>
                    </li>
                </ul>
            )}
        </div>
    );
}
