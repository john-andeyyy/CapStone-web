import React, { useEffect, useState } from 'react';

export default function AddGroupMember() {
  const BASEURL = import.meta.env.VITE_BASEURL;
  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
    MiddleName: '',
    ContactNumber: '',
    Facebooklink: '',
    ProfilePicture: null, // File input
    Role: '',
    Email: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASEURL}/members/group-members`);
        const data = await response.json();

        setFormData({
          FirstName: data.FirstName || '',
          LastName: data.LastName || '',
          MiddleName: data.MiddleName || '',
          ContactNumber: data.ContactNumber || '',
          Facebooklink: data.Facebooklink || '',
          ProfilePicture: null, // Reset file input
          Role: data.Role || '',
          Email: data.Email || '',
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, [BASEURL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      ProfilePicture: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await fetch(`${BASEURL}/members/group-members`, {
        method: 'PUT',
        body: formDataToSend,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Update successful:', result);
        alert('Member added successfully!'); // Alert on successful addition
        setFormData({
          FirstName: '',
          LastName: '',
          MiddleName: '',
          ContactNumber: '',
          Facebooklink: '',
          ProfilePicture: null, // Reset file input
          Role: '',
          Email: '',
        });
      } else {
        console.error('Update failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Edit Our Services</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
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
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Contact Number:</label>
          <input
            type="tel"
            name="ContactNumber"
            value={formData.ContactNumber}
            onChange={handleChange}
            required
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
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Create
        </button>
      </form>
    </div>
  );
}
