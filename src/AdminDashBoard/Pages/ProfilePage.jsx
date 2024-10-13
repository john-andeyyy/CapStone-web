import React, { useEffect, useState } from 'react';
import ThemeController from '../../Guest/GuestComponents/ThemeController';
import { get_profile, update_profile } from '../Fetchs/Admin/admin_profile';
import axios from 'axios';
import { showToast } from '../../AdminDashBoard/Components/ToastNotification';

const BASEURL = import.meta.env.VITE_BASEURL;

const ProfilePage = () => {
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [currentpassword, setcurrentpassword] = useState('');
    const [loading, setLoading] = useState(false);


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

    const [isEditable, setIsEditable] = useState(false);
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
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

    const handleEmailChange = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.put(
                `${BASEURL}/Admin/auth/request-email-change`,
                {
                    newEmail,
                    currentpassword
                },
                { withCredentials: true }
            );

            if (response.status === 200) {
                showToast('success', response.data.message);
                setShowEmailModal(false);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                alert(`Error: ${error.response.data.message}`);
                setMessage(error.response.data.message)
            } else {
                alert('Failed to send email change request');
            }
        } finally {
            setLoading(false);
        }
    };
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
                    ProfilePicturePreview: reader.result,
                    ProfilePicture: file,
                }));
            };
            reader.readAsDataURL(file);
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
        setIsEditable((prevEditable) => !prevEditable);
    };

    const handlePasswordChange = async () => {
        if (passwords.newPassword !== passwords.confirmNewPassword) {
            // alert("New passwords do not match.");
            setMessage('New passwords do not match.')
            return;
        }

        try {
            const response = await axios.put(`${BASEURL}/Admin/auth/Updatepass`, {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword,
            }, {
                withCredentials: true
            });

            if (response.status === 200) {
                alert('Password changed successfully');
                setMessage('Password changed successfully');
                setPasswords({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
                document.getElementById('password-modal').close(); // Close modal on success
            } else if (response.status === 401) {
                alert('Current password is incorrect');
                setMessage('Current password is incorrect');
            } else {
                alert('Something went wrong, please try again');
                setMessage('Something went wrong, please try again');
            }

        } catch (error) {
            if (error.response) {
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

    return (
        <div className="min-h-screen flex justify-center items-center p-6">
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
                                <label className="block text-white">
                                    Email:
                                    <span className="ml-4 text-blue-400 hover:underline cursor-pointer"
                                        onClick={() => setShowEmailModal(true)} // Open modal on click
                                    >change</span>
                                </label>

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
                        onClick={() => document.getElementById('password-modal').showModal()}
                    >
                        Change Password
                    </button>
                </div>

                {/* Password Change Modal */}
                <dialog id="password-modal" className="modal bg-black bg-opacity-75">
                    <div className="modal-content bg-secondary p-10">
                        <h2 className="text-xl mb-4">Change Password</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault(); // Prevent the default form submission
                                handlePasswordChange(); // Call the password change function
                            }}
                        >
                            <div className="flex flex-col">
                                <label className="text-white">Current Password:</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwords.currentPassword}
                                    onChange={handlePasswordInputChange}
                                    className="mt-1 p-2 border rounded-md"
                                    required
                                />

                                <label className="text-white">New Password:</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwords.newPassword}
                                    onChange={handlePasswordInputChange}
                                    className="mt-1 p-2 border rounded-md"
                                    required
                                />

                                <label className="text-white">Confirm New Password:</label>
                                <input
                                    type="password"
                                    name="confirmNewPassword"
                                    value={passwords.confirmNewPassword}
                                    onChange={handlePasswordInputChange}
                                    className="mt-1 p-2 border rounded-md"
                                    required
                                />
                            </div>

                            {message && <p className="text-red-500 mt-2">{message}</p>}

                            <div className="flex justify-end mt-4">
                                <button
                                    type="submit" // Ensure this button submits the form
                                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                                >
                                    Submit
                                </button>
                                <button
                                    type="button" // Prevents form submission when closing the modal
                                    className="ml-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                    onClick={() => {
                                        document.getElementById('password-modal').close()
                                        setPasswords({
                                            currentPassword: '',
                                            newPassword: '',
                                            confirmNewPassword: '',
                                        });

                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </dialog>

                {showEmailModal && (
                    <dialog id="email-change-modal" className="modal bg-black bg-opacity-75" open>
                        <div className="modal-content bg-secondary p-10 rounded-lg shadow-lg max-w-lg w-full">
                            <h2 className="text-xl font-semibold text-green-500">Change Email</h2>
                            {message && <h1 className="text-error text-xl font-bold mt-2 text-center">{message}</h1>}

                            <form onSubmit={handleEmailChange} className="flex flex-col">
                                <label className="text-white mb-2">Enter your password:</label>
                                <input
                                    type="password"
                                    name="currentpassword"
                                    value={currentpassword}
                                    onChange={(e) => setcurrentpassword(e.target.value)} // Use setcurrentpassword to update state
                                    className="mt-1 p-2 border rounded-md"
                                    required
                                    disabled={loading}
                                />
                                <label className="text-white mb-2">New Email:</label>
                                <input
                                    type="email"
                                    name="newEmail"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    className="mt-1 p-2 border rounded-md"
                                    required
                                    disabled={loading}
                                />
                                <div className="flex justify-end mt-4">
                                    <button
                                        type="submit"
                                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                                        disabled={loading}
                                    >
                                        {loading ? 'Submitting...' : 'Submit'}
                                    </button>
                                    <button
                                        type="button"
                                        className="ml-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                        onClick={() => {
                                            setShowEmailModal(false)
                                            setcurrentpassword('')
                                            setNewEmail('')
                                            setMessage('')
                                        }
                                        }

                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>

                        </div>
                    </dialog>
                )}


            </div>
        </div>
    );
};

export default ProfilePage;
