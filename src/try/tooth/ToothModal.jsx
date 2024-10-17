// ToothModal.js
import React from 'react';

const ToothModal = ({ isOpen, onClose, onSave, newNote, setNewNote, selectedTooth }) => {
    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>{`Notes for ${selectedTooth.name}`}</h2>
                <textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} />
                <button onClick={onSave}>Save</button>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default ToothModal;
