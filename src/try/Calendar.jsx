import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from '../AdminDashBoard/Components/Modal';
import axios from 'axios';

const Baseurl = import.meta.env.VITE_BASEURL;







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

// Update the formatEventDate function to display UTC times
const formatEventDate = (start, end) => {
    const options = {
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        // timeZone: 'UTC',
    };

    const formattedStartDate = start.toLocaleString('en-US', options);
    const formattedEndDate = end.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true,});
    // const formattedEndDate = end.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true,});
    return `${formattedStartDate} to ${formattedEndDate}`;
};



const CalendarComponent = () => {
    const [view, setView] = useState('month');
    const [date, setDate] = useState(new Date());
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [events, setEvents] = useState([]);

    // Function to fetch appointments data
    const fetchAppointments = async () => {
        try {
            const response = await axios.get(`${Baseurl}/Appointments/appointments/filter`);
            const appointments = response.data;

            // Map the appointments to the format required by the calendar
            // Map the appointments to the format required by the calendar
            const mappedEvents = appointments.map((appointment) => {
                const startUTC = new Date(appointment.start);
                const endUTC = new Date(appointment.end);

                console.log('Start UTC:', startUTC.toISOString()); // Log UTC start time
                console.log('End UTC:', endUTC.toISOString());     // Log UTC end time

                return {
                    id: appointment.id,
                    title: `${appointment.patient.FirstName} ${appointment.patient.LastName}`,
                    start: startUTC,
                    end: endUTC,
                    allDay: false,
                    notes: appointment.notes,
                    status: appointment.status,
                };
            });




            setEvents(mappedEvents);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };


    useEffect(() => {
        fetchAppointments();
    }, []);

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


    const eventStyleGetter = (event) => {
        let backgroundColor;

        switch (event.status.toLowerCase()) {
            case 'pending':
                backgroundColor = 'dark-green';
                break;
            case 'approved':
                backgroundColor = 'lightblue';
                break;
            case 'completed':
                backgroundColor = 'green';
                break;
            case 'missed':
                backgroundColor = 'red';
                break;
            case 'cancelled':
                backgroundColor = 'orange';
                break;
            case 'rejected':
                backgroundColor = 'gray';
                break;
            default:
                backgroundColor = 'gray';
        }

        return {
            style: {
                backgroundColor,
                color: 'white',
                borderRadius: '5px',
                padding: '5px',
                border: 'none',
            },
        };
    };

    return (
        <div className="p-4">
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
                    onView={setView}
                    onSelectSlot={handleSelectSlot}
                    onSelectEvent={handleSelectEvent}
                    selectable
                    views={['month', 'week', 'day']} // Ensure these views are set
                    min={new Date(0, 0, 0, 8, 0, 0)} // 8 AM
                    max={new Date(0, 0, 0, 17, 0, 0)} // 5 PM
                    components={{
                        day: {
                            date: CustomDayCell,
                        },
                    }}
                    eventPropGetter={eventStyleGetter}
                />

            </div>

            {modalOpen && (
                <Modal isOpen={modalOpen}>
                    <div className="p-4">
                        <h2 className="text-xl font-bold">{selectedEvent?.title}</h2>
                        <p>{formatEventDate(selectedEvent?.start, selectedEvent?.end)}</p>
                        <p>Notes: {selectedEvent?.notes}</p>
                        <p>Status: {selectedEvent?.status}</p>
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
