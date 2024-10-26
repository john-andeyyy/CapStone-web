import React from 'react';

const NotesModal = ({ isOpen, onClose, toothName, notes }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
                <h2 className="text-xl font-bold mb-4 text-center">{toothName} Notes</h2>
                <ul className="list-disc pl-5 mb-4">
                    {notes.length > 0 ? (
                        notes.map((note, index) => (
                            <li key={index} className="mb-2 text-gray-800">{note}</li>
                        ))
                    ) : (
                        <li className="text-gray-500">No notes available.</li>
                    )}
                </ul>
                <div className="flex justify-center">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotesModal;
