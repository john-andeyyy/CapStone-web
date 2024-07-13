import React, { useState } from 'react';

const PatientProfile = () => {
    const [patient, setPatient] = useState({
        firstName: "Alice",
        lastName: "Wonderland",
        age: "21",
        address: "San Juan, Malolos, Bulacan",
        state: "California",
        zipCode: "3000",
        phone: "095123478144",
        civilStatus: "Single",
        gender: "F",
        email: "alice@gmail.com"
    });

    const [dentalHistory, setDentalHistory] = useState([
        {
            id: "01",
            date: "03-12-2024",
            procedures: ["Cleaning", "Checkup", "Tooth Extraction", "Root Canal", "Filling"],
            amount: "₱1,250.00"
        },
        {
            id: "02",
            date: "02-01-2024",
            procedures: ["Filling"],
            amount: "₱800.00"
        }
        // Add more records as needed
    ]);

    const formatProcedures = (procedures) => {
        if (procedures.length > 3) {
            return `${procedures.slice(0, 3).join(', ')}...`;
        }
        return procedures.join(', ');
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col lg:flex-row justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold py-4 lg:py-0">Patient Profile</h1>
            </div>

            <div className="shadow-md rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(patient).map(([key, value]) => (
                        <div key={key} className="field">
                            <label className="block text-sm font-medium text-gray-700 capitalize">{key}</label>
                            <input
                                type="text"
                                value={value}
                                readOnly
                                className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                            />
                        </div>
                    ))}
                </div>

                <div className="w-auto mt-6">
                    <h3 className="text-xl font-semibold mt-6">Dental History</h3>
                    <p className='text-red-500 font-bold text-xl'>
                        note!!!!
                        sa page na to ilalagay ang 2d which is isang 2 lang per patient kasi inuupate nalang yon button lang sya

                    </p>
                    <div className="overflow-x-auto mt-2">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-neutral">
                                <tr>
                                    <th className="hidden md:table-cell px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="hidden md:table-cell px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Procedures</th>
                                    <th className="hidden md:table-cell px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {dentalHistory.map((record) => (
                                    <tr key={record.id}>
                                        <td className="hidden md:table-cell px-2 py-4 whitespace-nowrap">{record.id}</td>
                                        <td className="px-2 py-4 whitespace-nowrap">{record.date}</td>
                                        <td className="hidden md:table-cell px-2 py-4 whitespace-nowrap">{formatProcedures(record.procedures)}</td>
                                        <td className="hidden md:table-cell px-2 py-4 whitespace-nowrap">{record.amount}</td>
                                        <td className="px-2 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <button className="text-green-500 hover:text-green-700">
                                                <span className="hidden md:inline">📝 Create medical certificate</span>
                                                <span className="md:hidden">📝</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientProfile;
