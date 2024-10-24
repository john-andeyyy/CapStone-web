import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import '../Dashboard components/Calendar.css'; // Import your CSS
import Dashboard_Fetch from './Dashboard_Fetch';

export default function Dashboard_Calendar() {
    const [date, setDate] = useState(new Date()); // Current date (today) as default
    const [view, setView] = useState('month');
    const [selectedDate, setSelectedDate] = useState(null);
    const [events, setEvents] = useState([]);

    const { data, loading, error } = Dashboard_Fetch();

    useEffect(() => {
        if (data.Appointment_Approved) {
            const formattedEvents = data.Appointment_Approved.map(appointment => ({
                title: `${appointment.patient.FirstName} ${appointment.patient.MiddleName} ${appointment.patient.LastName}`,
                start: new Date(appointment.start),
                end: new Date(appointment.end),
                status: appointment.status,
            }));

            setEvents(formattedEvents);
            console.log('formattedEvents', formattedEvents)
        }
    }, [data.Appointment_Approved]);

    // Loading and error states
    if (loading) return <div>Loading...</div>;
    if (error) {
        return (
            <div className="p-2 rounded-lg text-center max-w-sm mx-auto bg-neutral shadow-lg">
                <Calendar
                    className="react-calendar rounded-lg shadow-md"
                    onChange={(value) => setDate(value)}
                    value={date}
                    view={view}
                    // onClickDay={handleDayClick}
                    // tileClassName={tileClassName}
                    // navigationLabel={navigationLabel}
                    // onActiveStartDateChange={preventHeaderClick}
                />
            </div>
        );
    }
    const handleDayClick = (value) => {
        setSelectedDate(value);
        setView('day');
    };

    const getEventsForDay = (date) => {
        return events.filter(event => (
            (event.start.toDateString() === date.toDateString() ||
                event.end.toDateString() === date.toDateString()) &&
            event.status.toLowerCase() === 'approved'
        ));
    };

    const renderDayView = () => {
        const dayEvents = getEventsForDay(selectedDate);
        return (
            <div className="day-view-container p-2 rounded-lg">
                <div className="flex justify-start">
                    <button className="px-2 py-1 text-sm" onClick={() => setView('month')}>
                        Back to Month View
                    </button>
                </div>

                <h3 className="text-lg font-bold mb-2">Schedule for {selectedDate?.toDateString()}</h3>
                <div className="time-slots overflow-auto max-h-32">
                    {dayEvents.length > 0 ? (
                        <table className="table-auto w-full">
                            <thead>
                                <tr>
                                    <th className="p-1 text-left text-sm">No.</th>
                                    <th className="p-1 text-left text-sm">Event Title</th>
                                    <th className="p-1 text-left text-sm">Event Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dayEvents
                                    .sort((a, b) => a.start - b.start) // Sort events by start time
                                    .map((event, index) => (
                                        <tr key={index} className="bg-secondary mb-1 rounded">
                                            <td className="text-sm">{index + 1}</td>
                                            <td className="p-1 font-bold text-sm">{event.title}</td>
                                            <td className="p-1 text-sm">
                                                {event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} -
                                                {event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No approved events for today.</p>
                    )}
                </div>
            </div>
        );
    };

    const renderYearView = () => {
        const year = date.getFullYear();
        const months = [...Array(12).keys()];

        return (
            <div className="year-view-container p-2 rounded-lg text-center">
                <h3 className="text-lg font-bold mb-2">Year {year}</h3>
                <div className="flex justify-between mb-2">
                    <button className="px-2 py-1 bg-secondary rounded text-sm" onClick={() => setDate(new Date(year - 1, date.getMonth(), 1))}>
                        Previous Year
                    </button>
                    <button className="px-2 py-1 bg-secondary rounded text-sm" onClick={() => setDate(new Date(year + 1, date.getMonth(), 1))}>
                        Next Year
                    </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {months.map((monthIndex) => {
                        const monthDate = new Date(year, monthIndex, 1);
                        return (
                            <div
                                key={monthIndex}
                                className="month-tile p-1 bg-base-200 rounded-lg cursor-pointer text-sm"
                                onClick={() => {
                                    setDate(monthDate);
                                    setView('month');
                                }}
                            >
                                {monthDate.toLocaleString('default', { month: 'long' })}
                            </div>
                        );
                    })}
                </div>
                <button className="mt-2 px-2 py-1 bg-secondary rounded text-sm" onClick={() => setView('month')}>
                    Back to Month View
                </button>
            </div>
        );
    };

    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const eventForDay = getEventsForDay(date);
            if (eventForDay.length > 0) {
                return 'bg-[#3EB489] text-white rounded-full hover:bg-red-600 cursor-pointer';
            }
        }
        return null;
    };


    const navigationLabel = ({ date }) => (
        <div className="text-sm">
            {date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}
        </div>
    );

    const preventHeaderClick = ({ activeStartDate, view }) => {
        setDate(date);
        setView(view);
    };

    const goToToday = () => {
        setDate(new Date()); // Reset to today's date
        setView('month'); // Reset view to month
    };

    return (
        <div className="p-2 rounded-lg text-center max-w-sm mx-auto bg-neutral shadow-lg">
            {/* <h1 className="font-bold text-xl text-green-500 mb-2">Calendar</h1> Adjusted size */}

            <div className="">
                <button className="rounded-lg px-2 py-1" onClick={goToToday}>
                    Today
                </button>
            </div>
            <div className='flex justify-center'>
                {view === 'month' && (
                    <Calendar
                        className="react-calendar rounded-lg shadow-md"
                        onChange={(value) => setDate(value)}
                        value={date}
                        view={view}
                        onClickDay={handleDayClick}
                        tileClassName={tileClassName}
                        navigationLabel={navigationLabel}
                        onActiveStartDateChange={preventHeaderClick}
                    />
                )}
            </div>
            {view === 'day' && selectedDate && renderDayView()}
            {view === 'year' && renderYearView()}
            <p className='text-warning text-sm'>Approved appointments only</p>
        </div>
    );
}
