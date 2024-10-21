import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MediumModal from '../../../ComponentModal/MediumModal';
import { DentistList, ProcedureList } from '../../../Data/DataList';

export default function SetAppointment({ userIds }) {
    const [openFullModal, setOpenFullModal] = useState(false);
    const [procedureList, setProcedureList] = useState([]);
    const [localDentistList, setDentistList] = useState([]);
    const [selectedDentist, setSelectedDentist] = useState('');
    const [selectedProcedures, setSelectedProcedures] = useState([]);
    const [notes, setNotes] = useState('');
    const [isNotesVisible, setIsNotesVisible] = useState(false); // Toggle state for notes
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [amount, setAmount] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false); // Loading state
    const Baseurl = import.meta.env.VITE_BASEURL;

    const clear = () => {
        setSelectedProcedures([]);
        setSelectedDentist('');
        setDate('');
        setNotes('');
        setStartTime('');
        setEndTime('');
        setAmount('');
        setIsNotesVisible(false); // Reset the notes visibility toggle
    };

    const { data: dentistData } = DentistList();
    const { data: procedureData } = ProcedureList();

    useEffect(() => {
        if (dentistData) {
            setDentistList(dentistData.filter(den => den.isAvailable === true));
        }
        if (procedureData) {
            setProcedureList(procedureData.filter(pro => pro.available === true));
        }
    }, [dentistData, procedureData]);

    useEffect(() => {
        const totalAmount = selectedProcedures.reduce((total, procedureId) => {
            const procedure = procedureList.find(pro => pro._id === procedureId);
            return total + (procedure ? procedure.Price : 0);
        }, 0);
        setAmount(totalAmount);
    }, [selectedProcedures, procedureList]);

    const handleProcedureChange = (event, procedure) => {
        if (event.target.checked) {
            setSelectedProcedures([...selectedProcedures, procedure._id]);
        } else {
            setSelectedProcedures(selectedProcedures.filter(p => p !== procedure._id));
        }
    };

    const handleSubmit = async () => {
        if (!selectedDentist || selectedProcedures.length === 0 || !date || !startTime || !endTime) {
            setErrorMessage('Please fill in all required fields.');
            return;
        }

        const appointmentData = {
            notes: isNotesVisible ? notes : '', // Conditionally include notes
            procedureIds: selectedProcedures,
            date,
            Start: `${date}T${startTime}`,
            End: `${date}T${endTime}`,
            DentistID: selectedDentist,
            Amount: amount,
        };

        try {
            setLoading(true);
            const response = await axios.post(`${Baseurl}/Appointments/add/history/${userIds}`, appointmentData, { withCredentials: true });
            console.log('Appointment Created:', response.data);
            setErrorMessage('');
            setOpenFullModal(false);
            clear();
        } catch (error) {
            console.error('Error creating appointment:', error);
            setErrorMessage('Failed to create appointment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button
                className="btn text-xl font-semibold bg-[#3EB489] hover:bg-[#62A78E] text-white px-5 py-2 rounded-lg shadow-md transition duration-300"
                onClick={() => setOpenFullModal(true)}
            >
                Add Record
            </button>

            <MediumModal isOpen={openFullModal} onClose={() => {
                setOpenFullModal(false);
                setErrorMessage('');
                clear();
            }}>

                <h3 className="text-xl font-bold text-[#266D53] text-center mb-6">Set Appointment</h3>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm mb-1">Select Dentist</label>
                            <select
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={selectedDentist}
                                onChange={(e) => setSelectedDentist(e.target.value)}
                            >
                                <option value="">Choose dentist</option>
                                {localDentistList.map((dentist) => (
                                    <option key={dentist._id} value={dentist._id}>
                                        {`${dentist.FirstName} ${dentist.MiddleName ? dentist.MiddleName + ' ' : ''}${dentist.LastName}`}
                                    </option>
                                ))}
                            </select>

                            <div>
                                <label className="block text-sm mt-5">Total Amount</label>
                                <input
                                    type="number"
                                    value={amount}
                                    readOnly
                                    className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100"
                                    placeholder="Auto-calculated"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Select Procedures</label>
                            <div className="border border-gray-300 rounded-lg p-2 max-h-40 overflow-auto">
                                {procedureList.map((procedure) => (
                                    <div key={procedure._id} className="flex items-center mb-2">
                                        <input
                                            type="checkbox"
                                            id={`procedure-${procedure._id}`}
                                            onChange={(e) => handleProcedureChange(e, procedure)}
                                            className="mr-2 focus:ring-blue-400"
                                        />
                                        <label htmlFor={`procedure-${procedure._id}`} className="text-sm">
                                            {procedure.Procedure_name} - ₱{procedure.Price}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <label className="block text-sm mr-2">Add Notes?</label>
                        <input
                            type="checkbox"
                            checked={isNotesVisible}
                            onChange={() => setIsNotesVisible(!isNotesVisible)}
                            className="focus:ring-blue-400"
                        />
                    </div>

                    {isNotesVisible && (
                        <div>
                            <label className="block text-sm mb-1">Notes</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                rows="3"
                                placeholder="Additional details..."
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm mb-1">Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-1">Start Time</label>
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-1">End Time</label>
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    </div>
                </div>
                {errorMessage && (
                    <div className="bg-red-100 text-red-600 text-sm p-2 mt-4 rounded-lg">
                        {errorMessage}
                    </div>
                )}

                <div className='flex justify-center items-center'>
                    <button
                        className="bg-[#4285F4] hover:bg-[#0C65F8] text-white py-2 rounded-lg mt-6 px-8 transition duration-200"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Submit'}
                    </button>
                </div>

            </MediumModal>

        </div>
    );
}
