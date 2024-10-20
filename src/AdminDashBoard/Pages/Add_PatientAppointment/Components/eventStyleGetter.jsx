// eventStyleGetter.js

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
        case 'rejected':
            backgroundColor = '#6C757D'; // Secondary
            break;
        case 'clinic closed':
            backgroundColor = '#FF6347'; // Custom color for "Clinic Closed"
            break;
        case 'dentist not available':
            backgroundColor = '#FF6347'; // Custom color for "Dentist Not Available"
            break;
        default:
            backgroundColor = '#6C757D'; // Default
    }

    return {
        style: {
            backgroundColor,
            color: 'white',
            borderRadius: '5px',
            padding: '1px',
            border: 'none',
            fontSize: '10px',
        },
    };
};

export default eventStyleGetter;
