import React from 'react';

const ConfirmationPrompts = ({ showDeleteToothConfirmation, handleDeleteTooth, setShowDeleteToothConfirmation, showDeleteNoteConfirmation, handleDeleteNote, setShowDeleteNoteConfirmation }) => (
    <>
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
    </>
);

export default ConfirmationPrompts;
