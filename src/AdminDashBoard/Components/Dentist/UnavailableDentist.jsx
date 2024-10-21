import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { showToast } from '../ToastNotification';

const Modal = ({ isOpen, onClose, onSubmit, editFrom, editTo, setEditFrom, setEditTo }) => {
    if (!isOpen) return null; // Don't render anything if the modal is closed

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-[#C6E4DA] p-4 rounded shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-[#266D53] text-center">Edit Unavailable Time</h2>
                <form onSubmit={onSubmit}>
                    <div className="flex flex-col space-y-4 mt-5">

                        <div className='flex flex-cols'>
                            <label htmlFor="editFromDate" className="block mb-1 mr-2 mt-1">From:</label>
                            <input
                                id="editFromDate"
                                type="datetime-local"
                                value={editFrom}
                                onChange={(e) => setEditFrom(e.target.value)}
                                className="border rounded px-2 py-1"
                                required
                            />

                        </div>

                        <div className='flex flex-cols'>
                            <label htmlFor="editToDate" className="block mb-1 mr-7 mt-1">To:</label>
                            <input
                                id="editToDate"
                                type="datetime-local"
                                value={editTo}
                                onChange={(e) => setEditTo(e.target.value)}
                                className="border rounded px-2 py-1"
                                required
                            />

                        </div>
                        <div className="flex justify-between gap-4">
                            <button type="submit" className="bg-[#4285F4] hover:bg-[#0C65F8] text-black px-4 py-1 rounded">
                                Update Unavailable Time
                            </button>
                            <button type="button" onClick={onClose} className="bg-[#D9D9D9] hover:bg-[#ADAAAA] text-black px-4 py-1 rounded">
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

const UnavailableDentist = ({ dentistId }) => {
    const [unavailableList, setUnavailableList] = useState([]);
    const [error, setError] = useState(null);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [editId, setEditId] = useState(null);
    const [editFrom, setEditFrom] = useState('');
    const [editTo, setEditTo] = useState('');
    const [modalOpen, setModalOpen] = useState(false); // Modal visibility state
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
        showToast('success', ' successful!');

        try {
            const response = await axios.post(`${BASEURL}/dentist/dentists/${dentistId}/unavailable`, newUnavailable, { withCredentials: true });
            setUnavailableList((prev) => [...prev, response.data]);
            setFromDate('');
            setToDate('');
            fetchUnavailableTimes();
        } catch (err) {
            setError(err.response?.data?.message || 'Error adding unavailable time');
        }
    };

    const deleteUnavailableTime = async (id) => {
        try {
            await axios.delete(`${BASEURL}/dentist/dentists/${dentistId}/unavailable/${id}`, { withCredentials: true });
            setUnavailableList((prev) => prev.filter((item) => item._id !== id));
            showToast('success', ' Delete successful!');

        } catch (err) {
            setError(err.response?.data?.message || 'Error deleting unavailable time');
        }
    };

    const initiateEdit = (item) => {
        setEditId(item._id);
        setEditFrom(item.from);
        setEditTo(item.to);
        setModalOpen(true); // Open the modal
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
                prev.map((item) => (item._id === editId ? response.data : item))
            );
            setModalOpen(false); // Close the modal
            setEditId(null);
            setEditFrom('');
            setEditTo('');
            fetchUnavailableTimes();
            showToast('success', ' Udpate successful!');

        } catch (err) {
            setError(err.response?.data?.message || 'Error updating unavailable time');
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4 text-[#266D53] text-center">Manage Unavailable Times for Dentist</h2>
            {error && <p className="text-red-500">{error}</p>}

            {/* Form for adding unavailable times */}
            <form onSubmit={addUnavailableTime} className="mb-4">
                <div className="flex space-x-4">
                    <div>
                        <label htmlFor="fromDate" className="block mb-1">From:</label>
                        <input
                            id="fromDate"
                            type="datetime-local"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="border rounded px-2 py-1"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="toDate" className="block mb-1">To:</label>
                        <input
                            id="toDate"
                            type="datetime-local"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="border rounded px-2 py-1"
                            required
                        />
                    </div>
                    <button type="submit" className="bg-[#4285F4] hover:bg-[#0C65F8] text-white px-4 py-1 mt-5 rounded">
                        Add Unavailable Time
                    </button>
                </div>
            </form>

            {/* Display Unavailable Times in a Table */}
            <h3 className="font-semibold mt-4">Unavailable Times</h3>
            {unavailableList.length > 0 ? (
                <table className="min-w-full  border border-gray-500">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2 bg-[#3EB489] text-white text-center">ID</th>
                            <th className="border px-4 py-2 bg-[#3EB489] text-white text-center">From</th>
                            <th className="border px-4 py-2 bg-[#3EB489] text-white text-center">To</th>
                            <th className="border px-4 py-2 bg-[#3EB489] text-white text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {unavailableList.map((item) => (
                            <tr key={item._id || `${item.from}-${item._to}`}>
                                <td className="border border-gray-500 px-4 py-2 bg-gray-100">{item._id}</td>
                                <td className="border border-gray-500 px-4 py-2 bg-gray-100">{formatDate(item.from)}</td>
                                <td className="border border-gray-500 px-4 py-2 bg-gray-100">{formatDate(item.to)}</td>
                                <td className="border border-gray-500 px-4 py-2 bg-gray-100">

                                    <div className="flex items-center">
                                        {/* Edit Button with Tooltip */}
                                        <div className="relative inline-block group">
                                            <button
                                                className="text-black-500 flex flex-col items-center justify-center w-10 bg-gray-200 hover:text-black-600 transition rounded-lg shadow-sm"
                                                onClick={() => initiateEdit(item)}
                                                title='edit'
                                            >
                                                <span className="material-symbols-outlined">edit</span>
                                            </button>

                                        </div>

                                        {/* Delete Button with Tooltip */}
                                        <div className="relative inline-block group ml-2">
                                            <button
                                                className="text-red-500 flex flex-col items-center justify-center w-10 bg-red-100 hover:text-red-600 transition rounded-lg shadow-sm"
                                                onClick={() => deleteUnavailableTime(item._id)}
                                                title='delete'
                                            >
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>

                                        </div>
                                    </div>


                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-gray-500">No unavailable times found.</p>
            )}

            {/* Modal for editing unavailable time */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={updateUnavailableTime}
                editFrom={editFrom}
                editTo={editTo}
                setEditFrom={setEditFrom}
                setEditTo={setEditTo}
            />
        </div>
    );
};

export default UnavailableDentist;
