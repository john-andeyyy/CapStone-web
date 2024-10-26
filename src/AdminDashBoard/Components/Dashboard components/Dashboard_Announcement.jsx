import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Announcement() {
    const Baseurl = import.meta.env.VITE_BASEURL;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [announcements, setAnnouncements] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [expandedAnnouncements, setExpandedAnnouncements] = useState({});

    const fetchAnnouncements = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${Baseurl}/Announcement/announcementMessageonly`, { withCredentials: true });
            const filtered = response.data;
            setAnnouncements(filtered.reverse().slice(0, 2));
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const openModal = (announcement) => {
        setSelectedAnnouncement(announcement);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedAnnouncement(null);
    };

    const toggleExpanded = (id) => {
        setExpandedAnnouncements((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    const CustomModal = ({ isOpen, onClose, title, children }) => {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-[#C6E4DA] rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 max-h-[80vh] max-w-[90vw] overflow-hidden">
                    <div className="flex justify-between items-center p-4 border-b">
                        <h2 className="text-lg font-bold text-[#266D53] text-center">{title}</h2>
                        <button className="text-gray-600" onClick={onClose}><span class="material-symbols-outlined">
                            close
                        </span></button>
                    </div>
                    <div className="p-4 max-h-[80vh] overflow-y-auto">{children}</div>
                </div>
            </div>
        );
    };

    return (
        <div className="p-6 rounded-lg">
            <div className='flex justify-between items-center mb-4'>
                <h1 className='text-2xl font-semibold text-green-500'>Announcements</h1>
                <button className='flex items-center font-semibold text-md' onClick={() => navigate('/AnnouncementPage')}>
                    <span className="material-symbols-outlined ">edit</span>
                    See More
                </button>
            </div>
            <div className="border-2 border-secondary rounded-lg max-h-64 overflow-y-auto p-5">
                {loading ? (
                    <p className="text-center py-4">Loading announcements...</p>
                ) : announcements.length > 0 ? (
                    announcements.map((announcement) => (
                        <div key={announcement._id} className="p-2 max-h-40 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h2 className="flex items-center font-semibold text-lg">
                                    <span className="material-symbols-outlined mr-2 text-error">campaign</span>
                                    {announcement.Title}
                                </h2>
                                <button className="text-[#266D53] cursor-pointer ml-2" onClick={() => openModal(announcement)}>
                                    View
                                </button>
                            </div>
                            <div className="mb-1 text-sm">
                                {expandedAnnouncements[announcement._id] ? (
                                    <>
                                        {announcement.Message}
                                        <span className="text-secondary cursor-pointer ml-2" onClick={() => toggleExpanded(announcement._id)}>
                                            Hide
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        {announcement.Message.length > 100
                                            ? `${announcement.Message.substring(0, 100)}...`
                                            : announcement.Message}
                                        {announcement.Message.length > 100 && (
                                            <p className="text-secondary cursor-pointer ml-2 underline" onClick={() => toggleExpanded(announcement._id)}>
                                                See More
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>
                            <p className="text-gray-500 text-xs">
                                Date Created: {new Date(announcement.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-center py-4">No announcements available.</p>
                )}
            </div>

            {/* Modal for displaying announcement details */}
            <CustomModal isOpen={modalOpen} onClose={closeModal} title={selectedAnnouncement?.Title}>
                {selectedAnnouncement && (
                    <div className='pb-3'>
                        <h2 className="font-semibold text-xl mb-2">{selectedAnnouncement.Title}</h2>
                        <p>{selectedAnnouncement.Message}</p>
                        <p className="text-gray-500 text-sm mt-4">
                            Date Created: {new Date(selectedAnnouncement.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            })}
                        </p>
                    </div>
                )}
            </CustomModal>
        </div>
    );
}
