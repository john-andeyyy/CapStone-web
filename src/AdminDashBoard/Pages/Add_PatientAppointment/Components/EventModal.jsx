import React from 'react';
import { Link } from 'react-router-dom';
import Modal from '../../../Components/Modal';

const formatEventDate = (start, end) => {
    const options = {
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    };
    const formattedStartDate = start.toLocaleString('en-US', options);
    const formattedEndDate = end.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    return `${formattedStartDate} to ${formattedEndDate}`;
};

const EventModal = ({ isOpen, event, closeModal }) => {
    return (
        <Modal isOpen={isOpen}>
            <div className="p-4 rounded ">
                <h2 className="text-xl font-bold">{event?.title}</h2>
                <p>{formatEventDate(event?.start, event?.end)}</p>
                <p>Notes: {event?.notes}</p>
                <p>Status: {event?.status}</p>

                <div className="flex justify-between items-center pt-4">
                    <Link to={`/appointment/${event.id}`} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                        View Details
                    </Link>
                    <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={closeModal}>
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default EventModal;
