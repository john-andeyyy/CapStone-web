import React from 'react';
import axios from 'axios';

const FetchSessionButton = () => {
    const fetchSessionData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/session/get-demo-session', {
                withCredentials: true // Make sure to send cookies with the request
            });

            console.log('Session Data:', response.data);
        } catch (error) {
            console.error('Error fetching session data:', error);
        }
    };

    return (
        <button
            onClick={fetchSessionData}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
            Fetch Session Data
        </button>
    );
};

export default FetchSessionButton;
