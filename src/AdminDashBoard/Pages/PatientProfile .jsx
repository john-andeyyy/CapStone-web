import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Tooth2d from '../Components/Tooth2d';

const PatientProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate()
    const userIds = id;
    const [patient, setPatient] = useState({
        FirstName: "",
        LastName: "",
        MiddleName: "",
    });
    const [profilePic, setProfilePic] = useState('../../public/default-avatar.jpg');
    const [dentalHistory, setDentalHistory] = useState([]);
    const [showButton, setShowButton] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // To control the modal visibility
    const [fullPatient, setFullPatient] = useState(null); // To store full patient details
    const Baseurl = import.meta.env.VITE_BASEURL
    const requiredFields = [
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
    ];

    const get_patient = async () => {
        try {
            const response = await axios.get(
                `${Baseurl}/Patient/auth/view_patient_data`,
                {
                    params: { id },
                    withCredentials: true
                }
            );

            setFullPatient(response.data); // Store full patient details
            setPatient({
                FirstName: response.data.FirstName || "...",
                LastName: response.data.LastName || "...",
                MiddleName: response.data.MiddleName || "...",
            });

            const anyDone = response.data.procedureHistory.some(procedure => procedure.Status.toLowerCase() === 'done');
            setShowButton(anyDone);

            const formattedProcedureHistory = response.data.procedureHistory.map(procedure => ({
                ...procedure,
                date: new Date(procedure.date).toLocaleDateString(),
                Amount: `₱${procedure.Amount}`
            }));
            setDentalHistory(formattedProcedureHistory);

        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        get_patient();
    }, []);

    const formatProcedures = (procedures) => {
        const exampleProcedure = "Xray";
        if (procedures.length > 3) {
            const displayedProcedures = procedures.slice(0, 2);
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
        navigate(`/appointment/${id}`);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold py-4 lg:py-0">Patient Profile</h1>
            <div className="flex flex-col lg:flex-row justify-between items-center mb-4">
                <img
                    src={patient.ProfilePicture || profilePic}
                    alt="Profile Preview"
                    className="mt-4 w-40 h-40 mx-auto"
                />
            </div>

            <div className="shadow-md rounded-lg p-6 bg-primary">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="field">
                        <label className="block text-sm font-medium text-white">First Name</label>
                        <input
                            type="text"
                            value={patient.FirstName || ""}
                            readOnly
                            className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                    </div>
                    <div className="field">
                        <label className="block text-sm font-medium text-white">Last Name</label>
                        <input
                            type="text"
                            value={patient.LastName || ""}
                            readOnly
                            className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                    </div>
                    <div className="field">
                        <label className="block text-sm font-medium text-white">Middle Name</label>
                        <input
                            type="text"
                            value={patient.MiddleName || ""}
                            readOnly
                            className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Full Details Button */}
            <div className="mt-4">
                <button onClick={() => setIsModalOpen(true)} className="btn text-white btn-primary">
                    Full Details
                </button>
            </div>

            {/* Custom Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                    <div className=" bg-accent p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
                        <h2 className="text-xl font-semibold mb-4">Full Patient Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {fullPatient && requiredFields.map((field) => (
                                <div key={field} className="field">
                                    <label className="block text-sm font-medium text-gray-700 capitalize">{field}</label>
                                    <input
                                        type="text"
                                        value={fullPatient[field] || ""}
                                        readOnly
                                        className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setIsModalOpen(false)} className="btn btn-primary mt-4">
                            Close
                        </button>
                    </div>
                </div>
            )}

            <Tooth2d userIds={userIds} />

            <div className="w-auto mt-6">
                <h3 className="text-xl font-semibold mt-6">Procedure History</h3>
                <div className="overflow-x-auto mt-2">
                    <div className="max-h-96 overflow-y-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-primary text-white sticky top-0 z-10">
                                <tr>
                                    <th className="px-2 py-3 text-left text-xs font-medium  uppercase tracking-wider">Date</th>
                                    <th className="hidden md:table-cell px-2 py-3 text-left text-xs font-medium  uppercase tracking-wider">Procedures</th>
                                    <th className="hidden md:table-cell px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Amount</th>
                                    <th className="px-2 py-3 text-xs font-medium  uppercase tracking-wider text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {dentalHistory.map((record) => (
                                    <tr key={record.id} onClick={() => handleRowClick(record.id)} className="cursor-pointer">
                                        <td className="px-2 py-4 whitespace-nowrap">{record.date}</td>
                                        <td className="hidden md:table-cell px-2 py-4 whitespace-nowrap">{formatProcedures(record.procedures)}</td>
                                        <td className="hidden md:table-cell px-2 py-4 whitespace-nowrap">{record.Amount}</td>
                                        <td className="px-2 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            {showButton && record.Status.toLowerCase() === 'done' && (
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
