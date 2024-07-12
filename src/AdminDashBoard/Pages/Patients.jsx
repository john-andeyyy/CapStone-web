import React, { useState } from 'react';
import Modal from '../Components/Modal';

export default function Patients_List() {
    const [Addpatient, setAddpatient] = useState(false);
    const [Patients_Info, setPatients_Info] = useState([
        { id: '04-12-2000', name: 'Book, Devin', LastVisit: '03-12-2024' },
        { id: '04-12-2001', name: 'James Bond', LastVisit: '03-12-2024' },
        { id: '04-12-201104', name: 'Pogi ako', LastVisit: '03-12-2024' },
        { id: '04-12-2003124', name: 'Pogi akoakoakoakoako', LastVisit: '03-12-2024' },
        { id: '04-12-2012304', name: 'Pogi ako', LastVisit: '03-12-2024' },
        { id: '04-12-212313004', name: 'Pogi ako', LastVisit: '03-12-2024' },
        { id: '04-12-2001234', name: 'Pogi ako', LastVisit: '03-12-2024' },
        { id: '04-12-20123304', name: 'Pogi ako', LastVisit: '03-12-2024' },
        { id: '04-12-2412004', name: 'Pogi ako', LastVisit: '03-12-2024' },
    ]);

    const OpenModalAddPatient = () => {
        setAddpatient(!Addpatient);
    };

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredPatients = Patients_Info.filter((patient) =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className='container mx-auto p-4'>
            <div className='flex justify-between items-center'>
                <h1 className='text-2xl font-semibold'>Patients List</h1>
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
                    <div className='flex-1'>ID</div>
                    <div className='flex-1'>Patient Name</div>
                    <div className='flex-1'>Last Visit</div>
                    <div className='flex-1 text-center'>Actions</div>
                </div>
                {filteredPatients.map((patient) => (
                    <div key={patient.id} className='flex w-full items-center border-b py-2'>
                        <div className='flex-1'>{patient.id}</div>
                        <div className='flex-1'>{patient.name}</div>
                        <div className='flex-1'>{patient.LastVisit}</div>
                        <div className='flex-1 flex gap-2 justify-center'>
                            <button className='text-blue-500' onClick={() => alert(patient.id)}>
                                <span className="material-symbols-outlined">visibility</span>
                            </button>
                            <button className='text-yellow-500'>
                                <span className="material-symbols-outlined">edit</span>
                            </button>
                            {/* <button className='text-red-500'>
                                <span className="material-symbols-outlined">delete</span>
                            </button> */}
                        </div>
                    </div>
                ))}
            </div>
            <button className='btn btn-success fixed bottom-4 right-4' onClick={OpenModalAddPatient}>Add Patients</button>

            <Modal
                isOpen={Addpatient}
                close={() => setAddpatient(false)}
            >
                <h3 className="font-bold text-lg">Add New Patient</h3>
                <p className="py-4">Fill in the details to add a new patient.</p>
            </Modal>
        </div>
    );
}
