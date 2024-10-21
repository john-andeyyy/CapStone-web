import React, { useState } from 'react';
import axios from 'axios';

const AddPatientModal = ({ isOpen, onClose, onPatientAdded }) => {
    const [formData, setFormData] = useState({
        FirstName: '',
        LastName: '',
        MiddleName: '',
        Email: '',
        PhoneNumber: '',
        Address: '',
        Gender: '',
        Age: '',
        Zipcode: '',
        CivilStatus: '',
    });

    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        // Clear any existing error for the field
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '',
        }));
        setSubmitError('');
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.FirstName) newErrors.FirstName = 'First name is required.';
        if (!formData.LastName) newErrors.LastName = 'Last name is required.';
        if (!formData.Email) {
            newErrors.Email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(formData.Email)) {
            newErrors.Email = 'Email is invalid.';
        }
        if (!formData.PhoneNumber) newErrors.PhoneNumber = 'Phone number is required.';
        if (formData.PhoneNumber && !/^\d{11}$/.test(formData.PhoneNumber)) {
            newErrors.PhoneNumber = 'Phone number must be 11 digits.';
        }
        if (!formData.Age) newErrors.Age = 'Age is required.';
        if (formData.Age && isNaN(formData.Age)) {
            newErrors.Age = 'Age must be a number.';
        }
        if (!formData.Zipcode) newErrors.Zipcode = 'Zipcode is required.';
        if (!formData.CivilStatus) newErrors.CivilStatus = 'Civil status is required.';
        if (!formData.Gender) newErrors.Gender = 'Gender is required.';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validateForm();

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        const Baseurl = import.meta.env.VITE_BASEURL;

        setIsLoading(true); // Start loading

        try {
            const response = await axios.post(`${Baseurl}/Patient/auth/WalkingAccount`, formData);
            console.log('Patient added:', response.data);
            onPatientAdded();
            onClose();
        } catch (error) {
            if (error.response && error.response.data) {
                setSubmitError(error.response.data.message || 'An unknown error occurred.');
            } else {
                setSubmitError('An error occurred. Please try again later.');
            }
            console.error('Error adding patient:', error);
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-4xl">
                <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Add New Patient</h2>
                {submitError && <div className="text-red-500 mb-4 text-center">{submitError}</div>}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.keys(formData).map((key) => (
                        <div key={key} className="flex flex-col">
                            <label className="mb-2 font-medium text-gray-800">{key.replace(/([A-Z])/g, ' $1')}</label>
                            <input
                                type={
                                    key === 'Email' ? 'email' :
                                        key === 'PhoneNumber' ? 'tel' :
                                            key === 'Age' ? 'number' :
                                                'text'
                                }
                                name={key}
                                value={formData[key]}
                                onChange={handleChange}
                                className={`border ${errors[key] ? 'border-red-500' : 'border-gray-300'} p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200`}
                                placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1')}`}
                                required
                            />
                            {errors[key] && <span className="text-red-500 text-sm">{errors[key]}</span>}
                        </div>
                    ))}
                    <div className="flex justify-between mt-8 md:col-span-2 lg:col-span-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 text-gray-800 p-4 rounded-md hover:bg-gray-400 transition duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white p-4 rounded-md hover:bg-blue-700 transition duration-200 flex items-center"
                            disabled={isLoading} // Disable button while loading
                        >
                            {isLoading && <span className="loading loading-bars loading-md mr-2"></span>} {/* Loader */}
                            {isLoading ? 'Loading...' : 'Add Patient'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPatientModal;
