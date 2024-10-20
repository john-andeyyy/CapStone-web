import React from 'react';

const CustomDayCell = ({ date, children, ...props }) => {
    const isToday = date.toDateString() === new Date().toDateString();
    return (
        <div {...props} className={`p-2 ${isToday ? 'bg-red-600 text-white' : 'bg-transparent text-gray-800'}`}>
            {children}
        </div>
    );
};

export default CustomDayCell;
