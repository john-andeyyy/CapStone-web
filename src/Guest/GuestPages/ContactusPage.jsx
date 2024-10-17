import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ContactusPage() {
    const BASEURL = import.meta.env.VITE_BASEURL;

    const [contactInfo, setContactInfo] = useState(null);
    const [name, setname] = useState([]);

    useEffect(() => {
        axios.get(`${BASEURL}/Contactus/contactus`)
            .then(response => {
                if (response.data.length > 0) {
                    setContactInfo(response.data[0]);
                }
            })
            .catch(error => {
                console.error('There was an error fetching the contact data:', error);
            });
    }, []);

    if (!contactInfo) {
        return <div>Loading...</div>;
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
        <div className="bg-white min-h-screen flex flex-col items-center p-8">
            <div className="w-full max-w-3xl bg-green-100 rounded-lg shadow-lg p-6">
                {/* Dental Office Logo */}
                {contactInfo.logo && (
                    <div className="flex justify-center mb-6">
                        <img
                            src={getProfileImage(contactInfo.logo)}
                            alt="Dental Logo"
                            className="w-40 h-40 object-contain"
                        />
                    </div>
                )}

                {/* Dental Name */}
                <h1 className="text-3xl font-bold text-green-700 text-center mb-4">{contactInfo.DentalName}</h1>

                {/* Contact Info */}
                <div className="text-lg text-gray-700 space-y-3">
                    <p><strong>Contact Number:</strong> {contactInfo.ContactNumber}</p>
                    <p><strong>Address:</strong> {contactInfo.Address}</p>
                    <p><strong>Email:</strong> <a href={`mailto:${contactInfo.Email}`} className="text-green-600 underline">{contactInfo.Email}</a></p>
                    <p><strong>Facebook:</strong> <a href={contactInfo.Facebooklink} className="text-green-600 underline">{contactInfo.Facebooklink}</a></p>
                </div>

                {/* Business Hours */}
                <div className="mt-6">
                    <h2 className="text-2xl font-semibold text-green-700 mb-2">Operating Hours</h2>
                    <div className="text-lg text-gray-700 space-y-2">
                        <p><strong>Weekdays:</strong> {contactInfo.WeekdaysTime}</p>
                        <p><strong>Weekends:</strong> {contactInfo.WeekendsTime}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
