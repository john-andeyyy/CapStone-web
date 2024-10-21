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
            const response = await axios.get(`${Baseurl}/Announcement/announcementMessageonly`, { withCredentials: true });
            const filtered = response.data
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
        axios.post(`${Baseurl}/Announcement/create`, formData, { withCredentials: true })
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


            <Modal isOpen={showModal} onClose={closeAnnouncementModal}>
                {selectedAnnouncement ? (
                    <>

                        <div className="absolute top-2 right-3">
                            <button
                                onClick={closeAnnouncementModal}
                                className="mt-4  text-gray-500 px-4 py-2"
                            >
                                <span className="material-symbols-outlined">
                                    close
                                </span>
                            </button>
                        </div>


                        <h3 className="font-bold text-lg text-[#266D53] text-center mt-5">{selectedAnnouncement.Title}</h3>
                        <p className="mt-2">{selectedAnnouncement.Message}</p>
                        <p className="mt-4 text-sm text-gray-500">
                            Created At: {selectedAnnouncement.createdAt}
                        </p>

                    </>
                ) : (
                    <>
                        <h3 className="text-[#266D53] text-center mb-5 font-bold text-lg">Send Announcement!</h3>
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
                                    className="bg-[#4285F4] hover:bg-[#0C65F8] text-black px-4 py-2 rounded "
                                >
                                    Send Announcement
                                </button>

                                <button
                                    type="button"
                                    onClick={closeAnnouncementModal}
                                    className=" text-black px-4 py-2 rounded bg-[#D9D9D9] hover:bg-[#ADAAAA]"
                                >
                                    Close
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </Modal>

            <div className='grid grid-cols-2 gap-4 mb-5'>
                <h2 className="text-xl font-semibold">Announcements</h2>
                <div className='flex justify-end ml-10'>
                    <button
                        className="btn text-white px-2 py-1 rounded bg-[#3EB489] hover:bg-[#62A78E]"
                        onClick={() => setShowModal(true)}
                    >
                        Send New Announcement
                    </button>
                </div>
            </div>


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
                                className="border p-4 rounded-lg cursor-pointer bg-gray-100 hover:bg-[#C6E4DA]"
                                onClick={() => openAnnouncementModal(announcement)} // Open modal with announcement details
                            >
                                <h3 className="font-semibold text-[#266D53] ">{announcement.Title}</h3>
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
                                <p className="text-sm text-gray-600">{announcement.createdAt}</p>
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
