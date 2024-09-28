import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


export default function Appointments() {
    const BASEURL = import.meta.env.VITE_BASEURL;

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('Pending'); // Default to 'Pending'
    const [loading, setLoading] = useState(true); // Add loading state
    const [error, setError] = useState(null); // Add error state

    useEffect(() => {
        // Fetch appointments data from the API
        const getAppointments = async () => {
            setLoading(true); // Start loading
            setError(null); // Reset error state before fetching
            try {
                const response = await axios.get(`${BASEURL}/Appointments/appointments/filter`, {
                    withCredentials: true
                });

                if (response.status === 200) {
                    setAppointments(response.data);
                    setFilteredAppointments(response.data.filter(app => app.status === 'Pending'));
                    
                }
            } catch (error) {
                setError('Error fetching appointments. Please try again.');
                console.error('Error fetching appointments:', error);
            } finally {
                setLoading(false); // End loading once fetching is done
            }
        };

        getAppointments();
    }, []);

    useEffect(() => {
        // Filter appointments based on the selected status
        if (selectedStatus === '') {
            setFilteredAppointments(appointments);
        } else {
            setFilteredAppointments(appointments.filter(app => app.status === selectedStatus));
        }
    }, [selectedStatus, appointments]);

    // Function to sort appointments by date and time in ascending order
    const sortAppointments = () => {
        const sorted = [...filteredAppointments].sort((a, b) => new Date(a.start) - new Date(b.start));
        setFilteredAppointments(sorted);
    };

    // Function to get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'Rejected':
                return 'text-red-500'; // Red for Rejected
            case 'Completed':
            case 'Pending':
                return 'text-green-500'; // Green for Completed and Pending
            default:
                return 'text-gray-500'; // Default color for other statuses
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-lg">Loading appointments...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-lg text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Appointment Requests</h1>
            <div className="text-gray-600 mb-8">{formattedDate}</div>
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Appointment Requests List</h2>
                <div className="mb-4">
                    <select
                        className="p-2 border rounded"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="">View All</option>
                        <option value="Pending">Pending</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Approved">Approved</option>
                        <option value="Completed">Completed</option>
                        <option value="Missed">Missed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                    <button
                        className="ml-4 p-2 bg-blue-500 text-white rounded"
                        onClick={sortAppointments}
                    >
                        Sort by Date & Time
                    </button>
                </div>
                <div className="space-y-4">
                    {filteredAppointments.map(appointment => (
                        <div key={appointment.id} className="p-4 bg-base-200 rounded flex justify-between items-center">
                            <div>
                                <div className="font-semibold">
                                    {appointment.start && !isNaN(new Date(appointment.start)) ? (
                                        <>
                                            {new Date(appointment.start).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })} -
                                            {new Date(appointment.end).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                                            {new Date(appointment.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </>
                                    ) : (
                                        <span className="text-red-500">Invalid Date</span>
                                    )}
                                </div>

                                <div className="text-gray-600">
                                    {appointment.patient.FirstName} {appointment.patient.LastName}
                                </div>

                                <div>
                                    {appointment.procedures.length > 1
                                        ? `${appointment.procedures[0].name}...`
                                        : appointment.procedures[0].name}
                                </div>
                                <div className="text-gray-600">
                                    <p>
                                        <strong>Status: </strong>
                                        <span className={getStatusColor(appointment.status)}>
                                            {appointment.status}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex space-x-2 items-center">
                                <Link
                                    to={`/appointment/${appointment.id}`}
                                    className="p-2 bg-green-500 text-white rounded"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
