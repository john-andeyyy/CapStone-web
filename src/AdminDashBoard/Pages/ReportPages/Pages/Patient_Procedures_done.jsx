import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReportMenu from '../components/ReportMenu';

const PatientProceduresDone = () => {
    const [patients, setPatients] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [proceduresCount, setProceduresCount] = useState([]);
    const [suggestions, setSuggestions] = useState([]); // State for suggestions

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASEURL}/Patient/auth/getAllPatients`, {
                    withCredentials: true,
                });
                setPatients(response.data);
            } catch (error) {
                console.error('Error fetching patients:', error);
                setError('Failed to fetch patients.');
            }
        };

        fetchPatients();
    }, []);

    const getCompletedProceduresCount = async (patientId) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASEURL}/Appointments/AdminUser/appointmentofuser/${patientId}`, {
                withCredentials: true,
            });

            const completedProcedures = response.data.filter(appointment => appointment.Status === 'Completed');
            const procedureCounts = {};

            // Count the completed procedures
            completedProcedures.forEach(appointment => {
                appointment.procedures.forEach(proc => {
                    procedureCounts[proc.Procedure_name] = (procedureCounts[proc.Procedure_name] || 0) + 1;
                });
            });

            return procedureCounts;
        } catch (error) {
            console.error('Error fetching procedures:', error);
            return {}; // Return empty object in case of an error
        }
    };

    const fetchProceduresCounts = async (patientId) => {
        const counts = await getCompletedProceduresCount(patientId);
        setProceduresCount(counts);
    };

    const handlePatientChange = (e) => {
        const patientId = e.target.value;
        const patient = patients.find(p => p.id === patientId);

        if (patient) {
            setSelectedPatient(patient);
            fetchProceduresCounts(patientId);
        } else {
            setSelectedPatient(null);
            setProceduresCount({});
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        // Filter suggestions based on the search term
        if (value) {
            const filtered = patients.filter(patient =>
                `${patient.FirstName} ${patient.LastName}`.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (patient) => {
        setSelectedPatient(patient);
        setSearchTerm(`${patient.FirstName} ${patient.LastName}`); // Update search term
        setSuggestions([]); // Clear suggestions
        fetchProceduresCounts(patient.id); // Fetch procedures count for the selected patient
    };

    if (error) {
        return <div className="text-red-600">{error}</div>;
    }

    return (
        <div className="">
            <ReportMenu />
            <div className=" rounded-lg shadow-md">
                <div className='flex flex-col lg:flex-row justify-between items-center mb-4'>
                    <h1 className="text-2xl font-bold text-green-400 p-4">Patient Procedures Done</h1>
                    <div className="relative mr-5 mt-3">
                        {/* Search Input */}
                        <input
                            type="text"
                            placeholder="Search Patients..."
                            className="border rounded px-2 py-1 mb-4 w-full"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>

                {/* Suggestions List */}
                {suggestions.length > 0 && (
                    <ul className="border rounded shadow-lg bg-white max-h-40 overflow-auto z-10 absolute">
                        {suggestions.map(patient => (
                            <li
                                key={patient.id}
                                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                onClick={() => handleSuggestionClick(patient)}
                            >
                                {`${patient.FirstName} ${patient.LastName}`}
                            </li>
                        ))}
                    </ul>
                )}

                {/* Patient Dropdown */}
                <div className='grid grid-cols-2 gap-4'>
                    <div className="flex flex-col">
                        <label className="block mb-2 mt-2">
                            Select Patient:
                            <select
                                className="ml-10 border rounded px-2 py-1 mb-4"
                                value={selectedPatient ? selectedPatient.id : ''}
                                onChange={handlePatientChange}
                            >
                                <option value="">--Select a patient--</option>
                                {patients.map(patient => (
                                    <option key={patient.id} value={patient.id}>
                                        {`${patient.FirstName} ${patient.LastName}`}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                </div>

                {selectedPatient && (
                    <div>
                        <h2 className="text-xl font-bold mb-2">{`Procedures for ${selectedPatient.FirstName} ${selectedPatient.LastName}`}</h2>
                        <table className="min-w-full border border-gray-300">
                            <thead>
                                <tr className="bg-accent">
                                    <th className="border px-4 py-2">Procedure Name</th>
                                    <th className="border px-4 py-2">Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(proceduresCount).map(([procedureName, count]) => (
                                    <tr key={procedureName}>
                                        <td className="border px-4 py-2">{procedureName}</td>
                                        <td className="border px-4 py-2">{count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientProceduresDone;
