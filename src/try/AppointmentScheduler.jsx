// src/components/CalendarScheduler.js

import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const CalendarScheduler = () => {
    const [events, setEvents] = useState([]);

    const handleSelectSlot = ({ start, end }) => {
        const title = window.prompt('New Event name');
        if (title) {
            setEvents([...events, { start, end, title }]);
        }
    };

    const handleSelectEvent = (event) => {
        const updatedEvents = events.filter(ev => ev !== event);
        setEvents(updatedEvents);
    };

    return (
        <div style={{ height: '600px' }}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600 }}
                selectable
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                popup
            />
        </div>
    );
};

export default CalendarScheduler;
