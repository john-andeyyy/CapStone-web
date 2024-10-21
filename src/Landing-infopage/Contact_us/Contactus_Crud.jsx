import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { showToast } from '../../AdminDashBoard/Components/ToastNotification';

export default function ContactusDisplay() {
    const BASEURL = import.meta.env.VITE_BASEURL;
    const [contactInfo, setContactInfo] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        DentalName: '',
        ContactNumber: '',
        Address: '',
        Facebooklink: '',
        Email: '',
        WeekdaysTime: '',
        WeekendsTime: '',
        logo: null,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false); // Added for submission loading state

    useEffect(() => {
        const fetchContactInfo = async () => {
            try {
                const response = await axios.get(`${BASEURL}/Contactus/contactus`);
                if (response.data && response.data.length > 0) {
                    const data = response.data[0];
                    setContactInfo(data);
                    setFormData({
                        DentalName: data.DentalName,
                        ContactNumber: data.ContactNumber,
                        Address: data.Address,
                        Facebooklink: data.Facebooklink,
                        Email: data.Email,
                        WeekdaysTime: data.WeekdaysTime,
                        WeekendsTime: data.WeekendsTime,
                        logo: null, // Reset logo on fetch
                    });
                }
            } catch (error) {
                console.error('Error fetching contact info:', error);
                setError('Failed to load contact information.');
            } finally {
                setLoading(false);
            }
        };

        fetchContactInfo();
    }, [BASEURL]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'file' ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData();

        // Append form data
        Object.entries(formData).forEach(([key, value]) => {
            form.append(key, value);
        });

        setIsSubmitting(true); // Start loading

        try {
            // Send the PUT request to update the contact information
            const response = await axios.put(`${BASEURL}/Contactus/contactus/${contactInfo._id}`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const updatedContactInfo = response.data;
            setContactInfo(updatedContactInfo);
            setIsEditing(false);
            setFormData({
                DentalName: updatedContactInfo.DentalName,
                ContactNumber: updatedContactInfo.ContactNumber,
                Address: updatedContactInfo.Address,
                Facebooklink: updatedContactInfo.Facebooklink,
                Email: updatedContactInfo.Email,
                WeekdaysTime: updatedContactInfo.WeekdaysTime,
                WeekendsTime: updatedContactInfo.WeekendsTime,
                logo: null, // Reset logo on submit
            });

            const fileInput = document.getElementById('logo');
            if (fileInput) {
                fileInput.value = '';
            }
            showToast('success', 'Updated successfully!');

        } catch (error) {
            console.error('Error updating contact info:', error);
            alert('Failed to update contact information');
        } finally {
            setIsSubmitting(false); // End loading
        }
    };


    const handleCancel = () => {
        setIsEditing(false);
        setFormData({
            DentalName: contactInfo.DentalName,
            ContactNumber: contactInfo.ContactNumber,
            Address: contactInfo.Address,
            Facebooklink: contactInfo.Facebooklink,
            Email: contactInfo.Email,
            WeekdaysTime: contactInfo.WeekdaysTime,
            WeekendsTime: contactInfo.WeekendsTime,
            logo: null, // Reset logo on cancel
        });

        // Reset the file input by creating a new object URL to force the input to refresh
        const fileInput = document.getElementById('logo');
        if (fileInput) {
            fileInput.value = ''; // Clear the input field value
        }
    };

    if (loading) {
        return <div className="text-center">Loading contact information...</div>;
    }

    if (error) {
        return <div className="text-center text-red-600">{error}</div>;
    }

    const getProfileImage = (profilePicture) => {
        if (profilePicture instanceof File) {
            return URL.createObjectURL(profilePicture);
        }
        return profilePicture
            ? `data:image/jpeg;base64,${profilePicture}`
            : "https://via.placeholder.com/150";
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4 text-black">Contact Information</h1>

            <div className="max-w bg-[#F5F5F5] p-10 mx-auto shadow-md rounded-lg">
                <div className="flex mb-4">
                    <div className="flex-1 pr-2">
                        <h2 className="text-lg font-semibold">Current Logo.</h2>
                        <img
                            src={getProfileImage(contactInfo.logo)}
                            className="object-cover h-48 w-full"
                            alt="Backend Logo"
                        />
                    </div>
                    <div className="flex-1 pl-2">
                        <h2 className="text-lg font-semibold">New Logo Preview</h2>
                        {formData.logo ? (
                            <img
                                src={getProfileImage(formData.logo)}
                                className="object-cover h-48 w-full"
                                alt="Uploaded Logo Preview"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-48 border border-gray-300 rounded">
                                <span className="text-gray-500">No image available</span>
                            </div>
                        )}
                    </div>

                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    <div className="mb-4 col-span-2">
                        <label className="text-lg font-semibold" htmlFor="DentalName">Dental Name</label>
                        <input
                            id="DentalName"
                            type="text"
                            name="DentalName"
                            value={formData.DentalName}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full p-2 border border-gray-300 rounded bg-[#D3CDCD]"
                        />

                    </div>

                    <div className="mb-4 col-span-2">
                        <label className="text-lg font-semibold" htmlFor="Address">Address</label>
                        <input
                            id="Address"
                            type="text"
                            name="Address"
                            value={formData.Address}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#D3CDCD]"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-lg font-semibold" htmlFor="ContactNumber">Contact Number</label>
                        <input
                            id="ContactNumber"
                            type="tel"
                            name="ContactNumber"
                            value={formData.ContactNumber}
                            onChange={handleChange}
                            disabled={!isEditing}
                            maxLength={11}
                            placeholder="09..."
                            className="w-full p-2 border border-gray-300 rounded bg-[#D3CDCD]"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-lg font-semibold" htmlFor="Facebooklink">Facebook Link</label>
                        <input
                            id="Facebooklink"
                            type="text"
                            name="Facebooklink"
                            value={formData.Facebooklink}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full p-2 border border-gray-300 rounded bg-[#D3CDCD]"
                        />
                    </div>



                    <div className="mb-4">
                        <label className="text-lg font-semibold" htmlFor="WeekdaysTime">Weekdays Time</label>
                        <input
                            id="WeekdaysTime"
                            type="text"
                            name="WeekdaysTime"
                            value={formData.WeekdaysTime}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full p-2 border border-gray-300 rounded bg-[#D3CDCD]"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-lg font-semibold" htmlFor="WeekendsTime">Weekends Time</label>
                        <input
                            id="WeekendsTime"
                            type="text"
                            name="WeekendsTime"
                            value={formData.WeekendsTime}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full p-2 border border-gray-300 rounded bg-[#D3CDCD]"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-lg font-semibold" htmlFor="Email">Email</label>
                        <input
                            id="Email"
                            type="email"
                            name="Email"
                            value={formData.Email}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full p-2 border border-gray-300 rounded bg-[#D3CDCD]"
                        />
                    </div>

                    <div className="mb-4 ">
                        <label className="text-lg font-semibold" htmlFor="logo">Upload Logo</label>
                        <input
                            id="logo"
                            type="file"
                            name="logo"
                            accept="image/*"
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full p-2 border border-gray-300 rounded bg-[#D3CDCD]"
                        />

                    </div>


                    <div className="flex justify-between col-span-2 p-5 pt-0">
                        <button
                            type="button"
                            onClick={() => setIsEditing(!isEditing)}
                            className={` px-4 bg-[#4285F4] hover:bg-[#0C65F8] text-black p-2 rounded ${isEditing ? 'hidden' : 'block'}`}
                        >
                            Edit
                        </button>

                        {isEditing && (
                            <>
                                <button
                                    type="submit"
                                    className={`bg-[#4285F4] hover:bg-[#0C65F8] text-black p-2 rounded ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className=" text-black p-2 rounded bg-[#D9D9D9] hover:bg-[#ADAAAA]"
                                >
                                    Cancel
                                </button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
