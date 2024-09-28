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

    useEffect(() => {
        fetchNotifications();
        fetchPatients();
    }, []);

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

            if (newNotification.sendTo === 'sendToOne' && selectedPatient) {
                payload.patientId = selectedPatient.id;
                endpoint = `${Baseurl}/Notification/one`;
            } else if (newNotification.sendTo === 'sendToCustom' && selectedPatients.length > 0) {
                payload.patientIds = selectedPatients;
                endpoint = `${Baseurl}/Notification/custom`;
            } else {
                setError('Please select a valid patient or patients');
                setLoading(false);
                return;
            }

            await axios.post(endpoint, payload, { withCredentials: true });
            showToast('success', 'Successfully sent!');
            resetNewNotificationForm();
            fetchNotifications();
        } catch (error) {
            setError('Error sending notification');
            console.error('Error sending notification:', error);
        } finally {
            setLoading(false);
        }
    };

    const resetNewNotificationForm = () => {
        setNewNotification({ title: '', message: '', sendTo: 'sendToOne', isSendEmail: false });
        setSelectedPatient(null);
        setSelectedPatients([]);
        setModalType(null);
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
            showToast('success', 'Saved Changes!');
            resetEditForm();
        } catch (error) {
            setError('Error updating notification');
            console.error('Error updating notification:', error);
        } finally {
            setLoading(false);
        }
    };

    const resetEditForm = () => {
        setEditedNotification({ id: null, title: '', message: '' });
        setModalType(null);
    };

    const viewNotificationDetails = (notif) => {
        setSelectedNotification(notif);
        setModalType('details');
    };

    const closeModal = () => {
        setModalType(null);
        resetNewNotificationForm(); // Clear form when modal closes
    };

    if (loading) {
        return (
            <div className="text-center py-20">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="p-4 pt-0 sm:p-6 max-w-full mx-auto flex flex-col h-screen">
            <div className='flex space-x-5 pb-2'>
                <button
                    onClick={() => setModalType('new')}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    Send New Notification
                </button>
            </div>

            <div className="flex-grow overflow-auto">
                <ul className="space-y-4">
                    {notifications
                        .filter(notif => !notif.toAll)
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

            {/* New Notification Modal */}
            {modalType === 'new' && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-base-100 p-6 rounded shadow-lg max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-4">Send New Notification</h2>
                        {error && <p className="text-red-500">{error}</p>}
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
                                <select
                                    name="sendTo"
                                    value={newNotification.sendTo}
                                    onChange={handleNewNotificationChange}
                                    className="block w-2/8 mb-2 p-2 border rounded"
                                >
                                    <option value="sendToOne">Send to One Patient</option>
                                    <option value="sendToCustom">Send to Custom Patients</option>
                                </select>

                                {newNotification.sendTo === 'sendToOne' && (
                                    <select
                                        value={selectedPatient ? selectedPatient.name : ''}
                                        onChange={(e) => {
                                            const patient = patients.find(p => p.name === e.target.value);
                                            setSelectedPatient(patient || null);
                                        }}
                                        className="block w-4/8 mb-2 p-2 border rounded"
                                    >
                                        <option value="">Select Patient</option>
                                        {patients.map(patient => (
                                            <option key={patient.id} value={patient.name}>{patient.name}</option>
                                        ))}
                                    </select>
                                )}

                                {newNotification.sendTo === 'sendToCustom' && (
                                    <div>
                                        <p className="mb-1">Select Patients:</p>
                                        {patients.map(patient => (
                                            <div key={patient.id}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPatients.includes(patient.id)}
                                                    onChange={() => {
                                                        if (selectedPatients.includes(patient.id)) {
                                                            setSelectedPatients(prev => prev.filter(id => id !== patient.id));
                                                        } else {
                                                            setSelectedPatients(prev => [...prev, patient.id]);
                                                        }
                                                    }}
                                                />
                                                {patient.name}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={newNotification.isSendEmail}
                                        onChange={() => setNewNotification(prev => ({ ...prev, isSendEmail: !prev.isSendEmail }))}
                                    />
                                    <span className="ml-2">Send Email</span>
                                </label>
                            </div>

                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={sendNotification}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Send Notification
                                </button>
                                <button
                                    onClick={closeModal}
                                    className="bg-gray-400 text-white px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Notification Modal */}
            {modalType === 'edit' && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-base-100 p-6 rounded shadow-lg max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-4">Edit Notification</h2>
                        {error && <p className="text-red-500">{error}</p>}
                        <div className="space-y-4">
                            <input
                                type="text"
                                name="title"
                                placeholder="Title"
                                value={editedNotification.title}
                                onChange={(e) => setEditedNotification({ ...editedNotification, title: e.target.value })}
                                className="block mb-2 p-2 border rounded w-full"
                            />
                            <textarea
                                name="message"
                                placeholder="Message"
                                value={editedNotification.message}
                                onChange={(e) => setEditedNotification({ ...editedNotification, message: e.target.value })}
                                className="block mb-2 p-2 border rounded w-full"
                                rows="4"
                            />
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={saveEdit}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={resetEditForm}
                                    className="bg-gray-400 text-white px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Notification Details Modal */}
            {modalType === 'details' && selectedNotification && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-base-100 p-6 rounded shadow-lg max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-4">{selectedNotification.Title}</h2>
                        <p>{selectedNotification.Message}</p>
                        <p className="text-gray-600 mt-4">Date Created: {new Date(selectedNotification.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        })}</p>
                        <button
                            onClick={resetEditForm}
                            className="bg-gray-400 text-white px-4 py-2 rounded mt-4"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
