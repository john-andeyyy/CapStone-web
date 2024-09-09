import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function AppointmentDetails() {
    const { id } = useParams();
    const [appointment, setAppointment] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const [editedAppointment, setEditedAppointment] = useState({});
    const [statusUpdate, setStatusUpdate] = useState('');
    const [files, setFiles] = useState({ Before: null, After: null, Xray: null });
    const [loading, setLoading] = useState(true);
    const [previewImages, setPreviewImages] = useState({ Before: null, After: null, Xray: null });
    const [fullScreenImage, setFullScreenImage] = useState(null);

    // To store original fetched values
    const [originalAppointment, setOriginalAppointment] = useState({});

    // Fetch appointment details from the API
    const getdata = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BASEURL}/Appointments/view/Patient/appointment/${id}`,
                { withCredentials: true }
            );
            const data = response.data;
            setAppointment(data);
            setOriginalAppointment({
                Before: data.BeforeImage || '',
                After: data.AfterImage || '',
                notes: data.notes || '',
                Xray: data.XrayImage || ''
            });
            setEditedAppointment({
                Before: data.BeforeImage || '',
                After: data.AfterImage || '',
                notes: data.notes || '',
                Xray: data.XrayImage || ''
            });
            setStatusUpdate(data.Status || 'Pending');
            setLoading(false);
        } catch (error) {
            console.error('Error fetching appointment details:', error);
            setLoading(false);
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
        const file = e.target.files[0];
        setFiles({ ...files, [key]: file });

        // Generate image preview
        const reader = new FileReader();
        reader.onload = (event) => {
            setPreviewImages({ ...previewImages, [key]: event.target.result });
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleUpdate = () => {
        setLoading(true);

        const formData = new FormData();
        formData.append('Before', files.Before);
        formData.append('After', files.After);
        formData.append('Xray', files.Xray);
        formData.append('notes', editedAppointment.notes);
        formData.append('Status', statusUpdate);

        axios.put(`${import.meta.env.VITE_BASEURL}/Appointments/appointmentUpdate/${id}`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true }
        )
            .then(response => {
                setAppointment(response.data);
                setIsEditing(false);
                setIsEditingNotes(false);
                setFiles({ Before: null, After: null, Xray: null });
                setPreviewImages({ Before: null, After: null, Xray: null });
                getdata();

            })
            .catch(error => {
                console.error('Error updating appointment:', error);
            });
    };

    const handleCancelEdit = () => {
        // Reset to original values when canceling edit
        setEditedAppointment({ ...originalAppointment });
        setPreviewImages({ Before: null, After: null, Xray: null });
        setFiles({ Before: null, After: null, Xray: null });
        setIsEditing(false);
    };

    const handleImageClick = (image) => {
        setFullScreenImage(image);
    };

    const closeFullScreen = () => {
        setFullScreenImage(null);
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <h1>Loading...</h1>
        </div>
    );

    if (!appointment) return <div>No appointment data available.</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Appointment Details</h1>

            <div className="flex space-x-3">
                <button
                    className={`p-3 ${isEditing ? 'bg-red-500' : 'px-9 bg-yellow-600'} text-white rounded-lg hover:${isEditing ? 'bg-gray-600' : 'bg-yellow-600'} transition`}
                    onClick={() => isEditing ? handleCancelEdit() : setIsEditing(true)}
                >
                    {isEditing ? 'Cancel Edit' : 'Edit'}
                </button>

                {isEditing && (
                    <div className="">
                        <button
                            className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                            onClick={handleUpdate}
                        >
                            Save Changes
                        </button>
                    </div>
                )}
            </div>

            <div className="shadow-md rounded-lg p-6 mb-6 space-y-4">
                <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString('en-US')}</p>
                <p><strong>Start:</strong> {new Date(appointment.Start).toLocaleTimeString('en-US')}</p>
                <p><strong>End:</strong> {new Date(appointment.End).toLocaleTimeString('en-US')}</p>
                <p><strong>Patient:</strong> {appointment.patient?.FirstName || 'N/A'} {appointment.patient?.LastName || 'N/A'}</p>
                <p><strong>Amount:</strong> ${appointment.Amount || 'N/A'}</p>

                <p><strong>Notes: {appointment.notes || 'N/A'}</strong></p>
                {!isEditing ? (
                    <>
                    </>
                ) : (
                    <div className="flex flex-col">
                        <p>Enter new notes: </p>
                        <textarea
                            name="notes"
                            value={editedAppointment.notes}
                            onChange={handleEditChange}
                            className="p-2 border border-gray-300 rounded-lg w-full mb-2"
                        />
                    </div>
                )}
                <p><strong>Status:</strong> {
                    !isEditing ? (
                        <>
                            <span className={appointment.Status === 'Cancelled' ? 'text-red-500' : 'text-green-500'}>
                                {appointment.Status}
                            </span>
                        </>


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
                    <div>
                        <img
                            src={previewImages.Before || appointment.BeforeImage || '/image-not-available.png'}
                            alt="Before"
                            className="mb-2 rounded-lg shadow-lg cursor-pointer"
                            onClick={() => handleImageClick(previewImages.Before || appointment.BeforeImage)}
                        />
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

                    <div>
                        <img
                            src={previewImages.After || appointment.AfterImage || '/image-not-available.png'}
                            alt="After"
                            className="mb-2 rounded-lg shadow-lg cursor-pointer"
                            onClick={() => handleImageClick(previewImages.After || appointment.AfterImage)}
                        />
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

                    <div>
                        <img
                            src={previewImages.Xray || appointment.XrayImage || '/image-not-available.png'}
                            alt="Xray"
                            className="mb-2 rounded-lg shadow-lg cursor-pointer"
                            onClick={() => handleImageClick(previewImages.Xray || appointment.XrayImage)}
                        />
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
                </div>
            </div>

            {fullScreenImage && (
                <div
                    className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center"
                    onClick={closeFullScreen}
                >
                    <img src={fullScreenImage} alt="Full screen view" className="max-h-full max-w-full" />
                </div>
            )}
        </div>
    );
}
