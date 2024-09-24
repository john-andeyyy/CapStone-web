import React, { useState } from 'react';
import NotificationPage from '../../AdminDashBoard/Components/NotificationPage';
import AnnouncementPage from '../../AdminDashBoard/Components/AnnouncementPage';

function Announcement_Notification() {
    const [showAnnouncement, setShowAnnouncement] = useState(false);

    const handleToggle = () => {
        setShowAnnouncement(prevState => !prevState);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">
                {showAnnouncement ? 'Announcements' : 'Notifications'}
            </h1>
            <div className="flex flex-col items-end ">

                <div className="mb-4">
                    <button
                        onClick={handleToggle}
                        // className={`px-4 py-2 mx-2 text-white rounded ${showAnnouncement ? 'bg-blue-500' : 'bg-green-500'
                        className={`px-4 py-2 mx-2 text-white rounded ${showAnnouncement ? 'bg-orange-500' : 'bg-orange-500'
                            } hover:opacity-80 transition`}
                    >
                        {showAnnouncement ? 'Send Notifications' : 'Send Announcements'}
                    </button>
                </div>

                {/* Conditional rendering based on the state */}

            </div>
            {showAnnouncement ? <AnnouncementPage /> : <NotificationPage />}
        </div>
    );
}

export default Announcement_Notification;
