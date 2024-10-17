import React, { useEffect, useState } from 'react';
import TeethSVG from '../../GrapicsFiles/Teeth'; // Adjust the path as needed
import axios from 'axios';
import MedicalHistoryUpdate from './MedicalHistory/MedicalHistoryUpdate';


const Tooth2d = ({ userIds }) => {
    const Baseurl = import.meta.env.VITE_BASEURL
    const userId = userIds
    const [userid, setuserId] = useState(userIds);
    const [notes, setNotes] = useState({});

    const [hoveredTooth, setHoveredTooth] = useState(null); // State to track hovered tooth ID
    const [selectedTooth, setSelectedTooth] = useState(null); // State to track selected tooth for modal
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
    const [newNote, setNewNote] = useState(''); // State for new note input
    const [editingIndex, setEditingIndex] = useState(null); // Index of the note being edited
    const [expandedTooth, setExpandedTooth] = useState(null); // State to track expanded tooth for notes
    const [topCount, settopCount] = useState(null);
    const [bottomCount, setbottomCount] = useState(null);
    const [expandedTeeth, setExpandedTeeth] = useState({});
    const [showcreate, setshowcreate] = useState(false);

    const fetchMedicalHistory = async () => {
        try {
            const response = await axios.get(`${Baseurl}/MedicalHistory/viewByUserId/${userId}`);
            const data = response.data;
            console.log('Tooth2d', data)

            if (response.data.length > 0) {
                const record = response.data[0]; // Assuming you want the first record

                settopCount(record.topTeeth.length);
                setbottomCount(record.bottomTeeth.length);

                const initialToothData = {};
                record.topTeeth.forEach(tooth => {
                    initialToothData[`top-${tooth.toothNumber - 1}`] = {
                        notes: tooth.notes || [],
                        status: tooth.status || 'unknown', 
                    };
                });
                record.bottomTeeth.forEach(tooth => {
                    initialToothData[`bottom-${tooth.toothNumber - 1}`] = {
                        notes: tooth.notes || [],
                        status: tooth.status || 'unknown',
                    };
                });
                setNotes(initialToothData); 
                setshowcreate(false)

            } else {
                setshowcreate(true)
            }
        } catch (error) {
            console.error('Error fetching medical history:', error);
        }
    };

    useEffect(() => {


        fetchMedicalHistory();
    }, [userId]);

    // Function to get all notes for a specific tooth
    const getNotesForTooth = (toothId) => {
        return notes[toothId]?.notes || [];
    };


    const getToothData = (toothId) => {
        return notes[toothId] || { notes: [], status: 'unknown' };
    };

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
    const handleSaveNote = async () => {
        if (newNote.trim()) {
            const updatedNotes = { ...notes };
            const toothType = selectedTooth.id.startsWith('top-') ? 'topTeeth' : 'bottomTeeth';
            const toothIndex = parseInt(selectedTooth.id.split('-')[1], 10);

            // Prepare the updated tooth data
            const updatedToothData = {
                toothNumber: toothIndex + 1,
                notes: [...updatedNotes[selectedTooth.id]?.notes, newNote], // Add new note to the notes array
                status: updatedNotes[selectedTooth.id]?.status || 'unknown',
            };

            // Update the notes state
            if (editingIndex !== null) {
                updatedNotes[selectedTooth.id].notes[editingIndex] = newNote;
                setEditingIndex(null); // Reset after editing
            } else {
                updatedNotes[selectedTooth.id].notes = [...updatedNotes[selectedTooth.id]?.notes, newNote];
            }

            setNotes(updatedNotes);
            setNewNote(''); // Clear input field

            // Prepare the data for the backend PUT request
            const updatePayload = {
                topTeeth: toothType === 'topTeeth' ? Object.keys(updatedNotes).filter(key => key.startsWith('top-')).map(key => ({
                    toothNumber: parseInt(key.split('-')[1], 10) + 1,
                    status: updatedNotes[key]?.status || 'unknown',
                    notes: updatedNotes[key]?.notes || [],
                })) : [],
                bottomTeeth: toothType === 'bottomTeeth' ? Object.keys(updatedNotes).filter(key => key.startsWith('bottom-')).map(key => ({
                    toothNumber: parseInt(key.split('-')[1], 10) + 1,
                    status: updatedNotes[key]?.status || 'unknown',
                    notes: updatedNotes[key]?.notes || [],
                })) : [],
            };

            try {
                // Make the PUT request to update the medical history
                await axios.put(`${Baseurl}/MedicalHistory/update/${userId}`, updatePayload);
                console.log('Notes updated successfully!');
            } catch (error) {
                console.error('Error updating notes:', error);
            }
        }
    };

    // Handler for editing a note
    const handleEditNote = (note, index) => {
        setNewNote(note);
        setEditingIndex(index);
    };

    // Function to toggle the expansion of notes for a tooth
    const toggleToothExpansion = (toothId) => {
        setExpandedTeeth((prevState) => ({
            ...prevState,
            [toothId]: !prevState[toothId],
        }));
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
        <div className="flex flex-col items-center py-10">
            {showcreate && <MedicalHistoryUpdate userid={userid} fetchMedicalHistory={fetchMedicalHistory }/>}


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
                        const { notes: toothNotes, status: toothStatus } = getToothData(toothId);
                        const isToothExpanded = expandedTeeth[toothId]; // Check if this specific tooth is expanded
                        const isToothHighlighted = isToothHovered(toothId);

                        return (
                            <div
                                key={toothId}
                                className={`p-4 shadow rounded-lg border border-gray-200 ${isToothHighlighted ? ' ' : ''}`}
                                onMouseEnter={() => handleMouseEnter(toothId)}
                                onMouseLeave={handleMouseLeave}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className={`text-lg font-semibold ${isToothHighlighted ? 'text-red-500' : ''}`}>
                                        {index < topCount ? `Top: ${index + 1}` : `Bottom: ${index - topCount + 1}`}
                                        <span className="uppercase"> {toothStatus}</span> {/* Display the status */}
                                    </div>

                                    <div
                                        className="cursor-pointer text-blue-500 hover:underline"
                                        onClick={() => handleSvgClick(toothId, index < topCount ? `Top: ${index + 1}` : `Bottom: ${index - topCount + 1}`)}
                                    >
                                        ADD
                                    </div>
                                </div>

                                {toothNotes.length > 0 && (
                                    <div className="space-y-2 mb-2">
                                        <button
                                            className="w-full text-blue-500 hover:underline"
                                            onClick={() => toggleToothExpansion(toothId)}
                                        >
                                            {isToothExpanded ? 'Collapse Notes' : 'Expand Notes'}
                                        </button>
                                        {isToothExpanded && (
                                            <div className={`space-y-2 mt-2 ${toothNotes.length >= 3 ? 'max-h-40 overflow-y-auto' : ''}`}>
                                                {toothNotes.map((note, noteIndex) => (
                                                    <div key={noteIndex} className="p-2 border rounded">
                                                        {note}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {toothNotes.length === 0 && <p className="text-gray-500">No notes</p>}
                            </div>
                        );
                    })}
                </div>
            </div>




            {/* Modal for viewing, adding, and editing notes */}
            {isModalOpen && selectedTooth && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75">
                    <div className=" bg-base-100 p-6 rounded-lg shadow-lg w-full max-w-lg">

                        <h3 className="text-xl font-semibold mb-4">Notes for {selectedTooth.name}</h3>

                        {/* Scrollable table for notes */}
                        <div className="mb-4 max-h-60 overflow-y-auto">
                            <table className="table-auto w-full text-left border">
                                <thead>
                                    <tr
                                    // className="bg-darkgray-200"
                                    >
                                        <th className="px-4 py-2">Note</th>
                                        <th className="px-4 py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getNotesForTooth(selectedTooth.id).map((note, index) => (
                                        <tr
                                            key={`modal-note-${index}`}
                                            className=" border cursor-pointer"
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
