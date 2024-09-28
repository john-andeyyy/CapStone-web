import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { showToast } from '../../AdminDashBoard/Components/ToastNotification';

export default function AdminLogin() {
    const [Username, setUsername] = useState('admin');
    const [Password, setPassword] = useState('admin');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const database = import.meta.env.VITE_BASEURL;
        console.log(database);

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

                showToast('info', 'Login successful!');

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
        <div className="flex flex-col items-center justify-center h-screen ">
            <div className="w-full max-w-sm bg-secondary rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Admin</h2>
                {error && <h1 className="text-center font-bold py-4 text-xl text-red-600">{error}</h1>}
                <form className="flex flex-col" onSubmit={handleSubmit}>
                    <input
                        className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                        placeholder="Username"
                        type="text"
                        value={Username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={loading}
                    />
                    <input
                        className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                        placeholder="Password"
                        type="password"
                        value={Password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                    />
                    <div className="flex items-center justify-between flex-wrap mb-4">
                        <label className="text-sm text-gray-900 cursor-pointer">
                            <input type="checkbox" className="mr-2" />
                            Remember me
                        </label>
                        <a href="#" className="text-sm text-blue-500 hover:underline mb-0.5">Forgot password?</a>
                    </div>
                    <button
                        className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 transition ease-in-out duration-150"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}
