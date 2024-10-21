import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { fetchPatients } from '../Fetchs/patient/patient_account';
import AddPatientModal from './Components/AddPatientModal';

export default function Patients_List() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [patientsInfo, setPatientsInfo] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortAscending, setSortAscending] = useState(true); // Sorting state
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

    const fetch_patient = async () => {
        setLoading(true);
        const response = await fetchPatients();
        console.log(response);
        setPatientsInfo(response);
        setLoading(false);
    };

    useEffect(() => {
        fetch_patient();
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSort = () => {
        const sortedPatients = [...patientsInfo].sort((a, b) => {
            const lastNameA = a.LastName.toLowerCase();
            const lastNameB = b.LastName.toLowerCase();
            return sortAscending
                ? lastNameA.localeCompare(lastNameB)
                : lastNameB.localeCompare(lastNameA);
        });
        setPatientsInfo(sortedPatients);
        setSortAscending(!sortAscending); // Toggle sorting direction
    };

    const filteredPatients = patientsInfo.filter((patient) => {
        const fullName = `${patient.FirstName} ${patient.LastName}`.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase());
    });

    const handlePatientAdded = () => {
        fetch_patient(); // Refresh the patient list after adding a new patient
    };

    return (
        <div className='container mx-auto p-4'>
            {loading ? (
                <div className='flex justify-center items-center h-screen'>
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            ) : (
                <>
                    <div className='flex flex-col lg:flex-row justify-between items-center'>
                        <div className='flex justify-between items-center'>
                            <h1 className='text-2xl font-semibold pb-2'>Patients List</h1>
                            <button onClick={fetch_patient} className='p-2'>
                                <span className="material-symbols-outlined">refresh</span>
                            </button>
                        </div>

                        {/* Adjusted Search and Add Patient Button Layout */}
                        <div className='flex items-center mt-4 lg:mt-0'>
                            <div className='relative'>
                                <input
                                    type='text'
                                    placeholder='Search patients...'
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    className='block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
                                />
                                <div className='absolute left-3 top-3 h-4 w-4 text-gray-500'>
                                    <span className="material-symbols-outlined">search</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsModalOpen(true)} // Open modal
                                className='bg-blue-500 text-white px-4 py-2 rounded ml-4'
                            >
                                Add Patient
                            </button>
                        </div>
                    </div>

                    <div className='mt-4 overflow-auto max-h-[510px]'>
                        <table className='w-full text-left border-collapse'>
                            <thead className='bg-primary text-white sticky top-0 z-1'>
                                <tr>
                                    <th className='p-3'>ID</th>
                                    <th className='p-3'>
                                        Last Name
                                        <button onClick={handleSort} className='ml-2'>
                                            <span className="material-symbols-outlined">
                                                {sortAscending ? 'arrow_upward' : 'arrow_downward'}
                                            </span>
                                        </button>
                                    </th>
                                    <th className='p-3'>First Name</th>
                                    <th className='p-3'>Middle Name</th>
                                    <th className='p-3'>Last Visit</th>
                                    <th className='p-3 text-center'>View</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPatients.length > 0 ? (
                                    filteredPatients.map((patient) => (
                                        <tr key={patient.id} className='border-b hover:bg-neutral'>
                                            <td className='p-3'>{patient.id}</td>
                                            <td className='p-3'>{patient.LastName}</td>
                                            <td className='p-3'>{patient.FirstName}</td>
                                            <td className='p-3'>{patient.MiddleName}</td>
                                            <td className='p-3'>
                                                {patient.LatestAppointment
                                                    ? new Date(patient.LatestAppointment.date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })
                                                    : <span className='text-red-600'>No Record</span>}
                                            </td>
                                            <td className='p-3 text-center'>
                                                <button className='text-blue-500' onClick={() => navigate(`/PatientProfile/${patient.id}`)}>
                                                    <span className="material-symbols-outlined">visibility</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className='p-4 text-center'>No patients found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Add Patient Modal */}
                    <AddPatientModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)} // Close modal handler
                        onPatientAdded={handlePatientAdded} // Callback to refresh patient list
                    />
                </>
            )}
        </div>
    );
}
