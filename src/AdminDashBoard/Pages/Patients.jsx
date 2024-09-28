import React, { useState, useEffect } from 'react';
import Modal from '../Components/Modal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


import { fetchPatients } from '../Fetchs/patient/patient_account'

export default function Patients_List() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false); // Loading state
    const [addPatient, setAddPatient] = useState(false);
    const [editPatient, setEditPatient] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [patientsInfo, setPatientsInfo] = useState([]);

    const [selectedPatient, setSelectedPatient] = useState(null);
    const [newPatient, setNewPatient] = useState({ id: '', name: '', lastVisit: '' });
    const [searchQuery, setSearchQuery] = useState('');

    const fetch_patient = async () => {
        const response = await fetchPatients();
        console.log(response)
        setPatientsInfo(response);
        sessionStorage.setItem('patientsData', JSON.stringify(response));
    };

    useEffect(() => {
        const cachedData = sessionStorage.getItem('patientsData');

        fetch_patient();

        if (cachedData) {
            setPatientsInfo(JSON.parse(cachedData));
        } else {
            fetch_patient();
        }
    }, []);

    const openModalAddPatient = () => {
        setNewPatient({ id: '', name: '', lastVisit: '' });
        setAddPatient(true);
    };

    const openModalEditPatient = (patient) => {
        setSelectedPatient(patient);
        setNewPatient({ ...patient, name: `${patient.FirstName} ${patient.LastName}` });
        setEditPatient(true);
    };

    const openModalDeleteConfirmation = (patient) => {
        setSelectedPatient(patient);
        setDeleteConfirmation(true);
    };

    const handleAddPatient = () => {
        setPatientsInfo([...patientsInfo, newPatient]);
        setAddPatient(false);
    };

    const handleEditPatient = () => {
        setPatientsInfo(patientsInfo.map(patient =>
            patient.id === newPatient.id ? newPatient : patient
        ));
        setEditPatient(false);
    };

    const handleDeletePatient = () => {
        setPatientsInfo(patientsInfo.filter(patient => patient.id !== selectedPatient.id));
        setDeleteConfirmation(false);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredPatients = patientsInfo.filter((patient) => {
        const fullName = `${patient.FirstName} ${patient.LastName}`.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase());
    });

    return (
        <div className='container mx-auto p-4'>
            {loading ? (
                <div className='flex justify-center items-center h-screen'>
                    <span className="text-2xl">Loading...</span>
                </div>
            ) : (
                <>
                    <div className='flex flex-col lg:flex-row justify-between items-center'>
                        <div className='flex justify-between items-center'>
                            <h1 className='text-2xl font-semibold pb-2'>Patients List</h1>
                            <button onClick={() => fetch_patient()} className='p-2'>
                                <span className="material-symbols-outlined">
                                    refresh
                                </span>
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
                    <div className='mt-4'>
                        <div className='flex w-full text-xl font-semibold border-b pb-2'>
                            <div className='flex-1'>Patient Name</div>
                            <div className='flex-1 hidden lg:block'>Last Visit <span className='text-red-600'>(Unavailable)</span></div>
                            <div className='flex-1 text-center'>Actions</div>
                        </div>
                        {filteredPatients.map((patient) => (
                            <div key={patient.id} className='flex w-full items-center border-b py-2'>
                                <div className='flex-1'>{`${patient.FirstName} ${patient.LastName}`}</div>
                                <div className='flex-1 hidden lg:block'>{patient.lastVisit}</div>
                                <div className='flex-1 flex gap-2 justify-center'>
                                    <button className='text-blue-500' onClick={() => navigate(`/PatientProfile/${patient.id}`)}>
                                        <span className="material-symbols-outlined">visibility</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
