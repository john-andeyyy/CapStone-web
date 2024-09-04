import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function AppointmentDetails() {
    const { id } = useParams(); // Get the appointment ID from the URL
    const [appointment, setAppointment] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingNotes, setIsEditingNotes] = useState(false); // Track if notes are being edited
    const [editedAppointment, setEditedAppointment] = useState({});
    const [statusUpdate, setStatusUpdate] = useState('');
    const [files, setFiles] = useState({ Before: null, After: null, Xray: null });
    const [loading, setLoading] = useState(true); // Track loading state

    // Fetch appointment details from the API
    const getdata = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASEURL}/ProcedureToPatient/appointment/${id}`, {
                withCredentials: true
            });
            const data = response.data;
            setAppointment(data);
            setEditedAppointment({
                Before: data.Before || '',
                After: data.AfterImage || '',
                notes: data.notes || '',
                Xray: data.Xray || ''
            });
            setStatusUpdate(data.Status || 'Pending');
            setLoading(false); // Stop loading once data is fetched
        } catch (error) {
            console.error('Error fetching appointment details:', error);
            setLoading(false); // Stop loading even if there's an error
        }
    };

    useEffect(() => {
        getdata();
    }, [id]);

    const handleEditChange = (e) => {
        setEditedAppointment({
            ...editedAppointment,
            [e.target.name]: e.target.value
        });
    };

    const handleStatusChange = (e) => {
        setStatusUpdate(e.target.value);
    };

    const handleFileChange = (e, key) => {
        setFiles({ ...files, [key]: e.target.files[0] });
    };

    const handleUpdate = () => {
        // Create FormData object to send images and other data
        const formData = new FormData();
        formData.append('Before', files.Before);
        formData.append('After', files.After);
        formData.append('Xray', files.Xray);
        formData.append('notes', editedAppointment.notes);
        formData.append('Status', statusUpdate);

        axios.put(`${import.meta.env.VITE_BASEURL}/ProcedureToPatient/appointmentUpdate/${id}`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true }
        )
            .then(response => {
                setAppointment(response.data);
                setIsEditing(false);
                setIsEditingNotes(false);
                setFiles({ Before: null, After: null, Xray: null });
                getdata();
            })
            .catch(error => {
                console.error('Error updating appointment:', error);
            });
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <h1>loading</h1>
        </div>
    );

    if (!appointment) return <div>No appointment data available.</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Appointment Details</h1>

            <button
                className={`mb-4 p-2 ${isEditing ? 'bg-gray-500' : 'bg-yellow-500'} text-white rounded-lg hover:${isEditing ? 'bg-gray-600' : 'bg-yellow-600'} transition`}
                onClick={() => setIsEditing(!isEditing)}
            >
                {isEditing ? 'Cancel Edit' : 'Edit'}
            </button>

            <div className="shadow-md rounded-lg p-6 mb-6 space-y-4 ">
                <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString('en-US')}</p>
                <p><strong>Start:</strong> {new Date(appointment.Start).toLocaleTimeString('en-US')}</p>
                <p><strong>End:</strong> {new Date(appointment.End).toLocaleTimeString('en-US')}</p>
                <p><strong>Patient:</strong> {appointment.patient?.FirstName || 'N/A'} {appointment.patient?.LastName || 'N/A'}</p>
                <p><strong>Amount:</strong> ${appointment.Amount || 'N/A'}</p>
                <p><strong>Notes:</strong>
                    {!isEditingNotes ? (
                        <>
                            {appointment.notes || 'N/A'}
                            <button
                                className="ml-2 p-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                onClick={() => setIsEditingNotes(true)}
                            >
                                Edit Notes
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col">
                            <textarea
                                name="notes"
                                value={editedAppointment.notes}
                                onChange={handleEditChange}
                                className="p-2 border border-gray-300 rounded-lg w-full mb-2"
                            />
                            <button
                                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                                onClick={handleUpdate}
                            >
                                Save Notes
                            </button>
                        </div>
                    )}
                </p>
                <p><strong>Status:</strong> {
                    !isEditing ? (
                        <>{appointment.Status}</>
                    ) : (
                        <select
                            className="p-2 border border-gray-300 rounded-lg"
                            value={statusUpdate}
                            onChange={handleStatusChange}
                        >
                            <option value="Pending">Pending</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Approved">Approved</option>
                            <option value="Completed">Completed</option>
                            <option value="Missed">Missed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    )
                }</p>
                <p><strong>Request to Cancel:</strong> {appointment.RequestToCancel ? 'Yes' : 'No'}</p>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {appointment.Before && (
                        <div>
                            <img src={appointment.BeforeImage} alt="Before" className="mb-2 rounded-lg shadow-lg" />
                            <label className="block mb-2 font-medium">Before Image:</label>

                            {isEditing && (
                                <div className="mb-4">
                                    <label className="block mb-2 font-medium">Upload New Before Image:</label>
                                    <input
                                        type="file"
                                        onChange={(e) => handleFileChange(e, 'Before')}
                                        className="p-2 border border-gray-300 rounded-lg w-full"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                    {appointment.After && (
                        <div>
                            <img src={appointment.AfterImage} alt="After" className="mb-2 rounded-lg shadow-lg" />
                            <label className="block mb-2 font-medium">After Image:</label>

                            {isEditing && (
                                <div className="mb-4">
                                    <label className="block mb-2 font-medium">Upload New After Image:</label>
                                    <input
                                        type="file"
                                        onChange={(e) => handleFileChange(e, 'After')}
                                        className="p-2 border border-gray-300 rounded-lg w-full"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                    {appointment.Xray && (
                        <div>
                            <img src={appointment.XrayImage} alt="Xray" className="mb-2 rounded-lg shadow-lg" />
                            <label className="block mb-2 font-medium">Xray Image:</label>

                            {isEditing && (
                                <div className="mb-4">
                                    <label className="block mb-2 font-medium">Upload New Xray Image:</label>
                                    <input
                                        type="file"
                                        onChange={(e) => handleFileChange(e, 'Xray')}
                                        className="p-2 border border-gray-300 rounded-lg w-full"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {isEditing && (
                <div className="bg-white shadow-md rounded-lg p-6">
                    <button
                        className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                        onClick={handleUpdate}
                    >
                        Save Changes
                    </button>
                </div>
            )}
        </div>
    );
}
