import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Tooth2d from '../Components/Tooth2d';
import Add_RecordbyAdmin from './Components/Add_RecordbyAdmin';

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

            // Store full patient details
            setFullPatient(response.data);
            setPatient({
                FirstName: response.data.FirstName || "...",
                LastName: response.data.LastName || "...",
                MiddleName: response.data.MiddleName || "..."
            });

            const history = await axios.get(
                `${Baseurl}/Appointments/AdminUser/appointmentofuser/${id}`,
                {
                    withCredentials: true
                }
            );
            const historydata = history.data;
            const anyPendingOrEmpty = historydata.some(appointment =>
                appointment.Status.toLowerCase() === 'pending' || appointment.Status === ''
            );

            setShowButton(anyPendingOrEmpty);
            setDentalHistory(historydata);
            console.log('Formatted Procedure History', historydata);

        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        get_patient();
    }, []);

    const formatProcedures = (procedures) => {
        if (procedures.length > 3) {
            const displayedProcedures = procedures.slice(0, 2).map(proc => proc.Procedure_name);
            return `${displayedProcedures.join(', ')}... (${procedures.length - 2} more)`;
        }
        return procedures.map(proc => proc.Procedure_name).join(', ');
    };


    const handleRowClick = (id) => {
        navigate(`/appointment/${id}`);
    };

    return (
        <div className="container mx-auto p-4">
            <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
            >
                Go Back
            </button>
            <h1 className="mt-5 mb-5 text-2xl font-semibold py-4 lg:py-0">Patient Profile</h1>

            <div className="shadow-md rounded-lg p-6 bg-[#F5F5F5]">
                <div className="flex justify-end">
                    <button onClick={() => setIsModalOpen(true)} className="btn text-white bg-[#3EB489] hover:bg-[#62A78E]">
                        Full Details
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row justify-between items-center mb-4 ">
                    <img
                        src={patient.ProfilePicture || profilePic}
                        alt="Profile Preview"
                        className="mt-4 w-40 h-40 mx-auto"
                    />

                </div>


                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="field">
                        <label className="block text-sm font-bold uppercase text-black">First Name</label>
                        <input
                            type="text"
                            value={patient.FirstName || ""}
                            readOnly
                            className="bg-[#D3CDCD] p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                    </div>
                    <div className="field">
                        <label className="block text-sm font-bold uppercase text-black">Last Name</label>
                        <input
                            type="text"
                            value={patient.LastName || ""}
                            readOnly
                            className="bg-[#D3CDCD] p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                    </div>
                    <div className="field">
                        <label className="block text-sm font-bold uppercase text-black">Middle Name</label>
                        <input
                            type="text"
                            value={patient.MiddleName || ""}
                            readOnly
                            className="bg-[#D3CDCD] p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                    </div>

                </div>


            </div>

            <Tooth2d userIds={userIds} />

            <div className="w-auto mt-5">
                <div className='flex justify-between items-center py-5'>
                    <h3 className="text-xl font-semibold">Procedure History</h3>
                    <Add_RecordbyAdmin userIds={userIds} />

                </div>


                <div className="overflow-x-auto mt-2">
                    <div className="max-h-96 overflow-y-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-primary text-white sticky top-0 z-10">
                                <tr>
                                    <th className="px-2 py-3 text-left text-xs font-medium  uppercase tracking-wider">Date</th>
                                    <th className="hidden md:table-cell px-2 py-3 text-left text-xs font-medium  uppercase tracking-wider">Procedures</th>
                                    <th className="hidden md:table-cell px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Amount</th>
                                    <th className="hidden md:table-cell px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                                    {/* <th className="px-2 py-3 text-xs font-medium  uppercase tracking-wider text-center">Action</th> */}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {dentalHistory.map((record) => (
                                    <tr key={record._id} onClick={() => handleRowClick(record._id)} className="cursor-pointer">
                                        <td className="px-2 py-4 whitespace-nowrap">
                                            {new Date(record.date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short', // Short month name (e.g., "Oct")
                                                day: 'numeric',
                                            })}
                                        </td>
                                        <td className="hidden md:table-cell px-2 py-4 whitespace-nowrap">{formatProcedures(record.procedures)}</td>
                                        <td className="hidden md:table-cell px-2 py-4 whitespace-nowrap">{record.Amount}</td>
                                        <td className="hidden md:table-cell px-2 py-4 whitespace-nowrap">{record.Status}</td>
                                        {/* <td className="px-2 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            {showButton && record.Status.toLowerCase() === 'Pending' && (
                                                <button className="text-green-500 hover:text-green-700">
                                                    <span className="hidden md:inline">📝 Create medical certificate</span>
                                                    <span className="md:hidden">📝</span>
                                                </button>
                                            )}
                                        </td> */}
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>

                </div>
            </div>

            {/* modal */}

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                    <div className=" bg-accent p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
                        <h2 className="text-xl font-semibold mb-4">Full Patient Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {fullPatient && requiredFields.map((field) => (
                                <div key={field} className="field">
                                    <label className="block text-sm font-medium capitalize">{field}</label>
                                    <input
                                        type="text"
                                        value={fullPatient[field] || ""}
                                        readOnly
                                        className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className='flex justify-center'>
                            <button onClick={() => setIsModalOpen(false)} className="bg-[#D9D9D9] hover:bg-[#ADAAAA] btn mt-4">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientProfile;
