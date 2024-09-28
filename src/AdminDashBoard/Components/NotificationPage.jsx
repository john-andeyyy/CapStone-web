import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { showToast } from '../Components/ToastNotification';

export default function NotificationPage() {
    const [notifications, setNotifications] = useState([]);
    const [selectedPatients, setSelectedPatients] = useState([]);
    const [newNotification, setNewNotification] = useState({ title: '', message: '', sendTo: 'sendToOne', isSendEmail: false });
    const [editedNotification, setEditedNotification] = useState({ id: null, title: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [modalType, setModalType] = useState(null);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);

    const Baseurl = import.meta.env.VITE_BASEURL;

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${Baseurl}/Notification/admin/getAllNotif`, { withCredentials: true });
            setNotifications(response.data.reverse());
        } catch (error) {
            setError('Error fetching notifications');
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPatients = async () => {
        try {
            const response = await axios.get(`${Baseurl}/Patient/auth/getAllPatients`, { withCredentials: true });
            setPatients(response.data);
        } catch (error) {
            setError('Error fetching patients');
            console.error('Error fetching patients:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    useEffect(() => {
        if (newNotification.sendTo === 'sendToOne' || newNotification.sendTo === 'sendToCustom') {
            fetchPatients();
        }
    }, [newNotification.sendTo]);

    const handleNewNotificationChange = (e) => {
        const { name, value } = e.target;
        setNewNotification(prevState => ({ ...prevState, [name]: value }));
    };

    const sendNotification = async () => {
        if (!newNotification.title || !newNotification.message) {
            setError('Title and message are required');
            return;
        }

        setLoading(true);
        setError('');
        try {
            let endpoint = '';
            let payload = {
                Title: newNotification.title,
                Message: newNotification.message,
                isSendEmail: newNotification.isSendEmail
            };

            switch (newNotification.sendTo) {
                case 'sendToOne':
                    if (selectedPatient) {
                        payload.patientId = selectedPatient.id;
                        endpoint = `${Baseurl}/Notification/one`;
                    } else {
                        setError('Please select a patient');
                        setLoading(false);
                        return;
                    }
                    break;
                case 'sendToCustom':
                    if (selectedPatients.length > 0) {
                        payload.patientIds = selectedPatients;
                        endpoint = `${Baseurl}/Notification/custom`;
                    } else {
                        setError('Please select at least one patient');
                        setLoading(false);
                        return;
                    }
                    break;
                default:
                    setError('Invalid send to option');
                    setLoading(false);
                    return;
            }

            await axios.post(endpoint, payload, { withCredentials: true });
            setNewNotification({ title: '', message: '', sendTo: 'sendToOne', isSendEmail: false });
            setSelectedPatient(null);
            setModalType(null);
            fetchNotifications();
            showToast('success', 'Successfully send!');

        } catch (error) {
            setError('Error sending notification');
            console.error('Error sending notification:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (notif) => {
        setEditedNotification({ id: notif._id, title: notif.Title, message: notif.Message });
        setModalType('edit');
    };

    const saveEdit = async () => {
        if (!editedNotification.title || !editedNotification.message) {
            setError('Title and message are required');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.put(`${Baseurl}/Notification/${editedNotification.id}`, {
                Title: editedNotification.title,
                Message: editedNotification.message,
            });
            const updatedNotifications = notifications.map(notif =>
                notif._id === editedNotification.id ? response.data : notif
            );
            setNotifications(updatedNotifications.reverse());
            setEditedNotification({ id: null, title: '', message: '' });
            showToast('success', 'Saved Changes!');

            setModalType(null);
            setError('');
        } catch (error) {
            setError('Error updating notification');
            console.error('Error updating notification:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditedNotificationChange = (e) => {
        const { name, value } = e.target;
        setEditedNotification(prevState => ({ ...prevState, [name]: value }));
    };

    const viewNotificationDetails = (notif) => {
        setSelectedNotification(notif);
        setModalType('details');
    };

    const closeModal = () => {
        setModalType(null);
    };

    return (
        <div className="p-4 pt-0 sm:p-6 max-w-full mx-auto flex flex-col h-screen">
            <div className='flex space-x-5 pb-2'>
                {/* <h2 className="text-2xl font-bold">Notifications</h2> */}
                <button
                    onClick={() => {
                        fetchPatients();
                        setModalType('new');
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    Send New Notification
                </button>
            </div>
            {loading && <p className="text-blue-500">Loading...</p>}

            <div className="flex-grow overflow-auto">
                <ul className="space-y-4">
                    {notifications
                        .filter(notif => notif.toAll == false)
                        .map(notif => (
                            <li
                                key={notif._id}
                                className="p-4 border rounded shadow-sm cursor-pointer flex justify-between items-center"
                                onClick={() => viewNotificationDetails(notif)}
                            >
                                <div>
                                    <h3 className="text-xl font-semibold" style={{ color: notif.isAnnouncement ? 'red' : 'inherit' }}>
                                        {notif.Title}
                                    </h3>
                                    <p className="mb-2">{notif.Message}</p>
                                    <p className="text-gray-600">
                                        Date Created: {new Date(notif.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent click on button from triggering the list item click
                                        handleEdit(notif);
                                    }}
                                    className="bg-yellow-500 text-white px-4 py-2 rounded"
                                >
                                    Edit
                                </button>
                            </li>
                        ))}

                </ul>
            </div>

            {modalType === 'new' && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-base-100 p-6 rounded shadow-lg max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-4">Send New Notification</h2>
                        <h3>{error && <p className="text-red-500">{error}</p>}</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                name="title"
                                placeholder="Title"
                                value={newNotification.title}
                                onChange={handleNewNotificationChange}
                                className="block mb-2 p-2 border rounded w-full"
                            />
                            <textarea
                                name="message"
                                placeholder="Message"
                                value={newNotification.message}
                                onChange={handleNewNotificationChange}
                                className="block mb-2 p-2 border rounded w-full"
                                rows="4"
                            />

                            <div className="flex items-center justify-between space-x-5">
                                <div className="w-2/8">
                                    <select
                                        name="sendTo"
                                        value={newNotification.sendTo}
                                        onChange={handleNewNotificationChange}
                                        className="block w-full mb-2 p-2 border rounded"
                                    >
                                        <option value="sendToOne">Send to One patient</option>
                                        <option value="sendToCustom">Send to Custom Patients</option>
                                    </select>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="isSendEmail"
                                        checked={newNotification.isSendEmail}
                                        onChange={(e) =>
                                            setNewNotification((prevState) => ({
                                                ...prevState,
                                                isSendEmail: e.target.checked,
                                            }))
                                        }
                                        className="mr-2"
                                    />
                                    <label>Send as Email</label>
                                </div>
                            </div>

                            {newNotification.sendTo === 'sendToOne' && (
                                <div className="mb-4">
                                    <label>Select Patient</label>
                                    <select
                                        name="patient"
                                        value={selectedPatient?.id || ''}
                                        onChange={(e) => {
                                            const patient = patients.find(p => p.id === e.target.value);
                                            setSelectedPatient(patient);
                                        }}
                                        className="block w-full p-2 border rounded"
                                    >
                                        <option value="">Choose a patient...</option>
                                        {patients.map(patient => (
                                            <option key={patient.id} value={patient.id}>
                                                {patient.FirstName} {patient.LastName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {newNotification.sendTo === 'sendToCustom' && (
                                <div className="mb-4">
                                    <label>Select Patients</label>
                                    {patients.map(patient => (
                                        <div key={patient.id} className="flex items-center mb-2">
                                            <input
                                                type="checkbox"
                                                value={patient.id}
                                                checked={selectedPatients.includes(patient.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedPatients([...selectedPatients, patient.id]);
                                                    } else {
                                                        setSelectedPatients(selectedPatients.filter(id => id !== patient.id));
                                                    }
                                                }}
                                                className="mr-2"
                                            />
                                            <span>{patient.FirstName} {patient.LastName}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="flex justify-end space-x-3">

                                <button
                                    onClick={sendNotification}
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                >
                                    Send Notification
                                </button>

                                <button
                                    onClick={closeModal}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    Cancel
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            )}

            {modalType === 'edit' && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-base-100 p-6 rounded shadow-lg max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-4">Edit Notification</h2>
                        <h3>{error && <p className="text-red-500">{error}</p>}</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                name="title"
                                placeholder="Title"
                                value={editedNotification.title}
                                onChange={handleEditedNotificationChange}
                                className="block mb-2 p-2 border rounded w-full"
                            />
                            <textarea
                                name="message"
                                placeholder="Message"
                                value={editedNotification.message}
                                onChange={handleEditedNotificationChange}
                                className="block mb-2 p-2 border rounded w-full"
                                rows="4"
                            />
                            <button
                                onClick={saveEdit}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Save Changes
                            </button>
                            <button
                                onClick={closeModal}
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {modalType === 'details' && selectedNotification && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-base-100 p-6 rounded shadow-lg max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-4">Notification Details</h2>
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">{selectedNotification.Title}</h3>
                            <p>{selectedNotification.Message}</p>
                            <p className="text-gray-600">Date Created: {new Date(selectedNotification.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            })}</p>
                            <button
                                onClick={closeModal}
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
