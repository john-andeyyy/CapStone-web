import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link for navigation

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
    const [selectedStatus, setSelectedStatus] = useState(''); // State for selected status filter

    // State to track status updates for each appointment
    const [statusUpdates, setStatusUpdates] = useState({});

    useEffect(() => {
        // Fetch appointments data from the API
        axios.get(`${BASEURL}/ProcedureToPatient/appointments`, {
            withCredentials: true
        })
            .then(response => {
                setAppointments(response.data);
                setFilteredAppointments(response.data); // Initialize filtered appointments
                // Initialize status updates for each appointment
                const initialStatusUpdates = response.data.reduce((acc, appointment) => {
                    acc[appointment.id] = appointment.status;
                    return acc;
                }, {});
                setStatusUpdates(initialStatusUpdates);
            })
            .catch(error => {
                console.error('Error fetching appointments:', error);
            });
    }, [BASEURL]);

    useEffect(() => {
        // Filter appointments based on the selected status
        if (selectedStatus === '') {
            setFilteredAppointments(appointments);
        } else {
            setFilteredAppointments(appointments.filter(app => app.status === selectedStatus));
        }
    }, [selectedStatus, appointments]);

    const handleStatusUpdate = (id) => {
        const newStatus = statusUpdates[id];
        // Send PATCH request to update the status
        axios.put(`${BASEURL}/ProcedureToPatient/appointmentUpdate/${id}`,
            { status: newStatus }, // Data to send
            { withCredentials: true } // Config object
        )
            .then(response => {
                console.log('Status updated:', response.data);
                setAppointments(appointments.map(app =>
                    app.id === id ? { ...app, status: newStatus } : app
                ));
                // Update the filtered appointments to reflect the status change
                setFilteredAppointments(filteredAppointments.map(app =>
                    app.id === id ? { ...app, status: newStatus } : app
                ));
            })
            .catch(error => {
                console.error('Error updating status:', error);
            });
    };

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
                        <option value="">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Approved">Approved</option>
                        <option value="Completed">Completed</option>
                        <option value="Missed">Missed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
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
                                        <span className="text-red-500">Invalid Date: </span>
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
                            </div>
                            <div className="flex space-x-2 items-center">
                                <Link
                                    to={`/appointment/${appointment.id}`} // Navigate to the detail page
                                    className="p-2 bg-gray-500 text-white rounded"
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
