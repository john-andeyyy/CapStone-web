import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const BASEURL = import.meta.env.VITE_BASEURL; // Use environment variable for base URL

const DentistSchedule = () => {
    const { id } = useParams(); // Extract the dentist ID from the URL
    const [appointments, setAppointments] = useState([]); // State to hold appointments
    const [loading, setLoading] = useState(true); // State for loading status
    const [error, setError] = useState(null); // State for error handling

    useEffect(() => {
        const fetchAppointments = async () => {
            setLoading(true); // Set loading to true at the start
            setError(null); // Reset error state before fetching
            try {
                const response = await axios.get(`${BASEURL}/dentist/appointmentlist/${id}`, { withCredentials: true });
                if (response.status === 200) { // Check for success status
                    console.log(response.data)
                    setAppointments(response.data); // Set the fetched appointments
                } else {
                    setError('No appointments found.'); // Handle no appointments case
                }
            } catch (err) {
                console.error('Error fetching appointments:', err);
                setError('Error fetching appointments.'); // Set error message
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchAppointments(); // Call the fetch function
    }, [id]); // Dependency array to run effect when id changes

    if (loading) {
        return <div className="text-center">Loading appointments...</div>; // Loading state
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>; // Error state
    }

    if (!appointments.length) {
        return <div className="text-center">No appointments scheduled.</div>; // No appointments message
    }

    return (
        <div className="px-4 py-6">
            <h2 className="text-2xl font-bold mb-4">Appointment Schedule</h2>
            <table className="min-w-full border border-gray-300">
                <thead className=" ">
                    <tr className=' bg-primary '>
                        <th className="py-2 px-4 border-b border-gray-300">Date</th>
                        <th className="py-2 px-4 border-b border-gray-300">Start</th>
                        <th className="py-2 px-4 border-b border-gray-300">End</th>
                        <th className="py-2 px-4 border-b border-gray-300">Patient Name</th>
                        <th className="py-2 px-4 border-b border-gray-300">Procedure</th>
                        <th className="py-2 px-4 border-b border-gray-300">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map((appointment) => (
                        <tr key={appointment._id} className="hover:bg-secondary">
                            <td className="py-2 px-4 border-b border-gray-300">{new Date(appointment.date).toLocaleDateString()}</td>
                            <td className="py-2 px-4 border-b border-gray-300">{new Date(appointment.Start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                            <td className="py-2 px-4 border-b border-gray-300">{new Date(appointment.End).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                            <td className="py-2 px-4 border-b border-gray-300">{`${appointment.patient.FirstName} ${appointment.patient.LastName}`}</td>
                            <td className="py-2 px-4 border-b border-gray-300">
                                {appointment.procedures.map(proc => proc.Procedure_name).join(', ')}
                            </td>
                            <td className="py-2 px-4 border-b border-gray-300">{appointment.Status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DentistSchedule;
