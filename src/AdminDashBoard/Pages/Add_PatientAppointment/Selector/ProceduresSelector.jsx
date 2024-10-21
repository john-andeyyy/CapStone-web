import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Baseurl = import.meta.env.VITE_BASEURL;

export default function ProceduresSelector({ onselectprocedures, isSubmited }) {
    const [procedurelist, setProcedureList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProcedures, setSelectedProcedures] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);


    useEffect(() => {
        if (isSubmited) {
            setSelectedProcedures(''); 
            onselectprocedures(null); 
            setSearchTerm('')
        }
    }, [isSubmited, onselectprocedures]);



    useEffect(() => {
        axios.get(`${Baseurl}/Procedure/names`)
            .then((res) => {
                const tempData = res.data;
                const data = tempData
                    .filter((pro) => pro.available === true)
                    .sort((a, b) => a.Procedure_name.localeCompare(b.Procedure_name));
                setProcedureList(data);
            })
            .catch((err) => {
                setError(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // Disable body scrolling when modal is open
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isModalOpen]);

    // Handle search input
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Handle checkbox selection for procedures
    const handleCheckboxChange = (procedure) => {
        setSelectedProcedures((prevSelected) => {
            if (prevSelected.includes(procedure)) {
                return prevSelected.filter(p => p !== procedure);
            } else {
                return [...prevSelected, procedure];
            }
        });
    };

    // Filter procedures based on the search term
    const filteredProcedures = procedurelist.filter((pro) =>
        pro.Procedure_name && pro.Procedure_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='p-4'>
            <button
                className="bg-blue-500 px-4 py-2 rounded"
                onClick={() => setIsModalOpen(true)}
            >
                Select Procedures
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
                    <div className="bg-[#C6E4DA] rounded-lg shadow-lg p-6 w-96">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-medium text-black">Select Procedures</h2>
                            <button
                                className="text-gray-600 hover:text-gray-800"
                                onClick={() => setIsModalOpen(false)}
                            >
                                &times;
                            </button>
                        </div>

                        <label htmlFor="procedure-search" className="block text-gray-700 mt-4">Search procedure:</label>
                        <input
                            type="text"
                            id="procedure-search"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Search procedure by name"
                            className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                        />

                        <div className="mt-4 max-h-48 overflow-y-auto text-black">
                            {loading ? (
                                <div className="flex justify-center items-center">
                                    <span className="loading loading-spinner loading-lg"></span>
                                </div>
                            ) : (
                                <div className="space-y-2 max-h-48">
                                    {error && (
                                        <p className="text-red-500">Error: {error.message}</p>
                                    )}
                                    {filteredProcedures.length > 0 ? (
                                        filteredProcedures.map((procedure) => (
                                            <div key={procedure._id} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id={procedure._id}
                                                    value={procedure}
                                                    onChange={() => handleCheckboxChange(procedure)}
                                                    className="form-checkbox"
                                                    checked={selectedProcedures.includes(procedure)}
                                                />
                                                <label htmlFor={procedure._id}>{procedure.Procedure_name}</label>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No procedures found</p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Close
                            </button>
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded"
                                onClick={() => {
                                    onselectprocedures(selectedProcedures);
                                    setIsModalOpen(false);
                                }}
                            >
                                Save Procedures
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
