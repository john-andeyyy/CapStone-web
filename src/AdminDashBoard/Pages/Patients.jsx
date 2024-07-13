import React, { useState } from 'react';
import Modal from '../Components/Modal';

export default function Patients_List() {
    const [addPatient, setAddPatient] = useState(false);
    const [editPatient, setEditPatient] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [patientsInfo, setPatientsInfo] = useState([
        { id: '04-12-2000', name: 'Book, Devin', lastVisit: '03-12-2024' },
        { id: '04-12-2001', name: 'James Bond', lastVisit: '03-12-2024' },
        { id: '04-12-201104', name: 'Pogi ako', lastVisit: '03-12-2024' },
        { id: '04-12-2500001', name: 'John Doe', lastVisit: '03-12-2024' },
        { id: '04-12-2500002', name: 'Jane Doe', lastVisit: '03-12-2024' },
        { id: '04-12-2500003', name: 'Michael Scott', lastVisit: '03-12-2024' },
        { id: '04-12-2500004', name: 'Pam Beesly', lastVisit: '03-12-2024' },
        { id: '04-12-2500005', name: 'Dwight Schrute', lastVisit: '03-12-2024' },
        { id: '04-12-2500006', name: 'Jim Halpert', lastVisit: '03-12-2024' },
        { id: '04-12-2500007', name: 'Stanley Hudson', lastVisit: '03-12-2024' },
        { id: '04-12-2500008', name: 'Angela Martin', lastVisit: '03-12-2024' },
        { id: '04-12-2500009', name: 'Kevin Malone', lastVisit: '03-12-2024' },
        { id: '04-12-2500010', name: 'Meredith Palmer', lastVisit: '03-12-2024' },
    ]);

    const [selectedPatient, setSelectedPatient] = useState(null);
    const [newPatient, setNewPatient] = useState({ id: '', name: '', lastVisit: '' });
    const [searchQuery, setSearchQuery] = useState('');

    const openModalAddPatient = () => {
        setNewPatient({ id: '', name: '', lastVisit: '' });
        setAddPatient(true);
    };

    const openModalEditPatient = (patient) => {
        setSelectedPatient(patient);
        setNewPatient({ ...patient });
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

    const filteredPatients = patientsInfo.filter((patient) =>
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
                    <div className='flex-1'>Patient Name</div>
                    <div className='flex-1'>Last Visit</div>
                    <div className='flex-1 text-center'>Actions</div>
                </div>
                {filteredPatients.map((patient) => (
                    <div key={patient.id} className='flex w-full items-center border-b py-2'>
                        <div className='flex-1'>{patient.name}</div>
                        <div className='flex-1'>{patient.LastVisit}</div>
                        <div className='flex-1 flex gap-2 justify-center'>
                            <button className='text-blue-500' onClick={() => alert(patient.id)}>
                                <span className="material-symbols-outlined">visibility</span>
                            </button>
                            <button className='text-yellow-500' onClick={() => openModalEditPatient(patient)}>
                                <span className="material-symbols-outlined">edit</span>
                            </button>
                            <button className='text-red-500' onClick={() => openModalDeleteConfirmation(patient)}>
                                <span className="material-symbols-outlined">delete</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <button className='btn btn-success fixed bottom-4 right-4' onClick={openModalAddPatient}>Add Patient</button>

            <Modal isOpen={addPatient} close={() => setAddPatient(false)}>
                <h3 className="font-bold text-lg">Add New Patient</h3>
                <form onSubmit={(e) => { e.preventDefault(); handleAddPatient(); }}>
                    <label className="text-sm">ID</label>
                    <input
                        type="text"
                        placeholder="ID"
                        value={newPatient.id}
                        onChange={(e) => setNewPatient({ ...newPatient, id: e.target.value })}
                        className="border p-2 mb-2 text-sm"
                        required
                    />
                    <label className="text-sm">Patient Name</label>
                    <input
                        type="text"
                        placeholder="Patient Name"
                        value={newPatient.name}
                        onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                        className="border p-2 mb-2 text-sm"
                        required
                    />
                    <label className="text-sm">Last Visit</label>
                    <input
                        type="text"
                        placeholder="Last Visit"
                        value={newPatient.lastVisit}
                        onChange={(e) => setNewPatient({ ...newPatient, lastVisit: e.target.value })}
                        className="border p-2 mb-2 text-sm"
                        required
                    />
                    <button type="submit" className="btn btn-success text-sm">Add Patient</button>
                </form>
            </Modal>

            <Modal isOpen={editPatient} close={() => setEditPatient(false)}>
                <h3 className="font-bold text-lg">Edit Patient</h3>
                <form onSubmit={(e) => { e.preventDefault(); handleEditPatient(); }}>
                    <label className="text-sm">ID</label>
                    <input
                        type="text"
                        placeholder="ID"
                        value={newPatient.id}
                        className="border p-2 mb-2 text-sm"
                        readOnly
                    />
                    <label className="text-sm">Patient Name</label>
                    <input
                        type="text"
                        placeholder="Patient Name"
                        value={newPatient.name}
                        onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                        className="border p-2 mb-2 text-sm"
                        required
                    />
                    <label className="text-sm">Last Visit</label>
                    <input
                        type="text"
                        placeholder="Last Visit"
                        value={newPatient.lastVisit}
                        onChange={(e) => setNewPatient({ ...newPatient, lastVisit: e.target.value })}
                        className="border p-2 mb-2 text-sm"
                        required
                    />
                    <button type="submit" className="btn btn-success text-sm">Update Patient</button>
                </form>
            </Modal>

            <Modal isOpen={deleteConfirmation} close={() => setDeleteConfirmation(false)}>
                <h3 className="font-bold text-lg">Confirm Deletion</h3>
                <p className="text-sm">Are you sure you want to delete the patient: {selectedPatient?.name}?</p>
                <div className="flex justify-end mt-4">
                    <button onClick={handleDeletePatient} className="btn btn-danger text-sm mr-2">Yes, Delete</button>
                    <button onClick={() => setDeleteConfirmation(false)} className="btn btn-secondary text-sm">Cancel</button>
                </div>
            </Modal>
        </div>
    );
}
