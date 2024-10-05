import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DentistEdit from '../Components/Dentist/Dentist_edit';
import { Link, useNavigate } from 'react-router-dom';
export default function Dentist() {
    const BASEURL = import.meta.env.VITE_BASEURL;
const navigate = useNavigate()
    const [dentists, setDentists] = useState([]);
    const [selectedDentist, setSelectedDentist] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

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
            console.log(response.data)
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

            // Assuming the API returns the new dentist data in response.data
            if (response.status === 201) {
                setDentists([...dentists, response.data]);
                alert('Dentist added successfully!');
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
    const getProfileImage = (profilePicture) => {
        if (profilePicture) {
            // Convert the buffer to a base64 string
            const base64String = profilePicture.toString('base64');
            return `data:image/jpeg;base64,${base64String}`; // Adjust to image format (jpeg/png)
        } else {
            return "https://via.placeholder.com/150"; // Fallback if no image
        }
    };

    const [isEditmodal, setisEditmodal] = useState(false)

    const handle_availability = (userid) => {
        const currentstatus = userid.isAvailable;
        const newStatus = !currentstatus;

        // Prepare the payload for the PUT request
        const payload = {
            Status: newStatus,
        };

        // Ensure the endpoint name is correct
        axios.put(`${BASEURL}/dentist/Dentistdata/tongleavailable/${userid._id}`, payload, {
            withCredentials: true
        })
            .then((response) => {
                if (response.status === 200) {


                    const updatedDentist = dentists.find(dentist => dentist._id == userid._id)
                    if (updatedDentist) {
                        updatedDentist.isAvailable = newStatus;
                    }
                    setDentists([...dentists]);

                    alert('Availability updated successfully!');
                } else {
                    console.warn('Unexpected response status:', response.status);
                }
            })
            .catch((error) => {
                console.error("Error updating availability:", error);
                alert('Failed to update availability. Please try again.');
            });
    };

    

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4 text-center">Dentist List</h1>
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
                <table className="min-w-full text-left">
                    <thead>
                        <tr className="text-sm text-white bg-primary">
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
                        ) : dentists.length > 0 ? (
                            dentists.map((dentist) => (
                                <tr key={dentist._id} className="hover:bg-secondary border-b">
                                    <td className="py-3 px-5">{`${dentist.FirstName} ${dentist.LastName}`}</td>
                                    <td className="py-3 px-5">{dentist.isAvailable ? 'Yes' : 'No'}</td>
                                    <td className="py-3 px-5 space-x-3 text-center">
                                        <button onClick={() => handleRowClick(dentist)} className="text-green-500">View</button>
                                        <button className="text-blue-500"
                                            onClick={() => {
                                                setisEditmodal(true)
                                                setSelectedDentist(dentist)
                                            }}
                                        >Edit</button>

                                        <button className="text-red-500"
                                            onClick={() => {
                                                handle_availability(dentist)
                                            }}
                                        >
                                            {dentist.isAvailable ? 'To unavailable' : 'to available'}
                                        </button>
                                        <button className="text-green-500"
                                            onClick={() => {
                                                navigate(`/DentistSchedule/${dentist._id}`)
                                            }}
                                        >
                                            Schedule
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
            </div>

            {isEditmodal && (
                <DentistEdit
                    isOpen={isEditmodal}
                    close={() => setisEditmodal(false)}
                    selectedDentist={selectedDentist}
                />
            )}

            {showModal && selectedDentist && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                    <div className="p-6 bg-accent rounded-lg shadow-lg relative w-11/12 max-w-md">
                        <button
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                            onClick={handleCloseModal}
                        >
                            &times;
                        </button>

                        <div className="flex flex-col items-center">
                            <img
                                src={getProfileImage(selectedDentist.ProfilePicture)} // Replace with the actual path to the dentist's image
                                alt={`${selectedDentist.FirstName} ${selectedDentist.LastName}`}
                                className="w-24 h-24 rounded-full mb-4 object-cover border-2 border-gray-300"
                            />
                            <h2 className="text-xl font-bold mb-4">{`${selectedDentist.FirstName} ${selectedDentist.LastName}`}</h2>
                        </div>

                        <p><strong>Contact Number:</strong> {selectedDentist.ContactNumber}</p>
                        <p><strong>License Number:</strong> {selectedDentist.LicenseNo}</p>
                        <p><strong>Address:</strong> {selectedDentist.Address}</p>
                        <p><strong>Gender:</strong> {selectedDentist.Gender}</p>
                        <p><strong>Available:</strong> {selectedDentist.isAvailable ? 'Yes' : 'No'}</p>
                    </div>
                </div>

            )}

            {showAddModal && (
                <div className="fixed inset-0 flex justify-center items-center ">
                    <div className="p-6 bg-accent rounded-lg shadow-lg relative w-11/12 max-w-3xl">
                        <h2 className="text-xl font-bold mb-4 text-center">Add New Dentist</h2>
                        <div className="flex justify-center">
                            {previewImage && (
                                <div className="mt-2">
                                    <img
                                        src={previewImage}
                                        alt="Selected Profile"
                                        className="h-32 w-h-32 "
                                    />
                                </div>
                            )}
                        </div>
                        <form onSubmit={handleCreateDentist} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">First Name</label>
                                <input
                                    type="text"
                                    name="FirstName"
                                    value={newDentist.FirstName}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded bg-white text-black "
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
                                    className="w-full p-2 border rounded bg-white text-black "
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
                                    className="w-full p-2 border rounded bg-white text-black"
                                    placeholder="Enter middle name"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Contact Number</label>
                                <input
                                    type="text"
                                    name="ContactNumber"
                                    value={newDentist.ContactNumber}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded bg-white text-black"
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
                                    className="w-full p-2 border rounded bg-white text-black"
                                    placeholder="Enter address"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">License Number</label>
                                <input
                                    type="text"
                                    name="LicenseNo"
                                    value={newDentist.LicenseNo}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded bg-white text-black"
                                    placeholder="Enter license number"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Gender</label>
                                <select
                                    name="Gender"
                                    value={newDentist.Gender}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded bg-white text-black"
                                    required
                                >
                                    <option value="">Select gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Non-binary">Non-binary</option>
                                    <option value="Genderqueer">Genderqueer</option>
                                    <option value="Transgender">Transgender</option>
                                    <option value="Genderfluid">Genderfluid</option>
                                    <option value="Agender">Agender</option>
                                    <option value="Two-spirit">Two-spirit</option>
                                    <option value="Other">Other</option>
                                    <option value="Prefer not to say">Prefer not to say</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Profile Picture</label>
                                <input
                                    type="file"
                                    name="ProfilePicture"
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded bg-white text-black"
                                    accept="image/*"
                                />
                            </div>
                            <div className="col-span-2 flex justify-center">
                                <button
                                    type="submit"
                                    className="bg-primary text-white px-6 py-2 rounded-lg"
                                >
                                    Add Dentist
                                </button>
                            </div>
                        </form>
                        <button
                            className="absolute top-2 right-2 hover:text-gray-700"
                            onClick={handleCloseAddModal}
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
