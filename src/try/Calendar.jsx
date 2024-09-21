import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from '../AdminDashBoard/Components/Modal';

const locales = {
    'en-US': enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const CalendarComponent = () => {
    const [view, setView] = useState('week');
    const [date, setDate] = useState(new Date());
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const generateRandomDate = (daysFromNow) => {
        const today = new Date();
        return new Date(today.setDate(today.getDate() + daysFromNow));
    };

    const events = [
        {
            title: 'Walang Pasok Bits',
            start: generateRandomDate(1),
            end: generateRandomDate(1),
            allDay: true,
        },
        {
            title: 'Vangie Nanaman Potangina',
            start: new Date("2024-09-20T09:00:00.000Z"),
            end: new Date("2024-09-20T11:00:00.000Z"),
            allDay: false,
        },
    ];

    const handleDateChange = (newDate) => {
        setDate(newDate);
    };

    const handleSelectSlot = (slotInfo) => {
        handleDateChange(slotInfo.start);
        setView('day');
    };

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedEvent(null);
    };

    const CustomDayCell = ({ date, children, ...props }) => {
        const isToday = date.toDateString() === new Date().toDateString();
        return (
            <div {...props} className={isToday ? 'bg-red-500 text-white' : ''}>
                {children}
            </div>
        );
    };

    return (
        <div className="p-4">
            {/* <div className="mb-4">
                <button className="mx-2 px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setView('day')}>Day</button>
                <button className="mx-2 px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setView('week')}>Week</button>
                <button className="mx-2 px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setView('month')}>Month</button>
                <button className="mx-2 px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setView('year')}>Year</button>
            </div> */}
            <div className="cursor-pointer">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500, margin: '50px' }}
                    view={view}
                    date={date}
                    onNavigate={handleDateChange}
                    onView={(newView) => setView(newView)}
                    onSelectSlot={handleSelectSlot}
                    onSelectEvent={handleSelectEvent}
                    selectable
                    min={new Date(0, 0, 0, 8, 0, 0)} // 8 AM
                    max={new Date(0, 0, 0, 17, 0, 0)} // 5 PM
                    components={{
                        day: {
                            // Custom day cell component
                            date: CustomDayCell,
                        },
                    }}
                />
            </div>

            {modalOpen && (
                <Modal isOpen={modalOpen}>
                    <div className="p-4">
                        <h2 className="text-xl font-bold">{selectedEvent?.title}</h2>
                        <p>Start: {selectedEvent?.start.toString()}</p>
                        <p>End: {selectedEvent?.end.toString()}</p>
                        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={closeModal}>
                            Close
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default CalendarComponent;
