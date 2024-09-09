import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

// Ensure the URL matches your server setup
// const socket = io('http://localhost:3000');

const NotificationComponent = () => {
    // const [notifications, setNotifications] = useState([]);

    // useEffect(() => {
    //     socket.on('notification', (data) => {
    //         console.log('New notification:', data);
    //         setNotifications(prevNotifications => [...prevNotifications, data]);
    //     });

    //     socket.on('notificationStatusUpdate', (data) => {
    //         console.log('Notification status update:', data);
    //         // Update the status of the notification in your state
    //     });

    //     return () => {
    //         socket.off('notification');
    //         socket.off('notificationStatusUpdate');
    //     };
    // }, []);

    return (
        <div>
            <h2>Notifications</h2>
            <ul>
                {notifications.map((notif, index) => (
                    <li key={index}>{notif.Title}: {notif.Message}</li>
                ))}
            </ul>
        </div>
    );
};

export default NotificationComponent;
