import React, { useState } from 'react';
import TeethSVG from '../../GrapicsFiles/Teeth'; // Adjust the path as needed

const Tooth2d = ({ topCount = 7, bottomCount = 10 }) => {
    const [notes, setNotes] = useState({}); // State to hold notes for each tooth
    const [hoveredTooth, setHoveredTooth] = useState(null); // State to track hovered tooth ID
    const [selectedTooth, setSelectedTooth] = useState(null); // State to track selected tooth for modal
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
    const [newNote, setNewNote] = useState(''); // State for new note input
    const [editingIndex, setEditingIndex] = useState(null); // Index of the note being edited
    const [expandedTooth, setExpandedTooth] = useState(null); // State to track expanded tooth for notes

    // Function to generate an array of numbers from 0 to n-1
    const range = (n) => Array.from({ length: n }, (_, i) => i);

    // Handler to open the modal when a tooth is clicked
    const handleSvgClick = (id, name) => {
        setSelectedTooth({ id, name });
        setIsModalOpen(true); // Open the modal
    };

    // Handler to close the modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewNote('');
        setEditingIndex(null); // Reset editing state
    };

    // Handler to add or edit a note
    const handleSaveNote = () => {
        if (newNote.trim()) {
            const updatedNotes = { ...notes };
            if (editingIndex !== null) {
                // Edit an existing note
                updatedNotes[selectedTooth.id][editingIndex] = newNote;
                setEditingIndex(null); // Reset after editing
            } else {
                // Add new note at the top
                updatedNotes[selectedTooth.id] = [newNote, ...(notes[selectedTooth.id] || [])];
            }
            setNotes(updatedNotes);
            setNewNote(''); // Clear input field
        }
    };

    // Handler for editing a note
    const handleEditNote = (note, index) => {
        setNewNote(note);
        setEditingIndex(index);
    };

    // Function to toggle the expansion of notes for a tooth
    const toggleToothExpansion = (toothId) => {
        setExpandedTooth(expandedTooth === toothId ? null : toothId);
    };

    // Function to get all notes for a specific tooth
    const getNotesForTooth = (toothId) => {
        return notes[toothId] || [];
    };

    // Function to determine if a tooth ID is being hovered
    const isToothHovered = (id) => hoveredTooth === id;

    // Function to handle mouse enter and leave events for both SVG and notes
    const handleMouseEnter = (id) => {
        setHoveredTooth(id);
    };

    const handleMouseLeave = () => {
        setHoveredTooth(null);
    };

    return (
        <div className="flex flex-col items-center">
            <div className="mb-4">
                <div className="flex flex-wrap items-center justify-center space-x-4">
                    {/* Render SVG elements in the top row */}
                    {range(topCount).map((index) => (
                        <div
                            key={`top-${index}`}
                            onMouseEnter={() => handleMouseEnter(`top-${index}`)}
                            onMouseLeave={handleMouseLeave}
                            className="flex flex-col items-center"
                        >
                            <TeethSVG
                                id={`top-${index}`}
                                name={`Tooth ${index + 1}`}
                                onClick={() => handleSvgClick(`top-${index}`, `Tooth ${index + 1}`)}
                                isHovered={isToothHovered(`top-${index}`)}
                                className={`transition-transform ${isToothHovered(`top-${index}`) ? 'transform scale-110' : ''} hover:cursor-pointer`} // Hover effect for SVG
                            />
                            <span className="mt-2 text-sm text-gray-700">Top: {index + 1}</span> {/* Label for top teeth */}
                        </div>
                    ))}
                </div>
                <div className="flex flex-wrap items-center justify-center space-x-4 mt-4">
                    {/* Render SVG elements in the bottom row */}
                    {range(bottomCount).map((index) => (
                        <div
                            key={`bottom-${index}`}
                            onMouseEnter={() => handleMouseEnter(`bottom-${index}`)}
                            onMouseLeave={handleMouseLeave}
                            className="flex flex-col items-center"
                        >
                            <TeethSVG
                                id={`bottom-${index}`}
                                name={`Tooth ${index + topCount + 1}`}
                                onClick={() => handleSvgClick(`bottom-${index}`, `Tooth ${index + topCount + 1}`)}
                                isHovered={isToothHovered(`bottom-${index}`)}
                                className={`transition-transform ${isToothHovered(`bottom-${index}`) ? 'transform scale-110' : ''} hover:cursor-pointer`} // Hover effect for SVG
                            />
                            <span className="mt-2 text-sm text-gray-700">Bottom: {index + 1}</span> {/* Label for bottom teeth */}
                        </div>
                    ))}
                </div>
            </div>

            {/* Notes section */}
            <div className="w-full max-w-6xl mt-8 px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {range(topCount + bottomCount).map((index) => {
                        const toothId = index < topCount ? `top-${index}` : `bottom-${index - topCount}`;
                        const toothNotes = getNotesForTooth(toothId);
                        const isToothExpanded = expandedTooth === toothId;
                        const isToothHighlighted = isToothHovered(toothId);

                        return (
                            <div
                                key={toothId}
                                className={`p-4 bg-white shadow rounded-lg border border-gray-200 ${isToothHighlighted ? 'bg-blue-700 text-white' : ''}`} // Highlighted notes section
                                onMouseEnter={() => handleMouseEnter(toothId)}
                                onMouseLeave={handleMouseLeave}
                            >
                                <span className="text-lg font-semibold mb-2">{index < topCount ? `Top: ${index + 1}` : `Bottom: ${index - topCount + 1}`}</span> {/* Label in notes section */}
                                {toothNotes.length > 0 && (
                                    <div className="space-y-2 mb-2">
                                        <button
                                            className="w-full text-blue-500 hover:underline"
                                            onClick={() => toggleToothExpansion(toothId)}
                                        >
                                            {isToothExpanded ? 'Collapse Notes' : 'Expand Notes'}
                                        </button>
                                        {isToothExpanded && (
                                            <div className="space-y-2 mt-2">
                                                {toothNotes.map((note, noteIndex) => (
                                                    <div
                                                        key={noteIndex}
                                                        className={`p-2 bg-gray-100 border rounded hover:bg-gray-200 transition-colors ${isToothHighlighted ? 'bg-gray-200' : ''}`} // Highlighted notes
                                                    >
                                                        {note}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                                {toothNotes.length === 0 && (
                                    <p className="text-gray-500">No notes</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modal for viewing, adding, and editing notes */}
            {isModalOpen && selectedTooth && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                        <h3 className="text-xl font-semibold mb-4">Notes for {selectedTooth.name}</h3>

                        {/* Scrollable table for notes */}
                        <div className="mb-4 max-h-60 overflow-y-auto">
                            <table className="table-auto w-full text-left border">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="px-4 py-2">Note</th>
                                        <th className="px-4 py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getNotesForTooth(selectedTooth.id).map((note, index) => (
                                        <tr
                                            key={`modal-note-${index}`}
                                            className="hover:bg-gray-100 cursor-pointer"
                                        >
                                            <td className="px-4 py-2">{note}</td>
                                            <td className="px-4 py-2">
                                                <button
                                                    className="text-blue-500 hover:underline mr-2"
                                                    onClick={() => handleEditNote(note, index)}
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Input to add or edit a note */}
                        <textarea
                            className="w-full border border-gray-300 p-2 rounded mb-4"
                            placeholder="Enter new note or edit existing"
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                        />

                        {/* Modal action buttons */}
                        <div className="flex justify-end space-x-2">
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={handleSaveNote}
                            >
                                {editingIndex !== null ? 'Save Edit' : 'Add Note'}
                            </button>
                            <button
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                onClick={handleCloseModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tooth2d;
