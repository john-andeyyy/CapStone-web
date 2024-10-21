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
    const [isEditmodal, setisEditmodal] = useState(false);

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

                const createdDentist = {
                    ...newDentist, // Spread the existing data
                    _id: response.data.data._id, // Assuming the API returns the new ID
                    isAvailable: true // Default value if needed, adjust according to your logic
                };

                setDentists((prevDentists) => [...prevDentists, createdDentist]);


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
                // fetchDentistList();
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
                <button className="bg-[#3EB489] hover:bg-[#62A78E] py-2 px-4 rounded-lg text-white" onClick={handleAddDentist}>
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


            <div className="w-full overflow-auto">
                <table className="min-w-full text-left ">
                    <thead>
                        <tr className="text-sm text-white bg-primary ">
                            <th className="py-3 px-5 bg-[#3EB489] text-center border border-black">Name</th>
                            <th className="py-3 px-5 bg-[#3EB489] text-center border border-black">Available</th>
                            <th className="py-3 px-5 bg-[#3EB489] text-center border border-black">Actions</th>
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
                                    <td className="py-3 px-5 bg-gray-100 border border-black">{`${dentist.FirstName} ${dentist.LastName}`}</td>
                                    <td className="py-3 px-5 bg-gray-100 border border-black">{dentist.isAvailable ? 'Yes' : 'No'}</td>
                                    <td className="py-3 px-5 space-x-3 text-center bg-gray-100 border border-black">
                                        {/* <button onClick={() => handleRowClick(dentist)} className="text-green-500">View</button> */}

                                        <div className="flex-1 flex gap-2 justify-center">
                                            <button
                                                className="flex flex-col items-center justify-center w-10 bg-blue-100 text-blue-500 hover:text-blue-600 transition rounded-lg shadow-sm "
                                                onClick={() => handleRowClick(dentist)}
                                                title='view'
                                            >
                                                <span className="material-symbols-outlined">visibility</span>
                                            </button>

                                            <button
                                                className={`flex items-center ${dentist.isAvailable ? 'text-green-500 flex flex-col items-center justify-center w-10 bg-green-100 transition rounded-lg shadow-sm' : 'text-red-500 flex flex-col items-center justify-center w-10 bg-red-100 transition rounded-lg shadow-sm'}`}
                                                onClick={() => {
                                                    handle_availability(dentist);
                                                }}
                                                title={dentist.isAvailable ? 'to unavailable' : 'to available'} // Tooltip text
                                            >
                                                <span className="material-symbols-outlined">
                                                    {dentist.isAvailable ? 'check_circle' : 'do_not_disturb_on'}
                                                </span>
                                            </button>




                                            <button
                                                className="text-yellow-500 flex flex-col items-center justify-center w-10 bg-yellow-100 hover:text-yellow-600 transition rounded-lg shadow-sm"
                                                onClick={() => {
                                                    navigate(`/DentistSchedule/${dentist._id}`);
                                                }}
                                                title="Schedule"
                                            >
                                                <span className="material-symbols-outlined">
                                                    calendar_month
                                                </span>
                                            </button>

                                            <button
                                                className="text-gray-500 flex flex-col items-center justify-center w-10 bg-gray-200 hover:text-gray-600 transition rounded-lg shadow-sm"
                                                onClick={() => openModal(dentist._id)}
                                                title='manage availability'
                                            >
                                                <span className="material-symbols-outlined">
                                                    manage_accounts
                                                </span>
                                            </button>


                                        </div>
                                        {/* <button
                                            className="text-blue-500"
                                            onClick={() => {
                                                setisEditmodal(true);
                                                setSelectedDentist(dentist)

                                            }}
                                        >
                                            Edit
                                        </button> */}


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
                        <div className="bg-accent p-6 rounded shadow-md relative">
                            {/* Close Button positioned in the top-right corner */}
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 text-white"
                            >
                                <span className="material-symbols-outlined text-gray-500">
                                    close
                                </span>
                            </button>

                            {/* UnavailableDentist Component */}
                            <UnavailableDentist dentistId={selectedDentistId} />
                        </div>
                    </div>
                )}

            </div>


            {isEditmodal && (
                <DentistEdit
                    isOpen={isEditmodal}
                    onClose={() => setisEditmodal(false)}
                    selectedDentist={selectedDentist}
                    updateDentistData={updateDentistData}
                />
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#C6E4DA] rounded-lg p-6 w-11/12 max-w-lg">
                        <h2 className="text-2xl mb-4 text-[#266D53] text-center">Dentist Details</h2>
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

                        <div className='grid grid-cols-2 gap-4'>
                            <button
                                className="bg-[#4285F4] hover:bg-[#0C65F8] text-black"
                                onClick={() => {
                                    setisEditmodal(true);
                                    setShowModal(false);
                                    setSelectedDentist(dentist)
                                }}
                            >
                                Edit
                            </button>

                            <button onClick={handleCloseModal} className=" bg-[#D9D9D9] hover:bg-[#ADAAAA] text-black py-2 px-4 rounded">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <form className="bg-[#C6E4DA] rounded-lg p-6 w-11/12 max-w-lg" onSubmit={handleCreateDentist}>
                        <h2 className="text-2xl mb-4 text-[#266D53] text-center">Add Dentist</h2>

                        <div className='grid grid-cols-2 gap-4 mt-5'>
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
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
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
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
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
                        </div>

                        <input
                            type="text"
                            name="LicenseNo"
                            placeholder="License No"
                            value={newDentist.LicenseNo}
                            onChange={handleChange}
                            required
                            className="w-full mb-4 p-2 border border-gray-300 rounded"
                        />

                        <div className='text-black mb-3'>
                            <p>Upload Picture</p>
                        </div>

                        <input
                            type="file"
                            name="ProfilePicture"
                            accept="image/*"
                            onChange={handleChange}
                            className="mb-4"
                        />
                        {previewImage && (
                            <img src={previewImage} alt="Profile Preview" className="w-32 h-32 rounded mb-4 flex" />
                        )}

                        <div className='grid grid-cols-2 gap-4'>
                            <button
                                type="submit"
                                className="bg-[#4285F4] hover:bg-[#0C65F8] text-black py-2 rounded"
                            >
                                Add
                            </button>
                            <button onClick={handleCloseAddModal} className=" bg-[#D9D9D9] hover:bg-[#ADAAAA] text-black py-2 rounded">Close</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
