import React, { useEffect, useState } from 'react';
import axios from 'axios';

function InfoSection() {
    const [contactInfo, setContactInfo] = useState(null); // State to hold contact information
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    const BASEURL = import.meta.env.VITE_BASEURL; // Base URL from environment
    const contactApiUrl = `${BASEURL}/Contactus/contactus`; // API URL

    useEffect(() => {
        // Fetch contact information from API
        const fetchContactInfo = async () => {
            try {
                const response = await axios.get(contactApiUrl);
                setContactInfo(response.data[0]); // Assuming the response is an array and we want the first item
                setLoading(false);
            } catch (error) {
                setError('Error fetching contact information');
                setLoading(false);
            }
        };

        fetchContactInfo();
    }, [contactApiUrl]);

    if (loading) return <div>Loading...</div>; // Display loading state
    if (error) return <div>{error}</div>; // Display error if any

    return (
        <div>
            <h1 className="text-5xl font-bold pt-2 text-center">
                Visit our Dental <span className="text-green-400">Clinic</span>
            </h1>

            <div className="py-8">
                <div className="max-w-5xl mx-auto border border-green-400 p-8 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Address Section */}
                        <div className="flex flex-col items-center text-center">
                            <span className="material-symbols-outlined text-green-600 text-5xl">
                                home_pin
                            </span>
                            <h2 className="font-bold text-lg">Address</h2>
                            <p>{contactInfo?.Address || 'Address not available'}</p>
                        </div>

                        {/* Phone Section */}
                        <div className="flex flex-col items-center text-center border-l border-r border-green-400 px-4">
                            <span className="material-symbols-outlined text-green-600 text-5xl">
                                phone
                            </span>
                            <h2 className="font-bold text-lg">Phone</h2>
                            <p>{contactInfo?.ContactNumber || 'Phone not available'}</p>
                        </div>

                        {/* Hours Section */}
                        <div className="flex flex-col items-center text-center">
                            <span className="material-symbols-outlined text-green-600 text-5xl">
                                    schedule
                                
                            </span>
                            <h2 className="font-bold text-lg">Hours</h2>
                            <p>Weekdays: {contactInfo?.WeekdaysTime || 'N/A'}</p>
                            <p>Weekends: {contactInfo?.WeekendsTime || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                <div className="text-center py-7">
                    {/* <button className="btn btn-primary bg-green-400 border-none text-white">Request Appointment</button> */}
                </div>
            </div>
        </div>
    );
}

export default InfoSection;
