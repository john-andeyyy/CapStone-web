import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function DentistEdit({ isOpen, close, selectedDentist }) {
    const [dentistData, setDentistData] = useState({
        FirstName: '',
        LastName: '',
        MiddleName: '',
        ContactNumber: '',
        Address: '',
        Gender: '',
        LicenseNo: '',
        ProfilePicture: null, // For file input
    });

    // Ref for the file input
    const fileInputRef = useRef(null);

    // Populate form with selected dentist data when component is opened
    useEffect(() => {
        if (isOpen && selectedDentist) {
            setDentistData({
                FirstName: selectedDentist.FirstName || '',
                LastName: selectedDentist.LastName || '',
                MiddleName: selectedDentist.MiddleName || '',
                ContactNumber: selectedDentist.ContactNumber || '',
                Address: selectedDentist.Address || '',
                Gender: selectedDentist.Gender || '',
                LicenseNo: selectedDentist.LicenseNo || '',
                ProfilePicture: null, // Resetting file input
            });
        }
    }, [isOpen, selectedDentist]);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setDentistData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle file change
    const handleFileChange = (e) => {
        setDentistData((prevData) => ({
            ...prevData,
            ProfilePicture: e.target.files[0], // Get the selected file
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(dentistData).forEach(([key, value]) => {
            formData.append(key, value);
        });

        try {
            await axios.put(`{{local}}/dentist/Dentistdata/update/${selectedDentist.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Important for file uploads
                },
            });
            close(); // Close the modal after successful submission
        } catch (error) {
            console.error("Error updating dentist data:", error);
        }
    };

    if (!isOpen) return null; // Don't render anything if not open

    // Function to get the profile image
    const getProfileImage = (profilePicture) => {
        if (profilePicture) {
            // Convert the buffer to a base64 string
            const base64String = profilePicture.toString('base64');
            return `data:image/jpeg;base64,${base64String}`; // Adjust to image format (jpeg/png)
        } else {
            return "https://via.placeholder.com/150"; // Fallback if no image
        }
    };

    // Profile image state
    const [profileImage, setProfileImage] = useState(getProfileImage(selectedDentist.ProfilePicture));

    useEffect(() => {
        setProfileImage(getProfileImage(selectedDentist.ProfilePicture));
    }, [selectedDentist]);

    // Function to trigger file input click
    const handleEditNewClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-secondary rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Edit Dentist Information</h2>
                <div className="mb-4 flex justify-center items-center">
                    <img
                        src={profileImage || "https://via.placeholder.com/150"}
                        alt="Profile"
                        className="w-32 h-32 rounded-full mb-4"
                    />
                    <button
                        type="button"
                        onClick={handleEditNewClick}
                        className="ml-4 bg-blue-500 text-white rounded-md px-4 py-2"
                    >
                        Edit New
                    </button>
                    <input
                        type="file"
                        name="ProfilePicture"
                        accept="image/*"
                        onChange={handleFileChange}
                        ref={fileInputRef} // Attach ref to file input
                        className="hidden" // Hide the file input
                    />
                </div>
                <form onSubmit={handleSubmit}>
                    <div className='grid grid-cols-3 gap-3'>
                        <div>
                            <label className="block mb-1">First Name</label>
                            <input
                                type="text"
                                name="FirstName"
                                value={dentistData.FirstName}
                                onChange={handleChange}
                                placeholder="First Name"
                                required
                                className="border border-gray-300 rounded-md p-2 w-full"
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Last Name</label>
                            <input
                                type="text"
                                name="LastName"
                                value={dentistData.LastName}
                                onChange={handleChange}
                                placeholder="Last Name"
                                required
                                className="border border-gray-300 rounded-md p-2 w-full"
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Middle Name</label>
                            <input
                                type="text"
                                name="MiddleName"
                                value={dentistData.MiddleName}
                                onChange={handleChange}
                                placeholder="Middle Name"
                                className="border border-gray-300 rounded-md p-2 w-full"
                            />
                        </div>

                        <div>
                            <label className="block mb-1">Contact Number</label>
                            <input
                                type="text"
                                name="ContactNumber"
                                value={dentistData.ContactNumber}
                                onChange={handleChange}
                                placeholder="Contact Number"
                                required
                                className="border border-gray-300 rounded-md p-2 mb-4 w-full"
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Address</label>
                            <input
                                type="text"
                                name="Address"
                                value={dentistData.Address}
                                onChange={handleChange}
                                placeholder="Address"
                                className="border border-gray-300 rounded-md p-2 mb-4 w-full"
                            />
                        </div>

                        <div >
                            <label className="block mb-1">Gender</label>
                            <select
                                name="Gender"
                                value={dentistData.Gender}
                                onChange={handleChange}
                                placeholder="Gender"
                                className="border border-gray-300 rounded-md p-2 mb-4 w-full"
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
                        <div>
                            <label className="block mb-1">License No.</label>
                            <input
                                type="text"
                                name="LicenseNo"
                                value={dentistData.LicenseNo}
                                onChange={handleChange}
                                placeholder="License No."
                                className="border border-gray-300 rounded-md p-2 mb-4 w-full"
                            />
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <button type="submit" className="bg-blue-500 text-white rounded-md px-4 py-2">Update</button>
                        <button type="button" onClick={close} className="bg-gray-300 text-black rounded-md px-4 py-2">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}