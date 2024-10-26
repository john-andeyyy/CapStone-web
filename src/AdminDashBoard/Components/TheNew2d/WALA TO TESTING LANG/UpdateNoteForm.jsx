
import React from 'react';

const UpdateNoteForm = ({ updatedNote, setUpdatedNote, handleUpdateNote, loading }) => (
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
);

export default UpdateNoteForm;
