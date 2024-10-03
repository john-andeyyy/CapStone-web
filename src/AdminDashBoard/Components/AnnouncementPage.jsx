import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../Components/Modal'; // Import your Modal component
import { showToast } from '../Components/ToastNotification';

export default function AnnouncementPage() {
    const Baseurl = import.meta.env.VITE_BASEURL;

    const [announcements, setAnnouncements] = useState([]);
    const [formData, setFormData] = useState({
        isSendEmail: false,
        Title: 'Announcement!!!',
        Message: ''
    });
    const [showModal, setShowModal] = useState(false);
    const [expandedAnnouncement, setExpandedAnnouncement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null); // State to hold the selected announcement for viewing

    const FetchAnnouncement = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${Baseurl}/Notification/admin/announcement`, { withCredentials: true });
            const filtered = response.data.filter(notif => notif.isAnnouncement === true);
            setAnnouncements(filtered.reverse());
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        FetchAnnouncement();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`${Baseurl}/Notification/all`, formData, { withCredentials: true })
            .then(response => {
                showToast('success', 'Announcement sent successfully');
                setFormData({
                    isSendEmail: false,
                    Title: 'Announcement!!!',
                    Message: ''
                });
                FetchAnnouncement();
                setShowModal(false);
            })
            .catch(error => console.error('Error sending announcement:', error));
    };

    const openAnnouncementModal = (announcement) => {
        setSelectedAnnouncement(announcement);
        setShowModal(true); // Show the modal with announcement details
    };

    const closeAnnouncementModal = () => {
        setSelectedAnnouncement(null);
        setShowModal(false); // Hide the modal
    };

    const truncateMessage = (message, maxLength) => {
        if (message.length <= maxLength) return message;
        return message.slice(0, maxLength) + '...';
    };

    const toggleAnnouncementExpand = (announcementId) => {
        setExpandedAnnouncement(prevId => (prevId === announcementId ? null : announcementId));
    };

    return (
        <div className="container mx-auto p-4">
            <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => setShowModal(true)}
            >
                Send New Announcement
            </button>

            <Modal isOpen={showModal} onClose={closeAnnouncementModal}>
                {selectedAnnouncement ? (
                    <>
                        <h3 className="font-bold text-lg">{selectedAnnouncement.Title}</h3>
                        <p className="mt-2">{selectedAnnouncement.Message}</p>
                        <p className="mt-4 text-sm text-gray-500">
                            Created At: {new Date(selectedAnnouncement.createdAt).toLocaleDateString()}
                        </p>
                        <button
                            onClick={closeAnnouncementModal}
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Close
                        </button>
                    </>
                ) : (
                    <>
                        <h3 className="font-bold text-lg">Send Announcement!</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="mb-4">
                                <label className="block mb-2 font-semibold">Title:</label>
                                <input
                                    type="text"
                                    name="Title"
                                    value={formData.Title}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                                    placeholder="Enter announcement title"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block mb-2 font-semibold">Message:</label>
                                <textarea
                                    name="Message"
                                    value={formData.Message}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                                    placeholder="Enter announcement message"
                                ></textarea>
                            </div>
                            <div className="mb-4">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="isSendEmail"
                                        checked={formData.isSendEmail}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    Send Email
                                </label>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="submit"
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                >
                                    Send Announcement
                                </button>

                                <button
                                    type="button"
                                    onClick={closeAnnouncementModal}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    Close
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </Modal>

            <h2 className="text-xl font-semibold mt-8 mb-4">Announcements</h2>
            {loading ? (
                <div className="flex justify-center items-center">
                    <p className="text-gray-500">Loading announcements...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {announcements.length > 0 ? (
                        announcements.map(announcement => (
                            <div
                                key={announcement._id}
                                className="border p-4 rounded-lg cursor-pointer"
                                onClick={() => openAnnouncementModal(announcement)} // Open modal with announcement details
                            >
                                <h3 className="font-semibold">{announcement.Title}</h3>
                                <p
                                    className={`text-gray-600 overflow-hidden ${expandedAnnouncement === announcement._id ? 'h-auto' : 'h-16'}`}
                                >
                                    {expandedAnnouncement === announcement._id
                                        ? announcement.Message
                                        : truncateMessage(announcement.Message, 100)}
                                    {announcement.Message.length > 100 && (
                                        <span
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent opening modal when clicking "See more"
                                                toggleAnnouncementExpand(announcement._id);
                                            }}
                                            className="text-blue-500 cursor-pointer"
                                        >
                                            {expandedAnnouncement === announcement._id ? ' Hide' : ' See more'}
                                        </span>
                                    )}
                                </p>
                                <p className="text-sm text-gray-600">{new Date(announcement.createdAt).toLocaleDateString()}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-center">No announcements available</p>
                    )}
                </div>
            )}
        </div>
    );
}
