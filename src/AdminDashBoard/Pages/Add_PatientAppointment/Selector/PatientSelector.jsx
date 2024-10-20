import { useState, useEffect } from 'react';
import axios from 'axios';

const Baseurl = import.meta.env.VITE_BASEURL;

const PatientSelector = ({ onSelectPatient }) => {
    const [patients, setPatients] = useState([]); // Store the list of patients
    const [loading, setLoading] = useState(true); // Loading state
    const [selectedPatient, setSelectedPatient] = useState(''); // Currently selected patient
    const [searchTerm, setSearchTerm] = useState(''); // Search term for filtering patients

    // Fetch the list of patients
    const fetchPatients = async () => {
        try {
            const response = await axios.get(`${Baseurl}/Patient/patientnameOnly`, { withCredentials: true });
            setPatients(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching patients', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients(); // Fetch patients when component mounts
    }, []);

    const handlePatientChange = (e) => {
        const selectedId = e.target.value; // Get the selected patient ID
        const patientData = patients.find(patient => patient._id === selectedId); // Find the patient data

        setSelectedPatient(selectedId); // Set the selected patient

        // Call the parent's function to handle patient selection
        onSelectPatient(patientData); // Pass the whole patient object
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value); // Update search term state
    };

    // Filter patients based on the search term
    const filteredPatients = patients.filter(patient =>
        `${patient.FirstName} ${patient.LastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4">
            {loading ? (
                <div className="flex justify-center items-center">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            ) : (
                <div className="flex flex-col space-y-2">
                    <label htmlFor="patient-search" className="font-medium text-gray-700">Search Patient</label>
                    <input
                        type="text"
                        id="patient-search"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search by name"
                        className="p-2 border border-gray-300 rounded-md"
                    />
                    <label htmlFor="patient" className="font-medium text-gray-700">Select Patient</label>
                    <select
                        id="patient"
                        value={selectedPatient}
                        onChange={handlePatientChange}
                        className="p-2 border border-gray-300 rounded-md"
                        aria-label="Choose a Patient" // Accessibility label
                    >
                        <option value="" disabled>-- Choose a Patient --</option> {/* Disabled default option */}
                        {filteredPatients.length > 0 ? (
                            filteredPatients.map((patient) => (
                                <option key={patient._id} value={patient._id}>
                                    {`${patient.FirstName} ${patient.LastName}`}
                                </option>
                            ))
                        ) : (
                            <option value="" disabled>No patients found</option> // No patients message
                        )}
                    </select>
                </div>
            )}
        </div>
    );
};

export default PatientSelector;
