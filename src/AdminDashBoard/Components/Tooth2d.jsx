import React, { useEffect, useState } from 'react';
import TeethSVG from '../../GrapicsFiles/Teeth';
import axios from 'axios';
import MedicalHistoryUpdate from './MedicalHistory/MedicalHistoryUpdate';


const Tooth2d = ({ userIds }) => {
    const Baseurl = import.meta.env.VITE_BASEURL
    const userId = userIds
    const [userid, setuserId] = useState(userIds);
    const [notes, setNotes] = useState({});

    const [hoveredTooth, setHoveredTooth] = useState(null);
    const [selectedTooth, setSelectedTooth] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newNote, setNewNote] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);
    const [expandedTooth, setExpandedTooth] = useState(null);
    const [topCount, settopCount] = useState(null);
    const [bottomCount, setbottomCount] = useState(null);
    const [expandedTeeth, setExpandedTeeth] = useState({});
    const [showcreate, setshowcreate] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);
    const [status, setStatus] = useState('');
    const [showcard, setshowcard] = useState(false);


    const fetchMedicalHistory = async () => {
        try {
            const response = await axios.get(`${Baseurl}/MedicalHistory/viewByUserId/${userId}`);
            const data = response.data;

            if (response.data.length > 0) {
                const record = response.data[0];

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

    const range = (n) => Array.from({ length: n }, (_, i) => i);

    const handleSvgClick = (id, name) => {
        setSelectedTooth({ id, name });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewNote('');
        setStatusMessage(null)
        setEditingIndex(null);
    };

   
    const handleSaveNote = async () => {
        if (newNote.trim()) {
            const updatedNotes = { ...notes };
            const toothType = selectedTooth.id.startsWith('top-') ? 'topTeeth' : 'bottomTeeth';
            const toothIndex = parseInt(selectedTooth.id.split('-')[1], 10);

            const toothStatus = status || updatedNotes[selectedTooth.id]?.status || 'unknown';

            const updatedToothData = {
                toothNumber: toothIndex + 1,
                notes: editingIndex !== null
                    ? updatedNotes[selectedTooth.id]?.notes.map((note, i) => (i === editingIndex ? newNote : note))
                    : [...(updatedNotes[selectedTooth.id]?.notes || []), newNote],
                status: toothStatus, // Include the updated status
            };

            updatedNotes[selectedTooth.id] = updatedToothData;
            setNotes(updatedNotes);
            setNewNote(''); 
            setEditingIndex(null);
            setStatus(''); 

            const updatePayload = {
                topTeeth: toothType === 'topTeeth'
                    ? Object.keys(updatedNotes).filter(key => key.startsWith('top-')).map(key => ({
                        toothNumber: parseInt(key.split('-')[1], 10) + 1,
                        status: updatedNotes[key]?.status || 'unknown',
                        notes: updatedNotes[key]?.notes || [],
                    }))
                    : [],
                bottomTeeth: toothType === 'bottomTeeth'
                    ? Object.keys(updatedNotes).filter(key => key.startsWith('bottom-')).map(key => ({
                        toothNumber: parseInt(key.split('-')[1], 10) + 1,
                        status: updatedNotes[key]?.status || 'unknown',
                        notes: updatedNotes[key]?.notes || [],
                    }))
                    : [],
            };

            try {
                // Make the PUT request to update the medical history with notes and status
                await axios.put(`${Baseurl}/MedicalHistory/update/${userId}`, updatePayload);
                console.log('Notes and status updated successfully!');
                setStatusMessage({ type: 'success', text: 'Notes and status updated successfully!' });
                // handleCloseModal()
            } catch (error) {
                console.error('Error updating notes and status:', error);
                setStatusMessage({ type: 'error', text: 'Error updating notes and status.' });
            }
        }
    };

    const handleSaveStatus = async () => {
        const updatedNotes = { ...notes };
        const toothType = selectedTooth.id.startsWith('top-') ? 'topTeeth' : 'bottomTeeth';
        const toothIndex = parseInt(selectedTooth.id.split('-')[1], 10);

        // Ensure status is part of the updated tooth data
        const toothStatus = status || updatedNotes[selectedTooth.id]?.status || 'unknown'; // Use the input status or fallback

        // Prepare the updated tooth data with only status
        const updatedToothData = {
            toothNumber: toothIndex + 1,
            status: toothStatus, // Include the updated status
        };

        // Update the status in local state
        updatedNotes[selectedTooth.id] = updatedToothData;
        setNotes(updatedNotes);
        setStatus(''); // Clear the status input

        // Prepare the data for the backend PUT request (status only)
        const updatePayload = {
            topTeeth: toothType === 'topTeeth'
                ? Object.keys(updatedNotes).filter(key => key.startsWith('top-')).map(key => ({
                    toothNumber: parseInt(key.split('-')[1], 10) + 1,
                    status: updatedNotes[key]?.status || 'unknown',
                }))
                : [],
            bottomTeeth: toothType === 'bottomTeeth'
                ? Object.keys(updatedNotes).filter(key => key.startsWith('bottom-')).map(key => ({
                    toothNumber: parseInt(key.split('-')[1], 10) + 1,
                    status: updatedNotes[key]?.status || 'unknown',
                }))
                : [],
        };

        try {
            // Make the PUT request to update the medical history with only the status
            await axios.put(`${Baseurl}/MedicalHistory/update/${userId}`, updatePayload);
            console.log('Status updated successfully!');
            setStatusMessage({ type: 'success', text: 'Status updated successfully!' });
            handleCloseModal()
            fetchMedicalHistory()

        } catch (error) {
            console.error('Error updating status:', error);
            setStatusMessage({ type: 'error', text: 'Error updating status.' });
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
        <div className="flex flex-col items-center py-10 w-full">
            {showcreate && <MedicalHistoryUpdate userid={userid} fetchMedicalHistory={fetchMedicalHistory} />}


            <div className="mb-4">
                <div className="flex flex-wrap items-center justify-center ">
                    {/* Render SVG elements in the top row */}
                    {range(topCount).map((index) => {
                        const toothId = `top-${index}`;
                        const toothData = getToothData(toothId); // Get tooth data (status and notes)

                        return (
                            <div
                                key={toothId}
                                onMouseEnter={() => handleMouseEnter(toothId)}
                                onMouseLeave={handleMouseLeave}
                                className="flex flex-col items-center"
                            >
                                <TeethSVG
                                    id={toothId}
                                    name={`Tooth ${index + 1}`}
                                    onClick={() => handleSvgClick(toothId, `Tooth ${index + 1}`)}
                                    isHovered={isToothHovered(toothId)}
                                    className={`transition-transform ${isToothHovered(toothId) ? 'transform scale-110' : ''} hover:cursor-pointer`}
                                    status={toothData.status} // Pass the status from the tooth data
                                />
                                <span className="mt-2 text-sm text-gray-700">Top: {index + 1}</span>
                            </div>
                        );
                    })}
                </div>
                
                <div className="flex flex-wrap items-center justify-center  mt-4">
                    {/* Render SVG elements in the bottom row */}
                    {range(bottomCount).map((index) => {
                        const toothId = `bottom-${index}`;
                        const toothData = getToothData(toothId); // Get tooth data (status and notes)

                        return (
                            <div
                                key={toothId}
                                onMouseEnter={() => handleMouseEnter(toothId)}
                                onMouseLeave={handleMouseLeave}
                                className="flex flex-col items-center"
                            >
                                <TeethSVG
                                    id={toothId}
                                    name={`Tooth ${index + topCount + 1}`}
                                    onClick={() => handleSvgClick(toothId, `Tooth ${index + topCount + 1}`)}
                                    isHovered={isToothHovered(toothId)}
                                    className={`transition-transform ${isToothHovered(toothId) ? 'transform scale-110' : ''} hover:cursor-pointer`}
                                    status={toothData.status} // Pass the status from the tooth data
                                />
                                <span className="mt-2 text-sm text-gray-700">Bottom: {index + 1}</span>
                            </div>
                        );
                    })}
                </div>

            </div>
            <button
                onClick={() => setshowcard((prev) => !prev)} // Toggle the showcard state
                className="bg-blue-500 text-white font-semibold rounded-lg px-4 py-2 mb-4 shadow-md hover:bg-blue-600 transition duration-300"
            >
                {showcard ? 'Hide' : 'Show'}
            </button>
            {showcard && (
                <div className="w-full max-w-6xl mt-8 px-4">
                    {/* Notes section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {range(topCount + bottomCount).map((index) => {
                            const toothId = index < topCount ? `top-${index}` : `bottom-${index - topCount}`;
                            const { notes: toothNotes, status: toothStatus } = getToothData(toothId);
                            const isToothExpanded = expandedTeeth[toothId];
                            const isToothHighlighted = isToothHovered(toothId);
                            const safeToothNotes = Array.isArray(toothNotes) ? toothNotes : [];

                            return (
                                <div
                                    key={toothId}
                                    className={`p-4 shadow rounded-lg border border-gray-200 ${isToothHighlighted ? 'bg-green-100' : ''}`} // Highlight background if hovered
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

                                    {safeToothNotes.length > 0 ? (
                                        <div className="space-y-2 mb-2">
                                            <button
                                                className="w-full text-blue-500 hover:underline"
                                                onClick={() => toggleToothExpansion(toothId)}
                                            >
                                                {isToothExpanded ? 'Collapse Notes' : 'Expand Notes'}
                                            </button>
                                            {isToothExpanded && (
                                                <div className={`space-y-2 mt-2 ${safeToothNotes.length >= 3 ? 'max-h-40 overflow-y-auto' : ''}`}>
                                                    {safeToothNotes.map((note, noteIndex) => (
                                                        <div key={noteIndex} className="p-2 border rounded">
                                                            {note}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">No notes available for this tooth.</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}





            {/* Modal for viewing, adding, and editing notes */}
            {isModalOpen && selectedTooth && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75">
                    <div className="bg-base-100 p-6 rounded-lg shadow-lg w-full max-w-lg">
                        <h3 className="text-xl font-semibold mb-4">Notes for {selectedTooth.name}</h3>

                        <h2 className="text-2xl mb-4">
                            {selectedTooth.name} - Notes & Status
                        </h2>

                        {/* Status input */}
                        <h2 className="text-2xl font-semibold mb-4">Update Status</h2>

                        <div className='flex py-3'>
                            <input
                                type="text"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                placeholder="Enter status"
                                className="border border-gray-300 p-2 rounded-l-lg w-full mb-0 shadow-md focus:outline-none focus:ring focus:ring-blue-500"
                            />
                            <button
                                onClick={handleSaveStatus}
                                className="bg-blue-500 text-white rounded-r-lg shadow-md hover:bg-blue-600 transition duration-300 h-full px-4"
                            >
                                Save Status
                            </button>
                        </div>

                        
                        {/* Scrollable table for notes */}
                        <div className="mb-4 max-h-60 overflow-y-auto">
                            <table className="table-auto w-full text-left border">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2">Note</th>
                                        <th className="px-4 py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getNotesForTooth(selectedTooth.id).map((note, index) => (
                                        <tr key={`modal-note-${index}`} className="border cursor-pointer">
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

                        {/* Status message */}
                        {statusMessage && (
                            <div className={`mb-4 p-2 rounded ${statusMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {statusMessage.text}
                            </div>
                        )}



                        <div className="flex justify-between">
                            <button
                                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                                onClick={handleSaveNote}
                            >
                                {editingIndex !== null ? 'Update Note' : 'Add Note'}
                            </button>
                            <button
                                className="bg-red-500 py-2 px-4 rounded hover:bg-red-400"
                                onClick={handleCloseModal}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Tooth2d;
