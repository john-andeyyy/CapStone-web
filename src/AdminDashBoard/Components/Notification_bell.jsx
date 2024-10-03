import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ThemeController from '../../Guest/GuestComponents/ThemeController';
import NotificationModal from '../Components/Modal'; // Import the modal

const Notification_bell = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [expanded, setExpanded] = useState({});
    const [selectedNotification, setSelectedNotification] = useState(null); // To store the clicked notification
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASEURL}/Notification/admin/getAllNotif`, {
                withCredentials: true,
            });
            const adminNotifications = response.data.filter(notification => notification.AdminOnly === true);

            setNotifications(adminNotifications.reverse());
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const toggleDropdown = () => {
        fetchNotifications();
        setIsOpen(!isOpen);
    };

    const toggleMessage = (id) => {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleNotificationClick = (notification) => {
        setSelectedNotification(notification); // Set the selected notification data
        setIsModalOpen(true); // Show the modal
    };

    const closeModal = () => {
        setIsModalOpen(false); // Close the modal
    };

    return (
        <div className="relative flex justify-end items-center bg-base-100">
            <div>
                <ThemeController />
            </div>
            <button className="btn btn-ghost btn-circle relative" onClick={toggleDropdown}>
                <div className="indicator">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                    </svg>
                    <span className="badge badge-xs badge-primary indicator-item">
                        {notifications.length}
                    </span>
                </div>
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-neutral shadow-lg rounded-lg z-10 overflow-hidden">
                    <div className="p-3 text-lg font-semibold border-b border-gray-200 flex justify-between">
                        <div>Notifications</div>
                        <button
                            onClick={() => {
                                navigate('/Annoucement_Notification');
                                toggleDropdown();
                            }}
                        >
                            view all
                        </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-3 text-center text-gray-500">No new notifications</div>
                        ) : (
                            <ul className="p-3 pt-0">
                                {notifications.map((notification) => (
                                    <li
                                        key={notification._id}
                                        className="p-1 border-b border-gray-200 hover:bg-base-100 cursor-pointer"
                                        onClick={() => handleNotificationClick(notification)} // Handle click to show modal
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex flex-col">
                                                {notification.isAnnouncement && (
                                                    <span className="text-lg mt-1 font-semibold text-error">Announcement!!!</span>
                                                )}
                                                <strong className={`text-sm ${notification.toAll ? 'text-red-500' : ''}`}>
                                                    {notification.Title}
                                                </strong>
                                            </div>
                                            <span className="text-xs text-gray-500">{formatDate(notification.createdAt)}</span>
                                        </div>
                                        {notification.Message.length > 100 && (
                                            <button
                                                className="text-xs text-blue-500 mt-1"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent the parent click event
                                                    toggleMessage(notification._id);
                                                }}
                                            >
                                                {expanded[notification._id] ? 'Collapse' : 'Expand'}
                                            </button>
                                        )}
                                        <div
                                            className={`mt-2 text-sm transition-all duration-300 ease-in-out ${expanded[notification._id] ? 'max-h-full' : 'max-h-6 overflow-hidden'
                                                }`}
                                        >
                                            {notification.Message}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}

            {/* Modal to show notification details */}
            <NotificationModal isOpen={isModalOpen} onClose={closeModal}>
                {selectedNotification && (
                    <div className="p-4">
                        {selectedNotification.isAnnouncement ? (
                            <div>
                                <h2 className="text-xl font-bold text-red-500">Announcement</h2><br />
                                <p>{selectedNotification.Message}</p>
                            </div>
                        ) : (
                            <div>
                                <h2 className="text-xl font-bold">{selectedNotification.Title}</h2>
                                <p>{selectedNotification.Message}</p>
                                {selectedNotification.patients && (
                                    <ul>
                                        {selectedNotification.patients.map((patient) => (
                                            <li key={patient._id}>{patient.name}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                        <button className="btn mt-4" onClick={closeModal}>
                            Close
                        </button>
                    </div>
                )}
            </NotificationModal>
        </div>
    );
};

export default Notification_bell;
