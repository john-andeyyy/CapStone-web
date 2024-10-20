import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import './react-big-calendar.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Modal from '../../Components/Modal';
import EventModal from './Components/EventModal';
import eventStyleGetter from './Components/eventStyleGetter'; // Update with the correct path
import Legend from './Components/Legend';
import CalendarView from './Components/CalendarView';
import CustomCalendar from './Components/CustomCalendar';
import DentistSelector from './Selector/DentistSelector';
import PatientSelector from './Selector/PatientSelector';

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
    const [appointments, setAppointments] = useState([]);
    const [selectedDentist, setSelectedDentist] = useState(null);
    const [selectedPatient, setselectedPatient] = useState(null);
    const [unavailableDates, setUnavailableDates] = useState([]);


    const handleSelectDentist = (selecteddentistData) => {
        if (selecteddentistData) {
            setSelectedDentist(selecteddentistData);

            const unavailableEvents = selecteddentistData.NotAvailable_on.map((unavailable) => ({
                id: unavailable._id,
                title: 'Dentist Not Available',
                start: new Date(unavailable.from),
                end: new Date(unavailable.to),
                allDay: true,
                notes: `Unavailable from ${new Date(unavailable.from).toLocaleString()} to ${new Date(unavailable.to).toLocaleString()}`,
                status: 'Dentist Not Available',
            }));

            setEvents((prevEvents) => {
                const filteredEvents = prevEvents.filter(event => event.status !== 'Dentist Not Available');

                return [...filteredEvents, ...unavailableEvents];
            });
        } else {
            setEvents((prevEvents) => {
                const filteredEvents = prevEvents.filter(event => event.status !== 'Dentist Not Available');

                return [...filteredEvents];
            });
        }

    };

    const handleSelectPatient = (selectedPatient) => {
        if (selectedPatient){
            console.log('selectedPatient', selectedPatient)
            setselectedPatient(selectedPatient)
        }else{
            setselectedPatient('')
        }

    };

    const fetchUnavailableDates = async () => {
        try {
            const response = await axios.get(`${Baseurl}/clinicClose/unavailable`);
            const unavailableData = response.data;

            const unavailableEvents = unavailableData[0].NotAvailable_on.map((unavailable) => ({
                id: unavailable._id,
                title: 'Clinic Closed',
                start: new Date(unavailable.from),
                end: new Date(unavailable.to),
                allDay: true,
                notes: `Unavailable from ${new Date(unavailable.from).toLocaleString()} to ${new Date(unavailable.to).toLocaleString()}`,
                status: 'Clinic Closed',
            }));

            setUnavailableDates(unavailableEvents);
            return unavailableEvents;
        } catch (error) {
            console.error('Error fetching unavailable dates:', error);
            return [];
        }
    };

    // Function to fetch appointments
    const fetchAppointments = async () => {
        try {
            const response = await axios.get(`${Baseurl}/Appointments/appointments/filter`);
            const appointmentsData = response.data;

            const filteredAppointments = appointmentsData.filter(
                (data) => data.status === 'Completed' || data.status === 'Approved'
            );

            const mappedEvents = filteredAppointments.map((appointment) => ({
                id: appointment.id,
                title: `${appointment.patient.FirstName} ${appointment.patient.LastName}`,
                start: new Date(appointment.start),
                end: new Date(appointment.end),
                allDay: false,
                notes: appointment.notes,
                status: appointment.status,
            }));

            return mappedEvents;
        } catch (error) {
            console.error('Error fetching appointments:', error);
            return [];
        }
    };

    useEffect(() => {
        const fetchEvents = async () => {
            const unavailableDates = await fetchUnavailableDates();
            const fetchedAppointments = await fetchAppointments();
            setAppointments(fetchedAppointments);
            setEvents([...fetchedAppointments, ...unavailableDates]);
            setLoading(false);
        };

        fetchEvents();
    }, []);

    const handleDateChange = (newDate) => {
        setDate(newDate);
    };

    const handleSelectSlot = (slotInfo) => {
        handleDateChange(slotInfo.start);
        setView('day'); // Change to day view on slot selection
        // const isClinicClosed = events.some(
        //     (event) =>
        //         event.status === 'Clinic Closed' &&
        //         slotInfo.start >= event.start &&
        //         slotInfo.end <= event.end
        // );

        // if (!isClinicClosed) {
        //     handleDateChange(slotInfo.start);
        //     setView('day');
        // } else {
        //     alert('Clinic is closed during this period.');
        // }
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

    return (
        <div className="p-4">
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            ) : (
                <div className="">
                    <DentistSelector onSelectDentist={handleSelectDentist} />
                    <PatientSelector onSelectPatient={handleSelectPatient} />

                    <CalendarView
                        events={events}
                        view={view}
                        date={date}
                        handleDateChange={handleDateChange}
                        handleViewChange={setView}
                        handleSelectSlot={handleSelectSlot}
                        handleSelectEvent={handleSelectEvent}
                        eventStyleGetter={eventStyleGetter}
                    />

                    {/* <CustomCalendar
                        events={events}
                            view={'view'} 
                        date={date}
                        handleDateChange={handleDateChange}
                        handleViewChange={setView}
                        handleSelectSlot={handleSelectSlot}
                        handleSelectEvent={handleSelectEvent}
                        eventStyleGetter={eventStyleGetter}

                    /> */}


                    <Legend />
                </div>
            )}

            {modalOpen && selectedEvent && (
                <EventModal isOpen={modalOpen} event={selectedEvent} closeModal={closeModal} />
            )}
        </div>
    );
};

export default CalendarComponent;
