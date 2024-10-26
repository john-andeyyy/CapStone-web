import React, { useState } from 'react';
import axios from 'axios';
import SemiFullModal from '../../../../ComponentModal/MediumModal';

const NotesModal = ({ isOpen, onClose, toothName, toothStatus, notes, patientId, toothId, jaw, onRefresh }) => {
    const [notelist, setNotelist] = useState(notes);
    const [newNote, setNewNote] = useState('');
    const [noteIndexToUpdate, setNoteIndexToUpdate] = useState(null);
    const [updatedNote, setUpdatedNote] = useState('');
    const [toothDetails, setToothDetails] = useState({ name: toothName, status: toothStatus });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [isEditingTooth, setIsEditingTooth] = useState(false);
    const [teethname, setteethname] = useState(toothName);
    const [showDeleteToothConfirmation, setShowDeleteToothConfirmation] = useState(false);
    const [showDeleteNoteConfirmation, setShowDeleteNoteConfirmation] = useState({ show: false, index: null });

    const Baseurl = import.meta.env.VITE_BASEURL;

    if (!isOpen) return null;

    const handleAddNote = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await axios.post(`${Baseurl}/tooth2dmodel/add-note`, {
                patientId,
                toothId,
                jaw,
                note: newNote,
            });

            // Make sure to check if response contains the 'notes' array
            if (response.data && response.data.notes) {
                setNotelist([...response.data.notes]); // Convert to an array and update notelist
                console.log('response.data.notes', response.data.notes)
            } else {
                setError('Invalid response format');
            }
            setNotelist({ note: response.data.notes });
            await onRefresh();
        } catch (error) {
            console.error('Error adding note:', error);
            setError('An error occurred while adding the note.');
        } finally {
            setLoading(false);
        }
    };


    const handleUpdateNote = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await axios.put(`${Baseurl}/tooth2dmodel/update-note`, {
                patientId,
                toothId,
                jaw,
                noteIndex: noteIndexToUpdate,
                updatedNote,
            });
            setUpdatedNote('');
            setNotelist({ note: response.data.note }); // Update notelist from response
            setNoteIndexToUpdate(null);
            await onRefresh();
        } catch (error) {
            console.error('Error updating note:', error);
            setError('An error occurred while updating the note.');
        } finally {
            setLoading(false);
        }
    };


    const confirmDeleteNote = (index) => {
        setShowDeleteNoteConfirmation({ show: true, index });
    };

    const handleDeleteNote = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.delete(`${Baseurl}/tooth2dmodel/delete-note`, {
                data: {
                    patientId,
                    toothId,
                    jaw,
                    noteIndex: showDeleteNoteConfirmation.index,
                },
            });

            // Ensure to update notelist with the new note array from response
            if (response.data && response.data.note) {
                setNotelist({ note: response.data.note });
            } else {
                setError('Invalid response format');
            }

            await onRefresh();
        } catch (error) {
            console.error('Error deleting note:', error);
            setError('An error occurred while deleting the note.');
        } finally {
            setLoading(false);
            setShowDeleteNoteConfirmation({ show: false, index: null });
        }
    };



    const confirmDeleteTooth = () => {
        setShowDeleteToothConfirmation(true);
    };

    const handleDeleteTooth = async () => {
        setLoading(true);
        setError('');
        try {
            await axios.delete(`${Baseurl}/tooth2dmodel/teeth/delete`, {
                data: {
                    patientId,
                    toothId,
                },
            });
            setSuccessMessage(`${toothDetails.name} deleted successfully.`);
            onClose();
            await onRefresh();
        } catch (error) {
            console.error('Error deleting tooth:', error);
            setError('An error occurred while deleting the tooth.');
        } finally {
            setLoading(false);
            setShowDeleteToothConfirmation(false);  // Hide confirmation prompt
        }
    };

    const handleUpdateToothDetails = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage(''); // Clear any previous success messages
        try {
            const response = await axios.put(`${Baseurl}/tooth2dmodel/update-tooth`, {
                patientId,
                toothId,
                jaw,
                name: toothDetails.name,
                status: toothDetails.status,
            });
            setteethname(response.data.name);
            setToothDetails({
                name: response.data.name,
                status: response.data.status,
            });

            setSuccessMessage(`${response.data.name} details updated successfully!`);
            setIsEditingTooth(false);
            await onRefresh();
        } catch (error) {
            console.error('Error updating tooth details:', error);
            setError('An error occurred while updating tooth details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SemiFullModal isOpen={isOpen} onClose={onClose}>
            <div>
                <div className='text-center text-lg font-semibold'>
                    {loading && <div className="spinner">Loading...</div>}
                    {error && <div className="text-red-500 mb-2">{error}</div>}
                    {successMessage && <div className="text-green-500 mb-2">{successMessage}</div>}
                </div>
                <div className="mb-2 ">
                    <h2 className="text-2xl font-bold text-center capitalize ">{teethname} Notes</h2>
                </div>

                {/* Tooth Details Section */}
                <div className="mb-4">
                    {isEditingTooth ? (
                        <form onSubmit={handleUpdateToothDetails} className="flex flex-col">
                            <div className="mb-2">
                                <label className="block">Tooth Name:</label>
                                <input
                                    type="text"
                                    value={toothDetails.name}
                                    onChange={(e) => setToothDetails({ ...toothDetails, name: e.target.value })}
                                    className="border border-gray-300 p-2 w-full text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block">Status:</label>
                                <input
                                    type="text"
                                    value={toothDetails.status}
                                    onChange={(e) => setToothDetails({ ...toothDetails, status: e.target.value })}
                                    className="border border-gray-300 p-2 w-full text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                />
                            </div>
                            <div className="flex justify-between">
                                <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">Save Changes</button>
                                <button type="button" onClick={() => setIsEditingTooth(false)} className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">Cancel</button>
                            </div>
                        </form>
                    ) : (
                        <div className="flex items-center ">
                            <span className="mr-4">Status: <span className='text-xl font-bold capitalize'>{toothDetails.status}</span></span>
                            <button onClick={() => setIsEditingTooth(true)} className="text-blue-500 hover:underline">Edit</button>
                        </div>
                    )}
                </div>

                <h2 className="text-xl font-bold">Notes:</h2>

                <div className={`px-5 overflow-y-auto h-96 mb-4 bg-green-100 border border-green-200 rounded-md shadow-sm ${notelist.length <= 3 ? '' : 'flex flex-col-reverse'}`}>
                    <ul className="list-disc mb-4">
                        {Array.isArray(notelist.note) && notelist.note.length > 0 ? (
                            notelist.note.map((note, index) => (
                                <li key={note._id} className="mb-2 text-gray-800 flex justify-between items-center py-2 px-3 bg-white border border-gray-200 rounded-md shadow-sm">
                                    <div >
                                        <p className="flex-1">
                                            {note.text}</p>

                                        <p className="text-gray-500 text-sm">
                                            ({new Date(note.dateCreated).toLocaleString('en-US', {
                                                month: 'short',
                                                day: 'numeric',  
                                                hour: 'numeric',  
                                                minute: 'numeric', 
                                                hour12: true     
                                            })})
                                        </p>
                                    </div>
                                    <div>
                                        <button onClick={() => {
                                            setNoteIndexToUpdate(index); // use index for updating specific note
                                            setUpdatedNote(note.text);   // Set updatedNote to note text only
                                        }} className="text-blue-500 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300">Edit</button>
                                        <button onClick={() => confirmDeleteNote(index)} className="text-red-500 ml-2 hover:underline focus:outline-none focus:ring-2 focus:ring-red-300">Delete</button>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="text-gray-500 text-center">No notes available.</li>
                        )}
                    </ul>

                </div>


                {/* Add New Note Section */}
                {isAddingNote && (
                    <form onSubmit={handleAddNote} className="flex mb-4">
                        <input
                            type="text"
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            className="border border-gray-300 p-2 text-sm w-[80%] rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                        <button
                            type="submit"
                            className={`ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Adding...' : 'Add Note'}
                        </button>
                    </form>
                )}

                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={() => setIsAddingNote(!isAddingNote)}
                        className="text-blue-500 hover:underline"
                    >
                        {isAddingNote ? 'Cancel' : 'Add New Note'}
                    </button>

                    <button onClick={confirmDeleteTooth} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
                        Delete Tooth
                    </button>

                </div>

                {/* Update Existing Note Section */}
                {noteIndexToUpdate !== null && (
                    <form onSubmit={handleUpdateNote} className="flex mb-4">
                        <input
                            type="text"
                            value={updatedNote}
                            onChange={(e) => setUpdatedNote(e.target.value)}
                            className="border border-gray-300 p-2 text-sm w-[80%] rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                        <button
                            type="submit"
                            className={`ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update Note'}
                        </button>
                    </form>
                )}
            </div>


            {/* Delete Tooth Confirmation Prompt */}
            {showDeleteToothConfirmation && (
                <div className="text-center mb-4">
                    <p>Are you sure you want to delete this tooth?</p>
                    <div className="flex justify-center mt-2">
                        <button onClick={handleDeleteTooth} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">Confirm</button>
                        <button onClick={() => setShowDeleteToothConfirmation(false)} className="ml-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition">Cancel</button>
                    </div>
                </div>
            )}

            {/* Delete Note Confirmation Prompt */}
            {showDeleteNoteConfirmation.show && (
                <div className="text-center mb-4">
                    <p>Are you sure you want to delete this note?</p>
                    <div className="flex justify-center mt-2">
                        <button onClick={handleDeleteNote} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">Confirm</button>
                        <button onClick={() => setShowDeleteNoteConfirmation({ show: false, index: null })} className="ml-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition">Cancel</button>
                    </div>
                </div>
            )}


        </SemiFullModal>
    );
};

export default NotesModal;
