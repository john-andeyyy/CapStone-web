import React from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import CustomDayCell from './CustomDayCell';

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

const CalendarView = ({ events, view, date, handleDateChange, handleViewChange, handleSelectSlot, handleSelectEvent, eventStyleGetter, dayPropGetter }) => {
    return (
        <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{
                height: 500,
                margin: '50px',
                backgroundColor: 'bg-base-200',
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            }}
            view={view}
            date={date}
            onNavigate={handleDateChange}
            onView={handleViewChange}
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            selectable
            views={['month', 'week', 'day']}
            // views={['month', 'week', 'day', 'agenda']}
            min={new Date(0, 0, 0, 8, 0, 0)} // 8 AM
            max={new Date(0, 0, 0, 17, 0, 0)} // 5 PM
            components={{
                day: {
                    date: CustomDayCell,
                },
            }}
            eventPropGetter={eventStyleGetter}
            dayPropGetter={dayPropGetter}
        />
    );
};

export default CalendarView;