
import React from 'react';

const ToothDetails = ({ isEditingTooth, toothDetails, setToothDetails, handleUpdateToothDetails, setIsEditingTooth }) => (
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
            <div className="flex items-center">
                <span className="mr-4">Status: <span className='text-xl font-bold capitalize'>{toothDetails.status}</span></span>
                <button onClick={() => setIsEditingTooth(true)} className="text-blue-500 hover:underline">Edit</button>
            </div>
        )}
    </div>
);

export default ToothDetails;
