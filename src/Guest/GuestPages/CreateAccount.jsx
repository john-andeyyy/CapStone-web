import React, { useEffect, useState } from 'react';

export default function CreateAccount() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [age, setAge] = useState('');
    const [address, setAddress] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [customGender, setCustomGender] = useState('');
    const [showOtherInput, setShowOtherInput] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmpassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [MinChar, setMinChar] = useState(false);
    const [isContainNumber, setContainNumber] = useState(false);
    const [isLowerCase, setLowerCase] = useState(false);
    const [isUpperCase, setUpperCase] = useState(false);
    const [isReady, setIsReady] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        const hasMinChar = password.length >= 8;
        const hasNumber = /\d/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasUpperCase = /[A-Z]/.test(password);

        setMinChar(hasMinChar);
        setContainNumber(hasNumber);
        setLowerCase(hasLowerCase);
        setUpperCase(hasUpperCase);

        setIsReady(hasMinChar && hasNumber && hasLowerCase && hasUpperCase);
    }, [password]);

    const handleGenderChange = (event) => {
        const selectedGender = event.target.value;
        setGender(selectedGender);
        setShowOtherInput(selectedGender === 'other');
    };

    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        // Handle form submission logic here, for example:
        const formData = {
            firstName,
            lastName,
            age,
            address,
            zipCode,
            phone,
            gender: showOtherInput ? customGender : gender,
            email: '', // Replace with actual email value
            password,
            confirmpassword
        };
        console.log(formData);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="max-w-5xl mx-auto p-8 rounded-lg">
                    <div className="text-center font-semibold text-5xl">Create Account</div>

                    <div className='flex justify-between space-x-3'>
                        <label className="form-control w-full max-w-md">
                            <div className="label">
                                <span className="label-text">First Name <span className='text-red-500 text-xl'>*</span></span>
                            </div>
                            <input
                                type="text"
                                placeholder="Type here"
                                required
                                className="input input-bordered w-full max-w-xl"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </label>
                        <label className="form-control w-full max-w-md">
                            <div className="label">
                                <span className="label-text">Last Name <span className='text-red-500 text-xl'>*</span></span>
                            </div>
                            <input
                                type="text"
                                placeholder="Type here"
                                required
                                className="input input-bordered w-full max-w-xl"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </label>
                    </div>

                    <div className='flex justify-between space-x-3'>
                        <label className="form-control w-full max-w-md">
                            <div className="label">
                                <span className="label-text">Age <span className='text-red-500 text-xl'>*</span></span>
                            </div>
                            <input
                                type="number"
                                placeholder="Type here"
                                required
                                className="input input-bordered w-full max-w-xl"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                            />
                        </label>
                        <label className="form-control w-full max-w-md">
                            <div className="label">
                                <span className="label-text">Address <span className='text-red-500 text-xl'>*</span></span>
                            </div>
                            <input
                                type="text"
                                placeholder="Type here"
                                required
                                className="input input-bordered w-full max-w-xl"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </label>
                        <label className="form-control w-full max-w-md">
                            <div className="label">
                                <span className="label-text">Zip Code <span className='text-red-500 text-xl'>*</span></span>
                            </div>
                            <input
                                type="number"
                                placeholder="Type here"
                                required
                                className="input input-bordered w-full max-w-xl"
                                value={zipCode}
                                onChange={(e) => setZipCode(e.target.value)}
                            />
                        </label>
                    </div>

                    <div className='flex justify-between space-x-3'>
                        <label className="form-control w-full max-w-md">
                            <div className="label">
                                <span className="label-text">Phone <span className='text-red-500 text-xl'>*</span></span>
                            </div>
                            <input
                                type="number"
                                placeholder="Type here"
                                required
                                className="input input-bordered w-full max-w-xl"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </label>
                        <label className="form-control w-full max-w-md">
                            <div className="label">
                                <span className="label-text">Gender <span className="text-red-500 text-xl">*</span></span>
                            </div>
                            <select
                                required
                                className="input input-bordered w-full max-w-xl"
                                value={gender}
                                onChange={handleGenderChange}
                            >
                                <option value="" disabled>Select your gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                            {showOtherInput && (
                                <input
                                    type="text"
                                    placeholder="Please specify"
                                    className="input input-bordered w-full max-w-xl mt-2"
                                    value={customGender}
                                    onChange={(e) => setCustomGender(e.target.value)}
                                />
                            )}
                        </label>
                    </div>

                    <label className="form-control w-full max-w-md">
                        <div className="label">
                            <span className="label-text">Email <span className='text-red-500 text-xl'>*</span></span>
                        </div>
                        <input
                            type="email"
                            placeholder="Type here"
                            required
                            className="input input-bordered w-full max-w-xl"
                        />
                    </label>

                    <div className=' flex flex-col items-center justify-center text-center mx-auto py-5'>
                        <label className="form-control w-full max-w-md">
                            <div className="label">
                                <span className="label-text">Password <span className='text-red-500 text-xl'>*</span></span>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Type here"
                                    required
                                    className="input input-bordered w-full max-w-xl pr-10"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="off"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 3a7 7 0 00-7 7c0 2.657 1.343 4.97 3.465 6.32.131.09.275.16.426.23a2.2 2.2 0 01-.273-.105A9.068 9.068 0 013 10a9 9 0 0114 0c0 1.478-.382 2.87-1.048 4.08-.104.195-.222.386-.35.568a7 7 0 00-5.602-9.648A1.85 1.85 0 0110 3z" />
                                            <path d="M10 6a4 4 0 100 8 4 4 0 000-8zm0 2a2 2 0 110 4 2 2 0 010-4z" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 3a7 7 0 00-7 7c0 1.306.309 2.539.852 3.62l1.368-1.367a3 3 0 014.84 0l1.05 1.05c.405-.177.84-.275 1.29-.275A5 5 0 0010 8c-1.306 0-2.539.309-3.62.852l-.365-.365A5 5 0 0110 6a5 5 0 015 5 5 5 0 01-5 5c-.45 0-.885-.098-1.29-.275l1.05-1.05a3 3 0 014.84 0l1.368 1.368A6.965 6.965 0 0017 10a7 7 0 00-7-7zm5.832 8.18a7.036 7.036 0 00-1.26-1.26 7.03 7.03 0 00-1.368 1.368A7.036 7.036 0 0015.832 10z" />
                                            <path d="M2.293 2.293a1 1 0 011.414 0l14 14a1 1 0 01-1.414 1.414l-14-14a1 1 0 010-1.414z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </label>

                        <div className="flex flex-col items-start w-full max-w-md">
                            <div className="flex items-center text-sm space-x-2 mt-2">
                                <span className={`material-symbols-outlined ${MinChar ? "text-green-500" : "text-red-500"}`}>check_circle</span>
                                <span>Minimum of 8 Characters</span>
                            </div>
                            <div className="flex items-center text-sm space-x-2">
                                <span className={`material-symbols-outlined ${isContainNumber ? "text-green-500" : "text-red-500"}`}>check_circle</span>
                                <span>Contain a Number</span>
                            </div>
                            <div className="flex items-center text-sm space-x-2">
                                <span className={`material-symbols-outlined ${isLowerCase ? "text-green-500" : "text-red-500"}`}>check_circle</span>
                                <span>Contain a Lowercase</span>
                            </div>
                            <div className="flex items-center text-sm space-x-2 mb-2">
                                <span className={`material-symbols-outlined ${isUpperCase ? "text-green-500" : "text-red-500"}`}>check_circle</span>
                                <span>Contain an Uppercase</span>
                            </div>
                        </div>

                        <label className="form-control w-full max-w-md">
                            <div className="label">
                                <span className="label-text">Confirm Password <span className='text-red-500 text-xl'>*</span></span>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Type here"
                                    required
                                    className="input input-bordered w-full max-w-xl pr-10"
                                    value={confirmpassword}
                                    onChange={(e) => setConfirmpassword(e.target.value)}
                                    autoComplete="off"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 3a7 7 0 00-7 7c0 2.657 1.343 4.97 3.465 6.32.131.09.275.16.426.23a2.2 2.2 0 01-.273-.105A9.068 9.068 0 013 10a9 9 0 0114 0c0 1.478-.382 2.87-1.048 4.08-.104.195-.222.386-.35.568a7 7 0 00-5.602-9.648A1.85 1.85 0 0110 3z" />
                                            <path d="M10 6a4 4 0 100 8 4 4 0 000-8zm0 2a2 2 0 110 4 2 2 0 010-4z" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 3a7 7 0 00-7 7c0 1.306.309 2.539.852 3.62l1.368-1.367a3 3 0 014.84 0l1.05 1.05c.405-.177.84-.275 1.29-.275A5 5 0 0010 8c-1.306 0-2.539.309-3.62.852l-.365-.365A5 5 0 0110 6a5 5 0 015 5 5 5 0 01-5 5c-.45 0-.885-.098-1.29-.275l1.05-1.05a3 3 0 014.84 0l1.368 1.368A6.965 6.965 0 0017 10a7 7 0 00-7-7zm5.832 8.18a7.036 7.036 0 00-1.26-1.26 7.03 7.03 0 00-1.368 1.368A7.036 7.036 0 0015.832 10z" />
                                            <path d="M2.293 2.293a1 1 0 011.414 0l14 14a1 1 0 01-1.414 1.414l-14-14a1 1 0 010-1.414z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </label>

                        <div className="text-center pt-6">
                            <button
                                type="submit" // Changed to type="submit"
                                className={`btn ${!isReady ? "text-red-500 btn-disabled" : "btn-success"} w-full max-w-xl`}
                            >
                                Submit
                            </button>
                        </div>
                    </div>

                </div>
            </form>
        </div>
    );
}
