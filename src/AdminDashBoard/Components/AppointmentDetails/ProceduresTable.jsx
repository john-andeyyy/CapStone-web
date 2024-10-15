import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProceduresModal from './ProceduresModal'; 

const ProceduresTable = ({ appointment }) => {
    const [userProceduresList, setUserProceduresList] = useState(appointment.procedures || []); 
    const [allProcedures, setAllProcedures] = useState([]);
    const [addedProcedures, setAddedProcedures] = useState([]);
    const [markedForRemoval, setMarkedForRemoval] = useState([]); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false); 
    const [editedAmount, setEditedAmount] = useState(appointment.Amount || 0);
    const [appointmentAmount, setappointmentAmount] = useState(appointment.Amount || 0);

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

    useEffect(() => {
        setUserProceduresList(appointment.procedures || []);
        setEditedAmount(appointment.Amount || 0); 
    }, [appointment]);

    const handleMarkForRemoval = (id) => {
        setMarkedForRemoval(prev => [...prev, id]);
    };

    const handleRemoveProcedure = (id) => {
        setAddedProcedures(prev => prev.filter(proc => proc._id !== id));
        setMarkedForRemoval(prev => prev.filter(procId => procId !== id));
    };

    const handleSaveProcedures = async () => {
        console.log('Payload size (bytes):', JSON.stringify(addedProcedures).length);

        try {
            const updatedProcedures = [...userProceduresList, ...addedProcedures];

            const finalProcedures = updatedProcedures.filter(proc => !markedForRemoval.includes(proc._id));

            console.log(finalProcedures);
            await axios.put(
                `${import.meta.env.VITE_BASEURL}/Appointments/appointmentUpdate/${appointment._id}`,
                {
                    procedureIds: finalProcedures.map(proc => proc._id),
                    Amount: calculateTotal()
                },
                { withCredentials: true }
            );

            console.log('Procedures saved successfully');

            setUserProceduresList(finalProcedures);

            setAddedProcedures([]);
            setMarkedForRemoval([]);
        } catch (error) {
            console.error('Error saving procedures:', error);
        }
    };

    const calculateTotal = () => {
        const existingProceduresTotal = userProceduresList.reduce((total, proc) => total + proc.Price, 0);
        const addedProceduresTotal = addedProcedures.reduce((total, proc) => total + proc.Price, 0);
        return existingProceduresTotal + addedProceduresTotal;
    };

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

    const handleAmountChange = (e) => {
        const value = e.target.value;
        setEditedAmount(value ? parseFloat(value) : 0);
    };

    const handleToggleEdit = () => {
        setIsEditing((prev) => !prev); // Toggle editing state
        if (isEditing) {
            // Add logic here for saving changes, if needed
            handleSaveProcedures()
            console.log('Save changes');
        } else {
            console.log('Edit mode enabled');
        }
    };

    return (
        <div>
            <p className='text-xl font-semibold'><strong>Procedures:</strong></p>
       

            {userProceduresList && userProceduresList.length > 0 ? (
                <div className="overflow-y-auto max-h-72 my-4">
                    <table className="min-w-full mb-4 table-fixed">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left w-1/2 sticky top-0 bg-green-500">Procedure Name</th>
                                <th className="px-4 py-2 text-left w-1/4 sticky top-0 bg-green-500">Price</th>
                                {isEditing && (
                                    <th className="px-4 py-2 text-left w-1/4 sticky top-0 bg-green-500">Actions</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {userProceduresList.map((procedure) => (
                                <tr
                                    key={procedure._id}
                                    className={markedForRemoval.includes(procedure._id) ? 'bg-red-200' : ''}
                                >
                                    <td className="border px-4 py-2 truncate">{procedure.Procedure_name}</td>
                                    <td className="border px-4 py-2 truncate">{`₱${procedure.Price}`}</td>
                                    {isEditing && (
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
                                                <div>

                                                    <button
                                                        className="text-red-500"
                                                        onClick={() => handleMarkForRemoval(procedure._id)}
                                                        aria-label={`Delete ${procedure.Procedure_name}`}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    )}
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

            {isEditing && (
                <div className='flex flex-row justify-between pb-4'>
                    <div>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={() => setIsModalOpen(true)}
                        >
                            Add Procedures
                        </button>
                    </div>
                    <div>
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded"
                            onClick={() => {
                                setAddedProcedures([])
                                setIsEditing(false)
                            }}
                        >
                            Cancel Add Procedures
                        </button>
                    </div>


                </div>

            )}

            <div className='flex flex-col justify-end text-right'>
                <div>
                    <button
                        onClick={handleToggleEdit}
                        className={`px-4 py-2 rounded ${isEditing ? 'bg-green-500' : 'bg-blue-500'
                            } text-white`}
                    >
                        {isEditing ? 'Save' : 'Edit'}
                    </button>
                </div>
            </div>

            <div className="flex justify-between mt-4 space-x-1">
                <p className="font-semibold ">Total of all procedures: </p>
                <p className="font-semibold">{`₱${calculateTotal()}`}</p>
            </div>
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
