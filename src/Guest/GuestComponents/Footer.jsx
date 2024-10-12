import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios

export default function Footer() {
    const [clinicDetails, setClinicDetails] = useState(null);
    const BASEURL = import.meta.env.VITE_BASEURL;
    const contactApiUrl = `${BASEURL}/Contactus/contactus`;

    // Fetch clinic details from the API
    useEffect(() => {
        const fetchClinicDetails = async () => {
            try {
                const response = await axios.get(contactApiUrl); // Use axios to fetch data
                // Assuming the response data is an array, set the first item as clinicDetails
                if (response.data.length > 0) {
                    setClinicDetails(response.data[0]); // Set the first clinic detail
                }
            } catch (error) {
                console.error('Error fetching clinic details:', error);
            }
        };

        fetchClinicDetails();
    }, [contactApiUrl]); // Dependency array

    if (!clinicDetails) {
        return <div className="text-center">Loading...</div>; // Loading state
    }

    return (
        <footer className="  max-w-7xl mx-auto p-8 rounded-lg">
            <div className="flex flex-col sm:flex-row justify-between items-center">
                {/* Logo and Clinic Name */}
                <div className="flex flex-col items-center sm:items-start mb-4 sm:mb-0">
                    {clinicDetails.logo ? (
                        <img src={clinicDetails.logo} alt="Logo" className="h-16 w-auto mb-2" />
                    ) : (
                        <div className="text-xl font-bold mb-2">LOGO</div>
                    )}
                    <div className="text-lg font-bold">{clinicDetails.DentalName}</div>
                </div>

                {/* Clinic Contact Information */}
                <div className="mt-4 sm:mt-0 flex flex-col items-center sm:items-start">
                    <div className="font-bold">Stay in touch</div>
                    <div className="mt-1">Address: {clinicDetails.Address}</div>
                    <div className="mt-1">Contact Number: {clinicDetails.ContactNumber}</div>
                    <div className="mt-1">Email: {clinicDetails.Email}</div>
                    <div className="mt-2 font-bold">Dentist Hours</div>
                    <div className="mt-1">Weekdays: {clinicDetails.WeekdaysTime}</div>
                    <div className="mt-1">Weekends: {clinicDetails.WeekendsTime}</div>
                </div>

                {/* Navigation Links */}
                <div className="mt-4 sm:mt-0 flex flex-col items-center sm:items-start">
                    <div className="font-bold">Navigation</div>
                    <a href="#about" className="mt-1 hover:underline">About</a>
                    <a href="#services" className="mt-1 hover:underline">Services</a>
                    <a href="#contact" className="mt-1 hover:underline">Contact</a>
                </div>

                {/* Social Media Links */}
                <div className="mt-4 sm:mt-0 flex flex-col items-center sm:items-start">
                    <div className="font-bold">Social Media</div>
                    {clinicDetails.Facebooklink ? (
                        <a
                            href={clinicDetails.Facebooklink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 hover:underline"
                        >
                            Facebook: Alejandria Dental Clinic
                        </a>
                    ) : (
                        <div className="mt-1">No Facebook link available</div>
                    )}
                </div>
            </div>
        </footer>
    );
}
