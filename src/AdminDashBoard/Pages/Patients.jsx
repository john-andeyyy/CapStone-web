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
        // sessionStorage.setItem('patientsData', JSON.stringify(response));
        setLoading(false);
    };

    useEffect(() => {
        const cachedData = sessionStorage.getItem('patientsData');
        // if (cachedData) {
        //     setPatientsInfo(JSON.parse(cachedData));
        //     setLoading(false);
        // } else {
        fetch_patient();
        // }
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };
    const handlePatientAdded = () => {
        fetch_patient(); // Refresh the patient list after adding a new patient
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

                    </div>

                    <div className="flex justify-end mt-2">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Add Patient
                        </button>
                    </div>


                    <div className='mt-4 overflow-auto max-h-[510px]'>
                        <table className='w-full text-left border-collapse'>
                            <thead className='bg-[#3EB489]  text-white sticky top-0 z-1'>
                                <tr>
                                    <th className='p-2 text-center border border-black'>ID</th>
                                    <th className='p-2 text-center border border-black'>
                                        Last Name
                                        <button onClick={handleSort} className='ml-2 '>
                                            <span className="material-symbols-outlined">
                                                {sortAscending ? 'arrow_upward' : 'arrow_downward'}
                                            </span>
                                        </button>
                                    </th>
                                    <th className='p-2 text-center border border-black'>Fisrst Name</th>
                                    <th className='p-2 text-center border border-black'>Middle Name </th>
                                    <th className='p-2 text-center border border-black'>Last Visit</th>
                                    <th className='p-2 text-center border border-black'>View</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPatients.length > 0 ? (
                                    filteredPatients.map((patient) => (
                                        <tr key={patient.id} className='border-b'>
                                            <td className='p-2  bg-gray-100 border border-black'>{patient.id}</td>
                                            <td className='p-2  bg-gray-100 border border-black'>{patient.LastName}</td>
                                            <td className='p-2  bg-gray-100 border border-black'>{patient.FirstName}</td>
                                            <td className='p-2  bg-gray-100 border border-black'>{patient.MiddleName}</td>
                                            <td className='p-2  bg-gray-100 border border-black'>
                                                {patient.LatestAppointment
                                                    ? new Date(patient.LatestAppointment.date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })
                                                    : <span className='text-red-600'>No Record</span>}
                                            </td>
                                            <td className='p-2 text-center bg-gray-100 border border-black flex justify-center'>
                                                <button
                                                    className='flex items-center justify-center w-10 bg-blue-100 text-blue-500 hover:text-blue-600 transition rounded-lg shadow-sm'
                                                    onClick={() => navigate(`/PatientProfile/${patient.id}`)}
                                                    title='View'
                                                >
                                                    <span className="material-symbols-outlined">visibility</span>
                                                </button>
                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className='p-4 text-center'>No patients found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
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
