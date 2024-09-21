import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Make sure to install axios
import { useNavigate } from 'react-router-dom';

const Notification_bell = () => {
    const navigate = useNavigate()

    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASEURL}/Notification/admin/getAllNotif`, {
                withCredentials: true
            });
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    // Fetch notifications from the server
    useEffect(() => {

        fetchNotifications();
    }, []);

    const toggleDropdown = () => {
        fetchNotifications();
        setIsOpen(!isOpen);
    };


    // Format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="relative flex justify-end items-center bg-base-100">
            {/* Notification Button with Bell Icon */}
            <button className="btn btn-ghost btn-circle relative p-2" onClick={toggleDropdown}>
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

            {/* Notification Dropdown */}
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white shadow-lg rounded-lg z-10 overflow-hidden">
                    <div className="p-3 text-lg font-semibold bg-gray-100 border-b border-gray-200 flex justify-between">
                        <div >
                            Notifications
                        </div>
                        <button className="" onClick={() => navigate('/NotificationPage')}>
                            view all
                        </button>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-3 text-center text-gray-500">No new notifications</div>
                        ) : (
                            <ul className="p-3">
                                {notifications.map((notification) => (
                                    <li
                                        key={notification._id}
                                        className="p-3 border-b border-gray-200 hover:bg-gray-50"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex flex-col">
                                                <strong className="text-sm">{notification.Title}</strong>
                                                {notification.toAll && (
                                                    <span className="text-xs text-blue-500 mt-1">Notification to All</span>
                                                )}
                                            </div>
                                            <span className="text-xs text-gray-500">{formatDate(notification.createdAt)}</span>
                                        </div>
                                        <div className="mt-2 text-sm">{notification.Message}</div>
                                        {!notification.toAll && (
                                            <ul className="mt-2 text-xs text-gray-600">
                                                {notification.PatientStatus.map((status) => (
                                                    <li key={status._id}>
                                                        {status.patient.FirstName} {status.patient.LastName} ({status.patient.MiddleName})
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notification_bell;
