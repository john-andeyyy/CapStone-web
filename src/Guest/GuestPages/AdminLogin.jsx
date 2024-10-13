import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { showToast } from '../../AdminDashBoard/Components/ToastNotification';
// showToast('success', 'Login successful!');

export default function AdminLogin() {
    const [Username, setUsername] = useState('admin');
    const [Password, setPassword] = useState('admin');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const database = import.meta.env.VITE_BASEURL;

        setLoading(true);
        setError('');

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
                const currentTime = new Date().getTime();
                localStorage.setItem('lastActiveTime', currentTime);

                showToast('success', 'Login successful!');

                setTimeout(() => {
                    navigate('/dashboard');
                    window.location.reload();
                }, 1000);
            } else {
                setError(response.data.message || 'Login failed');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            console.warn('Login error:', errorMessage);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen ">
            <div className="w-full max-w-sm bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">Admin Login</h2>
                {error && <h1 className="text-center font-bold py-2 text-lg text-red-600">{error}</h1>}
                <form className="flex flex-col" onSubmit={handleSubmit}>
                    <label className="form-control w-full mb-4">
                        <span className="label-text text-green-600">Username/Email:</span>
                        <input
                            className="bg-gray-100 text-gray-900 border border-gray-300 rounded-md p-2 mt-1 focus:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition ease-in-out duration-150"
                            placeholder="Enter your username or email"
                            type="text"
                            value={Username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            disabled={loading}
                            
                        />
                    </label>
                    <label className="form-control w-full mb-4">
                        <span className="label-text text-green-600">Password:</span>
                        <input
                            className="bg-gray-100 text-gray-900 border border-gray-300 rounded-md p-2 mt-1 focus:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition ease-in-out duration-150"
                            placeholder="Enter your password"
                            type="password"
                            value={Password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </label>
                    <button
                        className={`bg-green-600 text-white font-bold py-2 rounded-md mt-4 hover:bg-green-700 transition ease-in-out duration-150 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <Link to={`/Forget_pass`} className="text-green-600 hover:text-green-700 transition duration-150">
                        Forget Password?
                    </Link>
                </div>
            </div>
        </div>
    );
}
