import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../Components/Modal'; // Import your Modal component

export default function AnnouncementPage() {
    const Baseurl = import.meta.env.VITE_BASEURL;

    const [announcements, setAnnouncements] = useState([]);
    const [formData, setFormData] = useState({
        isSendEmail: false,
        Title: 'Announcement!!!',
        Message: ''
    });
    const [showModal, setShowModal] = useState(false);
    const [expandedAnnouncement, setExpandedAnnouncement] = useState({});
    const [loading, setLoading] = useState(true);

    const FetchAnnouncement = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${Baseurl}/Notification/admin/getAllNotif`, { withCredentials: true });
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
                alert('Announcement sent!');
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

    const toggleExpand = (id) => {
        setExpandedAnnouncement(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.slice(0, maxLength) + '...';
        }
        return text;
    };

    return (
        <div className="container mx-auto p-4">
            <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => setShowModal(true)}
            >
                Send New Announcement
            </button>

            <Modal isOpen={showModal}>
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
                            onClick={() => {
                                setShowModal(false);
                                setFormData({
                                    isSendEmail: false,
                                    Title: '',
                                    Message: ''
                                });
                            }}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Close
                        </button>
                    </div>
                </form>
            </Modal>

            <h2 className="text-xl font-semibold mt-8 mb-4">Announcements</h2>
            {loading ? (
                <div className="flex justify-center items-center">
                    <p className="text-gray-500">Loading announcements...</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 table-fixed">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border">Title</th>
                                <th className="px-4 py-2 border">Message</th>
                                <th className="px-4 py-2 border">Date Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {announcements.length > 0 ? (
                                announcements.map(announcement => (
                                    <tr key={announcement._id} className="hover:bg-gray-100">
                                        <td className="px-2 py-2 border break-words">
                                            {expandedAnnouncement[announcement._id]
                                                ? announcement.Title
                                                : truncateText(announcement.Title, 30)}
                                            {announcement.Title.length > 30 && (
                                                <button
                                                    onClick={() => toggleExpand(announcement._id)}
                                                    className="text-blue-500 ml-2"
                                                >
                                                    {expandedAnnouncement[announcement._id] ? 'Show less' : 'Read more'}
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-4 py-2 border break-words">
                                            {expandedAnnouncement[announcement._id]
                                                ? announcement.Message
                                                : truncateText(announcement.Message, 50)}
                                            {announcement.Message.length > 50 && (
                                                <button
                                                    onClick={() => toggleExpand(announcement._id)}
                                                    className="text-blue-500 ml-2"
                                                >
                                                    {expandedAnnouncement[announcement._id] ? 'Show less' : 'Read more'}
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-4 py-2 border">
                                            {new Date(announcement.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="px-4 py-2 border text-center" colSpan="3">No announcements available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
