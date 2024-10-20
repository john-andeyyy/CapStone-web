import { useState, useEffect } from 'react';
import axios from 'axios';

const Baseurl = import.meta.env.VITE_BASEURL;

const DentistSelector = ({ onSelectDentist }) => {
    const [dentists, setDentists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDentist, setSelectedDentist] = useState('');

    // Fetch the list of dentists
    const fetchDentists = async () => {
        try {
            const response = await axios.get(`${Baseurl}/dentist/dentistnames`);
            setDentists(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dentists:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDentists();
    }, []);

    const handleDentistChange = (e) => {
        const selectedId = e.target.value;
        const dentistData = dentists.find(dentist => dentist._id === selectedId); // Find the selected dentist by ID

        setSelectedDentist(selectedId);

        // Call the parent's function to handle dentist selection
        onSelectDentist(dentistData); // Pass the whole dentist object
    };

    return (
        <div className="p-4">
            {loading ? (
                <div className="flex justify-center items-center">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            ) : (
                <div className="flex flex-col space-y-2">
                    <label htmlFor="dentist" className="font-medium text-gray-700">Select Dentist</label>
                    <select
                        id="dentist"
                        value={selectedDentist}
                        onChange={handleDentistChange}
                        className="p-2 border border-gray-300 rounded-md"
                    >
                        <option value="">-- Choose a Dentist --</option>
                        {dentists.map((dentist) => (
                            <option key={dentist._id} value={dentist._id}>
                                {`${dentist.FirstName} ${dentist.LastName}`}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
};

export default DentistSelector;
