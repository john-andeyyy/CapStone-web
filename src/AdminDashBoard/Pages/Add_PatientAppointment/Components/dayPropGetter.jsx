const dayPropGetter = (date, events) => {
    
    // // Check if the clinic is closed on the given date
    // const isClinicClosed = events.some(event => {
    //     // Use console.log here for debugging to inspect the event data
    //     return event.status.toLowerCase() === 'clinic closed' &&
    //         date >= new Date(event.start) &&
    //         date <= new Date(event.end); // Check if date is in range of start and end
    // });

    // // Check if the dentist is not available on the given date
    // const isDentistNotAvailable = events.some(event => {
    //     return event.status.toLowerCase() === 'dentist not available' &&
    //         date >= new Date(event.start) &&
    //         date <= new Date(event.end); // Check if date is in range of start and end
    // });

    // // Determine if the day should be highlighted
    // const shouldHighlight = isClinicClosed || isDentistNotAvailable;

    // return {
    //     style: {
    //         backgroundColor: shouldHighlight ? '#FF6347' : 'transparent', // Use the same color for highlighting
    //     },
    //     // Uncomment the next line to provide a label if highlighted
    //     // label: shouldHighlight ? (isClinicClosed ? 'Clinic Closed' : 'Dentist Not Available') : null
    // };
};

export default dayPropGetter;
