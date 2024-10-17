// NotesSection.js
import React from 'react';

const NotesSection = ({ toothId, notes, isExpanded, onToggle }) => {
    return (
        <div className="p-4 shadow rounded-lg border border-gray-300">
            <h3 className="text-lg font-semibold">{toothId}</h3>
            <button onClick={onToggle} className="text-sm text-blue-500">
                {isExpanded ? 'Hide Notes' : 'Show Notes'}
            </button>
            {isExpanded && (
                <ul className="mt-2">
                    {notes.map((note, index) => (
                        <li key={index} className="border-b py-1">{note}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default NotesSection;
