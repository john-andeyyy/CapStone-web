import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminLogin() {
    const [Username, setUsername] = useState('admin123');
    const [Password, setPassword] = useState('admin123');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Add loading state
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const database = import.meta.env.VITE_BASEURL;
        console.log(database);

        setLoading(true); // Set loading to true when request starts
        setError(''); // Clear any previous error messages

        try {
            const response = await axios.post(`${database}/Admin/auth/login`, {
                Username,
                Password,
            }, {
                withCredentials: true
            });

            if (response.status === 200) {
                localStorage.setItem("Islogin", true);
                localStorage.setItem("Token", response.data.token);
                localStorage.setItem("expiresin", response.data.expiresIn);

                navigate('/dashboard');
                window.location.reload();
            } else {
                setError(response.data.message || 'Login failed');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            console.warn('Login error:', errorMessage);
            setError(errorMessage);
        } finally {
            setLoading(false); // Set loading to false when request ends
        }
    };

    return (
        <div className="max-w-5xl mx-auto flex items-center justify-center h-screen">
            <div className="card px-8 py-6 rounded-lg bg-base-200 w-72">
                <h1 className="text-center font-bold text-3xl text-white pb-4">Login Admin</h1>
                {error && <h1 className="text-center font-bold py-4 text-xl text-red-600">{error}</h1>}
                <h1>both admin123</h1>
                <form className="pb-6" onSubmit={handleSubmit}>
                    <input
                        className="p-2 my-2 rounded w-full focus:outline-blue-600"
                        placeholder="Username"
                        type="text"
                        value={Username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={loading} 
                    />
                    <input
                        className="p-2 my-2 rounded w-full focus:outline-blue-600"
                        placeholder="Password"
                        type="password"
                        value={Password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading} // Disable input while loading
                    />
                    <button
                        className="bg-blue-600 hover:bg-blue-500 text-white font-semibold p-2 mt-3 rounded w-full"
                        type="submit"
                        disabled={loading} // Disable button while loading
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}
