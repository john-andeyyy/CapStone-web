import React, { useEffect, useState } from 'react';
import ThemeController from '../../Guest/GuestComponents/ThemeController';
import { get_profile, update_profile } from '../Fetchs/Admin/admin_profile';
import axios from 'axios';
const BASEURL = import.meta.env.VITE_BASEURL;

const ProfilePage = () => {
    const [profile, setProfile] = useState({
        Email: '',
        FirstName: '',
        LastName: '',
        MiddleName: '',
        contactNumber: '',
        ProfilePicture: null,
        Username: '',
        ProfilePicturePreview: null
    });

    const [isEditable, setIsEditable] = useState(false); // State to toggle edit mode

    useEffect(() => {
        const fetchProfile = async () => {
            const profile = await get_profile();
            if (profile) {
                setProfile(profile);
            }
        };
        fetchProfile();
    }, []);

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
                    ProfilePicturePreview: reader.result, // For previewing the image
                    ProfilePicture: file, // Store the file for uploading
                }));
            };
            reader.readAsDataURL(file); // Read the file as a data URL
        }
    };

    const handleProfileUpdate = async () => {
        const formData = new FormData();
        formData.append('Email', profile.Email);
        formData.append('FirstName', profile.FirstName);
        formData.append('LastName', profile.LastName);
        formData.append('MiddleName', profile.MiddleName);
        formData.append('contactNumber', profile.contactNumber);
        formData.append('Username', profile.Username);

        if (profile.ProfilePicture) {
            formData.append('ProfilePicture', profile.ProfilePicture);
        }

        try {
            const response = await update_profile(formData);
            if (response) {
                console.log('Profile updated successfully:', response.status);
            } else {
                console.error('Failed to update profile');
            }
        } catch (error) {
            console.error('An error occurred while updating the profile:', error);
        }
    };

    const handleEditToggle = () => {
        setIsEditable((prevEditable) => !prevEditable); // Toggle edit mode
    };

    return (
        <div className="min-h-screen flex justify-center items-center">
            <div className="p-6 rounded-lg shadow-lg w-full max-w-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">Profile Page</h1>
                    <button
                        className={`bg-${isEditable ? 'red' : 'blue'}-500 text-white px-4 py-2 rounded-md hover:bg-${isEditable ? 'red' : 'blue'}-600`}
                        onClick={handleEditToggle}
                    >
                        {isEditable ? 'Cancel' : 'Edit'}
                    </button>
                </div>
                <div className="profile-form space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="form-group">
                            <label className="block text-gray-700">First Name:</label>
                            <input
                                type="text"
                                name="FirstName"
                                value={profile.FirstName}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full border rounded-md"
                                readOnly={!isEditable} // Toggle between editable and read-only
                            />
                        </div>

                        <div className="form-group">
                            <label className="block text-gray-700">Last Name:</label>
                            <input
                                type="text"
                                name="LastName"
                                value={profile.LastName}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full border rounded-md"
                                readOnly={!isEditable}
                            />
                        </div>
                        <div className="form-group">
                            <label className="block text-gray-700">Middle Name:</label>
                            <input
                                type="text"
                                name="MiddleName"
                                value={profile.MiddleName}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full border rounded-md"
                                readOnly={!isEditable}
                            />
                        </div>
                        <div className="form-group">
                            <label className="block text-gray-700">Email:</label>
                            <input
                                type="email"
                                name="Email"
                                value={profile.Email}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full border rounded-md"
                                readOnly={true} // Email remains read-only
                            />
                        </div>
                        <div className="form-group">
                            <label className="block text-gray-700">Username:</label>
                            <input
                                type="text"
                                name="Username"
                                value={profile.Username}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full border rounded-md"
                                readOnly={!isEditable}
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
                                readOnly={!isEditable}
                            />
                        </div>
                        <div className="form-group col-span-2">
                            <label className="block text-gray-700">Profile Picture:</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleProfilePicChange}
                                className="mt-1 w-full"
                                disabled={!isEditable} // Disable file input when not editable
                            />
                            {profile.ProfilePicturePreview && (
                                <img
                                    src={profile.ProfilePicturePreview}
                                    alt="Profile Preview"
                                    className="mt-4 w-40 h-40 mx-auto"
                                />
                            )}
                        </div>
                    </div>

                    {isEditable && (
                        <div>
                            <button className="btn" onClick={handleProfileUpdate}>
                                Update
                            </button>
                        </div>
                    )}
                    <ThemeController />
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
