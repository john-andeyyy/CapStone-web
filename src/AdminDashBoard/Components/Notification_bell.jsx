import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ThemeController from '../../Guest/GuestComponents/ThemeController';
import NotificationModal from '../Components/Modal'; // Import the modal

const Notification_bell = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0); // Unread notification count
    const [selectedNotification, setSelectedNotification] = useState(null); // To store the clicked notification
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASEURL}/Notification/admin/AdminNotif`, {
                withCredentials: true,
            });
            const adminNotifications = response.data.filter(notification => notification.adminOnly === true);

            setNotifications(adminNotifications.reverse());
            // Calculate unread notifications count
            const unreadNotifications = adminNotifications.filter(notification => !notification.adminisRead);
            setUnreadCount(unreadNotifications.length);
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

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleNotificationClick = async (notification) => {
        if (!notification.adminisRead) {
            await markAsRead(notification._id);
        }
        setSelectedNotification(notification); 
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const markAsRead = async (notifId) => {
        try {
            await axios.put('http://localhost:3000/Notification/admin/adminmarkas', {
                notifid: notifId,
                mark_as: true // Always set to true (read)
            }, {
                withCredentials: true,
            });
            // After marking as read, fetch updated notifications
            fetchNotifications();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
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
                        {unreadCount} 
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
                                        className={`my-1 p-3 border-b border-gray-200 hover:bg-secondary text-black cursor-pointer ${!notification.adminisRead ? 'bg-green-200' : ''}`}
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex flex-col">
                                                <strong className="text-sm">
                                                    {notification.user_Appointment_Title || notification.user_Appointment_message}
                                                </strong>
                                            </div>
                                            <span className="text-xs text-gray-500">{formatDate(notification.createdAt)}</span>
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
                        <h2 className="text-xl font-bold">{selectedNotification.user_Appointment_Title}</h2>
                        <p>{selectedNotification.user_Appointment_message}</p>
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
