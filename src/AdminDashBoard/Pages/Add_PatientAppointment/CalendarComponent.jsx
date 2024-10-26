import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
// import './react-big-calendar.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Modal from '../../Components/Modal';
import EventModal from './Components/EventModal';
import eventStyleGetter from './Components/eventStyleGetter';
import dayPropGetter from './Components/dayPropGetter';
import Legend from './Components/Legend';
import CalendarView from './Components/CalendarView';
import CustomCalendar from './Components/CustomCalendar';
import DentistSelector from './Selector/DentistSelector';
import PatientSelector from './Selector/PatientSelector';
import ProceduresSelector from './Selector/ProceduresSelector';


import './react-big-calendar.css'
import AvailableTimeSlots from './Components/AvailableTimeSlots';
import ConfirmAppointmentModal from './Components/ConfirmAppointmentModal ';

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
    const [currentDate, setCurrentDate] = useState(new Date());
    // const [date, setDate] = useState(new Date());
    const [date, setDate] = useState(new Date(new Date().getFullYear(), 11, 1)); // December 1st of the current year

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState([]);
    const [selectedDentist, setSelectedDentist] = useState(null);
    const [selectedPatient, setselectedPatient] = useState(null);
    const [unavailableDates, setUnavailableDates] = useState([]);
    const [UnavailableDentist, setUnavailableDentist] = useState([]);
    const [procedures, setProcedures] = useState([]);
    const [allButtonsDisabled, setAllButtonsDisabled] = useState(false);

    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isSubmited, setisSubmited] = useState(false);


 

    const handleSelectDentist = (selecteddentistData) => {
        if (selecteddentistData) {
            setSelectedDentist(selecteddentistData);

            const unavailableEvents = selecteddentistData.NotAvailable_on.map((unavailable) => {
                const startDate = new Date(unavailable.from);
                const endDate = new Date(unavailable.to);

                return {
                    id: unavailable._id,
                    title: 'Dentist Not Available',
                    start: startDate,
                    end: endDate,
                    allDay: true,
                    notes: `Unavailable from ${startDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })} to ${endDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}`,
                    status: 'Dentist Not Available',
                };
            });

            setUnavailableDentist(unavailableEvents);
            console.log('unavailableEvents', unavailableEvents)
            setEvents((prevEvents) => {
                const filteredEvents = prevEvents.filter(event => event.status !== 'Dentist Not Available');
                return [...filteredEvents, ...unavailableEvents];
            });
        } else {
            setEvents((prevEvents) => {
                const filteredEvents = prevEvents.filter(event => event.status !== 'Dentist Not Available');
                return filteredEvents;
            });
        }
    };


    const handleSelectPatient = (selectedPatient) => {
        if (selectedPatient) {
            console.log('selectedPatient', selectedPatient)
            setselectedPatient(selectedPatient)
        } else {
            setselectedPatient('')
        }

    };
    const handleSelectProcedures = (Procedures) => {
        if (Procedures) {
            console.log('selectedProcedures', Procedures)
            setProcedures(Procedures)
        } else {
            setselectedPatient('')
        }

    };

    const fetchUnavailableDates = async () => {
        try {
            const response = await axios.get(`${Baseurl}/clinicClose/unavailable`);
            const unavailableData = response.data;

            const unavailableEvents = unavailableData[0].NotAvailable_on.map((unavailable) => {
                const startDate = new Date(unavailable.from);
                const endDate = new Date(unavailable.to);


                // FOR WHOLEDAY
                startDate.setHours(0, 0, 0, 0);
                endDate.setHours(23, 59, 59, 999);

                return {
                    id: unavailable._id,
                    title: 'Clinic Closed',
                    start: startDate,
                    end: endDate,
                    allDay: true,
                    notes: `Unavailable from ${startDate.toLocaleDateString('en-US')} to ${endDate.toLocaleDateString('en-US')}`,
                    status: 'Clinic Closed',
                };
            });

            setUnavailableDates(unavailableEvents);
            return unavailableEvents;
        } catch (error) {
            console.error('Error fetching unavailable dates:', error);
            return [];
        }
    };


    const fetchAppointments = async () => {
        try {
            const response = await axios.get(`${Baseurl}/Appointments/appointments/filter`);
            const appointmentsData = response.data;

            const filteredAppointments = appointmentsData.filter(
                (data) => data.status === 'Completed' || data.status === 'Approved' || data.status === 'Pending'
            );

            const mappedEvents = filteredAppointments.map((appointment) => {
                const dentistName = appointment.Dentist
                    ? `${appointment.Dentist.FirstName} ${appointment.Dentist.LastName}`
                    : 'No dentist assigned';

                return {
                    id: appointment.id,
                    title: `${appointment.patient.FirstName} ${appointment.patient.LastName}`,
                    start: new Date(appointment.start),
                    end: new Date(appointment.end),
                    allDay: false,
                    notes: appointment.notes,
                    status: appointment.status,
                    dentist: dentistName
                };
            });

            return mappedEvents;
        } catch (error) {
            console.error('Error fetching appointments:', error);
            return [];
        }
    };

    const fetchEvents = async () => {
        const unavailableDates = await fetchUnavailableDates();
        const fetchedAppointments = await fetchAppointments();
        setAppointments(fetchedAppointments);
        setEvents([...fetchedAppointments, ...unavailableDates]);
        setLoading(false);
    };
    useEffect(() => {


        fetchEvents();
    }, []);

    const handleDateChange = (newDate) => {
        setDate(newDate);
    };


    const handleSelectSlot = (slotInfo) => {
        handleDateChange(slotInfo.start);
        setSelectedDate(slotInfo.start);
        console.log('slotInfo START', slotInfo.start);

        const selectedDate = slotInfo.start.toLocaleDateString('en-CA'); // YYYY-MM-DD format in local timezone
        console.log('selectedDate', selectedDate);

        const isDentistUnavailable = events.some((event) => {
            const eventStartDate = event.start.toLocaleDateString('en-CA');
            const eventEndDate = event.end.toLocaleDateString('en-CA');

            return (
                event.status === 'Dentist Not Available' &&
                selectedDate <= eventStartDate &&
                selectedDate >= eventEndDate
            );
        });


        setAllButtonsDisabled(isDentistUnavailable);

        console.log('isDentistUnavailable', isDentistUnavailable);
    };



    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedEvent(null);
    };

    useEffect(() => {
        const fetchEvents = async () => {
            const unavailableDates = await fetchUnavailableDates();
            const fetchedAppointments = await fetchAppointments();
            setAppointments(fetchedAppointments);
            setEvents([...fetchedAppointments, ...unavailableDates]);
            setLoading(false);

            // const isClosed = unavailableDates.some(unavailable =>
            //     date >= new Date(unavailable.start) && date <= new Date(unavailable.end)
            // );
            // setAllButtonsDisabled(isClosed);

        };

        fetchEvents();
    }, []);

    const handleSelectTimeSlot = (slot, date) => {
        setSelectedTimeSlot(slot); // Set selected time slot

        // Array to store missing fields
        const missingFields = [];

        if (!selectedPatient) {
            missingFields.push('Patient');
        }

        if (!selectedDentist) {
            missingFields.push('Dentist');
        }

        if (!procedures.length) {
            missingFields.push('Procedures');
        }

        if (!selectedDate) {
            missingFields.push('Date');
        }

        if (!slot) {
            missingFields.push('Time Slot');
        }

        // If there are missing fields, show a specific alert
        if (missingFields.length) {
            alert(`Please ensure the following fields are selected: ${missingFields.join(', ')}`);
        } else {
            setConfirmModalOpen(true); // Open confirmation modal if all fields are selected
        }
    };



    const handleConfirmAppointment = async () => {
        if (!selectedPatient || !selectedDentist || !procedures.length || !selectedDate || !selectedTimeSlot) {
            alert('Please ensure all fields are selected.');
            return;
        }

        const localDate = new Date(selectedDate);
        const selectedTime = new Date(selectedTimeSlot);
        localDate.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);

        const endDate = new Date(localDate);
        endDate.setMinutes(endDate.getMinutes() + 30);

        const appointmentData = {
            procedureIds: procedures.map(p => p._id),
            date: localDate.toISOString().split('T')[0],
            Start: localDate.toISOString(),
            End: endDate.toISOString(),
            DentistID: selectedDentist._id,
            Amount: 100,
            status: "Approved",
        };

        try {
            const response = await axios.post(`${Baseurl}/Appointments/add/history/${selectedPatient._id}`, appointmentData, { withCredentials: true });
            console.log('Appointment added to history:', response.data);
            setisSubmited(true);
            setConfirmModalOpen(false);

            // Refetch events after a short delay to allow backend to save data
            setTimeout(() => fetchEvents(), 200);

        } catch (error) {
            console.error('Error adding appointment to history:', error);
        }

        setTimeout(() => setisSubmited(false), 1000);
    };


    return (
        <div className="p-4 mx-auto">
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            ) : (
                <div className="  items-center justify-center">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <PatientSelector onSelectPatient={handleSelectPatient} isSubmited={isSubmited} />
                        <div>
                            <DentistSelector onSelectDentist={handleSelectDentist} isSubmited={isSubmited} />
                            <ProceduresSelector onselectprocedures={handleSelectProcedures} isSubmited={isSubmited} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* Calendar section */}
                        <div className="lg:col-span-2 border border-green-500 rounded-md flex flex-col justify-between min-h-[500px]">
                            <CalendarView
                                events={events}
                                view={view}
                                date={date}
                                handleDateChange={handleDateChange}
                                handleViewChange={setView}
                                handleSelectSlot={handleSelectSlot}
                                handleSelectEvent={handleSelectEvent}
                                eventStyleGetter={eventStyleGetter}
                                dayPropGetter={(date) => dayPropGetter(date, events)}
                            />
                        </div>
                        {/* Time slots section */}
                        <div className="border border-green-500 rounded-md flex justify-center pt-10 min-h-[500px] max-w-90%">
                            <AvailableTimeSlots
                                selectedDate={date}
                                unavailableDates={unavailableDates}
                                appointments={appointments}
                                onSelectTimeSlot={handleSelectTimeSlot}
                                // isDisabled={availableSlotsDisabled}
                                allButtonsDisabled={allButtonsDisabled}
                                UnavailableDentist={UnavailableDentist}
                            />
                        </div>
                    </div>
                    <Legend />
                </div>
            )}
            {modalOpen && selectedEvent && (
                <EventModal isOpen={modalOpen} event={selectedEvent} closeModal={closeModal} />
            )}
            {confirmModalOpen && (
                <ConfirmAppointmentModal
                    isOpen={confirmModalOpen}
                    patient={selectedPatient}
                    dentist={selectedDentist}
                    procedures={procedures}
                    date={selectedDate}
                    timeSlot={selectedTimeSlot}
                    onConfirm={handleConfirmAppointment}
                    onCancel={() => setConfirmModalOpen(false)}
                />
            )}
        </div>

    );
};

export default CalendarComponent;
