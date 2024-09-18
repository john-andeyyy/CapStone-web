import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function NotificationPage() {
    const [notifications, setNotifications] = useState([]);
    const [newNotification, setNewNotification] = useState({ title: '', message: '', sendTo: 'sendToAll', isSendEmail: false });
    const [editedNotification, setEditedNotification] = useState({ id: null, title: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [modalType, setModalType] = useState(null); // 'new', 'edit', or 'details'
    const [selectedNotification, setSelectedNotification] = useState(null);

    const Baseurl = import.meta.env.VITE_BASEURL;

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${Baseurl}/Notification/admin/getAllNotif`, { withCredentials: true });
            setNotifications(response.data.reverse()); // Reverse the order here
        } catch (error) {
            setError('Error fetching notifications');
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

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
        try {
            let endpoint = '';
            const payload = {
                Title: newNotification.title,
                Message: newNotification.message,
                isSendEmail: newNotification.isSendEmail,
            };

            switch (newNotification.sendTo) {
                case 'sendToAll':
                    endpoint = `${Baseurl}/Notification/all`;
                    break;
                case 'sendToOne':
                    endpoint = `${Baseurl}/Notification/single`;
                    break;
                case 'sendToCustom':
                    endpoint = `${Baseurl}/Notification/custom`;
                    break;
                default:
                    setError('Invalid send to option');
                    setLoading(false);
                    return;
            }

            await axios.post(endpoint, payload, { withCredentials: true });
            setNewNotification({ title: '', message: '', sendTo: 'sendToAll', isSendEmail: false });
            setError('');
            setModalType(null); // Close modal

            // Refetch notifications to ensure unique keys and update state
            fetchNotifications();

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
            setModalType(null); // Close modal
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
                <h2 className="text-2xl font-bold">Notifications</h2>
                <button
                    onClick={() => setModalType('new')}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    Send New Notification
                </button>
            </div>
            {loading && <p className="text-blue-500">Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div className="flex-grow overflow-auto">
                <ul className="space-y-4">
                    {notifications.map(notif => (
                        <li
                            key={notif._id} // Ensure unique key
                            className="p-4 border rounded shadow-sm cursor-pointer flex justify-between items-center"
                            onClick={() => viewNotificationDetails(notif)}
                        >
                            <div>
                                <h3 className="text-xl font-semibold">{notif.Title}</h3>
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
                                    e.stopPropagation();
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
                    <div className="bg-neutral p-6 rounded shadow-lg max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-4">Send New Notification</h2>
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
                            <select
                                name="sendTo"
                                value={newNotification.sendTo}
                                onChange={handleNewNotificationChange}
                                className="block mb-2 p-2 border rounded"
                            >
                                <option value="sendToAll">Send to All</option>
                                <option value="sendToOne">Send to One</option>
                                <option value="sendToCustom">Send to Custom</option>
                            </select>
                            {newNotification.sendTo === 'sendToAll' && (
                                <div className="flex items-center mb-2">
                                    <input
                                        type="checkbox"
                                        name="isSendEmail"
                                        checked={newNotification.isSendEmail}
                                        onChange={(e) => setNewNotification(prevState => ({ ...prevState, isSendEmail: e.target.checked }))}
                                        className="mr-2"
                                    />
                                    <label>Send Email</label>
                                </div>
                            )}
                            <div className="flex gap-2">
                                <button
                                    onClick={sendNotification}
                                    className="bg-green-500 text-white px-4 py-2 rounded"
                                >
                                    Send
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
                </div>
            )}

            {modalType === 'edit' && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-4">Edit Notification</h2>
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
                            <div className="flex gap-2">
                                <button
                                    onClick={saveEdit}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={closeModal}
                                    className="bg-gray-500 text-white px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {modalType === 'details' && selectedNotification && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-4">Notification Details</h2>
                        <p className="mb-2"><strong>Title:</strong> {selectedNotification.Title}</p>
                        <p className="mb-2"><strong>Message:</strong> {selectedNotification.Message}</p>
                        <p className="mb-2"><strong>Date Created:</strong> {new Date(selectedNotification.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        })}</p>
                        <button
                            onClick={closeModal}
                            className="bg-gray-500 text-white px-4 py-2 rounded"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
