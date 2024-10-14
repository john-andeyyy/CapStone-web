import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProceduresModal from './ProceduresModal'; // Import the modal component

const ProceduresTable = ({ appointment }) => {
    const [userProceduresList, setUserProceduresList] = useState(appointment.procedures || []); // Initialize with appointment procedures
    const [allProcedures, setAllProcedures] = useState([]);
    const [addedProcedures, setAddedProcedures] = useState([]);
    const [markedForRemoval, setMarkedForRemoval] = useState([]); // State for marked procedures for removal
    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal open/close
    const [isEditing, setIsEditing] = useState(false); // State to manage editing mode for the amount
    const [editedAmount, setEditedAmount] = useState(appointment.Amount || 0); // State for edited amount
    const [appointmentAmount, setappointmentAmount] = useState(appointment.Amount || 0); // State for edited amount

    // Fetch all procedures from the backend
    const fetchAllProcedures = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASEURL}/Procedure/show`, {
                withCredentials: true,
            });
            setAllProcedures(response.data);
        } catch (error) {
            console.error('Error fetching procedures:', error);
        }
    };

    useEffect(() => {
        fetchAllProcedures();
    }, []);

    // Update userProceduresList when the appointment prop changes
    useEffect(() => {
        setUserProceduresList(appointment.procedures || []);
        setEditedAmount(appointment.Amount || 0); // Set amount when appointment changes
    }, [appointment]);

    // Handle marking a procedure for removal by its id
    const handleMarkForRemoval = (id) => {
        setMarkedForRemoval(prev => [...prev, id]);
    };

    // Handle removing a procedure from the list
    const handleRemoveProcedure = (id) => {
        // Remove from added procedures if it exists
        setAddedProcedures(prev => prev.filter(proc => proc._id !== id));
        // Remove from marked for removal
        setMarkedForRemoval(prev => prev.filter(procId => procId !== id));
    };

    // Handle saving selected procedures to the backend
    const handleSaveProcedures = async () => {
        console.log('Payload size (bytes):', JSON.stringify(addedProcedures).length);

        try {
            // Combine existing, added, and removed procedures
            const updatedProcedures = [...userProceduresList, ...addedProcedures];

            // Filter out the marked for removal procedures from the updated list
            const finalProcedures = updatedProcedures.filter(proc => !markedForRemoval.includes(proc._id));

            console.log(finalProcedures);
            await axios.put(
                `${import.meta.env.VITE_BASEURL}/Appointments/appointmentUpdate/${appointment._id}`,
                {
                    procedureIds: finalProcedures.map(proc => proc._id),
                    Amount: calculateTotal() // Use the edited amount
                    // Amount: editedAmount // Use the edited amount
                },
                { withCredentials: true }
            );

            console.log('Procedures saved successfully');

            // Update userProceduresList to reflect the changes
            setUserProceduresList(finalProcedures);

            // Clear added procedures and marked for removal after saving
            setAddedProcedures([]);
            setMarkedForRemoval([]);
        } catch (error) {
            console.error('Error saving procedures:', error);
        }
    };

    // Calculate total price of both existing and added procedures
    const calculateTotal = () => {
        const existingProceduresTotal = userProceduresList.reduce((total, proc) => total + proc.Price, 0);
        const addedProceduresTotal = addedProcedures.reduce((total, proc) => total + proc.Price, 0);
        return existingProceduresTotal + addedProceduresTotal;
    };

    // Handle selection of multiple procedures from the modal
    const handleSelectProcedures = (selectedProcedures) => {
        const newProcedures = selectedProcedures.filter(procedure => {
            const isDuplicateInAppointment = userProceduresList.some(proc => proc._id === procedure._id);
            const isDuplicateInAddedProcedures = addedProcedures.some(proc => proc._id === procedure._id);
            return !isDuplicateInAppointment && !isDuplicateInAddedProcedures;
        });

        if (newProcedures.length > 0) {
            setAddedProcedures(prev => [...prev, ...newProcedures]);
        } else {
            console.log('No new procedures to add, all are duplicates');
        }
    };

    // Handle amount input change
    const handleAmountChange = (e) => {
        const value = e.target.value;
        setEditedAmount(value ? parseFloat(value) : 0); // Convert to number or set to 0 if empty
    };

    return (
        <div>
            <div className='flex justify-between'>
                <p className='text-xl font-semibold'><strong>Procedure/s:</strong></p>
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={handleSaveProcedures}
                    disabled={addedProcedures.length === 0 && markedForRemoval.length === 0}
                >
                    Save Procedures
                </button>
            </div>

            {userProceduresList && userProceduresList.length > 0 ? (
                <div className="overflow-y-auto max-h-72 my-4">
                    <table className="min-w-full mb-4 table-fixed">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left w-1/2 sticky top-0 bg-green-500">Procedure Name</th>
                                <th className="px-4 py-2 text-left w-1/4 sticky top-0 bg-green-500">Price</th>
                                <th className="px-4 py-2 text-left w-1/4 sticky top-0 bg-green-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userProceduresList.map((procedure) => (
                                <tr
                                    key={procedure._id}
                                    className={markedForRemoval.includes(procedure._id) ? 'bg-red-200' : ''} // Highlight marked for removal
                                >
                                    <td className="border px-4 py-2 truncate">{procedure.Procedure_name}</td>
                                    <td className="border px-4 py-2 truncate">{`₱${procedure.Price}`}</td>
                                    <td className="border px-4 py-2">
                                        {markedForRemoval.includes(procedure._id) ? (
                                            <button
                                                className="text-red-500"
                                                onClick={() => handleRemoveProcedure(procedure._id)}
                                                aria-label={`Remove ${procedure.Procedure_name}`}
                                            >
                                                Remove
                                            </button>
                                        ) : (
                                            <button
                                                className="text-red-500"
                                                onClick={() => handleMarkForRemoval(procedure._id)}
                                                aria-label={`Delete ${procedure.Procedure_name}`}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {/* Added Procedures Rows */}
                            {addedProcedures.map((procedure) => (
                                <tr key={procedure._id}>
                                    <td className="border px-4 py-2 truncate">{procedure.Procedure_name}</td>
                                    <td className="border px-4 py-2 truncate">{`₱${procedure.Price}`}</td>
                                    <td className="border px-4 py-2">
                                        <button
                                            className="text-red-500"
                                            onClick={() => handleRemoveProcedure(procedure._id)}
                                            aria-label={`Remove ${procedure.Procedure_name}`}
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No procedures available</p>
            )}
            <div className='flex justify-between'>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => setIsModalOpen(true)}
                >
                    Search Procedures
                </button>

                {/* Display total at the bottom */}
                <div className="flex justify-between mt-4">
                    <p className="font-semibold">Total of all procedures:</p>
                    <p className="font-semibold">{`₱${calculateTotal()}`}</p>
                </div>
            </div>

            {/* <div className="flex justify-between mt-4">
                <p><strong>Appointment Amount:</strong></p>
                {!isEditing ? (
                    <div className="flex items-center">
                        <p className="font-semibold">{`₱${appointmentAmount || 'N/A'}`}</p>
                        <button
                            className="ml-2 text-blue-500"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center">
                        <input
                            type="number"
                            name="Amount"
                            value={editedAmount}
                            onChange={handleAmountChange}
                            className="p-2 border border-gray-300 rounded-lg"
                            placeholder="Enter Amount"
                        />
                        <button
                            className="ml-2 text-green-500"
                            onClick={() => {
                                setIsEditing(false);
                                handleSaveProcedures(); // Save procedures and amount
                            }}
                        >
                            Save
                        </button>
                    </div>
                )}
            </div> */}

            {/* Procedures Modal */}
            <ProceduresModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                allProcedures={allProcedures}
                onSelectProcedures={handleSelectProcedures}
                appointment={appointment}
                addedProcedures={addedProcedures}
            />
        </div>
    );
};

export default ProceduresTable;
