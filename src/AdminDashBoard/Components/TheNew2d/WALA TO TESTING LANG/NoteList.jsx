
import React from 'react';

const NoteList = ({ notelist, onEdit, onDelete }) => (
    <div className={`px-5 overflow-y-auto h-96 mb-4 bg-green-100 border border-green-200 rounded-md shadow-sm ${notelist.length <= 3 ? '' : 'flex flex-col-reverse'}`}>
        <ul className="list-disc mb-4">
            {notelist.length > 0 ? (
                notelist.map((note, index) => (
                    <li key={index} className="mb-2 text-gray-800 flex justify-between items-center py-2 px-3 bg-white border border-gray-200 rounded-md shadow-sm">
                        <span className="flex-1">{note}</span>
                        <div>
                            <button onClick={() => onEdit(index, note)} className="text-blue-500 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300">Edit</button>
                            <button onClick={() => onDelete(index)} className="text-red-500 ml-2 hover:underline focus:outline-none focus:ring-2 focus:ring-red-300">Delete</button>
                        </div>
                    </li>
                ))
            ) : (
                <li className="text-gray-500 text-center">No notes available.</li>
            )}
        </ul>
    </div>
);

export default NoteList;
