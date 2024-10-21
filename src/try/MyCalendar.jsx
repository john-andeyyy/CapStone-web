import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
    const [events] = useState([
        {
            title: 'Meeting',
            start: new Date(2024, 9, 22, 10, 0), // Example event on October 22, 2024
            end: new Date(2024, 9, 22, 12, 0),
        }
    ]);

    // Custom function to change the tile color for a specific day (e.g., October 20, 2024)
    const dayPropGetter = (date) => {
        if (date.getDate() === 20 && date.getMonth() === 9 && date.getFullYear() === 2024) {
            return {
                style: {
                    backgroundColor: 'lightgreen', // Change tile background to light green
                },
            };
        }
        return {}; // No custom styling for other dates
    };

    return (
        <div style={{ height: '500px' }}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                dayPropGetter={dayPropGetter} // Apply custom day styles
            />
        </div>
    );
};

export default MyCalendar;
