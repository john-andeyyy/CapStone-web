import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import calendar styles
import eventStyleGetter from './eventStyleGetter'; // Import the style getter
import EventModal from './EventModal';

const CustomCalendar = ({
    events,
    view,
    date,
    handleDateChange,
    handleViewChange,
}) => {
    const [selectedDate, setSelectedDate] = useState(date);
    const [selectedEvent, setSelectedEvent] = useState(null); // State to store selected event
    const [modalOpen, setModalOpen] = useState(false);

    const handleDayClick = (value) => {
        setSelectedDate(value);
        handleDateChange(value); // Call parent function to update the selected date
    };

    const tileClassName = ({ date }) => {
        const eventDateStr = date.toDateString();
        let eventClass = '';

        // Loop through events and apply appropriate Tailwind classes
        events.forEach(event => {
            const startDateStr = new Date(event.start).toDateString();
            const endDateStr = new Date(event.end).toDateString();

            if (eventDateStr >= startDateStr && eventDateStr <= endDateStr) {
                const eventStyle = eventStyleGetter(event); // Get styles from eventStyleGetter
                eventClass = eventStyle.style.backgroundColor; // Apply the background color to the class
            }
        });

        return eventClass;
    };

    const tileContent = ({ date }) => {
        const eventDateStr = date.toDateString();
        let label = null; // Initialize label to null

        // Check for events on the specific date and assign a label
        events.forEach(event => {
            const startDateStr = new Date(event.start).toDateString();
            const endDateStr = new Date(event.end).toDateString();

            // Log the current event being processed
            // console.log("Processing event:", event);

            if (eventDateStr >= startDateStr && eventDateStr <= endDateStr) {
                const eventStyle = eventStyleGetter(event); // Get styles from eventStyleGetter

                // Display the patient's full name if available
                const fullName = (event.Fname && event.Lname) ? `${event.Fname} ${event.Lname}` : event.status;
                console.log(event.title);

                label = (
                    <p
                        className="text-xs cursor-pointer"
                        style={eventStyle.style} // Apply the event style
                        onClick={() => handleSelectEvent(event)} // Add click handler for event
                    >
                        {event.title} - {event.status} {/* Display full name and status */}
                    </p>
                );
            }
        });

        return label;
    };



    const navigationLabel = ({ date }) => {
        return `${date.toLocaleDateString('default', { month: 'long', year: 'numeric' })}`;
    };

    const preventHeaderClick = (activeStartDate) => {
        handleViewChange(view); // Prevent header click from changing view
    };

    const handleSelectEvent = (event) => {
        setSelectedEvent(event); // Set the selected event
        setModalOpen(true); // Open the modal
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedEvent(null);
    };

    return (
        <div>
            <div className="flex justify-center items-center">
                <div className="max-w-full w-full sm:w-5/6 md:w-3/4 lg:w-2/3 xl:w-1/2 h-[500px]">
                    <Calendar
                        className="react-calendar rounded-lg shadow-md h-auto w-full"
                        onChange={(value) => setSelectedDate(value)}
                        value={selectedDate}
                        view={view}
                        onClickDay={handleDayClick}
                        tileClassName={tileClassName}
                        tileContent={tileContent} // Add labels here
                        navigationLabel={navigationLabel}
                        onActiveStartDateChange={preventHeaderClick}
                    />
                </div>
            </div>
            {modalOpen && selectedEvent && (
                <EventModal isOpen={modalOpen} event={selectedEvent} closeModal={closeModal} />
            )}
        </div>
    );
};

export default CustomCalendar;
