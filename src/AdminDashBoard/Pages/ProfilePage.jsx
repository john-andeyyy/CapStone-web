import React, { useState } from 'react';
import ThemeController from '../../Guest/GuestComponents/ThemeController';

const ProfilePage = () => {
    const [profile, setProfile] = useState({
        gmail: '',
        firstName: '',
        lastName: '',
        contactNumber: '',
        profilePic: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    };

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setProfile((prevProfile) => ({
                    ...prevProfile,
                    profilePic: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddAdmin = () => {
        // Logic to add admin
        console.log('Add Admin');
    };

    const handleAddDentist = () => {
        // Logic to add dentist
        console.log('Add Dentist');
    };

    return (
        <div className="min-h-screen flex justify-center items-center">
            <div className=" p-6 rounded-lg shadow-lg w-full max-w-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">Profile Page</h1>
                    <div className="flex items-center">
                        <button
                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mr-2"
                            onClick={handleAddAdmin}
                        >
                            Add Admin
                        </button>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                            onClick={handleAddDentist}
                        >
                            Add Dentist
                        </button>
                    </div>
                </div>
                <div className="profile-form space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-group">
                            <label className="block text-gray-700">First Name:</label>
                            <input
                                type="text"
                                name="firstName"
                                value={profile.firstName}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full border rounded-md"
                            />
                        </div>
                        <div className="form-group">
                            <label className="block text-gray-700">Last Name:</label>
                            <input
                                type="text"
                                name="lastName"
                                value={profile.lastName}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full border rounded-md"
                            />
                        </div>
                        <div className="form-group">
                            <label className="block text-gray-700">Gmail:</label>
                            <input
                                type="email"
                                name="gmail"
                                value={profile.gmail}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full border rounded-md"
                            />
                        </div>
                        <div className="form-group">
                            <label className="block text-gray-700">Contact Number:</label>
                            <input
                                type="text"
                                name="contactNumber"
                                value={profile.contactNumber}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full border rounded-md"
                            />
                        </div>
                        <div className="form-group col-span-2">
                            <label className="block text-gray-700">Profile Picture:</label>
                            <input
                                type="file"
                                onChange={handleProfilePicChange}
                                className="mt-1 w-full"
                            />
                            {profile.profilePic && (
                                <img
                                    src={profile.profilePic}
                                    alt="Profile"
                                    className="mt-4 w-32 h-32 mx-auto"
                                />
                            )}
                        </div>
                    </div>
                    <ThemeController/>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
