import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dentist() {
    const BASEURL = import.meta.env.VITE_BASEURL;

    const [dentists, setDentists] = useState([]);
    const [selectedDentist, setSelectedDentist] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newDentist, setNewDentist] = useState({
        FirstName: '',
        LastName: '',
        MiddleName: '',
        ContactNumber: '',
        Address: '',
        Gender: '',
        LicenseNo: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetches the list of dentists 
    const fetchDentistList = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASEURL}/dentist/dentistlist`, {
                withCredentials: true
            });
            setDentists(response.data);
            setError('');
        } catch (error) {
            setError('Failed to fetch dentist list. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDentistList();
    }, []);

    // Handles clicking on a dentist row to show details
    const handleRowClick = (dentist) => {
        setSelectedDentist(dentist);
        setShowModal(true);
    };

    // Handles closing the dentist details modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedDentist(null);
    };

    // Opens the modal to add a new dentist
    const handleAddDentist = () => {
        setShowAddModal(true);
    };

    // Handles creating a new dentist and adding them to the list
    const handleCreateDentist = async () => {
        try {
            const response = await axios.post(`${BASEURL}/dentist/create`, newDentist, {
                withCredentials: true,  // Include cookies in the request
            });

            if (response.status === 201) {
                const addedDentist = response.data;  // The newly created dentist from the response
                console.log('New dentist added:', addedDentist);

                // Update the dentists array with the newly added dentist
                setDentists([...dentists, addedDentist]);

                alert('Dentist added successfully!');
                setShowAddModal(false);

                // Reset the new dentist form
                setNewDentist({
                    FirstName: '',
                    LastName: '',
                    MiddleName: '',
                    ContactNumber: '',
                    Address: '',
                    Gender: '',
                    LicenseNo: ''
                });
                fetchDentistList();
            } else {
                alert('Failed to add dentist. Please try again.');
            }

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An error occurred.';
            alert(errorMessage);
            console.log('Error adding dentist:', errorMessage);
        }
    };

    // Handles closing the add dentist modal
    const handleCloseAddModal = () => {
        setShowAddModal(false);
    };

    // Handles form input changes for new dentist fields
    const handleChange = (e) => {
        setNewDentist({ ...newDentist, [e.target.name]: e.target.value });
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4 text-center ">Dentist List</h1>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <div className="flex justify-between mb-4 text-white">
                <button
                    className="bg-primary py-2 px-4 rounded-lg hover:bg-primary"
                    onClick={handleAddDentist}
                >
                    Add Dentist
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full text-left ">
                    <thead>
                        <tr className="text-sm text-white bg-primary rounded-lg ">
                            <th className="py-3 px-5">Name</th>
                            <th className="py-3 px-5">Available</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="2" className="py-3 px-5 text-center"><span className="loading loading-spinner loading-lg"></span></td>

                                
                            </tr>
                        ) : dentists.length > 0 ? (
                            dentists.map((dentist) => (
                                <tr
                                    key={dentist._id}  // Ensure _id is unique and properly assigned
                                    onClick={() => handleRowClick(dentist)}
                                    className="cursor-pointer hover:bg-gray-700 border-b py-2"
                                    style={{ backgroundColor: 'transparent' }} // Transparent row background
                                >
                                    <td className="py-3 px-5">{`${dentist.FirstName} ${dentist.LastName}`}</td>
                                    <td className="py-3 px-5">{dentist.isAvailable ? 'Yes' : 'No'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2" className="py-3 px-5 text-center">No dentists found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && selectedDentist && (
                <div className="fixed inset-0  flex justify-center items-center">
                    <div className="p-6 bg-accent  rounded-lg shadow-lg relative w-11/12 max-w-md">
                        <button
                            className="absolute top-2 right-2  hover:text-gray-700"
                            onClick={handleCloseModal}
                        >
                            &times;
                        </button>
                        <h2 className="text-xl font-bold mb-4">{`${selectedDentist.FirstName} ${selectedDentist.LastName}`}</h2>
                        <p><strong>Contact Number:</strong> {selectedDentist.ContactNumber}</p>
                        <p><strong>License Number:</strong> {selectedDentist.LicenseNo}</p>
                        <p><strong>Address:</strong> {selectedDentist.Address}</p>
                        <p><strong>Gender:</strong> {selectedDentist.Gender}</p>
                        <p><strong>Available:</strong> {selectedDentist.isAvailable ? 'Yes' : 'No'}</p>
                    </div>
                </div>
            )}

            {showAddModal && (
                <div className="fixed inset-0 flex justify-center items-center  text-primary">
                    <div className="p-6 bg-accent rounded-lg shadow-lg relative w-11/12 max-w-3xl">

                        <h2 className="text-xl font-bold mb-4 text-center">Add New Dentist</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">First Name</label>
                                <input
                                    type="text"
                                    name="FirstName"
                                    value={newDentist.FirstName}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    placeholder="Enter first name"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Last Name</label>
                                <input
                                    type="text"
                                    name="LastName"
                                    value={newDentist.LastName}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    placeholder="Enter last name"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Middle Name</label>
                                <input
                                    type="text"
                                    name="MiddleName"
                                    value={newDentist.MiddleName}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    placeholder="Enter middle name"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Contact Number</label>
                                <input
                                    type="tel"
                                    name="ContactNumber"
                                    value={newDentist.ContactNumber}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    placeholder="Enter contact number"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Address</label>
                                <input
                                    type="text"
                                    name="Address"
                                    value={newDentist.Address}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    placeholder="Enter address"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Gender</label>
                                <input
                                    type="text"
                                    name="Gender"
                                    value={newDentist.Gender}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    placeholder="Enter gender"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">License Number</label>
                                <input
                                    type="text"
                                    name="LicenseNo"
                                    value={newDentist.LicenseNo}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    placeholder="Enter license number"
                                    required
                                />
                            </div>
                        </div>
                        <div className='mt-4 flex justify-between'>

                            <button
                                className="bg-green-500 py-2 px-4 rounded-lg hover:bg-green-600  text-white"
                                onClick={handleCreateDentist}
                            >
                                Create Dentist
                            </button>

                            <button
                                className="py-2 px-4 bg-red-500 rounded-lg hover:bg-red-400 text-white"
                                onClick={handleCloseAddModal}
                            >
                                Cancell
                            </button>
                        </div>


                    </div>
                </div>
            )}

        </div>
    );
}
