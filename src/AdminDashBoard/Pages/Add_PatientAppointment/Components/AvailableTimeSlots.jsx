const AvailableTimeSlots = ({ selectedDate, unavailableDates, appointments, onSelectTimeSlot, allButtonsDisabled }) => {
    const timeSlots = [];
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(8, 0, 0); // Start time at 8:00 AM
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(17, 0, 0); // End time at 5:00 PM


    // Generate time slots in 30-minute increments
    for (let time = new Date(startOfDay); time <= endOfDay; time.setMinutes(time.getMinutes() + 30)) {
        timeSlots.push(new Date(time));
    }
    return (
        <div className="flex flex-col items-center p-4 w-full max-w-3xl mx-auto sm:p-6">
            <div className="flex items-center justify-center w-full mb-4 sm:mb-6">
                <div className="text-center">
                    <h3 className="text-lg font-bold sm:text-xl">Available Time Slots</h3>
                    <p className="text-gray-600">
                        {isNaN(selectedDate) ? 'Invalid Date' : selectedDate.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}
                    </p>
                </div>
            </div>

            <div className="w-full">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {timeSlots.map((slot, index) => {
                        //isUnavailable is for the clinic close time and date
                        const isUnavailable = unavailableDates.some(unavailable =>
                            slot >= new Date(unavailable.start) && slot < new Date(unavailable.end)
                        );

                        // !! 
                        // const isBooked = appointments.some(appointment => {
                        //     const appointmentStart = new Date(appointment.start);
                        //     const appointmentEnd = new Date(appointment.end);
                        //     return slot >= appointmentStart && slot < new Date(appointmentEnd.getTime() + 30 * 60 * 1000);
                        // });

                        const isBooked = appointments.some(appointment => {
                            const appointmentStart = new Date(appointment.start);
                            const appointmentEnd = new Date(appointment.end);
                            // Disable all time slots within the range from appointment start to appointment end
                            return slot >= appointmentStart && slot < appointmentEnd;
                        });

                        const isDisabled = allButtonsDisabled || isUnavailable || isBooked
                        //  || slot < currentDate; // Disable if in the past

                        return (
                            <button
                                key={index}
                                onClick={() => !isDisabled && onSelectTimeSlot(slot, selectedDate)}
                                className={`py-3 rounded-md text-sm w-full text-center ${isDisabled ? 'bg-red-200 text-gray-500 cursor-not-allowed' : 'bg-green-100 text-gray-800 hover:bg-green-300'}`}
                                disabled={isDisabled}
                            >
                                {slot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} <br />
                                {isDisabled ? 'Not Available' : 'Available'}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AvailableTimeSlots;
