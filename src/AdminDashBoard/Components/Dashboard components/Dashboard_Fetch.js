import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard_Fetch() {
    const [data, setData] = useState({ Appointment_Approved: null, data2: null, data3: null });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const Baseurl = import.meta.env.VITE_BASEURL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [response1, response2, response3] = await axios.all([
                    axios.get(`${Baseurl}/Appointments/appointments/filter/ApprovedOnly`),
                    // Uncomment and update the following lines if needed
                    // axios.get('https://api.example.com/data2'),
                    // axios.get('https://api.example.com/data3'),
                ]);

                setData({
                    Appointment_Approved: response1.data,
                    data2: response2?.data || null,
                    data3: response3?.data || null,
                });
            } catch (err) {
                setError('Error fetching data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [Baseurl]);

    return { data, loading, error };
}
