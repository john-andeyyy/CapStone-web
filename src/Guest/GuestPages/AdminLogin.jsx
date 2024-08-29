import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminLogin() {
    const [Username, setUsername] = useState('123');
    const [Password, setPassword] = useState('Password');
    const [error, seterror] = useState('Password');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const database = import.meta.env.VITE_BASEURL;
        console.log(database);

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASEURL}/Admin/auth/login`, {
                Username,
                Password,
            }, {
                withCredentials: true // Correct placement of withCredentials
            });

            if (response.status === 200) {
                localStorage.setItem("Islogin", true);
                localStorage.setItem("Token", response.data.token);
                navigate('/dashboard');
                window.location.reload();
            } else {
                // Handle login failure
                alert(response.data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error.message);
            // Show error message from response or a generic error message
            // alert(error.response?.data?.message || 'An error occurred during login. Please try again.');
            seterror(error.response?.data?.message || 'An error occurred during login. Please try again.');
        }
    };


    return (
        <div className="max-w-5xl mx-auto flex items-center justify-center h-screen">
            <div className="card px-8 py-6 rounded-lg bg-base-200 w-72">
                <h1 className="text-center font-bold text-3xl text-white">Login Admin</h1>
                <h1 className="text-center font-bold py-4 text-xl text-red-600">{error}</h1>
                <form className="pb-6" onSubmit={handleSubmit}>
                    <input
                        className="p-2 my-2 rounded w-full focus:outline-blue-600"
                        placeholder="Username"
                        type="text"
                        value={Username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        className="p-2 my-2 rounded w-full focus:outline-blue-600"
                        placeholder="Password"
                        type="password"
                        value={Password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold p-2 mt-3 rounded w-full" type="submit">Login</button>
                </form>
            </div>
        </div>
    );
}
