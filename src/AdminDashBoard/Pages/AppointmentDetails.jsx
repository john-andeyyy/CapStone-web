import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { showToast } from '../Components/ToastNotification';
import { useNavigate } from 'react-router-dom';
import ProceduresTable from '../Components/AppointmentDetails/ProceduresTable';

export default function AppointmentDetails() {
    const navigate = useNavigate();

    const { id } = useParams();
    const [appointment, setAppointment] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editStatus, seteditStatus] = useState(false);
    const [editedAppointment, setEditedAppointment] = useState({});
    const [statusUpdate, setStatusUpdate] = useState('');
    const [files, setFiles] = useState({ Before: null, After: null, Xray: null });
    const [loading, setLoading] = useState(true);
    const [previewImages, setPreviewImages] = useState({ Before: null, After: null, Xray: null });
    const [fullScreenImage, setFullScreenImage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showimage, setshowimage] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalAction, setModalAction] = useState(null);

    const [originalAppointment, setOriginalAppointment] = useState({});

    // Fetch appointment details from the API
    const getdata = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BASEURL}/Appointments/view/Patient/appointment/${id}`,
                { withCredentials: true }
            );

            const data = response.data;
            console.log(data)
            setAppointment(data);
            setOriginalAppointment({
                Before: data.BeforeImage || '',
                After: data.AfterImage || '',
                notes: data.notes || '',
                Xray: data.XrayImage || '',
                Amount: data.Amount || ''
            });
            setEditedAppointment({
                Before: data.BeforeImage || '',
                After: data.AfterImage || '',
                notes: data.notes || '',
                Xray: data.XrayImage || '',
                Amount: data.Amount || ''
            });
            setStatusUpdate(data.Status || 'Pending');
            setLoading(false);
        } catch (error) {
            console.error('Error fetching appointment details:', error);
            setLoading(false);
        }
    };

    // Function to fetch all procedures


    useEffect(() => {
        getdata();
    }, [id]);
    const [showPaymentModal, setShowPaymentModal] = useState(false); // New state for payment modal

    const handlePaymentStatusUpdate = async () => {
        try {
            await axios.put(
                `${import.meta.env.VITE_BASEURL}/Appointments/appointmentUpdate/${id}`,
                { isfullypaid: !appointment.isfullypaid }, // Toggle the isfullypaid status
                { withCredentials: true }
            );
            showToast('success', 'Payment status updated successfully');
            getdata(); // Refresh appointment data
            setShowPaymentModal(false); // Close the payment modal
        } catch (error) {
            console.error('Error updating payment status:', error);
            showToast('error', 'Failed to update payment status');
        }
    };

    const handleOpenPaymentModal = () => {
        setShowPaymentModal(true);
    };

    const handleClosePaymentModal = () => {
        setShowPaymentModal(false);
    };


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
        if (files.Before) formData.append('Before', files.Before); // Ensure file exists before appending
        if (files.After) formData.append('After', files.After);
        if (files.Xray) formData.append('Xray', files.Xray);

        // Ensure that text fields are not null or undefined
        formData.append('notes', editedAppointment.notes || '');
        formData.append('Status', statusUpdate || '');
        formData.append('Amount', editedAppointment.Amount || '');

        axios.put(`${import.meta.env.VITE_BASEURL}/Appointments/appointmentUpdate/${id}`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true }
        )
            .then(response => {
                setAppointment(response.data); // Assuming response contains the updated appointment data
                seteditStatus(false)
                setIsEditing(false);
                // setIsEditingNotes(false);
                setFiles({ Before: null, After: null, Xray: null });
                setPreviewImages({ Before: null, After: null, Xray: null });
                showToast('success', 'Update Successfully');

                getdata();
            })
            .catch(error => {
                // Log the error to understand what went wrong
                console.error('Error updating appointment:', error.response ? error.response.data : error.message);
                alert('Error updating appointment: ' + (error.response ? error.response.data.message : error.message));
            });
    };


    const handleCancelEdit = () => {
        setModalMessage('Are you sure you want to cancel the changes? All unsaved changes will be lost.');
        setModalAction(() => () => {
            setEditedAppointment({ ...originalAppointment });
            setPreviewImages({ Before: null, After: null, Xray: null });
            setFiles({ Before: null, After: null, Xray: null });
            setIsEditing(false);
            seteditStatus(false);
            // setIsEditingNotes(false);
            setShowModal(false);
        });
        setShowModal(true);
    };

    const handleImageClick = (image) => {
        setFullScreenImage(image);
    };

    const closeFullScreen = () => {
        setFullScreenImage(null);
    };

    const handleModalConfirm = () => {
        if (modalAction) modalAction();
    };

    const handleModalCancel = () => {
        setShowModal(false);
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-center py-20"><span className="loading loading-spinner loading-lg"></span></div>
        </div>
    );

    if (!appointment) return <div>No appointment data available.</div>;


    const toggleImages = () => {
        setshowimage(prev => !prev);
    };
    return (
        <div className="p-6 mx-auto">
            {/* max-w-5xl  */}
            <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
            >
                Go Back
            </button>

            <div className='flex justify-between items-end '>
                <div>
                    <div className='pt-4'>
                        <h1 className="text-3xl font-bold ">Appointment Details </h1>
                        <p className={`pt-2 text-xl font-semibold `}>
                            <div className='space-x-2'>
                                <span>Payment Status: </span>
                                <span className={`${appointment.isfullypaid ? 'text-green-600' : 'text-red-600'}`}>
                                    {appointment.isfullypaid ? 'Paid' : 'Not Paid'}
                                </span>

                                <button
                                    className={`text-md p-1 text-white rounded hover:bg-blue-600 ${appointment.isfullypaid ? 'bg-green-500' : 'bg-red-500'}`}
                                    onClick={handleOpenPaymentModal}
                                >
                                    {appointment.isfullypaid ? 'Mark as Not Paid' : 'Mark as Paid'}
                                </button>
                            </div>


                        </p>


                        <div className="flex items-center space-x-4">
                            <p className="flex items-center space-x-2">
                                <strong>Status:</strong>
                                {!editStatus ? (
                                    <span
                                        className={`${appointment.Status === 'Cancelled' ? 'text-red-500' : 'text-green-500'
                                            }`}
                                    >
                                        {appointment.Status}
                                    </span>
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
                                )}
                            </p>

                            <div className='py-3'>
                                <button
                                    // px-5 py-2
                                    className={` ${editStatus ? 'bg-red-500 p-3' : 'bg-yellow-600  p-1'} text-white rounded-lg transition-colors duration-300 hover:${editStatus ? 'bg-gray-600' : 'bg-yellow-500'}`}
                                    onClick={() => (editStatus ? handleCancelEdit() : seteditStatus(true))}
                                >
                                    {editStatus ? 'Cancel Edit' : 'Update'}
                                </button>
                            </div>

                            {editStatus && (
                                <button
                                    className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                                    onClick={handleUpdate}>
                                    Save Changes
                                </button>
                            )}
                        </div>
                    </div>



                </div>
                <div className='flex space-x-3'>
                    <button
                        className={`p-3 w-32 ${isEditing ? 'bg-red-500' : 'bg-yellow-600'} text-white rounded-lg hover:${isEditing ? 'bg-gray-600' : 'bg-yellow-500'} transition`}
                        onClick={() => isEditing ? handleCancelEdit() : setIsEditing(true)}
                    >
                        {isEditing ? 'Cancel Edit' : 'Edit'}
                    </button>
                    <div className="flex space-x-3">
                        {isEditing && (
                            <div className="">
                                <button
                                    className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                                    onClick={handleUpdate}>
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>



            <div className="shadow-md rounded-lg p-6 mb-6 space-y-4">
                <p><strong>Patient Name:</strong> {appointment.patient?.FirstName || 'N/A'} {appointment.patient?.LastName || 'N/A'}</p>
                <p><strong>Start:</strong> {new Date(appointment.Start).toLocaleTimeString('en-US')}</p>
                <p><strong>End:</strong> {new Date(appointment.End).toLocaleTimeString('en-US')}</p>
                <p className=''><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p> <strong>Dentist:</strong> {`${appointment.Dentist.FirstName} ${appointment.Dentist.MiddleName ? `${appointment.Dentist.MiddleName} ` : ''}${appointment.Dentist.LastName}`}</p>
                <ProceduresTable appointment={appointment} />

                {/* Editable Amount */}
                <p><strong>Notes:</strong> {appointment.notes || 'N/A'}</p>

                {/* Edit Notes Section */}
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


                <p><strong>Request to Cancel:</strong> {appointment.RequestToCancel ? 'Yes' : 'No'}</p>
                <p><strong>Request for Medical Certificate:</strong> {appointment.medcertiStatus}</p>

                <h1 className='text-3xl text-red-600' >add here a button to send the medical cerificacte to the user email</h1>
                <div className="flex justify-end">
                    <button className='btn bg-green-500 hover:bg-green-300 text-black'
                        onClick={() => toggleImages()}>
                        {showimage ? 'Hide Images' : 'Show Images'}
                    </button>
                </div>

                {showimage && (
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
                )}

            </div>

            {/* Fullscreen Image View */}
            {fullScreenImage && (
                <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-80 z-50 flex justify-center items-center" onClick={closeFullScreen}>
                    <img src={fullScreenImage} alt="Full Screen" className="max-w-full max-h-full" />
                </div>
            )}

            {/* Confirmation Modal */}
            {showModal && (
                <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-60 z-50 flex justify-center items-center">
                    <div className="bg-accent p-6 rounded-lg shadow-lg w-80">
                        <p className="mb-4">{modalMessage}</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                onClick={handleModalConfirm}
                            >
                                Yes
                            </button>
                            <button
                                className="px-4 py-2 text-black bg-gray-300 rounded-lg hover:bg-gray-400"
                                onClick={handleModalCancel}
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showPaymentModal && (
                <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-60 z-50 flex justify-center items-center">
                    <div className="bg-accent p-6 rounded-lg shadow-lg w-80">
                        <p>Are you sure you want to mark this appointment as {appointment.isfullypaid ? 'Not Paid' : 'Paid'}?</p>
                        <div className="flex justify-end space-x-4 mt-4">
                            <button
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                onClick={handlePaymentStatusUpdate}
                            >
                                Yes
                            </button>
                            <button
                                className="px-4 py-2 text-black bg-gray-300 rounded-lg hover:bg-gray-400"
                                onClick={handleClosePaymentModal}
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
