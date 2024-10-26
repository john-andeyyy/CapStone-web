import React from 'react';

const AddNoteForm = ({ newNote, setNewNote, handleAddNote, loading }) => (
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
);

export default AddNoteForm;
