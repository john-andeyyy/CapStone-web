import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { showToast } from '../../AdminDashBoard/Components/ToastNotification';
export default function AddGroupMemberModal({ isOpen, onClose, memberlist, addtolist }) {
  const BASEURL = import.meta.env.VITE_BASEURL;
  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
    MiddleName: '',
    ContactNumber: '',
    Facebooklink: '',
    ProfilePicture: null,
    Role: '',
    Email: '',
  });

  const [previewImage, setPreviewImage] = useState(null); // State for image preview

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      ProfilePicture: file,
    });

    // Create an image preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await axios.post(`${BASEURL}/members/group-members`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        showToast('success', 'Member added successfully!');

        addtolist([...memberlist, response.data]);
        setFormData({
          FirstName: '',
          LastName: '',
          MiddleName: '',
          ContactNumber: '',
          Facebooklink: '',
          ProfilePicture: null,
          Role: '',
          Email: '',
        });
        setPreviewImage(null);
        onClose();
      } else {
        console.error('Failed to add member:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  if (!isOpen) return null; 

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative p-5 border max-w-4xl shadow-lg rounded-md bg-secondary">
        <h1 className="text-2xl font-bold mb-6 text-center">Add Group Member</h1>
        <div className="flex justify-center">
          {previewImage && (
            <div className="mt-2">
              <img
                src={previewImage}
                alt="Selected Profile"
                className="h-24 w-24 "
              />
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="rounded-lg p-6">
          {/* Form fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">First Name:</label>
              <input
                type="text"
                name="FirstName"
                value={formData.FirstName}
                onChange={handleChange}
                required
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Last Name:</label>
              <input
                type="text"
                name="LastName"
                value={formData.LastName}
                onChange={handleChange}
                required
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Middle Name:</label>
              <input
                type="text"
                name="MiddleName"
                value={formData.MiddleName}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Contact Number:</label>
              <input
                type="tel"
                name="ContactNumber"
                value={formData.ContactNumber}
                onChange={handleChange}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/\D/g, '');
                }}
                required
                minLength={11}
                maxLength={11}
                pattern="\d{11}"
                title="Please enter a valid 11-digit contact number"
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Facebook Link:</label>
              <input
                type="url"
                name="Facebooklink"
                value={formData.Facebooklink}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Profile Picture:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Role:</label>
              <input
                type="text"
                name="Role"
                value={formData.Role}
                onChange={handleChange}
                required
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email:</label>
              <input
                type="email"
                name="Email"
                value={formData.Email}
                onChange={handleChange}
                required
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white font-semibold py-2 px-4 rounded-md mr-2 hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
