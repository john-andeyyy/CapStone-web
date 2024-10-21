import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MedicalHistoryUpdate = ({ userid, fetchMedicalHistory }) => {
    const BASEURL = import.meta.env.VITE_BASEURL;

    const [patientId, setPatientId] = useState(userid || 'Patient006');
    const [topTeeth, setTopTeeth] = useState([]);
    const [bottomTeeth, setBottomTeeth] = useState([]);
    const [numTopTeeth, setNumTopTeeth] = useState(0);
    const [numBottomTeeth, setNumBottomTeeth] = useState(0);
    const [error, setError] = useState('');
    const [toggleOption, setToggleOption] = useState('auto');
    const [submitTrigger, setSubmitTrigger] = useState(false);

    // Function to generate teeth based on the count
    const handleGenerateTeeth = () => {
        const defaultStatus = '';
        const newTopTeeth = Array.from({ length: numTopTeeth }, (_, i) => ({
            toothNumber: i + 1,
            status: defaultStatus,
            notes: [],
        }));

        const newBottomTeeth = Array.from({ length: numBottomTeeth }, (_, i) => ({
            toothNumber: i + 1,
            status: defaultStatus,
            notes: [],
        }));

        setTopTeeth(newTopTeeth);
        setBottomTeeth(newBottomTeeth);
        setSubmitTrigger(true); // Trigger submission once teeth are generated
    };

    // Submit form data once the teeth are generated
    useEffect(() => {
        if (submitTrigger) {
            handleFormSubmission();
        }
    }, [topTeeth, bottomTeeth]); // Watches the teeth data updates

    // Function to handle form submission
    const handleFormSubmission = async () => {
        const cleanTeethData = (teeth) =>
            teeth.map(({ toothNumber, status, notes }) => ({
                toothNumber,
                status,
                ...(notes.length ? { notes } : {}),
            }));

        const data = {
            patientId,
            topTeeth: cleanTeethData(topTeeth),
            bottomTeeth: cleanTeethData(bottomTeeth),
        };

        try {
            const response = await axios.post(`${BASEURL}/MedicalHistory/Create`, data);
            console.log('Message:', response.data.message);
            setError(response.data.message);
            fetchMedicalHistory()
            closeModal();
        } catch (error) {
            console.error('Error:', error);
            setError(error.response?.data?.message || error.message);
        }
        setSubmitTrigger(false); // Reset trigger after submission
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (toggleOption === 'auto') {
            handleGenerateTeeth(); // Generate teeth in auto mode
        } else {
            setSubmitTrigger(true); // Trigger manual submission
        }
    };

    const closeModal = () => {
        setPatientId(userid || 'Patient006');
        setTopTeeth([]);
        setBottomTeeth([]);
        setNumTopTeeth(0);
        setNumBottomTeeth(0);
        setError('');
        document.getElementById('my_modal_3').close();
    };

    const openModal = () => {
        document.getElementById('my_modal_3').showModal();
    };

    const handleIncrementTop = () => {
        setTopTeeth((prev) => [
            ...prev,
            { toothNumber: prev.length + 1, status: '', notes: [] },
        ]);
    };

    const handleIncrementBottom = () => {
        setBottomTeeth((prev) => [
            ...prev,
            { toothNumber: prev.length + 1, status: '', notes: [] },
        ]);
    };

    return (
        <div className="container mx-auto p-4">
            <button
                className="bg-[#3EB489] hover:bg-[#62A78E] text-white px-4 py-2 mb-4 rounded shadow transition"
                onClick={openModal}
            >
                Create Medical History
            </button>

            <dialog id="my_modal_3" className="modal">
                <div className="modal-box max-w-2xl  bg-[#C6E4DA]">
                    <form method="dialog" onSubmit={handleSubmit} className="space-y-4">
                        {/* Close button */}
                        <button
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                            type="button"
                            onClick={closeModal}
                        >
                            ✕
                        </button>

                        <h1 className="text-2xl font-bold mb-4 text-[#266D53] text-center">Create Medical History Record:</h1>
                        <p className="text-lg text-center text-red-600 font-semibold">{error}</p>

                        {/* <div>
                            <label className="block text-lg mb-1">Patient ID: <span>{patientId}</span></label>
                        </div> */}

                        <div className="flex items-center mb-4">
                            <label className="mr-4">Choose Entry Method:</label>
                            <div className="space-x-4">
                                <label>
                                    <input
                                        type="radio"
                                        value="auto"
                                        checked={toggleOption === 'auto'}
                                        onChange={() => setToggleOption('auto')}
                                    />
                                    Enter Number of Teeth
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value="manual"
                                        checked={toggleOption === 'manual'}
                                        onChange={() => setToggleOption('manual')}
                                    />
                                    Manual
                                </label>

                            </div>
                        </div>

                        {toggleOption === 'manual' ? (
                            <>
                                <div>
                                    <h2 className="text-xl font-semibold mb-2">Top Teeth</h2>
                                    <table className="min-w-full table-auto border-collapse border border-gray-300">
                                        <thead className="bg-green-200 text-black">
                                            <tr>
                                                <th className="border border-gray-300 p-2">Tooth Number</th>
                                                <th className="border border-gray-300 p-2">Status</th>
                                                <th className="border border-gray-300 p-2">Notes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {topTeeth.map((tooth, index) => (
                                                <tr key={tooth.toothNumber}>
                                                    <td className="border border-gray-300 p-2">Tooth #{tooth.toothNumber}</td>
                                                    <td className="border border-gray-300 p-2">
                                                        <input
                                                            type="text"
                                                            placeholder="Status"
                                                            value={tooth.status}
                                                            onChange={(e) => {
                                                                const newTopTeeth = [...topTeeth];
                                                                newTopTeeth[index].status = e.target.value;
                                                                setTopTeeth(newTopTeeth);
                                                            }}
                                                            className="border p-1 rounded focus:outline-none focus:ring focus:ring-blue-300"
                                                            required
                                                        />
                                                    </td>
                                                    <td className="border border-gray-300 p-2">
                                                        <input
                                                            type="text"
                                                            placeholder="Note"
                                                            onChange={(e) => {
                                                                const newTopTeeth = [...topTeeth];
                                                                newTopTeeth[index].notes.push(e.target.value);
                                                                setTopTeeth(newTopTeeth);
                                                            }}
                                                            className="border p-1 rounded focus:outline-none focus:ring focus:ring-blue-300"
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <button
                                        type="button"
                                        onClick={handleIncrementTop}
                                        className="mt-2 bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition"
                                    >
                                        Add Top Tooth
                                    </button>
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold mb-2">Bottom Teeth</h2>
                                    <table className="min-w-full table-auto border-collapse border border-gray-300">
                                        <thead className="bg-green-200 text-black">
                                            <tr>
                                                <th className="border border-gray-300 p-2">Tooth Number</th>
                                                <th className="border border-gray-300 p-2">Status</th>
                                                <th className="border border-gray-300 p-2">Notes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bottomTeeth.map((tooth, index) => (
                                                <tr key={tooth.toothNumber}>
                                                    <td className="border border-gray-300 p-2">Tooth #{tooth.toothNumber}</td>
                                                    <td className="border border-gray-300 p-2">
                                                        <input
                                                            type="text"
                                                            placeholder="Status"
                                                            value={tooth.status}
                                                            onChange={(e) => {
                                                                const newBottomTeeth = [...bottomTeeth];
                                                                newBottomTeeth[index].status = e.target.value;
                                                                setBottomTeeth(newBottomTeeth);
                                                            }}
                                                            className="border p-1 rounded focus:outline-none focus:ring focus:ring-blue-300"
                                                            required
                                                        />
                                                    </td>
                                                    <td className="border border-gray-300 p-2">
                                                        <input
                                                            type="text"
                                                            placeholder="Note"
                                                            onChange={(e) => {
                                                                const newBottomTeeth = [...bottomTeeth];
                                                                newBottomTeeth[index].notes.push(e.target.value);
                                                                setBottomTeeth(newBottomTeeth);
                                                            }}
                                                            className="border p-1 rounded focus:outline-none focus:ring focus:ring-blue-300"
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <button
                                        type="button"
                                        onClick={handleIncrementBottom}
                                        className="mt-2 bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition"
                                    >
                                        Add Bottom Tooth
                                    </button>
                                </div>
                            </>
                        ) : (

                            <div className='grid grid-cols-2 gap-4'>
                                <>
                                    <div>
                                        <label className="block text-lg mb-1">Number of Top Teeth:</label>
                                        <input
                                            type="number"
                                            value={numTopTeeth}
                                            onChange={(e) => setNumTopTeeth(parseInt(e.target.value))}
                                            className="border p-2 w-full rounded focus:outline-none focus:ring focus:ring-blue-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-lg mb-1">Number of Bottom Teeth:</label>
                                        <input
                                            type="number"
                                            value={numBottomTeeth}
                                            onChange={(e) => setNumBottomTeeth(parseInt(e.target.value))}
                                            className="border p-2 w-full rounded focus:outline-none focus:ring focus:ring-blue-300"
                                        />
                                    </div>
                                </>
                            </div>

                        )}

                        <div className="modal-action flex justify-center m-5">
                            <button type="submit" className="bg-[#4285F4] hover:bg-[#0C65F8] p-3 rounded text-black">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    );
};

export default MedicalHistoryUpdate;
