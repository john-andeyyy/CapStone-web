import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineCalendar, AiOutlineFileText, AiOutlineUser, AiOutlineCheckCircle } from 'react-icons/ai';
import Modal from '../../../Components/Modal';

const formatEventDate = (start, end) => {
    const options = {
        weekday: 'short',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    };
    const formattedStartDate = start.toLocaleString('en-US', options);
    const formattedEndDate = end.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    return `${formattedStartDate} - ${formattedEndDate}`;
};

const EventModal = ({ isOpen, event, closeModal }) => {
    return (
        <Modal isOpen={isOpen}>
            <div className="p-8 rounded-lg bg-white shadow-xl max-w-2xl mx-auto">
                <h2 className="text-3xl font-semibold text-gray-900 mb-6">{event?.title}</h2>

                <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="flex items-center text-lg text-gray-700">
                        <AiOutlineCalendar className="mr-3 text-blue-600 text-2xl" />
                        <div>
                            <span className="font-medium">Date:</span> <br />
                            {formatEventDate(event?.start, event?.end)}
                        </div>
                    </div>
                    <div className="flex items-center text-lg text-gray-700">
                        <AiOutlineFileText className="mr-3 text-green-600 text-2xl" />
                        <div>
                            <span className="font-medium">Notes:</span> <br />
                            {event?.notes || 'No additional notes'}
                        </div>
                    </div>
                    <div className="flex items-center text-lg text-gray-700">
                        <AiOutlineCheckCircle className="mr-3 text-yellow-600 text-2xl" />
                        <div>
                            <span className="font-medium">Status:</span> <br />
                            {event?.status}
                        </div>
                    </div>
                    <div className="flex items-center text-lg text-gray-700">
                        <AiOutlineUser className="mr-3 text-purple-600 text-2xl" />
                        <div>
                            <span className="font-medium">Dentist:</span> <br />
                            {event?.dentist || 'Not assigned'}
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <Link
                        to={`/appointment/${event.id}`}
                        className="px-6 py-3 text-lg font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                        View Details
                    </Link>
                    <button
                        className="px-6 py-3 text-lg font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                        onClick={closeModal}
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default EventModal;
