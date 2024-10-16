import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UnavailableDentist = ({ dentistId }) => {
    const [unavailableList, setUnavailableList] = useState([]);
    const [error, setError] = useState(null);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [editId, setEditId] = useState(null); // Track which item is being edited
    const [editFrom, setEditFrom] = useState(''); // State for editing from date
    const [editTo, setEditTo] = useState(''); // State for editing to date
    const BASEURL = import.meta.env.VITE_BASEURL;

    const fetchUnavailableTimes = async () => {
        try {
            const response = await axios.get(`${BASEURL}/dentist/dentists/${dentistId}/unavailable`, { withCredentials: true });
            if (Array.isArray(response.data)) {
                setUnavailableList(response.data);
            } else {
                throw new Error('Response data is not an array');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching unavailable times');
        }
    };

    useEffect(() => {
        fetchUnavailableTimes();
    }, [dentistId]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString([], { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const addUnavailableTime = async (e) => {
        e.preventDefault();
        const newUnavailable = {
            from: fromDate,
            to: toDate,
        };

        try {
            const response = await axios.post(`${BASEURL}/dentist/dentists/${dentistId}/unavailable`, newUnavailable, { withCredentials: true });
            setUnavailableList((prev) => [...prev, response.data]);
            setFromDate('');
            setToDate('');
            fetchUnavailableTimes(); // Refresh the list after adding
        } catch (err) {
            setError(err.response?.data?.message || 'Error adding unavailable time');
        }
    };

    const deleteUnavailableTime = async (id) => {
        try {
            await axios.delete(`${BASEURL}/dentist/dentists/${dentistId}/unavailable/${id}`, { withCredentials: true });
            setUnavailableList((prev) => prev.filter((item) => item.id !== id));
        } catch (err) {
            setError(err.response?.data?.message || 'Error deleting unavailable time');
        }
    };

    const initiateEdit = (item) => {
        console.log('Editing item:', item); // Debug log
        setEditId(item.id);
        setEditFrom(item.from);
        setEditTo(item.to);
    };

    const updateUnavailableTime = async (e) => {
        e.preventDefault();
        const updatedUnavailable = {
            newFrom: editFrom,
            newTo: editTo,
        };

        try {
            const response = await axios.put(`${BASEURL}/dentist/dentists/${dentistId}/unavailable/${editId}`, updatedUnavailable, { withCredentials: true });
            setUnavailableList((prev) =>
                prev.map((item) => (item.id === editId ? response.data : item))
            );
            setEditId(null); // Reset edit state
            setEditFrom('');
            setEditTo('');
            fetchUnavailableTimes(); // Refresh the list after updating
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating unavailable time');
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Manage Unavailable Times for Dentist</h2>
            {error && <p className="text-red-500">{error}</p>}

            {/* Form for adding/updating unavailable times */}
            <form onSubmit={editId ? updateUnavailableTime : addUnavailableTime} className="mb-4">
                <div className="flex space-x-4">
                    <div>
                        <label htmlFor="fromDate" className="block mb-1">From:</label>
                        <input
                            id="fromDate"
                            type="datetime-local"
                            value={editId ? editFrom : fromDate}
                            onChange={(e) => (editId ? setEditFrom(e.target.value) : setFromDate(e.target.value))}
                            className="border rounded px-2 py-1"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="toDate" className="block mb-1">To:</label>
                        <input
                            id="toDate"
                            type="datetime-local"
                            value={editId ? editTo : toDate}
                            onChange={(e) => (editId ? setEditTo(e.target.value) : setToDate(e.target.value))}
                            className="border rounded px-2 py-1"
                            required
                        />
                    </div>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded">
                        {editId ? 'Update Unavailable Time' : 'Add Unavailable Time'}
                    </button>
                </div>
            </form>

            {/* Display Unavailable Times in a Table */}
            <h3 className="font-semibold mt-4">Unavailable Times</h3>
            {unavailableList.length > 0 ? (
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">ID</th>
                            <th className="border px-4 py-2">From</th>
                            <th className="border px-4 py-2">To</th>
                            <th className="border px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {unavailableList.map((item) => (
                            <tr key={item.id || `${item.from}-${item.to}`}>
                                <td className="border px-4 py-2">{item.id}</td>
                                <td className="border px-4 py-2">{formatDate(item.from)}</td>
                                <td className="border px-4 py-2">{formatDate(item.to)}</td>
                                <td className="border px-4 py-2">
                                    <button
                                        className="text-blue-500 hover:underline"
                                        onClick={() => initiateEdit(item)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="text-red-500 hover:underline ml-2"
                                        onClick={() => deleteUnavailableTime(item.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-gray-500">No unavailable times found.</p>
            )}
        </div>
    );
};

export default UnavailableDentist;
