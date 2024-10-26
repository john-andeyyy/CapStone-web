// NotesModal.js
import React, { useState } from 'react';
import axios from 'axios';
import SemiFullModal from '../../../../ComponentModal/MediumModal';
import NoteList from './NoteList';
import AddNoteForm from './AddNoteForm';
import UpdateNoteForm from './UpdateNoteForm';
import ToothDetails from './ToothDetails';
import ConfirmationPrompts from './ConfirmationPrompts';

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
        try {
            const response = await axios.post(`${Baseurl}/notes/${patientId}/${toothId}`, { note: newNote });
            setNotelist([...notelist, response.data.note]);
            setNewNote('');
            setSuccessMessage('Note added successfully!');
        } catch (error) {
            setError(error.response.data.message || 'Error adding note');
        } finally {
            setLoading(false);
        }
    };

    const handleEditNote = (index, note) => {
        setNoteIndexToUpdate(index);
        setUpdatedNote(note);
        setIsAddingNote(false);
    };

    const handleUpdateNote = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.put(`${Baseurl}/notes/${patientId}/${toothId}`, { note: updatedNote, index: noteIndexToUpdate });
            const updatedNotes = notelist.map((note, index) => (index === noteIndexToUpdate ? response.data.note : note));
            setNotelist(updatedNotes);
            setUpdatedNote('');
            setSuccessMessage('Note updated successfully!');
        } catch (error) {
            setError(error.response.data.message || 'Error updating note');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteNote = async () => {
        const indexToDelete = showDeleteNoteConfirmation.index;
        setLoading(true);
        try {
            await axios.delete(`${Baseurl}/notes/${patientId}/${toothId}/${indexToDelete}`);
            setNotelist(notelist.filter((_, index) => index !== indexToDelete));
            setShowDeleteNoteConfirmation({ show: false, index: null });
            setSuccessMessage('Note deleted successfully!');
        } catch (error) {
            setError(error.response.data.message || 'Error deleting note');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTooth = async () => {
        setLoading(true);
        try {
            await axios.delete(`${Baseurl}/teeth/${patientId}/${toothId}`);
            setShowDeleteToothConfirmation(false);
            onClose(); // Close modal after deletion
            onRefresh(); // Refresh the data in parent component
        } catch (error) {
            setError(error.response.data.message || 'Error deleting tooth');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateToothDetails = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put(`${Baseurl}/teeth/${patientId}/${toothId}`, toothDetails);
            setSuccessMessage('Tooth details updated successfully!');
            setIsEditingTooth(false);
        } catch (error) {
            setError(error.response.data.message || 'Error updating tooth details');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SemiFullModal onClose={onClose} title="Notes" isOpen={isOpen}>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
            <ToothDetails
                isEditingTooth={isEditingTooth}
                toothDetails={toothDetails}
                setToothDetails={setToothDetails}
                handleUpdateToothDetails={handleUpdateToothDetails}
                setIsEditingTooth={setIsEditingTooth}
            />
            <NoteList notelist={notelist} onEdit={handleEditNote} onDelete={(index) => setShowDeleteNoteConfirmation({ show: true, index })} />
            {isAddingNote ? (
                <AddNoteForm newNote={newNote} setNewNote={setNewNote} handleAddNote={handleAddNote} loading={loading} />
            ) : (
                <button onClick={() => setIsAddingNote(true)} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">Add Note</button>
            )}
            {noteIndexToUpdate !== null && (
                <UpdateNoteForm updatedNote={updatedNote} setUpdatedNote={setUpdatedNote} handleUpdateNote={handleUpdateNote} loading={loading} />
            )}
            <ConfirmationPrompts
                showDeleteToothConfirmation={showDeleteToothConfirmation}
                handleDeleteTooth={handleDeleteTooth}
                setShowDeleteToothConfirmation={setShowDeleteToothConfirmation}
                showDeleteNoteConfirmation={showDeleteNoteConfirmation}
                handleDeleteNote={handleDeleteNote}
                setShowDeleteNoteConfirmation={setShowDeleteNoteConfirmation}
            />
        </SemiFullModal>
    );
};

export default NotesModal;
