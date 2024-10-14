import React, { useState } from 'react';

const ProceduresModal = ({ isOpen, onClose, allProcedures, onSelectProcedures, appointment, addedProcedures }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProcedures, setSelectedProcedures] = useState([]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const toggleProcedureSelection = (procedure) => {
        setSelectedProcedures(prev => {
            if (prev.includes(procedure)) {
                return prev.filter(p => p !== procedure);
            }
            return [...prev, procedure];
        });
    };

    const handleConfirmSelection = () => {
        onSelectProcedures(selectedProcedures);
        onClose(); // Close the modal after selection
    };

    // Combine IDs of already added procedures
    const alreadyAddedProcedureIds = [
        ...appointment.procedures.map(proc => proc._id),
        ...addedProcedures.map(proc => proc._id)
    ];

    // Filter out already added procedures
    const filteredProcedures = allProcedures.filter(proc =>
        !alreadyAddedProcedureIds.includes(proc._id) && // Exclude already added procedures
        proc.Procedure_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-accent rounded p-6 w-3/4 max-w-xl">
                    <h2 className="text-lg font-semibold mb-2">Select Procedures</h2>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="border px-2 py-1 mb-4 w-full"
                    />
                    <ul className="max-h-60 overflow-y-auto">
                        {filteredProcedures.length > 0 ? (
                            filteredProcedures.map(proc => (
                                <li
                                    key={proc._id}
                                    className="flex items-center mb-2 cursor-pointer"
                                    onClick={() => toggleProcedureSelection(proc)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedProcedures.includes(proc)}
                                        onChange={() => toggleProcedureSelection(proc)}
                                        className="mr-2"
                                    />
                                    <span className="ml-2">{proc.Procedure_name} - ₱{proc.Price}</span>
                                </li>
                            ))
                        ) : (
                            <li className="text-gray-500">No procedures available</li>
                        )}
                    </ul>
                    <div className="flex justify-between mt-4">
                        <button className="bg-error px-4 py-2 rounded" onClick={onClose}>
                            Cancel
                        </button>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={handleConfirmSelection}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        )
    );
};

export default ProceduresModal;
