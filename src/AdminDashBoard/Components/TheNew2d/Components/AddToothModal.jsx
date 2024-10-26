import React, { useState } from 'react';
import SemiFullModal from '../../../../ComponentModal/MediumModal';

const AddToothModal = ({ isOpen, onClose, onAdd, patientId }) => {
    // Set default values for name and status
    const [name, setName] = useState('extra teeth'); // Default to "extra teeth"
    const [status, setStatus] = useState('healthy'); // Default to "healthy"
    const [jaw, setJaw] = useState('Upper'); // Default to Upper
    const [position, setPosition] = useState('first'); // Default to first

    const handleSubmit = (e) => {
        e.preventDefault();
        const newTooth = { patientId: patientId, jaw, name, status, position };
        onAdd(newTooth);
        onClose(); // Close the modal after adding
    };

    return (
        <SemiFullModal isOpen={isOpen} onClose={onClose}>
            <div className="p-6">
                <>
                    <h2 className="text-lg font-bold mb-4">Add New Tooth</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm mb-1">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="border rounded w-full py-2 px-3"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm mb-1">Status</label>
                            <input
                                type="text" // Change from select to input
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                required
                                className="border rounded w-full py-2 px-3"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm mb-1">Jaw</label>
                            <select
                                value={jaw}
                                onChange={(e) => setJaw(e.target.value)}
                                className="border rounded w-full py-2 px-3"
                            >
                                <option value="Upper">Upper</option>
                                <option value="Lower">Lower</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm mb-1">Position</label>
                            <select
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                                className="border rounded w-full py-2 px-3"
                            >
                                <option value="first">First</option>
                                <option value="last">Last</option>
                            </select>
                        </div>
                        <div className="flex justify-end">
                            <button type="button" className="mr-2 text-gray-500" onClick={onClose}>
                                Cancel
                            </button>
                            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                                Add Tooth
                            </button>
                        </div>
                    </form>
                </>
            </div>
        </SemiFullModal>
    );
};

export default AddToothModal;
