import React from 'react';
import Modal from '../../../Components/Modal';

const ConfirmAppointmentModal = ({ isOpen, patient, dentist, procedures, date, timeSlot, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    // Format the date as 'Month Day, Year'
    const formattedDate = date?.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <Modal isOpen={isOpen} onClose={onCancel}>
            <div className="p-6 bg-white rounded-lg shadow-md max-h-[80vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Confirm Appointment</h3>

                <div className="mb-4 text-gray-700">
                    <p><strong>Patient:</strong> {patient?.FirstName} {patient?.LastName}</p>
                    <p><strong>Dentist:</strong> {dentist?.FirstName} {dentist?.MiddleName} {dentist?.LastName}</p>

                    {/* Procedures and Prices in a Table with Scroll */}
                    <div className="max-h-40 overflow-y-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b">
                                    <th className="p-2">Procedure Name</th>
                                    <th className="p-2">Price (₱)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {procedures.map((proc) => (
                                    <tr key={proc._id} className="border-b">
                                        <td className="p-2">{proc.Procedure_name}</td>
                                        <td className="p-2">₱{proc.Price.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <p className="mt-4"><strong>Total Price:</strong> ₱{procedures.reduce((total, proc) => total + proc.Price, 0).toFixed(2)}</p>
                    <p><strong>Date:</strong> {formattedDate}</p>
                    <p><strong>Time Slot:</strong> {timeSlot?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                    <button
                        onClick={onCancel}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmAppointmentModal;
