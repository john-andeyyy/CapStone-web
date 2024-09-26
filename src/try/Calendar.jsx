import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Link } from 'react-router-dom';
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

const CalendarComponent = () => {
    const [view, setView] = useState('month');
    const [date, setDate] = useState(new Date());
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAppointments = async () => {
        try {
            const response = await axios.get(`${Baseurl}/Appointments/appointments/filter`);
            const appointmentsData = response.data;
            const filteredAppointments = appointmentsData.filter(data =>
                data.status === "Completed" || data.status === "Approved"
            );

            const mappedEvents = filteredAppointments.map((appointment) => {
                const startUTC = new Date(appointment.start);
                const endUTC = new Date(appointment.end);

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
        } finally {
            setLoading(false);
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
            <div {...props} className={`p-2 ${isToday ? 'bg-red-600 text-white' : 'bg-transparent text-gray-800'}`}>
                {children}
            </div>
        );
    };

    const eventStyleGetter = (event) => {
        let backgroundColor;

        switch (event.status.toLowerCase()) {
            case 'pending':
                backgroundColor = '#FFC107'; // Warning
                break;
            case 'approved':
                backgroundColor = '#007BFF'; // Primary
                break;
            case 'completed':
                backgroundColor = '#28A745'; // Success
                break;
            case 'missed':
                backgroundColor = '#DC3545'; // Danger
                break;
            case 'cancelled':
                backgroundColor = '#6C757D'; // Secondary
                break;
            case 'rejected':
                backgroundColor = '#6C757D'; // Secondary
                break;
            default:
                backgroundColor = '#6C757D'; // Default
        }

        return {
            style: {
                backgroundColor,
                color: 'white',
                borderRadius: '5px',
                padding: '2px',
                border: 'none',
                fontSize: '10px',
            },
        };
    };

    return (
        <div className="p-4 min-h-screen">
            {loading ? (
                <div className="text-center text-xl text-gray-700">Loading...</div>
            ) : (
                <div className="">

                    <div className="cursor-pointer">
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: 500, margin: '50px', backgroundColor: 'bg-base-200', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', hover: 'red' }}
                            view={view}
                            date={date}
                            onNavigate={handleDateChange}
                            onView={setView}
                            onSelectSlot={handleSelectSlot}
                            onSelectEvent={handleSelectEvent}
                            selectable
                            views={['month', 'week', 'day', 'agenda']}
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

                    <div className="">
                        <p>yellow = pending</p>
                        <p>blue = Approved</p>
                        <p>Green = completed</p>
                        <p>red = Missed</p>
                        <p>Gray = cancell/reject</p>
                    </div>
                </div>
            )}

            {modalOpen && (
                <Modal isOpen={modalOpen}>
                    <div className="p-4 rounded ">
                        <h2 className="text-xl font-bold">{selectedEvent?.title}</h2>
                        <p>{formatEventDate(selectedEvent?.start, selectedEvent?.end)}</p>
                        <p>Notes: {selectedEvent?.notes}</p>
                        <p>Status: {selectedEvent?.status}</p>

                        <div className='flex justify-between items-center pt-4'>
                            <div className="flex space-x-2">
                                <Link
                                    to={`/appointment/${selectedEvent.id}`}
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                    View Details
                                </Link>
                            </div>
                            <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={closeModal}>
                                Close
                            </button>
                        </div>

                    </div>
                </Modal>
            )}
        </div>
    );
};

export default CalendarComponent;
