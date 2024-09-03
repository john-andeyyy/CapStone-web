import React, { useEffect, useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import axios from 'axios';

export default function Appointment() {
    const BASEURL = import.meta.env.VITE_BASEURL;

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        // Fetch appointments data from the API
        axios.get(`${BASEURL}/ProcedureToPatient/appointments`, {
            withCredentials: true
        })
            .then(response => {
                setAppointments(response.data);
            })
            .catch(error => {
                console.error('Error fetching appointments:', error);
            });
    }, [BASEURL]);

    const handleStatusUpdate = (id) => {
        // Send PATCH request to update the status
        axios.put(`${BASEURL}/ProcedureToPatient/appointmentUpdate/${id}`,
            { Status: 'Approved' }, // Data to send
            { withCredentials: true } // Config object
        )
            .then(response => {
                console.log('Status updated:', response.data);
                setAppointments(appointments.map(app =>
                    app._id === id ? { ...app, Status: 'Cancelled' } : app
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
                <div className="space-y-4">
                    {appointments.map(appointment => (
                        <div key={appointment._id} className="p-4 bg-base-200 rounded flex justify-between items-center">
                            <div>
                                <div className="font-semibold">
                                    {new Date(appointment.Start).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })} -
                                    {new Date(appointment.End).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                                    {new Date(appointment.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </div>
                                <div className="text-gray-600">
                                    {appointment.patient.FirstName} {appointment.patient.LastName}
                                </div>
                                <div>
                                    {appointment.procedures.length > 1
                                        ? `${appointment.procedures[0]}...`
                                        : appointment.procedures[0]}
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    className="p-2 bg-green-500 text-white rounded"
                                    onClick={() => handleStatusUpdate(appointment._id)}
                                >
                                    <FaCheck />
                                </button>
                                <button className="p-2 bg-red-500 text-white rounded">
                                    <FaTimes />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
