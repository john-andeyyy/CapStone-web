import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DentistEdit from '../Components/Dentist/Dentist_edit';
import { Link, useNavigate } from 'react-router-dom';
import { showToast } from '../../AdminDashBoard/Components/ToastNotification';
import UnavailableDentist from '../Components/Dentist/UnavailableDentist';

export default function Dentist() {
    const BASEURL = import.meta.env.VITE_BASEURL;
    const navigate = useNavigate();
    const [dentists, setDentists] = useState([]);
    const [selectedDentist, setSelectedDentist] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [filterText, setFilterText] = useState('');
    const [availabilityFilter, setAvailabilityFilter] = useState('available');

    const [newDentist, setNewDentist] = useState({
        FirstName: '',
        LastName: '',
        MiddleName: '',
        ContactNumber: '',
        Address: '',
        Gender: '',
        LicenseNo: '',
        ProfilePicture: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

    const handleRowClick = (dentist) => {
        setSelectedDentist(dentist);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedDentist(null);
    };

    const handleAddDentist = () => {
        setShowAddModal(true);
    };

    const handleCreateDentist = async (e) => {
        e.preventDefault();

        // Check for empty required fields
        if (!newDentist.FirstName || !newDentist.LastName || !newDentist.ContactNumber || !newDentist.LicenseNo) {
            alert('Please fill out all required fields.');
            return; // Exit the function early
        }

        const formData = new FormData();
        formData.append('FirstName', newDentist.FirstName);
        formData.append('LastName', newDentist.LastName);
        formData.append('MiddleName', newDentist.MiddleName);
        formData.append('ContactNumber', newDentist.ContactNumber);
        formData.append('Address', newDentist.Address);
        formData.append('Gender', newDentist.Gender);
        formData.append('LicenseNo', newDentist.LicenseNo);
        formData.append('ProfilePicture', newDentist.ProfilePicture);

        try {
            const response = await axios.post(`${BASEURL}/dentist/create`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 201) {
                setDentists([...dentists, response.data]);
                showToast('success', 'Dentist added successfully!');
                setShowAddModal(false);
                // Reset state
                setNewDentist({
                    FirstName: '',
                    LastName: '',
                    MiddleName: '',
                    ContactNumber: '',
                    Address: '',
                    Gender: '',
                    LicenseNo: '',
                    ProfilePicture: null
                });
                // Re-fetch the dentist list
                fetchDentistList();
            } else {
                alert('Failed to add dentist. Please try again.');
            }
        } catch (error) {
            console.error('Error adding dentist:', error);
            const errorMessage = error.response?.data?.message || 'An error occurred.';
            alert(errorMessage);
        }
    };

    const handleCloseAddModal = () => {
        setNewDentist({
            FirstName: '',
            LastName: '',
            MiddleName: '',
            ContactNumber: '',
            Address: '',
            Gender: '',
            LicenseNo: '',
            ProfilePicture: null
        });
        setShowAddModal(false);
    };

    const handleChange = (e) => {
        if (e.target.name === 'ProfilePicture') {
            const file = e.target.files[0];
            setNewDentist({ ...newDentist, ProfilePicture: file });

            // Create a URL for the preview
            const imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);
        } else {
            setNewDentist({ ...newDentist, [e.target.name]: e.target.value });
        }
    };


    const [isEditmodal, setisEditmodal] = useState(false);

    const handle_availability = (userid) => {
        const currentstatus = userid.isAvailable;
        const newStatus = !currentstatus;

        const payload = {
            Status: newStatus,
        };

        axios.put(`${BASEURL}/dentist/Dentistdata/tongleavailable/${userid._id}`, payload, {
            withCredentials: true
        })
            .then((response) => {
                if (response.status === 200) {
                    const updatedDentist = dentists.find(dentist => dentist._id === userid._id);
                    if (updatedDentist) {
                        updatedDentist.isAvailable = newStatus;
                    }
                    setDentists([...dentists]);
                    showToast('success', 'Availability updated successfully!');
                } else {
                    console.warn('Unexpected response status:', response.status);
                }
            })
            .catch((error) => {
                console.error("Error updating availability:", error);
                alert('Failed to update availability. Please try again.');
            });
    };

    const updateDentistData = (updatedDentist) => {
        setDentists((prevDentists) =>
            prevDentists.map((dentist) =>
                dentist._id === updatedDentist._id ? updatedDentist : dentist
            )
        );
    };
    const filteredDentists = dentists
        .filter((dentist) => {
            // Filter by name
            const matchesName = `${dentist.FirstName} ${dentist.LastName}`.toLowerCase().includes(filterText.toLowerCase());

            // Filter by availability
            const matchesAvailability =
                availabilityFilter === 'all' ||
                (availabilityFilter === 'available' && dentist.isAvailable) ||
                (availabilityFilter === 'unavailable' && !dentist.isAvailable);

            return matchesName && matchesAvailability;
        })
        .sort((a, b) => {
            const nameA = `${a.FirstName} ${a.LastName}`.toLowerCase();
            const nameB = `${b.FirstName} ${b.LastName}`.toLowerCase();
            return nameA.localeCompare(nameB); // Compare the names alphabetically (A to Z)
        });


    const getProfileImage = (profilePicture) => {
        if (profilePicture) {
            // Convert the buffer to a base64 string
            const base64String = profilePicture.toString('base64');
            return `data:image/jpeg;base64,${base64String}`; // Adjust to image format (jpeg/png)
        } else {
            return "https://via.placeholder.com/150"; // Fallback if no image
        }
    };
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDentistId, setSelectedDentistId] = useState('');

    const openModal = (dentistId) => {
        setSelectedDentistId(dentistId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDentistId(''); // Clear selected dentist ID
    };
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4 text-center">Dentist List</h1>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <div className="flex justify-between mb-4 ">
                <button className="bg-primary py-2 px-4 rounded-lg hover:bg-secondary text-white" onClick={handleAddDentist}>
                    Add Dentist
                </button>

                <div className="flex space-x-4">
                    {/* Filter by name */}
                    <input
                        type="text"
                        placeholder="Filter by name"
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        className="p-2 rounded-lg border "
                    />

                    {/* Filter by availability */}
                    <select
                        value={availabilityFilter}
                        onChange={(e) => setAvailabilityFilter(e.target.value)}
                        className="p-2 rounded-lg border"
                    >
                        <option value="all">All</option>
                        <option value="available">Available</option>
                        <option value="unavailable">Unavailable</option>
                    </select>
                </div>
            </div>


            <div className="w-full overflow-auto  rounded-3xl">
                <table className="min-w-full text-left ">
                    <thead>
                        <tr className="text-sm text-white bg-primary ">
                            <th className="py-3 px-5">Name</th>
                            <th className="py-3 px-5">Available</th>
                            <th className="py-3 px-5 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="3" className="py-3 px-5 text-center">
                                    <span className="loading loading-spinner loading-lg"></span>
                                </td>
                            </tr>
                        ) : filteredDentists.length > 0 ? (
                            filteredDentists.map((dentist) => (
                                <tr key={dentist._id} className="hover:bg-secondary border-b">
                                    <td className="py-3 px-5">{`${dentist.FirstName} ${dentist.LastName}`}</td>
                                    <td className="py-3 px-5">{dentist.isAvailable ? 'Yes' : 'No'}</td>
                                    <td className="py-3 px-5 space-x-3 text-center">
                                        <button onClick={() => handleRowClick(dentist)} className="text-green-500">View</button>
                                        <button
                                            className="text-blue-500"
                                            onClick={() => {
                                                setisEditmodal(true);
                                                setSelectedDentist(dentist);
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="text-red-500"
                                            onClick={() => {
                                                handle_availability(dentist);
                                            }}
                                        >
                                            {dentist.isAvailable ? 'To unavailable' : 'To available'}
                                        </button>
                                        <button
                                            className="text-green-500"
                                            onClick={() => {
                                                navigate(`/DentistSchedule/${dentist._id}`);
                                            }}
                                        >
                                            Schedule
                                        </button>
                                        <button
                                            className="text-green-500"
                                            onClick={() => openModal(dentist._id)} // Open the modal here
                                        >
                                            Manage Unavailable
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="py-3 px-5 text-center">No dentists found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded shadow-md">
                            <UnavailableDentist dentistId={selectedDentistId} />
                            <button onClick={closeModal} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">Close</button>
                        </div>
                    </div>
                )}
            </div>


            {isEditmodal && (
                <DentistEdit
                    isOpen={isEditmodal}
                    onClose={() => setisEditmodal(false)}
                    dentistData={selectedDentist}
                    updateDentistData={updateDentistData}
                />
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-secondary rounded-lg p-6 w-11/12 max-w-lg">
                        <h2 className="text-2xl mb-4">Dentist Details</h2>
                        {selectedDentist && (
                            <div className="flex">
                                {/* Column 1: Image */}
                                <div className="w-1/3 flex items-center justify-center">
                                    <img
                                        src={getProfileImage(selectedDentist.ProfilePicture)}
                                        alt="Dentist"
                                        className="w-40 h-36 rounded-full mb-4"
                                    />
                                </div>

                                {/* Column 2: Details */}
                                <div className="w-2/3 pl-4">
                                    <p><strong>Name:</strong> {`${selectedDentist.FirstName} ${selectedDentist.LastName}`}</p>
                                    <p><strong>Contact Number:</strong> {selectedDentist.ContactNumber}</p>
                                    <p><strong>License No:</strong> {selectedDentist.LicenseNo}</p>
                                    <p><strong>Address:</strong> {selectedDentist.Address}</p>
                                    <p><strong>Gender:</strong> {selectedDentist.Gender}</p>
                                    <p><strong>Available:</strong> {selectedDentist.isAvailable ? 'Yes' : 'No'}</p>
                                </div>
                            </div>
                        )}
                        <button onClick={handleCloseModal} className="mt-4 bg-red-500 text-white py-2 px-4 rounded">
                            Close
                        </button>
                    </div>
                </div>
            )}


            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <form className="bg-white rounded-lg p-6 w-11/12 max-w-lg" onSubmit={handleCreateDentist}>
                        <h2 className="text-2xl mb-4">Add Dentist</h2>
                        <input
                            type="text"
                            name="FirstName"
                            placeholder="First Name"
                            value={newDentist.FirstName}
                            onChange={handleChange}
                            required
                            className="w-full mb-4 p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="text"
                            name="LastName"
                            placeholder="Last Name"
                            value={newDentist.LastName}
                            onChange={handleChange}
                            required
                            className="w-full mb-4 p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="text"
                            name="MiddleName"
                            placeholder="Middle Name"
                            value={newDentist.MiddleName}
                            onChange={handleChange}
                            className="w-full mb-4 p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="text"
                            name="ContactNumber"
                            placeholder="Contact Number"
                            value={newDentist.ContactNumber}
                            onChange={handleChange}
                            required
                            className="w-full mb-4 p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="text"
                            name="Address"
                            placeholder="Address"
                            value={newDentist.Address}
                            onChange={handleChange}
                            className="w-full mb-4 p-2 border border-gray-300 rounded"
                        />
                        <select
                            name="Gender"
                            value={newDentist.Gender}
                            onChange={handleChange}
                            className="w-full mb-4 p-2 border border-gray-300 rounded"
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                        <input
                            type="text"
                            name="LicenseNo"
                            placeholder="License No"
                            value={newDentist.LicenseNo}
                            onChange={handleChange}
                            required
                            className="w-full mb-4 p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="file"
                            name="ProfilePicture"
                            accept="image/*"
                            onChange={handleChange}
                            className="mb-4"
                        />
                        {previewImage && (
                            <img src={previewImage} alt="Profile Preview" className="w-32 h-32 rounded mb-4" />
                        )}
                        <button
                            type="submit"
                            className="w-full bg-primary text-white py-2 rounded hover:bg-blue-700"
                        >
                            Add Dentist
                        </button>
                        <button onClick={handleCloseAddModal} className="mt-4 w-full bg-red-500 text-white py-2 rounded">Close</button>
                    </form>
                </div>
            )}
        </div>
    );
}
