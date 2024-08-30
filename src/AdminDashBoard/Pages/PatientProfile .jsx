import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { get_procedure_by_id } from '../Fetchs/patient/medical_certificate';

const PatientProfile = () => {
    const { id } = useParams();
    const [patient, setPatient] = useState({
        FirstName: "Alice",
        LastName: "Wonderland",
        age: "21",
        Address: "San Juan, Malolos, Bulacan",
        Zipcode: "3000",
        PhoneNumber: "095123478144",
        CivilStatus: "Single",
        Gender: "F",
        Email: "alice@gmail.com",
        ProfilePicture: "",
        Username: 's',
        id: "s",
    });

    const [profilePic, setProfilePic] = useState('../../public/default-avatar.jpg');
    const [dentalHistory, setDentalHistory] = useState([]);
    const [showButton, setShowButton] = useState(false); // State to control button visibility

    //! FUNCTIONS!!!!
    const get_patient = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BASEURL}/Patient/auth/view_patient_data`,
                {
                    params: { id },
                    withCredentials: true
                }
            );

            console.log('Procedure History:', response.data.procedureHistory);

            // Check if any procedure has the Status 'done'
            const anyDone = response.data.procedureHistory.some(procedure => procedure.Status === 'done');
            setShowButton(anyDone);

            // Format the procedureHistory dates
            const formattedProcedureHistory = response.data.procedureHistory.map(procedure => ({
                ...procedure,
                date: new Date(procedure.date).toLocaleDateString(), // Convert timestamp to readable date
                Amount: `₱${procedure.Amount}` // Format the amount as needed
            }));

            setDentalHistory(formattedProcedureHistory); // Set the formatted history
            setPatient(response.data);

        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        get_patient();
        // med_cert()
    }, []);

    const formatProcedures = (procedures) => {
        const exampleProcedure = "Xray";
        if (procedures.length > 3) {
            const displayedProcedures = procedures.slice(0, 2); // Show first two
            const includesExample = procedures.includes(exampleProcedure);
            if (includesExample) {
                return `${displayedProcedures.join(', ')}... (${exampleProcedure})`;
            } else {
                return `${displayedProcedures.join(', ')}...`;
            }
        }
        return procedures.join(', ');
    };

    const handleRowClick = (id) => {
        alert(`Procedure ID: ${id}`);
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col lg:flex-row justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold py-4 lg:py-0">Patient Profile</h1>
                <img
                    src={patient.ProfilePicture || profilePic}
                    alt="Profile Preview"
                    className="mt-4 w-40 h-40 mx-auto"
                />
            </div>

            <div className="shadow-md rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(patient)
                        .filter(([key]) => [
                            'FirstName',
                            'LastName',
                            'MiddleName',
                            'Email',
                            'Username',
                            'Address',
                            'PhoneNumber',
                            'Zipcode',
                            'age',
                            'CivilStatus',
                            'Gender'
                        ].includes(key))
                        .map(([key, value]) => (
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
                    <h3 className="text-xl font-semibold mt-6">Procedure History</h3>
                    <div className="overflow-x-auto mt-2">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-neutral">
                                <tr>
                                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">date</th>
                                    <th className="hidden md:table-cell px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Procedures</th>
                                    <th className="hidden md:table-cell px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {dentalHistory.map((record) => (
                                    <tr key={record.id} onClick={() => handleRowClick(record.id)} className="cursor-pointer">
                                        <td className="px-2 py-4 whitespace-nowrap">{record.date}</td>
                                        <td className="hidden md:table-cell px-2 py-4 whitespace-nowrap">{formatProcedures(record.procedures)}</td>
                                        <td className="hidden md:table-cell px-2 py-4 whitespace-nowrap">{record.Amount}</td>
                                        <td className="px-2 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            {showButton && (
                                                <button className="text-green-500 hover:text-green-700">
                                                    <span className="hidden md:inline">📝 Create medical certificate</span>
                                                    <span className="md:hidden">📝</span>
                                                </button>
                                            )}
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
