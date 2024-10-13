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
    const [showPasswordForm, setShowPasswordForm] = useState(false); // State to toggle password change form
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
    });
    const [message, setMessage] = useState('');

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

    // Handle password change request
    const handlePasswordChange = async () => {
        try {
            const response = await axios.put(`${BASEURL}/Admin/auth/Updatepass`,
                {
                    currentPassword: passwords.currentPassword,
                    newPassword: passwords.newPassword,
                },
                {
                    withCredentials: true
                });

            // Alert and display message based on status code
            if (response.status === 200) {
                alert('Password changed successfully');
                setMessage('Password changed successfully');
            } else if (response.status === 401) {
                alert('Current password is incorrect');
                setMessage('Current password is incorrect');
            } else {
                alert('Something went wrong, please try again');
                setMessage('Something went wrong, please try again');
            }

        } catch (error) {
            if (error.response) {
                // Handle specific error responses from server
                alert(`Error: ${error.response.data.message}`);
                setMessage(error.response.data.message);
            } else {
                alert('Failed to change password');
                setMessage('Failed to change password');
            }
            console.error(error);
        }
    };



    const handlePasswordInputChange = (e) => {
        const { name, value } = e.target;
        setPasswords((prevPasswords) => ({
            ...prevPasswords,
            [name]: value,
        }));
    };

    const togglePasswordForm = () => {
        setShowPasswordForm((prevShow) => !prevShow);
    };

    return (
        <div className="min-h-screen flex justify-center items-center  p-6">
            <div className="bg-secondary p-8 rounded-lg shadow-lg w-full max-w-4xl">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Profile Page</h1>
                    <button
                        className={`bg-${isEditable ? 'red' : 'blue'}-500 text-white px-4 py-2 rounded-md hover:bg-${isEditable ? 'red' : 'blue'}-600`}
                        onClick={handleEditToggle}
                    >
                        {isEditable ? 'Cancel' : 'Edit'}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Profile Picture */}
                    <div className="col-span-1 flex flex-col items-center">
                        <label className="block text-white mb-2">Profile Picture:</label>
                        {profile.ProfilePicturePreview && (
                            <img
                                src={profile.ProfilePicturePreview}
                                alt="Profile Preview"
                                className="w-40 h-40 object-cover rounded-full mb-4"
                            />
                        )}
                        {isEditable && (
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleProfilePicChange}
                                className="mt-2 w-full text-sm text-white"
                            />
                        )}
                    </div>

                    {/* Profile Details */}
                    <div className="col-span-2 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-group">
                                <label className="block text-white">First Name:</label>
                                <input
                                    type="text"
                                    name="FirstName"
                                    value={profile.FirstName}
                                    onChange={handleChange}
                                    className="mt-1 p-2 w-full border rounded-md"
                                    readOnly={!isEditable}
                                />
                            </div>

                            <div className="form-group">
                                <label className="block text-white">Last Name:</label>
                                <input
                                    type="text"
                                    name="LastName"
                                    value={profile.LastName}
                                    onChange={handleChange}
                                    className="mt-1 p-2 w-full border rounded-md"
                                    readOnly={!isEditable}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-group">
                                <label className="block text-white">Middle Name:</label>
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
                                <label className="block text-white">Email:</label>
                                <input
                                    type="email"
                                    name="Email"
                                    value={profile.Email}
                                    onChange={handleChange}
                                    className="mt-1 p-2 w-full border rounded-md"
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-group">
                                <label className="block text-white">Username:</label>
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
                                <label className="block text-white">Contact Number:</label>
                                <input
                                    type="text"
                                    name="contactNumber"
                                    value={profile.contactNumber}
                                    onChange={handleChange}
                                    className="mt-1 p-2 w-full border rounded-md"
                                    readOnly={!isEditable}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {isEditable && (
                    <div className="flex justify-end mt-6">
                        <button
                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                            onClick={handleProfileUpdate}
                        >
                            Update Profile
                        </button>
                    </div>
                )}

                {/* Button to toggle password form */}
                <div className="flex justify-end mt-6">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        onClick={togglePasswordForm}
                    >
                        {showPasswordForm ? 'Hide Password Change' : 'Change Password'}
                    </button>
                </div>

                {/* Password Change Form */}
                {showPasswordForm && (
                    <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold mb-4">Change Password</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700">Current Password:</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwords.currentPassword}
                                    onChange={handlePasswordInputChange}
                                    className="mt-1 p-2 w-full border rounded-md"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">New Password:</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwords.newPassword}
                                    onChange={handlePasswordInputChange}
                                    className="mt-1 p-2 w-full border rounded-md"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                                onClick={handlePasswordChange}
                            >
                                Update Password
                            </button>
                        </div>
                        {message && <p className="mt-4 text-red-500">{message}</p>}
                    </div>
                )}

                <div className="mt-6">
                    <ThemeController />
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
